var $ = go.GraphObject.make;

module.exports = // 返回天盘模板
function createNodeTemplate (diagram) {
    var properties = {
        figure: "Circle",
        fill: "white",
        strokeWidth: 2,
        stroke: "black",
        fontSize: 15,
        font: "sans-serif"
    };

    return $(go.Node, "Spot", {
        "_controlExpand": true,
        layerName: "default",
        locationSpot: go.Spot.Center,
        resizeCellSize: new go.Size(10, 10),
        locationObjectName: "SHAPE",
        resizable: true,
        resizeObjectName: "SHAPE", // user can resize the Shape
        rotatable: false,
        location: new go.Point(0, 0),
        click: function(e, node) {
            console.log(node.data)
            if(node.diagram.__trtd.nodeClickListener){
                node.diagram.__trtd.nodeClickListener(node)
            }
            // showNodeToolBar(e,node);
        },
        //rotateObjectName: "SHAPE",  // rotate the Shape without rotating the label
        doubleClick: function (e, node){
            e.diagram.__trtd.selectText(e, node)
        },
        toMaxLinks: 1,
        layoutConditions: go.Part.LayoutStandard,
        //layoutConditions:~go.Part.LayoutAdded,
        // fromLinkable: true, toLinkable: true,
        alignment: go.Spot.Center,
        alignmentFocus: go.Spot.Center,
        resizeAdornmentTemplate: diagram.__trtd.nodeResizeAdornmentTemplate(),
        // contextMenu: $(go.Adornment),
        contextMenu: $(go.Adornment),
        selectionAdornmentTemplate: diagram.__trtd.getNodeSelectionAdornmentTemplate(),
        mouseOver: function(e, node) {
            // if(node.data.hyperlink){
            //   var textObj = node.findObject('TEXT');
            //   textObj.isUnderline = true;
            // }

            diagram.__trtd.showNodeRemarkTips(e, node);
        },
        mouseLeave: function(e, node) {
            // if(node.data.hyperlink) {
            //   var textObj = node.findObject('TEXT');
            //   textObj.isUnderline = false;
            // }
            diagram.__trtd.removeNodeRemarkTips();
        },
        mouseDragEnter: function(e, obj) {
            var node = obj.part;
            var selnode = e.diagram.selection.first();
            if (!(selnode instanceof go.Node) || selnode.category == "3" || selnode.category == "text" || selnode.key == 1) {
                return;
            }
            //var sat = node.selectionAdornmentTemplate;
            //var adorn = sat.copy();
            //adorn.adornedObject = node;
            //node.addAdornment("dragEnter", adorn);

            //if (!mayWorkFor(selnode, node)) return;
            var shape = node.findObject("SHAPE");
            if (shape) {
                shape._prevFill = shape.fill; // remember the original brush
                shape.fill = "darkred";
            }

        },
        mouseDragLeave: function(e, obj) {
            var node = obj.part;
            var shape = node.findObject("SHAPE");
            if (shape && shape._prevFill) {
                shape.fill = shape._prevFill; // restore the original brush
            }
            //node.removeAdornment("dragEnter");
        },
        mouseDrop: function(e, obj) {
            var node = obj.part;
            var selnode = e.diagram.selection.first();
            if (!(selnode instanceof go.Node) || selnode.data.category == "3" || selnode.data.category == "text" || selnode.data.key == 1) {
                return;
            }

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
        }},
        new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
        new go.Binding("isShadowed", "isShadowed").makeTwoWay(),
        new go.Binding("selectable", "selectable").makeTwoWay(),
        new go.Binding("movable", "movable").makeTwoWay(),
        new go.Binding("deletable", "deletable").makeTwoWay(),
        $(go.Shape, {
                strokeDashArray: null,
                // strokeDashOffset:10,
                name: "SHAPE",
                figure: "Circle",
                fill: "rgba(0,0,0,0)",
                fromLinkable: true,
                toLinkable: true,
                cursor: "pointer",
                minSize: new go.Size(50, 50),
                strokeWidth: 2,
                stroke: "black",
                portId: ""

            },
            new go.Binding("strokeDashArray", "strokeDashArray", function(v) {
                try {
                    var val = [parseInt(v.split(" ")[0]), parseInt(v.split(" ")[1])];
                } catch (e) {
                    var val = null;
                }
                return val;
            }).makeTwoWay(function(v) {
                return v[0] + " " + v[1];
            }), //保留，设置边线样式
            new go.Binding("fill", "fill", function(v, obj) {
                return v instanceof go.Brush ? v.color : v;
            }).makeTwoWay(),
            // new go.Binding("fill", "isSelected", function(s, obj) { return s ? "red" : obj.part.data.color; }).ofObject()),
            new go.Binding("desiredSize", "radius", function(v) {
                //alert(v);
                var radius = parseInt(v ? v : 100);
                var size = new go.Size(radius, radius);
                return size;
            }).makeTwoWay(function(v) {
                return v.width;
            }),
            new go.Binding("stroke", "stroke", function(v) {
                return v instanceof go.Brush ? v.stroke : v;
            }).makeTwoWay(),

            new go.Binding("strokeWidth", "strokeWidth", function(d) {
                return d;
            }).makeTwoWay(function(d) {
                return d;
            }),
            new go.Binding("figure", "figure").makeTwoWay(), {
                figure: properties.figure,
                fill: properties.fill,
                strokeWidth: properties.strokeWidth,
                stroke: properties.stroke
            }
        ),
        $(go.Shape, {
                name: "SHAPE_Back",
                figure: "Rectangle",
                fill: "rgba(128,128,128,0)",
                fromLinkable: true,
                toLinkable: true,
                strokeWidth: 0
            },
            new go.Binding("desiredSize", "width", function(v) {
                var va = (v / 2) * Math.sqrt(2);
                return new go.Size(va - 3, va - 3);
            }).ofObject("SHAPE")
        ),
    
        $(go.Panel, "Table",
            $(go.RowColumnDefinition, { column: 0, width: 0 }
                // new go.Binding('width','hyperlink',function(v){
                //   return v?10:0;
                // })
            ),
            $(go.Shape, 'Rectangle', {
                row: 0,
                column: 0,
                // width:10,
                fill: 'rgba(0,255,0,0)',
                strokeWidth: 0
            }),
            $(go.Panel, "Auto", { row: 1, column: 0 },
                $(go.Shape, "RoundedRectangle", { fill: "rgba(0,0,0,0)", strokeWidth: 0 }),
                $(go.Picture, {
                        alignment: go.Spot.Left,
                        click: function(e) {
                            alert('picture clicked');
                        },
                        name: 'Picture',
                        // source: 'media/images/Katong/little-boy-black.png',
                        desiredSize: new go.Size(10, 10)
                    }

                    // new go.Binding("source", "key", findHeadShot)
                )
            ),
            $(go.Shape, 'Rectangle', {
                row: 2,
                column: 0,
                // width:10,
                fill: 'rgba(0,0,0,0)',
                strokeWidth: 0
            }),
            $(go.Panel, "Auto", { row: 0, column: 1, rowSpan: 3 },
                $(go.TextBlock, {
                        // stretch: go.GraphObject.Vertical,
                        name: "TEXT",
                        alignment: new go.Spot(0.5, 0.5),
                        font: "bold 18px 幼圆",
                        // editable: true,
                        //margin: 3, editable: true,
                        stroke: "black",
                        isMultiline: true,
                        overflow: go.TextBlock.OverflowClip,
                        wrap: go.TextBlock.WrapDesiredSize,
                        textAlign: "center",
                        spacingAbove: 4,
                        spacingBelow: 4,
                        portId: "TEXT",
                        stretch: go.GraphObject.Fill,
                        click: function(e, node) {

                        }
                    },
                    new go.Binding("textAlign", "textAlign", function(v) {
                        return _.contains(['start', 'center', 'end'], v) ? v : "center";
                    }).makeTwoWay(),
                    new go.Binding("spacingAbove", "spacingline", function(v) {
                        return tdTransToNum(v, 4);
                    }).makeTwoWay(),
                    new go.Binding("spacingBelow", "spacingline", function(v) {
                        return tdTransToNum(v, 4);
                    }).makeTwoWay(),
                    new go.Binding("width", "width", function(v) {
                        var va = v / 2 * Math.sqrt(2);
                        return va;
                    }).ofObject("SHAPE"),
                    new go.Binding("text", "text").makeTwoWay(),
                    new go.Binding("stroke", "textStroke").makeTwoWay(),
                    new go.Binding("font", "font").makeTwoWay()
                )
            )
        )
    );
}