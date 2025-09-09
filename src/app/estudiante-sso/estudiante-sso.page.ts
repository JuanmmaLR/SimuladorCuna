import { Component, OnInit, OnDestroy, AfterViewInit  } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { 
  IonSplitPane, IonMenu, IonContent, IonList, IonListHeader, IonNote, 
  IonMenuToggle, IonItem, IonIcon, IonLabel, IonRouterOutlet, IonRouterLink, 
  IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, 
  IonInput, IonCol, IonGrid, IonRow, IonButton, IonRadio, IonRadioGroup, 
  IonRange, IonFooter, IonHeader, IonTitle, IonToolbar  
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  mailOutline, mailSharp, paperPlaneOutline, paperPlaneSharp, heartOutline, heartSharp, 
  archiveOutline, archiveSharp, trashOutline, trashSharp, warningOutline, warningSharp, 
  bookmarkOutline, bookmarkSharp, heart, wifiOutline } from 'ionicons/icons';
import { logoIonic } from 'ionicons/icons';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../environments/environment'; 
@Component({
  selector: 'app-estudiante-sso',
  templateUrl: './estudiante-sso.page.html',
  styleUrls: ['./estudiante-sso.page.scss'],
  standalone: true,
  imports: [
    CommonModule, IonSplitPane, IonMenu, IonContent, IonList, IonListHeader, IonNote, 
    IonMenuToggle, IonItem, IonIcon, IonLabel, IonRouterLink, IonRouterOutlet, IonCard, 
    IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonInput, IonCol, IonGrid, 
    IonRow, IonButton, IonRadio, IonRadioGroup, IonRange, IonFooter, IonHeader, IonTitle, 
    IonToolbar, RouterLink, RouterLinkActive
  ],
})
export class EstudianteSSOPage implements OnInit, OnDestroy, AfterViewInit {
/*...:::________________________VARIABLES___________________________ :::... */
  socket: Socket;
  isConnected: boolean = false;
  studentId: string = '';
  serverUrl: string = environment.apiUrl;
/*-------------------------------------------------------------------------*/ 
  constructor() {
    addIcons({wifiOutline,logoIonic});
    this.studentId = this.generate1StudentId();
    
    this.socket = io(this.serverUrl, { 
      autoConnect: false,
      reconnectionAttempts: 3,
      reconnectionDelay: 1000,
      timeout: 2000
    });
  }

  private generate1StudentId(): string {
    const randomPart1 = Math.floor(1000 + Math.random() * 9000);
    const randomPart2 = Math.floor(1000 + Math.random() * 9000);
    return `EST-${randomPart1}-${randomPart2}`;
  }

  // Métodos de conexión (MODIFICADO para mejor manejo de errores)
  ngOnInit() {
    this.setupSocketListeners();
  }

  ngOnDestroy() {
    this.socket.disconnect();
  }

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

  generateStudentId(): string {
    return 'student-' + Math.random().toString(36).substr(2, 9);
  }

  setupSocketListeners() {
    this.socket.on('connection-success', (data: any) => {
      this.isConnected = true;
      this.updateConnectionUI(true);
      console.log('Conectado al profesor:', data.profesorId);
    });

    this.socket.on('invalid-code', () => {
      this.isConnected = false;
      this.updateConnectionUI(false);
      console.error('Código inválido o servidor no encontrado');
      // Puedes mostrar un toast/mensaje al usuario aquí
    });

    this.socket.on('connect_error', (err) => {
      console.error('Error de conexión:', err.message);
      this.updateConnectionUI(false);
    });

    this.socket.on('receive-data', (data) => {
      console.log('Datos recibidos:', data);
      // Aquí procesas los datos del profesor
      // Ejemplo: this.handleProfessorData(data);
    });

    this.socket.on('disconnect', (reason) => {
      this.isConnected = false;
      this.updateConnectionUI(false);
      console.log('Desconectado:', reason);
    });
  }

  connectToServer(code: string) {
    if (!this.isConnected && this.socket.disconnected) {
      this.socket.connect();
      this.socket.emit('student-connect', {
        code: code,
        studentId: this.studentId,
        deviceInfo: {
          platform: 'tablet',
          // Puedes añadir más info del dispositivo si es necesario
        }
      });
    }
  }

  disconnectFromServer() {
    if (this.isConnected) {
      this.socket.disconnect();
      this.isConnected = false;
      this.updateConnectionUI(false);
    }
  }

  updateConnectionUI(connected: boolean) {
    const icon = document.getElementById('wifiIcon');
    const input = document.getElementById('codigoInput') as HTMLInputElement;
    
    if (icon && input) {
      icon.classList.toggle('connected', connected);
      icon.classList.toggle('active', !connected && input.value.length === 7);
      input.disabled = connected; // Deshabilitar input cuando está conectado
    }
  }
/*-------------------------------------------------------------------------*/ 

/*...:::_____________________RECARGAR PAGINA_______________________ :::... */
  reloadPage() {
    window.location.reload();
  }
/*-------------------------------------------------------------------------*/ 

/*...:::_______________________BARRA RANGER_______________________ :::... */
/*...:::____________________BOTONES SELECCION_____________________ :::... */
  // Modo Selección
  activeButton: string = '';
  botonesActivos: boolean[] = [false, false, false];

  // Rango
  rangeValue: number = 0;

  // Método para cambiar el botón activo
  setActive(buttonName: string): void {
    this.activeButton = buttonName;

    // Si se selecciona 'preCalentado', se ajusta el valor del rango al 25
    if (buttonName === 'preCalentado') {
      this.rangeValue = 25;
    }
  }

  // Evento de cambio del ion-range
  onRangeChange(event: any) {
    this.rangeValue = event.detail.value;
  }

  // Método para definir estilos dinámicos del ion-range
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

  // Mostrar porcentaje
  getPercentage(): string {
    return `${this.rangeValue}%`;
  }

 
  // Método opcional para toggle individual de botones
  toggleBoton(index: number) {
    this.botonesActivos[index] = !this.botonesActivos[index];
  }
/*-------------------------------------------------------------------------*/  

/*...:::________________________CRONOMETRO_________________________ :::... */
tiempo: number = 0;
intervalo: any;
cronometroActivo: boolean = false;

// Rutas de alarma
alarma: HTMLAudioElement = new Audio('assets/sound/1segundo.mp3');

// Controla que no se repita la alarma
alarmasDisparadas: Set<number> = new Set();

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

tuFuncion() {
  if (!this.cronometroActivo) {
    this.cronometroActivo = true;
    this.iniciarCronometro();
  } else {
    this.cronometroActivo = false;
    clearInterval(this.intervalo);
  }
}

actualizarCronometro() {
  const minutos = Math.floor(this.tiempo / 60);
  const segundos = this.tiempo % 60;
  const tiempoFormateado = `${this.padZero(minutos)}:${this.padZero(segundos)}`;
  const cronometroElement = document.getElementById('cronometro');
  if (cronometroElement) {
    cronometroElement.textContent = tiempoFormateado;
  }
}

verificarAlarma() {
  const tiemposObjetivo = [60, 300, 600]; // 1min, 5min, 10min en segundos

  if (tiemposObjetivo.includes(this.tiempo) && !this.alarmasDisparadas.has(this.tiempo)) {
    this.alarmasDisparadas.add(this.tiempo);
    this.reproducirAlarma();
  }
}

reproducirAlarma() {
  this.alarma.currentTime = 0;
  this.alarma.play().catch((error) => {
    console.error('Error al reproducir la alarma:', error);
  });
}
/*-------------------------------------------------------------------------*/ 

/*...:::__________________TEMPERATURA PROMEDIO C°__________________ :::... */
  temperature: number = 36.0;
  isActive: boolean = false;
  minTemperature: number = 36.0;
  maxTemperature: number = 40.0;

  adjustTemperature(change: number) {
    if (!this.isActive) return;
    const newTemperature = this.temperature + change;
    if (newTemperature >= this.minTemperature && newTemperature <= this.maxTemperature) {
      this.temperature = newTemperature;
    }
  }

  toggleActiveState() {
    this.isActive = !this.isActive;
    if (this.isActive) this.temperature = 36.0;
  }
/*-------------------------------------------------------------------------*/

/*...:::_________________SATURACION DE OXIGENO %___________________ :::... */
  validateInput(event: any) {
    let value = event.target.value.replace(/\D/g, '');
    let numericValue = parseInt(value, 10) || 1;
    numericValue = Math.min(Math.max(numericValue, 1), 100);
    event.target.value = numericValue.toString().padStart(3, '0');
    event.target.classList.toggle('activo', numericValue >= 1 && numericValue <= 100);
  }
/*-------------------------------------------------------------------------*/ 

/*...:::______________________ALARMA BLOQUEO_______________________ :::... */
  
  private alarm = new Audio('assets/sound/Alarm.mp3');
  private isPlaying = false;

  alarmFuncion() {
    if (this.isPlaying) {
      this.alarm.pause();
      this.alarm.currentTime = 0;
    } else {
      this.alarm.play();
    }
    this.isPlaying = !this.isPlaying;
  }
/*-------------------------------------------------------------------------*/ 

/*...:::___________________TEMPERATURA CORPORAL____________________ :::... */  
  isActivalo: boolean = false;
  temperatura: number | null = null;

  onInputChange(event: any): void {
    const value = event.detail.value;
    this.isActivalo = true;
    if (value > 60) {
      this.temperatura = 60;
      event.target.value = 60;
    } else {
      this.temperatura = value;
    }
  }

  onInputBlur(): void {
    this.isActivalo = false;
  }
/*-------------------------------------------------------------------------*/ 
}