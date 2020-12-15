import { HttpHeaders } from '@angular/common/http';
import { AttrAst } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { Button } from 'protractor';
import { BugInterface } from '../bug-interface';
import { QueryParams } from '../query-params';
import { RestService } from '../rest.service';

@Component({
  selector: 'app-bugs-list',
  templateUrl: './bugs-list.component.html',
  styleUrls: ['./bugs-list.component.scss']
})

export class BugsListComponent implements OnInit {
  private _bugs : Array<BugInterface>= [];
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
  currentPage = 0;
  totalPages:number = 1;
  
  constructor(private restService:RestService) { }

  ngOnInit(): void {
    this.getAllBugs();
  }

  get filters(){
    return this._filters;
  }
  
  getAllBugs(){
    this.tableLoading = true;

    let filter = this.filterBy+','+ (this.ascending? 'asc': 'desc') ;
    console.log(filter);
    console.log(this.filterBy);
    //CREATE object query parameters 

    let attrs:QueryParams = {
      sort:filter,
      page:this.currentPage

    };

    this.restService.getAllBugs( attrs).subscribe((response)=>{
      let headers = response.headers as HttpHeaders;

      // console.log(headers.get('Totalpages'));
      this.totalPages = Number.parseInt(headers.get('Totalpages'));
      console.log(this.totalPages);
      this.bugs = response.body;
      this.tableLoading = false;
    });
  }

  previousPage(){
    if (this.currentPage == 0) return;
    this.currentPage --;
    this.getAllBugs();
  }

  nextPage(){
    console.log(this.totalPages);
    if ( !(this.currentPage< this.totalPages)) return;
    this.currentPage ++;
    this.getAllBugs();
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
  set bugs(value:Array<BugInterface>){
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

  deleteRowBug(bugID: string){
    this.restService.deleteBug(bugID).subscribe((item)=>{
      this.getAllBugs();
    });
  }

}
