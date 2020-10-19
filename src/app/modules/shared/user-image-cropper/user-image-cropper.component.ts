import { Component, OnInit, Input } from '@angular/core';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-user-image-cropper',
  templateUrl: './user-image-cropper.component.html',
  styleUrls: ['./user-image-cropper.component.scss']
})
export class UserImageCropperComponent implements OnInit {
  ngOnInit() {
  }
  @Input() croppedImage;
  @Input() aspectRatio;
  @Input() crop_flag;
  @Input() image_src;
  @Input() imageChangedEvent;
  constructor(public activeModal: NgbActiveModal) { }
  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;

  }
  imageLoaded() {
    // show cropper
  }
  cropperReady() {
    // cropper ready
  }
  loadImageFailed() {
    // show message
  }

}


