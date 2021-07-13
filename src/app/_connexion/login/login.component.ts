import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {JwtAuthenticationService} from '../../_service/_authentication/jwt-authentication.service';
import {AppURLs} from "../../util/URLs";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public username: string;
  public password: string;
  public error: boolean;
  constructor(private auth:JwtAuthenticationService,
              private router:Router,
              public formBuilder: FormBuilder, public activatedRoute: ActivatedRoute) {
  }
  myForm: FormGroup;
  frontEnd: any;
  hide: boolean = true;
  ngOnInit(): void {
    this.frontEnd = AppURLs.frontEnd;
    this.loginFormUrl();
    this.error = false;
    this.myForm = this.formBuilder.group(
      {
        email:['',[
          Validators.required,
          Validators.email
        ]],
        password:['',[
          Validators.required
        ]]
      }
    )
  }

  get email(){
    return this.myForm.get('email');
  }
  get passwordd(){
    return this.myForm.get('password');
  }

  onLogin() {
    this.username = this.email.value;
    this.password = this.passwordd.value;
    this.login(this.username,this.password);
  }

  public login(username, password){
    this.auth.login(username,password).subscribe(d=>{
      let token = d;
      console.log(token)
      this.auth.successfulAuthentication(token);

      /* todo */

      if (this.auth.hasRole(this.auth.APP_ROLE_USER_LEARNER)){
        this.router.navigate(['/dashboard'], {queryParams: {return: 'admin'} });
      } else if (this.auth.hasRole(this.auth.APP_ROLE_ENTERPRISE_ADMIN)) {
        console.log('before redirect ......')
        this.router.navigate(['/dashboard-Enterprise'], {queryParams: {return: 'enterprise'} });
      }

    },error1 => {
      console.log(error1);
      this.error = true;
    });
  }

  private loginFormUrl() {
    this.activatedRoute.queryParams.subscribe(params => {
      let username = params['username'];
      let password = params['password'];
      if(username != undefined && password != undefined){
        this.login(username,password);
      }
    });
  }
}
