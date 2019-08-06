var $ = go.GraphObject.make;
var Base = require('./base')
var helpers = require('../helpers/helpers.gojs')
  

  

class WaveNodeTemplate extends Base {
    constructor(options){
        super(options)
        // this.nodeProperties = {}
        
    }

    makeGeo(data, shape, options) {
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
          geo.defaultStretch = go.GraphObject.Fill;
          return geo;
    }

    makeGeoWave(data, shape, options) {
      // this is much more efficient than calling go.GraphObject.make:
      var {radiusX=150,radiusY=100} = data
      radiusX = shape.part.findObject("main").width/2
      radiusY = shape.part.findObject("main").height/2
      // console.log("makeGeo999999999999999999999999999",radiusX,radiusY)
      var geo =  new go.Geometry()
        .add(new go.PathFigure(0, 0)  // start point
          .add(new go.PathSegment(go.PathSegment.QuadraticBezier,
            radiusX*2, 0, //describe the end point
            radiusX, radiusY*(options.clockwiseFlag?-1:1), // describe the only control point
          // radiusX*2,0,radiusX, radiusY,0,1,options.clockwiseFlag?1:0
              )
            )
          )
          geo.defaultStretch = go.GraphObject.Fill;
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
    getXuHalfEllipseShape(){
      return $(go.Shape, {name:"SHI", 
      strokeWidth:2,
      stroke: "#0e399d", fill:"rgba(0,66,0,0)",
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
          new go.Binding("geometry", "", (data, shape)=>{
            var clockwiseFlag = 1;
            if(data.order%2 == 0){
              clockwiseFlag = 0;
            }
            // if(data.flip){
            //   clockwiseFlag = 0;
            // }
            return this.makeGeoWave(data, shape, {clockwiseFlag:clockwiseFlag})
          }),
          new go.Binding("desiredSize", "desiredSize", function(v) {
                var size = new go.Size(v.width, v.height/2)
                // console.log("v:",v)
                return size
            }).ofObject("main")
        )
    }
    getTailShiShape(){
      return $(go.Shape, {name:"XU", 
      strokeWidth:2,
      stroke: "#cb1c27", fill:"rgba(0,66,0,0)",
        // background: "yellow",
        stretch: go.GraphObject.None,
        alignment:  go.Spot.Bottom,
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
            
            return this.makeGeoWave(data, shape, {clockwiseFlag:!clockwiseFlag})
          }),
          new go.Binding("stroke", "shiStroke").makeTwoWay(),
          
          new go.Binding("desiredSize", "desiredSize", function(v) {
                var size = new go.Size(v.width, v.height/2)
                // console.log("v:",v)
                return size
            }).ofObject("main")
        )
    }
    getTailXuShape(){
      return $(go.Shape, {name:"TailXu", 
      strokeWidth:2,
      stroke: "#0e399d", fill:"rgba(0,66,0,0)",
        // background: "gray",
        stretch: go.GraphObject.None,
        alignment:  go.Spot.Bottom,
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
          new go.Binding("geometry", "", (data, shape)=>{
            var clockwiseFlag = 1;
            if(data.order%2 == 0){
              clockwiseFlag = 0;
            }
            // if(data.flip){
            //   clockwiseFlag = 0;
            // }
            return this.makeGeoWave(data, shape, {clockwiseFlag:!clockwiseFlag})
          }),
          new go.Binding("desiredSize", "desiredSize", function(v) {
                var size = new go.Size(v.width, v.height/2)
                // console.log("v:",v)
                return size
            }).ofObject("main")
        )
    }
    getTextBuild(){
      return $(go.TextBlock, {
              name: "TEXT",
              alignment: new go.Spot(0.5, 0.4),
              font: "18px 'Microsoft YaHei'",
              editable: false,
              // flip:go.GraphObject.FlipHorizontal,
              //margin: 3, editable: true,
              
              stroke: "black",
              isMultiline: true,
              overflow: go.TextBlock.OverflowClip,
              wrap: go.TextBlock.WrapDesiredSize,
              textAlign: "center",
              spacingAbove: 4,
              spacingBelow: 4,
              portId: "TEXT",
              stretch: go.GraphObject.Uniform
          },
          new go.Binding("textAlign", "textAlign", function(v) {
              return ['start', 'center', 'end'].indexOf(v)>-1 ? v : "center";
          }).makeTwoWay(),
          new go.Binding("spacingAbove", "spacingline", function(v) {
              return helpers.tdTransToNum(v, 4);
          }).makeTwoWay(),
          new go.Binding("spacingBelow", "spacingline", function(v) {
              return helpers.tdTransToNum(v, 4);
          }).makeTwoWay(),
          new go.Binding("width", "width", function(v) {
              return v-30;
          }).ofObject("main"),
          // new go.Binding("height", "height", function (v) {
          //   return v;
          // }).ofObject("SHAPE"),
          new go.Binding("text", "text").makeTwoWay(),
          new go.Binding("stroke", "textStroke").makeTwoWay(),
          new go.Binding("font", "font").makeTwoWay()
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
                 stroke: "dodgerblue", strokeWidth: 3 },
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

    getNodeTemplate(){
      var diagram = this.diagram
      return $(go.Node,"Spot",{
        // isClipping: true,
        layerName: "default",
        zOrder:5,
        movable: false,
        resizable: false,
        resizeObjectName: "main",
        selectionObjectName: "main",
        rotatable: false,
        layoutConditions: go.Part.LayoutStandard & go.Part.LayoutRemoved & go.Part.LayoutAdded & go.Part.LayoutNodeSized,
        locationSpot: go.Spot.LeftCenter,
        toolTip:  // define a tooltip for each node that displays the color as text
        $("ToolTip",
          $(go.TextBlock, { margin: 4 },
            new go.Binding("text", "", function(data,p){
              // console.log("tooltip:",p,data)
              var tips = ["双击编辑文字","尝试按方向键快捷移动到下一个对象"]
              var elt = Math.floor(tips.length * Math.random())
              return tips[elt]
            })
          )
        ),  // end of Adornment
        click: (e, node)=>{
          console.log(node.data)
        },
        mouseOver: function(e, node) {
          // if(node.data.hyperlink){
          //   var textObj = node.findObject('TEXT');
          //   textObj.isUnderline = true;
          // }
          if(!node.containingGroup) return;
          var it = node.containingGroup.findSubGraphParts().iterator;
          while (it.next()) {
              var n = it.value;
              if(n.data.category == "autoText"){
                  if(n.data.order == node.data.order){
                      // locateNode = n;
                      n.findObject("textBorder").visible = true;
                    //   n.areaBackground = "mediumslateblue"
                  }
              }
          }
          // diagram.__trtd.showNodeRemarkTips(e, node);
      },
      contextMenu: $(go.Adornment),
      mouseLeave: function(e, node) {
        if(!node.containingGroup) return;
        var it = node.containingGroup.findSubGraphParts().iterator;
        while (it.next()) {
            var n = it.value;
            if(n.data.category == "autoText"){
                // if(n.data.order == node.data.order+1){
                //     locateNode = n;
                // }
                n.findObject("textBorder").visible = false;
                // n.areaBackground = null
            }
        }
      },
        selectionAdornmentTemplate: this.getNodeSelectionAdornmentTemplate(),
        doubleClick: function (e, node){
          e.diagram.__trtd.selectText(e, node)
        },
      },
      this.binding,
      $(go.Shape, "Ellipse",
      { name:"main",fill: "rgba(0,0,0,0)", stroke: null, width: 300, height: 150 },
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
