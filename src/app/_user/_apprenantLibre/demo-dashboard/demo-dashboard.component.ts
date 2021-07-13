import {Component, OnInit, ViewChild} from '@angular/core';
import {JwtAuthenticationService} from '../../../_service/_authentication/jwt-authentication.service';
import {ActivatedRoute, NavigationEnd, Router, RouterOutlet} from '@angular/router';
import {MatSidenav} from "@angular/material/sidenav";
import {AppComponent} from "../../../app.component";
import {AppURLs} from "../../../util/URLs";
import {ApprenantLibre} from "../../../_model/user";
import {DataService} from "../../../_service/_util/data.service";
import {DomSanitizer} from "@angular/platform-browser";

@Component({
  selector: 'app-demo-dashboard',
  templateUrl: './demo-dashboard.component.html',
  styleUrls: ['./demo-dashboard.component.css'],

})
export class DemoDashboardComponent implements OnInit {
  apprenantLibre: ApprenantLibre;
  currentUrl: string;

  @ViewChild('sidenav') sidenav: MatSidenav;
  frontEnd: any;
  constructor(public jwtService:JwtAuthenticationService,
              public dataService:DataService,
              public domSanitizer: DomSanitizer, public route: ActivatedRoute,
              public router: Router) {

  }
  ngOnInit(): void {
    this.frontEnd = AppURLs.frontEnd;
    this.currentUrl = AppComponent.currentUrl;
    let d;
    this.dataService.getResource("/getApprenantLibre?appUserId="+
      this.jwtService.userAuthenticated.id).subscribe(data=>{
      d = data;
      this.apprenantLibre = d;
    });
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
