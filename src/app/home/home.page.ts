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
import { IonicModule } from '@ionic/angular/standalone';
import { 
  IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardContent, 
  IonGrid, IonRow, IonCol, IonIcon, IonButton, IonFooter, IonLabel, 
  IonTabBar, IonTabButton, IonTabs
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    IonicModule,
    IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardContent,
    IonGrid, IonRow, IonCol, IonIcon, IonButton, IonFooter, IonLabel,
    IonTabBar, IonTabButton, IonTabs
  ]
})

export class HomePage implements OnInit {
  constructor() {}
}
