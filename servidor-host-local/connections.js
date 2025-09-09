// Guarda las tablets conectadas en memoria
const conexiones = {};

function agregarConexion(id) {
  conexiones[id] = {
    tempProm: null,
    tempCorp: null,
    oxigeno: null,
    modo: null,
  };
}

function eliminarConexion(id) {
  delete conexiones[id];
}

function obtenerConexiones() {
  return conexiones;
}

module.exports = {
  agregarConexion,
  eliminarConexion,
  obtenerConexiones,
};
