import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserImageCropperComponent } from './user-image-cropper.component';

describe('UserImageCropperComponent', () => {
  let component: UserImageCropperComponent;
  let fixture: ComponentFixture<UserImageCropperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserImageCropperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserImageCropperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
