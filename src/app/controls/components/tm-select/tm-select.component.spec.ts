import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TMSelectComponent } from './tm-select.component';

describe('TMSelectComponent', () => {
  let component: TMSelectComponent;
  let fixture: ComponentFixture<TMSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TMSelectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TMSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
