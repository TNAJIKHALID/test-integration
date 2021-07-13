import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-formation-libre',
  templateUrl: './formation-libre.component.html',
  styleUrls: ['./formation-libre.component.css']
})
export class FormationLibreComponent implements OnInit {
  url: string = 'https://drive.google.com/file/d/1XPBSCuuioaY04nAMiSY1bg211j7oPVXW/view?usp=sharing';
  mode:number;

  constructor() { }

  ngOnInit(): void {
  }


}
