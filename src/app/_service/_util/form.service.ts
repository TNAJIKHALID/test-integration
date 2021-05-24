import { Injectable } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {DataService} from './data.service';
import {Employee} from '../../_user/_model/employee';

@Injectable({
  providedIn: 'root'
})
export class FormService {

  constructor(public formBuilder: FormBuilder, public dataService:DataService) {}

  public habParamsForm(): FormGroup{
    return this.formBuilder.group(
      {
        time: [5, [
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
        ]]
      }
    )
  }

  public employeesForm(): FormGroup{
    return this.formBuilder.group({
      employees: this.formBuilder.array([])
    });;
  }

  public employeeForm(): FormGroup{
    return this.formBuilder.group({
      firstName: ['',[
        Validators.required
      ]],
      lastName:['',[
        Validators.required
      ]],
      email: ['', [
        Validators.email,
        Validators.required
      ]
      ]
    }, {
      validators: this.checkEmailIsUnique.bind(this)
    });
  }

  checkEmailIsUnique(formGroup: FormGroup) {
    return null;
  }
}
