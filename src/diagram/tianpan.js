// require('./core/core.controller')(Trtd);
// import * as go from 'gojs';
var SpiralLayout = require('../layout/SpiralLayout');
var helpers = require('../helpers/helpers.gojs')
// var commonFun = require('./commonFun')
var TRTD_BASE = require('./trtd').Trtd
let lang = require('../assets/localization');
var createNodeTemplate = require('../nodeTemplate/createNodeTemplate')
var createPictureSingleNodeTemplate = require('../nodeTemplate/createPictureSingleNodeTemplate')
var createPictureNodeTemplate = require('../nodeTemplate/createPictureNodeTemplate')
var createTextNodeTemplate = require('../nodeTemplate/createTextNodeTemplate')
var createNodeSvgTemplate = require('../nodeTemplate/createNodeSvgTemplate')

var createTianpanLink = require('../linkTemplate/createTianpanLink')

var $ = go.GraphObject.make;

var colorMap = [
    "#FFBFBF",
    "#E9BFFF",
    "#D1FF72",
    "#00A2E8",
    "#99D9EA"
];


class Trtd  extends TRTD_BASE {
	constructor(div, config){
        super(div, config)
		this.config = config;
		this.modelChangedListener = config.modelChangedListener;
		this.type = config.type;
		this.diagram = {};
        this.model = config.model;
        this.initDiagramBase(div, config); // 基类初始化diagram
		// 初始化diagram
        this.initDiagram(div, config);
        // this.diagram.__trtd = this;
		this.initListener();
		// Then you will need to construct a Model (usually a GraphLinksModel) for the Diagram, initialize its data by setting its Model.nodeDataArray and other properties, and then set the diagram's model.
        if(this.model){
            this.initModel();
        }
	}
/**
 * method 初始化diagram
 * @param {*} div 
 * @param {*} config 
 */
	initDiagram(div, config){
        var defaultConfig = {
            // layout: go.GraphObject.make(SpiralLayout, {
            //     isRealtime: false,
            //     radius: NaN,
            //     clockwise: true,
            //     //,spacing:100,
            //     isInitial: true
            // }) 
          }
        var diagramConfig = Object.assign(defaultConfig, config.diagramConfig);
        this.diagram.setProperties(diagramConfig);
        this.addNodeTemplate();
        // this.customMenu();
 
        this.addLinkTemplate();
        this.addGroupTemplate();
    }
    getTdData(){
        return this.diagram.model.toJson()
    }
    // 以下两个方法控制菜单显示
    getDefaultCustomMenuDivStr(){
        return `
        <ul>
            <li trtd_action="addFollower"><a class="i18n" data-lang="insertsl">插入同级节点</a></li>
            <li trtd_action="startNewSpiral"><a class="i18n" data-lang="icn">插入子节点</a></li>
            <li trtd_action="apiDuplicateNode"><a class="i18n" data-lang="duplicateNode">复制节点</a></li>
            <li trtd_action="apiDeleteSelection"><a class="i18n" data-lang="remove">删除</a></li>
            <li trtd_action="orderChildNode"><a class="i18n" data-lang="ordernode">子节点编号</a></li>
            <li trtd_action="clearOrderChildNode"><a class="i18n" data-lang="clearordernode">取消子节点编号</a></li>
            <li trtd_action="clearNodeTextMenu"><a class="i18n" data-lang="emptynodetext">清空节点文本</a></li>
            <li trtd_action="apiInsertTianpanNode"><a class="i18n" data-lang="insertnodetianpan">插入天盘节点</a></li>
            <li trtd_action="addTextNode"><a class="i18n" data-lang="inserttext">插入文本</a></li>
            <li trtd_action="locateRootNodeMenu"><a class="i18n" data-lang="locaterootnode">定位根节点</a></li>
            <li trtd_action="showAllNodesMenu"><a class="i18n" data-lang="displayallnodes">显示所有节点</a></li>
            <li trtd_action="fixPictureMenu"><a class="i18n" data-lang="fixnode">固定节点</a></li>
            <li trtd_action="activePictureMenu"><a class="i18n" data-lang="cancelfix">取消固定</a></li>

            <li trtd_action="delYunpanAxis"><a class="i18n" data-lang="cancelfix">删除 CTRL+DEL</a></li>
            <li trtd_action="addYunpanAxis"><a class="i18n" data-lang="cancelfix">增加 CTRL+X/Y</a></li>
        </ul>
        `
    }
    
    getShowContextMenus(node){
        var showIds = ""
        if(node){
            if(node.data.category == "autoText"){
                return "apiDeleteSelection"
            }
            if(node.data.category == "picGroup"){
                return "apiDeleteSelection"
            }
            if( node.data.category == "8"){
                showIds = "apiDeleteSelection,";
            }
            if( node.data.category == "text"){
                showIds = "apiDeleteSelection," + "apiDuplicateNode";
            }
            if( node.data.category == "3"){
                showIds = "apiDeleteSelection,";
                if(node.selectable){
                    showIds += ",fixPictureMenu"
                }else{
                    showIds += ",activePictureMenu"
                }
            }
            if( node.data.category == "0" || node.data.category == "1" || node.data.category == "2" || node.data.category == ""){
                showIds = "apiDeleteSelection,apiDuplicateNode,addFollower,startNewSpiral,orderChildNode,clearOrderChildNode";
            }
            if(node.data.category == "yunpanx"||node.data.category == "yunpany"){
                showIds = "delYunpanAxis,addYunpanAxis";
            }
            // return "addFollowerGround," + "addNewCircle,"+"apiDeleteSelection";
        }else{
            // return "addFollowerGround"
            showIds = "addTextNode,apiInsertTianpanNode"
        }
        return showIds;
    }

    apiInsertTianpanNode(){
        var myDiagram = this.diagram;
        myDiagram.startTransaction();
        var nodeData = {
            "key":helpers.guid(), "text":"双击编辑内容", "level":0,
         "radius":100,  "fill":"white", "category":"0", 
         "strokeWidth":2, "stroke":"black", "font":"bold 18px 幼圆", "textStroke":"black", "newAdd":true, "angle":5}
        // var text = { text: message||lang.trans('blankText'), category: 'text' };
        nodeData.loc = go.Point.stringify(myDiagram.lastInput.documentPoint);
        myDiagram.model.addNodeData(nodeData);
        myDiagram.commitTransaction()
        // this.diagram.toolManager.clickCreatingTool.insertPart(this.diagram.lastInput.documentPoint);
    }
    fixPictureMenu(){
        var myDiagram = this.diagram
        // var node = myDiagram.selection.first();
        var node = myDiagram.findPartAt(myDiagram.lastInput.documentPoint, false);
        myDiagram.startTransaction();
        myDiagram.model.setDataProperty(node.data, "selectable", node.data.selectable != undefined ? (!node.data.selectable) : false);
        myDiagram.commitTransaction();
    }

    activePictureMenu(){
        this.fixPictureMenu()
    }
    addTextNode(message){
        console.log('eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee:');
        var myDiagram = this.diagram;
        myDiagram.startTransaction();
        var text = { text: message||lang.trans('blankText'), category: 'autoText' };
        text.loc = go.Point.stringify(myDiagram.lastInput.documentPoint);
        myDiagram.model.addNodeData(text);
        myDiagram.commitTransaction()
    }
    guid() {
        function S4() {
            return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
        }
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
    }
    

    /**
     * method 初始化model
     */
	initModel(model){
        if(model){
            this.model = model;
        }
        console.log('initModel')
        var tmpModel = go.Model.fromJson(this.model);
        if(tmpModel.modelData.currentType == 'dipan'){
            tmpModel.nodeDataArray = tmpModel.nodeDataArray.filter((d)=>{
                if(!d.isGroup){
                    delete d.group
                    return true;
                }
            })
            // tmpModel.nodeDataArray = 
            tmpModel.linkDataArray=[]
        }
        if(!tmpModel.modelData.currentType){
            tmpModel.modelData.currentType = this.type;
        }
        if(["jin","shui","wheel","huo"].indexOf(this.type)>-1 ){
            tmpModel.modelData.currentType = "tianpan"
        }
        console.log(" tmpModel.modelData.currentType")
        this.diagram.layout.isInitial = false;
        //randomUrl(tmpModel);
        tmpModel.modelData.type = this.type
        for(var i = 0;i<tmpModel.nodeDataArray.length;i++){
            if(tmpModel.nodeDataArray[i].category == "waveGroup"){
                if(!tmpModel.nodeDataArray[i].centerTextAngle){
                    tmpModel.nodeDataArray[i].centerTextAngle = "independent"
                }
                if(!tmpModel.nodeDataArray[i].centerTextMode){
                    tmpModel.nodeDataArray[i].centerTextMode = "independent"
                }
                if(!tmpModel.nodeDataArray[i].maxOlive){
                    tmpModel.nodeDataArray[i].maxOlive = 50
                }
            }
            if(tmpModel.nodeDataArray[i].category == "yunGroup"){
                if(!tmpModel.nodeDataArray[i].shapeStrokes){
                    tmpModel.nodeDataArray[i].shapeStrokes = ["RGBA(237,28,36,0.3)","RGBA(255,192,0,0.3)","RGBA(255,255,0,0.3)","RGBA(146,208,80,0.3)","RGBA(192,200,250,0.3)","RGBA(255,178,125,0.3)","RGBA(209,110,210,0.3)","RGBA(248,163,62,0.3)","RGBA(248,161,164,0.3)","RGBA(244,115,120,0.3)"]
                }
                if(!tmpModel.nodeDataArray[i].beginSpark){
                    tmpModel.nodeDataArray[i].beginSpark = "line"
                }
                if(tmpModel.nodeDataArray[i].showShape == null){
                    tmpModel.nodeDataArray[i].showShape = true
                }
            }
            if(tmpModel.nodeDataArray[i].category == "shape" && tmpModel.nodeDataArray[i].role == "background"){
                tmpModel.nodeDataArray[i].visible = true
            }
            if(tmpModel.nodeDataArray[i].role && tmpModel.nodeDataArray[i].role.indexOf("labelText") > -1 ){
                tmpModel.nodeDataArray[i].movable = true;
            }
            if(tmpModel.nodeDataArray[i].category == "labelGroup"){
                tmpModel.nodeDataArray[i].selectable = false
            }
            // if(tmpModel.nodeDataArray[i].category == "autoText" && tmpModel.nodeDataArray[i].subRole=="themeText"
            //     && tmpModel.nodeDataArray[i].orderX == 10 && tmpModel.nodeDataArray[i].orderY == 10
            // ){
            //     if(!tmpModel.nodeDataArray[i].width){
            //         tmpModel.nodeDataArray[i].width = 140
            //     }
            //     if(!tmpModel.nodeDataArray[i].height){
            //         tmpModel.nodeDataArray[i].height = 140
            //     }
            // }
        }
        // tmpModel.modelData.version = Trtd.version
        // console.log(" tmpModel.modelData.version ",  tmpModel.modelData.version)
        this.diagram.model = tmpModel;
        // this.diagram.model.copyNodeDataFunction = function(object, model) {
        //     console.log("copyNodeDataFunctioncopyNodeDataFunctioncopyNodeDataFunction")
        //     // if (object.isGroup) {
        //     //     return null;
        //     // }
        //     // var outputObj = null;
        //     var outputObj = JSON.parse(JSON.stringify(object))
        //     // outputObj.level = 0;
        //     // outputObj.next = undefined;
        //     // outputObj.group = undefined;
        //     // outputObj.prev = undefined;
        //     // outputObj.isparent = undefined;
        //     // outputObj.parent = undefined;
        //     // outputObj.copiedKey = outputObj.key;
        //     delete outputObj.key;
        //     delete outputObj.__gohashid;
        //     delete outputObj.points;
        //     // if(object.category == "autoText" && object.role != "freeText"){
        //     //     delete object.dimKey;
        //     //     delete object.role;
        //     //     delete object.subRole;
        //     // }
        //     return object;
        // }
        // configModel(myDiagram.model);
        this.diagram.updateAllTargetBindings();
        // this.diagram.animationManager.isEnabled = true
        // this.saveModel()
    }
    loadModel(model){
        // console.log(model)
        // var node = this.diagram.selection.first()
        // if(node){
        //     this.diagram.commandHandler.scrollToPart(node)
        // }
        this.diagram.animationManager.isEnabled = false
        this.initModel(model)
    }
    // addNodeFile(model){
    //     console.log(model)
    // }
    /**
     * method: 初始化监听方法
     */
	initListener(){
		console.log('initListener')
    }

    addGroupTemplate(){
        // return function getGroupTemplate() {
            this.diagram.groupTemplateMap.add("", $(go.Group, "Auto", {
                    layerName: "Background",
                    selectable: false,
                    pickable: false,
                    locationSpot: go.Spot.Center,
                    ungroupable: true,
                    alignment: go.Spot.Center,
                    click: function(d) {
                        // alert('click group');
                        // d.diagram.clearSelection();
                    },
                    contextClick: function(d) {
                        // alert('click right group');
                    },
                    alignmentFocus: go.Spot.Center,
                    // contextMenu: nodeContextMenu,
                    selectionAdornmentTemplate: $(go.Adornment, "Spot",
                        $(go.Panel, "Auto",
                            $(go.Shape, 'Circle', { stroke: "dodgerblue", strokeWidth: 2, fill: null },
                                new go.Binding("width", "", function(v) {
                                    var node = myDiagram.selection.first();
                                    if (node instanceof go.Group) {
                                        return node.actualBounds.width;
                                    }
                                }),
                                new go.Binding("height", "", function(v) {
                                    var node = myDiagram.selection.first();
                                    if (node instanceof go.Group) {
                                        return node.actualBounds.height;
                                    }
                                })),
                            //new go.Binding('wit')),
                            $(go.Placeholder)
                        ),
                        $(go.Panel, "Horizontal", { alignment: go.Spot.Top, alignmentFocus: go.Spot.Bottom })
                    ),
                    copyable: false
                }, {
                    layout: $(SpiralLayout, {
                        isRealtime: false,
                        radius: NaN,
                        clockwise: true,
                        isInitial: false
                    }),
                    layoutConditions: go.Part.LayoutStandard & ~go.Part.LayoutNodeSized & ~go.Part.LayoutAdded
                },
                new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
                $(go.Panel, "Auto",
                    $(go.Shape, "Circle", {
                            name: "SHAPE",
                            fill: "rgba(212,230,188,0)",
                            stroke: null,
                            // ,
                            //width:300,
                            //height:300,
                            spot1: new go.Spot(0.01, 0.01),
                            spot2: new go.Spot(0.99, 0.99)
                        },
                        new go.Binding("stroke", "stroke", function(v) {
                            return v instanceof go.Brush ? v.stroke : v;
                        }).makeTwoWay(),
                        new go.Binding("strokeWidth", "strokeWidth", function(d) {
                            return d;
                        }).makeTwoWay(function(d) {
                            return d;
                        }),
                        new go.Binding("figure", "figure").makeTwoWay(),
                        new go.Binding("desiredSize", "radius", function(v) {
                            //alert(v);
        
                            var radius = parseInt(v ? v : 100);
                            var size = new go.Size(radius, radius);
                            return size;
                        }).makeTwoWay(function(v) {
                            return v.width;
                        })
                    ),
                    $(go.Placeholder, {
                        // margin: tdSpiralMode == 'terse' ? -10 : 0
                        margin: 0
                    })
                )
            )
        )
    }
    /**
     * 添加节点模板
     */
    addNodeTemplate(){

        var that = this;
        var myDiagram = this.diagram
        // var globalProperties = this.tdGetModelData(null, myDiagram.model,myDiagram); //获取所有全局属性到一个对象中,从localstorage中
        //var layerThickness = myDiagram.model.modelData.layerThickness;
        // var layerThickness = parseInt(globalProperties['layerThickness']);
        // console.log(layerThickness)
        // var tdDipanTextAngle = globalProperties['tdDipanTextAngle'];
        // console.log(tdDipanTextAngle)

        // myDiagram.nodeTemplateMap.add("dipan", this.createDipanTemplate(layerThickness,tdDipanTextAngle));
        // myDiagram.nodeTemplateMap.add("Root", this.getDipanRootTemplate(layerThickness));
        // myDiagram.nodeTemplateMap.add("text", );
        this.addNodeTemplateBase()
        myDiagram.nodeTemplateMap.add("0", createNodeTemplate(this.diagram));
        myDiagram.nodeTemplateMap.add("1", createNodeTemplate(this.diagram));
        myDiagram.nodeTemplateMap.add("2", createNodeTemplate(this.diagram));
        myDiagram.nodeTemplateMap.add("3", createPictureSingleNodeTemplate(this.diagram));
        myDiagram.nodeTemplateMap.add("4", createPictureNodeTemplate(this.diagram));
        // myDiagram.nodeTemplateMap.add("text", createTextNodeTemplate(this.diagram));
        myDiagram.nodeTemplateMap.add("", createNodeTemplate(this.diagram));

        myDiagram.nodeTemplateMap.add("8",createNodeSvgTemplate(this.diagram));

        
    }

    addLinkTemplate(){
        this.diagram.linkTemplateMap.add("", createTianpanLink(this.diagram));
        // myDiagram.linkTemplateMap.add("", linkTemplate.getTianpanLink());
    }

    /***
     * 将node(包括它的后代)设置为parent的第一个孩子. 如果parent是Node的后代，则不操作
     * @param node go.Node Type
     * @param parent go.Node Type
     */
    setNodeAsChildren(node, parent) {
        if (isDescendant(parent, node)) {
            //illegal action
            return;
        }
        if (parent.data.isparent == node.data.key) {
            return;
        }

        var diagram = node.diagram,
            model = node.diagram.model;

        model.startTransaction('setNodeAsChildren');
        disconnectFromTreeStructure(node);

        //add as the child of parent
        if (parent.data.isparent) {
            //if has children
            var firstChild = diagram.findNodeForKey(parent.data.isparent);
            model.setDataProperty(parent.data, 'isparent', node.data.key);
            model.setDataProperty(firstChild.data, 'prev', node.data.key);
            model.setDataProperty(node.data, 'next', firstChild.data.key);
            model.setDataProperty(node.data, 'parent', parent.data.key);
            // model.setDataProperty(node.data, 'fill', firstChild.data.fill);

            var link = parent.findLinksTo(firstChild).first();
            model.setToKeyForLinkData(link.data, node.data.key);
            var newLink = model.copyLinkData(link.data);
            newLink.from = node.data.key;
            newLink.to = firstChild.data.key;
            model.addLinkData(newLink);

        } else {
            //if it's a single node which has no children
            model.setDataProperty(parent.data, 'isparent', node.data.key);
            model.setDataProperty(node.data, 'next', null);
            model.setDataProperty(node.data, 'parent', parent.data.key);
            var newLink = { from: parent.data.key, to: node.data.key, level: parent.data.level + 1, isTreeLink: true };
            // if (parent.findLinksInto().first()) {
            //     newLink.strokeWidth = Math.max(1, parent.findLinksInto().first().data.strokeWidth - 0.5);
            // } else {
            //     newLink.strokeWidth = 4;
            // }

            newLink.strokeWidth = 2;

            applyTheme2Link(newLink, node);
            model.addLinkData(newLink);

            var newGroup = {
                isGroup: true,
                group: parent.data.group,
                parent: parent.data.key,
                key: "g_" + parent.data.key,
                level: parent.data.level
            }
            model.addNodeData(newGroup);
            model.setDataProperty(parent.data, "group", newGroup.key);
        }

        //update group
        var nodeGroup = node.containingGroup;
        if (nodeGroup && nodeGroup.data.parent == node.data.key) {
            model.setDataProperty(nodeGroup.data, 'group', parent.data.group);
        } else {
            if (node.data.parent == null && node.data.isparent != null) {
                //add group for root node
                addGroupForNode(node, parent.data.group);
            } else {
                model.setDataProperty(node.data, "group", parent.data.group);
            }
        }

        //update level
        var diff = node.data.level - parent.data.level - 1;
        helpers.travelParts(node, function(part) {
            model.setDataProperty(part.data, 'level', part.data.level - diff);
        });
        model.commitTransaction('setNodeAsChildren');
    }

    /***
     * 将node(包括它的后代)设置为sibling的下一个兄弟
     * @param node  go.Node Type
     * @param sibling go.Node Type
     */
    setNodeAsSibling(node, sibling) {
        if (isDescendant(sibling, node)) {
            //illegal action
            return;
        }
        if (sibling.data.next == node.data.key) {
            return;
        }
    
        var diagram = node.diagram,
            model = node.diagram.model;
    
        model.startTransaction('setNodeAsSibling');
        disconnectFromTreeStructure(node);
    
        //add as next brother of sibling
        if (sibling.data.next != null) {
            var nextNode = diagram.findNodeForKey(sibling.data.next);
            model.setDataProperty(sibling.data, 'next', node.data.key);
            model.setDataProperty(node.data, 'next', nextNode.data.key);
            model.setDataProperty(node.data, 'prev', sibling.data.key);
            model.setDataProperty(nextNode.data, 'prev', node.data.key);
            model.setDataProperty(node.data, 'parent', sibling.data.parent);
            // model.setDataProperty(node.data, 'fill', sibling.data.fill);
    
            var link = sibling.findLinksTo(nextNode).first();
            model.setToKeyForLinkData(link.data, node.data.key);
            var newLink = model.copyLinkData(link.data);
            newLink.from = node.data.key;
            newLink.to = nextNode.data.key;
            model.addLinkData(newLink);
        } else {
            model.setDataProperty(sibling.data, 'next', node.data.key);
            model.setDataProperty(node.data, 'next', null);
            model.setDataProperty(node.data, 'prev', sibling.data.key);
            model.setDataProperty(node.data, 'parent', sibling.data.parent);
            // console.log("sibling.data.fill",sibling.data.fill)
            model.setDataProperty(node.data, 'fill', sibling.data.fill);
    
            var preLink = sibling.findLinksInto().first();
            var newLink = model.copyLinkData(preLink.data);
            newLink.from = sibling.data.key;
            newLink.to = node.data.key;
            model.addLinkData(newLink);
        }
    
        //update level
        var diff = node.data.level - sibling.data.level;
        helpers.travelParts(node, function(part) {
            model.setDataProperty(part.data, 'level', part.data.level - diff);
        });
    
        //update group
        var nodeGroup = node.containingGroup;
        var parent = diagram.findNodeForKey(sibling.data.parent);
        if (nodeGroup && nodeGroup.data.parent == node.data.key) {
            model.setDataProperty(node.containingGroup.data, 'group', parent.data.group);
        } else {
            if (node.data.parent == null && node.data.isparent != null) {
                //add group for root node
                addGroupForNode(node, parent.data.group);
            } else {
                model.setDataProperty(node.data, "group", parent.data.group);
            }
        }
        if (parent && parent.containingGroup) {
            var parentGroup = parent.containingGroup;
            if (parentGroup) {
                parentGroup.layout.isOngoing = true;
                parentGroup.layout.isValidLayout = false;
            }
        }
        model.commitTransaction('setNodeAsSibling');
    }


    /***
     * 将node(包括它的后代)设置为parent的第一个孩子. 如果parent是Node的后代，则不操作
     * @param node go.Node Type
     * @param parent go.Node Type
     */
    setNodeAsChildren(node, parent) {
        if (isDescendant(parent, node)) {
            //illegal action
            return;
        }
        if (parent.data.isparent == node.data.key) {
            return;
        }

        var diagram = node.diagram,
            model = node.diagram.model;

        model.startTransaction('setNodeAsChildren');
        disconnectFromTreeStructure(node);

        //add as the child of parent
        if (parent.data.isparent) {
            //if has children
            var firstChild = diagram.findNodeForKey(parent.data.isparent);
            model.setDataProperty(parent.data, 'isparent', node.data.key);
            model.setDataProperty(firstChild.data, 'prev', node.data.key);
            model.setDataProperty(node.data, 'next', firstChild.data.key);
            model.setDataProperty(node.data, 'parent', parent.data.key);
            // model.setDataProperty(node.data, 'fill', firstChild.data.fill);

            var link = parent.findLinksTo(firstChild).first();
            model.setToKeyForLinkData(link.data, node.data.key);
            var newLink = model.copyLinkData(link.data);
            newLink.from = node.data.key;
            newLink.to = firstChild.data.key;
            model.addLinkData(newLink);

        } else {
            //if it's a single node which has no children
            model.setDataProperty(parent.data, 'isparent', node.data.key);
            model.setDataProperty(node.data, 'next', null);
            model.setDataProperty(node.data, 'parent', parent.data.key);
            var newLink = { from: parent.data.key, to: node.data.key, level: parent.data.level + 1, isTreeLink: true };
            // if (parent.findLinksInto().first()) {
            //     newLink.strokeWidth = Math.max(1, parent.findLinksInto().first().data.strokeWidth - 0.5);
            // } else {
            //     newLink.strokeWidth = 4;
            // }

            newLink.strokeWidth = 2;

            applyTheme2Link(newLink, node);
            model.addLinkData(newLink);

            var newGroup = {
                isGroup: true,
                group: parent.data.group,
                parent: parent.data.key,
                key: "g_" + parent.data.key,
                level: parent.data.level
            }
            model.addNodeData(newGroup);
            model.setDataProperty(parent.data, "group", newGroup.key);
        }

        //update group
        var nodeGroup = node.containingGroup;
        if (nodeGroup && nodeGroup.data.parent == node.data.key) {
            model.setDataProperty(nodeGroup.data, 'group', parent.data.group);
        } else {
            if (node.data.parent == null && node.data.isparent != null) {
                //add group for root node
                addGroupForNode(node, parent.data.group);
            } else {
                model.setDataProperty(node.data, "group", parent.data.group);
            }
        }

        //update level
        var diff = node.data.level - parent.data.level - 1;
        helpers.travelParts(node, function(part) {
            model.setDataProperty(part.data, 'level', part.data.level - diff);
        });
        model.commitTransaction('setNodeAsChildren');
    }


    // tdGetModelData(name,model) { //获取盘的model.modelData中的全局属性 
    //     // if(myDiagram1){
    //     //     myDiagram = myDiagram1
    //     // }
    //     var myDiagram = this.diagram
    //     var  model = myDiagram.model
    //     var defaultVal = {
    //         currentType: 'tianpan',
    //         currentThemeID: 0,
    //         layerThickness: 100,
    //         splitLayer: 1,
    //         layout: 'inner',
    //         tdDipanTextAngle: 'xuanzhuan'
    //     };
    //     console.log("getRootNodeData1111111111111111111111")
    //     var root = getRootNodeData(model);
    //     if (typeof(name) != 'undefined' && name != null) { //返回指定的属性值
    //         if (root) {
    //             return root[name] || model.modelData[name] || defaultVal[name]
    //         } else {
    //             return model.modelData[name] || defaultVal[name];
    //         }
    //     }
    //     //返回所有属性值
    //     if (root) {
    //         for (var key in defaultVal) {
    //             if (root[key]) {
    //                 defaultVal[key] = root[key];
    //             } else {
    //                 if (model.modelData && model.modelData[key]) {
    //                     defaultVal[key] = model.modelData[key];
    //                 }
    //             }
    //         }
    //     } else {
    //         for (var key in defaultVal) {
    //             if (model.modelData && model.modelData[key]) {
    //                 defaultVal[key] = model.modelData[key];
    //             }
    //         }
    //     }
    //     return defaultVal;
    // }
    deleteSelection (e) {
        var myDiagram = this.diagram;
        var cmd = myDiagram.commandHandler;
        var node = myDiagram.selection.first();
        
        if (!node) {
            return;
        }
        // var nodeCopy = JSON.parse(JSON.stringify(node.data))
        if (node instanceof go.Group) {
            return;
        }
        if (node.data.key == 1 || node.data.key == 'g_1') {
            //root node or root group
            return;
        }
    
        var locateNode = null;
        var tempArray = ["next","prev","parent"]
        for(var i=0;i<tempArray.length;i++){
            if(node.data[tempArray[i]]){
                locateNode = myDiagram.findNodeForKey(node.data[tempArray[i]])
                break;
            }
        }
        // if (node.findNodesOutOf().first()) {
        //     locateNode = node.findNodesOutOf().first();
        // } else if (node.findNodesInto().first()) {
        //     locateNode = node.findNodesInto().first();
        // }
    
        myDiagram.startTransaction("deleteSelection1");
        try {
    
            if (node instanceof go.Link) {
                return;
            }
            myDiagram.startTransaction('sub');
            this.deleteNode(node, e);
    
            myDiagram.commitTransaction('sub');
            // myDiagram.model.removeNodeData(node.data);
            go.CommandHandler.prototype.deleteSelection.call(cmd);
    
            // myDiagram.updateAllTargetBindings();
    
        } catch (ex) {
            console.log(ex);
            myDiagram.commitTransaction("deleteSelection1");
        }
        // myDiagram.updateAllTargetBindings();
        myDiagram.commitTransaction("deleteSelection1");
        if (locateNode) {
            myDiagram.select(locateNode);
        }

    }
    //删除节点
    deleteNode(node, e) {
        console.log("deleteNodedeleteNodedeleteNodedeleteNode")
        var myDiagram = this.diagram;
        var mainNode = null;
        if (node instanceof go.Group) {
            //查找第一个节点
            node.memberParts.each(function(n) {
                if (n.data.isparent) {
                    mainNode = n;
                }
            })
        }
        node = mainNode == null ? node : mainNode;
        if (node instanceof go.Node) {
            var preNode = node.findNodesInto().first() ? node.findNodesInto().first() : null;
            var nextNode = node.data.next ? myDiagram.findNodeForKey(node.data.next) : null;
            if (nextNode) {
                var nextNodeLink = nextNode.findLinksInto().first();
            } else {
                var nextNodeLink = null;
            }

            var intoLink = node.findLinksInto().first();
            var tmpNodeData = {};
            // _.extendOwn(tmpNodeData, node.data);
            // tmpNodeData = helpers.extend(tmpNodeData, node.data);
            tmpNodeData = JSON.parse(JSON.stringify(node.data));
            var oldlink = node.findLinksInto().first() ? node.findLinksInto().first().data : null;
            var link = {};
            // link = _.extendOwn(link, oldlink);
            // link = helpers.extend(link, oldlink);
            if(oldlink){
                delete oldlink.points;

            }
            link = JSON.parse(JSON.stringify(oldlink))
            delete link.__gohashid;
            delete link.points;
            if (node.data.group) {
                var nodeGroup = myDiagram.findNodeForKey(node.data.group);
                // var nodeGroupData = nodeGroup.data;
            } else {
                var nodeGroup = null;
                var nodeGroupData = null;
            }

            //如果不是根节点,除了根节点都有一条入边
            // myDiagram.startTransaction("changeLinks");
            try {
                if (node.data.isparent) {
                    var nodes = [],
                        groups = [],
                        mylinks = [];
                    myDiagram.nodes.each(function(n) {
                        if (n.isMemberOf(nodeGroup) && n.data.key != node.data.key) {
                            nodes.push(n.data);
                            if (n.findLinksInto().count > 0) {
                                mylinks.push(n.findLinksInto().first().data);
                            }

                        }
                    });

                    if (mainNode) {
                        nodes.push(node.data);
                    }
                    myDiagram.model.removeNodeDataCollection(nodes);
                    myDiagram.model.removeLinkDataCollection(mylinks);
                    myDiagram.model.removeNodeData(nodeGroup.data);
                }

                if (preNode != null) {
                    ////如果是父节点，则删除所有子孙节点,包括group

                    //当前节点为第一个子节点
                    if (preNode.data.key == tmpNodeData.parent) {
                        //如果当前节点是最后一个子节点
                        if (nextNode == null) {

                            var parGroup = myDiagram.findNodeForKey(preNode.data.group);
                            var grandNode = myDiagram.findNodeForKey(preNode.data.parent);
                            if(preNode.data.category!=="Root"){//zyy增加判断
                                if (grandNode) {
                                    myDiagram.model.setDataProperty(preNode.data, "group", grandNode.data.group);
                                } else {
                                    if(parGroup && parGroup.data.group){
                                        myDiagram.model.setDataProperty(preNode.data, "group", parGroup.data.group);
                                    }else{
                                        myDiagram.model.setDataProperty(preNode.data, "group", undefined);
                                    }
                                }
                            }

                            //父节点的isparent属性
                            myDiagram.model.setDataProperty(preNode.data, "isparent", undefined);
                            //var parGroup = myDiagram.findNodeForKey(preNode.data.group);
                            if (parGroup) {
                                myDiagram.model.removeNodeData(parGroup.data);
                            }
                        } else {
                            link.from = preNode.data.key;
                            link.to = nextNode.data.key;
                            myDiagram.model.setDataProperty(nextNode.data, "prev", undefined);
                            myDiagram.model.addLinkData(link);
                            myDiagram.model.setDataProperty(myDiagram.model.findNodeDataForKey(tmpNodeData.parent), "isparent", nextNode.data.key);

                        }
                    } else {
                        //
                        myDiagram.model.setDataProperty(preNode.data, "next", nextNode == null ? null : nextNode.data.key);

                        if (nextNode != null) {
                            link.from = preNode.data.key;
                            link.to = nextNode.data.key;
                            myDiagram.model.setDataProperty(nextNode.data, "prev", preNode.data.key);
                            myDiagram.model.addLinkData(link);
                        }
                    }

                    //var parLink = node.findLinksInto().first();
                    if (intoLink) {
                        myDiagram.model.removeLinkData(intoLink.data);
                    }
                    if (nextNodeLink) {
                        myDiagram.model.removeLinkData(nextNodeLink.data);
                    }
                }
            } catch (ex) {
                console.log(ex.message);
            }

        }
        myDiagram.isModified = true;
    }

    addLevelNodeData(node) {
        var isautolayout = window.localStorage.getItem('isautolayout') == null ? true : window.localStorage.getItem('isautolayout') == 'true';
        // var isautoselect =  window.localStorage.getItem('isautoselect') == null?true:window.localStorage.getItem('isautoselect') == 'true';
        var myDiagram = node.diagram;
        var currentType = 'tianpan';
        var toKey = node.data.next;
        //delete the next link
    
        var nextkey = (myDiagram.model.nodeDataArray.length + 1).toString();
        //var follower = {key: nextkey, text: nextkey, color: "yellow"};
    
        var follower = { key: nextkey, text: lang.trans("dce"), color: "yellow" };
        myDiagram.model.makeNodeDataKeyUnique(follower);
        nextkey = follower.key;
        var nextnode = null;
        var nextlink = null;
        var group = myDiagram.model.findNodeDataForKey(node.data.parent).group;
        //找到下一个子节点
        node.findNodesOutOf().each(function(n) {
            if (n.data.level == node.data.level) {
                nextnode = n;
            }
        });
    
        var nextlink = null;
        //找到下一条边
        node.findLinksOutOf().each(function(l) {
            if (l.data.level == node.data.level) {
                nextlink = l;
            }
        });
        //ControlAutoLayout(false);
        myDiagram.model.startTransaction();
    
        follower = applyTheme2Node(follower, node);
        //delete the next link
        var deleteLink = null;
    
        //if has next node
        if (nextnode != null) {
            follower.next = nextnode.data.key;
            myDiagram.model.setDataProperty(nextnode.data, "prev", follower.key);
        }
    
        if (group) {
            follower.group = group;
        }
    
    
        follower.level = node.data.level;
        if (currentType == "tianpan") {
            follower.radius = node.data.radius;
            //follower.fill = colorMap[follower.level % 5];
            follower.fill = node.data.fill;
        } else {
            follower.radius = node.data.radius;
            follower.fill = node.data.fill;
            //follower.fill =go.Brush.randomColor(128, 240);
            follower.dangle = node.data.dangle;
            follower.dradius = node.data.dradius;
            follower.sweep = node.data.sweep;
            follower.layerThickness = node.data.layerThickness || 100;
            follower.tdDipanTextAngle = node.data.tdDipanTextAngle || 'xuanzhuan';
        }
        follower.parent = node.data.parent;
        follower.prev = node.data.key;
        follower.strokeWidth = node.data.strokeWidth;
        follower.stroke = node.data.stroke;
        follower.font = node.data.font;
        //follower.font = node.data.font;
        follower.textStroke = node.findObject("TEXT").stroke;
        if (node.data.figure) {
            follower.figure = node.data.figure;
        }
        follower.loc = node.data.loc;
        if (currentType == 'tianpan') {
    
            var nextLocation = node.location.copy();
            if (node.data.parent) {
                var parentNode = myDiagram.findNodeForKey(node.data.parent);
                if (parentNode) {
                    nextLocation = computeNextLoc(node, parentNode);
                }
            }
            follower.loc = go.Point.stringify(nextLocation);
    
        }
        if (node.data.width) {
            follower.width = node.data.width;
        }
        if (node.data.height) {
            follower.height = node.data.height;
        }
        follower.category = node.data.category;
        follower.newAdd = true;
        // add a new node
        myDiagram.model.addNodeData(follower);
    
        // add a link from the selected node to the new node
        var linkToFollower = { from: node.data.key, to: follower.key };
        linkToFollower.level = node.data.level;
        linkToFollower.color = follower.fill;
        linkToFollower.isTreeLink = true;
        linkToFollower = applyTheme2Link(linkToFollower, node);
    
        // linkToFollower.strokeWidth = node.data.level == 1 ? 4 : Math.max(1, 3 - (linkToFollower.level - 1) * 0.5);
        linkToFollower.strokeWidth = 2;
        if (node.findLinksInto() && node.findLinksInto().first()) {
            linkToFollower.color = node.findLinksInto().first().data.color;
            linkToFollower.strokeWidth = node.findLinksInto().first().data.strokeWidth;
            linkToFollower.toArrow = node.findLinksInto().first().data.toArrow;
            linkToFollower.strokeDashArray = node.findLinksInto().first().data.strokeDashArray;
        } else {
            linkToFollower = applyTheme2Link(linkToFollower, node);
        }
        if (currentType == 'dipan') {
            if (node.data.category == 'Root' || node.data.category == 'dipan') {
                linkToFollower.category = 'dipan';
            }
        }
        myDiagram.model.addLinkData(linkToFollower, node);
    
        myDiagram.model.setDataProperty(node.data, "next", nextkey);
        if (nextlink != null) {
            var copyLink = {};
            // _.extendOwn(copyLink, nextlink.data);
            // copyLink = helpers.extend(copyLink, nextlink.data);
            delete nextlink.data.points
            copyLink = JSON.parse(JSON.stringify(nextlink.data));

            delete copyLink.__gohashid;
            delete copyLink.points;
            copyLink.from = follower.key;
            copyLink.to = nextlink.data.to;
            myDiagram.model.removeLinkData(nextlink.data);
            myDiagram.model.addLinkData(copyLink);
        }
        myDiagram.model.commitTransaction();
        myDiagram.isModified = true;
        return follower;
    }

    addFollower(e, iskeyboard) {
        if(!e){
            var e = this.diagram.lastInput
        }
        var myDiagram = e.diagram;
        var node = myDiagram.selection.first();
        if (!node) return;
        var diagram = node.diagram;
        // var isautolayout = window.localStorage.getItem('isautolayout') == null ? true : window.localStorage.getItem('isautolayout') == 'true';
        var isautolayout = true
        if (node === null || !(node instanceof go.Node) || node instanceof go.Group) return;
        if (node.findLinksInto().count == 0) return;
        if (myDiagram.toolManager.textEditingTool.isActive) {
            var tb = myDiagram.selection.first().findObject('TEXT');
            tb.text = myDiagram.toolManager.textEditingTool.currentTextEditor.innerText;
            myDiagram.toolManager.textEditingTool.stopTool();
        }
        if (!isautolayout) {
            ControlAutoLayout(e, false);
        } else {
            if (node.data.level >= 3) {
                ControlAutoLayout(e, false);
                autoLayoutPart(node);
            } else {
                ControlAutoLayout(e, true);
            }
        }
    
        myDiagram.model.startTransaction('all');
    
        var follower = this.addLevelNodeData(node);
        myDiagram.model.commitTransaction('all');
    
        if (typeof iskeyboard != 'undefined' && iskeyboard == true) { // check whether is a keyboard trigger the action
            var newnode = diagram.findNodeForData(follower);
            if (newnode) {
                diagram.select(newnode);
            }
    
            //myDiagram.scale = 0.6588944708324703;
            myDiagram.isModified = true;
    
            var tb = myDiagram.selection.first().findObject('TEXT');
            // // console.log(tb)
            if (tb) myDiagram.commandHandler.editTextBlock(tb);
            helpers.simulateEnterWithAlt(e);
        }
    }

    startNewSpiral(iskeyboard) {
        var myDiagram = this.diagram;
        var e = myDiagram.lastInput;
        var node = myDiagram.selection.first();
        if (!node) return;
        var diagram = node.diagram;
        // var isautolayout = window.localStorage.getItem('isautolayout') == null ? true : window.localStorage.getItem('isautolayout') == 'true';
        var isautolayout = true
        // var isautoselect =  window.localStorage.getItem('isautoselect') == null?true:window.localStorage.getItem('isautoselect') == 'true';
        if (node === null || !(node instanceof go.Node) || node instanceof go.Group) return;
    
        if (node.data.isparent && myDiagram.findNodeForKey(node.data.isparent) && !myDiagram.findNodeForKey(node.data.isparent).visible) {
            return;
        }
        if (!isautolayout) {
            ControlAutoLayout(e, false);
        } else {
            if (node.data.level >= 2) {
                ControlAutoLayout(e, false);
                autoLayoutPart(node);
            } else {
                ControlAutoLayout(e, true);
            }
        }
        myDiagram.startTransaction();
        myDiagram.startTransaction("addChildNodeData");
        var follower = this.addChildNodeData(node);
        // var root = getRootNodeData(node.data, myDiagram.model, 0);
        myDiagram.commitTransaction("addChildNodeData");
        myDiagram.commitTransaction();
    
        // select the new Node
        if (typeof iskeyboard != 'undefined' && iskeyboard == true) {
            var newnode = myDiagram.findNodeForData(follower);
            if (newnode) {
                myDiagram.centerRect(newnode.actualBounds);
            }
    
            diagram.select(newnode); //需要居中
            var tb = myDiagram.selection.first().findObject('TEXT');
            if (tb) myDiagram.commandHandler.editTextBlock(tb);
            helpers.simulateEnterWithAlt(e);
        }
    }

    
    //modify nodeDataArray
    addChildNodeData(node) {
        console.log("===================天盘")
        var isautolayout = window.localStorage.getItem('isautolayout') == null ? true : window.localStorage.getItem('isautolayout') == 'true';
        // var isautoselect =  window.localStorage.getItem('isautoselect') == null?true:window.localStorage.getItem('isautoselect') == 'true';
        var myDiagram = node.diagram;
        var result = arguments[1] ? arguments[1] : null;
        var currentType = 'tianpan';
        // var nodeRoot = getRootNodeData(node.data, myDiagram.model);
        // if (nodeRoot.category == "Root") {
        //     currentType = 'dipan';
        // } else {
        //     currentType = 'tianpan';
        // }
        currentType = 'tianpan';
        //myDiagram.startTransaction();
        var nextkey = (myDiagram.model.nodeDataArray.length + 1).toString();
        //var follower = {key: nextkey, text: nextkey};
        var follower = { key: nextkey, text: lang.trans('dce') };
        //if (result != null) {
        myDiagram.model.makeNodeDataKeyUnique(follower);
        nextkey = follower.key;
        //}
        //找到第一个子节点
        var firstNode = myDiagram.findNodeForKey(node.data.isparent);
        // node.findNodesOutOf().each(function(n) {
        //     if (n.data.level > node.data.level) {
        //         firstNode = n;
        //     }
        // });

        var firstLink = null;
        //找到第一条子边
        node.findLinksOutOf().each(function(l) {
            if (l.data.level > node.data.level) {
                firstLink = l;
            }
        });
        follower.level = node.data.level + 1;
        follower.parent = node.data.key;
        follower.prev = undefined;

        //如果已经有子节点
        if (node.data.isparent && firstNode != null) {

            follower.next = firstNode.data.key;
            myDiagram.model.setDataProperty(firstNode.data, "prev", follower.key);
        }

        if (result != null) {
            //只是用来填充的节点
            follower.istemp = true;
            follower.text = "";
        }



        if (node.data.level == 0) {
            follower.radius = Math.max(node.data.radius * 0.75, 100);
        } else {
            if (node.data.radius) {
                follower.radius = Math.max(node.data.radius - 5, 50);
            } else {
                follower.radius = Math.max(InitialFontSize - node.data.level * 10, 50);
            }

        }
        //如果当前节点属于某个group，根节点和普通主节点通用
        if (firstNode != null) {
            if (node.containingGroup) {
                follower.group = node.containingGroup.data.key;
            }

        }
        //如果当前节点属于某个group，根节点和普通主节点通用
        // if (firstNode == null && currentType=='tianpan') {
        if (firstNode == null) {
            // add a group; make it a member of the same group as the selected node
            var newGroup = {
                isGroup: true,
                group: node.data.group,
                parent: node.data.key,
                fill: "rgba(0,0,0,0)",
                stroke: "rgba(0,0,0,0)",
                strokeWidth: 0,
                level: node.data.level
            };
            newGroup = applyTheme2Group(newGroup, node);
            // if (node.data.category == "dipan" || node.data.category == "Root") {
            //     newGroup.category = "dipan";


            // }
            myDiagram.model.addNodeData(newGroup);
            //修改主节点的group为新的group
            myDiagram.model.setGroupKeyForNodeData(node.data, newGroup.key);
            follower.group = newGroup.key;
        }


        follower.fill = colorMap[follower.level % 5];
        follower.category = node.data.category;

        follower.loc = go.Point.stringify(computeChildLoc(node));



        // follower.strokeWidth = node.data.strokeWidth;
        follower.strokeWidth = 2;
        if (node.data.figure) {
            follower.figure = node.data.figure;
        }

        if (node.data.picture) {
            follower.picture = node.data.picture;
        }


        if (node.data.width) {
            follower.width = node.data.width;
        }
        if (node.data.height) {
            follower.height = node.data.height;
        }

        follower = applyTheme2Node(follower, node);

        follower.font = node.data.font;
        follower.textStroke = node.findObject("TEXT").stroke;
        myDiagram.model.setDataProperty(node.data, "isparent", nextkey);
        follower.newAdd = true;
        myDiagram.model.addNodeData(follower);


        // add a link from the selected node to the new node
        var linkToFollower = { from: node.data.key, to: follower.key };

        linkToFollower.level = follower.level;
        //linkToFollower.color = follower.fill;
        linkToFollower.isTreeLink = true;


        // linkToFollower.strokeWidth = node.data.level <= 0 ? 4 : Math.max(1, 3 - (linkToFollower.level - 1) * 0.5);
        linkToFollower.strokeWidth = 2;
        var intoLink = null;
        intoLink = node.findLinksInto().first();
        if (firstLink != null) {
            linkToFollower.toArrow = firstLink.data.toArrow;
            linkToFollower.strokeDashArray = firstLink.data.strokeDashArray;
            linkToFollower.color = firstLink.data.color;
            linkToFollower.strokeWidth = 2;
            // if (node.data.level == 0) {
            //     linkToFollower.strokeWidth = 4;
            // } else {
            //     if (node.data.level == 1) {
            //         linkToFollower.strokeWidth = Math.max(1, firstLink.data.strokeWidth - 1);
            //     } else {
            //         linkToFollower.strokeWidth = Math.max(1, firstLink.data.strokeWidth - 0.5);
            //     }
            // }
            //linkToFollower.strokeWidth = node.data.level <= 0 ? 4 : (node.data.level == 1?node.data.strokeWidth -1:node.data.strokeWidth-0.5)  Math.max(1, 3 - (linkToFollower.level - 1) * 0.5));
        } else if (intoLink != null) {
            linkToFollower.toArrow = intoLink.data.toArrow;
            linkToFollower.strokeDashArray = intoLink.data.strokeDashArray;
            linkToFollower.color = intoLink.data.color;
            linkToFollower.strokeWidth = 2;
            // if (node.data.level == 0) {
            //     linkToFollower.strokeWidth = 4;
            // } else {
            //     if (node.data.level == 1) {
            //         linkToFollower.strokeWidth = Math.max(1, intoLink.data.strokeWidth - 1);
            //     } else {
            //         linkToFollower.strokeWidth = Math.max(1, intoLink.data.strokeWidth - 0.5);
            //     }
            // }
        } else {
            linkToFollower = applyTheme2Link(linkToFollower, node);
        }

        if (node.data.category == "dipan" || node.data.category == 'Root') { //处理天盘
            linkToFollower.category = "dipan";
        }

        myDiagram.model.addLinkData(linkToFollower);
        if (firstLink != null) {
            var copyLink = {};
            // _.extendOwn(copyLink, firstLink.data);
            // copyLink = helpers.extend(copyLink, firstLink.data);
            delete firstLink.data.points
            copyLink = JSON.parse(JSON.stringify(firstLink.data))
            delete copyLink.__gohashid;
            delete copyLink.points;
            copyLink.from = follower.key;
            copyLink.to = firstLink.data.to;
            myDiagram.model.removeLinkData(firstLink.data);
            myDiagram.model.addLinkData(copyLink);
            // myDiagram.model.setFromKeyForLinkData(firstLink.data, follower.key);
        }
        if (currentType == 'tianpan') {
            //  if (!isautolayout || !isautoselect) {
            //   ControlAutoLayout(false);
            //   // if(node.data.isparent && myDiagram.findNodeForKey(node.data.isparent) && node.data.group){
            //   //   node = myDiagram.findNodeForKey(node.data.group)
            //   // }
            //   if (node && node.containingGroup) {
            //     node.containingGroup.layout.isOngoing = true;
            //     node.containingGroup.layout.isValidLayout = false;
            //   }else{
            //     node.diagram.layout.isOngoing = true;
            //     node.diagram.layout.isValidLayout = false;
            //   }
            // }
        }
        //myDiagram.commitTransaction("new spiral");
        myDiagram.isModified = true;
        return follower;
    }


    moveWithinNodes(direction) {
        var myDiagram = this.diagram;
        var node = myDiagram.selection.first();
        if(!node){
            return;
        }
        if (!node) {
            myDiagram.select(myDiagram.findNodeForKey(1));
            return;
        }
        switch (direction) {
            case 'left':
                if (node.data.prev) {
                    var prevNode = myDiagram.findNodeForKey(node.data.prev);
                    if (prevNode) {
                        myDiagram.select(prevNode);
                    }
                }
                break;
            case 'up':
                if (node.data.parent) {
                    var prevNode = myDiagram.findNodeForKey(node.data.parent);
                    if (prevNode) {
                        myDiagram.select(prevNode);
                    }
                }
                break;
            case 'right':
                if (node.data.next) {
                    var prevNode = myDiagram.findNodeForKey(node.data.next);
                    if (prevNode) {
                        myDiagram.select(prevNode);
                    }
                }
                break;
            case 'down':
                if (node.data.isparent) {
                    var prevNode = myDiagram.findNodeForKey(node.data.isparent);
                    if (prevNode) {
                        myDiagram.select(prevNode);
                    }
                }
                break;
        }
    }

    selectText(e) {
        var myDiagram = this.diagram
        var node = myDiagram.selection.first();
        if (!node) return;
        // removeNodeRemarkTips();
        var tb = myDiagram.selection.first().findObject('TEXT');
        if (tb) myDiagram.commandHandler.editTextBlock(tb);
        helpers.simulateEnterWithAlt(e);
    }

    //快捷键
    dokeyDownFn (e) {
        // console.log('myDiagram:', diagram);
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
            this.selectText(e, diagram);
            return true;
    
        }
        // console.log('catched in dokeydown ' + e.event.keyCode);
        // console.log('catched in dokeydown ' + e.key);
        if (e.event.keyCode === 13) { // could also check for e.control or e.shift
            var node = myDiagram.selection.first();
            if (node && node.data.parent) {
                this.addFollower(e, true);
            }
            if (node && !node.data.parent) {
                that.startNewSpiral(true);
            }
        } else if (e.event.keyCode === 9) { // could also check for e.control or e.shift
            that.startNewSpiral(true);
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
    
    // 生成base64图片
    downloadImage() {
        var myDiagram = this.diagram;
        var imgdata = myDiagram.makeImageData({
            scale: 1.0,
            background: "#ffffff",
            type: "image/png",
            maxSize: new go.Size(9000, 9000)
        });

        return imgdata;
    }

   
    getNodeSelectionAdornmentTemplate() {
        return $(go.Adornment, "Spot",
            $(go.Panel, "Auto",
                $(go.Shape, { figure: "Circle", fill: 'rgba(255,0,120,0.2)', stroke: "#767678", strokeWidth: 12 },
                    new go.Binding("stroke", "", function(e, obj) {
                        if (e.stroke) {
                            return tinycolor(e.stroke).saturate().toString()
                        } else {
                            return "#767678";
                        }
                    }),
                    // new go.Binding("fill","",function(e,obj){
                    //   var radBrush = $(go.Brush, "Radial", { 0: "rgba(248,248,242,0)", 1: 'RGB(255,242,0)' });
                    //   return radBrush;
                    // })
                    // ,
                    new go.Binding("strokeWidth", "", function(e, obj) {
                        if (e.strokeWidth) {
                            return e.strokeWidth + 5;
                        } else {
                            return 6;
                        }
    
                    }),
                    new go.Binding("width", "", function(e, obj) {
                        return e.radius || 150;
                    }),
                    new go.Binding("height", "", function(e, obj) {
                        return e.radius || 150;
                    })
                ),
                $(go.Placeholder) // this represents the selected Node
    
            ),
            // the button to create a "next" node, at the top-right corner
            $("Button", {
                    name: "AddChild",
                    toolTip: $(go.Adornment, "Auto",
                        $(go.Shape, { fill: "#FFFFCC" }),
                        $(go.TextBlock, { textAlign: 'center', margin: new go.Margin(8, 4, 4, 4) }, // the tooltip shows the result of calling nodeInfo(data)
                            new go.Binding("text", "", function(d) {
                                return "增加子节点";
                            }))
                    ),
                    alignment: go.Spot.Top,
                    alignmentFocus: go.Spot.Bottom,
                    width: 30,
                    height: 30,
                    click: function (e) {
                        e.diagram.__trtd.startNewSpiral()
                    } // this function is defined below
                },
                $(go.Shape, "PlusLine", { stroke: '#770077', desiredSize: new go.Size(15, 15) })
            ),
    
            $("Button", {
                    name: "AddLevel",
                    toolTip: $(go.Adornment, "Auto",
                        $(go.Shape, { fill: "#FFFFCC" }),
                        $(go.TextBlock, { textAlign: 'center', margin: new go.Margin(8, 4, 4, 4) }, // the tooltip shows the result of calling nodeInfo(data)
                            new go.Binding("text", "", function(d) {
                                return "增加同级节点";
                            }))
                    ),
                    alignment: new go.Spot(1, 0.5, 15, 0),
                    width: 30,
                    height: 30,
                    click: function (e) {
                        e.diagram.__trtd.addFollower(e)
                    } // this function is defined below
                },
                $(go.Shape, "PlusLine", { stroke: "#227700", desiredSize: new go.Size(15, 15) }),
                new go.Binding("visible", "level", function(level) {
                    return level != 0; // hidden this button if current node is root node
    
                })
            ),
            // $(go.Panel, "Auto", {        // 放大镜
            //         name: "ButtonIcon1",
            //         alignment: new go.Spot(0, 1, 5, -5),
            //         //alignment: go.Spot.BottomLeft,
            //         //alignmentFocus: go.Spot.BottomLeft,
            //         width: 60,
            //         height: 60,
            //         isActionable: true,
            //         click: expandCollapse // this function is defined below
            //     },
    
            //     $(go.Shape, "Circle", {
            //         fill: "rgba(1,1,1,0)",
            //         strokeWidth: 0,
            //         stroke: "green",
            //         width: 50,
            //         height: 50
            //     }),
            //     $(go.Shape, {
            //             '_para1': true,
            //             name: "ButtonIcon",
            //             fill: "red",
            //             strokeWidth: 2,
            //             stroke: "#767678",
            //             geometryString: icons["zoomout"], // default value for isTreeExpanded is true
            //             desiredSize: new go.Size(30, 30)
            //         },
            //         new go.Binding("geometryString", "", function(d, button) {
            //             // console.log('dddddd:', d);
            //             // console.log('button:', button);
            //             // var myDiagram = d.diagram;
            //             // var node = myDiagram.selection.first();
            //             // if (node["_controlExpand"]) {
            //             //     return icons["zoomout"];
            //             // } else {
            //             //     return icons["zoomin"];
            //             // }
            //             return icons["zoomin"];
            //         })
            //     )
            // )
        );
    } // end Adornment

    // 给子节点添加序号
    orderChildNode(obj) {
        var myDiagram = this.diagram;
        var arr = [];
        var node = myDiagram.selection.first();
        console.log("node", node);
        if (node) {
            myDiagram.startTransaction();
            console.log("node.data", node.data);
            if (node.data.isparent) {
                var first = myDiagram.model.findNodeDataForKey(node.data.isparent);
                arr.push(first);
                pushChildKeyToArr(first, arr, this);

                var re = /^(\d+\、+)|(\d+\.+)/g;
                for (var i = 0; i < arr.length; i++) {
                    if (re.test(arr[i].text)) {
                        myDiagram.model.setDataProperty(arr[i], "text", (arr[i].text).replace(re, (i + 1) + "."));
                    } else {
                        if(arr[i].text == ''){
                            myDiagram.model.setDataProperty(arr[i], "text", (i + 1));                                
                        }else{
                            myDiagram.model.setDataProperty(arr[i], "text", (i + 1) + "." + arr[i].text);
                        }
                    }
                }
            } else {
                console.log("无子节点！");
            }
            myDiagram.commitTransaction();
        };
    }

    clearOrderChildNode(obj) {
        var myDiagram = this.diagram;
        var arr = [];
        var node = myDiagram.selection.first();
        console.log("node", node);
        if (node) {
            myDiagram.startTransaction();
            console.log("node.data", node.data);
            if (node.data.isparent) {
                var first = myDiagram.model.findNodeDataForKey(node.data.isparent);
                arr.push(first);
                pushChildKeyToArr(first, arr, this);

                var re = /^(\d+\、+)|(\d+\.+)/g;
                for (var i = 0; i < arr.length; i++) {
                    if (re.test(arr[i].text)) {
                        myDiagram.model.setDataProperty(arr[i], "text", (arr[i].text).replace(re, ""));
                    }
                }
            } else {
                console.log("无子节点！");
            }
            myDiagram.commitTransaction();
        };
    }
}

//临时扇区转换为正式扇区
function changeTemp2normal(myDiagram) {

    var node = myDiagram.selection.first();
    if (node.data.istemp) {
        myDiagram.model.startTransaction();
        var tmpNode = myDiagram.findNodeForKey(node.data.parent);
        myDiagram.model.setDataProperty(node.data, "istemp", undefined);
        var lastNode = null; //记录这一级扇区
        while (tmpNode) {
            if (tmpNode.data.istemp) {
                myDiagram.model.setDataProperty(tmpNode.data, "istemp", undefined);
                myDiagram.model.setDataProperty(tmpNode.data, "text", "双击编辑内容");
                lastNode = tmpNode;
            } else {
                if (lastNode) {
                    myDiagram.model.setDataProperty(tmpNode.data, "isparent", lastNode.data.key);
                }
                break;
            }
            tmpNode = myDiagram.findNodeForKey(tmpNode.data.parent);
        }
        myDiagram.model.commitTransaction();
        myDiagram.isModified = true;
    }
}




function applyTheme2Node(follower,node) {

    node.diagram.model.setDataProperty(follower, 'strokeWidth', node.diagram.__trtd.tdCurrentTheme.borderWidth);
    node.diagram.model.setDataProperty(follower, 'stroke', node.diagram.__trtd.tdCurrentTheme.borderColor);
    if (node.diagram.__trtd.tdCurrentTheme.colorRange == null) {
        node.diagram.model.setDataProperty(follower, 'fill', randomColor({ luminosity: 'light', count: 1 })[0]);
    } else if (node.diagram.__trtd.tdCurrentTheme.colorRange instanceof Array) {
        var tmpColor = "white";
        if (follower.level >= node.diagram.__trtd.tdCurrentTheme.colorRange.length) {
            tmpColor = node.diagram.__trtd.tdCurrentTheme.colorRange[follower.level % node.diagram.__trtd.tdCurrentTheme.colorRange.length];
        } else {
            tmpColor = node.diagram.__trtd.tdCurrentTheme.colorRange[follower.level];
        }
        node.diagram.model.setDataProperty(follower, 'fill', tmpColor);
    } else if (node.diagram.__trtd.tdCurrentTheme.colorRange == "random") {
        //层级颜色一样的随机色
        if (follower.prev) {
            var preNode = node.diagram.findNodeForKey(follower.prev);
            if (preNode) {
                node.diagram.model.setDataProperty(follower, 'fill', preNode.data.fill);
            } else {
                node.diagram.model.setDataProperty(follower, 'fill', randomColor({ luminosity: 'light', count: 1 })[0]);
            }

        } else {
            node.diagram.model.setDataProperty(follower, 'fill', randomColor({ luminosity: 'light', count: 1 })[0]);
        }
    } else {
        if (node.diagram.__trtd.tdCurrentTheme.colorRange == "white") {
            node.diagram.model.setDataProperty(follower, 'fill', "white");
        } else {
            node.diagram.model.setDataProperty(follower, 'fill', "rgba(0,0,0,0)");
        }

    }
    return follower;
}

//生成地盘的figure形状
function makeAnnularWedge(data, layerThickness) {
    var sweep = data.sweep ? data.sweep : 360;
    var layerThickness = data.layerThickness || 100;
    var radius = data.dradius ? data.dradius : 100;
    var p = new go.Point(radius + layerThickness, 0).rotate(-sweep / 2);
    var q = new go.Point(radius, 0).rotate(sweep / 2);
    var geo = new go.Geometry()
        .add(new go.PathFigure(p.x, p.y)
            .add(new go.PathSegment(go.PathSegment.Arc, -sweep / 2, sweep, 0, 0, radius + layerThickness, radius + layerThickness))
            .add(new go.PathSegment(go.PathSegment.Line, q.x, q.y))
            .add(new go.PathSegment(go.PathSegment.Arc, sweep / 2, -sweep, 0, 0, radius, radius).close()));
    geo.normalize();
    return geo;
}

function getRootNodeData(model,nodeData,level) {
    var parent, root = nodeData;
    if (!level) {
        level = 0;
    }
    while (root.parent) {
        if (root.level == level) {
            break;
        }
        parent = model.findNodeDataForKey(root.parent);
        if (parent) {
            root = parent;
        }
    }
    return root;
}


function getNodeContextMenu() {
   

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
                    menus.startNewSpiral();
                }
            }),
        $("ContextMenuButton",
            $(go.TextBlock, "定位当前节点"), style, {
                click: centerCurrentNode
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


// function cxcommand (obj, val) {
//     var diagram = obj.diagram;
//     var myDiagram = obj.diagram;
//     if (!(diagram.currentTool instanceof go.ContextMenuTool)) return;
//     switch (val) {
//         // case "Paste": diagram.commandHandler.pasteSelection(diagram.lastInput.documentPoint); break;
//         case "addChildNodeMenu":
//         diagram.__trtd.startNewSpiral();
//             break;
//         case "addLevelNodeMenu":
//         diagram.__trtd.addFollower(obj);
//             break;
//         case "deleteNodeMenu":
//             myDiagram.toolManager.textEditingTool.doCancel();
//             myDiagram.commandHandler.deleteSelection();
//             break;
//         case "addNodePictureMenu":
//             // jQuery("#insertimage").modal('show');
//             // document.getElementById('insertimage').modal('show');
//             break; //特殊处理
//         case "removeNodePictureMenu":
//             removeNodePicture(obj);
//             break;
//         case "clearNodeTextMenu":
//             var node = myDiagram.selection.first();
//             if (node) {
//                 myDiagram.startTransaction();
//                 myDiagram.model.setDataProperty(node.data, "text", "");
//                 myDiagram.commitTransaction();
//             };
//             break;
//         case "locateRootNodeMenu":
//             centerNode(obj);
//             break;
//         case "showAllNodesMenu":
//             zoomToFit(obj);
//             break;
//         case "removeOutCycleMenu":
//             removeOutCycle(obj);
//             break;
//         case "centerPictureMenu":
//             centerPicture(obj);
//             break;
//         case "equalWidthHeightPictureMenu":
//             equalWidthHeightPicture(obj);
//             break;
//         case "bringToTopMenu":
//             bringToLayer("Foreground", obj);
//             break;
//         case "bringToBackgroundMenu":
//             bringToLayer("Background", obj);
//             break;
//         case "bringUpMenu":
//             bringToLayer(null, obj);
//             break;
//         case "layoutGroupMenu":
//             autoLayoutAll(true, obj);
//             break;

//         case "insertTextMenu":
//             insertTextNode(obj);
//             break;
//         case "duplicateNode":
//             duplicateNode(obj);
//             break; // 复制节点
//         case "insertTianpanMenu":
//             myDiagram.toolManager.clickCreatingTool.insertPart(myDiagram.lastInput.documentPoint);
//             break;
//         //固定节点
//         case "fixPictureMenu":   
//         case "activePictureMenu":
//             var node = myDiagram.findPartAt(myDiagram.lastInput.documentPoint, false);
//             // var node = myDiagram.selection.first();
//             myDiagram.startTransaction();
//             myDiagram.model.setDataProperty(node.data, "selectable", node.data.selectable != undefined ? (!node.data.selectable) : false);
//             myDiagram.commitTransaction();
//             break;
//         case "orderChildNode":
//             obj.diagram.__trtd.orderChildNode(obj);
//             break;
//         case "clearOrderChildNode":
//             obj.diagram.__trtd.clearOrderChildNode(obj);
//             break;
//         case "delYunpanAxis":
//             yunpan.yunpandel(obj);
//             break;
//         case "addYunpanAxis":
//             var node = myDiagram.selection.first();
//             if(node.data.loc.split(" ")[1] === "0"&&node.data.category!=="x"){
//                 yunpan.addy(obj)
//             }else if(node.data.loc.split(" ")[0] === "0"&&node.data.category!=="y"){
//                 yunpan.addx(obj)
//             }; 
//             break;
//         case "addLevelDipanNode":
//             if(myDiagram.selection.first().data.istemp){
//                 return
//             }
//             obj.addFollowerGround();
//             break;
//         case "addChildDipanNode":
//             var node = myDiagram.selection.first();
//                 if(node.data.parent){
//                     var parentNode = node.diagram.findNodeForKey(node.data.parent);
//                     if(parentNode.data.istemp){
//                         return
//                     }
//                 }
//             obj.addNewCircle(obj);
//             break;
//         case "deleteDipanNode":
//         // myDiagram.commandHandler.deleteSelection();
//         obj.deleteSelection();
//         break;
//     }
//     diagram.currentTool.stopTool();
// }





   /***
     * 判断Node descendant是否是node的后代，如果是返回true, 否则返回false
     * @param descendent go.Node type
     * @param node go.Node Type
     */
    function isDescendant(descendant, node) {
        var diagram = node.diagram,
            cur = descendant;
        //此处若出现bug，请告知，谢谢
        while (cur.data.parent && cur.data.parent != node.data.key) {
            cur = diagram.findNodeForKey(cur.data.parent);
        }

        return (cur.data.parent != null);
    }

    /***
     * disconnect node (including his descendants) from diagram
     * @param node go.Node type
     */
    function disconnectFromTreeStructure(node) {
        if (node.data.parent == null) {
            //if it's root node
            return;
        }
        var diagram = node.diagram,
            model = node.diagram.model;
        if (node.data.prev) {
            //it's not the first child of it's parent
            var preNode = diagram.findNodeForKey(node.data.prev);
            if (node.data.next) {
                var nextNode = diagram.findNodeForKey(node.data.next);
                model.setDataProperty(preNode.data, "next", nextNode.data.key);
                model.setDataProperty(nextNode.data, "prev", preNode.data.key);
                var link = preNode.findLinksTo(node).first();
                model.setToKeyForLinkData(link.data, nextNode.data.key);

                var link = node.findLinksTo(nextNode).first();
                model.removeLinkData(link.data);
            } else {
                model.setDataProperty(preNode.data, "next", null);
                var link = preNode.findLinksTo(node).first();
                model.removeLinkData(link.data);
            }

        } else {
            //it's the first child of it's parent
            var parNode = diagram.findNodeForKey(node.data.parent);
            if (node.data.next) {
                var nextNode = diagram.findNodeForKey(node.data.next);
                model.setDataProperty(parNode.data, "isparent", nextNode.data.key);
                model.setDataProperty(nextNode.data, "prev", null);

                var link = parNode.findLinksTo(node).first();
                model.setToKeyForLinkData(link.data, nextNode.data.key);

                link = node.findLinksTo(nextNode).first();
                model.removeLinkData(link.data);
            } else {
                if (!parNode) {
                    return;
                }
                model.setDataProperty(parNode.data, "isparent", null);
                var link = parNode.findLinksTo(node).first();
                if (link) {
                    model.removeLinkData(link.data);
                }


                //remove group if parent node have children
                var parGroup = parNode.containingGroup;
                if (parGroup) {
                    model.setDataProperty(parNode.data, 'group', parGroup.data.group);
                    model.removeNodeData(parGroup.data);
                }

            }

        }
        model.setDataProperty(node.data, 'parent', null);
        model.setDataProperty(node.data, 'prev', null);
        model.setDataProperty(node.data, 'next', null);
    } //end removing from original tree structure

    function applyTheme2Link(linkToFollower, node) {
        var myDiagram = node.diagram;
        var tdCurrentTheme = myDiagram.__trtd.tdCurrentTheme
        if (tdCurrentTheme.linkColor != null) {
            // linkToFollower.color = tdCurrentTheme.linkColor;
            myDiagram.model.setDataProperty(linkToFollower, 'color', tdCurrentTheme.linkColor);
        }
    
        return linkToFollower;
    }
    
    /***
     * add group for node
     * @param node go.Node
     * @param parentGroupKey
     */
    function addGroupForNode(node, parentGroupKey) {
        if (node.data.group != null || node.data.isparent == null) {
            return;
        }
        var child = diagram.findNodeForKey(node.data.isparent);
        if (!child) {
            return;
        }
        var diagram = node.diagram;
        var model = diagram.model;

        var group = { isGroup: true, parent: node.data.key, key: "g_" + node.data.key, group: parentGroupKey, level: node.data.level };
        model.addNodeData(group);
        model.setDataProperty(node.data, "group", group.key);

        // set group for his child.

        var childGroup = child.containingGroup;
        if (childGroup) {
            model.setDataProperty(childGroup.data, "group", group.key);
        } else {
            model.setDataProperty(child.data, "group", group.key);
        }
        while (child.data.next) {
            child = diagram.findNodeForKey(child.data.next);
            childGroup = child.containingGroup;
            if (childGroup) {
                model.setDataProperty(childGroup.data, "group", group.key);
            } else {
                model.setDataProperty(child.data, "group", group.key);
            }
        }
    }    

    function ControlAutoLayout(e, flag) {
        var myDiagram = e.diagram;
        var diagram = e.diagram;
        var node = diagram.selection.first();
        if (node) {
            var root = getRootNodeData( diagram.model, node.data, 0);
            diagram.startTransaction("ControlAutoLayout");
            helpers.tdTravelTdpData(root, diagram.model, [], function(d) {

                if (diagram.findNodeForKey(d.key).containingGroup && diagram.findNodeForKey(d.key).containingGroup.layout) {
                    diagram.findNodeForKey(d.key).containingGroup.layout.isInitial = flag;
                    diagram.findNodeForKey(d.key).containingGroup.layout.isOngoing = flag;
                }
            })
            if (root.group && diagram.findNodeForKey(root.group)) {
                diagram.findNodeForKey(root.group).layout.isInitial = flag;
                diagram.findNodeForKey(root.group).layout.isOngoing = flag;
            } else {
                diagram.layout.isInitial = flag;
                diagram.layout.isOngoing = flag;
            }
        } else {
            diagram.nodes.each(function(node) {
                if (diagram.findNodeForKey(node.data.key).layout) {
                    diagram.findNodeForKey(node.data.key).layout.isInitial = flag;
                    diagram.findNodeForKey(node.data.key).layout.isOngoing = flag;
                }
            });
            diagram.layout.isInitial = flag;
            diagram.layout.isOngoing = flag;
        }
        diagram.commitTransaction("ControlAutoLayout");
    }    

//设置局部布局
function autoLayoutPart(node) {
    if (!node) return;
    var group = node.containingGroup;
    if (group) {
        group.layout.isInitial = true;
        group.layout.isOngoing = true;
    }
}

function applyTheme2Group(group, node) {
    var tdCurrentTheme = node.diagram.__trtd.tdCurrentTheme
    if (tdCurrentTheme.groupStrokeWidth) {
        node.diagram.model.setDataProperty(group, 'strokeWidth', tdCurrentTheme.groupStrokeWidth);
        // group.strokeWidth = tdCurrentTheme.groupStrokeWidth;
    }
    if (tdCurrentTheme.groupStroke) {
        group.stroke = tdCurrentTheme.groupStroke;
        node.diagram.model.setDataProperty(group, 'stroke', tdCurrentTheme.groupStroke);
    }
    if (tdCurrentTheme.groupColor) {
        group.fill = tdCurrentTheme.groupColor;
        node.diagram.model.setDataProperty(group, 'fill', tdCurrentTheme.groupColor);
    }
    return group;
}

function computeChildLoc(root) {
    if (root.data.isparent) {
        var rootLoc = root.location.copy();
        var rootPoint = new go.Point(0, 0);
        var firstChild = root.diagram.findNodeForKey(root.data.isparent);
        var firstLoc = firstChild.location.copy();
        var relativeFirstLoc = new go.Point(firstLoc.x - rootLoc.x, firstLoc.y - rootLoc.y);

        var relativeMidLoc = relativeFirstLoc.copy().rotate(-90);
        var midLoc = new go.Point(relativeMidLoc.x + rootLoc.x, relativeMidLoc.y + rootLoc.y);
        return midLoc;
    }
    var rootLoc = root.location.copy();
    var offset = computeOffset(root.actualBounds.width + 100, 225);
    rootLoc.offset(offset[0], offset[1]);

    return rootLoc;
}

function computeNextLoc(node, root) {
    /* 计算根据中心节点顺时针旋转一定角度得到的下一个节点位置 */
    var rootLoc = root.location.copy();
    var curLoc = node.location.copy();
    var relativeLoc = new go.Point(curLoc.x - rootLoc.x, curLoc.y - rootLoc.y);
    var rootPoint = new go.Point(0, 0);
    var depth = 20;

    if (node.data.next) { // 如果存在下一个节点，则新节点位于当前节点和下一个节点之间，稍微偏差一点
        var nextNode = node.diagram.findNodeForKey(node.data.next);
        var nextLoc = nextNode.location.copy();
        var relativeNextLoc = new go.Point(nextLoc.x - rootLoc.x, nextLoc.y - rootLoc.y);

        var relativeMidLoc = new go.Point((relativeLoc.x + relativeNextLoc.x) / 2, (relativeLoc.y + relativeNextLoc.y) / 2);
        var angle = rootPoint.directionPoint(relativeMidLoc) - rootPoint.directionPoint(relativeLoc);
        relativeMidLoc = relativeLoc.rotate(angle);
        var offset = computeOffset(depth, rootPoint.directionPoint(relativeMidLoc));
        relativeMidLoc.offset(offset[0], offset[1]);
        var midLoc = new go.Point(relativeMidLoc.x + rootLoc.x, relativeMidLoc.y + rootLoc.y);
        return midLoc;
    }

    //角度由前一个节点和当前节点一致
    if (node.data.prev && node.diagram.findNodeForKey(node.data.prev)) {
        var prevLoc = node.diagram.findNodeForKey(node.data.prev).location.copy();
        var relativeLocPrev = new go.Point(prevLoc.x - rootLoc.x, prevLoc.y - rootLoc.y);
        var angle = rootPoint.directionPoint(relativeLoc) - rootPoint.directionPoint(relativeLocPrev);
        console.log('angle:' + angle);
        if (angle > 45) {
            angle = 45;
        }
    } else {
        var angle = 60;
    }
    var lastLoc = relativeLoc.rotate(angle);
    var offset = computeOffset(depth, rootPoint.directionPoint(lastLoc));
    lastLoc.offset(offset[0], offset[1]);
    lastLoc = new go.Point(lastLoc.x + rootLoc.x, lastLoc.y + rootLoc.y);
    return lastLoc;
}

function computeOffset(newR, newStartAngle) {
    //console.log("newStartAngle:"+newStartAngle);
    var ctl2, dy, dx; //需要调整
    if (newStartAngle >= 0 && newStartAngle <= 90) {
        dy = newR * Math.sin(newStartAngle * Math.PI / 180);
        dx = newR * Math.cos(newStartAngle * Math.PI / 180);
        return [dx, dy];
    } else if (newStartAngle > 90 && newStartAngle <= 180) {
        dy = newR * Math.sin((180 - newStartAngle) * Math.PI / 180);
        dx = newR * Math.cos((180 - newStartAngle) * Math.PI / 180);
        return [-dx, dy];
    } else if (newStartAngle > 180 && newStartAngle <= 270) {
        dy = newR * Math.sin((newStartAngle - 180) * Math.PI / 180);
        dx = newR * Math.cos((newStartAngle - 180) * Math.PI / 180);
        return [-dx, -dy];
    } else if (newStartAngle > 270 && newStartAngle <= 360) {
        dy = newR * Math.sin((360 - newStartAngle) * Math.PI / 180);
        dx = newR * Math.cos((360 - newStartAngle) * Math.PI / 180);
        return [dx, -dy];
    }
}

function pushChildKeyToArr(data, arr, node) {
    var myDiagram = node.diagram;
    if (data.next) {
        var obj = myDiagram.model.findNodeDataForKey(data.next);
        arr.push(obj);
        return pushChildKeyToArr(obj, arr, node);
    } else {
        return arr;
    }
}


Trtd.go = go;

// if (typeof window !== 'undefined') {
// 	if(window.Trtd){
//         window.Trtd.dipan = Trtd;
//     } else{
//         window.Trtd = {
//             dipan: Trtd
//         }
//     }
// }

module.exports = Trtd;
