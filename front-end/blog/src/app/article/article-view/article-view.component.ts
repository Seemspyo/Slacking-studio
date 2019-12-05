/** Native Modules */
import { Component, OnInit, ViewChild, TemplateRef, ViewEncapsulation, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';

/** Variables */
import { contentCSS } from '../@variables';

/** Types */
import { ArticleDisplayable, HeadProperties } from 'src/app/services/@types';

/** Services */
import { AuthService } from 'src/app/services/ajax/auth.service';
import { ArticleService } from 'src/app/services/ajax/article.service';
import { ViewLogService } from 'src/app/services/util/view-log.service';
import { StickyBarService } from 'src/app/services/util/sticky-bar.service';

/** Custom Modules */
import { unknownErrorContext, getHttpErrorContext, DuplicationError } from 'src/app/helpers/error.helper';

/** Font Awesome */
import { IconDefinition, faBookmark } from '@fortawesome/free-solid-svg-icons';
import { faBookmark as faBookmarkEmpty } from '@fortawesome/free-regular-svg-icons';
import { faFacebookF, faTwitter, faLinkedinIn } from '@fortawesome/free-brands-svg-icons';


@Component({
  selector: 'blog-article-view',
  templateUrl: './article-view.component.html',
  styles: [ contentCSS ],
  styleUrls: ['./article-view.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ArticleViewComponent implements OnInit {

  public article: ArticleDisplayable;

  private date: DatePipe = new DatePipe('en_US');
  private likeRequesting: boolean = false;
  private loading: boolean = false;
  private initialLoad: Promise<void>;
  private initialLoadResolve: () => void;

  @ViewChild('confirmTemplate', { static: false }) confirmTemplateRef: TemplateRef<any>;

  public dismissConfirm: () => void;

  public readonly facebookIcon = faFacebookF;
  public readonly twitterIcon = faTwitter;
  public readonly linkedInIcon = faLinkedinIn;

  constructor(
    private auth: AuthService,
    private articleService: ArticleService,
    private route: ActivatedRoute,
    private router: Router,
    private viewLog: ViewLogService,
    private stickyBar: StickyBarService,
    private renderer: Renderer2
  ) { }

  ngOnInit() {
    if (!this.loading) {
      this.initialLoad = new Promise(resolve => this.initialLoadResolve = resolve);
      this.loadArticle();
    }
  }

  public getProfileImagePath(): string {
    const author = this.article && this.article.author;

    return (author && author.profileImagePath) || AuthService.DEFAULT_PROFILE_IMAGE_PATH;
  }

  public getDateString(): string {
    const dates = this.article && this.article.date;
    if (!dates) return '';

    const
    createdAt = new Date(dates.createdAt),
    updatedAt = new Date(dates.lastUpdatedAt);

    let
    prefix: string,
    date: Date;

    if (createdAt.getTime() === updatedAt.getTime()) {
      prefix = 'Published';
      date = createdAt;
    } else {
      prefix = 'Updated';
      date = updatedAt;
    }

    return `${ prefix } · ${ this.date.transform(date, 'MMMM d, y') }`;
  }

  public get likeIcon(): IconDefinition {
    const condition = this.auth.sign
    && this.article
    && this.article.likes
    && this.article.likes.includes(this.auth.currentUser._id);

    return condition ? faBookmark : faBookmarkEmpty;
  }

  public get modifiable(): boolean {
    return this.auth.admin || (this.auth.sign && this.auth.currentUser._id === this.article.author._id);
  }

  public async toggleLike(): Promise<void> {
    if (this.likeRequesting) return;
    if (!this.auth.sign) {
      this.stickyBar.open('You can bookmark article when signed in.', { duration: 5000 });
    } else {
      const
      likes = this.article.likes,
      id = this.auth.currentUser._id;

      const
      includes = likes.includes(id),
      title = this.articleService.encodeTitle(this.article.title);
      this.likeRequesting = true;

      try {
        switch (includes) {
          case true:
            await this.articleService.cancelLike(title);

            likes.splice(likes.indexOf(id), 1);
            this.stickyBar.open('Remove bookmark.');
            break;
          case false:
            await this.articleService.addLike(title);

            likes.push(id);
            this.stickyBar.open('Add bookmark.');
            break;
        }
      } catch (error) {
        let message: string = unknownErrorContext;

        if (error instanceof HttpErrorResponse) message = getHttpErrorContext(error.status);
        if (error instanceof DuplicationError) message = 'An error occurred.\nPlease retry later';

        this.stickyBar.open(message);
      }

      this.likeRequesting = false;
    }
  }

  public getQuery(tag: string): object {
    return { search: tag }
  }

  public confirmDelete(): void {
    if (this.dismissConfirm) return;

    const id = this.stickyBar.open(this.confirmTemplateRef, { duration: void(0) });

    this.dismissConfirm = () => {
      this.stickyBar.dismiss(id, true);
      this.dismissConfirm = void(0);
    }
  }

  public async delete(): Promise<void> {
    try {
      await this.articleService.deleteArticle(this.articleService.encodeTitle(this.article.title));

      this.stickyBar.open('Deleted');
      this.router.navigateByUrl('/', { replaceUrl: true });
    } catch (error) {
      let message: string = unknownErrorContext;

      if (error instanceof HttpErrorResponse) message = getHttpErrorContext(error.status);

      this.stickyBar.open(message);
    }
  }

  public get link(): string {
    return `https://${ window.location.host }${ this.router.url }`;
  }

  private async loadArticle(): Promise<void> {
    const { title } = this.route.snapshot.params;

    this.loading = true;
    
    try {
      const article = await this.articleService.getArticle(title, this.viewLog.includes(this.articleService.decodeTitle(title)));

      if (!article.status && !this.auth.admin) {
        this.stickyBar.open('This post is private.');
        this.router.navigateByUrl('/');
        return;
      }

      this.article = this.articleService.toDisplayable(article) as ArticleDisplayable;
      this.viewLog.push(article.title);
    } catch (error) {
      let message: string = unknownErrorContext;

      if (error instanceof HttpErrorResponse) {
        if (error.status === 404) this.router.navigateByUrl('/404', { replaceUrl: true });
        else message = getHttpErrorContext(error.status);
      }

      this.stickyBar.open(message);
    }

    this.loading = false;
    if (this.initialLoadResolve) {
      this.initialLoadResolve();

      delete this.initialLoad;
      delete this.initialLoadResolve;
    }
  }

  public get headProperties(): Promise<HeadProperties> {
    return new Promise(async resolve => {
      if (!this.loading) {
        this.initialLoad = new Promise(resolve => this.initialLoadResolve = resolve);
        await this.loadArticle();
      } else await this.initialLoad;

      const renderEl = this.renderer.createElement('div');
      renderEl.innerHTML = this.article.content;

      resolve({
        meta: {
          'og:title': this.article.title,
          'og:type': 'article',
          'og:description': renderEl.innerText.length > 100 ? `${ renderEl.innerText.slice(0, 100) }...` : renderEl.innerText,
          'og:image': this.article.thumbnailImagePath
        },
        title: this.article.title
      });
    });
  }

}
