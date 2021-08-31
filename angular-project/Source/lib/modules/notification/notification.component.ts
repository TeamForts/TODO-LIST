import {animate, state, style, transition, trigger} from '@angular/animations';
import {Component, ComponentRef, HostBinding, Input, OnDestroy, OnInit} from '@angular/core';
import {NotificationTypes} from './notification-types';
import {NotificationService} from './notification.service';
import {ModalComponent} from '../modal/modal-component.interface';

@Component({
  selector: 'ccl-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
  animations: [
    trigger('messageToastInOut', [
      state(
        'displayed',
        style({
          height: '*',
          opacity: 1,
          margin: '10px 0',
        })
      ),
      state(
        'hidden',
        style({
          height: 0,
          opacity: 0,
          margin: 0,
        })
      ),
      transition('displayed <=> hidden', animate('200ms ease-in')),
    ]),
  ],
})
export class CisNotificationComponent implements OnInit, OnDestroy, ModalComponent<CisNotificationComponent> {
  private _timer!: any;

  public componentRef!: ComponentRef<CisNotificationComponent>;
  public iconName = '';

  @HostBinding('@messageToastInOut')
  public state = 'hidden';

  @Input()
  @HostBinding('class')
  public type: NotificationTypes = NotificationTypes.INFO;

  @Input()
  public time!: number;

  @Input()
  public text!: string;

  constructor(private readonly _notification: NotificationService) {}

  public ngOnInit(): void {
    if (!isNaN(+this.time)) {
      this._timer = setTimeout(() => {
        this._notification.closeNotification<CisNotificationComponent>(this.componentRef);
      }, this.time);
    }

    switch (this.type) {
      case 'info': {
        this.iconName = 'dx-icon-info';
        break;
      }
      case 'success': {
        this.iconName = 'dx-icon-todo';
        break;
      }
      case 'error': {
        this.iconName = 'dx-icon-warning';
        break;
      }
    }
  }

  public ngOnDestroy(): void {
    if (this._timer) {
      clearTimeout(this._timer);
    }
  }

  public closeNotification(): void {
    if (this._timer) {
      clearTimeout(this._timer);
    }

    this._notification.closeNotification<CisNotificationComponent>(this.componentRef);
  }
}
