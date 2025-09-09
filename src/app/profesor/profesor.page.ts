import { Component, OnInit, OnDestroy } from '@angular/core';
import { 
  IonHeader, IonToolbar, IonTitle, IonContent, IonGrid,
  IonRow, IonCol, IonIcon, IonButton, IonInput, IonItem, IonSelect, 
  IonSelectOption, IonAlert, IonFooter, IonToast 
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { addCircleOutline, wifiOutline, logoIonic, lockClosedOutline, refreshCircleOutline } from 'ionicons/icons';
import { Socket, io } from 'socket.io-client';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-profesor',
  templateUrl: './profesor.page.html',
  styleUrls: ['./profesor.page.scss'],
  standalone: true,
  imports: [
    CommonModule, IonFooter, FormsModule, IonHeader, IonToolbar, IonTitle, IonContent, IonGrid, 
    IonRow, IonCol, IonIcon, IonButton, IonInput, IonItem, IonSelect, IonSelectOption, 
    IonAlert, IonToast
  ]
})
export class ProfesorPage implements OnInit, OnDestroy {
  private readonly SERVER_URL = environment.apiUrl;
  nombreProfesor: string = 'Profesor';
  materia: string= 'Asignatura';
  fechaAcceso: string = '';
  isOn: boolean = false;
  isLocked: boolean = false;
  generatedCode: string = '';
  socket: Socket;
  connectedStudents: string[] = [];
  showValidationError: boolean = false;
  validationErrors: string[] = [];
  showDataSentToast: boolean = false;
  toastMessage: string = '';
  actualizando: boolean = false;
  remoteLockActive: boolean = false;
  grupos: any[] = []; // Lista de grupos con estado de envío

  sendingData: boolean = false;
  lastSentData: any = null;

  constructor(private router: Router) {
    addIcons({wifiOutline,lockClosedOutline,refreshCircleOutline,addCircleOutline,logoIonic});
    this.socket = io(this.SERVER_URL, { autoConnect: false });
    
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras?.state as { 
      nombreProfesor: string,
      materia: string,
      fechaAcceso: string 
    };
    
    if (state) {
      this.nombreProfesor = state.nombreProfesor || 'Profesor';
      this.materia = state.materia || 'Asignatura';
      this.fechaAcceso = state.fechaAcceso || new Date().toLocaleString();
    }
  }

  // Getter para contar grupos conectados
  get gruposConectados(): number {
    return this.grupos.filter(grupo => 
      grupo.studentId && (grupo.estado === 'conectado' || grupo.estado === 'inactivo')
    ).length;
  }

  ngOnInit() {
    this.setupSocketListeners();
    this.startConnectionMonitor();
  }

  ngOnDestroy() {
    this.socket.disconnect();
  }

  setupSocketListeners() {
    this.socket.on('connect', () => {
      console.log('Conectado al servidor local');
    });

    this.socket.on('server-ping', () => {
      this.socket.emit('client-pong');
    });

    this.socket.on('new-student', (data: {studentId: string, socketId: string}) => {
      this.connectedStudents.push(data.studentId);
      
      const existingGroupIndex = this.grupos.findIndex(g => g.studentId === data.studentId);
      
      if (existingGroupIndex === -1) {
        const groupNumber = this.grupos.length;
        this.grupos.push({
          nombre: `Grupo ${groupNumber + 1}`,
          studentId: data.studentId,
          socketId: data.socketId,
          controlTempe: '',
          tempCorporal: '',
          saturacion: '',
          pesoKg:'',
          modoSeleccion: '',
          estado: 'conectado',
          lastActivity: Date.now(),
          sending: false // Nuevo estado para control de envío
        });
      }
    });

    this.socket.on('student-disconnected', (data: {studentId: string, socketId: string}) => {
      const index = this.grupos.findIndex(g => g.socketId === data.socketId);
      if (index !== -1) {
        this.grupos.splice(index, 1);
        this.reorganizarNumeracionGrupos();
      }
    });

    this.socket.on('disconnect', () => {
      console.log('Desconectado del servidor local');
    });

    this.socket.on('data-received', (studentId: string) => {
      console.log(`Estudiante ${studentId} recibió los datos`);
      this.showToast(`Datos enviados a ${studentId}`);
    });

    this.socket.on('data-error', (error: {message: string, errors?: string[]}) => {
      console.error('Error al enviar datos:', error);
      this.showValidationAlert(error.message, error.errors || []);
    });

    this.socket.on('data-sent', (confirmation: {success: boolean, studentId?: string}) => {
      if (confirmation.success && confirmation.studentId) {
        const grupo = this.grupos.find(g => g.studentId === confirmation.studentId);
        if (grupo) {
          grupo.sending = false;
          this.showToast(`Datos enviados a ${grupo.nombre}`);
        }
      }
    });
  }

  // Función para enviar datos a un grupo específico
  async sendDataToGroup(index: number) {
    const grupo = this.grupos[index];
    
    if (!grupo.studentId || !this.isOn || grupo.sending) return;

    // Validación de datos
    const validationResult = this.validateMedicalData(grupo);
    if (!validationResult.valid) {
      this.showValidationAlert('Datos inválidos', validationResult.errors);
      return;
    }

    grupo.sending = true; // Bloquea el botón durante el envío

    const dataToSend = {
      code: this.generatedCode,
      studentId: grupo.studentId,
      controlTempe: grupo.controlTempe,
      tempCorporal: grupo.tempCorporal,
      saturacion: grupo.saturacion,
      pesoKg: grupo.pesoKg,
      modoSeleccion: grupo.modoSeleccion,
      timestamp: new Date().toISOString()
    };

    // Envía solo a este grupo
    this.socket.emit('send-data', dataToSend, (confirmation: { success: boolean }) => {
      if (!confirmation.success) {
        grupo.sending = false; // Rehabilita si falla
        this.showToast(`Error al enviar a ${grupo.nombre}`);
      }
    });

    // Actualiza última actividad
    grupo.lastActivity = Date.now();
    grupo.estado = 'conectado';
    this.lastSentData = { ...dataToSend };
  }

  actualizarConexiones() {
    if (this.actualizando) return;
    
    if (!this.isOn || !this.generatedCode) {
      this.showToast('La sesión no está activa');
      return;
    }

    this.actualizando = true;
    
    this.socket.emit('get-connection-status', (status: any) => {
      if (status.connected && status.type === 'profesor') {
        this.verificarEstudiantesConectados();
      } else {
        this.showToast('Error al verificar conexiones');
      }
      this.actualizando = false;
    });
  }

  private verificarEstudiantesConectados() {
    this.socket.emit('get-connected-students', this.generatedCode, (students: string[]) => {
      this.grupos = this.grupos.filter(grupo => {
        return !grupo.studentId || students.includes(grupo.studentId);
      });

      students.forEach(studentId => {
        if (!this.grupos.some(g => g.studentId === studentId)) {
          this.grupos.push({
            nombre: `Grupo ${this.grupos.length + 1}`,
            studentId: studentId,
            socketId: '',
            controlTempe: '',
            tempCorporal: '',
            saturacion: '',
            pesoKg: '',
            modoSeleccion: '',
            estado: 'conectado',
            lastActivity: Date.now(),
            sending: false
          });
        }
      });

      this.reorganizarNumeracionGrupos();
      this.showToast('Conexiones actualizadas');
    });
  }

  reorganizarNumeracionGrupos() {
    this.grupos.forEach((grupo, index) => {
      grupo.nombre = `Grupo ${index + 1}`;
    });
  }

  private startConnectionMonitor() {
    setInterval(() => {
      if (!this.isOn) return;
      
      const now = Date.now();
      this.grupos.forEach(estudiante => {
        if (estudiante.lastActivity && (now - estudiante.lastActivity > 60000)) {
          estudiante.estado = 'inactivo';
        }
      });
    }, 60000);
  }

  toggleRemoteLock() {
    this.remoteLockActive = !this.remoteLockActive;
    
    // Emitir evento al backend
    this.socket.emit('remote-lock', {
      code: this.generatedCode,  // Código de sesión
      lockStatus: this.remoteLockActive
    });
  }

  toggleConnection() {
    if (!this.isLocked) {
      this.isOn = !this.isOn;
      
      if (this.isOn) {
        this.generatedCode = this.generateRandomCode();
        this.socket.connect();
        this.socket.emit('profesor-connect', this.generatedCode);
        this.showToast('Sesión iniciada correctamente');
      } else {
        this.generatedCode = '';
        this.connectedStudents = [];
        this.resetGroups();
        this.socket.disconnect();
        this.showToast('Sesión finalizada');
      }
    }
  }

  toggleLock() {
    this.isLocked = !this.isLocked;
    this.showToast(this.isLocked ? 'Controles bloqueados' : 'Controles desbloqueados');
  }

  generateRandomCode(): string {
    let code = '';
    for (let i = 0; i < 7; i++) {
      code += Math.floor(Math.random() * 10);
    }
    return code;
  }

  validateMedicalData(data: any): { valid: boolean, errors: string[] } {
    const errors = [];
    const controlTempe = parseFloat(data.controlTempe);
    const tempCorporal = parseFloat(data.tempCorporal);
    const saturacion = parseFloat(data.saturacion);
    const pesoKg = parseFloat(data.pesoKg);

    if (isNaN(controlTempe)) {
      errors.push('Temperatura control no es un número válido');
    } else if (controlTempe < 36 || controlTempe > 40) {
      errors.push(`Temperatura control (${controlTempe}°C) debe estar entre 36-40°C`);
    }

    if (isNaN(tempCorporal)) {
      errors.push('Temperatura corporal no es un número válido');
    } else if (tempCorporal < 0 || tempCorporal > 60) {
      errors.push(`Temperatura corporal (${tempCorporal}°C) debe estar entre 0-60°C`);
    }

    if (isNaN(saturacion)) {
      errors.push('Saturación no es un número válido');
    } else if (saturacion < 85 || saturacion > 100) {
      errors.push(`Saturación (${saturacion}%) debe estar entre 85-100%`);
    }

    if (isNaN(pesoKg)) {
      errors.push('Peso no es un número válido');
    } else if (pesoKg < 400 || pesoKg > 4500) {
      errors.push(`Peso (${pesoKg}g) debe estar entre 400-4500 gramos`);
    }

    if (!['Precalentado', 'Manual', 'Bebe'].includes(data.modoSeleccion)) {
      errors.push('Modo selección no válido');
    }

    return {
      valid: errors.length === 0,
      errors: errors
    };
  }

  enviarTodo() {
    if (!this.isOn || this.sendingData) return;

    this.sendingData = true;
    let successCount = 0;

    this.grupos.forEach(grupo => {
      if (grupo.studentId && !grupo.sending) {
        const validationResult = this.validateMedicalData(grupo);
        if (validationResult.valid) {
          grupo.sending = true;
          const dataToSend = {
            code: this.generatedCode,
            studentId: grupo.studentId,
            controlTempe: grupo.controlTempe,
            tempCorporal: grupo.tempCorporal,
            saturacion: grupo.saturacion,
            pesoKg: grupo.pesoKg,
            modoSeleccion: grupo.modoSeleccion
          };

          this.socket.emit('send-data', dataToSend, (confirmation: { success: boolean }) => {
            grupo.sending = false;
            if (confirmation.success) {
              successCount++;
              grupo.lastActivity = Date.now();
              grupo.estado = 'conectado';
            }
          });
        }
      }
    });

    setTimeout(() => {
      this.sendingData = false;
      this.showToast(`Datos enviados a ${successCount} estudiantes`);
    }, 1500);
  }

  generarValoresAleatorios() {
    for (let grupo of this.grupos) {
      // Temperatura control: entre 36.0 y 40.0 °C con 1 decimal
      grupo.controlTempe = (Math.round((36 + Math.random() * 4) * 10) / 10).toString();
      
      // Temperatura corporal: entre 0 y 60 °C
      grupo.tempCorporal = Math.floor(Math.random() * 61).toString();
      
      // Saturación: entre 85 y 100%
      grupo.saturacion = (Math.floor(Math.random() * 16) + 85).toString();
      
      // Peso: entre 400 y 4500 gramos
      grupo.pesoKg = (Math.floor(Math.random() * 4101) + 400).toString();
      
      // Modo selección aleatorio
      const modos = ['Precalentado', 'Manual', 'Bebe'];
      grupo.modoSeleccion = modos[Math.floor(Math.random() * modos.length)];
    }
    this.showToast('Valores aleatorios generados');
  }

  // Métodos para generar reportes Excel
  generarReporteGeneral() {
    if (this.grupos.length === 0) {
      this.showToast('No hay grupos para generar reporte');
      return;
    }

    // Crear el libro de Excel
    const wb = XLSX.utils.book_new();
    
    // Crear hoja de datos
    const datos = [];
    
    // Encabezado del reporte
    datos.push(['Reporte de Datos Médicos']);
    datos.push(['Nombre Profesor:', this.nombreProfesor]);
    datos.push(['Asignatura:', this.materia]);
    datos.push(['Fecha:', new Date().toLocaleDateString()]);
    datos.push([]); // Línea en blanco
    
    // Datos de cada grupo
    this.grupos.forEach(grupo => {
      if (grupo.studentId) { // Solo grupos conectados
        datos.push([`${grupo.nombre}:`]);
        datos.push(['Control Temperatura C°', '=', grupo.controlTempe || 'N/A']);
        datos.push(['T° corporal', '=', grupo.tempCorporal || 'N/A']);
        datos.push(['Saturación%', '=', grupo.saturacion || 'N/A']);
        datos.push(['Peso en Kg', '=', grupo.pesoKg || 'N/A']);
        datos.push(['Modo Selección', '=', grupo.modoSeleccion || 'N/A']);
        datos.push([]); // Separador entre grupos
      }
    });
    
    const ws = XLSX.utils.aoa_to_sheet(datos);
    XLSX.utils.book_append_sheet(wb, ws, 'Reporte General');
    
    // Generar archivo y descargar
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    this.guardarArchivo(excelBuffer, 'Reporte_General.xlsx');
    
    this.showToast('Reporte general generado');
  }

  generarReporteIndividual(index: number) {
    const grupo = this.grupos[index];
    
    if (!grupo.studentId) {
      this.showToast('El grupo no está conectado');
      return;
    }

    // Crear el libro de Excel
    const wb = XLSX.utils.book_new();
    
    // Crear hoja de datos
    const datos = [];
    
    // Encabezado del reporte
    datos.push(['Reporte Individual de Datos Médicos']);
    datos.push(['Nombre Profesor:', this.nombreProfesor]);
    datos.push(['Asignatura:', this.materia]);
    datos.push(['Fecha:', new Date().toLocaleDateString()]);
    datos.push(['Grupo:', grupo.nombre]);
    datos.push([]); // Línea en blanco
    
    // Datos del grupo
    datos.push(['Control Temperatura C°', '=', grupo.controlTempe || 'N/A']);
    datos.push(['T° corporal', '=', grupo.tempCorporal || 'N/A']);
    datos.push(['Saturación%', '=', grupo.saturacion || 'N/A']);
    datos.push(['Peso en Kg', '=', grupo.pesoKg || 'N/A']);
    datos.push(['Modo Selección', '=', grupo.modoSeleccion || 'N/A']);
    
    const ws = XLSX.utils.aoa_to_sheet(datos);
    XLSX.utils.book_append_sheet(wb, ws, 'Reporte Individual');
    
    // Generar archivo y descargar
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    this.guardarArchivo(excelBuffer, `Reporte_${grupo.nombre.replace(' ', '_')}.xlsx`);
    
    this.showToast(`Reporte de ${grupo.nombre} generado`);
  }

  private guardarArchivo(buffer: any, fileName: string) {
    try {
      const data = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(data, fileName);
    } catch (e) {
      console.error('Error al guardar archivo:', e);
      this.showToast('Error al generar el reporte');
    }
  }

  private resetGroups() {
    this.grupos = [];
  }

  private showToast(message: string) {
    this.toastMessage = message;
    this.showDataSentToast = true;
    setTimeout(() => this.showDataSentToast = false, 3000);
  }

  private showValidationAlert(header: string, errors: string[]) {
    this.validationErrors = errors;
    this.showValidationError = true;
  }

  dismissValidationAlert() {
    this.showValidationError = false;
    this.validationErrors = [];
  }
}