import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
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

  constructor(public jwtService:JwtAuthenticationService,
              media: MediaMatcher,changeDetectorRef: ChangeDetectorRef,
              public route: ActivatedRoute,public router: Router) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
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
