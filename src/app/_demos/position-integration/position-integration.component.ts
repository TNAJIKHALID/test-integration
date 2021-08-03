import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import jsPDF from "jspdf";
import {HttpClient} from "@angular/common/http";
import {ConstantBase64} from "../../util/imagesBase64";
import html2canvas from 'html2canvas';
import {DatePipe} from "@angular/common";

@Component({
  selector: 'app-position-integration',
  templateUrl: './position-integration.component.html',
  styleUrls: ['./position-integration.component.css']
})
export class PositionIntegrationComponent implements OnInit {
  date: any;

  constructor(private http: HttpClient,public datepipe: DatePipe) {}

  ngOnInit(): void {
     this.date = new Date();
    this.date = this.datepipe.transform(this.date, 'dd/MM/yyyy');


  }

  public pdf(){
    //let data = document.getElementById("htmlData");
    var div = document.createElement('div');
    div.innerHTML = this.html.trim();
    document.body.appendChild(div);
    let data = document.getElementById("htmlData");

    html2canvas(data).then(canvas => {
      const contentDataURL = canvas.toDataURL('image/jpeg', 1.0)
      console.log(contentDataURL);
      let pdf = new jsPDF('p', 'mm', 'a4');//Generates PDF in landscape mode
      var width = pdf.internal.pageSize.getWidth();
      var height = pdf.internal.pageSize.getHeight();
      pdf.addImage(contentDataURL, 'PNG', 0, 0, width, height);
      pdf.save('Filename.pdf');
    });

  }

  public downloadPDF():void {
    var imgData = ConstantBase64.cover;
    var doc = new jsPDF("p", "px", "a4");
    var width = doc.internal.pageSize.getWidth();
    var height = doc.internal.pageSize.getHeight();
    doc.addImage(imgData, 'PNG', 0, 0, width, height);
    //doc.text('TEST DE POSITIONNEMENT',width/4, height/10);
    let string = '    <div class="mt-5 ms-2 me-2" style="border: 2px solid black;height: 562px; width: 425px;">\n' +
      '<div class="row">\n' +
      '        <h3 class="text-center">TEST DE POSITIONNEMENT</h3>\n' +
      '      </div>\n' +
      '\n' +
      '      <div class="row mt-2" >\n' +
      '        <div class="col-md-4" style="position: relative;left: 60px">\n' +
      '          <h5>NOM:</h5>\n' +
      '          <h5>E-MAIL:</h5>\n' +
      '        </div>\n' +
      '        <div class="col-md-4" style="position: relative;left: 98px">\n' +
      '          <h5>NIVEAU D\'HABILITATION:</h5>\n' +
      '          <h5>DATE:</h5>\n' +
      '        </div>\n' +
      '      </div>\n' +
      '      <div class="row mt-2" >\n' +
      '        <div class="col-6">\n' +
      '          <table class="table table-striped">\n' +
      '            <thead class="" style="background-color: forestgreen ; color:   aliceblue">\n' +
      '            <tr>\n' +
      '              <th scope="col"></th>\n' +
      '              <th scope="col" style="font-size: 10px">VOS AUTHORISATION</th>\n' +
      '            </tr>\n' +
      '            </thead>\n' +
      '            <tbody>\n' +
      '            <tr>\n' +
      '              <th scope="row">1</th>\n' +
      '              <td>Mark</td>\n' +
      '            </tr>\n' +
      '            <tr>\n' +
      '              <th scope="row">2</th>\n' +
      '              <td>Voisinage</td>\n' +
      '            </tr>\n' +
      '\n' +
      '            <tr>\n' +
      '              <th scope="row">3</th>\n' +
      '              <td>Voisinage</td>\n' +
      '            </tr>\n' +
      '\n' +
      '            <tr>\n' +
      '              <th scope="row">4</th>\n' +
      '              <td>Voisinage</td>\n' +
      '            </tr>\n' +
      '            </tbody>\n' +
      '          </table>\n' +
      '        </div>\n' +
      '        <div class="col-md-6">\n' +
      '          <table class="table table-striped">\n' +
      '            <thead class="" style="background-color: red ; color: aliceblue">\n' +
      '            <tr>\n' +
      '              <th scope="col"></th>\n' +
      '              <th scope="col" style="font-size: 10px">VOS AUTHORISATION</th>\n' +
      '\n' +
      '            </tr>\n' +
      '            </thead>\n' +
      '            <tbody>\n' +
      '            <tr>\n' +
      '              <th scope="row">1</th>\n' +
      '              <td>Mark</td>\n' +
      '\n' +
      '            </tr>\n' +
      '            <tr>\n' +
      '              <th scope="row">2</th>\n' +
      '              <td>Voisinage</td>\n' +
      '            </tr>\n' +
      '            <tr>\n' +
      '              <th scope="row">3</th>\n' +
      '              <td>Voisinage</td>\n' +
      '            </tr>\n' +
      '\n' +
      '            <tr>\n' +
      '              <th scope="row">4</th>\n' +
      '              <td>Voisinage</td>\n' +
      '            </tr>\n' +
      '\n' +
      '            <tr>\n' +
      '              <th scope="row">5</th>\n' +
      '              <td>Voisinage</td>\n' +
      '            </tr>\n' +
      '\n' +
      '\n' +
      '\n' +
      '            </tbody>\n' +
      '          </table>\n' +
      '\n' +
      '        </div>\n' +
      '      </div>\n' +
      '      <div class="row w-50 m-auto mt-2">\n' +
      '        <h3 class="text-center fw-bold" style="background-color: orangered; border-radius: 12px;color: white;">B0 Charge de Chantier</h3>\n' +
      '      </div>'
      ' </div>'
    doc.html( string, {
      callback: function (doc) {
        doc.save("tt.pdf");
      }
    });
  }

  public downloadAvis():void {
    var imgData;
    if (true){
      imgData = ConstantBase64.imageAvisFavorable;
    } else {
      imgData = ConstantBase64.imageAvisDeFavorable;
    }
    var doc = new jsPDF("p", "px", "a4");
    var width = doc.internal.pageSize.getWidth();
    var height = doc.internal.pageSize.getHeight();
    doc.addImage(imgData, 'PNG', 0, 0, width, height);
    doc.setTextColor(0,0,1)
    doc.text('B0 Charge de Chantier', 40, 325);
    doc.text('20/06/2021', 55, 515);
    doc.text('20/06/2021', 247, 514);
    doc.setFontSize(22)
    doc.setTextColor(255,69,1)
    doc.text('khalid TNAJI', 180, 155);
    doc.save("Avis-Habilitation.pdf")
  }




  public html: string = '<div id="htmlData" #htmlData style="background-image: url(bck.png);background-size: cover; height: 842px; width: 595px;">\n' +
    '    <div class="ps-3 pe-3 pt-5" style="border: 2px solid black;height: 842px; width: 595px;">\n' +
    '\n' +
    '      <div class="row mt-5">\n' +
    '        <h3 class="text-center">TEST DE POSITIONNEMENT</h3>\n' +
    '      </div>\n' +
    '\n' +
    '      <div class="row mt-2" >\n' +
    '        <div class="col-md-4" style="position: relative;left: 60px">\n' +
    '          <h5>NOM:</h5>\n' +
    '          <h5>E-MAIL:</h5>\n' +
    '        </div>\n' +
    '        <div class="col-md-4" style="position: relative;left: 98px">\n' +
    '          <h5>NIVEAU D\'HABILITATION:</h5>\n' +
    '          <h5>DATE:</h5>\n' +
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
    '            <tr>\n' +
    '              <td>Mark</td>\n' +
    '            </tr>\n' +
    '            <tr>\n' +
    '              <td>Voisinage</td>\n' +
    '            </tr>\n' +
    '            <tr>\n' +
    '              <td>Voisinage</td>\n' +
    '            </tr>\n' +
    '\n' +
    '            <tr>\n' +
    '              <td>Voisinage</td>\n' +
    '            </tr>\n' +
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
    '            <tr>\n' +
    '              <td>Mark</td>\n' +
    '            </tr>\n' +
    '            <tr>\n' +
    '              <td>Voisinage</td>\n' +
    '            </tr>\n' +
    '            <tr>\n' +
    '              <td>Voisinage</td>\n' +
    '            </tr>\n' +
    '            <tr>\n' +
    '              <td>Voisinage</td>\n' +
    '            </tr>\n' +
    '            <tr>\n' +
    '              <td>Voisinage</td>\n' +
    '            </tr>\n' +
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

}
