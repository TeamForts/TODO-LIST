import {ComponentFactory, ComponentFactoryResolver, ComponentRef, Injectable, Type, ViewContainerRef} from '@angular/core';
import {ModalComponent} from './modal-component.interface';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private _rootContainerRef!: ViewContainerRef;

  public set rootContainerRef(reference: ViewContainerRef) {
    this._rootContainerRef = reference;
  }

  constructor(private readonly _componentFR: ComponentFactoryResolver) {}

  /**
   * Динамическое создание компонента
   * @param {Type<T extends ModalComponent<T>>} component - сам компонент
   * @param {object} context - его контекст
   * @param {ViewContainerRef} viewContainerRef - viewContainerRef - в котором его создать
   * @return {ComponentRef<T extends ModalComponent<T>>} - componentRef созданного компонента
   */
  public open<T extends ModalComponent<T>>(component: Type<T>, context?: Partial<T>, viewContainerRef?: ViewContainerRef): ComponentRef<T> {
    context = context || {};

    const componentFactory: ComponentFactory<T> = this._componentFR.resolveComponentFactory(component);
    const containerRef: ViewContainerRef = viewContainerRef || this._rootContainerRef;
    const componentRef: ComponentRef<T> = containerRef.createComponent<T>(componentFactory);

    componentRef.instance.componentRef = componentRef;

    Object.keys(context).forEach((key: string) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      componentRef.instance[key] = context[key];
    });

    return componentRef;
  }

  /**
   * Уничтожение динамечески созданного компонента
   * @param {ComponentRef<T>} componentRef
   */
  public close<T>(componentRef: ComponentRef<T>): void {
    componentRef.destroy();
  }
}
