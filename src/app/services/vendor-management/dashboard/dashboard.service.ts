import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable()
export class DashboardService {
  api_url = environment.SERVER_URL;
  // api_url1: string = 'http://192.168.0.127:9006/api/';

  constructor(
    private http: HttpClient
  ) { }

  getFollowUps(team_flag?) {
    return this.http.get(this.api_url + 'dashboard/followups', {
      params: {
        team_flag: team_flag
      }
    });
  }

  getActivities(team_flag?) {
    return this.http.get(this.api_url + 'dashboard/Activities', {
      params: {
        team_flag: team_flag
      }
    });
  }

  getVendorPerformance(params) {
    return this.http.get(this.api_url + 'dashboard/stagePlotData', {
      params: params
    })
  }
  getApplicantDistribution(params) {
    return this.http.get(this.api_url + 'dashboard/ApplicantDistribution', {
      params: params
    })
  }
  getCVSource(params) {
    return this.http.get(this.api_url + 'dashboard/CVsourcedataset', {
      params: params
    })
  }
  getAllCount(team_flag, time_type?) {
    return this.http.get(this.api_url + 'dashboard/allCounts', {
      params: {
        team_flag: team_flag,
      }
    })
  }
  getTopPerformers() {
    return this.http.get(this.api_url + 'dashboard/top3member', {
    })
  }


  // getDashboardCount(obj) {
  //   return this.http.post(this.api_url + 'ReqResume/DashboardCountTIAA',obj);
  // }
  getDashboardMaster() {
    return this.http.get(this.api_url + 'Dashboard/Master');

  }
  getDashboardCount(obj) {
    return this.http.post(this.api_url + 'ReqResume/DashboardCountTIAA', obj)
  }
  getDynamicCharts(url, params) {
    return this.http.get(this.api_url + url, { params: params });
  }

  getDashboardPlotMaster(params?) {
    return this.http.get(this.api_url + 'dashboard/getDashboardTemplateDetails', { params: params })
  }   

}
