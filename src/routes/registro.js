const express = require('express');
const pool = require('../config/db');
const fs = require('fs').promises;
const path = require('path');

// Implementaciones localizadas para no añadir archivos adicionales
async function guardarRegistro({ nombre, email, servicio }) {
    const DATA_DIR = path.join(__dirname, '..', 'data');
    const FILE = path.join(DATA_DIR, 'registros.json');
    await fs.mkdir(DATA_DIR, { recursive: true });
    try {
        await fs.access(FILE);
    } catch {
        await fs.writeFile(FILE, '[]', 'utf8');
    }
    const raw = await fs.readFile(FILE, 'utf8');
    const arr = JSON.parse(raw || '[]');
    const nuevo = {
        id: Date.now(),
        nombre: nombre || null,
        email: email || null,
        servicio: servicio || null,
        fecha: new Date().toISOString()
    };
    arr.push(nuevo);
    await fs.writeFile(FILE, JSON.stringify(arr, null, 2), 'utf8');
    return nuevo;
}

async function enviarCorreo(nombre, email, servicio) {
    // intento de require de nodemailer opcional
    let nodemailer;
    try {
        nodemailer = require('nodemailer');
    } catch {
        console.log('nodemailer no instalado — solo logueando el correo (instala nodemailer para envío real).');
        console.log('Correo (simulado):', { nombre, email, servicio });
        return;
    }

    const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, ADMIN_EMAIL } = process.env;
    if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
        console.log('SMTP no configurado — no se enviará correo. Datos del registro:', { nombre, email, servicio });
        return;
    }

    const transporter = nodemailer.createTransport({
        host: SMTP_HOST,
        port: Number(SMTP_PORT) || 587,
        secure: false,
        auth: { user: SMTP_USER, pass: SMTP_PASS }
    });

    const texto = `Nueva solicitud\n\nNombre: ${nombre}\nEmail: ${email}\nServicio: ${servicio}\nFecha: ${new Date().toISOString()}`;
    await transporter.sendMail({
        from: SMTP_USER,
        to: ADMIN_EMAIL || SMTP_USER,
        subject: 'Nueva solicitud de servicio',
        text: texto,
        replyTo: email || undefined
    });
}

const router = express.Router();

function obtenerNumeroServicio(textoServicio) {
    const servicios = {
        'Limpieza Dental Profesional': 1,
        'Ortodoncia y Alineadores': 2,
        'Estética Dental': 3,
        'Servicio Personalizado': 4
    };
    // Si ya vienen números, retornarlos
    const num = parseInt(textoServicio, 10);
    if (!isNaN(num)) return num;
    return servicios[textoServicio] !== undefined ? servicios[textoServicio] : 4;
}

// Reutilizable: obtiene conexión del pool y ejecuta callback
// async function ejecutarEnBD(callback) {
//     let connection;
//     try {
//         connection = await pool.getConnection();
//         return await callback(connection);
//     } catch (error) {
//         console.error('Error en BD:', error.message);
//         throw error;
//     } finally {
//         if (connection) {
//             await connection.release();
//         }
//     }
// }

router.post('/registro', async (req, res) => {
    const { nombre, email, servicio } = req.body;

    console.log('Datos recibidos en /api/registro:', { nombre, email, servicio });

    try {
        const servicioNumero = obtenerNumeroServicio(servicio);

        const result = await pool.queryWithParams('CALL uspAddContacto(?, ?, ?)', [nombre, email, servicioNumero]);

        // Dependiendo del driver, el resultado puede variar. Intentamos leer un campo esperado.
        const resultado = (result && result[0] && result[0][0] && result[0][0].resultado) || (result && result[0] && result[0].resultado);

        if (resultado === 1) {
            await enviarCorreo(nombre, email, servicio);
            await guardarRegistro({ nombre, email, servicio });
            return res.json({ success: true, message: '✅ Solicitud recibida y registrada en BD. Gracias!' });
        } else {
            return res.status(409).json({ success: false, message: 'El contacto ya existe en nuestros registros.' });
        }
    } catch (error) {
        console.error('ERROR en /api/registro:', error);
        // Fallback: guardar en archivo y enviar correo
        try {
            const registroGuardado = await guardarRegistro({ nombre: req.body.nombre, email: req.body.email, servicio: req.body.servicio });
            await enviarCorreo(req.body.nombre, req.body.email, req.body.servicio);
            return res.json({ success: true, message: '✅ Solicitud recibida (guardada localmente). Gracias!' });
        } catch (fallbackError) {
            console.error('ERROR fallback:', fallbackError);
            return res.status(500).json({ success: false, message: 'Error en el servidor' });
        }
    }
});

module.exports = router;