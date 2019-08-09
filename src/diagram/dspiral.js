
var Trtd_tianpan = require('./tianpan')
var createNodeTemplate = require('../nodeTemplate/createNodeTemplate')
var createPictureSingleNodeTemplate = require('../nodeTemplate/createPictureSingleNodeTemplate')
var createPictureNodeTemplate = require('../nodeTemplate/createPictureNodeTemplate')
var createTextNodeTemplate = require('../nodeTemplate/createTextNodeTemplate')
var createNodeSvgTemplate = require('../nodeTemplate/createNodeSvgTemplate')
var createArcNodeTemplate = require('../nodeTemplate/createArcNodeTemplate')
var createLineNodeTemplate = require('../nodeTemplate/createLineNodeTemplate')
var createWaveNodeTemplate = require('../nodeTemplate/createWaveNodeTemplate')
var nodeTemplateFactory = require('../nodeTemplate/factory')
var $ = go.GraphObject.make;
var GroupRotatingTool = require('../tools/GroupRotatingTool')
var helpers = require('../helpers/helpers.gojs')
var layoutWaveGroup = require("../layout/waveGroupLayout").layoutWaveGroup;
var adjustTextAngle = require("../layout/waveGroupLayout").adjustTextAngle;


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

require("../tools/textEditor")
class Trtd extends Trtd_tianpan {
    constructor(div, config){
        super(div, config)
        var that = this;
        var diagramConfig = {
            layout: $(go.Layout),
            initialContentAlignment: go.Spot.Center,
            initialAutoScale: go.Diagram.Uniform,
            initialDocumentSpot: go.Spot.Center,
            initialViewportSpot: go.Spot.Center,
            rotatingTool: new GroupRotatingTool(),
            PartResized: (e) =>{
                console.log("PartResizedPartResizedPartResizedPartResized")
                var node = e.subject.part
                if(!node) return;
                // return;
                if(node.data.category == "waveGroup"){
                    console.log("PartResizedPartResized")
                    // wave 的宽高限制
                    var maxWidth = 400;
                    var maxHeight = 400;
                    var oliveWidth, oliveHeight;
                    var it = node.findSubGraphParts().iterator;
                    var waveCount = 0
                    var lastWave;
                    while(it.next()){
                        var n = it.value;
                        if(n.data.category == "wave"){
                            waveCount+=1;
                            lastWave = n;
                        }
                    }
                    console.log("actualBoundsactualBoundsactualBoundsactualBounds")
                    var nodeSize = node.resizeObject.actualBounds;
                    var waveSize = lastWave.resizeObject.naturalBounds
                    // oliveWidth = (nodeSize.width-100)/waveCount
                    oliveWidth = (nodeSize.width-0)*5/3/waveCount
                    oliveWidth = (nodeSize.width-0)*3/(waveCount*3+2)
                    if(oliveWidth<100){
                        oliveWidth=100
                    }
                    // oliveWidth = waveSize.width*waveCount + waveSize.width*2/3
                    // oliveWidth = waveSize.width
                    if( oliveWidth > maxWidth){
                        oliveWidth = maxWidth;
                        // nodeSize.width = maxWidth*waveCount+100;
                    }
                    oliveHeight = nodeSize.height;
                    if( oliveHeight > maxHeight){
                        oliveHeight = maxHeight;
                        // nodeSize.height  = maxWidth;
                    }
                    if( oliveHeight > oliveWidth){
                        oliveHeight = oliveWidth;
                        // nodeSize.height  = maxWidth;
                    }
                    node.diagram.startTransaction()
                    // node.diagram.model.setDataProperty(node.data, "desiredSize",`${nodeSize.width} ${nodeSize.height}`)
                    node.diagram.model.setDataProperty(node.data, "oliveHeight", oliveHeight)
                    node.diagram.model.setDataProperty(node.data, "oliveWidth", oliveWidth)
                                 //     e.subject.part.layout.isOngoing = true;
                    //     e.subject.part.layout.isValidLayout = false;
                    var it = e.subject.part.findSubGraphParts().iterator;
                    layoutWaveGroup(it,node.diagram,e.subject.part)
                    // node.diagram.updateAllTargetBindings()
                    it.reset()
                    while(it.next()){
                        it.value.updateTargetBindings()
                    }
                    
                    node.diagram.commitTransaction()
                    setTimeout(()=>{
                        e.subject.part.layout.isOngoing = true;
                        e.subject.part.layout.isValidLayout = false;
                    },100)
                }else if(node.data.category === "autoText"){
                    e.diagram.startTransaction("resize");
                    e.diagram.model.setDataProperty(node.data, "width", e.subject.width);
                    e.diagram.commitTransaction("resize");
                }
            },
            SelectionMoved: (e)=>{
                // console.log("SelectionMovedSelectionMoved",e.subject)
                // if (!e.isTransactionFinished) {
                //     return;
                // }
                try{
                    var selnode = e.subject.first()
                    if(!selnode) return;
                    if(selnode.data.category == "wave"){
                        if(selnode.containingGroup){
                            selnode.containingGroup.layout.isValidLayout = false;
                        }
                    }
                    if(selnode.data.category == "autoText"){
                        if((selnode.data.role == "shiText" || selnode.data.role == "xuText")){
                            selnode.diagram.startTransaction()
                            console.log("SelectionMovedSelectionMovedSelectionMoved")
                            if(!selnode.__location){
                                var obj = selnode.diagram.findNodeForKey(selnode.data.olive)
                                var group = selnode.containingGroup
                                if(obj){
                                    var loc = group.location.copy().offset(group.data.oliveWidth*(obj.data.order-1),0)
                                    selnode.__location = loc.copy().offset(obj.naturalBounds.width/2, 0)
                                    selnode.__location = computeNewRotateLoc(group.location, selnode.__location, obj.angle)
                                }
                            }
                            if(selnode.__location){
                                console.log("selnode.__locationselnode.__locationselnode.__location")
                                if(selnode.data.order %2 == 0){
                                    selnode.__offset = selnode.__location.copy().subtract(selnode.location)
                                }else{
                                    selnode.__offset = selnode.__location.copy().subtract(selnode.location)
                                }
                                delete selnode.__oldOrder
                            }
                            delete selnode.__oldLocation
                            if(selnode.data.text.trim() != ""){
                                selnode.data.nloc = true;
                                selnode.diagram.model.setDataProperty(selnode.data, "nloc", true)
                            }
                            selnode.diagram.commitTransaction()
                        }
                        if(selnode.containingGroup && (selnode.containingGroup.data.category == "yunGroup"||selnode.containingGroup.data.category == "yunpanGroup")){
                            selnode.containingGroup.__trtdNode.snapToGrid(selnode.data, selnode.containingGroup)
                            // selnode.containingGroup.layout.isOngoing = true;
                            selnode.containingGroup.layout.isValidLayout = false;
                        }
                    }
                    if(selnode.data.category == "shapeText"){
                        if(selnode.containingGroup && (selnode.containingGroup.data.category == "yunpanGroup")){
                            selnode.containingGroup.__trtdNode.snapToGrid(selnode.data, selnode.containingGroup)
                            // selnode.containingGroup.layout.isOngoing = true;
                            selnode.containingGroup.layout.isValidLayout = false;
                        }
                    }
                }catch(err){
                    console.log(err)
                }
                // if(e.subject)
            },
            // "toolManager.hoverDelay": 600,
            // "toolManager.toolTipDuration": 3000,
            click: function(e) {
                // closeToolbarWindow();
                // removeNodeToolBar();
                console.log("eeeeeeee:",e)
                that.clearAllTextBorder()
                localStorage.setItem("TRTD_documentPoint",go.Point.stringify(e.documentPoint))
            },
        }
        this.diagram.setProperties(diagramConfig);
        
        this.diagram.commandHandler.doKeyDown = (e)=>{
            this.dokeyDownFn(e)
            // var cmd = this.diagram.commandHandler;
            // go.CommandHandler.prototype.doKeyDown.call(cmd);
        }
        this.diagram.commandHandler.canCopySelection = function(){
            // this.dokeyDownFn(e)
            console.log("canCopySelectioncanCopySelection")
            var node = that.diagram.selection.first()
            if(node){
                if(node.data.category == "axisGroup" || node.data.category == "yunGroup"){
                    return true;
                }else{
                    return false;
                }
            }
            var cmd = this.diagram.commandHandler;
            return go.CommandHandler.prototype.canCopySelection.call(cmd);
        }
        this.diagram.commandHandler.pasteFromClipboard = function(e, obj){
            var coll = go.CommandHandler.prototype.pasteFromClipboard.call(this);
            
            // this.diagram.moveParts(coll, this._lastPasteOffset);
            // this._lastPasteOffset.add(this.pasteOffset);
            var it = coll.iterator;
            var shiTextColl = []
            var xuTextColl = []
            var waveColl = []
            var centerTextColl = []
            var waveGroup = null
            var yunGroup = null;
            while(it.next()){
                var n = it.value;
                if(n.data.role == "shiText"){
                    shiTextColl.push(n)
                    continue;
                }
                if(n.data.role == "xuText"){
                    xuTextColl.push(n)
                    continue;
                }
                if(n.data.role == "centerText"){
                    centerTextColl.push(n)
                    continue;
                }
                if(n.data.category == "wave" && n.data.role != "waveTail"){
                    waveColl.push(n)
                    continue;
                }
                if(n.data.category == "waveGroup"){
                    waveGroup = n;
                }
            }
            if(!waveGroup){
                // coll.clear()
                // coll.removeAll()
                coll = new go.Set(go.Part)
                return coll;
            }

            waveColl = waveColl.sort(function(a,b){
                // console.log(`Number(a.data.order)${Number(a.data.order)} > Number(b.data.order) ${Number(b.data.order)}`,Number(a.data.order) > Number(b.data.order))
                return Number(a.data.order) - Number(b.data.order)
            })
            shiTextColl.sort(function(a,b){
                return Number(a.data.order) - Number(b.data.order)
            })
            xuTextColl.sort(function(a,b){
                return Number(a.data.order) - Number(b.data.order)
            })
            centerTextColl.sort(function(a,b){
                return Number(a.data.order) - Number(b.data.order)
            })

            waveColl.forEach(function(obj,index){
                obj.data.shiText = shiTextColl[index].data.key
                obj.data.xuText = xuTextColl[index].data.key
                obj.data.centerText = centerTextColl[index].data.key
                shiTextColl[index].data.olive = obj.data.key
                xuTextColl[index].data.olive = obj.data.key
            })
            console.log("pasteFromClipboardpasteFromClipboard")
            return coll;
            // var cmd = this.diagram.commandHandler;
            // go.CommandHandler.prototype.doKeyDown.call(cmd);
        }
        this.diagram.commandHandler.deleteSelection = ()=>{
         
            return this.deleteSelection();
        }
        this.diagram.toolManager.resizingTool.computeReshape = function() { 
            if(this.adornedObject.part.data.category == "shapeText"){
                return false
            }
            go.TextEditingTool.prototype.doCancel.call(this);

        }
        this.diagram.toolManager.textEditingTool.doCancel = function(){
            // var textEditor = this.diagram.currentTextEditor;
            // console.log("textEditor。。。。")
            var tool = this;
            try{
                if(this.textBlock){
                    var node = this.textBlock.part;
                }
            }catch(e){
                console.log(e)
            }
            setTimeout(()=>{
                try{
                    if(node && node.data.category == "wave"){
                        if(node.containingGroup && node.containingGroup.data.textAngle == "horizontal" && node.containingGroup.data.centerTextAngle == "independent"){
                            // 如果文字方向为正向，且中线文字为正向
                            node.findObject("TEXT").visible = false;
                            var centerText = node.diagram.findNodeForKey(node.data.centerText)
                            if(centerText){
                              centerText.visible = true;
                            }
                          }
                    }
                }catch(e){
                    console.info(e)
                }
            },100)
            // var cmd = this.diagram.commandHandler;
            // this.doCancel()
            // go.CommandHandler.prototype.deleteSelection.call(cmd);
            go.TextEditingTool.prototype.doCancel.call(tool);
        }

        this.diagram.toolManager.resizingTool.computeReshape = function() { 
            // 保持图片宽高比
            if(this.adornedObject.part.data.category == "pic"){
                return false; 
            }    
            return true
        }

        if( window.TextEditor){
            console.log("TextEditorTextEditorTextEditorTextEditorTextEditorTextEditorTextEditorTextEditorTextEditor")
            this.diagram.toolManager.textEditingTool.defaultTextEditor = window.TextEditor;
        }
        this.diagram.toolManager.clickCreatingTool.archetypeNodeData = {
            category: "autoText",
            "font":"18px 'Microsoft YaHei'",
            text: "空白文本",
            level: 0
        };

        this.diagram.groupTemplateMap.add("waveGroup1",     $(go.Group, "Spot",
        { selectionObjectName: "SHAPE" },
        { locationObjectName: "SHAPE", locationSpot: go.Spot.Center },
        new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
        { rotatable: true },
        new go.Binding("angle","angle",function(v,m,a){
            console.log("vvvvvvvvvvvvvvvvvvv:",v," m:",m," a:",a)
            // m.diagram.startTransaction()
            // for(var i=0;i<m.diagram.model.nodeDataArray.length-1;i++){
            //     if(m.diagram.model.nodeDataArray[i].group == m.key){
            //         m.diagram.model.setDataProperty(m.diagram.model.nodeDataArray[i], "angle", v)
            //     }
            // }
            // // var group = a.findNodeDataForKey(m.group)
            // // a.setDataProperty(group, "angle", v)
            // m.diagram.commitTransaction()
            return v;
        }).makeTwoWay(function(v,m,a){
            console.log("v:",v," m:",m," a:",a)
            // a.startTransaction()
            // for(var i=0;i<a.nodeDataArray.length-1;i++){
            //     if(a.nodeDataArray[i].group == m.key){
            //         a.setDataProperty(a.nodeDataArray[i], "angle", v)
            //     }
            // }
            // // var group = a.findNodeDataForKey(m.group)
            // // a.setDataProperty(group, "angle", v)
            // a.commitTransaction()
            return v;
        }),
        { resizable: true, resizeObjectName: "SHAPE" },
        $(go.Panel, "Vertical",
          $(go.TextBlock, { font: "bold 12pt sans-serif" },
            new go.Binding("text", "key")),
          $(go.Shape, { name: "SHAPE", fill: "transparent" },
            new go.Binding("desiredSize", "desiredSize", go.Size.parse).makeTwoWay(go.Size.stringify))
        )
      ))
		// this.config = config;
		// this.modelChangedListener = config.modelChangedListener;
		// this.type = config.type;
		// this.diagram = {};
        // this.model = config.model;
        // this.tpid = config.tpid||Date.now();
        // this.InitialFontSize = 18
        // this.tdCurrentTheme = {
        //     id: 6,
        //     borderWidth: 2,
        //     borderColor: "black",
        //     groupColor: "rgba(0,0,0,0)",
        //     groupStroke: "rgba(0,0,0,0)",
        //     groupStrokeWidth: 0,
        //     themeName: "黑白",
        //     linkColor: "black",
        //     colorRange: "white"
        // }
		// // 初始化diagram
		// this.initDiagram(div, config);
		// this.initListener();
		// // Then you will need to construct a Model (usually a GraphLinksModel) for the Diagram, initialize its data by setting its Model.nodeDataArray and other properties, and then set the diagram's model.
        // if(this.model){
        //     this.initModel();
        // }
    }

     /**
     * 添加节点模板
     */
    addNodeTemplate(){

        // myDiagram.nodeTemplateMap.add("dipan", this.createDipanTemplate(layerThickness,tdDipanTextAngle));
        // myDiagram.nodeTemplateMap.add("Root", this.getDipanRootTemplate(layerThickness));
        // myDiagram.nodeTemplateMap.add("text", );
        var myDiagram = this.diagram
        myDiagram.nodeTemplateMap.add("0", createNodeTemplate(this.diagram));
        myDiagram.nodeTemplateMap.add("1", createNodeTemplate(this.diagram));
        myDiagram.nodeTemplateMap.add("2", createNodeTemplate(this.diagram));
        myDiagram.nodeTemplateMap.add("3", createPictureSingleNodeTemplate(this.diagram));
        myDiagram.nodeTemplateMap.add("4", createPictureNodeTemplate(this.diagram));
        myDiagram.nodeTemplateMap.add("text", createTextNodeTemplate(this.diagram));
        myDiagram.nodeTemplateMap.add("", createNodeTemplate(this.diagram));

        myDiagram.nodeTemplateMap.add("8",createNodeSvgTemplate(this.diagram));
        myDiagram.nodeTemplateMap.add("9", createArcNodeTemplate(this.diagram));
        myDiagram.nodeTemplateMap.add("line", createLineNodeTemplate(this.diagram));
        // myDiagram.nodeTemplateMap.add("wave", createWaveNodeTemplate(this.diagram));
        // var sampleNode = nodeTemplateFactory("sample")
        myDiagram.nodeTemplateMap.add("wave", nodeTemplateFactory("wave",{diagram:myDiagram}).getNodeTemplate());
        myDiagram.nodeTemplateMap.add("waveTail", nodeTemplateFactory("waveTail",{diagram:myDiagram}).getNodeTemplate());
        myDiagram.nodeTemplateMap.add("iconText", nodeTemplateFactory("iconText",{diagram:myDiagram}).getNodeTemplate());
        // myDiagram.nodeTemplateMap.add("cbian",  nodeTemplateFactory("cbian",{diagram:this.diagram}).getNodeTemplate())
        myDiagram.nodeTemplateMap.add("pic",  nodeTemplateFactory("pic",{diagram:this.diagram}).getNodeTemplate())
        myDiagram.nodeTemplateMap.add("shape",  nodeTemplateFactory("shape",{diagram:this.diagram}).getNodeTemplate())
        myDiagram.nodeTemplateMap.add("autoText", nodeTemplateFactory("autoText",{diagram:myDiagram}).getNodeTemplate());
        myDiagram.nodeTemplateMap.add("shapeText", nodeTemplateFactory("shapeText",{diagram:myDiagram}).getNodeTemplate());
        myDiagram.groupTemplateMap.add("labelGroup", nodeTemplateFactory("labelGroup",{diagram:myDiagram}).getNodeTemplate());
        myDiagram.groupTemplateMap.add("picGroup", nodeTemplateFactory("picGroup",{diagram:myDiagram}).getNodeTemplate());
        myDiagram.groupTemplateMap.add("waveGroup",  nodeTemplateFactory("waveGroup",{diagram:this.diagram}).getNodeTemplate())
        myDiagram.groupTemplateMap.add("axisGroup",  nodeTemplateFactory("axisGroup",{diagram:this.diagram}).getNodeTemplate())
        myDiagram.groupTemplateMap.add("yunGroup",  nodeTemplateFactory("yunGroup",{diagram:this.diagram}).getNodeTemplate())
        myDiagram.groupTemplateMap.add("yunpanGroup",  nodeTemplateFactory("yunpanGroup",{diagram:this.diagram}).getNodeTemplate())
        
    }

    deleteSelection(node){
        var cmd = this.diagram.commandHandler;
        if(!node){
            node = this.diagram.selection.first()
        }
        var locateNode = null;
        var shiText,xuText,centerText;
        if(!node) return;
        if(!node.canDelete()) return;
        if(node.data.category == "yunGroup" && !node.data.deletable){   
            return
        }
        this.diagram.startTransaction("deleteSelection1");
        var count = 0;
        if(node){
            if(node.data.category == "axisGroup"){
                var it = node.findSubGraphParts().iterator;
                while (it.next()) {
                    var n = it.value;
                    this.diagram.model.removeNodeData(n.data)
                }
                this.diagram.model.removeNodeData(node.data)
            }
            if(node.data.category == "wave" && node.containingGroup){
                var it = node.containingGroup.findSubGraphParts().iterator;
                while (it.next()) {
                    var n = it.value;
                    if(n.data.category == "wave" && n.data.role != "waveTail"){
                        if(n.data.order == node.data.order+1){
                            locateNode = n;
                        }
                        count++;
                    }
                    if(n.data.role == "shiText" && n.data.order == node.data.order){
                        shiText = n;
                    }
                    if(n.data.role == "xuText" && n.data.order == node.data.order){
                        xuText = n;
                    }
                    if(n.data.role == "centerText" && n.data.order == node.data.order){
                        centerText = n;
                    }

                }
                if(count<=1){
                    this.diagram.commitTransaction("deleteSelection1");
                    return;
                }
                node.containingGroup.layout.isOngoing = true;
                node.containingGroup.layout.isValidLayout = false;
                if(node.containingGroup.containingGroup){
                    node.containingGroup.containingGroup.layout.isOngoing = true;
                    node.containingGroup.containingGroup.layout.isValidLayout = false; 
                }
            }
            // 云盘 维度删除
            if(node.data.category == "autoText" &&  node.data.subRole == "dimText" && node.containingGroup && node.containingGroup.data.category == "yunpanGroup"){
                var it = node.containingGroup.findSubGraphParts().iterator;
                var deleteNodes = []
                var deleteLines = []
                var normDim = "X",unnormDim = "Y", lineRole = "verticalLine"
                if(node.data.dimX == 0){
                    normDim = "Y"
                    unnormDim = "X"
                    lineRole = "horizontalLine"
                }
                while (it.next()) {
                    var n = it.value;
                    if(n.data.subRole == "dimText" && n.data["dim"+unnormDim] == 0){
                        // if(n.data.order == node.data.order+1){
                        //     locateNode = n;
                        // }
                        count++;
                    }
                    if(n.data.subRole == "yunpanText" && n.data["order"+normDim] == node.data["dim"+normDim]){
                        deleteNodes.push(n.data)
                    }
                    if(n.data.category == "line"  && n.data.role == lineRole
                    && n.data["order"]  == node.data["dim"+normDim]
                    ){
                        deleteLines.push(n.data)
                    }
                    // if(n.data.role == "xuText" && n.data.order == node.data.order){
                    //     xuText = n;
                    // }
                    // if(n.data.role == "centerText" && n.data.order == node.data.order){
                    //     centerText = n;
                    // }

                }
                
                if(count<=1){
                    this.diagram.commitTransaction("deleteSelection1");
                    return;
                }

                it.reset()
                while (it.next()) {
                    var n = it.value;
                    if(n.data.subRole == "dimText" && n.data["dim"+unnormDim] == 0 && n.data["dim"+normDim] > node.data["dim"+normDim]){
                        // if(n.data.order == node.data.order+1){
                        //     locateNode = n;
                        // }
                        n.diagram.model.setDataProperty(n.data, "dim"+normDim, n.data["dim"+normDim] - 1)
                        // count++;
                    }
                    if(n.data.subRole == "yunpanText" && n.data["order"+normDim] > node.data["dim"+normDim]){
                        n.diagram.model.setDataProperty(n.data, "order"+normDim, n.data["order"+normDim] - 1)
                    }
                    if(n.data.category == "line"  && n.data.role == lineRole
                    && n.data["order"]  > node.data["dim"+normDim]
                    ){
                        n.diagram.model.setDataProperty(n.data, "order", n.data["order"] - 1)
                    }
                    // if(n.data.role == "xuText" && n.data.order == node.data.order){
                    //     xuText = n;
                    // }
                    // if(n.data.role == "centerText" && n.data.order == node.data.order){
                    //     centerText = n;
                    // }

                }

                node.diagram.model.removeNodeDataCollection(deleteLines)
                node.diagram.model.removeNodeDataCollection(deleteNodes)
                node.containingGroup.layout.isOngoing = true;
                node.containingGroup.layout.isValidLayout = false;
                // if(node.containingGroup.containingGroup){
                //     node.containingGroup.containingGroup.layout.isOngoing = true;
                //     node.containingGroup.containingGroup.layout.isValidLayout = false; 
                // }
            }


        }
        //myDiagram.currentTool.doCancel();
        //go.CommandHandler.prototype.redo.call(cmd);
        // myDiagram.clearSelection();
        if(xuText){
            this.diagram.model.removeNodeData(xuText.data)
        }
        if(shiText){
            this.diagram.model.removeNodeData(shiText.data)
        }
        if(centerText){
            this.diagram.model.removeNodeData(centerText.data)
        }
        go.CommandHandler.prototype.deleteSelection.call(cmd);

        

        this.diagram.commitTransaction("deleteSelection1");
        // this.layoutAllGroup()
        // setTimeout(()=>{
        //     // this.diagram.updateAllTargetBindings()
        //     this.diagram.layoutDiagram(true)
        // },500)
        if (locateNode) {
            this.diagram.select(locateNode);
        }
    }


    layoutLabelGroup(){
        console.log("layoutLabelGroup")
        setTimeout(()=>{
            var it = this.diagram.nodes.iterator;
            while (it.next()) {
                var n = it.value;
                if(n.data.category == "labelGroup"){
                    n.layout.isOngoing = true;
                    n.layout.isValidLayout = false;
                }
            }
        },200)
    }

    layoutAllGroup(){
        console.log("layoutAllGroup")
        var it = this.diagram.nodes.iterator;
        while (it.next()) {
            var n = it.value;
            if(n.data.isGroup == true){
                n.layout.isOngoing = true;
                n.layout.isValidLayout = false;
            }
        }
    }

    // 拆分橄榄
    splitOlive2Half(){
        var diagram = this.diagram
        var node = diagram.selection.first()
        if(!node) return;
        if(node.data.category != "wave"){
            return;
        }
        if(node.data.order ==1) return;
        if(!node.containingGroup){
            return;
        }
        this.diagram.startTransaction("splitOlive2Half")
        node.containingGroup.layout.isOngoing = true;
        node.containingGroup.layout.isValidLayout = false;
        var axisData = this.addAxisGroup({emptyAxis: true})
        if(!axisData) {
            this.diagram.commitTransaction("splitOlive2Half")
            return;
        }
        var waveGroup;
        for(var i=0;i<axisData.length;i++){
            if(axisData[i].category == "waveGroup"){
                waveGroup = axisData[i]
                break;
            }
        }
        if(!waveGroup) {
            this.diagram.commitTransaction("splitOlive2Half")
            return;
        };
        var curOrder = node.data.order
        var it = node.containingGroup.findSubGraphParts().iterator;
        var splitOlive = []
        while (it.next()) {
            var n = it.value;
            if(n.data.category == "wave" && n.data.order >= curOrder && n.data.role != "waveTail"){
                splitOlive.push(n)
            }
        }
        for(var i=0;i<splitOlive.length;i++){
            this.diagram.model.setDataProperty(splitOlive[i].data, "group", waveGroup.key)
            var shiText = this.diagram.model.findNodeDataForKey(splitOlive[i].data.shiText)
            var centerText = this.diagram.model.findNodeDataForKey(splitOlive[i].data.centerText)
            var xuText = this.diagram.model.findNodeDataForKey(splitOlive[i].data.xuText)
            if(shiText){
                this.diagram.model.setDataProperty(shiText, "group", waveGroup.key)
            }
            if(centerText){
                this.diagram.model.setDataProperty(centerText, "group", waveGroup.key)
            }
            if(xuText){
                this.diagram.model.setDataProperty(xuText, "group", waveGroup.key)
            }
        }
 
        this.diagram.commitTransaction("splitOlive2Half")
    }

    // 分离常变
    splitOlive2Cbian(){
        var diagram = this.diagram
        var node = diagram.selection.first()
        if(!node) return;
        if(node.data.category != "wave"){
           return;
        }

        this.diagram.startTransaction("splitOlive2Cbian")
        // 删除橄榄
        var shiText = this.diagram.model.findNodeDataForKey(node.data.shiText)
        var centerText = this.diagram.model.findNodeDataForKey(node.data.centerText)
        var xuText = this.diagram.model.findNodeDataForKey(node.data.xuText)
        var cbian = {
            shiText: shiText.text,
            centerText: centerText.text,
            xuText: xuText.text,
            basePoint:node.location.copy().offset(0,-300),
            group: node.data.group
        }
        this.deleteSelection(node)
        // 添加常变
        this.addCbian(cbian)
        this.diagram.commitTransaction("splitOlive2Cbian")
    }

    // 增加常变
    addCbian(cbian){
        console.log("addCbian")
        var diagram = this.diagram
        var node = diagram.selection.first();
        var group = null
        if(node && node.data.category == "axisGroup"){
            group=node.data.key;
        }
        var e = diagram.lastInput
        diagram.startTransaction("addCbian")
        var groupKey = helpers.guid()
        
        if(cbian && cbian.basePoint){
            var basePoint = cbian.basePoint
        }else{
            var basePoint = e.documentPoint
        }
        var groupData = {"category":"picGroup", 
         "role":"cbian", "isGroup":true, "level":0, 
        "key":groupKey, "loc":go.Point.stringify(basePoint), "deletable":true}
        if(group){
            groupData.group = group
        }
        if(cbian && cbian.group){
            groupData.group = cbian.group
        }
        var picData = { "group":groupKey, "text":"", 
        "resizable":false, "category":"pic", 
        "loc":go.Point.stringify(basePoint),
        "picture":"https://static.365trtd.com/system/cbian/cbian.png", "width":150, "height":150}
        // "picture":"https://static.365trtd.com/system/cbian/cbian.png", "width":150, "height":150}
        
        var themeData = {"text":"总结", "deletable":true,  "fill":"black", "iconVisible":false, 
        "locationSpot":"1 0 0 0", "textAlign":"center", "category":"autoText", 
        "loc":go.Point.stringify(basePoint.copy().offset(3,-3)), 
        "movable":true, "group":groupKey}
        var timeData = {"text":"时间", "deletable":true,  "fill":"black", "iconVisible":false, 
        "locationSpot":"1 0 0 0", "textAlign":"center", "category":"autoText", 
        "loc":go.Point.stringify(basePoint.copy().offset(150, 0)), 
        "movable":true, "group":groupKey}
        var energeData = {"text":"能量", "deletable":true, "fill":"black", "iconVisible":false, 
        "locationSpot":"1 0 0 0", "textAlign":"center", "category":"autoText", 
        "loc":go.Point.stringify(basePoint.copy().offset(0, -150)), 
        "movable":true, "group":groupKey}
        var text1Data = {"text":"总结1", "deletable":true,  "textStroke":"#0e399d", "iconVisible":false, 
        "locationSpot":"0 0 0 0", "textAlign":"left", "category":"autoText", 
        "loc":go.Point.stringify(basePoint.copy().offset(155*Math.cos(30*Math.PI/180), -150*Math.sin(30*Math.PI/180))), 
        "movable":true, "group":groupKey}
        var text2Data = {"text":"总结3", "deletable":true, "textStroke":"#FFC000", "iconVisible":false, 
        "locationSpot":"0 0.5 0 0", "textAlign":"left", "category":"autoText", 
        "loc":go.Point.stringify(basePoint.copy().offset(145*Math.cos(45*Math.PI/180), -150*Math.sin(45*Math.PI/180))), 
        "movable":true, "group":groupKey}
        var text3Data = {"text":"总结2", "deletable":true, "textStroke":"#cb1c27", "iconVisible":false, 
        "locationSpot":"0 1 0 0", "textAlign":"left", "category":"autoText", 
        "loc":go.Point.stringify(basePoint.copy().offset(145*Math.cos(70*Math.PI/180), -140*Math.sin(70*Math.PI/180))), 
        "movable":true, "group":groupKey}

        if(cbian){
            text1Data.text = cbian.shiText;
            text2Data.text = cbian.centerText;
            text3Data.text = cbian.xuText;
        }
        diagram.model.addNodeData(text1Data)
        diagram.model.addNodeData(text2Data)
        diagram.model.addNodeData(text3Data)
        diagram.model.addNodeData(themeData)
        diagram.model.addNodeData(timeData)
        diagram.model.addNodeData(energeData)
        diagram.model.addNodeData(picData)
        diagram.model.addNodeData(groupData)
        
    //     {"text":"自由文本",
    //     "deletable":true, 
    //     "role":"freeText",
    //     "fill":"black", 
    //     "iconVisible":false, 
    //     "locationSpot":"0.5 0.5 0 0", 
    //     "textAlign":"center", 
    //     "category":"autoText", 
    //     "loc": go.Point.stringify(e.documentPoint), 
    //     "movable":true, "group":node.data.key
    //    }

        diagram.commitTransaction("addCbian")
    }
    adjustTextAngle(...obj){
        adjustTextAngle(obj)
    }
    // 增加橄榄
    addOlive(node, cbian){
        console.log("addOliveaddOlive")
        var diagram = this.diagram
        if(!node){
            node = diagram.selection.first();
        }
        if(!node) return;
        var count = 0
        var labelGroup;
        var it = node.containingGroup.findSubGraphParts().iterator;
        var oliveWidth = node.containingGroup.data.oliveWidth;
        while (it.next()) {
            var n = it.value;
            if(n.data.category == "wave"){
                count++;
            }
        }
        var maxOlive = 50;
        if(node.containingGroup.data.maxOlive != null){
            maxOlive = node.containingGroup.data.maxOlive
        }
        if(count>maxOlive){
            return;
        }
        var curShiText = this.diagram.findNodeForKey(node.data.shiText)
        var curXuText = this.diagram.findNodeForKey(node.data.xuText)
        diagram.startTransaction("dspiral")
        var order = 1000;
        if(node.data.order != null){
            order = Number(node.data.order)+0.5;
        }

        var data = JSON.parse(JSON.stringify(node.data))
        Object.assign(data, {
            "key": helpers.guid(), 
            "order": order,
            "text":"",
        })
        if(cbian){
            data.text = cbian.centerText
        }
        delete data.centerText
        delete data.__gohashid
        delete data.hyperlink
        delete data.remark
        // var data =  {"category":"wave", 
        //     "text":"", 
        //     "level":0, "key": helpers.guid(), 
        //     "group":node.data.group, 
        //     "loc":node.data.loc,
        //     "desiredSize":node.data.desiredSize, 
        //     "order": order,
        //     "font": node.data.font,
        //     "textStroke": node.data.textStroke,
        //     "textAlign": node.data.textAlign,
        //     "spacingline": node.data.spacingline,
        // }
        var shiText = JSON.parse(JSON.stringify(curShiText.data))
        delete shiText.__gohashid
        delete shiText.textAlign
        delete shiText.hyperlink
        delete shiText.remark
        delete shiText.nloc
        Object.assign(shiText, {
            "key": helpers.guid(), 
            "order": order,
            "olive": data.key,
            "text":"",
        })
        if(cbian){
            shiText.text = cbian.shiText
        }
        // var shiText = {
        // "text":"",
        // "minSize":`${oliveWidth-30} 30`,
        // "deletable":false,
        //  "font":curShiText.data.font || "18px 'Microsoft YaHei'", 
        // //  "textStroke": curShiText.textStroke,
        //  "textAlign": curShiText.data.textAlign,
        //  "spacingline": curShiText.data.spacingline,
        //  "category":"autoText", 
        //  "key": helpers.guid(), "width":300, 
        //  "role":"shiText", "level":0, "group": node.data.group, 
        //  "order": order,
        //  "olive": data.key,
        // }
        var xuText = JSON.parse(JSON.stringify(curXuText.data))
        delete xuText.__gohashid
        delete xuText.textAlign
        delete xuText.hyperlink
        delete xuText.remark
        delete xuText.nloc
        Object.assign(xuText, {
            "key": helpers.guid(), 
            "order": order,
            "olive": data.key,
            "text":"",
        })
        if(cbian){
            xuText.text = cbian.xuText
        }
        // var xuText = {
        // "text":"",
        // "minSize":`${oliveWidth-30} 30`,
        // "deletable":false,
        //  "font": curXuText.data.font || "18px 'Microsoft YaHei'", 
        //  "textAlign": curXuText.data.textAlign,
        //  "spacingline": curXuText.data.spacingline,
        //  "category":"autoText", 
        //  "key": helpers.guid(), "width":300, 
        //  "role":"xuText", "level":0, "group": node.data.group, 
        //  "order": order,
        //  "olive": data.key
        // }
        data.shiText = shiText.key
        data.xuText = xuText.key


        console.log("orderorderorderorder:",order)
        if(node.containingGroup){
            node.containingGroup.layout.isOngoing = true;
            // node.containingGroup.layout.isInit = true;
            node.containingGroup.layout.isValidLayout = false;
            if(node.containingGroup.containingGroup){
                node.containingGroup.containingGroup.layout.isOngoing = true;
                node.containingGroup.containingGroup.layout.isValidLayout = false; 
            }
        }
        data.isNew = true
        diagram.model.addNodeData(data);
        diagram.model.addNodeData(shiText);
        diagram.model.addNodeData(xuText);
        //diagram.model.setDataProperty(node.containingGroup,"width",300)
        // diagram.model.setDataProperty(node.containingGroup,"width",300)
        diagram.commitTransaction("dspiral")
        // this.diagram.updateAllTargetBindings()
        // setTimeout(()=>{
        //     // this.diagram.updateAllTargetBindings()
        //     // this.diagram.layoutDiagram(true)
        //     node.containingGroup.layout.isOngoing = true;
        //     // node.containingGroup.layout.isInit = true;
        //     node.containingGroup.layout.isValidLayout = false;
        //     if(node.containingGroup.containingGroup){
        //         node.containingGroup.containingGroup.layout.isOngoing = true;
        //         node.containingGroup.containingGroup.layout.isValidLayout = false; 
        //     }
        // },500)
        // this.layoutAllGroup()
    }


    getAxisGroupData(options){
        var e = this.diagram.lastInput
        // diagram.startTransaction("addCbian")
        // var groupKey = helpers.guid()
        
        var basePoint = e.documentPoint
        var baseLoc = go.Point.stringify(basePoint)
  var axisGroupKey = helpers.guid()
  var labelGroupKey = helpers.guid()
  var waveGroupKey = helpers.guid()
  var olive1Key = helpers.guid()
  var olive2Key = helpers.guid()
  var olive3Key = helpers.guid()
  var olive4Key = helpers.guid()
  var olive1ShiTextKey = helpers.guid()
  var olive1XuTextKey = helpers.guid()
  var olive2ShiTextKey = helpers.guid()
  var olive2XuTextKey = helpers.guid()
  var olive3ShiTextKey = helpers.guid()
  var olive3XuTextKey = helpers.guid()
  var olive4ShiTextKey = helpers.guid()
  var olive4XuTextKey = helpers.guid()
  var olive1CenterTextKey = helpers.guid()
  var olive2CenterTextKey = helpers.guid()
  var olive3CenterTextKey = helpers.guid()
  var olive4CenterTextKey = helpers.guid()

  var temp = [
  {"category":"labelGroup", "group":axisGroupKey, "role":"labelGroup", "isGroup":true, "level":0, "key":labelGroupKey, "loc":go.Point.stringify(basePoint.copy().offset(30,700)), "deletable":false, "selectable":false},
{"category":"waveGroup","maxOlive":15, "deletable":false, "haveTail":true, "oliveType":"Wave", "shiStroke":"#0e399d", "xuStroke":"#cb1c27", "centerStroke":"rgba(9, 166, 9, 1)", "oliveWidth":150, "oliveHeight":120, "isGroup":true, "level":0, "key":waveGroupKey, "loc":baseLoc, "angle":330.08938180947, "group":axisGroupKey, "movable":false, "desiredSize":"700 120", "textAngle":"horizontal", "centerTextAngle":"independent", "centerTextMode":"independent"},
{"category":"axisGroup", "isGroup":true, "level":0, "key":axisGroupKey, "loc":baseLoc, "angle":0, "desiredSize":"300 150"},
{"category":"line", "level":0, "key":-11, "loc":baseLoc, "desiredSize":"700 1", "width":1400, "height":1, "group":waveGroupKey, "angle":330.08938180947, "role":"centerLine", "selectable":false, "stroke":"rgba(9, 166, 9, 1)"},
{"category":"line", "level":0, "key":-8, "loc":"-91.91674008334496 -140.02427812707117", "desiredSize":"606.7630471788291 10", "width":1400, "height":1, "angle":0, "group":axisGroupKey, "role":"axisX", "selectable":false, "stroke":"#0e399d"},
{"category":"line", "level":0, "key":-7, "loc":"-91.91674008334496 -140.02427812707117", "desiredSize":"349.05387059630493 10", "width":1400, "height":1, "angle":270, "group":axisGroupKey, "role":"axisY", "selectable":false, "stroke":"#cb1c27"},
{"text":"能量", "deletable":false, "font":"24px 'Microsoft YaHei'", "category":"autoText", "loc":"-101.91674008334496 -489.0781487233761", "key":-12, "role":"axisYText", "locationSpot":"1 0.5 0 0", "group":axisGroupKey, "movable":true},
{"text":"主题", "role":"themeText", "deletable":false, "font":"24px 'Microsoft YaHei'", "category":"autoText", "loc":go.Point.stringify(basePoint.copy().offset(-30,0)), "key":-13, "level":0, "group":axisGroupKey, "locationSpot":"0.5 0 0 0", "movable":true, "width":300},
{"text":"时间", "deletable":false, "font":"24px 'Microsoft YaHei'", "category":"autoText", "loc":"514.8463070954841 -140.02427812707117", "key":-14, "role":"axisXText", "group":axisGroupKey, "locationSpot":"0.5 0 0 0"},
{"text":"实线：", "deletable":false, "fill":"#cb1c27", "iconVisible":true, "locationSpot":"0 0 0 0", "textAlign":"start", "category":"autoText", "loc":go.Point.stringify(basePoint.copy().offset(30,-350)), "role":"labelText1", "movable":true, "group":labelGroupKey, "visible":true, "minSize":"120 30"},
{"text":"虚线：", "deletable":false, "fill":"#0e399d", "iconVisible":true, "locationSpot":"0 0 0 0", "textAlign":"start", "category":"autoText", "loc":go.Point.stringify(basePoint.copy().offset(30,-310)), "role":"labelText2", "movable":true, "group":labelGroupKey, "visible":true, "minSize":"120 30"},
{"text":"中线：", "deletable":false, "fill":"#3f5369", "iconVisible":true, "locationSpot":"0 0 0 0", "textAlign":"start", "category":"autoText", "loc":go.Point.stringify(basePoint.copy().offset(30,-270)), "role":"labelText3", "movable":true, "group":labelGroupKey, "visible":true, "minSize":"120 30"},

{"category":"wave", "text":"", "role":"waveTail", "deletable":false, "selectable":false, "level":0, "key":"2d6ff2f1-0966-36bf-4e85-f5775ca0652b", "group":waveGroupKey, "loc":"710.0826118675676 -829.1890319396903", "desiredSize":"75 120", "order":999, "oliveType":"Wave", "angle":330.08938180947, "textAlign":"center", "shiStroke":"#0e399d", "xuStroke":"#cb1c27", "centerText":"df53d882-fe51-d78e-d8e3-8d9681578cb8", "textVisible":false, "isNew":null},
    ]
    if(!options){
        temp = temp.concat([
            {"category":"wave", "text":"1\n", "level":0, "key":olive1Key, "group":waveGroupKey, "desiredSize":"150 120", "order":1, "shiText":olive1ShiTextKey, "xuText":olive1XuTextKey, "angle":330.08938180947, "loc":"-91.91674008334496 -140.02427812707123", "oliveType":"Ellipse", "textAlign":"center", "shiStroke":"#cb1c27", "xuStroke":"#0e399d", "centerText":olive1CenterTextKey, "textVisible":false},
            {"deletable":false, "text":"", "font":"18px 'Microsoft YaHei'", "category":"autoText", "key":olive1ShiTextKey, "width":150, "role":"shiText", "level":0, "group":waveGroupKey, "order":1, "olive":olive1Key, "loc":"4.128618140465704 -125.47989214278559", "locationSpot":"0 0 0 0", "textStroke":"#cb1c27", "showBorder":true, "angle":0, "minSize":"120 30", "textAlign":"center"},
            {"deletable":false, "text":"", "font":"18px 'Microsoft YaHei'", "category":"autoText", "key":olive1XuTextKey, "width":150, "role":"xuText", "level":0, "group":waveGroupKey, "order":1, "olive":olive1Key, "loc":"-56.2078366340385 -230.36321886941172", "locationSpot":"1 1 0 0", "textStroke":"#0e399d", "showBorder":true, "angle":0, "minSize":"120 30", "textAlign":"center"},
            {"category":"wave", "text":"3\n", "level":0, "key":olive2Key, "group":waveGroupKey, "desiredSize":"150 120", "order":3, "shiText":olive2ShiTextKey, "xuText":olive2XuTextKey, "angle":330.08938180947, "loc":"168.12456585043884 -289.61879409691636", "oliveType":"Ellipse", "textAlign":"center", "shiStroke":"#cb1c27", "xuStroke":"#0e399d", "centerText":olive2CenterTextKey, "textVisible":false},
            {"deletable":false, "text":"", "font":"18px 'Microsoft YaHei'", "category":"autoText", "key":olive2ShiTextKey, "width":150, "role":"shiText", "level":0, "group":waveGroupKey, "order":3, "olive":olive2Key, "loc":"264.16992407424954 -275.07440811263075", "locationSpot":"0 0 0 0", "textStroke":"#cb1c27", "showBorder":true, "angle":0, "minSize":"120 30", "textAlign":"center"},
            {"deletable":false, "text":"", "font":"18px 'Microsoft YaHei'", "category":"autoText", "key":olive2XuTextKey, "width":150, "role":"xuText", "level":0, "group":waveGroupKey, "order":3, "olive":olive2Key, "loc":"203.83346929974533 -379.9577348392569", "locationSpot":"1 1 0 0", "textStroke":"#0e399d", "showBorder":true, "angle":0, "minSize":"120 30", "textAlign":"center"},
            {"category":"wave", "text":"2\n", "level":0, "key":olive3Key, "group":waveGroupKey, "desiredSize":"150 120", "order":2, "shiText":olive3ShiTextKey, "xuText":olive3XuTextKey, "angle":330.08938180947, "loc":"38.10391288354694 -214.8215361119938", "oliveType":"Ellipse", "textAlign":"center", "shiStroke":"#cb1c27", "xuStroke":"#0e399d", "centerText":olive3CenterTextKey, "textVisible":false},
            {"deletable":false, "text":"", "font":"18px 'Microsoft YaHei'", "category":"autoText", "key":olive3ShiTextKey, "width":150, "role":"shiText", "level":0, "group":waveGroupKey, "order":2, "olive":olive3Key, "loc":"73.8128163328534 -305.1604768543343", "locationSpot":"1 1 0 0", "textStroke":"#cb1c27", "showBorder":true, "angle":0, "minSize":"120 30", "textAlign":"center"},
            {"deletable":false, "text":"", "font":"18px 'Microsoft YaHei'", "category":"autoText", "key":olive3XuTextKey, "width":150, "role":"xuText", "level":0, "group":waveGroupKey, "order":2, "olive":olive3Key, "loc":"134.1492711073576 -200.27715012770815", "locationSpot":"0 0 0 0", "textStroke":"#0e399d", "showBorder":true, "angle":0, "minSize":"120 30", "textAlign":"center"},
            {"category":"wave", "text":"4\n", "level":0, "key":olive4Key, "group":waveGroupKey, "desiredSize":"150 120", "order":4, "shiText":olive4ShiTextKey, "xuText":olive4XuTextKey, "angle":330.08938180947, "loc":"298.1452188173308 -364.41605208183887", "oliveType":"Ellipse", "textAlign":"center", "shiStroke":"#cb1c27", "xuStroke":"#0e399d", "centerText":olive4CenterTextKey, "textVisible":false},
            {"deletable":false, "text":"", "font":"18px 'Microsoft YaHei'", "category":"autoText", "key":olive4ShiTextKey, "width":150, "role":"shiText", "level":0, "group":waveGroupKey, "order":4, "olive":olive4Key, "loc":"333.8541222666372 -454.7549928241794", "locationSpot":"1 1 0 0", "textStroke":"#cb1c27", "showBorder":true, "angle":0, "minSize":"120 30", "textAlign":"center"},
            {"deletable":false, "text":"", "font":"18px 'Microsoft YaHei'", "category":"autoText", "key":olive4XuTextKey, "width":150, "role":"xuText", "level":0, "group":waveGroupKey, "order":4, "olive":olive4Key, "loc":"394.1905770411414 -349.87166609755326", "locationSpot":"0 0 0 0", "textStroke":"#0e399d", "showBorder":true, "angle":0, "minSize":"120 30", "textAlign":"center"},
            {"text":"1\n", "minSize":"120 30", "deletable":false, "textAlign":"center", "font":"18px 'Microsoft YaHei'", "category":"autoText", "key":olive1CenterTextKey, "width":120, "role":"centerText", "level":0, "group":waveGroupKey, "order":1, "visible":true, "layerName":"Foreground", "locationSpot":"0.5 0.5 0 0", "selectable":false, "olive":olive1Key, "loc":"-26.039609246786398 -177.92155550609866", "angle":0},
            {"text":"2\n", "minSize":"120 30", "deletable":false, "textAlign":"center", "font":"18px 'Microsoft YaHei'", "category":"autoText", "key":olive3CenterTextKey, "width":120, "role":"centerText", "level":0, "group":waveGroupKey, "order":2, "visible":true, "layerName":"Foreground", "locationSpot":"0.5 0.5 0 0", "selectable":false, "olive":olive3Key, "loc":"103.9810437201055 -252.71881349102122", "angle":0},
            {"text":"3\n", "minSize":"120 30", "deletable":false, "textAlign":"center", "font":"18px 'Microsoft YaHei'", "category":"autoText", "key":olive2CenterTextKey, "width":120, "role":"centerText", "level":0, "group":waveGroupKey, "order":3, "visible":true, "layerName":"Foreground", "locationSpot":"0.5 0.5 0 0", "selectable":false, "olive":olive2Key, "loc":"234.00169668699743 -327.5160714759438", "angle":0},
            {"text":"4\n", "minSize":"120 30", "deletable":false, "textAlign":"center", "font":"18px 'Microsoft YaHei'", "category":"autoText", "key":olive4CenterTextKey, "width":120, "role":"centerText", "level":0, "group":waveGroupKey, "order":4, "visible":true, "layerName":"Foreground", "locationSpot":"0.5 0.5 0 0", "selectable":false, "olive":olive4Key, "loc":"364.0223496538893 -402.3133294608663", "angle":0},
        ])
    }
  return temp
    }
    

    // 增加拓扑
    addAxisGroup(options){
        console.log("addOliveaddOlive")
        var diagram = this.diagram
        var axisGroupCount = 0;
        for(var i=0;i<diagram.model.nodeDataArray.length;i++){
            if(diagram.model.nodeDataArray[i].category == "axisGroup"){
                axisGroupCount += 1;
            }
        }
        // 最多插入13个拓扑
        if(axisGroupCount > 13){
            return;
        }
        var axisData = this.getAxisGroupData(options)
        if(!axisData) return;
        diagram.startTransaction("dspiral")
        for(var i=0;i<axisData.length;i++){
            diagram.model.addNodeData(axisData[i]);
        }
       
        //diagram.model.setDataProperty(node.containingGroup,"width",300)
        // diagram.model.setDataProperty(node.containingGroup,"width",300)
        diagram.commitTransaction("dspiral")
        return axisData
        // this.diagram.updateAllTargetBindings()
        // setTimeout(()=>{
        //     // this.diagram.updateAllTargetBindings()
        //     this.diagram.layoutDiagram(true)
        // },500)
        // this.layoutAllGroup()
    }
    // 选择文本节点
    selectText(e) {
        // console.log("selectTextselectTextselectText")
        var myDiagram = this.diagram
        var node = myDiagram.selection.first();
        if (!node) return;
        // removeNodeRemarkTips();
        // console.log("selectTExt")

        var tb = myDiagram.selection.first().findObject('TEXT');
        if (tb) myDiagram.commandHandler.editTextBlock(tb);
        // try{
        //     var tmp;
        //     if(node.containingGroup && node.containingGroup.data.category == "waveGroup"){
        //         if(node.data.role == "shiText"){
        //             if(node.containingGroup.labelText1 && node.data.text.trim() == ""){
        //                 // node.data.text = node.containingGroup.labelText1.data.text
        //                 tmp = node.containingGroup.labelText1.data.text.replace("实线：","")
        //                 if(tmp != ""){
        //                     myDiagram.currentTool.currentTextEditor.mainElement.value = tmp+"："
        //                 }
        //             }
        //         }
        //         if(node.data.role == "xuText"){
        //             if(node.containingGroup.labelText2 && node.data.text.trim() == ""){
        //                 // node.data.text = node.containingGroup.labelText1.data.text
        //                 tmp = node.containingGroup.labelText2.data.text.replace("虚线：","")
        //                 if(tmp != ""){
        //                     myDiagram.currentTool.currentTextEditor.mainElement.value = tmp+"："
        //                 }
        //             }
        //         }
        //         if(node.data.category == "wave" || node.data.role == "centerText"){
        //             if(node.containingGroup.labelText3 && node.data.text.trim() == ""){
        //                 // node.data.text = node.containingGroup.labelText1.data.text
        //                 tmp = node.containingGroup.labelText3.data.text.replace("中线：","")
        //                 if(tmp != ""){
        //                     myDiagram.currentTool.currentTextEditor.mainElement.value = tmp+"："
        //                 }
        //             }
        //         }
        //     }
        // }catch(e){
        //     console.log("selectText:error:",e)
        // }
        // 手机上支持换行，电脑上需要ctl+Enter键换行
        if(!helpers.checkPhone()){
            helpers.simulateEnterWithAlt(e);
        }else{
            var val = myDiagram.currentTool.currentTextEditor.mainElement.value
            myDiagram.currentTool.currentTextEditor.mainElement.selectionStart = val.length; 
            myDiagram.currentTool.currentTextEditor.mainElement.selectionEnd = val.length; 
        }
    }

    clearAllTextBorder(){
        var it = this.diagram.nodes.iterator;
        while (it.next()) {
            var n = it.value;
            if(n.data.category == "autoText"){
                  n.findObject("textBorder").visible = false;
            }
        }
    }
    apiSwitchWaveTail(){
        console.log("apiSwitchWaveTailapiSwitchWaveTail")
        var node = this.diagram.selection.first()
        if(!node) return
        this.diagram.startTransaction()
        // this.diagram.model.setDataProperty(node.data, "oliveType", "Ellipse")
        // this.diagram.model.setDataProperty(node.data, "haveTail", false)
        var it = node.findSubGraphParts().iterator;
        var waveTail= null; // 查找是否存在尾巴
        var lastNode = null;
        var loc;
        while(it.next()){
            var n = it.value;
            lastNode = n;
            if(n.data.role == "waveTail"){
                waveTail = n;
                break;
            }
        }
        if(lastNode){
            loc = lastNode.data.loc
        }else{
            loc = node.data.loc
        }
        if(waveTail){
            this.diagram.model.removeNodeData(waveTail.data);
            this.diagram.model.setDataProperty(node.data, "haveTail", false)
        }else{
            this.diagram.model.setDataProperty(node.data, "haveTail", true)
            var tailOlive = {"category":"wave", 
                "text":"", 
                "role":"waveTail",
                deletable:false,
                "selectable": false,
                "deletable": false,
                "level":0, "key": helpers.guid(), 
                "group":node.data.key, 
                "loc": loc,
                "desiredSize": `${node.data.oliveWidth} ${node.data.oliveHeight}`, 
                "order": 2000,
            }
            this.diagram.model.addNodeData(tailOlive)
        }
        node.layout.isOngoing = true;
        node.layout.isValidLayout = false;
        this.diagram.commitTransaction()
    }

    //切换为橄榄形状
    apiSwitchToEllipse(){
        console.log("apiSwitchToEllipse")
        var node = this.diagram.selection.first()
        if(!node) return
        this.diagram.startTransaction()
        this.diagram.model.setDataProperty(node.data, "oliveType", "Ellipse")
        // this.diagram.model.setDataProperty(node.data, "haveTail", false)
        var it = node.findSubGraphParts().iterator;
        var waveTail= null; // 查找是否存在尾巴

        while(it.next()){
            var n = it.value;
            if(n.data.role == "waveTail"){
                waveTail = n;
                break;
            }
        }

        if(waveTail){
            this.diagram.model.removeNodeData(waveTail.data);
        }
        node.layout.isOngoing = true;
        node.layout.isValidLayout = false;
        if(node.containingGroup){
            node.containingGroup.layout.isOngoing = true;
            node.containingGroup.layout.isValidLayout = false;
        }
        this.diagram.commitTransaction()
    }


    
    // 切换为螺旋形状
    apiSwitchToWave(){
        var node = this.diagram.selection.first()
        if(!node) return
        this.diagram.startTransaction("apiSwitchToWave")
        this.diagram.model.setDataProperty(node.data, "oliveType", "Wave")
        // this.diagram.model.setDataProperty(node.data, "haveTail", true)
        var it = node.findSubGraphParts().iterator;
        var waveTail= null; // 查找是否存在尾巴
        var lastNode = null;
        var haveTail = node.data.haveTail
        var loc;
        while(it.next()){
            var n = it.value;
            lastNode = n;
            if(n.data.role == "waveTail"){
                waveTail = n;
                break;
            }
        }
        if(lastNode){
            loc = lastNode.data.loc
        }else{
            loc = node.data.loc
        }
        if(!waveTail && haveTail == true){
            var tailOlive = {"category":"wave", 
                "text":"", 
                "role":"waveTail",
                deletable:false,
                "selectable": false,
                "deletable": false,
                "level":0, "key": helpers.guid(), 
                "group":node.data.key, 
                "loc": loc,
                "desiredSize": `${node.data.oliveWidth} ${node.data.oliveHeight}`, 
                "order": 2000,
            }
            this.diagram.model.addNodeData(tailOlive)
        }
        node.layout.isOngoing = true;
        node.layout.isValidLayout = false;
        if(node.containingGroup){
            node.containingGroup.layout.isOngoing = true;
            node.containingGroup.layout.isValidLayout = false;
        }
        this.diagram.commitTransaction("apiSwitchToWave")
    }

    // 切换文字方向
    apiSwitchTextAngle(textAngle){
        var node = this.diagram.selection.first()
        if(!node) return
        var mapObj = {
            "horizontal":"vertical",
            "vertical":"horizontal",
        }
        console.log("apiSwitchTextAngle")
        
        node.diagram.startTransaction("apiSwitchTextAngle")
        if(textAngle && ["horizontal","vertical"].indexOf(textAngle) > -1){
            node.diagram.model.setDataProperty(node.data, "textAngle", textAngle)
            node.data.textAngle = textAngle
        }else{
           textAngle = mapObj[node.data.textAngle] || "horizontal"
           node.diagram.model.setDataProperty(node.data, "textAngle", textAngle)
            node.data.textAngle = textAngle
            // }
        }
        // var angle = node.angle
        // this.diagram.model.setDataProperty(node.data, "angle", angle+1)
        // this.diagram.model.setDataProperty(node.data, "angle", angle)
        // node.layout.isInit = true;
        // setTimeout(()=>{
            node.layout.isOngoing = true;
            node.layout.isValidLayout = false;
        // })
        node.diagram.commitTransaction("apiSwitchTextAngle")
        // this.diagram.startTransaction("layout")
        // node.layout.isOngoing = true;
        // node.layout.isValidLayout = false;
        // this.diagram.commitTransaction("layout")
        // this.diagram.updateAllTargetBindings()
        // this.diagram.layoutDiagram(true)
    }

    // 以下两个方法控制菜单显示
    getDefaultCustomMenuDivStr(){
        return `
        <ul>
            <li trtd_action="addFollower"><a class="i18n" data-lang="insertsl">插入同级节点</a></li>
            <li trtd_action="startNewSpiral"><a class="i18n" data-lang="icn">插入子节点</a></li>
            <li trtd_action="apiDuplicateNode"><a class="i18n" data-lang="duplicateNode">复制节点</a></li>
            <li trtd_action="apiDeleteSelection"><a class="i18n" data-lang="remove">删除</a></li>
            <li trtd_action="splitOlive2Cbian"><a class="i18n" data-lang="remove">分离</a></li>
            <li trtd_action="splitOlive2Half"><a class="i18n" data-lang="remove">拆分</a></li>
            <li trtd_action="orderChildNode"><a class="i18n" data-lang="ordernode">子节点编号</a></li>
            <li trtd_action="clearOrderChildNode"><a class="i18n" data-lang="clearordernode">取消子节点编号</a></li>
            <li trtd_action="clearNodeTextMenu"><a class="i18n" data-lang="emptynodetext">清空节点文本</a></li>
            <li trtd_action="apiInsertTianpanNode"><a class="i18n" data-lang="insertnodetianpan">插入天盘节点</a></li>
            <li trtd_action="addTextNode"><a class="i18n" data-lang="inserttext">插入文本</a></li>
            <li trtd_action="locateRootNodeMenu"><a class="i18n" data-lang="locaterootnode">定位根节点</a></li>
            <li trtd_action="showAllNodesMenu"><a class="i18n" data-lang="displayallnodes">显示所有节点</a></li>
            <li trtd_action="fixPictureMenu"><a class="i18n" data-lang="fixnode">固定节点</a></li>
            <li trtd_action="activePictureMenu"><a class="i18n" data-lang="cancelfix">取消固定</a></li>
            <li trtd_action="apiSwitchToEllipse"><a class="i18n" data-lang="cancelfix">切换为橄榄形状</a></li>
            <li trtd_action="apiSwitchToWave"><a class="i18n" data-lang="cancelfix">切换为螺旋形状</a></li>
            <li trtd_action="apiSwitchWaveTail"><a class="i18n" data-lang="cancelfix">添加/删除尾巴</a></li>
            <li trtd_action="apiSwitchTextAngle"><a class="i18n" data-lang="cancelfix">切换文字方向</a></li>
            <li trtd_action="addCbian"><a class="i18n" data-lang="cancelfix">添加总结图</a></li>
            <li trtd_action="addAxisGroup"><a class="i18n" data-lang="cancelfix">插入拓扑</a></li>
            <li trtd_action="showRect"><a class="i18n" data-lang="cancelfix">显示矩形线</a></li>
            <li trtd_action="hideRect"><a class="i18n" data-lang="cancelfix">隐藏矩形线</a></li>
            <li trtd_action="offShowRedLine"><a class="i18n" data-lang="cancelfix">关闭自动显示红线</a></li>
            <li trtd_action="autoShowRedline"><a class="i18n" data-lang="cancelfix">自动显示自旋红线</a></li>
            <li trtd_action="bringupLayer"><a class="i18n" data-lang="cancelfix">上移一层</a></li>
            <li trtd_action="bringdownLayer"><a class="i18n" data-lang="cancelfix">下移一层</a></li>
            <li trtd_action="bringToBackground"><a class="i18n" data-lang="cancelfix">置于底层</a></li>
            <li trtd_action="bringToForeground"><a class="i18n" data-lang="cancelfix">置于顶层</a></li>
            <li trtd_action="addDimTtext"><a class="i18n" data-lang="cancelfix">增加维度</a></li>
        </ul>
        `
    }
    getShowContextMenus(node){
        var showIds = null
        console.log("getShowContextMenus")
        if(node){
            // 双螺旋可以添加常变
            if(["axisGroup"].indexOf(node.data.category) > -1){
                showIds = "addCbian,apiDeleteSelection"
            }
            if(["picGroup"].indexOf(node.data.category) > -1){
                showIds = "apiDeleteSelection"
            }

            if(["3"].indexOf(node.data.category) > -1){
                showIds = "bringupLayer,apiDeleteSelection,bringdownLayer,bringToBackground,bringToForeground"
            }

            if( ["wave"].indexOf(node.data.category) > -1){
                if(node.data.deletable != null){
                    if(node.data.deletable){
                        showIds = "apiDeleteSelection,splitOlive2Cbian,splitOlive2Half";
                    }
                }else{
                    if(node.deletable){
                        showIds = "apiDeleteSelection,splitOlive2Cbian,splitOlive2Half";
                    }
                }
            }
            console.log("waveGroupwaveGroup")
            if( ["waveGroup"].indexOf(node.data.category) > -1){
                showIds = "apiSwitchTextAngle,";
                if(node.data.oliveType == "Ellipse"){
                    showIds += "apiSwitchToWave"
                }else{
                    showIds += "apiSwitchToEllipse,apiSwitchWaveTail"
                }
                
            }
            if( ["yunGroup"].indexOf(node.data.category) > -1){
                showIds = "";
                if(node.data.showShape){
                    showIds += "hideRect"
                }else{
                    showIds += "showRect"
                }
                if(node.data.beginSpark != "line"){
                    showIds += ",autoShowRedline"
                }else{
                    showIds += ",offShowRedLine"
                }
            }
            if( ["autoText"].indexOf(node.data.category) > -1 && ["shiText","xuText"].indexOf(node.data.role) < 0){
                showIds = "apiDeleteSelection";
            }
            if(node.data.subRole == "dimText" && node.containingGroup.data.category == "yunpanGroup"){
                showIds = "apiDeleteSelection,addDimTtext"
            }
            if(node.data.category == "shapeText"&& node.containingGroup.data.category == "yunpanGroup"){
                showIds = "apiDeleteSelection"
            }
            // return "addFollowerGround," + "addNewCircle,"+"apiDeleteSelection";
        }else{
            // return "addFollowerGround"
            showIds = "addCbian,addAxisGroup"
        }
        return showIds;
    }
    
    // 云盘增加维度
    addDimTtext(){
        var node = this.diagram.selection.first();
        var myDiagram = this.diagram;
        if(!node) return;
        if(node.data.subRole != "dimText") return;
        var count = 0
        var it = node.containingGroup.findSubGraphParts().iterator;
        var deleteNodes = []
        var deleteLines = []
        var curLine = null;
        var normDim = "X",unnormDim = "Y", lineRole = "verticalLine"
        if(node.data.dimX == 0){
            normDim = "Y"
            unnormDim = "X"
            lineRole = "horizontalLine"
        }
        while (it.next()) {
            var n = it.value;
            if(n.data.subRole == "dimText" && n.data["dim"+unnormDim] == 0){
                // if(n.data.order == node.data.order+1){
                //     locateNode = n;
                // }
                count++;
            }
            if(n.data.subRole == "yunpanText" && n.data["order"+normDim] == node.data["dim"+normDim]){
                deleteNodes.push(n.data)
            }
            if(n.data.category == "line"  && n.data.role == lineRole
            && n.data["order"]  == node.data["dim"+normDim]
            ){
                curLine = n
            }
            // if(n.data.role == "xuText" && n.data.order == node.data.order){
            //     xuText = n;
            // }
            // if(n.data.role == "centerText" && n.data.order == node.data.order){
            //     centerText = n;
            // }

        }
        
        if(count>=30){
           
            return;
        }
        this.diagram.startTransaction("addDimTtext");
        it.reset()
        while (it.next()) {
            var n = it.value;
            if(n.data.subRole == "dimText" && n.data["dim"+unnormDim] == 0 && n.data["dim"+normDim] > node.data["dim"+normDim]){
                // if(n.data.order == node.data.order+1){
                //     locateNode = n;
                // }
                n.diagram.model.setDataProperty(n.data, "dim"+normDim, n.data["dim"+normDim] + 1)
                // count++;
            }
            if(n.data.subRole == "yunpanText" && n.data["order"+normDim] > node.data["dim"+normDim]){
                n.diagram.model.setDataProperty(n.data, "order"+normDim, n.data["order"+normDim] + 1)
            }
            if(n.data.category == "line"  && n.data.role == lineRole
            && n.data["order"]  > node.data["dim"+normDim]
            ){
                n.diagram.model.setDataProperty(n.data, "order", n.data["order"] + 1)
            }
            // if(n.data.role == "xuText" && n.data.order == node.data.order){
            //     xuText = n;
            // }
            // if(n.data.role == "centerText" && n.data.order == node.data.order){
            //     centerText = n;
            // }

        }
        var dimTextData = JSON.parse(JSON.stringify(node.data))
        delete dimTextData.key;
        delete dimTextData.__gohashid;
        if(curLine){
            var lineData = JSON.parse(JSON.stringify(curLine.data))
            delete lineData.key;
            delete lineData.__gohashid;
            lineData["order"] = lineData["order"]+1;
            node.diagram.model.addNodeData(lineData)
        }
        // Object.assign(dimTextData, {

        // })
        dimTextData["dim"+normDim] = node.data["dim"+normDim]+1;
        dimTextData.text = "维度" + dimTextData["dim"+normDim]
        node.diagram.model.addNodeData(dimTextData)
        // node.diagram.model.removeNodeDataCollection(deleteNodes)
        node.containingGroup.layout.isOngoing = true;
        node.containingGroup.layout.isValidLayout = false;
        this.diagram.commitTransaction("addDimTtext");
    }

    bringToBackground(){
        var node = this.diagram.selection.first();
        var myDiagram = this.diagram;
        myDiagram.model.startTransaction();
        myDiagram.model.setDataProperty(node.data, "layerName", "Background");
        myDiagram.model.setDataProperty(node.data, "zOrder", 1);
        myDiagram.model.commitTransaction();
    }
    bringToForeground(){
        var node = this.diagram.selection.first();
        var myDiagram = this.diagram;
        myDiagram.model.startTransaction();
        myDiagram.model.setDataProperty(node.data, "layerName", "Foreground");
        myDiagram.model.setDataProperty(node.data, "zOrder", 999);
        myDiagram.model.commitTransaction();
    }

    bringdownLayer(){
        var node = this.diagram.selection.first();
        var myDiagram = this.diagram;
        if(!node) return;
        var layerName = node.layerName;
        var toLayerName = layerName
        var zOrder = node.zOrder;
        var toZOrder = 1;
        if(layerName == "Foreground"){
            toLayerName = "default"
        }
        if(layerName == "default"){
            toLayerName = "Background"
        }
        if(layerName == "Background"){
            toLayerName = "Background"
        }
        myDiagram.model.startTransaction();
        myDiagram.model.setDataProperty(node.data, "layerName", toLayerName);
        myDiagram.model.setDataProperty(node.data, "zOrder", toZOrder);
        myDiagram.model.commitTransaction();
    }
    bringupLayer(){
        var node = this.diagram.selection.first();
        var myDiagram = this.diagram;
        if(!node) return;
        var layerName = node.layerName;
        var toLayerName = layerName
        var zOrder = node.zOrder;
        var toZOrder = 999;
        if(layerName == "Background"){
            toLayerName = "default"
        }
        if(layerName == "default"){
            toLayerName = "Foreground"
        }
        if(layerName == "Foreground"){
            toLayerName = "Foreground"
        }
        myDiagram.model.startTransaction();
        myDiagram.model.setDataProperty(node.data, "layerName", toLayerName);
        myDiagram.model.setDataProperty(node.data, "zOrder", toZOrder);
        myDiagram.model.commitTransaction();
    }

    bringToLayer(layerName, zOrder) {

            var node = myDiagram.selection.first();
            myDiagram.model.startTransaction();
            if (node) {
                if (layerName == null) {
                    layerName = node.data.layerName ? node.data.layerName : "";
                    var tempData = myDiagram.model.copyNodeData(node.data);
                    myDiagram.model.removeNodeData(node.data);
                    myDiagram.model.addNodeData(tempData);

                } else {
                    myDiagram.model.setDataProperty(node.data, "layerName", layerName);
                }
            }
            myDiagram.model.commitTransaction();
        }

    showRect(){
        var node = this.diagram.selection.first()
        console.log("show shape")
        if(!node) return;
        if(node.data.category != "yunGroup") return;
        node.diagram.startTransaction("showRect")
        node.diagram.model.setDataProperty(node.data, "showShape", true)
        var it = node.findSubGraphParts().iterator;
        while (it.next()) {
            var n = it.value;
            if(n.data.role == "background"){
                node.diagram.model.setDataProperty(n.data, "visible", true)
            }
        }
        node.layout.isValidLayout = false
        node.diagram.commitTransaction("showRect")
    }
    hideRect(){
        var node = this.diagram.selection.first()
        if(!node) return;
        if(node.data.category != "yunGroup") return;
        node.diagram.startTransaction("hideRect")
        node.diagram.model.setDataProperty(node.data, "showShape", false)
        var it = node.findSubGraphParts().iterator;
        while (it.next()) {
            var n = it.value;
            if(n.data.role == "background"){
                node.diagram.model.setDataProperty(n.data, "visible", true)
                node.diagram.model.setDataProperty(n.data, "stroke", "rgba(255,0,0,0)")
            }
        }
        node.diagram.commitTransaction("hideRect")
    }
    autoShowRedline(){
        var node = this.diagram.selection.first()
        if(!node) return;
        if(node.data.category != "yunGroup") return;
        node.diagram.startTransaction("beginSpark")
        node.diagram.model.setDataProperty(node.data, "beginSpark", "line")
        node.diagram.commitTransaction("beginSpark")
    }
    offShowRedLine(){
        var node = this.diagram.selection.first()
        if(!node) return;
        if(node.data.category != "yunGroup") return;
        node.diagram.startTransaction("offShowRedLine")
        node.diagram.model.setDataProperty(node.data, "beginSpark", undefined)
        node.diagram.commitTransaction("offShowRedLine")
    }
    //快捷键
    dokeyDownFn (e) {
        console.log('dspirallllllllllllllllllllllllll:');
        var diagram = this.diagram
        var that = this;
        var myDiagram = this.diagram;
        var e = myDiagram.lastInput;
        var cmd = myDiagram.commandHandler;
        if (e.event.altKey) {
            if (e.key == "Q") {
                autoLayoutAll();
                return;
            } else if (e.key == "R") {
                centerNode();
                return;
            } else if (e.key == "C") {
                centerCurrentNode();
                return;
            } else if (e.key == "A") {
                zoomToFit();
                return;
            }
        }
        if (e.event.keyCode >= 65 && e.event.keyCode <= 90 && !e.event.altKey && !e.event.ctrlKey && !e.event.shiftKey) {
            e.bubbles = false;
            var node = myDiagram.selection.first()
            if(!node) return;
            if(node.data.category == "wave" && node.containingGroup && node.containingGroup.data.textAngle == "horizontal" && node.containingGroup.data.centerTextAngle == "independent"){
                node.findObject("TEXT").visible = true;
                var centerText = node.diagram.findNodeForKey(node.data.centerText)
                if(centerText){
                  centerText.visible = false;
                }
            }
            setTimeout(()=>{
                this.selectText(e, diagram);
            },100)
            return true;
    
        }
        // console.log('catched in dokeydown ' + e.event.keyCode);
        // console.log('catched in dokeydown ' + e.key);
        if (e.event.keyCode === 13) { // could also check for e.control or e.shift
            console.log("dspiral add Follower")
            var node = myDiagram.selection.first();
            if (node && node.category == "wave") {
                // this.addFollower(e, true);
                this.addOlive()
            }
        } else if (e.event.keyCode === 9) { // could also check for e.control or e.shift
            this.addFollower(true);
        } else if (e.key === "t") { // could also check for e.control or e.shift
            if (cmd.canCollapseSubGraph()) {
                cmd.collapseSubGraph();
            } else if (cmd.canExpandSubGraph()) {
                cmd.expandSubGraph();
            }
        } else if (e.key == "Del") {
            e.diagram.commandHandler.deleteSelection();
        } else if (e.event.keyCode == 113) { //F2,不知道为什么失效了，重新赋予功能
            // selectText();
            this.selectText(e, diagram);
        } else if (e.event.keyCode == 37) { //左
            this.moveWithinNodes('left', diagram);
            // go.CommandHandler.prototype.doKeyDown.call(cmd);
        } else if (e.event.keyCode == 38) { //上
            this.moveWithinNodes('up', diagram);
            // go.CommandHandler.prototype.doKeyDown.call(cmd);
        } else if (e.event.keyCode == 39) { //右
            this.moveWithinNodes('right', diagram);
            // go.CommandHandler.prototype.doKeyDown.call(cmd);
        } else if (e.event.keyCode == 40) { //下
            this.moveWithinNodes('down', diagram);
            // go.CommandHandler.prototype.doKeyDown.call(cmd);
        } else {
            // call base method with no arguments
            go.CommandHandler.prototype.doKeyDown.call(cmd);
        }
        e.bubbles = false; //阻止事件冒泡到dom
    }

    findPrevOlive(node){
        if(node.data.order <= 1){
            return null;
        }
        var prenode = null;
        var it = node.containingGroup.findSubGraphParts().iterator;
        while (it.next()) {
            var n = it.value;
            if(n.data.category == "wave"){
                if(n.data.order == node.data.order-1){
                    prenode = n;
                    break;
                }
            }
        }
        return prenode;
    }
    findNextOlive(node){
        var nextnode = null;
        var it = node.containingGroup.findSubGraphParts().iterator;
        while (it.next()) {
            var n = it.value;
            if(n.data.role == "waveTail"){
                continue;
            }
            if(node.data.category == "autoText"){
                if(n.data.role == "shiText"){
                    if(n.data.order == node.data.order+1){
                        nextnode = n;
                        break;
                    }
                }
            }else{
                if(n.data.category == "wave"){
                    if(n.data.order == node.data.order+1){
                        nextnode = n;
                        break;
                    }
                }
            }

        }
        return nextnode;
    }

    findUpOlive(node){
        var upnode = null;
        if(node.data.category == "wave"){
            if(node.data.order % 2 != 0){
                upnode = this.diagram.findNodeForKey(node.data.xuText)
            }else{
                upnode = this.diagram.findNodeForKey(node.data.shiText)
            }
        }
        if(node.data.role == "xuText"){
            if(node.data.order % 2 != 0){
                // upnode = this.diagram.findNodeForKey(node.data.xuText)
            }else{
                upnode = this.diagram.findNodeForKey(node.data.olive)
            }
        }
        if(node.data.role == "shiText"){
            if(node.data.order % 2 != 0){
                upnode = this.diagram.findNodeForKey(node.data.olive)
            }else{
                // upnode = this.diagram.findNodeForKey(node.data.olive)
            }
        }
        return upnode;        
    }

    findDownOlive(node){
        var downnode = null;
        if(node.data.category == "wave"){
            if(node.data.order % 2 != 0){
                downnode = this.diagram.findNodeForKey(node.data.shiText)
            }else{
                downnode = this.diagram.findNodeForKey(node.data.xuText)
            }
        }
        if(node.data.role == "xuText"){
            if(node.data.order % 2 != 0){
                downnode = this.diagram.findNodeForKey(node.data.olive)
            }else{
                // downnode = this.diagram.findNodeForKey(node.data.olive)
            }
        }
        if(node.data.role == "shiText"){
            if(node.data.order % 2 != 0){
                // downnode = this.diagram.findNodeForKey(node.data.olive)
            }else{
                downnode = this.diagram.findNodeForKey(node.data.olive)
            }
        }
        return downnode;
    }

    moveWithinNodes(direction) {
        var myDiagram = this.diagram;
        var node = myDiagram.selection.first();
        if(!node){
            return;
        }
        // 火花矩阵文字
        if(node.data.category == "autoText" && node.data.subRole == "coreText"){
            if(!(node.containingGroup && node.containingGroup.data.category == "yunGroup" && node.containingGroup.data.category == "yunpanGroup")){
                return;
            }
            var nextNode;
            var centerOrderX = 30000
            var centerOrderY = 30000
            if(node.containingGroup.__yunPointsX && node.containingGroup.__yunPointsY){
                centerOrderX = (node.containingGroup.__yunPointsX.length+1)/2
                centerOrderY = (node.containingGroup.__yunPointsY.length+1)/2

            }
            switch (direction) {
                case 'left':
                    if(node.data.orderX == centerOrderX){
                        return;
                    } 
                    var it = node.containingGroup.findSubGraphParts().iterator;
                    while (it.next()) {
                        var n = it.value;
                        if(n.data.subRole == "coreText" && n.data.dimKey == node.data.dimKey){
                            if(Number(n.data.orderX) == Number(node.data.orderX)-1){
                                nextNode = n;
                                break;
                            }
                        }
                    }
                    break;
                case 'up':
                    if(node.data.orderY == centerOrderY){
                        return;
                    } 
                    var it = node.containingGroup.findSubGraphParts().iterator;
                    while (it.next()) {
                        var n = it.value;
                        if(n.data.subRole == "coreText" && n.data.dimKey == node.data.dimKey){
                            if(Number(n.data.orderY) == Number(node.data.orderY)+1){
                                nextNode = n;
                                break;
                            }
                        }
                    }
                    break;
                case 'right':
                    if(node.data.orderX == centerOrderX){
                        return;
                    } 
                    var it = node.containingGroup.findSubGraphParts().iterator;
                    while (it.next()) {
                        var n = it.value;
                        if(n.data.subRole == "coreText" && n.data.dimKey == node.data.dimKey){
                            if(Number(n.data.orderX) == Number(node.data.orderX)+1){
                                nextNode = n;
                                break;
                            }
                        }
                    }
                    break;
                case 'down':
                    if(node.data.orderY == centerOrderY){
                        return;
                    } 
                    var it = node.containingGroup.findSubGraphParts().iterator;
                    while (it.next()) {
                        var n = it.value;
                        if(n.data.subRole == "coreText" && n.data.dimKey == node.data.dimKey){
                            if(Number(n.data.orderY) == Number(node.data.orderY)-1){
                                nextNode = n;
                                break;
                            }
                        }
                    }
                    break;
            }
            if (nextNode) {
                myDiagram.select(nextNode);
            }
        }

        if(node.data.category == "wave" || node.data.role == "shiText" || node.data.role == "xuText"){
            switch (direction) {
                case 'left':
                    var prevNode = this.findPrevOlive(node)
                    if (prevNode) {
                        myDiagram.select(prevNode);
                    }
                    break;
                case 'up':
                    var upNode = this.findUpOlive(node)
                    if (upNode) {
                        myDiagram.select(upNode);
                    }
                    break;
                case 'right':
                    var nextNode = this.findNextOlive(node)
                    if (nextNode) {
                        myDiagram.select(nextNode);
                    }
                    break;
                case 'down':
                    var downNode = this.findDownOlive(node)
                    if (downNode) {
                        myDiagram.select(downNode);
                    }
                    break;
            }
        }
    }
}

// export default Trtd;
module.exports = Trtd;