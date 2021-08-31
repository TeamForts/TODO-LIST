import {
  ComponentFactory,
  ComponentFactoryResolver,
  ComponentRef,
  Injectable,
  Injector,
  Renderer2,
  RendererFactory2,
  ViewContainerRef,
} from '@angular/core';
import {NotificationDirections} from './notification-directions';
import {CisNotificationComponent} from './notification.component';
import {ModalComponent} from "../modal/modal-component.interface";

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private _rootContainerRef!: ViewContainerRef;
  private readonly _renderer: Renderer2;

  public set rootContainerRef(reference: ViewContainerRef) {
    this._rootContainerRef = reference;
  }

  constructor(
    private readonly _componentFR: ComponentFactoryResolver,
    private readonly _injector: Injector,
    public rendererFactory: RendererFactory2
  ) {
    this._renderer = rendererFactory.createRenderer(null, null);
  }

  /**
   * Создание уведомления
   * @param {object} context - его контекст
   * @param {NotificationDirections} direction - направление, в котором оно будет открыто
   */
  public openNotification<T extends ModalComponent<T>>(
    context: object = {},
    direction: NotificationDirections = NotificationDirections.TOP
  ): void {
    const rootElement: HTMLElement = this._rootContainerRef.element.nativeElement;
    const componentFactory: ComponentFactory<CisNotificationComponent> =
      this._componentFR.resolveComponentFactory<CisNotificationComponent>(CisNotificationComponent);
    const componentRef: ComponentRef<CisNotificationComponent> = componentFactory.create(this._injector);

    componentRef.instance.componentRef = componentRef;

    Object.keys(context).forEach((key: string) => {
      componentRef.instance[key] = context[key];
    });

    componentRef.changeDetectorRef.detectChanges();

    let notificationsOverlay: Element;

    const notificationsOverlayClass = `notifications-overlay-${direction === NotificationDirections.TOP ? 'top' : 'bottom'}`;

    if (!rootElement.getElementsByClassName(notificationsOverlayClass).length) {
      notificationsOverlay = this._renderer.createElement('div');
      this._renderer.addClass(notificationsOverlay, notificationsOverlayClass);
      this._renderer.setStyle(notificationsOverlay, 'position', 'fixed');
      this._renderer.setStyle(notificationsOverlay, 'left', '50%');
      this._renderer.setStyle(notificationsOverlay, 'transform', 'translateX(-50%)');
      this._renderer.setStyle(notificationsOverlay, 'z-index', '9999');

      if (direction === NotificationDirections.TOP) {
        this._renderer.setStyle(notificationsOverlay, 'top', '15px');
      } else {
        this._renderer.setStyle(notificationsOverlay, 'bottom', '15px');
      }

      this._renderer.appendChild(rootElement, notificationsOverlay);
    } else {
      notificationsOverlay = rootElement.getElementsByClassName(notificationsOverlayClass)[0];
    }

    this._renderer.appendChild(notificationsOverlay, componentRef.location.nativeElement);
    /* eslint-disable */
    componentRef.instance.state = 'displayed';
    componentRef.changeDetectorRef.detectChanges();
  }

  /**
   * Уничтожение динамечески созданного компонента
   */
  public close<T>(componentRef: ComponentRef<CisNotificationComponent>): void {
    componentRef.destroy();
  }

  /**
   * Уничтожение динамически созданного уведомления
   */
  public closeNotification<T>(componentRef: ComponentRef<CisNotificationComponent>): void {
    componentRef.instance.state = 'hidden';
    componentRef.changeDetectorRef.detectChanges();
    // setTimeout для того, чтобы дождаться анимации закрытия элемента
    setTimeout(() => {
      componentRef.location.nativeElement.remove();
      this.close(componentRef);
    }, 200);
  }
}
