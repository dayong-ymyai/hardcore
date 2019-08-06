var $ = go.GraphObject.make;
var Base = require('./base')
var helpers = require('../helpers/helpers.gojs')
var waveGroupLayout = require("../layout/waveGroupLayout")

class WaveNodeTemplate extends Base {
    constructor(options){
        super(options)
        // this.nodeProperties = {}
        
    }
    
    nodeResizeAdornmentTemplate () {
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

    getNodeTemplate(){
      var that = this
      return $(go.Group, "Spot",
      { selectionObjectName: "PH",
        layerName: "default",
        locationObjectName: "PH",
        resizeObjectName:"PH",
        // rotatable: false
        resizable: true,
        locationSpot: go.Spot.LeftCenter,
        
        // rotationSpot: go.Spot.LeftCenter,
        alignment: go.Spot.Left,
        alignmentFocus: go.Spot.Left,
        // rotateObject:"PH",
        click: (e, node)=>{
          console.log(node.data)
          var it = node.findSubGraphParts().iterator;
          while (it.next()) {
              var n = it.value;
              if(n.data.category == "autoText"){
                  n.findObject("textBorder").visible = false;
              }
          }
        },
        selectionAdornmentTemplate: this.getNodeSelectionAdornmentTemplate(),
        resizeAdornmentTemplate: that.nodeResizeAdornmentTemplate(),
        mouseOver: function(e, node) {
            console.log("group.......................")
            // if(node.data.hyperlink){
            //   var textObj = node.findObject('TEXT');
            //   textObj.isUnderline = true;
            // }
            // if(!node) return;
            var it = node.findSubGraphParts().iterator;
            while (it.next()) {
                var n = it.value;
                if(n.data.category == "autoText"&& (node.data.role == "xuText" || node.data.role == "shiText" )){
                    // if(n.data.order == node.data.order){
                        // locateNode = n;
                        if(n.data.text == ""|| n.data.text.trim() == ""){
                          n.findObject("textBorder").visible = true;
                        }
                      //   n.areaBackground = "mediumslateblue"
                    // }
                }
            }
            // diagram.__trtd.showNodeRemarkTips(e, node);
        },
        mouseLeave: function(e, node) {
          // if(!node) return;
          var it = node.findSubGraphParts().iterator;
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
        rotatable: true,
        contextMenu: $(go.Adornment),
        // resizable: true,
        // layoutConditions: go.Part.LayoutStandard,
        layoutConditions: go.Part.LayoutStandard & go.Part.LayoutRemoved & go.Part.LayoutAdded & go.Part.LayoutNodeSized,
        layout: new waveGroupLayout()
        // layout: $(go.GridLayout,{
        //   spacing: new go.Size(0,0),
        //   cellSize: go.Size.parse(300,150),
        //   arrangement:go.GridLayout.LeftToRight,
        //   alignment: go.GridLayout.Location,
        //   comparer:function(pa, pb) {
        //     var da = pa.data;
        //     var db = pb.data;
        //     if (da.order < db.order) return -1;
        //     if (da.order > db.order) return 1;
        //     return 0;
        //   }
        // }) 
      },
      new go.Binding("angle", "angle").makeTwoWay(function(v,data){

        return v;
      }),
      // new go.Binding("copyable", "copyable").makeTwoWay(),
      new go.Binding("isShadowed", "isShadowed").makeTwoWay(),
      new go.Binding("selectable", "selectable").makeTwoWay(),
      new go.Binding("movable", "movable").makeTwoWay(),
      new go.Binding("deletable", "deletable").makeTwoWay(),
        $(go.Shape,  // using a Shape instead of a Placeholder
          { name: "PH",
          figure:"Rectangle",
          // rotationSpot: go.Spot.LeftCenter,
          // spot1: new go.Spot(0.01, 0.01),
          // spot2: new go.Spot(0.99, 0.99),
            // width: 600,
            // height:300,
            alignment: new go.Spot(0,0.5),
            // locationSpot: go.Spot.LeftCenter,
            stroke:"#9aa8b6" ,
            strokeWidth: 0,
            minSize: new go.Size(300,70),
            maxSize: new go.Size(NaN,400),
            fill: "rgba(88,0,0,0)" },
          new go.Binding("desiredSize", "desiredSize", function(v,data){
            return go.Size.parse(v)
          }).makeTwoWay(go.Size.stringify)
        ),
        new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
        // $(go.Placeholder,    // represents the area of all member parts,
        //   { padding: 0}
        // ),  // with some extra padding around them

        // $(go.TextBlock,  // group title
        //   { font: "Bold 12pt Sans-Serif" },
        //   new go.Binding("text", "key")
        // )
      )
    }
}

module.exports = WaveNodeTemplate
