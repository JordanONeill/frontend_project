import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WaterTrackerPage } from './water-tracker.page';

describe('WaterTrackerPage', () => {
  let component: WaterTrackerPage;
  let fixture: ComponentFixture<WaterTrackerPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(WaterTrackerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
