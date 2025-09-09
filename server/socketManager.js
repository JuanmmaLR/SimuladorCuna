const variable = require('./variable');
const monitor = require('./monitor');

const activeConnections = new Map(); // Mapa de conexiones activas

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log(`[CONEXION] Nuevo cliente conectado: ${socket.id}`);
    monitor.logConnection(socket.id, 'connection', 'system');

    // Heartbeat para mantener conexión activa
    const heartbeatInterval = setInterval(() => {
      socket.emit('server-ping', { timestamp: Date.now() });
    }, 45000); // 45 segundos

    socket.on('client-pong', () => {
      // Actualizar última actividad si es necesario
    });

    // Obtener lista de estudiantes conectados
    socket.on('get-connected-students', (code, callback) => {
      const connection = activeConnections.get(code);
      if (connection && connection.type === 'profesor') {
        const students = Array.from(connection.connectedStudents.keys());
        callback(students);
      } else {
        callback([]);
      }
    });

    socket.on('remote-lock', (data) => {
      const { code, lockStatus } = data;
      const connection = activeConnections.get(code);
      
      if (connection && connection.type === 'profesor') {
        // Enviar a todos los estudiantes de esta sesión
        io.to(code).emit('update-remote-lock', { lockStatus });
      }
    });

    // ==================== CONEXIÓN PROFESOR ====================
    socket.on('profesor-connect', (code) => {
      try {
        if (!code || code.length !== 7) {
          console.error(`[ERROR] Código inválido: ${code}`);
          return socket.emit('connection-error', { message: 'Código debe tener 7 caracteres' });
        }

        if (activeConnections.has(code)) {
          console.error(`[ERROR] Código ya en uso: ${code}`);
          return socket.emit('connection-error', { message: 'Código ya está en uso' });
        }

        activeConnections.set(code, {
          type: 'profesor',
          socketId: socket.id,
          connectedStudents: new Map(),
          createdAt: new Date()
        });
        
        console.log(`[PROFESOR] Conectado con código: ${code}`);
        monitor.logConnection('profesor', code, socket.id);
        socket.emit('profesor-connected', { 
          success: true, 
          code,
          message: 'Sesión creada correctamente'
        });

      } catch (error) {
        console.error(`[ERROR] En profesor-connect: ${error.message}`);
        monitor.logError('Error en profesor-connect', error);
        socket.emit('connection-error', { 
          message: 'Error al conectar como profesor',
          error: error.message
        });
      }
    });

    // ==================== CONEXIÓN ESTUDIANTE ====================
    socket.on('student-connect', (data) => {
      try {
        const { code, studentId } = data;
        console.log(`[INTENTO] Estudiante ${studentId} intentando conectar a código ${code}`);
        
        if (!code || !studentId) {
          console.error('[ERROR] Faltan código o studentId');
          return socket.emit('connection-error', { message: 'Código y ID de estudiante requeridos' });
        }

        const connection = activeConnections.get(code);
        
        if (!connection) {
          console.log(`[ERROR] Código no encontrado: ${code}`);
          monitor.logEvent(`Intento de conexión con código inválido: ${code}`);
          return socket.emit('invalid-code', { 
            message: 'Código no válido',
            suggestedAction: 'Verifica el código e intenta nuevamente'
          });
        }

        if (connection.type !== 'profesor') {
          console.log(`[ERROR] Código ${code} no es de profesor`);  // Aquí estaba el error - se había cerrado con comilla simple y apóstrofe
          return socket.emit('invalid-code', { message: 'Código no válido' });
        }

        if (!connection.connectedStudents.has(studentId)) {
          connection.connectedStudents.set(studentId, {
            socketId: socket.id,
            connectedAt: new Date(),
            lastDataReceived: null
          });

          socket.join(code);
          console.log(`[CONEXION] Estudiante ${studentId} conectado a ${code}`);
          monitor.logConnection(studentId, code, socket.id);

          socket.emit('connection-success', {
            profesorId: connection.socketId,
            studentId,
            code,
            timestamp: new Date().toISOString()
          });

          io.to(connection.socketId).emit('new-student', {
            studentId,
            socketId: socket.id,
            connectedAt: new Date().toISOString(),
            totalStudents: connection.connectedStudents.size
          });

        } else {
          console.log(`[CONEXION] Estudiante ${studentId} ya estaba conectado, actualizando socket`);
          connection.connectedStudents.set(studentId, {
            ...connection.connectedStudents.get(studentId),
            socketId: socket.id
          });
          socket.emit('connection-success');
        }
      } catch (error) {
        console.error(`[ERROR] En student-connect: ${error.message}`);
        monitor.logError('Error en student-connect', error);
        socket.emit('connection-error', { 
          message: 'Error al conectar como estudiante',
          error: error.message
        });
      }
    });

    // ==================== ENVÍO DE DATOS (MEJORA PARA GRUPOS INDIVIDUALES) ====================
    socket.on('send-data', (data, callback) => {
      try {
        console.log('[DATOS] Recibido:', JSON.stringify(data, null, 2));
        
        const { code, studentId, ...studentData } = data;
        const connection = activeConnections.get(code);

        if (!connection) {
          console.log(`[ERROR] Código ${code} no existe para envío`);
          return callback({ success: false, message: 'Código inválido' });
        }

        // Validación de datos
        const validationResult = variable.validateMedicalData(studentData);
        if (!validationResult.valid) {
          console.log('[ERROR] Datos no válidos:', validationResult.errors);
          monitor.logDataSend(studentId || 'multiple', studentData, false);
          return callback({ 
            success: false,
            message: 'Datos inválidos',
            errors: validationResult.errors
          });
        }

        // Transformación de datos
        const processedData = variable.transformForStudent(studentData);
        console.log('[DATOS] Procesados:', processedData);

        // Envío individual a estudiante
        if (studentId) {
          const studentSocket = connection.connectedStudents.get(studentId);
          if (studentSocket) {
            io.to(studentSocket.socketId).emit('receive-data', processedData);
            monitor.logDataSend(studentId, studentData, true);
            callback({ success: true });
          } else {
            console.log(`[ERROR] Estudiante ${studentId} no encontrado`);
            callback({ success: false, message: 'Estudiante no encontrado' });
          }
        } 
        // Envío masivo a todos los estudiantes del grupo
        else {
          io.to(code).emit('receive-data', processedData);
          connection.connectedStudents.forEach((student, id) => {
            monitor.logDataSend(id, studentData, true);
          });
          callback({ success: true });
        }
      } catch (error) {
        console.error(`[ERROR] En send-data: ${error.message}`);
        monitor.logError('Error en send-data', error);
        callback({ success: false, message: 'Error interno del servidor' });
      }
    });

    // ==================== MANEJO DE DESCONEXIONES ====================
    socket.on('disconnect', () => {
      console.log(`[DESCONEXION] Cliente ${socket.id} desconectado`);
      monitor.logDisconnection(socket.id);
      clearInterval(heartbeatInterval);

      for (const [code, connection] of activeConnections) {
        if (connection.type === 'profesor') {
          for (const [studentId, studentData] of connection.connectedStudents) {
            if (studentData.socketId === socket.id) {
              connection.connectedStudents.delete(studentId);
              io.to(connection.socketId).emit('student-disconnected', {
                studentId,
                socketId: socket.id,
                disconnectedAt: new Date().toISOString()
              });
              console.log(`[DESCONEXION] Estudiante ${studentId} removido de ${code}`);
              break;
            }
          }
        } else if (connection.socketId === socket.id) {
          // Notificar a todos los estudiantes que la sesión terminó
          io.to(code).emit('session-closed', {
            code,
            reason: 'El profesor cerró la sesión',
            timestamp: new Date().toISOString()
          });
          activeConnections.delete(code);
          console.log(`[DESCONEXION] Profesor removido, sesión ${code} cerrada`);
        }
      }
    });

    // Manejo de errores
    socket.on('error', (error) => {
      console.error(`[SOCKET_ERROR] ${socket.id}:`, error);
      monitor.logError('Error de socket', error);
    });
  });

  console.log('[SERVIDOR] Socket.IO inicializado');
  monitor.logEvent('Servidor Socket.IO listo para conexiones');
};