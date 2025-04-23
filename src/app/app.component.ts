// src/app/app.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StorageService } from './services/storage.service';
import { App } from '@capacitor/app';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons'; 
import { 
  home, homeOutline, 
  water, waterOutline, 
  fitness, fitnessOutline, 
  moon, moonOutline, 
  happy, happyOutline, 
  sad, sadOutline, 
  barChart, barChartOutline,
  analytics, analyticsOutline,
  settings, settingsOutline,
  trash, trashOutline,
  star, starOutline,
  leaf, leafOutline,
  radioButtonOff, radioButtonOffOutline,
  thunderstorm, thunderstormOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [IonApp, IonRouterOutlet, CommonModule],
})
export class AppComponent {
  constructor(private storageService: StorageService) {
    this.initializeApp();
    
    // Register all icons used in the app
    addIcons({
      'home': home,
      'home-outline': homeOutline,
      'water': water,
      'water-outline': waterOutline,
      'fitness': fitness,
      'fitness-outline': fitnessOutline,
      'moon': moon,
      'moon-outline': moonOutline,
      'happy': happy,
      'happy-outline': happyOutline,
      'sad': sad,
      'sad-outline': sadOutline,
      'bar-chart': barChart,
      'bar-chart-outline': barChartOutline,
      'analytics': analytics,
      'analytics-outline': analyticsOutline,
      'settings': settings,
      'settings-outline': settingsOutline,
      'trash': trash,
      'trash-outline': trashOutline,
      'star': star,
      'star-outline': starOutline,
      'leaf': leaf,
      'leaf-outline': leafOutline,
      'radio-button-off': radioButtonOff,
      'radio-button-off-outline': radioButtonOffOutline,
      'thunderstorm': thunderstorm,
      'thunderstorm-outline': thunderstormOutline
    });
  }

  async initializeApp() {
    // Initialize services
    await this.storageService.init();
    
    // Handle back button for Android devices
    App.addListener('backButton', ({ canGoBack }) => {
      if (!canGoBack) {
        App.exitApp();
      }
    });
  }
}