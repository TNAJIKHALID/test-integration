import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {JwtAuthenticationService} from "../../_service/_authentication/jwt-authentication.service";
import {DataService} from "../../_service/_util/data.service";
import {ActivatedRoute, Router} from "@angular/router";
import {AppURLs} from "../../util/URLs";

@Component({
  selector: 'app-reset-pasword-common',
  templateUrl: './reset-pasword-common.component.html',
  styleUrls: ['./reset-pasword-common.component.css']
})
export class ResetPaswordCommonComponent implements OnInit {
  resetPasswordForm: FormGroup;
  public id;
  public frontEnd: any;
  hide: boolean = true;


  constructor(private jwtService: JwtAuthenticationService,
              public dataService:DataService,
              private router: Router,
              private route: ActivatedRoute,
              public formBuilder: FormBuilder) {
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.params.id;
    this.frontEnd = AppURLs.frontEnd;
    this.resetPasswordForm = this.formBuilder.group(
      {
        password: ['', [
          Validators.required,
          Validators.maxLength(10),
          Validators.minLength(8)
        ]],
        rePassword: ['', [
          Validators.required,
          Validators.maxLength(10),
          Validators.minLength(8)
        ]]
      },{
        validators: this.check.bind(this)
      }
    )
  }


  get password() {
    return this.resetPasswordForm.get('password');
  }

  get rePassword() {
    return this.resetPasswordForm.get('rePassword');
  }

  onResetPassword() {
    let exist :any;
    this.dataService.getResource('/updatePassword?password='+this.password.value+'&id=' + this.id).
    subscribe(d =>{
      this.jwtService.successfulAuthentication(d);
      this.router.navigateByUrl('/dashboard');
    })
  }

  check(formGroup: FormGroup) {
    const { value: password } = formGroup.get('password');
    const { value: confirmPassword } = formGroup.get('rePassword');
    return password === confirmPassword ? null : { passwordNotMatch: true };
  }
}
