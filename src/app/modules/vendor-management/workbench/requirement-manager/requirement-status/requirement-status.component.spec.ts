import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequirementStatusComponent } from './requirement-status.component';

describe('RequirementStatusComponent', () => {
  let component: RequirementStatusComponent;
  let fixture: ComponentFixture<RequirementStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequirementStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequirementStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
