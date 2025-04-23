// This page allows users to track their daily water intake
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StorageService, WaterEntry } from '../../services/storage.service';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { AlertController } from '@ionic/angular/standalone';
import {
  IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent,
  IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonItem, IonLabel,
  IonInput, IonButton, IonList, IonListHeader, IonIcon, IonNote
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-water-tracker',
  templateUrl: './water-tracker.page.html',
  styleUrls: ['./water-tracker.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent,
    IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonItem, IonLabel,
    IonInput, IonButton, IonList, IonListHeader, IonIcon
  ]
})
export class WaterTrackerPage implements OnInit {
  waterAmount: number = 250; // Default amount
  dailyGoal: number = 2000; // Default goal (ml)
  todayTotal: number = 0;
  waterPercentage: number = 0;
  todayEntries: WaterEntry[] = [];

  constructor(
    private storageService: StorageService,
    private alertController: AlertController
  ) { }

  ngOnInit() {
    this.loadSettings();
    this.loadTodayEntries();
  }

  // Load user's water goal from settings
  async loadSettings() {
    const settings = await this.storageService.getSettings();
    this.dailyGoal = settings.waterGoal;
  }

  loadTodayEntries() {
    // Get today's date in format YYYY-MM-DD
    const today = new Date().toISOString().split('T')[0];
    
    this.storageService.waterEntries.subscribe(entries => {
      // Filter entries for today
      this.todayEntries = entries.filter(entry => entry.date.startsWith(today));
      
      // Calculate total water intake for today
      this.todayTotal = this.todayEntries.reduce((total, entry) => total + entry.amount, 0);
      
      // Calculate percentage for visual representation (cap at 100%)
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
    
    // Provide haptic feedback for tactile response
    await Haptics.impact({ style: ImpactStyle.Light });
    
    // Reset amount to default
    this.waterAmount = 250;
  }

  // Quick add button functionality
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

  // Delete an entry with confirmation
  async deleteEntry(entry: WaterEntry) {
    const alert = await this.alertController.create({
      header: 'Delete Entry',
      message: 'Are you sure you want to delete this entry?',
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
      // If they clicked delete button
      await this.storageService.deleteWaterEntry(entry);
      await Haptics.impact({ style: ImpactStyle.Medium });
    }
  }

  // Format ISO time string to readable format
  formatTime(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
}