import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExerciseTrackerPage } from './exercise-tracker.page';

describe('ExerciseTrackerPage', () => {
  let component: ExerciseTrackerPage;
  let fixture: ComponentFixture<ExerciseTrackerPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ExerciseTrackerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
