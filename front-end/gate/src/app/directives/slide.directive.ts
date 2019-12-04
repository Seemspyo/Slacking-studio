/** Native Modules */
import { Directive, Renderer2, ElementRef, OnInit, Input, AfterViewInit, OnChanges, OnDestroy, Output, EventEmitter } from '@angular/core';

/** Custom Modules */
import { UtilHelper } from '../helpers/util.helper';

/** Types */
import { SlideDirectiveOption } from './@types';


@Directive({
  selector: '[gateSlide]'
})
export class SlideDirective implements OnInit, AfterViewInit, OnDestroy {

  public readonly DEFAULT_OPTION: SlideDirectiveOption = {
    initialIndex: 0,
    duration: 300,
    timing: void(0),
    attachTo: [],
    maxDistance: 0.2,
    minDistance: 0.2
  }

  @Input() option: SlideDirectiveOption;
  @Output('slide') slideEvent: EventEmitter<number> = new EventEmitter();

  private containerEl: Element;

  private itemsLeft: Array<number>;
  private removerList: Array<() => void>;

  public intialized: boolean = false;
  public dragging: boolean = false;

  private containerElWidth: number;
  private currentX: number = 0;
  private downX: number = 0;
  private dragX: number = 0;
  private prevX: number = 0;
  private currentIndex: number;
  private transitionTimeout: number;

  constructor(
    private renderer: Renderer2,
    private elRef: ElementRef
  ) { }

  ngOnInit() {
    this.option = UtilHelper.assign(this.option || {}, this.DEFAULT_OPTION);
    this.currentIndex = this.option.initialIndex;
  }

  ngAfterViewInit() {
    this.containerEl = this.elRef.nativeElement;

    const option = this.option;
    if (!option.slideEl) option.slideEl = this.containerEl.children[0];
    if (!Array.isArray(option.attachTo)) option.attachTo = [option.attachTo]

    this.init();
  }

  ngOnDestroy() {
    this.destroy();
  }

  public slideToIndex(index: number): void {
    this.transitionBlink();
    this.slide(index);
  }

  public init(): void {
    if (this.intialized) this.destroy();
    this.setBounds();

    const handler = (e: MouseEvent | TouchEvent) => this.pointerEventHandler(e);

    const userEvents: Array<[string, (event: MouseEvent | TouchEvent) => void]> = [
      [ 'mousedown', handler ],
      [ 'mousemove', handler ],
      [ 'mouseup', handler ],
      [ 'touchstart', handler ],
      [ 'touchmove', handler ],
      [ 'touchend', handler ]
    ]
    this.removerList = new Array();

    for (const el of [this.containerEl, ...this.option.attachTo])
      for (const [ type, func ] of userEvents)
        this.removerList.push(this.renderer.listen(el, type, func));

    this.removerList.push(this.renderer.listen(window, 'resize', () => this.update()));
    this.currentX = this.itemsLeft[this.currentIndex];

    this.intialized = true;
  }

  public update(): void {
    window.clearTimeout(this.transitionTimeout);

    this.setBounds();
    this.slide(this.currentIndex);
  }

  public destroy(): void {
    for (const remove of this.removerList) remove();

    this.intialized = false;
  }

  private pointerEventHandler(event: MouseEvent | TouchEvent): void {
    let x: number;
    if (event instanceof MouseEvent) x = event.clientX;
    if (event instanceof TouchEvent) x = (event.touches[0] || event.changedTouches[0]).clientX;

    switch (event.type) {
      case 'mousedown':
        event.preventDefault();
      case 'touchstart':
        this.onDragStart(x);
        break;
      case 'mousemove':
      case 'touchmove':
        this.onDrag(x);
        break;
      case 'mouseup':
      case 'touchend':
        this.onDragEnd(x);
        break;
    }
  }

  private onDragStart(x: number): void {
    this.dragging = true;
    this.downX =
    this.prevX = x;
  }

  private onDrag(x: number): void {
    if (!this.dragging) return;

    let increaseX = x - this.prevX;
    const
    maxX = this.containerElWidth * this.option.maxDistance,
    moveX = Math.abs(x - this.downX);

    if (moveX > maxX) {
      const overflowX = moveX - maxX;

      increaseX = overflowX < maxX ? increaseX * (1 - overflowX / maxX) : 0;
    }

    this.dragX += increaseX;
    this.prevX = x;

    this.renderer.setStyle(this.option.slideEl, 'transform', `translateX(${ this.currentX + this.dragX }px)`);
  }

  private onDragEnd(x: number): void {
    const
    distanceX = this.downX - x,
    index = UtilHelper.confine(this.currentIndex + Math.sign(distanceX), this.itemsLeft.length - 1, 0);

    if (Math.abs(distanceX) > this.containerElWidth * this.option.minDistance) this.slideToIndex(index);
    else this.slideToIndex(this.currentIndex);

    this.dragging = false;
    this.dragX = 0;
    this.downX =
    this.prevX = void(0);
  }

  private setBounds(): void {
    this.itemsLeft = new Array();

    const
    { width, left } = this.elRef.nativeElement.getBoundingClientRect(),
    { slideEl } = this.option;

    this.containerElWidth = width;

    for (const item of Array.from(slideEl.children)) this.itemsLeft.push(left + this.currentX + this.dragX - item.getBoundingClientRect().left);
  }

  private slide(index: number): void {
    this.currentX = this.itemsLeft[index];

    this.renderer.setStyle(this.option.slideEl, 'transform', `translateX(${ this.currentX }px)`);
    if (this.currentIndex !== index) this.slideEvent.emit(index);

    this.currentIndex = index;
  }

  private transitionBlink(): void {
    window.clearTimeout(this.transitionTimeout);

    const { slideEl, duration, timing } = this.option;
    this.renderer.setStyle(slideEl, 'transition', `transform ${ duration }ms ${ timing }`);

    this.transitionTimeout = window.setTimeout(() => this.renderer.removeStyle(slideEl, 'transition'), duration);
  }

}
