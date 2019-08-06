    var helpers = require('../helpers/helpers.gojs')

    
    function adustOliveText(d){
            setTimeout(function(){
              try{
                console.log("check overflow")
                if(!d.text) return;
                if(d.text && d.text.trim() == "") return;
                if(d.lineCount %2 != 0){
                  if(d.text[d.text.length-1] == "\n"){
                    d.text = d.text.substring(0, d.text.length-1)
                    return;
                  }
                  d.text = d.text+"\n"
                }
                // if(d && d.lineCount!=null && d.lineCount%2 != 0){
                //   if(d.text && d.text[d.text.length-1] != "\n"){
                //     d.text+="\n"
                //   }
                // }
              }catch(e){
                console.error(e)
              }
            },100)
    }


    function adjustTextAngle(obj, shi, xu, group){
        var groupTextAngle = group.data.textAngle|| "vertical" // "vertical"
        var textAngle;
        if(obj.data.order%2==0){ // 偶数
            // 偶数实线在上
            if(shi){

                if(!shi.data.nangle){
                    textAngle = groupTextAngle
                }else{
                    textAngle = shi.data.textAngle || groupTextAngle
                }
                // if(!shi.data.nloc){
                //     shi.location = obj.location.copy().offset(obj.naturalBounds.width/2, -obj.naturalBounds.height/2)
                // }
                if(textAngle == "horizontal"){
                    // if(!shi.data.nloc){
                        shi.locationSpot = new go.Spot(1, 1, 0, 0)
                    // }
                    shi.angle = 0
                    // 
                    // if(shi.data.textAlign == null){
                        // shi.findObject("TEXT").textAlign = "center";
                        // }
                    }
                    shi.__location = obj.location.copy().offset(obj.naturalBounds.width/2, 0)
                    shi.__location = computeNewRotateLoc(group.location, shi.__location, obj.angle)
                    if(!shi.data.nloc){
                        shi.location = obj.location.copy().offset(obj.naturalBounds.width/2, -obj.naturalBounds.height/2)
                        shi.location = computeNewRotateLoc(group.location, shi.location, obj.angle)
                        // shi.location = shi.__location.copy()
                        // delete shi.__offset
                        delete shi.__switchOrder
                    }else{
                        
                        if(!shi.__offset){
                            shi.__offset = shi.__location.copy().subtract(shi.location)
                        }else{
                            shi.location = shi.__location.copy().subtract(shi.__offset)
                            // if(shi.__switchOrder){
                            //     shi.__offset.x = -shi.__offset.x
                            //     shi.__offset.y = -shi.__offset.y
                            //     shi.location = shi.__location.copy().subtract(shi.__offset)
                            //     delete shi.__switchOrder
                            //     shi.__offset = shi.__location.copy().subtract(shi.location)
                            // }else{
                            //     shi.location = shi.__location.copy().subtract(shi.__offset)
                            // }
                            // xu.location = xu.__location.copy().offset(-Math.abs(xu.__offset.x), -Math.abs(xu.__offset.y))
                            // xu.location = xu.__location.copy().subtract(xu.__offset)
                        }
                    }
                if(textAngle == "vertical"){
                    // if(!shi.data.nloc){
                        shi.locationSpot = new go.Spot(0.5, 1, 0, 0)
                    // }
                    shi.angle = obj.angle
                    // if(shi.data.textAlign == null){
                        // obj.diagram.model.setDataProperty(shi.data,"textAlign", "left")
                        // shi.findObject("TEXT").textAlign = "center";
                    // }
                        
                }
            }
            if(xu){
                if(!xu.data.nangle){
                    textAngle = groupTextAngle
                }else{
                    textAngle = xu.data.textAngle || groupTextAngle
                }

                if(textAngle == "horizontal"){
                    // if(!xu.data.nloc){
                        xu.locationSpot = new go.Spot(0, 0, 0, 0)
                    // }
                    xu.angle = 0
                    // obj.diagram.model.setDataProperty(xu.data,"textAlign", "left")
                    // if(xu.data.textAlign == null){
                        // xu.findObject("TEXT").textAlign = "center"
                    // }
                }
                console.log("xuxuxuxuxxuxu", xu.data.order)
                xu.__location = obj.location.copy().offset(obj.naturalBounds.width/2, 0)
                xu.__location = computeNewRotateLoc(group.location, xu.__location, obj.angle)
                if(!xu.data.nloc){
                    xu.location = obj.location.copy().offset(obj.naturalBounds.width/2, obj.naturalBounds.height/2)
                    xu.location = computeNewRotateLoc(group.location, xu.location, obj.angle)
                    // xu.location = xu.__location.copy()
                    // delete xu.__offset
                    delete xu.__switchOrder
                }else{
                    
                    if(!xu.__offset){
                        xu.__offset = xu.__location.copy().subtract(xu.location)
                    }else{
                        xu.location = xu.__location.copy().subtract(xu.__offset)
                        // if(xu.__switchOrder){
                        //     xu.__offset.x = -xu.__offset.x
                        //     xu.__offset.y = -xu.__offset.y
                        //     xu.location = xu.__location.copy().subtract(xu.__offset)
                        //     delete xu.__switchOrder
                        //     xu.__offset = xu.__location.copy().subtract(xu.location)
                        // }else{
                        //     xu.location = xu.__location.copy().subtract(xu.__offset)
                        // }
                        // xu.location = xu.__location.copy().offset(-Math.abs(xu.__offset.x), -Math.abs(xu.__offset.y))
                        // xu.location = xu.__location.copy().subtract(xu.__offset)
                    }
                }
                // if(xu.data.key == "9fe41098-8d5a-e18f-b79a-b4693eacd39d"){
                //     console.log(`location: ${go.Point.stringify(xu.location)}
                //     __location: ${go.Point.stringify(xu.__location)}
                //     __offset: ${go.Point.stringify(xu.__offset)}
                //     `)
                // }
                if(textAngle == "vertical"){
                    // if(!xu.data.nloc){
                        xu.locationSpot = new go.Spot(0.5, 0, 0, 0)
                    // }
                    xu.angle = obj.angle
                    // obj.diagram.model.setDataProperty(xu.data,"textAlign", "left")
                    // if(xu.data.textAlign == null){
                        // xu.findObject("TEXT").textAlign = "center"
                    // }
                }

            }
        }else{ // 奇数
            // 奇数实线在下
            if(shi){
                if(!shi.data.nangle){
                    textAngle = groupTextAngle
                }else{
                    textAngle = shi.data.textAngle || groupTextAngle
                }
                shi.__location = obj.location.copy().offset(obj.naturalBounds.width/2, 0)
                shi.__location = computeNewRotateLoc(group.location, shi.__location, obj.angle)
                if(!shi.data.nloc){
                    shi.location = obj.location.copy().offset(obj.naturalBounds.width/2, obj.naturalBounds.height/2)
                    shi.location = computeNewRotateLoc(group.location, shi.location, obj.angle)
                    // shi.location = shi.__location.copy()
                    // delete shi.__offset
                    delete shi.__switchOrder
                }else{
                   
                    if(!shi.__offset){
                        shi.__offset = shi.__location.copy().subtract(shi.location)
                    }
                    else{
                        shi.location = shi.__location.copy().subtract(shi.__offset)
                        // if(shi.__switchOrder){
                        //     shi.__offset.x = -shi.__offset.x
                        //     shi.__offset.y = -shi.__offset.y
                        //     shi.location = shi.__location.copy().subtract(shi.__offset)
                        //     delete shi.__switchOrder
                        //     shi.__offset = shi.__location.copy().subtract(shi.location)
                        // }else{
                        //     shi.location = shi.__location.copy().subtract(shi.__offset)
                        // }
                        // xu.location = xu.__location.copy().offset(-Math.abs(xu.__offset.x), -Math.abs(xu.__offset.y))
                        // xu.location = xu.__location.copy().subtract(xu.__offset)
                    }
                }
                if(textAngle == "horizontal"){
                    // if(!shi.data.nloc){
                        shi.locationSpot = new go.Spot(0, 0, 0, 0)
                    // }
                    shi.angle = 0
                    // obj.diagram.model.setDataProperty(shi.data,"textAlign", "left")
                    // if(shi.data.textAlign == null){
                        // shi.findObject("TEXT").textAlign = "center";
                    // }
                }
                if(textAngle == "vertical"){
                    // if(!shi.data.nloc){
                    shi.locationSpot = new go.Spot(0.5, 0, 0, 0)
                    // }
                    shi.angle = obj.angle
                    // if(shiTextColl[index].data.textAlign == null){
                        // obj.diagram.model.setDataProperty(shiTextColl[index].data,"textAlign", "left")
                        // shiTextColl[index].findObject("TEXT").textAlign = "center";
                    // }   
                }
            }
            if(xu){
                if(!xu.data.nangle){
                    textAngle = groupTextAngle
                }else{
                    textAngle = xu.data.textAngle || groupTextAngle
                }
                xu.__location = obj.location.copy().offset(obj.naturalBounds.width/2, 0)
                xu.__location = computeNewRotateLoc(group.location, xu.__location, obj.angle)
                if(!xu.data.nloc){
                    xu.location = obj.location.copy().offset(obj.naturalBounds.width/2, -obj.naturalBounds.height/2)
                    xu.location = computeNewRotateLoc(group.location, xu.location, obj.angle)
                    // xu.location = xu.__location.copy()
                    // delete xu.__offset
                    delete xu.__switchOrder
                }else{
                    
                    if(!xu.__offset){
                        xu.__offset = xu.__location.copy().subtract(xu.location)
                    }else{
                        xu.location = xu.__location.copy().subtract(xu.__offset)
                        // if(xu.__switchOrder){
                        //     xu.__offset.x = -xu.__offset.x
                        //     xu.__offset.y = -xu.__offset.y
                        //     xu.location = xu.__location.copy().subtract(xu.__offset)
                        //     delete xu.__switchOrder
                        //     xu.__offset = xu.__location.copy().subtract(xu.location)
                        // }else{
                        //     xu.location = xu.__location.copy().subtract(xu.__offset)
                        // }
                        // xu.location = xu.__location.copy().offset(-Math.abs(xu.__offset.x), -Math.abs(xu.__offset.y))
                        // xu.location = xu.__location.copy().subtract(xu.__offset)
                    }
                }
                // if(xu.data.key == "9fe41098-8d5a-e18f-b79a-b4693eacd39d"){
                //     console.log(`location: ${go.Point.stringify(xu.location)}
                //     __location: ${go.Point.stringify(xu.__location)}
                //     __offset: ${go.Point.stringify(xu.__offset)}
                //     `)
                // }
                if(textAngle == "horizontal"){
                    // obj.diagram.model.setDataProperty(xu.data,"textAlign", "right")
                    // if(xu.data.textAlign == null){
                        // xu.findObject("TEXT").textAlign = "center";
                    // }
                    // if(!xu.data.nloc){
                        xu.locationSpot = new go.Spot(1, 1, 0, 0)
                    // }
                    xu.angle = 0
                }

                if(textAngle == "vertical"){
                    // if(!xu.data.nloc){
                        xu.locationSpot = new go.Spot(0.5, 1, 0, 0)
                    // }
                    xu.angle = obj.angle
                    // obj.diagram.model.setDataProperty(xuTextColl[index].data,"textAlign", "left")
                    // if(xuTextColl[index].data.textAlign == null){
                        // xuTextColl[index].findObject("TEXT").textAlign = "center"
                    // }
                }
            }
        }
    }

    function layoutWaveGroup(it,diagram,group){

        var collection = []
        // var group = this.group
        var oliveWidth = group.data.oliveWidth
        var oliveHeight = group.data.oliveHeight
        var shiStroke = group.data.shiStroke
        var xuStroke = group.data.xuStroke
        var centerStroke = group.data.centerStroke || "#3f5369"
        var oliveType = group.data.oliveType||"Ellipse"
        var haveTail = group.data.haveTail||false
        var textAngle = group.data.textAngle|| "vertical" // "vertical"
        // group.location = new go.Point(0,0)
        var maxWidth = 0;
        var maxHeight = 0;
        var line;
        var waveTotalSize = oliveWidth*2/3
        var shiTextColl = []
        var xuTextColl = []
        var centerTextColl = []
        var shiStrokeWidth, xuStrokeWidth,shiStrokeDashArray,xuStrokeDashArray
        var autogroupConfig; // 自动布局配置
        // 增加波形双螺旋的开放尾部
        // var tailOlive = {"category":"waveTail", 
        //     "text":"       ", 
        //     "level":0, "key": helpers.guid(), 
        //     "group":node.data.group, 
        //     "loc":node.data.loc,
        //     "desiredSize":node.data.desiredSize, 
        //     "order": 2000,
        // }

        // if(oliveType == "Wave" && haveTail){
        //     // 查找是否包含尾部
        //     while(it.next()){
        //         var node = it.value;
        //         if(node.data.role == "waveTail"){

        //         }
        //     }
        //     it.reset(); // 重置索引
        // }

        while (it.next()) {
            var node = it.value;
                // var item = git.value;
            //   console.log("item:",item)
         
            //   console.log(node.data)
              if(node.data.role == "shiText"){
                shiTextColl.push(node)
              }
              if(node.data.role == "xuText"){
                xuTextColl.push(node)
              }
              if(node.data.role == "centerText"){
                centerTextColl.push(node)
              }
            if (node instanceof go.Node) {
            // position the node . . .
                if(node.data.category == "line"){
                    line = node;
                    node.location = group.location.copy().offset(0,0)
                    node.angle = group.angle
                }
                if(node.data.category == "wave"){
                    // node.width = oliveWidth
                    // node.desiredSize = new go.Size(200,100)

                    if(oliveType == "Ellipse"){
                        node.diagram.model.setDataProperty(node.data, "oliveType","Ellipse")
                        node.diagram.model.setDataProperty(node.data, "desiredSize",`${oliveWidth} ${oliveHeight}`)
                    }else{
                        // 设置橄榄类型为波形
                        node.diagram.model.setDataProperty(node.data, "oliveType","Wave")
                        // 设置波形的尾部开放
                        if(node.data.role == "waveTail"){
                            node.diagram.model.setDataProperty(node.data, "desiredSize",`${oliveWidth/2} ${oliveHeight}`)
                            node.diagram.model.setDataProperty(node.data, "selectable",false)
                        }else{
                            node.diagram.model.setDataProperty(node.data, "desiredSize",`${oliveWidth} ${oliveHeight}`)
                        }
                    }
                    
                    // if(node.findObject("TEXT").lineCount %2 != 0){
                    //     if(node.data.text && node.data.text[node.data.text.length-1] != "\n"){
                    //         node.data.text+="\n"
                    //       }
                    //     node.diagram.model.setDataProperty(node.data, "text",node.data.text)
                    // }
                    // if(node.data.role == "waveTail"){
                    //     node.diagram.model.setDataProperty(node.data, "desiredSize",`${oliveWidth/2} ${oliveHeight}`)
                    //     node.diagram.model.setDataProperty(node.data, "selectable",false)
                    // }else{
                    //     node.diagram.model.setDataProperty(node.data, "desiredSize",`${oliveWidth} ${oliveHeight}`)
                    // }

                    // if(node.naturalBounds.width > maxWidth){
                    //     maxWidth = node.naturalBounds.width;
                    //   }
                    // if(node.naturalBounds.height > maxHeight){
                    // maxHeight = node.naturalBounds.height;
                    // }
                    // if(node.measuredBounds.height > maxHeight){
                    // maxHeight = node.measuredBounds.height;
                    // }
                    // if(node.findObject("main").height > maxHeight){
                    // maxHeight = node.findObject("main").height;
                    // }
                    node.angle = group.angle
                    waveTotalSize+=node.naturalBounds.width
                    collection.push(node)
                }
            }
        }


        waveTotalSize = collection.length*oliveWidth + oliveWidth*2/3
        if(haveTail){
            waveTotalSize = collection.length*oliveWidth 
        }
        console.log(`maxHeight:${maxHeight},maxWidth:${maxWidth}`)
        line.findObject("SHAPE").width = waveTotalSize
        line.diagram.model.setDataProperty(line.data,"stroke", centerStroke)
        // line.centerStroke
        // line.height = 4
        // if(group.resizeObject.width != waveTotalSize){
            group.containingGroup.layout.isOngoing = true;
            group.containingGroup.layout.isValidLayout = false;
        // }
        
        // autogroupConfig = group.group.nonauto||"";
        // var autogroupConfigObj = {}
        // autogroupConfig = autogroupConfig.split(",")
        // for(var i=0;i<autogroupConfig.length;i++){
        //     autogroupConfigObj[autogroupConfig[i]] = true;
        // }
        group.resizeObject.width = waveTotalSize
        group.resizeObject.height = oliveHeight
        group.waveCount = collection.length;
        xuStrokeWidth = group.data.xuStrokeWidth
        shiStrokeWidth = group.data.shiStrokeWidth
        shiStrokeDashArray = group.data.shiStrokeDashArray
        xuStrokeDashArray = group.data.xuStrokeDashArray
        collection = collection.sort(function(a,b){
            // console.log(`Number(a.data.order)${Number(a.data.order)} > Number(b.data.order) ${Number(b.data.order)}`,Number(a.data.order) > Number(b.data.order))
            return Number(a.data.order) - Number(b.data.order)
        })
        // shiTextColl.sort(function(a,b){
        //     return a.data.order - b.data.order
        // })
        // xuTextColl.sort(function(a,b){
        //     return a.data.order - b.data.order
        // })
        // centerTextColl.sort(function(a,b){
        //     return a.data.order - b.data.order
        // })
        var lastOlive = null;// 记录最后一个橄榄的位置，用于增加开放尾部
        var oldOrder = null;
        collection.forEach(function(obj,index){
            // obj.data.order = index + 1;
            var newOrder = index +1 
            // console.log("orderorderorderorderorderorderorderorderorderorder",newOrder,obj.data.order)
            // var oldOrder = obj.__oldOrder
            if(!obj.__oldOrder){
                oldOrder = obj.data.order
            }else{
                oldOrder = obj.__oldOrder
            }
            delete obj.__oldOrder
            shiTextColl[index] = obj.diagram.findNodeForKey(obj.data.shiText)
            xuTextColl[index] = obj.diagram.findNodeForKey(obj.data.xuText)
            if(!obj.data.isNew && obj.data.role != "waveTail"){
                if(oldOrder%2 != newOrder%2){
                    if(shiTextColl[index].data.nloc){
                        obj.diagram.model.setDataProperty(shiTextColl[index].data,"nloc", null)
                        shiTextColl[index].__oldLocation = shiTextColl[index].location
                    }
                    else{
                        // 之前是自动布局，如果有记录相对位置，则恢复
                        if(shiTextColl[index].__offset){
                            obj.diagram.model.setDataProperty(shiTextColl[index].data,"nloc", true)
                            // xu.__offset = xu.__location.copy().subtract(xu.location)
                            // shiTextColl[index].location = shiTextColl[index].__location.copy().subtract(shiTextColl[index].__offset)
                            // delete shiTextColl[index].__oldLocation
                        }
                    }

                    if(xuTextColl[index].data.nloc){
                        obj.diagram.model.setDataProperty(xuTextColl[index].data,"nloc", null)
                        xuTextColl[index].__oldLocation = xuTextColl[index].location
                    }else{
                        if(xuTextColl[index].__offset){
                            obj.diagram.model.setDataProperty(xuTextColl[index].data,"nloc", true)
                            // xu.__offset = xu.__location.copy().subtract(xu.location)
                            // xuTextColl[index].location = xuTextColl[index].__location.copy().subtract(xuTextColl[index].__offset)
                            // delete shiTextColl[index].__oldLocation
                        }
                    }
                    // shiTextColl[index].__switchOrder = true;
                    // xuTextColl[index].__switchOrder = true;
                    // obj.diagram.model.setDataProperty(xuTextColl[index].data,"nloc", null)
                    // shiTextColl[index].__offset.x = -shiTextColl[index].__offset.x
                    // shiTextColl[index].__offset.y = -shiTextColl[index].__offset.y
                }
            }

            obj.diagram.model.setDataProperty(obj.data,"order", newOrder)
            if(!obj.data.nalign){
                obj.diagram.model.setDataProperty(obj.data,"textAlign", "center")
            }
            if(shiStroke){
                obj.diagram.model.setDataProperty(obj.data,"shiStroke", shiStroke)
            }
            if(xuStroke){
                obj.diagram.model.setDataProperty(obj.data,"xuStroke", xuStroke)
            }
            if(xuStrokeWidth){
                obj.diagram.model.setDataProperty(obj.data,"xuStrokeWidth", xuStrokeWidth)
            }
            if(shiStrokeWidth){
                obj.diagram.model.setDataProperty(obj.data,"shiStrokeWidth", shiStrokeWidth)
            }
            if(shiStrokeDashArray){
                obj.diagram.model.setDataProperty(obj.data,"shiStrokeDashArray", shiStrokeDashArray)
            }
            if(xuStrokeDashArray){
                obj.diagram.model.setDataProperty(obj.data,"xuStrokeDashArray", xuStrokeDashArray)
            }
            
            // obj.diagram.model.setDataProperty(obj.data,"text", obj.data.text+" "+newOrder)
            obj.location = group.location.copy().offset(oliveWidth*(newOrder-1),0)
            // obj.location = new go.Point(300*(obj.data.order-1),0)
            // obj.
            // var group = a.findNodeDataForKey(m.group)
            var initCenterText = false
            if(group.data.centerTextAngle == "independent"){
                if(!obj.data.centerText){
                    var loc = obj.location.copy().offset(obj.naturalBounds.width/2, 0)
                    loc = computeNewRotateLoc(group.location, loc, obj.angle)
                    var centerText = {
                        "text":obj.data.text,
                        "minSize":`${oliveWidth-30} 30`,
                        "deletable":false,
                        textAlign: obj.data.textAlign,
                        "font":obj.data.font || "18px 'Microsoft YaHei'", 
                        textStroke:obj.data.textStroke,
                        "category":"autoText", 
                        "key": helpers.guid(), "width": oliveWidth-30, 
                        "role":"centerText", "level":0, "group": obj.data.group, 
                        "order": newOrder,
                        "visible": false,
                        "layerName":"Foreground",
                        locationSpot: go.Spot.stringify(new go.Spot(0.5, 0.5, 0, 0)),
                        "selectable": false,
                        "olive": obj.data.key,
                        "loc": go.Point.stringify(loc),
                        angle: 0
                        }
                    obj.diagram.model.addNodeData(centerText)
                    // var objCenterText = obj.diagram.model.findNodeDataForKey(centerText.key)
                    obj.diagram.model.setDataProperty(obj.data,"centerText", centerText.key)
                    initCenterText = true;
                }
                var objCenterText = obj.diagram.findNodeForKey(obj.data.centerText)
                if(objCenterText){
                    if(!objCenterText.data.nalign){
                        obj.diagram.model.setDataProperty(objCenterText.data,"textAlign", "center")
                    }
                    if(!obj.data.nangle){
                        if(textAngle == "vertical"){
                            obj.diagram.model.setDataProperty(objCenterText.data,"visible", false)
                            obj.diagram.model.setDataProperty(obj.data,"textVisible", true)
                        }
                        if(textAngle == "horizontal"){
                            obj.diagram.model.setDataProperty(objCenterText.data,"visible", true)
                            obj.diagram.model.setDataProperty(obj.data,"textVisible", false)
                            obj.diagram.model.setDataProperty(objCenterText.data,"angle", 0)
                        }

                    }
                    if(!initCenterText){
                        var loc = obj.location.copy().offset(obj.naturalBounds.width/2, 0)
                        loc = computeNewRotateLoc(group.location, loc, obj.angle)
                        obj.diagram.model.setDataProperty(objCenterText.data,"loc", go.Point.stringify(loc))
                    }
                    obj.diagram.model.setDataProperty(objCenterText.data,"order", newOrder)
                    if(!objCenterText.data.nwidth){
                        obj.diagram.model.setDataProperty(objCenterText.data,"width", oliveWidth-30)
                    }
                    obj.diagram.model.setDataProperty(objCenterText.data,"minSize", `${oliveWidth-30} 30`)
                    // obj.diagram.model.setDataProperty(objCenterText,"selectable", true)
                    // if(group.data.centerTextMode == "followLine"){
                    //     obj.diagram.model.setDataProperty(objCenterText.data,"textStroke", centerStroke)
                    // }else{
                    //     // obj.diagram.model.setDataProperty(objCenterText.data,"textStroke", "black")
                    // }
                    if(helpers.checkPhone()){
                        objCenterText.layerName = "Background"
                    }
                }
            }
            // if(group.data.centerTextMode == "followLine"){
            //     obj.diagram.model.setDataProperty(obj.data,"textStroke", centerStroke)
            // }else{
            //     obj.diagram.model.setDataProperty(obj.data,"textStroke", "black")
            // }
            // if(textAngle == "vertical"){
                if(obj.text && obj.text.trim() != ""){
                    adustOliveText(obj.findObject("TEXT"))
                }
            // }
            if(shiTextColl[index]){

                if(!shiTextColl[index].desiredSize.width){
                    shiTextColl[index].updateTargetBindings()
                }

                obj.diagram.model.setDataProperty(shiTextColl[index].data,"showBorder", true)
                if(!shiTextColl[index].data.nwidth){
                    obj.diagram.model.setDataProperty(shiTextColl[index].data,"width", oliveWidth)
                }
                obj.diagram.model.setDataProperty(shiTextColl[index].data,"minSize", `${oliveWidth-30} 30`)
                // obj.diagram.model.setDataProperty(shiTextColl[index].data,"textAlign", null)
                // delete shiTextColl[index].data.textAlign
                // 判断是否自动对齐
                // if(!shiTextColl[index].data.nalign){
                //     obj.diagram.model.setDataProperty(shiTextColl[index].data,"textAlign", "center")
                // }
                // // obj.diagram.model.setDataProperty(shiTextColl[index].data,"showBorder", true)
                // if(!shiTextColl[index].__oldOrder){
                //     shiTextColl[index].__oldOrder = shiTextColl[index].data.order
                // }
                // if(shiTextColl[index].__oldOrder ){
                //     // order变化前后奇偶不同
                //     if(oldOrder%2 != newOrder%2){
                //         // shiTextColl[index].__switchOrder = true;
                //         // shiTextColl[index].__offset.x = -shiTextColl[index].__offset.x
                //         // shiTextColl[index].__offset.y = -shiTextColl[index].__offset.y
                //     }
                // }
                // delete shiTextColl[index].__oldOrder
                obj.diagram.model.setDataProperty(shiTextColl[index].data,"order", newOrder)
                if(!shiTextColl[index].data.ncolor){
                    obj.diagram.model.setDataProperty(shiTextColl[index].data,"textStroke", shiStroke)
                }
                // obj.diagram.model.setDataProperty(shiTextColl[index].data,"order", newOrder)
                // if(!shiTextColl[index].data.ncolor){
                //     obj.diagram.model.setDataProperty(shiTextColl[index].data,"textStroke", shiStroke)
                // }
            }
            if(xuTextColl[index]) {
                if(!xuTextColl[index].desiredSize.width){
                    xuTextColl[index].updateTargetBindings()
                }

                obj.diagram.model.setDataProperty(xuTextColl[index].data,"minSize", `${oliveWidth-30} 30`)
                obj.diagram.model.setDataProperty(xuTextColl[index].data,"showBorder", true)
                if(!xuTextColl[index].data.nwidth){
                    obj.diagram.model.setDataProperty(xuTextColl[index].data,"width", oliveWidth)
                }
                if(!xuTextColl[index].data.nalign){
                    obj.diagram.model.setDataProperty(xuTextColl[index].data,"textAlign", "center")
                }
                // obj.diagram.model.setDataProperty(xuTextColl[index].data,"textAlign", null)
                // delete xuTextColl[index].data.textAlign
                // if(!xuTextColl[index].__oldOrder){
                //     xuTextColl[index].__oldOrder = xuTextColl[index].data.order
                // }
                // if(xuTextColl[index].__oldOrder){
                //     // order变化前后奇偶不同
                //     if(xuTextColl[index].__oldOrder%2 != newOrder%2){
                //         // xuTextColl[index].__switchOrder = true;
                //         // xuTextColl[index].__offset.x = -xuTextColl[index].__offset.x
                //         // xuTextColl[index].__offset.y = -xuTextColl[index].__offset.y
                //     }
                // }
                // delete xuTextColl[index].__oldOrder
                obj.diagram.model.setDataProperty(xuTextColl[index].data,"order", newOrder)
                if(!xuTextColl[index].data.ncolor){
                    obj.diagram.model.setDataProperty(xuTextColl[index].data,"textStroke", xuStroke)
                }
                // obj.diagram.model.setDataProperty(xuTextColl[index].data,"order", newOrder)
                // if(!xuTextColl[index].data.ncolor){
                //     obj.diagram.model.setDataProperty(xuTextColl[index].data,"textStroke", xuStroke)
                // }
            }
            obj.__location = computeNewRotateLoc(group.location, obj.location.copy(), obj.angle)
            adjustTextAngle(obj, shiTextColl[index],xuTextColl[index],group)
            
            obj.location = obj.__location
            lastOlive = obj;
            obj.diagram.model.setDataProperty(obj.data,"isNew", null)
        })
        
    }

    // define a custom grid layout that makes sure the length of each lane is the same
    // and that each lane is broad enough to hold its subgraph
    function WaveGroupLayout() {
        go.Layout.call(this);
        // go.GridLayout.call(this);
        // this.cellSize = new go.Size(1, 1);
        // this.wrappingColumn = Infinity;
        // this.wrappingWidth = Infinity;
        // this.spacing = new go.Size(0, 0);
        // this.alignment = go.GridLayout.Position;
      }
      go.Diagram.inherit(WaveGroupLayout, go.Layout);
  
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
      
      WaveGroupLayout.prototype.doLayout = function(coll) {
          console.log("WaveGroupLayout.doLayout")
        var diagram = this.diagram;
        diagram.model.startTransaction("WaveGroupLayout")
        
          // COLL might be a Diagram or a Group or some Iterable<Part>
        var it = this.collectParts(coll).iterator;
        var group = this.group
        layoutWaveGroup(it, diagram, group)

        go.Layout.prototype.doLayout.call(this, coll);
        // diagram.model.addNodeData(tailOlive)
        
        diagram.model.commitTransaction("WaveGroupLayout");
        // setTimeout(()=>{
        //     diagram.updateAllTargetBindings()
        // })
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

      module.exports = WaveGroupLayout
      module.exports.layoutWaveGroup = layoutWaveGroup
      module.exports.adjustTextAngle = adjustTextAngle