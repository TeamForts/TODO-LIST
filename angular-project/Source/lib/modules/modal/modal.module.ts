import {NgModule} from '@angular/core';
import {CisModalComponent} from './modal.component';
import {ModalService} from './modal.service';

@NgModule({
  declarations: [CisModalComponent],
  providers: [ModalService],
  exports: [CisModalComponent],
})
export class ModalModule {}
