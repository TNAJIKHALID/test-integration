import {Component, EventEmitter} from '@angular/core';
import {LoaderService} from './_service/_loader/loader.service';
import {Subscription} from 'rxjs';
import {NavigationStart, Router} from '@angular/router';
import {slideInAnimation} from "./util/animation";

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
export class AppComponent {
  title = 'testApplication';
  public loading : boolean = true;
  private subscription: Subscription;

  constructor(public loaderService:LoaderService,private router: Router) {
    this.loaderService.isLoading.subscribe((v) => {
      console.log(v);
      this.loading = v;
    });
    this.subscription = router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        if (!router.navigated) {
          browserRefresh = true;
          refreshEvent.emit(true);
          console.log('refresh.........................................gggggggggggg')
        }
      }
    });
  }

}
