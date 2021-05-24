import {HabilitationLevel, Question} from './question';
import {EnterpriseEmployee} from './user';

export class Test{
  id: number;
  testName: string;
  testLevel: string;

  habilitationLevel:HabilitationLevel;

  type: string;
  timeSecond: number;
  admissionBarrier: number;
  questions : Array<Question> = new Array<Question>();
}

export class PositionTest{
  public data : string[][];
  public keys:Array<string>;
  public values:Array<string>;
  constructor() {

  }
}

export class PositionTestResult{
  id: number;
  result: string;
  enterpriseEmployee: EnterpriseEmployee;
  constructor() {
  }
}


export class Params{
  public testMode;
  public habilitationLevel;
  public fundamentalQuestion;
  public questionFacile;
  public questionMoyen;
  public questionDificile;
  public time;
  public admissionBarrier;
  public numberOfQuestions;
  public themes;
  constructor(){

  }
}
