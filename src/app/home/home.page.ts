import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, AlertController } from '@ionic/angular/standalone';
import { IonButton, IonCol, IonGrid, IonRow, IonInput, IonItem, IonList } from '@ionic/angular/standalone';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonButton, IonHeader, IonToolbar, IonTitle, IonContent, IonCol, IonGrid, IonRow, IonInput, IonItem, IonList],
})
export class HomePage {
  // Contraseña fija para los profesores
  private readonly CONTRASENA_PROFESOR = '1234';

  constructor(
    private alertController: AlertController,
    private router: Router
  ) {}

  async onProfesorClick() {
    const alert = await this.alertController.create({
      header: 'Acceso Profesor',
      subHeader: 'Ingrese sus credenciales',
      inputs: [
        {
          name: 'nombre',
          type: 'text',
          placeholder: 'Nombre del profesor'
        },
        {
          name: 'asignatura',
          type: 'text',
          placeholder: 'Nombre de la asignatura'
        },
        {
          name: 'contrasena',
          type: 'password',
          placeholder: 'Contraseña'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Ingresar',
          handler: (data) => {
            // Validar que ambos campos estén completos
            if (!data.nombre || data.nombre.trim() === '') {
              this.mostrarError('Debe ingresar su nombre');
              return false;
            }
            if (!data.asignatura || data.asignatura.trim() === '') {
              this.mostrarError('Debe ingresar la asignatura');
              return false;
            }
            
            if (!data.contrasena) {
              this.mostrarError('Debe ingresar la contraseña');
              return false;
            }

            // Validar contraseña
            if (data.contrasena !== this.CONTRASENA_PROFESOR) {
              this.mostrarError('Contraseña incorrecta');
              return false;
            }

            // Si todo es correcto, navegar a la página del profesor
            this.router.navigate(['/profesor'], {
              state: { 
                nombreProfesor: data.nombre,
                materia: data.asignatura,
                fechaAcceso: new Date().toLocaleString() 
              }
            });
            return true;
          }
        }
      ]
    });

    await alert.present();
  }

  async mostrarError(mensaje: string) {
    const errorAlert = await this.alertController.create({
      header: 'Error',
      message: mensaje,
      buttons: ['OK']
    });

    await errorAlert.present();
  }
}