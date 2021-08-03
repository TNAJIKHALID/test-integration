import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {JwtAuthenticationService} from "../../../../_service/_authentication/jwt-authentication.service";
import {DataService} from "../../../../_service/_util/data.service";
import {FormService} from "../../../../_service/_util/form.service";
import {Employee, Employees, HabilitatingParams, TestParams} from "../../../_model/employee";
import {HabilitationLevel} from "../../../../_model/question";
import {AddSessionForm, AddXEmployeeForm, AddXEmployeeFrom} from "../forms";

@Component({
  selector: 'app-add-session',
  templateUrl: './add-session.component.html',
  styleUrls: ['./add-session.component.css']
})
export class AddSessionComponent implements OnInit {
  public myForm: FormGroup;
  public habForm: FormGroup;
  onInvite: boolean = false;
  levels: Array<HabilitationLevel> = new Array<HabilitationLevel>();


  constructor(public formBuilder: FormBuilder, public router: Router, public jwtService:JwtAuthenticationService,
              public dataService:DataService) {
  }

  ngOnInit(): void {
    let dd;
    this.dataService.getResource('/getAllLevels').subscribe(d=> {
      dd = d; this.levels = dd;
    },error => { console.log(error); });

    this.buildForms();
    this.addEmployee();
  }

  inviteTest() {
    let employees:Array<AddXEmployeeFrom> = new  Array<AddXEmployeeFrom>();
    for (let i = 0; i < this.employees.length; i++) {
      let e : AddXEmployeeFrom = new AddXEmployeeForm();
      let temp = this.employees.at(i);
      e.firstName = temp.get('firstName').value;
      e.lastName = temp.get('lastName').value;
      e.email = temp.get('email').value;
      e.type= temp.get('type').value; ;
      e.poste= temp.get('poste').value;;
      e.dateNaissance= temp.get('dateNaissance').value;;
      e.dateEmbauche= temp.get('dateEmbauche').value;;
      e.telephone= temp.get('telephone').value;;
      employees.push(e);
    };
    /* level is unknown or known....*/
    if (this.level.value != 'unknown') {
      let addSessionFrom :AddSessionForm = new AddSessionForm();
      addSessionFrom.level = this.level.value;
      addSessionFrom.employees = employees;
      let id= this.jwtService.userAuthenticated.id;
      console.log('Im here.......');
      console.log(addSessionFrom);
      this.dataService.postResource('/createNewSession?appUserId='+id,addSessionFrom).subscribe(data=>{
        console.log(data);
        this.router.navigateByUrl('/dashboard-Enterprise/MesSessions')
        this.onInvite = false;
      },error => {
        console.log(error)
      })

    }
    else {
      let id= this.jwtService.userAuthenticated.id;
      this.dataService.postResource('/inviteToPositionTest?appUserId='+id,employees).subscribe(d=>{
        //todo
        this.router.navigateByUrl('/dashboard-Enterprise/MesSessions')
        this.onInvite = false;
        this.ngOnInit();
      },error => console.log(error));
    }




  }

  addEmployee(){
    const employee = this.formBuilder.group({
      firstName: ['',[
        Validators.required
      ]],
      lastName:['',[
        Validators.required
      ]],
      email: ['', [
        Validators.email,
        Validators.required
      ],],
      telephone: ['', [
        Validators.required
      ],],
      poste: ['', [
        Validators.required
      ],],
      dateNaissance: ['', [
        Validators.required
      ],],
      dateEmbauche: ['', [
        Validators.required
      ],],
      type: [true, [
        Validators.required
      ],]
    });
    this.employees.push(employee);
  }

  deleteEmployee(i){ this.employees.removeAt(i); }

  get employees(){ return this.myForm.get('employees') as FormArray; }

  get level() { return this.habForm.get('level'); }

  private buildForms() {
    this.habForm = this.formBuilder.group(
      {
        level: ['', [
          Validators.required
        ]]
      }
    );

    this.myForm = this.formBuilder.group({
      employees: this.formBuilder.array([])
    });
  }
}
