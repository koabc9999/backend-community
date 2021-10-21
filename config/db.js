const mariadb = require('mariadb');

const db = mariadb.createPool({
    connectionLimit: 10,
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'wjdtjdals132',
    database: 'community'
});

module.exports = db;