import { Component, OnInit } from '@angular/core';
import {Test} from "../../_model/test";
import {DataService} from "../../_service/_util/data.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-test-question-data-base-params',
  templateUrl: './test-question-data-base-params.component.html',
  styleUrls: ['./test-question-data-base-params.component.css']
})
export class TestQuestionDataBaseParamsComponent implements OnInit {
  public test:Test;
  public isTestLoaded: boolean= false;
  public themes:Array<string>;
  myForm:FormGroup;


  constructor(public dataService:DataService,public formBuilder:FormBuilder) { }

   ngOnInit(): void {
    this.start();
  }

  loadTest(){
    let theme= this.themeForm.value;
    let temp;
    this.dataService.getResource('/loadQuestionsToTest?theme='+theme).subscribe(data=>{
      temp = data;
      this.test = temp;
      this.isTestLoaded = true;
    },error => {
      console.log(error)
    })
  }

  private loadThemes() {
    let temp;
    this.dataService.getResource('/getExistingThemes').subscribe(data=>{
      temp = data;
      this.themes = temp;
      this.myForm = this.formBuilder.group(
        {
          theme: [ this.themes[0], [Validators.required ]],
        }
      )
    },error => {
      console.log(error)
    })
  }

  onLoad() {
    this.loadTest();
  }

  get themeForm() {  return this.myForm.get('theme'); }

  async start() {
    await this.loadThemes();

  }
}
