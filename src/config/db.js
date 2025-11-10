const mariadb = require('mariadb/promise');

const poolConfig = {
    host: '192.168.1.253',
    user: 'root',
    password: 'Ztklwxc14348',
    database: 'dbClinica_Dental',
    connectionLimit: 5,
    acquireTimeout: 10000,
    connectTimeout: 10000,
    
    // ✅ FORZAR PARÁMETROS DE CONEXIÓN
    socketPath: undefined, // Forzar conexión TCP
    port: 3306,           // Puerto explícito
    allowPublicKeyRetrieval: true,
    charset: 'utf8mb4'
};

console.log('🔌 Configurando pool de BD...');

const pool = mariadb.createPool(poolConfig);

// ✅ FUNCIÓN MEJORADA DE VERIFICACIÓN
async function verificarConexion() {
    let connection;
    try {
        console.log('🔄 Intentando conectar a BD desde:', require('os').hostname());
        connection = await pool.getConnection();
        console.log('✅ Conexión a BD exitosa');
        
        // Probar consulta
        const [rows] = await connection.query('SELECT CURRENT_USER() as user, DATABASE() as db');
        console.log('✅ Usuario conectado:', rows[0].user);
        console.log('✅ Base de datos:', rows[0].db);
        
        return true;
    } catch (error) {
        console.error('❌ Error de conexión a BD:', error.message);
        if (error.code === 'ER_ACCESS_DENIED_ERROR') {
            console.error('🔐 PROBLEMA DE PERMISOS:');
            console.error('   - Verificar usuario/contraseña');
            console.error('   - Verificar permisos de host en MySQL');
            console.error('   - Ejecutar: GRANT ALL PRIVILEGES ON dbClinica_Dental.* TO remoto@"%" IDENTIFIED BY "Ztklwxc14348"; FLUSH PRIVILEGES;');
        }
        return false;
    } finally {
        if (connection) {
            await connection.release();
        }
    }
}

verificarConexion();

module.exports = pool;