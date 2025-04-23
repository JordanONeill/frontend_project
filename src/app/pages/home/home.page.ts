import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  StorageService, 
  WaterEntry, 
  ExerciseEntry,
  SleepEntry,
  MoodEntry 
} from '../../services/storage.service';
import { QuotesService } from '../../services/quotes.service';
import { 
  IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardContent, 
  IonGrid, IonRow, IonCol, IonIcon, IonButton, IonFooter, IonLabel, 
  IonTabBar, IonTabButton, IonTabs, IonRouterOutlet
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardContent,
    IonGrid, IonRow, IonCol, IonIcon, IonButton, IonFooter, IonLabel,
    IonTabBar, IonTabButton, IonTabs, IonRouterOutlet
  ]
})
export class HomePage implements OnInit {
  todayWater: WaterEntry | null = null;
  todayExercise: ExerciseEntry | null = null;
  todaySleep: SleepEntry | null = null;
  todayMood: MoodEntry | null = null;
  
  quoteText: string = 'Loading your wellness inspiration...';
  quoteAuthor: string = '';

  constructor(
    private router: Router,
    private storageService: StorageService,
    private quotesService: QuotesService
  ) {}

  ngOnInit() {
    // Get today's date in format YYYY-MM-DD
    const today = new Date().toISOString().split('T')[0];
    
    // Subscribe to water entries
    this.storageService.waterEntries.subscribe(entries => {
      this.todayWater = entries.find(entry => entry.date === today) || null;
    });
    
    // Subscribe to exercise entries
    this.storageService.exerciseEntries.subscribe(entries => {
      this.todayExercise = entries.find(entry => entry.date === today) || null;
    });
    
    // Subscribe to sleep entries
    this.storageService.sleepEntries.subscribe(entries => {
      this.todaySleep = entries.find(entry => entry.date === today) || null;
    });
    
    // Subscribe to mood entries
    this.storageService.moodEntries.subscribe(entries => {
      this.todayMood = entries.find(entry => entry.date === today) || null;
    });
    
    // Use a static quote for now to get things working
    this.quoteText = "Take care of your body. It's the only place you have to live.";
    this.quoteAuthor = "Jim Rohn";
    
    // Later, we can try the API call again
    // this.loadRandomQuote();
  }
  
  navigateTo(path: string) {
    this.router.navigate([path]);
  }
  
  loadRandomQuote() {
    this.quotesService.getRandomQuote().subscribe({
      next: (quotes) => {
        if (quotes && quotes.length > 0) {
          // Get a random quote from the array
          const randomIndex = Math.floor(Math.random() * quotes.length);
          const randomQuote = quotes[randomIndex];
          this.quoteText = randomQuote.text || 'Be the best version of yourself today!';
          this.quoteAuthor = randomQuote.author || 'Unknown';
        }
      },
      error: (err) => {
        console.error('Error fetching quote:', err);
        this.quoteText = 'Every day is a new opportunity to improve your wellbeing.';
        this.quoteAuthor = 'Wellness Buddy';
      }
    });
  }
}