import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HTMLTextEditorComponent } from './html-text-editor.component';

describe('HTMLTextEditorComponent', () => {
  let component: HTMLTextEditorComponent;
  let fixture: ComponentFixture<HTMLTextEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HTMLTextEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HTMLTextEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
