import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResumeImportComponent } from './resume-import.component';

describe('ResumeImportComponent', () => {
  let component: ResumeImportComponent;
  let fixture: ComponentFixture<ResumeImportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResumeImportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResumeImportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
