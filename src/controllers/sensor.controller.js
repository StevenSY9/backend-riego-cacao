const SensorModel = require('../models/sensor.model');

const SensorController = {
    recibirDatos: (req, res) => {
        const { humedad, bombaActiva } = req.body;
        
        if (humedad === undefined || bombaActiva === undefined) {
            return res.status(400).json({
                error: 'Faltan datos: humedad y bombaActiva son requeridos'
            });
        }

        SensorModel.guardarLectura(humedad, bombaActiva, (err) => {
            if (err) {
                console.error('Error al guardar:', err);
                return res.status(500).json({ error: 'Error al guardar datos' });
            }
            
            console.log(`Lectura guardada - Humedad: ${humedad}% | Bomba: ${bombaActiva ? 'ON' : 'OFF'}`);
            res.status(201).json({ 
                mensaje: 'Datos recibidos correctamente',
                datos: { humedad, bombaActiva }
            });
        });
    },

    obtenerLecturas: (req, res) => {
        SensorModel.obtenerUltimasLecturas((err, results) => {
            if (err) {
                return res.status(500).json({ error: 'Error al obtener lecturas' });
            }
            res.json(results);
        });
    },

    obtenerUltimaLectura: (req, res) => {
        SensorModel.obtenerUltimaLectura((err, results) => {
            if (err) {
                return res.status(500).json({ error: 'Error al obtener última lectura' });
            }
            res.json(results[0] || {});
        });
    },

    controlarBomba: (req, res) => {
        const { bombaActiva } = req.body;
        
        if (bombaActiva === undefined) {
            return res.status(400).json({ 
                error: 'Se requiere el campo bombaActiva (true/false)' 
            });
        }

        console.log(`Comando desde web: Bomba = ${bombaActiva ? 'ON' : 'OFF'}`);
        
        // Aquí se enviará el comando al ESP32 (se implementará después)
        
        res.json({
            mensaje: 'Comando recibido correctamente',
            comando: { bombaActiva }
        });
    }
};

module.exports = SensorController;