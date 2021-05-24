import {Question} from './question';
import {Test} from './test';
import {AppUser} from './user';

export class Response{
  public appUserId: number;
  public testId: number ;
  public testTime: number;
  public responses : Map<number,number[]>  = new Map<number,number[]>();

  constructor() {

  }
}

export class QstResponse {
  public id: number;
  public answerIds: number[];
  constructor() {

  }
}

export class ResponseObject{
  public appUserId: number;
  public testId: number ;
  public qstResponses : Array<QstResponse>;
  public testTime: number;
  constructor() {
  }
}

export class Score{
  id: number;
  score: number;
  validate: boolean;
  totalNumberOfCorrectAnswers: number;
  testTime: number;
  date: any;
  test: Test;
  appUser: AppUser;
  questions: Array<Question>;
  constructor() {
  }
}
