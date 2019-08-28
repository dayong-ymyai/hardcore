var $ = go.GraphObject.make
var svg = require('../datas/svg.template');


function makeWave(tx, ty, curviness, repeat) {
    // if (curviness === 0) {
    //   var geo = new go.Geometry(go.Geometry.Line);
    //   geo.startX = 0;
    //   geo.startY = 0;
    //   geo.endX = tx;
    //   geo.endY = ty;
    //   return geo;
    // }
    if(tx == null) tx = 300;
    if(ty == null) ty = 400;
    if(!repeat) repeat = 1
    var ang = go.Point.direction(0, 0, tx, ty);
    var rad = (ang / 180 * Math.PI) + Math.PI/2;
    var offx = curviness * Math.cos(rad);
    var offy = curviness * Math.sin(rad);
    var geo = new go.Geometry();
    var sx = tx/repeat; var sy = ty/repeat;
    var x = 0; var y = 0;
    var fig = new go.PathFigure(x, y, false);
    for (var i = 0; i < repeat; i++) {
      var odd = (i % 2 === 1);
      fig.add(new go.PathSegment(go.PathSegment.Bezier,
                                  x + sx, y + sy,
                                  x + offx * (odd ? -1 : 1), y + offy * (odd ? -1 : 1),
                                  x + sx + offx * (odd ? -1 : 1), y + sy + offy * (odd ? -1 : 1)));
      x += sx;
      y += sy;
    }
    geo.add(fig);
    return geo;
  }

  function computeGeo1(data, shape, curviness) {
    // var curviness = 30;
    if(!curviness) curviness = 30;
    // if (shape.stroke === "red") curviness = -30;
    // else if (shape.stroke === "green") curviness = 0;
    var geo = makeWave(data.x, data.y, curviness, data.repeat);
    var offset = geo.normalize();
    shape.position = new go.Point(-offset.x, -offset.y);
    shape.isGeometryPositioned = true;
    return geo;
  }

  function computeGeo(data, shape){
    return go.Geometry.parse("M 0,80 A100,80 0 1 1 200,80")
  }
  function computeGeo2(data, shape){
    var geo =  go.Geometry.parse("M 0,80 A100,80 0 1 0 200,80")
    shape.isGeometryPositioned = true
    shape.position = new go.Point(-100, -100)

    return geo;
  }

// 返回svg节点
module.exports = function createWaveNodeTemplate (diagram) {
    var properties = {
        figure: "Circle",
        fill: "white",
        strokeWidth: 2,
        stroke: "black",
        fontSize: 15,
        font: "sans-serif"
    };
    // console.log("createWaveNodeTemplatecreateWaveNodeTemplatecreateWaveNodeTemplate")
    // return $(go.Node,
    //     {
    //         click:()=>{
    //             console.log("createWaveNodeTemplate click")
    //         }            
    //     },
    //     $(go.Shape, { stroke: "green" },
    //       new go.Binding("geometry", "", computeGeo)),
    //     $(go.Shape, { stroke: "blue" },
    //       new go.Binding("geometry", "", computeGeo)),
    //     $(go.Shape, { stroke: "red", strokeDashArray: [10, 10] },
    //       new go.Binding("geometry", "", computeGeo))
    //   );

    return $(go.Node, "Spot",{
                name: "NODE",
                "_controlExpand": true,
                layerName: "Background",
                locationSpot: go.Spot.Center,
                // resizeCellSize: new go.Size(10, 10),
                locationObjectName: "BACKGROUND",
                resizable: true,
                resizeObjectName: "BACKGROUND", // user can resize the Shape
                rotatable: true,
                rotateObjectName: "BACKGROUND", // rotate the Shape without rotating the label
                click: function(e, node){
                    // console.log(node.data);
                },
                doubleClick: function (e, node) {
                    doubleClickCreateNodeType(e);
                },
                selectable: true,
                // selectionObjectName:"SHAPE",
                movable: true,
                // width: 200, height: 200,
                angle: 0,
                //toMaxLinks: 1,
                layoutConditions: go.Part.LayoutStandard & go.Part.LayoutNodeSized & go.Part.LayoutAdded & go.Part.LayoutNodeSized,
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
            $(go.Shape, "Rectangle",{
                name: 'BACKGROUND',
                fill: "rgba(1,1,1,0)",
                // width: 450,
                // height: 450,
                angle: 0,
                stroke: "rgba(1,1,1,1)",
                
                // minSize: new go.Size(50, 50),
                },
                new go.Binding("desiredSize", "desiredSize", function(v, d) {
                    // console.log("vd m", v, d )
                    // if(!v) return d.part.findObject("SHAPE").measuredBounds.size;
                    return go.Size.parse(v)
                }).makeTwoWay(function(v) {
                    return go.Size.stringify(v)
                }),
            ),
            // $(go.Shape, { stroke: "green" },
            //     new go.Binding("geometry", "", computeGeo),
            //     new go.Binding("stroke", "stroke").makeTwoWay(function(v){
            //         return v;
            //     }),
            //     new go.Binding("strokeWidth", "strokeWidth").makeTwoWay(function(v){
            //         return v;
            //     }),
            // ),M 0 0 A80,60 0 1 0 160,0
            // $(go.Panel, "Vertical",{
            //     alignment: go.Spot.Center,
            //     stretch: go.GraphObject.Fill,
            //     },
            //     new go.Binding("desiredSize", "desiredSize", function(v) {
            //         return v
            //     }).ofObject("BACKGROUND"),
                $(go.Shape, { 
                    name:"UP",
                    stroke: "blue", 
                    // geometryString:"M 0,80 A100,80 0 1 1 200,80",
                    position:new go.Point(0, 0),
                    isGeometryPositioned: true,
                    alignment: go.Spot.Center,
                    stretch: go.GraphObject.Fill
                },
                    new go.Binding("geometry", "", computeGeo),
                    new go.Binding("stroke", "stroke1").makeTwoWay(function(v){
                        return v;
                    }),
                    new go.Binding("strokeWidth", "strokeWidth").makeTwoWay(function(v){
                        return v;
                    }),
                    // new go.Binding("desiredSize", "desiredSize", function(v, d) {
                    //     // console.log("vd m", v, d )
                    //     // if(!v) return d.part.findObject("SHAPE").measuredBounds.size;
                    //     return go.Size.parse(v)
                    // }).makeTwoWay(function(v) {
                    //     return go.Size.stringify(v)
                    // }),
                ),
                $(go.Shape, { 
                    name:"DOWN",
                    stroke: "red", 
                    // geometryString:"M 0,0 A100,80 0 1 0 200,0", 
                    alignment: go.Spot.Center,
                    strokeDashArray: [10, 10],
                    isGeometryPositioned: true,
                    position:new go.Point(-100, -100),
                    stretch: go.GraphObject.Fill,
                 },

                    // new go.Binding("geometry", "", computeGeo),
                    new go.Binding("geometry", "", computeGeo2),
                    new go.Binding("stroke", "stroke2").makeTwoWay(function(v){
                        return v;
                    }),
                    new go.Binding("strokeWidth", "strokeWidth").makeTwoWay(function(v){
                        return v;
                    })
                ),

                    // new go.Binding("desiredSize", "desiredSize", function(v, d) {
                    //     // console.log("vd m", v, d )
                    //     // if(!v) return d.part.findObject("SHAPE").measuredBounds.size;
                    //     return go.Size.parse(v)
                    // }).makeTwoWay(function(v) {
                    //     return go.Size.stringify(v)
                    // }),
                // )
            
            // $(go.Shape, {
            //     name: "SHAPE",
            //     // geometryString: "M 0,0 a50,50 0 1,1 100,0",
            //     // geometryString: "M 0 50 L 100 100 L 100 200",
            //     fill: "white",
            //     strokeWidth: 3, 
            //     stroke: "black",
            //     minSize: new go.Size(50, 50),
            //     },
            //     new go.Binding("fill", "fill").makeTwoWay(function(v){
            //         return v;
            //     }),
            //     new go.Binding("stroke", "stroke").makeTwoWay(function(v){
            //         return v;
            //     }),
            //     new go.Binding("strokeWidth", "strokeWidth").makeTwoWay(function(v){
            //         return v;
            //     }),
            //     new go.Binding("desiredSize", "desiredSize", function(v) {
            //         // var va = (v / 2) * Math.sqrt(2);
            //         // console.log("desiredSize",v)
            //         return v
            //     }).ofObject("BACKGROUND"),
            //     new go.Binding("angle", "angle", function(v) {
            //         // var va = (v / 2) * Math.sqrt(2);
            //         // console.log("desiredSize",v)
            //         return v
            //     }).ofObject("BACKGROUND"),
            //     new go.Binding("geometryString", "geometryString", function(v) {
            //         return v;
            //     }),
            // ),
            // $(go.Shape, "Rectangle",{
            //     name: 'BACKGROUND',
            //     fill: "rgba(1,1,1,0)",
            //     // width: 450,
            //     // height: 450,
            //     angle: 0,
            //     stroke: "rgba(1,1,1,0)",
            //     // minSize: new go.Size(50, 50),
            //     },
            //     new go.Binding("desiredSize", "desiredSize", function(v, d) {
            //         // console.log("vd m", v, d )
            //         if(!v) return d.part.findObject("SHAPE").measuredBounds.size;
            //         return go.Size.parse(v)
            //     }).makeTwoWay(function(v) {
            //         return go.Size.stringify(v)
            //     }),
            //     // new go.Binding("angle", "angle").makeTwoWay(function(v){
            //     //     return v;
            //     // }),
            //     // new go.Binding("desiredSize", "height", function(v) {
            //     //     var radius = parseInt(v ? v : 100);
            //     //     var size = new go.Size(radius, radius);
            //     //     return size;
            //     // }).makeTwoWay(function(v) {
            //     //     return v.height;
            //     // }),
            //     // background: "#555",
            //     // stroke: "red"}
            // ),
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