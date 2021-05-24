import {Component, OnInit, Output, EventEmitter} from '@angular/core';
import {DataService} from '../../_service/_util/data.service';
import {EnterpriseEmployee} from '../../_model/user';
import {PositionTest} from '../../_model/test';

@Component({
  selector: 'app-position-test',
  templateUrl: './position-test.component.html',
  styleUrls: ['./position-test.component.css']
})
export class PositionTestComponent implements OnInit {
  public data : string[][] = [["1","OUI","R1"],["1","NON","R2"]];
  public selected : string[] = [];
  public question: string = "";
  public keys:Array<string>;
  public values:Array<string>;
  public isTache: boolean = false;
  public isMetier: boolean = false;
  public isRoot: boolean = true;
  public isElectrique: boolean = false;
  public level: string;
  @Output() levelEmetter = new EventEmitter<string>();
  constructor(public dataService:DataService) {
  }

  ngOnInit(): void {
    let tp:any;
    let positionTest : PositionTest=  new PositionTest();
    this.dataService.getResource("/positionTest").subscribe(data=>{
      tp = data;
      this.question = "2.0";
      positionTest = tp;
      this.values = positionTest.values;
      this.keys = positionTest.keys;
      this.data = positionTest.data;
      console.log(this.values)
      console.log(positionTest);
    })
  }

  OnNo() {
    this.selected.push("NON");
    this.nextQuestion();
  }

  OnYes() {
    this.selected.push("OUI");
    this.nextQuestion();
  }

  nextQuestion(){
    console.log('on next ...................')
    console.log(this.selected)
    let is : boolean = true;
    for (let i = 0; i < this.data.length; i++) {
      let selected = this.data[i];
      is = true;
      for (let j = 0; j < this.selected.length; j++) {
        if(this.selected[j] != selected[j]){
          is = false;
        }
      }
      console.log('is ............ ' + is)
      if (is) {
        this.question = selected[this.selected.length];
        this.selected.push(this.question);
        break;
      }
    }
    console.log('next results')
    console.log(this.selected)
    console.log(this.question)

  }

  previous() {
    console.log(this.selected)
    if(this.selected[this.selected.length-2] == 'OUI' || this.selected[this.selected.length-2] == 'NON' ){
      this.question = this.selected[this.selected.length-3];
      this.selected.splice(this.selected.length-2,2);
    } else if(this.selected[this.selected.length-1] != 'T' && this.selected[this.selected.length-1] != 'M') {
      this.selected = this.selected.slice(0,this.selected.length-1)
      if(this.selected[this.selected.length-1] == 'N' || this.selected[this.selected.length-1] == 'E') this.selected.splice(this.selected.length-1,1);
      let value = this.selected[this.selected.length-1];
      this.selected.splice(this.selected.length-1,1);
      this.OnValue(value);
    } else if (this.selected[this.selected.length-1] == 'T' || this.selected[this.selected.length-1] == 'M') {
      this.selected = [];
      this.isRoot = true;
      this.isTache = false;
      this.isMetier = false;
    }
    this.bols();

  }

  OnValue(value:string) {
    if (value == 'T') {
      /*this.isTache = true;
      this.isRoot = false;
      this.isElectrique = false;
      this.isMetier = false;*/
      this.selected.push(value);
    } else if (value == 'M' || value == 'F' || value == 'R'){
      /*this.isTache = false;
      this.isMetier = true;
      this.isRoot = false;
      this.isElectrique = true;*/
      this.selected.push(value);
    } else {
      /*this.isTache = false;
      this.isMetier = false;
      this.isElectrique = false;*/
      this.selected.push(value);
      this.nextQuestion();
    }
    this.bols();
  }

  public bols(){
    this.isRoot = this.selected.length == 0;
    this.isMetier = this.selected[this.selected.length-1] == 'M';
    this.isTache = this.selected[this.selected.length-1] == 'T';
    this.isElectrique = this.selected[this.selected.length-1] == 'M' ||
      this.selected[this.selected.length-1] == 'F' || this.selected[this.selected.length-1] == 'R';
  }

  OnConfirm(question: string) {
    this.level = this.values[this.keys.indexOf(question)] ;
    console.log(this.level);
    this.levelEmetter.emit(this.level);
  }
}
