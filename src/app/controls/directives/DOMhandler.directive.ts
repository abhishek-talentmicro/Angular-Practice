import { Directive, Input, ElementRef, SimpleChanges } from '@angular/core';
import { ProfileSettingsService } from 'src/app/services/shared/profile-settings/profile-settings.service';
import { cloneArray } from 'src/app/functions/functions';


@Directive({
    selector: '[DOMHandler]',
    exportAs: 'DOMHandler',
})
export class DOMHandlerDirective {
    @Input() list;
    @Input() size;
    @Input() queryList;
    display = [];
    chunks = [];
    n: number = 0;
    show_next = true;
    show_prev = false;


    constructor(public el: ElementRef) {}

    ngOnInit() {
    }
    ngOnChanges(changes: SimpleChanges): void {
        if (changes && changes.list) {
            this.listMaker()
        }
    }

    listMaker() {
        if (!this.size) {
            this.size = 50
        }

        if (this.list && this.list.length) {
            this.list.map((val, index) => {
                val['index'] = index;

            });
            if (this.list.length < this.size) {
                this.display = cloneArray(this.list);
            }
            else {

                //dividing chunks
                for (let i = 0; i < Math.ceil(this.list.length / this.size); i++) {
                    this.chunks.push(cloneArray(this.list.slice(i * this.size, (i + 1) * this.size)))
                }
                this.display = this.chunks[this.n];
            }
            this.makeVisible(this.display)
        }
    }

    makeVisible(arr) {
        arr.map((val) => {
            val['visible'] = true;
        })
    }

    next() {
        if (this.n < this.chunks.length) {
            this.display = this.chunks[++this.n];
            this.show_next = true;
        }

        this.buttonVisibility();

        try {
            setTimeout(() => {
                this.queryList['first'].nativeElement.scrollIntoView({behavior: "smooth", block: "end", inline: "nearest"});;
            })
        }
        catch (err) {

        }
    }


    prev() {
        if (this.n > 0) {
            this.display = this.chunks[--this.n];
        }

        this.buttonVisibility();

        try {
            setTimeout(() => {
                this.queryList['first'].nativeElement.scrollIntoView({behavior: "smooth", block: "end", inline: "nearest"});;
            })
        }
        catch (err) {

        }
    }

    selectChunk(index) {
        this.display = this.chunks[index];
        this.n = index;
        this.buttonVisibility();


        try {
            setTimeout(() => {
                this.queryList['first'].nativeElement.scrollIntoView({behavior: "smooth", block: "end", inline: "nearest"});;
            })
        }
        catch (err) {

        }
    }


    buttonVisibility() {

        if (this.n == this.chunks.length - 1) {
            this.show_next = false;
        }
        else {
            this.show_next = true;
        }
        if (this.n == 0) {
            this.show_prev = false;
        }
        else {
            this.show_prev = true;
        }
    }

    invalidField(field) {
        if (field && typeof field == 'object' && field.length) {
            if (field[0].field_id) {
                if (this.findChunk(field[0].field_id)) {
                    setTimeout(() => {
                        for (let i = 0; i < this.queryList['_results'].length; i++) {
                            let elementRef = this.queryList['_results'][i];
                            if (eval(elementRef.nativeElement.id) == (field[0].field_id)) {
                                elementRef.nativeElement.scrollIntoView({behavior: "smooth", block: "end", inline: "nearest"});
                            }
                        }
                    })
                }
            }
        }
    }

    findChunk(id) {
        for (let i = 0; i < this.chunks.length; i++) {
            let chunk = this.chunks[i];
            for (let j = 0; j < chunk.length; j++) {
                const field = chunk[j];
                if (field.field_id == id) {
                    this.n = i;
                    this.display = this.chunks[this.n];
                    this.buttonVisibility()
                    return true;
                }

            }

        }
        return false;
    }


    // @HostListener("scroll", ["$event"])
    // onWindowScroll(a) {
    //     // console.log(document.getElementById('40'))


    //     let element = document.getElementById(String(this.prev_id))
    //     let elementPosition = element.offsetTop;
    //     const elementHeight = a.srcElement.clientHeight;
    //     const scrollTop = a.srcElement.scrollTop;
    //     const scrollHeight = a.srcElement.scrollHeight
    //     let scrollPosition = ((a.srcElement.scrollTop / (a.srcElement.scrollHeight - a.srcElement.clientHeight)) * 100);
    //     // let scrollBottom = 

    //     if (scrollTop > this.lastScrollTop) {
    //         //for downward Scroll
    //         if (scrollTop > elementPosition || ((scrollHeight - elementHeight) == scrollTop)) {
    //             if (this.evenCheck(this.n)) {
    //                 this.display = cloneArray(this.list.slice((this.n / 2) * this.size, this.size * ((this.n / 2) + 1)));
    //                 this.prev_id = this.prev_id + 24;
    //             }
    //             else {
    //                 this.display = cloneArray(this.list.slice(((this.n - 1) / 2) * this.size, this.size * (Math.ceil(this.n / 2) + 1)));
    //                 this.prev_id = this.start_id;
    //                 this.prev_id = this.prev_id + this.size;
    //                 this.start_id = this.prev_id;

    //             }

    //             // this.makeVisible(this.display)
    //             this.n++;


    //         }
    //     }

    //     //for upward Scroll
    //     else {

    //         if (scrollTop < elementPosition && scrollPosition < 25) {
    //             this.n--;
    //             if (this.evenCheck(this.n)) {
    //                 this.display = cloneArray(this.list.slice((this.n / 2) * this.size, this.size * ((this.n / 2) + 1)));
    //                 this.prev_id = this.prev_id - this.size;
    //             }
    //             else {
    //                 this.display = cloneArray(this.list.slice(((this.n - 1) / 2) * this.size, this.size * (Math.ceil(this.n / 2) + 1)));
    //                 this.prev_id = this.prev_id - this.size;

    //             }

    //             // this.makeVisible(this.display)



    //         }
    //     }
    //     this.lastScrollTop = scrollTop;
    // }


    // evenCheck(number) {
    //     if (number % 2 == 0) {
    //         return true;
    //     }
    //     else {
    //         return false;
    //     }
    // }




    // track(ecv) {
    //     console.log(ecv)
    // }
}