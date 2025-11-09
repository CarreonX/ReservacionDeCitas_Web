const express = require('express');
const pool = require('../config/db');
const { enviarCorreo } = require('./correos');
const { guardarRegistro } = require('./guardarRegistro');

const router = express.Router();

function obtenerNumeroServicio(textoServicio) {
    const servicios = {
        'Limpieza Dental Profesional': 0,
        'Ortodoncia y Alineadores': 1,
        'Estética Dental': 2,
        'Servicio Personalizado': 3
    };
    return servicios[textoServicio] !== undefined ? servicios[textoServicio] : 3;
}

// ✅ FUNCIÓN MEJORADA PARA MANEJAR CONEXIÓN
async function ejecutarEnBD(callback) {
    let connection;
    try {
        connection = await pool.getConnection();
        console.log('🔗 Conexión obtenida del pool');
        return await callback(connection);
    } catch (error) {
        console.error('❌ Error con BD:', error.message);
        throw error;
    } finally {
        if (connection) {
            await connection.release();
            console.log('🔓 Conexión liberada');
        }
    }
}

router.post('/registro', async (req, res) => {
    const { nombre, email, servicio } = req.body;
    
    console.log('📨 DATOS RECIBIDOS:', { nombre, email, servicio });

    try {
        const servicioNumero = obtenerNumeroServicio(servicio);
        console.log('🔢 Servicio mapeado:', servicio, '→', servicioNumero);

        // ✅ USAR LA NUEVA FUNCIÓN DE CONEXIÓN
        const [rows] = await ejecutarEnBD(async (connection) => {
            return await connection.query('CALL uspAddContacto(?, ?, ?)', 
                [nombre, email, servicioNumero]);
        });

        console.log('📊 Resultado BD:', rows);
        const resultado = rows[0][0].resultado;

        if (resultado === 1) {
            console.log('✅ Registro exitoso en BD MySQL');
            await enviarCorreo(nombre, email, servicio);
            await guardarRegistro({ nombre, email, servicio });
            
            res.json({
                success: true, 
                message: '✅ Solicitud recibida y registrada en BD. Gracias!'
            });
        } else {
            console.log('⚠️ Contacto ya existe en BD');
            res.status(409).json({
                success: false, 
                message: 'El contacto ya existe en nuestros registros.'
            });
        }
    } catch (error) {
        console.error('❌ ERROR BD:', error.message);
        
        // FALLBACK - Siempre guardar en archivo y enviar correo
        try {
            console.log('🔄 Usando fallback (archivo local)...');
            const registroGuardado = await guardarRegistro({ nombre, email, servicio });
            await enviarCorreo(nombre, email, servicio);
            
            console.log('💾 Registro guardado localmente:', registroGuardado.id);
            
            res.json({
                success: true,
                message: '✅ Solicitud recibida (guardada localmente). Gracias!'
            });
        } catch (fallbackError) {
            console.error('❌ ERROR EN FALLBACK:', fallbackError);
            res.status(500).json({
                success: false, 
                message: 'Error en el servidor'
            });
        }
    }
});

module.exports = router;