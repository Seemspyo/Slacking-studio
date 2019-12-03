/** Native Modules */
import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

/** Types */
import { DashboardCard } from '../@types';

/** Font Awesome */
import { faUserShield, faCookieBite } from '@fortawesome/free-solid-svg-icons';
import { faLaugh, faCommentDots } from '@fortawesome/free-regular-svg-icons';

/** Services */
import { AnalyticsService } from 'src/app/services/ajax/analytics.service';
import { StickyBarService } from 'src/app/services/util/sticky-bar.service';

/** Custom Modules */
import { getHttpErrorContext, unknownErrorContext } from 'src/app/helpers/error.helper';


@Component({
  selector: 'blog-administrator-dashboard',
  templateUrl: './administrator-dashboard.component.html',
  styleUrls: ['./administrator-dashboard.component.scss']
})
export class AdministratorDashboardComponent implements OnInit {

  public infoList: Array<DashboardCard> = [
    { id: 'overview-user', icon: faUserShield, data: 0, label: 'Active users' },
    { id: 'overview-article', icon: faCookieBite, data: 0, label: 'Post published' },
    { id: 'overview-view', icon: faLaugh, data: 0, label: 'Hits' },
    { id: 'overview-comment', icon: faCommentDots, data: 0, label: 'Comments' }
  ]

  constructor(
    private analytics: AnalyticsService,
    private sticky: StickyBarService
  ) { }

  ngOnInit() {
    this.setInfos();
  }

  private async setInfos(): Promise<void> {
    const an = this.analytics;

    try {
      const datas = [
        await an.getActiveUserCount(),
        await an.getPublicArticleCount(),
        await an.getArticleViewCount(),
        await an.getCommentCount()
      ]

      datas.forEach((data, index) => this.infoList[index].data = data.count || 0);
    } catch (error) {
      this.sticky.open(error instanceof HttpErrorResponse ? getHttpErrorContext(error.status) : unknownErrorContext);
    }
  }

}
