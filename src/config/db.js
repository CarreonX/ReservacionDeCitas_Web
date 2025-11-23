const mariadb = require('mariadb');

const poolConfig = {
    host: 'localhost',
    user: 'remoto',
    password: 'Ztklwxc14348',
    database: 'dbClinica_Dental',
    connectionLimit: 5,
    acquireTimeout: 300,
    connectTimeout: 10000,
    supportBigNumbers: true,
    bigNumbersStrings: true
};

class DBConnector{
    dbConnector = mariadb.createPool(poolConfig);

    async query(param){

        var conn = await this.dbConnector.getConnection();
        var ret = null;

        await conn.query( param )
        .then( data => {
            ret = data;
            conn.end();
        })
        .catch( err => {
            console.error('❌ Error en consulta:', err);
            conn.end();
        } );

        return ret;
    }

    async queryWithParams( param, values ){
        var conn = await this.dbConnector.getConnection();
        var ret = null;

        await conn.query( param, values )
        .then( data => {
            ret = data;
            conn.end();
        })
        .catch( err => {
            console.error('❌ Error en consulta con parámetros:', err);
            conn.end();
        } );
        return ret;
    }
}

module.exports = new DBConnector();