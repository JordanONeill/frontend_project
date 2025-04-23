// settings.page.ts
import { Component, OnInit } from '@angular/core';
import { IonicModule, AlertController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StorageService } from '../../services/storage.service';
import { LocalNotifications } from '@capacitor/local-notifications';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class SettingsPage implements OnInit {
  waterGoal: number = 2000;
  exerciseGoal: number = 150;
  sleepGoal: number = 8;
  notificationsEnabled: boolean = false;

  constructor(
    private storageService: StorageService,
    private alertController: AlertController
  ) { }

  ngOnInit() {
    this.loadSettings();
  }

  async loadSettings() {
    // Get settings from storage
    const settings = await this.storageService.storage?.get('userSettings') || {
      waterGoal: 2000,
      exerciseGoal: 150,
      sleepGoal: 8,
      notificationsEnabled: false
    };
    
    this.waterGoal = settings.waterGoal;
    this.exerciseGoal = settings.exerciseGoal;
    this.sleepGoal = settings.sleepGoal;
    this.notificationsEnabled = settings.notificationsEnabled;
  }

  async saveSettings() {
    const settings = {
      waterGoal: this.waterGoal,
      exerciseGoal: this.exerciseGoal,
      sleepGoal: this.sleepGoal,
      notificationsEnabled: this.notificationsEnabled
    };
    
    await this.storageService.storage?.set('userSettings', settings);
  }

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
        // Schedule a test notification
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
    }
    
    await this.saveSettings();
  }

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
          role: 'destructive',
          handler: async () => {
            // Clear all data except settings
            await this.storageService.storage?.remove('waterEntries');
            await this.storageService.storage?.remove('exerciseEntries');
            await this.storageService.storage?.remove('sleepEntries');
            await this.storageService.storage?.remove('moodEntries');
            
            // Reload data in services
            this.storageService.loadWaterEntries();
            this.storageService.loadExerciseEntries();
            this.storageService.loadSleepEntries();
            this.storageService.loadMoodEntries();
            
            const successAlert = await this.alertController.create({
              header: 'Data Cleared',
              message: 'All your wellness data has been deleted.',
              buttons: ['OK']
            });
            
            await successAlert.present();
          }
        }
      ]
    });
    
    await alert.present();
  }
}