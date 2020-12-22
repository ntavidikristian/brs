import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray, FormGroupDirective } from "@angular/forms";
import { ActivatedRoute, Router } from '@angular/router';
import { BugInterface } from '../bug-interface';
import { RestService } from '../rest.service';
import { Comment } from "../comment";
import { HttpErrorResponse } from '@angular/common/http';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';

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

  //flag tha hides the form 
  hideform: boolean = false;
  //flag that indicates the ui is submitting a comment
  submittingComment: boolean = false;
  //indicates if a comment has been submitted
  commentSubmitted: boolean = false;
  
  //flag that indicates if our form is an edit or submit form 
  isUpdateForm: boolean = false;
  //keep the id of the bug if our from is an edit form 
  bugId: string = null;
  //valid values for the reporter
  reporterValues = ['QA', 'PO', 'DEV'];
  //valid status values
  statusValues = ['Ready for testing', 'Done', 'Rejected'];

  //get a refference to our modal on the ui
  @ViewChild('errorModal',{static:false})
  private errorNgTemplate;

  //injecting rest service , router and modals
  constructor(private service: RestService, private router: Router, private activeRoute: ActivatedRoute, private modal: NgbModal) { }

  //formgroup for our main edit/submit form
  reportBugForm: FormGroup = new FormGroup({
    bugTitle: new FormControl("",[Validators.required]),
    bugDescription: new FormControl("",[Validators.required]),
    bugPriority: new FormControl("",[Validators.required]),
    bugReporter: new FormControl("",[Validators.required]),
    bugStatus: new FormControl(""),

    bugComments: new FormArray([])
  });
  //keep an instance of our initial form 
  private _initialForm = this.reportBugForm.value;

  //form group for our insert new comment form 
  commentFormGroup: FormGroup = new FormGroup({
    reporter: new FormControl(null, [Validators.required]),
    description: new FormControl(null, [Validators.required])

  });

  //handle an error 
  handleError(errorCode:number){

    //shows a modal to the user
    this.openModal(this.errorNgTemplate);
  }


  //method that fetches the givved bug to template
  private fetchBug(bug :BugInterface){
    //fetch data to report bug form
    this.reportBugForm.get("bugTitle").setValue(bug.title);
    this.reportBugForm.get("bugDescription").setValue(bug.description);
    this.reportBugForm.get("bugPriority").setValue(bug.priority);
    this.reportBugForm.get("bugReporter").setValue(bug.reporter);
    this.reportBugForm.get("bugStatus").setValue(bug.status);
    //current but we are working on
    this.bugId = bug.id;
    //get the comments  section of our ui
    let my_array = this.reportBugForm.get('bugComments') as FormArray;

    if(bug.comments){

      //for each comment we retrieved, we append it to our ui
      for(let comment of bug.comments){
        let control = new FormGroup({
          reporter: new FormControl(comment.reporter),
          description: new FormControl( comment.description)
        });
        my_array.push(control);
      }
    }
  }
  // sets the values to our initial bug variable
  private fetchInitialBug(bug:BugInterface){
    this._initialForm.bugTitle = bug.title;
    this._initialForm.bugDescription = bug.description;
    this._initialForm.bugPriority = bug.priority;
    this._initialForm.bugReporter = bug.reporter;
    this._initialForm.bugStatus = bug.status;
  }


  ngOnInit(): void {
    //get our parameters
    this.activeRoute.params.subscribe((data) => {
      let id = data.id;
      
      //if id is not provided our form is a submit form
      if (id == undefined) {
        
      }else{//our form is and edit form 
        //load bug 
        this.service.getBugById(id).subscribe((requestedbug)=>{
          //our for is an update form
          this.isUpdateForm = true;
          //update form values
          this.fetchBug(requestedbug);
          //update initial bug
          this.fetchInitialBug(requestedbug);
        }, error =>{
          //could not get the data from server

          let errorcode = error.status;
          //show modal
          this.handleError(errorcode);
        });
      }
    });
    //set up a listener to our bugreporer control, if is QA make the bugstatus mandatory
    this.reportBugForm.get("bugReporter").statusChanges.subscribe((value) => {
      
      if (this.reportBugForm.get("bugReporter").value == 'QA') {
        this.reportBugForm.get("bugStatus").setValidators(Validators.required);
      } else {
        this.reportBugForm.get("bugStatus").clearValidators();
      }
      //update validity of the control and the element
      this.reportBugForm.get("bugStatus").updateValueAndValidity();
    });
  }


  //when our form is submitted
  onSubmit(){
    if(!this.reportBugForm.valid){
      // our form is not valid
    }else{
      //show spinner
      this.dataloading = true;
      //hide form
      this.hideform = true;

      if (this.isUpdateForm) {
        //make call to api to update bug
        this.service.updateBug(this.generateBug()).subscribe((updatedBug)=>{
          //update the initial bug value
          this.fetchInitialBug(updatedBug);
          //update our form values
          this.fetchBug(updatedBug);
          //hide spinner
          this.dataloading = false;
          //show success message
          this.datasubmitted = true;
        });

      }else{
        //form is submit form 
        //posting data
        this.service.postBug(this.generateBug()).subscribe((createdBug)=>{
          //update intial bug and 
          this.fetchInitialBug(createdBug);
          this.fetchBug(createdBug);

          // hide spinner
          this.dataloading = false;
          // show success message
          this.datasubmitted = true;
        });
      }
    }

  }

  //collects the data from our ui and create an representation of our bug (BugInterface)
  generateBug(): BugInterface {

    let values = this.reportBugForm.value;
    let bug: BugInterface = {
      id: this.bugId,
      title: values.bugTitle,
      description: values.bugDescription,
      priority: values.bugPriority,
      reporter: values.bugReporter,
      status: values.bugStatus,
      comments: values.bugComments
    };

    return bug;
  }


  goMainPage() {
    this.router.navigate(['']);
  }

  // gets the comment from our submit comment form and appends its to comments
  appendComment() {

    //get the array of comments 
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

    let bug = this.generateBug();
    //show spinner
    this.submittingComment = true;
    //hide success icon
    this.commentSubmitted = false;

    //update bug to server
    this.service.updateBug(bug).subscribe((data) => {
      //give feedback tou user

      //hide spinner
      this.submittingComment = false;
      //show success icon
      this.commentSubmitted = true;

      //hide submitted message after 2s
      setTimeout(()=>{
        this.commentSubmitted = false;
      },2000);
    });

  }

  // indicates if user has unsaved data in forms
  leavePage():boolean {
    //comment is not saved
    if(!this.datasubmitted && (this.commentFormGroup.get('reporter').value?.length > 0) || (this.commentFormGroup.get('description').value?.length > 0)) return window.confirm("You haven't submit your comment");

    //bug form is not saved
    if (this.compare(this._initialForm, this.reportBugForm.value)) return true;
    
    //confirm action to user
    return window.confirm("Your changes haven't been submitted. Are you sure, you want to leave the page?");
  }


  //compares two bugform objects
  compare(initial, bugform):boolean {
    if (initial.bugTitle != bugform.bugTitle) return false;
    if (initial.bugDescription != bugform.bugDescription) return false;
    if (initial.bugPriority != bugform.bugPriority) return false;
    if (initial.bugReporter != bugform.bugReporter) return false;
    if (initial.bugStatus != bugform.bugStatus) return false;
    return true;
  }

  //show error modal to user
  openModal(content){
    
    //make modal non exitable from clicking out
    let modalOptions:NgbModalOptions = {
      backdrop: 'static',
      keyboard: false
    } 

    //show modal
    this.modal.open(content, modalOptions).result.then(reason=>{
      //go to main page
      this.goMainPage();
    },(reason)=>{
      //stay on page and report the bug
      this.router.navigate(['reportbug']);
    });
  }

}


