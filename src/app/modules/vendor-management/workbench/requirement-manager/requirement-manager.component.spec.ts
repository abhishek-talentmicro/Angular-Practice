import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RequirementManagerComponent } from './requirement-manager.component';


describe('DynamicTabComponent', () => {
  let component: RequirementManagerComponent;
  let fixture: ComponentFixture<RequirementManagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequirementManagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequirementManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
