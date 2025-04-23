// sleep-tracker.page.ts
import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StorageService, SleepEntry } from '../../services/storage.service';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

@Component({
  selector: 'app-sleep-tracker',
  templateUrl: './sleep-tracker.page.html',
  styleUrls: ['./sleep-tracker.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class SleepTrackerPage implements OnInit {
  sleepHours: number = 7;
  sleepQuality: number = 3;
  weekEntries: SleepEntry[] = [];
  averageHours: number = 0;
  averageQuality: number = 0;

  constructor(private storageService: StorageService) { }

  ngOnInit() {
    this.loadSleepData();
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

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
  }
}