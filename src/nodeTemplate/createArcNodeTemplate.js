var $ = go.GraphObject.make
var svg = require('../datas/svg.template');

// 返回svg节点
module.exports = function createArcNodeTemplate (diagram) {
    var properties = {
        figure: "Circle",
        fill: "white",
        strokeWidth: 2,
        stroke: "black",
        fontSize: 15,
        font: "sans-serif"
    };
    return $(go.Node, "Spot",{
                name: "NODE",
                "_controlExpand": true,
                layerName: "Background",
                locationSpot: go.Spot.Center,
                resizeCellSize: new go.Size(10, 10),
                locationObjectName: "SHAPE",
                resizable: true,
                resizeObjectName: "SHAPE", // user can resize the Shape
                rotatable: true,
                rotateObjectName: "SHAPE", // rotate the Shape without rotating the label
                click: function(e, node){
                    // console.log(node.data);
                },
                doubleClick: function (e, node) {
                    doubleClickCreateNodeType(e);
                },
                selectable: true,
                selectionObjectName:"SHAPE",
                movable: true,
                angle: 0,
                //toMaxLinks: 1,
                layoutConditions: go.Part.LayoutStandard,
                //layoutConditions:~go.Part.LayoutAdded,
                // fromLinkable: true, toLinkable: true,
                alignment: go.Spot.Center,
                alignmentFocus: go.Spot.Center,
                resizeAdornmentTemplate: diagram.__trtd.nodeResizeAdornmentTemplate(),
                // rotateAdornmentTemplate: nodeRotateAdornmentTemplate,
                contextMenu: $(go.Adornment),
                // contextMenu: $(go.Adornment),
            },
            new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
            $(go.Shape, {
                name: "SHAPE",
                // geometryString: "M 0,0 a50,50 0 1,1 100,0",
                // geometryString: "M 0 50 L 100 100 L 100 200",
                fill: "white",
                strokeWidth: 3, 
                stroke: "black",
                minSize: new go.Size(50, 50),
                },
                new go.Binding("fill", "fill").makeTwoWay(function(v){
                    return v;
                }),
                new go.Binding("stroke", "stroke").makeTwoWay(function(v){
                    return v;
                }),
                new go.Binding("strokeWidth", "strokeWidth").makeTwoWay(function(v){
                    return v;
                }),
                new go.Binding("desiredSize", "desiredSize", function(v) {
                    // var va = (v / 2) * Math.sqrt(2);
                    // console.log("desiredSize",v)
                    return v
                }).ofObject("BACKGROUND"),
                new go.Binding("angle", "angle", function(v) {
                    // var va = (v / 2) * Math.sqrt(2);
                    // console.log("desiredSize",v)
                    return v
                }).ofObject("BACKGROUND"),
                new go.Binding("geometryString", "geometryString", function(v) {
                    return v;
                }),
            ),
            $(go.Shape, "Rectangle",{
                name: 'BACKGROUND',
                fill: "rgba(1,1,1,0)",
                // width: 450,
                // height: 450,
                angle: 0,
                stroke: "rgba(1,1,1,0)",
                // minSize: new go.Size(50, 50),
                },
                new go.Binding("desiredSize", "desiredSize", function(v, d) {
                    // console.log("vd m", v, d )
                    if(!v) return d.part.findObject("SHAPE").measuredBounds.size;
                    return go.Size.parse(v)
                }).makeTwoWay(function(v) {
                    return go.Size.stringify(v)
                }),
                // new go.Binding("angle", "angle").makeTwoWay(function(v){
                //     return v;
                // }),
                // new go.Binding("desiredSize", "height", function(v) {
                //     var radius = parseInt(v ? v : 100);
                //     var size = new go.Size(radius, radius);
                //     return size;
                // }).makeTwoWay(function(v) {
                //     return v.height;
                // }),
                // background: "#555",
                // stroke: "red"}
            ),
    );
}

function doubleClickCreateNodeType(e){
    // console.log('eeeeeeeeeeeeeee:', e);
    var myDiagram = e.diagram;
    myDiagram.startTransaction();
    var text = { text: "双击编辑文本", category: 'text' };
    text.loc = go.Point.stringify(myDiagram.lastInput.documentPoint);
    myDiagram.model.addNodeData(text);
    myDiagram.commitTransaction()
}