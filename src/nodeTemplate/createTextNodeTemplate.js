var $ = go.GraphObject.make;

module.exports = function createTextNodeTemplate (diagram) {
    var properties = {
        figure: "Rectangle",
        fill: "rgba(0,0,0,0)",
        strokeWidth: 1,
        stroke: "rgba(0,0,0,0)",
        fontSize: 15,
        font: "sans-serif"
    };
    return $(go.Node, "Spot", {
            "_controlExpand": true,
            layerName: "Foreground",
            movable: true,
            locationSpot: go.Spot.Center,
            resizeCellSize: new go.Size(10, 10),
            locationObjectName: "SHAPE",
            resizable: true,
            resizeObjectName: "SHAPE", // user can resize the Shape
            rotatable: true,
            location: new go.Point(0, 0),
            //rotateObjectName: "SHAPE",  // rotate the Shape without rotating the label
            // doubleClick: selectText,
            toMaxLinks: 1,
            layoutConditions: go.Part.LayoutStandard,
            //layoutConditions:~go.Part.LayoutAdded,
            // fromLinkable: true, toLinkable: true,
            alignment: go.Spot.Center,
            alignmentFocus: go.Spot.Center,
            contextMenu: $(go.Adornment),
            doubleClick: function (e, node){
                e.diagram.__trtd.selectText(e, node)
            }

            // selectionAdornmentTemplate: nodeSelectionAdornmentTemplate,
        },
        new go.Binding("locationSpot", "locationSpot", function(v){
            console.log("locationSpot1")
            return go.Spot.parse(v)
        }).makeTwoWay(function(v){
            console.log("locationSpot2")
            return go.Spot.stringify(v)
        }),
        new go.Binding("deletable", "deletable").makeTwoWay(),
        new go.Binding("movable", "movable").makeTwoWay(),
        new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
        new go.Binding("isShadowed", "isShadowed").makeTwoWay(),
        new go.Binding("angle", "angle").makeTwoWay(),
        new go.Binding("selectable", "selectable").makeTwoWay(),
        new go.Binding("layerName", "layerName", function(v, d) {
            return v ? v : "";
        }).makeTwoWay(function(v) {
            return v;
        }),
        $(go.Shape, {
                strokeDashArray: null,
                // strokeDashOffset:10,
                name: "SHAPE",
                figure: "Rectangle",
                fill: "rgba(0,0,0,0)",
                fromLinkable: true,
                toLinkable: true,
                cursor: "pointer",
                minSize: new go.Size(50, 50),
                strokeWidth: 2,
                stroke: "rgba(0,0,0,0)",
                portId: "",
                width:150
            },
            new go.Binding("strokeDashArray", "strokeDashArray", function(v) {
                return [v.split()[0], v.split()[1]];
            }).makeTwoWay(function(v) {
                return v[0] + " " + v[1];
            }), //保留，设置边线样式
            new go.Binding("fill", "fill", function(v, obj) {
                return v instanceof go.Brush ? v.color : v;
            }).makeTwoWay(),
            // new go.Binding("fill", "isSelected", function(s, obj) { return s ? "red" : obj.part.data.color; }).ofObject()),
            new go.Binding("width", "width", function(v) {
                //alert(v);
                return v;
            }).makeTwoWay(function(v) {
                return v;
            }),
            new go.Binding("height", "height", function(v) {
                //alert(v);
                return v;
            }).makeTwoWay(function(v) {
                return v;
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
                fill: "rgba(0,0,0,0)",
                // fromLinkable: true,
                // toLinkable: true,
                strokeWidth: 0
            },
            new go.Binding("width", "width", function(v) {
                return v;
            }).ofObject("SHAPE"),
            new go.Binding("height", "height", function(v) {
                return v;
            }).ofObject("SHAPE")
        ),
        $(go.TextBlock, {
                name: "TEXT",
                alignment: new go.Spot(0.5, 0.5),
                font: "bold 18px 幼圆",
                editable: true,
                //margin: 3, editable: true,
                stroke: "black",
                isMultiline: true,
                overflow: go.TextBlock.OverflowClip,
                wrap: go.TextBlock.WrapDesiredSize,
                textAlign: "center",
                // verticalAlignment: go.Spot.Bottom,
                spacingAbove: 4,
                spacingBelow: 4,
                portId: "TEXT",
                stretch: go.GraphObject.Fill
            },
            new go.Binding("textAlign", "textAlign", function(v) {
                return _.contains(['start', 'center', 'end'], v) ? v : "center";
            }).makeTwoWay(),
            new go.Binding("spacingAbove", "spacingline", function(v) {
                return helpers.tdTransToNum(v, 4);
            }).makeTwoWay(),
            new go.Binding("spacingBelow", "spacingline", function(v) {
                return helpers.tdTransToNum(v, 4);
            }).makeTwoWay(),
            new go.Binding("width", "width", function(v) {
                return v;
            }).ofObject("SHAPE"),
            // new go.Binding("height", "height", function (v) {
            //   return v;
            // }).ofObject("SHAPE"),
            new go.Binding("text", "text").makeTwoWay(),
            new go.Binding("stroke", "textStroke").makeTwoWay(),
            new go.Binding("font", "font").makeTwoWay()
        )
    );
}