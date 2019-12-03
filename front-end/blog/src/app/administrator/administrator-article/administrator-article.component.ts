/** Native Modules */
import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';

/** Types */
import { RenderableArticle } from '../@types';
import { Article } from 'src/app/services/@types';

/** Font Awesome */
import { faEdit, faBan, IconDefinition, faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';

/** Services */
import { ArticleService } from 'src/app/services/ajax/article.service';
import { StickyBarService } from 'src/app/services/util/sticky-bar.service';

/** Custom Modules */
import { getHttpErrorContext, unknownErrorContext } from 'src/app/helpers/error.helper';


@Component({
  selector: 'blog-administrator-article',
  templateUrl: './administrator-article.component.html',
  styleUrls: ['./administrator-article.component.scss']
})
export class AdministratorArticleComponent implements OnInit {

  public readonly headerList = [
    { key: 'title', label: 'Title' },
    { key: 'category', label: 'Category' },
    { key: 'author', label: 'Author' },
    { key: 'createdAt', label: 'Created' },
    { key: 'updatedAt', label: 'Updated' },
    { key: 'view', label: 'View' },
    { key: 'likes', label: 'Like' },
    { key: 'comments', label: 'Comment' }
  ]
  public articleList: Array<RenderableArticle>;
  private articles: Array<Article>;

  private prevKey: string;
  private descending: boolean = true;
  public inputValue: string;

  public readonly modifyIcon = faEdit;
  public readonly deleteIcon = faBan;

  private date: DatePipe = new DatePipe('en_US');

  constructor(
    private article: ArticleService,
    private sticky: StickyBarService
  ) { }

  ngOnInit() {
    this.setArticleList();
  }

  public search(event?: Event): void {
    if (event) event.preventDefault();

    const articles = this.articles.filter(article => article.title.includes(this.inputValue) || (article.author && article.author.nickname.includes(this.inputValue)));

    this.articleList = this.toRenderable(articles);
  }

  public sortBy(key: string): void {
    if (this.isCurrentKey(key)) {
      this.descending = !this.descending;
    } else {
      this.prevKey = key;
      this.descending = true;
    }

    const direction = this.descending ? -1 : +1;

    let transform: (value: any) => any;

    switch (key) {
      case 'createdAt':
      case 'updatedAt':
        transform = value => new Date(value).getTime();
        break;
      default:
        transform = value => value;
    }

    this.articleList.sort((a, b) => {
      const
      valueA = transform(a[key]),
      valueB = transform(b[key]);

      if (valueA < valueB) return -1 * direction;
      if (valueB < valueA) return +1 * direction;
      return 0;
    });
  }

  public isCurrentKey(key: string): boolean {
    return this.prevKey === key;
  }

  public get arrowIcon(): IconDefinition {
    return this.descending ? faAngleDown : faAngleUp;
  }

  public getDateString(date: Date): string {
    if (!(date instanceof Date)) date = new Date(date);

    return this.date.transform(date, 'MMM d, y HH:mm:ss');
  }

  public async deleteArticle(article: RenderableArticle): Promise<void> {
    if (confirm(`Delete article "${ article.title }".\nSure to proceed?`)) {
      try {
        await this.article.deleteArticle(this.article.encodeTitle(article.title));

        this.sticky.open('Success.');
        this.setArticleList();
      } catch (error) {
        this.handleError(error);
      }
    }
  }

  private async setArticleList(): Promise<void> {
    try {
      const data = await this.article.getArticleAll();

      this.articles = data.articles;
      this.articleList = this.toRenderable(data.articles);
    } catch (error) {
      this.handleError(error);
    }
  }

  private toRenderable(articles: Array<Article>): Array<RenderableArticle> {
    return articles.map(article => {
      const { title, category, date, author, view, likes, comments } = article;

      return {
        title: this.article.decodeTitle(title),
        category,
        author: (author && author.nickname) || 'Anonymous',
        createdAt: date.createdAt,
        updatedAt: date.lastUpdatedAt,
        view,
        likes: (likes && likes.length) || 0,
        comments: (comments && comments.length) || 0,
        editLink: `/write/${ title }`
      }
    });
  }

  private handleError(error: any): void {
    this.sticky.open(error instanceof HttpErrorResponse ? getHttpErrorContext(error.status) : unknownErrorContext);
  }

}
