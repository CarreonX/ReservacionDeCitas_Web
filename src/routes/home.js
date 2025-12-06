const DBConnector = require('../config/db.js');
const express = require('express');
const path = require('path');
const router = express.Router();

// 👉 Importamos la función de enviar correos
const { enviarCorreo } = require('./correos.js');



// RUTA PRINCIPAL
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

// 👉 RUTA POST PARA REGISTRAR Y ENVIAR CORREO
router.post('/addContacto', async (req, res) => {
    try {
        const { nombre, email, servicio } = req.body;

        console.log("📩 Datos recibidos:", req.body);

        // 1️⃣ REGISTRAR EN BD
        const result = await DBConnector.queryWithParams(
            'CALL uspAddContacto(?, ?, ?)',
            [nombre, email, servicio]
        );

        console.log("BD result:", result);

        // Extraer valor correcto según tu SP
        let resultado = (result[0] && result[0][0] && result[0][0].resultado)
                     || (result[0] && result[0].resultado)
                     || 1; // fallback

        if (resultado !== 1) {
            return res.status(409).json({
                success: false,
                message: 'Este contacto ya existe. Nos comunicaremos con usted pronto!'
            });
        }

        // 2️⃣ ENVIAR CORREO A ÁREA CORRESPONDIENTE
        try {
            await enviarCorreo(nombre, email, servicio);
        } catch (errorCorreo) {
            console.error("❌ Error enviando correo:", errorCorreo);
        }

        // 3️⃣ RESPUESTA FINAL AL CLIENTE
        return res.json({
            success: true,
            message: 'Contacto registrado nos comunicaremos con usted pronto!'
        });

    } catch (err) {
        console.error('❌ Error en /addContacto:', err);
        return res.status(500).json({
            success: false,
            message: 'Error al registrar el contacto.'
        });
    }
});

router.post( '/login', async (req, res) => {

    try {
        const { usuario, password } = req.body;

        console.log("🔐 Intento de login:", req.body)
        
        const result = await DBConnector.queryWithParams(
            'CALL uspGetPKMedico(?, ?)',
            [usuario, password]
        );

        console.log("Login result:", result);

        const existe = result[0][0]['id_medico'];

        if (existe >= 1) {
            return res.json({
                success: true,
                message: 'Credenciales válidas',
                id_medico: existe
            });
        } else {
            return res.status(401).json({
                success: false,
                message: 'Credenciales no válidas'
            });
        }
    } catch (err) {
        console.error('❌ Error en /login:', err);
        return res.status(500).json({
            success: false,
            message: 'Error al procesar el login.'
        });
    }
} );

router.get('/medico/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const result = await DBConnector.queryWithParams(
            'CALL uspGetMedico(?)',
            [id]
        );

        const medico = result[0][0];

        return res.json({
            success: true,
            medico
        });

    } catch (err) {
        console.error("Error en /medico:", err);
        return res.status(500).json({
            success: false,
            message: "Error al obtener información del médico"
        });
    }
});

router.get('/dashboardMedico/:id_medico', (req, res) => {
    res.sendFile(path.join(__dirname, './public/Html', 'dashboardMedico.html'));
});

router.get('/getCitasMedico/:id_medico', async (req, res) => {
    try {
        const { id_medico } = req.params;

        console.log("📅 Solicitando citas del médico:", id_medico);

        const result = await DBConnector.queryWithParams(
            "CALL uspGetCitasPorMedico(?)",
            [id_medico]
        );

        // FULLCALENDAR NECESITA un arreglo plano de objetos
        const citas = result[0].map(c => ({
            id: c.idx,
            title: c.motivoDeCita, 
            start: new Date( c.fechaCita ), 
            end: new Date( c.fechaCita ),
            timeStart: c.hora,
            extendedProps: {
                estado: c.estado,
                duracion: c.duracion,
                paciente: c.idPaciente, //generar ruta que retorne en nombre del paciente
                nota: c.nota
            }
        }));

        return res.json({
            success: true,
            citas
        });

    } catch (error) {
        console.error("❌ Error en /getCitasMedico:", error);
        res.status(500).json({
            success: false,
            message: "Error al obtener citas."
        });
    }
});

router.get('/actualizarCita/:id', async (req, res) => {
    res.render('actualizarCita', { idMedico: req.params });
});

router.get('/registrarCita/:id_medico', async (req, res) => {
    const id_medico = req.params.id_medico;
    res.render('registrarCita', { idMedico: id_medico });
});

router.post('/registrarCita', async (req, res) => {
    try {
        const {
            duracion,
            estado,
            fechaCita,
            fechaGeneracion,
            hora,
            idMedico,
            idPaciente,
            motivoDeCita,
            nota
        } = req.body;

        await DBConnector.queryWithParams(
            "CALL uspRegistrarCita(?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [
                duracion,
                estado,
                fechaCita,
                fechaGeneracion,
                hora,
                idMedico,
                idPaciente,
                motivoDeCita,
                nota
            ]
        );

        res.redirect(`/dashboardMedico/${idMedico}`);

    } catch (error) {
        console.error("❌ Error al registrar cita:", error);
        res.status(500).send("Error al registrar la cita");
    }
});

module.exports = router;