/** Native Modules */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

/** Custom Modules */
import { BlogHttp } from './blog-http.ajax';
import { UtilHelper } from 'src/app/helpers/util.helper';

/** ENV */
import { environment } from 'src/environments/environment';

/** Types */
import { ArticleComment, ResultResponse } from '../@types';


@Injectable({
  providedIn: 'root'
})
export class CommentService extends BlogHttp {

  constructor(
    protected http: HttpClient
  ) { super(); }

  public async getCommentAll(article?: string): Promise<ArticleComment[]> {
    return this.get(this.baseURI(`s${ UtilHelper.toQueryString({ article }) }`));
  }

  public async writeComment(comment: ArticleComment): Promise<ArticleComment> {
    return this.post(this.baseURI(''), comment);
  }

  public async updateComment(id: string, comment: ArticleComment): Promise<ArticleComment> {
    return this.put(this.baseURI(`/${ id }`), comment);
  }

  public async deleteComment(id: string, password: string): Promise<ResultResponse> {
    return this.delete(this.baseURI(`/${ id }?password=${ password }`));
  }

  public async getCommentByUser(userId: string): Promise<ArticleComment[]> {
    return this.get(this.baseURI(`s/${ userId }`));
  }

  protected baseURI(relativePath: string): string {
    return `${ environment.WAS_HOST }/comment${ relativePath }`;
  }

}
