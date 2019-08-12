import { Component, OnInit } from '@angular/core';

declare var SVG: any;

@Component({
  selector: 'app-flowchart',
  templateUrl: './flowchart.component.html',
  styleUrls: ['./flowchart.component.scss']
})
export class FlowchartComponent {

  svgjs: any;
  arrowMarker: any;
  perGridWH: any = {
    width: 200,
    height: 100
  }
  symbolsWH: any = {
    operation: {
      width: 100,
      height: 40,
    },
    decision: {
      width: 80,
      height: 80,
    },
    document: {
      width: 100,
      height: 50,
    },
    io: {
      width: 100,
      height: 50,
    },
    subroutine: {
      width: 100,
      height: 50,
    },
    database: {
      width: 100,
      height: 50
    },
    manualLoop: {
      width: 100,
      height: 50,
    },
  }
  defaultLineLength: any = 50;
  symbolContainerMargin: number = 20;
  flowChartData = {
    totalGrid: 4,
    startGridNum: 2,
    flowList: [
      {
        id: "el1",
        text: "start",
        type: "start",
        nextId: "el2",
      },
      {
        id: "el2",
        text: "operation1",
        type: "operation",
        nextId: "el3",
        nextIdPosition: "right",
      },
      {
        id: "el3",
        text: "io",
        type: "io",
        nextId: "el4",
        nextIdPosition: "right",
      },
      {
        id: "el4",
        text: "operation3",
        type: "operation",
        nextId: "el5",
        nextIdPosition: "top",
      },
      {
        id: "el5",
        text: "Manual loop1",
        type: "manual-loop",
        nextId: "el6",
        nextIdPosition: "right",
      },
      // {
      //   id: "el6",
      //   text: "document 1",
      //   type: "document",
      //   nextId: "el7",
      //   style: {
      //     bgColor: "yellow",
      //     lineColor: "red",
      //     borderColor: "green"
      //   },
      //   nextIdPosition: "bottom",
      // },
      // {
      //   id: "el6",
      //   text: "subroutine 1",
      //   type: "subroutine",
      //   nextId: "el7",
      //   nextIdPosition: "top",
      // }
      {
        id: "el6",
        text: "db1",
        type: "database",
        nextId: "el7",
        nextIdPosition: "bottom",
      },
      // {
      //   id: "el7",
      //   text: "N=1?",
      //   type: "decision",
      //   nextId: "el8",
      //   nextIdPosition: "right",
      // }
    ]
  }
  svgElementsCords: any = {};
  containerWH: any = {};

  constructor() {

    document.addEventListener("DOMContentLoaded", (event) => {

      let totalWidth = this.perGridWH.width * this.flowChartData.totalGrid;
      let totalHeight = window.innerHeight;
      let flowchartContElem = document.getElementById("flowchart_container");
      let flowChartContCss = {
        width: `${totalWidth}px`,
        height: `${totalHeight}px`,
        margin: `${this.symbolContainerMargin}px`,
      }
      Object.assign(flowchartContElem.style, flowChartContCss);
      this.containerWH = {
        width: parseInt(flowchartContElem.style.width, 10),
        height: parseInt(flowchartContElem.style.height, 10),
      };
      // Creates canvas 
      this.svgjs = SVG("flowchart_container").size(this.containerWH.width, this.containerWH.height);
      this.svgjs.defs().attr({ id: 'markerDefs' });
      let svgElem = document.getElementsByTagName("svg")[0];
      let svgCss = {
        border: "green solid",
      }
      Object.assign(svgElem.style, svgCss);

      this.createGridStructure();
      this.createArrowMarker();
      this.flowChartData.flowList.forEach((flowData, index) => {
        switch (flowData.type) {
          case "start": {
            this.drawStart(flowData);
            break;
          }
          case "operation": {
            this.drawOperation(flowData);
            break;
          }
          case "decision": {
            this.drawDecision(flowData);
            break;
          }
          case "document": {
            this.drawDocument(flowData);
            break;
          }
          case "io": {
            this.drawIO(flowData);
            break;
          }
          case "subroutine": {
            this.drawSubroutine(flowData);
            break;
          }
          case "database": {
            this.drawDatabase(flowData);
            break;
          }
          case "manual-loop": {
            this.drawManualLoop(flowData);
          }
        }
      });
    });
  }
  createGridStructure() {
    let y = 10;
    while (y < this.containerWH.height) {
      let line = this.svgjs.line(0, y, this.containerWH.width, y);
      line.stroke({ color: 'black', width: 0.5 });
      let text = this.svgjs.text(`${y}`);
      text.move(0, y - 2).font({ fill: '#f06', family: 'Inconsolata', size: 5 });
      y += 10;
    }
    let x = 10;
    while (x < this.containerWH.width) {
      let line = this.svgjs.line(x, 0, x, this.containerWH.height);
      line.stroke({ color: 'black', width: 0.5 });
      let text = this.svgjs.text(`${x}`);
      text.move(x + 2, 8).font({ fill: '#f06', family: 'Inconsolata', size: 5 });
      x += 10;
    }
  }
  createArrowMarker() {
    this.arrowMarker = this.svgjs.marker(8000, 8000, function (add) {
      add.path("M2 59,253 148,1 243,50 151,Z").attr({ stroke: 'black', 'stroke-width': 5 })
    }).attr({ id: 'arrowMarker', fill: 'black' });
    this.arrowMarker.size(200, 200);
    this.arrowMarker.ref(250, 150);
  }

  drawStart(flowData) {
    let startElement = this.svgjs.ellipse(100, 50).move(0, 0);
    startElement.fill('none');
    startElement.stroke({ color: '#f06', width: 3 });

    this.addIdToElement(startElement, flowData.id);
    let symbolBBox = startElement.node.getBBox();
    this.storeIntoSVGElemCords(flowData.id, symbolBBox);
    this.addTextToFlowSymbol(symbolBBox, flowData.text);

    this.drawConnectorLine(flowData, symbolBBox);
  }
  drawOperation(flowData) {
    let prevElement = this.getPreviousElement(flowData.id);
    let opCord = this.calculateOperationCord(prevElement);

    let opElement = this.svgjs.rect(this.symbolsWH.operation.width, this.symbolsWH.operation.height);
    opElement.move(opCord.x, opCord.y);
    opElement.fill("none");
    opElement.stroke({ color: '#f06', width: 3 });

    this.addIdToElement(opElement, flowData.id);
    let opBBox = this.getElementBBox(opElement);
    this.storeIntoSVGElemCords(flowData.id, opBBox);
    this.addTextToFlowSymbol(opBBox, flowData.text);

    this.drawConnectorLine(flowData, opBBox);
  }
  drawDecision(flowData) {
    let prevElement = this.getPreviousElement(flowData.id);
    let dcsCord = this.calculateDecisionCord(prevElement);

    let dcsElement = this.svgjs.polyline(`${dcsCord.x1} ${dcsCord.y1}, ${dcsCord.x2} ${dcsCord.y2}, ${dcsCord.x3} ${dcsCord.y3}, ${dcsCord.x4} ${dcsCord.y4}, ${dcsCord.x1} ${dcsCord.y1}`);
    dcsElement.fill("none");
    dcsElement.stroke({ color: '#f06', width: 3 });


    this.addIdToElement(dcsElement, flowData.id);
    let dcsBBox = this.getElementBBox(dcsElement);
    this.storeIntoSVGElemCords(flowData.id, dcsBBox);
    this.addTextToFlowSymbol(dcsBBox, flowData.text);

    this.drawConnectorLine(flowData, dcsBBox);
  }
  drawDocument(flowData) {
    let prevElement = this.getPreviousElement(flowData.id);
    let docCord = this.calculateDocumentCord(prevElement);

    let docElement = this.svgjs.path(`M${docCord.x1} ${docCord.y1}, V${docCord.vy1},H${docCord.hx},V${docCord.vy2},Q${docCord.qx} ${docCord.qy}, ${docCord.x2} ${docCord.y2}, T${docCord.tx} ${docCord.ty}`);
    this.styleElement(docElement, flowData.style);

    this.addIdToElement(docElement, flowData.id);
    let docBBox = this.getElementBBox(docElement);
    this.storeIntoSVGElemCords(flowData.id, docBBox);
    this.addTextToFlowSymbol(docBBox, flowData.text);

    this.drawConnectorLine(flowData, docBBox);
  }
  drawIO(flowData) {
    let prevElement = this.getPreviousElement(flowData.id);
    let ioCord = this.calculateIOCord(prevElement);

    let ioElement = this.svgjs.path(`M${ioCord.x1} ${ioCord.y1}, L${ioCord.x2} ${ioCord.y2}, L${ioCord.x3} ${ioCord.y3}, L${ioCord.x4} ${ioCord.y4}, z`);
    ioElement.fill("none");
    ioElement.stroke({ color: '#f06', width: 3 });

    this.addIdToElement(ioElement, flowData.id);
    let docBBox = this.getElementBBox(ioElement);
    this.storeIntoSVGElemCords(flowData.id, docBBox);
    this.addTextToFlowSymbol(docBBox, flowData.text);

    this.drawConnectorLine(flowData, docBBox);
  }
  drawSubroutine(flowData) {
    let prevElement = this.getPreviousElement(flowData.id);
    let subrCord = this.calculateSubrCord(prevElement);
    let subrElement = this.svgjs.rect(this.symbolsWH.subroutine.width, this.symbolsWH.subroutine.height);
    subrElement.move(subrCord.x1, subrCord.y1);
    subrElement.fill("none");
    subrElement.stroke({ color: '#f06', width: 3 });
    debugger
    let subrInnerElement1 = this.svgjs.path(`M${subrCord.ix1} ${subrCord.iy1}, 
    V${subrCord.ivy1}`);
    let subrInnerElement2 = this.svgjs.path(`M${subrCord.ix2} ${subrCord.iy2}, 
    V${subrCord.ivy2}`);
    subrInnerElement1.fill("none");
    subrInnerElement1.stroke({ color: '#f06', width: 3 });
    subrInnerElement2.fill("none");
    subrInnerElement2.stroke({ color: '#f06', width: 3 });

    this.addIdToElement(subrElement, flowData.id);
    let docBBox = this.getElementBBox(subrElement);
    this.storeIntoSVGElemCords(flowData.id, docBBox);
    this.addTextToFlowSymbol(docBBox, flowData.text);

    this.drawConnectorLine(flowData, docBBox);
  }
  drawDatabase(flowData) {
    let prevElement = this.getPreviousElement(flowData.id);
    let dbCord = this.calculateDBCord(prevElement);

    let dbElement = this.svgjs.path(`M${dbCord.x1} ${dbCord.y1},C${dbCord.c1x1} ${dbCord.c1y1}, 
    ${dbCord.c1x2} ${dbCord.c1y2} ,${dbCord.c1x3} ${dbCord.c1y3} ,V${dbCord.vy1}
    ,C${dbCord.c2x1} ${dbCord.c2y1} ,${dbCord.c2x2} ${dbCord.c2y2} ,${dbCord.c2x3} ${dbCord.c2y3} ,Z`);
    dbElement.fill("none");
    dbElement.stroke({ color: '#f06', width: 3 });

    let dbCurve1 = this.svgjs.path(`M${dbCord.c3x1} ${dbCord.c3y1} ,C${dbCord.c3x2} ${dbCord.c3y2} ,${dbCord.c3x3} ${dbCord.c3y3},${dbCord.c3x4} ${dbCord.c3y4}`);
    let dbCurve2 = this.svgjs.path(`M${dbCord.c4x1} ${dbCord.c4y1} ,C${dbCord.c4x2} ${dbCord.c4y2} ,${dbCord.c4x3} ${dbCord.c4y3},${dbCord.c4x4} ${dbCord.c4y4}`);
    let dbCurve3 = this.svgjs.path(`M${dbCord.c5x1} ${dbCord.c5y1} ,C${dbCord.c5x2} ${dbCord.c5y2} ,${dbCord.c5x3} ${dbCord.c5y3},${dbCord.c5x4} ${dbCord.c5y4}`);

    dbCurve1.fill("none");
    dbCurve1.stroke({ color: '#f06', width: 3 });
    dbCurve2.fill("none");
    dbCurve2.stroke({ color: '#f06', width: 3 });
    dbCurve3.fill("none");
    dbCurve3.stroke({ color: '#f06', width: 3 });

    this.addIdToElement(dbElement, flowData.id);
    let dbBBox = this.getElementBBox(dbElement);
    this.storeIntoSVGElemCords(flowData.id, dbBBox);
    this.addTextToFlowSymbol(dbBBox, flowData.text);

    this.drawConnectorLine(flowData, dbBBox);
  }
  drawManualLoop(flowData) {
    let prevElement = this.getPreviousElement(flowData.id);
    let manualLoopCord = this.calculateManualLoopCord(prevElement);

    let manualLoopElement = this.svgjs.path(`M${manualLoopCord.x1} ${manualLoopCord.y1}, 
    H${manualLoopCord.h1x1}, 
    L${manualLoopCord.l1x1} ${manualLoopCord.l1y1}, 
    H${manualLoopCord.h2x1}, z`);

    manualLoopElement.fill("none");
    manualLoopElement.stroke({ color: '#f06', width: 3 });

    this.addIdToElement(manualLoopElement, flowData.id);
    let docBBox = this.getElementBBox(manualLoopElement);
    this.storeIntoSVGElemCords(flowData.id, docBBox);
    this.addTextToFlowSymbol(docBBox, flowData.text);

    this.drawConnectorLine(flowData, docBBox);
  }
  calculateManualLoopCord(prevElement) {
    let manualLoopCord: any = {};
    debugger
    this.svgElementsCords[prevElement.id].lines.map((lineCord) => {
      const { manualLoop } = this.symbolsWH;
      switch (prevElement.nextIdPosition) {
        case "top": {
          manualLoopCord.x1 = lineCord.x - (manualLoop.width / 2);
          manualLoopCord.y1 = (lineCord.heightY - manualLoop.height);
          break;
        }
        case "left": {
          manualLoopCord.x1 = lineCord.widthX - manualLoop.width;
          manualLoopCord.y1 = lineCord.y - (manualLoop.height / 2);
          break;
        }
        case "right": {
          manualLoopCord.x1 = lineCord.widthX;
          manualLoopCord.y1 = lineCord.y - (manualLoop.height / 2);
          break;
        }
        default: {
          manualLoopCord.x1 = lineCord.x - (manualLoop.width / 2);;
          manualLoopCord.y1 = lineCord.heightY;
        }
      }
      manualLoopCord.h1x1 = manualLoopCord.x1 + manualLoop.width;
      manualLoopCord.l1x1 = manualLoopCord.h1x1 - 10;
      manualLoopCord.l1y1 = manualLoopCord.y1 + manualLoop.height;
      manualLoopCord.h2x1 = manualLoopCord.x1 + 10;
      
    });
    return manualLoopCord;
  }
  calculateDBCord(prevElement) {
    let dbCord: any = {};
    this.svgElementsCords[prevElement.id].lines.map((lineCord) => {
      const { database } = this.symbolsWH;
      switch (prevElement.nextIdPosition) {
        case "top": {
          dbCord.x1 = lineCord.x - (database.width / 2);
          dbCord.y1 = (lineCord.heightY - database.height) - 10;
          break;
        }
        case "left": {
          dbCord.x1 = lineCord.widthX - database.width;
          dbCord.y1 = lineCord.y - (database.height / 2);
          break;
        }
        case "right": {
          dbCord.x1 = lineCord.widthX;
          dbCord.y1 = lineCord.y - (database.height / 2);
          break;
        }
        default: {
          dbCord.x1 = lineCord.x - (database.width / 2);;
          dbCord.y1 = lineCord.heightY + 10;
        }
      }
      dbCord.c1x1 = dbCord.x1;
      dbCord.c1y1 = dbCord.y1 - 10;
      dbCord.c1x2 = dbCord.x1 + database.width;
      dbCord.c1y2 = dbCord.c1y1;
      dbCord.c1x3 = dbCord.c1x2;
      dbCord.c1y3 = dbCord.y1;

      dbCord.vy1 = dbCord.y1 + database.height;

      dbCord.c2x1 = dbCord.c1x3;
      dbCord.c2y1 = dbCord.vy1 + 10;
      dbCord.c2x2 = dbCord.x1;
      dbCord.c2y2 = dbCord.c2y1;
      dbCord.c2x3 = dbCord.x1;
      dbCord.c2y3 = dbCord.vy1;

      dbCord.c3x1 = dbCord.x1;
      dbCord.c3y1 = dbCord.y1;
      dbCord.c3x2 = dbCord.c3x1;
      dbCord.c3y2 = dbCord.c3y1 + 10;
      dbCord.c3x3 = dbCord.c1x3;
      dbCord.c3y3 = dbCord.c3y2;
      dbCord.c3x4 = dbCord.c3x3;
      dbCord.c3y4 = dbCord.c3y1;

      dbCord.c4x1 = dbCord.c3x1;
      dbCord.c4y1 = dbCord.c3y1 + 5;
      dbCord.c4x2 = dbCord.c4x1;
      dbCord.c4y2 = dbCord.c4y1 + 10;
      dbCord.c4x3 = dbCord.c3x3;
      dbCord.c4y3 = dbCord.c4y2;
      dbCord.c4x4 = dbCord.c4x3;
      dbCord.c4y4 = dbCord.c4y1;

      dbCord.c5x1 = dbCord.c3x1;
      dbCord.c5y1 = dbCord.c4y1 + 5;
      dbCord.c5x2 = dbCord.c5x1;
      dbCord.c5y2 = dbCord.c5y1 + 10;
      dbCord.c5x3 = dbCord.c4x3;
      dbCord.c5y3 = dbCord.c5y2;
      dbCord.c5x4 = dbCord.c5x3;
      dbCord.c5y4 = dbCord.c5y1;

    });
    return dbCord;
  }
  calculateIOCord(prevElement) {
    let docCord: any = {};
    this.svgElementsCords[prevElement.id].lines.map((lineCord) => {
      const { io } = this.symbolsWH;
      switch (prevElement.nextIdPosition) {
        case "top": {
          docCord.x1 = lineCord.x - (io.width / 2);
          docCord.y1 = lineCord.heightY;
          break;
        }
        case "left": {
          debugger
          docCord.x1 = lineCord.widthX - io.width;
          docCord.y1 = lineCord.y + (io.height / 2);
          break;
        }
        case "right": {
          docCord.x1 = lineCord.widthX - 5;
          docCord.y1 = lineCord.y + (io.height / 2);
          break;
        }
        default: {
          docCord.x1 = lineCord.x - (io.width / 2);;
          docCord.y1 = lineCord.heightY + io.height;
        }
      }
      docCord.x2 = docCord.x1 + 10;
      docCord.y2 = docCord.y1 - io.height;
      docCord.x3 = docCord.x2 + io.width;
      docCord.y3 = docCord.y2
      docCord.x4 = docCord.x3 - 10;
      docCord.y4 = docCord.y1;
      docCord.x5 = docCord.x1;
      docCord.y5 = docCord.y1;
    });
    return docCord;
  }
  calculateSubrCord(prevElement) {
    let subrCord: any = {};
    debugger
    this.svgElementsCords[prevElement.id].lines.map((lineCord) => {
      const { subroutine } = this.symbolsWH;
      switch (prevElement.nextIdPosition) {
        case "top": {
          debugger
          subrCord.x1 = lineCord.x - (subroutine.width / 2);
          subrCord.y1 = lineCord.heightY - subroutine.height;
          break;
        }
        case "left": {
          subrCord.x1 = lineCord.widthX - subroutine.width;
          subrCord.y1 = lineCord.y - (subroutine.height / 2);
          break;
        }
        case "right": {
          subrCord.x1 = lineCord.widthX;
          subrCord.y1 = lineCord.y - (subroutine.height / 2);
          break;
        }
        default: {
          subrCord.x1 = lineCord.x - (subroutine.width / 2);;
          subrCord.y1 = lineCord.heightY;
        }
      }
      subrCord.ix1 = subrCord.x1 + 10;
      subrCord.iy1 = subrCord.y1;
      subrCord.ivy1 = subrCord.y1 + subroutine.height;
      subrCord.ix2 = (subrCord.x1 + subroutine.width) - 10;
      subrCord.iy2 = subrCord.y1;
      subrCord.ivy2 = subrCord.y1 + subroutine.height;
    });
    return subrCord;
  }
  calculateDocumentCord(prevElement) {
    let docCord: any = {};
    this.svgElementsCords[prevElement.id].lines.map((lineCord) => {
      const { document } = this.symbolsWH;
      switch (prevElement.nextIdPosition) {
        case "top": {
          docCord.x1 = lineCord.x - (this.symbolsWH.document.width / 2);
          docCord.y1 = lineCord.heightY;
          break;
        }
        case "left": {
          docCord.x1 = lineCord.widthX - this.symbolsWH.document.width;
          docCord.y1 = lineCord.y + (this.symbolsWH.document.height / 2);
          break;
        }
        case "right": {
          docCord.x1 = lineCord.widthX;
          docCord.y1 = lineCord.y + (this.symbolsWH.document.height / 2);
          break;
        }
        default: {
          docCord.x1 = lineCord.x - (document.width / 2);;
          docCord.y1 = lineCord.heightY + document.height;
        }
      }
      docCord.vy1 = docCord.y1 - document.height;
      docCord.hx = docCord.x1 + document.width;
      docCord.vy2 = docCord.y1;
      docCord.qx = docCord.x1 + ((document.width / 4) * 3);
      docCord.qy = docCord.y1 - (document.height / 4);
      docCord.x2 = docCord.x1 + (document.width / 2);
      docCord.y2 = docCord.y1;
      docCord.tx = docCord.x1;
      docCord.ty = docCord.y1;
    });
    return docCord;
  }
  calculateOperationCord(prevElement) {
    let opCord: any = {};
    this.svgElementsCords[prevElement.id].lines.map((lineCord) => {
      const { operation } = this.symbolsWH;
      switch (prevElement.nextIdPosition) {
        case "top": {
          opCord.x = lineCord.x - (operation.width / 2);
          opCord.y = lineCord.heightY - operation.height;
          break;
        }
        case "left": {
          opCord.x = lineCord.widthX - operation.width;
          opCord.y = lineCord.y - (operation.height / 2);
          break;
        }
        case "right": {
          opCord.x = lineCord.widthX;
          opCord.y = lineCord.y - (operation.height / 2);
          break;
        }
        default: {
          opCord.x = lineCord.x - (operation.width / 2);
          opCord.y = lineCord.heightY;
        }
      }
    });
    return opCord;
  }
  calculateDecisionCord(prevElement) {
    let opCord: any = {};
    debugger
    this.svgElementsCords[prevElement.id].lines.map((lineCord) => {
      const { decision } = this.symbolsWH;
      switch (prevElement.nextIdPosition) {
        case "top": {
          opCord.x1 = lineCord.x;
          opCord.y1 = lineCord.heightY - decision.height;
          break;
        }
        case "left": {
          opCord.x1 = lineCord.widthX - (decision.width / 2);
          opCord.y1 = lineCord.y - (decision.height / 2);
          break;
        }
        case "right": {
          opCord.x1 = lineCord.widthX + (decision.width / 2);
          opCord.y1 = lineCord.y - (decision.height / 2);
          break;
        }
        default: {
          opCord.x1 = lineCord.x;
          opCord.y1 = lineCord.heightY;
        }
      }
      opCord.x2 = opCord.x1 + (decision.width / 2);
      opCord.y2 = opCord.y1 + (decision.height / 2);
      opCord.x3 = opCord.x1;
      opCord.y3 = opCord.y2 + (decision.height / 2);
      opCord.x4 = opCord.x1 - (decision.width / 2);
      opCord.y4 = opCord.y2;
    });
    return opCord;
  }
  addIdToElement(element, id) {
    element.node.id = id;
  }
  addTextToFlowSymbol(symbolBBox, text) {
    let startSymbolText = this.svgjs.text(`${text}`);
    let textCord = this.calculateFlowSymbolTextCord(symbolBBox);
    startSymbolText.move(textCord.x, textCord.y).font({ fill: '#f06', family: 'Inconsolata', size: 10 });
  }
  calculateFlowSymbolTextCord(symbolBBox) {
    return {
      x: symbolBBox.x + (symbolBBox.width / 2) - 10,
      y: symbolBBox.y + (symbolBBox.height / 2),
    }
  }
  calculateConnectorLineCord(elmBBox, nextIdPosition, type) {
    if (type === "document") {
      elmBBox.height = this.symbolsWH.document.height;
    }
    let connectorLineCord;
    let connectorPathCords: any = {};
    switch (nextIdPosition) {
      case "top": {
        connectorLineCord = {
          x: elmBBox.x + (elmBBox.width / 2),
          y: elmBBox.y,
          heightY: elmBBox.y - this.defaultLineLength,
        }
        connectorPathCords.value = `M${connectorLineCord.x} ${connectorLineCord.y}, V${connectorLineCord.heightY}`;
        break;
      }
      case "left": {
        connectorLineCord = {
          x: elmBBox.x,
          y: elmBBox.y + (elmBBox.height / 2),
        }
        connectorLineCord.widthX = connectorLineCord.x - this.defaultLineLength;
        connectorPathCords.value = `M${connectorLineCord.x} ${connectorLineCord.y}, H${connectorLineCord.widthX}`;
        break;
      }
      case "right": {
        connectorLineCord = {
          x: elmBBox.x + elmBBox.width,
          y: elmBBox.y + (elmBBox.height / 2),
        }
        connectorLineCord.widthX = connectorLineCord.x + this.defaultLineLength;
        connectorPathCords.value = `M${connectorLineCord.x} ${connectorLineCord.y}, H${connectorLineCord.widthX}`;
        break;
      }
      default: {
        connectorLineCord = {
          x: elmBBox.x + (elmBBox.width / 2),
          y: elmBBox.y + elmBBox.height,
          heightY: elmBBox.y + elmBBox.height + this.defaultLineLength,
        }
        connectorPathCords.value = `M${connectorLineCord.x} ${connectorLineCord.y}, V${connectorLineCord.heightY}`;
      }
    }
    connectorPathCords.connectorLineCord = connectorLineCord;
    return connectorPathCords;
  }
  drawConnectorLine(flowData, BBox) {
    let connectorLine;
    let connectorPathCords = this.calculateConnectorLineCord(BBox, flowData.nextIdPosition, flowData.type);
    this.addLinesToSVGElemCords(flowData.id, connectorPathCords.connectorLineCord);

    connectorLine = this.svgjs.path(`${connectorPathCords.value}`);
    connectorLine.fill('none');
    connectorLine.stroke({ color: '#f06', width: 3 });
    this.drawArrowToConnectorLine(connectorLine);
    return connectorLine;
  }
  drawArrowToConnectorLine(connector) {
    connector.marker('end', this.arrowMarker);
  }
  storeIntoSVGElemCords(id, symbolBBox) {
    if (!this.svgElementsCords[id]) {
      this.svgElementsCords[id] = {};
    }
    this.svgElementsCords[id].cords = symbolBBox;
  }
  addLinesToSVGElemCords(id, connectorLineCord) {
    if (!this.svgElementsCords[id].lines) {
      this.svgElementsCords[id].lines = [];
    }
    this.svgElementsCords[id].lines.push(connectorLineCord);
  }
  getPreviousElement(currentElemId) {
    return this.flowChartData.flowList.filter((flowObj) => {
      return flowObj.nextId === currentElemId;
    })[0];
  }
  styleElement(element, elementStyle) {
    if (elementStyle) {
      element.fill(elementStyle.bgColor);
      element.stroke({ color: elementStyle.borderColor, width: 3 });
    }
  }
  getElementBBox(element) {
    return element.node.getBBox();
  }
}
