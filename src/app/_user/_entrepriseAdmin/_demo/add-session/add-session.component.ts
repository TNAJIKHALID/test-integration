import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {JwtAuthenticationService} from "../../../../_service/_authentication/jwt-authentication.service";
import {DataService} from "../../../../_service/_util/data.service";
import {FormService} from "../../../../_service/_util/form.service";
import {Employee, Employees, HabilitatingParams, TestParams} from "../../../_model/employee";
import {HabilitationLevel} from "../../../../_model/question";
import {AddSessionForm, AddXEmployeeForm, AddXEmployeeFrom} from "../forms";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ExcelService} from "../../../../_service/_util/excel.service";

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
  public fileToUpload: File;


  constructor(public formBuilder: FormBuilder,
              private modalService: NgbModal,public excelService:ExcelService,
              public router: Router, public jwtService:JwtAuthenticationService,
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

  open(content) {
    let closeResult;
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      closeResult = `Closed with: ${result}`;
    }, (reason) => {
      closeResult = `Dismissed...`;
    });
  }


  handleFileInput(event) {
    //todo handle level unknown template
    this.fileToUpload = event;
  }

  async onImportExcel() {
    var data = await this.excelService.getData(this.fileToUpload);
    //todo handle level unknown template
    for (let datum of data) {
      let firstName = datum[0];
      let lastName= datum[1];
      let email= datum[2];
      let telephone= datum[3];
      let poste= datum[4];
      let dateNaissance= datum[5];
      let dateEmbauche= datum[6];
      /* todo was done :) */let type =  this.level.value == 'unknown' && datum[7] == 'initial';
      const employee  = this.addFilledEmployee(firstName,
        lastName, email, telephone, poste, dateNaissance, dateEmbauche,type);
    }
    this.modalService.dismissAll();
  }


  addFilledEmployee(firstName, lastName, email, telephone, poste, dateNaissance, dateEmbauche,type){
    const employee = this.formBuilder.group({
      firstName: [firstName,[
        Validators.required
      ]],
      lastName:[lastName,[
        Validators.required
      ]],
      email: [email, [
        Validators.email,
        Validators.required
      ],],
      telephone: [telephone, [
        Validators.required
      ],],
      poste: [poste, [
        Validators.required
      ],],
      dateNaissance: [dateNaissance, [
        Validators.required
      ],],
      dateEmbauche: [dateEmbauche, [
        Validators.required
      ],],
      type: [type, [
        Validators.required
      ],]
    });
    this.employees.push(employee);
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

  deleteEmployee(i){
    console.log(this.employees.controls[0].invalid)
    console.log(this.employees.controls.length)
    this.employees.removeAt(i);
  }

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
