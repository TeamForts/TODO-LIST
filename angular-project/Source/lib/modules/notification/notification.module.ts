import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {CisNotificationComponent} from './notification.component';
import {NotificationService} from './notification.service';

@NgModule({
  imports: [CommonModule, BrowserAnimationsModule],
  declarations: [CisNotificationComponent],
  exports: [CisNotificationComponent],
  providers: [NotificationService],
})
export class NotificationModule {}
