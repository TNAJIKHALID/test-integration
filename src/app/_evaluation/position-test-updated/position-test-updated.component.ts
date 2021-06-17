import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {DataService} from '../../_service/_util/data.service';
import {ApprenantLibre} from "../../_model/user";
import * as events from "events";
import {CertificationService} from "../../_service/_util/certification.service";
import {JwtAuthenticationService} from "../../_service/_authentication/jwt-authentication.service";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'app-position-test-updated',
  templateUrl: './position-test-updated.component.html',
  styleUrls: ['./position-test-updated.component.css']
})
export class PositionTestUpdatedComponent implements OnInit {
  @Input() positionTestResult: string;
  currentIndex: string;
  onModeTache: boolean;
  onModeMetier: boolean;
  isLevel: boolean = false;
  isNoHabilitation: boolean = false;
  startOUINON: boolean = false;
  noLevel: boolean = false;
  previousIsTach: boolean = false;
  startMetier: boolean = false;

  diapos: Array<PositionTest>;
  metier: Metier;
  authorization: Array<AuthorizationLevels>;
  authorizationMap: Map<string, AuthorizationLevels> = new Map<string, AuthorizationLevels>();


  data: Map<string, PositionTest> = new Map<string, PositionTest>();
  path: Array<string> = new Array<string>();


  category: Category;
  task: Task;

  @Output() levelEmetter = new EventEmitter<string>();

  constructor(public dataService: DataService, public jwtService: JwtAuthenticationService,public datepipe: DatePipe,
              public certificationService: CertificationService) {
  }

  ngOnInit(): void {
    let dd;
    this.dataService.getResource('/getAuthos').subscribe(d => {
      dd = d;
      this.authorization = dd;
      this.authorization.forEach(a => {
        let ss: string = a.level;
        this.authorizationMap.set(ss.toLowerCase().trim(), a);
      })
    }, error => console.log(error))


    if (this.positionTestResult != null
      && this.positionTestResult != undefined &&
      this.positionTestResult != "NAN") {
      this.isLevel = true;
      this.currentIndex = this.positionTestResult;
    } else {
      this.currentIndex = 'Dx';
      let dd;
      this.dataService.getResource('/getDiapos').subscribe(d => {
        dd = d;
        this.diapos = dd;
        console.log(this.diapos);
        this.diapos.forEach(d => {
          this.data.set(d.index, d);
        })
      }, error => console.log(error))

      this.dataService.getResource('/getMetier').subscribe(d => {
        dd = d;
        this.metier = dd;
        console.log(this.metier)
      }, error => console.log(error))
    }

  }

  setNextIndex(nextIndex: string) {
    console.log(nextIndex)
    this.path.push(nextIndex);
    if (nextIndex.startsWith('D')) {
      this.currentIndex = nextIndex;
    } else if (nextIndex.toLowerCase().startsWith('x')) {
      this.noLevel = true;
      this.startOUINON = false;
    } else if (nextIndex.toLowerCase().startsWith('y') || nextIndex.toLowerCase().includes('sensibilisation')) {
      this.isNoHabilitation = true;
      this.startOUINON = false;
    } else {
      this.isLevel = true;
      this.startOUINON = false;
      this.startMetier = false;
      this.currentIndex = nextIndex;
    }
  }

  setMode(isTach: boolean) {
    if (isTach) {
      this.setNextIndex('DElec');
      this.onModeTache = true;
      this.previousIsTach = true;
      this.onModeMetier = false;
    } else { //metier
      this.setNextIndex('DMetier');
      this.startMetier = true;
      this.onModeTache = false;
      this.onModeMetier = true;
    }
  }

  setElectrique(nextIndex: string) {
    if (this.previousIsTach) this.startOUINON = true;
    else this.startMetier = true;
    console.log(nextIndex);
    this.setNextIndex(nextIndex)
  }

  onRestart() {
    this.onModeTache = false;
    this.onModeMetier = false;
    this.isLevel = false;
    this.isNoHabilitation = false;
    this.startOUINON = false;
    this.noLevel = false;
    this.previousIsTach = false;
    this.startMetier = false;
    this.currentIndex = 'Dx';
    let dd;
    if (this.diapos == null) {
      this.dataService.getResource('/getDiapos').subscribe(d => {
        dd = d;
        this.diapos = dd;
        console.log(this.diapos);
        this.diapos.forEach(d => {
          this.data.set(d.index, d);
        })
      }, error => console.log(error))
    }

    if (this.metier == null) {
      this.dataService.getResource('/getMetier').subscribe(d => {
        dd = d;
        this.metier = dd;
        console.log(this.metier)
      }, error => console.log(error))
    }
  }

  onRetour() {
    console.log(this.path)
    console.log(this.path.length)
    if (this.path.length >= 2) {
      let nextIndex = this.path[this.path.length - 2];
      this.currentIndex = nextIndex;
      this.path.splice(-1, 1);
    }
  }

  getNewCat(event: any) {
    this.metier.categories.forEach(c => {
      if (c.categoryName == event.target.value) this.category = c;
    })
    console.log(this.category)
  }

  onConfirm() {
    this.levelEmetter.emit(this.currentIndex);
  }

  getNewTsk(event: any) {
    this.category.tasks.forEach(t => {
        if (t.taskName == event.target.value) this.task = t;
      }
    )
    if (this.task.level.startsWith('D')) {
      this.onModeMetier = false;
      this.startMetier = false;
      this.onModeTache = true;
      this.startOUINON = true;
      this.setNextIndex(this.task.level);
    } else {
      this.onModeMetier = false;
      this.startMetier = false;
      this.setNextIndex(this.task.level);
    }

  }

  onDownloadRepport() {
    //this.certificationService.downloadResultatsPositionTest("khalid", "ATNAJI", this.currentIndex)
    let level = this.currentIndex;
    let name = this.jwtService.userAuthenticated.firstName + ' ' + this.jwtService.userAuthenticated.lastName;
    let email = this.jwtService.userAuthenticated.username;
    let date = new Date();
    let authorazedTasks = this.authorizationMap.get(this.currentIndex.toLowerCase().trim()).authorizedTasks;
    let unAuthorazedTaks = this.authorizationMap.get(this.currentIndex.toLowerCase().trim()).unAuthorizedTasks;
    this.pdfPositionTest(level,name,email,date,authorazedTasks,unAuthorazedTaks);
  }

  public pdfPositionTest(level:string,name:string,email:string,date:any,authorazedTasks:Array<string>,unAuthorazedTasks:Array<string>){

    var div = document.createElement('div');
    div.innerHTML = this.htmlRepport(level,name,email,date,authorazedTasks,unAuthorazedTasks).trim();
    document.body.appendChild(div);
    let data = document.getElementById("htmlData");
    html2canvas(data).then(canvas => {
      const contentDataURL = canvas.toDataURL('image/jpeg', 4.0)
      console.log(contentDataURL);
      let pdf = new jsPDF('p', 'mm', 'a4');//Generates PDF in landscape mode
      var width = pdf.internal.pageSize.getWidth();
      var height = pdf.internal.pageSize.getHeight();
      pdf.addImage(contentDataURL, 'PNG', 0, 0, width, height);
      pdf.save('test de positionnement.pdf');
    });
    document.getElementById("htmlData").remove();

  }


  public htmlRepport(level:string,name:string,email:string,date:any,authorazedTasks:Array<string>,unAuthorazedTasks:Array<string>):string{
    date =this.datepipe.transform(date, 'yyyy-MM-dd');
    let trAuthorazedTasks : string = '';
    authorazedTasks.forEach( a => {
      trAuthorazedTasks = trAuthorazedTasks + '<tr><td>'+ a + '</td></tr>'
    })
    let trUnAuthorazedTasks : string = '';
    unAuthorazedTasks.forEach( a => {
      trUnAuthorazedTasks = trUnAuthorazedTasks + '<tr><td>'+ a + '</td></tr>'
    })
    console.log(trAuthorazedTasks)
    console.log(trUnAuthorazedTasks)
    let html = '<div id="htmlData" #htmlData style="background-image: url(bck.png);background-size: cover; height: 842px; width: 595px;">\n' +
      '    <div class="ps-3 pe-3 pt-5" style="border: 2px solid black;height: 842px; width: 595px;">\n' +
      '\n' +
      '      <div class="row mt-5">\n' +
      '        <h3 class="text-center fw-bold">TEST DE POSITIONNEMENT</h3>\n' +
      '      </div>\n' +
      '\n' +
      '      <div class="row mt-2" >\n' +
      '        <div class="col-6" style="">\n' +
      '          <h5>NOM: ' + name + '</h5>\n' +
      '          <h5>E-MAIL: ' + email + '</h5>\n' +
      '        </div>\n' +
      '        <div class="col-6" style="">\n' +
      '          <h5>NIVEAU D\'HABILITATION: ' + level + '</h5>\n' +
      '          <h5>DATE: ' + date + '</h5>\n' +
      '        </div>\n' +
      '      </div>\n' +
      '      <div class="row mt-5" >\n' +
      '        <div class="col-6">\n' +
      '          <table class="table table-striped">\n' +
      '            <thead class="" style="background-color: forestgreen ; color:   aliceblue">\n' +
      '            <tr>\n' +
      '              <th scope="col" style="font-size: 10px">VOS AUTHORISATION</th>\n' +
      '            </tr>\n' +
      '            </thead>\n' +
      '            <tbody>\n' +
            trAuthorazedTasks +
    '            </tbody>\n' +
    '          </table>\n' +
    '        </div>\n' +
    '        <div class="col-md-6">\n' +
    '          <table class="table table-striped">\n' +
    '            <thead class="" style="background-color: red ; color: aliceblue">\n' +
    '            <tr>\n' +
    '              <th scope="col" style="font-size: 10px">VOS AUTHORISATION</th>\n' +
    '            </tr>\n' +
    '            </thead>\n' +
    '            <tbody>\n' +
    trUnAuthorazedTasks +
    '            </tbody>\n' +
    '          </table>\n' +
    '\n' +
    '        </div>\n' +
    '      </div>\n' +
    '      <div class="row w-50 m-auto mt-1">\n' +
    '        <h3 class="text-center fw-bold" style="background-color: orangered; border-radius: 12px;color: white;">'+level+'</h3>\n' +
    '      </div>\n' +
    '\n' +
    '\n' +
    '    </div>\n' +
    '  </div>\n';
    return html;
  }

}


class PositionTest {
  index;
  question;
  text;
  consigne;
  noteBien;
  buttons :  Array<Button>;
}
class Button {
  button: string;
  nextIndex: string;
}

class Metier {
   categories : Array<Category> = new Array<Category>();
}
class Category{
   categoryName:string;
   tasks : Array<Task> = new Array<Task>();
}
class Task {
   taskName:string;
   isSimple:boolean;
   level:string;
}
class AuthorizationLevels {
   level;
   allTasks: Array<string> = new Array<string>();
   authorizedTasks : Array<string> = new Array<string>();
   unAuthorizedTasks  : Array<string> = new Array<string>();
}
