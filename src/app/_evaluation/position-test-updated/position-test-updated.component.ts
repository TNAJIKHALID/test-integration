import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {DataService} from '../../_service/_util/data.service';
import {ApprenantLibre} from "../../_model/user";
import * as events from "events";
import {CertificationService} from "../../_service/_util/certification.service";

@Component({
  selector: 'app-position-test-updated',
  templateUrl: './position-test-updated.component.html',
  styleUrls: ['./position-test-updated.component.css']
})
export class PositionTestUpdatedComponent implements OnInit {
  @Input() positionTestResult:string;
  currentIndex: string;
  onModeTache: boolean;
  onModeMetier: boolean;
  isLevel: boolean = false;
  isNoHabilitation: boolean = false;
  startOUINON: boolean = false;
  noLevel: boolean = false;
  previousIsTach: boolean = false;
  startMetier: boolean = false;

  diapos:Array<PositionTest>;
  metier : Metier;
  authorization:Array<AuthorizationLevels> ;
  authorizationMap:  Map<string,AuthorizationLevels> = new Map<string, AuthorizationLevels>();


  data: Map<string,PositionTest> = new Map<string, PositionTest>();
  path: Array<string> = new Array<string>();


  category:Category;
  task:Task;

  @Output() levelEmetter = new EventEmitter<string>();

  constructor(public dataService:DataService,public certificationService:CertificationService) { }

  ngOnInit(): void {
    let dd;
    this.dataService.getResource('/getAuthos').subscribe(d=>{
      dd = d;
      this.authorization = dd;
      this.authorization.forEach(a=>{
        let ss : string = a.level;
        this.authorizationMap.set(ss.toLowerCase().trim(),a);
      })
    },error => console.log(error))


    if (this.positionTestResult != null
      && this.positionTestResult != undefined &&
         this.positionTestResult != "NAN" ){
      this.isLevel = true;
      this.currentIndex = this.positionTestResult;
    }
    else {
      this.currentIndex = 'Dx';let dd;
      this.dataService.getResource('/getDiapos').subscribe(d=>{
        dd = d;
        this.diapos = dd;
        console.log(this.diapos);
        this.diapos.forEach(d=>{
          this.data.set(d.index,d);
        })
      },error => console.log(error))

      this.dataService.getResource('/getMetier').subscribe(d=>{
        dd = d;
        this.metier = dd;
        console.log(this.metier)
      },error => console.log(error))
    }

  }

  setNextIndex(nextIndex: string) {
    console.log(nextIndex)
    this.path.push(nextIndex);
    if (nextIndex.startsWith('D')) {
      this.currentIndex = nextIndex;
    } else if(nextIndex.toLowerCase().startsWith('x')){
      this.noLevel = true;
      this.startOUINON = false;
    } else if(nextIndex.toLowerCase().startsWith('y') || nextIndex.toLowerCase().includes('sensibilisation') ){
      this.isNoHabilitation = true;
      this.startOUINON = false;
    } else {
      this.isLevel = true;
      this.startOUINON = false;
      this.startMetier = false;
      this.currentIndex = nextIndex;
    }
  }

  setMode(isTach:boolean) {
    if (isTach){
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
    this.onModeTache=false;
    this.onModeMetier=false;
    this.isLevel = false;
    this.isNoHabilitation = false;
    this.startOUINON = false;
    this.noLevel = false;
    this.previousIsTach = false;
    this.startMetier = false;
    this.currentIndex = 'Dx';
    let dd;
    if(this.diapos == null){
      this.dataService.getResource('/getDiapos').subscribe(d=>{
        dd = d;
        this.diapos = dd;
        console.log(this.diapos);
        this.diapos.forEach(d=>{
          this.data.set(d.index,d);
        })
      },error => console.log(error))
    }

    if(this.metier == null){
      this.dataService.getResource('/getMetier').subscribe(d=>{
        dd = d;
        this.metier = dd;
        console.log(this.metier)
      },error => console.log(error))
    }
  }

  onRetour() {
    console.log(this.path)
    console.log(this.path.length)
    if (this.path.length >= 2) {
      let nextIndex = this.path[this.path.length-2];
      this.currentIndex = nextIndex;
      this.path.splice(-1,1);
    }
  }

  getNewCat(event: any) {
    this.metier.categories.forEach(c=> {
      if(c.categoryName == event.target.value) this.category = c;
    })
    console.log(this.category)
  }

  onConfirm(){
    this.levelEmetter.emit(this.currentIndex);
  }

  getNewTsk(event: any) {
    this.category.tasks.forEach(t => {
        if(t.taskName == event.target.value) this.task = t;
      }
    )
   if(this.task.level.startsWith('D')){
     this.onModeMetier = false;
     this.startMetier = false;
     this.onModeTache = true;
     this.startOUINON = true;
     this.setNextIndex(this.task.level);
   }else{
     this.onModeMetier = false;
     this.startMetier = false;
     this.setNextIndex(this.task.level);
   }

  }

  onDownloadRepport() {
    this.certificationService.downloadResultatsPositionTest("khalid","ATNAJI",this.currentIndex)
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
