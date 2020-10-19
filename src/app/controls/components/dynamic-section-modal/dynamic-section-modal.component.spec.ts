import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicSectionModalComponent } from './dynamic-section-modal.component';

describe('DynamicSectionModalComponent', () => {
  let component: DynamicSectionModalComponent;
  let fixture: ComponentFixture<DynamicSectionModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DynamicSectionModalComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicSectionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
