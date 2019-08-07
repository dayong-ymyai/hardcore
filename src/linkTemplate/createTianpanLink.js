/**
 * 天盘连接线的布局
 */
'use strict';

// import * as go from 'gojs';

// let menus = require('../templates/menu');
var $ = go.GraphObject.make;

function SmoothLink() {
    go.Link.call(this);
}

function computeOffset(newR, newStartAngle) {
    //console.log("newStartAngle:"+newStartAngle);
    var ctl2, dy, dx; //需要调整
    if (newStartAngle >= 0 && newStartAngle <= 90) {
        dy = newR * Math.sin(newStartAngle * Math.PI / 180);
        dx = newR * Math.cos(newStartAngle * Math.PI / 180);
        return [dx, dy];
    } else if (newStartAngle > 90 && newStartAngle <= 180) {
        dy = newR * Math.sin((180 - newStartAngle) * Math.PI / 180);
        dx = newR * Math.cos((180 - newStartAngle) * Math.PI / 180);
        return [-dx, dy];
    } else if (newStartAngle > 180 && newStartAngle <= 270) {
        dy = newR * Math.sin((newStartAngle - 180) * Math.PI / 180);
        dx = newR * Math.cos((newStartAngle - 180) * Math.PI / 180);
        return [-dx, -dy];
    } else if (newStartAngle > 270 && newStartAngle <= 360) {
        dy = newR * Math.sin((360 - newStartAngle) * Math.PI / 180);
        dx = newR * Math.cos((360 - newStartAngle) * Math.PI / 180);
        return [dx, -dy];
    }
}

// var tdCurrentTheme = menus.tdCurrentTheme;
// 根据根节点与两个节点的位置计算出圆心在AB中垂线与 过根节点且平行于AB的射线的交点 D
function computeNewCenter(O, A, B) {
    var C = new go.Point((A.x + B.x) / 2, (A.y + B.y) / 2); //AB的中点
    if (O.equals(A)) {
        var locD = C.copy();
        var r = Math.sqrt(C.distanceSquaredPoint(A));
        var direction = (A.directionPoint(B) + 90) % 360;
        var distance = r * 0.15;
        var offset = computeOffset(distance, direction);
        locD.offset(offset[0], offset[1]); //圆心坐标
        r = Math.sqrt(locD.distanceSquaredPoint(A));
        return [r, locD.x, locD.y];
    }
    var OC = Math.sqrt(O.distanceSquaredPoint(C));
    var directionOC = O.directionPoint(C);
    var directionFlagOD = O.distanceSquaredPoint(B) < O.distanceSquaredPoint(A);
    if (directionFlagOD) {
        var directionOD = B.directionPoint(A); //OD平行于AB
    } else {
        var directionOD = A.directionPoint(B); //OD平行于AB
    }

    var angleDOC = Math.abs(directionOC - directionOD);
    if (angleDOC > 90 && angleDOC < 180) {
        angleDOC = 180 - angleDOC;
    } else if (angleDOC >= 180) {
        angleDOC = 360 - angleDOC; //角doc是润角
    }
    // if(O.distanceSquaredPoint(B) > O.distanceSquaredPoint(A)){
    //   directionOD = B.directionPoint(A);
    // }
    var OD = OC * Math.cos(angleDOC * Math.PI / 180);
    var offset = computeOffset(OD, directionOD);
    var locD = O.copy();
    locD.offset(offset[0], offset[1]); //圆心坐标
    var r = Math.sqrt(locD.distanceSquaredPoint(A));
    return [r, locD.x, locD.y];
    // return locD;
}

go.Diagram.inherit(SmoothLink, go.Link);

SmoothLink.prototype.makeGeometry = function() {
    // get the Geometry created by the standard behavior
    var geo = go.Link.prototype.makeGeometry.call(this);
    if (geo.type !== go.Geometry.Path || geo.figures.length === 0) return geo;
    return geo;
};

/** @override */
SmoothLink.prototype.computePoints = function() {

    var myDiagram = this.diagram;

    var nodes = [];
    if (this.fromNode == null || this.toNode == null) return true;
    if (this.fromNode.location.equals(this.toNode.location)) {
        return false;
    }
    var start = this.fromNode.location.copy();
    var end = this.toNode.location.copy();

    if (!start.isReal() || !end.isReal()) {
        return true;
    }
    var A = start;
    var B = end;
    var O = myDiagram.findNodeForKey(this.toNode.data.parent);
    if (!O) return true;
    O = O.location;
    var cent = computeNewCenter(O, A, B);



    var centInfo = cent;
    var centorPoint = new go.Point(centInfo[1], centInfo[2]);

    this.micenter = centorPoint;
    var rcenter = centInfo[0];
    var rstart = this.fromNode.actualBounds.width / 2;
    var rend = this.toNode.actualBounds.width / 2;
    var center2mid = (2 * rcenter * rcenter - rstart * rstart) / (2 * rcenter); //大圆到大圆与开始节点交点中点的距离，然后求出夹角
    var af = Math.acos(center2mid / rcenter) * 180 / Math.PI;

    var geo = new go.Geometry(go.Geometry.Line);
    geo.startX = centorPoint.x;
    geo.startY = centorPoint.y;
    geo.endX = this.fromNode.location.x;
    geo.endY = this.fromNode.location.y;
    if(!af){
        af = 0;
    }
    geo.rotate(af, centorPoint.x, centorPoint.y); //相对圆心旋转，顺时针
    var start2 = new go.Point(geo.endX, geo.endY);
    // var start2 = new go.Point(this.fromNode.location.x, this.fromNode.location.y);

    center2mid = (2 * rcenter * rcenter - rend * rend) / (2 * rcenter); //大圆到大圆与开始节点交点中点的距离，然后求出夹角
    af = Math.acos(center2mid / rcenter) * 180 / Math.PI;
    geo.endX = this.toNode.location.x;
    geo.endY = this.toNode.location.y;
    if(!af){
        af = 0;
    }
    geo.rotate(-af, centorPoint.x, centorPoint.y); //相对圆心旋转,逆时针
    var end2 = new go.Point(geo.endX, geo.endY);

    //console.log(Math.abs(centorPoint.directionPoint(start2) - centorPoint.directionPoint(end2)));
    //var result = computeControlPoint(start,midPoint,end,centInfo);
    var result = computeControlPoint(start2, null, end2, centInfo);

    var ctl1 = result[0];
    var ctl2 = result[1];

    this.clearPoints();
    if (isNaN(start2.x) || isNaN(start2.y)) {
        start2 = this.fromNode.location.copy();
    }
    if (isNaN(end2.x) || isNaN(end2.y)) {
        end2 = this.toNode.location.copy();
    }
    //start1.rotate();
    this.points.add(start2);
    this.points.add(result[0]);
    this.points.add(result[1]);
    this.points.add(end2);

    var oust = "";
    return true;
};


function computeControlPoint(p1, p2, p3) {

    var result;
    result = arguments[3] ? arguments[3] : triangleCircle(p1, p2, p3);
    var radius = result[0];
    var cent = new go.Point(result[1], result[2]);

    //起始节点的弧度
    var sweep = Math.abs(cent.directionPoint(p1) - cent.directionPoint(p3));
    sweep = sweep > 180 ? 360 - sweep : sweep;
    //console.log("sweep:"+sweep);
    var newR = radius / Math.cos(sweep / 3 * Math.PI / 180);
    var geo = new go.Geometry(go.Geometry.Line);
    geo.startX = cent.x;
    geo.startY = cent.y;
    geo.endX = p1.x;
    geo.endY = p1.y;
    geo.rotate(sweep / 3, cent.x, cent.y); //相对圆心旋转3分之1弧度
    var newStartAngle = cent.direction(geo.endX, geo.endY);
    var ctl1;
    result = computeOffset(newR, newStartAngle);
    ctl1 = cent.copy().offset(result[0], result[1]);

    geo.rotate(sweep / 3, cent.x, cent.y); //相对圆心旋转3分之1弧度
    newStartAngle = cent.direction(geo.endX, geo.endY);

    var ctl2; //需要调整
    result = computeOffset(newR, newStartAngle);
    ctl2 = cent.copy().offset(result[0], result[1]);

    return [ctl1, ctl2];
}


function createTianpanLink(diagram) {
    return $(SmoothLink, {
            curve: go.Link.Bezier,
            layerName: "",
            isTreeLink: true,
            //curve: go.Link.Bezier,
            curviness: 30,
            //smoothness:1,
            adjusting: go.Link.Stretch,
            relinkableFrom: true,
            relinkableTo: true,
            reshapable: true,
            layoutConditions: go.Part.LayoutStandard & ~go.Part.LayoutNodeSized,
            mouseDragEnter: function(e, obj) {
                var link = obj.part;
                var shape = link.findObject("SHAPE");
                shape._preStoke = shape.stroke;
                shape.stroke = "darkred";
                shape._preStrokeWidth = shape.strokeWidth;
                shape.strokeWidth = 5;
            },
            mouseDragLeave: function(e, obj) {
                var link = obj.part;
                var shape = link.findObject("SHAPE");
                shape.stroke = shape._preStoke;
                shape.strokeWidth = shape._preStrokeWidth;
            },
            mouseDrop: function(e, obj) {
                var link = obj.part;
                var draggedNode = e.diagram.selection.first();
                if (!draggedNode instanceof go.Node) {
                    return;
                }
                if (!draggedNode instanceof go.Group) {
                    return;
                }
                if (draggedNode.data.key == 1) {
                    return;
                }
                var fromNode = link.fromNode,
                    toNode = link.toNode;
                //disconnectFromTreeStructure(draggedNode);
                if (toNode.data.parent == fromNode.data.key) {
                    e.diagram.__trtd.setNodeAsChildren(draggedNode, fromNode);
                } else {
                    e.diagram.__trtd.setNodeAsSibling(draggedNode, fromNode);
                }
            }
        }, // negate curviness if not clockwise
        $(go.Shape, {
                name: "SHAPE",
                stroke: "#767678",
                strokeWidth: 3
            },
            new go.Binding("strokeWidth", "strokeWidth").makeTwoWay(),
            new go.Binding("stroke", "color").makeTwoWay(),
            new go.Binding("strokeDashArray", "strokeDashArray", function(v) {
                try {
                    var val = [parseInt(v.split(" ")[0]), parseInt(v.split(" ")[1])];
                } catch (e) {
                    var val = null;
                }
                return val;
            }).makeTwoWay(function(v) {
                return v[0] + " " + v[1];
            }) //保留，设置边线样式

        ),
        $(go.Shape, {
                name: "Arrow",
                toArrow: "Triangle",
                stroke: "#767678",
                strokeWidth: 3
            },
            new go.Binding("strokeWidth", "strokeWidth"),
            new go.Binding("fill", "color"),
            new go.Binding("stroke", "color"),
            new go.Binding("toArrow", "toArrow")
        ),
        new go.Binding("curviness", "curviness").makeTwoWay(),
        new go.Binding("points").makeTwoWay()

    );
}


module.exports = createTianpanLink
