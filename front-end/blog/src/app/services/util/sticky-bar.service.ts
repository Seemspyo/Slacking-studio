/** Native Modules */
import { Injectable, Renderer2, RendererFactory2, TemplateRef, Component, NgModule, Injector, ComponentFactoryResolver, ApplicationRef, EmbeddedViewRef } from '@angular/core';
import { CommonModule } from '@angular/common';

/** Custom Modules */
import { UtilHelper } from 'src/app/helpers/util.helper';

/** Types */
import { StickyBarOption, StickyBarStack } from '../@types';


@Component({
  selector: 'blog-sticky-bar',
  template: '<ng-container *ngTemplateOutlet="templateRef; context: context"></ng-container>'
})
export class StickyBarComponent {
  public templateRef: TemplateRef<any>;
  public context: any;
}

@NgModule({
  imports: [CommonModule],
  declarations: [StickyBarComponent],
  exports: [StickyBarComponent],
  entryComponents: [StickyBarComponent]
})
export class StickyBarModule {}

@Injectable({
  providedIn: 'root'
})
export class StickyBarService {

  private renderer: Renderer2;
  private stackList: Array<StickyBarStack> = new Array();

  public between = 12;

  constructor(
    protected rendererFactory: RendererFactory2,
    private resolver: ComponentFactoryResolver,
    private appRef: ApplicationRef,
    private injector: Injector
  ) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  public open(message: string | TemplateRef<any>, options: StickyBarOption = { duration: 3000 }): string {
    const
    { delay, duration } = options,
    id = (Date.now()).toString(16),
    el = this.getStickyBar(message, options.context);

    const stack = { id, el, delay, duration }

    this.setStep(stack, 0);
    this.stackList.push(stack);
    this.render();

    return id;
  }

  public dismiss(id: string, renderState?: boolean): boolean {
    const stack = this.stackList.find(stack => stack.id === id);
    if (!stack) return false;

    if (!renderState) stack.step = 2;
    else this.setStep(stack, 2);

    this.render();
    return true;
  }

  private getStickyBar(template: string | TemplateRef<any>, context?: any): HTMLElement {
    const bar = this.renderer.createElement('div');

    this.renderer.addClass(bar, 'blog-sticky-bar');

    if (template instanceof TemplateRef) {
      this.renderer.appendChild(bar, this.renderTemplate(template, context));
    }
    else {
      const textNode = this.renderer.createText(template);

      this.renderer.appendChild(bar, textNode);
    }

    return bar;
  }

  private async render(): Promise<void> {
    let baseY: number = 0;
    this.stackList.sort((a, b) => {
      if (a.order < b.order) return +1;
      if (b.order < a.order) return -1;
      return 0;
    });

    for (const stack of this.stackList) {

      switch (stack.step) {
        case 0:
          if (stack.delay) await UtilHelper.wait(stack.delay);
          this.readyState(stack);
          break;
        case 1:
          baseY = this.dispatchState(stack, baseY);
          break;
        case 2:
          this.dismissState(stack);
          break;
      }
    }
  }

  private readyState(stack: StickyBarStack): void {
    this.setStyles(stack.el, { visibility: 'hidden', position: 'fixed', 'z-index': '-99', bottom: '0' });
    this.renderer.appendChild(document.body, stack.el);

    const transitionDuration = this.getTransitionDurationMs(stack.el) || 0;

    stack.order = Date.now() + transitionDuration;
    if (typeof stack.duration === 'number') window.setTimeout(() => {
      this.setStep(stack, 2);
      this.render();
    }, stack.duration + transitionDuration);

    window.setTimeout(() => {
      this.removeStyles(stack.el, ['visibility', 'z-index']);
      this.setStep(stack, 1);
      this.render();
    }, transitionDuration);
  }

  private dispatchState(stack: StickyBarStack, baseY: number): number {
    const y = baseY + this.between;

    this.setStyles(stack.el, { bottom: `${ y }px` });

    return y + stack.el.offsetHeight;
  }

  private dismissState(stack: StickyBarStack): void {
    const transitDuration = this.getTransitionDurationMs(stack.el) || 0;

    this.stackList.splice(this.stackList.indexOf(stack), 1);
    window.setTimeout(() => this.renderer.removeChild(document.body, stack.el), transitDuration);
    this.render();
  }

  private setStyles(el: HTMLElement, styleObj: { [key: string]: string }): void {
    for (const key in styleObj) this.renderer.setStyle(el, key, styleObj[key]);
  }

  private removeStyles(el: HTMLElement, styleKeys: Array<string>): void {
    for (const key of styleKeys) this.renderer.removeStyle(el, key);
  }

  private setStep(stack: StickyBarStack, step: number): void {
    stack.step = step;
    this.renderer.setAttribute(stack.el, 'step', step.toString());
  }

  private getTransitionDurationMs(el: HTMLElement): number {
    return Number.parseFloat(window.getComputedStyle(el).transitionDuration) * 1000;
  }

  private renderTemplate(templateRef: TemplateRef<any>, context?: any): any {
    const
    factory = this.resolver.resolveComponentFactory(StickyBarComponent),
    component = factory.create(this.injector);

    component.instance.templateRef = templateRef;
    component.instance.context = context;

    this.appRef.attachView(component.hostView);

    return (component.hostView as EmbeddedViewRef<any>).rootNodes[0];
  }

}
