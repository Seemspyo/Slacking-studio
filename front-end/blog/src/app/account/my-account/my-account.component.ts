/** Native Modules */
import { Component, OnInit, ViewChild, TemplateRef, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';

/** Types */
import { AccountComponentChild, FormItem, MyAccountNavigationButton, Bookmark, UserComment } from '../@types';
import { UserPublic, User, Article, ArticleComment, HeadProperties } from 'src/app/services/@types';

/** Services */
import { AuthService } from 'src/app/services/ajax/auth.service';
import { UserService } from 'src/app/services/ajax/user.service';
import { StickyBarService } from 'src/app/services/util/sticky-bar.service';
import { ArticleService } from 'src/app/services/ajax/article.service';
import { CommentService } from 'src/app/services/ajax/comment.service';

/** Variables */
import { unknownErrorContext, getHttpErrorContext, DuplicationError } from 'src/app/helpers/error.helper';

/** Directives */
import { FileInputDirective } from 'src/app/modules/input/file-input.directive';

/** Custom Modules */
import { matchValidator } from 'src/app/helpers/validator.helper';

/** Font Awesome */
import { faUser, faBookmark, faComments, faRedoAlt, IconDefinition, faHome } from '@fortawesome/free-solid-svg-icons';
import { faUser as faUserEmpty, faBookmark as faBookmarkEmpty, faComments as faCommentsEmpty } from '@fortawesome/free-regular-svg-icons';


@Component({
  selector: 'blog-my-account',
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.scss']
})
export class MyAccountComponent implements AccountComponentChild, OnInit, OnDestroy {

  public readonly title = 'MY PAGE';
  public readonly headProperties: HeadProperties = {
    meta: {
      'og:title': 'My page - Slacking studio x BLOG'
    },
    title: 'My page'
  }

  @ViewChild(FileInputDirective, { static: false }) profileImageInputRef: FileInputDirective;
  @ViewChild('DeleteConfirm', { static: false }) deleteTemplateRef: TemplateRef<any>;

  public formGroup = new FormGroup({
    email: new FormControl('', [ Validators.required, Validators.email ]),
    password: new FormControl('', [ Validators.minLength(6), Validators.maxLength(24) ]),
    passwordCheck: new FormControl('', [ matchValidator(() => this.formGroup && this.formGroup.get('password')) ]),
    nickname: new FormControl('', [ Validators.required, Validators.minLength(2), Validators.maxLength(20) ]),
    introduction: new FormControl('', [ Validators.maxLength(250) ])
  });
  public forms: Array<FormItem> = [
    { id: 'email', title: 'Email*', type: 'text', controlKey: 'email' },
    { id: 'password', title: 'Password', type: 'password', controlKey: 'password' },
    { id: 'passwordCheck', title: 'Password Check', type: 'password', controlKey: 'passwordCheck' },
    { id: 'nickname', title: 'Nickname*', type: 'text', controlKey: 'nickname' }
  ]
  public readonly buttonList: Array<MyAccountNavigationButton> = [
    { id: 'main', title: 'Main', icon: faHome },
    { id: 'account', title: 'Account', get icon() { return this.active ? faUser : faUserEmpty; } },
    { id: 'bookmark', title: 'Bookmarks', get icon() { return this.active ? faBookmark : faBookmarkEmpty; } },
    { id: 'comment', title: 'Comments', get icon() { return this.active ? faComments : faCommentsEmpty; } }
  ]
  public bookmarkList: Array<Bookmark>;
  public commentList: Array<UserComment>;

  public processing: boolean = false;
  public tabId: string;
  public userNickname: string;
  public dismissConfirm: () => void;

  public userInfo: UserPublic;
  private newProfileImage: File;
  private newProfileImagePath: string;

  private date: DatePipe = new DatePipe('en_US');

  public readonly refreshIcon = faRedoAlt;

  constructor(
    private auth: AuthService,
    private user: UserService,
    private article: ArticleService,
    private comment: CommentService,
    private router: Router,
    private stickyBar: StickyBarService
  ) { }

  ngOnInit() {
    if (!this.auth.sign) this.router.navigateByUrl('/account/sign-in', { replaceUrl: true });

    this.navigate(this.buttonList[1]);
  }

  ngOnDestroy() {
    if (this.dismissConfirm) this.dismissConfirm();
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

      reader.addEventListener('loadend', () => this.newProfileImagePath = reader.result as string);
      reader.readAsDataURL(image);
      this.newProfileImage = image;
    } else {
      this.newProfileImagePath = void(0);
      this.newProfileImage = void(0);
    }
  }

  public get profileImagePath(): string {
    return this.newProfileImagePath || (this.userInfo && this.userInfo.profileImagePath) || AuthService.DEFAULT_PROFILE_IMAGE_PATH;
  }

  public get updatable(): boolean {
    const controls = this.formGroup.controls;
    let change: boolean = false;

    if (this.userInfo)
      for (const key in controls)
        if (controls[key].value !== this.userInfo[key]) {
          change = true;
          break;
        }

    const group = this.formGroup;

    return this.formGroup.valid
    && (
      (change && group.get('password').value === group.get('passwordCheck').value)
      || Boolean(this.newProfileImage)
    ) && !this.processing;
  }

  public async update(event: Event): Promise<void> {
    event.preventDefault();
    if (!this.updatable || this.processing) return;

    this.processing = true;
    this.formGroup.disable();

    const
    controls = this.formGroup.controls,
    updateForm: User = new Object();
    
    if (this.newProfileImage) {
      updateForm.profileImage = this.newProfileImage;
      updateForm.profileImageFileName = this.newProfileImage.name;
    }

    for (const key of ['password', 'nickname', 'introduction']) {
      const value = controls[key].value;

      if (value) updateForm[key] = value;
    }

    try {
      await this.user.updateUser(this.userInfo.email, updateForm);
      this.stickyBar.open('Updated.');

      await this.setUserInfo();
    } catch (error) {
      this.handleError(error);
    }

    this.formGroup.enable();
    this.formGroup.get('email').disable();
    this.processing = false;
  }

  public navigate(button: MyAccountNavigationButton): void {
    const prevItem = this.buttonList.find(button => button.active);
    if (prevItem === button) return;

    if (button.id !== 'main') {
      if (prevItem) prevItem.active = false;
      this.tabId = button.id;
      button.active = true;
    }

    switch (button.id) {
      case 'main':
        this.router.navigateByUrl('/');
        break;
      case 'account':
        this.setUserInfo();
        if (this.formGroup.get('email').enabled) this.formGroup.get('email').disable();
        break;
      case 'bookmark':
        this.setBookmarkList();
        break;
      case 'comment':
        this.setUserCommentList();
        break;
    }
  }

  public async refresh(): Promise<void> {
    switch (this.tabId) {
      case 'bookmark':
        this.setBookmarkList();
        break;
      case 'comment':
        this.setUserCommentList();
        break;
    }
  }

  public getBookmarkIcon(bookmark: Bookmark): IconDefinition {
    return bookmark.marked ? faBookmark : faBookmarkEmpty;
  }

  public async toggleBookmark(bookmark: Bookmark): Promise<void> {
    if (this.processing) return;
    const title = this.article.encodeTitle(bookmark.title);

    this.processing = true;

    try {
      switch (bookmark.marked) {
        case true:
          await this.article.cancelLike(title);
          this.stickyBar.open('Remove bookmark.');
          break;
        case false:
          await this.article.addLike(title);
          this.stickyBar.open('Add bookmark.');
          break;
      }

      bookmark.marked = !bookmark.marked;
    } catch (error) {
      this.handleError(error);
    }

    this.processing = false;
  }

  public confirmDelete(): void {
    if (!this.dismissConfirm) {
      const id = this.stickyBar.open(this.deleteTemplateRef, { duration: void(0) });

      this.dismissConfirm = () => {
        this.stickyBar.dismiss(id, true);
        this.userNickname =
        this.dismissConfirm = void(0);
      }
    }
  }

  public get nicknameMismatch(): boolean {
    return this.userNickname !== this.auth.currentUser.nickname;
  }

  public async deleteUser(): Promise<void> {
    const { nickname, email } = this.auth.currentUser;

    if (this.userNickname === nickname) {
      this.processing = true;
      this.dismissConfirm();
      this.userNickname = void(0);

      try {
        await this.user.deleteUser(email);
        this.stickyBar.open(`Farewell. ${ nickname }.`);
        this.auth.signOut();
        this.router.navigateByUrl('/account/sign-in');
      } catch (error) {
        let message: string = unknownErrorContext;

        if (error instanceof HttpErrorResponse) message = getHttpErrorContext(error.status);

        this.stickyBar.open(message);
      }

      this.processing = false;
    }
  }

  private async setUserInfo(): Promise<void> {
    try {
      this.userInfo = await this.user.getUserPublic(this.auth.currentUser.email);

      for (const key in this.formGroup.controls) if (this.userInfo[key]) this.formGroup.controls[key].setValue(this.userInfo[key]);
      if (this.userInfo.profileImageFileName) this.profileImageInputRef.setValue(this.userInfo.profileImageFileName);
    } catch (error) {
      this.handleError(error);
    }
  }

  private handleError(error: any): void {
    let message: string = unknownErrorContext;

    if (error instanceof HttpErrorResponse) {
      if ([401, 403, 404].includes(error.status)) {
        message = 'Wrong approach';
        this.router.navigateByUrl('/', { replaceUrl: true });
      } else message = getHttpErrorContext(error.status);
    } else if (error instanceof DuplicationError) message = error.message;

    this.stickyBar.open(message);
  }

  private async setBookmarkList(): Promise<void> {
    if (this.processing) return;
    this.processing = true;

    try {
      const articles = await this.article.getBookmarks(this.auth.currentUser._id);

      this.bookmarkList = this.toBookmarkAll(articles);
    } catch (error) { 
      this.handleError(error);
    }

    this.processing = false;
  }

  private toBookmarkAll(articles: Array<Article>): Array<Bookmark> {
    return articles.map(article => {
      const { title, category, date } = article;

      return {
        title: this.article.decodeTitle(title),
        category,
        link: `/${ category }/${ title }`,
        date: this.getDateString(date),
        marked: true
      }
    });
  }

  public getDateString(dates: Article["date"], createdPrefix?: string, updatedPrefix?: string, format?: string): string {
    const
    createdAt = new Date(dates.createdAt),
    updatedAt = new Date(dates.lastUpdatedAt);

    let
    prefix: string,
    date: Date;

    if (createdAt.getTime() === updatedAt.getTime()) {
      prefix = createdPrefix || 'published';
      date = createdAt;
    } else {
      prefix = updatedPrefix || 'updated';
      date = updatedAt;
    }

    return `${ prefix } · ${ this.date.transform(date, format || 'MMM d, y') }`;
  }

  private async setUserCommentList(): Promise<void> {
    if (this.processing) return;
    this.processing = true;

    try {
      const comments = await this.comment.getCommentByUser(this.auth.currentUser._id);

      this.commentList = this.toUserCommentAll(comments);
    } catch (error) { 
      this.handleError(error);
    }

    this.processing = false;
  }

  private toUserCommentAll(comments: Array<ArticleComment>): Array<UserComment> {
    return comments.map(comment => {
      const { article, date, content } = comment;

      return {
        articleTitle: article && this.article.decodeTitle(article.title) || 'Deleted article',
        link: article && `/${ article.category }/${ article.title }`,
        date: this.getDateString(date, 'posted'),
        content
      }
    });
  }

}
