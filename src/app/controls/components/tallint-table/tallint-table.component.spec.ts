import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TallintTableComponent } from './tallint-table.component';

describe('TallintTableComponent', () => {
  let component: TallintTableComponent;
  let fixture: ComponentFixture<TallintTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TallintTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TallintTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
