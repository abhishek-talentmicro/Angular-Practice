import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonValuePopupComponent } from './common-value-popup.component';

describe('CommonValuePopupComponent', () => {
  let component: CommonValuePopupComponent;
  let fixture: ComponentFixture<CommonValuePopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommonValuePopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonValuePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
