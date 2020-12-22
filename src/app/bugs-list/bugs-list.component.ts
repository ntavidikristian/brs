import { HttpHeaders } from '@angular/common/http';
import { AttrAst } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { realpath } from 'fs';
import { Button } from 'protractor';
import { BugInterface } from '../bug-interface';
import { QueryParams } from '../query-params';
import { RestService } from '../rest.service';
import { ReportBugComponent } from '../report-bug/report-bug.component';
import { FormControl, FormGroup } from '@angular/forms';
import { ɵTestingCompiler } from '@angular/core/testing';

@Component({
  selector: 'app-bugs-list',
  templateUrl: './bugs-list.component.html',
  styleUrls: ['./bugs-list.component.scss']
})

export class BugsListComponent implements OnInit {
  //array that stores the bugs
  private _bugs: Array<BugInterface> = [];
  //preference of ordering
  private _ascending: boolean = false;
  //sorting filters on table
  private _filters = {
    title: 'title',
    priority: 'priority',
    reporter: 'reporter',
    createdAt: 'createdAt',
    status: 'status'
  };

  //valid reporter values (search from)
  reporterValues = ['QA', 'PO', 'DEV'];
  //valid status values (search form)
  statusValues = ['Ready for testing', 'Done', 'Rejected'];
  
  // the filter we want the bugs to be ordered by
  private _filterBy = this.filters.createdAt;

  //flag that indicates if we are loading bugs to table
  tableLoading = false;
  //ccurent page of results
  currentPage = 0;
  //total pages of results
  totalPages: number = 1;

  //searchform formgroup
  searchForm: FormGroup = new FormGroup({
    searchTitle: new FormControl(),
    searchPriority: new FormControl(null),
    searchReporter: new FormControl(null),
    searchStatus: new FormControl(null)
  })

  //injecting restServices to make calls to api
  constructor(private restService: RestService) { }


  ngOnInit(): void {
    //load list of bugs
    this.getAllBugs();
  }

  //getter
  get filters() {
    return this._filters;
  }

  //get the bugs based on the filters applied
  searchSubmit() {
    //get filter parameters 
    let searchParams = this.getQueryParams();
    //make the table invisible
    this.tableLoading = true;

    //make call to api to get the bugs
    this.restService.getAllBugs(searchParams).subscribe(search=>{
      //update the bugs array
      this.bugs = search.body;
      //update total pages
      this.totalPages = search.headers.get('Totalpages');
      //set the current page to first page
      this.currentPage = 0;
      //show the table of bugs
      this.tableLoading = false;
    })
    
  }

  //a method that returns the filters that the user has applied to the interface
  getQueryParams(): QueryParams {
    //get element which we want the ordering to be applied and the actual order(asc/desc)
    let filter = this.filterBy + ',' + (this.ascending ? 'asc' : 'desc');

    //initalize the queryparams with the filter
    let searchParams: QueryParams = { sort: filter };

    //append to the params the filters (if any) from the search form
    searchParams.priority = this.searchForm.get("searchPriority").value ?? "";
    searchParams.reporter = this.searchForm.get("searchReporter").value ?? "";
    searchParams.title = this.searchForm.get("searchTitle").value ?? "";
    searchParams.status = this.searchForm.get("searchStatus").value ?? "";
    //return the search params
    return searchParams;
  };

  //load all bugs to the table. takes into account the current page
  getAllBugs() {
    //make table invisible
    this.tableLoading = true;

    //get query params
    let attrs: QueryParams = this.getQueryParams();

    //append the page we want to get
    attrs.page = this.currentPage;

    //make the call to api and update the table
    this.restService.getAllBugs(attrs).subscribe((response) => {
      let headers = response.headers as HttpHeaders;

      //update total pages
      this.totalPages = Number.parseInt(headers.get('Totalpages'));
      //update current page
      this.currentPage = Number.parseInt(headers.get('Page'));
      // update the list of bugs
      this.bugs = response.body;
      // make table visible
      this.tableLoading = false;
    });
  }

  //got to previous page of results
  previousPage() {
    //we are at the first page so no action needed
    if (this.currentPage <= 0) return;
    //decrease the current page
    this.currentPage--;
    //load the bugs with the parameters the user has set to the ui
    this.getAllBugs();
  }

  //go to next page of results
  nextPage() {
    //if results have one page or the current page is the last page then no action is needed
    if (!(this.currentPage + 1 < this.totalPages) || this.totalPages == 1) return;
    //update the current page
    this.currentPage++;
    //load the bugs with the parameters the user has set to the ui
    this.getAllBugs();
  }

  //setter
  set ascending(value) {
    this._ascending = value;
  }
  //getter
  get ascending() {
    return this._ascending;
  }

  //sets the filter which we want our results to be ordered by
  set filterBy(value) {
    this._filterBy = value;
  }
  //returns the filter which the results are ordered by
  get filterBy() {
    return this._filterBy;
  }
  //seter
  set bugs(value: Array<BugInterface>) {
    this._bugs = value;
  }
  //getter
  get bugs() {
    return this._bugs;
  }

  // update the order or the filter 
  updateFilter(filterValue) {
    //the filter is the same so change the ordering 
    if (this.filterBy == filterValue) {
      //toggling the ascending value
      this.ascending = !this.ascending;
    }
    //update the filter
    this.filterBy = filterValue;

    //get data form api
    this.getAllBugs();
  }

  //delete a row from the table of bugs and update the list
  deleteRowBug(bugID: string) {
    //confirm action
    let confirm = window.confirm('You are about to delete a bug. This action is irreversible. Do you want to proceed?');
    //user doesn't want to procceed with deletion 
    if(!confirm) return;

    //make the call to api to delete the bug
    this.restService.deleteBug(bugID).subscribe((item) => {
      // update the table
      this.getAllBugs();
    });
  }

}
