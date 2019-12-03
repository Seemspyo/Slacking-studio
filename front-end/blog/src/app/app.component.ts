/** Native Modules */
import { Component, OnInit, Renderer2 } from '@angular/core';

/** Custom Modules */
import { UtilHelper } from './helpers/util.helper';

/** Services */
import { HeadService } from './services/util/head.service';


@Component({
  selector: 'blog-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  public activating: boolean = false;

  constructor(
    private renderer: Renderer2,
    private head: HeadService
  ) {}

  ngOnInit() {
    this.removeLoadingScreen();
  }

  public onActivate(event: any): void {
    if (event.headProperties) this.head.updateHeadProperties(event.headProperties);
  }

  private async removeLoadingScreen(): Promise<void> {
    const el = document.querySelector('body > .blog-loading-screen');

    if (el) {
      const transitionDuration = Number.parseFloat(window.getComputedStyle(el).transitionDuration) * 1000;

      this.renderer.addClass(el, 'animated-in');
      await UtilHelper.wait(transitionDuration);

      this.renderer.removeChild(document.body, el);
    }
  }
  
}
