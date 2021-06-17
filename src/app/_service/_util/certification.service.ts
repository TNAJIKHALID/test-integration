import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import { DatePipe } from '@angular/common';
import html2canvas from "html2canvas";

@Injectable({
  providedIn: 'root'
})
export class CertificationService {

  constructor(public datepipe: DatePipe) { }


  public downloadAvis(firstName: string, lastName: string,niveau: string, isFavorable: boolean, date):void {
    let doc = new jsPDF('l','pt', 'a4');
    doc.html(this.html(firstName, lastName,niveau, isFavorable, date),{
      callback: function (doc) {
        doc.save("Avis-Habilitation.pdf");
      }
    });
  }

  public downloadResultatsPositionTest(firstName: string, lastName: string,niveau: string){
    let doc = new jsPDF('p','pt', 'a4');
    doc.html(this.resultatsPositionTest(firstName, lastName,niveau),{
      callback: function (doc) {
        doc.save("test de positionnement.pdf");
      }
    });
  }
  public resultatsPositionTest(firstName: string, lastName: string,niveau: string){
    return '<div id="htmlData" #htmlData class="border-success" style="width: 595px;height: 842px" >\n' +
      '  <h1>Resultas du test de positionnement</h1>\n' +
      '  <h1>Niveau est : '+niveau+'</h1>\n' +
      '</div>';
  }


  public html(firstName: string, lastName: string,niveau: string, isFavorable: boolean, date){
    date =this.datepipe.transform(date, 'yyyy-MM-dd');
    return '<div id="htmlData2" #htmlData2 class="border-success" style="width: 842px;height: 595px" >\n' +
      '  <main class="container">\n' +
      '    <div class="row w-100 border-bottom" style="height: 40px;">\n' +
      '      <div class="col-2">\n' +
      '        <img src="assets/logoAvis.png"  style="height: 38px;" >\n' +
      '      </div>\n' +
      '      <div class="col-10"><span class="float-right font-weight-bold">CONSEIL&nbsp;–&nbsp;FORMATION&nbsp;–&nbsp;AUDIT&nbsp;–&nbsp;COACHING</span></div>\n' +
      '    </div>\n' +
      '    <h1 class="text-center font-weight-bold mb-2">Avis d\'habilitation</h1>\n' +
      '    <p class="text-center align-content-center">Suite à votre demande d’habilitation, nous vous informons que:</p>\n' +
      '    <p class="text-center align-content-center mt-3 text-primary">Monsieur <b>' +
                ''+firstName + ' ' + lastName + '</b></p>\n' +
      '    <div class="w-75 m-auto"><p class="text-center align-content-center mt-2" style="line-height: 1rem;">A suivi la formation à la prévention du risque électrique\n' +
      '      <b>'+niveau+'&nbsp;</b>\n' +
      '      et a passé les tests de connaissances théoriques et pratiques pour\n' +
      '      obtenir l’habilitation électrique correspondante.</p>\n' +
      '    </div>\n' +
      '    <p class="text-center align-content-center mt-3">Le résultat des tests passés sont:</p>\n' +
      '    <div class="m-auto w-75">\n' +
      '      <table class="table table-bordered">\n' +
      '        <thead>\n' +
      '        <tr>\n' +
      '          <th>Niveau d\'habilitation</th>\n' +
      '          <th>Favorable</th>\n' +
      '          <th>Défavorable</th>\n' +
      '        </tr>\n' +
      '        </thead>\n' +
      '        <tbody>\n' +
      '        <tr>\n' +
      '          <td><b>'+niveau+'</b></td>\n' +
      '          <td class="justify-content-center text-center"><label *ngIf="isFavorable" class="checkbox-inline text-center">\n' +
      '            <input class="m-auto" type="checkbox" checked></label></td>\n' +
      '          <td class="justify-content-center text-center">\n' +
      '\n' +
      '          </td>\n' +
      '        </tr>\n' +
      '        </tbody>\n' +
      '      </table>\n' +
      '    </div>\n' +
      '    <p class="text-center align-content-center mt-3 text-primary" style="line-height: 1rem;">On vous suggère donc après votre validation de son aptitude physique, de son comportement et de ses prérequis techniques de lui délivrer le titre d’habilitation correspondant.</p>\n' +
      '    <div class="row mt-3 m-auto " style="height: 140px; width: 95%; " >\n' +
      '      <div class="col-4">\n' +
      '        <span><b>HAMOUMI Karim</b><br/>Directeur&nbsp;Général&nbsp;ELETIS&nbsp;Consulting</span>\n' +
      '      </div>\n' +
      '      <div class="col-8">\n' +
      '        <span class="float-right">Delivre le: '+date+'</span>\n' +
      '      </div>\n' +
      '    </div>\n' +
      '    <div class="row border-top w-100 mb-0" style="height: 20px;">\n' +
      '      <p class="m-auto text-center align-content-center font-italic" style="line-height: 1rem;font-size: xx-small;" >\n' +
      '        20, Rue Yatrib   2ème étage   Appt. N°3  –  Quartier Mers Sultan  –  20140 Casablanca (MAROC) Tél.: 05 22 48 22 33 / 88 Fax: 05 22 48 22 66<br/>\n' +
      '        T.P: 32282957          I.F: 18778629          R.C: 343509          CNSS: 4897130          ICE: 001583841000004\n' +
      '      </p>\n' +
      '    </div>\n' +
      '  </main>\n' +
      '</div>'
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

  let html = '<div id="htmlData" #htmlData style="background-image: url(bck.png);background-size: cover; height: 842px; width: 595px;">\n' +
      '    <div class="ps-3 pe-3 pt-5" style="border: 2px solid black;height: 842px; width: 595px;">\n' +
      '\n' +
      '      <div class="row mt-5">\n' +
      '        <h3 class="text-center fw-bold">TEST DE POSITIONNEMENT</h3>\n' +
      '      </div>\n' +
      '\n' +
      '      <div class="row mt-2" >\n' +
      '        <div class="col-md-4" style="position: relative;left: 60px">\n' +
      '          <h5>NOM: ' + name + '</h5>\n' +
      '          <h5>E-MAIL: ' + email + '</h5>\n' +
      '        </div>\n' +
      '        <div class="col-md-4" style="position: relative;left: 98px">\n' +
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
       trAuthorazedTasks

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
      unAuthorazedTasks
      '            </tbody>\n' +
      '          </table>\n' +
      '\n' +
      '        </div>\n' +
      '      </div>\n' +
      '      <div class="row w-50 m-auto mt-5">\n' +
      '        <h3 class="text-center fw-bold" style="background-color: orangered; border-radius: 12px;color: white;">B0 Charge de Chantier</h3>\n' +
      '      </div>\n' +
      '\n' +
      '\n' +
      '    </div>\n' +
      '  </div>\n';
   return html;
  }

  public pdfPositionTest(level:string,name:string,email:string,date:any,authorazedTasks:Array<string>,unAuthorazedTasks:Array<string>){
    //let data = document.getElementById("htmlData");
    var div = document.createElement('div');
    div.innerHTML = this.htmlRepport(level,name,email,date,authorazedTasks,unAuthorazedTasks).trim();
    document.body.appendChild(div);
    let data = document.getElementById("htmlData2");
    html2canvas(data).then(canvas => {
      const contentDataURL = canvas.toDataURL('image/jpeg', 1.0)
      console.log(contentDataURL);
      let pdf = new jsPDF('p', 'mm', 'a4');//Generates PDF in landscape mode
      var width = pdf.internal.pageSize.getWidth();
      var height = pdf.internal.pageSize.getHeight();
      pdf.addImage(contentDataURL, 'PNG', 0, 0, width, height);
      pdf.save('test de positionnement.pdf');
    });
  }


}
