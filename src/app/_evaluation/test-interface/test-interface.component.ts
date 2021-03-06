import {Component, HostListener, Input, OnInit} from '@angular/core';
import {Test} from '../../_model/test';
import {AnswerElement, Question} from '../../_model/question';
import {Response} from '../../_model/response';
import {Subscription, timer} from 'rxjs';
import {Answer} from '../../_model/answer';
import {DataService} from '../../_service/_util/data.service';
import {ActivatedRoute, Router} from '@angular/router';
import {EvaluationService} from '../../_service/_util/evaluation.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatDialog} from '@angular/material/dialog';
import {SpeakService} from '../../_service/_util/speak.service';
import {DataStoringService} from '../../_service/_util/data-storing.service';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {ConfirmationDialogService} from '../../_service/_util/confirmation-dialog.service';
import {noUndefined} from "@angular/compiler/src/util";
import {ToastrService} from "ngx-toastr";
import {DomSanitizer} from "@angular/platform-browser";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-test-interface',
  templateUrl: './test-interface.component.html',
  styleUrls: ['./test-interface.component.css']
})
export class TestInterfaceComponent implements OnInit {
  /** Data variables */
  @Input() public test: Test;
  @Input() public submitScoreUrl:string;
  @Input() public routerScoreUrl:string = '';


  /** store the current question */
  public question: Question;
  /** store the responses to submission */
  public response: Response = new Response();
  /** store the responses AKA questions to keep for submission */
  public filteredResponses : Map<number,number[]>  = new Map<number,number[]>();
  /** visited questions*/
  public visitedQuestions: Array<number> = new Array<number>();
  /** question on which user click valider*/
  public verifiedQuestions: Array<number> = new Array<number>();
  /** question on which user click voire la reponse*/
  public respondedQuestionsIds: Array<number> = new Array<number>();

  public isCurrentQuestionCorrect: boolean;

  /** state variables**/
  public onTest: boolean;
  public noAnswer: boolean = true;
  public onEvaluation: boolean;
  private allAnswersForFillChecked: boolean = true;
  public currentQuestionNumber: number = 0;
  checkedArray: Array<number> = new Array<number>();
  isChecked: boolean;
  public countDown: Subscription;
  public counter: number;
  public showAnswer: boolean = false;
  public allowPassingQuestions: boolean = false;
  public numberOfQuestionsToLoad: number = 5;

  public zoneNames: Array<Answer> = new Array<Answer>();
  public zoneValues: Array<AnswerElement> = new Array<AnswerElement>();
  public strings: any;
  public a: Array<string[]> = new Array<string[]>();
  public ma: Map<number, Array<Answer>> = new Map<number, Array<Answer>>();
  public testId: number = 2;
  /** Test for Drag */
  public data: Array<AnswerElement[]>;
  public done: Array<AnswerElement> = [];
  public ids: Array<String> = [];
  public idsImages: Array<String> = [];

  public noNeedForGet : boolean = false;
  public questionTimeInSecond: number;
  public QuestionCountDown;

  public idsAndAll: Array<string> = new Array<string>();
  public idsAndAllImages: Array<string> = new Array<string>();

  public numberOfFondamentalQuestions:number = 0;
  public numberOfThemes: number = 0;


  public timeEnded: boolean = false;

  public picByteToDisplay: any;

  @HostListener("window:beforeunload", ["$event"])
  unloadHandler(event: Event) {
    console.log("Processing beforeunload...");
    //this.saveState();
    return event.returnValue = false;
    //return 'null';
  }
  constructor(public dataService: DataService, public router: Router,
              public evaluationService: EvaluationService, public route: ActivatedRoute,
              private _snackBar: MatSnackBar, public dialog: MatDialog,
              public confirmationDialogService:ConfirmationDialogService,
              private toastr: ToastrService,
              private modalService: NgbModal,
              public speakService: SpeakService, public dataStoring: DataStoringService,
              public domSanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    this.onTest = false;
    this.onEvaluation = this.test.type == 'TEST_TYPE_EXAM';
    //this.allowPassingQuestions = true;
    this.allowPassingQuestions = this.onEvaluation ? false : true;
    this.setDataTest();
    this.speakService.mute();
    this.test.questions.forEach(q=> {if(q.fondamentale)this.numberOfFondamentalQuestions++;})
    let themes: Set<string> = new Set<string>();
    this.test.questions.forEach(q=> themes.add(q.theme));
    this.numberOfThemes = themes.size;
  }

  ngOnDestroy(): void {
    console.log('on destroy.....')
    if(this.countDown != null){
      this.countDown.unsubscribe();
    }

    this.speakService.mute();
  }

  onSubmit() {
    this.noAnswer = this.checkIfAnswered();
    if (this.noAnswer || this.allowPassingQuestions || this.timeEnded) {
      EvaluationService.test = this.test;
      this.response.testTime = this.test.timeSecond - this.counter;
      this.countDown.unsubscribe();
      /****************/
      //todo
      if(!this.onEvaluation){
        for (let key of this.response.responses.keys()) {
          if (this.filteredResponses.has(key)){
            this.response.responses.set(key,this.filteredResponses.get(key))
          } else {
            this.response.responses.set(key,[])
          }
        }
      }
      /****************/
      this.evaluationService.getScoreFromURL(this.response,this.submitScoreUrl,this.routerScoreUrl);
    }

    this.countDown.unsubscribe();
  }

  startTimer(testTime: number) {
    //this.counter = testTime * 60;
    this.counter = testTime;
    this.countDown = timer(0, 1000)
      .subscribe(() => {
        --this.counter;
        if (this.counter == 0) {
          console.log('end');
          this.timeEnded = true;
          this.onSubmit();
        }
      })
  }

  prePareDataForCurrentQuestion() {
    if (this.question.type == 'FILL') {
      this.ma = new Map<number, Array<Answer>>();
      this.strings = this.question.question.split('<s>');
      let answers =this.question.answers;
      for (let i = 0; i < this.question.answers.length; i++) {
        this.ma.set(i, answers);
      }
      this.strings = this.question.question.split('<s>');
    }
    else if (this.question.type == 'DRAG' || this.question.type == 'DRAG_IMAGE' ) {
      this.zoneValues = new Array<AnswerElement>(this.question.answerElements.length);
      this.zoneNames = new Array<Answer>(this.question.answers.length);
      for (let i = 0; i < this.question.answers.length; i++) {
        let answer: Answer = this.question.answers[i];
        this.zoneNames[answer.inOrder] = answer;
        this.zoneValues[i] = this.question.answerElements[i];
      }
      this.zoneValues = this.evaluationService.shuffle(this.zoneValues);
      this.fillForZoneQuestionDrag();
    } else if(this.question.type == 'ORDER'){
      this.question.answers = this.evaluationService.shuffle(this.question.answers)
    }
  }

  onStartTest() {
    this.currentQuestionNumber = 0;
    this.question = this.test.questions[this.currentQuestionNumber];
    this.onTest = true;
    let time: number = this.test.timeSecond;
    this.startTimer(time);
    this.prePareDataForCurrentQuestion();
    this.visitedQuestions.push(this.question.id);
    this.speakService.readText(this.question.question + '\n\n' + this.question.instruction);
  }

  mute() {
    this.speakService.mute();
    this.speakService.activeVoiceReading = false;
  }

  voiceUp() {
    this.speakService.activeVoiceReading = true;
    this.speakService.readText(this.question.question + '\n\n' + this.question.instruction);
  }

  startQuestionTimer(qTime: number) {
    this.questionTimeInSecond = qTime;
    if (this.QuestionCountDown != undefined) this.QuestionCountDown.unsubscribe();
    this.QuestionCountDown = timer(0, 1000)
      .subscribe(() => {
        --this.questionTimeInSecond;
        console.log(this.questionTimeInSecond)
        if (this.questionTimeInSecond == 0) {
          console.log('end');
        }
      })
  }

  onNext() {
    this.noAnswer = this.checkIfAnswered();
    if(!this.noAnswer && !this.allowPassingQuestions){
      this.toastr.error('Merci de finaliser votre r??ponse', 'Erreur',{
        timeOut: 3000,
        positionClass: 'toast-top-center',
        closeButton: true,
      });
    }
    if (this.noAnswer || this.allowPassingQuestions) {
      this.currentQuestionNumber++;
      this.question = this.test.questions[this.currentQuestionNumber];
      this.checkedArray = new Array<number>();
      this.prePareDataForCurrentQuestion();
      this.visitedQuestions.push(this.question.id);
      this.speakService.readText(this.question.question + '\n\n' + this.question.instruction);
      //todo
      this.startQuestionTimer(this.question.questionTimeSecond);

    }
    console.log(this.visitedQuestions)
    console.log(this.checkIfQuestionAnswered(this.question))
    this.showAnswer = false;
  }

  onPrev() {
    this.showAnswer = false;
    this.currentQuestionNumber--;
    this.noAnswer = true;
    this.question = this.test.questions[this.currentQuestionNumber];
    this.speakService.readText(this.question.question + '\n\n' + this.question.instruction);
    this.prePareDataForCurrentQuestion();
  }

  goToQuestion(i: number) {
    if (this.allowPassingQuestions) {
      this.question = this.test.questions[i];
      this.currentQuestionNumber = i;
      this.checkedArray = new Array<number>();
      this.prePareDataForCurrentQuestion();
      this.showAnswer = false;
      this.speakService.readText(this.question.question + '\n\n' + this.question.instruction);
      this.visitedQuestions.push(this.question.id);
    }
  }

  chosenAnswer(event: any, id: number, index: number) {
    if (this.question.type == 'SELECT') {
      if (this.checkedArray.indexOf(id) != -1 && event.target.checked) {
        this.checkedArray.push(id);
      } else if (this.checkedArray.indexOf(id) != -1 && !event.target.checked) {
        this.checkedArray.splice(this.checkedArray.indexOf(id), 1);
      } else if (this.checkedArray.indexOf(id) == -1 && event.target.checked) {
        this.checkedArray.push(id);
      }
      this.response.responses.set(this.question.id, this.checkedArray);
    } else if (this.question.type == 'CHOOSE') {
      this.response.responses.set(this.question.id, [id]);
    } else if (this.question.type == 'ORDER') {
      let array: Array<number> = new Array();
      for (let i = 0; i < this.question.answers.length; i++) {
        let a1 = this.question.answers[i];
        array.push(a1.id);
      }
      this.response.responses.set(this.question.id, array);
    } else if (this.question.type == 'FILL') {
      let answerId = event.target.value;
      let array: Array<number> = this.response.responses.get(this.question.id);
      if (array.length < id) {
        let newArray = new Array(id + 1);
        for (let i = 0; i < array.length; i++) {
          let a1 = array[i];
          newArray[i] = a1;
        }
        newArray[id] = answerId;
        array = newArray;
      } else {
        array[id] = answerId;
      }
      if (array.length < this.ma.size) {
        this.allAnswersForFillChecked = false;
      } else {
        this.allAnswersForFillChecked = true;
      }
      this.response.responses.set(this.question.id, array);
    } else if (this.question.type == 'DRAG' || this.question.type == 'DRAG_IMAGE') {
      //let array = this.response.responses.get(this.question.id);
      //array[id] = event.target.value;
      /** my version **/
      let arrayUI = this.response.responses.get(this.question.id);
      for (let i = 0; i < this.data.length; i++) {
        console.log(this.data[i]);
        if (this.data[i].length != 0) {
          /*if(this.data[i][0]!= undefined )*/
          arrayUI[i] = this.data[i][0].id;
        } else arrayUI[i] = null;
      }
      console.log("checking .......................")
      console.log(arrayUI)
      //console.log(array)
      /** end **/
      this.response.responses.set(this.question.id, arrayUI);
    }
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.question.answers, event.previousIndex, event.currentIndex);
    this.chosenAnswer(null, null, null);
  }

  checkIfAnswered() {
    let b = true;
    let numbers1 = this.response.responses.get(this.question.id);
    let dragDone: boolean = true;
    let others: boolean = true;
    if (this.question.type == 'FILL') {
      this.allAnswersForFillChecked = !numbers1.includes(undefined) && numbers1.length == this.ma.size;
      console.log(this.allAnswersForFillChecked);
    } else if (this.question.type == 'DRAG' || this.question.type == 'DRAG_IMAGE') {
      dragDone = !this.response.responses.get(this.question.id).includes(undefined) &&
        !this.response.responses.get(this.question.id).includes(null) &&
        this.response.responses.get(this.question.id).length == this.question.answerElements.length;
    } else {
      others = (this.question.type == 'ORDER' || this.response.responses.get(this.question.id).length > 0)
    }
    b = others && this.allAnswersForFillChecked && dragDone;
    return b;
  }

  checkIfQuestionAnswered(question: Question): boolean {
    let b, dragDone: boolean = true, others: boolean = true, fill: boolean = true;
    let numbers1 = this.response.responses.get(question.id);
    if (question.type == 'FILL') {
      let ma = new Map<number, Array<Answer>>();
      let answers = question.answers;
      for (let i = 0; i < question.answers.length; i++) {
        ma.set(i, answers);
      }
      fill = !numbers1.includes(undefined) && numbers1.length == ma.size && numbers1.length > 0;
    }
    else if (question.type == 'DRAG' || question.type == 'DRAG_IMAGE') {
      dragDone = !this.response.responses.get(question.id).includes(undefined) &&
        !this.response.responses.get(question.id).includes(null) &&
        this.response.responses.get(question.id).length == question.answerElements.length;
    } else if (question.type == 'ORDER') {
      others = true;
    }
    else {
      others = this.response.responses.get(question.id).length > 0;
    }
    b = others && fill && dragDone;
    return b;
  }

  questionIsCorrect(question: Question): boolean {
    let numbers = this.response.responses.get(question.id);
    return this.evaluationService.questionIsCorrect(question, numbers);
  }

  onShowAnswer() {
    this.showAnswer = true;
    let type = this.question.type;
    if (type == 'SELECT' || type == 'CHOOSE') {
      let resps: Array<number> = new Array<number>();
      this.evaluationService.correctAnswers(this.question).forEach(a => resps.push(a.id))
      this.response.responses.set(this.question.id, resps);
    }
    else if (type == 'ORDER') {
      let resps: Array<number> = new Array<number>();
      let answers: Array<Answer> = this.question.answers;
      answers.sort((a, b) => a.inOrder > b.inOrder ? 1 : -1);
      answers.forEach(a => resps.push(a.id))
      this.response.responses.set(this.question.id, resps);
    }
    else if (type == 'FILL') {
      let answers: Array<Answer> = this.evaluationService.correctAnswers(this.question);
      let resps: Array<number> = new Array<number>(answers.length);
      for (let i = 0; i < answers.length; i++) {
        let a1 = answers[i];
        resps[a1.inOrder] = a1.id;
      }
      this.response.responses.set(this.question.id, resps);
    }
    else if (type == 'DRAG' || type == 'DRAG_IMAGE') {
      let array: Array<number> = new Array<number>(this.question.answerElements.length);
      for (let i = 0; i < this.question.answerElements.length; i++) {
        let answerElement = this.question.answerElements[i];
        array[answerElement.answer.inOrder] = answerElement.id;
        this.data[i] = [answerElement];
        this.done = [];
      }
      this.response.responses.set(this.question.id, array);
    }
    this.respondedQuestionsIds.push(this.question.id);
  }

  ngClassQuestion(question: Question, index: number): string {
    let classy: string = 'step';
    if (index == this.currentQuestionNumber) {
      classy += ' step-active';
    } else if (this.questionIsCorrect(question) && index < this.currentQuestionNumber) {
      classy += ' step-success';
    } else if (!this.questionIsCorrect(question) && index < this.currentQuestionNumber) {
      classy += ' step-error';
    }
    return classy;
  }

  setDataTest() {
    this.response.testId = this.test.id;
    for (let i = 0; i < this.test.questions.length; i++) {
      let question1 = this.test.questions[i];
      if (question1.type == 'ORDER') {
        let array: Array<number> = new Array<number>();
        question1.answers.forEach(a => array.push(a.id));
        this.response.responses.set(question1.id, array);
      } else {
        this.response.responses.set(question1.id, []);
      }
    }
  }

  fillForZoneQuestionDrag() {
    this.done = [];
    this.data = new Array<AnswerElement[]>(this.zoneNames.length);
    for (let i = 0; i < this.data.length; i++) {
      this.ids.push('' + i);
      this.idsImages.push(i+'_images');
      this.data[i] = [];
    }
    let array: Array<number> = this.response.responses.get(this.question.id);
    for (let i = 0; i < array.length; i++) {
      let answerElementId = array[i];
      if (answerElementId != undefined) {
        // if already answered we put the answer in data
        this.data[i] = [this.evaluationService.getAnswerElementById(this.question,answerElementId)];
      } else this.data[i] = [];// we put an empty array
    }
    // we fill the option array we the none selected elements
    for (let i = 0; i < this.question.answerElements.length; i++) {
      if (!array.includes(this.question.answerElements[i].id)) this.done.push(this.question.answerElements[i]);
    }
    this.idsAndAll.push('all');
    this.idsAndAllImages.push('all_images');
    this.ids.forEach(i=>this.idsAndAll.push(i+''));
    this.idsImages.forEach(i=>this.idsAndAllImages.push(i+''));
    this.done =  this.evaluationService.shuffle(this.done);

  }

  dropForZoneQuestions(event: CdkDragDrop<AnswerElement[]>) {
    let constToPlace = event.container.data.length < 1 || event.container.id == 'all'
      || event.container.id == 'all_images' ;
    console.log("***********")
    console.log(event.container.id)
    console.log(event.container.data)
    console.log(event.container.data.length)
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else if (constToPlace) {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
      console.log('after draging');
      console.log(event.container.data)
    }
    this.chosenAnswer(null, null, null);
  }

  onValidateAnswer() {
    let isCorrect : boolean = this.questionIsCorrect(this.question);
    this.verifiedQuestions.push(this.question.id);
    this.evaluationService.showExplication(this.question);

    if(!this.filteredResponses.has(this.question.id)){
      this.filteredResponses.set(this.question.id,this.response.responses.get(this.question.id));
    }
    if(isCorrect){
      this.toastr.success('Bravo', 'Question',{
        timeOut: 3000,
        positionClass: 'toast-top-center',
        closeButton: true
      });
    } else {
      this.toastr.error('Ops! c\'est rat??', 'Question',{
        timeOut: 3000,
        positionClass: 'toast-top-center',
        closeButton: true,
      });
      this.isCurrentQuestionCorrect = isCorrect;
    }
  }


  open(content,picByteToDisplay) {
    this.picByteToDisplay = picByteToDisplay;
    let closeResult;
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title',centered: true}).result.then((result) => {
      closeResult = `Closed with: ${result}`;
    }, (reason) => {
      closeResult = `Dismissed...`;
    });
  }

}

