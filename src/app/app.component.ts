import {AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, EventEmitter, OnInit} from '@angular/core';
import {LoaderService} from './_service/_loader/loader.service';
import {Subscription} from 'rxjs';
import {NavigationEnd, NavigationStart, Router} from '@angular/router';
import {slideInAnimation} from "./util/animation";
import {IpList} from "./_service/_localisation/iplist";
import {async} from "rxjs/internal/scheduler/async";
import {ToastrService} from "ngx-toastr";
import {JwtAuthenticationService} from "./_service/_authentication/jwt-authentication.service";

export let browserRefresh = false;
export let refreshEvent : EventEmitter<boolean> = new EventEmitter<boolean>();
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    slideInAnimation
  ]
})
export class AppComponent implements AfterViewChecked{
  public static currentUrl: string = "";

  title = 'testApplication';
  public loading : boolean = true;
  private subscription: Subscription;
  public ip: string;
  public country:string;

  constructor(public loaderService:LoaderService,
              private router: Router,
              private cdRef:ChangeDetectorRef,
              private toastr: ToastrService,
              private jwtService:JwtAuthenticationService,
              public iplist$: IpList) {
    this.router.events.subscribe((event) => {
      if(event instanceof NavigationEnd ){
        console.log(event.url);
        AppComponent.currentUrl = event.url;
      }
    });
    //this.ip = '';
   //this.getIp();
   //this.getCountry();

    this.loaderService.isLoading.subscribe((v) => {
      console.log(v);
      this.loading = v;
    });

    this.subscription = router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        if (!router.navigated) {
          browserRefresh = true;
          refreshEvent.emit(true);
        }
      }
    });


  }

  ngAfterViewChecked(): void {
    this.cdRef.detectChanges();

    console.log(this.jwtService.accessTokenExpired());
    //todo refresh token handling;
    /*
    if (this.jwtService.accessTokenExpired()) {
      this.jwtService.refreshAccessToken();
    }*/
  }

  async getIp(){
    let data;
    await this.iplist$.subscribe(d=> {
      data = d;
      this.ip = data.ip;
      console.log(d);
    })
  }

  async getCountry(){
    let data;
    this.iplist$.checkIP(this.ip)

    await this.iplist$.subscribe(d=>{
      data = d.countryname;
      console.log(d.countryname)
      this.country = data;
      this.toastr.success('votre adress Ip est '+ this.ip
        +' vous etes connectee depuis:' + this.country, 'Localisation',{
        timeOut: 9000,
        positionClass: 'toast-top-right'
      });
    })
  }

  public static getCurrentMode():string {
    if(AppComponent.currentUrl.includes("entrainmentLibre")) {
      return "entraînement"
    }else if(AppComponent.currentUrl.includes("formationLibre")) {
      return "formation";
    }else if(AppComponent.currentUrl.includes("evaluationLibre")) {
      return "évaluation"
    } else if(AppComponent.currentUrl.includes("positionTestLibre")) {
      return "test de positionnement"
    } else if(AppComponent.currentUrl.includes("score")) {
      return "rapport du test"
    } else if(AppComponent.currentUrl.includes("profileLibre")) {
      return "Téléchargements"
    }

    else if(AppComponent.currentUrl.includes("MesSessions")||
      AppComponent.currentUrl.includes("addSession")) {
      return "Sessions"
    }  else if(AppComponent.currentUrl.includes("PositionTest")) {
      return "Position Gestion"
    }else if(AppComponent.currentUrl.includes("dashEnterprise")) {
      return "dashboard Admin Enterprise"
    }


    else return "";
  }





}


/*this.iplist$.checkIP(this.ip)

      this.iplist$.subscribe(d=>{
        data = d.countryname;
        console.log(d.countryname)
        this.country = data;
        this.toastr.success('votre adress Ip est '+ this.ip
          +' vous etes connectee depuis:' + this.country, 'Localisation',{
          timeOut: 9000,
          positionClass: 'toast-top-right'
        });
      })*/

/*let data ;

this.iplist$.subscribe(d=>{
  data = d.countryname;
  console.log(d.countryname)
  this.country = data;
  this.toastr.success('votre adress Ip est '+ this.ip
    +' vous etes connectee depuis:' + this.country, 'Localisation',{
    timeOut: 9000,
    positionClass: 'toast-top-right'
  });
}
 )*/
