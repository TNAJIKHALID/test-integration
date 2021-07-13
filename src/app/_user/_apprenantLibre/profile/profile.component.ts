import { Component, OnInit } from '@angular/core';
import {ApprenantLibre} from "../../../_model/user";
import {DataService} from "../../../_service/_util/data.service";
import {JwtAuthenticationService} from "../../../_service/_authentication/jwt-authentication.service";
import {ApprenantLibreService} from "../../../_service/_util/apprenant-libre.service";
import {AuthorizationLevels} from "../../../_evaluation/position-test-updated/position-test-updated.component";
import {ConstantBase64} from "../../../util/imagesBase64";
import jsPDF from "jspdf";
import {Score} from "../../../_model/response";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  apprenantLibre: ApprenantLibre;
  authorization: Array<AuthorizationLevels>;
  authorizationMap: Map<string, AuthorizationLevels> = new Map<string, AuthorizationLevels>();
  positionTestResult: string;
  isScoreDisponible: boolean = false;
  score: Score;

  constructor(public dataService:DataService, public apprenantLibreService:ApprenantLibreService,
              public jwtService:JwtAuthenticationService) { }

  ngOnInit(): void {
    let d;
    this.dataService.getResource("/getApprenantLibre?appUserId="+this.jwtService.userAuthenticated.id).subscribe(data=>{
      d = data;
      this.apprenantLibre = d;
      console.log(this.apprenantLibre)
      this.positionTestResult = this.apprenantLibre.positionTestResult;
    });

    let dd;
    this.dataService.getResource('/getAuthos').subscribe(d => {
      dd = d;
      this.authorization = dd;
      this.authorization.forEach(a => {
        let ss: string = a.level;
        this.authorizationMap.set(ss.toLowerCase().trim(), a);
        this.isScoreDisponible = this.apprenantLibre.scores.length > 0;
        this.score = this.apprenantLibre.scores[this.apprenantLibre.scores.length-1];
      })
    }, error => console.log(error))


  }


  onDownloadRepport() {
    let level = this.apprenantLibre.positionTestResult;
    let name = this.jwtService.userAuthenticated.firstName + ' ' + this.jwtService.userAuthenticated.lastName;
    let email = this.jwtService.userAuthenticated.username;
    let date = new Date();
    let authorazedTasks = this.authorizationMap.
    get(this.apprenantLibre.positionTestResult.toLowerCase().trim()).authorizedTasks;
    let unAuthorazedTaks = this.authorizationMap.get(this.apprenantLibre.positionTestResult.toLowerCase().trim()).unAuthorizedTasks;
    this.apprenantLibreService.pdfPositionTest(level,name,email,date,authorazedTasks,unAuthorazedTaks);
  }

  onDownloadAttestation() {

  }

  onDownloadAvis() {
    var imgData;
    if (this.apprenantLibre.scores[0].validate){
      imgData = ConstantBase64.AvisFavorable2;
    } else {
      imgData = ConstantBase64.AvisDeFavorable2;
    }
    var doc = new jsPDF("p", "px", "a4");
    var width = doc.internal.pageSize.getWidth();
    var height = doc.internal.pageSize.getHeight();
    doc.addImage(imgData, 'PNG', 0, 0, width, height);
    doc.save("Avis-Habilitation.pdf")
  }
}
