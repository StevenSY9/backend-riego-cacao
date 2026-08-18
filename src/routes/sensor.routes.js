const express = require('express');
const router = express.Router();
const SensorController = require('../controllers/sensor.controller');
const ControlController = require('../controllers/control.controller');

// POST - Recibir datos del ESP32
router.post('/lectura', SensorController.recibirDatos);

// GET - Obtener últimas 50 lecturas
router.get('/lecturas', SensorController.obtenerLecturas);

// GET - Obtener última lectura
router.get('/ultima', SensorController.obtenerUltimaLectura);

// GET - Consultar el comando de control actual (lo usa el ESP32)
router.get('/control', ControlController.obtenerControl);

// POST - Enviar un comando de control remoto (lo usa el frontend)
router.post('/control', ControlController.actualizarControl);

module.exports = router;