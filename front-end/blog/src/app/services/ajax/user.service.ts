/** Native Modules */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

/** Custom Modules */
import { BlogHttp } from './blog-http.ajax';

/** Variables */
import { WAS_HOST } from './@variables.ajax';

/** Types */
import { User, UserPublic, ResultResponse } from '../@types';
import { UtilHelper } from 'src/app/helpers/util.helper';


@Injectable({
  providedIn: 'root'
})
export class UserService extends BlogHttp {

  constructor(
    protected http: HttpClient
  ) { super(); }

  public async getUserPublic(email: string): Promise<UserPublic> {
    return await this.get(this.baseURI(`public/${ email }`));
  }

  public async getUserAll(): Promise<User[]> {
    return await this.get(`${ WAS_HOST }/users`);
  }

  public async getUser(email: string): Promise<User> {
    return await this.get(this.baseURI(email));
  }

  public async updateUser(email: string, user: User): Promise<ResultResponse> {
    const data = UtilHelper.toFormData(user, 'profileImage');

    return await this.put(this.baseURI(email), data);
  }

  public async deleteUser(email: string): Promise<ResultResponse> {
    return await this.delete(this.baseURI(email));
  }

  protected baseURI(relativePath: string): string {
    return `${ WAS_HOST }/user/${ relativePath }`;
  }

}
