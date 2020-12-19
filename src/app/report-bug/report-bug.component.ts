import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray, FormGroupDirective } from "@angular/forms";
import { ActivatedRoute, Router } from '@angular/router';
import { BugInterface } from '../bug-interface';
import { RestService } from '../rest.service';
import { Comment } from "../comment";

@Component({
  selector: 'app-report-bug',
  templateUrl: './report-bug.component.html',
  styleUrls: ['./report-bug.component.scss']
})
export class ReportBugComponent implements OnInit {
  //flag when looading data from server
  dataloading:boolean = false;
  //flag when data has been submitted to server
  datasubmitted: boolean =false;
  hideform: boolean = false;
  
  isUpdateForm: boolean = false;
  bugId: string = null;
  
    reporterValues = ['QA', 'PO', 'DEV'];
    statusValues = ['Ready for testing', 'Done', 'Rejected'];

  constructor(private service: RestService, private router: Router, private activeRoute: ActivatedRoute) { }

  reportBugForm: FormGroup = new FormGroup({
    bugTitle: new FormControl("",[Validators.required]),
    bugDescription: new FormControl("",[Validators.required]),
    bugPriority: new FormControl("",[Validators.required]),
    bugReporter: new FormControl("",[Validators.required]),
    bugStatus: new FormControl(""),
    bugComments: new FormArray([
      // new FormGroup({
      //   reporter: new FormControl("John Kalimeris"),
      //   description: new FormControl("Kalimera sas")
      // }),
      // new FormGroup({
      //   reporter: new FormControl("Thanasis Kalimers"),
      //   description: new FormControl("Axxx kurie mano")
      // })
    
    ])
  });
  private _initialForm = this.reportBugForm.value;


  commentFormGroup: FormGroup = new FormGroup({
    reporter: new FormControl(null,[Validators.required]),
    description: new FormControl(null, [Validators.required])
  });
  


  //method that fetches the givved data to template
  private fetchBug(bug :BugInterface){
    console.log(bug);
    this.reportBugForm.get("bugTitle").setValue(bug.title);
    this.reportBugForm.get("bugDescription").setValue(bug.description);
    this.reportBugForm.get("bugPriority").setValue(bug.priority);
    this.reportBugForm.get("bugReporter").setValue(bug.reporter);
    this.reportBugForm.get("bugStatus").setValue(bug.status);
    
    this.bugId = bug.id;

    let my_array = this.reportBugForm.get('bugComments') as FormArray;

    if(bug.comments){
      for(let comment of bug.comments){
        let control = new FormGroup({
          reporter: new FormControl(comment.reporter),
          description: new FormControl( comment.description)
        });
        my_array.push(control);
      }
    }
  }

  private fetchInitialBug(bug:BugInterface){
    this._initialForm.bugTitle = bug.title;
    this._initialForm.bugDescription = bug.description;
    this._initialForm.bugPriority = bug.priority;
    this._initialForm.bugReporter = bug.reporter;
    this._initialForm.bugStatus = bug.status;
  }

  ngOnInit(): void {
    this.activeRoute.params.subscribe((data)=>{
      let id = data.id;
      // console.log(id);
      if( id == undefined){
        // console.log("den exei");
      }else{
        this.service.getBugById(id).subscribe((requestedbug)=>{
          // this.reportBugForm.get("bugTitle").setValue(requestedbug.title);
          // this.reportBugForm.get("bugDescription").setValue(requestedbug.description);
          // this.reportBugForm.get("bugPriority").setValue(requestedbug.priority);
          // this.reportBugForm.get("bugReporter").setValue(requestedbug.reporter);
          // this.reportBugForm.get("bugStatus").setValue(requestedbug.status);
          this.isUpdateForm = true;
          // this.bugId = requestedbug.id;
          //console.log(requestedbug.comments);
          this.fetchBug(requestedbug);
          
          // this._initialForm.bugTitle = requestedbug.title;
          // this._initialForm.bugDescription = requestedbug.description;
          // this._initialForm.bugPriority = requestedbug.priority;
          // this._initialForm.bugReporter = requestedbug.reporter;
          // this._initialForm.bugStatus = requestedbug.status;
          this.fetchInitialBug(requestedbug);

          // let my_array = this.reportBugForm.get('bugComments') as FormArray;

          // if(requestedbug.comments){
          //   for(let comment of requestedbug.comments){
          //     let control = new FormGroup({
          //       reporter: new FormControl(comment.reporter),
          //       description: new FormControl( comment.description)
          //     });
          //     my_array.push(control);
          //   }
          // }
          //console.log(my_array);

          // console.log(requestedbug);
        });
      }
    });

    this.reportBugForm.get("bugReporter").statusChanges.subscribe((value) => {
      //console.log(value);
      if(this.reportBugForm.get("bugReporter").value == 'QA'){
        this.reportBugForm.get("bugStatus").setValidators(Validators.required);
      }else{
        this.reportBugForm.get("bugStatus").clearValidators();
      }
      this.reportBugForm.get("bugStatus").updateValueAndValidity();
    });
  }


  onSubmit(){
    if(!this.reportBugForm.valid){
      //console.log('invalid');
    }else{

      this.dataloading = true;
      this.hideform = true;
      if(this.isUpdateForm){
        // sendingBug.id = this.bugId;
        this.service.updateBug(this.generateBug()).subscribe((updatedBug)=>{
          //console.log(data);
          this.fetchInitialBug(updatedBug);
          this.fetchBug(updatedBug);
          this.dataloading = false;
          this.datasubmitted = true;
        });

      }else{
        this.service.postBug(this.generateBug()).subscribe((createdBug)=>{
          //console.log(data);

          this.fetchInitialBug(createdBug);
          this.fetchBug(createdBug);
          this.dataloading = false;
          this.datasubmitted = true;
          // setTimeout(() => {
          //   this.router.navigate(['']);
          // }, 3000);
        });
      }
    }
    
  }

  generateBug(): BugInterface{

    let values = this.reportBugForm.value;
    let bug: BugInterface ={
      id: this.bugId,
      title : values.bugTitle,
      description : values.bugDescription,
      priority : values.bugPriority,
      reporter : values.bugReporter,
      status : values.bugStatus,
      comments: values.bugComments
    };

     console.log(bug);
    return bug;
  }
  
  goMainPage(){
    this.router.navigate(['']);
  }

  appendComment(){
    //console.log(this.commentFormGroup);
    

    let comments = this.reportBugForm.get('bugComments') as FormArray;


    //create new formgroup to push to comments
    let to_push = new FormGroup({
      reporter: new FormControl(this.commentFormGroup.get('reporter').value),
      description: new FormControl(this.commentFormGroup.get('description').value)
    });
    comments.push(to_push);


    //empty commentformgroup

    this.commentFormGroup.get('reporter').reset();
    this.commentFormGroup.get('description').reset();
    
    //update the server

    let bug =this.generateBug();

    this.service.updateBug(bug).subscribe((data)=>{
      alert("server updated");
    });

  }
  
  leavePage(){
    // console.log(this._initialForm);
    // console.log(this.reportBugForm.value);

    console.log(this.commentFormGroup.get('reporter'));
    console.log(this.commentFormGroup.get('description'));
    if(!this.datasubmitted && (this.commentFormGroup.get('reporter').value?.length > 0) || (this.commentFormGroup.get('description').value?.length > 0)) return window.confirm("You haven't submit your comment");
    if (this.compare(this._initialForm, this.reportBugForm.value)) return true;
    //console.log(this.commentFormGroup.get('reporter').value.length);

    //TODO
    return window.confirm("Your changes haven't been submitted. Are you sure, you want to leave the page?");
  }


  compare(initial, bugform) {
    if (initial.bugTitle != bugform.bugTitle) return false;
    if (initial.bugDescription != bugform.bugDescription) return false;
    if (initial.bugPriority != bugform.bugPriority) return false;
    if (initial.bugReporter != bugform.bugReporter) return false;
    if (initial.bugStatus != bugform.bugStatus) return false;
    return true;      
  }

}


