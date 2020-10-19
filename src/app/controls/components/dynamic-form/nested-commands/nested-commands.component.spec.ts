import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NestedCommandsComponent } from './nested-commands.component';

describe('NestedCommandsComponent', () => {
  let component: NestedCommandsComponent;
  let fixture: ComponentFixture<NestedCommandsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NestedCommandsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NestedCommandsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
