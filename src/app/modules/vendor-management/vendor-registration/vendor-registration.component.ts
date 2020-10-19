import { Component, OnInit, ChangeDetectorRef, OnChanges } from '@angular/core';
import { VendorRegistrationService } from 'src/app/services/vendor-management/workbench/registration-vendor/vendor-registration.service';
import { jsonParse } from 'src/app/app.component';
import { prepareSections, checkActiveSection, prepareSectionData } from 'src/app/controls/components/dynamic-form/dynamic-form.component';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SessionService } from '../../login/services/session/session.service';

@Component({
  selector: 'app-vendor-registration',
  templateUrl: './vendor-registration.component.html',
  styleUrls: ['./vendor-registration.component.scss'],
  providers: [VendorRegistrationService]
})
export class VendorRegistrationComponent implements OnInit, OnChanges {
  section_data: any = [];
  display_type;
  is_new_tab = true;
  _registration_successful: boolean = false;
  registration_form: FormGroup = new FormGroup({});
  registration = {
    t_id: 0,
    form_code: 2003,
    masters: [],
    template_code: 0
  }
  other_data: any = {
    id: 0
  };
  public dataSavedRef: Function
  constructor(
    private vendor_registration_srv: VendorRegistrationService,
    private fb: FormBuilder,
    private change_detector: ChangeDetectorRef,
    private activated_route: ActivatedRoute,
    public _session: SessionService,
    private router: Router

  ) {
    this.dataSavedRef = this.dataSaved.bind(this);
  }

  ngOnInit(): void {
    this._session.getSession().subscribe(res => {
      console.log(res)
      if (res && res.access_token) {
        this.router.navigate(['/dashboard'])
      }
      else {
        this.activated_route.params.subscribe(res => {
          if (res['template_code']) {
            this.registration.template_code = res['template_code'];
            this.getDetails(res['template_code']);
          }
        })
      }
    })
    console.log('Registration loaded')
    // this.getDetails()

  }
  ngOnChanges() {

  }
  navigateToHome() {

  }

  getDetails(template_code?, t_id?, set_data_flag?) {
    this.vendor_registration_srv.getFormDetails({ form_code: 0, template_code: template_code, t_id: t_id || 0 }).subscribe(res => {
      if (!set_data_flag) {
        if (res && res['data'] && res['data'].details && res['data'].details.length) {
          this.section_data = this.parser(res['data'].details)[0].sections || [];
          this.display_type = this.parser(res['data'].details)[0].display_type_id;
          // this.is_new_tab = this.t_id;
          let virtual_scroll_fields = {}
          prepareSections(this.section_data, this.registration_form, this.section_data, this.registration.t_id, this.fb, this.display_type, virtual_scroll_fields);
          // console.log(virtual_scroll_fields);
          let master_obj = [];
          for (let i = 0; i < Object.keys(virtual_scroll_fields).length; i++) {
            let obj = {}
            let master_id = Object.keys(virtual_scroll_fields)[i];
            obj['master_id'] = master_id;
            obj['values'] = virtual_scroll_fields[master_id];
            master_obj.push(obj)
          }
          checkActiveSection(this.section_data, this.display_type);
          this.vendor_registration_srv.getFormMaster(master_obj, { form_code: 0, t_id: 0, template_code: template_code }).subscribe(masters => {
            if (masters && masters['data'])
              this.registration.masters = masters['data'].masters;
            // if (!this.t_id)
            //   this.getRequisitionList();
            // this.change_detector.detectChanges();
          });
          console.log(this.section_data);
        }
      }
      else {
        prepareSectionData(this.parser(res['data'].details)[0].sections, this.registration_form, this.section_data);
        checkActiveSection(this.section_data, this.display_type);
        console.log(this.section_data);
      }

      this.change_detector.detectChanges();
    })
  }

  dataSaved(id, response?, last_step_flag?) {
    console.log(id, last_step_flag)
    if (id) {
      this.other_data['id'] = id;
      this.registration.t_id = id;
      this.getDetails(this.registration.template_code, id, !last_step_flag);
      if (!last_step_flag) {
        this.is_new_tab = false;
      }
      else {
        if (response && response.status)
          this._registration_successful = true;
      }
    }

  }
  parser(section) {
    for (let i = 0; i < section.length; i++) {
      if (section[i] && section[i].data && typeof section[i].data == 'string') {
        while (typeof section[i].data != 'object') {
          section[i].data = jsonParse(section[i].data);
          // section[i].data.forEach(){

          // }
          for (let j = 0; j < section[i].data.length; j++) {
            let section_data = jsonParse(section[i].data[j]);
            if (section[i].multiple && !(section_data.t_id || section_data.random_id)) {
              section_data.random_id = Math.floor(Date.now() + Math.random() * 1000);
            }
          }
        }
      }
      if (section[i] && section[i].sections && typeof section[i].sections == 'string') {
        while (typeof section[i].sections != 'object') {
          section[i].sections = jsonParse(section[i].sections);
          console.log(section);

          if (section[i] && section[i].sections) {
            this.parser(section[i].sections);
          }
        }
      }
    }
    return section;
    // else {
    //   return section;
    // }
  }

}
