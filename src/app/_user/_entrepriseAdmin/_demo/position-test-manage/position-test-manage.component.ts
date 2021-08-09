import { Component, OnInit } from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ExcelService} from "../../../../_service/_util/excel.service";
import {ConfirmationDialogService} from "../../../../_service/_util/confirmation-dialog.service";
import {FormService} from "../../../../_service/_util/form.service";
import {Router} from "@angular/router";
import {DataService} from "../../../../_service/_util/data.service";
import {JwtAuthenticationService} from "../../../../_service/_authentication/jwt-authentication.service";
import {Employee, Employees} from "../../../_model/employee";
import {XSapAdminEntreprise} from "../model";
import {AddXEmployeeForm, AddXEmployeeFrom} from "../forms";
import {MatCheckboxChange} from "@angular/material/checkbox";

@Component({
  selector: 'app-position-test-manage',
  templateUrl: './position-test-manage.component.html',
  styleUrls: ['./position-test-manage.component.css']
})
export class PositionTestManageComponent implements OnInit {
  public myForm: FormGroup;
  sapAdminEntreprise:XSapAdminEntreprise;
  public positionTestDataTables: PositionTestDataTable[] = [];


  public onAddToTestPosition: boolean = false;
  public fileToUpload: File;
  public selected: Set<number> = new Set<number>();

  constructor(
    public formBuilder:FormBuilder,private modalService: NgbModal,
    public excelService:ExcelService,
    public confirmationDialogService:ConfirmationDialogService,
    public formService:FormService, public router: Router,
    public dataService:DataService, public jwtService:JwtAuthenticationService
  ) {
  }


  ngOnInit(): void {
    this.load();
    this.myForm = this.formBuilder.group({
      employees: this.formBuilder.array([])
    });
    this.addEmployee();
  }

  load() {
    let temp;
    let appUserEnterpriseId = this.jwtService.userAuthenticated.id;
    this.dataService.getResource('/loadAdminByAppUserId?appUserId='+appUserEnterpriseId)
      .subscribe(data=>{
        temp  = data;
        this.sapAdminEntreprise = temp;
        console.log(temp)
        this.fillDataTable();
      },error => {
        console.log(error);
      })

  }

  fillDataTable() {
    console.log(this.sapAdminEntreprise.xemployeeEntreprises.length);
    this.positionTestDataTables = [];
    for (let xemployeeEntrepris of this.sapAdminEntreprise.xemployeeEntreprises) {
      if (xemployeeEntrepris.xpositionTestList.length > 0) {
        let nomComplet = xemployeeEntrepris.appUser.firstName + ' ' + xemployeeEntrepris.appUser.lastName;
        let email = xemployeeEntrepris.appUser.username ;
        xemployeeEntrepris.xpositionTestList.forEach(positionTest=>{
          let result;
          if(!positionTest.enable) {
            result= "n'est pas encore invité";
          } else {
            result = positionTest.habilitationLevel ==
            null ? "N'a pas de encore passé le teste": positionTest.habilitationLevel.habilitationLevel;
          }
          this.positionTestDataTables.push(new PositionTestDataTable(positionTest.id,nomComplet,email,result,positionTest.enable));
        })
      }
    }
  }

  onSave() {
    let employees:Array<AddXEmployeeFrom> = new  Array<AddXEmployeeFrom>();
    for (let i = 0; i < this.employees.length; i++) {
      let e : AddXEmployeeFrom = new AddXEmployeeForm();
      let temp = this.employees.at(i);
      e.firstName = temp.get('firstName').value;
      e.lastName = temp.get('lastName').value;
      e.email = temp.get('email').value;
      e.poste= temp.get('poste').value;;
      e.dateNaissance= temp.get('dateNaissance').value;;
      e.dateEmbauche= temp.get('dateEmbauche').value;;
      e.telephone= temp.get('telephone').value;;
      employees.push(e);
    };

    let id= this.jwtService.userAuthenticated.id;
    this.dataService.postResource('/inviteToPositionTest?appUserId='+id,employees).subscribe(d=>{
      this.onAddToTestPosition = false;
      this.positionTestDataTables = [];

      this.ngOnInit();
    },error => console.log(error));
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
    //let files: FileList = event.target.files;
    //let file =  files.item(0);
    this.fileToUpload = event;
    //this.onImportExcel(event);
  }

  async onImportExcel() {
    var data = await this.excelService.getData(this.fileToUpload);
    console.log(data);
    for (let datum of data) {
      let firstName = datum[0];
      let lastName= datum[1];
      let email= datum[2];
      let telephone= datum[3];
      let poste= datum[4];
      let dateNaissance= datum[5];
      let dateEmbauche= datum[6];
      const employee  = this.addFilledEmployee(firstName, lastName, email, telephone, poste, dateNaissance, dateEmbauche)
      /*
        this.formService.employeeFilledForm(datum[0],datum[1],datum[2]);
        this.employees.push(employee);
      */
    }
    this.modalService.dismissAll();
  }

  addToSelected($event: MatCheckboxChange) {
    console.log($event.source.value);
    if($event.source.value == 'All'){
      if ($event.checked) {
        this.positionTestDataTables.forEach(p=>this.selected.add(p.positionTestId));
      }
    }else if($event.checked) this.selected.add(Number($event.source.value));
    else this.selected.delete(Number($event.source.value));

  }

  formIsInValid(): boolean {
    let formIsValid: boolean = true;
    for (let i = 0; i < this.employees.controls.length; i++) {
      if (this.employees.controls[i].invalid) {
        formIsValid = false;
        break;
      }
    }
    formIsValid = this.employees.controls.length > 0;

    /* ....handling emails in form...*/
    /*
    let emails : Set<string> = new Set<string>();
    let email: string;
    for (let i = 0; i < this.employees.length; i++) {
      email = this.employees.at(i).get('email').value;
      email = email.trim().toLowerCase();
      emails.add(email);
    };
    formIsValid = emails.size == this.employees.length;
    */
    /* ....handling emails already exist in position test...*/

    console.log(formIsValid)
    return !formIsValid;
  }

  removeFromPositionTest(positionTestId:number) {
    this.confirmationDialogService.
    confirm('Confirmation', 'vous voulez supprimer cet utlisateur du teste de positionnement?')
      .then((confirmed) => {
        if (confirmed) {
          let positionTestIds:Array<number> = new Array<number>();
          positionTestIds.push(positionTestId);
          this.deleteEmployeesFromTestPositionByIds(positionTestIds);
        }
      }).catch();
  }


  removeSelectedFromPositionTest() {
    this.confirmationDialogService.
    confirm('Confirmation', 'vous voulez supprimer ces utlisateurs du teste de positionnement?')
      .then((confirmed) => {
        if (confirmed) {
          let positionTestIds:Array<number> = new Array<number>();
          for (let value of this.selected.values()) positionTestIds.push(value)
          this.deleteEmployeesFromTestPositionByIds(positionTestIds);
        }
      }).catch();
  }

  onInviteToPosition() {
    this.confirmationDialogService.
    confirm('Confirmation', 'vous voulez inviter ces utlisateurs du teste de positionnement?')
      .then((confirmed) => {
        if (confirmed) {
          let selectedArray: Array<number> = new Array<number>();
          for (let value of this.selected.values())  selectedArray.push(value);
          this.inviteToPositionTestByIds(selectedArray);
        }
      }).catch();

  }

  onInviteSingleOne(positionTestId: number) {
    this.confirmationDialogService.
    confirm('Confirmation', 'vous voulez inviter cet utlisateur au teste de positionnement?')
      .then((confirmed) => {
        if (confirmed) {
          let selectedArray: Array<number> = new Array<number>();
          selectedArray.push(positionTestId);
          this.inviteToPositionTestByIds(selectedArray);
        }
      }).catch();

  }


  deleteEmployeesFromTestPositionByIds(positionTestIds:Array<number>){
    this.dataService.postResource('/deletePositionTests',positionTestIds).subscribe(data =>{
      this.ngOnInit();
    },error => console.log(error))
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
      ],]
    });
    this.employees.push(employee);
  }

  addFilledEmployee(firstName, lastName, email, telephone, poste, dateNaissance, dateEmbauche){
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
      ],]
    });
    this.employees.push(employee);
  }

  deleteEmployee(i){
    this.employees.removeAt(i);
  }

  get employees(){
    return this.myForm.get('employees') as FormArray;
  }



  inviteToPositionTestByIds(positionTestIds:Array<number>){
    this.dataService.postResource('/enabelPosition',positionTestIds).subscribe(d=>{
      this.selected.clear();
      this.ngOnInit();
    },error => {
      console.log(error)
    })
  }
}

class PositionTestDataTable{
  public positionTestId:number;
  public nomComplet:string;
  public mail:string;
  public result:string;
  public enabled:boolean;
  constructor(positionTestId:number,nomComplet:string, mail:string,  result:string,enabled:boolean) {
    this.positionTestId=positionTestId;
    this.nomComplet=nomComplet;
    this.mail=mail;
    this.result=result;
    this.enabled = enabled;
  }
}
