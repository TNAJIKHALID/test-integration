import { Component, OnInit } from '@angular/core';
import {XEmployeeEntreprise, XSapAdminEntreprise} from "../model";
import {DataService} from "../../../../_service/_util/data.service";
import {JwtAuthenticationService} from "../../../../_service/_authentication/jwt-authentication.service";
import {Subject} from "rxjs";
import {SessionDataTable} from "../dataTables";
import {MatCheckboxChange} from "@angular/material/checkbox";

@Component({
  selector: 'app-sessions',
  templateUrl: './sessions.component.html',
  styleUrls: ['./sessions.component.css']
})
export class SessionsComponent implements OnInit {
  sapAdminEntreprise:XSapAdminEntreprise;
  sessionMap: Map<string,Array<XEmployeeEntreprise>> = new Map<string, Array<XEmployeeEntreprise>>();
  public sessionsTable: SessionDataTable[] = [];
  onSessionInfos:boolean=false;
  sessionToDisplay:SessionDataTable;
  public selected: Set<string> = new Set<string>();

  constructor(public dataService:DataService,public jwtService:JwtAuthenticationService) { }

  ngOnInit(): void {
    this.loadUser();
  }

  private loadUser() {
    let d;
    let id = this.jwtService.userAuthenticated.id;
    this.dataService.getResource("/loadAdminByAppUserId?appUserId="+id).subscribe(data=>{
      d = data;
      this.sapAdminEntreprise = d;
      console.log(this.sapAdminEntreprise);
      this.process();
      this.fillDataTable();
      this.fillForPositionTestSession();
    },error => {console.log(error)})
  }

  process(){
    for (let xEmployeeEntrepris of this.sapAdminEntreprise.xemployeeEntreprises) {
      for (let xSession of xEmployeeEntrepris.xsessions) {
        if (this.sessionMap.has(xSession.habilitationLevel.habilitationLevel)) {
          let temp = this.sessionMap.get(xSession.habilitationLevel.habilitationLevel);
          temp.push(xEmployeeEntrepris);
          this.sessionMap.set(xSession.habilitationLevel.habilitationLevel,temp)
        } else {
          this.sessionMap.set(xSession.habilitationLevel.habilitationLevel,[xEmployeeEntrepris])
        }
      }
    }
  }

  fillDataTable(){
    for (let [key,xEmployeesArray] of this.sessionMap) {
      this.sessionsTable.push(new SessionDataTable(key,xEmployeesArray.length))
    }

  }

  onGoToSessionInfos(sessionToDisplay: SessionDataTable) {
    this.sessionToDisplay = sessionToDisplay;
    this.onSessionInfos = true;
  }

  addToSelected($event: MatCheckboxChange) {
    console.log($event.source.value);
    if($event.source.value == 'All'){
      if ($event.checked)  this.sessionsTable.forEach(session=>this.selected.add(session.level));
    }else if($event.checked) this.selected.add($event.source.value);
    else this.selected.delete($event.source.value);

  }

  onRecieveEventBackToSessions(event:any){
    /* todo */
    //this.ngOnInit();
    this.onSessionInfos = !event;

  }

  fillForPositionTestSession() :number{
    let total = 0;
    for (let xemployeeEntrepris of this.sapAdminEntreprise.xemployeeEntreprises) {
      if (xemployeeEntrepris.xpositionTestList.length > 0) {
        xemployeeEntrepris.xpositionTestList.forEach(positionTest => {
         total++;
        })
      }
    }
    return total;
  }

}


