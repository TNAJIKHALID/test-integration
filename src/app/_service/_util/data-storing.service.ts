import { Injectable } from '@angular/core';
import {Enterprise} from '../../_model/user';

@Injectable({
  providedIn: 'root'
})
export class DataStoringService {

  constructor() { }

  public saveEnterprise(enterprise: Enterprise){
    let enterpriseObject = JSON.stringify(enterprise);
    localStorage.setItem('enterprise', enterpriseObject );
  }

  public loadEnterprise():Enterprise{
    let enterpriseObject = localStorage.getItem('enterprise');
    return JSON.parse(enterpriseObject);
  }

  public save(state,name : string){
    let satateObject = JSON.stringify(state);
    localStorage.setItem(name, satateObject );
  }

  public loadState(stateName:string){
    let stateObject = localStorage.getItem(stateName);
    localStorage.removeItem(stateName);
    return JSON.parse(stateObject);
  }
}
