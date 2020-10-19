import { NgModule } from '@angular/core';
import { FilterPipe } from './pipes/shared/filter-pipe/filter.pipe';
import { LanguagePipe } from './pipes/shared/language.pipe';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { GetTitlePipe } from './modules/vendor-management/workbench/workbench-home/workbench-home.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { ImageCropperModule } from 'ngx-image-cropper';

// export function HttpLoaderFactory(http: HttpClient) {
//     return new TranslateHttpLoader(http, environment.SERVER_URL + 'Labels/GetConfigLabel?module_code=11&lng_id=', '');
// }

@NgModule({
    declarations: [
        FilterPipe,
        LanguagePipe,
        GetTitlePipe,
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        CKEditorModule,
        ImageCropperModule
    ],
    exports: [
        FilterPipe,
        LanguagePipe,
        GetTitlePipe,
    ]
})

export class SharedModule { }
