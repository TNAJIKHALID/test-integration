import { Component, OnInit } from '@angular/core';
import {JwtAuthenticationService} from '../../../_service/_authentication/jwt-authentication.service';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';

@Component({
  selector: 'app-demo-dashboard',
  templateUrl: './demo-dashboard.component.html',
  styleUrls: ['./demo-dashboard.component.css']
})
export class DemoDashboardComponent implements OnInit {
  private currentUrl: string = "";

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
      return "entrainment"
    }else if(this.currentUrl.includes("formationLibre")) {
      return "formation"
    }else if(this.currentUrl.includes("evaluationLibre")) {
      return "evaluationLibre"
    } else if(this.currentUrl.includes("positionTestLibre")) {
      return "test de positionnement"
    } else return "";
  }
}
