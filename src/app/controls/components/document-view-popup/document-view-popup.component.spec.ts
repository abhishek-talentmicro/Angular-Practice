import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentViewPopupComponent } from './document-view-popup.component';

describe('DocumentViewPopupComponent', () => {
  let component: DocumentViewPopupComponent;
  let fixture: ComponentFixture<DocumentViewPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentViewPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentViewPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
