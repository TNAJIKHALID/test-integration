import { Component, OnInit } from '@angular/core';
import {Params, Test} from '../../../_model/test';
import {DataService} from '../../../_service/_util/data.service';
import {MatDialog} from '@angular/material/dialog';
import {TestOnlyComponent} from '../../../_evaluation/test-only/test-only.component';

@Component({
  selector: 'app-entrainement-libre',
  templateUrl: './entrainement-libre.component.html',
  styleUrls: ['./entrainement-libre.component.css']
})
export class EntrainementLibreComponent implements OnInit {
  test:Test;
  onTest:boolean = false;
  constructor(public dataService:DataService,public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  getParams(params: Params) {
    console.log(params);
    let data;
    //this.dataService.getResource('/loadRandomQuizz').subscribe(d=>{
    this.dataService.postResource('/loadTestByParameters',params).subscribe(d=>{
      data = d;
      this.test = data;
      this.onTest = true;
      console.log(this.test);
      //this.openDialog();
    }, error => console.log(error))
  }

  openDialog() {
    let dialogRef = this.dialog.open(TestOnlyComponent,{
      height: '600px',
      width: '1200px',
    });
    let instance = dialogRef.componentInstance;
    instance.test =this.test;
    instance.submitScoreUrl = '/getScoreForQuizz';
  }
}
