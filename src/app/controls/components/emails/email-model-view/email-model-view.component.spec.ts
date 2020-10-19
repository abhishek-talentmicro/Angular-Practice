import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailModelViewComponent } from './email-model-view.component';

describe('EmailModelViewComponent', () => {
  let component: EmailModelViewComponent;
  let fixture: ComponentFixture<EmailModelViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmailModelViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailModelViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
