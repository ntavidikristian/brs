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
  private _ascending: boolean = false;
  private _filters = {
    title:'title',
    priority: 'priority',
    reporter: 'reporter',
    createdAt: 'createdAt',
    status: 'status'
  };
  private _filterBy = this.filters.createdAt;

  tableLoading = false;
  
  constructor(private restService:RestService) { }

  ngOnInit(): void {
    this.getAllBugs();
  }

  get filters(){
    return this._filters;
  }
  getAllBugs(){
    this.tableLoading = true;
    this.restService.getAllBugs(this.filterBy, this.ascending).subscribe((bugs)=>{
      console.log(bugs);
      this.bugs = bugs;
      this.tableLoading = false;
    });
  }

  set ascending(value){
    this._ascending = value;
  }
  get ascending(){
    return this._ascending;
  }

  set filterBy(value){
    this._filterBy = value;
  }
  get filterBy(){
    return this._filterBy;
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
