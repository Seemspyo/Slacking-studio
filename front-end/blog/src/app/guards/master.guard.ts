/** Native Modules */
import { Injectable } from '@angular/core';
import { CanActivate, CanLoad } from '@angular/router';

/** Custom Modules */
import { BlogGuard } from './blog.guard';


@Injectable({
  providedIn: 'root'
})
export class MasterGuard extends BlogGuard implements CanActivate, CanLoad {

  protected get condition(): boolean {
    return this.auth.sign && this.auth.currentUser.level >= 8;
  }
  
}
