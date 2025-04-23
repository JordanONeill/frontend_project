import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-sleep-tracker',
  templateUrl: './sleep-tracker.page.html',
  styleUrls: ['./sleep-tracker.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class SleepTrackerPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
