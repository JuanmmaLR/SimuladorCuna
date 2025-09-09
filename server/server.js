const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const socketManager = require('./socketManager');
const path = require('path');
const portManager = require('./portManager'); // Importar el nuevo módulo

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const DESIRED_PORT = process.env.PORT || 3000;
const LOCAL_IP = portManager.getLocalIpAddress(); // Usar la función del módulo

// Configuración para servir archivos estáticos de Ionic/Angular
app.use(express.static(path.join(__dirname, '../www')));

// Rutas (mantener tus rutas existentes)
app.get('/server-status', (req, res) => {
  res.json({
    status: 'online',
    ip: LOCAL_IP,
    port: server.address().port,
    timestamp: new Date()
  });
});

app.get(['/', '/profesor', '/estudiante', '/home'], (req, res) => {
  res.sendFile(path.join(__dirname, '../www/index.html'));
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../www/index.html'));
});

// Configurar Socket.io
socketManager(io);

// Función para iniciar el servidor
async function startServer() {
  try {
    // Verificar si el puerto deseado está disponible
    const portAvailable = await portManager.isPortAvailable(DESIRED_PORT);
    
    if (!portAvailable) {
      console.warn(`⚠️  Puerto ${DESIRED_PORT} no disponible. Buscando puerto alternativo...`);
      const availablePort = await portManager.findAvailablePort(DESIRED_PORT);
      console.log(`🔍 Puerto ${availablePort} disponible. Configurando servidor...`);
      
      // Configurar firewall si es Windows
      if (process.platform === 'win32') {
        const firewallResult = await portManager.openFirewallPort(availablePort);
        console.log(firewallResult);
      }
      
      // Iniciar servidor en el puerto alternativo
      server.listen(availablePort, '0.0.0.0', () => {
        printServerInfo(availablePort);
      });
    } else {
      // Configurar firewall si es Windows
      if (process.platform === 'win32') {
        const firewallResult = await portManager.openFirewallPort(DESIRED_PORT);
        console.log(firewallResult);
      }
      
      // Iniciar servidor en el puerto deseado
      server.listen(DESIRED_PORT, '0.0.0.0', () => {
        printServerInfo(DESIRED_PORT);
      });
    }
  } catch (error) {
    console.error('🚨 Error al iniciar el servidor:', error);
    process.exit(1);
  }
}

// Función para mostrar la información del servidor
function printServerInfo(port) {
  console.log(`
  ================================================
  Servidor escuchando en:
  - Local:    http://localhost:${port}
  - Red:      http://${LOCAL_IP}:${port}
  - Rutas disponibles:
    * /profesor
    * /estudiante
    * /home
    * /estudiante-sso
  ================================================
  `);
}

// Iniciar el servidor
startServer();

// Manejo de errores (mantener tu manejo existente)
process.on('uncaughtException', (err) => {
  console.error('⚠️ Error no capturado:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('⚠️ Promise rechazada:', promise, 'Razón:', reason);
});

// Exportar para testing
module.exports = { app, server, io };