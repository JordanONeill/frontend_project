// insights.page.ts
import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-insights',
  templateUrl: './insights.page.html',
  styleUrls: ['./insights.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class InsightsPage implements OnInit {
  selectedSegment: string = 'summary';
  weekWaterTotal: number = 0;
  weekExerciseTotal: number = 0;
  averageSleepHours: number = 0;
  averageSleepQuality: number = 0;
  mostFrequentMood: string = 'Unknown';

  constructor(private storageService: StorageService) { }

  ngOnInit() {
    this.loadInsightsData();
  }

  segmentChanged(event: any) {
    this.selectedSegment = event.detail.value;
  }

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
        // Find most frequent mood
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
}