import {Component, EventEmitter, HostListener, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'ccl-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class CisModalComponent implements OnInit {
  @Input()
  public closeDirectly: boolean | string = false;
  @Input()
  public actionsPosition: string | undefined;
  @Input()
  public width: string | undefined;
  @Output()
  public close: EventEmitter<MouseEvent> = new EventEmitter<MouseEvent>();

  constructor() {}

  @HostListener('click', ['$event'])
  public onMaskClick(event: MouseEvent): void {
    if (!this.closeDirectly) {
      this.close.emit(event);
    }
  }

  public ngOnInit(): void {
    if (typeof this.closeDirectly === 'string') {
      this.closeDirectly = this.closeDirectly === 'true';
    }
  }

  public onDialogClose(event: MouseEvent): void {
    this.close.emit(event);
  }
}
