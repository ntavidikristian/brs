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
 
  dataloading:boolean = false;
  datasubmitted: boolean =false;
  hideform: boolean = false;
  constructor(private service: RestService, private router: Router, private activeRoute: ActivatedRoute) { }

/*Theloume enan pinaka gia na kanoyme me ngFor ta select */
  // priorityValues = ['Minor', 'Major', 'Crirical'];
  reporterValues = ['QA', 'PO', 'DEV'];
  statusValues = ['Ready for testing', 'Done', 'Rejected'];

  reportBugForm: FormGroup = new FormGroup({
    bugTitle: new FormControl("",[Validators.required]),
    bugDescription: new FormControl("",[Validators.required]),
    bugPriority: new FormControl(null,[Validators.required]),
    bugReporter: new FormControl(null,[Validators.required]),
    bugStatus: new FormControl(null),
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

  commentFormGroup: FormGroup = new FormGroup({
    reporter: new FormControl("",[Validators.required]),
    description: new FormControl("", [Validators.required])
  });
  
  isUpdateForm: boolean = false;
  bugId: string = null;

  ngOnInit(): void {
    this.activeRoute.params.subscribe((data)=>{
      let id = data.id;
      // console.log(id);
      if( id == undefined){
        // console.log("den exei");
      }else{
        this.service.getBugById(id).subscribe((requestedbug)=>{
          this.reportBugForm.get("bugTitle").setValue(requestedbug.title);
          this.reportBugForm.get("bugDescription").setValue(requestedbug.description);
          this.reportBugForm.get("bugPriority").setValue(requestedbug.priority);
          this.reportBugForm.get("bugReporter").setValue(requestedbug.reporter);
          this.reportBugForm.get("bugStatus").setValue(requestedbug.status);
          this.isUpdateForm = true;
          this.bugId = requestedbug.id;
          console.log(requestedbug.comments);

          let my_array = this.reportBugForm.get('bugComments') as FormArray;

          if(requestedbug.comments){
            for(let comment of requestedbug.comments){
              let control = new FormGroup({
                reporter: new FormControl(comment.reporter),
                description: new FormControl( comment.description)
              });
              my_array.push(control);
            }
          }
          console.log(my_array);

          // console.log(requestedbug);
        });
      }
    });

    this.reportBugForm.get("bugReporter").statusChanges.subscribe((value) => {
      console.log(value);
      if(this.reportBugForm.get("bugReporter").value == 'QA'){
        this.reportBugForm.get("bugStatus").setValidators(Validators.required)
      }else{
        this.reportBugForm.get("bugStatus").clearValidators();
      }
      this.reportBugForm.get("bugStatus").updateValueAndValidity();
    });
  }


  onSubmit(){
    if(!this.reportBugForm.valid){
      console.log('invalid');
    }else{
      //console.log(this.reportBugForm);
      // let values = this.reportBugForm.value;
      // let sendingBug: BugInterface ={
      //   title : values.bugTitle,
      //   description : values.bugDescription,
      //   priority : values.bugPriority,
      //   reporter : values.bugReporter,
      //   status : values.bugStatus
      // };

      this.dataloading = true;
      this.hideform = true;
      if(this.isUpdateForm){
        // sendingBug.id = this.bugId;
        this.service.updateBug(this.generateBug()).subscribe((data)=>{
          console.log(data);
          this.dataloading = false;
          this.datasubmitted = true;
        });

      }else{
        this.service.postBug(this.generateBug()).subscribe((data)=>{
          console.log(data);
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
    // console.log(bug);
    return bug;
  }
  
  goMainPage(){
    this.router.navigate(['']);
  }

  appendComment(){
    console.log(this.commentFormGroup);
    

    let comments = this.reportBugForm.get('bugComments') as FormArray;


    //create new formgroup to push to comments
    let to_push = new FormGroup({
      reporter: new FormControl(this.commentFormGroup.get('reporter').value),
      description: new FormControl(this.commentFormGroup.get('description').value)
    });
    comments.push(to_push);




    //empty commeformgroup

    this.commentFormGroup.get('reporter').reset();
    this.commentFormGroup.get('description').reset();
    
    //update the server

    let bug =this.generateBug();

    this.service.updateBug(bug).subscribe((data)=>{
      alert("server updated");
    });

  }


}


