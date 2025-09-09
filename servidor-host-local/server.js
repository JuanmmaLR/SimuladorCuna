const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');
const os = require('os');

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: { origin: "*" }
});

// Middleware
app.use(cors());
app.use(express.json());

// Obtener IP local
function getLocalIp() {
  const interfaces = os.networkInterfaces();
  for (let name in interfaces) {
    for (let iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

// Importar y ejecutar el socket manager
require('./socketManager')(io);

// Endpoint de prueba
app.get('/', (req, res) => {
  res.send('Servidor Host activo');
});

// Puerto de escucha
const PORT = 4000;
server.listen(PORT, () => {
  console.log(`🟢 Servidor activo en http://${getLocalIp()}:${PORT}`);
});
