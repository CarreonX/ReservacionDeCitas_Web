const express = require('express');
const { pool } = require('../config/db');
const { enviarCorreo } = require('./correos');
const { guardarRegistro } = require('./guardarRegistro');

const router = express.Router();

router.post('/registro', async (req, res) => {
    const { nombre, email, servicio } = req.body;
    
    console.log('📨 DATOS RECIBIDOS EN /api/registro:', { nombre, email, servicio });
    console.log('🔍 Tipo de servicio:', typeof servicio, 'Valor:', servicio);

    try {
        // ✅ CONVERTIR servicio a número para el stored procedure
        const servicioNumero = parseInt(servicio);
        console.log('🔢 Servicio convertido a número:', servicioNumero);

        // ✅ VERIFICAR CONEXIÓN A BD PRIMERO
        console.log('🔌 Probando conexión a BD...');
        const connection = await pool.getConnection();
        console.log('✅ Conexión a BD exitosa');
        connection.release();

        // ✅ EJECUTAR STORED PROCEDURE
        console.log('🔄 Ejecutando stored procedure...');
        const [rows] = await pool.query('CALL uspAddContacto(?, ?, ?)', 
            [nombre, email, servicioNumero]);

        console.log('📊 Resultado de BD:', rows);
        console.log('📋 Estructura de rows:', JSON.stringify(rows, null, 2));

        const resultado = rows[0][0].resultado;
        console.log('🎯 Resultado del stored procedure:', resultado);

        if (resultado === 1) {
            console.log('✅ Registro exitoso en BD');
            await enviarCorreo(nombre, email, servicio);
            await guardarRegistro({ nombre, email, servicio });
            
            res.json({
                success: true, 
                message: '✅ Solicitud recibida. Gracias, te contactaremos pronto.'
            });
        } else {
            console.log('⚠️ Contacto ya existe en BD');
            res.status(409).json({
                success: false, 
                message: 'El contacto ya existe en nuestros registros.'
            });
        }
    } catch (error) {
        console.error('❌ ERROR EN REGISTRO:', error);
        console.error('📝 Stack trace:', error.stack);
        
        // FALLBACK: Guardar en archivo y enviar correo aunque falle BD
        try {
            console.log('🔄 Intentando fallback...');
            await guardarRegistro({ nombre, email, servicio });
            await enviarCorreo(nombre, email, servicio);
            
            res.json({
                success: true,
                message: '✅ Solicitud recibida (guardada localmente). Gracias!'
            });
        } catch (fallbackError) {
            console.error('❌ ERROR EN FALLBACK:', fallbackError);
            res.status(500).json({
                success: false, 
                message: 'Error en el servidor', 
                error: error.message
            });
        }
    }
});

module.exports = router;