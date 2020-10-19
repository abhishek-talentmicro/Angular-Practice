import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequirementFilterOnspotComponent } from './requirement-filter-onspot.component';

describe('RequirementFilterOnspotComponent', () => {
  let component: RequirementFilterOnspotComponent;
  let fixture: ComponentFixture<RequirementFilterOnspotComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequirementFilterOnspotComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequirementFilterOnspotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
