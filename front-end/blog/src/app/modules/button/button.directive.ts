/** Native Modules */
import { Directive, ElementRef, AfterViewInit, OnDestroy, Renderer2 } from '@angular/core';


@Directive({
  selector: '[blogButton]'
})
export class ButtonDirective implements AfterViewInit, OnDestroy {

  private buttonEl: HTMLElement;
  private listenerRemoveFuncs: Array<() => void> = new Array();

  constructor(
    private elRef: ElementRef,
    private renderer: Renderer2
  ) { }

  ngAfterViewInit() {
    this.create();
    this.watch();
    this.render();
  }

  ngOnDestroy() {
    for (const remove of this.listenerRemoveFuncs) remove();
  }

  private create(): void {
    this.buttonEl = this.elRef.nativeElement;
  }

  private render(): void {
    this.renderer.addClass(this.buttonEl, 'blog-button');
  }

  private watch(): void {
    const
    addState = this.addState.bind(this),
    removeState = this.removeState.bind(this);

    this.listen(this.buttonEl, 'pointerdown', addState)
    .listen(window, 'pointerup', removeState)
    .listen(this.buttonEl, 'focus', addState)
    .listen(this.buttonEl, 'blur', removeState);
  }

  private addState(event: PointerEvent): void {
    event.preventDefault();

    this.renderer.addClass(this.buttonEl, 'button-pressed');
  }

  private removeState(): void {
    this.renderer.removeClass(this.buttonEl, 'button-pressed');
  }

  private listen(el: any, type: string, listener: EventListener): this {
    this.listenerRemoveFuncs.push(this.renderer.listen(el, type, listener));

    return this;
  }

}
