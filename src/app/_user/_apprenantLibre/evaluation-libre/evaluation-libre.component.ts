import { Component, OnInit } from '@angular/core';
import {Params, Test} from '../../../_model/test';
import {DataService} from '../../../_service/_util/data.service';

@Component({
  selector: 'app-evaluation-libre',
  templateUrl: './evaluation-libre.component.html',
  styleUrls: ['./evaluation-libre.component.css']
})
export class EvaluationLibreComponent implements OnInit {
  test:Test;
  onTest:boolean = false;
  constructor(public dataService:DataService) { }

  ngOnInit(): void {
  }

  getParams(params: Params) {
    let data;
    this.dataService.postResource('/loadTestByParameters',params).subscribe(d=>{
      data = d;
      this.test = data;
      this.onTest = true;
      console.log(params);
      console.log(this.test);
    }, error => console.log(error))
  }
}
