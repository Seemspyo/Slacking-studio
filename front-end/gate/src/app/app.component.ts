/** Native Modules */
import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet, NavigationStart } from '@angular/router';
import { AnimationMetadata, trigger, transition } from '@angular/animations';

/** Animations */
import { slideUp, slideDown, slideLeft, slideRight } from './animations/slide.animation';


const routeAnimation: AnimationMetadata =
trigger('routeAnimation', [
  transition('gate => blog', slideUp),
  transition('blog => gate', slideDown),
  transition('gate => playground', slideLeft),
  transition('playground => gate', slideRight)
]);

@Component({
  selector: 'gate-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [ routeAnimation ]
})
export class AppComponent implements OnInit {

  public scrollTop: number = 0;

  constructor(
    private router: Router
  ) {}

  ngOnInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) this.scrollTop = window.pageYOffset || document.body.scrollTop;
    });
  }

  public prepare(outlet: RouterOutlet): any {
    const value = outlet && outlet.activatedRouteData && outlet.activatedRouteData['id'];

    return { value, params: { scrollTop: this.scrollTop, windowHeight: window.innerHeight } }
  }

}
