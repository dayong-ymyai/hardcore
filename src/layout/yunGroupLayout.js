    // define a custom grid layout that makes sure the length of each lane is the same
    // and that each lane is broad enough to hold its subgraph
    function YunGroupLayout() {
        go.Layout.call(this);
        // go.GridLayout.call(this);
        // this.cellSize = new go.Size(1, 1);
        // this.wrappingColumn = Infinity;
        // this.wrappingWidth = Infinity;
        // this.spacing = new go.Size(0, 0);
        // this.alignment = go.GridLayout.Position;
      }
      go.Diagram.inherit(YunGroupLayout, go.Layout);
  
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
      YunGroupLayout.prototype.doLayout = function(coll) {
          console.log("YunGroupLayout.doLayout")
        var diagram = this.diagram;
        diagram.startTransaction("YunGroupLayout")
          // COLL might be a Diagram or a Group or some Iterable<Part>
         
        var it = this.collectParts(coll).iterator;
        var collection = []
        var dataCollection =[]
        var group = this.group
        var gridWidth = group.data.gridWidth
        var gridHeight = group.data.gridHeight
        // group.location = new go.Point(0,0)
        var maxWidth = 0;
        var maxHeight = 0;
        var centerLine, axisX, axisY,axisXText, axisYText, themeText, labelText1,labelText2,labelText3,labelGroup,waveGroup
        var shiTextColl = []
        var xuTextColl = []
        var verticalLines = []
        var horizontalLines = []
        var freelLines = []
        var allLines = []
        var freeTexts = []
        var shapeNodes = []
        var snapType = group.data.snapType || "grid"
        var showShape = group.data.showShape; // 是否显示矩形
        var beginSpark = group.data.beginSpark; // 是否开始火花
        var shapeStrokes = group.data.shapeStrokes; // 是否开始火花
        var oliveWidth
        var oliveHeight
        while (it.next()) {
            var node = it.value;
                // var item = git.value;
            //   console.log("item:",item)

            dataCollection.push(node.data)
            if(node.data.category == "wave"){
                collection.push(node)
            }
            if(!(node instanceof go.Node)){
              continue;
            }
            
            if(node.data.role == "background"){
              shapeNodes.push(node)
            }
            // 处理文本节点的位置和定位位置
            // if(node.data.category == "text"){
              if(node.data.role == "axisYText"){
                axisYText = node;
              }
              if(node.data.role == "axisXText"){
                axisXText = node;
              }
              if(node.data.role == "themeText"){
                themeText = node;
              }
              if(node.data.role == "shiText"){
                shiTextColl.push(node)
              }
              if(node.data.role == "xuText"){
                xuTextColl.push(node)
              }
            // }
            // 处理label文本节点的位置和定位位置
            // if(node.data.category == "iconText"){
              if(node.data.role == "labelText1"){
                labelText1 = node;
              }
              if(node.data.role == "labelText2"){
                labelText2 = node;
              }
              if(node.data.role == "labelText3"){
                labelText3 = node;
              }
              if(node.data.role == "labelGroup"){
                labelGroup = node;
              }
            // }

              if(node.naturalBounds.width > maxWidth){
                maxWidth = node.naturalBounds.width;
              }
              if(node.naturalBounds.height > maxHeight){
                maxHeight = node.naturalBounds.height;
              }
            
            
              if(node.data.role == "freeText"){
                freeTexts.push(node);
              }
            if (node.data.category == "line") {

                allLines.push(node)
                if(node.data.role == "verticalLine"){
                  verticalLines.push(node);
                }
                if(node.data.role == "horizontalLine"){
                  horizontalLines.push(node);
                }
                if(node.data.role == "freelLine"){
                  freelLines.push(node);
                }
            }
            if (node.data.group == group.key) {
            // position the node . . .
                if(node.data.category == "line"){
                    if(node.data.role == "axisX") {
                      node.angle = 0;
                      axisX = node
                      node.location = group.location.copy().offset(0,0)
                    };
                    if(node.data.role == "axisY") {
                      axisY = node
                      node.angle = 270;
                      node.location = group.location.copy().offset(0,0)
                    }
                    // node.angle = 270
                }
                // if(node.data.category == "waveGroup"){
                //     waveGroup = node;
                //     // node.angle = group.angle
                //     oliveWidth = node.data.oliveWidth
                //     oliveHeight = node.data.oliveHeight
                //     node.location = group.location.copy().offset(0,0)
                //     // node.layout.isOngoing = true;
                //     // node.layout.isValidLayout = false;
                //     // collection.push(node)
                // }

            }
        }
        console.log(`maxHeight:${maxHeight},maxWidth:${maxWidth}`)



        verticalLines.sort(function(a,b){
            return a.data.order - b.data.order
        })
        horizontalLines.sort(function(a,b){
            return a.data.order - b.data.order
        })
        freelLines.sort(function(a,b){
            return a.data.order - b.data.order
        })

        if(snapType == "between"){
          var x1 = verticalLines.length*gridWidth+gridWidth
          var x2 = horizontalLines.length*gridHeight+gridHeight
        }else{
          var x1 = verticalLines.length*gridWidth
          var x2 = horizontalLines.length*gridHeight
        }

        var allPointsX = [];
        var allPointsY = [];
        var centerOrderX = (horizontalLines.length+1)/2
        var centerOrderY = (verticalLines.length+1)/2
        allLines.forEach(function(obj, index){
          // obj.diagram.model.setDataProperty(obj.data, "strokeWidth",1)
          // obj.diagram.model.setDataProperty(obj.data, "stroke","rgba(0,0,0,0.3)")
          if( obj.data.role == "axisX" ||  obj.data.role == "axisY") return;
          // if(obj.data.subRole == "dim"){
          //   obj.diagram.model.setDataProperty(obj.data, "strokeDashArray","[0, 0]")
          //   obj.diagram.model.setDataProperty(obj.data, "strokeWidth",3)
          //   obj.diagram.model.setDataProperty(obj.data, "stroke","RGBA(164, 177, 198, 1)")
          // }else{
          //   obj.diagram.model.setDataProperty(obj.data, "strokeDashArray","[15, 10]")
          //   obj.diagram.model.setDataProperty(obj.data, "strokeWidth",1)
          //   obj.diagram.model.setDataProperty(obj.data, "stroke","rgba(0,0,0,0.3)")
          // }
        })

        verticalLines.forEach(function(obj,index){
          var newOrder = index+1;
          obj.diagram.model.setDataProperty(obj.data,"order", newOrder)
          obj.location = group.location.copy().offset(gridWidth*(newOrder),0)
          obj.angle = 270;
          obj.diagram.model.setDataProperty(obj.data, "desiredSize",`${x2+20} 10`)
          // obj.diagram.model.setDataProperty(obj.data, "showArrow",false)
          // obj.diagram.model.setDataProperty(obj.data, "selectable",false)
          if(snapType == "between"){
            if(newOrder < centerOrderX){
              allPointsX.push(obj.location.x-gridWidth/2)
            }
            if(newOrder == centerOrderX){
              allPointsX.push(obj.location.x)
            }
            if(newOrder > centerOrderX){
              allPointsX.push(obj.location.x+gridWidth/2)
            }
          }else{
            allPointsX.push(obj.location.x)
          }


          // obj.diagram.model.setDataProperty(obj.data, "strokeWidth",1)
          // obj.diagram.model.setDataProperty(obj.data, "stroke","rgba(0,0,0,0.3)")
          // obj.diagram.model.setDataProperty(obj.data, "strokeDashArray","[10, 5]")
        })
        horizontalLines.forEach(function(obj,index){
          var newOrder = index+1;
          obj.diagram.model.setDataProperty(obj.data,"order", newOrder)
          obj.location = group.location.copy().offset(0,-gridHeight*(newOrder))
          obj.angle = 0;
          obj.diagram.model.setDataProperty(obj.data, "desiredSize",`${x1+20} 10`)
          // obj.diagram.model.setDataProperty(obj.data, "showArrow",false)
          // obj.diagram.model.setDataProperty(obj.data, "selectable",false)
          if(snapType == "between"){
            if(newOrder < centerOrderY){
              allPointsY.push(obj.location.y+gridHeight/2)
            }
            if(newOrder == centerOrderY){
              allPointsY.push(obj.location.y)
            }
            if(newOrder > centerOrderY){
              allPointsY.push(obj.location.y-gridHeight/2)
            }
          }else{
              allPointsY.push(obj.location.y)
          }
          // obj.diagram.model.setDataProperty(obj.data, "strokeWidth",1)
          // obj.diagram.model.setDataProperty(obj.data, "stroke","rgba(0,0,0,0.3)")
          // obj.diagram.model.setDataProperty(obj.data, "strokeDashArray","[10, 5]")
        })
        // allPointsX.unshift(allPointsX[0]-gridWidth)
        // allPointsX.push(allPointsX[allPointsX.length-1]+gridWidth)
        // allPointsY.unshift(allPointsY[0]-gridLength)
        // allPointsY.push(allPointsY[allPointsY.length-1]+gridLength)
        this.group.__yunPointsX = allPointsX
        this.group.__yunPointsY = allPointsY
        freelLines.forEach(function(obj,index){
          // var newOrder = index+1;
          // obj.diagram.model.setDataProperty(obj.data,"order", newOrder)
          // obj.location = new go.Point(allPointsX[9], allPointsY[9])
          // obj.angle = 315;
          // obj.diagram.model.setDataProperty(obj.data, "desiredSize",`${gridWidth*20-5} 10`)
          // obj.diagram.model.setDataProperty(obj.data, "showArrow",false)
          // obj.diagram.model.setDataProperty(obj.data, "selectable",true)
          // obj.diagram.model.setDataProperty(obj.data, "strokeWidth",1)
          // obj.diagram.model.setDataProperty(obj.data, "zOrder",10)
          // obj.diagram.model.setDataProperty(obj.data, "showArrow",true)
          // obj.diagram.model.setDataProperty(obj.data, "showBeginArrow",true)
          // obj.diagram.model.setDataProperty(obj.data, "showEndArrow",true)
          // obj.diagram.model.setDataProperty(obj.data, "locationSpot",`0.5 0.5 0 0`)
          // obj.diagram.model.setDataProperty(obj.data, "stroke","rgba(0,0,0,0.3)")
          // obj.diagram.model.setDataProperty(obj.data, "strokeDashArray","[5, 5]")
          // obj.diagram.model.setDataProperty(obj.data, "selectable",false)
        })



        shapeNodes.forEach(function(obj,index){
          obj.diagram.model.setDataProperty(obj.data, "visible",true)
          if(!showShape){
            obj.diagram.model.setDataProperty(obj.data, "stroke", "rgba(255,0,0,0)")
          }else{
            try{
              obj.diagram.model.setDataProperty(obj.data, "stroke", shapeStrokes[obj.data.gridWidth/2-1])
            }catch(e){
              console.log(e)
            }
          }
            if(obj.data.desiredSize){
              return;
            }
            obj.data.orderX = centerOrderX
            obj.data.orderY = centerOrderY
            obj.location = new go.Point(allPointsX[obj.data.orderX-1], allPointsY[obj.data.orderY-1])
            var shapeWidth = obj.data.gridWidth||2;
            if(snapType == "between"){
              var desiredSize = new go.Size(gridWidth*(shapeWidth-1), gridHeight*(shapeWidth-1))
              obj.diagram.model.setDataProperty(obj.data, "strokeWidth", gridWidth)
            }else{
              var desiredSize = new go.Size(gridWidth*shapeWidth+3, gridHeight*shapeWidth+3)
              obj.diagram.model.setDataProperty(obj.data, "strokeWidth", 3)
            }
            // obj.desiredSize = desiredSize;
            obj.diagram.model.setDataProperty(obj.data, "desiredSize",go.Size.stringify(desiredSize))
            // obj.diagram.model.setDataProperty(obj.data, "visible",true)
            obj.diagram.model.setDataProperty(obj.data, "strokeDashArray","[0,0]")
            
        })

        // var dist = Math.max(gridHeight,gridWidth)
        freeTexts.forEach(function(obj,index){
          // var newOrder = index+1;
          // obj.diagram.model.setDataProperty(obj.data,"order", newOrder)
          // obj.location = group.location.copy()
          // obj.angle = 315;
          // obj.diagram.model.setDataProperty(obj.data, "desiredSize",`${x1+20} 10`)
          // obj.diagram.model.setDataProperty(obj.data, "minSize",`60 50`)
          // obj.diagram.model.setDataProperty(obj.data, "width",`${gridWidth-10}`)
          // obj.diagram.model.setDataProperty(obj.data, "height",`${gridHeight-10}`)
          // obj.diagram.model.setDataProperty(obj.data, "width",`${gridWidth*3}`)
          // delete obj.data.width
          // obj.diagram.model.setDataProperty(obj.data, "textAlign",`center`)
          // obj.diagram.model.setDataProperty(obj.data, "locationSpot",`0.5 0.5 0 0`)
          // obj.diagram.model.setDataProperty(obj.data, "strokeDashArray","[10, 5]")
          // obj.diagram.model.setDataProperty(obj.data, "font", group.__trtdNode.defaultTextFont)

      // if(node.__yunPointsY && node.__yunPointsX){
      //       for(var i=0;i<allPointsX.length;i++){
      //         if(obj)
      //       }
      //    }
      // if(obj.data.text.indexOf("自由文本") >-1){
      //   console.log("ddd",obj.data.text)
      //   var order = obj.data.text.replace("自由文本","").split(",")
      //   if(order.length == 2){
      //     obj.data.orderX = order[0]
      //     obj.data.orderY = order[1]
      //     obj.location = new go.Point(allPointsX[obj.data.orderX-1], allPointsY[obj.data.orderY-1])
      //   }
      // }

        // if(obj.data.text.length == 1){
        //   if(obj.data.subRole == null){
        //     obj.diagram.model.setDataProperty(obj.data, "subRole","coreText")
        //     obj.diagram.model.setDataProperty(obj.data, "deletable", false)
        //   }
        // }

        // if(obj.data.text.indexOf("维度") >-1){
        //   console.log("ddd",obj.data.text)
        //   // var order = obj.data.text.replace("维度","").split(",")
        //   obj.diagram.model.setDataProperty(obj.data, "subRole","dimText")
        //   // obj.diagram.model.setDataProperty(obj.data, "dimKey", null)
        //   delete obj.data.dimKey
        //   obj.diagram.model.setDataProperty(obj.data, "deletable", false)
        //   // obj.diagram.model.setDataProperty(obj.data, "width", null)
        //   // obj.diagram.model.setDataProperty(obj.data, "height", null)
        // }
          obj.areaBackground = null
          // obj.diagram.model.setDataProperty(obj.data, "height", null)
          // obj.diagram.model.setDataProperty(obj.data, "width", null)
          // obj.findObject("place").visible = false;
          // console.log("verticalLines.length+1)/2verticalLines.length+1)/2",(verticalLines.length+1)/2)
          if(group.data.autoSnapText){
            // 计算普通文字位置
            if(obj.data.orderX && obj.data.orderY){
              obj.location = new go.Point(allPointsX[obj.data.orderX-1], allPointsY[obj.data.orderY-1])
              
              obj.location = new go.Point(allPointsX[obj.data.orderX-1], allPointsY[obj.data.orderY-1])
            }
            // 计算维度文字位置
            if(obj.data.subRole == "dimText" && obj.data.dimX!=null && obj.data.dimY!=null){
              console.log("dimText")
              var dimXLoc, dimYLoc;
              dimXLoc = allPointsX[obj.data.dimX-1]
              dimYLoc = allPointsY[obj.data.dimY-1]

              if(obj.data.dimX >= allPointsX.length){
                dimXLoc = allPointsX[allPointsX.length-1]+gridWidth
                // if(snapType != "between"){
                //   dimXLoc += gridWidth/3
                // }
              }
              if(obj.data.dimY >= allPointsY.length){
                dimYLoc = allPointsY[allPointsY.length-1]-gridHeight
                // if(snapType != "between"){
                //   dimYLoc -= gridHeight/3
                // }
              }
              if(obj.data.dimX <= 0){
                dimXLoc = allPointsX[0]-gridWidth
                if(snapType != "between"&& obj.data.dimY < allPointsY.length){
                  dimXLoc -= gridWidth/2
                }
              }
              if(obj.data.dimY <= 0){
                dimYLoc = allPointsY[0]+gridHeight
                if(snapType != "between" && obj.data.dimX < allPointsX.length){
                  dimYLoc += gridHeight/2
                }
              }
              obj.location = new go.Point(dimXLoc, dimYLoc)
            }
          }
          if(obj.data.subRole != "themeText" && obj.data.orderY == centerOrderY||obj.data.dimY == centerOrderY){
            // console.log("Ddddddd")
            obj.diagram.model.setDataProperty(obj.data, "width",gridWidth-10)
            // delete obj.data.height
            obj.diagram.model.setDataProperty(obj.data, "height", null)
          }
          if(obj.data.subRole != "themeText" && obj.data.orderX == centerOrderX || obj.data.dimX == centerOrderX ){
            // console.log("Ddddddd")
            obj.diagram.model.setDataProperty(obj.data, "height",gridHeight-10)
            obj.diagram.model.setDataProperty(obj.data, "width", null)
            // delete obj.data.width
          }

          if(Math.abs(obj.data.orderX-centerOrderX) == 1 && Math.abs(obj.data.orderY-centerOrderY) == 1){
            // 中心节点
            if(snapType != "between"){
              obj.diagram.model.setDataProperty(obj.data, "width",gridWidth-10)
              obj.diagram.model.setDataProperty(obj.data, "height",gridHeight-10)
            }
          }

          if(Math.abs(obj.data.orderX-centerOrderX) == 0 && Math.abs(obj.data.orderY-centerOrderY) == 0){
            // 中心节点
            // obj.diagram.model.setDataProperty(obj.data, "textStroke",`red`)
            // obj.diagram.model.setDataProperty(obj.data, "deletable", false)
            // obj.diagram.model.setDataProperty(obj.data, "subRole", "themeText")
            // obj.diagram.model.setDataProperty(obj.data, "height",`${gridHeight-10}`)
            // if(snapType == "between"){
            //   obj.diagram.model.setDataProperty(obj.data, "width",gridWidth+gridWidth-10)
            //   obj.diagram.model.setDataProperty(obj.data, "height",gridHeight+gridHeight-10)
            // }else{
            //   obj.diagram.model.setDataProperty(obj.data, "width",gridWidth-10)
            //   obj.diagram.model.setDataProperty(obj.data, "height",gridHeight-10)
            // }
          }
          // else{
          //   // var list = verticalLines[0].layer.findObjectsNear(obj.location, dist)
          //   // console.log("list",list)
          //   var x=obj.location.x,y=obj.location.y, xi,yi;
          //     for(var i=0;i<allPointsX.length;i++){
          //       if(x<allPointsX[i]){
          //         x = allPointsX[i]
          //         xi = i
          //         break;
          //       }
          //     }
          //     for(var i=0;i<allPointsY.length;i++){
          //       if(y<=allPointsY[i]){
          //         y = allPointsY[i]
          //         yi = i;
          //         break;
          //       }
          //     }

          //     if(x != -9000 && y != 9000){
          //       obj.location = new go.Point(x, y)
          //       obj.data.orderX = xi + 1;
          //       obj.data.orderY = yi + 1;
          //     }
          //     console.log("sdfdsfsd")
          // }

          // obj.diagram.model.setDataProperty(obj.data, "selectable",false)
        })

        if(axisXText){
          // axisXText.location = group.location.copy().offset(x1+30, 0)
          // axisXText.locationSpot = go.Spot.Top
        }
        if(axisYText){
          // axisYText.location = group.location.copy().offset(-10, -(x2+30))
          // axisYText.locationSpot = go.Spot.Right
        }
        if(axisY) {
          axisY.angle = 270;
          this.diagram.model.setDataProperty(axisY.data, "desiredSize",`${x2+30} 10`)
        }
        if(axisX) {
          axisX.angle = 0
          this.diagram.model.setDataProperty(axisX.data, "desiredSize",`${x1+30} 10`)
        }
        // line.width = 2000
        // line.height = 4
        group.width = x1+gridWidth*2
        group.height = x2+gridHeight*2
        // group.location = group.location.copy().offset(-gridWidth, gridHeight)
        // this.diagram.model.setDataProperty(group.data, "loc",go.Point.stringify(group.location.copy().offset(-gridWidth, gridHeight)))
        go.Layout.prototype.doLayout.call(this, coll);
        diagram.commitTransaction("YunGroupLayout");
        // diagram.updateAllTargetBindings()
        return;
        // return;
        // var diagram = this.diagram;
        if (diagram === null) return;
        diagram.startTransaction("PoolLayout");
        // make sure all of the Group Shapes are big enough
        // var minsize = computeMinPoolSize();
        // diagram.findTopLevelGroups().each(function(lane) {
        //   if (!(lane instanceof go.Group)) return;
        //   var shape = lane.selectionObject;
        //   if (shape !== null) {  // change the desiredSize to be big enough in both directions
        //     var sz = computeLaneSize(lane);
        //     shape.width = (!isNaN(shape.width)) ? Math.max(shape.width, sz.width) : sz.width;
        //     shape.height = (isNaN(shape.height) ? minsize.height : Math.max(shape.height, minsize.height));
        //     var cell = lane.resizeCellSize;
        //     if (!isNaN(shape.width) && !isNaN(cell.width) && cell.width > 0) shape.width = Math.ceil(shape.width / cell.width) * cell.width;
        //     if (!isNaN(shape.height) && !isNaN(cell.height) && cell.height > 0) shape.height = Math.ceil(shape.height / cell.height) * cell.height;
        //   }
        // });
        // now do all of the usual stuff, according to whatever properties have been set on this GridLayout
        go.GridLayout.prototype.doLayout.call(this, coll);
        diagram.commitTransaction("PoolLayout");
      };
      // end PoolLayout class

      module.exports = YunGroupLayout