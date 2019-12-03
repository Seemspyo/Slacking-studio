/** Native Modules */
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { Meta } from '@angular/platform-browser';


@Component({
  selector: 'gate-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.scss']
})
export class PageNotFoundComponent implements OnInit, OnDestroy {

  public path: string;

  constructor(
    private location: Location,
    private meta: Meta
  ) { }

  ngOnInit() {
    this.path = this.location.path();
    this.meta.addTag({ name: 'prerender-status-code', content: '404' });
  }

  ngOnDestroy() {
    this.meta.removeTag('name="prerender-status-code"');
  }

}
