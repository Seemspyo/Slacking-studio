/** Native Modules */
import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class ResolveService {

  public resolveAfter: number = 0;

  constructor() { }

  public wait(duration: number): Promise<number> {
    return new Promise(resolve => window.setTimeout(() => resolve(duration), duration));
  }

}
