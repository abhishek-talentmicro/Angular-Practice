import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TMPaginationComponent } from './tm-pagination.component';

describe('TmPaginationComponent', () => {
  let component: TMPaginationComponent;
  let fixture: ComponentFixture<TMPaginationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TMPaginationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TMPaginationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
