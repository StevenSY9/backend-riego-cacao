const connection = require('../conf/database');

const SensorModel = {
    guardarLectura: (humedad, bombaActiva, callback) => {
        const sql = `
            INSERT INTO lecturas (humedad, bomba_activa, timestamp) 
            VALUES (?, ?, NOW())
        `;
        connection.query(sql, [humedad, bombaActiva], callback);
    },

    obtenerUltimasLecturas: (callback) => {
        const sql = `
            SELECT * FROM lecturas 
            ORDER BY timestamp DESC 
            LIMIT 50
        `;
        connection.query(sql, callback);
    },

    obtenerUltimaLectura: (callback) => {
        const sql = `
            SELECT * FROM lecturas 
            ORDER BY timestamp DESC 
            LIMIT 1
        `;
        connection.query(sql, callback);
    }
};

module.exports = SensorModel;