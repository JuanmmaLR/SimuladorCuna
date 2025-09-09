const fs = require('fs');
const path = require('path');

class ServerMonitor {
  constructor() {
    this.connections = new Map();
    this.logFile = path.join(__dirname, 'server.log');
    this.initLogFile();
  }

  initLogFile() {
    try {
      if (!fs.existsSync(this.logFile)) {
        fs.writeFileSync(this.logFile, '==== INICIO DE LOG ====\n');
      }
      this.logEvent('Sistema de logging inicializado');
    } catch (error) {
      console.error('Error al inicializar log file:', error);
    }
  }

  logEvent(message) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] EVENT: ${message}\n`;
    this._writeToLog(logMessage);
    console.log(message);
  }

  logConnection(id, code, socketId) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] CONN: ${id} @ ${code} (${socketId})\n`;
    this._writeToLog(logMessage);
  }

  logDisconnection(id) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] DISCONN: ${id}\n`;
    this._writeToLog(logMessage);
  }

  logDataSend(id, data, success) {
    const timestamp = new Date().toISOString();
    const status = success ? 'SUCCESS' : 'FAILED';
    const logMessage = `[${timestamp}] DATA: ${status} to ${id} - ${JSON.stringify(data)}\n`;
    this._writeToLog(logMessage);
    
    if (!success) {
      console.error(`[DATA ERROR] Envío fallido a ${id}`, data);
    }
  }

  logError(context, error) {
    const timestamp = new Date().toISOString();
    const errorMsg = error.stack || error.message;
    const logMessage = `[${timestamp}] ERROR: ${context}\n${errorMsg}\n`;
    this._writeToLog(logMessage);
    console.error(`[ERROR] ${context}`, error);
  }

  getServerStats() {
    return {
      uptime: process.uptime(),
      connections: this.connections.size,
      lastEvents: this._getLastEvents(10)
    };
  }

  _writeToLog(message) {
    try {
      fs.appendFileSync(this.logFile, message, 'utf8');
    } catch (error) {
      console.error('Error escribiendo en log:', error);
    }
  }

  _getLastEvents(count) {
    try {
      const logContent = fs.readFileSync(this.logFile, 'utf8');
      return logContent.split('\n')
        .filter(line => line.trim())
        .slice(-count)
        .reverse();
    } catch (error) {
      return [`Error leyendo log: ${error.message}`];
    }
  }
}

module.exports = new ServerMonitor();