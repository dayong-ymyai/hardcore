var $ = go.GraphObject.make;
var Base = require('./base')
var helpers = require('../helpers/helpers.gojs')
// var labelGroupLayout = require("../layout/labelGroupLayout")

class LabelGroupNodeTemplate extends Base {
    constructor(options){
        super(options)
        // this.nodeProperties = {}
        
    }
    
    switchBorder(group,flag){
      // group.diagram.startTransaction()
      // group.findObject("groupBorder").opacity = flag?1:0;
      group.findObject("groupBorder").opacity = flag?1:0;
      // group.diagram.commitTransaction()
    }

    hiddenAllText(group){
      console.log("hiddenAllTexthiddenAllTexthiddenAllText")
      group.diagram.startTransaction()
      var it = group.findSubGraphParts().iterator;
      var oldStatus = null;
      while (it.next()) {
          var n = it.value;
          if(oldStatus==null){
            oldStatus = n.visible;
          }
          if(n.data.category == "autoText"){
             group.diagram.model.setDataProperty(n.data,"visible", !oldStatus)
          }
      }
      group.diagram.commitTransaction()
    }

    addLabelText(e, node){
      
      var data = {"text":"说明：内容",
       "deletable":true, 
       "fill":"black", 
       "iconVisible":true, 
       "locationSpot":"0 0 0 0", 
       "textAlign":"start", 
       "category":"autoText", 
       "loc": `${node.location.x+30} ${node.location.y}`, 
       "movable":false, "group":node.data.key
      }
      this.diagram.startTransaction("addLabelText")
      this.diagram.model.addNodeData(data);
      this.diagram.commitTransaction("addLabelText")
    }

    getNodeTemplate(){
      var that = this
      return $(go.Group, "Spot",
      { 
        __trtdNode: that,
        // copyable: false,
        // selectionObjectName: "groupBorder",
        layerName: "default",
        locationObjectName: "groupBorder",
        zOrder: 5,
        // margin:30,
        // padding:30,
        background:"rgba(0,0,0,0)",
        rotatable: false,
        minSize: new go.Size(200,100),
        locationSpot: go.Spot.Center,
        toolTip:  // define a tooltip for each node that displays the color as text
        $("ToolTip",
          $(go.TextBlock, { margin: 4 },
            new go.Binding("text", "", function(data,p){
              // console.log("tooltip:",p,data)
              return "双击显示/隐藏"
            })
          )
        ),  // end of Adornment
        // rotationSpot: go.Spot.LeftCenter,
        // alignment: go.Spot.Left,
        // alignmentFocus: go.Spot.Left,
        // rotateObject:"PH",
        click: (e, node)=>{
          console.log(node.data)
        },
        selectable: true,
        // selectionAdornmentTemplate: this.getNodeSelectionAdornmentTemplate(),
        doubleClick: function (e, node){
            // that.addLabelText(e, node)
            that.hiddenAllText(node)
            that.switchBorder(node, false)
            // that.diagram.clearSelection();
        },
        // rotatable: true,
        mouseOver: function(e, node) {
          // console.log("211111")
          // if(node.data.hyperlink){
          //   var textObj = node.findObject('TEXT');
          //   textObj.isUnderline = true;
          // }
          // if(node.data.text == ""){
            // if(group.findObject("groupBorder").visible){
              that.switchBorder(node, true)
            // }
            // node.background = "rgba(125,125,125,0.01)"
          // }

          if(!node.containingGroup) return;
          var it = node.containingGroup.findSubGraphParts().iterator;
          node.diagram.startTransaction()
          while (it.next()) {
              var n = it.value;
              if(n.data.category == "autoText"){
                  if(n.data.role && n.data.role.indexOf("labelText")>-1){
                      // locateNode = n;
                      n.diagram.model.setDataProperty(n.data, "minSize", "120 30")
                      // n.areaBackground = "mediumslateblue"
                  }
              }
          }
          node.diagram.commitTransaction()
          // diagram.__trtd.showNodeRemarkTips(e, node);
          },
      mouseLeave: function(e, node) {
        // if(node.data.text == ""){
          // node.background = "rgba(0,0,0,0)"
          that.switchBorder(node, false)
        // }
      },
        // resizable: true,
        // layoutConditions: go.Part.LayoutStandard,
        layoutConditions: go.Part.LayoutStandard & go.Part.LayoutRemoved & go.Part.LayoutAdded & go.Part.LayoutNodeSized,
        // layout: new waveGroupLayout()
        layout: $(go.GridLayout,{
          isInitial: false,
          isOngoing: false,
          spacing: new go.Size(0,0),
          cellSize: go.Size.parse(300,150),
          arrangement:go.GridLayout.LeftToRight,
          wrappingColumn:1,
          isRealtime: false,
          alignment: go.GridLayout.Location,
          // comparer:function(pa, pb) {
          //   var da = pa.data;
          //   var db = pb.data;
          //   if (da.order < db.order) return -1;
          //   if (da.order > db.order) return 1;
          //   return 0;
          // }
        }) 
      },
      new go.Binding("location", "loc", function(v){
        // console.log("go.Point.parsego.Point.parsego.Point.parse")
        return go.Point.parse(v)
      }).makeTwoWay(go.Point.stringify),
      new go.Binding("angle", "angle").makeTwoWay(function(v,data){

        return v;
      }),
      new go.Binding("isShadowed", "isShadowed").makeTwoWay(),
      new go.Binding("copyable", "copyable").makeTwoWay(),
      new go.Binding("movable", "movable").makeTwoWay(),
      new go.Binding("deletable", "deletable").makeTwoWay(),

      $(go.Placeholder,    // represents the area of all member parts,
        { padding: 30,
          alignment: go.Spot.Center,
          // stroke: "blue",
          // strokeWidth: 2,
          name:"placeholder",
        }
      ),  // with some extra padding around them
        // $(go.Shape,  // using a Shape instead of a Placeholder
        //   { name: "PH",
        //   figure:"Rectangle",
        //   // rotationSpot: go.Spot.LeftCenter,
        //   // spot1: new go.Spot(0.01, 0.01),
        //   // spot2: new go.Spot(0.99, 0.99),
        //   // areaBackground: "red",
        //     // width: 600,
        //     // height:300,
        //     stroke:"blue" ,
        //     strokeWidth: 2,
        //     fill: "rgba(0,0,0,0)" 
        //   },
        // ),

        // new go.Binding("width", "width").ofObject("")
        $(go.Shape,"Rectangle",{
          name: "groupBorder",
          stroke: "green",
          strokeWidth: 3,
          strokeDashArray: [10, 5],
          visible:true,
          opacity: 0,
          // margin:30,
          fill:null,
          alignment: go.Spot.Center,
          alignmentFocus: go.Spot.Center,
          // width:200,
          // height:150, 
      },
      // new go.Binding("width","width").ofObject("placeholder"),
      // new go.Binding("height","height").ofObject("placeholder"),
      new go.Binding("desiredSize","", function(v,d){
          console.log("vvvvvvvvvvvvv,",v,d)
          // if(d.part.placeholder.measuredBounds.width < 200){
          //   return new go.Size(200,200)
          // }
          // var width = Math.max(d.part.placeholder.measuredBounds.width, 200)
          // var height = Math.max(d.part.placeholder.measuredBounds.height, 200)
          return new go.Size(d.part.measuredBounds.width-3, d.part.measuredBounds.height-3);
          // return d.part.placeholder.actualBounds;
      }).ofObject("")
    )

        // $(go.TextBlock,  // group title
        //   { font: "Bold 12pt Sans-Serif" },
        //   new go.Binding("text", "key")
        // )
      )
    }
}

module.exports = LabelGroupNodeTemplate
