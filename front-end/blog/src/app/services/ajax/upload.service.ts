/** Native Modules */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

/** Custom Modules */
import { BlogHttp } from './blog-http.ajax';

/** Variables */
import { WAS_HOST } from './@variables.ajax';
import { ResultResponse } from '../@types';


@Injectable({
  providedIn: 'root'
})
export class UploadService extends BlogHttp {

  constructor(
    protected http: HttpClient
  ) { super(); }

  public async uploadImage(image: File): Promise<{ location: string }> {
    const form = new FormData();
    form.append('image', image);

    return await this.post(this.baseURI('image'), form);
  }

  public async deleteImage(path: string): Promise<ResultResponse> {
    return await this.delete(this.baseURI(`image?path=${ path }`));
  }

  protected baseURI(relativePath: string): string {
    return `${ WAS_HOST }/upload/${ relativePath }`;
  }

}
