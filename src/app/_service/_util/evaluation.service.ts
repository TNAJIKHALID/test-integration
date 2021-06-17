import { Injectable } from '@angular/core';
import {QstResponse, Response, ResponseObject, Score} from '../../_model/response';
import {Test} from '../../_model/test';
import {AnswerElement, Question} from '../../_model/question';
import {Answer} from '../../_model/answer';
import {MatSnackBar} from '@angular/material/snack-bar';
import {DataService} from './data.service';
import {Router} from '@angular/router';
import {JwtAuthenticationService} from '../_authentication/jwt-authentication.service';

@Injectable({
  providedIn: 'root'
})
export class EvaluationService {
  public static score: Score;
  public static test: Test;
  constructor(
    private _snackBar: MatSnackBar,
    private dataService:DataService,
    private router : Router,
    public jwtService:JwtAuthenticationService
  ) { }

  public questionIsCorrect(question: Question, numbers: any): boolean {
    let isCorrect: boolean = true;
    if (question.type == 'CHOOSE') {
      isCorrect = this.correctAnswers(question)[0].correct && this.correctAnswers(question)[0].id == numbers[0];
    }
    else if (question.type == 'SELECT') {
      this.correctAnswers(question).forEach(answer => numbers.indexOf(answer.id) == -1 ? isCorrect = false : isCorrect);
    }
    else if (question.type == 'ORDER') {
      question.answers.forEach(answer => {
        if (numbers[answer.inOrder - 1] != answer.id) {
          isCorrect = false;
        }
      });
    }
    else if (question.type == 'FILL') {
      let allCorrect : boolean = true;

      console.log(question)
      console.log(allCorrect)
      for (let answer of question.answers) {
        if (answer.correct && numbers[answer.inOrder] != answer.id)
          allCorrect = false;
      }
      console.log(allCorrect)
      isCorrect = allCorrect;
      /*this.correctAnswers(question).forEach(answer =>
        numbers.indexOf(answer.id) == -1 ? isCorrect = false : isCorrect);*/
    }
    else if( question.type == 'DRAG' || question.type == 'DRAG_IMAGE'){
      question.answerElements.forEach(answerElemnt=>{
        if(numbers[answerElemnt.answer.inOrder] != answerElemnt.id) isCorrect = false;
      });
    }
    return isCorrect;
  }

  public correctAnswers(question: Question): Array<Answer> {
    let a: Array<Answer> = new Array<Answer>();
    question.answers.forEach(answer => {
      if (answer.correct) {
        a.push(answer);
      }
    });
    return a;
  }

  public showExplication(question: Question) {
    if(question.explication != null || question.explication != undefined){
      this._snackBar.open(question.explication, 'terminer', {
        duration: 2500,
        verticalPosition: 'top',
        panelClass: ['blue-snackbar']
      });
    }
  }

  public shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    return array;
  }

  public getResponsesObject(response : Response) : ResponseObject{
    let responseObject: ResponseObject = new ResponseObject();
    responseObject.appUserId = this.jwtService.userAuthenticated.id;
    responseObject.testId = response.testId;
    let qstReps: Array<QstResponse> = new Array<QstResponse>();
    for (let key of response.responses.keys()) {
      let q = new QstResponse();
      q.answerIds = response.responses.get(key);
      q.id = key;
      qstReps.push(q);
    }
    console.log('test Time.... ' + response.testTime);
    responseObject.testTime = response.testTime;
    responseObject.qstResponses = qstReps;
    return responseObject;
  }

  getScore(response:Response) {
    let responseObject = this.getResponsesObject(response);
    let scoreData: any;
    // Todo
    let url = response.testId == 1 ? '/getScoreForQuizz' : '/getScore';
    this.dataService.postResource(url, responseObject).subscribe(data => {
      scoreData = data;
      EvaluationService.score = scoreData;
      this.router.navigateByUrl('score');
    }, error => {
      console.log(error);
    });
  }

  public getScoreFromURL(response: Response, testSubmitURLl: string, routerScoreURL:string) {
    let responseObject = this.getResponsesObject(response);
    let scoreData: any;
    let url = testSubmitURLl;
    this.dataService.postResource(url, responseObject).subscribe(data => {
      scoreData = data;
      EvaluationService.score = scoreData;
      this.router.navigateByUrl(routerScoreURL);
    }, error => {
      console.log(error);
    });
  }

  getAnswerElementById(question: Question,answerElementId: number): AnswerElement {
    let a: AnswerElement;
    question.answerElements.forEach(answerElement => a = answerElement.id == answerElementId ? answerElement : a);
    return a;
  }
}
