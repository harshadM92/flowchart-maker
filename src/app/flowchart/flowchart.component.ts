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
    }
  }
  defaultLineHeight: any = 50;
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
        text: "operation2",
        type: "operation",
        nextId: "el4",
        nextIdPosition: "right",
      },
      {
        id: "el4",
        text: "operation3",
        type: "operation",
        nextId: "el5",
        nextIdPosition: "right",
      },
      {
        id: "el5",
        text: "document 1",
        type: "document",
        nextId: "el6",
        style: {
          bgColor: "yellow",
          lineColor: "red",
          borderColor: "green"
        },
        nextIdPosition: "right",
      },
      {
        id: "el6",
        text: "operation4",
        type: "operation",
        nextId: "el7",
        nextIdPosition: "right",
      },
      // {
      //   id: "el6",
      //   text: "operation5",
      //   type: "operation",
      //   nextId: "el7"
      // },
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
      
      console.log(this.perGridWH.width * this.flowChartData.totalGrid);
      let totalWidth = this.perGridWH.width * this.flowChartData.totalGrid;
      let totalHeight = window.innerHeight;
      let flowchartContElem  = document.getElementById("flowchart_container");
      let flowChartContCss = {
        width: `${totalWidth}px`,
        height: `${totalHeight}px`,
        margin: `${this.symbolContainerMargin}px`,
      }
      Object.assign(flowchartContElem.style,flowChartContCss);
      this.containerWH = {
        width:  parseInt(flowchartContElem.style.width, 10),
        height: parseInt(flowchartContElem.style.height, 10),
      };
      // Creates canvas 
      this.svgjs = SVG("flowchart_container").size(this.containerWH.width, this.containerWH.height);
      this.svgjs.defs().attr({ id: 'markerDefs' });
      let svgElem  = document.getElementsByTagName("svg")[0];
      let svgCss = {
        border: "green solid",
      }
      Object.assign(svgElem.style,svgCss);
      
      
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
  calculateDocumentCord(prevElement) {
    let docCord: any = {};
    this.svgElementsCords[prevElement.id].lines.map((lineCord) => {
      const { document } = this.symbolsWH;
      switch (prevElement.nextIdPosition) {
        case "top": {

          break;
        }
        case "left": {
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
      docCord.qx = docCord.x1 + ((document.width / 4) *3);
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
      switch (prevElement.nextIdPosition) {
        case "top": {

          break;
        }
        case "left": {
          break;
        }
        case "right": {
          opCord.x = lineCord.widthX;
          opCord.y = lineCord.y - (this.symbolsWH.operation.height / 2);
          break;
        }
        default: {
          opCord.x = lineCord.x - (this.symbolsWH.operation.width / 2);
          opCord.y = lineCord.heightY;
        }
      }
    });
    return opCord;
  }
  calculateDecisionCord(prevElement) {
    let opCord: any = {};
    this.svgElementsCords[prevElement.id].lines.map((lineCord) => {
      const { decision } = this.symbolsWH;
      opCord.x1 = lineCord.x;
      opCord.y1 = lineCord.heightY;
      opCord.x2 = lineCord.x + (decision.width / 2);
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

        break;
      }
      case "left": {
        break;
      }
      case "right": {
        
        connectorLineCord = {
          x: elmBBox.x + elmBBox.width,
          y: elmBBox.y + (elmBBox.height / 2),
        }
        connectorLineCord.widthX = connectorLineCord.x + this.defaultLineHeight;
        connectorPathCords.connectorLineCord = connectorLineCord;
        connectorPathCords.value = `M${connectorLineCord.x} ${connectorLineCord.y}, H${connectorLineCord.widthX}`
        break;
      }
      default: {
        connectorLineCord = {
          x: elmBBox.x + (elmBBox.width / 2),
          y: elmBBox.y + elmBBox.height,
          heightY: elmBBox.y + elmBBox.height + this.defaultLineHeight,
        }
        connectorPathCords.connectorLineCord = connectorLineCord;
        connectorPathCords.value = `M${connectorLineCord.x} ${connectorLineCord.y}, V${connectorLineCord.heightY}`
      }
    }
    
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
    element.fill(elementStyle.bgColor);
    element.stroke({ color: elementStyle.borderColor, width: 3 });
  }
  getElementBBox(element) {
    return element.node.getBBox();
  }
}
