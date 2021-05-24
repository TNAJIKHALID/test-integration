import { Injectable } from '@angular/core';
import {Component, OnInit, Pipe, PipeTransform} from '@angular/core';
import {Subscription, timer} from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class UtilitiesService {

  constructor() { }

  public startTimer(timeInMunites : number) : Subscription{
    return timer(0, 1000)
      .subscribe(() => --timeInMunites);
  }
}
