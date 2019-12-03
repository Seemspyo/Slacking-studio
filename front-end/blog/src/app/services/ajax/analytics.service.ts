/** Native Modules */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

/** Custom Modules */
import { BlogHttp } from './blog-http.ajax';

/** Variables */
import { WAS_HOST } from './@variables.ajax';

/** Types */
import { CountData } from '../@types';


@Injectable({
  providedIn: 'root'
})
export class AnalyticsService extends BlogHttp {

  constructor(
    protected http: HttpClient
  ) { super(); }

  public getActiveUserCount(): Promise<CountData> {
    return this.get(this.baseURI('/counts?key=user-active'));
  }

  public getPublicArticleCount(): Promise<CountData> {
    return this.get(this.baseURI('/counts?key=article-public'));
  }

  public getArticleViewCount(): Promise<CountData> {
    return this.get(this.baseURI('/counts?key=article-view'));
  }

  public getCommentCount(): Promise<CountData> {
    return this.get(this.baseURI('/counts?key=comment'));
  }

  protected baseURI(relativePath: string): string {
    return `${ WAS_HOST }/analytics${ relativePath }`;
  }

}
