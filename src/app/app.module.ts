import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { LoginModule } from './modules/login/login.module';
import { LoaderModule } from './modules/loader/loader.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularMaterialModule } from './material.module';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { DynamicControlsModule } from './controls/dynamic-controls.module';
import { HeaderComponent } from './modules/header/header.component';
import { timeAgo } from './pipes/shared/date/dateformat';
import { WorkbenchComponent } from './modules/vendor-management/workbench/workbench.component';
import { ApplicantFilterOnspotComponent } from './modules/vendor-management/workbench/applicant-filter-onspot/applicant-filter-onspot.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ApplicantDetailsComponent } from './modules/vendor-management/workbench/applicant-details/applicant-details.component';
import { ApplicantAttachmentsComponent } from './modules/vendor-management/workbench/applicant-attachments/applicant-attachments.component';
import { DynamicModalComponent } from './modules/vendor-management/workbench/dynamic-modal/dynamic-modal.component';
import { RequirementFilterComponent } from './modules/vendor-management/workbench/requirement-filter/requirement-filter.component';
import { RequirementFilterOnspotComponent } from './modules/vendor-management/workbench/requirement-filter-onspot/requirement-filter-onspot.component';
import { NotesComponent } from './modules/vendor-management/workbench/requirement-manager/notes/notes.component';
import { RequirementManagerComponent } from './modules/vendor-management/workbench/requirement-manager/requirement-manager.component';
import { ResumeNotesComponent } from './modules/vendor-management/workbench/resume-create/resume-notes/resume-notes.component';
import { ResumeCreateComponent } from './modules/vendor-management/workbench/resume-create/resume-create.component';
import { SocialMediaShareComponent } from './modules/vendor-management/workbench/social-media-share/social-media-share.component';
import { WorkbenchHomeComponent } from './modules/vendor-management/workbench/workbench-home/workbench-home.component';
import { SharedModule } from './shared.module';
import { ConfirmationComponent } from './modules/shared/confirmation/confirmation.component';
import { RequirementStatusComponent } from './modules/vendor-management/workbench/requirement-manager/requirement-status/requirement-status.component';
import { ExportConfirmationComponent } from './modules/shared/export-confirmation/export-confirmation.component';
import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { CustomTimeComponent } from './modules/dashboard/custom-time/custom-time.component';
import { ProfileSettingsComponent } from './modules/shared/profile-settings/profile-settings.component';
import { UserImageCropperComponent } from './modules/shared/user-image-cropper/user-image-cropper.component';
import { ImageCropperModule } from 'ngx-image-cropper';
import { ResumeImportComponent } from './modules/vendor-management/workbench/resume-import/resume-import.component';
import { CommonValuePopupComponent } from './modules/vendor-management/workbench/resume-import/common-value-popup/common-value-popup.component';
import { VendorRegistrationComponent } from './modules/vendor-management/vendor-registration/vendor-registration.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    WorkbenchComponent,
    timeAgo,
    ApplicantFilterOnspotComponent,
    ApplicantAttachmentsComponent,
    ApplicantDetailsComponent,
    DynamicModalComponent,
    RequirementFilterComponent,
    RequirementFilterOnspotComponent,
    NotesComponent,
    RequirementManagerComponent,
    ResumeNotesComponent,
    ResumeCreateComponent,
    SocialMediaShareComponent,
    ConfirmationComponent,
    RequirementStatusComponent,
    ExportConfirmationComponent,
    WorkbenchHomeComponent,
    DashboardComponent,
    CustomTimeComponent,
    ProfileSettingsComponent,
    UserImageCropperComponent,
    ResumeImportComponent,
    CommonValuePopupComponent,
    VendorRegistrationComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    AppRoutingModule,
    LoaderModule,
    BrowserAnimationsModule,
    LoginModule,
    AngularMaterialModule,
    LoaderModule,
    NgbModule,
    FormsModule,
    DynamicControlsModule,
    HttpClientModule,
    ImageCropperModule,

    TranslateModule.forRoot({
      // loader: {
      //   provide: TranslateLoader,
      //   useFactory: HttpLoaderFactory,
      //   deps: [HttpClient]
      // }
    })
  ],
  providers: [],
  entryComponents: [RequirementFilterComponent, DynamicModalComponent,
    CommonValuePopupComponent
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }

