const mariadb = require('mariadb');

const poolConfig = {
    host: '127.0.0.1',          // ← usar 127.0.0.1 en lugar de 'localhost' (::1)
    user: 'root',
    password: 'Ztklwxc14348',
    database: 'dbClinica_Dental',
    connectionLimit: 10,        // aumentar si es necesario
    acquireTimeout: 300,      // ← 10s en lugar de 300ms
    connectTimeout: 300,
    supportBigNumbers: true,
    bigNumbersStrings: true
};

class DBConnector{
    dbConnector = mariadb.createPool(poolConfig);

    async query(param){
        var conn = await this.dbConnector.getConnection();
        var ret = null;

        await conn.query(param)
        .then( data => {
            ret = data;
            conn.end();
        })
        .catch( err => {
            console.log( err );
            conn.end();
        } );
        return ret;
    }

    async queryWithParams(param, values){
        var conn = await this.dbConnector.getConnection();
        var ret = null;

        await conn.query(param, values)
        .then( data => {
            ret = data;
            conn.end();
        })
        .catch( err => {
            console.log( err );
            conn.end();
        } );
        return ret;
    }
}

module.exports = new DBConnector();