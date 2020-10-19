import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResumeNotesComponent } from './resume-notes.component';

describe('ResumeNotesComponent', () => {
  let component: ResumeNotesComponent;
  let fixture: ComponentFixture<ResumeNotesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResumeNotesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResumeNotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
