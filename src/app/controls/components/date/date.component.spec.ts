import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DateFormatComponent } from './date.component';


describe('DateFormatComponent', () => {
  let component: DateFormatComponent;
  let fixture: ComponentFixture<DateFormatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DateFormatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DateFormatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
