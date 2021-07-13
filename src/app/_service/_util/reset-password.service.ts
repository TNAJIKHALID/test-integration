import { Injectable } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Injectable({
  providedIn: 'root'
})
export class ResetPasswordService {

  constructor( public formBuilder: FormBuilder) { }
  resetPasswordForm: FormGroup;


  check(formGroup: FormGroup) {
    const { value: password } = formGroup.get('password');
    const { value: confirmPassword } = formGroup.get('rePassword');
    return password === confirmPassword ? null : { passwordNotMatch: true };
  }


  buildForm(){
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

  get password() {return this.resetPasswordForm.get('password'); }

  get rePassword() {  return this.resetPasswordForm.get('rePassword');  }

}
