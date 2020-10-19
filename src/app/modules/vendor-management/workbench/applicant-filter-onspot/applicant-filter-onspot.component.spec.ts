import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicantFilterOnspotComponent } from './applicant-filter-onspot.component';

describe('ApplicantFilterOnspotComponent', () => {
  let component: ApplicantFilterOnspotComponent;
  let fixture: ComponentFixture<ApplicantFilterOnspotComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApplicantFilterOnspotComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicantFilterOnspotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
