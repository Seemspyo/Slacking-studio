/** Native Modules */
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

/** Services */
import { AuthService } from './auth.service';


@Injectable({
  providedIn: 'root'
})
export class HeaderInjectService implements HttpInterceptor {

  constructor() { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    req = req.clone({ headers: AuthService.headers });

    return next.handle(req);
  }

}
