import {Component, Inject, Input, OnInit} from '@angular/core';
import {XEmployeeEntreprise} from "../model";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {JwtAuthenticationService} from "../../../../_service/_authentication/jwt-authentication.service";
import {DataService} from "../../../../_service/_util/data.service";
import {MAT_DIALOG_DATA} from "@angular/material/dialog";

@Component({
  selector: 'app-one-emlpoyee',
  templateUrl: './one-emlpoyee.component.html',
  styleUrls: ['./one-emlpoyee.component.css']
})
export class OneEmlpoyeeComponent {
  public myForm: FormGroup;
  public employee: XEmployeeEntreprise;
  constructor(@Inject(MAT_DIALOG_DATA) public employe: any,
    public formBuilder: FormBuilder, public router: Router, public jwtService:JwtAuthenticationService,
              public dataService:DataService) {

    this.employee = employe.employee;
    console.log(this.employee);
    this.myForm = this.formBuilder.group({
      firstName: [this.employee.appUser.firstName,[
        Validators.required
      ]],
      lastName:[this.employee.appUser.lastName,[
        Validators.required
      ]],
      email: [this.employee.appUser.username, [
        Validators.email,
        Validators.required
      ],],
      telephone: [this.employee.telephone, [
        Validators.required
      ],],
      poste: [this.employee.poste, [
        Validators.required
      ],],
      dateNaissance: [this.employee.dateNaissance, [
        Validators.required
      ],],
      dateEmbauche: [this.employee.dateEmbauche, [
        Validators.required
      ],]
    });
    //this.constructForms();

  }

  constructForms() {
    this.myForm = this.formBuilder.group({
      firstName: [this.employee.appUser.firstName,[
        Validators.required
      ]],
      lastName:[this.employee.appUser.lastName,[
        Validators.required
      ]],
      email: [this.employee.appUser.username, [
        Validators.email,
        Validators.required
      ],],
      telephone: [this.employee.telephone, [
        Validators.required
      ],],
      poste: [this.employee.poste, [
        Validators.required
      ],],
      dateNaissance: [this.employee.dateNaissance, [
        Validators.required
      ],],
      dateEmbauche: [this.employee.dateEmbauche, [
        Validators.required
      ],]
    });
  }

  get firstName() {  return this.myForm.get('firstName');  }
  get lastName() {  return this.myForm.get('lastName');  }
  get email() {  return this.myForm.get('email');  }
  get poste() {  return this.myForm.get('poste');  }
  get dateNaissance() {  return this.myForm.get('dateNaissance');  }
  get dateEmbauche() {  return this.myForm.get('dateEmbauche');  }
  get telephone() {  return this.myForm.get('telephone');  }


}
