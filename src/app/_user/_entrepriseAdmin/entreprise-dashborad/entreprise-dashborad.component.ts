import {ChangeDetectorRef, Component, HostListener, OnInit, ViewChild} from '@angular/core';
import {MatDrawer, MatSidenav} from "@angular/material/sidenav";
import {JwtAuthenticationService} from "../../../_service/_authentication/jwt-authentication.service";
import {ActivatedRoute, Router, RouterOutlet} from "@angular/router";
import {AppComponent} from "../../../app.component";
import {MediaMatcher} from "@angular/cdk/layout";

@Component({
  selector: 'app-entreprise-dashborad',
  templateUrl: './entreprise-dashborad.component.html',
  styleUrls: ['./entreprise-dashborad.component.css']
})
export class EntrepriseDashboradComponent implements OnInit {
  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;

  @ViewChild('drawer') drawer: MatDrawer;
  collapsed: boolean = false;

  constructor(public jwtService:JwtAuthenticationService,
              media: MediaMatcher,changeDetectorRef: ChangeDetectorRef,
              public route: ActivatedRoute,public router: Router) {
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    if (event.target.innerWidth < 1200) { this.drawer.close(); }
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
    this.drawer.close();
  }

  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData.animation;
  }

  toggle() {
    this.drawer.toggle();
  }
}
