import {Component, Input, OnInit} from '@angular/core';
import {Employee, Employees, HabilitatingParams, TestParams} from "../../_model/employee";
import {FormArray, FormBuilder, FormGroup} from "@angular/forms";
import {DataService} from "../../../_service/_util/data.service";
import {Router} from "@angular/router";
import {FormService} from "../../../_service/_util/form.service";
import {JwtAuthenticationService} from "../../../_service/_authentication/jwt-authentication.service";

@Component({
  selector: 'app-add-habilitation',
  templateUrl: './add-habilitation.component.html',
  styleUrls: ['./add-habilitation.component.css']
})
export class AddHabilitationComponent implements OnInit {
  public myForm: FormGroup;
  public habForm: FormGroup;
  @Input() public habForm2: FormGroup;


  onInvite: boolean = false;
  constructor(public formBuilder: FormBuilder, public router: Router, public jwtService:JwtAuthenticationService,
              public dataService:DataService, public formService:FormService) {
  }

  ngOnInit(): void {
    this.habForm = this.formService.habParamsForm();
    this.myForm = this.formService.employeesForm();
    this.addEmployee();
  }

  lastIsNotUnique(employees: FormArray) : boolean {
    let isUnique: boolean = true;
    let lastEmail = this.employees.at(this.employees.length - 1).get('email').value;
    if(this.employees.length > 1 ) for (let i = 0; i < this.employees.length - 1; i++) {
      if ( lastEmail ==  this.employees.at(i).get('email').value  ) {
        isUnique = false;
        break
      }
    }
    console.log(isUnique)
    return !isUnique;
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

  get time() {
    return this.habForm.get('time');
  }

  get admissionBarrier() {
    return this.habForm.get('admissionBarrier');
  }

  get numberOfQuestions() {
    return this.habForm.get('numberOfQuestions');
  }

  create() {
    let employees: Employees = new Employees();
    this.employees.at(2)
    let e : Employee ;
    for (let i = 0; i < this.employees.length; i++) {
      e = new Employee( this.employees.at(i).get('firstName').value,
        this.employees.at(i).get('lastName').value,
        this.employees.at(i).get('email').value);
      employees.employees.push(e);
    };
    console.log(employees.employees);
    this.dataService.postResource('/addEmployees',employees).subscribe(data=>{
    },error => {
      console.log(error)
    })
  }

  inviteTest() {
    let employees: Employees = new Employees();
    this.employees.at(2)
    let e : Employee ;
    for (let i = 0; i < this.employees.length; i++) {
      e = new Employee( this.employees.at(i).get('firstName').value,
        this.employees.at(i).get('lastName').value,
        this.employees.at(i).get('email').value);
      employees.employees.push(e);
    };
    let habilitatingParams: HabilitatingParams = new HabilitatingParams();
    habilitatingParams.enterpriseAppUserId = this.jwtService.userAuthenticated.id;
    habilitatingParams.employees = employees;
    habilitatingParams.testParams = new TestParams();
    habilitatingParams.testParams.time = this.time.value;
    habilitatingParams.testParams.admissionBarrier = this.admissionBarrier.value;
    habilitatingParams.testParams.numberOfQuestions = this.numberOfQuestions.value;
    this.dataService.postResource('/addEmployees',habilitatingParams).subscribe(data=>{
      console.log(data);
      this.router.navigateByUrl('/dashboard-Enterprise/MesSessions')
      this.onInvite = false;
    },error => {
      console.log(error)
    })
  }

}
