import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.page').then(m => m.HomePage)
  },
  {
    path: 'water',
    loadComponent: () => import('./pages/water-tracker/water-tracker.page').then(m => m.WaterTrackerPage)
  },
  {
    path: 'exercise',
    loadComponent: () => import('./pages/exercise-tracker/exercise-tracker.page').then(m => m.ExerciseTrackerPage)
  },
  {
    path: 'sleep',
    loadComponent: () => import('./pages/sleep-tracker/sleep-tracker.page').then(m => m.SleepTrackerPage)
  },
  {
    path: 'mood',
    loadComponent: () => import('./pages/mood-tracker/mood-tracker.page').then(m => m.MoodTrackerPage)
  },
  {
    path: 'insights',
    loadComponent: () => import('./pages/insights/insights.page').then(m => m.InsightsPage)
  },
  {
    path: 'settings',
    loadComponent: () => import('./pages/settings/settings.page').then(m => m.SettingsPage)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  }
];