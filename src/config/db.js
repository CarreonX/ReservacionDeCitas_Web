const mariadb = require('mariadb/promise');

const pool = mariadb.createPool({
    host: '192.168.1.253',
    user: 'remoto',
    password: 'Ztklwxc14348',
    database: 'dbClinica_Dental',
    connectionLimit: 5
});


module.exports = pool;