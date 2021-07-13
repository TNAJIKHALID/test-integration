import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-demo-home',
  templateUrl: './demo-home.component.html',
  styleUrls: ['./demo-home.component.css']
})
export class DemoHomeComponent implements OnInit {
  tp: boolean = false;
  fr : boolean = false;
  en: boolean = false;
  ev: boolean = false;
  dw: boolean=false;

  constructor() { }

  ngOnInit(): void {
  }

}
