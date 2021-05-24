import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Params, Test} from '../../_model/test';
import {DataService} from '../../_service/_util/data.service';
import {MatChipInputEvent} from '@angular/material/chips';
import {MatAutocomplete, MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {Observable} from 'rxjs';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {map, startWith} from 'rxjs/operators';
import {HabilitationLevel} from '../../_model/question';

@Component({
  selector: 'app-test-parameters',
  templateUrl: './test-parameters.component.html',
  styleUrls: ['./test-parameters.component.css']
})
export class TestParametersComponent implements OnInit {
  myForm:FormGroup;
  @Output() paramsEvent: EventEmitter<Params> = new EventEmitter<Params>();
  @Input() testEngineTitle: string;
  @Input() testModeInput: string;
  levels: Array<HabilitationLevel> = new Array<HabilitationLevel>();

  constructor(public formBuilder:FormBuilder, public dataService:DataService) {
    this.filteredFruits = this.themeCtrl.valueChanges.pipe(
      startWith(null),/**/
      map((fruit: string | null) => fruit ? this._filter(fruit) : this.allThemes.slice()));
  }

  ngOnInit(): void {
    this.myForm = this.formBuilder.group(
      {
        testMode:[this.testModeInput,[Validators.required]],
        habilitationLevel: ['H1', [Validators.required ]],
        fundamentalQuestion: [1,
          [ Validators.required, Validators.max(5), Validators.min(0)]
        ],
        questionFacile: [5,
          [ Validators.required, Validators.max(5), Validators.min(0)]
        ],
        questionMoyen: [5,
          [ Validators.required, Validators.max(5), Validators.min(0)]
        ],
        questionDificile: [5,
          [ Validators.required, Validators.max(5), Validators.min(0)]
        ],
        time: [5, [Validators.required, Validators.max(15), Validators.min(5) ]],
        admissionBarrier: [75, [ Validators.required,Validators.max(100), Validators.min(60) ]],
        numberOfQuestions: [15, [Validators.required, Validators.max(20), Validators.min(5)]]
      }
    )
    let dd;
    this.dataService.getResource('/getAllLevels').subscribe(d=> {
      dd = d;
      this.levels = dd;
    },error => {
      console.log(error);
    });

    this.dataService.getResource('/getAllExistingThemes').subscribe(d=>{
      dd = d;
      this.allThemes = dd;
    },error => console.log(error))
  }

  get testMode() {  return this.myForm.get('testMode'); }
  get habilitationLevel() {  return this.myForm.get('habilitationLevel'); }
  get fundamentalQuestion() {  return this.myForm.get('fundamentalQuestion'); }
  get questionFacile() {  return this.myForm.get('questionFacile'); }
  get questionMoyen() {  return this.myForm.get('questionMoyen'); }
  get questionDificile() {  return this.myForm.get('questionDificile'); }
  get time() {  return this.myForm.get('time'); }
  get admissionBarrier() {  return this.myForm.get('admissionBarrier'); }
  get numberOfQuestions() {  return this.myForm.get('numberOfQuestions'); }

  setter():Params{
    let params: Params = new Params();
    //params.testMode = this.testMode.value;
    params.testMode = this.testModeInput;
    params.habilitationLevel = this.habilitationLevel.value;
    params.fundamentalQuestion = this.fundamentalQuestion.value;
    params.questionFacile = this.questionFacile.value;
    params.questionMoyen= this.questionMoyen.value;
    params.questionDificile= this.questionDificile.value;
    params.time= this.time.value;
    params.admissionBarrier= this.admissionBarrier.value;
    params.numberOfQuestions= this.numberOfQuestions.value;
    params.themes = this.themes;
    console.log(params)
    return params;
  }

  onSubmit() {
    this.paramsEvent.emit(this.setter());
  }

  /***/
  visible = true;
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  themeCtrl = new FormControl();
  filteredFruits: Observable<string[]>;
  themes: string[] = ['Shémas électriques'];
  allThemes: string[] = []; /*['EPI- Généralités', 'Détermination des natures des opérations', 'Shémas électriques'
    , 'Emplacements de travail à risques particuliers'];
  */
  @ViewChild('fruitInput') fruitInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    if ((value || '').trim() &&
      this.allThemes.includes(value.trim())
      && !this.themes.includes(value.trim())) this.themes.push(value.trim());
    if (input) input.value = '';
    this.themeCtrl.setValue(null);
  }

  remove(fruit: string): void {
    const index = this.themes.indexOf(fruit);
    if (index >= 0) this.themes.splice(index, 1);
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    if (!this.themes.includes(event.option.viewValue))this.themes.push(event.option.viewValue);
    this.fruitInput.nativeElement.value = '';
    this.themeCtrl.setValue(null);
  }

  _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.allThemes.filter(fruit => fruit.toLowerCase().indexOf(filterValue) === 0);
  }

}
