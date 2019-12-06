/** Native Modules */
import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

/** Font Awesome */
import { faIgloo } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'blog-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.scss']
})
export class PageNotFoundComponent implements OnInit {

  public readonly homeIcon = faIgloo;
  public path: string;

  constructor(
    private location: Location
  ) { }

  ngOnInit() {
    this.path = this.location.path();
  }

}
