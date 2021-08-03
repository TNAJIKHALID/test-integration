import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AppURLs} from "../../util/URLs";
import {JwtAuthenticationService} from "../../_service/_authentication/jwt-authentication.service";
import {ActivatedRoute, Router} from "@angular/router";
import {DataService} from "../../_service/_util/data.service";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  public exist: boolean;
  constructor(private auth:JwtAuthenticationService,
              private dataService:DataService,
              private toastr: ToastrService,
              public formBuilder: FormBuilder, public activatedRoute: ActivatedRoute) {
  }

  myForm: FormGroup;
  frontEnd: any;
  ngOnInit(): void {
    this.frontEnd = AppURLs.frontEnd;
    this.exist = true;
    this.myForm = this.formBuilder.group(
      {
        email:['',[
          Validators.required,
          Validators.email
        ]]
      }
    )
  }

  get email(){
    return this.myForm.get('email');
  }

  onSubmitForgotPasswordForm() {
    let exist :any;
    this.dataService.getResource('/resetPassword?email='+this.email.value).subscribe(d =>{
      exist = d;
      this.exist = exist;
      if (exist) {
        this.toastr.success('Un email de réinitialisation de mot de passe vous a éte envoyer', 'Bien',{
          timeOut: 6000,
          positionClass: 'toast-top-right',
          closeButton: true,
          easing: 'ease-in'
        });
      }
      console.log(exist);
    })
  }
}
