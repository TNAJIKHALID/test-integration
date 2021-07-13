import { Injectable } from '@angular/core';
import {DatePipe} from "@angular/common";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

@Injectable({
  providedIn: 'root'
})
export class ApprenantLibreService {

  constructor(public datepipe: DatePipe) { }


  public htmlRepport(level:string,name:string,email:string,date:any,authorazedTasks:Array<string>,unAuthorazedTasks:Array<string>):string{
    date =this.datepipe.transform(date, 'dd/MM/yyyy');
    let trAuthorazedTasks : string = '';
    authorazedTasks.forEach( a => {
      trAuthorazedTasks = trAuthorazedTasks + '<tr><td class="text-center">'+ a + '</td></tr>'
    })
    let trUnAuthorazedTasks : string = '';
    unAuthorazedTasks.forEach( a => {
      trUnAuthorazedTasks = trUnAuthorazedTasks + '<tr><td class="text-center">'+ a + '</td></tr>'
    })

    let html = '<div id="htmlData" #htmlData style="background-image: url(bck.png);background-size: cover; height: 842px; width: 595px;">\n' +
      '    <div class="ps-3 pe-3 pt-5" style="border: 2px solid black;height: 842px; width: 595px;">\n' +
      '\n' +
      '      <div class="row mt-5">\n' +
      '        <h3 class="text-center fw-bold">RAPPORT DE TEST DE POSITIONNEMENT</h3>\n' +
      '      </div>\n' +
      '\n' +
      '      <div class="row mt-2" >\n' +
      '        <div class="col-6" style="">\n' +
      '          <h5>NOM: <b>' + name + '</b></h5>\n' +
      '          <h5>E-MAIL:<b> ' + email + '</b></h5>\n' +
      '        </div>\n' +
      '        <div class="col-6" style="">\n' +
      '          <h5>NIVEAU D\'HABILITATION: <b>' + level + '</b></h5>\n' +
      '          <h5>DATE: <b>' + date + '</b></h5>\n' +
      '        </div>\n' +
      '      </div>\n' +
      '      <div class="row w-50 m-auto mt-1">\n' +
      '        <h3 class="text-center fw-bold" ' +
      'style="background-color: orangered; border-radius: 12px;color: white;">'+level+'</h3>\n' +
      '      </div>\n' +
      '      <div class="row mt-5" >\n' +
      '        <div class="col-6">\n' +
      '          <table class="table table-striped">\n' +
      '            <thead class="" style="background-color: forestgreen ; color:   aliceblue">\n' +
      '            <tr>\n' +
      '              <th scope="col" class="text-center" style="font-size: 10px">TÂCHES NON AUTORISÉES</th>\n' +
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
      '              <th scope="col" class="text-center" style="font-size: 10px">TÂCHES AUTORISÉES</th>\n' +
      '            </tr>\n' +
      '            </thead>\n' +
      '            <tbody>\n' +
      trUnAuthorazedTasks +
      '            </tbody>\n' +
      '          </table>\n' +
      '\n' +
      '        </div>\n' +
      '      </div>\n' +

      '\n' +
      '\n' +
      '    </div>\n' +
      '  </div>\n';
    return html;
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


}
