import { Pipe, PipeTransform } from '@angular/core';
import { LanguageService } from 'src/app/services/shared/language/language.service';

/*
 Display the language title from language id/code
 {{value | language_title:exponent}}
*/
@Pipe({
    name: 'language_title'
})

export class LanguagePipe implements PipeTransform {
    constructor(private language: LanguageService) {

    }


    transform(value: number, exponent?: number): string {


        if (this.language && this.language.languages_list) {
            for (let i = 0; i < this.language.languages_list.length; i++) {
                if (this.language.languages_list[i].lng_id == value) {
                    return this.language.languages_list[i].lng_title;
                }
            }
        }
    }
}