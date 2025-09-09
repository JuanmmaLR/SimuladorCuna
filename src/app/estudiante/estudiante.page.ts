import { Component, OnInit, OnDestroy, AfterViewInit  } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { 
  IonSplitPane, IonMenu, IonContent, IonList, IonListHeader, IonNote, 
  IonMenuToggle, IonItem, IonIcon, IonLabel, IonRouterOutlet, IonRouterLink, 
  IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, 
  IonInput, IonCol, IonGrid, IonRow, IonButton, IonRadio, IonRadioGroup, 
  IonRange, IonFooter, IonHeader, IonTitle, IonToolbar, IonAlert, IonToast 
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  mailOutline, mailSharp, paperPlaneOutline, paperPlaneSharp, heartOutline, heartSharp, 
  archiveOutline, archiveSharp, trashOutline, trashSharp, warningOutline, warningSharp, 
  bookmarkOutline, bookmarkSharp, heart, wifiOutline, lockClosedOutline, alarmOutline, shieldOutline  
} from 'ionicons/icons';
import { logoIonic } from 'ionicons/icons';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../environments/environment'; 

@Component({
  selector: 'app-estudiante',
  templateUrl: 'estudiante.page.html',
  styleUrls: ['estudiante.page.scss'],
  imports: [
    CommonModule, IonSplitPane, IonMenu, IonContent, IonList, IonListHeader, IonNote, 
    IonMenuToggle, IonItem, IonIcon, IonLabel, IonRouterLink, IonRouterOutlet, IonCard, 
    IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonInput, IonCol, IonGrid, 
    IonRow, IonButton, IonRadio, IonRadioGroup, IonRange, IonFooter, IonHeader, IonTitle, 
    IonToolbar, RouterLink, RouterLinkActive, FormsModule, IonAlert, IonToast
  ],
})
export class EstudiantePage implements OnInit, OnDestroy, AfterViewInit {
  /*...:::________________________VARIABLES___________________________ :::... */
  activeButton: string = '';
  alarm: HTMLAudioElement = new Audio('assets/sound/Alarm.mp3');
  alarma: HTMLAudioElement = new Audio('assets/sound/1segundo.mp3');
  alarmasDisparadas: Set<number> = new Set();
  botonesActivos: boolean[] = [false, false, false];
  codigoInput: string = '';
  connectionLoading: boolean = false;
  ControlTemperatura: number = 36.0;
  cronometroActivo: boolean = false;
  inputBloCompleto: boolean = false;
  inputBloqueado: boolean = false;
  intervalo: any;
  isConnected: boolean = false;
  isPlaying: boolean = false;
  lastActivity: number = Date.now();
  lastReceivedData: any = null;
  maxControlTemperatura: number = 40.0;
  minControlTemperatura: number = 36.0;
  pesoValue: string = '400';
  rangeValue: number = 0;
  saturacionValue: string = '00';
  serverUrl: string = environment.apiUrl;
  sessionEndedAlert: any = null;
  shieldActivo: boolean = false;
  showDataToast: boolean = false;
  socket: Socket;
  studentId: string = '';
  tempCorporalValue: string = '00';
  tiempo: number = 0;
  
  // Nuevas propiedades para control de alarmas (públicas para acceso en template)
  tempAlarmTriggered: boolean = false;
  saturationAlarmTriggered: boolean = false;
  /*-------------------------------------------------------------------------*/ 

  constructor() {
    addIcons({wifiOutline, logoIonic, lockClosedOutline, alarmOutline, shieldOutline  });
    this.studentId = this.generate1StudentId();
    
    this.socket = io(this.serverUrl, { 
      autoConnect: false,
      reconnectionAttempts: 3,
      reconnectionDelay: 1000,
      timeout: 2000
    });
  }

  /*...:::____________________BLOQUEO PANTALLA_______________________ :::... */
  toggleBloqueoCompleto() {
    this.inputBloCompleto = !this.inputBloCompleto;
  }

  toggleShield() {
    this.shieldActivo = !this.shieldActivo;
    console.log('Estado del escudo:', this.shieldActivo);
    
    if (this.shieldActivo) {
      console.log('Pantalla bloqueada');
    } else {
      console.log('Pantalla desbloqueada');
    }
  }
  /*-------------------------------------------------------------------------*/ 

  /*...:::_____________________RECARGAR PAGINA_______________________ :::... */
  onCodeInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.codigoInput = input.value.replace(/\D/g, '').slice(0, 7);
    input.value = this.codigoInput;
  }

  reloadPage() {
    const estadoConexion = {
      codigo: this.codigoInput,
      bloqueado: this.inputBloqueado,
      conectado: this.isConnected,
      socket: this.socket
    };

    this.resetApplicationState();

    this.codigoInput = estadoConexion.codigo;
    this.inputBloqueado = estadoConexion.bloqueado;
    this.isConnected = estadoConexion.conectado;
    this.socket = estadoConexion.socket;
    this.updateConnectionUI(this.isConnected);
  }

  toggleBloqueo() {
    this.inputBloqueado = !this.inputBloqueado;
    this.updateConnectionUI(this.isConnected);
  }
  /*-------------------------------------------------------------------------*/ 

  /*...:::_______________________BARRA RANGER_______________________ :::... */
  /*...:::____________________BOTONES SELECCION_____________________ :::... */
  getPercentage(): string {
    return `${this.rangeValue}%`;
  }

  getRangeStyle() {
    if (this.rangeValue <= 40) {
      return {
        '--bar-background-active': 'yellow',
        '--knob-background': 'yellow',
      };
    } else if (this.rangeValue <= 70) {
      return {
        '--bar-background-active': 'orange',
        '--knob-background': 'orange',
      };
    } else {
      return {
        '--bar-background-active': 'red',
        '--knob-background': 'red',
      };
    }
  }

  onRangeChange(event: any) {
    this.rangeValue = event.detail.value;
  }

  setActive(buttonName: string): void {
    this.activeButton = buttonName;
    if (buttonName === 'Precalentado') {
      this.rangeValue = 25;
    }
  }

  toggleBoton(index: number) {
    this.botonesActivos[index] = !this.botonesActivos[index];
  }
  /*-------------------------------------------------------------------------*/  

  /*...:::________________________CRONOMETRO_________________________ :::... */
  actualizarCronometro() {
    const minutos = Math.floor(this.tiempo / 60);
    const segundos = this.tiempo % 60;
    const tiempoFormateado = `${this.padZero(minutos)}:${this.padZero(segundos)}`;
    const cronometroElement = document.getElementById('cronometro');
    if (cronometroElement) {
      cronometroElement.textContent = tiempoFormateado;
    }
  }

  iniciarCronometro() {
    this.intervalo = setInterval(() => {
      this.tiempo++;
      this.actualizarCronometro();
      this.verificarAlarma();
    }, 1000);
  }

  padZero(valor: number): string {
    return valor < 10 ? `0${valor}` : `${valor}`;
  }

  reproducirAlarma() {
    this.alarma.currentTime = 0;
    this.alarma.play().catch((error) => {
      console.error('Error al reproducir la alarma:', error);
    });
  }

  tuFuncion() {
    if (!this.cronometroActivo) {
      this.cronometroActivo = true;
      this.iniciarCronometro();
    } else {
      this.cronometroActivo = false;
      clearInterval(this.intervalo);
    }
  }

  verificarAlarma() {
    const tiemposObjetivo = [60, 300, 600];
    if (tiemposObjetivo.includes(this.tiempo) && !this.alarmasDisparadas.has(this.tiempo)) {
      this.alarmasDisparadas.add(this.tiempo);
      this.reproducirAlarma();
    }
  }
  /*-------------------------------------------------------------------------*/ 

  /*...:::__________________CONTROL TEMPERATURA°__________________ :::... */
  adjustControlTemperatura(change: number) {
    const newControlTemperatura = this.ControlTemperatura + (change * 0.1);
    const roundedValue = Math.round(newControlTemperatura * 10) / 10;
    
    if (roundedValue >= this.minControlTemperatura && roundedValue <= this.maxControlTemperatura) {
      this.ControlTemperatura = roundedValue;
      
      // Verificar alarma de temperatura cuando se ajusta manualmente
      if (this.ControlTemperatura >= 39.0 && this.ControlTemperatura <= 40.0) {
        if (!this.tempAlarmTriggered) {
          this.tempAlarmTriggered = true;
          this.playTempAlarm();
        }
      } else {
        this.tempAlarmTriggered = false;
      }
    }
  }
  /*-------------------------------------------------------------------------*/

  /*...:::_________________SATURACION DE OXIGENO %___________________ :::... */
  validateInput(event: any) {
    let value = event.target.value.replace(/\D/g, '');
    let numericValue = parseInt(value, 10) || 0;
    numericValue = Math.min(Math.max(numericValue, 0), 100);
    this.saturacionValue = numericValue.toString().padStart(2, '0');
    event.target.value = this.saturacionValue;
    event.target.classList.toggle('activo', numericValue >= 1 && numericValue <= 100);
    
    // Verificar alarma de saturación cuando se cambia manualmente
    if (numericValue >= 85 && numericValue <= 95) {
      if (!this.saturationAlarmTriggered) {
        this.saturationAlarmTriggered = true;
        this.playSaturationAlarm();
      }
    } else {
      this.saturationAlarmTriggered = false;
    }
  }
  /*-------------------------------------------------------------------------*/ 

  /*...:::_______________________PESO EN KG__________________________ :::... */
  validateInputKG(event: any) {
    let valueKg = event.target.value.replace(/\D/g, '');
    let numeroKg = parseInt(valueKg, 10) || 0;
    numeroKg = Math.min(Math.max(numeroKg, 0), 4500);
    this.pesoValue = numeroKg.toString().padStart(3, '0');
    event.target.value = this.pesoValue;
    event.target.classList.toggle('activoKG', numeroKg >= 400 && numeroKg <= 4500);
  }
  /*-------------------------------------------------------------------------*/ 

  /*...:::___________________TEMPERATURA CORPORAL____________________ :::... */  
  validateInputTemCop(event: any) {
    let tCop = event.target.value.replace(/\D/g, '');
    let TemCel = parseInt(tCop, 10) || 0;
    TemCel = Math.min(Math.max(TemCel, 0), 60);
    this.tempCorporalValue = TemCel.toString().padStart(2, '0');
    event.target.value = this.tempCorporalValue;
    event.target.classList.toggle('activoTC', TemCel >= 0 && TemCel <= 60);
  }
  /*-------------------------------------------------------------------------*/ 

  /*...:::______________________ALARMA BLOQUEO_______________________ :::... */
  private playTempAlarm() {
    console.log('Alarma: Temperatura crítica detectada!');
    this.alarma.currentTime = 0;
    this.alarma.loop = true;
    this.alarma.play().catch(error => {
      console.error('Error al reproducir alarma de temperatura:', error);
    });
  }

  private playSaturationAlarm() {
    console.log('Alarma: Saturación de oxígeno en rango crítico!');
    this.alarma.currentTime = 0;
    this.alarma.loop = true;
    this.alarma.play().catch(error => {
      console.error('Error al reproducir alarma de saturación:', error);
    });
  }

  alarmFuncion() {
    if (this.isPlaying) {
      this.alarma.pause();
      this.alarma.currentTime = 0;
      this.alarma.loop = false;
      this.isPlaying = false;
      this.tempAlarmTriggered = false;
      this.saturationAlarmTriggered = false;
    } else {
      this.isPlaying = true;
      this.alarma.play().catch(error => {
        console.error('Error al reproducir alarma manual:', error);
      });
    }
  }
  /*-------------------------------------------------------------------------*/ 

  /*...:::______________________MÉTODOS PRIVADOS_______________________ :::... */
  private generate1StudentId(): string {
    const randomPart1 = Math.floor(1000 + Math.random() * 9000);
    const randomPart2 = Math.floor(1000 + Math.random() * 9000);
    return `EST-${randomPart1}-${randomPart2}`;
  }

  private resetApplicationState() {
    // Barra Ranger y Botones
    this.activeButton = '';
    this.botonesActivos = [false, false, false];
    this.rangeValue = 0;
    
    // Cronómetro
    this.tiempo = 0;
    if (this.intervalo) {
      clearInterval(this.intervalo);
      this.intervalo = null;
    }
    this.cronometroActivo = false;
    this.alarmasDisparadas.clear();
    const cronometroElement = document.getElementById('cronometro');
    if (cronometroElement) {
      cronometroElement.textContent = '00:00';
    }
    
    // Temperatura Promedio
    this.ControlTemperatura = 36.0;
    this.tempAlarmTriggered = false;
    
    // Saturación de Oxígeno
    this.saturacionValue = '00';
    this.saturationAlarmTriggered = false;
    const saturacionElement = document.querySelector('[name="saturacionInput"]') as HTMLInputElement;
    if (saturacionElement) {
      saturacionElement.value = '00';
      saturacionElement.classList.remove('activo');
    }
    
    // Peso en Kg
    this.pesoValue = '400';
    const pesoElement = document.querySelector('[name="pesoInput"]') as HTMLInputElement;
    if (pesoElement) {
      pesoElement.value = '400';
      pesoElement.classList.remove('activo');
    }
    
    // Temperatura Corporal
    this.tempCorporalValue = '00';
    const tCorpoElement = document.querySelector('[name="temCorpoInput"]') as HTMLInputElement;
    if (tCorpoElement) {
      tCorpoElement.value = '00';
      tCorpoElement.classList.remove('activo');
    }
    
    // Alarma
    if (this.isPlaying) {
      this.alarma.pause();
      this.alarma.currentTime = 0;
      this.isPlaying = false;
    }
  }

  private setActiveMode(mode: 'Precalentado' | 'Manual' | 'Bebe') {
    this.activeButton = mode;
    switch (mode) {
      case 'Precalentado':
        this.rangeValue = 25;
        break;
      case 'Manual':
        this.rangeValue = 0;
        break;
      case 'Bebe':
        this.rangeValue = 0;
        break;
    }
  }

  private updateMedicalData(data: {
    temperaturaControl: number;
    peso: number;
    temperaturaCorporal: number;
    saturacionOxigeno: number;
    modo: 'Precalentado' | 'Manual' | 'Bebe';
  }) {
    this.ControlTemperatura = data.temperaturaControl;
    this.pesoValue = data.peso.toString().padStart(3, '0');
    this.tempCorporalValue = data.temperaturaCorporal.toString().padStart(3, '0');
    this.saturacionValue = data.saturacionOxigeno.toString().padStart(3, '0');
    this.setActiveMode(data.modo);

    // Verificar temperatura para alarma
    if (this.ControlTemperatura >= 39.0 && this.ControlTemperatura <= 40.0) {
      if (!this.tempAlarmTriggered) {
        this.tempAlarmTriggered = true;
        this.playTempAlarm();
      }
    } else {
      this.tempAlarmTriggered = false;
    }

    // Verificar saturación para alarma
    const saturacion = parseInt(this.saturacionValue);
    if (saturacion >= 85 && saturacion <= 95) {
      if (!this.saturationAlarmTriggered) {
        this.saturationAlarmTriggered = true;
        this.playSaturationAlarm();
      }
    } else {
      this.saturationAlarmTriggered = false;
    }
  }
  /*-------------------------------------------------------------------------*/

  /*...:::______________________MÉTODOS DE CICLO DE VIDA_______________________ :::... */
  ngAfterViewInit() {
    const input = document.getElementById('codigoInput') as HTMLInputElement;
    const icon = document.getElementById('wifiIcon');

    if (input && icon) {
      input.addEventListener('input', () => {
        if (/^\d{7}$/.test(input.value)) {
          icon.classList.add('active');
          this.connectToServer(input.value);
        } else {
          icon.classList.remove('active');
          if (this.isConnected) {
            this.disconnectFromServer();
          }
        }
      });
    }
  }

  ngOnDestroy() {
    this.socket.disconnect();
    if (this.sessionEndedAlert) {
      this.sessionEndedAlert.dismiss();
    }
  }

  ngOnInit() {
    this.setupSocketListeners();
  }
  /*-------------------------------------------------------------------------*/

  /*...:::______________________MÉTODOS DE CONEXIÓN_______________________ :::... */
  connectToServer(code: string) {
    if (this.connectionLoading || this.isConnected) return;

    if (!code || code.length !== 7) {
      console.error('Código debe tener 7 caracteres');
      return;
    }

    this.connectionLoading = true;
    
    if (this.socket.disconnected) {
      this.socket.connect();
    }

    this.socket.emit('student-connect', {
      code: code,
      studentId: this.studentId,
      deviceInfo: {
        platform: 'tablet',
        timestamp: new Date().toISOString()
      }
    });

    setTimeout(() => {
      if (!this.isConnected) {
        this.connectionLoading = false;
      }
    }, 5000);
  }

  disconnectFromServer() {
    if (this.isConnected) {
      this.socket.disconnect();
      this.isConnected = false;
      this.updateConnectionUI(false);
      this.connectionLoading = false;
    }
  }

  async presentSessionEndedAlert(reason: string) {
    const alert = document.createElement('ion-alert');
    alert.header = 'Sesión Finalizada';
    alert.message = reason;
    alert.buttons = ['OK'];
    document.body.appendChild(alert);
    await alert.present();
    this.sessionEndedAlert = alert;
  }

  private setupReconnection() {
    this.socket.on('disconnect', () => {
      setTimeout(() => {
        this.socket.connect();
      }, 5000);
    });
  }

  private setupSocketListeners() {

    this.socket.on('update-remote-lock', (data: { lockStatus: boolean }) => {
      this.shieldActivo = data.lockStatus;  // Sincroniza el escudo del estudiante
    });
    
    this.socket.on('connection-success', (data: {
      profesorId: string;
      studentId: string;
      code: string;
      timestamp: string;
    }) => {
      this.isConnected = true;
      this.studentId = data.studentId;
      this.updateConnectionUI(true);
      console.log('Conectado al profesor:', data);
    });

    this.socket.on('server-ping', () => {
      this.socket.emit('client-pong');
      this.lastActivity = Date.now();
    });

    this.socket.on('invalid-code', (data: {
      message: string;
      suggestedAction?: string;
    }) => {
      this.isConnected = false;
      this.updateConnectionUI(false);
      console.error('Código inválido:', data.message);
    });

    this.socket.on('connection-error', (error: {
      message: string;
      error?: string;
    }) => {
      console.error('Error de conexión:', error);
      this.isConnected = false;
      this.updateConnectionUI(false);
    });

    this.socket.on('receive-data', (data: {
      temperaturaControl: number;
      peso: number;
      temperaturaCorporal: number;
      saturacionOxigeno: number;
      modo: 'Precalentado' | 'Manual' | 'Bebe';
      timestamp: string;
    }) => {
      console.log('Datos recibidos:', data);
      this.lastReceivedData = data;
      this.updateMedicalData(data);
      this.showDataToast = true;
      setTimeout(() => this.showDataToast = false, 2000);
    });

    this.socket.on('session-closed', (data: {
      code: string;
      reason: string;
      timestamp: string;
    }) => {
      console.log('Sesión cerrada:', data.reason);
      this.isConnected = false;
      this.updateConnectionUI(false);
      this.resetApplicationState();
      this.presentSessionEndedAlert(data.reason);
    });

    this.socket.on('data-error', (error: {
      message: string;
      code?: string;
    }) => {
      console.error('Error en datos recibidos:', error);
    });

    this.socket.on('connect_error', (err) => {
      console.error('Error de conexión:', err.message);
      this.updateConnectionUI(false);
    });

    this.socket.on('disconnect', (reason) => {
      this.isConnected = false;
      this.updateConnectionUI(false);
      console.log('Desconectado:', reason);
    });
  }

  private updateConnectionUI(connected: boolean) {
    const icon = document.getElementById('wifiIcon');
    const input = document.getElementById('codigoInput') as HTMLInputElement;
    
    if (icon && input) {
      icon.classList.toggle('connected', connected);
      icon.classList.toggle('active', !connected && input.value.length === 7);
      input.disabled = connected || this.inputBloqueado;
    }
    this.connectionLoading = false;
  }
  /*-------------------------------------------------------------------------*/
}