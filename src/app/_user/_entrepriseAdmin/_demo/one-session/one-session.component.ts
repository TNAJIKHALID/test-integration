import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {SessionDataTable} from "../dataTables";
import {MatCheckboxChange} from "@angular/material/checkbox";
import {XEmployeeEntreprise} from "../model";
import {MatDialog} from "@angular/material/dialog";
import {OneEmlpoyeeComponent} from "../one-emlpoyee/one-emlpoyee.component";

@Component({
  selector: 'app-one-session',
  templateUrl: './one-session.component.html',
  styleUrls: ['./one-session.component.css']
})
export class OneSessionComponent implements OnInit {

  @Input() level:string;
  @Input() session:SessionDataTable;
  @Input() xEmployees:Array<XEmployeeEntreprise>;

  @Output() onBackEvent:EventEmitter<boolean>=new EventEmitter<boolean>();

  public selected: Set<number> = new Set<number>();


  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
  }


  addToSelected($event: MatCheckboxChange) {
    console.log($event.source.value);
    if($event.source.value == 'All'){
      if ($event.checked) {
        this.xEmployees.forEach(e=>this.selected.add(e.id));
      }
    }else if($event.checked) this.selected.add(Number($event.source.value));
    else this.selected.delete(Number($event.source.value));

  }

  onEmployeeDetails(employe: XEmployeeEntreprise) {
    const dialogRef = this.dialog.open(OneEmlpoyeeComponent, {
      data: {
        employee : employe
      }
    });

    dialogRef.afterClosed().subscribe(employeeToUpdate => {
      //todo
      console.log(employeeToUpdate)
    });


  }
}
