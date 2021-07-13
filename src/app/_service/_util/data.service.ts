import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class DataService {
  public host = environment.API_URL;
  constructor(public http: HttpClient) { }

  public getResource(url) {
    url = this.host + url;
    return this.http.get(url);
  }

  public getData(url) {
    url = this.host + url;
    return this.http.get(url);
  }

  public patchResource(url,data){
    url = this.host + url;
    return this.http.patch(url,data);
  }

  public deleteResource(url){
    url = this.host + url;
    return this.http.delete(url);
  }

  public postResource(url,data){
    url = this.host + url;
    return this.http.post(url,data);
  }
}
