import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';

@Component({
  selector: 'tm-pagination',
  templateUrl: './tm-pagination.component.html',
  styleUrls: ['./tm-pagination.component.scss']
})
export class TMPaginationComponent implements OnInit, OnChanges {
  //Total entries
  @Input() collectionSize;
  //currentPage              
  @Input() page;
  //Number of enteries in the page   
  @Input() pageSize;
  // //Pagination row Display size                             
  // @Input() size;

  // No of page_links                     
  @Input() maxSize ;
  @Output() pageChange = new EventEmitter();


  total_pages;
  active_page_group_start_number = 1;
  page_group_size_arr;

  constructor() { }
  ngOnInit(): void {
    this.init();
  }

  ngOnChanges(ev) {
    if (ev && !ev.page) {
      this.init();
    }
  }

  init() {
    this.collectionSize = this.collectionSize ? (this.collectionSize > this.pageSize ? this.collectionSize : this.pageSize) : null;
    this.page = this.page ? this.page : 1;
    this.maxSize  = this.maxSize  ? this.maxSize  : 3;
    this.pageSize = this.pageSize ? this.pageSize : 100;
    if(this.collectionSize){
      this.calculateNoOfPages();
    }
    this.active_page_group_start_number = (this.page + this.maxSize  > this.total_pages) ? (this.total_pages - this.maxSize ) : this.page;
  }

  //Calculates tottal number of pages; 
  calculateNoOfPages() {
    if (this.collectionSize && this.pageSize && this.maxSize ) {
      this.total_pages = Math.ceil(this.collectionSize / this.pageSize);
    }
    this.page_group_size_arr = []
    for (let i = 0; i < this.maxSize ; i++) {
      this.page_group_size_arr.push(i);
    }
  }

  //Navigate to previous batch
  prevBatch() {
    if (this.active_page_group_start_number - (this.maxSize ) < (0)) {
      this.active_page_group_start_number = 1;
    }
    else {
      if (this.active_page_group_start_number - this.maxSize  > 0) {
        this.active_page_group_start_number -= this.maxSize ;
      } else {
        this.active_page_group_start_number = 1;
      }
    }
  }

  //Emits selected page number
  selectedPage(page_no, select_group?) {
    this.page = page_no;
    if (select_group) {
      this.selectedGroup()
    }
    this.pageChange.emit(this.page);
  }

  //Navigate to previous batch
  nextBatch() {
    if ((this.active_page_group_start_number + this.maxSize ) < this.total_pages) {
      this.active_page_group_start_number += this.maxSize ;
    }
    else {
      this.active_page_group_start_number -= (this.active_page_group_start_number + this.maxSize ) - this.total_pages;
    }
  }
  //check selected group
  selectedGroup() {
    for (let i = 0; i < this.page_group_size_arr.length; i++) {
      if ((this.active_page_group_start_number + this.page_group_size_arr[i]) == this.page) {
        return
      }
      else {
        this.active_page_group_start_number = this.page - this.maxSize  > 0 ? this.page - this.maxSize  : 1;
      }
    }
  }

}
  // ngOnInit(): void {
  //   this.collectionSize = 1000;
  //   this.page = 1;
  //   this.pageSize = 10;
  //   this.maxSize  = 2;
  //   this.page_group_size_copy = this.maxSize ;
  //   this.calculateNoOfPages();
  // }

  // calculateNoOfPages() {
  //   if (this.collectionSize && this.pageSize && this.maxSize ) {
  //     let total_pages = this.collectionSize / this.pageSize;
  //     this.total_pages = [];
  //     for (let i = 0; i < total_pages; i++) {
  //       this.total_pages.push(i + 1);
  //     }
  //   }
  //   this.calculatePageGroupBasedOnPage()
  // }
  // calculatePageGroupBasedOnPage() {
  //   this.active_page_group_start_index = this.page - 1;
  //   this.checkForLastGroup();
  // }
  // nextBatch() {

  //   //If seleted group size is less than total_page size
  //   if ((this.active_page_group_start_index + this.maxSize ) < this.total_pages) {
  //     this.active_page_group_start_index += this.maxSize ;
  //     this.checkForLastGroup();
  //   }
  //   else {
  //     this.active_page_group_start_index -= (this.active_page_group_start_index + this.maxSize ) - this.total_pages;
  //   }


  // }

  // //active_page_group_start_index should not exceed length of total page array
  // checkForLastGroup() {
  //   if (this.active_page_group_start_index + 2 * (this.maxSize ) < (this.total_pages)) {
  //     this.page_group_size_copy = this.maxSize ;
  //   } else {
  //     this.page_group_size_copy = this.total_pages - this.active_page_group_start_index;
  //   }
  // }

  // checkForFirstGroup() {
  //   if (this.active_page_group_start_index - (this.maxSize ) < (0)) {
  //     this.page_group_size_copy += this.active_page_group_start_index
  //     this.active_page_group_start_index = 0;
  //   }
  //   else {
  //     this.page_group_size_copy = this.maxSize ;
  //   }
  // }

  // prevBatch() {
  //   if ((this.active_page_group_start_index - this.maxSize ) > 0) {
  //     this.active_page_group_start_index -= this.maxSize ;
  //     this.page_group_size_copy = this.maxSize 
  //     this.checkForFirstGroup();
  //   }
  //   else {
  //     this.active_page_group_start_index = 0;
  //   }
  // }

  // selectedPage(page_no, check_last_group?, check_first_group?) {
  //   this.page = page_no;


  //   if (check_last_group) {
  //     this.page_group_size_copy = this.maxSize 
  //     this.calculatePageGroupBasedOnPage()
  //   }
  //   if (check_first_group) {
  //     this.page_group_size_copy = this.maxSize 
  //     this.active_page_group_start_index = 0;
  //   }
  // }
// }
