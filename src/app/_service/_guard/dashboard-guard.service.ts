import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {JwtAuthenticationService} from '../_authentication/jwt-authentication.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardGuardService implements CanActivate{
  private routeURL: string;
  constructor(private router: Router,
              private jwtService:JwtAuthenticationService) {
    this.routeURL = this.router.url;
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    return new Promise((resolve, reject) => {
      console.log(this.jwtService.isAuthenticated)
      if (this.jwtService.hasRole(this.jwtService.APP_ROLE_ENTERPRISE_ADMIN)) {
        this.router.navigate(['/dashboard/dashEnterprise'], {queryParams: {return: 'enterprise'} });
        return resolve(false);
      } else if (this.jwtService.hasRole(this.jwtService.APP_ROLE_ENTERPRISE_EMPLOYEE)){
        this.router.navigate(['/dashboard/dashEmployee'], {queryParams: {return: 'employee'} });
        return resolve(false);
      } else if (this.jwtService.hasRole(this.jwtService.APP_ROLE_APP_ADMIN)){
        this.router.navigate(['/dashboard/dashAdmin'], {queryParams: {return: 'admin'} });
        return resolve(false);
      } else if (this.jwtService.hasRole(this.jwtService.APP_ROLE_TRAINER)){
       this.router.navigate(['/dashboard/dashFormateur'], {queryParams: {return: 'admin'} });
       return resolve(false);
     } else if (this.jwtService.hasRole(this.jwtService.APP_ROLE_CLASS_ADMIN)){
        this.router.navigate(['/dashboard/dashClassAdmin'], {queryParams: {return: 'admin'} });
      return resolve(false);
    } else if (this.jwtService.hasRole(this.jwtService.APP_ROLE_USER_LEARNER)){
        this.router.navigate(['/dashboard/dashUser'], {queryParams: {return: 'admin'} });
        return resolve(false);
      }
      else {
        this.routeURL = this.router.url;
        return resolve(true);
      }

    });
  }
}
