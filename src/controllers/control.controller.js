const ControlModel = require('../models/control.model');

const SEGUNDOS_VIGENCIA_MANUAL = 10; // el comando manual caduca a los 10 segundos

const ControlController = {
  // GET /api/sensor/control -> el gateway consulta esto en cada ciclo
  obtenerControl: (req, res) => {
    ControlModel.obtenerEstado((err, results) => {
      if (err) {
        console.error('Error al obtener estado del control:', err);
        return res.status(500).json({ error: 'Error al obtener el estado del control' });
      }
      const fila = results[0] || { bomba_activa: 0, manual_activo: 0 };
      res.json({
        bombaActiva: !!fila.bomba_activa,
        manualActivo: !!fila.manual_activo,
      });
    });
  },

  // POST /api/sensor/control -> el frontend envía el comando (encender/apagar)
  actualizarControl: (req, res) => {
    const { bombaActiva } = req.body;

    if (bombaActiva === undefined) {
      return res.status(400).json({ error: 'Falta el campo bombaActiva' });
    }

    ControlModel.actualizarEstado(bombaActiva, SEGUNDOS_VIGENCIA_MANUAL, (err) => {
      if (err) {
        console.error('Error al actualizar el control:', err);
        return res.status(500).json({ error: 'Error al actualizar el control' });
      }
      console.log(`Comando manual recibido: bomba ${bombaActiva ? 'ON' : 'OFF'} (vigente ${SEGUNDOS_VIGENCIA_MANUAL} seg)`);
      res.status(200).json({ mensaje: 'Comando recibido', bombaActiva, vigenteSegundos: SEGUNDOS_VIGENCIA_MANUAL });
    });
  }
};

module.exports = ControlController;