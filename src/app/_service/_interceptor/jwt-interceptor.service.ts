import { Injectable } from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {JwtAuthenticationService} from '../_authentication/jwt-authentication.service';
import {Router} from '@angular/router';

@Injectable()
export class JwtInterceptorService implements HttpInterceptor {
  constructor(private jwtService: JwtAuthenticationService, public router:Router) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if(!request.url.includes('https://iplist.cc/api/')){
      let a = localStorage.getItem('jwtAccessToken');
      if (a) {
        request = request.clone({
          setHeaders: {
            Authorization: `Bearer ${a}`
          }
        });
      }
    }
    return next.handle(request).pipe(
      catchError(err => {
        console.log(err.status)
        if ([401, 404].includes(err.status)) {
        this.router.navigateByUrl('/error')
      }  else if([403].includes(err.status)) {
          console.log('goood to be here');
          this.jwtService.logout();
         //this.router.navigateByUrl('/login');
      }
       else if([500, 0].includes(err.status)) this.router.navigateByUrl('/serverError')
      return throwError(err);
    })
    );
/*
    return next.handle(request).pipe(
      map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          console.log('event--->>>', event);
        }
        return event;
      }));
*/
  }
}
