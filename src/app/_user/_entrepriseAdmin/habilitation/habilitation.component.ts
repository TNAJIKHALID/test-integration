import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
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
  selector: 'app-habilitation',
  templateUrl: './habilitation.component.html',
  styleUrls: ['./habilitation.component.css']
})
export class HabilitationComponent implements OnInit {
  @Input() public habilitation:Habilitation;
  @Input() public enterprise:Enterprise;
  @Output() allEvent: EventEmitter<boolean> = new EventEmitter<boolean>()
  public onHabilitiation: boolean = false;
  public myForm: FormGroup;
  public onAddEmployeesToThisHabilitation : boolean = false;
  public selectedHabilitations: Set<number> = new Set<number>();

  constructor(public jwtService:JwtAuthenticationService,
              public confirmationDialogService:ConfirmationDialogService,
              public formBuilder:FormBuilder, public formService:FormService,
              public dataService:DataService, public router:Router) { }

  ngOnInit(): void {
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

  goToScore(id: number, employee: EnterpriseEmployee) {
    employee.scores.forEach(score=>{
      if(score.test.id == id ) {
        EvaluationService.score = score;
        EvaluationService.test = score.test;
      }
    });
    // TODO
    this.router.navigateByUrl("score",{ skipLocationChange: true });


  }

  addEmployee(){
    const employee = this.formService.employeeForm();
    this.employees.push(employee);
  }

  deleteEmployee(i){
    this.employees.removeAt(i);
  }

  get employees(){
    return this.myForm.get('employees') as FormArray;
  }

  onSave(habilitation:Habilitation) {
    let employees: Employees = new Employees();
    let employee : Employee ;
    for (let i = 0; i < this.employees.length; i++) {
      employee = new Employee( this.employees.at(i).get('firstName').value,
        this.employees.at(i).get('lastName').value,
        this.employees.at(i).get('email').value);
      employees.employees.push(employee);
    };
    this.dataService.postResource('/addEnterpriseEmployeesToHabilitation?habilitationId='+
      habilitation.id+'&enterpriseId='+this.enterprise.id,employees).subscribe(d=>{
      console.log(d);
      this.router.navigateByUrl('/dashboard/habils');
      this.onAddEmployeesToThisHabilitation = false;
      this.onHabilitiation = false;
      this.ngOnInit();
    },error => console.log(error));
  }

  onAddEmployeesToHabilitation() {
    this.onAddEmployeesToThisHabilitation = true;
    this.myForm = this.formService.employeesForm();
    this.addEmployee();
  }

  removeEnterpriseEmployee(enterpriseEmployee: EnterpriseEmployee, habilitation: Habilitation) {
    this.confirmationDialogService.
    confirm('Confirmation',
      'vous voulez vraiment supprimer '+
      enterpriseEmployee.appUser.firstName +'\t' + enterpriseEmployee.appUser.lastName +'\tde cette session?')
      .then((confirmed) => {
        console.log(confirmed)
        if (confirmed) {
          let params = 'habilitationId='+habilitation.id+'&enterpriseEmployeeId='+enterpriseEmployee.id;
          this.dataService.deleteResource('/deleteEnterpriseEmployeeFromHabilitation?'+params).subscribe(d=>{
            this.ngOnInit();
            this.onHabilitiation = false;
          }, error => console.log(error))
        }
      })
      .catch(() =>
        console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));

  }


  lastIsNotUnique(employees: FormArray) : boolean {
    let isUnique: boolean = true;
    for (let i1 = 0; i1 < this.habilitation.enterpriseEmployees.length; i1++){
      let e = this.habilitation.enterpriseEmployees[i1];
      let lastEmail = employees.at(employees.length - 1).get('email').value;
      if ( lastEmail ==  employees.at(i1).get('email').value  ) {
        isUnique = false;
      }
    }
    console.log(isUnique)
    return !isUnique;
  }

}
