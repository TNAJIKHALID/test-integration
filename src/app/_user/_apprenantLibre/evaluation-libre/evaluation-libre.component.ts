import { Component, OnInit } from '@angular/core';
import {Params, Test} from '../../../_model/test';
import {DataService} from '../../../_service/_util/data.service';
import {JwtAuthenticationService} from "../../../_service/_authentication/jwt-authentication.service";
import {ApprenantLibre} from "../../../_model/user";

@Component({
  selector: 'app-evaluation-libre',
  templateUrl: './evaluation-libre.component.html',
  styleUrls: ['./evaluation-libre.component.css']
})
export class EvaluationLibreComponent implements OnInit {
  test:Test;
  onTest:boolean = false;
  apprenantLibre: ApprenantLibre;

  constructor(public dataService:DataService, public jwtService:JwtAuthenticationService) { }

  ngOnInit(): void {
    let d;
    this.dataService.getResource("/getApprenantLibre?appUserId="+this.jwtService.userAuthenticated.id).subscribe(data=>{
      d = data;
      this.apprenantLibre = d;
      console.log(this.apprenantLibre)
    })
  }

  getParams(params: Params) {
    let data;
    this.dataService.postResource('/loadTestByParameters',params).subscribe(d=>{
      data = d;
      this.test = data;
      this.onTest = true;
      console.log(this.test);
    }, error => console.log(error))
  }
}
