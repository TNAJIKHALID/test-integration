import { Component, OnInit } from '@angular/core';
import {DataService} from '../../../_service/_util/data.service';
import {JwtAuthenticationService} from "../../../_service/_authentication/jwt-authentication.service";
import {ApprenantLibre} from "../../../_model/user";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-position-test-libre',
  templateUrl: './position-test-libre.component.html',
  styleUrls: ['./position-test-libre.component.css']
})
export class PositionTestLibreComponent implements OnInit {
  startTest: boolean = false;
  positionTestResult:string;
  apprenantLibre: ApprenantLibre;
  positionTestResultSaved: boolean = false;

  constructor(public dataService:DataService,public jwtService:JwtAuthenticationService,
              private toastr: ToastrService) {
    let d;
    /*this.dataService.getResource("/getApprenantLibre?appUserId="+this.jwtService.userAuthenticated.id).subscribe(data=>{
      d = data;
      this.apprenantLibre = d;
      this.positionTestResult = this.apprenantLibre.positionTestResult;
      console.log(this.apprenantLibre);
    })*/
  }

  ngOnInit(): void {
    let d;
    this.dataService.getResource("/getApprenantLibre?appUserId="+
      this.jwtService.userAuthenticated.id).subscribe(data=>{
      d = data;
      this.apprenantLibre = d;
      this.positionTestResult = this.apprenantLibre.positionTestResult;
      console.log(this.positionTestResult);
    })
  }

  receivedLevel($event: string) {
    this.positionTestResult = $event;
    this.startTest = false;
    let d;
    let url = "id=" + this.jwtService.userAuthenticated.id+"&result="+this.positionTestResult;
    this.dataService.getResource('/putPositionTestResutlsApprenantLibre?'+url).subscribe(data=>{
      d=data;
      this.apprenantLibre = d;
      this.toastr.success('le niveau a bien été enregistré!', 'Test de positionnement',{
        timeOut: 3000,
        positionClass: 'toast-top-right'
      });

    },error => console.log(error))
  }
}
