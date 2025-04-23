import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-exercise-tracker',
  templateUrl: './exercise-tracker.page.html',
  styleUrls: ['./exercise-tracker.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class ExerciseTrackerPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
