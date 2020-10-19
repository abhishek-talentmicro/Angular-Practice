import { MatDialogModule } from '@angular/material/dialog';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from './components/button/button.component';
import { CheckboxComponent } from './components/checkbox/checkbox.component';
import { DateFormatComponent } from './components/date/date.component';
import { DatePickerComponent } from './components/date-picker/date-picker.component';
import { DateTimePickerComponent } from './components/date-time-picker/date-time-picker.component';
import { DynamicSectionComponent, DynamicFieldConditionCheckPipe, DynamicFieldMasterTitle, DynamicFilesTitlePipe, PhoneNumberPipe, VerifyCheck, DynamicFieldProcessingPipe, AddNgStylePipe, DecodeHTML } from './components/dynamic-section/dynamic-section.component';
import { DynamicFormComponent, DynamicSectionConditionCheckPipe, FetchColumnsFromFields, DynamicFieldsMasterTitle, DynamicFieldsMasterTitleTable, JSONParser, HTMLFormatter, JSONParserAssign, HideOption } from './components/dynamic-form/dynamic-form.component';
import { FilesComponent } from './components/files/files.component';
import { FilesModalComponent } from './components/files-modal/files-modal.component';
import { MatSelectSearchComponent } from './components/mat-select-search/mat-select-search.component';
import { NumberComponent } from './components/number/number.component';
import { PasswordComponent } from './components/password/password.component';
import { RadioComponent } from './components/radio/radio.component';
import { SliderRangeComponent } from './components/slider-range/slider-range.component';
import { TallintTableComponent, TallintTableRowComponent, TableRowCSS, CheckGridConditions, SafeHtmlPipe } from './components/tallint-table/tallint-table.component';
import { TextComponent } from './components/text/text.component';
import { TextareaComponent } from './components/textarea/textarea.component';
import { TmMultiSelectComponent } from './components/tm-multi-select/tm-multi-select.component';
import { TMSelectComponent } from './components/tm-select/tm-select.component';
import { ToggleComponent } from './components/toggle/toggle.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SliderComponent } from './components/slider/slider.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ErrorStateMatcher, ShowOnDirtyErrorStateMatcher, DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { MatExpansionModule } from '@angular/material/expansion';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { ImageCropperComponent } from './components/image-cropper/image-cropper.component';
import { ImageCropperModule } from 'ngx-image-cropper';
import { HTMLTextEditorComponent } from './components/html-text-editor/html-text-editor.component';
import { ColumnDetailsComponent } from './components/tallint-table/column-details/column-details.component';
import { PhoneNumberComponent } from './components/phone-number/phone-number.component';
import { MatDatetimepickerModule, MatNativeDatetimeModule, MAT_DATETIME_FORMATS } from '@mat-datetimepicker/core';
import { MomentDateModule, MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS, MAT_MOMENT_DATE_FORMATS } from '@angular/material-moment-adapter';
import { TimelineComponent } from './components/timeline/timeline.component';
import { EmailsComponent } from './components/emails/emails.component';
import { AttachmentsViewComponent } from './components/attachment-view/attachment-view.component';
import { DocumentViewPopupComponent } from './components/document-view-popup/document-view-popup.component';
import { ContactUsComponent } from './components/contact-us/contact-us.component';
import { SafeFilePipe, evalPipe, SanitizePipe } from '../pipes/shared/SafeFilePipe';
import { EmailModelViewComponent } from './components/emails/email-model-view/email-model-view.component';
import { UTCtoLocalPipe } from '../pipes/shared/utc-to-local/utc-to-local';
import { TmBasicSelectComponent } from './components/tm-basic-select/tm-basic-select.component';
import { AssessmentComponent } from './components/assessment/assessment.component';
import { ViewAssessmentsComponent } from './components/assessment/view-assessments/view-assessments.component';
import { FileViewerComponent } from './components/file-viewer/file-viewer.component';
import { TableComponent } from './components/table/table.component';
// import {NgcFloatButtonModule} from 'ngc-float-button';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { DOMHandlerDirective } from './directives/DOMhandler.directive';
import { LoaderModule } from '../modules/loader/loader.module';
import { DestoryDirective, ContextMenuDirective } from './directives/onDestroy.directive';
import { RatingComponent } from './components/rating/rating.component';
import { MatMenuModule } from '@angular/material/menu';
import { NestedCommandsComponent } from './components/dynamic-form//nested-commands/nested-commands.component';
import { CustomControlComponent } from './components/phone-number/custom-control/custom-control.component';
import { PortalModule } from '@angular/cdk/portal';
import { TMPaginationComponent } from './components/tm-pagination/tm-pagination.component';

@NgModule({
  declarations: [
    ButtonComponent,
    CheckboxComponent,
    DateFormatComponent,
    DatePickerComponent,
    DateTimePickerComponent,
    // DynamicSectionModalComponent,
    DynamicFormComponent,
    FilesComponent,
    FilesModalComponent,
    VerifyCheck,
    ImageCropperComponent,
    MatSelectSearchComponent,
    NumberComponent,
    PasswordComponent,
    RadioComponent,
    SliderComponent,
    SliderRangeComponent,
    TallintTableComponent,
    TallintTableRowComponent,
    TextComponent,
    TextareaComponent,
    TmMultiSelectComponent,
    TMSelectComponent,
    ToggleComponent,
    HTMLTextEditorComponent,
    DynamicFieldConditionCheckPipe,
    DynamicFilesTitlePipe,
    DynamicFieldMasterTitle,
    DynamicSectionConditionCheckPipe,
    FetchColumnsFromFields,
    DynamicFieldsMasterTitle,
    TmBasicSelectComponent,
    DynamicSectionComponent,
    FilesComponent,
    ColumnDetailsComponent,
    PhoneNumberComponent,
    DynamicFieldsMasterTitleTable,
    PhoneNumberPipe,
    JSONParser,
    JSONParserAssign,
    TableRowCSS,
    CheckGridConditions,
    TimelineComponent,
    AttachmentsViewComponent,
    EmailsComponent,
    DocumentViewPopupComponent,
    ContactUsComponent,
    HTMLFormatter,
    SafeFilePipe,
    EmailModelViewComponent,
    UTCtoLocalPipe,
    SafeHtmlPipe,
    AssessmentComponent,
    ViewAssessmentsComponent,
    FileViewerComponent,
    TableComponent,
    // DynamicSectionsComponent
    DOMHandlerDirective,
    HideOption,
    DynamicFieldProcessingPipe,
    AddNgStylePipe,
    DecodeHTML,
    DestoryDirective,
    ContextMenuDirective,
    RatingComponent,
    evalPipe,
    SanitizePipe,
    NestedCommandsComponent,
    CustomControlComponent,
    TMPaginationComponent,
    // TableFiltersComponent,
    // CustomDatePipe
    // DynamicSectionsComponent

  ],
  imports: [
    CommonModule,
    FormsModule,
    MatMenuModule,
    ReactiveFormsModule,
    MatInputModule,
    ImageCropperModule,
    MatExpansionModule,
    // Ng5SliderModule,
    MatSelectModule,
    MatDatepickerModule,
    MatTabsModule,
    MatStepperModule,
    MatIconModule,
    ScrollingModule,
    MatRadioModule,
    MatSliderModule,
    MatCheckboxModule,
    MatSlideToggleModule,
    MatDialogModule,
    MatListModule,
    MomentDateModule,
    MatCardModule,
    MatDatetimepickerModule,
    MatNativeDatetimeModule,
    AngularEditorModule,
    LoaderModule,
    // NgcFloatButtonModule,

    TranslateModule.forChild({
      // loader: {
      //   provide: TranslateLoader,
      //   useFactory: HttpLoaderFactory,
      //   deps: [HttpClient]
      // }
    }),
    MatTooltipModule,
    DragDropModule,
    MatButtonModule,
    PortalModule

  ],
  exports: [
    TMSelectComponent,
    ButtonComponent,
    CheckboxComponent,
    DateFormatComponent,
    DatePickerComponent,
    DateTimePickerComponent,
    DynamicSectionComponent,
    // DynamicSectionsComponent,
    // DynamicSectionModalComponent,
    DynamicFormComponent,
    FilesComponent,
    FilesModalComponent,
    ImageCropperComponent,
    MatSelectSearchComponent,
    NumberComponent,
    PasswordComponent,
    RadioComponent,
    SliderComponent,
    SliderRangeComponent,
    TallintTableComponent,
    TallintTableRowComponent,
    TextComponent,
    TextareaComponent,
    TmMultiSelectComponent,
    ToggleComponent,
    DynamicFieldConditionCheckPipe,
    HTMLTextEditorComponent,
    DynamicFieldMasterTitle,
    DynamicSectionConditionCheckPipe,
    DynamicFilesTitlePipe,
    FetchColumnsFromFields,
    DynamicFieldsMasterTitle,
    FilesComponent,
    AttachmentsViewComponent,
    ColumnDetailsComponent,
    PhoneNumberComponent,
    DynamicFieldsMasterTitleTable,
    PhoneNumberPipe,
    JSONParser,
    JSONParserAssign,
    TimelineComponent,
    HTMLFormatter,
    SafeFilePipe,
    DynamicFieldProcessingPipe,
    EmailsComponent,
    UTCtoLocalPipe,
    TmBasicSelectComponent,
    ViewAssessmentsComponent,
    AssessmentComponent,
    FileViewerComponent,
    TableComponent,
    AngularEditorModule,
    DOMHandlerDirective,
    DestoryDirective,
    ContextMenuDirective,
    RatingComponent,
    evalPipe,
    AddNgStylePipe,
    SanitizePipe,
    NestedCommandsComponent,
    TMPaginationComponent,

  ],
  entryComponents: [
    ColumnDetailsComponent,
    DocumentViewPopupComponent,
    EmailModelViewComponent,
    ViewAssessmentsComponent,
    FileViewerComponent,
    DynamicSectionComponent,
    // TableFiltersComponent
  ],
  providers: [
    HTMLFormatter, TranslateService, SanitizePipe,

    { provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher },
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: false } },
    {
      provide: MAT_DATETIME_FORMATS,
      useValue: {
        useUtc: false,
        parse: {
          datetimeInput: { year: "numeric", month: "short", day: "2-digit", hour: "2-digit", minute: "2-digit" },
          useUtc: false
        },
        display: {
          dateInput: { year: "numeric", month: "2-digit", day: "2-digit" },
          monthInput: { month: "long" },
          datetimeInput: { year: "numeric", month: "short", day: "2-digit", hour: "2-digit", minute: "2-digit" },
          timeInput: { hour: "2-digit", minute: "2-digit" },
          monthYearLabel: { year: "numeric", month: "short" },
          dateA11yLabel: { year: "numeric", month: "long", day: "numeric" },
          monthYearA11yLabel: { year: "numeric", month: "long" },
          popupHeaderDateLabel: { weekday: "short", month: "short", day: "2-digit" }
        },

      }
    },
    // {
    //   provide: DateAdapter,
    //   useClass: MomentDateAdapter
    // }
  ]
})



// { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }

export class DynamicControlsModule { }
