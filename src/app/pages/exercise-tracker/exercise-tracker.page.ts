// This page allows users to log and track their exercise activities
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StorageService, ExerciseEntry } from '../../services/storage.service';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { AlertController } from '@ionic/angular/standalone';
import {
  IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent,
  IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonItem, IonLabel,
  IonInput, IonButton, IonList, IonListHeader, IonIcon, IonSelect, IonSelectOption
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-exercise-tracker',
  templateUrl: './exercise-tracker.page.html',
  styleUrls: ['./exercise-tracker.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent,
    IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonItem, IonLabel,
    IonInput, IonButton, IonList, IonListHeader, IonIcon, IonSelect, IonSelectOption
  ]
})
export class ExerciseTrackerPage implements OnInit {
  exerciseType: string = 'walking'; // Default activity type
  exerciseDuration: number = 30;    // Default duration in minutes
  todayEntries: ExerciseEntry[] = [];
  todayMinutes: number = 0;
  weekMinutes: number = 0;
  exerciseGoal: number = 150;       // Default weekly goal in minutes

  constructor(
    private storageService: StorageService,
    private alertController: AlertController
  ) { }

  ngOnInit() {
    this.loadSettings();
    this.loadExerciseData();
  }

  // Load user's exercise goal from settings
  async loadSettings() {
    const settings = await this.storageService.getSettings();
    this.exerciseGoal = settings.exerciseGoal;
  }

  loadExerciseData() {
    // Get today's date in format YYYY-MM-DD
    const today = new Date().toISOString().split('T')[0];
    
    // Get date from 7 days ago for weekly calculation
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const weekStartDate = sevenDaysAgo.toISOString().split('T')[0];
    
    this.storageService.exerciseEntries.subscribe(entries => {
      // Filter entries for today
      this.todayEntries = entries.filter(entry => entry.date.startsWith(today));
      
      // Calculate total minutes for today
      this.todayMinutes = this.todayEntries.reduce((total, entry) => total + entry.duration, 0);
      
      // Calculate total minutes for the week
      const weekEntries = entries.filter(entry => {
        const entryDate = entry.date.split('T')[0];
        return entryDate >= weekStartDate && entryDate <= today;
      });
      
      this.weekMinutes = weekEntries.reduce((total, entry) => total + entry.duration, 0);
    });
  }

  async addExerciseEntry() {
    if (this.exerciseDuration <= 0) return;
    
    // Create entry with current datetime
    const entry: ExerciseEntry = {
      date: new Date().toISOString(),
      type: this.exerciseType,
      duration: this.exerciseDuration
    };
    
    await this.storageService.addExerciseEntry(entry);
    
    // Provide haptic feedback
    await Haptics.impact({ style: ImpactStyle.Medium });
  }

  // Delete an entry with confirmation
  async deleteEntry(entry: ExerciseEntry) {
    const alert = await this.alertController.create({
      header: 'Delete Entry',
      message: 'Are you sure you want to delete this exercise entry?',
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
      await this.storageService.deleteExerciseEntry(entry);
      await Haptics.impact({ style: ImpactStyle.Medium });
    }
  }

  // Format ISO time string to readable format
  formatTime(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  
  // Capitalize the first letter of exercise type
  formatExerciseType(type: string): string {
    return type.charAt(0).toUpperCase() + type.slice(1);
  }
  
  // Calculate percentage of weekly goal achieved
  getGoalPercentage(): number {
    return Math.min(100, (this.weekMinutes / this.exerciseGoal) * 100);
  }
}