import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-mood-tracker',
  templateUrl: './mood-tracker.page.html',
  styleUrls: ['./mood-tracker.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class MoodTrackerPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
