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
    storedData: {
      width: 100,
      height: 50,
    },
    delay: {
      width: 100,
      height: 50,
    },
    display: {
      width: 100,
      height: 50,
    },
    collate: {
      width: 100,
      height: 100,
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
        nextIdPosition: "bottom",
      },
      {
        id: "el3",
        text: "document 1",
        type: "document",
        nextId: "el4",
        nextIdPosition: "right",
        style: {
          bgColor: "yellow",
          lineColor: "red",
          borderColor: "green"
        },
      },
      {
        id: "el4",
        text: "io",
        type: "io",
        nextId: "el5",
        nextIdPosition: "bottom",
      },
      {
        id: "el5",
        text: "subroutine 1",
        type: "subroutine",
        nextId: "el6",
        nextIdPosition: "right",
      },

      {
        id: "el6",
        text: "N=1?",
        type: "decision",
        nextId: "el7",
        nextIdPosition: "bottom",
        style: {
          bgColor: "yellow",
          lineColor: "red",
          borderColor: "green"
        },
      },

      {
        id: "el7",
        text: "database",
        type: "database",
        nextId: "el8",
        nextIdPosition: "right",
      },
      {
        id: "el8",
        text: "Manual loop1",
        type: "manual-loop",
        nextId: "el9",
        nextIdPosition: "bottom",
      },
      {
        id: "el9",
        text: "sd1",
        type: "stored-data",
        nextId: "el10",
        nextIdPosition: "right",
      },
      {
        id: "el10",
        text: "delay",
        type: "delay",
        nextId: "el11",
        nextIdPosition: "bottom",
      },
      {
        id: "el11",
        text: "display",
        type: "display",
        nextId: "el12",
        nextIdPosition: "right",
      },
      {
        id: "el12",
        text: "collate",
        type: "collate",
        nextId: "el13",
        nextIdPosition: "bottom",
      },
    ]
  }
  symbolData: any = {};
  svgElements: any = {};
  containerWH: any = {};
  uniqueSymboleId: any = {};
  constructor() {

    document.addEventListener("DOMContentLoaded", (event) => {
      try {
        this.printTime("validateFlowData start");
        this.validateFlowData();
        this.printTime("validateFlowData end");
      } catch (error) {

        console.log(JSON.parse(error.message));
        const errorMessageObj = JSON.parse(error.message);
        alert(`status --->  ${errorMessageObj.status} \n message --->  ${errorMessageObj.message}`);
        throw new Error(error);
      }
      let totalWidth = this.perGridWH.width * this.flowChartData.totalGrid;
      let totalHeight = window.innerHeight;
      let flowchartContElem = document.getElementById("flowchart_container");
      let flowChartContCss = {
        width: `${totalWidth * 5}px`,
        height: `${totalHeight * 5}px`,
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
      this.printTime("initializeSymbols start");
      this.initializeSymbols();
      this.printTime("initializeSymbols end");
      this.printTime("positionSymbols start");
      this.positionSymbols();
      this.printTime("positionSymbols end");
    });
  }
  printTime(message) {
    let currentdate = new Date();
    let datetime = `${message}: ${currentdate.getHours()}: ${currentdate.getMinutes()}: ${currentdate.getSeconds()}: ${currentdate.getMilliseconds()}}`;
    console.log("datetime", datetime);
  }
  validateFlowData() {
    const { flowList } = this.flowChartData;
    flowList.map((flowObj) => {
      this.validateUniqueId(flowObj)
    });
  }
  validateUniqueId(flowobj) {
    if (this.uniqueSymboleId[flowobj.id]) {
      let errorObj = {
        status: 101,
        message: `duplicate id (${flowobj.id}) found`,
      }
      throw new Error(JSON.stringify(errorObj));
    } else {
      this.uniqueSymboleId[flowobj.id] = "PRESENT";
    }
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
  initializeSymbols() {
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
          break;
        }
        case "stored-data": {
          this.drawStoredData(flowData);
          break;
        }
        case "delay": {
          this.drawDelay(flowData);
          break;
        }
        case "display": {
          this.drawDisplay(flowData);
          break;
        }
        case "collate": {
          this.drawCollate(flowData);
          break;
        }
      }
    });
  }
  positionSymbols() {
    Object.keys(this.svgElements).forEach((id) => {
      let svgElement = this.svgElements[id];
      const { flowObj } = svgElement;
      switch (flowObj.type) {
        case "start": {
          this.positionStart(id, svgElement);
          break;
        }
        case "operation": {
          this.positionOperation(id, svgElement);
          break;
        }
        case "decision": {
          this.positionDecision(id, svgElement);
          break;
        }
        case "document": {
          this.positionDocument(id, svgElement);
          break;
        }
        case "io": {
          this.positionIO(id, svgElement);
          break;
        }
        case "subroutine": {
          this.positionSubroutine(id, svgElement);
          break;
        }
        case "database": {
          this.positionDatabase(id, svgElement);
          break;
        }
        case "manual-loop": {
          this.positionManualLoop(id, svgElement);
          break;
        }
        case "stored-data": {
          this.positionStoredData(id, svgElement);
          break;
        }
        case "delay": {
          this.positionDelay(id, svgElement);
          break;
        }
        case "display": {
          this.positionDisplay(id, svgElement);
          break;
        }
        case "collate": {
          this.positionCollate(id, svgElement);
          break;
        }
      }
      svgElement.isPositioned = true;
    });
    console.log('svgElements',this.svgElements);
  }
  drawStart(flowData) {
    let startElement = this.svgjs.ellipse(100, 50).move(0, 0);
    startElement.fill('none');
    startElement.stroke({ color: '#f06', width: 3 });

    let symbolBBox = startElement.node.getBBox();
    this.addIdToElement(startElement, flowData.id);
    this.storeIntoSVGElemCords(flowData, symbolBBox, startElement);
    this.addTextToFlowSymbol(symbolBBox, flowData.text, flowData.id);
    // this.drawConnectorLine(flowData, symbolBBox);
  }
  // positionStart(id,svgElement) {
  //   svgElement.transform({x:50,y:50});
  //   this.positionTextToFlowSymbol(id);
  //   this.updateSVGElement(id, svgElement);
  // }
  positionStart(id, svgElement) {
    const { element } = svgElement;
    element.transform({ x: 200, y: 50 });
    const elementTransormedObj: any = element.transform();
    svgElement.symbolBBox.x = elementTransormedObj.x;
    svgElement.symbolBBox.y = elementTransormedObj.y;
    this.positionTextToFlowSymbol(id);
    this.updateSVGElement(id, svgElement);
  }
  drawOperation(flowData) {
    //let prevElement = this.getPreviousElement(flowData.id);
    //let opCord = this.calculateOperationCord(prevElement);
    const { operation: { width, height } } = this.symbolsWH;

    let opElement = this.svgjs.rect(width, height);
    //opElement.move(opCord.x, opCord.y);
    opElement.fill("none");
    opElement.stroke({ color: '#f06', width: 3 });

    this.addIdToElement(opElement, flowData.id);
    let opBBox = this.getElementBBox(opElement);
    this.storeIntoSVGElemCords(flowData, opBBox, opElement);
    this.addTextToFlowSymbol(opBBox, flowData.text, flowData.id);

    //this.drawConnectorLine(flowData, opBBox);
  }
  positionOperation(id, svgElement) {
    const { element } = svgElement;
    let prevElement = this.getPreviousSVGElement(id);
    let opPositionCords = this.calculatePositionCord(svgElement, prevElement);
    console.log("opPositionCords", opPositionCords);

    // const { symbolBBox: { height, width, x, y } } = prevElement;
    // const positionCords = {
    //   x: (x + (width / 2)) - (symbolBBox.width / 2),
    //   y: y + height + this.defaultLineLength,
    // }
    element.transform({ x: opPositionCords.x, y: opPositionCords.y });
    const elementTransormedObj: any = element.transform();
    svgElement.symbolBBox.x = elementTransormedObj.x;
    svgElement.symbolBBox.y = elementTransormedObj.y;
    this.positionTextToFlowSymbol(id);
    this.updateSVGElement(id, svgElement);
  }
  drawDecision(flowData) {
    // let prevElement = this.getPreviousElement(flowData.id);
    let dcsCord = this.calculateDecisionCord();
    const { x1, y1, x2, y2, x3, y3, x4, y4, } = dcsCord;

    let dcsElement = this.svgjs.polyline(`${x1} ${y1}, ${x2} ${y2}, ${x3} ${y3}, ${x4} ${y4}, ${x1} ${y1}`);
    // dcsElement.fill("none");
    // dcsElement.stroke({ color: '#f06', width: 3 });
    this.styleElement(dcsElement, flowData.style);

    this.addIdToElement(dcsElement, flowData.id);
    let dcsBBox = this.getElementBBox(dcsElement);
    this.storeIntoSVGElemCords(flowData, dcsBBox, dcsElement);
    this.addTextToFlowSymbol(dcsBBox, flowData.text, flowData.id);

    //this.drawConnectorLine(flowData, dcsBBox);
  }
  positionDecision(id, svgElement) {
    const { element, symbolBBox } = svgElement;
    let prevElement = this.getPreviousSVGElement(id);

    let decisionPositionCords = this.calculatePositionCord(svgElement, prevElement);
    console.log("decisionPositionCords", decisionPositionCords);
    element.transform({ x: decisionPositionCords.x, y: decisionPositionCords.y });
    const elementTransormedObj: any = element.transform();
    symbolBBox.x = elementTransormedObj.x;
    symbolBBox.y = elementTransormedObj.y;
    this.positionTextToFlowSymbol(id);
    this.updateSVGElement(id, svgElement);
  }
  drawDocument(flowData) {

    let docCord = this.calculateDocumentCord();
    console.log("docCord", docCord);
    let docElement = this.svgjs.path(`M${docCord.x1} ${docCord.y1}, 
    H${docCord.hx1},V${docCord.vy1},
    Q${docCord.qx} ${docCord.qy}, ${docCord.x2} ${docCord.y2}, T${docCord.tx} ${docCord.ty}, Z`);
    this.styleElement(docElement, flowData.style);

    this.addIdToElement(docElement, flowData.id);
    let docBBox = this.getElementBBox(docElement);
    this.storeIntoSVGElemCords(flowData, docBBox, docElement);
    this.addTextToFlowSymbol(docBBox, flowData.text, flowData.id);
    // this.drawConnectorLine(flowData, docBBox);
  }
  positionDocument(id, svgElement) {
    const { element, symbolBBox } = svgElement;
    let prevElement = this.getPreviousSVGElement(id);

    let documentPositionCords = this.calculatePositionCord(svgElement, prevElement);
    console.log("documentPositionCords", documentPositionCords);
    element.transform({ x: documentPositionCords.x, y: documentPositionCords.y });
    const elementTransormedObj: any = element.transform();
    symbolBBox.x = elementTransormedObj.x;
    symbolBBox.y = elementTransormedObj.y;
    this.positionTextToFlowSymbol(id);
    this.updateSVGElement(id, svgElement);
  }
  drawIO(flowData) {

    let ioCord = this.calculateIOCord();
    console.log("ioCord", ioCord);
    let ioElement = this.svgjs.path(`M${ioCord.x1} ${ioCord.y1}, 
    H${ioCord.hx1}, L${ioCord.x2} ${ioCord.y2},
    L${ioCord.x3} ${ioCord.y3}, Z`);
    ioElement.fill("none");
    ioElement.stroke({ color: '#f06', width: 3 });

    this.addIdToElement(ioElement, flowData.id);
    let ioBBox = this.getElementBBox(ioElement);
    this.storeIntoSVGElemCords(flowData, ioBBox, ioElement);
    this.addTextToFlowSymbol(ioBBox, flowData.text, flowData.id);

    // this.drawConnectorLine(flowData, ioBBox);
  }
  positionIO(id, svgElement) {
    const { element, symbolBBox } = svgElement;
    let prevElement = this.getPreviousSVGElement(id);

    let documentPositionCords = this.calculatePositionCord(svgElement, prevElement);
    console.log("documentPositionCords", documentPositionCords);
    element.transform({ x: documentPositionCords.x, y: documentPositionCords.y });
    const elementTransormedObj: any = element.transform();
    symbolBBox.x = elementTransormedObj.x;
    symbolBBox.y = elementTransormedObj.y;
    this.positionTextToFlowSymbol(id);
    this.updateSVGElement(id, svgElement);
  }
  drawSubroutine(flowData) {

    let subrCord = this.calculateSubrCord();
    const { x1, y1, h1x1, v1y1, h2x1, v2y1, ih1x1, iv1y1, ih2x1, iv2y1 } = subrCord;
    console.log("subrCord", subrCord);
    let subrElement = this.svgjs.path(`M${x1} ${y1}, H${h1x1}, V${v1y1}, H${h2x1}, V${v2y1}, H${ih1x1},
    V${iv1y1}, H${ih2x1}, V${iv2y1}`);
    subrElement.fill("none");
    subrElement.stroke({ color: '#f06', width: 3 });

    this.addIdToElement(subrElement, flowData.id);
    let subRBBox = this.getElementBBox(subrElement);
    this.storeIntoSVGElemCords(flowData, subRBBox, subrElement);
    this.addTextToFlowSymbol(subRBBox, flowData.text, flowData.id);

    // this.drawConnectorLine(flowData, subRBBox);
  }
  positionSubroutine(id, svgElement) {
    const { element, symbolBBox } = svgElement;
    let prevElement = this.getPreviousSVGElement(id);

    let subroutinePositionCords = this.calculatePositionCord(svgElement, prevElement);
    console.log("positionSubroutine", subroutinePositionCords);
    element.transform({ x: subroutinePositionCords.x, y: subroutinePositionCords.y });
    const elementTransormedObj: any = element.transform();
    symbolBBox.x = elementTransormedObj.x;
    symbolBBox.y = elementTransormedObj.y;
    this.positionTextToFlowSymbol(id);
    this.updateSVGElement(id, svgElement);
  }

  drawDatabase(flowData) {

    let dbCord = this.calculateDBCord();
    console.log("dbCord", dbCord);

    const { x1, y1, c1x1, c1y1, c1x2, c1y2, c1x3, c1y3, v1y1, c2x1, c2y1, c2x2, c2y2, c2x3, c2y3, v2y1 } = dbCord;
    const { c3x1, c3y1, c3x2, c3y2, c3x3, c3y3, v3y1, c4x1, c4y1, c4x2, c4y2, c4x3, c4y3 } = dbCord;
    const { v4y1, c5x1, c5y1, c5x2, c5y2, c5x3, c5y3 } = dbCord;
    let dbElement = this.svgjs.path(`M${x1} ${y1},
    C${c1x1} ${c1y1}, ${c1x2} ${c1y2} ,${c1x3} ${c1y3} ,V${v1y1},
    C${c2x1} ${c2y1} ,${c2x2} ${c2y2} ,${c2x3} ${c2y3},
    V${v2y1}, C${c3x1} ${c3y1} ,${c3x2} ${c3y2} ,${c3x3} ${c3y3}, V${v3y1},
    C${c4x1} ${c4y1} ,${c4x2} ${c4y2} ,${c4x3} ${c4y3}, V${v4y1}
    C${c5x1} ${c5y1} ,${c5x2} ${c5y2} ,${c5x3} ${c5y3},`);
    dbElement.fill("none");
    dbElement.stroke({ color: '#f06', width: 3 });

    this.addIdToElement(dbElement, flowData.id);
    let dbBBox = this.getElementBBox(dbElement);
    this.storeIntoSVGElemCords(flowData, dbBBox, dbElement);
    this.addTextToFlowSymbol(dbBBox, flowData.text, flowData.id);

    // this.drawConnectorLine(flowData, dbBBox);
  }
  positionDatabase(id, svgElement) {
    const { element, symbolBBox } = svgElement;
    let prevElement = this.getPreviousSVGElement(id);
    let databasePositionCords = this.calculatePositionCord(svgElement, prevElement);
    console.log("databasePositionCords", databasePositionCords);
    element.transform({ x: databasePositionCords.x, y: databasePositionCords.y });
    const elementTransormedObj: any = element.transform();
    symbolBBox.x = elementTransormedObj.x;
    symbolBBox.y = elementTransormedObj.y;
    this.positionTextToFlowSymbol(id);
    this.updateSVGElement(id, svgElement);
  }
  drawManualLoop(flowData) {
    let manualLoopCord = this.calculateManualLoopCord();
    console.log("manualLoopCord", manualLoopCord);

    let manualLoopElement = this.svgjs.path(`M${manualLoopCord.x1} ${manualLoopCord.y1}, 
    H${manualLoopCord.h1x1}, 
    L${manualLoopCord.l1x1} ${manualLoopCord.l1y1}, 
    H${manualLoopCord.h2x1}, z`);

    manualLoopElement.fill("none");
    manualLoopElement.stroke({ color: '#f06', width: 3 });

    this.addIdToElement(manualLoopElement, flowData.id);
    let manualLoopBBox = this.getElementBBox(manualLoopElement);
    this.storeIntoSVGElemCords(flowData, manualLoopBBox, manualLoopElement);
    this.addTextToFlowSymbol(manualLoopBBox, flowData.text, flowData.id);

    // this.drawConnectorLine(flowData, manualLoopBBox);
  }
  positionManualLoop(id, svgElement) {
    const { element, symbolBBox } = svgElement;
    let prevElement = this.getPreviousSVGElement(id);
    let manualLoopPositionCords = this.calculatePositionCord(svgElement, prevElement);
    console.log("manualLoopPositionCords", manualLoopPositionCords);
    element.transform({ x: manualLoopPositionCords.x, y: manualLoopPositionCords.y });
    const elementTransormedObj: any = element.transform();
    symbolBBox.x = elementTransormedObj.x;
    symbolBBox.y = elementTransormedObj.y;
    this.positionTextToFlowSymbol(id);
    this.updateSVGElement(id, svgElement);
  }
  drawStoredData(flowData) {
    let storedDataCord = this.calculateStoredDataCord();
    console.log("storedDataCord", storedDataCord);

    const { x1, y1, h1x1, c1x1, c1y1, c1x2, c1y2, c1x3, c1y3, h2x1, c2x1, c2y1, c2x2, c2y2, c2x3, c2y3 } = storedDataCord;
    let storedDataElement = this.svgjs.path(`M${x1} ${y1}, H${h1x1},
    C${c1x1} ${c1y1}, ${c1x2} ${c1y2},
    ${c1x3} ${c1y3}, H${h2x1}
    C${c2x1} ${c2y1}, ${c2x2} ${c2y2},
    ${c2x3} ${c2y3}, z`);

    storedDataElement.fill("none");
    storedDataElement.stroke({ color: '#f06', width: 3 });

    this.addIdToElement(storedDataElement, flowData.id);
    let storedDataBBox = this.getElementBBox(storedDataElement);
    this.storeIntoSVGElemCords(flowData, storedDataBBox, storedDataElement);
    this.addTextToFlowSymbol(storedDataBBox, flowData.text, flowData.id);

    // this.drawConnectorLine(flowData, storedDataBBox);
  }
  positionStoredData(id, svgElement) {
    const { element, symbolBBox } = svgElement;
    let prevElement = this.getPreviousSVGElement(id);
    let storedDataPositionCords = this.calculatePositionCord(svgElement, prevElement);
    console.log("storedDataPositionCords", storedDataPositionCords);
    element.transform({ x: storedDataPositionCords.x, y: storedDataPositionCords.y });
    const elementTransormedObj: any = element.transform();
    symbolBBox.x = elementTransormedObj.x;
    symbolBBox.y = elementTransormedObj.y;
    this.positionTextToFlowSymbol(id);
    this.updateSVGElement(id, svgElement);
  }
  drawDelay(flowData) {
    let delayCord = this.calculateDelayCord();
    console.log("delayCord", delayCord);
    const { x1, y1, h1x1, c1x1, c1y1, c1x2, c1y2, c1x3, c1y3, h2x1 } = delayCord;
    let delayElement = this.svgjs.path(`M${x1} ${y1},
    H${h1x1}, C${c1x1} ${c1y1} ,${c1x2} ${c1y2} ${c1x3} ${c1y3},H${h2x1}, Z`);

    delayElement.fill("none");
    delayElement.stroke({ color: '#f06', width: 3 });

    this.addIdToElement(delayElement, flowData.id);
    let delayBBox = this.getElementBBox(delayElement);
    this.storeIntoSVGElemCords(flowData, delayBBox, delayElement);
    this.addTextToFlowSymbol(delayBBox, flowData.text, flowData.id);

    // this.drawConnectorLine(flowData, delayBBox);
  }
  positionDelay(id, svgElement) {
    const { element, symbolBBox } = svgElement;
    let prevElement = this.getPreviousSVGElement(id);
    let delayPositionCords = this.calculatePositionCord(svgElement, prevElement);
    console.log("delayPositionCords", delayPositionCords);
    element.transform({ x: delayPositionCords.x, y: delayPositionCords.y });
    const elementTransormedObj: any = element.transform();
    symbolBBox.x = elementTransormedObj.x;
    symbolBBox.y = elementTransormedObj.y;
    this.positionTextToFlowSymbol(id);
    this.updateSVGElement(id, svgElement);
  }
  drawDisplay(flowData) {
    let displayCord = this.calculateDisplayCord();
    console.log("displayCord", displayCord);

    const { x1, y1, h1x1, c1x1, c1y1, c1x2, c1y2, c1x3, c1y3, h2x1, l1x1, l1y1  } = displayCord;
    let displayElement = this.svgjs.path(`M${x1} ${y1}, 
    H${h1x1},C${c1x1} ${c1y1}, ${c1x2} ${c1y2}, ${c1x3} ${c1y3}, H${h2x1}
    L${l1x1} ${l1y1}, Z`);

    displayElement.fill("none");
    displayElement.stroke({ color: '#f06', width: 3 });

    this.addIdToElement(displayElement, flowData.id);
    let displayBBox = this.getElementBBox(displayElement);
    this.storeIntoSVGElemCords(flowData, displayBBox, displayElement);
    this.addTextToFlowSymbol(displayBBox, flowData.text, flowData.id);

    // this.drawConnectorLine(flowData, displayBBox);
  }
  positionDisplay(id, svgElement) {
    const { element, symbolBBox } = svgElement;
    let prevElement = this.getPreviousSVGElement(id);
    let displayPositionCords = this.calculatePositionCord(svgElement, prevElement);
    console.log("displayPositionCords", displayPositionCords);
    element.transform({ x: displayPositionCords.x, y: displayPositionCords.y });
    const elementTransormedObj: any = element.transform();
    symbolBBox.x = elementTransormedObj.x;
    symbolBBox.y = elementTransormedObj.y;
    this.positionTextToFlowSymbol(id);
    this.updateSVGElement(id, svgElement);
  }
  drawCollate(flowData) {
    let collateCord = this.calculateCollateCord();
    
    const { x1, y1, h1x1, l1x1, l1y1, h2x1 } = collateCord;
    let collateElement = this.svgjs.path(`M${x1} ${y1},
    H${h1x1}, L${l1x1} ${l1y1}, H${h2x1}, Z`);

    collateElement.fill("none");
    collateElement.stroke({ color: '#f06', width: 3 });

    this.addIdToElement(collateElement, flowData.id);
    let collateBBox = this.getElementBBox(collateElement);
    this.storeIntoSVGElemCords(flowData, collateBBox,collateElement);
    this.addTextToFlowSymbol(collateBBox, flowData.text,flowData.id);

    // this.drawConnectorLine(flowData, collateBBox);
  }
  positionCollate(id, svgElement) {
    const { element, symbolBBox } = svgElement;
    let prevElement = this.getPreviousSVGElement(id);
    let collatePositionCords = this.calculatePositionCord(svgElement, prevElement);
    console.log("collatePositionCords", collatePositionCords);
    element.transform({ x: collatePositionCords.x, y: collatePositionCords.y });
    const elementTransormedObj: any = element.transform();
    symbolBBox.x = elementTransormedObj.x;
    symbolBBox.y = elementTransormedObj.y;
    this.positionTextToFlowSymbol(id);
    this.updateSVGElement(id, svgElement);
  }
  calculateCollateCord() {
    let collateCord: any = {};
    const {collate} = this.symbolsWH;

    collateCord.x1 = 0;
    collateCord.y1 = 0;

    collateCord.h1x1 = collateCord.x1 + collate.width;

    collateCord.l1x1 = collateCord.x1;
    collateCord.l1y1 = collateCord.y1 + collate.height;

    collateCord.h2x1 = collateCord.h1x1;

    return collateCord;
  }
  calculateDisplayCord() {
    let displayCord: any = {};
    const { display } = this.symbolsWH;

    displayCord.x1 = 0;
    displayCord.y1 = 0;

    displayCord.h1x1 = displayCord.x1 + display.width;

    displayCord.c1x1 = displayCord.h1x1 + 20;
    displayCord.c1y1 = displayCord.y1;
    displayCord.c1x2 = displayCord.c1x1;
    displayCord.c1y2 = displayCord.y1 + display.height;
    displayCord.c1x3 = displayCord.h1x1;
    displayCord.c1y3 = displayCord.c1y2;

    displayCord.h2x1 = displayCord.x1;

    displayCord.l1x1 = displayCord.x1 - 30;
    displayCord.l1y1 = displayCord.y1 + (display.height / 2);

    // displayCord.l2x1 = displayCord.x1;
    // displayCord.l2y1 = displayCord.y1;

    return displayCord;
  }
  calculateDelayCord() {
    let delayCord: any = {};
    const { delay } = this.symbolsWH;
    delayCord.x1 = 0;
    delayCord.y1 = 0;
    delayCord.h1x1 = delayCord.x1 + delay.width;
    delayCord.c1x1 = delayCord.h1x1 + 20;
    delayCord.c1y1 = delayCord.y1;
    delayCord.c1x2 = delayCord.c1x1;
    delayCord.c1y2 = delayCord.y1 + delay.height
    delayCord.c1x3 = delayCord.h1x1;
    delayCord.c1y3 = delayCord.c1y2;
    delayCord.h2x1 = delayCord.x1;

    return delayCord;
  }
  calculateStoredDataCord() {
    let storedDataCord: any = {};
    const { storedData } = this.symbolsWH;

    storedDataCord.x1 = 0;
    storedDataCord.y1 = 0;

    storedDataCord.h1x1 = storedDataCord.x1 + storedData.width;

    storedDataCord.c1x1 = storedDataCord.h1x1 - 20;
    storedDataCord.c1y1 = storedDataCord.y1;
    storedDataCord.c1x2 = storedDataCord.c1x1;
    storedDataCord.c1y2 = storedDataCord.y1 + storedData.height;
    storedDataCord.c1x3 = storedDataCord.h1x1;
    storedDataCord.c1y3 = storedDataCord.c1y2;

    storedDataCord.h2x1 = storedDataCord.x1;

    storedDataCord.c2x1 = storedDataCord.x1 - 20;
    storedDataCord.c2y1 = storedDataCord.c1y3;
    storedDataCord.c2x2 = storedDataCord.c2x1;
    storedDataCord.c2y2 = storedDataCord.y1;
    storedDataCord.c2x3 = storedDataCord.x1;
    storedDataCord.c2y3 = storedDataCord.y1;

    return storedDataCord;
  }
  calculateManualLoopCord() {
    let manualLoopCord: any = {};
    const { manualLoop } = this.symbolsWH;

    manualLoopCord.x1 = 0;
    manualLoopCord.y1 = 0;
    manualLoopCord.h1x1 = manualLoopCord.x1 + manualLoop.width;
    manualLoopCord.l1x1 = manualLoopCord.h1x1 - 10;
    manualLoopCord.l1y1 = manualLoopCord.y1 + manualLoop.height;
    manualLoopCord.h2x1 = manualLoopCord.x1 + 10;
    return manualLoopCord;
  }
  calculateDBCord() {
    let dbCord: any = {};
    const { database } = this.symbolsWH;
    dbCord.x1 = 0;
    dbCord.y1 = 0;
    dbCord.c1x1 = dbCord.x1;
    dbCord.c1y1 = dbCord.y1 - 10;
    dbCord.c1x2 = dbCord.x1 + database.width;
    dbCord.c1y2 = dbCord.c1y1;
    dbCord.c1x3 = dbCord.c1x2;
    dbCord.c1y3 = dbCord.y1;

    dbCord.v1y1 = dbCord.y1 + database.height;

    dbCord.c2x1 = dbCord.c1x3;
    dbCord.c2y1 = dbCord.v1y1 + 10;
    dbCord.c2x2 = dbCord.x1;
    dbCord.c2y2 = dbCord.c2y1;
    dbCord.c2x3 = dbCord.x1;
    dbCord.c2y3 = dbCord.v1y1;

    dbCord.v2y1 = dbCord.y1;

    dbCord.c3x1 = dbCord.x1;
    dbCord.c3y1 = dbCord.y1 + 10;
    dbCord.c3x2 = dbCord.c1x3;
    dbCord.c3y2 = dbCord.c3y1;
    dbCord.c3x3 = dbCord.c3x2;
    dbCord.c3y3 = dbCord.y1;

    dbCord.v3y1 = dbCord.y1 + 5;
    dbCord.c4x1 = dbCord.c3x3;
    dbCord.c4y1 = dbCord.v3y1 + 10;
    dbCord.c4x2 = dbCord.c3x1;
    dbCord.c4y2 = dbCord.c4y1;
    dbCord.c4x3 = dbCord.c3x1;
    dbCord.c4y3 = dbCord.v3y1;

    dbCord.v4y1 = dbCord.v3y1 + 5;
    dbCord.c5x1 = dbCord.x1;
    dbCord.c5y1 = dbCord.v4y1 + 10;
    dbCord.c5x2 = dbCord.c4x1;
    dbCord.c5y2 = dbCord.c5y1;
    dbCord.c5x3 = dbCord.c4x1;
    dbCord.c5y3 = dbCord.v4y1;

    return dbCord;
  }
  calculateIOCord() {
    let ioCord: any = {};
    const { io } = this.symbolsWH;

    ioCord.x1 = 0;
    ioCord.y1 = 0;
    ioCord.hx1 = ioCord.x1 + io.width + 10;
    ioCord.x2 = ioCord.hx1 - 10;
    ioCord.y2 = ioCord.y1 + io.height;
    ioCord.x3 = ioCord.x1 - 10;
    ioCord.y3 = ioCord.y2;
    return ioCord;
  }
  calculateSubrCord() {
    let subrCord: any = {};
    const { subroutine } = this.symbolsWH;

    subrCord.x1 = 0;
    subrCord.y1 = 0;
    subrCord.h1x1 = subrCord.x1 + subroutine.width;
    subrCord.v1y1 = subrCord.y1 + subroutine.height;
    subrCord.h2x1 = subrCord.x1;
    subrCord.v2y1 = subrCord.y1;
    subrCord.ih1x1 = subrCord.x1 + 10;
    subrCord.iv1y1 = subrCord.v1y1;
    subrCord.ih2x1 = subrCord.h1x1 - 10;
    subrCord.iv2y1 = subrCord.y1;
    return subrCord;
  }
  calculateDocumentCord() {
    let docCord: any = {};

    const { document } = this.symbolsWH;
    docCord.x1 = 0;
    docCord.y1 = 0;
    docCord.hx1 = docCord.x1 + document.width;
    docCord.vy1 = docCord.y1 + document.height;
    docCord.qx = docCord.hx1 - (document.width / 4);
    docCord.qy = docCord.vy1 - (document.height / 4);
    docCord.x2 = docCord.x1 + (document.width / 2);
    docCord.y2 = docCord.vy1;
    docCord.tx = docCord.x1;
    docCord.ty = docCord.vy1;
    return docCord;
  }

  calculateDecisionCord() {
    let opCord: any = {};
    const { decision } = this.symbolsWH;
    opCord.x1 = decision.width / 2;
    opCord.y1 = 0;
    opCord.x2 = opCord.x1 + (decision.width / 2);
    opCord.y2 = opCord.y1 + (decision.height / 2);
    opCord.x3 = opCord.x1;
    opCord.y3 = opCord.y2 + (decision.height / 2);
    opCord.x4 = opCord.x1 - (decision.width / 2);
    opCord.y4 = opCord.y2;
    return opCord;
  }
  calculatePositionCord(currentElement, prevElement) {
    let opPositionCord: any = {};
    const { symbolBBox, flowObj } = prevElement;
    let x;
    let y;
    switch (flowObj.nextIdPosition) {
      case "top": {
        const prevElemenTopCord = this.getTop(symbolBBox);
        x = prevElemenTopCord.x - (currentElement.symbolBBox.width / 2);
        y = prevElemenTopCord.y - this.defaultLineLength - currentElement.symbolBBox.height;
        break;
      }
      case "left": {
        const prevElemenLeftCord = this.getLeft(symbolBBox);
        x = prevElemenLeftCord.x - this.defaultLineLength - currentElement.symbolBBox.width;
        y = prevElemenLeftCord.y - (currentElement.symbolBBox.height / 2);
        break;
      }
      case "right": {
        const prevElemenRightCord = this.getRight(symbolBBox);
        x = prevElemenRightCord.x + this.defaultLineLength;
        y = prevElemenRightCord.y - (currentElement.symbolBBox.height / 2);
        break;
      }
      default: {
        const prevElemenBottomCord = this.getBottom(symbolBBox);
        x = prevElemenBottomCord.x - (currentElement.symbolBBox.width / 2);
        y = prevElemenBottomCord.y + this.defaultLineLength;
      }
    }
    opPositionCord.x = x;
    opPositionCord.y = y;
    return opPositionCord;
  }
  addIdToElement(element, id) {
    element.node.id = id;
  }
  addTextToFlowSymbol(symbolBBox, text, id) {
    let symbolTextElement = this.svgjs.text(`${text}`);
    let textCord = this.calculateFlowSymbolTextCord(symbolBBox);
    symbolTextElement.move(textCord.x, textCord.y).font({ fill: '#f06', family: 'Inconsolata', size: 10 });
    this.addTextToSVGElement(id, symbolTextElement);
    return symbolTextElement
  }
  addTextToSVGElement(id, symbolTextElement) {
    console.log('id',id);
    this.svgElements[id].symbolTextElement = symbolTextElement;
  }
  positionTextToFlowSymbol(id) {
    const { symbolBBox, symbolTextElement } = this.svgElements[id];
    let textCord = this.calculateFlowSymbolTextCord(symbolBBox);
    symbolTextElement.move(textCord.x, textCord.y).font({ fill: '#f06', family: 'Inconsolata', size: 10 });
    this.svgElements[id].symbolTextElement = symbolTextElement;
  }
  calculateFlowSymbolTextCord(symbolBBox) {
    return {
      x: symbolBBox.x + (symbolBBox.width / 2) - 10,
      y: symbolBBox.y + (symbolBBox.height / 2),
    }
  }
  calculateConnectorLineCord(elmBBox, nextIdPosition, type) {
    // if (type === "document") {
    //   elmBBox.height = this.symbolsWH.document.height;
    // }
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
  storeIntoSVGElemCords(flowObj, symbolBBox, element) {
    const { id } = flowObj
    if (!this.svgElements[id]) {
      this.svgElements[id] = {};
    }
    this.svgElements[id].flowObj = flowObj;
    this.svgElements[id].element = element
    this.svgElements[id].symbolBBox = symbolBBox;
  }
  updateSVGElement(id, svgElement) {
    this.svgElements[id] = svgElement;
  }
  addLinesToSVGElemCords(id, connectorLineCord) {
    if (!this.svgElements[id].lines) {
      this.svgElements[id].lines = [];
    }
    this.svgElements[id].lines.push(connectorLineCord);
  }
  getPreviousElement(currentElemId) {
    return this.flowChartData.flowList.filter((flowObj) => {
      return flowObj.nextId === currentElemId;
    })[0];
  }
  getPreviousSVGElement(currentElemId) {
    const prevId = Object.keys(this.svgElements).filter((id) => {
      return this.svgElements[id].flowObj.nextId === currentElemId;
    })[0];
    return this.svgElements[prevId];
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
  getCenter(elementBBox) {

    return {
      x: elementBBox.x + (elementBBox.width / 2),
      y: elementBBox.y + (elementBBox.height / 2),
    }
  }
  getBottom(elementBBox) {
    return {
      x: this.getCenter(elementBBox).x,
      y: this.getCenter(elementBBox).y + (elementBBox.height / 2),
    }
  }
  getTop(elementBBox) {
    return {
      x: this.getCenter(elementBBox).x,
      y: this.getCenter(elementBBox).y - (elementBBox.height / 2),
    }
  }
  getRight(elementBBox) {
    return {
      x: this.getCenter(elementBBox).x + (elementBBox.width / 2),
      y: this.getCenter(elementBBox).y,
    }
  }
  getLeft(elementBBox) {
    return {
      x: this.getCenter(elementBBox).x - (elementBBox.width / 2),
      y: this.getCenter(elementBBox).y,
    }
  }
}
