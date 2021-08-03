import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject} from "rxjs";
import {Employee, Employees} from "../../_model/employee";
import {Enterprise} from "../../../_model/user";
import {FormArray, FormBuilder, FormGroup} from "@angular/forms";
import {ConfirmationDialogService} from "../../../_service/_util/confirmation-dialog.service";
import {FormService} from "../../../_service/_util/form.service";
import {Router} from "@angular/router";
import {DataService} from "../../../_service/_util/data.service";
import {JwtAuthenticationService} from "../../../_service/_authentication/jwt-authentication.service";
import {PositionTestResult} from "../../../_model/test";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ExcelService} from "../../../_service/_util/excel.service";

@Component({
  selector: 'app-manage-position-test',
  templateUrl: './manage-position-test.component.html',
  styleUrls: ['./manage-position-test.component.css']
})
export class ManagePositionTestComponent implements OnInit, OnDestroy {
  public myForm: FormGroup;
  public enterprise:Enterprise = null;
  public dtOptions: DataTables.Settings = {};
  public positionTestDataTables: PositionTestDataTable[] = [];
  public dtTrigger: Subject<any> = new Subject<any>();

  public french_datatables = {
    processing: "processing",
    search: "Recherche:",
    lengthMenu: "Afficher _MENU_ élements",
    info: "Afficheer desde _START_ al _END_ de _TOTAL_ elementos",
    infoEmpty: "Mostrando ningún elemento.",
    infoFiltered: "(filtrado _MAX_ elementos total)",
    infoPostFix: "",
    loadingRecords: "Cargando registros...",
    zeroRecords: "No se encontraron registros",
    emptyTable: "Aucun Salarie n\'est encore invité",
    paginate: {
      first: "Premiere",
      previous: "Précedant",
      next: "Suivant",
      last: "Dernier"
    },
    aria: {
      sortAscending: ": Activar para ordenar la tabla en orden ascendente",
      sortDescending: ": Activar para ordenar la tabla en orden descendente"
    }
  }

  public onAddToTestPosition: boolean = false;
  public fileToUpload: File;

  constructor(
    public formBuilder:FormBuilder,private modalService: NgbModal,
    public excelService:ExcelService,
    public confirmationDialogService:ConfirmationDialogService,
    public formService:FormService, public router: Router,
    public dataService:DataService, public jwtService:JwtAuthenticationService
  ) {
  }


  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      language: this.french_datatables
    };
    this.load();
    this.myForm = this.formService.employeesForm();
    this.addEmployee();

  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  fillDataTable() {
    for (let positionTestResult of this.enterprise.positionTestResults) {
      let fullName = positionTestResult.enterpriseEmployee.appUser.firstName + ' ' +
        positionTestResult.enterpriseEmployee.appUser.lastName;
      let email = positionTestResult.enterpriseEmployee.appUser.username;
      let result = positionTestResult.result == 'NAN' || positionTestResult.result == null ?
        'N\'a pas encore passer le test': positionTestResult.result;
    this.positionTestDataTables.push(new PositionTestDataTable(
      fullName,email,result))
    }
    this.positionTestDataTables.push(
      new PositionTestDataTable('khalid TNAJI','khalidtnaji@gmail.com','BO Chargé de chantier'))
    this.positionTestDataTables.push(
      new PositionTestDataTable('khalid TNAJI','khalidtnaji@gmail.com','Pas de résultats'))
    this.positionTestDataTables.push(new PositionTestDataTable('khalid TNAJI','khalidtnaji@gmail.com','Pas de résultats'))
    this.positionTestDataTables.push(new PositionTestDataTable('khalid TNAJI','khalidtnaji@gmail.com','Pas de résultats'))
    this.positionTestDataTables.push(new PositionTestDataTable('khalid TNAJI','khalidtnaji@gmail.com','Pas de résultats'))
    this.positionTestDataTables.push(new PositionTestDataTable('khalid TNAJI','khalidtnaji@gmail.com','Pas de résultats'))
    this.positionTestDataTables.push(new PositionTestDataTable('khalid TNAJI','khalidtnaji@gmail.com','Pas de résultats'))
    this.positionTestDataTables.push(new PositionTestDataTable('khalid TNAJI','khalidtnaji@gmail.com','Pas de résultats'))
    this.positionTestDataTables.push(new PositionTestDataTable('khalid TNAJI','khalidtnaji@gmail.com','Pas de résultats'))
    this.positionTestDataTables.push(new PositionTestDataTable('khalid TNAJI','khalidtnaji@gmail.com','Pas de résultats'))
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

  onSave() {
    this.dtTrigger.unsubscribe();
    this.dtTrigger = new Subject<any>();
    let employees: Employees = new Employees();
    this.employees.at(2)
    let employee : Employee ;
    for (let i = 0; i < this.employees.length; i++) {
      employee = new Employee( this.employees.at(i).get('firstName').value,
        this.employees.at(i).get('lastName').value,
        this.employees.at(i).get('email').value);
      employees.employees.push(employee);
    };

    this.dataService.postResource('/addPositionTestToEnterpriseEmployees?id='+
      this.jwtService.userAuthenticated.id,employees).subscribe(d=>{
      this.onAddToTestPosition = false;
      this.ngOnInit();
    },error => console.log(error));
  }

  removeFromPositionTest(/*positionTestResult:PositionTestResult*/) {
    let positionTestResult:PositionTestResult = this.enterprise.positionTestResults[0];
    this.confirmationDialogService.
    confirm('Confirmation',
      'vous voulez vraiment supprimer '+
      positionTestResult.enterpriseEmployee.appUser.firstName +'\t' +
      positionTestResult.enterpriseEmployee.appUser.lastName +'\tdu test de positionnment?')
      .then((confirmed) => {
        console.log(confirmed)
        if (confirmed) {
          let urlParams = 'enterpriseId='+this.enterprise.id;
          this.dataService.postResource('/deletePositionTestForEnterpriseEmployee?'+urlParams,
            positionTestResult)
            .subscribe(success=>{
              //todo
              this.dtTrigger.unsubscribe();
              this.dtTrigger = new Subject<any>();
              this.ngOnInit();


            },error => {
              console.log(error);
            })
        }
      })
      .catch(() =>
        console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
  }

  load() {
    let enterpriseData;
    let appUserEnterpriseId = this.jwtService.userAuthenticated.id;
    this.dataService.getResource('/getEnterpriseByAppUserId?appUserId='+appUserEnterpriseId)
      .subscribe(data=>{
        enterpriseData  = data;
        this.enterprise = enterpriseData;
        this.fillDataTable();
        this.dtTrigger.next()
        console.log(this.enterprise)
      },error => {
        console.log(error);
      })
    this.dtTrigger.next()

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
      console.log(datum)
      const employee  =this.formService.employeeFilledForm(datum[0],datum[1],datum[2]);
      this.employees.push(employee);
    }
    this.modalService.dismissAll();
  }

  formIsInValid(): boolean {
    let formIsValid: boolean = true;
    for (let i = 0; i < this.employees.controls.length; i++) {
      if (this.employees.controls[i].invalid) {
        formIsValid = false;
        break;
      }
    }
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
}

class PositionTestDataTable{
  public nomComplet:string;
  public mail:string;
  public result:string;
  constructor(nomComplet:string, mail:string,  result:string) {
   this.nomComplet=nomComplet;
    this.mail=mail;
    this.result=result;
  }
}
