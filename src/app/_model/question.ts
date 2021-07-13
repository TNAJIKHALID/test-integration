import {Answer} from './answer';


export class Question{
  id: number;
  question: string;
  type: string;
  theme: string;
  instruction: string;
  explication: string;
  //source: string;
  image: string;
  point: number;
  difficulte: string;
  questionTimeSecond: number;
  fondamentale: boolean;
  justEvaluation: boolean;

  answers : Array<Answer> = new Array();
  answerElements : Array<AnswerElement> = new Array();
  habilitationLevels: Array<HabilitationLevel> = new Array();
  picByte: any;

}

export class AnswerElement {
  id: number;
  answerElement :string;
  correct: boolean;
  answer:Answer;
}

export class HabilitationLevel {
  id: number;
  habilitationLevel: string;
}
