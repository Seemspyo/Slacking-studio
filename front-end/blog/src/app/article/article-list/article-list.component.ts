/** Native Modules */
import { Component, OnInit, Renderer2, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { DatePipe } from '@angular/common';
import { trigger } from '@angular/animations';

/** Services */
import { AuthService } from 'src/app/services/ajax/auth.service';
import { CategoryService } from 'src/app/services/util/category.service';
import { ArticleService } from 'src/app/services/ajax/article.service';
import { StickyBarService } from 'src/app/services/util/sticky-bar.service';

/** Types */
import { ArticleDisplayable, Article, ArticleSearchOption, UserPayload } from 'src/app/services/@types';

/** Custom Modules */
import { unknownErrorContext, getHttpErrorContext } from 'src/app/helpers/error.helper';
import { UtilHelper } from 'src/app/helpers/util.helper';
import { UserSignOut } from 'src/app/helpers/event.helper';

/** Font Awesome */
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

/** Animations */
import { settle } from 'src/app/animations/list-settle.animation';


@Component({
  selector: 'blog-article-list',
  templateUrl: './article-list.component.html',
  styleUrls: ['./article-list.component.scss'],
  animations: [
    trigger('settle', settle)
  ]
})
export class ArticleListComponent implements OnInit, OnDestroy {

  public articlePerLoad: number = 6;
  public currentIndex: number = 0;

  public articleList: Array<ArticleDisplayable>;
  public total: number = 0;
  public loading: boolean = false;
  public readonly arrowIcon = faArrowRight;

  private params = {
    category: void(0),
    search: void(0)
  }
  private subscriptions: Array<Subscription> = []
  private date: DatePipe = new DatePipe('en_US');

  private removeScrollListener: () => void;
  private removeResizeListener: () => void;

  @ViewChild('measurer', { static: true }) measureElRef: ElementRef;

  constructor(
    private auth: AuthService,
    private category: CategoryService,
    private article: ArticleService,
    private route: ActivatedRoute,
    private router: Router,
    private stickyBar: StickyBarService,
    private renderer: Renderer2
  ) { }

  ngOnInit() {
    this.setScrollBehavior();
    this.subscribeParams();
    this.subscribeSignState();
  }

  ngOnDestroy() {
    for (const remove of [this.removeResizeListener, this.removeScrollListener]) if (remove) remove();
    UtilHelper.unsubscribeAll(...this.subscriptions);
  }

  public get writable(): boolean {
    return this.auth.admin;
  }

  public getProfileImagePath(author: UserPayload): string {
    return (author && author.profileImagePath) || AuthService.DEFAULT_PROFILE_IMAGE_PATH;
  }

  public getDateString(dates: Article["date"]): string {
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

  private setParams(): void {
    const snapshot = this.route.snapshot;

    this.params.category = snapshot.paramMap.get('category'),
    this.params.search = snapshot.queryParamMap.get('search');

    if (this.params.category && !this.category.includes(this.params.category)) this.router.navigateByUrl('/404', { skipLocationChange: true });
  }

  private async loadArticleList(): Promise<void> {
    const { category, search } = this.params;
    this.loading = true;

    const criteria: ArticleSearchOption = {
      skip: this.currentIndex++ * this.articlePerLoad,
      limit: this.articlePerLoad,
      category,
      search,
      status: this.auth.admin ? void(0) : true
    }
    for (const key in criteria) if (!criteria[key]) delete criteria[key];

    try {
      const { totalCount, articles } = await this.article.getArticleAll(criteria);

      this.articleList = this.articleList.concat(this.article.toDisplayable(articles));
      this.total = totalCount;
    } catch (error) {
      let message: string = unknownErrorContext;

      if (error instanceof HttpErrorResponse) message = getHttpErrorContext(error.status);

      this.stickyBar.open(message);
    }

    this.loading = false;
  }

  private setScrollBehavior(): void {
    this.removeScrollListener = this.renderer.listen(window, 'scroll', () => { this.scrollBehavior(); }),
    this.removeResizeListener = this.renderer.listen(window, 'resize', () => {
      if (this.loading) return;

      this.loadContentByWindow();
    });
  }

  private async scrollBehavior(): Promise<void> {
    if (this.loading) return;

    const
    scrollTop = window.pageYOffset || document.body.scrollTop,
    scrollHeight = document.body.scrollHeight;

    if (scrollTop + window.innerHeight + 20 >= scrollHeight) {
      await this.loadArticleList();

      if (this.articleList.length >= this.total) {
        this.removeScrollListener();
        this.removeScrollListener = void(0);
      }
    }
  }

  private subscribeParams(): void {
    const refresh = async () => {
      if (this.loading) return;
      this.currentIndex = 0;
      this.articleList = new Array();

      this.setParams();
      await this.loadArticleList();
      await this.loadContentByWindow();
    }

    this.subscriptions.push(
      this.route.params.subscribe(() => refresh()),
      this.route.queryParams.subscribe(() => refresh())
    );
  }

  private subscribeSignState(): void {
    const subscription = this.auth.events.subscribe(event => {
      if (event instanceof UserSignOut && !this.loading) {
        this.currentIndex = 0;
        this.articleList = new Array();
  
        this.setParams();
        this.loadContentByWindow();
      }
    });

    this.subscriptions.push(subscription);
  }

  private async loadContentByWindow(): Promise<void> {
    if (this.loading || (this.articleList && this.articleList.length >= this.total)) return;
    const measureEl = this.measureElRef.nativeElement as HTMLElement;

    while (
      (!this.articleList || this.articleList.length < this.total)
      && measureEl.getBoundingClientRect().top < window.innerHeight
    ) await this.loadArticleList();
  }

}
