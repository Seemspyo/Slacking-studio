/** Native Modules */
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

/** Types */
import { AccountComponentChild } from './@types';

/** Services */
import { HeadService } from '../services/util/head.service';


@Component({
  selector: 'blog-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {

  public headerTitle: string;

  constructor(
    private router: Router,
    public head: HeadService
  ) { }

  ngOnInit() {
    if (!this.headerTitle) this.router.navigateByUrl('/404', { skipLocationChange: true });
  }

  public onActivate(childComponent: AccountComponentChild): void {
    this.headerTitle = childComponent.title;
    this.head.onActivate(childComponent);
  }

}
