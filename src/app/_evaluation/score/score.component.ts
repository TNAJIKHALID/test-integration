import {Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import {Score} from '../../_model/response';
import {Test} from '../../_model/test';
import {Question} from '../../_model/question';
import {EvaluationService} from '../../_service/_util/evaluation.service';
import {JwtAuthenticationService} from '../../_service/_authentication/jwt-authentication.service';
import {CertificationService} from '../../_service/_util/certification.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-score',
  templateUrl: './score.component.html',
  styleUrls: ['./score.component.css']
})
export class ScoreComponent implements OnInit {
  public score: Score = new Score();
  public test: Test;
  public dataTable: Question[];
  public config: any;
  public analysisPerTheme: Map<string,number[]> = new Map<string, number[]>();
  public analysisPerDefficulte: Map<string,number[]> = new Map<string, number[]>();
  public analysisPerFundamental: Map<string,number[]> = new Map<string, number[]>();

  public correctFondamentalQuestions:Array<Question> = new Array<Question>();
  public fondamentalQuestions:Array<Question> = new Array<Question>();
  public inCorrectfondamentalQuestions:Set<Question> = new Set<Question>();
  public inCorrectfondamentalQuestionsThems:Set<String> = new Set<String>();

  title = 'Score par thèmes';
  titlePerDefficulte = 'Score par defficulté';
  type = 'ColumnChart';
  dataPerTheme : any ;
  dataPerDefficulte: any;
  dataPerFundamental: any;
  columnNames = ['Nbr Questions', 'Correct','InCorrect'];
  options = {};
  width = 450;
  height = 500;
  analysisPerThemeKeys: any;


  @HostListener("window:beforeunload", ["$event"])
  unloadHandler(event: Event) {
    console.log("Processing beforeunload...");
    return event.returnValue = false;
  }

  constructor(public auth:JwtAuthenticationService, public router:Router,
              public route: ActivatedRoute, public certificationService:CertificationService) {
  }

  pageChanged(event){
    this.config.currentPage = event;
  }

  ngOnInit(): void {
    let routeUrl = this.router.routerState.snapshot.url;
    if(routeUrl == '/score') {
      console.log('on score');
    } else if (routeUrl == '/testReport') {
      let testId = this.route.snapshot.params.testId;
      console.log('on report')
    }
    this.score = EvaluationService.score;
    this.test = EvaluationService.test;
    this.dataTable = this.test.questions

    this.score.totalNumberOfCorrectAnswers = this.score.questions.length;
    this.config = {
      itemsPerPage: 5,
      currentPage: 1,
      totalItems: EvaluationService.test.questions.length
    };
    this.fillAnalysisMap();

    this.dataPerTheme = [];
    for (let [key, value] of this.analysisPerTheme) {
      this.dataPerTheme.push( [key, value[0], value[1]]);
    }

    this.dataPerDefficulte = [];
    for (let [key, value] of this.analysisPerDefficulte) {
      this.dataPerDefficulte.push( [key, value[0], value[1]]);
    }

    this.fondamentalQuestions.forEach(question=> {
      if(!this.correctFondamentalQuestions.includes(question)) {
        this.inCorrectfondamentalQuestions.add(question);
        this.inCorrectfondamentalQuestionsThems.add(question.theme);
      }
    });

    this.analysisPerThemeKeys = this.analysisPerTheme.keys();
    console.log(this.correctFondamentalQuestions)
    console.log(this.inCorrectfondamentalQuestions)
    console.log(this.fondamentalQuestions)
  }

  onDownload() {
   this.certificationService.downloadAvis(this.score.appUser.firstName,
      this.score.appUser.lastName,
      this.test.testLevel,this.score.validate,this.score.date);
  }

  fillAnalysisMap() {
    /*<theme, [crct,InCrct]>*/
    this.score.questions.forEach(question=>{
      if (question.fondamentale) this.correctFondamentalQuestions.push(question);
      if (!this.analysisPerTheme.has(question.theme)) {
        this.analysisPerTheme.set(question.theme,[1,0]);
      }
      else {
        let crct : number[] = this.analysisPerTheme.get(question.theme);
        crct[0] = crct[0] + 1;
        this.analysisPerTheme.set(question.theme, crct);

      }
      if (!this.analysisPerDefficulte.has(question.difficulte)) {
        this.analysisPerDefficulte.set(question.difficulte,[1,0]);
      }
      else {
        let crct : number[] = this.analysisPerDefficulte.get(question.difficulte);
        crct[0] = crct[0] + 1;
        this.analysisPerDefficulte.set(question.difficulte, crct);
      }
    });

    this.test.questions.forEach(question=>{
      if (question.fondamentale) this.fondamentalQuestions.push(question);
      if (!this.includes(question)) {
        if (!this.analysisPerTheme.has(question.theme)) {
          this.analysisPerTheme.set(question.theme,[0,1]);
        }else {
          let crct : number[] = this.analysisPerTheme.get(question.theme);
          crct[1] = crct[1] + 1;
          this.analysisPerTheme.set(question.theme, crct);
        }

        if (!this.analysisPerDefficulte.has(question.difficulte)) {
          this.analysisPerDefficulte.set(question.difficulte,[0,1]);
        }else {
          let crct : number[] = this.analysisPerDefficulte.get(question.difficulte);
          crct[1] = crct[1] + 1;
          this.analysisPerDefficulte.set(question.difficulte, crct);
        }

      }
    });
   /* this.fondamentalQuestions.forEach(question=>{
      if(!this.analysisPerFundamental.has(question.theme)){
        this.analysisPerFundamental.set(question.theme,[0,0]);
      } else {
        if (this.correctFondamentalQuestions.includes(question)) {
          let crct : number[] = this.analysisPerFundamental.get(question.theme);
          crct[1] = crct[1] + 1;
          this.analysisPerFundamental.set(question.theme, crct);
        } else {
          let crct : number[] = this.analysisPerFundamental.get(question.theme);
          crct[0] = crct[0] + 1;
          this.analysisPerFundamental.set(question.theme, crct);
        }
      }
    })*/
  }

  includes(question:Question) : boolean{
    let b: boolean = false;
    this.score.questions.forEach( q=>{
      if (q.id == question.id) {
        b = true;
      }
    })
    return b;
  }

  getKeys(data:Map<string,number[]>){
    return data.keys();
  }

  getKeysFromMap() {
    return this.getKeys(this.analysisPerTheme);
  }
}
