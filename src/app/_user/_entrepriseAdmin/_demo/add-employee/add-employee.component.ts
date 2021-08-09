import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {JwtAuthenticationService} from "../../../../_service/_authentication/jwt-authentication.service";
import {DataService} from "../../../../_service/_util/data.service";
import {AddXEmployeeForm, AddXEmployeeFrom} from "../forms";
import {HabilitationLevel} from "../../../../_model/question";
import {XSapAdminEntreprise} from "../model";
import {MatDrawer} from "@angular/material/sidenav";

@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.css']
})
export class AddEmployeeComponent implements OnInit {
  sapAdminEntreprise:XSapAdminEntreprise;


  public myForm: FormGroup;
  public habForm: FormGroup;
  levels: Array<HabilitationLevel> = new Array<HabilitationLevel>();


  constructor(public formBuilder: FormBuilder, public router: Router, public jwtService:JwtAuthenticationService,
              public dataService:DataService) {
  }

  ngOnInit(): void {
   this.constructForms();
    let dd;
    this.dataService.getResource('/getAllLevels').subscribe(d=> {
      dd = d;
      this.levels = dd;
    },error => {
      console.log(error);
    });
  }

  getEmploye():AddXEmployeeForm{
    let dataForm:AddXEmployeeForm = new AddXEmployeeForm();

    dataForm.level=this.level.value;
    dataForm.type=this.type.value;
    /*
    dataForm.time=this.level.value;
    dataForm.admissionBarrier=this.admissionBarrier.value;
    dataForm.numberOfQuestions=this.numberOfQuestions.value;
    */
    dataForm.firstName=this.firstName.value;
    dataForm.lastName=this.lastName.value;
    dataForm.email=this.email.value;
    dataForm.poste=this.poste.value;
    dataForm.dateNaissance=this.dateNaissance.value;
    dataForm.dateEmbauche=this.dateEmbauche.value;
    dataForm.telephone=this.telephone.value;
    return dataForm;
  }

  onInvite() {
    let employees:Array<AddXEmployeeFrom> = new  Array<AddXEmployeeFrom>();

    let d;
    let id = this.jwtService.userAuthenticated.id;
    if (this.level.value == 'unknown') {
      //invite to position test
      employees.push(this.getEmploye());
      this.dataService.postResource('/inviteToPositionTest?appUserId='+id,employees).subscribe(d=>{

        this.router.navigateByUrl('/dashboard-Enterprise/MesSessions')
      },error => console.log(error));

    }
    else {
      //invite to session
      this.dataService.postResource('/inviteEmployeeToSession?appUserId='+id,this.getEmploye()).subscribe(data=>{
        console.log(data);
        d = data;
        this.router.navigateByUrl('/dashboard-Enterprise/MesSessions')
      },error => {console.log(error)})

    }
  }

  constructForms() {
    this.myForm = this.formBuilder.group({
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
      ],]


    });

    this.habForm = this.formBuilder.group(
      {
        level: ['BO', [
          Validators.required
        ]],
        type: [true, [
          Validators.required
        ]],
        /* time: [5, [
           Validators.required,
           Validators.max(15),
           Validators.min(5)
         ]],
         admissionBarrier: [75, [
           Validators.required,
           Validators.max(100),
           Validators.min(0)
         ]],
         numberOfQuestions: [10, [
           Validators.required,
           Validators.max(20),
           Validators.min(5)
         ]]*/
      }
    );
  }

  get level() { return this.habForm.get('level');}
  get type() { return this.habForm.get('type');}
  /*
  get time() { return this.habForm.get('time');}
  get admissionBarrier() { return this.habForm.get('admissionBarrier');}
  get numberOfQuestions() {  return this.habForm.get('numberOfQuestions'); }
  */
  get firstName() {  return this.myForm.get('firstName');  }
  get lastName() {  return this.myForm.get('lastName');  }
  get email() {  return this.myForm.get('email');  }
  get poste() {  return this.myForm.get('poste');  }
  get dateNaissance() {  return this.myForm.get('dateNaissance');  }
  get dateEmbauche() {  return this.myForm.get('dateEmbauche');  }
  get telephone() {  return this.myForm.get('telephone');  }


}
