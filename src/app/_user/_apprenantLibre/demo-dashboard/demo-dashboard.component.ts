import {Component, OnInit, ViewChild} from '@angular/core';
import {JwtAuthenticationService} from '../../../_service/_authentication/jwt-authentication.service';
import {ActivatedRoute, NavigationEnd, Router, RouterOutlet} from '@angular/router';
import {MatSidenav} from "@angular/material/sidenav";

@Component({
  selector: 'app-demo-dashboard',
  templateUrl: './demo-dashboard.component.html',
  styleUrls: ['./demo-dashboard.component.css'],

})
export class DemoDashboardComponent implements OnInit {
  private currentUrl: string = "";
  @ViewChild('sidenav') sidenav: MatSidenav;
  constructor(public jwtService:JwtAuthenticationService,public route: ActivatedRoute,public router: Router) {

  }



  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if(event instanceof NavigationEnd ){
        console.log(event.url);
        this.currentUrl = event.url;
      }
    });
  }

  logOut() {
    this.jwtService.logout();
  }

  getCurrentMode() {
    if(this.currentUrl.includes("entrainmentLibre")) {
      return "entraînement"
    }else if(this.currentUrl.includes("formationLibre")) {
      return "formation"
    }else if(this.currentUrl.includes("evaluationLibre")) {
      return "évaluation"
    } else if(this.currentUrl.includes("positionTestLibre")) {
      return "test de positionnement"
    } else return "";
  }


  close(reason: string) {
    this.sidenav.close();
  }

  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData.animation;
  }
}
