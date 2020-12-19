import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { RestService } from '../rest.service';

import { ReportBugComponent } from './report-bug.component';
import {​​​​ RouterTestingModule }​​​​ from "@angular/router/testing";

import {​​​​ HttpClientTestingModule }​​​​ from "@angular/common/http/testing";

describe('ReportBugComponent', () => {
  let component: ReportBugComponent;
  let fixture: ComponentFixture<ReportBugComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportBugComponent ],
      imports: [ReactiveFormsModule, RouterTestingModule, HttpClientTestingModule]
    })
    .compileComponents();
    TestBed.inject(RestService);
    TestBed.inject(HttpClient);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportBugComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('form is invalid', () => {
    expect(component.reportBugForm.invalid).toBeTruthy();
  });

  it('form is valid', () => {
    const bugTitleControl = component.reportBugForm.get('bugTitle');
    const bugDescriptionControl = component.reportBugForm.get('bugDescription');
    const bugPriorityControl = component.reportBugForm.get('bugPriority');
    const bugReporterControl = component.reportBugForm.get('bugReporter');
    const bugStatusControl = component.reportBugForm.get('bugStatus');

    bugTitleControl.setValue('OurBug');
    expect(bugTitleControl.valid).toBeTruthy();

    bugDescriptionControl.setValue('TheBug');
    expect(bugDescriptionControl.valid).toBeTruthy();
    
    bugPriorityControl.setValue('1');
    expect(bugPriorityControl.valid).toBeTruthy();

    bugReporterControl.setValue('PO');
    expect(bugReporterControl.valid).toBeTruthy();

    // bugStatusControl.setValue('Done');
    // expect(bugStatusControl.valid).toBeTruthy();

    expect(component.reportBugForm.valid).toBeTruthy();
  });
  it('form should be invalid , qa selected but no status entered', () => {
    const bugTitleControl = component.reportBugForm.get('bugTitle');
    const bugDescriptionControl = component.reportBugForm.get('bugDescription');
    const bugPriorityControl = component.reportBugForm.get('bugPriority');
    const bugReporterControl = component.reportBugForm.get('bugReporter');
    const bugStatusControl = component.reportBugForm.get('bugStatus');

    bugTitleControl.setValue('OurBug');
    expect(bugTitleControl.valid).toBeTruthy();

    bugDescriptionControl.setValue('TheBug');
    expect(bugDescriptionControl.valid).toBeTruthy();
    
    bugPriorityControl.setValue('1');
    expect(bugPriorityControl.valid).toBeTruthy();

    bugReporterControl.setValue('QA');
    expect(bugReporterControl.valid).toBeTruthy();

    // bugStatusControl.setValue('Done');
    // expect(bugStatusControl.valid).toBeTruthy();

    expect(component.reportBugForm.valid).toBeFalse();
  });

  it('form should be valid , qa selected and status entered', () => {
    const bugTitleControl = component.reportBugForm.get('bugTitle');
    const bugDescriptionControl = component.reportBugForm.get('bugDescription');
    const bugPriorityControl = component.reportBugForm.get('bugPriority');
    const bugReporterControl = component.reportBugForm.get('bugReporter');
    const bugStatusControl = component.reportBugForm.get('bugStatus');

    bugTitleControl.setValue('OurBug');
    expect(bugTitleControl.valid).toBeTruthy();

    bugDescriptionControl.setValue('TheBug');
    expect(bugDescriptionControl.valid).toBeTruthy();
    
    bugPriorityControl.setValue('1');
    expect(bugPriorityControl.valid).toBeTruthy();

    bugReporterControl.setValue('QA');
    expect(bugReporterControl.valid).toBeTruthy();

    bugStatusControl.setValue('Done');
    expect(bugStatusControl.valid).toBeTruthy();

    expect(component.reportBugForm.valid).toBeTruthy();
  });


});
