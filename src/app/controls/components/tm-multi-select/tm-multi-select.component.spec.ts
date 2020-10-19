import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TmMultiSelectComponent } from './tm-multi-select.component';

describe('MultiSelectComponent', () => {
  let component: TmMultiSelectComponent;
  let fixture: ComponentFixture<TmMultiSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TmMultiSelectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TmMultiSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
