/** Native Modules */
import { Component, OnInit, OnDestroy, Renderer2, Output, EventEmitter, AfterViewChecked, ViewChild, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router, NavigationEnd } from '@angular/router';
import { trigger } from '@angular/animations';

/** Custom Modules */
import { UtilHelper } from 'src/app/helpers/util.helper';

/** Types */
import { UserPublic } from 'src/app/services/@types';
import { OuterLink } from '../@types';

/** Services */
import { CategoryService } from 'src/app/services/util/category.service';
import { ArticleService } from 'src/app/services/ajax/article.service';
import { UserService } from 'src/app/services/ajax/user.service';
import { StickyBarService } from 'src/app/services/util/sticky-bar.service';
import { AuthService } from 'src/app/services/ajax/auth.service';

/** Font Awesome */
import { faHSquare, faParking } from '@fortawesome/free-solid-svg-icons';
import { faGithub } from '@fortawesome/free-brands-svg-icons';

/** Animations */
import { slide } from 'src/app/animations/navigation.animation';


@Component({
  selector: 'blog-article-navigation',
  templateUrl: './article-navigation.component.html',
  styleUrls: ['./article-navigation.component.scss'],
  animations: [
    trigger('slide', slide)
  ]
})
export class ArticleNavigationComponent implements OnInit, AfterViewChecked, OnDestroy {

  public currentCategory: string;
  public categoryList: Array<string>;
  public owner: UserPublic;
  public profileLink: Array<OuterLink> = [
    { uri: 'https://eunsatio.io', target: "_self", icon: faHSquare, title: 'Home' },
    { uri: 'https://playground.eunsatio.io', target: "_self", icon: faParking, title: 'Playground' },
    { uri: 'https://github.com/SeemsPyo', target: '_blank', icon: faGithub, title: 'Github' }
  ]
  public pointerInBounds: boolean = false;
  public sideNavigation: boolean = false;
  public open: boolean = true;
  public scrollWidthVariable: string;

  private categoryListSubscription: Subscription;
  private currentCategorySubscription: Subscription;
  private navigationEventSubscription: Subscription;
  private events: Array<() => void> = new Array();

  @Output('afterInit') afterInitEmitter: EventEmitter<void> = new EventEmitter();
  @ViewChild('containerEl') containerElRef: ElementRef;

  constructor(
    public category: CategoryService,
    private article: ArticleService,
    private user: UserService,
    private stickyBar: StickyBarService,
    private router: Router,
    private renderer: Renderer2,
    private auth: AuthService
  ) { }

  ngOnInit() {
    try {
      this.setOwnerInfo();
      this.setCategories();
    } catch (error) {
      this.stickyBar.open('Error during load navigation bar');
      return;
    }

    this.subscribeCategoryList();
    this.subscribeCurrentCategory();
    this.subscribeNavigationEvent();
    this.setCurrentNavigationByUrl(this.router.url);
    this.events.push(this.renderer.listen(window, 'resize', this.resize.bind(this)));
    this.resize();
    this.setScrollWidth();
    this.setTouchAction();
  }

  ngAfterViewChecked() {
    window.setTimeout(() => this.setScrollWidth());
  }

  ngOnDestroy() {
    UtilHelper.unsubscribeAll(this.categoryListSubscription, this.currentCategorySubscription, this.navigationEventSubscription);
    for (const remove of this.events) remove();
  }

  public toggleButtonStyle(event: PointerEvent): void {
    switch (event.type) {
      case 'pointerenter':
        this.pointerInBounds = true;
        break;
      case 'pointerleave':
        this.pointerInBounds = false;
        break;
    }
  }

  public toggleNavigation(): void {
    if (this.sideNavigation) this.open = !this.open;
  }

  public get slideState(): string {
    if (this.sideNavigation && this.open) return 'in';
    
    return void(0);
  }

  private async setCategories(): Promise<void> {
    let status: boolean = true;
    if (this.auth.admin) status = void(0);

    this.category.add(await this.article.getCategoryAll(status));

    this.afterInitEmitter.emit();
  }

  private async setOwnerInfo(): Promise<void> {
    this.owner = await this.user.getUserPublic('eunsatio@eunsatio.io');
  }

  private subscribeCategoryList(): void {
    this.categoryListSubscription = this.category.categoryList.subscribe(c => this.categoryList = c);
  }

  private subscribeCurrentCategory(): void {
    this.currentCategorySubscription = this.category.currentCategory.subscribe(c => this.currentCategory = c);
  }

  private subscribeNavigationEvent(): void {
    this.navigationEventSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) this.setCurrentNavigationByUrl(event.urlAfterRedirects || event.url);
    });
  }

  private setCurrentNavigationByUrl(url: string): void {
    const root = this.router.parseUrl(url).root;
    let path: string;

    if (root.hasChildren && root.children.primary && root.children.primary.segments[0]) path = root.children.primary.segments[0].path;

    this.category.set(path);
    if (this.open) this.open = false;
  }

  private resize(): void {
    switch (window.innerWidth < 1240) {
      case true:
        this.sideNavigation = true;
        break;
      case false:
        this.sideNavigation = false;
        this.open = false;
        break;
    }
    this.setScrollWidth();
  }

  private setScrollWidth(): void {
    this.scrollWidthVariable = `--scrollbar: ${ window.innerWidth - document.body.offsetWidth }px`;
  }

  private setTouchAction(): void {
    if (!('ontouchstart' in window)) return;

    const position = { x: void(0), y: void(0) }

    this.events.push(this.renderer.listen(window, 'touchstart', (event: TouchEvent) => this.touchAction(event, position)));
    this.events.push(this.renderer.listen(window, 'touchend', (event: TouchEvent) => this.touchAction(event, position)));
  }

  private touchAction(event: TouchEvent, position: { x: number; y: number; }): void {
    const path = event.composedPath && event.composedPath();
    if (path
      && !path.includes(this.containerElRef.nativeElement)
      && !path.every(el => !(el instanceof HTMLElement && el.clientHeight < el.offsetHeight))
    ) return;

    switch (event.type) {
      case 'touchstart':
        position.x = event.touches[0].clientX;
        position.y = event.touches[0].clientY;
        break;
      case 'touchend':
        const
        amountX = position.x - event.changedTouches[0].clientX,
        amountY = position.y - event.changedTouches[0].clientY;

        if (Math.abs(amountX) <= Math.abs(amountY) || Math.abs(amountX) < 40) break;

        this.open = amountX > 0;
        break;
    }
  }

}
