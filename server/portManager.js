const net = require('net');
const { exec } = require('child_process');
const os = require('os');

/**
 * Verifica si un puerto está disponible
 * @param {number} port - Puerto a verificar
 * @returns {Promise<boolean>} - True si está disponible, false si está en uso
 */
function isPortAvailable(port) {
  return new Promise((resolve) => {
    const server = net.createServer()
      .once('error', () => resolve(false))
      .once('listening', () => {
        server.close(() => resolve(true));
      })
      .listen(port);
  });
}

/**
 * Intenta abrir un puerto en el firewall (Windows)
 * @param {number} port - Puerto a abrir
 * @returns {Promise<string>} - Mensaje de resultado
 */
function openFirewallPort(port) {
  return new Promise((resolve) => {
    if (process.platform !== 'win32') {
      return resolve('Sistema no Windows, se omite configuración de firewall');
    }

    const ruleName = `Node.js Port ${port}`;
    const command = `netsh advfirewall firewall add rule name="${ruleName}" dir=in action=allow protocol=TCP localport=${port}`;

    exec(command, { windowsHide: true }, (error) => {
      if (error) {
        resolve(`Error al abrir puerto en firewall: ${error.message}`);
      } else {
        resolve(`Puerto ${port} abierto en firewall correctamente`);
      }
    });
  });
}

/**
 * Encuentra un puerto disponible comenzando desde el puerto dado
 * @param {number} startingPort - Puerto inicial a verificar
 * @param {number} maxAttempts - Intentos máximos
 * @returns {Promise<number>} - Puerto disponible
 */
async function findAvailablePort(startingPort, maxAttempts = 10) {
  let port = startingPort;
  let attempts = 0;

  while (attempts < maxAttempts) {
    const available = await isPortAvailable(port);
    if (available) return port;
    
    port++;
    attempts++;
  }

  throw new Error(`No se encontró puerto disponible después de ${maxAttempts} intentos`);
}

/**
 * Obtiene la IP local automáticamente
 * @returns {string} - Dirección IP local
 */
function getLocalIpAddress() {
  const interfaces = os.networkInterfaces();
  for (const name in interfaces) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return '0.0.0.0';
}

module.exports = {
  isPortAvailable,
  openFirewallPort,
  findAvailablePort,
  getLocalIpAddress
};