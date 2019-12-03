/** Native Modules */
import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class ViewLogService {

  private readonly VIEW_LOG_KEY = '__ss_blog_view_log';

  private log: Array<string>;

  constructor() {
    const log = window.localStorage.getItem(this.VIEW_LOG_KEY);

    this.log = (log && JSON.parse(log)) || []
  }

  public includes(value: string): boolean {
    return this.log.includes(value);
  }

  public push(value: string): string {
    this.log.push(value);
    window.localStorage.setItem(this.VIEW_LOG_KEY, JSON.stringify(this.log));

    return value;
  }

}
