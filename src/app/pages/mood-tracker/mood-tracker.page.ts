// This page allows users to track their mood and emotional wellbeing
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StorageService, MoodEntry } from '../../services/storage.service';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { AlertController } from '@ionic/angular/standalone';
import {
  IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent,
  IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonItem, IonLabel,
  IonButton, IonList, IonListHeader, IonIcon, IonTextarea
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-mood-tracker',
  templateUrl: './mood-tracker.page.html',
  styleUrls: ['./mood-tracker.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent,
    IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonItem, IonLabel,
    IonButton, IonList, IonListHeader, IonIcon, IonTextarea
  ]
})
export class MoodTrackerPage implements OnInit {
  selectedMood: string = '';  // Currently selected mood
  moodNotes: string = '';     // Optional notes about mood
  recentEntries: MoodEntry[] = [];

  constructor(
    private storageService: StorageService,
    private alertController: AlertController
  ) { }

  ngOnInit() {
    this.loadMoodData();
  }

  loadMoodData() {
    this.storageService.moodEntries.subscribe(entries => {
      // Sort by date, most recent first
      this.recentEntries = entries
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 10); // Show only 10 most recent entries
    });
  }

  // Handle mood selection with visual feedback
  selectMood(mood: string) {
    this.selectedMood = mood;
    // Provide haptic feedback
    Haptics.impact({ style: ImpactStyle.Light });
  }

  async addMoodEntry() {
    if (!this.selectedMood) return;
    
    // Create entry with current datetime
    const entry: MoodEntry = {
      date: new Date().toISOString(),
      mood: this.selectedMood,
      notes: this.moodNotes || undefined
    };
    
    await this.storageService.addMoodEntry(entry);
    
    // Provide haptic feedback
    await Haptics.impact({ style: ImpactStyle.Medium });
    
    // Reset form
    this.selectedMood = '';
    this.moodNotes = '';
  }

  // Delete a mood entry with confirmation
  async deleteEntry(entry: MoodEntry) {
    const alert = await this.alertController.create({
      header: 'Delete Entry',
      message: 'Are you sure you want to delete this mood entry?',
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
      await this.storageService.deleteMoodEntry(entry);
      await Haptics.impact({ style: ImpactStyle.Medium });
    }
  }

  // Get the appropriate icon for each mood
  getMoodIcon(mood: string): string {
    const icons: {[key: string]: string} = {
      'happy': 'happy-outline',
      'calm': 'leaf-outline',
      'neutral': 'radio-button-off-outline',
      'stressed': 'thunderstorm-outline',
      'sad': 'sad-outline'
    };
    
    return icons[mood] || 'help-outline';
  }

  // Format mood text for display (capitalize)
  formatMood(mood: string): string {
    return mood.charAt(0).toUpperCase() + mood.slice(1);
  }

  // Format date string for readable display
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' }) + 
           ' at ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
}