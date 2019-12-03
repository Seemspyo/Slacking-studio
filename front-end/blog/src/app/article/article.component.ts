/** Native Modules */
import { Component } from '@angular/core';
import { trigger, transition } from '@angular/animations';
import { RouterOutlet } from '@angular/router';

/** Animations */
import { fadeToggle } from '../animations/fade.animation';

/** Services */
import { HeadService } from '../services/util/head.service';


@Component({
  selector: 'blog-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss'],
  animations: [
    trigger('routeAnimation', [
      transition('* <=> *', fadeToggle)
    ])
  ]
})
export class ArticleComponent {

  public navigationInitialized: boolean = false;

  constructor(
    public head: HeadService
  ) { }

  public onNavigationInit(): void {
    this.navigationInitialized = true;
  }

  public prepareActivation(outlet: RouterOutlet) {
    return { value: outlet && outlet.activatedRouteData, params: { top: window.pageYOffset || document.body.scrollTop } }
  }

}
