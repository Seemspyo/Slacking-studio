/** Native Modules */
import { ElementRef, Renderer2, AfterViewInit, OnChanges, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';


export abstract class BlogInput implements AfterViewInit, OnChanges, OnDestroy {

  protected containerEl: HTMLElement;
  protected inputEl: HTMLInputElement;
  protected inputContainerEl: HTMLElement;
  protected labelEl: HTMLLabelElement;
  protected labelContainerEl: HTMLElement;

  private listenerRemoveFuncs: Array<() => void> = new Array();
  protected valueChangeSubscription: Subscription;

  private initialized: boolean = false;

  constructor(
    protected elRef: ElementRef,
    protected renderer: Renderer2
  ) {}

  ngAfterViewInit() {
    this.create();
    this.watch();
    this.render();
    this.update();
  }

  ngOnChanges() {
    if (this.initialized) this.update();
    if (this.valueChangeSubscription) this.valueChangeSubscription.unsubscribe();
  }

  ngOnDestroy() {
    this.unwatch();
  }

  protected create(): void {
    this.containerEl = this.createEl('div', ['blog-input-container']);
    this.inputContainerEl = this.createEl('div', ['blog-input-input-container']);
    this.labelEl = this.createEl('label', ['blog-input-label']);
    this.labelContainerEl = this.createEl('div', ['blog-input-label-container']);

    this.inputEl = this.elRef.nativeElement as HTMLInputElement;
    this.renderer.addClass(this.inputEl, 'blog-input-input');

    this.renderer.appendChild(this.labelEl, this.renderer.createText(this.inputEl.placeholder));
  }

  protected abstract watch(): void;
  protected abstract render(): void;
  protected abstract update(): void;

  private unwatch(): void {
    for (const remove of this.listenerRemoveFuncs) remove();
  }

  protected createEl(tagName: string, classList?: Array<string>, styles?: { [key: string]: string }): any {
    const el = this.renderer.createElement(tagName);

    if (classList) for (const name of classList) this.renderer.addClass(el, name);
    if (styles) for (const key in styles) this.renderer.setStyle(el, key, styles[key]);

    return el;
  }

  protected append(parentEl: any, childEl: any): this {
    this.renderer.appendChild(parentEl, childEl);

    return this;
  }

  protected listen(el: any, type: string, listener: EventListener): this {
    this.listenerRemoveFuncs.push(this.renderer.listen(el, type, listener));

    return this;
  }

}