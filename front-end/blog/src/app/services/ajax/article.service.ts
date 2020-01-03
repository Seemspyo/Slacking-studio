/** Native Modules */
import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { HttpClient } from '@angular/common/http';

/** Custom Modules */
import { BlogHttp } from './blog-http.ajax';
import { UtilHelper } from 'src/app/helpers/util.helper';

/** Variables */
import { WAS_HOST } from './@variables.ajax';

/** Types */
import { Article, ArticleSearchOption, ResultResponse, ArticleDisplayable } from '../@types';


@Injectable({
  providedIn: 'root'
})
export class ArticleService extends BlogHttp {

  public readonly DEFAULT_THUMBNAIL_IMAGE_PATH = '/assets/images/default-thumbnail.png';

  private renderer: Renderer2;

  constructor(
    protected http: HttpClient,
    private rendererFactory: RendererFactory2
  ) {
    super();
    this.renderer = this.rendererFactory.createRenderer(null, null);
  }

  public async getTagAll(): Promise<string[]> {
    return this.get(`${ WAS_HOST }/tags`);
  }

  public async getCategoryAll(status?: boolean): Promise<string[]> {
    let option: any = {}
    if (status !== void(0)) option.status = status;

    return this.get(`${ WAS_HOST }/categories${ UtilHelper.toQueryString(option) }`);
  }

  public async getArticleAll(searchOption: ArticleSearchOption = {}): Promise<{ totalCount: number; articles: Article[]; }> {
    return this.get(this.baseURI(`s${ UtilHelper.toQueryString(searchOption) }`));
  }

  public async getArticle(title: string, opened: boolean = false): Promise<Article> {
    return this.get(`${ this.baseURI(`/${ title }`) }?opened=${ opened }`);
  }

  public async writeArticle(article: Article): Promise<ResultResponse> {
    return this.post(this.baseURI(''), article);
  }

  public async updateArticle(title: string, article: Article): Promise<ResultResponse> {
    return this.put(this.baseURI(`/${ title }`), article);
  }

  public async deleteArticle(title: string): Promise<ResultResponse> {
    return this.delete(this.baseURI(`/${ title }`));
  }

  public async addLike(title: string): Promise<ResultResponse> {
    return this.post(this.baseURI(`-likes/${ title }`), null);
  }

  public async cancelLike(title: string): Promise<ResultResponse> {
    return this.delete(this.baseURI(`-likes/${ title }`));
  }

  public async getBookmarks(userId: string): Promise<Article[]> {
    return this.get(this.baseURI(`s/${ userId }`));
  }

  public encodeTitle(title: string): string {
    return title.replace(/\s/g, '-');
  }

  public decodeTitle(title: string): string {
    return title.replace(/-/g, ' ');
  }

  public toDisplayable(article: Array<Article> | Article, subfix?: (article: Article) => any): Array<ArticleDisplayable> | ArticleDisplayable {
    const articles = (Array.isArray(article) ? article : [ article ]) as Array<ArticleDisplayable>;

    for (const article of articles) {
      article.link = `/${ article.category }/${ article.title }`;
      article.modifyLink = `/write/${ article.title }`;
      article.title = this.decodeTitle(article.title);
      article.thumbnailImagePath = this.getThumbnailImagePath(article.content);
      if (subfix) subfix(article);
    }

    return Array.isArray(article) ? articles : articles[0];
  }

  private getThumbnailImagePath(content: string): string {
    const virtualEl = this.renderer.createElement('div') as HTMLDivElement;

    this.renderer.setProperty(virtualEl, 'innerHTML', content);

    const
    firstImageEl = virtualEl.querySelector('img[src]'),
    path = (firstImageEl && firstImageEl.getAttribute('src')) || this.DEFAULT_THUMBNAIL_IMAGE_PATH;

    return path;
  }

  protected baseURI(relativePath: string): string {
    return `${ WAS_HOST }/article${ relativePath }`;
  }

}
