const express = require('express');
const { pool } = require('../config/db'); // ✅ Ruta correcta a config/db.js
const { enviarCorreo } = require('./correos');
const { guardarRegistro } = require('./guardarRegistro');

const router = express.Router();

router.post('/registro', async (req, res) => {
    const { nombre, email, servicio } = req.body;
    console.log('📨 Datos recibidos:', { nombre, email, servicio });

    try {
        // Intentar guardar en MySQL
        const [rows] = await pool.query('CALL uspAddContacto(?, ?, ?)', 
            [nombre, email, servicio]);

        const resultado = rows[0][0].resultado;

        if (resultado === 1) {
            // Éxito en BD - enviar correo y guardar en archivo
            await enviarCorreo(nombre, email, servicio);
            await guardarRegistro({ nombre, email, servicio });
            
            res.json({
                success: true, 
                message: '✅ Solicitud recibida. Gracias, te contactaremos pronto.'
            });
        } else {
            // Contacto ya existe
            res.status(409).json({
                success: false, 
                message: 'El contacto ya existe en nuestros registros.'
            });
        }
    } catch (error) {
        console.error('❌ Error con MySQL:', error);
        
        // FALLBACK: Si falla MySQL, guardar solo en archivo y enviar correo
        try {
            await guardarRegistro({ nombre, email, servicio });
            await enviarCorreo(nombre, email, servicio);
            
            res.json({
                success: true,
                message: '✅ Solicitud recibida (guardada localmente). Gracias!'
            });
        } catch (fallbackError) {
            console.error('❌ Error en fallback:', fallbackError);
            res.status(500).json({
                success: false, 
                message: 'Error en el servidor', 
                error: error.message
            });
        }
    }
});

module.exports = router;