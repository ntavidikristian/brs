import { Injectable } from '@angular/core';
import { CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { ReportBugComponent } from './report-bug/report-bug.component';

@Injectable({
  providedIn: 'root'
})
export class IncompleteGuard implements CanDeactivate<unknown> {
  canDeactivate(
    component: ReportBugComponent,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return component.leavePage();
  }
  
}
