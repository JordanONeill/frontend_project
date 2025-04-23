import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { BehaviorSubject } from 'rxjs';

// Define interfaces for our data models
export interface WaterEntry {
  date: string;
  amount: number; // in ml
}

export interface ExerciseEntry {
  date: string;
  type: string;
  duration: number; // in minutes
}

export interface SleepEntry {
  date: string;
  hours: number;
  quality: number; // 1-5 scale
}

export interface MoodEntry {
  date: string;
  mood: string; // happy, sad, anxious, etc.
  notes?: string;
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
}