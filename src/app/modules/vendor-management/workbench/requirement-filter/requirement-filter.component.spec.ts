import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequirementFilterComponent } from './requirement-filter.component';

describe('RequirementFilterComponent', () => {
  let component: RequirementFilterComponent;
  let fixture: ComponentFixture<RequirementFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequirementFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequirementFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
