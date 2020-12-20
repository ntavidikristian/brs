import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BugsListComponent } from './bugs-list/bugs-list.component';
import { IncompleteGuard } from './incomplete.guard';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ReportBugComponent } from './report-bug/report-bug.component';

const routes: Routes = [
  {path:'reportbug', component:ReportBugComponent,canDeactivate:[IncompleteGuard]},
  {path:'', component:BugsListComponent},
  {path:'reportbug/:id', component:ReportBugComponent,canDeactivate:[IncompleteGuard]},
  {path:'**', component:PageNotFoundComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
