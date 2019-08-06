var $ = go.GraphObject.make;
var Base = require('./base')
var helpers = require('../helpers/helpers.gojs')
var axisGroupLayout = require("../layout/axisGroupLayout")

class AxisNodeTemplate extends Base {
    constructor(options){
        super(options)
        // this.nodeProperties = {}
        
    }
    
    addFreeText(e, node){
      console.log("eeeeeeeeeee",e)
      var data = {"text":"自由文本",
      "deletable":true, 
      "role":"freeText",
      "fill":"black", 
      "iconVisible":false, 
      "locationSpot":"0.5 0.5 0 0", 
      "textAlign":"center", 
      "category":"autoText", 
      "loc": go.Point.stringify(e.documentPoint), 
      "movable":true, "group":node.data.key
     }
     this.diagram.startTransaction("addFreeText")
     this.diagram.model.addNodeData(data);
     this.diagram.commitTransaction("addFreeText")
    }

    getNodeTemplate(){
      var that = this
      return $(go.Group, "Auto",
      { selectionObjectName: "PH",
      layerName: "Background",
        locationObjectName: "PH",
        locationSpot: go.Spot.BottomLeft ,
        // rotationSpot: go.Spot.LeftCenter,
        rotatable: false,
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
          return;
          if(node.isSelected) return;
          var it = node.findSubGraphParts().iterator;
          var n;
          while (it.next()) {
              n = it.value;
              if(n.data.role == "labelGroup"){
                  n.__trtdNode.switchBorder(n, true)
                  break;
              }
          }
          if(n){
            setTimeout(function(){
              n.__trtdNode.switchBorder(n, false)
            },3000)
          }
        },
        doubleClick: function (e, node){
          that.addFreeText(e, node)
        },
        mouseOver: function(e, node) {
          // if(node.data.hyperlink){
          //   var textObj = node.findObject('TEXT');
          //   textObj.isUnderline = true;
          // }
          // if(!node.containingGroup) return;
          return;
          if(that.diagram.selection.count >0) return;

          var it = node.findSubGraphParts().iterator;
          var n;
          while (it.next()) {
              n = it.value;
              if(n.data.role == "labelGroup"){
                  // n.__trtdNode.switchBorder(n, true)
                  break;
              }
          }
          // 给显示隐藏一个缓冲，以显得不那么突兀
          if(n){
            setTimeout(function(){
              if(that.diagram.selection.count >0) return;
              n.__trtdNode.switchBorder(n, true)
              if(that.diagram.selection.count <=0) return;
              setTimeout(function(){
                n.__trtdNode.switchBorder(n, false)
              },3000)
            },100)
          }
          // diagram.__trtd.showNodeRemarkTips(e, node);
      },
      contextMenu: $(go.Adornment),
      mouseLeave: function(e, node) {
        // if(!node.containingGroup) return;
        var it = node.findSubGraphParts().iterator;
        while (it.next()) {
            var n = it.value;
            if(n.data.role == "labelGroup"){
                // n.__trtdNode.switchBorder(n, false)
                break;
            }
        }
        if(n){
          setTimeout(function(){
            n.__trtdNode.switchBorder(n, false)
          },3000)
        }
      },
        // rotatable: true,
        // resizable: true,
        // layoutConditions: go.Part.LayoutStandard,
        layoutConditions: go.Part.LayoutStandard & go.Part.LayoutRemoved & go.Part.LayoutAdded & go.Part.LayoutNodeSized,
        layout: new axisGroupLayout()
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
      new go.Binding("copyable", "copyable").makeTwoWay(),
        $(go.Shape,  // using a Shape instead of a Placeholder
          { name: "PH",
          figure:"Rectangle",
          // rotationSpot: go.Spot.LeftCenter,
          // spot1: new go.Spot(0.01, 0.01),
          // spot2: new go.Spot(0.99, 0.99),
            // width: 600,
            // height:300,
            stroke:"yellow" ,
            strokeWidth:0,
            fill: "rgba(0,0,0,0)" },
          // new go.Binding("desiredSize", "desiredSize", function(v,data){
          //   return go.Size.parse(v)
          //   console.log('1111111111111111111111')
          //   // for(var i=0;i<)
          //   var model = data.part.diagram.model;
          //   var group = data.part.data;
          //   var maxWidth = 0;
          //   var maxHeight = 0;
          //   for(var i = 0;i<model.nodeDataArray.length;i++){
          //     if(group.key != model.nodeDataArray[i].group){
          //       continue;
          //     }
          //     if(model.nodeDataArray[i].desiredSize){
          //       console.log(model.nodeDataArray[i].desiredSize)
          //       var size = go.Size.parse(model.nodeDataArray[i].desiredSize)
          //       if(size.width > maxWidth){
          //         maxWidth = size.width;
          //       }
          //       if(size.height > maxHeight){
          //         maxHeight = size.height;
          //       }
          //     }
          //   }
          //   // var group = that.diagram.findNodeForKey(data.part.data.key)
          //   // var git = group.memberParts;
          //   // var maxWidth = 0;
          //   // var maxHeight = 0;
          //   // while (git.next()) {
          //   //   var item = git.value;
          //   //   console.log("item:",item)
          //   //   if(item.naturalBounds.width > maxWidth){
          //   //     maxWidth = item.naturalBounds.width;
          //   //   }
          //   //   if(item.naturalBounds.height > maxHeight){
          //   //     maxHeight = item.naturalBounds.height;
          //   //   }
          //   //   console.log(`maxHeight:${maxHeight},maxWidth:${maxWidth}`)
      
          //   // }           
          //   return go.Size.parse(`${maxWidth+100} ${maxHeight}`)         
          //   // group.diagram.model.setDataProperty(group.data, "desiredSize", `${maxWidth+100} ${maxHeight}`) 
          // }).makeTwoWay(go.Size.stringify)
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

module.exports = AxisNodeTemplate
