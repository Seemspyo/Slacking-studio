/** Native Modules */
import { Component, ViewChild, ElementRef, TemplateRef } from '@angular/core';
import { trigger } from '@angular/animations';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

/** Custom Modules */
import { UtilHelper } from 'src/app/helpers/util.helper';
import { unknownErrorContext, getHttpErrorContext, UserNotVerifiedError, UserBlockedError } from 'src/app/helpers/error.helper';

/** Services */
import { AuthService } from 'src/app/services/ajax/auth.service';
import { UserService } from 'src/app/services/ajax/user.service';
import { StickyBarService } from 'src/app/services/util/sticky-bar.service';

/** Types */
import { AccountComponentChild } from '../@types';
import { UserPublic, HeadProperties } from 'src/app/services/@types';

/** Font Awesome */
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons';

/** Animations */
import { signInMainButtonAnimation } from 'src/app/animations/sign-in.animation';
import { fadeEnterLeave } from 'src/app/animations/fade.animation';


@Component({
  selector: 'blog-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
  animations: [
    trigger('mainButton', signInMainButtonAnimation),
    trigger('fade', fadeEnterLeave)
  ]
})
export class SignInComponent /* implements AccountComponentChild **/ {

  public readonly title = 'SIGN IN';
  public readonly headProperties: HeadProperties = {
    meta: {
      "og:title": 'Sign in - Slacking studio x BLOG'
    },
    title: 'Sign in'
  }

  @ViewChild('formInput') formInputRef: ElementRef;
  @ViewChild('ResendMailTemplate') mailTemplateRef: TemplateRef<any>;

  public step: number = 0;
  public formType: 'text' | 'password' = 'text';
  public formLabel: 'Email' | 'Password' = 'Email';
  public formValue: string;
  public processing: boolean = false;

  private userPublic: UserPublic;
  private resendStickyBarId: string;

  public readonly angleIcon = faAngleLeft;

  constructor(
    private auth: AuthService,
    private user: UserService,
    private stickyBar: StickyBarService,
    private router: Router
  ) { }

  public go(direction: number): void {
    this.step = UtilHelper.confine(this.step + direction, 2, 0);

    this.afterStep();
  }
  
  public async onSubmit(event: Event): Promise<void> {
    event.preventDefault();

    this.processing = true;
    this.formInputRef.nativeElement.blur();

    switch (this.step) {
      case 1:
        await this.getUserPublicInfo();
        break;
      case 2:
        await this.signIn();
        break;
    }

    this.processing = false;
  }

  public focusOnInput(): void {
    if (this.step > 0 && this.formInputRef) window.setTimeout(() => {
      if (!this.processing) this.formInputRef.nativeElement.focus();
    });
  }

  public preventPropagation(event: MouseEvent): void {
    event.stopPropagation();
  }

  public async sendVerificationMail(): Promise<void> {
    try {
      this.dismissStickBar();

      await this.auth.sendVerificationMail(this.userPublic.email, this.userPublic.nickname);
      this.stickyBar.open('Send you an Email for verification.\nPlease check mail box.');
    } catch (error) {
      this.stickyBar.open('Error while send an verification Email.\nPlease retry later');
    }
  }

  public dismissStickBar(): void {
    this.stickyBar.dismiss(this.resendStickyBarId, true);
    this.resendStickyBarId = void(0);
  }

  public get signed(): boolean {
    return this.auth.sign;
  }

  public get profileImagePath(): string {
    return (this.userPublic && this.userPublic.profileImagePath) || AuthService.DEFAULT_PROFILE_IMAGE_PATH;
  }

  public onMainButtonClick(): void {
    switch (this.signed) {
      case true:
        this.auth.signOut();
        break;
      case false:
        if (this.step === 0) this.go(+1);
        break;
    }
  }

  private afterStep(): void {
    switch (this.step) {
      case 0:
        this.formType =
        this.formLabel = void(0);
        break;
      case 1:
        this.formType = 'text';
        this.formLabel = 'Email';
        if (this.userPublic && this.userPublic.email) this.formValue = this.userPublic.email;
        this.focusOnInput();
        break;
      case 2:
        this.formType = 'password';
        this.formLabel = 'Password';
        this.focusOnInput();
        break;
    }
  }

  private async getUserPublicInfo(): Promise<void> {
    try {
      const email = this.formValue.includes('@') ? this.formValue : `${ this.formValue }@eunsatio.io`;

      this.userPublic = await this.user.getUserPublic(email);
      this.formValue = '';
      this.go(+1);
    } catch (error) {
      let message: string = 'Unknown error occurred.';

      if (error instanceof HttpErrorResponse) {
        if (error.status === 404) {
          message = 'Fail to find an Account.\nPlease check your Email address again.';
          this.focusOnInput();
        }
        else message = `${ error.status }: Connection error occurred.`;
      }

      this.stickyBar.open(message);
    }
  }

  private async signIn(): Promise<void> {
    try {
      await this.auth.signIn(this.userPublic.email, this.formValue);

      this.stickyBar.open(`Welcome. ${ this.auth.currentUser.nickname }`);

      const urlTree = this.router.parseUrl(this.router.url);
      this.router.navigateByUrl(urlTree.queryParams.redirect || '/');
    } catch (error) {
      let message: string = unknownErrorContext;

      if (error instanceof HttpErrorResponse) {
        if (error.status === 401) {
          message = 'Wrong password.';
          this.focusOnInput();
        }
        else message = getHttpErrorContext(error.status);
      }

      if (error instanceof UserBlockedError) {
        message = 'This Account have been blocked.\nPlease contact site manager.';
        this.go(-1);
      }
      if (error instanceof UserNotVerifiedError) {
        if (!this.resendStickyBarId) this.resendStickyBarId = this.stickyBar.open(this.mailTemplateRef, { duration: void(0) });
        return;
      }

      this.stickyBar.open(message);
    }
  }

}
