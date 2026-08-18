const connection = require('../conf/database');

const ControlModel = {
  obtenerEstado: (callback) => {
    const sql = `
      SELECT
        bomba_activa,
        (manual_expira IS NOT NULL AND manual_expira > NOW()) AS manual_activo
      FROM control_bomba
      WHERE id = 1
    `;
    connection.query(sql, callback);
  },

  // segundosVigencia: cuánto dura el comando manual antes de caducar
  // y devolver el control automático al nodo sensor
  actualizarEstado: (bombaActiva, segundosVigencia, callback) => {
    const sql = `
      UPDATE control_bomba
      SET bomba_activa = ?, manual_expira = DATE_ADD(NOW(), INTERVAL ? SECOND)
      WHERE id = 1
    `;
    connection.query(sql, [bombaActiva, segundosVigencia], callback);
  }
};

module.exports = ControlModel;