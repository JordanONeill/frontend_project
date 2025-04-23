// This page allows users to track their sleep duration and quality
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StorageService, SleepEntry } from '../../services/storage.service';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { AlertController } from '@ionic/angular/standalone';
import {
  IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent,
  IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonItem, IonLabel,
  IonButton, IonList, IonListHeader, IonIcon, IonRange, IonNote
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-sleep-tracker',
  templateUrl: './sleep-tracker.page.html',
  styleUrls: ['./sleep-tracker.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent,
    IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonItem, IonLabel,
    IonButton, IonList, IonListHeader, IonIcon, IonRange, IonNote
  ]
})
export class SleepTrackerPage implements OnInit {
  sleepHours: number = 7;       // Default hours of sleep
  sleepQuality: number = 3;     // Default quality (1-5 scale)
  weekEntries: SleepEntry[] = [];
  averageHours: number = 0;
  averageQuality: number = 0;
  sleepGoal: number = 8;        // Default sleep goal in hours

  constructor(
    private storageService: StorageService,
    private alertController: AlertController
  ) { }

  ngOnInit() {
    this.loadSettings();
    this.loadSleepData();
  }

  // Load user's sleep goal from settings
  async loadSettings() {
    const settings = await this.storageService.getSettings();
    this.sleepGoal = settings.sleepGoal;
  }

  loadSleepData() {
    // Get date from 7 days ago
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const weekStartDate = sevenDaysAgo.toISOString().split('T')[0];
    
    // Get today's date
    const today = new Date().toISOString().split('T')[0];
    
    this.storageService.sleepEntries.subscribe(entries => {
      // Get entries for the last 7 days
      this.weekEntries = entries
        .filter(entry => {
          const entryDate = entry.date.split('T')[0];
          return entryDate >= weekStartDate && entryDate <= today;
        })
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // Sort by date desc
      
      // Calculate averages
      if (this.weekEntries.length > 0) {
        this.averageHours = this.weekEntries.reduce((sum, entry) => sum + entry.hours, 0) / this.weekEntries.length;
        this.averageQuality = this.weekEntries.reduce((sum, entry) => sum + entry.quality, 0) / this.weekEntries.length;
      }
    });
  }

  async addSleepEntry() {
    // Create entry with current datetime
    const entry: SleepEntry = {
      date: new Date().toISOString(),
      hours: this.sleepHours,
      quality: this.sleepQuality
    };
    
    await this.storageService.addSleepEntry(entry);
    
    // Provide haptic feedback
    await Haptics.impact({ style: ImpactStyle.Light });
  }

  // Delete a sleep entry with confirmation
  async deleteEntry(entry: SleepEntry) {
    const alert = await this.alertController.create({
      header: 'Delete Entry',
      message: 'Are you sure you want to delete this sleep record?',
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
      await this.storageService.deleteSleepEntry(entry);
      await Haptics.impact({ style: ImpactStyle.Medium });
    }
  }

  // Format date for display
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
  }
  
  // Calculate sleep goal progress
  getSleepGoalStatus(): string {
    if (this.averageHours >= this.sleepGoal) {
      return "You're meeting your sleep goal. Great job!";
    } else if (this.averageHours >= this.sleepGoal - 1) {
      return "You're close to your sleep goal.";
    } else {
      return "You're below your sleep goal.";
    }
  }
  
  // Get color for sleep goal status
  getSleepGoalStatusColor(): string {
    if (this.averageHours >= this.sleepGoal) {
      return "success";
    } else if (this.averageHours >= this.sleepGoal - 1) {
      return "warning";
    } else {
      return "danger";
    }
  }
}