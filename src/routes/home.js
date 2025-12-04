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
                message: 'Este contacto ya existe.'
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
            message: 'Contacto registrado y correo enviado correctamente.'
        });

    } catch (err) {
        console.error('❌ Error en /addContacto:', err);
        return res.status(500).json({
            success: false,
            message: 'Error al registrar el contacto.'
        });
    }
});

router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/Html', 'login.html'));
});

module.exports = router;