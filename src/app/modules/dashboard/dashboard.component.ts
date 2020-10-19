import { Component, OnInit, AfterViewInit, OnDestroy, NgZone } from '@angular/core';
import { trigger, style, transition, animate } from '@angular/animations';
import { DashboardService } from 'src/app/services/vendor-management/dashboard/dashboard.service';
import { DashboardNavigationService } from 'src/app/services/shared/dashboard-navigation/dashboard-navigation.service';
import { MatDialog } from '@angular/material/dialog';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { CustomTimeComponent } from './custom-time/custom-time.component';
import * as am4plugins_forceDirected from "@amcharts/amcharts4/plugins/forceDirected";
import { FormGroup, FormControl } from '@angular/forms';


declare const $: any;
declare interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
  display_title: boolean
}
export const ROUTES: RouteInfo[] = [
  { path: '/dashboard', title: 'Dashboard', icon: 'dashboard', class: 'wpx-73', display_title: false },
  // { path: '/dashboard', title: 'User', icon: 'user', class: 'wpx-73', display_title: false },
  // { path: '/dashboard', title: 'History', icon: 'book', class: 'wpx-73', display_title: false },
  // // {path: '/icons', title: 'Lead', icon: 'user-secret', class: ''},
  // { path: '/dashboard', title: 'Notifications', icon: 'bell', class: 'wpx-73', display_title: false },

];
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  providers: [DashboardService,
  ],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ width: '0px', overflow: 'hidden' }),
        animate('180ms ease-in', style({ width: '132px' }))
      ]),
      transition(':leave', [
        animate('100ms ease-in', style({ width: '0px', overflow: 'hidden' }))
      ])
    ])
  ]
})
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {


  follow_up_show;
  acivities_show;
  performance_show;
  recruiter_performance;
  applicant_distribution;
  cv_source = [];
  all_count = [];
  top_performers = [];
  team_type = 3;
  team_title = "All";
  time_title = "Week";
  time_type = 1;
  menuItems: any[];
  team_hover = false;
  time_hover = false;
  htmlContent;
  current_btn: number = 0;
  color = "";
  dashboard = {
    from: null,
    to: null
  }
  charts_ref = []
  dash_form = new FormGroup({
    notes: new FormControl(null)
  });
  all_counts = new AllCount();

  // charts 
  recruiter_performance_chart;
  cv_source_chart;
  top_performance_chart;
  dynamic_div_track = [];

  Buttons = [{
    title: 'Week',
    time_type: 1
  },
  {
    title: 'Month',
    time_type: 2
  },
  {
    title: 'Quarter',
    time_type: 3
  },
  {
    title: 'Year',
    time_type: 4
  },
  {
    title: 'Custom',
    time_type: 5
  }
  ]

  team_buttons = [{
    title: 'Myself',
    team_type: 1
  },
  {
    title: 'My Team',
    team_type: 2
  },
  {
    title: 'All',
    team_type: 3
  },
  ]

  cards = [{
    header_title: 'Requirement',
    count: 0,
    footer_title: 'Requirements assigned to you',
    style: { 'background-color': '#f2fcfe', 'background-image': 'linear-gradient(315deg, #f2fcfe 0%, #1c92d2 100%)' },
    icon_src: 'assets/dashboard/Requirement.svg',
    svg_filter: 'invert(0.3) sepia(1) saturate(5) hue-rotate(175deg)',
    function_name: 'setDashboardRequirementFlag',
    property: 'Requirement Count',
    code: 0,
    count_type: 'number',
  },
  {
    header_title: 'Applicants',
    count: 0,
    footer_title: 'Applicants in your basket',
    style: { 'background-color': '#fff2f9', 'background-image': 'linear-gradient(315deg, #fff2f9 0%, #e82390 74%)' },
    icon_src: 'assets/dashboard/applicants.svg',
    function_name: 'setDashboardApplicantFlag',
    svg_filter: 'invert(0.3) sepia(1) saturate(5) hue-rotate(275deg)',
    property: 'Applicant Count',
    code: 0,
    count_type: 'number'


  },
  {
    header_title: 'Target Positions',
    count: 0,
    footer_title: 'Position Target VS Achievement',
    style: { 'background-color': '#fff5ff', 'background-image': 'linear-gradient(315deg, #fff5ff 0%, #c914c3 74%)' },
    icon_src: 'assets/dashboard/target_positions.svg',
    svg_filter: 'invert(0.3) sepia(1) saturate(5) hue-rotate(590deg)',
    param: null,
    property: 'rate',
    code: 0,
    count_type: 'percentage'
  },
  {
    header_title: 'Performance',
    count: 0,
    footer_title: 'Joinings VS Screenings',
    style: { 'background-color': '#e5e9ff', 'background-image': 'linear-gradient(315deg, #e5e9ff 0%, #0d32ff 74%)' },
    icon_src: 'assets/dashboard/Performance.svg',
    svg_filter: 'invert(0.3) sepia(1) saturate(5) hue-rotate(892deg)',
    param: null,
    property: 'Performance',
    code: 0,
    count_type: 'string'

  },

  ];

  charts = [{
    chart_type: 1,
    title: 'Recruiter Performance',
    width: 12,
    url: 'dashboard/stagePlotData',
    style: 'z-index:5;font-size:12px;height:241px',
    div_class: '',
    card_class: ''
  },
  {
    chart_type: 2,
    title: 'CV Source',
    width: 6,
    url: 'dashboard/CVsourcedataset',
    style: 'z-index:1;font-size:12px;height:192px',
    div_class: 'pr-0',
    card_class: 'border-top-0'
  },
  {
    chart_type: 3,
    title: 'Top Performers',
    width: 6,
    url: 'dashboard/top3member',
    style: 'z-index:1;font-size:12px;height:192px',
    div_class: 'pl-0',
    card_class: 'border-top-0 border-left-0'
  }];
  summary = [{
    summary_type: 1,
    title: 'Follow-ups',
    url: 'dashboard/followups',
    code: '',
    params: 1,
    data_list: [],
    height: '180px'
  },
  {
    summary_type: 2,
    title: 'Activities',
    url: 'dashboard/activities',
    code: '',
    params: 2,
    data_list: [],
    height: '180px'
  },
  ]

  current_section: any = {}

  template;

  constructor(private zone: NgZone,
    private dashborad_service: DashboardService,
    private dashboard_routing_srv: DashboardNavigationService,
    private dilaog: MatDialog
  ) { }
  follow_up_list = [];
  activities_list = [];
  ngOnInit() {

    this.dashborad_service.getDashboardPlotMaster().subscribe(res => {
      let temp = res['data'];
      this.parseStyleOnly(temp);
      this.template = temp;
      this.current_section = this.template[0];
      this.getAPIData();

    })
    this.menuItems = ROUTES.filter(menuItem => menuItem);

    // this.plotForceDirectedGraph({ style: 'height : 100vh', width: 12, title: 'Force directed grap' }, []);
  }

  ngOnDestroy() {
    try {
      // this.recruiter_performance_chart.clear();
      this.charts_ref.forEach(chart => {
        chart.dispose();
      })
      am4core.disposeAllCharts();
    }
    catch (err) {
      console.log(err);

    }

  }
  isObject(obj) {
    console.log(obj)
    if (typeof obj == "object") {
      return true;
    }
    else {
      return false;
    }
  }


  getAPIData() {
    try {
      // this.recruiter_performance_chart.clear();
      this.charts_ref.forEach(chart => {
        chart.dispose();
      })
      am4core.disposeAllCharts();
    }
    catch (err) {
      console.log(err);

    }
    this.removeDivRecursion(0)
    this.all_counts.target_positions = 0;
    this.all_counts.applicant_count = 0;
    this.all_counts.requirement_count = 0;
    this.all_counts.performance = 0;
    this.loadRecursiveTasks(0);
    if (this.current_section && this.current_section.summary && this.current_section.summary.length) {
      this.loadSummary(this.current_section.summary[0])
    }
    else {
      this.loadSummary(null)
    }
    this.loadChartsRecursive(0);
  }
  loadChartsRecursive(n) {
    let l = this.current_section.reports.length;
    if (n < l) {
      try {
        this.dashborad_service.getDynamicCharts(this.current_section.reports[n].url, { team_type: this.team_type, time_type: this.time_type, from: this.dashboard.from, to: this.dashboard.to }).subscribe(res => {
          if (this.current_section.reports[n].chart_type == 1000) { //XY chart(series chart)
            if (res && res['data']) {
              this.plotXYChart(this.current_section.reports[n], res['data'] || []);
            }
            if (res && (res['code'] == 500 || res['error'] != null)) {
              this.plotXYChart(this.current_section.reports[n], [])
            }
          }
          else if (this.current_section.reports[n].chart_type == 1001) {  //PIE Chart
            if (res && res['data']) {
              this.plotPieChart(this.current_section.reports[n], res['data'] || []);
            }
            if (res && (res['code'] == 500 || res['error'] != null)) {
              this.plotPieChart(this.current_section.reports[n], []);
            }
          }
          else if (this.current_section.reports[n].chart_type == 1002) { //Top ranking chart
            if (res && res['data'] && res['status']) {
              if (res['data'].length) {
                res['data'].forEach(emp => {
                  emp['name'] = emp['name'] + ' (' + emp['user'] + ') '
                });
              }
              this.plotTopRankingChart(this.current_section.reports[n], res['data'])
            }
            if (res && (res['code'] == 500 || res['error'] != null)) {
              this.plotTopRankingChart(this.current_section.reports[n], [])

            }
          }
          else if (this.current_section.reports[n].chart_type == 1003) { //Force directed graph
            // this.plotForceDirectedGraph(this.current_section.reports[n], res['data'])
            if (res && res['data'] && res['status']) {
              if (res['data'].length) {
                res['data'].forEach(node => {
                  if (node.children && typeof (node.children) == 'string') {
                    node.children = JSON.parse(node.children);
                  }
                })
              }
              this.plotForceDirectedGraph(this.current_section.reports[n], res['data'])
            }
            if (res && (res['code'] == 500 || res['error'] != null)) {
              this.plotForceDirectedGraph(this.current_section.reports[n], [])

            }
          }
          else if (this.current_section.reports[n].chart_type == 1004) {
            if (res && res['data']) {
              if (res['data'].length) {
                let max_val = 2000000000
                // let arr = []
                // for (let i = 0; i < 7; i++) {
                //   res['data'][i]['value'] = max_val;
                //   arr.push(res['data'][i])
                //   max_val = Math.round(max_val / 2)
                //   console.log(max_val)
                // }
                res['data'].forEach(stage => {
                  stage['value'] = max_val;
                  let half = Math.round(max_val / 5)
                  max_val = max_val - half
                })
                this.plotFunnelChart(this.current_section.reports[n], res['data'])
              }
              else {
                this.plotFunnelChart(this.current_section.reports[n], res['data'] || [])

              }

            }
          }
          this.loadChartsRecursive(n + 1);
        },
          err => {
            this.loadChartsRecursive(n + 1);
          })
      }
      catch (err) {
        console.log(err);
        this.loadChartsRecursive(n + 1);
      }

    }
    else {
      console.log('Charts plotted')
    }

  }
  loadRecursiveTasks(n) {
    let l = this.current_section.tasks.length;
    if (n < l) {
      try {
        this.dashborad_service.getDynamicCharts(this.current_section.tasks[n].url, { team_flag: this.team_type, template_code: this.current_section.template_code, section_code: this.current_section.section_id, task_code: this.current_section.tasks[n].activity_code }).subscribe(res => {
          if (res && res['data'] && res['data'].details) {
            this.current_section.tasks[n].data = this.sortArrayBasedOnKey(res['data']['details'], 'sequence');
          }
          else {
            this.current_section.tasks[n].data = []
          }
          if (res['code'] == 500 || res['error'] != null) {
            this.current_section.tasks[n].data = []
          }
          this.loadRecursiveTasks(n + 1);
        }, error => {
          this.current_section.tasks[n].data = []
        })
      }
      catch (err) {
        this.loadRecursiveTasks(n + 1);
      }

    }
    else {
      console.log('Charts plotted')
    }
  }
  loadSummary(summary) {
    try {
      if (summary) {
        this.dashborad_service.getDynamicCharts(summary.url, { team_flag: this.team_type }).subscribe(res => {
          if (res && res['data']) {
            this.all_count = res['data'];
            if (res['data'].length > 0) {
              res['data'].forEach(element => {
                this.current_section.summary.forEach(card => {
                  if (card['property'] == element['title']) {
                    if (card['count_type'] == 1001) {
                      card['count'] = 0;
                      let c = element['count'];
                      if (c < 1000) {
                        let interval = setInterval(() => {
                          if (card['count'] < c) {
                            card['count'] += 2;
                            if (card['count'] > c) {
                              card['count'] = c
                            }
                          }
                          else {
                            clearInterval(interval);
                          }
                        }, 1)
                      }
                      else if (c < 10000) {
                        let interval = setInterval(() => {
                          if (card['count'] < c) {
                            card['count'] += 15;
                            if (card['count'] > c) {
                              card['count'] = c
                            }
                          }
                          else {
                            clearInterval(interval);
                          }
                        }, 1)
                      }
                      else if (c > 10000 && c < 100000) {
                        let interval = setInterval(() => {
                          if (card['count'] < c) {
                            card['count'] += 100;
                            if (card['count'] > c) {
                              card['count'] = c
                            }
                          }
                          else {
                            clearInterval(interval);
                          }
                        }, 1)
                      }
                      else {
                        let interval = setInterval(() => {
                          if (card['count'] < c) {
                            card['count'] += 1000;
                            if (card['count'] > c) {
                              card['count'] = c
                            }
                          }
                          else {
                            clearInterval(interval);
                          }
                        }, 1)
                      }
                      console.log(card.count)
                      card['code'] = element['code'];
                    }
                    else {
                      card['count'] = element['count'];
                      card['code'] = element['code'];
                    }
                  }
                })
              });
            }

          }
        })
      }

    }
    catch (err) {
      console.log(err);
    }
  }
  onSectionClick(section) {
    console.log(section)
    this.current_section = section;

    this.getAPIData()
  }

  getStyleObject(style: string) {
    try {
      console.log(style)
      let style_obj = JSON.parse(style);
      return style_obj
    }
    catch (err) {
      console.log(err);
      return {}
    }
  }

  parseStyleOnly(template) {
    if (template && template.length) {
      template.forEach(section => {
        if (section.summary && section.summary.length) {
          section.summary.forEach(s => {
            try {
              if (s.style) {
                let m = s.style.replace(/\'/gi, '"')
                console.log(m)
                s.style = JSON.parse(m);
              }
            }
            catch (err) {
              console.log(err);
              s.style = {
                'background-color': '#f2fcfe',
                'background-image': 'linear-gradient(315deg, #f2fcfe 0%, #1c92d2 100%)',
              }
              console.log(s.style);
            }
          })
        }
        if (section.tasks && section.tasks.length) {
          section.tasks.forEach(s => {
            try {
              if (s.style) {
                let m = s.style.replace(/\'/gi, '"')
                s.style = JSON.parse(m);
                console.log(s.style)
              }
            }
            catch (err) {
              console.log(err)
              s.style = { height: '192px' }
            }

          })
        }




      })


    }
  }

  sortArrayBasedOnKey(array, key) {
    array.sort((a, b) => {
      if (a[key] < b[key]) {
        return -1
      }
      if (a[key] > b[key]) {
        return 1
      }
    })

    return array;
  }
  ngAfterViewInit() {
    if (document.getElementById("id-66-title"))
      document.getElementById("id-66-title").style.display = "none";
  }

  setTeamTime(team_type, time_type) {
    this.team_type = team_type;
    this.time_type = time_type;
    this.getAPIData();
  }

  setTeamTitle(obj, team_type) {
    if (this.team_type != team_type) {
      this.team_title = obj;
      this.team_type = team_type;
      if (!this.time_type) {
        this.time_type = 1;
        this.getAPIData();
      }
      else {
        this.getAPIData();
      }
    }
  }

  setTimeTitle(obj, time_type) {
    if (this.time_type != time_type) {
      this.time_title = obj;
      this.time_type = time_type;
      if (!this.time_type) {
        this.time_type = 1;
        this.getAPIData();
      }
      else {
        if (this.time_type == 5) {
          let ref = this.dilaog.open(CustomTimeComponent, {
            width: '480px',
            height: 'fit-content'
          })
          ref.afterClosed().subscribe(res => {
            if (res && res['from'] && res['to']) {
              console.log(res)
              this.dashboard.from = res['from'];
              this.dashboard.to = res['to'];
              this.getAPIData();
            }
            else {
              this.team_type = 3;
              this.team_title = "All";
              this.time_title = "Week";
              this.time_type = 1;
            }
          })
        }
        else {
          this.dashboard.from = null;
          this.dashboard.to = null;
          this.getAPIData();
        }
      }
    }

  }

  changeCustomDate() {
    if (this.time_type == 5) {
      let ref = this.dilaog.open(CustomTimeComponent, {
        width: '480px',
        height: 'fit-content'
      })
      ref.afterClosed().subscribe(res => {
        if (res && res['from'] && res['to']) {
          console.log(res)
          this.dashboard.from = res['from'];
          this.dashboard.to = res['to'];
          this.getAPIData();
        }
        else {
          this.team_type = 3;
          this.team_title = "All";
          this.time_title = "Week";
          this.time_type = 1;
        }
      })
    }
    else {
      this.dashboard.from = null;
      this.dashboard.to = null;
      this.getAPIData();
    }
  }

  followUpShow() {
    this.follow_up_show = !this.follow_up_show;

  }
  activities() {
    this.acivities_show = !this.acivities_show;
  }

  navLinkHover(item, flag) {

    if (flag) {
      let timeout = setTimeout(() => {
        item['display_title'] = true;
      }, 200)
    }
    else {
      let timeout = setTimeout(() => {
        item['display_title'] = false;
      }, 200)
    }
  }

  allCountClicked(param?) {

    this.dashboard_routing_srv.setStaticCode(
      {
        code: null,
        team_flag: this.team_type,
        dashboard_applicant_flag: param == 0 ? true : false,
        dashboard_requirement_flag: param == 1 ? true : false,
        dashboard_flag: true,
        filter_template_id: this.all_count && this.all_count[param] ? this.all_count[param].code : null
      }
    );
  }
  setDashboardApplicantFlag(data) {
    if (data) {
      this.dashboard_routing_srv.setStaticCode(
        {
          code: null,
          team_flag: this.team_type,
          dashboard_applicant_flag: true,
          dashboard_requirement_flag: false,
          dashboard_flag: true,
          filter_template_id: data.code || null
        }
      );
    }
  }
  setDashboardRequirementFlag(data) {
    if (data) {
      this.dashboard_routing_srv.setStaticCode(
        {
          code: null,
          team_flag: this.team_type,
          dashboard_applicant_flag: false,
          dashboard_requirement_flag: true,
          dashboard_flag: true,
          filter_template_id: data.code || null
        }
      );
    }
  }

  dynamicAllCountClicked(ev) {
    try {
      if (ev && ev.func && ev.data) {
        this[ev.func](ev.data);
      }
    }
    catch (err) {
      console.log(err)
    }

    // if (card && card.param) {
    //   this.dashboard_routing_srv.setStaticCode(
    //     {
    //       code: null,
    //       team_flag: this.team_type,
    //       dashboard_applicant_flag: card.param == 'applicant' ? true : false,
    //       dashboard_requirement_flag: card.param == 'requirement' ? true : false,
    //       dashboard_flag: true,
    //       filter_template_id: card.code || null
    //     }
    //   );
    // }

  }
  onFollowupsClick(data) {
    try {
      this.dashboard_routing_srv.setStaticCode(
        {
          code: data.code,
          team_flag: this.team_type,
          dashboard_applicant_flag: true,
          dashboard_flag: true,
          code_master_title: data.title
        }
      );
    }
    catch (err) {
      console.log(err)
    }

  }
  onActivitiesClick(data) {
    try {
      this.dashboard_routing_srv.setStaticCode({
        code: data.code,
        team_flag: this.team_type,
        dashboard_applicant_flag: true,
        dashboard_flag: true,
        code_master_title: data.title
      });
    }
    catch (err) {
      console.log(err)
    }

  }
  taskClickListner(data) {
    console.log(data)
    try {
      if (data && data.func) {
        this[data.func](data.data)
      }
    }
    catch (err) {
      console.log(err)
    }
  }
  createChartDiv(chart_details: any) {
    let div = document.createElement('div'); //parent div
    // let divstyle = 'flex: 0 0 ' + chart_details.flex_width + ';max-width: 100%;overflow: hidden;';
    // div.setAttribute('style', divstyle);
    let random_id_root = 'tm_dashboard' + Math.floor((Math.random() * 10000) + 1) + Date.now();
    div.className = 'col-xl-' + chart_details.width + ' col-lg-' + chart_details.width + " " + chart_details.div_class;
    div.id = random_id_root;
    let container = document.getElementById('chart-container');
    container.appendChild(div);

    let card = document.createElement('div'); //card div
    card.className = 'card rounded-0 ' + chart_details.card_class;
    div.appendChild(card);

    let card_body = document.createElement('div');
    card_body.className = 'card-body p-0';
    card.appendChild(card_body);

    let chart_body = document.createElement('div');
    let style = chart_details.style;
    chart_body.setAttribute('style', style);
    let random_id = 'tm_dashboard' + Math.floor((Math.random() * 10000) + 1) + Date.now();
    chart_body.id = random_id;
    card_body.appendChild(chart_body);
    this.dynamic_div_track.push(random_id_root); //track will use for removing the div
    if (chart_body) {
      return random_id
    }
  }

  maximize(flag) {
    if (flag) {
      document.getElementById(this.dynamic_div_track[0]).style.height = "100vh"
      document.getElementById(this.dynamic_div_track[0]).style.width = "100%"
      document.getElementById(this.dynamic_div_track[0]).style.position = "absolute"
      document.getElementById(this.dynamic_div_track[0]).style.zIndex = '999'
    }
    else {
      document.getElementById(this.dynamic_div_track[0]).style.width = "100%"
      document.getElementById(this.dynamic_div_track[0]).style.position = "relative"
      document.getElementById(this.dynamic_div_track[0]).style.zIndex = '5'
      document.getElementById(this.dynamic_div_track[0]).style.height = "241px"


    }

  }

  removeDivRecursion(n) { //will remove the chart div's when we switch the section
    let l = this.dynamic_div_track.length;
    if (n < l) {
      document.getElementById(this.dynamic_div_track[n]).remove()
      this.removeDivRecursion(n + 1)
    }
    else {
      this.dynamic_div_track = [];
    }
  }

  plotXYChart(chart_details, chart_data, timeout?) {
    let random_id = this.createChartDiv(chart_details);
    if (document.getElementById(random_id)) {
      am4core.useTheme(am4themes_animated);
      // Themes end
      // Create chart instance
      let chart = am4core.create(random_id, am4charts.XYChart);

      this.charts_ref.push(chart);

      // chart.scrollbarX = new am4core.Scrollbar();
      let title = chart.titles.create();
      title.text = chart_details.title || "Vendor Performance";
      title.fontSize = 16;
      title.paddingTop = 8;
      title.paddingBottom = 8;
      title.fontWeight = "500";
      // Add data
      chart.data = chart_data;



      // Create axes
      let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
      categoryAxis.dataFields.category = "date";
      categoryAxis.renderer.grid.template.location = 0;
      categoryAxis.renderer.minGridDistance = 30;
      categoryAxis.renderer.labels.template.horizontalCenter = "middle";
      categoryAxis.renderer.labels.template.verticalCenter = "middle";
      // categoryAxis.renderer.labels.template.rotation = 180;
      categoryAxis.tooltip.disabled = true;
      categoryAxis.renderer.minHeight = 110;
      categoryAxis.renderer.grid.template.disabled = true;

      let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
      valueAxis.renderer.minWidth = 50;
      valueAxis.renderer.grid.template.disabled = true;

      // Create series
      let series = chart.series.push(new am4charts.ColumnSeries());
      // series.sequencedInterpolation = true;
      series.dataFields.valueY = "count";
      series.dataFields.categoryX = "date";
      series.tooltipText = "[{categoryX}: bold]{valueY}[/]";
      series.columns.template.strokeWidth = 0;
      series.tooltip.pointerOrientation = "horizontal";
      series.columns.template.column.cornerRadiusTopLeft = 10;
      series.columns.template.column.cornerRadiusTopRight = 10;
      series.columns.template.column.fillOpacity = 0.8;

      // on hover, make corner radiuses bigger
      let hoverState = series.columns.template.column.states.create("hover");
      hoverState.properties.cornerRadiusTopLeft = 0;
      hoverState.properties.cornerRadiusTopRight = 0;
      hoverState.properties.fillOpacity = 1;

      series.columns.template.adapter.add("fill", function (fill, target) {
        return chart.colors.getIndex(target.dataItem.index);
      });

      // Cursor
      chart.cursor = new am4charts.XYCursor();


      // chart padding margin
      // chart.paddingBottom = 8;
      // let title = chart.titles.create();
      // title.text = chart_details['title'] || "Chart";
      // title.fontSize = 16;
      // title.marginBottom = 8;
      // title.fontWeight = "500";
      // // chart.marginBottom = 0;

      // if (chart_data.length > 0) {
      //   // Create axes
      //   let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
      //   dateAxis.renderer.minGridDistance = 40;
      //   dateAxis.groupData = true;
      //   dateAxis.baseInterval = {
      //     "timeUnit": "day",
      //     "count": 1
      //   }
      //   // chart.exporting.menu = new am4core.ExportMenu();

      //   let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
      //   chart.seriesContainer.zIndex = 10;


      //   for (let i = 0; i < chart_data && chart_data.length; i++) {
      //     createSeries("value" + i, "Series #" + i);
      //   }
      //   if (chart_data && chart_data.length > 0) {
      //     chart_data.forEach(series => {
      //       if (series && series['title'])
      //         createSeries("value" + series['title'], series['title'], series);
      //     });
      //   }

      //   // Label
      //   // let label = chart.chartContainer.createChild(am4core.Label);
      //   // label.paddingTop = 8;
      //   // label.text = "Recruiter Performance";
      //   // label.align = "center";
      //   // label.fontWeight = "500";
      //   // label.fontSize = 16;

      //   // title bottom


      //   // value axis
      //   valueAxis.renderer.baseGrid.disabled = false;


      //   // Create series
      //   function createSeries(s, name, series_value?) {
      //     let series = chart.series.push(new am4charts.LineSeries());
      //     series.dataFields.valueY = "value" + s;
      //     series.dataFields.dateX = "date";
      //     series.name = name;

      //     let segment = series.segments.template;
      //     segment.interactionsEnabled = true;

      //     let hoverState = segment.states.create("hover");
      //     hoverState.properties.strokeWidth = 3;
      //     // hoverState.properties.readerTitle = series_value['title']
      //     // hoverState.properties.tooltipText = series_value['title'];
      //     series.strokeWidth = 2;
      //     series.yAxis = valueAxis;
      //     series.name = name;
      //     series.tooltipText = "{name}: [bold]{valueY}[/]";
      //     series.tensionX = 0.8;
      //     series.trackable = true;
      //     series.showOnInit = true;
      //     // hoverState.properties.clickable = true;

      //     // remove the grid line inside chart
      //     valueAxis.renderer.grid.template.disabled = true;
      //     dateAxis.renderer.grid.template.disabled = true;

      //     let dimmed = segment.states.create("dimmed");
      //     dimmed.properties.stroke = am4core.color("#dadada");

      //     segment.events.on("over", function (event) {
      //       processOver(event.target.parent.parent.parent);
      //     });

      //     segment.events.on("out", function (event) {
      //       processOut(event.target.parent.parent.parent);

      //     });

      //     let data = [];
      //     let value = Math.round(Math.random() * 100) + 100;
      //     for (var i = 0; i < series_value['data'].length; i++) {
      //       value = series_value['data'][i]['count'];
      //       let dataItem = { date: series_value['data'][i]['date'] };
      //       dataItem["value" + s] = value;
      //       // dataItem["value" + s] = value;
      //       data.push(dataItem);
      //     }
      //     series.data = data;
      //     return series;
      //   }

      //   chart.legend = new am4charts.Legend();
      //   chart.legend.position = "right";
      //   chart.legend.scrollable = true;
      //   chart.legend.width = 120;
      //   // chart.legend.labels.template.truncate = false;
      //   // chart.legend.labels.template.wrap = true;
      //   chart.legend.itemContainers.template.tooltipText = "{name}";
      //   chart.cursor = new am4charts.XYCursor();


      //   chart.legend.itemContainers.template.events.on("over", function (event) {
      //     processOver(event.target.dataItem.dataContext);
      //   })
      //   chart.legend.itemContainers.template.events.on("hit", function (event) {
      //     processOver(event.target.dataItem.dataContext);
      //   })

      //   chart.legend.itemContainers.template.events.on("out", function (event) {
      //     processOut(event.target.dataItem.dataContext);
      //   })

      //   /* Configure cursor lines */
      //   chart.cursor.lineX.stroke = am4core.color("#8F3985");
      //   chart.cursor.lineX.strokeWidth = 4;
      //   chart.cursor.lineX.strokeOpacity = 0.2;
      //   chart.cursor.lineX.strokeDasharray = "";
      //   valueAxis.cursorTooltipEnabled = false;
      //   dateAxis.cursorTooltipEnabled = false;
      //   chart.cursor.lineY.disabled = true;
      //   function processOver(hoveredSeries) {
      //     hoveredSeries.toFront();

      //     hoveredSeries.segments.each(function (segment) {
      //       segment.setState("hover");
      //     })

      //     chart.series.each(function (series) {
      //       if (series != hoveredSeries) {
      //         if (series['segments']) {
      //           series['segments'].each(function (segment) {
      //             segment.setState("dimmed");
      //           })
      //         }

      //         series.bulletsContainer.setState("dimmed");
      //       }
      //     });
      //   }

      //   function processOut(hoveredSeries) {
      //     chart.series.each(function (series) {
      //       if (series['segments']) {
      //         series['segments'].each(function (segment) {
      //           segment.setState("default");
      //         })
      //       }

      //       series.bulletsContainer.setState("default");
      //     });
      //   }
      // }
      // if (chart_data.length == 0) {
      //   let no_data = chart.chartContainer.createChild(am4core.Label);
      //   no_data.text = "No data found!";
      //   no_data.align = "center";
      //   no_data.properties.valign = "middle";
      //   no_data.fontWeight = "500";
      //   no_data.fontSize = 16;
      //   no_data.dy = -100;
      //   no_data.opacity = 0.5
      // }
      // if (timeout)
      //   clearTimeout(timeout);
    }
  }

  plotPieChart(chart_details, chart_data, timeout?) {
    let random_id = this.createChartDiv(chart_details);
    if (document.getElementById(random_id)) {
      // Themes begin
      am4core.useTheme(am4themes_animated);

      // Create chart instance
      let chart = am4core.create(random_id, am4charts.PieChart);
      this.charts_ref.push(chart)
      // chart padding
      // this.cv_source_chart = chart;   

      let title = chart.titles.create();
      title.text = chart_details.title || "Stage wise Report";
      title.fontSize = 16;
      title.paddingTop = 18;
      // title.paddingBottom = 8;
      title.fontWeight = "500";
      // Add data
      // this.cv_source = []
      chart.data = chart_data;
      if (chart_data.length == 0) {
        let no_data = chart.chartContainer.createChild(am4core.Label);
        no_data.text = "No data found!";
        no_data.align = "center";
        no_data.properties.valign = "middle";
        no_data.fontWeight = "500";
        no_data.fontSize = 16;
        no_data.opacity = 0.5
        no_data.properties.dx = 75
      }


      // Add and configure Series
      let pieSeries = chart.series.push(new am4charts.PieSeries());
      pieSeries.dataFields.value = "count";
      pieSeries.dataFields.category = "title";
      pieSeries.innerRadius = am4core.percent(50);
      pieSeries.height = 200;
      pieSeries.ticks.template.disabled = true;
      pieSeries.labels.template.disabled = true;

      let rgm = new am4core.RadialGradientModifier();
      rgm.brightnesses.push(-0.8, -0.8, -0.5, 0, - 0.5);
      pieSeries.slices.template.fillModifier = rgm;
      pieSeries.slices.template.strokeModifier = rgm;
      pieSeries.slices.template.strokeOpacity = 0.4;
      pieSeries.slices.template.strokeWidth = 0;

      chart.legend = new am4charts.Legend();
      chart.legend.position = "right";
      if (chart_details.width && chart_details.width < 6) {
        chart.legend.width = 100;
      }
      else {
        chart.legend.width = 250;
      }
      chart.legend.fontSize = 12;
      chart.legend.scrollable = true;
    }
  }

  plotTopRankingChart(chart_details, chart_data, timeout?) {
    let random_id = this.createChartDiv(chart_details);
    if (document.getElementById(random_id)) {

      am4core.useTheme(am4themes_animated);
      // Themes end
      let chart = am4core.create(random_id, am4charts.XYChart);
      this.charts_ref.push(chart)
      chart.hiddenState.properties.opacity = 0; // this creates initial fade-in
      chart.dy = 8;
      // chart.data = [{
      //   "name": "Monica",
      //   "steps": 45688,
      //   "href": "assets/user-profile.jpg"
      // }, {
      //   "name": "Sam",
      //   "steps": 35781,
      //   "href": "https://www.amcharts.com/wp-content/uploads/2019/04/joey.jpg"
      // }, {
      //   "name": "Jena",
      //   "steps": 25464,
      //   "href": "https://www.amcharts.com/wp-content/uploads/2019/04/ross.jpg"
      // }];
      chart_data.forEach(element => {
        if (!element.href || element.href == "" || element.href == '""') {
          element.href = "assets/user-profile.jpg"
          console.log(element.href)
        }
        // if (element.href) {
        //   element.href = "https://www.google.com/s2/u/0/photos/public/AIbEiAIAAABECOX7t8nq5oD9qgEiC3ZjYXJkX3Bob3RvKihiNWZjNTZhYmY3OWE5NWJhOWYxZWFlM2MwZDE2MGUyN2QwYjMwMzgwMAGYHNHJVcxnPytQCNhbnjBAF0Q5Lw?sz=40"
        // }
        // if (element.performance == 0) {
        //   element.performance = 0.04
        // }   
      })
      chart.data = chart_data

      let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
      categoryAxis.dataFields.category = "name";
      categoryAxis.dataFields.id = "user"
      categoryAxis.renderer.grid.template.strokeOpacity = 0;
      categoryAxis.renderer.minGridDistance = 10;
      categoryAxis.renderer.labels.template.dy = 16;
      categoryAxis.renderer.tooltip.dy = 35;
      categoryAxis.renderer.tooltip.preventShow = true;
      categoryAxis.renderer.marginBottom = 0;
      categoryAxis.renderer.paddingBottom = 0

      categoryAxis.renderer.labels.template.adapter.add("textOutput", function (text) {
        if (text) {
          return text.replace(/ \(.*/, "");
        }
        else {
          return text
        }
      });

      let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
      valueAxis.renderer.inside = true;
      valueAxis.renderer.labels.template.fillOpacity = 0.3;
      valueAxis.renderer.grid.template.strokeOpacity = 0;
      valueAxis.min = 0;
      valueAxis.cursorTooltipEnabled = false;
      valueAxis.renderer.baseGrid.strokeOpacity = 0;

      let series = chart.series.push(new am4charts.ColumnSeries);
      series.dataFields.valueY = "performance";
      series.dataFields.categoryX = "name";
      series.tooltipText = "{valueY.value}";
      series.tooltip.pointerOrientation = "vertical";
      series.tooltip.dy = - 6;
      series.columnsContainer.zIndex = 100;
      series.tooltip.events.on('hit', () => {
      })

      let columnTemplate = series.columns.template;
      columnTemplate.width = am4core.percent(50);
      columnTemplate.maxWidth = 12;
      columnTemplate.column.cornerRadius(60, 60, 10, 10);
      columnTemplate.strokeOpacity = 0;

      // remove the grid line inside chart
      valueAxis.renderer.grid.template.disabled = true;
      categoryAxis.renderer.grid.template.disabled = true;
      series.heatRules.push({ target: columnTemplate, property: "fill", dataField: "valueY", min: am4core.color("#e5dc36"), max: am4core.color("#5faa46") });

      series.mainContainer.mask = undefined;

      let cursor = new am4charts.XYCursor();
      chart.cursor = cursor;
      cursor.lineX.disabled = true;
      cursor.lineY.disabled = true;
      cursor.behavior = "none";

      let bullet: any = columnTemplate.createChild(am4charts.CircleBullet);
      bullet.circle.radius = 20;
      bullet.valign = "bottom";
      bullet.align = "center";
      bullet.isMeasured = true;
      bullet.mouseEnabled = false;
      bullet.verticalCenter = "bottom";
      bullet.interactionsEnabled = false;
      let hoverState = bullet.states.create("hover");
      let outlineCircle = bullet.createChild(am4core.Circle);
      outlineCircle.adapter.add("radius", function (radius, target) {
        let circleBullet: any = target.parent;
        return circleBullet.circle.pixelRadius + 1;
      })

      let image = bullet.createChild(am4core.Image);
      image.width = 45;
      image.height = 45;
      image.horizontalCenter = "middle";
      image.verticalCenter = "middle";
      image.propertyFields.href = "href";
      image.adapter.add("mask", function (mask, target) {
        let circleBullet: any = target.parent;
        return circleBullet.circle;
      })

      // No data
      if (chart_data.length == 0) {
        let no_data = chart.chartContainer.createChild(am4core.Label);
        no_data.text = "No data found!";
        no_data.align = "center";
        no_data.properties.dy = -50
        no_data.properties.valign = "middle";
        no_data.fontWeight = "500";
        no_data.fontSize = 16;
        no_data.opacity = 0.5
      }

      // bottom header
      let label = chart.chartContainer.createChild(am4core.Label);
      label.paddingTop = 8
      label.text = chart_details.title || "Top Performers";
      label.align = "center";
      label.valign = "bottom"
      label.properties.valign = "bottom";
      label.fontWeight = "500";
      label.fontSize = 16;


      // chart padding margin
      chart.paddingBottom = 8;
      // chart.marginBottom = 0;

      // chart.svgContainer.htmlElement.style.height = 180 + 'px';
      // hide y axis values
      valueAxis.renderer.labels.template.adapter.add("text", function (text, target) {
        if (text) {
          return text.match(/d/) ? "" : "";
        }
        else {
          return ""
        }
      });


      let previousBullet;
      chart.cursor.events.on("cursorpositionchanged", function (event) {
        let dataItem: any = series.tooltipDataItem;

        if (dataItem.column) {
          let bullet = dataItem.column.children.getIndex(1);

          if (previousBullet && previousBullet != bullet) {
            previousBullet.isHover = false;
          }

          if (previousBullet != bullet) {

            let hs = bullet.states.getKey("hover");
            hs.properties.dy = -bullet.parent.pixelHeight + 5;
            bullet.isHover = true;

            previousBullet = bullet;
          }
        }
      })
    }
  }
  plotForceDirectedGraph(chart_details, chart_data, timeout?) {
    console.log('force directed graph is plotting')
    let random_chart_id = this.createChartDiv(chart_details);
    am4core.useTheme(am4themes_animated);
    // Themes end
    let chart = am4core.create(random_chart_id, am4plugins_forceDirected.ForceDirectedTree);
    let networkSeries = chart.series.push(new am4plugins_forceDirected.ForceDirectedSeries())
    chart.data = chart_data || []
    let label = chart.chartContainer.createChild(am4core.Label);
    label.text = chart_details.title || 'Pie Chart';
    label.align = "center";
    label.properties.valign = "bottom";
    label.fontWeight = "500";
    label.fontSize = 16;
    // label.dy = 8;
    networkSeries.manyBodyStrength = -16;
    networkSeries.nodes.template.label.hideOversized = true;
    networkSeries.nodes.template.label.truncate = true;
    // No data
    if (chart_data.length == 0) {
      let no_data = chart.chartContainer.createChild(am4core.Label);
      no_data.text = "No data found!";
      no_data.align = "center";
      no_data.properties.valign = "middle";
      no_data.fontWeight = "500";
      no_data.fontSize = 16;
      no_data.opacity = 0.5
    }
    networkSeries.dataFields.value = "req_count";
    networkSeries.dataFields.name = "name";
    networkSeries.dataFields.children = "children";
    networkSeries.nodes.template.tooltipText = "{name}:{value}";
    networkSeries.nodes.template.fillOpacity = 1;
    networkSeries.minRadius = 10;
    networkSeries.maxRadius = 24

    networkSeries.nodes.template.label.text = "{name}"
    networkSeries.fontSize = 10;
    networkSeries.links.template.strokeWidth = 1;
    let hoverState = networkSeries.links.template.states.create("hover");
    hoverState.properties.strokeWidth = 3;
    hoverState.properties.strokeOpacity = 1;
    networkSeries.nodes.template.expandAll = false;
    networkSeries.maxLevels = 1;
    networkSeries.nodes.template.events.on("inited", function () { //deplay in case of loading higher number of nodes
      networkSeries.animate({
        property: "velocityDecay",
        to: 1
      }, 500);
    });
    networkSeries.nodes.template.events.on("over", function (event) {
      event.target.dataItem.childLinks.each(function (link) {
        link.isHover = true;
      })
      if (event.target.dataItem.parentLink) {
        event.target.dataItem.parentLink.isHover = true;
      }

    })
    // networkSeries.nodes.template.events.on("hit", function (ev) {
    //   ev.target.dataItem.children.values.forEach(function (child) {
    //     child.collapsed = true
    //   })
    // }, this);


    networkSeries.nodes.template.events.on("out", function (event) {
      event.target.dataItem.childLinks.each(function (link) {
        link.isHover = false;
      })
      if (event.target.dataItem.parentLink) {
        event.target.dataItem.parentLink.isHover = false;
      }
    })
  }

  plotFunnelChart(chart_details, chart_data, timeout?) {
    /* Chart code */
    // Themes begin
    let random_id = this.createChartDiv(chart_details);

    am4core.useTheme(am4themes_animated);
    // Themes end

    let chart = am4core.create(random_id, am4charts.SlicedChart);
    chart.hiddenState.properties.opacity = 0; // this makes initial fade in effect

    chart.data = chart_data;
    chart.configField = "config";

    let label = chart.chartContainer.createChild(am4core.Label);
    label.text = chart_details.title || 'Pie Chart';
    label.align = "center";
    label.properties.valign = "bottom";
    label.fontWeight = "500";
    label.fontSize = 16;
    label.dy = 14;
    let series = chart.series.push(new am4charts.FunnelSeries());
    series.colors.step = 2;
    series.dataFields.value = "value";
    series.dataFields.category = "title";
    series.alignLabels = true;
    series.labels.template.text = "{category}: {applicant_count}";
    // series.tooltipText = "{category}:[bold]{count}[/]";
    // series.labels.template.adapter.add("text", slicePercent);
    series.tooltip.label.adapter.add("text", slicePercent);

    function slicePercent(text, target) {
      var max = target.dataItem.values.value.value - target.dataItem.values.value.startChange;
      var percent = Math.round(target.dataItem.values.value.count / max * 100);
      return "{category}: " + "{applicant_count}";
    }
    series.labelsContainer.paddingLeft = 15;
    series.labelsContainer.width = 200;

    //series.orientation = "horizontal";
    //series.bottomRatio = 1;

    // chart.legend = new am4charts.Legend();
    // chart.legend.position = "left";
    // chart.legend.valign = "bottom";
    // chart.legend.margin(5, 5, 20, 5);
  }




  isMobileMenu() {
    if ($(window).width() > 991) {
      return false;
    }
    return true;
  }

  icon(i) {
    console.log(i)
  }
  applicantDistribution() {

    // this.zone.runOutsideAngular(() => {
    //   Promise.all([

    //     import("@amcharts/amcharts4/core"),
    //     import("@amcharts/amcharts4/current_section.reports"),
    //     import("@amcharts/amcharts4/themes/animated")
    //   ])
    //     .then(modules => {
    //       const am4core = modules[0];
    //       const am4charts = modules[1];
    //       const am4themes_animated = modules[2].default;
    //       if (true) {
    //         /* Chart code */
    //         // Themes begin
    //         am4core.useTheme(am4themes_animated);
    //         // Themes end

    //         /**
    //          * This is a copy of a chart created by Antti Lipponen: https://twitter.com/anttilip?lang=en Thanks a lot!
    //          */

    //         // disclaimer: this data is not accuarate, don't use it for any puroposes
    //         // first temperature is average for 1973-1980 period

    //         let temperatures = this.applicant_distribution


    //         let startYear = 0;
    //         let endYear = 2016;
    //         let currentYear = 0;
    //         let colorSet = new am4core.ColorSet();

    //         let chart = am4core.create("applicant_distribution", am4charts.RadarChart);
    //         // chart.numberFormatter.numberFormat = "+#.0°C|#.0°C|0.0°C";
    //         chart.hiddenState.properties.opacity = 0;

    //         chart.startAngle = 270 - 180;
    //         chart.endAngle = 270 + 180;
    //         chart.minHeight = 260;
    //         chart.svgContainer.htmlElement.style.height = 350 + 'px'
    //         // chart.margin(0, 0, 0, 50);
    //         chart.marginLeft = 85
    //         chart.paddingTop = 0;
    //         chart.marginTop = 0
    //         chart.align = "center"
    //         chart.radius = am4core.percent(65);
    //         chart.innerRadius = am4core.percent(35);
    //         // Label
    //         let label = chart.chartContainer.createChild(am4core.Label);
    //         label.text = "Applicant Distribution";
    //         // label.align = "center";
    //         label.properties.valign = "bottom"
    //         label.properties.marginLeft = 85;
    //         label.fontWeight = "500";
    //         label.fontSize = 16;
    //         // year label goes in the middle
    //         let yearLabel = chart.radarContainer.createChild(am4core.Label);
    //         yearLabel.horizontalCenter = "middle";
    //         yearLabel.verticalCenter = "middle";
    //         yearLabel.fill = am4core.color("#673AB7");
    //         yearLabel.fontSize = 30;
    //         // yearLabel.text = String(currentYear);

    //         // zoomout button
    //         let zoomOutButton = chart.zoomOutButton;
    //         zoomOutButton.dx = 0;
    //         zoomOutButton.dy = 0;
    //         zoomOutButton.marginBottom = 15;
    //         zoomOutButton.parent = chart.rightAxesContainer;

    //         // scrollbar
    //         chart.scrollbarX = new am4core.Scrollbar();
    //         chart.scrollbarX.parent = chart.rightAxesContainer;
    //         chart.scrollbarX.orientation = "vertical";
    //         chart.scrollbarX.align = "center";
    //         chart.scrollbarX.exportable = false;

    //         // vertical orientation for zoom out button and scrollbar to be fed properly
    //         chart.rightAxesContainer.layout = "vertical";
    //         chart.rightAxesContainer.padding(120, 20, 120, 20);

    //         // category axis
    //         let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    //         categoryAxis.renderer.grid.template.location = 0;
    //         categoryAxis.dataFields.category = "country";

    //         let categoryAxisRenderer = categoryAxis.renderer;
    //         let categoryAxisLabel = categoryAxisRenderer.labels.template;
    //         categoryAxisLabel.location = 0.5;
    //         categoryAxisLabel.radius = 28;
    //         categoryAxisLabel.relativeRotation = 90;

    //         categoryAxisRenderer.fontSize = 11;
    //         categoryAxisRenderer.minGridDistance = 10;
    //         categoryAxisRenderer.grid.template.radius = -25;
    //         categoryAxisRenderer.grid.template.strokeOpacity = 0.05;
    //         categoryAxisRenderer.grid.template.interactionsEnabled = false;

    //         categoryAxisRenderer.ticks.template.disabled = true;
    //         categoryAxisRenderer.axisFills.template.disabled = true;
    //         categoryAxisRenderer.line.disabled = true;

    //         categoryAxisRenderer.tooltipLocation = 0.5;
    //         categoryAxis.tooltip.defaultState.properties.opacity = 0;

    //         // value axis
    //         let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    //         // valueAxis.min = -3;
    //         // valueAxis.max = 6;
    //         valueAxis.strictMinMax = true;
    //         valueAxis.tooltip.defaultState.properties.opacity = 0;
    //         valueAxis.tooltip.animationDuration = 0;
    //         valueAxis.cursorTooltipEnabled = true;
    //         valueAxis.zIndex = 10;

    //         let valueAxisRenderer = valueAxis.renderer;
    //         valueAxisRenderer.axisFills.template.disabled = true;
    //         valueAxisRenderer.ticks.template.disabled = true;
    //         valueAxisRenderer.minGridDistance = 20;
    //         valueAxisRenderer.grid.template.strokeOpacity = 0.05;


    //         // series
    //         let series = chart.series.push(new am4charts.RadarColumnSeries());
    //         series.columns.template.width = am4core.percent(90);
    //         series.columns.template.strokeOpacity = 0;
    //         series.dataFields.valueY = "value" + currentYear;
    //         series.dataFields.categoryX = "country";
    //         series.tooltipText = "{categoryX}:{valueY.value}";

    //         // this makes columns to be of a different color, depending on value
    //         series.heatRules.push({target: series.columns.template, property: "fill", minValue: -3, maxValue: 6, min: am4core.color("#673AB7"), max: am4core.color("#F44336"), dataField: "valueY"});

    //         // cursor
    //         let cursor = new am4charts.RadarCursor();
    //         chart.cursor = cursor;
    //         cursor.behavior = "zoomX";

    //         cursor.xAxis = categoryAxis;
    //         cursor.innerRadius = am4core.percent(40);
    //         cursor.lineY.disabled = true;

    //         cursor.lineX.fillOpacity = 0.2;
    //         cursor.lineX.fill = am4core.color("#000000");
    //         cursor.lineX.strokeOpacity = 0;
    //         cursor.fullWidthLineX = true;

    //         // year slider
    //         // let yearSliderContainer = chart.createChild(am4core.Container);
    //         // yearSliderContainer.layout = "vertical";
    //         // yearSliderContainer.padding(0, 38, 0, 38);
    //         // yearSliderContainer.width = am4core.percent(100);

    //         // let yearSlider = yearSliderContainer.createChild(am4core.Slider);
    //         // yearSlider.events.on("rangechanged", function() {
    //         //   updateRadarData(startYear + Math.round(yearSlider.start * (endYear - startYear)));
    //         // })
    //         // yearSlider.orientation = "horizontal";
    //         // yearSlider.start = 0.5;
    //         // yearSlider.exportable = false;

    //         chart.data = generateRadarData();

    //         function generateRadarData() {
    //           let data = [];
    //           let i = 0;
    //           for (var continent in temperatures) {
    //             let continentData = temperatures[continent];


    //             continentData.forEach(function(country) {
    //               let rawDataItem = {"country": country[0]}
    //               
    //               for (var y = 1; y < country.length; y++) {
    //                 rawDataItem["value" + (startYear)] = country[y];
    //               }


    //               data.push(rawDataItem);
    //             });

    //             createRange(continent, continentData, i);
    //             i++;

    //           }
    //           return data;
    //         }


    //         function updateRadarData(year) {
    //           if (currentYear != year) {
    //             currentYear = year;
    //             yearLabel.text = String(currentYear);
    //             series.dataFields.valueY = "value" + currentYear;
    //             chart.invalidateRawData();
    //           }
    //         }

    //         function createRange(name, continentData, index) {

    //           let axisRange = categoryAxis.axisRanges.create();
    //           axisRange.axisFill.interactionsEnabled = true;
    //           axisRange.text = name;
    //           // first country
    //           axisRange.category = continentData[0][0];
    //           // last country
    //           axisRange.endCategory = continentData[continentData.length - 1][0];

    //           // every 3rd color for a bigger contrast
    //           axisRange.axisFill.fill = colorSet.getIndex(index * 3);
    //           axisRange.grid.disabled = true;
    //           axisRange.label.interactionsEnabled = false;
    //           axisRange.label.bent = true;

    //           let axisFill = axisRange.axisFill;
    //           axisFill.innerRadius = -0.001; // almost the same as 100%, we set it in pixels as later we animate this property to some pixel value
    //           axisFill.radius = -20; // negative radius means it is calculated from max radius
    //           axisFill.disabled = false; // as regular fills are disabled, we need to enable this one
    //           axisFill.fillOpacity = 1;
    //           axisFill.togglable = true;

    //           axisFill.showSystemTooltip = true;
    //           axisFill.readerTitle = "click to zoom";
    //           axisFill.cursorOverStyle = am4core.MouseCursorStyle.pointer;

    //           axisFill.events.on("hit", function(event) {
    //             let dataItem = event.target.dataItem;
    //             if (!event.target.isActive) {
    //               categoryAxis.zoom({start: 0, end: 1});
    //             }
    //             else {
    //               categoryAxis.zoomToCategories(dataItem.category, dataItem.endCategory);
    //             }
    //           })

    //           // hover state
    //           let hoverState = axisFill.states.create("hover");
    //           hoverState.properties.innerRadius = -10;
    //           hoverState.properties.radius = -25;

    //           let axisLabel = axisRange.label;
    //           axisLabel.location = 0.5;
    //           axisLabel.fill = am4core.color("#ffffff");
    //           axisLabel.radius = 3;
    //           axisLabel.relativeRotation = 0;
    //         }

    //         // let slider = yearSliderContainer.createChild(am4core.Slider);
    //         // slider.start = 1;
    //         // slider.exportable = false;
    //         // slider.events.on("rangechanged", function() {
    //         //   let start = slider.start;

    //         //   chart.startAngle = 270 - start * 179 - 1;
    //         //   chart.endAngle = 270 + start * 179 + 1;

    //         //   valueAxis.renderer.axisAngle = chart.startAngle;
    //         // })
    //       }
    //     })
    // })

  }

}

export class AllCount {
  applicant_count: number = 0;
  requirement_count: number = 0;
  performance;
  target_positions;
}