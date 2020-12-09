import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { BugInterface } from '../bug-interface';
import { RestService } from '../rest.service';
@Component({
  selector: 'app-report-bug',
  templateUrl: './report-bug.component.html',
  styleUrls: ['./report-bug.component.scss']
})
export class ReportBugComponent implements OnInit {
  reportBugForm: FormGroup;

  constructor(private service : RestService) { }

/*Theloume enan pinaka gia na kanoyme me ngFor taselect */


  ngOnInit(): void {
    this.reportBugForm = new FormGroup({
      bugTitle: new FormControl("",[Validators.required]),
      bugDescription: new FormControl("",[Validators.required]),
      bugPriority: new FormControl("",[Validators.required]),
      bugReporter: new FormControl("",[Validators.required]),
      bugStatus: new FormControl("")
    });
    this.reportBugForm.get("bugReporter").statusChanges.subscribe((value) => {
      console.log(value);
      if(this.reportBugForm.get("bugReporter").value == 'QA'){
        this.reportBugForm.get("bugStatus").setValidators(Validators.required)
      }else{
        this.reportBugForm.get("bugStatus").clearValidators();
      }
      this.reportBugForm.get("bugStatus").updateValueAndValidity();
    })
  }

  onSubmit(){
    if(!this.reportBugForm.valid){
      console.log('invalid');
    }else{
      console.log(this.reportBugForm);
      let values = this.reportBugForm.value;
      let sendingBug: BugInterface ={
        title : values.bugTitle,
        description : values.bugDescription,
        priority : values.bugPriority,
        reporter : values.bugReporter,
        status : values.bugStatus
      };
      // sendingBug.title = values.bugTitle;
      // sendingBug.description = values.bugDescription;
      // sendingBug.priority = values.bugPriority;
      // sendingBug.reporter = values.bugReporter;
      // sendingBug.status = values.bugStatus;
      console.log(sendingBug);
      this.service.postBug(sendingBug).subscribe((data)=>{
        console.log(data);
      });
    }
    
  }

}


