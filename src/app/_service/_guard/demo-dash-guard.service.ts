import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {JwtAuthenticationService} from '../_authentication/jwt-authentication.service';

@Injectable({
  providedIn: 'root'
})
export class DemoDashGuardService implements CanActivate {
  private routeURL: string;
  constructor(private router: Router,
              private jwtService:JwtAuthenticationService) {
    this.routeURL = this.router.url;
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (this.jwtService.hasRole(this.jwtService.APP_ROLE_USER_LEARNER)){
        this.router.navigate(['/dashboard/dashUser'], {queryParams: {return: 'admin'} });
        return resolve(false);
      }
      else if (this.jwtService.hasRole(this.jwtService.APP_ROLE_ENTERPRISE_ADMIN)) {
        this.router.navigate(['/dashboard-Enterprise/dashEnterprise'], {queryParams: {return: 'enterprise'} });
        return resolve(false);
      }
      else {
        this.routeURL = this.router.url;
        return resolve(true);
      }

    });
  }
}
