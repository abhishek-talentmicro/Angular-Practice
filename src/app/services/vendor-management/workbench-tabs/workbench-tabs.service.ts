import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WorkbenchTabsService {

  private workbench_tabs: any = {};
  private tab_subject: BehaviorSubject<any> = new BehaviorSubject(null);
  active_tab: BehaviorSubject<any> = new BehaviorSubject(null);
  constructor(
  ) {
    this.addFirstTab();
  }

  addFirstTab() {
    this.addTab('Home', 1, null, true);
  }

  getTabDetails(id) {
    return this.workbench_tabs[id];
  }

  addTab(title, type, data, status?) {
    let id = Date.now() + Math.ceil(Math.random() * 10000);
    if (!this.workbench_tabs[id]) {
      let tab = new WorkbenchTab();
      tab.setData(id, title, type, data);
      this.workbench_tabs[id] = tab;
      this.updateTabs();
      this.setActiveTab(id);
    }
    return id;
  }

  updateTabs() {
    this.tab_subject.next(this.workbench_tabs);
  }

  updateTabDetails(id, data) {
    if (this.workbench_tabs[id]) {
      this.workbench_tabs[id].updateData(data);
    }
    // this.updateTabs();
  }

  updateTabTitle(id, title) {
    if (this.workbench_tabs[id]) {

      this.workbench_tabs[id].updateTitle(title);

    }
    // this.updateTabs();
  }



  getWorkbenchTabs(): Observable<any> {

    return this.tab_subject.asObservable();
  }

  removeTab(id) {

    if (this.workbench_tabs[id]) {
      // this.workbench_tabs.splice(id, 1);
      delete (this.workbench_tabs[id]);
      this.updateTabs();
    }
  }

  resetTab(id) {
    if (this.workbench_tabs[id]) {
      this.workbench_tabs[id].data = undefined;
    }
  }

  setActiveTab(id?) {
    for (let tab of Object.keys(this.workbench_tabs)) {
      if (this.workbench_tabs[tab]) {
        this.workbench_tabs[tab].setTabStatus(false);
      }
    }
    if (!id) {
      id = Object.keys(this.workbench_tabs)[0];
    }
    if (this.workbench_tabs[id]) {
      this.workbench_tabs[id].setTabStatus(true);
    }
  }

  removeAllTabs() {
    this.workbench_tabs = {};
    this.addFirstTab();
  }

  setActiveTabFromOtherComponent(id) {
    this.active_tab.next(id);
  }
}

export class WorkbenchTab {
  id: string;
  title: string;
  type: number;
  data: any;
  active_tab: boolean;

  setData(id, title, type, data) {
    this.id = id;
    this.title = title;
    this.type = type;
    this.data = data;
  }

  updateData(data) {
    this.data = data;
  }

  setTabStatus(status) {
    this.active_tab = status;
  }

  updateTitle(title) {
    this.title = title;
  }
}
