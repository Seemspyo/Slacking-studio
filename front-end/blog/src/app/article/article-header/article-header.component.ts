/** Native Modules */
import { Component, OnInit, OnDestroy, ElementRef, ViewChild, Renderer2 } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { trigger } from '@angular/animations';

/** Services */
import { AuthService } from 'src/app/services/ajax/auth.service';
import { StickyBarService } from 'src/app/services/util/sticky-bar.service';
import { ArticleService } from 'src/app/services/ajax/article.service';

/** Types */
import { SearchKeyword, visibilityState, activationState } from '../@types';
import { UserPayload } from 'src/app/services/@types';

/** Font Awesome */
import { faSearch } from '@fortawesome/free-solid-svg-icons';

/** Animations */
import { toggleSlideDown } from 'src/app/animations/slide.animation';


@Component({
  selector: 'blog-article-header',
  templateUrl: './article-header.component.html',
  styleUrls: ['./article-header.component.scss'],
  animations: [
    trigger('slideDown', toggleSlideDown)
  ]
})
export class ArticleHeaderComponent implements OnInit, OnDestroy {

  @ViewChild('searchInput', { static: false }) searchInputElRef: ElementRef;

  public searchQuery: string;
  public keywords: Array<SearchKeyword>;
  private tags: Array<string> = []

  private readonly MAX_KEYWORD_LIST_LENGTH = 12;

  public readonly searchIcon = faSearch;
  public keywordVisibility: boolean = false;
  public tabVisibility: boolean = false;
  public searchMode: boolean = false;
  public user: UserPayload;

  private removeTabHideEvent: () => void;
  private routeEventSubscription: Subscription;

  constructor(
    public auth: AuthService,
    private article: ArticleService,
    private router: Router,
    private renderer: Renderer2,
    private stickyBar: StickyBarService
  ) { }

  ngOnInit() {
    this.watchRouteEvent();
    this.setSearchQueryFromUri();
    this.setTags();
    this.user = this.auth.currentUser;
  }

  ngOnDestroy() {
    if (this.routeEventSubscription) this.routeEventSubscription.unsubscribe();
  }

  public search(event: Event): void {
    event.preventDefault();
    if (!this.searchQuery) return;

    this.router.navigate(['/'], { queryParams: { search: this.searchQuery } });
    this.toggleKeywordList('hide');
    this.toggleSearchMode('deactivate');
  }

  public refreshKeywordList(): void {
    const query = this.searchQuery.toLowerCase();
    if (!query) return this.keywords = void(0);

    this.keywords = this.tags.filter(tag => tag.includes(query))
    .sort()
    .slice(0, this.MAX_KEYWORD_LIST_LENGTH)
    .map(tag => ({ value: tag, selected: false }));
  }

  public selectKeyword(event: KeyboardEvent): void {
    const
    input = event.key.toLowerCase(),
    key = ['down', 'up'].find(key => input.includes(key));

    if (!key) return;

    event.preventDefault();

    switch (key) {
      case 'down':
        this.navigateKeywordList(+1);
        break;
      case 'up':
        this.navigateKeywordList(-1);
        break;
    }
  }

  public toggleKeywordList(command?: visibilityState, blur?: boolean): void {
    switch (command) {
      case 'show':
        this.keywordVisibility = true;
        break;
      case 'hide':
        const action = () => {
          this.keywordVisibility = false;
          this.keywords = []
        }

        if (blur) {
          const remove = this.renderer.listen(window, 'pointerup', () => {
            window.setTimeout(() => action());
            remove();
          });
        } else action();
        break;
      default:
        this.keywordVisibility = !this.keywordVisibility;
    }
  }

  public toggleUserTab(command?: visibilityState): void {
    switch (command) {
      case 'show':
        this.tabVisibility = true;
        break;
      case 'hide':
        this.tabVisibility = false;
        break;
      default:
        this.tabVisibility = !this.tabVisibility;
    }

    switch (this.tabVisibility) {
      case true:
        this.removeTabHideEvent = this.renderer.listen(window, 'click', () => this.toggleUserTab('hide'));
        break;
      case false:
        this.removeTabHideEvent();
        break;
    }
  }

  public toggleSearchMode(command?: activationState, blur?: boolean): void {
    const
    searchInputEl = this.searchInputElRef.nativeElement as HTMLInputElement,
    activeEl = document.activeElement;

    switch (command) {
      case 'activate':
        this.searchMode = true;
        if (activeEl !== searchInputEl) searchInputEl.focus();
        break;
      case 'deactivate':
        const action = () => {
          this.searchMode = false;

          if (activeEl === searchInputEl) searchInputEl.blur();
        }

        if (blur) {
          const remove = this.renderer.listen(window, 'pointerup', () => {
            window.setTimeout(() => action());
            remove();
          });
        } else action();
        break;
    }
  }
  
  public signOut(): void {
    const nickname = this.auth.currentUser.nickname;

    this.toggleUserTab('hide');
    this.auth.signOut();
    this.user = void(0);
    this.router.navigateByUrl('/');

    this.stickyBar.open(`Goodbye. ${ nickname }`);
  }

  public get redirectQuery(): { [key: string]: string } {
    return { redirect: this.router.url }
  }

  private navigateKeywordList(direction: number): void {
    const currentItem = this.keywords.find(item => item.selected);

    if (currentItem) {
      let index = this.keywords.indexOf(currentItem) + direction;
      if (index < 0) index = this.keywords.length - 1;
      if (index >= this.keywords.length) index = 0;

      const targetItem = this.keywords[index];

      if (currentItem !== targetItem) {
        currentItem.selected = false;
        targetItem.selected = true;
        this.searchQuery = targetItem.value;
      }
    } else if (this.keywords[0]) {
      this.keywords[0].selected = true;
      this.searchQuery = this.keywords[0].value;
    }
  }

  private watchRouteEvent(): void {
    this.routeEventSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) this.setSearchQueryFromUri();
    });
  }

  private setSearchQueryFromUri(): void {
    const { queryParams } = this.router.parseUrl(this.router.url);

    this.searchQuery = (queryParams && queryParams.search) || '';
  }

  private async setTags(): Promise<void> {
    try {
      this.tags = await this.article.getTagAll();
    } catch (error) {
      this.stickyBar.open('An error occurred.');
    }
  }

}
