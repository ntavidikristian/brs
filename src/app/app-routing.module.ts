import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BugsListComponent } from './bugs-list/bugs-list.component';
import { ReportBugComponent } from './report-bug/report-bug.component';

const routes: Routes = [
  {path:'reportbug', component:ReportBugComponent},
  {path:'', component:BugsListComponent},
  {path:'reportbug/:id', component:ReportBugComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
