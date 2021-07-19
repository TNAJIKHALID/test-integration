import { Component, OnInit } from '@angular/core';
import {Enterprise, EnterpriseEmployee, Habilitation} from "../../../_model/user";
import {FormArray, FormBuilder, FormGroup} from "@angular/forms";
import {JwtAuthenticationService} from "../../../_service/_authentication/jwt-authentication.service";
import {ConfirmationDialogService} from "../../../_service/_util/confirmation-dialog.service";
import {FormService} from "../../../_service/_util/form.service";
import {DataService} from "../../../_service/_util/data.service";
import {Router} from "@angular/router";
import {Test} from "../../../_model/test";
import {EvaluationService} from "../../../_service/_util/evaluation.service";
import {Employee, Employees} from "../../_model/employee";
import {MatCheckboxChange} from "@angular/material/checkbox";

@Component({
  selector: 'app-habilitations',
  templateUrl: './habilitations.component.html',
  styleUrls: ['./habilitations.component.css']
})
export class HabilitationsComponent implements OnInit {
  public enterprise:Enterprise;
  public habilitation:Habilitation;
  public onHabilitiation: boolean = false;
  public myForm: FormGroup;
  public onAddEmployeesToThisHabilitation : boolean = false;
  public selectedHabilitations: Set<number> = new Set<number>();

  constructor(public jwtService:JwtAuthenticationService,
              public confirmationDialogService:ConfirmationDialogService,
              public formBuilder:FormBuilder, public formService:FormService,
              public dataService:DataService, public router:Router) { }

  ngOnInit(): void {
    let appUserEnterpriseId = this.jwtService.userAuthenticated.id;
    let enterpriseData : any;
    this.dataService.getResource('/getEnterpriseByAppUserId?appUserId='+appUserEnterpriseId)
      .subscribe(data=>{
        enterpriseData  = data;
        this.enterprise = enterpriseData;
        console.log(this.enterprise);
      },error => {
        console.log(error);
      })
  }

  onDisplay(habilitation: Habilitation) {
    this.onHabilitiation = true;
    this.habilitation = habilitation;
  }

  public passed(employeeEnterprise: EnterpriseEmployee, test:Test): boolean{
    let isPassed : boolean = false;
    employeeEnterprise.scores.forEach(score=>{
      if(score.test.id == test.id ) isPassed = true;
    })
    return isPassed;
  }

  getEnded(habilitation: Habilitation):number {
    let ended = 0;
    habilitation.enterpriseEmployees.forEach(ent=>{
      if(this.getScoreForEmployee(habilitation.test,ent) != undefined){
        ended ++;
      }
    })
    return ended;
  }

  getScoreForEmployee(test: Test, employee: EnterpriseEmployee):number {
    let score = 0;
    if(this.passed(employee,test)){
      employee.scores.forEach(s=>{
        if (s.test.id == test.id) {
          score = s.score;
        }
      })
    } else score = undefined;
    return score;
  }



  onDeteleHabilitation(habilitation: Habilitation) {
    let dl: boolean;
    this.confirmationDialogService.
    confirm('Confirmation', 'vous voulez vraiment supprimer l\'habilitation?')
      .then((confirmed) => {
        console.log(confirmed)
        if (confirmed) {
          this.removeHabilitationFromEnterprise(habilitation);
        }
      })
      .catch(() =>
        console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
  }

  private removeHabilitationFromEnterprise(habilitation:Habilitation) {
    let data;
    let params = 'enterpriseId='+this.enterprise.id+'&habilitationId='+habilitation.id;
    this.dataService.deleteResource('/deletehabilitationFromEnterprise?'+params).subscribe(d=>{
      data = d;
      this.enterprise = data;
    }, error => console.log(error))
  }



  addToSelected($event: MatCheckboxChange) {
    console.log($event.source.value);
    if($event.source.value == 'All'){
      if ($event.checked)  this.enterprise.habilitations.forEach(h=>this.selectedHabilitations.add(h.id));
    }else if($event.checked) this.selectedHabilitations.add(Number($event.source.value));
    else this.selectedHabilitations.delete(Number($event.source.value));

  }


  allEnventReciever($event: boolean) {
    this.onHabilitiation = $event;
  }
}
