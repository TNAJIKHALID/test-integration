import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from "@angular/router";
import {JwtAuthenticationService} from "../_authentication/jwt-authentication.service";

@Injectable({
  providedIn: 'root'
})
export class EntrepriseGuardService implements CanActivate {
  private routeURL: string;
  constructor(private router: Router,
              private jwtService:JwtAuthenticationService) {
    this.routeURL = this.router.url;
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (this.jwtService.hasRole(this.jwtService.APP_ROLE_ENTERPRISE_ADMIN)){
        this.routeURL = this.router.url;
        return resolve(true);
      }  else {
        this.jwtService.logout();
        return resolve(true);
      }

    });
  }
}
