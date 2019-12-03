/** Native Modules */
import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

/** Custom Modules */
import { UtilHelper } from '../helpers/util.helper';
import { ResolveService } from '../servies/resolve.service';

/** Types */
import { FontStyles } from '../@types';


@Component({
  selector: 'gate-redirect',
  templateUrl: './redirect.component.html',
  styleUrls: ['./redirect.component.scss']
})
export class RedirectComponent implements OnInit, AfterViewInit {

  @ViewChild('displayContainer', { static: false }) containerElRef: ElementRef;
  @ViewChild('display', { static: false }) canvasElRef: ElementRef;

  private readonly DISPLAY_BASE_WIDTH = 1920;
  private readonly DISPLAY_BASE_HEIGHT = 1080;
  private readonly DISPLAY_RATIO = 0.5625;

  private scale: number = 1;
  public id: string;

  public initialized: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private renderer: Renderer2,
    private resolver: ResolveService
  ) { }

  ngOnInit() {
    this.id = this.route.snapshot.data.id;
  }

  async ngAfterViewInit() {
    await this.resolver.wait(this.resolver.resolveAfter);

    this.initialized = true;
    this.setScale();
    await this.drawText();
    this.navigate();
  }

  private setScale(): void {
    const
    containerEl = this.containerElRef.nativeElement as HTMLElement,
    canvasEl = this.canvasElRef.nativeElement as HTMLCanvasElement;

    canvasEl.width = containerEl.offsetWidth;
    canvasEl.height = containerEl.offsetWidth * this.DISPLAY_RATIO;

    this.scale = canvasEl.offsetWidth / this.DISPLAY_BASE_WIDTH;
  }

  private async drawText(): Promise<void> {
    const
    canvasEl = this.canvasElRef.nativeElement as HTMLCanvasElement,
    ctx = canvasEl.getContext('2d');

    ctx.scale(this.scale, this.scale);
    ctx.font = this.getFont();
    this.setStyleById(ctx);

    const
    id = this.id.toUpperCase(),
    charList = id.split(''),
    maxWidth = this.DISPLAY_BASE_WIDTH - this.DISPLAY_BASE_WIDTH * 0.2;

    let fontSize = 300;
    while (maxWidth < ctx.measureText(id).width) ctx.font = this.getFont({ size: (fontSize -= 5) });

    const
    x = this.DISPLAY_BASE_WIDTH / 2 - ctx.measureText(id).width / 2,
    y = this.DISPLAY_BASE_WIDTH * this.DISPLAY_RATIO / 2,
    dashLength = 600,
    speed = 12,
    delay = 300;

    this.renderer.setStyle(canvasEl, 'transition-duration', `${ delay * charList.length }ms`);

    await new Promise(resolve => {

      for (const [index, char] of charList.entries()) window.setTimeout(() => {
        const left = x + ctx.measureText(charList.slice(0, index).join('')).width;
        let dashOffset = dashLength;
  
        const tick = () => {
          ctx.clearRect(left, 0, ctx.measureText(char).width, y * 2);
          ctx.setLineDash([dashLength - dashOffset, dashOffset - speed]);
          ctx.strokeText(char, left, y);
  
          dashOffset -= speed;
  
          if (dashOffset > 0) window.requestAnimationFrame(tick);
          else if (index + 1 === charList.length) resolve();
        }
  
        window.requestAnimationFrame(tick);
      }, delay * index);

    });
  }

  private setStyleById(context: CanvasRenderingContext2D): CanvasRenderingContext2D {
    const commonStyle: any = { strokeStyle: '#ffffff', lineWidth: 8, textBaseline: 'middle' }

    switch (this.id) {
      case 'blog':
        this.setContextProperties(context, { lineCap: 'square', ...commonStyle });
        break;
      case 'playground':
        this.setContextProperties(context, { lineCap: 'round', ...commonStyle });
        break;
    }

    return context;
  }

  private setContextProperties(context: CanvasRenderingContext2D, properties: { [key: string]: any }): CanvasRenderingContext2D {
    for (const key in properties) context[key] = properties[key];

    return context;
  }

  private getFont(option: FontStyles = {}): string {
    option = UtilHelper.assign(option, { weight: 600, size: 300, family: 'sans-serif' });

    switch (this.id) {
      case 'blog':
        option.family = 'Ubuntu, sans-serif';
        break;
      case 'playground':
        option.family = 'Mali, cursive';
        break;
    }

    const { weight, size, family } = option;

    return `${ weight } ${ size }px ${ family }`;
  }

  private navigate(): void {
    const url = this.router.url.replace(`/${ this.id }`, '');

    window.location.assign(`https://${ this.id }.eunsatio.io/${ url }`);
  }

}
