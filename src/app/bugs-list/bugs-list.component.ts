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
  private _bugs: Array<BugInterface> = [];
  private _ascending: boolean = false;
  private _filters = {
    title: 'title',
    priority: 'priority',
    reporter: 'reporter',
    createdAt: 'createdAt',
    status: 'status'
  };
  reporterValues = ['QA', 'PO', 'DEV'];
  statusValues = ['Ready for Testing', 'Done', 'Rejected'];
  private _filterBy = this.filters.createdAt;

  tableLoading = false;
  currentPage = 0;//TODO PREPEI NA TO DOUME
  totalPages: number = 1;

  searchForm: FormGroup = new FormGroup({
    searchTitle: new FormControl(),
    searchPriority: new FormControl(null),
    searchReporter: new FormControl(null),
    searchStatus: new FormControl(null)
  })


  constructor(private restService: RestService) { }

  ngOnInit(): void {
    this.getAllBugs();
  }

  get filters() {
    return this._filters;
  }

  searchSubmit() {
    let searchParams = this.getQueryParams();

    this.tableLoading = true;

    this.restService.getAllBugs(searchParams).subscribe(search=>{
      this.bugs = search.body;
      this.totalPages = search.headers.get('Totalpages');
      this.currentPage = 0;

      this.tableLoading = false;
    })
    
  }

  getQueryParams(): QueryParams {
    let filter = this.filterBy + ',' + (this.ascending ? 'asc' : 'desc');

    let searchParams: QueryParams = { sort: filter };
    searchParams.priority = this.searchForm.get("searchPriority").value ?? "";
    searchParams.reporter = this.searchForm.get("searchReporter").value ?? "";
    searchParams.title = this.searchForm.get("searchTitle").value ?? "";
    searchParams.status = this.searchForm.get("searchStatus").value ?? "";
    return searchParams;
  };


  getAllBugs() {
    this.tableLoading = true;

    let filter = this.filterBy + ',' + (this.ascending ? 'asc' : 'desc');
    // console.log(filter);
    // console.log(this.filterBy);
    //CREATE object query parameters 

    let attrs: QueryParams = this.getQueryParams();
    attrs.page = this.currentPage;

    this.restService.getAllBugs(attrs).subscribe((response) => {
      let headers = response.headers as HttpHeaders;

      // console.log(headers.get('Totalpages'));
      this.totalPages = Number.parseInt(headers.get('Totalpages'));
      this.currentPage = Number.parseInt(headers.get('Page'));
      //console.log(this.totalPages);
      this.bugs = response.body;
      this.tableLoading = false;
    });
  }

  previousPage() {
    if (this.currentPage <= 0) return;
    this.currentPage--;
    this.getAllBugs();
  }

  nextPage() {
    //console.log(this.totalPages);
    if (!(this.currentPage + 1 < this.totalPages) || this.totalPages == 1) return;
    this.currentPage++;
    this.getAllBugs();
  }

  set ascending(value) {
    this._ascending = value;
  }
  get ascending() {
    return this._ascending;
  }

  set filterBy(value) {
    this._filterBy = value;
  }
  get filterBy() {
    return this._filterBy;
  }
  set bugs(value: Array<BugInterface>) {
    this._bugs = value;
  }
  get bugs() {
    return this._bugs;
  }
  updateFilter(filterValue) {
    if (this.filterBy == filterValue) {
      //toggling the ascending value
      this.ascending = !this.ascending;
    }
    this.filterBy = filterValue;

    //get data form api
    this.getAllBugs();
  }

  deleteRowBug(bugID: string) {

    let confirm = window.confirm('You are about to delete a bug. This action is irreversible. Do you want to proceed?');

    if(!confirm) return;

    this.restService.deleteBug(bugID).subscribe((item) => {
      this.getAllBugs();
    });
  }

}
