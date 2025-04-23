import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SleepTrackerPage } from './sleep-tracker.page';

describe('SleepTrackerPage', () => {
  let component: SleepTrackerPage;
  let fixture: ComponentFixture<SleepTrackerPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SleepTrackerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
