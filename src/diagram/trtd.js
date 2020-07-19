var $ = go.GraphObject.make;
var helpers = require('../helpers/helpers.gojs')
var createTextNodeTemplate = require('../nodeTemplate/createTextNodeTemplate')
var createPictureSingleNodeTemplate = require('../nodeTemplate/createPictureSingleNodeTemplate')
var nodeTemplateFactory = require('../nodeTemplate/factory')
class Trtd {
    constructor(div, config){
        console.log('trtd base')
        this.config = config;
        this.textDoubleClick = config.textDoubleClick
		this.modelChangedListener = config.modelChangedListener;
		this.showContextMenuListener = config.showContextMenuListener;
		this.hideContextMenuListener = config.hideContextMenuListener;
		this.dealFireTextCallback = config.dealFireTextCallback;
		this.exportAsSubFigureCallback = config.exportAsSubFigureCallback; // 将选中内容创建为子盘
		this.ViewportBoundsChangedListener = config.ViewportBoundsChangedListener;
		this.InitialLayoutCompleted = config.InitialLayoutCompleted;
        this.cxElement = config.cxElement; // 外部传入的菜单dom元素
        this.deleteCallback = config.deleteCallback; // 删除回调
        this.deleteConfirm = config.deleteConfirm; // 删除回调
        this.addToDimStoreCallback = config.addToDimStoreCallback
        this.canAddAxisGroup = config.canAddAxisGroup == null?true:config.canAddAxisGroup 
        this.createFigure = config.createFigure; // 外部创建figure方法，异步调用，返回盘的id，写入节点的figure属性，一般为id
        this.openFigure = config.openFigure; // 外部打开figure方法，根据节点的figure属性打开盘
        
        this.useDefaultContext = config.useDefaultContext == null?true:config.useDefaultContext;
        // if()
        this.defaultCxElement = null; // 默认菜单dom元素
        this.type = config.type;

        this.div = div;
        this.containerDivId = config.containerDivId||"mainbox"; // diagram的div父级div的id，菜单会建在这下面
		this.diagram = {};
        if(config.model != null && typeof(config.model) == "object" ){
            console.log("dsfdf")
            config.model = JSON.stringify(config.model)
        }
        this.model = config.model;
        this.tpid = config.tpid||Date.now();
        this.InitialFontSize = 18
        this.tdCurrentTheme = {
            id: 6,
            borderWidth: 2,
            borderColor: "black",
            groupColor: "rgba(0,0,0,0)",
            groupStroke: "rgba(0,0,0,0)",
            groupStrokeWidth: 0,
            themeName: "黑白",
            linkColor: "black",
            colorRange: "white"
        }
        this.nodeClickListener = config.nodeClickListener;
        this.nodeDoubleClickListener = config.nodeDoubleClickListener;
        this.isModified = false; // 是否保存
        this.lastModified = 0; // 保存的序号，每一次modified事件加1，不再变化时执行真实保存，用于提高性能
        this.modifiedIndex = 0; // 保存的序号，每一次modified事件加1，不再变化时执行真实保存，用于提高性能
		// // 初始化diagram
		// this.initDiagram(div, config);
		// this.initListener();
		// // Then you will need to construct a Model (usually a GraphLinksModel) for the Diagram, initialize its data by setting its Model.nodeDataArray and other properties, and then set the diagram's model.
        // if(this.model){
        //     this.initModel();
        // }
    }
    initDiagram(){
        console.log("基类方法，子类需要实现，用来初始化画布")
    }
    addNodeTemplate(){
        console.log("基类方法，子类需要实现，用来初始化节点模板")
    }


    /**
     *  设置缩放比例
     * @param value
     */
    resetZoom(value) {
        // console.log(value)
        this.diagram.commandHandler.resetZoom(value);
    }
    getDefaultCustomMenuDivStr(){
        console.log("基类方法，子类需要实现，设置默认自定义菜单")
        return `
        <ul>
            <li trtd_action="addLevelNodeMenu"><a class="i18n" data-lang="insertsl">插入同级节点</a></li>
            <li trtd_action="addChildNodeMenu"><a class="i18n" data-lang="icn">插入子节点</a></li>
            <li trtd_action="duplicateNode"><a class="i18n" data-lang="duplicateNode">复制节点</a></li>
            <li trtd_action="deleteNodeMenu"><a class="i18n" data-lang="remove">删除</a></li>
            <li trtd_action="orderChildNode"><a class="i18n" data-lang="ordernode">子节点编号</a></li>
            <li trtd_action="clearOrderChildNode"><a class="i18n" data-lang="clearordernode">取消子节点编号</a></li>
            <li trtd_action="clearNodeTextMenu"><a class="i18n" data-lang="emptynodetext">清空节点文本</a></li>
            <li trtd_action="insertTianpanMenu"><a class="i18n" data-lang="insertnodetianpan">插入天盘节点</a></li>
            <li trtd_action="insertTextMenu"><a class="i18n" data-lang="inserttext">插入文本</a></li>
            <li trtd_action="locateRootNodeMenu"><a class="i18n" data-lang="locaterootnode">定位根节点</a></li>
            <li trtd_action="showAllNodesMenu"><a class="i18n" data-lang="displayallnodes">显示所有节点</a></li>
            <li trtd_action="fixPictureMenu"><a class="i18n" data-lang="fixnode">固定节点</a></li>
            <li trtd_action="activePictureMenu"><a class="i18n" data-lang="cancelfix">取消固定</a></li>
        
            <li trtd_action="delYunpanAxis"><a class="i18n" data-lang="cancelfix">删除 CTRL+DEL</a></li>
            <li trtd_action="addYunpanAxis"><a class="i18n" data-lang="cancelfix">增加 CTRL+X/Y</a></li>
            <li trtd_action="addFollowerGround"><a class="i18n" data-lang="insertsl">增加同级节点</a></li>
            <li trtd_action="addNewCircle"><a class="i18n" data-lang="icn">增加子节点</a></li>
            <li trtd_action="apiDeleteSelection"><a class="i18n" data-lang="remove">删除</a></li>
        </ul>
        `
    }

    getShowContextMenus(node){
        console.log("基类方法，子类需要实现，显示默认自定义带单时控制哪些菜单需要显示")

        var showIds = '';

        if (!node || node.data.isGroup) {
            // myDiagram.clearSelection();
            showIds = "locateRootNodeMenu,showAllNodesMenu,insertTextMenu,insertTianpanMenu";
            // if(myDiagram.model.modelData.currentType == "dipan"){
            //     cxElement.getElementsByClassName('removeOutCycleMenu')[0].style.display = 'block';
            // }
        } else {
                if (!(node instanceof go.Group) && (!node.data.category || node.data.category == "" || node.data.category == "0" || node.data.category == "1" || node.data.category == "4")) { //天盘节点,非group
                    showIds = "addLevelNodeMenu,addChildNodeMenu,deleteNodeMenu,orderChildNode,clearOrderChildNode," + "clearNodeTextMenu,duplicateNode";
                    console.log("2111")
                    if(node.selectable){
                        showIds += "fixPictureMenu"
                    }else{
                        showIds += "activePictureMenu"
                    }
                }


                if( node.data.category == "8" ||  node.data.category == "text"||  node.data.category == "addtextTemplate"){
                    showIds = "deleteNodeMenu," + "duplicateNode";
                }

                if( node.data.category === "yunpanx"||node.data.category === "yunpany"){
                    console.log("222222222222")
                    showIds = "delYunpanAxis," + "addYunpanAxis";
                }

                if( node.data.category === "dipan"){
                    showIds = "addFollowerGround," + "addChildDipanNode,"+"deleteDipanNode";
                }
                


                // for (var _i2 = 0; _i2 < showIds.split(',').length; _i2++) {
                //     if (showIds.split(',')[_i2]&&showIds.split(',')[_i2]!=="fixPictureMenu"&&showIds.split(',')[_i2]!=="activePictureMenu") {
                //         helpers.getElementByAttr(cxElement,"li","trtd_action",showIds.split(',')[_i2])[0].style.display = 'block'
                //         // cxElement.getElementsByClassName(showIds.split(',')[_i2])[0].style.display = 'block';
                //     }else if(showIds.split(',')[_i2]!=="fixPictureMenu"||showIds.split(',')[_i2]!=="activePictureMenu"){
                //         if (node.selectable) {
                //             cxElement.getElementsByClassName('fixPictureMenu')[0].style.display = 'block';
                //             cxElement.getElementsByClassName('activePictureMenu')[0].style.display = 'none';
                //         } else {
                //             cxElement.getElementsByClassName('fixPictureMenu')[0].style.display = 'none';
                //             cxElement.getElementsByClassName('activePictureMenu')[0].style.display = 'block';
                //         }
                //     }
                // }
            }

        return showIds
    }
    insertPicture(source){
        this.apiInsertPicture(source)
    }
    apiInsertPicture(source){
        console.log("基类方法，子类需要实现，对外接口，插入图片")
        // console.log(source)
        var myDiagram = this.diagram
        var currentType = this.diagram.model.modelData.currentType;
        // var globalProperties = tdGetModelData(null, myDiagram.model);
        //var layerThickness = parseInt(globalProperties['layerThickness']); //默认值100
        // 获取扇形半径
       
        // var layerThickness = myDiagram.model.modelData.layerThickness;
        //获取中心圆半径
        // var rootNodeRadius = parseInt(myDiagram.model.findNodeDataForKey(1).layerThickness);
        // var tdDipanTextAngle = globalProperties['tdDipanTextAngle'];
        var node = myDiagram.selection.first();
        if (node && node.data.category == 'dipan' && !rootKey) return; //地盘节点不允许插入将诶点
        // if(node) return; // 暂时关闭节点插入图片功能
        myDiagram.model.startTransaction('setSourceOfPicture');
        try{
            var documentPoint = JSON.parse(localStorage.getItem("TRTD_documentPoint"))
            if(!documentPoint) documentPoint = myDiagram.lastInput.documentPoint
        }catch(err){
            var documentPoint = myDiagram.lastInput.documentPoint
        }
        if (node) {
            // myDiagram.model.setDataProperty(node.data,'lastCategory', node.data.category);  //保存添加图片前的类别，以便移除图片时恢复
            // if (node.data.category != "3" && node.data.category != 'text') {
            //     myDiagram.model.setCategoryForNodeData(node.data, "4");
            // }
            if (node.data.category == '3') { //文字节点暂时不能添加图片
                myDiagram.model.setDataProperty(node.data, "picture", source);
            }
        } else {
            // var e = myDiagram.lastInput;
            var nextkey = (myDiagram.model.nodeDataArray.length + 1).toString();
            var follower = { key: nextkey, text: "", category: "3" };
            myDiagram.model.makeNodeDataKeyUnique(follower);
            follower.loc = go.Point.stringify(documentPoint);

            //follower.picture = obj.children[0].src;
            follower.picture = source;
            myDiagram.model.addNodeData(follower);
        }

        myDiagram.model.commitTransaction('setSourceOfPicture');
    }
    apiGetTheme(){
        var model = this.diagram.model;
        var themeText = ""
        for(var i=0;i<model.nodeDataArray.length;i++){
            if(model.nodeDataArray[i].role == "theme" || model.nodeDataArray[i].role == "themeText"|| model.nodeDataArray[i].subRole == "themeText" ){
                if(model.nodeDataArray[i].text){
                    themeText = model.nodeDataArray[i].text
                    break;
                }
            }
        }
        if(!themeText){
            var root = model.findNodeDataForKey(1)
            if(root){
                themeText = root.text
            }
        }
        return themeText
    }
    apiGetThemeNode(){
        var model = this.diagram.model;
        var themeText = null
        var it = this.diagram.nodes;
        var tmp;
        while(it.next()){
            tmp = it.value;
            if(tmp.data.role == "theme" || tmp.data.role == "themeText"|| tmp.data.subRole == "themeText"){
                themeText = tmp
                break;
            }     
        }
        // for(var i=0;i<model.nodeDataArray.length;i++){
        //     if(model.nodeDataArray[i].role == "theme" || model.nodeDataArray[i].role == "themeText"|| model.nodeDataArray[i].subRole == "themeText"){
        //         themeText = model.nodeDataArray[i]
        //         break;
        //     }
        // }
        if(!themeText){
            var root = this.diagram.findNodeForKey(1)
            if(root){
                themeText = root
            }
        }
        return themeText
    }

    insertFigure(source, figureId) { //rootKey表示属于某个地盘节点的背景
        // console.log(source)
        var myDiagram = this.diagram
        var currentType = this.diagram.model.modelData.currentType;
        // var globalProperties = tdGetModelData(null, myDiagram.model);
        //var layerThickness = parseInt(globalProperties['layerThickness']); //默认值100
        // 获取扇形半径
       
        // var layerThickness = myDiagram.model.modelData.layerThickness;
        //获取中心圆半径
        // var rootNodeRadius = parseInt(myDiagram.model.findNodeDataForKey(1).layerThickness);
        // var tdDipanTextAngle = globalProperties['tdDipanTextAngle'];
        var node = myDiagram.selection.first();
        // if (node && node.data.category == 'dipan' && !rootKey) return; //地盘节点不允许插入将诶点
        if(node) return; // 暂时关闭节点插入图片功能
        myDiagram.model.startTransaction('setSourceOfPicture');
        try{
            var documentPoint = JSON.parse(localStorage.getItem("TRTD_documentPoint"))
        }catch(err){
            var documentPoint = myDiagram.lastInput.documentPoint
        }
        if (node) {
            // myDiagram.model.setDataProperty(node.data,'lastCategory', node.data.category);  //保存添加图片前的类别，以便移除图片时恢复
            if (node.data.category != "3" && node.data.category != 'text') {
                myDiagram.model.setCategoryForNodeData(node.data, "4");
            }
            if (node.data.category != 'text') { //文字节点暂时不能添加图片
                myDiagram.model.setDataProperty(node.data, "picture", source);
            }
        } else {
            // var e = myDiagram.lastInput;
            var nextkey = (myDiagram.model.nodeDataArray.length + 1).toString();
            var follower = { key: nextkey, text: "", category: "3" };
            myDiagram.model.makeNodeDataKeyUnique(follower);
            follower.loc = go.Point.stringify(documentPoint);
            follower.figureId = figureId;

            //follower.picture = obj.children[0].src;
            follower.picture = source;
            myDiagram.model.addNodeData(follower);
        }

        myDiagram.model.commitTransaction('setSourceOfPicture');

    }



// 复制单个节点
apiDuplicateNode() {
    var myDiagram = this.diagram;
    var node = myDiagram.selection.first();
    if (!node) return;
    myDiagram.startTransaction();
    var newData = myDiagram.model.copyNodeData(node.data);
    var location = node.location.copy();
    location.offset(50, -50);
    newData.loc = go.Point.stringify(location);
    newData.level = 0;
    newData = clearRelProperty(newData);
    myDiagram.model.addNodeData(newData);
    myDiagram.commitTransaction();
    // 清除节点的关系属性，比如父节点索引，子节点索引等
    function clearRelProperty(data) {
        data.level = 0;
        delete data.prev;
        delete data.isparent;
        delete data.next;
        delete data.group;
        delete data.parent;
        delete data.role
        delete data.group
        delete data.dimKey
        delete data.subRole
        delete data.order
        delete data.figure
        delete data.iconVisible
        delete data.deletable
        delete data.theta
        delete data.orderX
        delete data.orderY
        delete data.dimX
        delete data.dimY
        return data;
    }
}

    apiPreviewImage(background="white", scale=1){
        console.log("基类方法，子类需要实现，对外接口，预览图片，生成base64")
        var myDiagram = this.diagram;
        var imageParas = {
            scale: scale,
            // background: "rgba(0,0,0,0)",
            background: background,
            type: "image/png",
            maxSize: new go.Size(9000, 9000)
        }
        var list = new go.List(go.GraphObject);

        var node = myDiagram.selection.first()
        var isSelected = false
        if(node ){
            while(node.containingGroup){
                node = node.containingGroup
            }
            if(node.data.isGroup){
                isSelected = true
            }
            
        }

        if(isSelected){
            var it = node.findSubGraphParts().iterator;
            while(it.next()){
                var p = it.value;
                var temp = p.findObject("figure")
                if(temp){
                    temp.visible = false;
                }
                if (!(p instanceof go.Group)) {
                    list.add(p);
                    if( p instanceof go.Node){
                        if(p.data.role == "centerText"){
                            p.layerName = "Foreground"
                        }
                    }
                }
            }
        }else{
            myDiagram.nodes.each(function(p) {
                var temp = p.findObject("figure")
                if(temp){
                    temp.visible = false;
                }
                if (!(p instanceof go.Group)) {
                    list.add(p);
                    if( p instanceof go.Node){
                        if(p.data.role == "centerText"){
                            p.layerName = "Foreground"
                        }
                    }
                }
            })
        }
        
        myDiagram.links.each(function(p) {
            list.add(p);
        })
        imageParas.parts = list.iterator;

        var imgdata = myDiagram.makeImageData(imageParas);
        myDiagram.nodes.each(function(p) {
            var temp = p.findObject("figure")
            if(p.data.figure && temp){
                temp.visible = true;
            }
            // if (!(p instanceof go.Group)) {
            //     list.add(p);
            //     if( p instanceof go.Node){
            //         if(p.data.role == "centerText"){
            //             p.layerName = "Foreground"
            //         }
            //     }
            // }
        })
        return imgdata;
    }
    apiDeleteSelection(){
        console.log("基类方法，子类需要实现，对外接口，删除选中的节点")
        this.diagram.toolManager.textEditingTool.doCancel();
        this.diagram.commandHandler.deleteSelection();
    }
    apiUndo () {
        this.diagram.commandHandler.undo();
    }
    apiRedo () {
        this.diagram.commandHandler.redo();
    }
    saveModel(e){
        // if (e.isTransactionFinished) {
            // console.log('model changed and has been saved to localstorage');
             helpers.saveModelToLocalStorage(this.tpid, this.diagram.model)
            // helpers.checkModel(e.model)
        // }
    }

    addNodeTemplateBase(){
        var myDiagram = this.diagram
        this.diagram.nodeTemplateMap.add("text", createTextNodeTemplate(this.diagram));
        this.diagram.nodeTemplateMap.add("3", createPictureSingleNodeTemplate(this.diagram));

        // myDiagram.nodeTemplateMap.add("cbian",  nodeTemplateFactory("cbian",{diagram:this.diagram}).getNodeTemplate())
        myDiagram.nodeTemplateMap.add("pic",  nodeTemplateFactory("pic",{diagram:this.diagram}).getNodeTemplate())
        myDiagram.nodeTemplateMap.add("autoText", nodeTemplateFactory("autoText",{diagram:myDiagram}).getNodeTemplate());
        myDiagram.groupTemplateMap.add("picGroup", nodeTemplateFactory("picGroup",{diagram:myDiagram}).getNodeTemplate());
    }
    // 添加水罗盘，三门系统
    addWater(){
        console.log("addWater")
        var diagram = this.diagram
        var node = diagram.selection.first();
        var group = null
        if(node && node.data.category == "axisGroup"){
            group=node.data.key;
        }
        var e = diagram.lastInput
        diagram.startTransaction("addCbian")
        var groupKey = helpers.guid()
        
        var basePoint = e.documentPoint
        var groupData = {"category":"picGroup", 
         "role":"cbian", "isGroup":true, "level":0, 
        "key":groupKey, "loc":go.Point.stringify(basePoint), "deletable":true}
        if(group){
            groupData.group = group
        }
        
        var picData = { "group":groupKey, "text":"", 
        "resizable":false, "category":"pic", 
        "loc":go.Point.stringify(basePoint),
        "picture":"https://static.365trtd.com/system/water/water.png", "width":150, "height":150}
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
        var text2Data = {"text":"总结2", "deletable":true, "textStroke":"#FFC000", "iconVisible":false, 
        "locationSpot":"0 0.5 0 0", "textAlign":"left", "category":"autoText", 
        "loc":go.Point.stringify(basePoint.copy().offset(145*Math.cos(45*Math.PI/180), -150*Math.sin(45*Math.PI/180))), 
        "movable":true, "group":groupKey}
        var text3Data = {"text":"总结3", "deletable":true, "textStroke":"#cb1c27", "iconVisible":false, 
        "locationSpot":"0 1 0 0", "textAlign":"left", "category":"autoText", 
        "loc":go.Point.stringify(basePoint.copy().offset(145*Math.cos(70*Math.PI/180), -140*Math.sin(70*Math.PI/180))), 
        "movable":true, "group":groupKey}

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

        diagram.commitTransaction("addWater")
    
    }

    initDiagramBase(div, config){
        console.log("基类初始化画布，子类修改diagram")
        var myDiagram = this.diagram;
        var that = this;
        
    // function onTextChanged(){}
        // function saveModel() {}
        var myDiagram = this.diagram;

        function onTextChanged(e) {
            e.diagram.isModified = true;
            console.log("onTextChanged")
        }
        
        // //var $ = go.GraphObject.make; 
        // function saveModel(e) {
        //     // console.log(e)
        //     if (e.isTransactionFinished) {
        //         console.log('model changed and has been saved to localstorage');
        //         helpers.saveModelToLocalStorage(that.tpid, that.diagram.model)
        //         helpers.checkModel(e.model)
        //     }
        // }
        var defaultConfig = {
            initialContentAlignment: go.Spot.Center,
            initialAutoScale: go.Diagram.Uniform,
            initialDocumentSpot: go.Spot.Center,
            initialViewportSpot: go.Spot.Center,
            "toolManager.hoverDelay": 100,
            padding: -20,
            click: function(e) {
                // closeToolbarWindow();
                // removeNodeToolBar();
                console.log("eeee:",e)
                localStorage.setItem("TRTD_documentPoint",go.Point.stringify(e.documentPoint))
            },
            "dragSelectingTool.isEnabled": false,
            "draggingTool.isCopyEnabled": false,
            // "rotatingTool.snapAngleEpsilon": 10,
            "commandHandler.archetypeGroupData": { text: "Group", isGroup: true, color: "blue" },
        
            // enable undo & redo
            allowDrop: true,
            "undoManager.isEnabled": true,
            "undoManager.maxHistoryLength": 20,
            "toolManager.mouseWheelBehavior": go.ToolManager.WheelZoom,
            maxScale: 5.0,
            minScale: 0.2,
            hasVerticalScrollbar: false,
            hasHorizontalScrollbar: false,
            scrollMode: go.Diagram.InfiniteScroll,
            scrollMargin: 50,
            "animationManager.isEnabled": false,
        
            //rotatingTool: go.GraphObject.make(TopRotatingTool),  // defined below
            
            maxSelectionCount: 1,
            InitialLayoutCompleted:(e)=>{
                console.info("hhhhhhhhhhhhhhhhhhhh InitialLayoutCompleted")
                e.diagram.animationManager.isEnabled = true
                if(that.InitialLayoutCompleted){
                    that.InitialLayoutCompleted(e)
                }
            },
            // make sure users can only create trees

            validCycle: go.Diagram.CycleDestinationTree,
        
            "ModelChanged": function(e){
                if (!e.isTransactionFinished) {
                    return;
                }
                // return;
                that.isModified = true;
                that.lastModified = Date.now();
                that.modifiedIndex += 1;
                setTimeout(()=>{
                    // 如果已经保存则不处理
                    if(!that.isModified) {
                        console.log("已经保存，跳过",diff,",",that.modifiedIndex)
                        return;
                    };
                    // var now = Date.now()
                    var diff = Date.now() - that.lastModified
                    if(diff >=1000){
                        console.log("大于1000毫秒需要保存",diff,",",that.modifiedIndex)
                        that.modifiedIndex = 0
                        that.isModified = false
                        that.saveModel(e)
                        if(that.modelChangedListener){
                            that.modelChangedListener(e.model)
                        }
                    }
                },1100)

            },
        
            "TextEdited": onTextChanged, //在下面定义
            contextMenu: $(go.Adornment),
            ViewportBoundsChanged:(e)=>{
                // console.log("ViewportBoundsChangedListener", e)
                if(that.ViewportBoundsChangedListener){
                    that.ViewportBoundsChangedListener(e)
                }
            }
        }
        
        var diagramConfig = Object.assign(defaultConfig, config.diagramConfig);
        delete diagramConfig.type;
        delete diagramConfig.tpid;
        delete diagramConfig.model;
        delete diagramConfig.modelChangedListener; // 这里需要优化，传入的参数不一定能够在diagram里配置
        delete diagramConfig.mouseOverListener;
		delete diagramConfig.clickListener;
        this.diagram = $(go.Diagram, div, diagramConfig);
        this.diagram.__trtd = this;
        var myDiagram = this.diagram;

        var forelayer = myDiagram.findLayer("Foreground");
        myDiagram.addLayerBefore(go.GraphObject.make(go.Layer, { name: "default" }), forelayer);
        myDiagram.addLayerBefore(go.GraphObject.make(go.Layer, { name: "overflow" }), forelayer);
        for (var i = 10; i >= 0; i--) {
            myDiagram.addLayerBefore(go.GraphObject.make(go.Layer, { name: i.toString() }), forelayer);
        }
        //myDiagram.toolManager.draggingTool.computeEffectiveCollection = computeEffectiveCollection;
        myDiagram.toolManager.draggingTool.computeEffectiveCollection = computeEffectiveCollection;
        // myDiagram.toolManager.dragSelectingTool.isPartialInclusion = true;
        
        myDiagram.toolManager.rotatingTool.handleArchetype =
                $(go.Panel, "Auto",
                    $(go.Shape, "BpmnActivityLoop", { width: 30, height: 30, stroke: "green", fill: "transparent" }),
                    $(go.Shape, "Rectangle", {
                        width: 30,
                        height: 30,
                        stroke: "green",
                        fill: "transparent",
                        strokeWidth: 0
                    })
                );

        myDiagram.toolManager.linkReshapingTool.handleArchetype =
            $(go.Shape, "Circle", {
                width: 30,
                height: 30,
                fill: "lightblue",
                stroke: "dodgerblue"
            });        

        // only allow new links between ports of the same group
        myDiagram.toolManager.linkingTool.linkValidation = sameGroup;
        // only allow reconnecting an existing link to a port of the same color
        myDiagram.toolManager.relinkingTool.linkValidation = sameGroup;
        myDiagram.commandHandler.doKeyDown = (e)=>{
            this.dokeyDownFn(e)
        }
        myDiagram.commandHandler.deleteSelection = function(){
            console.log("deleteSelectiondeleteSelection")
            var node = that.diagram.selection.first();
            if (!node) {
                return;
            }
            // 不允许删除主题
            if(node.data.role == "theme" || node.data.role == "themeText"|| node.data.subRole == "themeText"){
                return;
            }
            var nodeCopy = JSON.parse(JSON.stringify(node.data))
            console.log("deleteConfirm", that.deleteConfirm)
            if(that.deleteConfirm){
                that.deleteConfirm(nodeCopy, (flag)=>{
                    if(flag){
                        that.deleteSelection();
                        if(that.deleteCallback){
                            that.deleteCallback(nodeCopy)
                        }
                    }
                })
            }else{
                that.deleteSelection();
                if(that.deleteCallback){
                    that.deleteCallback(nodeCopy)
                }
            }
            
        }
        myDiagram.commandHandler.redo = function() {
            var cmd = myDiagram.commandHandler;
            //myDiagram.currentTool.doCancel();
            //go.CommandHandler.prototype.redo.call(cmd);
            myDiagram.clearSelection();
            go.CommandHandler.prototype.redo.call(cmd);
        };
        myDiagram.commandHandler.undo = function() {
            var cmd = myDiagram.commandHandler;

            myDiagram.clearSelection();
            if (myDiagram.toolManager) {
                myDiagram.toolManager.textEditingTool.doCancel();
            }
            go.CommandHandler.prototype.undo.call(cmd);
        };

        myDiagram.toolManager.clickCreatingTool.archetypeNodeData = {
            category: "autoText",
            text: "双击编辑文本",
            level: 0,
            radius: 120,
        };

        this.addNodeTemplateBase()
        this.addDiagramContextMenu();
        // if(this.model){
        //     this.initModel();
        // }
    }
    removeNodeRemarkTips() {
        var doms = document.getElementById('tooltip');
        if (doms) {
            doms.parentNode.removeChild(doms);
        }
    }

    showNodeRemarkTips(e, node) {
        var info = document.getElementById('tooltip');
        if (!info || info.length == 0) {
            let str = document.createElement('div');
            str.setAttribute('id', 'tooltip');
            str.setAttribute('style', 'word-wrap: break-word;word-break: break-all');
            document.body.appendChild(str);
            info = document.getElementById('tooltip');
        }
        var box = document.getElementById("tooltip");
    
        if (!node.data.istemp && (node.data.text && node.data.text.trim() == "") && (node.data.remark && node.data.remark.trim() == "" || typeof(node.data.remark) == 'undefined')) return;
    
        if (node.data.istemp) {
            var toolTipText = lang.trans('tempnodetips');
        } else if(node.category === "y"||(node.category === "LogicXor"&&node.data.loc.split(' ')[1] === "5")){
            var toolTipText ="最右新增";
        }else if(node.category === "x"||(node.category === "LogicXor"&&node.data.loc.split(' ')[0] === "-20")){
            var toolTipText ="最上新增";
        }else {
            var toolTipText = node.data.text + "<br><hr>";
            toolTipText += node.data.remark ? node.data.remark : "";
        }
    
        box.innerHTML = toolTipText;
        // box.style.left = e.viewPoint.x + "px";
        // box.style.top = e.viewPoint.y + "px";
        if(node.category === "y"||node.category === "x"||node.category === "LogicXor"){
            box.style.left = (e.event.clientX + 10) + "px";
            box.style.top = (e.event.clientY - 10) + "px";
        }else{
            box.style.left = (e.event.clientX + 50) + "px";
            box.style.top = (e.event.clientY - 50) + "px";
        }
        box.style.position = "fixed";
        box.style.zIndex = 5555;
        box.style.backgroundColor = "#FFFFE1";
        // $("#tooltip")[0].innerHtml = "<p>aaaaaaaaa<br>bbbbbbbbbbbbb</p>";
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
    // 创建默认菜单 this.defaultCxElement
    customMenu () {
        console.log("第一步创建默认的自定义菜单")
        if(this.defaultCxElement){
            console.log("使用默认菜单，已经存在")
            return this.defaultCxElement;
        }
        console.log(this.useDefaultContext)
        // 不使用默认菜单
        if(!this.useDefaultContext){
            
            return null;
        }
        // 添加菜单选项
        var str = this.getDefaultCustomMenuDivStr()
        
        let div = document.createElement('div');
        // div.setAttribute('id', 'contextMenu');
        div.setAttribute('class', 'context-menu');
        div.innerHTML = str;
        // document.getElementsByClassName('mainbox')[0].appendChild(div);
        var mainbox = document.getElementById(this.containerDivId)
        mainbox.appendChild(div);
        let contextMeluDom = mainbox.getElementsByClassName('context-menu')[0]
        this.defaultCxElement = contextMeluDom
        this.bindMenuEventListener(contextMeluDom)
        return contextMeluDom
    }

    bindMenuEventListener(cxElement){
        let menuList = cxElement.getElementsByTagName('li');
        console.log("创建的自定义菜单需要绑定一些事件")
        for(let i = 0; i < menuList.length; i++){
            menuList[i].addEventListener('click', () => {
                let val = menuList[i].getAttribute('trtd_action');
                // cxcommand(this, val);
                console.log("menuList[i].addEventListener('click'")
                this.diagram.__trtd[val]();
                this.diagram.currentTool.stopTool();
                return false
                // setTimeout(()=>{
                //     this.diagram.toolManager.contextMenuTool.hideContextMenu()
                // },100)
            })
        }
    }

    addDiagramContextMenu(){
      
        // console.log("基类 addDiagramContextMenu")
        console.log("第二步 将自定义菜单与diagram绑定")
        // console.log(objNode)
       

        var that = this;
        var myDiagram = this.diagram;
        var cxTool = myDiagram.toolManager.contextMenuTool;
        // This is the actual HTML context menu:

        // var mainbox = document.getElementById('mainbox')
        // mainbox.appendChild(div);
        
        // let menuList = mainbox.getElementsByClassName('context-menu')[0].getElementsByTagName('li');
        // var cxElement = mainbox.getElementsByClassName('context-menu')[0]
        console.log(this.cxElement)
        
        if(!this.cxElement){ // 外部没有传入菜单元素，则使用默认的菜单
            if(!this.defaultCxElement){
                this.defaultCxElement = this.customMenu()
            }
            var cxElement = this.defaultCxElement
        }else{
            var cxElement = this.cxElement
        }
        if(!cxElement){
            return;
        }
        // We don't want the div acting as a context menu to have a (browser) context menu!
        cxElement.addEventListener("contextmenu", function(e) {
            // this.onfocus();
            e.preventDefault();
            return false;
        }, false);
        // cxElement.addEventListener("blur", function(e) {
        //     cxTool.stopTool();
        //     // maybe start another context menu
        //     if (cxTool.canStart()) {
        //         myDiagram.currentTool = cxTool;
        //         cxTool.doMouseUp();
        //     }
        // }, false);
        cxElement.tabIndex = "1";
        // This is the override of ContextMenuTool.showContextMenu:
        // This does not not need to call the base method.
        cxTool.showContextMenu = function(contextmenu, obj) {
            console.log('thisthisthis:', this.diagram);
            console.log('thisthisthis:', this.diagram.model);
    
            console.log('this:', this.diagram.selection);
            var diagram = this.diagram;
            // console.log('diagram:', diagram);
            if (diagram === null) return;
            // Hide any other existing context menu
            if (contextmenu !== this.currentContextMenu) {
                this.hideContextMenu();
            }

            var node = myDiagram.findPartAt(myDiagram.lastInput.documentPoint, false);
            this.currentContextMenu = contextmenu;
            var mousePt = diagram.lastInput.viewPoint;
            console.log(diagram.lastInput)
            cxElement.style.left = mousePt.x + "px";
            cxElement.style.top = mousePt.y + "px";
            // console.log(diagram.lastInput.Dr.clientX)
            // console.log(mousePt.x)
            
            // cxElement.style.left = diagram.lastInput.Dr.clientX + "px";
            // cxElement.style.top = diagram.lastInput.Dr.clientY + "px";

            if(that.showContextMenuListener){
                return that.showContextMenuListener(this.diagram, node)
            }

            // ===========================================================
            // Show only the relevant buttons given the current state.
            var showMenus = that.getShowContextMenus(node)
            let liL = cxElement.getElementsByTagName('li')
            if(showMenus){
                console.log(showMenus.split(',').length)
                for(let i = 0; i < liL.length; i++){
                    liL[i].style.display = 'none';
                }
                for(let i = 0; i < showMenus.split(',').length; i++){
                    try{
                        if(helpers.getElementByAttr(cxElement,"li","trtd_action",showMenus.split(',')[i])[0]){
                            helpers.getElementByAttr(cxElement,"li","trtd_action",showMenus.split(',')[i])[0].style.display = 'block'
                        }
                        
                    }catch(e){
                        console.error(e)
                        continue
                    }
                    // cxElement.getElementsByClassName(showIds.split(',')[i])[0].style.display = 'block';
                }
            }else{
                if(showMenus == ""){
                    for(let i = 0; i < liL.length; i++){
                        liL[i].style.display = 'block';
                    }
                }else{
                    for(let i = 0; i < liL.length; i++){
                        liL[i].style.display = 'none';
                    }
                }
            }

            // Now show the whole context menu element
            cxElement.style.display = "block";
            // we don't bother overriding positionContextMenu, we just do it here:

            // cxElement.style.left = x+10 + "px";
            // cxElement.style.top = y-40 + "px";
            // Remember that there is now a context menu showing
            
        }
            // This is the corresponding override of ContextMenuTool.hideContextMenu:
            // This does not not need to call the base method.
        cxTool.hideContextMenu = function() {
            if (this.currentContextMenu === null) return;
            this.currentContextMenu = null;
            cxElement.style.display = "none";
            if(that.hideContextMenuListener){
                return that.hideContextMenuListener(myDiagram)
            }
        }
    }

    getNodeContextMenu() {
        return $(go.Adornment)

        let style = {
            // width: 120,
            // height: 30,
            // margin: 2,
            // font: "bold 14px sans-serif",
            // margin: 3,
        }
    
        return $(go.Adornment, "Vertical",
            $("ContextMenuButton",
                $(go.TextBlock, "应用样式到所有同级节点"), {
                    click: function(e, obj) {
                        menus.applyStyle2Level(e, obj);
                    }
                }),
            $("ContextMenuButton",
                $(go.TextBlock, "应用样式到同级节点"), {
                    click: function(e, obj) {
                        menus.applyStyle2CurLevel(e, obj);
                    }
                }),
            $("ContextMenuButton",
                $(go.TextBlock, "应用样式到子节点"), {
                    click: function(e, obj) {
                        menus.applyStyle2ChiLevel(e, obj);
                    }
                }),
            $("ContextMenuButton",
                $(go.TextBlock, "添加"), {
                    click: function(e, obj) {
                        menus.addFollower(e);
                    }
                }),
            $("ContextMenuButton",
                $(go.TextBlock, "添加子节点"), {
                    click: function(e) {
                        menus.startNewSpiral(e);
                    }
                }),
            $("ContextMenuButton",
                $(go.TextBlock, "定位当前节点"), style, {
                    click: function(e){

                    }
                }),
    
            $("ContextMenuButton",
                $(go.TextBlock, "删除"), style, {
                    click: function(e, obj) {
                        console.log('eeeeeeeeee:', e);
                        e.diagram.commandHandler.deleteSelection();
                    }
                }),
            // $("ContextMenuButton",
            //     $(go.TextBlock, "添加图片"), style, {
            //         click: function(e, obj) {
            //             insertPicture();
            //         }
            //     }),
            // $("ContextMenuButton",
            //     $(go.TextBlock, "移除图片"), style, {
            //         click: function(e, obj) {
            //             removeNodePicture();
            //         }
            //     }),
            $("ContextMenuButton",
                $(go.TextBlock, "清空文本"), style, {
                    click: function(e, obj) {
                        var myDiagram = e.diagram;
                        var node = myDiagram.selection.first();
                        if (node) {
                            myDiagram.startTransaction();
                            //node.data.text="";
                            myDiagram.model.setDataProperty(node.data, "text", "");
                            myDiagram.commitTransaction();
                        }
                        //removeNodePicture();
                    }
                }),
            $("ContextMenuButton",
                $(go.TextBlock, "删除 DEL"), style, {
                    click: function(e, obj) {
                        var myDiagram = e.diagram;
                        var node = myDiagram.selection.first();
                        if (node) {
                            yunpan.yunpandel(e)
                        }
                        //removeNodePicture();
                    }
                }),
            $("ContextMenuButton",
                $(go.TextBlock, "增加 CTRL+X/Y"), style, {
                    click: function(e, obj) {
                        var myDiagram = e.diagram;
                        var node = myDiagram.selection.first();
                        if (node) {
                            if(node.data.loc.split(" ")[1] === "0"&&node.data.category!=="x"){
                                yunpan.addy(e)
                            }else if(node.data.loc.split(" ")[0] === "0"&&node.data.category!=="y"){
                                yunpan.addx(e)
                            }; 
                        }
                        //removeNodePicture();
                    }
                }),
            $("ContextMenuButton",
                $(go.TextBlock, "删除 DEL"), style, {
                    click: function(e, obj) {
                        var myDiagram = e.diagram;
                        var node = myDiagram.selection.first();
                        if (node) {
                            yunpan.yunpandel(e)
                        }
                        //removeNodePicture();
                    }
                }),
            $("ContextMenuButton",
                $(go.TextBlock, "增加同级节点"), style, {
                    click: function(e, obj) {
                        var myDiagram = e.diagram;
                        var node = myDiagram.selection.first();
                        if(myDiagram.selection.first().data.istemp){
                            return
                        }
                        dipan.addFollowerGround(e);
                    }
                }),
            $("ContextMenuButton",
                $(go.TextBlock, "增加子节点"), style, {
                    click: function(e, obj) {
                        var myDiagram = e.diagram;
                        var node = myDiagram.selection.first();
                        if(node.data.parent){
                            var parentNode = node.diagram.findNodeForKey(node.data.parent);
                            if(parentNode.data.istemp){
                                return
                            }
                        }
                        dipan.addNewCircle(e);
                    }
                }),
            $("ContextMenuButton",
                $(go.TextBlock, "删除"), style, {
                    click: function(e, obj) {
                        var myDiagram = e.diagram;
                        var node = myDiagram.selection.first();
                        if(node.data.parent){
                            var parentNode = node.diagram.findNodeForKey(node.data.parent);
                            if(parentNode.data.istemp){
                                return
                            }
                        }
                        dipan.addNewCircle(e);
                    }
                }),
                $("ContextMenuButton",
                $(go.TextBlock, "复制副本"), style, {
                    click: function(e, obj) {
                        var myDiagram = e.diagram;
                        var node = myDiagram.selection.first();
                        if(myDiagram.selection.first().data.istemp){
                            return
                        }
                        dipan.addFollowerGround(e);
                    }
                }),
            $("ContextMenuButton",
                $(go.TextBlock, "权限设置"), style, {
                    click: function(e, obj) {
                        var myDiagram = e.diagram;
                        var node = myDiagram.selection.first();
                        if(node.data.parent){
                            var parentNode = node.diagram.findNodeForKey(node.data.parent);
                            if(parentNode.data.istemp){
                                return
                            }
                        }
                        dipan.addNewCircle(e);
                    }
                }),
            $("ContextMenuButton",
                $(go.TextBlock, "删除"), style, {
                    click: function(e, obj) {
                        var myDiagram = e.diagram;
                        var node = myDiagram.selection.first();
                        if(node.data.parent){
                            var parentNode = node.diagram.findNodeForKey(node.data.parent);
                            if(parentNode.data.istemp){
                                return
                            }
                        }
                        dipan.addNewCircle(e);
                    }
                })
    
        );
    }

    dokeyDownFn() {   
            //快捷键
            // function dokeyDownFn (myDiagram) {
            var myDiagram = this.diagram;
            var diagram = this.diagram;
            var e = this.diagram.lastInput;
            var cmd = myDiagram.commandHandler;
            var node = myDiagram.selection.first();

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
                // e.bubbles = true;
                e.bubbles = false;
                diagram.__trtd.selectText(e);
                return true;
            }

            if (e.event.keyCode === 13) { // could also check for e.control or e.shift
                if (node && node.data.category == 'Root' ) {
                    diagram.__trtd.addFollowerGround();
                } else if(node && node.data.category == 'dipan'){
                    diagram.__trtd.addFollowerGround();
                }

            } else if (e.event.keyCode === 9) { // could also check for e.control or e.shift
                if (node && node.data.category == 'Root') {

                    diagram.__trtd.addNewCircle();
                } else if(node && node.data.category == 'dipan'){
                    diagram.__trtd.addNewCircle();
                }
            } else if (e.key === "t") { // could also check for e.control or e.shift
                if (cmd.canCollapseSubGraph()) {
                    cmd.collapseSubGraph();
                } else if (cmd.canExpandSubGraph()) {
                    cmd.expandSubGraph();
                }
            } else if (e.key == "Del") {
                if (myDiagram.selection.count == 0) {
                    return;
                }
                diagram.__trtd.deleteSelection();
            } else if (e.event.keyCode == 113) { //F2,覆盖地盘默认行为
                diagram.__trtd.selectText();
            } else if (e.event.keyCode == 37) { //左
                diagram.__trtd.moveWithinNodes('left');
            } else if (e.event.keyCode == 38) { //上
                diagram.__trtd.moveWithinNodes('up');
            } else if (e.event.keyCode == 39) { //右
                diagram.__trtd.moveWithinNodes('right');
            } else if (e.event.keyCode == 40) { //下
                diagram.__trtd.moveWithinNodes('down');
            } else {
                // call base method with no arguments
                go.CommandHandler.prototype.doKeyDown.call(cmd);
            }
            e.bubbles = false; //阻止事件冒泡到dom
        // };

        // return this.dokeyDownFn(this);
    }
}

function computeEffectiveCollection(parts) {
    console.log("computeEffectiveCollection")
    var coll = new go.Set();
    var node = parts.first();
    if (node) {
        if(node.containingGroup && node.containingGroup.data.category == "labelGroup"){
            var it = node.containingGroup.findSubGraphParts().iterator;
            coll.add(node.containingGroup)
            while(it.next()){
                var n = it.value;
                coll.add(n)
            }
        }else{
            helpers.travelParts(node, function(p) {
                coll.add(p);
            })
        }
    } else {
        coll.addAll(parts);
    }
    var tool = this;

    return go.DraggingTool.prototype.computeEffectiveCollection.call(this, coll);
};

function sameGroup(fromnode, fromport, tonode, toport) {
    //a node has 2 outer links at most
    if (fromnode.findLinksOutOf().count >= 2) return;
    //root node has 1 outer links at most
    if (fromnode.findLinksOutOf().count >= 1 && fromnode.data.key == 1) return;
    return fromnode.data.group === tonode.data.group;
    // this could look at the fromport.fill and toport.fill instead,
    // assuming that the ports are Shapes, which they are because portID was set on them,
    // and that there is a data Binding on the Shape.fill
}

function cxcommand (obj, val) {
    var diagram = obj.diagram;
    var myDiagram = obj.diagram;
    if (!(diagram.currentTool instanceof go.ContextMenuTool)) return;
    switch (val) {
        // case "Paste": diagram.commandHandler.pasteSelection(diagram.lastInput.documentPoint); break;
        case "addChildNodeMenu":
            tdAddChildNode(obj);
            break;
        case "addLevelNodeMenu":
            tdAddLevelNode(obj);
            break;
        case "changeDipanBgMenu":
            changeDipanBackgroundImg();
            break;
        case "removeDipanBgMenu":
            removeDipanBackgroundImg(obj);
            break;
        case "deleteNodeMenu":
            myDiagram.toolManager.textEditingTool.doCancel();
            myDiagram.commandHandler.deleteSelection();
            break;
        case "addNodePictureMenu":
            // jQuery("#insertimage").modal('show');
            // document.getElementById('insertimage').modal('show');
            break; //特殊处理
        case "removeNodePictureMenu":
            removeNodePicture(obj);
            break;
        case "clearNodeTextMenu":
            var node = myDiagram.selection.first();
            if (node) {
                myDiagram.startTransaction();
                myDiagram.model.setDataProperty(node.data, "text", "");
                myDiagram.commitTransaction();
            };
            break;
        case "locateRootNodeMenu":
            centerNode(obj);
            break;
        case "showAllNodesMenu":
            zoomToFit(obj);
            break;
        case "removeOutCycleMenu":
            removeOutCycle(obj);
            break;
        case "centerPictureMenu":
            centerPicture(obj);
            break;
        case "equalWidthHeightPictureMenu":
            equalWidthHeightPicture(obj);
            break;
        case "bringToTopMenu":
            bringToLayer("Foreground", obj);
            break;
        case "bringToBackgroundMenu":
            bringToLayer("Background", obj);
            break;
        case "bringUpMenu":
            bringToLayer(null, obj);
            break;
        case "layoutGroupMenu":
            autoLayoutAll(true, obj);
            break;

        case "insertTextMenu":
            insertTextNode(obj);
            break;
        case "duplicateNode":
            duplicateNode(obj);
            break; // 复制节点
        case "insertTianpanMenu":
            myDiagram.toolManager.clickCreatingTool.insertPart(myDiagram.lastInput.documentPoint);
            break;
        //固定节点
        case "fixPictureMenu":   
        case "activePictureMenu":
            //var node = myDiagram.findPartAt(myDiagram.lastInput.documentPoint, false);
            var node = myDiagram.selection.first();
            myDiagram.startTransaction();
            myDiagram.model.setDataProperty(node.data, "selectable", node.data.selectable != undefined ? (!node.data.selectable) : false);
            myDiagram.commitTransaction();
            break;
        case "orderChildNode":
            orderChildNode(obj);
            break;
        case "clearOrderChildNode":
            clearOrderChildNode(obj);
            break;
        case "delYunpanAxis":
            // yunpan.yunpandel(obj);
            break;
        case "addYunpanAxis":
            // var node = myDiagram.selection.first();
            // if(node.data.loc.split(" ")[1] === "0"&&node.data.category!=="x"){
            //     yunpan.addy(obj)
            // }else if(node.data.loc.split(" ")[0] === "0"&&node.data.category!=="y"){
            //     yunpan.addx(obj)
            // }; 
            break;
        case "addLevelDipanNode":
            if(myDiagram.selection.first().data.istemp){
                return
            }
            obj.addFollowerGround();
            break;
        case "addChildDipanNode":
            var node = myDiagram.selection.first();
                if(node.data.parent){
                    var parentNode = node.diagram.findNodeForKey(node.data.parent);
                    if(parentNode.data.istemp){
                        return
                    }
                }
            obj.addNewCircle(obj);
            break;
        case "deleteDipanNode":
        // myDiagram.commandHandler.deleteSelection();
        obj.deleteSelection();
        break;
    }
    diagram.currentTool.stopTool();
}




// module.exports.Trtd = Trtd;
module.exports.Trtd = Trtd;