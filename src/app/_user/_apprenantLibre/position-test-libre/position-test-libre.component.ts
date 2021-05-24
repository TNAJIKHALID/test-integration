import { Component, OnInit } from '@angular/core';
import {DataService} from '../../../_service/_util/data.service';

@Component({
  selector: 'app-position-test-libre',
  templateUrl: './position-test-libre.component.html',
  styleUrls: ['./position-test-libre.component.css']
})
export class PositionTestLibreComponent implements OnInit {
  apprenant: { positionTestResult:string };
  startTest: boolean = false;
  positionTestResult:string;
  constructor(public dataService:DataService) { }

  ngOnInit(): void {
    this.positionTestResult = 'NAN';
  }

  receivedLevel($event: string) {
    this.positionTestResult = $event;
    this.startTest = false;
    let d;
    console.log('parent ........ ' + this.apprenant.positionTestResult);
   /* this.dataService.postResource('/putPositionTestResult',this.apprenant).subscribe(data=>{
      d=data;
      this.apprenant = d;
    },error => console.log(error))*/
  }
}
