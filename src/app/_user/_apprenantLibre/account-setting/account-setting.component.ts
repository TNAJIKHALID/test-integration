import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {JwtAuthenticationService} from "../../../_service/_authentication/jwt-authentication.service";
import {ActivatedRoute, Router} from "@angular/router";
import {DataService} from "../../../_service/_util/data.service";
import {ResetPasswordService} from "../../../_service/_util/reset-password.service";
import {ToastrService} from "ngx-toastr";
import {ApprenantLibre} from "../../../_model/user";
import {DomSanitizer} from "@angular/platform-browser";
import {ModalDismissReasons, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {HttpClient, HttpEvent, HttpRequest} from "@angular/common/http";
import {Observable} from "rxjs";

@Component({
  selector: 'app-account-setting',
  templateUrl: './account-setting.component.html',
  styleUrls: ['./account-setting.component.css']
})
export class AccountSettingComponent implements OnInit {
  hide = true;
  public id;
  apprenantLibre: ApprenantLibre;
  fileToUpload: File | null = null;


  constructor(public jwtService: JwtAuthenticationService, public resetPassword:ResetPasswordService,
              public dataService:DataService, public domSanitizer: DomSanitizer,
              private toastr: ToastrService, private modalService: NgbModal,
              private https: HttpClient,
              public formBuilder: FormBuilder) {
  }

  ngOnInit(): void {
    this.id = this.jwtService.userAuthenticated.id;
    let d;
    this.dataService.getResource("/getApprenantLibre?appUserId="+this.jwtService.userAuthenticated.id).subscribe(data=>{
      d = data;
      this.apprenantLibre = d;
    });
    this.resetPassword.buildForm();
  }

  onResetPassword() {
    this.dataService.getResource('/updatePassword?password='+this.resetPassword.password.value+'&id=' + this.id).
    subscribe(d =>{
      this.jwtService.successfulAuthentication(d);
      this.toastr.success('Le mot de passe a bien ete modifier', 'Mot de passe',{
        timeOut: 3000,
        positionClass: 'toast-top-right'
      });
    })
  }

  open(content) {
    let closeResult;
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      closeResult = `Closed with: ${result}`;
    }, (reason) => {
      closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  public getDismissReason(reason: any): string {
    /*
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else */
    console.log(reason)
    if (reason == 'Save click') {
      console.log('here')
      this.uploadImage();
      this.fileToUpload = null;
      return `with: ${reason}`;
    }
  }

  handleFileInput(event) {
    let files: FileList = event.target.files;
    let file =  files.item(0);
    this.fileToUpload = file;
    //this.uploadImage();
  }

  uploadImage() {
    let d;
    let id= this.jwtService.userAuthenticated.id;
    const data: FormData = new FormData();
    data.append('file', this.fileToUpload);
    this.dataService.postResource('/updateImageApprenantLibre/'+id,
      data).subscribe(data=>{
        d = data;
        this.apprenantLibre = d;
      console.log(data)
    },error => {
      console.log(error)
    })
  }

  save() {
    this.modalService.dismissAll();
    this.uploadImage();
    this.fileToUpload = null;
  }

}
