import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ViewAssessmentsComponent } from './view-assessments/view-assessments.component';
import { MatDialog } from '@angular/material/dialog';
import { trigger, state, style, transition, animate } from '@angular/animations';


@Component({
  selector: 'app-assessment',
  templateUrl: './assessment.component.html',
  styleUrls: ['./assessment.component.scss'],
  animations: [
    trigger('toggleBox', [
      // ...
      state('open', style({
        maxHeight: '300px',
        minHeight: '80px',
        overflow: 'auto',
      })),
      state('closed', style({
        height: '0px',
        overflow: 'hidden'
      })),
      transition('open => closed', [
        animate('0.3s')
      ]),
      transition('closed => open', [
        animate('0.4s')
      ]),
    ])
  ]
})
export class AssessmentComponent implements OnInit {

  @Input() assessment;
  @Input() modal_view;
  @Output() opened = new EventEmitter();

  on_view_click;
  constructor(
    private dialog: MatDialog,
  ) { }

  ngOnInit() {
    // setTimeout(() => {
    //   if (this.assessment.min_score != this.assessment.max_Score) {
    //   this.gauge(this.assessment.min_score, this.assessment.max_Score, this.assessment.score, this.assessment.assessment_id)
    //   }
    // });
  }


  showAssessment(id) {
    const dia = this.dialog.open(ViewAssessmentsComponent);
    (dia.componentInstance).id = id
  }


  viewForm(assessment) {
    this.opened.emit(assessment);
    this.on_view_click = !this.on_view_click;
  }

  gauge(min, max, score, id) {
    Promise.all([
      import("@amcharts/amcharts4/core"),
      import("@amcharts/amcharts4/charts")
    ]).then((modules) => {
      const am4core = modules[0];
      const am4charts = modules[1];
      am4core.addLicense("CH200313264459131");
      let chart = am4core.create(String(id), am4charts.GaugeChart);
      chart.innerRadius = am4core.percent(82);
      chart.dx = 10;

      /**
       * Normal axis
       */

      // var gradient = new am4core.LinearGradient();
      // gradient.stops.push({ color: am4core.color("red") })
      // gradient.stops.push({ color: am4core.color("yellow") })
      // gradient.stops.push({ color: am4core.color("green") })

      let axis = chart.xAxes.push(new am4charts.ValueAxis() as any);
      axis.min = Number(min);
      axis.max = Number(max) || 100;
      axis.strictMinMax = true;
      axis.renderer.radius = am4core.percent(70);
      axis.renderer.line.strokeOpacity = 1;
      axis.renderer.ticks.template.disabled = false
      axis.renderer.ticks.template.strokeOpacity = 1;
      axis.renderer.ticks.template.length = 5;
      axis.renderer.grid.template.disabled = true;
      axis.renderer.labels.template.radius = 30;
      axis.renderer.labels.template.fontSize = 10
      // axis.renderer.line.stroke = gradient;
      axis.renderer.labels.template.adapter.add("text", function (text) {
        return text;
      })


      let axis2 = chart.xAxes.push(new am4charts.ValueAxis() as any);
      axis2.min = Number(min);
      axis2.max = Number(max) || 100;
      axis2.strictMinMax = true;
      axis2.renderer.labels.template.disabled = true;
      axis2.renderer.ticks.template.disabled = true;
      axis2.renderer.grid.template.disabled = true;



      let range = axis2.axisRanges.create();
      range.value = 0;
      range.endValue = 20;
      range.axisFill.fillOpacity = 1;
      let range_gradient = new am4core.LinearGradient();
      range_gradient.stops.push({ color: am4core.color("red") })
      range_gradient.stops.push({ color: am4core.color("#ff1100") })
      range_gradient.stops.push({ color: am4core.color("#ff3400") })
      range.axisFill.fill = range_gradient;
      range.axisFill.zIndex = -1;


      let range1 = axis2.axisRanges.create();
      range1.value = 20;
      range1.endValue = 40;
      range1.axisFill.fillOpacity = 1;
      let range_gradient1 = new am4core.LinearGradient();
      range_gradient1.stops.push({ color: am4core.color("#ff3400") })
      range_gradient1.stops.push({ color: am4core.color("#ff6c00") })
      range_gradient1.stops.push({ color: am4core.color("#ffb300") })
      range1.axisFill.fill = range_gradient1;
      range1.axisFill.zIndex = -1;


      let range2 = axis2.axisRanges.create();
      range2.value = 40;
      range2.endValue = 60;
      range2.axisFill.fillOpacity = 1;
      let range_gradient2 = new am4core.LinearGradient();
      range_gradient2.stops.push({ color: am4core.color("#ffb300") })
      range_gradient2.stops.push({ color: am4core.color("#a39809") })
      range_gradient2.stops.push({ color: am4core.color("#a39909") })
      range2.axisFill.fill = range_gradient2;
      // range2.axisFill.fill = am4core.color("#76c76c");
      range2.axisFill.zIndex = -1;


      let range3 = axis2.axisRanges.create();
      range3.value = 60;
      range3.endValue = 80;
      range3.axisFill.fillOpacity = 1;
      let range_gradient3 = new am4core.LinearGradient();
      range_gradient3.stops.push({ color: am4core.color("#a39909") })
      range_gradient3.stops.push({ color: am4core.color("#6bb500") })
      range_gradient3.stops.push({ color: am4core.color("#329900") })
      range3.axisFill.fill = range_gradient3;

      range3.axisFill.zIndex = -1;


      let range4 = axis2.axisRanges.create();
      range4.value = 80;
      range4.endValue = 100;
      range4.axisFill.fillOpacity = 1;
      let range_gradient4 = new am4core.LinearGradient();
      range_gradient4.stops.push({ color: am4core.color("#329900") })
      range_gradient4.stops.push({ color: am4core.color("#098500") })
      range_gradient4.stops.push({ color: am4core.color("#008a00") })
      range4.axisFill.fill = range_gradient4;
      range4.axisFill.zIndex = -1;
      // let colorSet = new am4core.ColorSet();
      // let range0 = axis2.axisRanges.create();
      // range0.value = 0;
      // range0.endValue = 50;
      // range0.axisFill.fillOpacity = 1;
      // range0.axisFill.fill = colorSet.getIndex(0);

      // let range1 = axis2.axisRanges.create();
      // range1.value = 50;
      // range1.endValue = 100;
      // range1.axisFill.fillOpacity = 1;
      // range1.axisFill.fill = colorSet.getIndex(2);

      let label = chart.radarContainer.createChild(am4core.Label);
      label.isMeasured = false;
      label.fontSize = 20;
      label.x = am4core.percent(50);
      label.y = am4core.percent(100);
      label.horizontalCenter = "middle";
      label.verticalCenter = "bottom";
      label.text = score;

      let hand = chart.hands.push(new am4charts.ClockHand());
      hand.axis = axis2;
      hand.innerRadius = am4core.percent(30);
      hand.startWidth = 10;
      hand.pin.disabled = true;
      hand.fill = am4core.color("#2471b0");
      hand.value = score;

      setTimeout(() => {
        var animation = new am4core.Animation(hand, {
          from: 0,
          to: score,
          property: 'value'
        }, 3000, am4core.ease.cubicOut).start();
      });
      // hand.events.on("propertychanged", function (ev) {
      //   range0.endValue = ev.target.value;
      //   range1.value = ev.target.value;
      //   label.text = axis2.positionToValue(hand.currentPosition).toFixed(1);
      //   axis2.invalidate();
      // });
    }).catch((e) => {
      console.error("Error when creating chart", e);
    })
  }
}
