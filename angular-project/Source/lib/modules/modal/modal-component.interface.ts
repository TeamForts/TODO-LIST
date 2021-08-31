import {ComponentRef} from '@angular/core';

export interface ModalComponent<T> {
  componentRef: ComponentRef<T>;
}
