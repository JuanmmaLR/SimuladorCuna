// ... (código existente)

// Manejar conexión de estudiante
socket.on('student-connect', (data) => {
  const { code, studentId } = data;
  const connection = activeConnections.get(code);

  if (connection && connection.type === 'profesor') {
    // Verificar que no esté ya conectado
    if (!connection.connectedStudents.has(studentId)) {
      connection.connectedStudents.add(studentId);
      socket.join(code);
      
      // Notificar al estudiante que la conexión fue exitosa
      socket.emit('connection-success', {
        profesorId: connection.socketId
      });
      
      // Notificar al profesor sobre el nuevo estudiante
      io.to(connection.socketId).emit('new-student', {
        studentId,
        socketId: socket.id
      });
      
      console.log(`Estudiante ${studentId} conectado al código ${code}`);
    } else {
      socket.emit('connection-success'); // Ya estaba conectado
    }
  } else {
    socket.emit('invalid-code');
    console.log(`Código inválido: ${code}`);
  }
});

// ... (resto del código existente)