/** Native Modules */
import { Component, OnInit, ViewChild, ElementRef, TemplateRef, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

/** Types */
import { AccountComponentChild, FormItem } from '../@types';
import { HeadProperties } from 'src/app/services/@types';

/** Services */
import { AuthService } from 'src/app/services/ajax/auth.service';
import { StickyBarService } from 'src/app/services/util/sticky-bar.service';

/** Variables */
import { unknownErrorContext, getHttpErrorContext, DuplicationError } from 'src/app/helpers/error.helper';

/** Custom Modules */
import { matchValidator } from 'src/app/helpers/validator.helper';


@Component({
  selector: 'blog-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements /** AccountComponentChild, */ OnInit, OnDestroy {

  public readonly title = 'SIGN UP';
  public readonly headProperties: HeadProperties = {
    meta: {
      'og:title': 'Sign up - Slacking studio x BLOG'
    },
    title: 'Sign up'
  }

  @ViewChild('profileImageInput') profileImageInputRef: ElementRef;
  @ViewChild('Policy', { static: true }) policyTemplateRef: TemplateRef<any>;

  public formGroup = new FormGroup({
    email: new FormControl('', [ Validators.required, Validators.email ]),
    password: new FormControl('', [ Validators.required, Validators.minLength(6), Validators.maxLength(24) ]),
    passwordCheck: new FormControl('', [ Validators.required, matchValidator(() => this.formGroup && this.formGroup.get('password')) ]),
    nickname: new FormControl('', [ Validators.required, Validators.minLength(2), Validators.maxLength(20) ])
  });
  public forms: Array<FormItem> = [
    { id: 'email', title: 'Email*', type: 'text', controlKey: 'email' },
    { id: 'password', title: 'Password*', type: 'password', controlKey: 'password' },
    { id: 'passwordCheck', title: 'Password Check*', type: 'password', controlKey: 'passwordCheck' },
    { id: 'nickname', title: 'Nickname*', type: 'text', controlKey: 'nickname' }
  ]

  public processing: boolean = false;
  public profileImagePath: string;
  private profileImage: File;
  private dialogRef: MatDialogRef<any>;

  constructor(
    private auth: AuthService,
    private stickyBar: StickyBarService,
    private router: Router,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    if (this.auth.sign) {
      this.stickyBar.open('Cannot create Account when signed in.');
      this.router.navigateByUrl('/', { replaceUrl: true });
      return;
    }
    this.profileImagePath = AuthService.DEFAULT_PROFILE_IMAGE_PATH;
  }

  ngOnDestroy() {
    if (this.dialogRef) this.dialogRef.close();
  }

  public defaultValidator(controlKey: string): boolean {
    const control = this.formGroup.get(controlKey);
    if (!control) return true;

    return control.dirty && control.invalid;
  }

  public onProfileImageSelect(): void {
    const inputEl = this.profileImageInputRef.nativeElement as HTMLInputElement;

    if (inputEl.files && inputEl.files[0]) {
      const
      image = inputEl.files[0],
      reader = new FileReader();

      reader.addEventListener('loadend', () => this.profileImagePath = reader.result as string);
      reader.readAsDataURL(image);
      this.profileImage = image;
    } else {
      this.profileImagePath = AuthService.DEFAULT_PROFILE_IMAGE_PATH;
      this.profileImage = void(0);
    }
  }

  public async signUp(event: Event): Promise<void> {
    event.preventDefault();
    if (this.formGroup.invalid || this.processing) return;

    this.processing = true;
    this.formGroup.disable();

    try {
      const { email, nickname, password } = this.formGroup.controls;

      await this.auth.signUp({
        email: email.value,
        nickname: nickname.value,
        password: password.value,
        profileImage: this.profileImage,
        profileImageFileName: this.profileImage && this.profileImage.name
      });
      this.stickyBar.open('You have created an account.');
      this.router.navigateByUrl('/account/sign-in');

      try {
        await this.auth.sendVerificationMail(email.value, nickname.value);
        this.stickyBar.open('Send you an Email for verification.\nPlease check mail box.');
      } catch (error) {
        this.stickyBar.open('Error while send an verification Email.\nPlease retry later');
      }
    } catch (error) {
      let message: string = unknownErrorContext;

      if (error instanceof HttpErrorResponse) message = getHttpErrorContext(error.status);
      else if (error instanceof DuplicationError) message = error.message;

      this.stickyBar.open(message);
      this.formGroup.enable();
      this.processing = false;
    }
  }

  public get signable(): boolean {
    return this.formGroup.valid && !this.processing;
  }

  public openServiceTerm(): void {
    this.dialogRef = this.dialog.open(this.policyTemplateRef);
  }

}
