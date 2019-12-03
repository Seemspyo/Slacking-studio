/** Native Modules */
import { Component, OnInit, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { trigger } from '@angular/animations';

/** Animations */
import { slideFast } from '../animations/navigation.animation';

/** Types */
import { HeadProperties } from '../services/@types';


@Component({
  selector: 'blog-administrator',
  templateUrl: './administrator.component.html',
  styleUrls: [
    './administrator.component.scss',
    '../../../node_modules/@angular/material/prebuilt-themes/pink-bluegrey.css'
  ],
  encapsulation: ViewEncapsulation.None,
  animations: [
    trigger('slide', slideFast)
  ]
})
export class AdministratorComponent implements OnInit, AfterViewInit {

  public readonly headProperties: HeadProperties = {
    meta: {
      'og:title': 'Masters - Slacking studio x BLOG'
    },
    title: 'Masters'
  }

  public navExpanded: boolean = true;
  public initialized: boolean = false;

  constructor() { }

  ngOnInit() {
    this.setNavState();
  }

  ngAfterViewInit() {
    window.setTimeout(() => this.initialized = true);
  }

  public toggleNavigation(): void {
    this.navExpanded = !this.navExpanded;
  }

  private setNavState(): void {
    this.navExpanded = window.innerWidth > 740;
  }

}
