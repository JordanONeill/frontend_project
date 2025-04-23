// This service manages all data storage operations for the app
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { BehaviorSubject } from 'rxjs';

// Define interfaces for our data models
export interface WaterEntry {
  date: string;  // ISO date string
  amount: number; // in ml
}

export interface ExerciseEntry {
  date: string;  // ISO date string
  type: string;  // type of exercise (walking, running, etc.)
  duration: number; // in minutes
}

export interface SleepEntry {
  date: string;  // ISO date string
  hours: number; // hours of sleep
  quality: number; // 1-5 scale
}

export interface MoodEntry {
  date: string;  // ISO date string
  mood: string;  // happy, sad, anxious, etc.
  notes?: string; // optional notes about mood
}

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  // BehaviorSubjects to notify components of data changes
  private _waterEntries = new BehaviorSubject<WaterEntry[]>([]);
  private _exerciseEntries = new BehaviorSubject<ExerciseEntry[]>([]);
  private _sleepEntries = new BehaviorSubject<SleepEntry[]>([]);
  private _moodEntries = new BehaviorSubject<MoodEntry[]>([]);
  
  private _storage: Storage | null = null;
  
  constructor(private storage: Storage) {
    this.init();
  }
  
  // Initialize storage
  async init() {
    // Create storage instance
    const storage = await this.storage.create();
    this._storage = storage;
    
    // Load initial data
    this.loadWaterEntries();
    this.loadExerciseEntries();
    this.loadSleepEntries();
    this.loadMoodEntries();
  }
  
  // Water entries methods
  async loadWaterEntries() {
    const entries = await this._storage?.get('waterEntries') || [];
    this._waterEntries.next(entries);
  }
  
  get waterEntries() {
    return this._waterEntries.asObservable();
  }
  
  async addWaterEntry(entry: WaterEntry) {
    const entries = await this._storage?.get('waterEntries') || [];
    entries.push(entry);
    await this._storage?.set('waterEntries', entries);
    this._waterEntries.next(entries);
  }
  
  async deleteWaterEntry(entry: WaterEntry) {
    // Get current entries
    const entries = await this._storage?.get('waterEntries') || [];
    // Remove the entry with matching date
    const filteredEntries = entries.filter((e: WaterEntry) => e.date !== entry.date);
    // Save updated list
    await this._storage?.set('waterEntries', filteredEntries);
    // Update observable
    this._waterEntries.next(filteredEntries);
  }
  
  // Exercise entries methods
  async loadExerciseEntries() {
    const entries = await this._storage?.get('exerciseEntries') || [];
    this._exerciseEntries.next(entries);
  }
  
  get exerciseEntries() {
    return this._exerciseEntries.asObservable();
  }
  
  async addExerciseEntry(entry: ExerciseEntry) {
    const entries = await this._storage?.get('exerciseEntries') || [];
    entries.push(entry);
    await this._storage?.set('exerciseEntries', entries);
    this._exerciseEntries.next(entries);
  }
  
  async deleteExerciseEntry(entry: ExerciseEntry) {
    const entries = await this._storage?.get('exerciseEntries') || [];
    const filteredEntries = entries.filter((e: ExerciseEntry) => e.date !== entry.date);
    await this._storage?.set('exerciseEntries', filteredEntries);
    this._exerciseEntries.next(filteredEntries);
  }
  
  // Sleep entries methods
  async loadSleepEntries() {
    const entries = await this._storage?.get('sleepEntries') || [];
    this._sleepEntries.next(entries);
  }
  
  get sleepEntries() {
    return this._sleepEntries.asObservable();
  }
  
  async addSleepEntry(entry: SleepEntry) {
    const entries = await this._storage?.get('sleepEntries') || [];
    entries.push(entry);
    await this._storage?.set('sleepEntries', entries);
    this._sleepEntries.next(entries);
  }
  
  async deleteSleepEntry(entry: SleepEntry) {
    const entries = await this._storage?.get('sleepEntries') || [];
    const filteredEntries = entries.filter((e: SleepEntry) => e.date !== entry.date);
    await this._storage?.set('sleepEntries', filteredEntries);
    this._sleepEntries.next(filteredEntries);
  }
  
  // Mood entries methods
  async loadMoodEntries() {
    const entries = await this._storage?.get('moodEntries') || [];
    this._moodEntries.next(entries);
  }
  
  get moodEntries() {
    return this._moodEntries.asObservable();
  }
  
  async addMoodEntry(entry: MoodEntry) {
    const entries = await this._storage?.get('moodEntries') || [];
    entries.push(entry);
    await this._storage?.set('moodEntries', entries);
    this._moodEntries.next(entries);
  }
  
  async deleteMoodEntry(entry: MoodEntry) {
    const entries = await this._storage?.get('moodEntries') || [];
    const filteredEntries = entries.filter((e: MoodEntry) => e.date !== entry.date);
    await this._storage?.set('moodEntries', filteredEntries);
    this._moodEntries.next(filteredEntries);
  }
  
  // Settings methods
  async getSettings() {
    // Retrieve settings or return defaults if not found
    return await this._storage?.get('userSettings') || {
      waterGoal: 2000,
      exerciseGoal: 150,
      sleepGoal: 8,
      notificationsEnabled: false
    };
  }

  async saveSettings(settings: any) {
    await this._storage?.set('userSettings', settings);
  }

  async clearData() {
    // Remove all tracked data but keep settings
    await this._storage?.remove('waterEntries');
    await this._storage?.remove('exerciseEntries');
    await this._storage?.remove('sleepEntries');
    await this._storage?.remove('moodEntries');
    
    // Reload data to refresh observables
    this.loadWaterEntries();
    this.loadExerciseEntries();
    this.loadSleepEntries();
    this.loadMoodEntries();
  }
}