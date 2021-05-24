import {Injectable, OnInit} from '@angular/core';
import jwt_decode from 'jwt-decode';
import {Router} from '@angular/router';
import {DataService} from '../_util/data.service';
import {HttpHeaders} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class JwtAuthenticationService implements OnInit{
  public APP_ROLE_ENTERPRISE_ADMIN : string = "ENTERPRISE_ADMIN";
  public APP_ROLE_APP_ADMIN : string = "APP_ADMIN";
  public APP_ROLE_ENTERPRISE_EMPLOYEE : string = "ENTERPRISE_EMPLOYEE";
  public APP_ROLE_TRAINER  : string = "TRAINER";
  public APP_ROLE_TRAINER_EMPLOYEE : string  = "TRAINER_EMPLOYEE";
  public APP_ROLE_CLASS_ADMIN : string  = "CLASS_ADMIN";
  public APP_ROLE_CLASS_STUDENT : string  = "CLASS_STUDENT";
  public APP_ROLE_USER_LEARNER : string = "LEARNER";

  public isAuthenticated: boolean;
  public userAuthenticated;
  public token;
  public jwtAccessToken;
  public jwtRefreshToken;
  public expirationDate;

  constructor(public router:Router, private dataService:DataService) {
    this.loadAuthenticatedUserFromLocalStorage();
  }

  ngOnInit(): void {
    this.loadAuthenticatedUserFromLocalStorage();
  }

  public getDecodedAccessToken(token: string): any {
    try{
      return jwt_decode(token);
    }
    catch(Error){
      return null;
    }
  }

  public saveAuthenticatedUser() {
    if (this.userAuthenticated) {
      localStorage.setItem('jwtAccessToken', this.jwtAccessToken );
      localStorage.setItem('jwtRefreshToken', this.jwtRefreshToken );
    }
  }

  public loadAuthenticatedUserFromLocalStorage() {
    let t = localStorage.getItem('jwtAccessToken');
    if (t) {
      let decodedAccessToken = this.getDecodedAccessToken(t);
      this.expirationDate = decodedAccessToken.exp;
      this.userAuthenticated =  {
        username: decodedAccessToken.sub,
        roles: decodedAccessToken.roles,
        id: decodedAccessToken.id,
        firstName: decodedAccessToken.firstName,
        lastName: decodedAccessToken.lastName
      };
      console.log(this.userAuthenticated.firstName);
      this.isAuthenticated = true;
      this.jwtAccessToken =t;
    }
  }

  public removeTokenFromLocalStorage(){
    localStorage.removeItem('jwtAccessToken');
    localStorage.removeItem('jwtRefreshToken');
    this.isAuthenticated = false;
    this.token = undefined;
    this.jwtAccessToken = undefined;
    this.jwtRefreshToken = undefined;
    this.userAuthenticated = undefined;
  }

  public login(username: string, password: string){
    let httpOptions = {
      headers: new HttpHeaders({ 'content-Type': 'application/x-www-form-urlencoded'})
    };
    return this.dataService.http.post(
      this.dataService.host + '/login?'+'username='+username+'&password='+password ,
      { "username": username, "password":password },
      httpOptions
    )
  }

  public successfulAuthentication(data:any){
    this.jwtAccessToken = data.access_token;
    this.jwtRefreshToken = data.refresh_token;
    let decodedAccessToken = this.getDecodedAccessToken(this.jwtAccessToken);
    this.isAuthenticated = true;
    this.expirationDate = decodedAccessToken.exp;
    this.userAuthenticated =  {
      username: decodedAccessToken.sub,
      roles: decodedAccessToken.roles,
      id: decodedAccessToken.id,
      firstName: decodedAccessToken.firstName,
      lastName: decodedAccessToken.lastName
    };
    console.log('roles : ' + this.userAuthenticated.firstName);
    console.log('id : ' + this.userAuthenticated.id);
    this.saveAuthenticatedUser();
  }

  public logout() {
    this.removeTokenFromLocalStorage();
    this.router.navigateByUrl('/login');
  }

  public hasRole(role:string): boolean{
    return this.userAuthenticated.roles.includes(role);
  }

  public accessTokenExpired():boolean{
    let isExpired: boolean;
    if ((Math.floor((new Date).getTime() / 1000)) >= this.expirationDate) {
      isExpired = true;
    } else {
      isExpired = false;
    }
    return isExpired;
  }

  public refreshTokenExpired(): boolean{
    let t = localStorage.getItem('jwtRefreshToken');
    let decodedAccessToken = this.getDecodedAccessToken(t);
    let refreshTokenExpirationDate = decodedAccessToken.exp;
    let isExpired: boolean;
    if ((Math.floor((new Date).getTime() / 1000)) >= refreshTokenExpirationDate) {
      isExpired = true;
    } else {
      isExpired = false;
    }
    return isExpired;
  }

  public refreshAccessToken(){
    let refreshToken = localStorage.getItem('jwtRefreshToken');
    this.dataService.postResource('/refreshToken',refreshToken).subscribe(d=>{
      this.successfulAuthentication(d);
    }, error => {
      console.log(error);
    })
  }
}

