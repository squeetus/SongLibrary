import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Alert } from './alert';

import { AlertsComponent } from './alerts.component';

describe('AlertsComponent', () => {
  let component: AlertsComponent;
  let fixture: ComponentFixture<AlertsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AlertsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should add an alert-messages div', () => {
    expect(fixture.nativeElement.querySelector('.alert-messages')).toBeTruthy();
  });

  it('should receive new data from newAlert', () => {
    expect(component.alerts.length).toBe(0);
    component.newAlert.next({
      type: 'success',
      message: 'an alert message',
    });
    expect(component.alerts.length).toBe(1);
  });

  it('should delete alerts after 3.5 seconds', () => {
    expect(component.alerts.length).toBe(0);
    component.newAlert.next({
      type: 'success',
      message: 'an alert message',
    });
    expect(component.alerts.length).toBe(1);
    setTimeout(() => {
      expect(component.alerts.length).toBe(0);
    }, 3500);
  });
});
