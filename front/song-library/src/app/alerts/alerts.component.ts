import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { Input } from '@angular/core';
import { Alert } from './alert';

@Component({
  selector: 'app-alerts',
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.css']
})
export class AlertsComponent implements OnInit {

  alerts: Alert[] = [];

  @Input() newAlert: Subject<Alert> = new Subject<Alert>();

  constructor() { }

  ngOnInit(): void {

    // on receipt of a new alert,
    //  add it to the array of alerts and schedule its removal
    this.newAlert.subscribe((alert: Alert) => {
      this.alerts.push(alert);
      setTimeout(() => this.close(alert), 3500);
    })
  }

  // remove the given alert from the array of alerts
  close(alert: Alert) {
    this.alerts.splice(this.alerts.indexOf(alert), 1);
  }

}
