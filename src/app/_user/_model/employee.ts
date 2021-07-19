//import {TestParams} from '../../_evaluation/configuration/configuration.component';

export class Employee{
  firstName:string;
  lastName:string;
  email:string;

  constructor(firstName, lastName, email) {
   this.firstName =  firstName;
   this.lastName = lastName;
   this.email = email;
  }
}
export class Employees{
  employees:Array<Employee> = new Array<Employee>();
  constructor() {
  }
}

export class HabilitatingParams{
  public enterpriseAppUserId: number;
  public testParams: TestParams;
  public employees: Employees;
  constructor() {
  }
}

export class TestParams {
  time: any;
  admissionBarrier: any;
  numberOfQuestions: any;
  constructor() {
  }
}
