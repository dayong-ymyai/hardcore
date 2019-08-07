

var $ = go.GraphObject.make;
var Base = require('./base')
var helpers = require('../helpers/helpers.gojs')
  

class PicNodeTemplate extends Base {
    constructor(options){
        super(options)
        // this.nodeProperties = {}
        
    }

  

    getNodeSelectionAdornmentTemplate(){
      return  $(go.Adornment, "Spot",
                $(go.Panel, "Auto",
                    $(go.Shape, { fill: null, stroke: "dodgerblue", strokeWidth: 1 }),
                    $(go.Placeholder) // this represents the selected Node

                ),
                //$("TreeExpanderButton",
                $(go.Panel, "Vertical", {
                        name: "ButtonIcon1",
                        alignment: new go.Spot(0, 1, -20, 20),
                        alignmentFocus: go.Spot.Center,
                        width: 60,
                        height: 60,
                        isActionable: true,
                        // click: interactions.expandCollapse // this function is defined below
                    },

                    $(go.Shape, "Circle", {
                        fill: "rgba(1,1,1,0)",
                        strokeWidth: 0,
                        stroke: "green",
                        width: 50,
                        height: 50
                    })

                )
            ); // end Adornment;
    }

    nodeResizeAdornmentTemplate () {
      return $(go.Adornment, "Spot",
          $(go.Placeholder), // takes size and position of adorned object
          $(go.Shape, "Circle", // left resize handle
              {
                  alignment: go.Spot.TopLeft,
                  alignmentFocus: go.Spot.BottomRight,
                  cursor: "col-resize",
                  desiredSize: new go.Size(30, 30),
                  fill: "lightblue",
                  stroke: "dodgerblue"
              }),
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

    getNodeTemplate(){
      var diagram = this.diagram
      var that = this;
      return $(go.Node, "Spot", {
        name: "NODE",
        "_controlExpand": true,
        layerName: "Background",
        locationSpot: go.Spot.BottomLeft,
        resizeCellSize: new go.Size(10, 10),
        locationObjectName: "SHAPE",
        resizable: true,
        resizeObjectName: "SHAPE", // user can resize the Shape
        rotatable: true,
        rotateObjectName: "SHAPE", // rotate the Shape without rotating the label
        doubleClick: function (e, node) {
            // interactions.selectText(e, node)
            console.log(node.data)
            if(node.diagram.__trtd.nodeDoubleClickListener){
                node.diagram.__trtd.nodeDoubleClickListener(node)
            }
            
        },
        click: function(e, node) {
            console.log(node.data)
            if(node.diagram.__trtd.nodeClickListener){
                node.diagram.__trtd.nodeClickListener(node)
            }
            // showNodeToolBar(e,node);
        },
        selectable: true,
        movable: true,
        angle: 0,
        //toMaxLinks: 1,
        layoutConditions: go.Part.LayoutStandard,
        //layoutConditions:~go.Part.LayoutAdded,
        // fromLinkable: true, toLinkable: true,
        alignment: go.Spot.Center,
        alignmentFocus: go.Spot.Center,
        resizeAdornmentTemplate: that.nodeResizeAdornmentTemplate(),
        //rotateAdornmentTemplate: nodeRotateAdornmentTemplate,
        contextMenu: diagram.__trtd.nodeContextMenu,
        selectionAdornmentTemplate: that.getNodeSelectionAdornmentTemplate(),
        contextMenu: $(go.Adornment),
      },
        new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
        new go.Binding("isShadowed", "isShadowed").makeTwoWay(),
        new go.Binding("selectable", "selectable").makeTwoWay(),
        new go.Binding("movable", "movable").makeTwoWay(),
        new go.Binding("resizable", "resizable").makeTwoWay(),
        new go.Binding("deletable", "deletable").makeTwoWay(),
        new go.Binding("layerName", "layerName", function(v, d) {
            return v ? v : "";
        }).makeTwoWay(function(v) {
            return v;
        }),
        // $(go.TextBlock, // the text label
        //     new go.Binding("text", "text")),
        $(go.Picture, // the icon showing the logo
            // You should set the desiredSize (or width and height)
            // whenever you know what size the Picture should be.
   
            { name: "SHAPE" ,
            width: 400,
            height:400,
        }, {
                successFunction: function(pict, evt) {
                    if ((!pict.width || !pict.height) && (!pict.part.data.width || !pict.part.data.height)) {
                        pict.width = pict.element.width;
                        pict.height = pict.element.height;
                    }
                }
            }, {
                sourceCrossOrigin: function(pict) {
                    return "";
                }
            },
            new go.Binding("source", "picture", function(v){
                    
                return v+"?"+Date.now()

            }).makeTwoWay(function(v){
                if(v){
                    v = v.replace(/\?.*$/g,"")
                    return v
                }else{
                    return ""
                }
            }),
            new go.Binding("width", "width", function(v, d) {
                return v;
            }).makeTwoWay(function(v) {
                return v;
            }),
            new go.Binding("height", "height", function(v, d) {
                return v;
            }).makeTwoWay(function(v) {
                return v;
            }),
            new go.Binding("angle", "angle").makeTwoWay(),
            new go.Binding("opacity", "opacity", function(v, d) {
                return v ? parseFloat(v) : 1;
            }).makeTwoWay(function(v) {
                return v;
            })
        )
      )
    }
}

module.exports = PicNodeTemplate
