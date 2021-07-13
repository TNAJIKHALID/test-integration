import {Component, OnInit, ViewChild} from '@angular/core';
import {MatSidenav} from "@angular/material/sidenav";
import {JwtAuthenticationService} from "../../../_service/_authentication/jwt-authentication.service";
import {ActivatedRoute, Router, RouterOutlet} from "@angular/router";
import {AppComponent} from "../../../app.component";

@Component({
  selector: 'app-entreprise-dashborad',
  templateUrl: './entreprise-dashborad.component.html',
  styleUrls: ['./entreprise-dashborad.component.css']
})
export class EntrepriseDashboradComponent implements OnInit {

  @ViewChild('sidenav') sidenav: MatSidenav;
  constructor(public jwtService:JwtAuthenticationService,public route: ActivatedRoute,public router: Router) {

  }
  ngOnInit(): void {
  }
  logOut() {
    this.jwtService.logout();
  }
  getCurrentMode() {
    return AppComponent.getCurrentMode();
  }


  close(reason: string) {
    this.sidenav.close();
  }

  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData.animation;
  }
}
