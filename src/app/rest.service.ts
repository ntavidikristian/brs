import { Injectable } from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import { Observable } from 'rxjs';
import { BugInterface } from './bug-interface';
import { QueryParams } from './query-params';
@Injectable({
  providedIn: 'root'
})
export class RestService {

  private endpoint = "https://bug-report-system-server.herokuapp.com/bugs";
  constructor(private http:HttpClient) { }

  //get and object of key values and returs it as a sting of query params
  getQueryparamsString(attrs):string{
    return Object.keys(attrs).map((key)=>{
      return key+"="+attrs[key];
    }).join('&');
  }

  //get all bugs givven the attibutes 'attrs'
  getAllBugs(attrs):Observable<any>{
    let query = this.endpoint + '?'+this.getQueryparamsString(attrs);
    return this.http.get<any>(query, {observe:'response'});
  }

  //post a bug to server
  postBug(bug : BugInterface ): Observable<BugInterface> {    
    return this.http.post<BugInterface>(this.endpoint, bug);  
  }

  //get the bug requested by its id
  getBugById(bugid : string): Observable<BugInterface>{
    let query = this.endpoint + "/" + bugid;
    return this.http.get<BugInterface>(query); 
  }
  //update the bug
  updateBug(bug : BugInterface ): Observable<BugInterface>{
    let query = this.endpoint + "/" + bug.id;
    return this.http.put<BugInterface>(query, bug);  
  }
  //delete bug
  deleteBug(bugid : string): Observable<any>{
    let query = this.endpoint + "/" + bugid;
    return this.http.delete(query);  
  }
}
