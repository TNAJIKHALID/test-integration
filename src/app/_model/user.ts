import {PositionTestResult, Test} from './test';
import {Score} from './response';
import {HabilitationLevel} from "./question";

export class User{
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  constructor() {
  }
}
export class AppUser{
  id:number;
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  constructor() {
  }
}
export class EnterpriseEmployee {
  id:number;
  appUser: AppUser;
  tests : Array<Test>;
  scores: Array<Score>;
  positionTestResult: string;
  constructor() {
  }
}
export class Enterprise{
  id:number;
  appUser:AppUser;
  effective: number;
  habilitations: Array<Habilitation>;
  positionTestResults: Array<PositionTestResult>;
}

export class ApprenantLibre{
  id:number;
  appUser:AppUser;
  profilePictureBites: any;
  scores:  Array<Score>;
  positionTestResult: string;
}

export class Formateur{
  id:number;
  appUser:AppUser;
  effective: number;
}

export class FormateurInvite{
  id:number;
  appUser:AppUser;
}
export class Etablissement{
  id:number;
  appUser:AppUser;
  effective: number;
}


export class Habilitation{
  id:number;
  test: Test;
  enterpriseEmployees: Array<EnterpriseEmployee>;
  habilitationLevel:HabilitationLevel = null;


}

export class AddEnterpriseForm {
  firstName;
  lastName;
  email;
  effective;
  constructor(firstName,  lastName,  email,  effective) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.effective = effective;
  }
}

export class AddFormateurForm {
  firstName;
  lastName;
  email;
  effective;
  constructor(firstName,  lastName,  email,  effective) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.effective = effective;
  }
}

export class AddApprenantLibreForm {
  firstName;
  lastName;
  email;
  constructor(firstName,  lastName,  email) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
  }
}


export class AddEtablissementForm {
  firstName;
  lastName;
  email;
  effective;
  constructor(firstName,  lastName,  email,  effective) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.effective = effective;
  }
}
