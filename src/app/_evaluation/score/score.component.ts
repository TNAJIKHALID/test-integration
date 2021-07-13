import {Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import {Score} from '../../_model/response';
import {Test} from '../../_model/test';
import {Question} from '../../_model/question';
import {EvaluationService} from '../../_service/_util/evaluation.service';
import {JwtAuthenticationService} from '../../_service/_authentication/jwt-authentication.service';
import {CertificationService} from '../../_service/_util/certification.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ConstantBase64} from "../../util/imagesBase64";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import {async} from "rxjs/internal/scheduler/async";
import {DatePipe, PercentPipe} from "@angular/common";
import {FormatTimePipe} from "../../pipes/FormatTimePipe";

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
  columnNames = ['Nbr Questions', 'Correctes','Incorrectes'];
  options = {
    bars: 'vertical',
    titleTextStyle: {
      color: '#FF6801',    // any HTML string color ('red', '#cc00cc')
      fontSize: 18, // 12, 18 whatever you want (don't specify px)
      bold: true,
      position: 'center'// true or false
    },
    vAxis: {
      textStyle:{
        color: '#FF6801',
        fontSize: 18
      },
      format: 'short'
    },
    hAxis: {
      textStyle:{
        color: '#FF6801',
        fontSize: 18
      },
      gridlines: {
        color: "#FF6801"
      },
      baselineColor: '#FF6801'
    },
    height: 300,
    width : 800,
    colors: ['#92d04f', '#fc4949']
  };
  width = 700;
  height = 500;
  analysisPerThemeKeys: any;

  public dashOfsset;
  annimation: string;


  @HostListener("window:beforeunload", ["$event"])
  unloadHandler(event: Event) {
    console.log("Processing beforeunload...");
    return event.returnValue = false;
  }

  constructor(public auth:JwtAuthenticationService, public router:Router,public datepipe: DatePipe,
              public percentPipe: PercentPipe, public formatTime: FormatTimePipe,
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
    this.dashOfsset = Math.floor( 440 * ( 1 - this.score.score/100));

    console.log(this.test)
    console.log(this.score)
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
    console.log(this.fondamentalQuestions);


  }

  onDownload() {
   /*
   this.certificationService.downloadAvis(this.score.appUser.firstName,
      this.score.appUser.lastName,
      this.test.testLevel,this.score.validate,this.score.date);
   */

    //this.downloadAvis();
    this.downloadAvis2();
  }

  public downloadAvis():void {
    var imgData;
    if (this.score.validate){
      imgData = ConstantBase64.imageAvisFavorable;
    } else {
      imgData = ConstantBase64.imageAvisDeFavorable;
    }
    let fullName = this.score.appUser.firstName + ' ' + this.score.appUser.lastName;
    let level = this.test.testLevel;
    let date = this.datepipe.transform(this.score.date, 'dd/MM/yyyy');

    var doc = new jsPDF("p", "px", "a4");
    var width = doc.internal.pageSize.getWidth();
    var height = doc.internal.pageSize.getHeight();
    doc.addImage(imgData, 'PNG', 0, 0, width, height);
    doc.setTextColor(0,0,1)
    doc.text(level, 40, 325);
    doc.text(date, 55, 515);
    doc.text(date, 247, 514);
    doc.setFontSize(22)
    doc.setTextColor(255,69,1)
    doc.text(fullName, 180, 155);
    doc.save("Avis-Habilitation.pdf")
  }

  public downloadAvis2():void {
    var imgData;
    if (this.score.validate){
      imgData = ConstantBase64.AvisFavorable2;
    } else {
      imgData = ConstantBase64.AvisDeFavorable2;
    }
    var doc = new jsPDF("p", "px", "a4");
    var width = doc.internal.pageSize.getWidth();
    var height = doc.internal.pageSize.getHeight();
    doc.addImage(imgData, 'PNG', 0, 0, width, height);
    doc.save("Avis-Habilitation.pdf")
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
    let data:Array<string> = new Array();
    for (let key of this.analysisPerTheme.keys()) {
      data.push(key)
    }
    return data;// this.getKeys(this.analysisPerTheme);
  }

  async downloadRepport() {
    var doc = new jsPDF("p", "pt", "a4");
    var width = doc.internal.pageSize.getWidth();
    var height = doc.internal.pageSize.getHeight();

    let fullName = this.auth.userAuthenticated.firstName + ' ' + this.auth.userAuthenticated.lastName;
    let date = this.datepipe.transform(this.score.date, 'yyyy-MM-dd');
    let qstCorrect = this.score.questions.length + '/'  + this.test.questions.length;
    let fondamental = this.correctFondamentalQuestions.length + '/' + this.fondamentalQuestions.length
      + '(' +this.percentPipe.transform(this.correctFondamentalQuestions.length / this.fondamentalQuestions.length) + ')';
    let timeMsg = this.formatTime.transform(this.score.testTime) + '/' + this.formatTime.transform(this.test.timeSecond) ;

    let html = this.htmlRepport(this.test.testLevel, fullName,this.auth.userAuthenticated.username,
      date, qstCorrect, fondamental, this.score.validate, timeMsg);

    let repport = document.getElementById("htmlRepport");
    await doc.html( html);

    let themesGraph = document.getElementById("themesGraph");
    let scoreChart = document.getElementById("scoreChart");
    let contentDataURL;
    let scoreChartImg;
    await html2canvas(themesGraph).then(canvas => {
       contentDataURL = canvas.toDataURL('image/png', 1.0)
    });
    await html2canvas(scoreChart).then(canvas => {
      scoreChartImg = canvas.toDataURL('image/png', 1.0)
    });

    await doc.addImage(contentDataURL, 'PNG', 10, 400, 500, 150);
    await doc.addImage(scoreChartImg, 'PNG', 330, 240, 250, 140);
    doc.save("rapport.pdf");



    /*
     doc.html( repport, {
      callback: function (doc) {
        doc.save("rapport.pdf");
      }
    });
     */

  }
  public htmlRepport(level: string, fullName:string,
                     email:string, date, qstCorrect: string, fondamental:string,
                     validate: boolean, timeMsg:string){

    let validateTitel, recomendationHtml;
    if (validate) {
      validateTitel = ' <h1 class="text-center fw-bold pb-2" style="color: green; border-bottom: 1px solid #DEDFE4;">Validee</h1>\n';
    } else {
      validateTitel = ' <h1 class="text-center fw-bold pb-2" style="color: red; border-bottom: 1px solid #DEDFE4;">Non Validee</h1>\n';
    }

    if (this.score.score < 100){
      let themes = '';
      this.getKeysFromMap().forEach(d => {
        themes = themes+  '<div class="col-6"> <li style="font-size: 12px;" >'+d+'</li></div>';
      })
      let d = '<div>\n' +
        '                  <h2 class="text-center colorPrimary">Recommendations</h2>\n' +
        '                  <p>Pour bien amelioré vos compétances, on vous conseille de revoire\n' +
        '                    les thémes suivant:</p>\n' +
        '                  <ul class="ml-2">\n' +
        '                    <div class="row justify-content-between">\n' +
        themes +
        '                    </div>\n' +
        '                  </ul>\n' +
        '                </div>\n' ;
      recomendationHtml = d;
    }
    else {
      recomendationHtml =     ' <div>\n' +
        '                  <h2 class="font-weight-bold">Félicitation vous avez bien validé le niveau d\'habilitation</h2>\n' +
        '                  <hr/>\n' +
        '                </div>\n' ;
    }

    let html = ' <div id="htmlRepport" style="border: 1px solid white;height: 830px; width: 595px;position: relative;">\n' +
      '      <div class="" style="margin-left: 10px;">\n' +
      '        <div class="row w-100 m-auto"  style="position: absolute; top: 0;border-bottom: 5px solid #DEDFE4;">\n' +
      '          <div class="col-4">\n' +
      '            <a class="float-start mt-1 pb-2 "><img src="assets/images/logoo.png" style="height: 30px; width: 150px;" ></a>\n' +
      '          </div>\n' +
      '          <div class="col-4 justify-content-center">\n' +
      '            <span class="h3 mt-3 ms-3 w-100 fw-bold text-uppercase text-center" id="title">Rapport</span>\n' +
      '          </div>\n' +
      '          <div class="col-4" >\n' +
      '            <span class="h3 mt-2 float-end" style="font-family: Verdana;font-size: 20px;">'+fullName+'</span>\n' +
      '          </div>\n' +
      '        </div>\n' +
      '\n' +
      '\n' +
      '        <div class="row w-100"  style="margin-top: 70px;">\n' +
      '          <div class="row m-auto w-50" >\n' +
                validateTitel +
      '          </div>\n' +
      '          <div class="row w-100">\n' +
      '            <div class="col-6">\n' +
      '              <p class="mt-2"><b>EMAIL: '+ email +'</b></p>\n' +
      '              <p><b>DATE: 12/07/2021</b></p>\n' +
      '            </div>\n' +
      '            <div class="col-6">\n' +
      '              <div class="float-end  w-100 shadow border p-2 mb-3" style="border-radius: 12px;">\n' +
      '                <h5 class="text-center">Votre niveau d\'habilitation</h5>\n' +
      '                <h3 class="text-center fw-bold colorPrimary">'+level+'</h3>\n' +
      '              </div>\n' +
      '            </div>\n' +
      '          </div>\n' +
      '          <div class="row w-100 h-25">\n' +
      '            <div class="col-7">\n' +
      '              <div style="border: 1px solid #FFA914;" class="p-1 rounded-pill   mt-3 d-flex justify-content-between">\n' +
      '                <span class="scoreInfoTextColor">Temps Passer</span> <span><b>'+timeMsg+'</b></span>\n' +
      '              </div>\n' +
      '              <div  style="border: 1px solid #FFA914;" class="p-1 rounded-pill  mt-3 d-flex justify-content-between">\n' +
      '                <span class="scoreInfoTextColor">Nombre des questions correctes</span>\n' +
      '                <span><b>'+qstCorrect+'</b></span>\n' +
      '              </div>\n' +
      '              <div  style="border: 1px solid #FFA914;" class="p-1 rounded-pill  mt-3 d-flex justify-content-between">\n' +
      '                <span class="scoreInfoTextColor">Questions fondamental correctes </span>\n' +
      '                <span>\n' +
      '              <b>'+fondamental+'</b>\n' +
      '            </span>\n' +
      '              </div>\n' +
      '            </div>\n' +
      '          </div>\n' +
      '        <div class="row w-100 m-auto"  style="position: absolute; bottom: 0;">\n' +
      '          <div class="row mb-3" >\n' +
      '            <div class="card" style=" margin-left: 5px;  background-color: #EDEDED;  margin-top: 30px;"  >\n' +
      '              <div class="ms-2 ">\n' +
                      recomendationHtml +
      '              </div>\n' +
      '            </div>\n' +
      '          </div>\n' +
      '\n' +
      '          <p class="justify-content-center" style="font-size: 15px;"><b>NB.</b> Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do\n' +
      '            eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse</p>\n' +
      '        </div>\n' +
      '      </div>\n' +
      '  </div>\n' +
      '</div>'

    return html;
  }


  public downloadAttestation():void {
    var imgDataAttestation;
    if (this.score.validate){
      imgDataAttestation = ConstantBase64.imageAttestaion;
    } else {
      imgDataAttestation = ConstantBase64.imageAttestaion;
    }
    let fullName = this.score.appUser.firstName + ' ' + this.score.appUser.lastName;
    let level = this.test.testLevel;
    let date = this.datepipe.transform(this.score.date, 'yyyy-MM-dd');

    var doc = new jsPDF("l", "px", "a4");
    var width = doc.internal.pageSize.getWidth();
    var height = doc.internal.pageSize.getHeight();
    doc.addImage(imgDataAttestation, 'PNG', 0, 0, width, height);

    doc.save("Attestation.pdf")
  }
}

