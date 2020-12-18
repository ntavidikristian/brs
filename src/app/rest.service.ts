import { Injectable } from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import { Observable } from 'rxjs';
import { BugInterface } from './bug-interface';
import { QueryParams } from './query-params';
@Injectable({
  providedIn: 'root'
})
export class RestService {
  // private filterBy = "title";
  // private ascending:boolean = true;

  private endpoint = "https://bug-report-system-server.herokuapp.com/bugs";
  constructor(private http:HttpClient) { }

  getQueryparamsString(attrs){
    let query = "";
    return Object.keys(attrs).map((key)=>{
      return key+"="+attrs[key];
    }).join('&');
  }

  getAllBugs(attrs):Observable<any>{

    // let query = this.endpoint + '?sort='+filterBy+","+ 
    // (ascending ? 'asc':'desc');
    let query = this.endpoint + '?'+this.getQueryparamsString(attrs);
    // console.log(query);
    console.log(query);
    return this.http.get<any>(query, {observe:'response'});
  }


  postBug(bug : BugInterface ): Observable<BugInterface> {    
    return this.http.post<BugInterface>(this.endpoint, bug);  
  }

  getBugById(bugid : string): Observable<BugInterface>{
    let query = this.endpoint + "/" + bugid;
    // console.log(query);
    return this.http.get<BugInterface>(query); 
  }

  updateBug(bug : BugInterface ): Observable<BugInterface>{
    let query = this.endpoint + "/" + bug.id;
    return this.http.put<BugInterface>(query, bug);  
  }

  deleteBug(bugid : string): Observable<any>{
    let query = this.endpoint + "/" + bugid;
    return this.http.delete(query);  
  }
}
