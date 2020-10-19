import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AttachmentsViewComponent } from './attachment-view.component';


describe('ResumeComponent', () => {
  let component: AttachmentsViewComponent;
  let fixture: ComponentFixture<AttachmentsViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AttachmentsViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttachmentsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
