/** Native Modules */
import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';

/** Services */
import { CommentService } from 'src/app/services/ajax/comment.service';
import { StickyBarService } from 'src/app/services/util/sticky-bar.service';
import { ArticleService } from 'src/app/services/ajax/article.service';

/** Font Awesome */
import { faEdit, faBan, IconDefinition, faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';

/** Custom Modules */
import { getHttpErrorContext, unknownErrorContext } from 'src/app/helpers/error.helper';

/** Types */
import { RenderableComment } from '../@types';
import { ArticleComment } from 'src/app/services/@types';


@Component({
  selector: 'blog-administrator-comment',
  templateUrl: './administrator-comment.component.html',
  styleUrls: ['./administrator-comment.component.scss']
})
export class AdministratorCommentComponent implements OnInit {

  public readonly headerList = [
    { key: 'articleTitle', label: 'Article Title' },
    { key: 'author', label: 'Author' },
    { key: 'createdAt', label: 'Created' },
    { key: 'updatedAt', label: 'Updated' }
  ]
  public commentList: Array<RenderableComment>;
  private comments: Array<ArticleComment>;

  private prevKey: string;
  private descending: boolean = true;
  public inputValue: string;

  public readonly modifyIcon = faEdit;
  public readonly deleteIcon = faBan;

  private date: DatePipe = new DatePipe('en_US');

  constructor(
    private article: ArticleService,
    private comment: CommentService,
    private sticky: StickyBarService
  ) { }

  ngOnInit() {
    this.setCommentList();
  }

  public search(event?: Event): void {
    if (event) event.preventDefault();

    const comments = this.comments.filter(comment => (comment.article && comment.article.title.includes(this.inputValue)) || (comment.author && comment.author.nickname.includes(this.inputValue)));

    this.commentList = this.toRenderable(comments);
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

    this.commentList.sort((a, b) => {
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

  public async deleteComment(comment: RenderableComment): Promise<void> {
    if (confirm(`Delete comment of "${ comment.author }".\nSure to proceed?`)) {
      try {
        await this.comment.deleteComment(comment.id, void(0));

        this.sticky.open('Success.');
        this.setCommentList();
      } catch (error) {
        this.handleError(error);
      }
    }
  }

  private async setCommentList(): Promise<void> {
    try {
      this.comments = await this.comment.getCommentAll();
      this.commentList = this.toRenderable(this.comments);
    } catch (error) {
      this.handleError(error);
    }
  }

  private toRenderable(comments: Array<ArticleComment>): Array<RenderableComment> {
    return comments.map(comment => {
      const { _id, article, author, date } = comment;

      return {
        id: _id,
        articleTitle: article && this.article.decodeTitle(article.title),
        author: (author && author.nickname) || 'Anonymous',
        createdAt: date.createdAt,
        updatedAt: date.lastUpdatedAt,
        editLink: article && `/${ article.category }/${ article.title }`
      }
    });
  }

  private handleError(error: any): void {
    this.sticky.open(error instanceof HttpErrorResponse ? getHttpErrorContext(error.status) : unknownErrorContext);
  }

}
