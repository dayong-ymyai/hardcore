// 

var $ = go.GraphObject.make;
var Base = require('./base')
var helpers = require('../helpers/helpers.gojs')


// this is a Part.dragComputation function for limiting where a Node may be dragged
function stayInGroup(part, pt, gridpt) {
    // don't constrain top-level nodes
    var grp = part.containingGroup;
    if (grp === null) return pt;
    // try to stay within the background Shape of the Group
    var back = grp.resizeObject;
    if (back === null) return pt;
    // allow dragging a Node out of a Group if the Shift key is down
    if (part.diagram.lastInput.shift) return pt;
    var p1 = back.getDocumentPoint(go.Spot.TopLeft);
    var p2 = back.getDocumentPoint(go.Spot.BottomRight);
    var b = part.actualBounds;
    var loc = part.location;
    // find the padding inside the group's placeholder that is around the member parts
    // var m = grp.placeholder.padding;
    // now limit the location appropriately
    var x = Math.max(p1.x, Math.min(pt.x, p2.x - b.width - 1)) + (loc.x - b.x);
    var y = Math.max(p1.y, Math.min(pt.y, p2.y - b.height - 1)) + (loc.y - b.y);
    return new go.Point(x, y);
}


class WaveNodeTemplate extends Base {
    constructor(options) {
        super(options)
        // this.nodeProperties = {}

    }

    makeGeo(data, shape, options) {
        // this is much more efficient than calling go.GraphObject.make:
        var {radiusX = 150, radiusY = 100} = data
        radiusX = shape.part.findObject("main").width / 2
        radiusY = shape.part.findObject("main").height / 2
        // console.log("makeGeo999999999999999999999999999",radiusX,radiusY)
        var geo = new go.Geometry()
            .add(new go.PathFigure(0, 0)  // start point
                .add(new go.PathSegment(go.PathSegment.SvgArc,
                    radiusX * 2, 0, radiusX, radiusY, 0, 1, options.clockwiseFlag ? 1 : 0
                    )
                )
            )
        geo.defaultStretch = go.GraphObject.Fill;
        return geo;
    }

    makeGeoWave(data, shape, options) {
        // this is much more efficient than calling go.GraphObject.make:
        var {radiusX = 150, radiusY = 100} = data
        radiusX = shape.part.findObject("main").width / 2
        radiusY = shape.part.findObject("main").height / 2
        // console.log("makeGeo999999999999999999999999999",radiusX,radiusY)
        var seg = new go.PathSegment(go.PathSegment.QuadraticBezier,
            radiusX * 2, 0, //describe the end point
            radiusX, radiusY * (options.clockwiseFlag ? -1 : 1), // describe the only control point
            // radiusX*2,0,radiusX, radiusY,0,1,options.clockwiseFlag?1:0
        )

        if (data.role == "waveTail") {


            seg = new go.PathSegment(go.PathSegment.QuadraticBezier,
                radiusX, radiusY * (options.clockwiseFlag ? -1 : 1), //describe the end point
                radiusX / 2, radiusY * (options.clockwiseFlag ? -1 : 1), // describe the only control point
                // radiusX*2,0,radiusX, radiusY,0,1,options.clockwiseFlag?1:0
            )

            // seg = new go.PathSegment(go.PathSegment.Bezier,
            //   radiusX, radiusY*(options.clockwiseFlag?-1:1), //describe the end point
            //   x1, y1 ,//describe the first control point
            //   x2, y2, // describe the second control point
            //   radiusX, radiusY*(options.clockwiseFlag?-1:1), // describe the only control point
            // // radiusX*2,0,radiusX, radiusY,0,1,options.clockwiseFlag?1:0
            //     )
        }

        // seg.endX = radiusX
        // seg.endY = 0
        var geo = new go.Geometry()
            .add(new go.PathFigure(0, 0)  // start point
                .add(seg)
            )
        geo.defaultStretch = go.GraphObject.None;
        return geo;
    }

    getShiHalfEllipseShape() {
        return $(go.Shape, {
                name: "XU",
                strokeWidth: 2,
                stroke: "#cb1c27", fill: "rgba(0,66,0,0)",
                // background: "yellow",
                stretch: go.GraphObject.Uniform,
                alignment: go.Spot.Bottom,
                alignmentFocus: go.Spot.Bottom,
                // row:1, column:0,margin:0

            },
            // new go.Binding("alignment","",function(data, shape){
            //   if(data.flip){
            //     return go.Spot.Top
            //   }
            //   return go.Spot.Bottom
            // }),
            // new go.Binding("alignmentFocus","",function(data, shape){
            //   if(data.flip){
            //     return go.Spot.Top
            //   }
            //   return go.Spot.Bottom
            // }),
            new go.Binding("geometry", "", (data, shape) => {
                var clockwiseFlag = 0;
                if (data.order % 2 == 0) {
                    clockwiseFlag = 1;
                }
                if (data.flip) {
                    // clockwiseFlag = 1;
                }
                // console.log(`data.oliveType: ${data.oliveType}`)
                if (data.oliveType == "Ellipse") {
                    // console.log(``)
                    return this.makeGeo(data, shape, {clockwiseFlag: clockwiseFlag})
                }
                return this.makeGeoWave(data, shape, {clockwiseFlag: clockwiseFlag})
            }),
            new go.Binding("stroke", "shiStroke").makeTwoWay(),
            new go.Binding("strokeWidth", "shiStrokeWidth").makeTwoWay(),
            // new go.Binding("strokeDashArray", "shiStrokeDashArray").makeTwoWay(),
            new go.Binding("strokeDashArray", "shiStrokeDashArray", function (v) {
                return JSON.parse(v)
            }).makeTwoWay(function (v) {
                return JSON.stringify(v)
            }),
            new go.Binding("desiredSize", "desiredSize", function (v) {
                var size = new go.Size(v.width, v.height / 2)
                // console.log("v:",v)
                return size
            }).ofObject("main")
        )
    }

    getXuHalfEllipseShape() {
        return $(go.Shape, {
                name: "SHI",
                strokeWidth: 2,
                stroke: "#0e399d", fill: "rgba(0,66,0,0)",
                // background: "gray",
                stretch: go.GraphObject.Uniform,
                alignment: go.Spot.Bottom,
                strokeDashArray: [10, 5],
                alignmentFocus: go.Spot.Bottom,
                // row:1, column:0,margin:0
            },
            // new go.Binding("alignment","",function(data, shape){
            //   if(data.flip){
            //     return go.Spot.Top
            //   }
            //   return go.Spot.Bottom
            // }),
            // new go.Binding("alignmentFocus","",function(data, shape){
            //   if(data.flip){
            //     return go.Spot.Top
            //   }
            //   return go.Spot.Bottom
            // }),
            new go.Binding("geometry", "", (data, shape) => {
                var clockwiseFlag = 1;
                if (data.order % 2 == 0) {
                    clockwiseFlag = 0;
                }
                // if(data.flip){
                //   clockwiseFlag = 0;
                // }
                // console.log(`data.oliveType1: ${data.oliveType}`)
                if (data.oliveType == "Ellipse") {
                    // console.log(`data.oliveType2: ${data.oliveType}`)
                    return this.makeGeo(data, shape, {clockwiseFlag: clockwiseFlag})
                }
                // console.log(`data.oliveType3: ${data.oliveType}`)
                return this.makeGeoWave(data, shape, {clockwiseFlag: clockwiseFlag})
            }),
            new go.Binding("stroke", "xuStroke").makeTwoWay(),
            new go.Binding("strokeWidth", "xuStrokeWidth").makeTwoWay(),
            // new go.Binding("strokeDashArray", "xuStrokeDashArray").makeTwoWay(),
            new go.Binding("strokeDashArray", "xuStrokeDashArray", function (v) {
                return JSON.parse(v)
            }).makeTwoWay(function (v) {
                return JSON.stringify(v)
            }),
            new go.Binding("desiredSize", "desiredSize", function (v) {
                var size = new go.Size(v.width, v.height / 2)
                // console.log("v:",v)
                return size
            }).ofObject("main")
        )
    }

    getTailShiShape() {
        return $(go.Shape, {
                name: "XU",
                strokeWidth: 2,
                stroke: "#cb1c27", fill: "rgba(0,66,0,0)",
                // background: "yellow",
                stretch: go.GraphObject.None,
                alignment: go.Spot.Bottom,
                alignmentFocus: go.Spot.Bottom,
                // row:1, column:0,margin:0
            },
            // new go.Binding("alignment","",function(data, shape){
            //   if(data.flip){
            //     return go.Spot.Top
            //   }
            //   return go.Spot.Bottom
            // }),
            // new go.Binding("alignmentFocus","",function(data, shape){
            //   if(data.flip){
            //     return go.Spot.Top
            //   }
            //   return go.Spot.Bottom
            // }),
            new go.Binding("geometry", "", (data, shape) => {
                var clockwiseFlag = 0;
                if (data.order % 2 == 0) {
                    clockwiseFlag = 1;
                }
                if (data.flip) {
                    // clockwiseFlag = 1;
                }

                return this.makeGeoWave(data, shape, {clockwiseFlag: !clockwiseFlag})
            }),
            new go.Binding("stroke", "shiStroke").makeTwoWay(),

            new go.Binding("desiredSize", "desiredSize", function (v) {
                var size = new go.Size(v.width, v.height / 2)
                // console.log("v:",v)
                return size
            }).ofObject("main")
        )
    }

    getTailXuShape() {
        return $(go.Shape, {
                name: "TailXu",
                strokeWidth: 2,
                stroke: "#0e399d", fill: "rgba(0,66,0,0)",
                // background: "gray",
                stretch: go.GraphObject.None,
                alignment: go.Spot.Bottom,
                strokeDashArray: [10, 5],
                alignmentFocus: go.Spot.Bottom,
                // row:1, column:0,margin:0
            },
            // new go.Binding("alignment","",function(data, shape){
            //   if(data.flip){
            //     return go.Spot.Top
            //   }
            //   return go.Spot.Bottom
            // }),
            // new go.Binding("alignmentFocus","",function(data, shape){
            //   if(data.flip){
            //     return go.Spot.Top
            //   }
            //   return go.Spot.Bottom
            // }),
            new go.Binding("geometry", "", (data, shape) => {
                var clockwiseFlag = 1;
                if (data.order % 2 == 0) {
                    clockwiseFlag = 0;
                }
                // if(data.flip){
                //   clockwiseFlag = 0;
                // }
                return this.makeGeoWave(data, shape, {clockwiseFlag: !clockwiseFlag})
            }),
            new go.Binding("desiredSize", "desiredSize", function (v) {
                var size = new go.Size(v.width, v.height / 2)
                // console.log("v:",v)
                return size
            }).ofObject("main")
        )
    }

    getTextBuild() {
        return $(go.TextBlock, {
                name: "TEXT",
                alignment: new go.Spot(0.5, 0.4),
                font: "18px 'Microsoft YaHei'",
                editable: false,
                // flip:go.GraphObject.FlipHorizontal,
                //margin: 3, editable: true,
                // background: "gray",
                angle: 0,
                stroke: "black",
                isMultiline: true,
                textEdited: function (textBlock, oldv, newv) {

                    // if(textBlock.part.containingGroup.data.textAngle == "horizontal"){
                    var centerText = textBlock.part.diagram.model.findNodeDataForKey(textBlock.part.data.centerText)
                    if (centerText) {
                        console.log("centerTextcenterTextcenterTextcenterText")
                        textBlock.part.diagram.model.startTransaction("text")
                        textBlock.part.diagram.model.setDataProperty(centerText, "text", newv)
                        textBlock.part.diagram.model.commitTransaction("text")
                    }
                    //   return;
                    // }
                    setTimeout(function () {
                        console.log("textEditedtextEditedtextEdited", textBlock.lineCount)
                        if (!textBlock.text) return;
                        if (textBlock.text && textBlock.text.trim() == "") return;
                        if (textBlock.lineCount % 2 != 0) {
                            if (newv[newv.length - 1] == "\n") {
                                textBlock.text = newv.substring(0, newv.length - 1)
                                return;
                            }
                            textBlock.text = newv + "\n"
                        }
                    }, 100)

                    var enterCount = 0;
                    textBlock.part.containingGroup.layout.isValidLayout = false
                    // for(var i=0;i<newv.length;i++){

                    // }
                    // textBlock.part.updateTargetBindings()

                    // if(textBlock.lineCount %2 != 0){
                    //   if(newv[newv.length-1] == "\n"){
                    //     textBlock.text = newv.substring(0, newv.length-1)
                    //     return;
                    //   }
                    //   textBlock.text = newv+"\n"
                    // }
                },
                overflow: go.TextBlock.OverflowClip,
                wrap: go.TextBlock.WrapDesiredSize,
                textAlign: "center",
                spacingAbove: 4,
                spacingBelow: 4,
                portId: "TEXT",
                stretch: go.GraphObject.Uniform
            },
            new go.Binding("visible", "textVisible").makeTwoWay(),
            new go.Binding("alignment", "", function (v, textBlock) {
                // console.log('textBlock', textBlock.lineCount)
                // if(textBlock.lineCount%2 == 0){
                //   return new go.Spot(0.5,0.5)
                // }
                return new go.Spot(0.5, 0.5)
            }),
            new go.Binding("textAlign", "textAlign", function (v) {
                // return ['start', 'center', 'end'].indexOf(v)>-1 ? v : "center";
                return v;
            }).makeTwoWay(),
            new go.Binding("spacingAbove", "spacingline", function (v) {
                return helpers.tdTransToNum(v, 4);
            }).makeTwoWay(),
            new go.Binding("spacingBelow", "spacingline", function (v) {
                return helpers.tdTransToNum(v, 4);
            }).makeTwoWay(),
            new go.Binding("width", "width", function (v) {
                return v - 30;
            }).ofObject("main"),
            // new go.Binding("height", "height", function (v) {
            //   return v;
            // }).ofObject("SHAPE"),
            new go.Binding("text", "text", function (text, d) {
                // console.log("d.lineCount,d.lineCountd.lineCount",text,d.lineCount)
                // setTimeout(function(){
                //   if(d && d.lineCount!=null && d.lineCount%2 != 0){
                //     if(text && text[text.length-1] != "\n"){
                //       d.text+="\n"
                //     }
                //   }
                // },100)
                // setTimeout(function(){
                //   try{
                //     console.log("check overflow")
                //     if(!d.text) return;
                //     if(d.text && d.text.trim() == "") return;
                //     if(d.lineCount %2 != 0){
                //       if(d.text[d.text.length-1] == "\n"){
                //         d.text = d.text.substring(0, d.text.length-1)
                //         return;
                //       }
                //       d.text = d.text+"\n"
                //     }
                //     // if(d && d.lineCount!=null && d.lineCount%2 != 0){
                //     //   if(d.text && d.text[d.text.length-1] != "\n"){
                //     //     d.text+="\n"
                //     //   }
                //     // }
                //   }catch(e){
                //     console.error(e)
                //   }
                // },100)
                return text
                // console.log("sdfsdfsdfsdfsdfdsfdsfsd")
                console.log(text, ":", d.lineCount)
                if (d.lineCount % 2 != 0) {
                    return text + "\n"
                } else {
                    return text
                }
            }).makeTwoWay(function (text, d) {
                console.log("text write write", d.lineCount)
                return text
                if (d.lineCount % 2 != 0) {
                    return text + "\n"
                } else {
                    return text
                }
            }),
            new go.Binding("stroke", "textStroke").makeTwoWay(),
            new go.Binding("font", "font").makeTwoWay()
        )
    }

    getNodeSelectionAdornmentTemplate() {
        return $(go.Adornment, "Spot",
            {
                // isShadowed: true,
            },
            $(go.Panel, "Auto",
                $(go.Shape, {
                        isPanelMain: true,
                        fill: null,
                        stroke: "dodgerblue", strokeWidth: 3
                    },
                    // new go.Binding("fill","",function(e,obj){
                    //   var radBrush = $(go.Brush, "Radial", { 0: "rgba(248,248,242,0)", 1: 'RGB(255,242,0)' });
                    //   return radBrush;
                    // })
                    //
                ),
                $(go.Placeholder) // this represents the selected Node

            ),


            // ),
            // the button to create a "next" node, at the top-right corner
            $("CircleButton", {
                    name: "AddChild",
                    toolTip: $(go.Adornment, "Auto",
                        $(go.Shape, {fill: "#FFFFCC"}),
                        $(go.TextBlock, {textAlign: 'center', margin: new go.Margin(8, 4, 4, 4)}, // the tooltip shows the result of calling nodeInfo(data)
                            new go.Binding("text", "", function (d) {
                                return "增加橄榄";
                            }))
                    ),
                    alignment: go.Spot.Right,
                    alignmentFocus: go.Spot.Left,
                    width: 50,
                    height: 50,
                    click: function (e) {
                        e.diagram.__trtd.addOlive()
                    } // this function is defined below
                },
                $(go.Shape, "PlusLine", {stroke: '#770077', desiredSize: new go.Size(25, 25)})
            ),
            $("CircleButton", {
                    name: "RemoveChild",
                    toolTip: $(go.Adornment, "Auto",
                        $(go.Shape, {fill: "#FFFFCC"}),
                        $(go.TextBlock, {textAlign: 'center', margin: new go.Margin(8, 4, 4, 4)}, // the tooltip shows the result of calling nodeInfo(data)
                            new go.Binding("text", "", function (d) {
                                return "删除橄榄";
                            }))
                    ),
                    alignment: go.Spot.Left,
                    alignmentFocus: go.Spot.Right,
                    width: 50,
                    height: 50,
                    click: function (e) {
                        e.diagram.__trtd.deleteSelection()
                    } // this function is defined below
                },
                $(go.Shape, "MinusLine", {stroke: '#770077', desiredSize: new go.Size(25, 25)})
            ),
            $("Button", {
                    name: "AddLevel",
                    toolTip: $(go.Adornment, "Auto",
                        $(go.Shape, {fill: "#FFFFCC"}),
                        $(go.TextBlock, {textAlign: 'center', margin: new go.Margin(8, 4, 4, 4)}, // the tooltip shows the result of calling nodeInfo(data)
                            new go.Binding("text", "", function (d) {
                                return "增加同级节点";
                            }))
                    ),
                    alignment: new go.Spot(1, 0.5, 15, 0),
                    width: 30,
                    height: 30,
                    click: function (e) {
                        e.diagram.__trtd.addOlive()
                    } // this function is defined below
                },
                $(go.Shape, "PlusLine", {stroke: "#227700", desiredSize: new go.Size(15, 15)}),
                new go.Binding("visible", "level", function (level) {
                    return level != 0; // hidden this button if current node is root node

                })
            ),
            // $(go.Panel, "Auto", {        // 放大镜
            //         name: "ButtonIcon1",
            //         alignment: new go.Spot(0, 1, 5, -5),
            //         //alignment: go.Spot.BottomLeft,
            //         //alignmentFocus: go.Spot.BottomLeft,
            //         width: 60,
            //         height: 60,
            //         isActionable: true,
            //         click: expandCollapse // this function is defined below
            //     },

            //     $(go.Shape, "Circle", {
            //         fill: "rgba(1,1,1,0)",
            //         strokeWidth: 0,
            //         stroke: "green",
            //         width: 50,
            //         height: 50
            //     }),
            //     $(go.Shape, {
            //             '_para1': true,
            //             name: "ButtonIcon",
            //             fill: "red",
            //             strokeWidth: 2,
            //             stroke: "#767678",
            //             geometryString: icons["zoomout"], // default value for isTreeExpanded is true
            //             desiredSize: new go.Size(30, 30)
            //         },
            //         new go.Binding("geometryString", "", function(d, button) {
            //             // console.log('dddddd:', d);
            //             // console.log('button:', button);
            //             // var myDiagram = d.diagram;
            //             // var node = myDiagram.selection.first();
            //             // if (node["_controlExpand"]) {
            //             //     return icons["zoomout"];
            //             // } else {
            //             //     return icons["zoomin"];
            //             // }
            //             return icons["zoomin"];
            //         })
            //     )
            // )
        );
    }

    nodeResizeAdornmentTemplate() {
        return $(go.Adornment, "Spot",
            $(go.Placeholder), // takes size and position of adorned object
            // $(go.Shape, "Circle", // left resize handle
            //     {
            //         alignment: go.Spot.TopLeft,
            //         alignmentFocus: go.Spot.BottomRight,
            //         cursor: "col-resize",
            //         desiredSize: new go.Size(30, 30),
            //         fill: "lightblue",
            //         stroke: "dodgerblue"
            //     }),
            $(go.Shape, "Circle", // right resize handle
                {
                    alignment: go.Spot.BottomRight,
                    alignmentFocus: go.Spot.TopLeft,
                    cursor: "col-resize",
                    desiredSize: new go.Size(30, 30),
                    fill: "lightblue",
                    stroke: "dodgerblue"
                })
        )
    }


    getNodeTemplate() {
        var diagram = this.diagram
        var that = this;
        return $(go.Node, "Spot", {
                // isClipping: true,
                __trtdNode: that,
                layerName: "overflow",
                zOrder: 5,
                // copyable: false,
                // dragComputation: stayInGroup,
                movable: true,
                resizable: false,
                // locationObjectName: "main",
                resizeObjectName: "main",
                selectionObjectName: "main",
                rotatable: false,
                resizeAdornmentTemplate: that.nodeResizeAdornmentTemplate(),
                layoutConditions: ~go.Part.LayoutStandard & go.Part.LayoutRemoved & go.Part.LayoutAdded & go.Part.LayoutNodeSized,
                locationSpot: go.Spot.LeftCenter,
                // toolTip:  // define a tooltip for each node that displays the color as text
                // $(go.Adornment, "Spot",
                //   $(go.TextBlock, { margin: 4 },
                //     new go.Binding("text", "", function(data,p){
                //       // console.log("tooltip:",p,data)
                //       var tips = ["双击编辑文字","尝试按方向键快捷移动到下一个对象","按回车键增加橄榄"]
                //       var isPhone = helpers.checkPhone()
                //       if(isPhone){
                //         return ""
                //       }
                //       var elt = Math.floor(tips.length * Math.random())
                //       return tips[elt]
                //     })
                //   )
                // ),  // end of Adornment
                click: (e, node) => {
                    console.log(node.data)
                    if (!node.containingGroup) return;
                    var it = node.containingGroup.findSubGraphParts().iterator;
                    while (it.next()) {
                        var n = it.value;
                        if (n.data.category == "autoText" && (n.data.role == "xuText" || n.data.role == "shiText")) {
                            if (n.data.order == node.data.order) {
                                // locateNode = n;
                                if (n.data.text == "" || n.data.text.trim() == "") {
                                    n.findObject("textBorder").visible = true;
                                }
                                //   n.areaBackground = "mediumslateblue"
                            } else {
                                n.findObject("textBorder").visible = false;
                            }
                        }
                    }
                },
                mouseOver: function (e, node) {
                    // if(node.data.hyperlink){
                    //   var textObj = node.findObject('TEXT');
                    //   textObj.isUnderline = true;
                    // }
                    if (!node.containingGroup) return;
                    // var it = node.containingGroup.findSubGraphParts().iterator;
                    // while (it.next()) {
                    //     var n = it.value;
                    //     if(n.data.category == "autoText"){
                    //         if(n.data.order == node.data.order){
                    //             // locateNode = n;
                    //             if(n.data.text == "" || n.data.text.trim() == ""){
                    //               n.findObject("textBorder").visible = true;
                    //             }
                    //           //   n.areaBackground = "mediumslateblue"
                    //         }
                    //     }
                    // }

                    var shiText = node.diagram.findNodeForKey(node.data.shiText)
                    if (shiText) {
                        shiText.findObject("textBorder").visible = true;
                    }
                    var xuText = node.diagram.findNodeForKey(node.data.xuText)
                    if (xuText) {
                        xuText.findObject("textBorder").visible = true;
                    }
                    var centerText = node.diagram.findNodeForKey(node.data.centerText)
                    if (centerText) {
                        centerText.layerName = "Background"
                    }

                    // diagram.__trtd.showNodeRemarkTips(e, node);
                },
                contextMenu: $(go.Adornment),

                mouseDragEnter: function (e, obj) {
                    var node = obj.part;
                    var selnode = e.diagram.selection.first();

                    // 常变
                    if (selnode.data.category != "wave" && !(selnode.data.category == "picGroup" && selnode.data.role == "cbian")) {
                        return;
                    }
                    var centerText = node.diagram.findNodeForKey(node.data.centerText)
                    if (centerText) {
                        centerText.layerName = "Background"
                    }
                    //var sat = node.selectionAdornmentTemplate;
                    //var adorn = sat.copy();
                    //adorn.adornedObject = node;
                    //node.addAdornment("dragEnter", adorn);

                    //if (!mayWorkFor(selnode, node)) return;
                    var shape = node.findObject("main");
                    if (shape) {
                        shape._prevFill = shape.fill; // remember the original brush
                        shape.fill = "RGBA(146,208,80,0.5)";
                    }
                },
                mouseDragLeave: function (e, obj) {
                    var node = obj.part;
                    var shape = node.findObject("main");
                    if (shape && shape._prevFill) {
                        shape.fill = shape._prevFill; // restore the original brush
                    }
                    var centerText = node.diagram.findNodeForKey(node.data.centerText)
                    if (centerText) {
                        if (!helpers.checkPhone()) {
                            centerText.layerName = "Foreground"
                        }
                    }
                    //node.removeAdornment("dragEnter");
                },
                mouseDrop: function (e, obj) {
                    var node = obj.part;
                    console.log("mouseDropmouseDropmouseDropmouseDrop")
                    var selnode = e.diagram.selection.first();
                    if (!selnode) return;
                    // 常变
                    if (selnode.data.category == "picGroup" && selnode.data.role == "cbian") {
                        var it = selnode.findSubGraphParts().iterator;
                        var deleteObjs = []
                        var cbian = {}
                        while (it.next()) {
                            var n = it.value;
                            if (n.data.category == "autoText") {
                                if (n.data.locationSpot == "0 0 0 0") {
                                    cbian.shiText = n.data.text;
                                }
                                if (n.data.locationSpot == "0 0.5 0 0") {
                                    cbian.centerText = n.data.text;
                                }
                                if (n.data.locationSpot == "0 1 0 0") {
                                    cbian.xuText = n.data.text;
                                }
                            }
                            deleteObjs.push(n.data)
                        }
                        e.diagram.startTransaction("mouseDrop")
                        // 删除总结图
                        e.diagram.model.removeNodeDataCollection(deleteObjs)
                        var backupSelnode = JSON.parse(JSON.stringify(selnode.data))
                        e.diagram.model.removeNodeData(selnode.data)

                        // 添加新橄榄
                        e.diagram.__trtd.addOlive(node, cbian)
                        e.diagram.commitTransaction("mouseDrop")
                        return;
                    }

                    if (selnode.data.category != "wave") {
                        return;
                    }
                    if (!node) {
                        // node.containingGroup.layout.isValidLayout = false
                        return;
                    }
                    if (selnode.data.group != obj.data.group) {
                        return;
                    }
                    e.diagram.startTransaction("mouseDrop")
                    selnode.__oldOrder = selnode.data.order
                    e.diagram.model.setDataProperty(selnode.data, "order", node.data.order + 0.5)
                    var xuText = e.diagram.findNodeForKey(selnode.data.xuText)
                    var shiText = e.diagram.findNodeForKey(selnode.data.shiText)
                    // shiText.__oldOrder = shiText.data.order
                    // xuText.__oldOrder = xuText.data.order
                    e.diagram.model.setDataProperty(shiText, "order", node.data.order + 0.5)
                    e.diagram.model.setDataProperty(xuText, "order", node.data.order + 0.5)
                    // node.containingGroup.layout.isValidLayout = false
                    e.diagram.commitTransaction("mouseDrop")
                    return;
                    if (node.data.isparent) {
                        var child = e.diagram.findNodeForKey(node.data.isparent);
                        while (child.data.next) {
                            child = e.diagram.findNodeForKey(child.data.next);
                        }
                        if (child.data.key == selnode.data.key) {
                            //最后一个子节点拖放到父节点上时，不做任何操作
                            return;
                        }
                        e.diagram.__trtd.setNodeAsSibling(selnode, child);
                    } else {
                        e.diagram.__trtd.setNodeAsChildren(selnode, node);
                    }
                },
                mouseLeave: function (e, node) {
                    if (!node.containingGroup) return;
                    var it = node.containingGroup.findSubGraphParts().iterator;
                    while (it.next()) {
                        var n = it.value;
                        if (n.data.category == "autoText") {
                            // if(n.data.order == node.data.order+1){
                            //     locateNode = n;
                            // }
                            n.findObject("textBorder").visible = false;
                            // n.areaBackground = null
                        }
                    }
                    try {
                        var centerText = e.diagram.findNodeForKey(node.data.centerText)
                        if (centerText) {
                            centerText.layerName = "Foreground"
                        }
                    } catch (e) {
                        console.error("wave node template error:", e)
                    }
                },
                selectionAdornmentTemplate: this.getNodeSelectionAdornmentTemplate(),
                doubleClick: function (e, node) {
                    if (!node) return;
                    if (!node.containingGroup) return;
                    if (node.containingGroup.data.textAngle == "horizontal" && node.containingGroup.data.centerTextAngle == "independent") {
                        // 如果文字方向为正向，且中线文字为正向
                        node.findObject("TEXT").visible = true;
                        var centerText = node.diagram.findNodeForKey(node.data.centerText)
                        if (centerText) {
                            centerText.visible = false;
                        }
                    }
                    setTimeout(() => {
                        e.diagram.__trtd.selectText(e, node)
                    }, 100)
                },
            },
            this.binding,
            $(go.Shape, "Rectangle",
                {
                    name: "main",
                    // layerName: "overflow",
                    fill: "rgba(0,0,0,0)", stroke: null, width: 300, height: 150
                },
                new go.Binding("fill", "fill").makeTwoWay(),
                // new go.Binding("fill", "fill").makeTwoWay(),
                new go.Binding("desiredSize", "desiredSize", function (v, d) {
                    // console.log("vd m", v, d )
                    // if(!v) return d.part.findObject("SHAPE").measuredBounds.size;
                    return go.Size.parse(v)
                }).makeTwoWay(function (v) {
                    return go.Size.stringify(v)
                }),
            ),
            // $(go.Panel, "Spot",{
            //   // isClipping: true,
            //   background: "green",
            //   position: new go.Point(0,0),
            //   alignment: go.Spot.Center,
            //   alignmentFocus: go.Spot.Center,
            // },
            // $(go.Shape, "Rectangle",{
            //   alignment: go.Spot.Center,
            //   alignmentFocus: go.Spot.Center,
            // },
            // new go.Binding("desiredSize", "desiredSize", function(v) {
            //     var size = new go.Size(v.width, v.height)
            //     // console.log("v:",v)
            //     return size
            //     }).ofObject("main"),
            // ),
            this.getShiHalfEllipseShape(),
            this.getXuHalfEllipseShape(),
            // $(go.Adornment,
            // { locationSpot: go.Spot.Top },
            // $(go.Shape, "BpmnActivityLoop",
            //   { width: 12, height: 12, cursor: "pointer",
            //     background: "transparent", stroke: "dodgerblue", strokeWidth: 2 })
            // ),
            // ),

            // $(go.Panel,"Spot",{
            //   stretch: go.GraphObject.Uniform,
            //   background:"gray",
            //   // locationSpot: go.Spot.LeftCenter,
            //   alignment: go.Spot.Right,
            //   // strokeDashArray: [10, 5],
            //   alignmentFocus: go.Spot.Left,
            // },
            //   this.getTailXuShape(),
            //   this.getTailShiShape(),
            // ),

            // this.getUpHalfEllipseShape(),
            this.getTextBuild()
        )
    }
}

module.exports = WaveNodeTemplate
// export default WaveNodeTemplate
