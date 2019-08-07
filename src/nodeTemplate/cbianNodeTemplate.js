

var $ = go.GraphObject.make;
var Base = require('./base')
var helpers = require('../helpers/helpers.gojs')
  
function computeNewRotateLoc(rotateCenter,currentLoc, angle){
    if(rotateCenter.equals(currentLoc)) return currentLoc
    // 计算选择中心点到（0,0）点的偏移
    var offset = new go.Point(0,0).subtract(rotateCenter.copy())
    // 将原来的点偏移到相对0,0点的位置
    var nodeOrigin = currentLoc.copy().offset(offset.x, offset.y)
    var newNodeOrigin = nodeOrigin.rotate(angle)
    var newNodeLoc = newNodeOrigin.copy().offset(-offset.x, -offset.y)
    return newNodeLoc
// console.log("newNodeLoc", newNodeLoc)
}
  

class CBianNodeTemplate extends Base {
    constructor(options){
        super(options)
        // this.nodeProperties = {}
        
    }

    

    makeGeoWave(data, shape, options) {
      // this is much more efficient than calling go.GraphObject.make:
      var {radiusX=150,radiusY=100} = data
      radiusX = shape.part.findObject("main").width/2
      radiusY = shape.part.findObject("main").height/2
      // console.log("makeGeo999999999999999999999999999",radiusX,radiusY)
      var seg = new go.PathSegment(go.PathSegment.QuadraticBezier,
        radiusX*2, 0, //describe the end point
        radiusX, radiusY*(options.clockwiseFlag?-1:1), // describe the only control point
      // radiusX*2,0,radiusX, radiusY,0,1,options.clockwiseFlag?1:0
          )

          if(data.role == "waveTail"){


            seg = new go.PathSegment(go.PathSegment.QuadraticBezier,
              radiusX, radiusY*(options.clockwiseFlag?-1:1), //describe the end point
              radiusX/2, radiusY*(options.clockwiseFlag?-1:1), // describe the only control point
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
      var geo =  new go.Geometry()
        .add(new go.PathFigure(0, 0)  // start point
          .add(seg)
          )
          geo.defaultStretch = go.GraphObject.None;
          return geo;
    }

    getShiHalfEllipseShape(){
      return $(go.Shape, {name:"XU", 
      strokeWidth:2,
      stroke: "#cb1c27", fill:"rgba(0,66,0,0)",
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
          new go.Binding("geometry", "", (data, shape)=>{
            var clockwiseFlag = 0;
            if(data.order%2 == 0){
              clockwiseFlag = 1;
            }
            if(data.flip){
              // clockwiseFlag = 1;
            }
            // console.log(`data.oliveType: ${data.oliveType}`)
            if(data.oliveType == "Ellipse"){
              // console.log(``)
              return this.makeGeo(data, shape, {clockwiseFlag:clockwiseFlag})
            }
            return this.makeGeoWave(data, shape, {clockwiseFlag:clockwiseFlag})
          }),
          new go.Binding("stroke", "shiStroke").makeTwoWay(),
          
          new go.Binding("desiredSize", "desiredSize", function(v) {
                var size = new go.Size(v.width, v.height/2)
                // console.log("v:",v)
                return size
            }).ofObject("main")
        )
    }

    getNodeSelectionAdornmentTemplate(){
      return $(go.Adornment, "Spot",
      {
        // isShadowed: true,
      },
          $(go.Panel, "Auto",
              $(go.Shape, { 
                isPanelMain: true,
                 fill: null, 
                 stroke: "dodgerblue", strokeWidth: 2 },
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
                      $(go.Shape, { fill: "#FFFFCC" }),
                      $(go.TextBlock, { textAlign: 'center', margin: new go.Margin(8, 4, 4, 4) }, // the tooltip shows the result of calling nodeInfo(data)
                          new go.Binding("text", "", function(d) {
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
              $(go.Shape, "PlusLine", { stroke: '#770077', desiredSize: new go.Size(25, 25) })
          ),

          $("Button", {
                  name: "AddLevel",
                  toolTip: $(go.Adornment, "Auto",
                      $(go.Shape, { fill: "#FFFFCC" }),
                      $(go.TextBlock, { textAlign: 'center', margin: new go.Margin(8, 4, 4, 4) }, // the tooltip shows the result of calling nodeInfo(data)
                          new go.Binding("text", "", function(d) {
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
              $(go.Shape, "PlusLine", { stroke: "#227700", desiredSize: new go.Size(15, 15) }),
              new go.Binding("visible", "level", function(level) {
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

    getEllipse(){

      return $(go.Shape, {
        figure: "Ellipse",
        stroke: "#cb1c27",
        stretch: go.GraphObject.Uniform,
        alignment: go.Spot.Center,
        alignmentFocus: go.Spot.Center,
      },
      new go.Binding("desiredSize", "desiredSize", function(v) {
        var size = new go.Size(v.width, v.height)
        // console.log("v:",v)
        return size
    }).ofObject("main")
    )

      return $(go.Shape, {name:"XU", 
      strokeWidth:2,
      stroke: "#cb1c27", fill:"rgba(0,66,0,0)",
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
          new go.Binding("geometry", "", (data, shape)=>{
            var clockwiseFlag = 0;
            if(data.order%2 == 0){
              clockwiseFlag = 1;
            }
            if(data.flip){
              // clockwiseFlag = 1;
            }
            // console.log(`data.oliveType: ${data.oliveType}`)
            return this.makeGeo(data, shape, {clockwiseFlag:clockwiseFlag})
            if(data.oliveType == "Ellipse"){
              // console.log(``)
            }
            return this.makeGeoWave(data, shape, {clockwiseFlag:clockwiseFlag})
          }),
          new go.Binding("stroke", "stroke").makeTwoWay(),
          
          new go.Binding("desiredSize", "desiredSize", function(v) {
                var size = new go.Size(v.width, v.height/2)
                // console.log("v:",v)
                return size
            }).ofObject("main")
        )
    }

    makeGeo(data, shape, angle) {
      console.log("makeGeomakeGeo")
      var param1 = shape ? shape.parameter1 : NaN;
      var w = shape.part.findObject("main").width
      var h = shape.part.findObject("main").height
      w = 200
      h = 6
      if (isNaN(param1)) param1 = .1;  // Distance the arrow folds from the right
      var geo = new go.Geometry()
      var fig = new go.PathFigure(0, 0, false)
      fig.add(new go.PathSegment(go.PathSegment.Line, w, 0))
      // fig.close()
      // fig.add(new go.PathSegment(go.PathSegment.Line, (1 - param1) * w, h))
      // fig.add(new go.PathSegment(go.PathSegment.Move, 0, .5 * h))
      // fig.add(new go.PathSegment(go.PathSegment.Line, w, .5 * h))
      geo.add(fig)
      var fig2 = new go.PathFigure(w-10, 0, true)
      fig2.add(new go.PathSegment(go.PathSegment.Line, w-14,-8))
      fig2.add(new go.PathSegment(go.PathSegment.Line, w,0))
      fig2.add(new go.PathSegment(go.PathSegment.Line,w-14, 8).close())
      geo.add(fig2)
      // geo.setSpots(0.5, 0.5,0.5,0.5);
      // geo.normalize()
      // geo.rotate(angle)
      // geo.defaultStretch = go.GraphObject.Fill;
      return geo;
      // this is much more efficient than calling go.GraphObject.make:
      var {radiusX=150,radiusY=100} = data
      radiusX = shape.part.findObject("main").width/2
      radiusY = shape.part.findObject("main").height/2
      // console.log("makeGeo999999999999999999999999999",radiusX,radiusY)
      var geo =  new go.Geometry()
        .add(new go.PathFigure(0, 0)  // start point
          .add(new go.PathSegment(go.PathSegment.SvgArc,
          radiusX*2,0,radiusX, radiusY,0,1,options.clockwiseFlag?1:0
              )
            )
          )
          // geo.defaultStretch = go.GraphObject.Fill;
          return geo;
    }

    getLine(angle){
      return $(go.Panel, "Spot",
      {
        angle: angle,
        position: new go.Point(0,0)
      },
        $(go.Shape, 'LineH', {
        // name: "SHAPE",
        alignment: go.Spot.Left,alignmentFocus: go.Spot.Left,
        stretch: go.GraphObject.Horizontal,
        strokeCap: "round",
        // geometryString: "M 0,0 a50,50 0 1,1 100,0",
        // geometryString: "M 0 50 L 100 100 L 100 200",
        // margin: 10,
        width: 200,
        height:1,
        margin:0,
        fill: "red",
        strokeWidth: 1, 
        stroke: "red",
        // minSize: new go.Size(NaN, 10),
        // maxSize: new go.Size(NaN, 20)
        },
      ),
      $(go.Shape, {
        name: "Arrow",
        visible: true,
        margin:0,
        alignment: new go.Spot(1,0.5,5,0),
         alignmentFocus: go.Spot.Right,
        geometryString: "F M 158,-4 l 8,4 -8,4 2,-4 z",
        strokeCap: "round",
        // geometryString: "M 0 50 L 100 100 L 100 200",
        fill: "black",
        width:20,
        height:15,

        strokeWidth: 3, 
        stroke: "black",
        // minSize: new go.Size(50, 50),
        },
      )
    ) 

     return  $(go.Shape, 
        {
          // figure:"lineH",
          // locationSpot: go.Spot.LeftCenter,
          position: new go.Point(0,0),
          angle:angle,
          // isGeometryPositioned: true,
          width: 200, 
          height: 200,
          strokeCap: "round",
          strokeWidth:3,
          stroke: "#cb1c27", fill:"#cb1c27",
          // background: "red",
          // stretch: go.GraphObject.None,
          alignment: new go.Spot(0,1,0,0),
          alignmentFocus: new go.Spot(0,0,0,0),
        },
        // new go.Binding("alignment", "", (data, shape)=>{
        //   var main = shape.part.findObject("main")
        //   return new go.Spot(0,0,-main.width/2,main.height/2)
        // }),
        new go.Binding("geometry", "", (data, shape)=>{
          return this.makeGeo(data, shape, angle)
        }),
        new go.Binding("desiredSize", "desiredSize", function(v) {
          var size = new go.Size(200, 1)
          // console.log("v:",v)
          return size
        }).ofObject("main")
      )
    }

    getNodeTemplate(){
      var diagram = this.diagram
      var that = this;
      return $(go.Node,"Position",{
        // isClipping: true,
        layerName: "overflow",
        zOrder:5,
        movable: false,
        resizable: false,
        locationSpot: new go.Spot(0,1,0,0),
        // roateSpot
        // locationObjectName: "main",
        resizeObjectName: "main",
        selectionObjectName: "main",
        rotatable: false,
        layoutConditions: go.Part.LayoutStandard & go.Part.LayoutRemoved & go.Part.LayoutAdded & go.Part.LayoutNodeSized,
        // locationSpot: go.Spot.LeftCenter,
    
      contextMenu: $(go.Adornment),

        // selectionAdornmentTemplate: this.getNodeSelectionAdornmentTemplate(),

      },
      this.binding,
      $(go.Panel,"Spot"),
        $(go.Shape, "Rectangle",
        { name:"main",fill: "rgba(0,0,0,0)", stroke: "green", width: 200, height: 200,
        // locationSpot:new go.Spot(0,1)
        alignment: new go.Spot(0,1),
        // location: new go.Point(0,0)
      },
          new go.Binding("fill", "fill").makeTwoWay(),
          // new go.Binding("fill", "fill").makeTwoWay(),
          new go.Binding("desiredSize", "desiredSize", function(v, d) {
              // console.log("vd m", v, d )
              // if(!v) return d.part.findObject("SHAPE").measuredBounds.size;
              return go.Size.parse(v)
          }).makeTwoWay(function(v) {
              return go.Size.stringify(v)
          }),
        ),
        that.getLine(0),
        that.getLine(90),
        that.getLine(45),
        // that.getLine(0),
        // that.getLine(-30)
      )
    }
}

module.exports = CBianNodeTemplate
