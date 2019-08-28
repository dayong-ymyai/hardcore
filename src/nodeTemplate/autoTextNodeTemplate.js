var $ = go.GraphObject.make;
var Base = require('./base')
var helpers = require('../helpers/helpers.gojs')
  
class AutoTextTemplate extends Base {
    constructor(options){
        super(options)
        // this.nodeProperties = {}
        
    }

    clearBorder(node){
        if(node.data.showBorder){
            // if(node.data.text == ""){
                node.findObject("textBorder").visible = false;
            // }
        }
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
    getNodeTemplate(){
       var properties = {
          figure: "Rectangle",
          fill: "rgba(0,0,0,0)",
          strokeWidth: 1,
          stroke: "rgba(0,0,0,0)",
          fontSize: 15,
          font: "sans-serif"
      };
      var that = this
      var diagram = this.diagram
      return $(go.Node, "Spot", {
              "_controlExpand": true,
              __trtdNode: that,
              layerName: "Foreground",
              zOrder: 10,
              movable: true,
            //   copyable: false,
              visible: true,
              locationSpot: go.Spot.Center,
              resizeCellSize: new go.Size(10, 10),
            //   locationObjectName: "textBorder",
            //   selectionObjectName: "textBorder",
              resizable: true,
            //   selectable: false,
            //   clickable: false,
              // resizeObjectName: "SHAPE", // user can resize the Shape
              rotatable: false,
              location: new go.Point(0, 0),
              //rotateObjectName: "SHAPE",  // rotate the Shape without rotating the label
              // doubleClick: selectText,
              toMaxLinks: 1,
              mouseDrop: function(e, obj) {
                var node = obj.part;
                var selnode = e.diagram.selection.first();

                   // 常变
                   if(selnode.data.category == "picGroup" && selnode.data.role == "cbian" && node.data.role == "centerText"){
                       var oliveNode = e.diagram.findNodeForKey(node.data.olive)
                       if(!oliveNode) return;
                    var it = selnode.findSubGraphParts().iterator;
                    var deleteObjs = []
                    var cbian = {}
                    while (it.next()) {
                        var n = it.value;
                        if(n.data.category == "autoText"){
                        if(n.data.locationSpot == "0 0 0 0"){
                            cbian.shiText = n.data.text;
                        }
                        if(n.data.locationSpot == "0 0.5 0 0"){
                            cbian.centerText = n.data.text;
                        }
                        if(n.data.locationSpot == "0 1 0 0"){
                            cbian.xuText = n.data.text;
                        }
                        }
                        deleteObjs.push(n.data)
                    }
                    e.diagram.startTransaction("mouseDrop")
                    // 删除总结图
                    e.diagram.model.removeNodeDataCollection(deleteObjs)
                    var backupSelnode = JSON.parse(JSON.stringify(selnode.data))
                    e.diagram.model.removeNodeData(selnode.data)
        
                    // 添加新橄榄
                    e.diagram.__trtd.addOlive(oliveNode, cbian)
                    e.diagram.commitTransaction("mouseDrop")
                    return;
                }

            

                // 互换要点文字,只有云盘里的文字可以互换
                if(selnode.data.subRole == "coreText" && node.data.subRole == "coreText" || 
                    selnode.data.subRole == "yunpanText" && node.data.subRole == "yunpanText"){
                    e.diagram.model.startTransaction("coreTextExchange")
                    var selOrderX = selnode.data.orderX
                    var selOrderY = selnode.data.orderY
                    var selDimKey = selnode.data.dimKey
                    e.diagram.model.setDataProperty(selnode.data, "orderX", node.data.orderX)
                    e.diagram.model.setDataProperty(selnode.data, "orderY", node.data.orderY)
                    e.diagram.model.setDataProperty(selnode.data, "dimKey", node.data.dimKey)
                    e.diagram.model.setDataProperty(node.data, "orderX", selOrderX)
                    e.diagram.model.setDataProperty(node.data, "orderY", selOrderY)
                    e.diagram.model.setDataProperty(node.data, "dimKey", selDimKey)
                    e.diagram.model.commitTransaction("coreTextExchange")
                }

                // 云盘互换维度
                if(selnode.data.subRole == "dimText" && node.data.subRole == "dimText" && 
                    selnode.data.category == node.data.category){
                        if(selnode.data.group!= node.data.group) return;
                        if(!selnode.containingGroup) return;
                        if(selnode.containingGroup.data.category != "yunpanGroup") return;
                        if(!(selnode.data.dimX == node.data.dimX  || selnode.data.dimY == node.data.dimY )){
                            return;
                        }

                        e.diagram.model.startTransaction("dimTextExchange")
                        var selOrderX = selnode.data.dimX
                        var selOrderY = selnode.data.dimY
                        var it = node.containingGroup.findSubGraphParts().iterator;
                        var nodeCoreTexts = []
                        var selnodeCoreTexts = []
                        var yunnodeCoreTexts = []
                        var yunselnodeCoreTexts = []
                        var normDim = "X"
                        if(selnode.data.dimX == 0){
                            normDim  = "Y"
                        }
                        var selOrder = selnode.data["dim"+normDim]
                        var nodeOrder = node.data["dim"+normDim]
                        while (it.next()) {
                            var n = it.value;
                            if(n.data.subRole == "yunpanText"){
                                if(n.data["order"+normDim] == nodeOrder){
                                    yunnodeCoreTexts.push(n)
                                }
                                if(n.data["order"+normDim] == selOrder){
                                    yunselnodeCoreTexts.push(n)
                                }
                            }
                        }
                        var tmpX,tmpY;
                        for(var i=0;i<yunnodeCoreTexts.length;i++){
                            e.diagram.model.setDataProperty(yunnodeCoreTexts[i].data, "order"+normDim, selOrder)
                        }
                        for(var i=0;i<yunselnodeCoreTexts.length;i++){
                            e.diagram.model.setDataProperty(yunselnodeCoreTexts[i].data, "order"+normDim, nodeOrder)
                        }
                        e.diagram.model.setDataProperty(selnode.data, "dim"+normDim, nodeOrder)
                        e.diagram.model.setDataProperty(node.data, "dim"+normDim, selOrder)
                        e.diagram.model.commitTransaction("dimTextExchange")
                    return;
                    }

                // 互换维度
                if(selnode.data.subRole == "dimText" && node.data.subRole == "dimText"){
                    e.diagram.model.startTransaction("dimTextExchange")
                    var selOrderX = selnode.data.dimX
                    var selOrderY = selnode.data.dimY
                    var it = node.containingGroup.findSubGraphParts().iterator;
                    var nodeCoreTexts = []
                    var selnodeCoreTexts = []
                    var yunnodeCoreTexts = []
                    var yunselnodeCoreTexts = []
                    var normDim = "X"
                    if(selnode.data.dimX == 0){
                        normDim  = "Y"
                    }
                    while (it.next()) {
                        var n = it.value;
                        if(n.data.dimKey == node.data.key){
                            nodeCoreTexts.push(n)
                        }
                        if(n.data.dimKey == selnode.data.key){
                            selnodeCoreTexts.push(n)
                        }
                        if(n.data.subRole == "yunpanText"){
                            if(n.data["order"+normDim] == node.data["order"+normDim]){
                                yunnodeCoreTexts.push(n)
                            }
                            if(n.data["order"+normDim] == selnode.data["order"+normDim]){
                                yunselnodeCoreTexts.push(n)
                            }
                        }
                    }
                    console.log("selnodeCoreTextsselnodeCoreTextsselnodeCoreTexts",selnodeCoreTexts.length)
                    var centerOrderX = (node.containingGroup.__yunPointsX.length+1)/2
                    var centerOrderY = (node.containingGroup.__yunPointsY.length+1)/2

                    if(selnode.data.dimX > centerOrderX){
                        selnodeCoreTexts.sort(function(a,b){
                            return a.data.orderX - b.data.orderX
                        })
                    }
                    if(selnode.data.dimX == centerOrderX){
                        if(selnode.data.dimY > centerOrderY){
                            selnodeCoreTexts.sort(function(a,b){
                                return a.data.orderY - b.data.orderY
                            })
                        }else{
                            selnodeCoreTexts.sort(function(a,b){
                                return b.data.orderY -a.data.orderY
                            })
                        }
                    }
                    if(selnode.data.dimX < centerOrderX){
                        selnodeCoreTexts.sort(function(a,b){
                            return  b.data.orderX - a.data.orderX
                        })
                    }

                    if(node.data.dimX > centerOrderX){
                        nodeCoreTexts.sort(function(a,b){
                            return a.data.orderX - b.data.orderX
                        })
                    }
                    if(node.data.dimX == centerOrderX){
                        if(node.data.dimY > centerOrderY){
                            nodeCoreTexts.sort(function(a,b){
                                return a.data.orderY - b.data.orderY
                            })
                        }else{
                            nodeCoreTexts.sort(function(a,b){
                                return b.data.orderY -a.data.orderY
                            })
                        }
                    }
                    if(node.data.dimX < centerOrderX){
                        nodeCoreTexts.sort(function(a,b){
                            return  b.data.orderX - a.data.orderX
                        })
                    }

                    var tmpX,tmpY;
                    for(var i=0;i<selnodeCoreTexts.length;i++){
                        tmpX = selnodeCoreTexts[i].data.orderX;
                        tmpY = selnodeCoreTexts[i].data.orderY;
                        e.diagram.model.setDataProperty(selnodeCoreTexts[i].data, "orderX", nodeCoreTexts[i].data.orderX)
                        e.diagram.model.setDataProperty(selnodeCoreTexts[i].data, "orderY", nodeCoreTexts[i].data.orderY)
                        e.diagram.model.setDataProperty(nodeCoreTexts[i].data, "orderX", tmpX)
                        e.diagram.model.setDataProperty(nodeCoreTexts[i].data, "orderY", tmpY)
                    }
                    e.diagram.model.setDataProperty(selnode.data, "dimX", node.data.dimX)
                    e.diagram.model.setDataProperty(selnode.data, "dimY", node.data.dimY)
                    e.diagram.model.setDataProperty(node.data, "dimX", selOrderX)
                    e.diagram.model.setDataProperty(node.data, "dimY", selOrderY)
                    e.diagram.model.commitTransaction("dimTextExchange")
                }


                

                if (selnode.data.category != "wave") {
                    return;
                }
                if(node.data.role != "centerText"){
                    return;
                }
                if(!node){
                  // node.containingGroup.layout.isValidLayout = false
                  return;
                }
                if(selnode.data.group != obj.data.group){
                  return;
                }
                e.diagram.startTransaction("mouseDrop")
                selnode.__oldOrder = selnode.data.order
                e.diagram.model.setDataProperty(selnode.data, "order",node.data.order+0.5)
                var xuText = e.diagram.model.findNodeDataForKey(selnode.data.xuText)
                var shiText = e.diagram.model.findNodeDataForKey(selnode.data.shiText)
                e.diagram.model.setDataProperty(shiText, "order",node.data.order+0.5)
                e.diagram.model.setDataProperty(xuText, "order",node.data.order+0.5)
                // node.containingGroup.layout.isValidLayout = false
                e.diagram.commitTransaction("mouseDrop")
              },
              mouseDragEnter: function(e, obj) {
                var node = obj.part;
                var selnode = e.diagram.selection.first();
                if(!selnode) return;
                if(selnode.data.subRole == "coreText" && node.data.subRole == "coreText" || 
                selnode.data.subRole == "yunpanText" && node.data.subRole == "yunpanText"){
                    selnode.areaBackground = null
                    node.areaBackground = "RGB(107,208,137)"
                }
                if(selnode.data.subRole == "dimText" && node.data.subRole == "dimText"){
                    selnode.areaBackground = null
                    node.areaBackground = "RGB(107,208,137)"
                }

                if(node.data.role == "centerText"){
                    node.layerName = "Background"
                }
                // if (!(selnode instanceof go.Node)  || selnode.data.role != "freeText"  || selnode.category != "autoText" ||selnode.data.subRole != "coreText") {
                //     return;
                // }



                // //var sat = node.selectionAdornmentTemplate;
                // //var adorn = sat.copy();
                // //adorn.adornedObject = node;
                // //node.addAdornment("dragEnter", adorn);
    
                // //if (!mayWorkFor(selnode, node)) return;
                // var shape = node.findObject("SHAPE");
                // if (shape) {
                //     shape._prevFill = shape.fill; // remember the original brush
                //     shape.fill = "darkred";
                // }
    
            },
            mouseDragLeave: function(e, obj) {
                var node = obj.part;
                var selnode = e.diagram.selection.first();
                // var shape = node.findObject("SHAPE");
                if(selnode.data.subRole == "coreText" && node.data.subRole == "coreText"|| 
                selnode.data.subRole == "yunpanText" && node.data.subRole == "yunpanText"){
                    node.areaBackground = null
                }
                if(selnode.data.subRole == "dimText" && node.data.subRole == "dimText"){
                    node.areaBackground = null
                }
                if(node.data.role == "centerText"){
                    node.layerName = "Foreground"
                }
                //node.removeAdornment("dragEnter");
            },
              selectionChanged: (node)=>{
                console.log("selectionChanged",node)

                if(node.data.category != "autoText" || node.data.orderX ==null 
                || node.data.orderY ==null || node.data.role != "freeText" || (node.data.subRole !="coreText"&& node.data.subRole !="yunpanText")){
                    return;
                }

                if( !node.containingGroup || (node.containingGroup.data.category != "yunGroup" && node.containingGroup.data.category != "yunpanGroup")){
                    return;
                }

                if(node.containingGroup.data.beginSpark != "line"){
                    return;
                }
                if(node.containingGroup.__yunPointsX && node.containingGroup.__yunPointsY){
                    var centerOrderX = (node.containingGroup.__yunPointsX.length+1)/2
                    var centerOrderY = (node.containingGroup.__yunPointsY.length+1)/2
                    if(node.data.orderX == centerOrderX && node.data.orderY == centerOrderY){
                        // 中心文字不参与变色
                        return;
                    }
                    var orderX = node.data.orderX, orderY=node.data.orderY
                    if(orderX == centerOrderX){
                        orderX = orderY
                    }
                    if(orderY == centerOrderY){
                        orderY = orderX
                    }
                    var shapeStrokes = node.containingGroup.data.shapeStrokes
                    var showShape = node.containingGroup.data.showShape; // 是否显示矩形
                    if(node.isSelected){
                        if(node.containingGroup.data.snapType == "between"){
                            var diff = Math.max(Math.abs(node.data.orderX - centerOrderX), Math.abs(node.data.orderY - centerOrderY))+1
                        }else{
                            var diff = Math.max(Math.abs(node.data.orderX - centerOrderX), Math.abs(node.data.orderY - centerOrderY))
                        }
                        console.log("diff:",diff,node.data.orderX,node.data.orderY)
                        var it = node.containingGroup.findSubGraphParts().iterator;

                        console.log("showShape",showShape)
                        // var beginSpark = node.containingGroup.data.beginSpark; // 是否显示矩形
                        var shape = null;
                        while (it.next()) {
                            var n = it.value;
                            if(n.data.category == "autoText" && n.data.orderX !=null 
                            && n.data.orderY !=null && n.data.role == "freeText" ){
                                n.findObject("textBorder").visible = false;
                                // if((Math.abs(n.data.orderX-centerOrderX) == Math.abs(orderX-centerOrderX) 
                                //     || Math.abs(n.data.orderX-centerOrderY) == Math.abs(orderY-centerOrderY)) 
                                // && !(Math.abs(n.data.orderX-centerOrderY) < Math.abs(orderY-centerOrderY) 
                                //     && Math.abs(n.data.orderX-centerOrderX) < Math.abs(orderX-centerOrderX))){
                                //     n.areaBackground = "red"
                                // }

                                if(Math.abs(n.data.orderX-centerOrderX) == Math.abs(orderX-centerOrderX)
                                && Math.abs(n.data.orderY-centerOrderY) <= Math.abs(orderY-centerOrderY)
                                ||Math.abs(n.data.orderX-centerOrderX) <= Math.abs(orderX-centerOrderX)
                                && Math.abs(n.data.orderY-centerOrderY) == Math.abs(orderY-centerOrderY)){
                                    // n.findObject("place").visible = true;
                                    n.areaBackground = "white"
                                    n.zOrder = 999
                                }

                            }
                            if(n.data.category == "shape" && n.data.role == "background"){
                                var obj = n.findObject("SHAPE")
                                // console.log("dfsdfsdfsdf", obj)
                                if(n.data.gridWidth == diff*2){
                                    shape = obj;
                                    // if(showShape){
                                        // n.visible = true
                                    // }
                                    if(!obj.__prestroke){
                                        obj.__prestroke = obj.stroke
                                        obj.stroke = "rgba(255,0,0,0.5)"
                                    }
                                }else{
                                    if(obj.__prestroke){
                                        obj.stroke = obj.__prestroke
                                        delete obj.__prestroke
                                    }
                                }
                            }

                        }
                        if(!shape){
                            if(node.containingGroup.data.snapType == "between"){
                                var gridWidth = diff*2;
                            }else{
                                var gridWidth = diff*2
                            }
                            console.log("addShape")
                            node.diagram.model.startTransaction("addShape");
                            var shapeData = {"deletable":true, 
                            "role":"background", 
                            "category":"shape", 
                            // "loc":"-1532.0268216255727 9.121091688849674", 
                            "loc":go.Point.stringify(new go.Point(node.containingGroup.__yunPointsX[centerOrderX-1],node.containingGroup.__yunPointsY[centerOrderY-1])), 
                            "movable":true, 
                            "group":-19, 
                            "key": helpers.guid(), 
                            "orderX":10, 
                            "orderY":10, 
                            "gridWidth":gridWidth, 
                            "stroke":shapeStrokes[diff-1],
                             "visible":true, "strokeDashArray":"[0,0]", "strokeWidth":3,
                            //   "desiredSize":"1263 1263"
                            };
                             node.diagram.model.addNodeData(shapeData)
                            node.diagram.model.commitTransaction("addShape");
                            setTimeout(()=>{
                                var nod = node.diagram.findNodeForKey(shapeData.key)
                                console.log("add shape add shape")
                                if(nod){
                                    // nod.visible = true
                                    var obj = nod.findObject("SHAPE")
                                    if(!obj.__prestroke){
                                        obj.__prestroke = obj.stroke
                                        obj.stroke = "rgba(255,0,0,0.5)"
                                    }
                                }
                            },100)
                        }
                    }else{
                        var it = node.containingGroup.findSubGraphParts().iterator;
                        while (it.next()) {
                            var n = it.value;
                            if(n.data.category == "autoText" && n.data.orderX !=null 
                            && n.data.orderY !=null && n.data.role == "freeText" ){
                                // n.findObject("textBorder").visible = false;
                                // if((n.data.orderX == orderX || n.data.orderY == orderY) 
                                // && !(n.data.orderX < orderX && n.data.orderY <orderY )){
                                //     n.areaBackground = "red"
                                // }

                                if(Math.abs(n.data.orderX-centerOrderX) == Math.abs(orderX-centerOrderX)
                                && Math.abs(n.data.orderY-centerOrderY) <= Math.abs(orderY-centerOrderY)
                                ||Math.abs(n.data.orderX-centerOrderX) <= Math.abs(orderX-centerOrderX)
                                && Math.abs(n.data.orderY-centerOrderY) == Math.abs(orderY-centerOrderY)){
                                    // n.findObject("textBorder").visible = true;
                                    // n.findObject("place").visible = false;
                                    n.areaBackground = null
                                    n.zOrder = NaN
                                }

                            }
                            if(n.data.category == "shape" && n.data.role == "background"){
                                var obj = n.findObject("SHAPE")
                                // console.log("dfsdfsdfsdf", obj)
                                if(!showShape){
                                    // n.visible = false
                                    obj.stroke = "rgba(255,0,0,0)"
                                }
                                if(n.data.gridWidth == diff*2){
                                    if(!obj.__prestroke){
                                        obj.__prestroke = obj.stroke
                                        obj.stroke = "rgba(255,0,0,0.7)"

                                    }
                                }else{
                                    
                                    if(obj.__prestroke){
                                        obj.stroke = obj.__prestroke
                                        delete obj.__prestroke
                                    }
                                }
                            }
                        }
                    }

                }

              },
              click: (e, node)=>{
                console.log(node.data)

                // if(node.data.role == "centerText"){
                //     var waveNode = node.diagram.findNodeForKey(node.data.olive)
                //     node.layerName = "Background"
                //     if(waveNode){
                //         node.diagram.select(waveNode)
                //     }
                // }
                // e.diagram.model.startTransaction("click")
                // e.diagram.model.setDataProperty(node.data, "dimKey", -124)
                // e.diagram.model.setDataProperty(node.data,"dimKey", -73)
                // e.diagram.model.setDataProperty(node.data,"dimKey", -141)
                // e.diagram.model.setDataProperty(node.data,"dimKey", -74)




                // e.diagram.model.setDataProperty(node.data, "dimKey", -124)
                // e.diagram.model.setDataProperty(node.data,"dimKey", -141)
                // e.diagram.model.setDataProperty(node.data,"dimKey", -158)
                // e.diagram.model.setDataProperty(node.data,"dimKey", -176)
                // e.diagram.model.setDataProperty(node.data,"dimKey", -73)
                // e.diagram.model.setDataProperty(node.data,"dimKey", -74)
                // e.diagram.model.setDataProperty(node.data,"dimKey", -175)
                // e.diagram.model.setDataProperty(node.data,"dimKey", -177)
                // node.data.dimKey = -124
                // node.data.dimKey = -141
                // node.data.dimKey = -158
                // node.data.dimKey = -176
                // node.data.dimKey = -73
                // node.data.dimKey = -74
                // node.data.dimKey = -175
                // node.data.dimKey = -177
                
                // e.diagram.model.commitTransaction("click")

              },
            //   rotateAdornmentTemplate:  // specify appearance of rotation handle
            //   $(go.Adornment,
            //     { locationSpot: go.Spot.Center },
            //     $(go.Shape, "BpmnActivityLoop",
            //       { width: 12, height: 12, cursor: "pointer",
            //         background: "transparent", stroke: "dodgerblue", strokeWidth: 2 })
            //     ),
              mouseOver: function(e, node) {
                // if(node.data.hyperlink){
                //   var textObj = node.findObject('TEXT');
                //   textObj.isUnderline = true;
                // }
                // console.log("mouseOvermouseOvermouseOver")
                if(node.data.showBorder){
                    if(node.data.text == "" && (node.data.role == "xuText" || node.data.role == "shiText" )){
                        node.findObject("textBorder").visible = true;
                    }
                }
                if(node.data.role == "centerText"){
                    node.layerName = "Background"
                    // node.diagram.model.startTransaction("centerText")
                    // node.diagram.model.setDataProperty(node.data,"layerName", "Background")
                    // node.diagram.model.commitTransaction("centerText")
                }
                //   node.areaBackground = "mediumslateblue"
                // }

                // if(!node.containingGroup) return;
                // var it = node.containingGroup.findSubGraphParts().iterator;
                // while (it.next()) {
                //     var n = it.value;
                //     if(n.data.category == "autoText"){
                //         if(n.data.order == node.data.order){
                //             // locateNode = n;
                //             n.areaBackground = "mediumslateblue"
                //         }
                //     }
                // }
                // diagram.__trtd.showNodeRemarkTips(e, node);
                },
            mouseLeave: function(e, node) {
            //   if(node.data.text == ""){
                if(node.data.showBorder){
                    // if(node.data.text == ""){
                        node.findObject("textBorder").visible = false;
                    // }
                }
                if(node.data.role == "centerText"){
                    node.layerName = "Foreground"
                    // node.diagram.model.startTransaction("centerText")
                    // node.diagram.model.setDataProperty(node.data,"layerName", "Foreground")
                    // node.diagram.model.commitTransaction("centerText")
                }
                // node.areaBackground = null
            //   }
            },
            //   layoutConditions: go.Part.LayoutStandard,
              layoutConditions: go.Part.LayoutStandard & go.Part.LayoutRemoved & go.Part.LayoutAdded & ~go.Part.LayoutNodeSized,
              //layoutConditions:~go.Part.LayoutAdded,
              // fromLinkable: true, toLinkable: true,
              alignment: go.Spot.Center,
              alignmentFocus: go.Spot.Center,
              contextMenu: $(go.Adornment),
              resizeAdornmentTemplate:  // specify what resize handles there are and how they look
              $(go.Adornment, "Spot",
                $(go.Placeholder),  // takes size and position of adorned object
                $(go.Shape, "Circle",  // left resize handle
                  { alignment: go.Spot.Left, cursor: "col-resize",
                    desiredSize: new go.Size(9, 9), fill: "lightblue", stroke: "dodgerblue" }),
                $(go.Shape, "Circle",  // right resize handle
                  { alignment: go.Spot.Right, cursor: "col-resize",
                    desiredSize: new go.Size(9, 9), fill: "lightblue", stroke: "dodgerblue" }),
              $(go.Shape, "Circle",  // right resize handle
              { alignment: go.Spot.Top, cursor: "col-resize",
              desiredSize: new go.Size(9, 9), fill: "lightblue", stroke: "dodgerblue" }),
              $(go.Shape, "Circle",  // right resize handle
              { alignment: go.Spot.Bottom, cursor: "col-resize",
              desiredSize: new go.Size(9, 9), fill: "lightblue", stroke: "dodgerblue" }),
                // $(go.TextBlock, // show the width as text
                //   { alignment: go.Spot.Top, alignmentFocus: new go.Spot(0.5, 1, 0, -2),
                //     stroke: "dodgerblue" },
                //   new go.Binding("text", "adornedObject",
                //                  function(shp) { return shp.naturalBounds.width.toFixed(0); })
                //       .ofObject())
              ),
              doubleClick: function (e, node){
                  e.diagram.__trtd.selectText(e, node)
              }

              // selectionAdornmentTemplate: nodeSelectionAdornmentTemplate,
          },
          new go.Binding("locationSpot", "locationSpot", function(v){
              return go.Spot.parse(v)
          }).makeTwoWay(function(v){
              return go.Spot.stringify(v)
          }),
          new go.Binding("visible", "visible").makeTwoWay(),
          new go.Binding("deletable", "deletable").makeTwoWay(),
          new go.Binding("movable", "movable").makeTwoWay(),
          new go.Binding("rotatable", "rotatable").makeTwoWay(),
          new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
          new go.Binding("isShadowed", "isShadowed").makeTwoWay(),
          new go.Binding("angle", "angle").makeTwoWay(),
          new go.Binding("selectable", "selectable").makeTwoWay(),
          new go.Binding("copyable", "copyable").makeTwoWay(),
          new go.Binding("layerName", "layerName", function(v, d) {
              return v ? v : "";
          }),
          $(go.TextBlock, {
                  name: "TEXT",
                  alignment: new go.Spot(0, 0),
                  font: "18px 'Microsoft YaHei'",
                  editable: false,
                //   areaBackground:"gray",
                  //margin: 3, editable: true,
                //   background:"yellow",
                  stroke: "black",
                  isMultiline: true,
                  overflow: go.TextBlock.OverflowClip,
                  wrap: go.TextBlock.WrapDesiredSize,
                  textAlign: "center",
                  verticalAlignment: go.Spot.Center,
                  spacingAbove: 4,
                  spacingBelow: 4,
                  portId: "TEXT",
                  margin:5,
                  maxSize:new go.Size(600,NaN),
                  minSize: new go.Size(10,10),
                  stretch: go.GraphObject.UniformToFill,
                  textEdited: function(textBlock,oldv,newv){

                    // // if(textBlock.part.containingGroup.data.textAngle == "horizontal"){
                    //   var centerText = textBlock.part.diagram.model.findNodeDataForKey(textBlock.part.data.centerText)
                    //   if(centerText){
                    //     console.log("centerTextcenterTextcenterTextcenterText")
                    var part = textBlock.part
                    if(newv.trim() == "" &&(part.data.role == "shiText" || part.data.role == "xuText")){
                        textBlock.part.diagram.model.startTransaction("text")
                        textBlock.part.diagram.model.setDataProperty(textBlock.part.data,"nloc", null)
                        textBlock.part.diagram.model.commitTransaction("text")
                    }
                    //   }
                    // //   return;
                    // // }
                    // setTimeout(function(){
                    //   console.log("textEditedtextEditedtextEdited",textBlock.lineCount)
                    //   if(!textBlock.text) return;
                    //   if(textBlock.text && textBlock.text.trim() == "") return;
                    //   if(textBlock.lineCount %2 != 0){
                    //     if(newv[newv.length-1] == "\n"){
                    //       textBlock.text = newv.substring(0, newv.length-1)
                    //       return;
                    //     }
                    //     textBlock.text = newv+"\n"
                    //   }
                    // },100)
                    
                    // var enterCount = 0;
                    if(textBlock.part.data.role && textBlock.part.data.role.indexOf("labelText") > -1 ){
                        textBlock.part.containingGroup.layout.isValidLayout = false
                    }
                    // for(var i=0;i<newv.length;i++){
                      
                    // }
                    // textBlock.part.updateTargetBindings()
    
                    // if(textBlock.lineCount %2 != 0){
                    //   if(newv[newv.length-1] == "\n"){
                    //     textBlock.text = newv.substring(0, newv.length-1)
                    //     return;
                    //   }
                    //   textBlock.text = newv+"\n"
                    // }
                  },
              },
              new go.Binding("areaBackground", "isHighlighted", function(h, shape) {
                // node.areaBackground = "RGB(107,208,137)"
                if (h) return "RGBA(146,208,80,0.5)";
                return null
                var c = shape.part.data.color;
                return c ? c : "white";
              }).ofObject(),  // binding source is Node.isHighlighted
              new go.Binding("background", "background", function(v) {
                  return v;
              }).makeTwoWay(),
              new go.Binding("areaBackground", "areaBackground", function(v) {
                  return v;
              }).makeTwoWay(),
              new go.Binding("textAlign", "textAlign", function(v) {
                  return v;
              }).makeTwoWay(),
              new go.Binding("spacingAbove", "spacingline", function(v) {
                  return helpers.tdTransToNum(v, 4);
              }).makeTwoWay(),
              new go.Binding("spacingBelow", "spacingline", function(v) {
                  return helpers.tdTransToNum(v, 4);
              }).makeTwoWay(),
              new go.Binding("maxSize","",function(data,d,m){
                  // console.log("maxSize",v,m,d)
                  var width = NaN
                  var height = NaN
                  if(data.width){
                      width = parseInt(data.width)
                  }
                  if(data.height){
                      height = parseInt(data.height)
                  }

                  return new go.Size(width,height)
              }),
              new go.Binding("minSize","minSize",function(v){
                  // console.log("maxSize",v,m,d)

                  return go.Size.parse(v)
              }),
              // new go.Binding("width", "width", function(v) {
              //     return v;
              // }).makeTwoWay(),
              // new go.Binding("height", "height", function(v) {
              //     return v;
              // }).makeTwoWay(),
              // new go.Binding("height", "height", function (v) {
              //   return v;
              // }).ofObject("SHAPE"),
              new go.Binding("text", "text").makeTwoWay(),
              new go.Binding("stroke", "textStroke").makeTwoWay(),
              new go.Binding("font", "font").makeTwoWay()
          ),
          $(go.Panel,"Vertical",
            {alignment: go.Spot.Left,
            alignmentFocus: go.Spot.Right,
            },
            $(go.Shape,{
                name:"ICON",
                width:16,
                height:16,
                visible: false,
                click: function(e){
                    console.log("icon click")
                },
                figure:"Circle",
                fill:"red",
                strokeWidth:0,
                margin: 3
            },
    
            new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
            new go.Binding("figure", "figure").makeTwoWay(),
            new go.Binding("visible", "iconVisible").makeTwoWay(),
            new go.Binding("fill", "fill", function(v, obj) {
                return v
            }).makeTwoWay()
            )
        ),
        $(go.Shape,"Rectangle",{
            name: "textBorder",
            stroke: "green",
            strokeWidth: 3,
            strokeDashArray: [10, 5],
            visible:false,
            fill:"transparent",
            alignment: go.Spot.Center,
            // alignmentFocus: go.Spot.Right,
            width:100,
            height:270, 
        },
        new go.Binding("stroke","textStroke"),
        new go.Binding("desiredSize","", function(v,d){
            // console.log("vvvvvvvvvvvvv,",v,d)
            if(!helpers.checkPhone()){
                // return new go.Size(Math.max(d.part.naturalBounds.width,100)-3, Math.max(d.part.naturalBounds.height,100)-3);
                return new go.Size(d.part.naturalBounds.width-3, d.part.naturalBounds.height-3);
            }
            var olive = d.part.diagram.findNodeForKey(d.part.data.olive)
            return new go.Size(olive.naturalBounds.width-3, olive.naturalBounds.height);
            // return new go.Size(d.part.actualBounds.width-3, d.part.actualBounds.height-3);
        })
    ),
        $(go.Shape,"Circle",{
            name: "place",
            stroke: "red",
            strokeWidth: 1,
            strokeDashArray: null,
            visible:false,
            fill:"transparent",
            alignment: go.Spot.Center,
            // alignmentFocus: go.Spot.Right,
            width:50,
            height:50, 
        },
        new go.Binding("stroke","placeStroke"),
        ),
        $(
            go.Shape,
            {
              geometryString: "M540.5696 556.81024a81.8176 81.8176 0 0 1-53.0432-19.47648l-225.4848-191.52896a81.92 81.92 0 1 1 106.0864-124.86656l172.4416 146.47296 172.4416-146.47296a81.92 81.92 0 0 1 106.0864 124.86656l-225.4848 191.52896a81.7152 81.7152 0 0 1-53.0432 19.47648z m53.06368 246.23104l225.44384-191.52896a81.92 81.92 0 1 0-106.0864-124.84608l-172.40064 146.47296-172.48256-146.47296a81.92 81.92 0 1 0-106.04544 124.86656l225.52576 191.52896a81.7152 81.7152 0 0 0 53.00224 19.47648c18.88256 0 37.76512-6.49216 53.0432-19.49696z",
                // "M16 0c-8.837 0-16 7.163-16 16s7.163 16 16 16 16-7.163 16-16-7.163-16-16-16zM16 29c-7.18 0-13-5.82-13-13s5.82-13 13-13 13 5.82 13 13-5.82 13-13 13zM12 8c-1.105 0-2 0.895-2 2s0.895 2 2 2h5.172l-8.586 8.586c-0.781 0.781-0.781 2.047 0 2.829 0.39 0.39 0.902 0.586 1.414 0.586s1.024-0.195 1.414-0.586l8.586-8.586v5.172c0 1.105 0.895 2 2 2s2-0.895 2-2v-12h-12z",
              visible: false,
              name: "figure",
              cursor: "pointer",
              alignment: new go.Spot(1,0,5,-5),
              alignmentFocus: go.Spot.RightCenter,
              width: 14,
              height: 14,
              fill: "green",
              toolTip: $(
                "ToolTip",
                $(
                  go.Panel,
                  "Vertical",
                  $(
                    go.Picture,
                    new go.Binding("source", "src", function(s) {
                      return "images/" + s + ".png";
                    })
                  ),
                  $(go.TextBlock, {text:"进入子盘", margin: 3 })
                )
              ),
              click: function(e) {
                console.log("click figure", e);
                var node = e.targetObject.part;
                e.diagram.__trtd.openFigure({
                  figure: node.data.figure,
                  title: node.data.text,
                  key: node.data.key,
                  node: node
                });
              }
            },
            // new go.Binding("geometry", "geo", function(){
    
            // })),
            new go.Binding("visible", "figure", function(v) {
              console.log("----------------------");
              if (v) {
                return true;
              } else {
                return false;
              }
            })
          )
      )
    }
}

module.exports = AutoTextTemplate
