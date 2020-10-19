import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportConfirmationComponent } from './export-confirmation.component';

describe('ExportConfirmationComponent', () => {
  let component: ExportConfirmationComponent;
  let fixture: ComponentFixture<ExportConfirmationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExportConfirmationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
