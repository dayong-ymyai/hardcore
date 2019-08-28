    // define a custom grid layout that makes sure the length of each lane is the same
    // and that each lane is broad enough to hold its subgraph
    function AxisGroupLayout() {
        go.Layout.call(this);
        // go.GridLayout.call(this);
        // this.cellSize = new go.Size(1, 1);
        // this.wrappingColumn = Infinity;
        // this.wrappingWidth = Infinity;
        // this.spacing = new go.Size(0, 0);
        // this.alignment = go.GridLayout.Position;
      }
      go.Diagram.inherit(AxisGroupLayout, go.Layout);
  
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
      AxisGroupLayout.prototype.doLayout = function(coll) {
          console.log("AxisGroupLayout.doLayout")
        var diagram = this.diagram;
        diagram.startTransaction("AxisGroupLayout")
          // COLL might be a Diagram or a Group or some Iterable<Part>
         
        var it = this.collectParts(coll).iterator;
        var collection = []
        var dataCollection =[]
        var group = this.group
        // group.location = new go.Point(0,0)
        var maxWidth = 0;
        var maxHeight = 0;
        var centerLine, axisX, axisY,axisXText, axisYText, themeText, labelText1,labelText2,labelText3,labelGroup,waveGroup
        var shiTextColl = []
        var xuTextColl = []
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
            
            
            if (node.data.category == "line") {
                if(node.data.role == "centerLine"){
                  centerLine = node;
                }
            }
            if (node.data.group == group.key) {
            // position the node . . .
                if(node.data.category == "line"){
                    if(node.data.role == "axisX") {
                      node.angle = 0;
                      axisX = node
                    };
                    if(node.data.role == "axisY") {
                      axisY = node
                      node.angle = 270;
                    }
                    node.location = group.location.copy().offset(0,0)
                    // node.angle = 270
                }
                if(node.data.category == "waveGroup"){
                    waveGroup = node;
                    // node.angle = group.angle
                    oliveWidth = node.data.oliveWidth
                    oliveHeight = node.data.oliveHeight
                    node.location = group.location.copy().offset(0,0)
                    // node.layout.isOngoing = true;
                    // node.layout.isValidLayout = false;
                    // collection.push(node)
                }

            }
        }
        console.log(`maxHeight:${maxHeight},maxWidth:${maxWidth}`)
        // line.width = 2000
        // line.height = 4
        if(axisY) {
          axisY.angle = 270;
        }
        if(axisX) {
          axisX.angle = 0
        }
        if(waveGroup){
          // var x1 = centerLine.width * Math.cos(Math.abs(360-centerLine.angle%360) / 180 * Math.PI)
          console.log(`waveGroup.width:${waveGroup.width}`)
          var x1 = waveGroup.resizeObject.width * Math.cos(Math.abs(360-waveGroup.angle%360) / 180 * Math.PI)
          var y1 = 10
          var x2 = waveGroup.resizeObject.width * Math.sin(Math.abs(360-waveGroup.angle%360)/ 180 * Math.PI)
          var y2 = 10
          // axisX.desiredSize = new go.Size(x1, y1)
          // axisY.desiredSize = new go.Size(x2, y2)
          this.diagram.model.setDataProperty(axisX.data, "desiredSize",`${x1} ${y1}`)
          this.diagram.model.setDataProperty(axisY.data, "desiredSize",`${x2} ${y2}`)
          // this.diagram.model.setDataProperty(group.data, "desiredSize",`${x1} ${x2}`)

          group.width = x1
          group.height = x2
          var shiStroke = waveGroup.data.shiStroke
          var xuStroke = waveGroup.data.xuStroke
          var centerStroke = waveGroup.data.centerStroke || "#3f5369"
          if(axisXText){
            axisXText.location = group.location.copy().offset(x1, 0)
            axisXText.locationSpot = go.Spot.Top
          }
          if(axisYText){
            axisYText.location = group.location.copy().offset(-10, -x2)
            axisYText.locationSpot = go.Spot.Right
          }
          // this.diagram.model.setDataProperty(axisY.data, "desiredSize",axisY.width)
        }

 
        if(themeText){
          // themeText.location = group.location.copy().offset(0, 0)
          // themeText.locationSpot = new go.Spot(0.7,0,0,0)
        }
        // if(labelText1){
        //   labelText1.location = group.location.copy().offset(0, -x2).offset(40,10)
        // }
        // if(labelText2){
        //   labelText2.location = group.location.copy().offset(0, -x2).offset(40,80)
        // }
        // if(labelText3){
        //   labelText3.location = group.location.copy().offset(0, -x2).offset(40,150)
        // }
        if(labelGroup){
          var itl = labelGroup.findSubGraphParts().iterator;
          while (itl.next()) {
            var n = itl.value;
            if(n.data.role == "labelText1"){
              labelText1 = n
            }
            if(n.data.role == "labelText2"){
              labelText2 = n
            }
            if(n.data.role == "labelText3"){
              labelText3 = n
            }
          }
          if(waveGroup){
            waveGroup.labelText1 = labelText1
            waveGroup.labelText2 = labelText2
            waveGroup.labelText3 = labelText3
          }
          // var tmp1 = group.location.copy().offset(0, -x2).offset(30,0)
          // labelGroup.location = tmp1
          // labelGroup.diagram.model.setDataProperty(labelGroup.data,"loc",go.Point.stringify(tmp1))
          // setTimeout(()=>{
          //   diagram.startTransaction("labelGroup");
          //   labelGroup.layout.isOngoing = true;
          //   labelGroup.layout.isValidLayout = false;
          //   diagram.commitTransaction("labelGroup");
          // },350)
          // labelGroup.location = group.location.copy().offset(0, -x2).offset(40,10)
        }
        if(shiStroke && labelText1){
          this.diagram.model.setDataProperty(labelText1.data, "fill",shiStroke)
        }
        if(xuStroke && labelText2){
          this.diagram.model.setDataProperty(labelText2.data, "fill",xuStroke)
        }
        if(centerStroke && labelText3){
          this.diagram.model.setDataProperty(labelText3.data, "fill",centerStroke)
        }
        // collection.sort(function(a,b){
        //     return a.data.order > b.data.order
        // })
        // shiTextColl.sort(function(a,b){
        //     return a.data.order > b.data.order
        // })
        // xuTextColl.sort(function(a,b){
        //     return a.data.order > b.data.order
        // })
        // for(var i=0;i<xuTextColl.length;i++){
        //   xuTextColl[i].location = computeNewRotateLoc(collection[i].location, collection[i].location.copy().offset(collection[i].width/2,collection[i].height/2),collection[i].angle)
        // }
        // collection.forEach(function(obj){
        //     obj.location = group.location.copy().offset(300*(obj.data.order-1),0)
        //     // obj.location = new go.Point(300*(obj.data.order-1),0)
        //     // obj.
        //     // var group = a.findNodeDataForKey(m.group)
        //     obj.location = computeNewRotateLoc(group.location, obj.location, obj.angle)
        // })
        go.Layout.prototype.doLayout.call(this, coll);
        diagram.commitTransaction("AxisGroupLayout");
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

      module.exports = AxisGroupLayout