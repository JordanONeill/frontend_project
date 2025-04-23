// mood-tracker.page.ts
import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StorageService, MoodEntry } from '../../services/storage.service';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

@Component({
  selector: 'app-mood-tracker',
  templateUrl: './mood-tracker.page.html',
  styleUrls: ['./mood-tracker.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class MoodTrackerPage implements OnInit {
  selectedMood: string = '';
  moodNotes: string = '';
  recentEntries: MoodEntry[] = [];

  constructor(private storageService: StorageService) { }

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

  formatMood(mood: string): string {
    return mood.charAt(0).toUpperCase() + mood.slice(1);
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' }) + 
           ' at ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
}