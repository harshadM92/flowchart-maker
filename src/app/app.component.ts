import { Component } from '@angular/core';

declare var $: any;
declare var Raphael: any;
declare var SVG: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  
  perGridWH : any = {
    width: 200,
    height: 100
  }
  symbolContainerMargin: number = 20;
  flowChartData = {
    totalGrid: 4,
    startGridNum: 2,
    flowList: [
      {
        id: "el1",
        test: "start",
        type: "start",
        nextId: "el2"
      },
      {
        id: "el2",
        test: "operation1",
        type: "operation",
        nextId: "el3"
      }
    ]
  }

  constructor() {
    $( document ).ready(() =>{
      return;
      $("#symbol_conatiner").css(
        {
          width: this.perGridWH.width*this.flowChartData.totalGrid,
          height:this.perGridWH.height*this.flowChartData.totalGrid,
          margin:this.symbolContainerMargin,
        }
      );
            // Creates Raphael js canvas 320 × 200 at 10, 50
      // let paper = Raphael("symbol_conatiner", $("#symbol_conatiner").width(), $("#symbol_conatiner").height());
      // $("svg").css({border:"green solid"})
      // let containerWH = {
      //   width: $("#symbol_conatiner").width(),
      //   height: $("#symbol_conatiner").height(),
      // };
      // let x=10;
      // while(x<containerWH.width) {
      //   let path = paper.path(`M${x} 0,V${containerWH.height}`);
      //   let text = paper.text(x+4, 7, x);
      //   text.attr({
      //     "font-size":5
      //   });
      //   x+=10;
      // }
      // let y=10;
      // while(y<containerWH.height) {
      //   let path = paper.path(`M0 ${y},H${containerWH.width}`);
      //   y+=10;
      // }
      // let path = paper.path(`M50 30,L50 80`);
      // path.attr({
      //   "stroke-width": 2,
      //   "stroke": "green",
      // });

      // Creates canvas 320 × 200 at 10, 50
      console.log( $("#symbol_conatiner").width());
      console.log($("#symbol_conatiner").height());
      let draw = SVG("symbol_conatiner").size($("#symbol_conatiner").width(), $("#symbol_conatiner").height());
      $("svg").css({border:"green solid"})
      let containerWH = {
        width: $("#symbol_conatiner").width(),
        height: $("#symbol_conatiner").height(),
      };
      let y=10;
      while(y<containerWH.height) {
        let line = draw.line(0, y, containerWH.width, y);
        line.stroke({ color: 'black', width: 0.5 });
        let text = draw.text(`${y}`);
        text.move(0,y-2).font({ fill: '#f06', family: 'Inconsolata', size: 5 });
        y+=10;
      }
      let x=10;
      while(x<containerWH.width) {
        let line = draw.line(x, 0, x, containerWH.height);
        line.stroke({ color: 'black', width: 0.5 });
        let text = draw.text(`${x}`);
        text.move(x+2,8).font({ fill: '#f06', family: 'Inconsolata', size: 5 });
        x+=10;
      }
      //decision
      let decision = draw.polyline('50 50 ,90 90 ,50 130 ,10 90 ,50 50').fill('none').stroke({ width: 1,color: '#f06', })
      let line = draw.line(90, 90, 130, 90);
      line.stroke({ color: '#f06', width: 3 });
      let arrowLine = draw.path('M 120, 80, 130, 90,120,100 Z');
      arrowLine.fill('#f06')
      arrowLine.stroke({ color: '#f06', width: 1 });
      //document
      let document = draw.path('M180 90, V40 H280 V90 Q255 60, 230,90 T180 90');
      document.fill('none');
      document.stroke({ color: '#f06', width: 1 });
      let io = draw.path('M20 200 ,L40 160 ,H90 ,L70 200 ,H20');
      io.fill('none');
      io.stroke({ color: '#f06', width: 1 });
      //subroutine
      let subroutine = draw.rect(80, 40).move(130,160);
      subroutine.fill('none');
      subroutine.stroke({ color: '#f06', width: 1 });
      let subroutineLine1 = draw.path('M140 160 ,V200');
      subroutineLine1.fill('none');
      subroutineLine1.stroke({ color: '#f06', width: 1 });
      let subroutineLine2 = draw.path('M200 160 ,V200');
      subroutineLine2.fill('none');
      subroutineLine2.stroke({ color: '#f06', width: 1 });
      let subroutine1Text = draw.text(`subroutine1`);
      subroutine1Text.move(150,175).font({ fill: '#f06', family: 'Inconsolata', size: 10 });
      
      // let y=10;1
      // while(y<containerWH.height) {
      //   let path = paper.path(`M0 ${y},H${containerWH.width}`);
      //   y+=10;
      // }
      // let path = paper.path(`M50 30,L50 80`);
      // path.attr({
      //   "stroke-width": 2,
      //   "stroke": "green",
      // });
    });
  }
}
