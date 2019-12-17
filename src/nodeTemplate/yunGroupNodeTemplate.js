var $ = go.GraphObject.make;
var Base = require('./base')
var helpers = require('../helpers/helpers.gojs')
var yunGroupLayout = require("../layout/yunGroupLayout")

class YunNodeTemplate extends Base {
    constructor(options){
        super(options)
        // this.nodeProperties = {}
        this.defaultTextFont = "20px 'Microsoft YaHei'"
        
    }
    

    snapToGrid(data, node){

      if(data.subRole == "coreText" || data.subRole == "themeText"){
        return;
      }
      var p = go.Point.parse(data.loc)
      if(node.__yunPointsX && node.__yunPointsY ){
        if(p.x >= node.__yunPointsX[0] && p.x <= node.__yunPointsX[node.__yunPointsX.length-1] 
          && p.y >= node.__yunPointsY[node.__yunPointsY.length-1] && p.y <= node.__yunPointsY[0] ){
            // 在画布格子范围内的位置才对齐网格
            var minX=20000,minY=20000,tmp,orderX,orderY;
            for(var i=0;i<node.__yunPointsX.length;i++){
              tmp = Math.abs(p.x - node.__yunPointsX[i])
              if(tmp< minX){
                minX = tmp;
                orderX = i+1;
              }
            }
            for(var i=0;i<node.__yunPointsY.length;i++){
              tmp = Math.abs(p.y - node.__yunPointsY[i])
              if(tmp< minY){
                minY = tmp;
                orderY = i+1;
              }
            }

            if(orderX!=null && orderY!=null){
              // var x = node.__yunPointsX[orderX-1]
              // var y = node.__yunPointsX[orderY-1]
              // x = -1300
              // y = -1300
              // data.loc = "-1688.105387366997 -121.19730986224602"
              data.orderX = orderX
              data.orderY = orderY
            }
          }else{
            delete data.orderX
            delete data.orderY
          }
     }
    }

    addFreeText(e, node){
      console.log("addFreeTextaddFreeText begin",e)
      var gridWidth = node.data.gridWidth
      var p = e.documentPoint
      var that = this;
      var data = {"text":"灵感",
      "deletable":true, 
      "role":"freeText",
      "fill":"black", 
      "iconVisible":false, 
      "locationSpot":"0.5 0.5 0 0", 
      "minSize":`30 30`,
      // "width":`${gridWidth-10}`,
      font: that.defaultTextFont,
      "textAlign":"center", 
      "category":"autoText", 
      "loc": go.Point.stringify(p), 
      "movable":true, "group":node.data.key
     }
    //  console.log()
     

      this.snapToGrid(data, node)
     this.diagram.startTransaction("addFreeText")
     this.diagram.model.addNodeData(data);
     this.diagram.commitTransaction("addFreeText")
     node.layout.isValidLayout = false
     console.log("addFreeTextaddFreeText end",e)
    }

    getNodeTemplate(){
      var that = this
      return $(go.Group, "Auto",
      { selectionObjectName: "PH",
      __trtdNode: that,
      layerName: "default",
      padding: 0,
      margin: 0,
      copyable: true,
      zOrder: 15,
        locationObjectName: "PH",
        locationSpot: new go.Spot(0,1,0,-0),
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
          node.layout.isValidLayout = false
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
          // that.addFreeText(e, node)
        },
        mouseOver: function(e, node) {
          // if(node.data.hyperlink){
          //   var textObj = node.findObject('TEXT');
          //   textObj.isUnderline = true;
          // }
          // if(!node.containingGroup) return;
          return;
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
        // if(n){
        //   setTimeout(function(){
        //     n.__trtdNode.switchBorder(n, false)
        //   },3000)
        // }
      },
        // rotatable: true,
        // resizable: true,
        // layoutConditions: go.Part.LayoutStandard,
        layoutConditions: go.Part.LayoutStandard & go.Part.LayoutRemoved & go.Part.LayoutAdded & go.Part.LayoutNodeSized,
        layout: new yunGroupLayout()
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
      new go.Binding("deletable", "deletable").makeTwoWay(function(v,data){
        return v;
      }),
      new go.Binding("copyable", "copyable").makeTwoWay(),
      new go.Binding("angle", "angle").makeTwoWay(function(v,data){
        return v;
      }),
      new go.Binding("zOrder", "zOrder").makeTwoWay(function(v,data){
        return v;
      }),
      new go.Binding("locationSpot", "", function(data){
        // console.log("data:",data)
        return new go.Spot(0,1,data.gridWidth,-data.gridHeight)
      }),
        
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
            fill: "rgba(0,0,255,0.0)" },
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

module.exports = YunNodeTemplate
