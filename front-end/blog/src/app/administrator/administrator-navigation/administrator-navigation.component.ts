/** Native Modules */
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { Subscription } from 'rxjs';

/** Font Awesome */
import { faPowerOff, faTachometerAlt, faCookieBite, faComments, faUsersCog } from '@fortawesome/free-solid-svg-icons';

/** Types */
import { NavigationButton } from '../@types';

/** Services */
import { AuthService } from 'src/app/services/ajax/auth.service';
import { StickyBarService } from 'src/app/services/util/sticky-bar.service';

/** Custom Modules */
import { UtilHelper } from 'src/app/helpers/util.helper';


@Component({
  selector: 'blog-administrator-navigation',
  templateUrl: './administrator-navigation.component.html',
  styleUrls: ['./administrator-navigation.component.scss']
})
export class AdministratorNavigationComponent implements OnInit, OnDestroy {

  public readonly signOutIcon = faPowerOff;
  public navigationList: Array<NavigationButton>;
  public prevNavigation: NavigationButton;

  private routerEventSubscription: Subscription;

  constructor(
    private auth: AuthService,
    private router: Router,
    private sticky: StickyBarService
  ) { }

  ngOnInit() {
    this.setNavigationList();
    this.subscribeRouterEvent();
  }

  ngOnDestroy() {
    UtilHelper.unsubscribeAll(this.routerEventSubscription);
  }

  public signOut(): void {
    this.auth.signOut();
    this.router.navigateByUrl('/');
    this.sticky.open('Goodbye.');
  }

  private setNavigationList(): void {
    const navigationList: Array<NavigationButton> = [
      { url: '/masters', icon: faTachometerAlt, label: 'Dashboard' },
      { url: '/masters/articles', icon: faCookieBite, label: 'Articles' },
      { url: '/masters/comments', icon: faComments, label: 'Comments' }
    ]

    if (this.auth.currentUser.level >= 10) navigationList.splice(1, 0, {
      url: '/masters/users', icon: faUsersCog, label: 'Users'
    });

    this.navigationList = navigationList;
  }

  private subscribeRouterEvent(): void {
    const find = (url: string) => this.navigationList.find(navigation => navigation.url === url);

    this.prevNavigation = find(this.router.url);
    this.routerEventSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) this.prevNavigation = find(event.url);
    });
  }

}
