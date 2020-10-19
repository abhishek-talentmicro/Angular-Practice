import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TmBasicSelectComponent } from './tm-basic-select.component';

describe('TmBasicSelectComponent', () => {
  let component: TmBasicSelectComponent;
  let fixture: ComponentFixture<TmBasicSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TmBasicSelectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TmBasicSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
