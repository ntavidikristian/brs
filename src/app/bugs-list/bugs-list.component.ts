import { Component, OnInit } from '@angular/core';
import { Button } from 'protractor';
import { RestService } from '../rest.service';

@Component({
  selector: 'app-bugs-list',
  templateUrl: './bugs-list.component.html',
  styleUrls: ['./bugs-list.component.scss']
})
export class BugsListComponent implements OnInit {
  private _bugs = [];
  private ascending: boolean = true;
  private filterBy = 'title';
  
  constructor(private restService:RestService) { }

  ngOnInit(): void {
    this.getAllBugs();
  }

  getAllBugs(){
    this.restService.getAllBugs(this.filterBy, this.ascending).subscribe((bugs)=>{
      console.log(bugs);
      this.bugs = bugs;
    });
  }

  set bugs(value){
    this._bugs = value;
  }
  get bugs(){
    return this._bugs;
  }
  updateFilter(filterValue){
    if(this.filterBy == filterValue){
      //toggling the ascending value
      this.ascending = !this.ascending;
    }
    this.filterBy = filterValue;

    //get data form api
    this.getAllBugs();
  }

}
