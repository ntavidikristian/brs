import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
import { BugInterface } from './bug-interface';
@Injectable({
  providedIn: 'root'
})
export class RestService {
  // private filterBy = "title";
  // private ascending:boolean = true;

  private endpoint = "https://bug-report-system-server.herokuapp.com/bugs";
  constructor(private http:HttpClient) { }

  getAllBugs(filterBy, ascending):Observable<any>{

    let query = this.endpoint + '?sort='+filterBy+","+ 
    (ascending ? 'asc':'desc');
    // console.log(query);
    return this.http.get(query);
  }


  postBug(bug : BugInterface ): Observable<any> {    
    return this.http.post(this.endpoint, bug);  
  }

  getBugById(bugid : string): Observable<any>{
    let query = this.endpoint + "/" + bugid;
    // console.log(query);
    return this.http.get(query); 
  }

  updateBug(bug : BugInterface ): Observable<any>{
    let query = this.endpoint + "/" + bug.id;
    return this.http.put(query, bug);  
  }
}
