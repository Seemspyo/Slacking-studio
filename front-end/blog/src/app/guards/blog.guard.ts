/** Native Modules */
import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, Route, UrlSegment } from '@angular/router';
import { Location } from '@angular/common';

/** Services */
import { AuthService } from '../services/ajax/auth.service';


@Injectable({
  providedIn: 'root'
})
export abstract class BlogGuard {

  constructor(
    protected auth: AuthService,
    private router: Router,
    private location: Location
  ) {}

  public canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.withFallback(this.condition, state.url);
  }

  public canLoad(route: Route, segments: Array<UrlSegment>): boolean {
    return this.withFallback(this.condition, segments.map(seg => seg.path).join('/'));
  }

  private withFallback(condition: boolean, url: string): boolean {
    if (!condition) {
      this.router.navigateByUrl('/404', { skipLocationChange: true });
      this.location.go(url);
    }

    return condition;
  }

  protected abstract get condition(): boolean;

}