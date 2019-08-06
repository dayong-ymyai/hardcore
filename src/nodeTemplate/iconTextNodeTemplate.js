var $ = go.GraphObject.make;
var Base = require('./base')
var helpers = require('../helpers/helpers.gojs')
  
class IconTextTemplate extends Base {
    constructor(options){
        super(options)
        // this.nodeProperties = {}
        
    }

    makeGeo(data, shape, options) {
      // this is much more efficient than calling go.GraphObject.make:
      var {radiusX=150,radiusY=100} = data
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

    getShiHalfEllipseShape(){
      return $(go.Shape, {name:"XU", stroke: "red", fill:"rgba(0,66,0,0)",
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
              data.flip = true;
            }
            if(data.flip){
              clockwiseFlag = 1;
            }
            return this.makeGeo(data, shape, {clockwiseFlag:clockwiseFlag})
          }),
          new go.Binding("desiredSize", "desiredSize", function(v) {
                var size = new go.Size(v.width, v.height/2)
                // console.log("v:",v)
                return size
            }).ofObject("main")
        )
    }
    getXuHalfEllipseShape(){
      return $(go.Shape, {name:"SHI", stroke: "blue", fill:"rgba(0,66,0,0)",
        // background: "gray",
        stretch: go.GraphObject.Uniform,
        alignment: go.Spot.Bottom,
        strokeDashArray: [5, 5],
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
              data.flip = true;
            }
            if(data.flip){
              clockwiseFlag = 0;
            }
            return this.makeGeo(data, shape, {clockwiseFlag:clockwiseFlag})
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
              font: "bold 18px 幼圆",
              editable: true,
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
    getNodeTemplate(){
      return $(go.Node,"Spot",{
        locationObjectName: "TEXT",
        movable: true,
        resizable: true,
        resizeObjectName: "TEXT",
        selectionObjectName:"TEXT",
        // rotatable: false,
        layoutConditions: go.Part.LayoutStandard & go.Part.LayoutRemoved & go.Part.LayoutAdded & go.Part.LayoutNodeSized,
        locationSpot: go.Spot.LeftCenter,
        click: (e, node)=>{
          console.log(node.data)
        },
        doubleClick: function (e, node){
          e.diagram.__trtd.selectText(e, node)
        },
        resizeAdornmentTemplate:  // specify what resize handles there are and how they look
        $(go.Adornment, "Spot",
          $(go.Placeholder),  // takes size and position of adorned object
          // $(go.Shape, "Circle",  // left resize handle
          //   { alignment: go.Spot.Left, cursor: "col-resize",
          //     desiredSize: new go.Size(9, 9), fill: "lightblue", stroke: "dodgerblue" }),
          $(go.Shape, "Circle",  // right resize handle
            { alignment: go.Spot.Right, cursor: "col-resize",
              desiredSize: new go.Size(9, 9), fill: "lightblue", stroke: "dodgerblue" }),
          // $(go.TextBlock, // show the width as text
          //   { alignment: go.Spot.Top, alignmentFocus: new go.Spot(0.5, 1, 0, -2),
          //     stroke: "dodgerblue" },
          //   new go.Binding("text", "adornedObject",
          //                  function(shp) { return shp.naturalBounds.width.toFixed(0); })
          //       .ofObject())
        ),
      },
      new go.Binding("movable", "movable").makeTwoWay(),
      new go.Binding("deletable", "deletable").makeTwoWay(),
      // $(go.TextBlock,{
      //   name:"label",
      //   // height:30,
        
      //   alignment: go.Spot.Center,
      //   verticalAlignment: go.Spot.Center,
      //   // isMultiline: false,
      //   overflow: go.TextBlock.OverflowEllipsis,
      //   // overflow: go.TextBlock.OverflowClip,
      //   // wrap: go.TextBlock.WrapDesiredSize,
      //   wrap: go.TextBlock.wrap,
      //   stretch: go.GraphObject.Fill,
      //   maxLines: 1,
      //   stroke: "black",
      //   editable: true,
      //   textAlign: "start",
      //   font: "18px 'Microsoft YaHei'"
      // },
      // new go.Binding("text", "label").makeTwoWay(),
      // ),
      $(go.TextBlock,{
        name:"TEXT",
        width:200, height:30,
        maxSize: new go.Size(NaN, 70),
        minSize: new go.Size(NaN, 70),
        alignment: go.Spot.Center,
        verticalAlignment: go.Spot.Center,
        isMultiline: false,
        overflow: go.TextBlock.OverflowEllipsis,
        // overflow: go.TextBlock.OverflowClip,
        // wrap: go.TextBlock.WrapDesiredSize,
        // wrap: go.TextBlock.wrap,
        stretch: go.GraphObject.Fill,
        maxLines: 5,
        stroke: "black",
        editable: true,
        textAlign: "start",
        font: "18px 'Microsoft YaHei'"
      },
      new go.Binding("text", "text").makeTwoWay(),
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
      ),
      $(go.Panel,"Vertical",
        {alignment: go.Spot.Left,
        alignmentFocus: go.Spot.Right,
        },
        $(go.Shape,{
          name:"ICON",
          width:16,
          height:16,
          click: function(e){
            console.log("icon click")
          },
          figure:"Diamond",
          fill:"red",
          strokeWidth:0,
          margin: 3
        },

        new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
        new go.Binding("figure", "figure").makeTwoWay(),
        new go.Binding("fill", "fill", function(v, obj) {
          return v
      }).makeTwoWay(),
        new go.Binding("height", "height", function(v) {
            if(!v) v=30
            return v*2/3;
        }).ofObject("label"),
        new go.Binding("width", "height", function(v) {
          if(!v) v=30
            return v*2/3;
        }).ofObject("label"),
        ),
      )
      
      // this.binding,
      // $(go.Shape, "Ellipse",
      // { name:"main",fill: "lightgreen", stroke: null, width: 300, height: 150 },
      //   new go.Binding("desiredSize", "desiredSize", function(v, d) {
      //       // console.log("vd m", v, d )
      //       // if(!v) return d.part.findObject("SHAPE").measuredBounds.size;
      //       return go.Size.parse(v)
      //   }).makeTwoWay(function(v) {
      //       return go.Size.stringify(v)
      //   }),
      // ),
      // this.getShiHalfEllipseShape(),
      // this.getXuHalfEllipseShape(),

      // // this.getUpHalfEllipseShape(),
      // this.getTextBuild()
      )
    }
}

module.exports = IconTextTemplate
