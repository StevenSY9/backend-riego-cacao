require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sensorRoutes = require('./src/routes/sensor.routes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/api/sensor', sensorRoutes);

app.post('/api/sensor/control', (req, res) => {
    const { bombaActiva } = req.body;
    
    if (bombaActiva === undefined) {
        return res.status(400).json({ error: 'Se requiere el campo bombaActiva' });
    }
    
    console.log(`Comando recibido desde web: Bomba = ${bombaActiva ? 'ON' : 'OFF'}`);
    
    res.json({
        mensaje: 'Comando recibido correctamente',
        comando: { bombaActiva }
    });
});

// Ruta de bienvenida
app.get('/', (req, res) => {
    res.json({
        mensaje: 'API - Sistema de Riego Inteligente',
        endpoints: {
            'POST /api/sensor/lectura': 'Recibir datos del ESP32',
            'GET /api/sensor/lecturas': 'Obtener historial',
            'GET /api/sensor/ultima': 'Obtener última lectura'
        }
    });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
    console.log(`Endpoint principal: http://localhost:${PORT}/api/sensor/lectura`);
});