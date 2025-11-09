const mariadb = require('mariadb/promise');

const poolConfig = {
    host: '192.168.1.253',
    user: 'remoto',
    password: 'Ztklwxc14348',
    database: 'dbClinica_Dental',
    connectionLimit: 5,
    acquireTimeout: 60000, // ✅ Aumentar timeout a 60 segundos
    connectTimeout: 30000, // ✅ Timeout de conexión
    timeout: 30000,        // ✅ Timeout general
    reconnect: true,       // ✅ Permitir reconexión
    allowPublicKeyRetrieval: true, // ✅ Para problemas de autenticación
    charset: 'utf8mb4'
};

console.log('🔌 Configurando pool de BD con:', { 
    host: poolConfig.host, 
    database: poolConfig.database,
    user: poolConfig.user 
});

const pool = mariadb.createPool(poolConfig);

// ✅ FUNCIÓN PARA VERIFICAR CONEXIÓN
async function verificarConexion() {
    let connection;
    try {
        console.log('🔄 Intentando conectar a BD...');
        connection = await pool.getConnection();
        console.log('✅ Conexión a BD exitosa');
        
        // Probar una consulta simple
        const [rows] = await connection.query('SELECT 1 as test');
        console.log('✅ Consulta de prueba exitosa:', rows);
        
        return true;
    } catch (error) {
        console.error('❌ Error de conexión a BD:', error.message);
        console.error('📝 Detalles:', error);
        return false;
    } finally {
        if (connection) {
            await connection.release();
            console.log('🔓 Conexión liberada');
        }
    }
}

// Verificar conexión al iniciar
verificarConexion();

module.exports = pool;