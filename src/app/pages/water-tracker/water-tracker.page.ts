import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StorageService, WaterEntry } from '../../services/storage.service';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

@Component({
  selector: 'app-water-tracker',
  templateUrl: './water-tracker.page.html',
  styleUrls: ['./water-tracker.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class WaterTrackerPage implements OnInit {
  waterAmount: number = 250; // Default amount
  dailyGoal: number = 2000; // Default goal (ml)
  todayTotal: number = 0;
  waterPercentage: number = 0;
  todayEntries: WaterEntry[] = [];

  constructor(private storageService: StorageService) { }

  ngOnInit() {
    this.loadTodayEntries();
  }

  loadTodayEntries() {
    // Get today's date in format YYYY-MM-DD
    const today = new Date().toISOString().split('T')[0];
    
    this.storageService.waterEntries.subscribe(entries => {
      // Filter entries for today
      this.todayEntries = entries.filter(entry => entry.date.startsWith(today));
      
      // Calculate total water intake for today
      this.todayTotal = this.todayEntries.reduce((total, entry) => total + entry.amount, 0);
      
      // Calculate percentage for visual representation
      this.waterPercentage = Math.min(100, (this.todayTotal / this.dailyGoal) * 100);
    });
  }

  async addWaterEntry() {
    if (this.waterAmount <= 0) return;
    
    // Create entry with current datetime
    const entry: WaterEntry = {
      date: new Date().toISOString(),
      amount: this.waterAmount
    };
    
    await this.storageService.addWaterEntry(entry);
    
    // Provide haptic feedback
    await Haptics.impact({ style: ImpactStyle.Light });
    
    // Reset amount to default
    this.waterAmount = 250;
  }

  async quickAdd(amount: number) {
    // Add specified amount
    const entry: WaterEntry = {
      date: new Date().toISOString(),
      amount: amount
    };
    
    await this.storageService.addWaterEntry(entry);
    
    // Provide haptic feedback
    await Haptics.impact({ style: ImpactStyle.Light });
  }

  async deleteEntry(entry: WaterEntry) {
    // Implementation will be added
    // For now, this is a placeholder
    console.log('Delete entry:', entry);
  }

  formatTime(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
}