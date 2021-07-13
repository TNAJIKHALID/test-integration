import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {JwtAuthenticationService} from '../_authentication/jwt-authentication.service';

@Injectable({
  providedIn: 'root'
})
export class LoggedGuardService implements CanActivate{
  private routeURL: string;
  constructor(private router: Router,
              private jwtService:JwtAuthenticationService) {
    this.routeURL = this.router.url;
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    return new Promise((resolve, reject) => {
      console.log(this.jwtService.isAuthenticated)
      if (this.jwtService.isAuthenticated && !this.jwtService.accessTokenExpired()) {

        if (this.jwtService.hasRole(this.jwtService.APP_ROLE_USER_LEARNER)){
          this.router.navigate(['/dashboard'], {queryParams: {return: 'admin'} });
          return resolve(false);
        }
        else if (this.jwtService.hasRole(this.jwtService.APP_ROLE_ENTERPRISE_ADMIN)) {
          this.router.navigate(['/dashboard-Enterprise'], {queryParams: {return: 'enterprise'} });
          return resolve(false);
        }
      } else {
        this.routeURL = this.router.url;
        return resolve(true);
      }

    });
  }
}
