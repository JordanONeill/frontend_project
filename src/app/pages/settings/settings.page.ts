// src/app/pages/settings/settings.page.ts
// This page allows users to configure app settings and preferences
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StorageService } from '../../services/storage.service';
import { LocalNotifications } from '@capacitor/local-notifications';
import { AlertController } from '@ionic/angular/standalone';
import {
  IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent,
  IonList, IonListHeader, IonItem, IonLabel, IonInput, IonToggle, IonIcon,
  IonButton
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent,
    IonList, IonListHeader, IonItem, IonLabel, IonInput, IonToggle, IonIcon
  ]
})
export class SettingsPage implements OnInit {
  waterGoal: number = 2000;              // Default water goal in ml
  exerciseGoal: number = 150;            // Default exercise goal in minutes per week
  sleepGoal: number = 8;                 // Default sleep goal in hours
  notificationsEnabled: boolean = false; // Default notifications setting

  constructor(
    private storageService: StorageService,
    private alertController: AlertController
  ) { }

  ngOnInit() {
    this.loadSettings();
  }

  // Load saved user settings
  async loadSettings() {
    const settings = await this.storageService.getSettings();
    
    this.waterGoal = settings.waterGoal;
    this.exerciseGoal = settings.exerciseGoal;
    this.sleepGoal = settings.sleepGoal;
    this.notificationsEnabled = settings.notificationsEnabled;
  }

  // Save user preferences when changed
  async saveSettings() {
    const settings = {
      waterGoal: this.waterGoal,
      exerciseGoal: this.exerciseGoal,
      sleepGoal: this.sleepGoal,
      notificationsEnabled: this.notificationsEnabled
    };
    
    await this.storageService.saveSettings(settings);
  }

  // Handle notification toggle changes
  async toggleNotifications() {
    if (this.notificationsEnabled) {
      // Request permission for notifications
      const permStatus = await LocalNotifications.requestPermissions();
      
      if (permStatus.display !== 'granted') {
        this.notificationsEnabled = false;
        
        const alert = await this.alertController.create({
          header: 'Permission Required',
          message: 'Please enable notifications in your device settings to receive reminders.',
          buttons: ['OK']
        });
        
        await alert.present();
      } else {
        // Schedule daily reminder notifications
        await this.scheduleReminders();
        
        // Show confirmation notification
        await LocalNotifications.schedule({
          notifications: [
            {
              title: 'Wellness Buddy',
              body: 'Notifications are now enabled!',
              id: 1,
              schedule: { at: new Date(Date.now() + 3000) }
            }
          ]
        });
      }
    } else {
      // Cancel all scheduled notifications
      await LocalNotifications.cancel({ notifications: [] });
    }
    
    await this.saveSettings();
  }
  
  // Set up daily reminder notifications
  async scheduleReminders() {
    // Create array for notification objects
    const notifications = [];
    
    // Water reminder at 10:00 AM
    const waterTime = new Date();
    waterTime.setHours(10, 0, 0);
    if (waterTime.getTime() < Date.now()) {
      waterTime.setDate(waterTime.getDate() + 1);
    }
    
    notifications.push({
      id: 101,
      title: 'Wellness Buddy',
      body: 'Remember to stay hydrated today!',
      schedule: {
        at: waterTime,
        repeating: true,
        every: 'day' as const
      }
    });
    
    // Exercise reminder at 5:00 PM
    const exerciseTime = new Date();
    exerciseTime.setHours(17, 0, 0);
    if (exerciseTime.getTime() < Date.now()) {
      exerciseTime.setDate(exerciseTime.getDate() + 1);
    }
    
    notifications.push({
      id: 102,
      title: 'Wellness Buddy',
      body: 'Time for some physical activity!',
      schedule: {
        at: exerciseTime,
        repeating: true,
        every: 'day' as const
      }
    });
    
    // Sleep reminder at 9:30 PM
    const sleepTime = new Date();
    sleepTime.setHours(21, 30, 0);
    if (sleepTime.getTime() < Date.now()) {
      sleepTime.setDate(sleepTime.getDate() + 1);
    }
    
    notifications.push({
      id: 103,
      title: 'Wellness Buddy',
      body: 'Don\'t forget to log your mood before bed!',
      schedule: {
        at: sleepTime,
        repeating: true,
        every: 'day' as const
      }
    });
    
    // Schedule all notifications
    await LocalNotifications.schedule({
      notifications: notifications
    });
  }

  // Clear all user data with confirmation
  async clearAllData() {
    const alert = await this.alertController.create({
      header: 'Clear All Data',
      message: 'Are you sure you want to delete all your wellness data? This action cannot be undone.',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Delete',
          role: 'destructive'
        }
      ]
    });
    
    await alert.present();
    
    const result = await alert.onDidDismiss();
    if (result.role === 'destructive') {
      // Clear all data except settings
      await this.storageService.clearData();
      
      const successAlert = await this.alertController.create({
        header: 'Data Cleared',
        message: 'All your wellness data has been deleted.',
        buttons: ['OK']
      });
      
      await successAlert.present();
    }
  }
}