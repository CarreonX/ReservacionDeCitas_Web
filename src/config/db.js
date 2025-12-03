const mariadb = require('mariadb');

const poolConfig = {
    host: '127.0.0.1',          // ← usar 127.0.0.1 en lugar de 'localhost' (::1)
    user: 'remoto',
    password: 'Ztklwxc14348',
    database: 'dbClinica_Dental',
    connectionLimit: 10,        // aumentar si es necesario
    acquireTimeout: 10000,      // ← 10s en lugar de 300ms
    connectTimeout: 10000,
    supportBigNumbers: true,
    bigNumbersStrings: true
};

class DBConnector{
    dbConnector = mariadb.createPool(poolConfig);

    async query(param){
        let conn;
        let ret = null;
        try {
            conn = await this.dbConnector.getConnection();
            ret = await conn.query(param);
            return ret;
        } catch (err) {
            console.error('❌ Error en consulta:', err);
            throw err;
        } finally {
            if (conn) {
                try { await conn.release(); } catch (e) { /* fallback */ }
            }
        }
    }

    async queryWithParams(param, values){
        let conn;
        let ret = null;
        try {
            conn = await this.dbConnector.getConnection();
            ret = await conn.query(param, values);
            return ret;
        } catch (err) {
            console.error('❌ Error en consulta con parámetros:', err);
            throw err;
        } finally {
            if (conn) {
                try { await conn.release(); } catch (e) { /* fallback */ }
            }
        }
    }
}

module.exports = new DBConnector();