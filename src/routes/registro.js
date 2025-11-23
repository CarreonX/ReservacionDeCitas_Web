const express = require('express');
const pool = require('../config/db');
const { enviarCorreo } = require('./correos');
const { guardarRegistro } = require('./guardarRegistro');

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
async function ejecutarEnBD(callback) {
    let connection;
    try {
        connection = await pool.getConnection();
        return await callback(connection);
    } catch (error) {
        console.error('Error en BD:', error.message);
        throw error;
    } finally {
        if (connection) {
            await connection.release();
        }
    }
}

router.post('/registro', async (req, res) => {
    const { nombre, email, servicio } = req.body;

    console.log('Datos recibidos en /api/registro:', { nombre, email, servicio });

    try {
        const servicioNumero = obtenerNumeroServicio(servicio);

        const result = await ejecutarEnBD(async (connection) => {
            const [rows] = await connection.query('CALL uspAddContacto(?, ?, ?)', [nombre, email, servicioNumero]);
            return rows;
        });

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