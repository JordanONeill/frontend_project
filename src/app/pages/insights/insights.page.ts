// src/app/pages/insights/insights.page.ts
// This page shows analytics and insights from the user's wellness data
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StorageService } from '../../services/storage.service';
import {
  IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent,
  IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonItem, IonLabel,
  IonList, IonIcon
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-insights',
  templateUrl: './insights.page.html',
  styleUrls: ['./insights.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent,
    IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonItem, IonLabel,
    IonList, IonIcon
  ]
})
export class InsightsPage implements OnInit {
  weekWaterTotal: number = 0;
  weekExerciseTotal: number = 0;
  averageSleepHours: number = 0;
  averageSleepQuality: number = 0;
  mostFrequentMood: string = 'Unknown';
  
  // Goals for comparison
  waterGoal: number = 2000;    // Daily water goal in ml
  exerciseGoal: number = 150;  // Weekly exercise goal in minutes
  sleepGoal: number = 8;       // Daily sleep goal in hours

  constructor(private storageService: StorageService) { }

  ngOnInit() {
    this.loadSettings();
    this.loadInsightsData();
  }

  // Load user's goals from settings
  async loadSettings() {
    const settings = await this.storageService.getSettings();
    this.waterGoal = settings.waterGoal;
    this.exerciseGoal = settings.exerciseGoal;
    this.sleepGoal = settings.sleepGoal;
  }

  // Load and process all wellness data
  loadInsightsData() {
    // Get date from 7 days ago
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const weekStartDate = sevenDaysAgo.toISOString().split('T')[0];
    
    // Get today's date
    const today = new Date().toISOString().split('T')[0];
    
    // Get water data
    this.storageService.waterEntries.subscribe(entries => {
      // Filter entries for the week
      const weekEntries = entries.filter(entry => {
        const entryDate = entry.date.split('T')[0];
        return entryDate >= weekStartDate && entryDate <= today;
      });
      
      // Calculate total water for the week
      this.weekWaterTotal = weekEntries.reduce((total, entry) => total + entry.amount, 0);
    });
    
    // Get exercise data
    this.storageService.exerciseEntries.subscribe(entries => {
      // Filter entries for the week
      const weekEntries = entries.filter(entry => {
        const entryDate = entry.date.split('T')[0];
        return entryDate >= weekStartDate && entryDate <= today;
      });
      
      // Calculate total exercise minutes for the week
      this.weekExerciseTotal = weekEntries.reduce((total, entry) => total + entry.duration, 0);
    });
    
    // Get sleep data
    this.storageService.sleepEntries.subscribe(entries => {
      // Filter entries for the week
      const weekEntries = entries.filter(entry => {
        const entryDate = entry.date.split('T')[0];
        return entryDate >= weekStartDate && entryDate <= today;
      });
      
      if (weekEntries.length > 0) {
        // Calculate average sleep hours and quality
        this.averageSleepHours = weekEntries.reduce((sum, entry) => sum + entry.hours, 0) / weekEntries.length;
        this.averageSleepQuality = weekEntries.reduce((sum, entry) => sum + entry.quality, 0) / weekEntries.length;
      }
    });
    
    // Get mood data
    this.storageService.moodEntries.subscribe(entries => {
      // Filter entries for the week
      const weekEntries = entries.filter(entry => {
        const entryDate = entry.date.split('T')[0];
        return entryDate >= weekStartDate && entryDate <= today;
      });
      
      if (weekEntries.length > 0) {
        // Find most frequent mood using a frequency counter
        const moodCounts: {[key: string]: number} = {};
        
        weekEntries.forEach(entry => {
          moodCounts[entry.mood] = (moodCounts[entry.mood] || 0) + 1;
        });
        
        let maxCount = 0;
        let mostFrequent = 'Unknown';
        
        for (const mood in moodCounts) {
          if (moodCounts[mood] > maxCount) {
            maxCount = moodCounts[mood];
            mostFrequent = mood;
          }
        }
        
        this.mostFrequentMood = mostFrequent.charAt(0).toUpperCase() + mostFrequent.slice(1);
      }
    });
  }
  
  // Get personalized wellness tips based on user data
  getWellnessTip(): string {
    // Basic logic for generating personalized tips
    if (this.weekWaterTotal < this.waterGoal * 7 * 0.7) {
      return "Try to increase your daily water intake for better hydration.";
    } else if (this.weekExerciseTotal < this.exerciseGoal * 0.7) {
      return "Even short exercise sessions can improve your energy and mood.";
    } else if (this.averageSleepHours < this.sleepGoal - 1) {
      return "Getting enough sleep is crucial for your overall wellbeing.";
    } else if (this.mostFrequentMood === 'Stressed' || this.mostFrequentMood === 'Sad') {
      return "Consider adding relaxation activities to your daily routine.";
    } else {
      return "You're doing great! Keep up the good work with your wellness habits.";
    }
  }
}