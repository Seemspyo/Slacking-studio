/** Native Modules */
import { Directive, ElementRef, Renderer2, Input } from '@angular/core';
import { FormControl, NgControl } from '@angular/forms';

/** Custom Modules */
import { BlogInput } from './blog-input.class';


@Directive({
  selector: '[blogInput]'
})
export class InputDirective extends BlogInput {

  static index: number = 0;

  @Input() public hasError: boolean;
  @Input('formControl') public control: FormControl;

  constructor(
    protected elRef: ElementRef,
    protected renderer: Renderer2,
    private ngControl: NgControl
  ) { super(elRef, renderer); }

  protected create(): void {
    super.create();

    let id = this.inputEl.getAttribute('id');
    if (!id) {
      id = Math.floor(Date.now() + InputDirective.index++).toString(16);
      this.renderer.setAttribute(this.inputEl, 'id', id);
    }

    this.renderer.setAttribute(this.labelEl, 'for', id);
  }

  protected watch(): void {
    this.listen(this.inputEl, 'input', this.update.bind(this))
    .listen(this.inputEl, 'focus', this.onInputFocus.bind(this))
    .listen(this.inputEl, 'blur', this.onInputBlur.bind(this));

    this.valueChangeSubscription = this.ngControl.control.valueChanges.subscribe((value: string) => {
      if (!this.containerEl.classList.contains('input-focused'))
        this.renderer[`${ value ? 'add' : 'remove' }Class`](this.labelContainerEl, 'label-appended');
    });
  }

  protected render(): void {
    this.renderer.insertBefore(this.inputEl.parentElement, this.containerEl, this.inputEl);

    this.append(this.containerEl, this.inputContainerEl)
    .append(this.containerEl, this.labelContainerEl)
    .append(this.labelContainerEl, this.labelEl)
    .append(this.inputContainerEl, this.inputEl);
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

    switch (this.hasError) {
      case true:
        this.renderer.addClass(this.containerEl, 'input-errored');
        break;
      case false:
        this.renderer.removeClass(this.containerEl, 'input-errored');
        break;
    }
  }

  private onInputFocus(): void {
    this.renderer.addClass(this.containerEl, 'input-focused');
    this.renderer.addClass(this.labelContainerEl, 'label-appended');
  }

  private onInputBlur(): void {
    this.update();
    this.renderer.removeClass(this.containerEl, 'input-focused');
    if (!this.inputEl.value) this.renderer.removeClass(this.labelContainerEl, 'label-appended');
  }

}
