const express = require('express');
const pool = require('../config/db');
const { enviarCorreo } = require('./correos');
const { guardarRegistro } = require('./guardarRegistro');
const path = require('path');

const router = express.Router();

console.log('🔍 Pool importado:', typeof pool, pool ? '✅ Existe' : '❌ Undefined');

// Función para probar la conexión
async function probarConexionBD() {
    try {
        const connection = await pool.getConnection();
        console.log('✅ Conexión a BD exitosa');
        connection.release();
        return true;
    } catch (error) {
        console.error('❌ Error de conexión a BD:', error.message);
        return false;
    }
}

// Llamar la función al cargar el módulo
probarConexionBD();

// ✅ FUNCIÓN PARA MAPEAR SERVICIO A NÚMERO
function obtenerNumeroServicio(textoServicio) {
    const servicios = {
        'Limpieza Dental Profesional': 0,
        'Ortodoncia y Alineadores': 1,
        'Estética Dental': 2,
        'Servicio Personalizado': 3
    };
    return servicios[textoServicio] !== undefined ? servicios[textoServicio] : 3;
}

router.post('/registro', async (req, res) => {
    const { nombre, email, servicio } = req.body;
    
    console.log('📨 DATOS RECIBIDOS:', { nombre, email, servicio });

    try {
        // ✅ MAPEAR SERVICIO A NÚMERO
        const servicioNumero = obtenerNumeroServicio(servicio);
        console.log('🔢 Servicio mapeado:', servicio, '→', servicioNumero);

        // ✅ EJECUTAR STORED PROCEDURE
        const [rows] = await pool.query('CALL uspAddContacto(?, ?, ?)', 
            [nombre, email, servicioNumero]);

        console.log('📊 Resultado BD:', rows);
        const resultado = rows[0][0].resultado;

        if (resultado === 1) {
            await enviarCorreo(nombre, email, servicio);
            await guardarRegistro({ nombre, email, servicio });
            
            res.json({
                success: true, 
                message: '✅ Solicitud recibida. Gracias, te contactaremos pronto.'
            });
        } else {
            res.status(409).json({
                success: false, 
                message: 'El contacto ya existe en nuestros registros.'
            });
        }
    } catch (error) {
        console.error('❌ ERROR BD:', error.message);
        
        // FALLBACK
        try {
            await guardarRegistro({ nombre, email, servicio });
            await enviarCorreo(nombre, email, servicio);
            
            res.json({
                success: true,
                message: '✅ Solicitud recibida (guardada localmente). Gracias!'
            });
        } catch (fallbackError) {
            res.status(500).json({
                success: false, 
                message: 'Error en el servidor'
            });
        }
    }
});

module.exports = router;