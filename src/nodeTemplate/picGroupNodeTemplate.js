

var $ = go.GraphObject.make;
var Base = require('./base')
var helpers = require('../helpers/helpers.gojs')
  

class PicGroupNodeTemplate extends Base {
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

  addFreeText(e, node){
    console.log("eeeeeeeeeee",e)
    var data = {"text":"总结文本",
    "deletable":true, 
    "fill":"black", 
    "iconVisible":false, 
    "locationSpot":"0 0.5 0 0", 
    "textAlign":"left", 
    "category":"autoText", 
    "loc": go.Point.stringify(e.documentPoint), 
    "movable":true, "group":node.data.key
   }
   this.diagram.startTransaction("addFreeText")
   this.diagram.model.addNodeData(data);
   this.diagram.commitTransaction("addFreeText")
  }

    getNodeTemplate(){
      var diagram = this.diagram
      var that = this;
      return  $(go.Group, "Auto",
      { 
        __trtdNode: that,
        // selectionObjectName: "groupBorder",
        layerName: "default",
        locationObjectName: "placeholder",
        zOrder: 5,
        // margin:30,
        // padding:30,
        background:"rgba(0,0,0,0)",
        rotatable: false,
        // minSize: new go.Size(200,100),
        locationSpot: go.Spot.BottomLeft,
        click: (e, node)=>{
          console.log(node.data)
        },
        layout: $(go.Layout),
        doubleClick: function (e, node){
            // that.addLabelText(e, node)
            that.addFreeText(e, node)
        },
        contextMenu: $(go.Adornment),
        layoutConditions: go.Part.LayoutStandard & go.Part.LayoutRemoved & go.Part.LayoutAdded & go.Part.LayoutNodeSized,

      },
      new go.Binding("location", "loc", function(v){
        // console.log("go.Point.parsego.Point.parsego.Point.parse")
        return go.Point.parse(v)
      }).makeTwoWay(go.Point.stringify),
      new go.Binding("angle", "angle").makeTwoWay(function(v,data){

        return v;
      }),
      new go.Binding("isShadowed", "isShadowed").makeTwoWay(),
      new go.Binding("selectable", "selectable").makeTwoWay(),
      new go.Binding("movable", "movable").makeTwoWay(),
      new go.Binding("deletable", "deletable").makeTwoWay(),
      new go.Binding("layerName", "layerName").makeTwoWay(),

      $(go.Placeholder,    // represents the area of all member parts,
        { padding: 30,
          alignment: go.Spot.Center,
          name:"placeholder",
        }
      ),  // with some extra padding around them
      )
    }
}

module.exports = PicGroupNodeTemplate
