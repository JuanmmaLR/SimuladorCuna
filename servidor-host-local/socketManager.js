const {
    agregarConexion,
    eliminarConexion,
    obtenerConexiones,
  } = require('./connections');
  
  module.exports = function(io) {
    io.on('connection', (socket) => {
      console.log('🔗 Tablet conectada:', socket.id);
      agregarConexion(socket.id);
  
      // Enviar confirmación al cliente
      socket.emit('host-conectado', { id: socket.id });
  
      // Escuchar datos del estudiante
      socket.on('datos-tablet', (datos) => {
        console.log(`📨 Datos recibidos de ${socket.id}:`, datos);
      });
  
      // Manejar desconexión
      socket.on('disconnect', () => {
        console.log('❌ Tablet desconectada:', socket.id);
        eliminarConexion(socket.id);
      });
    });
  };
  