/** Native Modules */
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

/** Custom Modules */
import { SlideDirective } from '../directives/slide.directive';
import { UtilHelper } from '../helpers/util.helper';
import { ResolveService } from '../services/resolve.service';

/** Types */
import { GateNavigationParam, ToggleNavOption } from '../@types';
import { SlideDirectiveOption } from '../directives/@types';


@Component({
  selector: 'gate-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  public currentNav: GateNavigationParam;
  public navList: ReadonlyArray<GateNavigationParam> = [
    { id: 'main', title: 'Home', path: '/', uri: '/' },
    { id: 'blog', title: 'Blog', path: '/blog', uri: 'https://blog.eunsatio.io', description: 'A log of a wild developer' },
    { id: 'playground', title: 'Playground', path: '/playground', uri: 'https://playground.eunsatio.io', description: 'Slacker\'s duty' }
  ]
  public slideOption: SlideDirectiveOption = {
    duration: 400,
    timing: 'cubic-bezier(0.455, 0.03, 0.515, 0.955)',
    attachTo: [window]
  }

  @ViewChild(SlideDirective, { static: false }) slideDirective: SlideDirective;

  constructor(
    private router: Router,
    private resolver: ResolveService
  ) { }

  ngOnInit() {
    this.currentNav = this.navList[0];
  }

  public navigate(nav: GateNavigationParam, event?: MouseEvent): void {
    if (event) event.preventDefault();

    if (!this.isIE()) {
      this.resolver.resolveAfter = 800;
      this.router.navigate([nav.path], { skipLocationChange: true });
    } else {
      window.location.href = nav.uri;
    }
  }

  public onUserAction(event: MouseEvent, nav: GateNavigationParam): void {
    event.preventDefault();
    if (this.slideDirective.dragging) return;

    switch (event.type) {
      case 'mouseenter':
        this.toggleCurrentNav(nav);
        break;
      case 'click':
        if (!nav.active) this.toggleCurrentNav(nav);
        else this.navigate(nav);
        break;
    }
  }

  public onSlide(index: number): void {
    this.toggleCurrentNav(this.navList[index], { toggleSlide: false });
  }

  private toggleCurrentNav(targetNav: GateNavigationParam, option: ToggleNavOption = {}): void {
    if (targetNav === this.currentNav) return;
    option = UtilHelper.assign(option, { toggleSlide: true });

    for (const nav of this.navList) nav.active = nav !== targetNav ? false : true;

    this.currentNav = targetNav;
    if (option.toggleSlide) this.slideDirective.slideToIndex(this.navList.indexOf(this.currentNav));
  }

  private isIE(): boolean {
    const agent = window.navigator.userAgent.toLowerCase();

    return navigator.appName == 'Netscape' && agent.indexOf('trident') != -1 || agent.indexOf("msie") != -1;
  }

}
