const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: {
        rejectUnauthorized: false  // Permite certificados autofirmados
    }
});

connection.connect((err) => {
    if (err) {
        console.error(' Error al conectar a MySQL (Aiven):', err.message);
        return;
    }
    console.log(' Conectado a MySQL en Aiven');
});

module.exports = connection;