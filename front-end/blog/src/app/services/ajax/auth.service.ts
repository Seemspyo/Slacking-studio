/** Native Modules */
import { Injectable, EventEmitter } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Meta } from '@angular/platform-browser';

/** Types */
import { UserPayload, User, ResultResponse } from '../@types';

/** Custom Modules */
import { AppInitializingError, UserNotVerifiedError, UserBlockedError, AppError } from 'src/app/helpers/error.helper';
import { BlogHttp } from './blog-http.ajax';
import jwtDecode from 'jwt-decode';
import { UtilHelper } from 'src/app/helpers/util.helper';
import { AppEvent, UserSignOut, UserSignIn } from 'src/app/helpers/event.helper';

/** Variables */
import { WAS_HOST } from './@variables.ajax';


@Injectable({
  providedIn: 'root'
})
export class AuthService extends BlogHttp {

  static headers: HttpHeaders = new HttpHeaders();
  static DEFAULT_PROFILE_IMAGE_PATH = '/assets/images/default-profile-image.png';
  
  private readonly USER_TOKEN_KEY = '__ss_blog_user_token';

  public initialized: boolean = false;
  public sign: boolean = false;
  public currentUser: UserPayload;
  public events: EventEmitter<AppEvent> = new EventEmitter();

  private __app_token: string;

  constructor(
    protected http: HttpClient,
    private meta: Meta
  ) { super(); }

  public async initialAuth(): Promise<void> {
    try {
      if (!this.appToken) throw new AppInitializingError();

      await this.post(this.baseURI('validate-token'), { token: this.appToken });
      AuthService.headers = AuthService.headers.append('ss-app-access-token', this.__app_token);

      const userToken = localStorage.getItem(this.USER_TOKEN_KEY);
      if (userToken) {
        const { token } = await this.post(this.baseURI('refresh-user-token'), { token: userToken });

        this.deserializeUserToken(token);
      }

      this.initialized = true;
      this.initialAuth = () => void(0);
    } catch (error) {
      if (error instanceof AppError) alert('Fail to initialize app.');
      else alert('Unknown error occurred.');
    }
  }

  public async signIn(email: string, password: string): Promise<void> {
    const { token } = await this.post(this.baseURI('sign-in'), { email, password });
    
    this.deserializeUserToken(token);
  }

  public async signUp(userform: User): Promise<ResultResponse> {
    const data = UtilHelper.toFormData(userform, 'profileImage');

    return await this.post(this.baseURI('sign-up'), data);
  }

  public signOut(): void {
    AuthService.headers = AuthService.headers.delete('ss-user-access-token');
    localStorage.removeItem(this.USER_TOKEN_KEY);
    this.sign = false;
    this.currentUser = void(0);
    this.events.emit(new UserSignOut());
  }

  public async sendVerificationMail(email: string, nickname: string): Promise<ResultResponse> {
    return await this.post(this.baseURI('send-verify-mail'), { email, nickname });
  }

  public async verifyUserToken(token: string): Promise<void> {
    return await this.post(this.baseURI('user-verify'), { token });
  }

  public get admin(): boolean {
    return this.sign && this.currentUser.level >= 8;
  }

  public get super(): boolean {
    return this.sign && this.currentUser.level >= 10;
  }

  protected baseURI(relativePath: string): string {
    return `${ WAS_HOST }/auth/${ relativePath }`;
  }

  private get appToken(): string {
    if (!this.__app_token) {
      const appTokenTag = this.meta.getTag('name=app-token');

      if (appTokenTag) {
        this.__app_token = appTokenTag.getAttribute('content');
        this.meta.removeTagElement(appTokenTag);
      }
    }

    return this.__app_token;
  }

  private deserializeUserToken(token: string): void {
    const payload = jwtDecode(token) as UserPayload;
    if (!payload.verified) throw new UserNotVerifiedError(payload.email, payload.nickname);
    if (payload.level < 1) throw new UserBlockedError();

    if (!payload.profileImagePath) payload.profileImagePath = AuthService.DEFAULT_PROFILE_IMAGE_PATH;
    this.currentUser = payload;
    this.sign = true;
    this.events.emit(new UserSignIn());

    localStorage.setItem(this.USER_TOKEN_KEY, token);
    AuthService.headers = AuthService.headers.append('ss-user-access-token', token);
  }

}
