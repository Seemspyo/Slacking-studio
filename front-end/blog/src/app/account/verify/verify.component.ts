/** Native Modules */
import { Component, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

/** Services */
import { AuthService } from 'src/app/services/ajax/auth.service';

/** Types */
import { AccountComponentChild } from '../@types';


@Component({
  selector: 'blog-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.scss']
})
export class VerifyComponent implements /** AccountComponentChild, */ AfterViewInit {

  public readonly title = 'VERIFY';

  constructor(
    private auth: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngAfterViewInit() {
    this.verifyToken();
  }

  private async verifyToken(): Promise<void> {
    const token = this.route.snapshot.queryParamMap.get('auth');
    if (!token) {
      this.router.navigateByUrl('/404', { skipLocationChange: true });
      return;
    }

    try {
      await this.auth.verifyUserToken(token);
      alert('Verification successful.');
      this.router.navigateByUrl('/account/sign-in', { replaceUrl: true });
    } catch (error) {
      alert('Error during verification.\nPlease contact site manager for more detail.');
      this.router.navigateByUrl('/', { replaceUrl: true });
    }
  }

}
