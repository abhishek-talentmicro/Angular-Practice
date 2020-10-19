import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { MatDialogRef } from '@angular/material/dialog';
import { cloneArray } from 'src/app/functions/functions';

@Component({
  selector: 'app-image-preview',
  templateUrl: './image-cropper.component.html',
  styleUrls: ['./image-cropper.component.scss']
})
export class ImageCropperComponent implements OnInit {
  cropped_image = [];
  @Input() aspectRatio;
  @Input() crop_flag;
  @Input() image_src;
  @Input() prepend_path;
  image_src_base64 = [];
  ipadCroppedImage = [];
  index = 0;
  cropper_loaded = 0;
  display_cropped_image = 1;
  images_copy = [];

  constructor(
    private change_detector: ChangeDetectorRef,
    public dialogRef: MatDialogRef<ImageCropperComponent>
  ) { }

  ngOnInit() {
    this.images_copy = cloneArray(this.image_src);
    this.images_copy[this.index].base64 = this.images_copy[this.index].content
    console.log(this.image_src)
    // if (this.crop_flag) {
    //   this.getBase64(0);
    // }
    // if (this.prepend_path) {
    //   for (let i = 0; i < this.images_copy.length; i++) {
    //     this.images_copy[i] = 'https://storage.googleapis.com/nearkart/' + this.images_copy[i];
    //   }
    // }
  }

  imageCropped(event: ImageCroppedEvent, param?) {
    if (!param)
      this.images_copy[this.index].content = event.base64;
    else
      this.ipadCroppedImage[this.index] = event.base64;
    this.display_cropped_image = 0
    setTimeout(() => {
      this.display_cropped_image = 1
    }, 100);
  }
  imageLoaded() {
    // show cropper
    this.cropper_loaded = 1;
    this.change_detector.detectChanges();
  }
  cropperReady() {
    this.cropper_loaded = 1;
    // cropper ready
  }
  loadImageFailed() {
    // show message
  }

  // getBase64(index) {
  //   // return new Promise((resolve, reject) => {
  //   if (this.images_copy[index]) {
  //     const reader = new FileReader();
  //     reader.readAsDataURL(this.images_copy[index]);
  //     reader.onload = () => {
  //       if (index < this.images_copy.length) {
  //         this.images_copy_base64[index] = reader.result;

  //         index++;
  //         this.getBase64(index);
  //       }
  //     };
  //     reader.onerror = error => { error };
  //   }
  //   // })
  //   //   .then(function () {

  //   //   })
  //   //   .catch(function () {

  //   //   });
  // }

  changeIndex(param) {
    if (param == -1) {
      if (this.index > 0) {
        this.index--;
        this.images_copy[this.index].base64 = this.images_copy[this.index].content
      }
    }
    else if (param == 1) {
      if (this.index < this.images_copy.length - 1) {
        this.index++;
        this.images_copy[this.index].base64 = this.images_copy[this.index].content
      }
    }
  }

  removeImage() {



    if (this.images_copy)
      this.images_copy.splice(this.index, 1);
    // if (this.images_copy_base64)
    //   this.images_copy_base64.splice(this.index, 1);
    // if (this.cropped_image)
    //   this.cropped_image.splice(this.index, 1);
    if (this.index >= this.images_copy.length) {
      this.index--;
    }
  }

  closeModal(res) {
    this.dialogRef.close(res)
  }
}
