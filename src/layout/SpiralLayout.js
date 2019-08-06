
/*
*  Copyright (C) 1998-2015 by Northwoods Software Corporation. All Rights Reserved.
*/

// A custom Layout that lays out a chain of nodes in a spiral

/**
 * @constructor
 * @extends Layout
 * @class
 * This layout assumes the graph is a chain of Nodes,
 * {@link #spacing} controls the spacing between nodes.
 */

'use strict';

// import * as go from 'gojs';
var $ = go.GraphObject.make;
var tdDebug = false;
var tdSpacing = 0.7;
var tdSpiralMode = 'sparse';

function SpiralLayout() {
    go.Layout.call(this);
    this._radius = NaN;
    this._spacing = 10;
    this._clockwise = true;
    this._pointlist = [];
}
go.Diagram.inherit(SpiralLayout, go.Layout);

/**
 * @ignore
 * Copies properties to a cloned Layout.
 * @this {SpiralLayout}
 * @param {Layout} copy
 * @override
 */
SpiralLayout.prototype.cloneProtected = function(copy) {
    go.Layout.prototype.cloneProtected.call(this, copy);

    copy._radius = this._radius;
    copy._spacing = this._spacing;
    copy._clockwise = this._clockwise;
};

//根据基圆半径和角度参数确定螺旋线上的一个点
//渐开线的参数方程
function getInvolutePoint(radius, angle) {
    var cos = Math.cos(angle);
    var sin = Math.sin(angle);
    var x = radius * (cos + angle * sin);
    var y = radius * (sin - angle * cos);
    return new go.Point(x, y);
}

//检查给定区域是否和nodes内所有节点重叠
function checkCoveredWithNodes(rect, nodesRectList) {
    var _cover = false;

    var it = nodesRectList.iterator;
    while (it.next()) {

        if (Math.sqrt(rect.point.distanceSquaredPoint(it.value.point)) < (rect.radius + it.value.radius)) {
            //console.log([" node:", it.value.node.data.key,'is in the radius ',node.actualBounds.width,' of:',node.data.key].join(" "));
            _cover = true;
            break;
        }
    }
    return _cover;
}

/**
 * This method actually positions all of the Nodes, assuming that the ordering of the nodes
 * is given by a single link from one node to the next.
 * This respects the {@link #spacing} property to affect the layout.
 * @this {SpiralLayout}
 * @param {Diagram|Group|Iterable} coll the collection of Parts to layout.
 */
SpiralLayout.prototype.doLayout = function(coll) {


    if (this.network === null) {
        this.network = this.makeNetwork(coll);
    }
    //console.log("begin new layout");
    var root = null;
    var findFlag = false;
    var v;
    // find a root vertex -- one without any incoming edges
    var it = this.network.vertexes.iterator;
    var topNodes = [];
    while (it.next()) {
        //console.log(it.value.node.data.key+":"+it.value.node.data.text);
        v = it.value;
        if (!findFlag) {
            if (root === null) root = v; // in case there are only circles
            if (v.sourceEdges.count === 0) {
                root = v;
                findFlag = true;
            }
        } else {
            if (v.sourceEdges.count === 0) {
                topNodes.push(v);
            }
        }
    }



    // couldn't find a root vertex
    if (root === null) {
        this.network = null;
        return;
    }

    var cw = (this.clockwise ? 1 : -1);
    var rad;

    var angle = 2.5;
    var isautolayout = window.localStorage.getItem('isautolayout') == null ? true : window.localStorage.getItem('isautolayout') == 'true';
    // now locate each of the following nodes, in order, along a spiral
    var vert;
    var x, y;
    var _pointlist;
    var _do = true;
    var count = 0; //循环计数
    var res;
    var initialAngle = 5;
    var edge, fromVert, dangle, index, dept, dl, nextedge, nextvert,
        nodesDealed = new go.List(),
        curRect, //当前节点的矩形区域
        newPoint,
        dia,
        distance = 150,
        equaldistance;
    if (tdSpiralMode == 'terse') {
        distance = 20;
    }
    if (tdSpiralMode == 'sparse') {
        distance = 150;
    }
    var tmpR; //计算中间值
    edge = root.destinationEdges.first();
    vert = (edge !== null ? edge.toVertex : null);

    root.node.rad = rad;
    var childCount = 0;
    var hasGroup = false;
    while (vert !== null) {
        childCount++;
        if (vert.node.data['isGroup']) {
            hasGroup = true;
        }
        nextedge = vert.destinationEdges.first();
        nextvert = (nextedge !== null ? nextedge.toVertex : null);
        edge = nextedge;
        //fromVert = vert;
        vert = nextvert;
    }
    edge = root.destinationEdges.first();
    vert = (edge !== null ? edge.toVertex : null);

    rad = 1;
    var tmpPoint;
    //找到第一个节点和根节点不相交的rad值
    if (vert) {
        tmpR = vert.node.actualBounds.width;
        //var rootRect = new go.Rect(root.node.location.x - root.node.actualBounds.width / 2, root.node.location.y - root.node.actualBounds.height / 2, root.node.actualBounds.width, root.node.actualBounds.height);
        var radiusDis = root.node.actualBounds.width / 2 + vert.node.actualBounds.width / 2;
        while (true) {
            tmpPoint = getInvolutePoint(rad, initialAngle);
            tmpPoint = new go.Point(tmpPoint.x + root.node.location.x, tmpPoint.y + root.node.location.y);
            if ((Math.sqrt(tmpPoint.distanceSquaredPoint(root.node.location))) > (radiusDis + 10)) { //+10 是为了防止第一个子节点和根节点接壤
                break;
            } else {
                rad += 0.1;
            }
        }
    }
    var adjustAngleCount = 0;

    while (_do) {

        count++; //计数
        //初始化参数
        angle = initialAngle;
        edge = root.destinationEdges.first();
        //if (edge !== null && edge.link !== null) edge.link.curviness = rad;
        root.node.data.angle = 0;
        if (edge !== null && edge.link !== null) edge.link.curviness = cw * rad;
        var curviness = edge == null ? 20 : edge.link.curviness;
        // now locate each of the following nodes, in order, along a spiral
        vert = (edge !== null ? edge.toVertex : null);

        fromVert = root;
        index = 0;
        var angleOld; //增加angle时保留的原始值，用于恢复
        x = 0, y = 0;
        //_pointlist = [];
        // _pointlist.push(root.node.data.key + ":(0,0)");
        if (vert) vert.node.data.angle = angle;
        nodesDealed.clear();
        //nodesDealed.add(new go.Rect(root.node.location.x - root.node.actualBounds.width / 2, root.node.location.y - root.node.actualBounds.height / 2, root.node.actualBounds.width, root.node.actualBounds.height));
        nodesDealed.add({ point: root.node.location, radius: root.node.actualBounds.width / 2 });

        //等弧长
        //equaldistance = Math.sqrt(getInvolutePoint(rad, 5 * Math.PI / 2).distanceSquaredPoint(getInvolutePoint(rad, 5 * Math.PI / 2 - tdSpacing)));

        //equaldistance = Math.sqrt(getInvolutePoint(rad, 5 * Math.PI / 2).distanceSquaredPoint(getInvolutePoint(rad, 5 * Math.PI / 2 - tdSpacing)));
        if (tdSpiralMode == 'terse') {
            equaldistance = Math.sqrt(getInvolutePoint(rad, 5).distanceSquaredPoint(getInvolutePoint(rad, 6)));
        } else {
            equaldistance = Math.sqrt(getInvolutePoint(rad, 5 * Math.PI / 2).distanceSquaredPoint(getInvolutePoint(rad, 5 * Math.PI / 2 - tdSpacing)));
        }
        //重新开始布局节点
        while (vert !== null) {
            index++;
            root.node.data.rad = rad;
            //console.log(vert.node.data.key + ":" + vert.node.data.text);
            // involute spiral
            //循环判断是否有覆盖，如果覆盖增加基圆半径，重新计算下一个位置
            dangle = 0.4;
            angleOld = angle;
            //for(dangle=0.1;dangle<=0.9;dangle+=0.1){
            for (var i = 0; i <= 20; i++) {
                //圆的渐开线参数方程算出下一个节点位置
                newPoint = getInvolutePoint(rad, angle);
                newPoint = new go.Point(newPoint.x + root.node.location.x, newPoint.y + root.node.location.y);
                x = newPoint.x;
                y = newPoint.y;

                if (vert.node instanceof go.Group && edge.link.toNode !== vert.node) {
                    var offset = edge.link.toNode.location.copy().subtract(vert.node.location);
                    newPoint.x -= offset.x;
                    newPoint.y -= offset.y;
                }
                //tmpR = vert.node.actualBounds.width / 2 * Math.sqrt(2);
                tmpR = vert.node.actualBounds.width / 2;
                //curRect = new go.Rect(newPoint.x - tmpR/ 2, newPoint.y - tmpR / 2, tmpR, tmpR);
                curRect = { point: newPoint, radius: tmpR };
                res = checkCoveredWithNodes(curRect, nodesDealed);
                //res = checkCovered(vert.node, newPoint, this.network.vertexes,nodesDealed);
                //  //检查覆盖
                if (res) {
                    adjustAngleCount++;
                    if (angle >= fromVert.node.data.angle + Math.PI / 2) {
                        angle = fromVert.node.data.angle + Math.PI / 2;
                        break;
                    }
                    //if (angle <= fromVert.node.data.angle + 0.2) {
                    //  angle = fromVert.node.data.angle + 0.2;
                    //}
                    if (tdSpiralMode != 'equidistant') { //等距模式，不自动调节距离
                        angle = fromVert.node.data.angle + (i + 1) * Math.PI / 16; //加的算法
                        //dia = Math.max(equaldistance,vert.node.actualBounds.width / 2+ nextvert.node.actualBounds.width / 2);
                        dept = cw * Math.atan((vert.node.actualBounds.width / 2 + fromVert.node.actualBounds.width / 2 + distance) / Math.sqrt(vert.node.location.distanceSquaredPoint(root.node.location)));
                        if (angle <= fromVert.node.data.angle + dept) { //保证最小间距
                            angle = fromVert.node.data.angle + dept;
                        }
                    } else {
                        break;
                    }

                } else {
                    break;
                }

            }

            //检查覆盖，如果增加angle的方式没有消除覆盖，则增加半径
            if (res) {
                rad += 1; //加的算法
                //angle = angleOld;
                break; //如果有覆盖，则增加基圆半径，保证没有覆盖
                //console.log("rad:"+rad);
            }

            nextedge = vert.destinationEdges.first();
            nextvert = (nextedge !== null ? nextedge.toVertex : null);

            vert.centerX = newPoint.x;
            vert.centerY = newPoint.y;
            vert.node.data.angle = angle;

            edge.link.data.unautoLink = false;
            edge.link.rad = rad;
            edge.link.angle1 = fromVert.node.data.angle;
            edge.link.angle2 = vert.node.data.angle;

            var equalSpiral = false;
            if ('0512' == '0512') {
                //角度小于一圈，且节点个数小于等于4个时，为了优化线条，节点间距离拉大，节点距离通过angle控制
                //if (childCount <= 6  ) {
                if (tdSpiralMode != 'terse') { //紧凑模式下，不自动调节节点
                    if (childCount <= 6) {
                        if (childCount * 1.3 < 3 * Math.PI / 2 && !hasGroup) {
                            angle += Math.min((3 * Math.PI / 2 / childCount), Math.PI / 2);
                        } else {
                            if (vert.node.data["isGroup"]) {
                                equalSpiral = true;
                            } else {
                                angle += 1.3;
                            }

                        }
                        //angle += 0.9;
                    } else { //角度大于一圈，时等间距
                        equalSpiral = true;
                    }
                } else {
                    equalSpiral = true;
                }

                if (equalSpiral) {
                    if (nextvert == null) {
                        dia = equaldistance;
                        dept = cw * Math.atan((dia + distance) / Math.sqrt(newPoint.distanceSquaredPoint(root.node.location))); //why?
                    } else {
                        dia = Math.max(equaldistance, vert.node.actualBounds.width / 2 + nextvert.node.actualBounds.width / 2);
                        dept = cw * Math.atan((dia + distance) / Math.sqrt(newPoint.distanceSquaredPoint(root.node.location))); //why?
                    }
                    angle += dept;
                }
            }

            tmpR = vert.node.actualBounds.width;
            nodesDealed.add(curRect);
            //nodesDealed.add({point:new go.Point(vert.centerX, vert.centerY), radius:vert.node.actualBounds.width/2});
            edge = nextedge;
            fromVert = vert;
            vert = nextvert;
        }

        if (vert == null) {
            _do = false;
        }
    }

    // console.log(root.node.data.key + ":total compute layout times:" + count);
    this.updateParts();

    this.network = null;
    if (tdDebug) {
        console.log("spiral dolayout end " + root.node.data.key);
    }
};

SpiralLayout.prototype.commitLayout = function() {
    this.network.vertexes.each(function(v) {
        v.commit();
    });
    this.network.edges.each(function(v) {
        v.commit();
    });
    if (tdDebug) {
        console.log("spiral layout end ");
    }
    //this.invalidateLayout();
};

/**
 * @ignore
 * Compute the effective diameter of a Node.
 * @this {SpiralLayout}
 * @param {LayoutVertex} v
 * @return {number}
 */
SpiralLayout.prototype.diameter = function(v) {
    if (!v) return 0;
    var b = v.bounds;
    return Math.sqrt(b.width * b.width / 4 + b.height * b.height / 4);
};

/**
 * Gets or sets the radius distance.
 * The default value is NaN.
 * @name SpiralLayout#radius
 * @function.
 * @return {number}
 */

Object.defineProperty(SpiralLayout.prototype, "radius", {
    get: function() { return this._radius; },
    set: function(val) {
        if (typeof val !== "number") throw new Error("new value for SpiralLayout.radius must be a number, not: " + val);
        if (this._radius !== val) {
            this._radius = val;
            this.invalidateLayout();
        }
    }
});

/**
 * Gets or sets the spacing between nodes.
 * The default value is 100.
 * @name SpiralLayout#spacing
 * @function.
 * @return {number}
 */
Object.defineProperty(SpiralLayout.prototype, "spacing", {
    get: function() { return this._spacing; },
    set: function(val) {
        if (typeof val !== "number") throw new Error("new value for SpiralLayout.spacing must be a number, not: " + val);
        if (this._spacing !== val) {
            this._spacing = val;
            this.invalidateLayout();
        }
    }
});

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

/**
 * Gets or sets whether the spiral should go clockwise or counter-clockwise.
 * The default value is true.
 * @name SpiralLayout#clockwise
 * @function.
 * @return {boolean}
 */
Object.defineProperty(SpiralLayout.prototype, "clockwise", {
    get: function() { return this._clockwise; },
    set: function(val) {
        if (typeof val !== "boolean") throw new Error("new value for SpiralLayout.clockwise must be a boolean, not: " + val);
        if (this._clockwise !== val) {
            this._clockwise = val;
            this.invalidateLayout();
        }
    }
});

/**
 处理：如三点共线，则返回false；否则，返回true，并将计算得到的圆心与半径存放在center和radius众返回。
    */
function triangleCircle(p1, p2, p3) {
    //检查三点是否共线
    if (isThreePointsOnOneLine(p1, p2, p3))
        return false;

    var x1, x2, x3, y1, y2, y3, radius;

    x1 = p1.x;
    x2 = p2.x;
    x3 = p3.x;
    y1 = p1.y;
    y2 = p2.y;
    y3 = p3.y;

    //求外接圆半径
    var a = Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
    var b = Math.sqrt((x1 - x3) * (x1 - x3) + (y1 - y3) * (y1 - y3));
    var c = Math.sqrt((x2 - x3) * (x2 - x3) + (y2 - y3) * (y2 - y3));
    var p = (a + b + c) / 2;
    var S = Math.sqrt(p * (p - a) * (p - b) * (p - c));
    radius = a * b * c / (4 * S);

    //求外接圆圆心
    var t1 = x1 * x1 + y1 * y1;
    var t2 = x2 * x2 + y2 * y2;
    var t3 = x3 * x3 + y3 * y3;
    var temp = x1 * y2 + x2 * y3 + x3 * y1 - x1 * y3 - x2 * y1 - x3 * y2;
    var x = (t2 * y3 + t1 * y2 + t3 * y1 - t2 * y1 - t3 * y2 - t1 * y3) / temp / 2;
    var y = (t3 * x2 + t2 * x1 + t1 * x3 - t1 * x2 - t2 * x3 - t3 * x1) / temp / 2;


    var result = [];
    result = [radius, x, y];
    return result;
}

/**
 判断3个点是否共线
    */
function isThreePointsOnOneLine(p1, p2, p3) {
    return false;
}


export default SpiralLayout;