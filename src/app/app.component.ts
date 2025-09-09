import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {
  constructor() {}
  public appPages = [
    { title: 'Home', url: 'home', icon: ''  },
    { title: 'Estudiante', url: 'estudiante', icon: ''  },
    { title: 'Profesor', url: 'profesor', icon: ''  },
    { title: 'Admin', url: 'admin', icon: ''  },
  ]
}
