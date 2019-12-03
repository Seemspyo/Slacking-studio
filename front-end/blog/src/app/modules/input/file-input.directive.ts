/** Native Modules */
import { Directive, ElementRef, Renderer2, ComponentFactoryResolver, ViewContainerRef } from '@angular/core';

/** Custom Modules */
import { BlogInput } from './blog-input.class';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faFolderPlus } from '@fortawesome/free-solid-svg-icons';


@Directive({
  selector: '[blogFileInput]'
})
export class FileInputDirective extends BlogInput {

  private textNode: Node;
  private textContainerEl: HTMLElement;
  private fileIconContainerEl: HTMLElement;

  public nativeElement: HTMLElement;

  constructor(
    protected elRef: ElementRef,
    protected renderer: Renderer2,
    private viewContainerRef: ViewContainerRef,
    private componentFactoryResolver: ComponentFactoryResolver
  ) { super(elRef, renderer); }

  protected create(): void {
    super.create();
    this.textContainerEl = this.createEl('span', ['blog-input-text']);
    this.fileIconContainerEl = this.createEl('div', ['blog-input-icon-container']);

    this.renderer.addClass(this.inputContainerEl, 'file-input');
    this.nativeElement = this.elRef.nativeElement;
  }

  protected watch(): void {
    this.listen(this.containerEl, 'click', () => this.inputEl.click())
    .listen(this.inputEl, 'change', this.updateValue.bind(this));
  }

  protected render(): void {
    this.renderer.insertBefore(this.inputEl.parentElement, this.containerEl, this.inputEl);

    const iconComponentRef = this.viewContainerRef.createComponent(this.componentFactoryResolver.resolveComponentFactory(FaIconComponent));
    iconComponentRef.instance.icon = faFolderPlus;
    iconComponentRef.instance.render();
    iconComponentRef.changeDetectorRef.detectChanges();

    this.append(this.containerEl, this.inputContainerEl)
    .append(this.containerEl, this.labelContainerEl)
    .append(this.containerEl, this.fileIconContainerEl)
    .append(this.fileIconContainerEl, (iconComponentRef.hostView as any).rootNodes[0])
    .append(this.labelContainerEl, this.labelEl)
    .append(this.inputContainerEl, this.inputEl)
    .append(this.inputContainerEl, this.textContainerEl);
  }

  protected update(): void {
    switch (this.inputEl.disabled) {
      case true:
        this.renderer.addClass(this.containerEl, 'input-disabled');
        break;
      case false:
        this.renderer.removeClass(this.containerEl, 'input-disabled');
        break;
    }
  }

  public setValue(value: string): void {
    if (this.textNode) {
      this.textContainerEl.removeChild(this.textNode);
      this.textNode = void(0);
    }

    switch (Boolean(value)) {
      case true:
        this.textNode = this.renderer.createText(value);

        this.textContainerEl.appendChild(this.textNode);
        this.renderer.addClass(this.labelContainerEl, 'label-appended');
        break;
      case false:
        this.renderer.removeClass(this.labelContainerEl, 'label-appended');
        break;
    }
  }

  private updateValue(): void {
    const fileNames = Array.from(this.inputEl.files).map(file => file.name).join(', ');

    this.setValue(fileNames);
  }

}
