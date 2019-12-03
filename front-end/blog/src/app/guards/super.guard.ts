/** Native Modules */
import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';

/** Custom Modules */
import { BlogGuard } from './blog.guard';


@Injectable({
  providedIn: 'root'
})
export class SuperGuard extends BlogGuard implements CanActivate {

  protected get condition(): boolean {
    return this.auth.sign && this.auth.currentUser.level >= 10;
  }
  
}
