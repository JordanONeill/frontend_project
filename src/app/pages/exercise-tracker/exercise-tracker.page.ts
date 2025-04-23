// Complete the exercise-tracker.page.ts
import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StorageService, ExerciseEntry } from '../../services/storage.service';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

@Component({
  selector: 'app-exercise-tracker',
  templateUrl: './exercise-tracker.page.html',
  styleUrls: ['./exercise-tracker.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class ExerciseTrackerPage implements OnInit {
  exerciseType: string = 'walking';
  exerciseDuration: number = 30;
  todayEntries: ExerciseEntry[] = [];
  todayMinutes: number = 0;
  weekMinutes: number = 0;

  constructor(private storageService: StorageService) { }

  ngOnInit() {
    this.loadExerciseData();
  }

  loadExerciseData() {
    // Get today's date in format YYYY-MM-DD
    const today = new Date().toISOString().split('T')[0];
    
    // Get date from 7 days ago
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

  async deleteEntry(entry: ExerciseEntry) {
    // Implementation will be added in a more advanced version
    console.log('Delete entry:', entry);
  }

  formatTime(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  
  formatExerciseType(type: string): string {
    // Capitalize first letter
    return type.charAt(0).toUpperCase() + type.slice(1);
  }
}