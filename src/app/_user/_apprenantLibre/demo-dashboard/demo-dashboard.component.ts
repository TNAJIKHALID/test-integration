import {Component, OnInit, ViewChild} from '@angular/core';
import {JwtAuthenticationService} from '../../../_service/_authentication/jwt-authentication.service';
import {ActivatedRoute, NavigationEnd, Router, RouterOutlet} from '@angular/router';
import {MatSidenav} from "@angular/material/sidenav";
import {AppComponent} from "../../../app.component";

@Component({
  selector: 'app-demo-dashboard',
  templateUrl: './demo-dashboard.component.html',
  styleUrls: ['./demo-dashboard.component.css'],

})
export class DemoDashboardComponent implements OnInit {
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
    /*if(AppComponent.currentUrl.includes("entrainmentLibre")) {
      return "entraînement"
    }else if(AppComponent.currentUrl.includes("formationLibre")) {
      return "formation"
    }else if(AppComponent.currentUrl.includes("evaluationLibre")) {
      return "évaluation"
    } else if(AppComponent.currentUrl.includes("positionTestLibre")) {
      return "test de positionnement"
    } else return "";*/
  }


  close(reason: string) {
    this.sidenav.close();
  }

  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData.animation;
  }
}
