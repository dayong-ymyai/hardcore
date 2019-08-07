// require('./core/core.controller')(Trtd);
// import * as go from 'gojs';
var helpers = require('../helpers/helpers.gojs')
let lang = require('../assets/localization');
var createPictureSingleNodeTemplate = require('../nodeTemplate/createPictureSingleNodeTemplate')
// var createPictureNodeTemplate = require('../nodeTemplate/createPictureNodeTemplate')
var TRTD_BASE = require('./trtd').Trtd

var $ = go.GraphObject.make;

class Trtd extends TRTD_BASE {
	constructor(div, config){
       
        super(div, config)
		this.config = config;
		this.modelChangedListener = config.modelChangedListener;
		this.type = config.type;
		this.diagram = {};
        this.model = config.model;
        // this.tpid = config.tpid;
        this.readOnly = false;// 控制是否只读
        if(config.readOnly != null){
            this.readOnly = config.readOnly
        }
        this.initDiagramBase(div, config); // 基类初始化diagram
		// 初始化diagram
        this.diagram = this.initDiagram(div, config);
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
        var myDiagram = this.diagram;
        
        var defaultConfig = {
            // initialAutoScale: go.Diagram.Uniform,
            // initialContentAlignment: go.Spot.Center,
            // initialDocumentSpot: go.Spot.Center,
            // initialViewportSpot: go.Spot.Center,
            "undoManager.isEnabled": true,
            // "toolManager.hoverDelay": 100,
            // "toolManager.mouseWheelBehavior": go.ToolManager.WheelZoom,
            // maxScale: 5.0,
            // minScale: 0.05,
            allowMove: true,
            // allowDrop: true,
            // hasVerticalScrollbar: false,
            // hasHorizontalScrollbar: false,
            // "draggingTool.isCopyEnabled": false,
            // BackgroundSingleClicked: function(e) {
            // 	closeToolbarWindow();
            // },
            "animationManager.isEnabled": false,
            // scrollMode: go.Diagram.InfiniteScroll,
            // validCycle: go.Diagram.CycleDestinationTree,
            // scrollMargin: 50,
            // "ModelChanged": function(e){
            //     that.saveModel(e)
            // },
            // "TextEdited": onTextChanged,
        };
        var diagramConfig = Object.assign(defaultConfig, config.diagramConfig);
        this.diagram.setProperties(diagramConfig);
       
        
        this.addNodeTemplate();
        // this.customMenu();
        // this.addDiagramContextMenu();
        // this.addLinkTemplate();
        // this.addGroupTemplate();
        return myDiagram
    }
    getTdData(){
        return this.diagram.model.toJson()
    }
    // 以下两个方法控制菜单显示
    getDefaultCustomMenuDivStr(){
        return `
        <ul>
            <li trtd_action="addFollowerGround"><a class="i18n" data-lang="insertsl">增加同级节点</a></li>
            <li trtd_action="addNewCircle"><a class="i18n" data-lang="icn">增加子节点</a></li>
            <li trtd_action="apiDeleteSelection"><a class="i18n" data-lang="remove">删除</a></li>
        </ul>
        `
    }
    getShowContextMenus(node){
        if(node){
            return "addFollowerGround," + "addNewCircle,"+"apiDeleteSelection";
        }else{
            return "none"
        }
    }

    addTextNode(message){
        console.log('eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee:');
        var myDiagram = this.diagram;
        myDiagram.startTransaction();
        var text = { text: message||lang.trans('blankText'), category: 'text' };
        text.loc = go.Point.stringify(myDiagram.lastInput.documentPoint);
        myDiagram.model.addNodeData(text);
        myDiagram.commitTransaction()
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

        this.diagram.layout.isInitial = false;
        //randomUrl(tmpModel);
        tmpModel.modelData.type = this.type
        // tmpModel.modelData.version = Trtd.version
        this.diagram.model = tmpModel;
        // configModel(myDiagram.model);
        this.groundLayout(this.diagram);
        this.diagram.updateAllTargetBindings();
    }
    loadModel(model){
       
        this.initModel(model)
    }
    /**
     * method: 初始化监听方法
     */
	initListener(){
		console.log('initListener')
    }
    /**
     * 添加节点模板
     */

   
    addNodeTemplate(){

        var that = this;
        var myDiagram = this.diagram
      
        var globalProperties = this.tdGetModelData(null, myDiagram.model,myDiagram); //获取所有全局属性到一个对象中,从localstorage中
        //var layerThickness = myDiagram.model.modelData.layerThickness;
        var layerThickness = parseInt(globalProperties['layerThickness']);
        console.log(layerThickness)
        
        var tdDipanTextAngle = globalProperties['tdDipanTextAngle'];
        console.log(tdDipanTextAngle)
        myDiagram.nodeTemplateMap.add("dipan", this.createDipanTemplate(layerThickness,tdDipanTextAngle));
        myDiagram.nodeTemplateMap.add("Root", this.getDipanRootTemplate(layerThickness));
        myDiagram.nodeTemplateMap.add("3", createPictureSingleNodeTemplate(this.diagram));
        // myDiagram.nodeTemplateMap.add("4", createPictureNodeTemplate(this.diagram));
        // myDiagram.nodeTemplateMap.add("text", this.createTextNodeTemplate());
        
    }

    
    createTextNodeTemplate () {
    var properties = {
        figure: "Rectangle",
        fill: "rgba(0,0,0,0)",
        strokeWidth: 1,
        stroke: "rgba(0,0,0,0)",
        fontSize: 15,
        font: "sans-serif"
    };
    return $(go.Node, "Spot", {
            "_controlExpand": true,
            layerName: "Foreground",
            locationSpot: go.Spot.Center,
            resizeCellSize: new go.Size(10, 10),
            locationObjectName: "SHAPE",
            resizable: true,
            resizeObjectName: "SHAPE", // user can resize the Shape
            rotatable: true,
            location: new go.Point(0, 0),
            //rotateObjectName: "SHAPE",  // rotate the Shape without rotating the label
            // doubleClick: selectText,
            toMaxLinks: 1,
            layoutConditions: go.Part.LayoutStandard,
            //layoutConditions:~go.Part.LayoutAdded,
            // fromLinkable: true, toLinkable: true,
            alignment: go.Spot.Center,
            alignmentFocus: go.Spot.Center,
            contextMenu: this.getNodeContextMenu
            // selectionAdornmentTemplate: nodeSelectionAdornmentTemplate,
        },
        new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
        new go.Binding("isShadowed", "isShadowed").makeTwoWay(),
        new go.Binding("angle", "angle").makeTwoWay(),
        new go.Binding("selectable", "selectable").makeTwoWay(),
        new go.Binding("layerName", "layerName", function(v, d) {
            return v ? v : "";
        }).makeTwoWay(function(v) {
            return v;
        }),
        $(go.Shape, {
                strokeDashArray: null,
                // strokeDashOffset:10,
                name: "SHAPE",
                figure: "Rectangle",
                fill: "rgba(0,0,0,0)",
                fromLinkable: true,
                toLinkable: true,
                cursor: "pointer",
                minSize: new go.Size(50, 50),
                strokeWidth: 2,
                stroke: "rgba(0,0,0,0)",
                portId: "",
                width:150
            },
            new go.Binding("strokeDashArray", "strokeDashArray", function(v) {
                return [v.split()[0], v.split()[1]];
            }).makeTwoWay(function(v) {
                return v[0] + " " + v[1];
            }), //保留，设置边线样式
            new go.Binding("fill", "fill", function(v, obj) {
                return v instanceof go.Brush ? v.color : v;
            }).makeTwoWay(),
            // new go.Binding("fill", "isSelected", function(s, obj) { return s ? "red" : obj.part.data.color; }).ofObject()),
            new go.Binding("width", "width", function(v) {
                //alert(v);
                return v;
            }).makeTwoWay(function(v) {
                return v;
            }),
            new go.Binding("height", "height", function(v) {
                //alert(v);
                return v;
            }).makeTwoWay(function(v) {
                return v;
            }),
            new go.Binding("stroke", "stroke", function(v) {
                return v instanceof go.Brush ? v.stroke : v;
            }).makeTwoWay(),
            new go.Binding("strokeWidth", "strokeWidth", function(d) {
                return d;
            }).makeTwoWay(function(d) {
                return d;
            }),
            new go.Binding("figure", "figure").makeTwoWay(), {
                figure: properties.figure,
                fill: properties.fill,
                strokeWidth: properties.strokeWidth,
                stroke: properties.stroke
            }
        ),
        $(go.Shape, {
                name: "SHAPE_Back",
                figure: "Rectangle",
                fill: "rgba(0,0,0,0)",
                // fromLinkable: true,
                // toLinkable: true,
                strokeWidth: 0
            },
            new go.Binding("width", "width", function(v) {
                return v;
            }).ofObject("SHAPE"),
            new go.Binding("height", "height", function(v) {
                return v;
            }).ofObject("SHAPE")
        ),
        $(go.TextBlock, {
                name: "TEXT",
                alignment: new go.Spot(0.5, 0.5),
                font: "bold " + 22 + "px 幼圆",
                editable: true,
                //margin: 3, editable: true,
                stroke: "black",
                isMultiline: true,
                overflow: go.TextBlock.OverflowClip,
                wrap: go.TextBlock.WrapDesiredSize,
                textAlign: "center",
                spacingAbove: 4,
                spacingBelow: 4,
                portId: "TEXT",
                stretch: go.GraphObject.Fill
            },
            new go.Binding("textAlign", "textAlign", function(v) {
                return _.contains(['start', 'center', 'end'], v) ? v : "center";
            }).makeTwoWay(),
            new go.Binding("spacingAbove", "spacingline", function(v) {
                return helpers.tdTransToNum(v, 4);
            }).makeTwoWay(),
            new go.Binding("spacingBelow", "spacingline", function(v) {
                return helpers.tdTransToNum(v, 4);
            }).makeTwoWay(),
            new go.Binding("width", "width", function(v) {
                return v;
            }).ofObject("SHAPE"),
            // new go.Binding("height", "height", function (v) {
            //   return v;
            // }).ofObject("SHAPE"),
            new go.Binding("text", "text").makeTwoWay(),
            new go.Binding("stroke", "textStroke").makeTwoWay(),
            new go.Binding("font", "font").makeTwoWay()
        )
    );
}

    /**
     * method 地盘模板
     * @param {*} layerThickness 
     * @param {*} tdDipanTextAngle 
     */
    createDipanTemplate (layerThickness, tdDipanTextAngle) {
        console.log(layerThickness)
        if (layerThickness == null) {
            var layerThickness = 100;
        }

        if (tdDipanTextAngle == null) {
            var tdDipanTextAngle = "zhengli";
        }
        var that = this;
        var $ = go.GraphObject.make;
        return $(go.Node, "Spot", {
                locationSpot: go.Spot.Center, // Node.location is the center of the TextBlock
                locationObjectName: "MAIN",
                selectionObjectName: "SHAPE",
                click: function(e, node) {
                    console.log(node.data)
                    if(that.readOnly){
                        if(node.diagram.__trtd.nodeClickListener){
                            node.diagram.__trtd.nodeClickListener(node);
                        }
                    }
                
                },
                contextMenu: this.getNodeContextMenu,
                movable: false,
                doubleClick: function(e){
                    console.log("that.readOnlythat.readOnly",that.readOnly)
                    if(that.readOnly){
                        return;
                    }

                    var myDiagram = e.diagram;
                    var node = myDiagram.selection.first();
                    // if(node.data.istemp) return;
                    if (!node) return;
                    // removeNodeRemarkTips();
                    var tb = myDiagram.selection.first().findObject('TEXT');
                    if (tb) myDiagram.commandHandler.editTextBlock(tb);
                    helpers.simulateEnterWithAlt(e);
                    changeTemp2normal(myDiagram)
                },
                selectionAdorned:!that.readOnly,
                selectionAdornmentTemplate: 
                     $(go.Adornment, "Spot",
                        $(go.Panel, "Auto",
                            $(go.Shape, { fill: 'rgba(255,232,211,0.1)', stroke: "blue", strokeWidth: 2 }),
                            $(go.Placeholder) // this represents the selected Node
                        ),
                        // the button to create a "next" node, at the top-right corner
                        $("Button", {
                                alignment: go.Spot.RightCenter,
                                alignmentFocus: go.Spot.Bottom,
                                width: 30,
                                height: 30,
                
                                click: (e) => {
                                    console.log(e.diagram.selection.first().data)
                                    console.log(e.diagram.selection.first().data.parent)
                                    var node = e.diagram.selection.first();
                                    if(node.data.parent){
                                        var parentNode = node.diagram.findNodeForKey(node.data.parent);
                                        if(parentNode.data.istemp){
                                            return
                                        }
                                    }
                                    that.addNewCircle(e) // this function is defined below
                                } 
                                
                            },
                            $(go.Shape, "PlusLine", { desiredSize: new go.Size(15, 15) })
                        ),
                        // end button
                        $("Button", {
                                alignment: go.Spot.BottomCenter,
                                width: 30,
                                height: 30,
                                //visible:function(d){
                                //    return !isUndefined(d.istemp)&&d.istemp?false:true;
                                //},
                                click: function(e) {
                                    console.log(e)
                                    console.log(e.diagram.selection.first().data)
                                    //判断临时节点
                                    if(e.diagram.selection.first().data.istemp){
                                        return
                                    }
                                    
                                    that.addFollowerGround(e);
                                    } // this function is defined below
                                    
                            },
                            $(go.Shape, "PlusLine", { desiredSize: new go.Size(15, 15) })
                        ) 
                        //备注
                    ),
                mouseOver: function(e, node) {
                },
                mouseLeave: function(e, node) {
                    //removeNodeRemarkTips();
                },
                mouseDragEnter: function(e, node, prev) {
                    return;
                },
                mouseDragLeave: function(e, node, next) {
                    return;
                },
                mouseDrop: function(e, node) {
                    return;
                }
            },
            new go.Binding("angle", "dangle"),
            new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
            new go.Binding("selectionAdorned", "selectionAdorned", function(v, d) {
                console.log(v)
                return v ? v : "";
            }).makeTwoWay(function(v) {
                return v;
            }),
            $(go.Shape, {
                    figure: "Rectangle",
                    name: "MAIN",
                    fill: "rgba(255,255,0,0)", // default value, but also data-bound
                    strokeWidth: 0,
                    stroke: "red",
                    height: 1
                },
                new go.Binding('width', 'layerThickness', function(data) {
                    return parseInt(data || 100);
                })
            ),
            $(go.Shape, {
                    name: "SHAPE",
                    fill: "lightgray", // default value, but also data-bound
                    strokeWidth: 2,
                    margin: 5,
                    stroke: "green",
                    alignment: go.Spot.Right,
                    alignmentFocus: go.Spot.Right,
                    portId: "" // so links will go to the shape, not the whole node
                },
                new go.Binding("geometry", "", function(data) {
                return makeAnnularWedge(data);
                }),
                new go.Binding("fill", "fill", function(v) {
                    return v instanceof go.Brush ? v.color : v;
                }).makeTwoWay(),
                new go.Binding("stroke", "stroke", function(v) {
                    return v instanceof go.Brush ? v.stroke : v;
                }).makeTwoWay(),
                new go.Binding("strokeWidth", "strokeWidth", function(d) {
                    return d;
                }).makeTwoWay(function(d) {
                    return d;
                })
            ),
            $(go.Shape, {
                    figure: "Rectangle",
                    name: "LOCATE",
                    fill: "rgba(0,255,0,0)", // default value, but also data-bound
                    strokeWidth: 0,
                    stroke: "green",
                    height: 20,
                    alignment: go.Spot.Right,
                    alignmentFocus: go.Spot.Right
                },
                new go.Binding('width', 'layerThickness', function(data) {
                    return parseInt(data || 100);
                })
            ),
            $(go.TextBlock, {
                    name: "TEXT",
                    isMultiline: true,
                    click: function(e, node) {
                
                    },
                    textAlign: "center",
                    editable: false,
                    wrap: go.TextBlock.WrapDesiredSize,
                    overflow: go.TextBlock.OverflowClip,
                    spacingAbove: 4,
                    spacingBelow: 4,
                    font: "bold 15px 幼圆"
                },
                new go.Binding("text").makeTwoWay(),
                new go.Binding("textAlign", "textAlign", function(v) {
                    return _.contains(['start', 'center', 'end'], v) ? v : "center";
                }).makeTwoWay(),
                new go.Binding("spacingAbove", "spacingline", function(v) {
                    return helpers.tdTransToNum(v, 4);
                }).makeTwoWay(),
                new go.Binding("spacingBelow", "spacingline", function(v) {
                    return helpers.tdTransToNum(v, 4);
                }).makeTwoWay(),
                new go.Binding("stroke", "textStroke").makeTwoWay(),
                new go.Binding("font", "font").makeTwoWay(),
                new go.Binding("width", "", function(data, obj) {
                    var tdDipanTextAngle = data.tdDipanTextAngle || 'xuanzhuan';
                    var layerThickness = parseInt(data.layerThickness || 100);
                    var maxWidth = data.sweep / 180 * data.dradius * Math.PI * 0.7;
                    if (tdDipanTextAngle == 'fangshe') {
                        return maxWidth;
                    }
                    if (tdDipanTextAngle == 'zhengli') {
                        return layerThickness * 0.7;
                    }
                    if (tdDipanTextAngle == 'xuanzhuan') {
                        return layerThickness * 0.7;
                    }
                }),

                new go.Binding("angle", "textAngle").makeTwoWay(),
                new go.Binding('alignment', 'tdDipanTextAngle', function(data) {
                    var tdDipanTextAngle = data || 'xuanzhuan';
                    var alignment = go.Spot.Center;
                    switch (tdDipanTextAngle) {
                        case 'xuanzhuan':
                            alignment = go.Spot.Center;
                            break;
                        case 'fangshe':
                            alignment = go.Spot.Left;
                            break;
                        case 'zhengli':
                            alignment = go.Spot.Center;
                            break;
                    }
                    return alignment;
                }),
                new go.Binding('alignmentFocus', 'tdDipanTextAngle', function(data) {
                    var tdDipanTextAngle = data || 'xuanzhuan';
                    var alignmentFocus = go.Spot.Center;
                    switch (tdDipanTextAngle) {
                        case 'xuanzhuan':
                            alignmentFocus = go.Spot.Center;
                            break;
                        case 'fangshe':
                            alignmentFocus = go.Spot.Left;
                            break;
                        case 'zhengli':
                            alignmentFocus = go.Spot.Center;
                            break;
                    }
                    return alignmentFocus;
                })
            
            )
        );


 
    }

    getDipanRootTemplate(layerThickness){
        var that = this;
        return $(go.Node, "Auto", {
            locationSpot: go.Spot.Center,
            selectionAdorned: true,
            movable: false,
            
            click: function(e, node) {
                //showNodeToolBar(e, node);
                //showTempToolBar(e, node);
                console.log(node.data)
                if(that.readOnly){
                    if(node.diagram.__trtd.nodeClickListener){
                        node.diagram.__trtd.nodeClickListener(node);
                    }
                }
                
            },
            doubleClick: function(e){
                if(that.readOnly){
                    return;
                }
                var myDiagram = e.diagram;
                var node = myDiagram.selection.first();
                if (!node) return;
                // removeNodeRemarkTips();
                var tb = myDiagram.selection.first().findObject('TEXT');
                if (tb) myDiagram.commandHandler.editTextBlock(tb);
                helpers.simulateEnterWithAlt(e);
            },
         
            mouseOver: function(e, node) {
                //showNodeRemarkTips(e, node);
             
            },
            mouseLeave: function(e, node) {
                //removeNodeRemarkTips();
                //removeNodeToolBar();
            },
            selectionAdorned:!that.readOnly,
            selectionAdornmentTemplate: $(go.Adornment, "Spot",
                        $(go.Panel, "Auto",
                            $(go.Shape, { fill: 'rgba(255,232,211,0.1)', stroke: "blue", strokeWidth: 2 }),
                            $(go.Placeholder) // this represents the selected Node
                        ),
                        // the button to create a "next" node, at the top-right corner
                        $("Button", {
                                alignment: go.Spot.RightCenter,
                                alignmentFocus: go.Spot.Bottom,
                                width: 30,
                                height: 30,
                
                                click: (e) => {
                                    console.log(e.diagram.selection.first().data)
                                    console.log(e.diagram.selection.first().data.parent)
                                    var node = e.diagram.selection.first();
                                    if(node.data.parent){
                                        var parentNode = node.diagram.findNodeForKey(node.data.parent);
                                        if(parentNode.data.istemp){
                                            return
                                        }
                                    }
                                    this.addNewCircle(e) // this function is defined below
                                } 
                                
                            },
                            $(go.Shape, "PlusLine", { desiredSize: new go.Size(15, 15) })
                        ),
                        //备注
                
                    ),
            // contextMenu: $(go.Adornment, "Vertical",
            //     $("ContextMenuButton",
            //         $(go.TextBlock, "更换地盘背景"), {
            //             click: function(e, obj) {
            //                 var backImage = tdDipanBackgroundImages[Math.floor(Math.random() * tdDipanBackgroundImages.length)];
            //                 setSourceOfPicture(backImage, 1); //更换主题时，如果是保留颜色，则刷新背景图片
            //             }
            //         }),
            //     $("ContextMenuButton",
            //         $(go.TextBlock, "移除地盘背景"), {
            //             click: function(e, obj) {
            //                 var backnodeData = null;
            //                 var rootKey = obj.part.data.key;
            //                 myDiagram.model.nodeDataArray.forEach(function(d) {
            //                     if (d.rootKey == rootKey && d.category == '3') {
            //                         backnodeData = d;
            //                         return;
            //                     }
            //                 })
            //                 if (backnodeData) {
            //                     myDiagram.model.startTransaction();
            //                     myDiagram.model.removeNodeData(backnodeData);
            //                     myDiagram.model.commitTransaction();
            //                 }
            //             }
            //         })
            // ),
            
        
            location: new go.Point(0, 0)
        },
        new go.Binding("width", "layerThickness", function(v) {
            return v ? v * 2 : 100 * 2;
        }),
        new go.Binding("height", "layerThickness", function(v) {
            return v ? v * 2 : 100 * 2;
        }),
        $(go.Shape, "Circle", {
                name: "SHAPE",
                fill: "#FFBFBF",
                strokeWidth: 0,
                // width: 100,
                // height: 100,
                spot1: go.Spot.TopLeft,
                spot2: go.Spot.BottomRight
            },
            new go.Binding("fill", "fill", function(v) {
                return v instanceof go.Brush ? v.color : v;
            }).makeTwoWay(),
            new go.Binding("stroke", "stroke", function(v) {
                return v instanceof go.Brush ? v.stroke : v;
            }).makeTwoWay(),
        
            new go.Binding("strokeWidth", "strokeWidth", function(d) {
                return d;
            }).makeTwoWay(function(d) {
                return d;
            })
        ),
        $(go.TextBlock, {
                name: "TEXT",
                font: "bold 23px 幼圆",
                textAlign: "center",
                editable: false,
                spacingAbove: 4,
                isMultiline: true,
                
                spacingBelow: 4
            },
            new go.Binding("textAlign", "textAlign", function(v) {
                return _.contains(['start', 'center', 'end'], v) ? v : "center";
            }).makeTwoWay(),
            new go.Binding("spacingAbove", "spacingline", function(v) {
                return helpers.tdTransToNum(v, 4);
            }).makeTwoWay(),
            new go.Binding("spacingBelow", "spacingline", function(v) {
                return helpers.tdTransToNum(v, 4);
            }).makeTwoWay(),
            new go.Binding("text").makeTwoWay(),
            new go.Binding("stroke", "textStroke").makeTwoWay(),
            new go.Binding("width", "width").makeTwoWay(),
            new go.Binding("font", "font").makeTwoWay(),
            new go.Binding("angle", "textAngle").makeTwoWay()
        )
        );
        }

    tdGetModelData1(name,model,myDiagram1) { //获取盘的model.modelData中的全局属性 
        var defaultVal = {
            currentType: 'dipan',
            currentThemeID: 0,
            layerThickness: 100,
            splitLayer: 1,
            layout: 'inner',
            tdDipanTextAngle: 'xuanzhuan'
        };
        return Object.assign(defaultVal,model.modelData)
    }
    tdGetModelData(name,model) { //获取盘的model.modelData中的全局属性 
        // if(myDiagram1){
        //     myDiagram = myDiagram1
        // }
        var myDiagram = this.diagram
        var  model = myDiagram.model
        var defaultVal = {
            currentType: 'tianpan',
            currentThemeID: 0,
            layerThickness: 100,
            splitLayer: 1,
            layout: 'inner',
            tdDipanTextAngle: 'xuanzhuan'
        };
        console.log("getRootNodeData1111111111111111111111")
        var root = getRootNodeData(model);
        if (typeof(name) != 'undefined' && name != null) { //返回指定的属性值
            if (root) {
                return root[name] || model.modelData[name] || defaultVal[name]
            } else {
                return model.modelData[name] || defaultVal[name];
            }
        }
        //返回所有属性值
        if (root) {
            for (var key in defaultVal) {
                if (root[key]) {
                    defaultVal[key] = root[key];
                } else {
                    if (model.modelData && model.modelData[key]) {
                        defaultVal[key] = model.modelData[key];
                    }
                }
            }
        } else {
            for (var key in defaultVal) {
                if (model.modelData && model.modelData[key]) {
                    defaultVal[key] = model.modelData[key];
                }
            }
        }
        return defaultVal;
    }
    deleteSelection () {
        // console.log("====================deleteSelection 优化")
        var myDiagram = this.diagram;
        var node = myDiagram.selection.first();
        console.log(`删除节点 ${JSON.stringify(node.data)}`)
        console.log(node.data)
        var cmd = myDiagram.commandHandler;
        // if (node instanceof go.Group) {
        //     return;
        // }
        var locateNode = null;
    
        if (!node || node.data.istemp) {
            return;
        }
        if (node.data.key == 1 || node.data.key == 'g_1' || node.data.key == 'Root') {
            //删除根节点触发清空节点
            //clearAllNodesGround();
             
            return;
        }
    
        myDiagram.model.startTransaction('all');
        myDiagram.model.startTransaction('level1');
    
        // myDiagram.model.startTransaction("sub");
        myDiagram.model.setDataProperty(node.data, "istemp", true); //防止节点呗删除访问属性失败
        // console.log(myDiagram.model.nodeDataArray)
        this.deleteNode(node,myDiagram);
        //removeOneNode(node); //zyy
        
        // console.log(myDiagram.model.nodeDataArray)
        // myDiagram.model.commitTransaction("sub");
    
        //统一删除节点
        var maxCircle = this.getMaxCircle(myDiagram);
        //找到所有要删除的节点
        var nodes = [];
        myDiagram.model.nodeDataArray.forEach(function(n) {
            if (n.level > maxCircle) {//zyy 增加n.group!=="g_1"
                nodes.push(n);
            }
        });
        // myDiagram.model.startTransaction("deleteTempNode");
        //删除所有只有临时节点的层级
        myDiagram.model.removeNodeDataCollection(nodes);
        //删除最外圈节点的isparent属性
        myDiagram.model.nodeDataArray.forEach(function(n) {
            if (n.level == maxCircle && n.isparent != null) {
                // delete n.isparent;
                myDiagram.model.setDataProperty(n, 'isparent', null);
            }
        });
        myDiagram.model.removeNodeData(node.data);
        // go.CommandHandler.prototype.deleteSelection.call(cmd);
        myDiagram.model.commitTransaction('level1');
        this.groundLayout(myDiagram);
        //changeTheme(myDiagram.model.modelData.currentThemeID, true);zyy
      
        myDiagram.model.commitTransaction('all');
        var locateNode = null;
        var tempArray = ["next","prev","parent"]
        for(var i=0;i<tempArray.length;i++){
            if(node.data[tempArray[i]]){
                locateNode = myDiagram.findNodeForKey(node.data[tempArray[i]])
                break;
            }
        }
        // if(node.data.category === 'dipan'){
            if (locateNode) {
                // console.log('5612 locateNode................' +  locateNode)
                // console.dir(locateNode)
                //选中单个节点 bug问题：外圈都是临时节点的时候，无法选中 
                myDiagram.select(locateNode);
            } 
            
        // }
    }

    deleteNode(node) {
        console.log('删除节点 deleteNode')
        console.log(node.data.key)
        console.log(node.data)
        var myDiagram  = this.diagram
        var mainNode = null;
            var preNode = node.data.prev ? myDiagram.findNodeForKey(node.data.prev) : null;
            var nextNode = node.data.next ? myDiagram.findNodeForKey(node.data.next) : null;
            var parentNode = node.data.parent ? myDiagram.findNodeForKey(node.data.parent) : null;
    
            // try {
                // 如果有子节点，则删除所有子节点
                if (node.data.isparent) {
                    var firstNode = myDiagram.findNodeForKey(node.data.isparent)
                    var nodes = []
                    helpers.tdTravelTdpData(firstNode.data, myDiagram.model, nodes, function(data){
                        return data
                    })
                    myDiagram.model.removeNodeDataCollection(nodes);
    
                    var maxCircles = this.getMaxCircle(myDiagram)
                }
                // 父节点存在的情况下
                if (parentNode != null) {
                    //当前节点为第一个子节点
                    if (parentNode.data.isparent == node.data.key) {
                        //如果当前节点是最后一个子节点
                        if (nextNode == null) {
                            myDiagram.model.setDataProperty(parentNode.data, "isparent", undefined);
                        } else {
                            myDiagram.model.setDataProperty(parentNode.data, "isparent", nextNode.data.key);
                            myDiagram.model.setDataProperty(nextNode.data, "prev", undefined);
                        }
                    } else {
                        myDiagram.model.setDataProperty(preNode.data, "next", nextNode == null ? null : nextNode.data.key);
                        if (nextNode != null) {
                            myDiagram.model.setDataProperty(nextNode.data, "prev", preNode.data.key);
                        }
                    }
                }
    
                if(myDiagram.model.modelData.currentType == 'dipan'){
                    // 删除的只剩下root节点时对root节点做处理
                    var totalCount = 0;
                    for(var i=0;i<myDiagram.model.nodeDataArray.length;i++){
                        if(!myDiagram.model.nodeDataArray[i].istemp && !myDiagram.model.nodeDataArray[i].isGroup){
                            totalCount++;
                        }
                        if(totalCount>1) break;
                    }
                    if(totalCount <= 1){  
                        console.log("删除的只剩下root节点时对root节点做处理")
                        var dipanRoot = myDiagram.model.findNodeDataForKey(1);
                        delete dipanRoot.group
                    }
                }
            // } catch (ex) {
            //     console.log(ex.message);
            // }
    
        // }
        myDiagram.isModified = true;
    
    
    }

    getMaxCircle() {
        var myDiagram = this.diagram
        var maxCircle = 0;
        let nodeArr = [];
        let nodeLevelArr = [];
        let maxNodeArr = [];
        let arr = [];
        myDiagram.model.nodeDataArray.forEach(function(d) {
            if(!d.istemp&&!d.isGroup){
                nodeArr.push(d)
                if(d.level){
                    nodeLevelArr.push(d.level)
                }
            }else{
                arr.push(d)
            }
        });
        let max = Math.max.apply(null, nodeLevelArr);
        // console.log(max)
        nodeArr.forEach(function(node){
            if(node.level === max){
                maxNodeArr.push(node)
            }
        })
        if(max ===-Infinity&&maxNodeArr.length === 0){
            console.log("11111111111111")
            maxCircle = 0
        }else if(max !== -Infinity&&maxNodeArr.length === 0){
           maxCircle = max -1;
        }else if(maxNodeArr.length > 0){
           maxCircle = max;
        }
        // console.log("maxCircle")
        // console.log(maxCircle)
        return maxCircle
    }

    addNewCircle(e) {
        let myDiagram = this.diagram
        var maxCircles = this.getMaxCircle()
        var node = myDiagram.selection.first();
        console.log(node.data)
        if (!node) return;
        if (node.data.isparent && myDiagram.findNodeForKey(node.data.isparent) && !myDiagram.findNodeForKey(node.data.isparent).visible) {
            return;
        }
        myDiagram.model.startTransaction("addNewCircle");
        if ("istemp" in node.data && node.data.istemp) {
            changeTemp2normal(myDiagram);
            if (node.data.text == "") {
               myDiagram.model.setDataProperty(node.data, "text", lang.trans('dce'));
               //myDiagram.model.setDataProperty(node.data, "text", node.data.key)
            }
        }
    
        var firstnodeData = null;
        if (node.data.isparent) {
            firstnodeData = myDiagram.model.findNodeDataForKey(node.data.isparent);
        }
        if (firstnodeData != null && firstnodeData.istemp) {
            myDiagram.model.setDataProperty(firstnodeData, "istemp", false);
            myDiagram.model.setDataProperty(firstnodeData, "text", lang.trans('dce'));
            //myDiagram.model.setDataProperty(node.data, "text", node.data.key)
        } else {
            var follower = this.addChildNodeData(node);
            if (follower.level > maxCircles) {
                maxCircles = follower.level;
            }
    
            this.groundLayout(myDiagram);
        }
        myDiagram.model.commitTransaction("addNewCircle");
    }
    
     //modify nodeDataArray
     addChildNodeData(node) {
        // 去掉连线和group
        console.log("===================================addChildNodeData:去掉连线和group、主题")
        var isautolayout = window.localStorage.getItem('isautolayout') == null ? true : window.localStorage.getItem('isautolayout') == 'true';
        // var isautoselect =  window.localStorage.getItem('isautoselect') == null?true:window.localStorage.getItem('isautoselect') == 'true';
        var myDiagram = node.diagram;
        var result = arguments[1] ? arguments[1] : null;
        var currentType = 'dipan'
        //myDiagram.startTransaction();
        var nextkey = (myDiagram.model.nodeDataArray.length + 1).toString();
        //var follower = {key: nextkey, text: nextkey};
        var follower = { key: nextkey, text: lang.trans('dce') };
        //if (result != null) {
        myDiagram.model.makeNodeDataKeyUnique(follower);
        nextkey = follower.key;
        var firstNode = null;
        follower.level = node.data.level + 1;
        follower.parent = node.data.key;
        follower.prev = undefined;
    
        //如果已经有子节点
        if (node.data.isparent) {
            firstNode = myDiagram.model.findNodeDataForKey(node.data.isparent)
            if(firstNode){
                follower.next = firstNode.key;
                myDiagram.model.setDataProperty(firstNode, "prev", follower.key);
            }
        }
    
        if (result != null) {
            //只是用来填充的节点
            follower.istemp = true;
            follower.text = "";
        }
    
        var sectotLayerThickNess  = myDiagram.model.modelData.layerThickness
        console.log(" myDiagram.model", myDiagram.model);
        // follower.fill = colorMap[follower.level % 5];
        follower.dangle = node.data.dangle;
        follower.dradius = node.data.dradius;
        follower.sweep = node.data.sweep;
        // zyy follower.loc = node.data.loc;
        follower.layerThickness = sectotLayerThickNess || 100;
        follower.tdDipanTextAngle = node.data.tdDipanTextAngle || 'xuanzhuan';
        if (node.data.level != 0) {
            follower.category = node.data.category;
        }
        if (node.data.category == "Root") {
            follower.category = "dipan";
        }
    
    
        follower.strokeWidth = node.data.strokeWidth;
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
        follower = applyTheme2Node(follower,myDiagram);
        follower.font = node.data.font;
        follower.textStroke = node.findObject("TEXT").stroke;
        myDiagram.model.setDataProperty(node.data, "isparent", nextkey);
        follower.newAdd = true;
        myDiagram.model.addNodeData(follower,myDiagram);
        myDiagram.isModified = true;
        return follower;
    }
    
    addFollowerGround(e) {
        let myDiagram = this.diagram;
        if (myDiagram.selection.count == 0) return;
        var node = myDiagram.selection.first();
        if (node.data.key == 1) {
            return;
        }
        if (!node) return;
        var diagram = node.diagram;
        // var isautolayout = window.localStorage.getItem('isautolayout') == null?true:window.localStorage.getItem('isautolayout') == 'true';
        // var isautoselect =  window.localStorage.getItem('isautoselect') == null?true:window.localStorage.getItem('isautoselect') == 'true';
        if (node === null || !(node instanceof go.Node) || node instanceof go.Group) return;
        // root node is not allowed to add follower
        // if (node.findLinksInto().count == 0) return;
        myDiagram.model.startTransaction('all');
        if ("istemp" in node.data && node.data.istemp) {
            changeTemp2normal(myDiagram);
            if (node.data.text == "") {
                myDiagram.model.setDataProperty(node.data, "text", "");
            }
        }
        // if(!isautolayout){
        //   ControlAutoLayout(false);
        // }else{
        //   ControlAutoLayout(true);
        // }
        //myDiagram.model.startTransaction('addnode');
        myDiagram.startTransaction('sub1');
        var follower = this.addLevelNodeData(node);
        myDiagram.commitTransaction('sub1');
        this.groundLayout(myDiagram);
        //changeTheme(myDiagram.model.modelData.currentThemeID, true);zyy颜色
        myDiagram.model.commitTransaction('all');
        var newnode = diagram.findNodeForData(follower);
        if (newnode) {
            // myDiagram.centerRect(newnode.actualBounds);
            diagram.select(newnode);
        }
    
    
    }
    
    addLevelNodeData(node) {
        console.log("======================去掉天盘")
        var isautolayout = window.localStorage.getItem('isautolayout') == null ? true : window.localStorage.getItem('isautolayout') == 'true';
        // var isautoselect =  window.localStorage.getItem('isautoselect') == null?true:window.localStorage.getItem('isautoselect') == 'true';
        var myDiagram = this.diagram;
        var currentType = 'dipan';
        var toKey = node.data.next;
        //delete the next link
    
        var nextkey = (myDiagram.model.nodeDataArray.length + 1).toString();
        //var follower = {key: nextkey, text: nextkey, color: "yellow"};
    
        var follower = { key: nextkey, text: lang.trans("dce"), color: "yellow" };
        myDiagram.model.makeNodeDataKeyUnique(follower);
        nextkey = follower.key;
        var nextnode = null;
        if(toKey){
            var nextnode = myDiagram.model.findNodeDataForKey(toKey);
        }
        myDiagram.model.startTransaction();
    
        follower = applyTheme2Node(follower, myDiagram);
        //delete the next link
        var deleteLink = null;
    
        //if has next node
        if (nextnode != null) {
            follower.next = nextnode.key;
            myDiagram.model.setDataProperty(nextnode, "prev", follower.key);
        }
        follower.level = node.data.level;
        follower.radius = node.data.radius;
        follower.fill = node.data.fill;
        //follower.fill =go.Brush.randomColor(128, 240);
        follower.dangle = node.data.dangle;
        follower.dradius = node.data.dradius;
        // zyy follower.loc = node.data.loc;
        follower.sweep = node.data.sweep;
        follower.layerThickness = node.data.layerThickness || 100;
        follower.tdDipanTextAngle = node.data.tdDipanTextAngle || 'xuanzhuan';
    
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
        myDiagram.model.setDataProperty(node.data, "next", nextkey);
    
        myDiagram.model.commitTransaction();
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

    // 地盘布局
    groundLayout(myDiagram) {
        // var dipaninteractions = require('./dipan');
        // var addChildNodeData = this.addChildNodeData
        var myDiagram = this.diagram
        var root = myDiagram.findNodeForKey(1);
        var that = this;
        if (!root) {
            return;
        }
        root.location = new go.Point(0, 0);
        var diagram = root.diagram;
        if (diagram === null) return;
        // make this Node the root
        root.data.category = "Root";
        // determine new distances from this new root node
        //    var results = findDistances(somenode);
        //    radialLayout(root);
        var layout = getTdLayout(myDiagram);
        if (layout == 'out') {
            var maxCircles = this.getMaxCircle(myDiagram);
    
            var model = myDiagram.model;
            helpers.tdTravelTdpData(root.data, model, [], function(d) {
                if (d.level < maxCircles && typeof(d.isparent) == 'undefined') {
                    var followerNode = myDiagram.findNodeForKey(d.key);
                    that.addChildNodeData(followerNode, "temp");
                }
            });
            changeLayout();
        } else if (layout == 'inner') {
            radialLayout(root,myDiagram);
            // myDiagram.model.modelData.splitLayer = 1
            // splitLayer = 1
            // splitRadlayout(null, myDiagram.model, splitLayer);
        } else {
            splitLayer = myDiagram.model.modelData.splitLayer ? myDiagram.model.modelData.splitLayer : splitLayer;
            splitRadlayout(null, myDiagram.model, splitLayer);
        }
        // setSourceOfPicture(null, 1); //重新计算背景图片宽高

        function radialLayout(root,myDiagram) {
            root.diagram.startTransaction("radial layout");
            // sort all results into Arrays of Nodes with the same distance
            var nodes = {};
            var maxlayer = 0;
            // var globalProperties = tdGetModelData(null, myDiagram.model); //获取所有全局属性到一个对象中
            // var layerThickness = parseInt(root.data.layerThickness || 100);
            var layerThickness = myDiagram.model.modelData.layerThickness || 100;
            var tdDipanTextAngle = root.data.tdDipanTextAngle || "xuanzhuan";
        
            root.diagram.model.setDataProperty(root.data, "dangle", 0);
            root.diagram.model.setDataProperty(root.data, "sweep", 360);
            root.diagram.model.setDataProperty(root.data, "dradius", 0);
        
        
            myDiagram.nodes.each(function(n) {
                n.data._laid = false;
            });
        
            // now recursively position nodes, starting with the root
            root.location = new go.Point(0, 0);
            maxCircles = that.getMaxCircle(myDiagram);
            radlay1(root, 1, 90, 360, layerThickness, tdDipanTextAngle,myDiagram);
            root.diagram.commitTransaction("radial layout");
        }

        function radlay1(node, layer, angle, sweep, layerThickness, tdDipanTextAngle,myDiagram) {
            // var dipaninteractions = require('./dipan');
            var addChildNodeData = that.addChildNodeData
            try {
                var nodes = getAllChilds(node);
            } catch (e) {
                console.error(e);
            }
            var parentKey = node.data.key;
        
            if (node.data.category >= 3) {
                return;
            }
            // var globalProperties = tdGetModelData(null, myDiagram.model);   //获取所有全局属性到一个对象中
            // var layerThickness = parseInt(globalProperties['layerThickness']);
            // var tdDipanTextAngle = globalProperties['tdDipanTextAngle'];
        
            var found = nodes.length;
            //if (found === 0) return;
            if (found === 0 && node.data.level >= maxCircles) return;
            if (found === 0) {
                var newdata = that.addChildNodeData(node, "temp");
        
                var newnode = myDiagram.findNodeForData(newdata);
                nodes.push(newnode);
                //node.diagram.model.setDataProperty(newdata, "istemp", true);
                found++;
            }
            var rootNode = myDiagram.model.findNodeDataForKey(1);
            var rootRadius = parseInt(rootNode.layerThickness);
            var radius = rootRadius + (layer - 1) * layerThickness;
            var separator = sweep / found;
            var start = angle - sweep / 2 + separator / 2;
            for (var i = 0; i < found; i++) {
                var n = nodes[i];
                var a = start + i * separator;
                var p = new go.Point(radius + layerThickness / 2, 0);
                if (n.data._laid) {
                    radlay1(n, layer + 1, n.data.dangle, n.data.sweep, layerThickness, tdDipanTextAngle,myDiagram);
                    continue;
                }
                p.rotate(a);
                // n.location = p;
                n.diagram.model.setDataProperty(n.data, "loc", go.Point.stringify(p));
                n.data._laid = true;
                n.diagram.model.setDataProperty(n.data, "dangle", a);
                n.diagram.model.setDataProperty(n.data, "sweep", separator);
                n.diagram.model.setDataProperty(n.data, "dradius", radius);
                n.diagram.model.setDataProperty(n.data, "layerThickness", layerThickness);
                
                // make sure text is never upside down
                var label = n.findObject("TEXT");
                if (label !== null) {
                    label.angle = ((a > 90 && a < 270 || a < -90) ? 180 : 0);
                    //n.diagram.model.setDataProperty(n.data, "textAngle", label.angle);
                    if (tdDipanTextAngle == 'xuanzhuan') { //文字方向旋转
                        n.diagram.model.setDataProperty(n.data, "textAngle", label.angle);
                    }
                    if (tdDipanTextAngle == 'fangshe') { //文字方向旋转
                        n.diagram.model.setDataProperty(n.data, "textAngle", 90);
                    }
                    if (tdDipanTextAngle == 'zhengli') { //文字方向正向
                        n.diagram.model.setDataProperty(n.data, "textAngle", -a);
                    }
                    // console.log("text:"+n.data.text+",textangle:"+n.data.textAngle+";nodeAngle="+a  );
                }
                if (n.data.key == "1") {
                    n.diagram.model.setDataProperty(n.data, "textAngle", 0);
                }
                radlay1(n, layer + 1, a, sweep / found, layerThickness, tdDipanTextAngle,myDiagram);
            }
        }

        function getTdLayout(myDiagram) {
            return myDiagram.model.modelData.layout ? myDiagram.model.modelData.layout : 'inner';
        }

        function getAllChilds(parentNode) {
            try {
                if (!parentNode.data.isparent) {
                    return [];
                }
                var nodes = [],
                    tmpDataObj;
                if (!parentNode.data.isparent) return [];
                var firstNode = parentNode.diagram.findNodeForKey(parentNode.data.isparent);
                tmpDataObj = firstNode;
                if (tmpDataObj) {
                    nodes.push(firstNode);
                    while (tmpDataObj.data.next) {
                        tmpDataObj = parentNode.diagram.findNodeForKey(tmpDataObj.data.next);
                        if (!tmpDataObj) break;
                        nodes.push(tmpDataObj);
                    }
                }
                return nodes;
            } catch (e) {
                console.error(e);
            }
        }
        
       // 外圈均分布局
        function splitRadlayout(nodeData, model) {
            if (nodeData == null) {
                nodeData = model.findNodeDataForKey(1);
            }
            var rootNode = model.findNodeDataForKey(1);
            var rootRadius = parseInt(rootNode.layerThickness);
            console.log("rootRadius", rootRadius);
            model.nodeDataArray.forEach(function(d) {
                d._laid = false;
            });
            // var globalProperties = tdGetModelData(null, myDiagram.model); //获取所有全局属性到一个对象中
            // var root = getSubGraphRoot(nodeData, myDiagram);
            // var layerThickness = parseInt(nodeData.layerThickness || 100);
            var layerThickness = myDiagram.model.modelData.layerThickness;

            var tdDipanTextAngle = nodeData.tdDipanTextAngle || "xuanzhuan";
            var maxCircle = arguments[2] ? arguments[2] : getMaxCircle(myDiagram);
            var result = getNumOfLevelChild(nodeData, model, maxCircle);
            var childNum = result.count;
            if (childNum <= 0) return;
            var sweepUnit = 360.0 / childNum;
            //setLevelSectionIndex(nodeData, model);

            var length = model.nodeDataArray.length;

            var collector = [];
            if (nodeData.isparent) {
                var firstChild = model.findNodeDataForKey(nodeData.isparent);
            } else {
                return;
            }

            helpers.tdTravelTdpData(firstChild, model, collector, function(d) {
                return d;
            });
            var tmpArray;

            for (var level = 1; level <= maxCircle; level++) {
                tmpArray = _.filter(collector, function(item) {
                    return (!item.isGroup && item.level == level);
                });
                var angle = 0;
                var start = 0;
                var radius = rootRadius + (level - 1) * layerThickness;
                for (var index = 0; index < tmpArray.length; index++) {
                    var data = tmpArray[index];
                    data._laid = true;
                    if (data.key == "1") {
                        model.setDataProperty(n.data, "textAngle", 0);
                        continue;
                    }
                    result = getNumOfLevelChild(data, model, maxCircle);
                    childNum = result.count;
                    if (childNum < 0) {
                        continue;
                    }
                    if (childNum == 0) {
                        var separator = sweepUnit;
                    } else {
                        var separator = childNum * sweepUnit;
                    }
                    if (index == 0) {
                        start = -90;
                    }

                    angle = start + separator / 2;
                    start += separator;
                    var a = angle;
                    var p = new go.Point(radius + layerThickness / 2, 0);
                    // console.log('layerThickness', layerThickness, 'radius:', radius)
                    p.rotate(a);
                    // n.location = p;
                    model.setDataProperty(data, "loc", go.Point.stringify(p));
                    model.setDataProperty(data, "dangle", a);
                    model.setDataProperty(data, "sweep", separator);
                    model.setDataProperty(data, "dradius", radius);
                    model.setDataProperty(data, "layerThickness", layerThickness);
                    
                    // make sure text is never upside down
                    // var label = myDiagram.findNodeForKey(nodeData.key).findObject("TEXT");
                    //if (label !== null) {
                    //label.angle = ((a > 90 && a < 270 || a < -90) ? 180 : 0);
                    var tmpAngle = ((a > 90 && a < 270 || a < -90) ? 180 : 0);
                    //if(a>80 && a < 100){
                    //    label.angle = -a;
                    //}
                    if (tdDipanTextAngle == 'xuanzhuan') { //文字方向旋转
                        model.setDataProperty(data, "textAngle", tmpAngle);
                    }
                    if (tdDipanTextAngle == 'fangshe') { //文字方向旋转
                        var tmpAngle = (a > 0 && a < 180 || a < -180) ? 180 : 0;
                        model.setDataProperty(data, "textAngle", 90);

                        // label.width = 100;
                    }
                    //}
                    if (tdDipanTextAngle == 'zhengli') { //文字方向正向
                        model.setDataProperty(data, "textAngle", -a);
                    }

                }

            }

            // 指定层均分会调用内圈均分的函数
            console.log()
            if (maxCircle < this.getMaxCircle(myDiagram)) {
                radlay1(myDiagram.findNodeForKey(1), 1, 90, 360, layerThickness, tdDipanTextAngle);
            }
        }
 
        //获取node指定层子节点的个数,isAll是否是所有子孙
        function getNumOfLevelChild(nodeData, model, level, isAll) {
            var result = { count: 0, list: [] },
                flag = false;
            try {
                if (nodeData.key == 1) {
                    model.nodeDataArray.forEach(function(d) {
                        if (isAll) {
                            flag = d.level >= level
                        } else {
                            flag = d.level == level
                        }
                        if (!_.has(d, 'isGroup') && flag) {
                            result.count += 1;
                            result.list.push(d);
                        }
                    })
                } else {
                    //var result = 0;
                    if (nodeData.isparent) {
                        var firstChild = model.findNodeDataForKey(nodeData.isparent);
                    } else {
                        return result;
                    }
                    helpers.tdTravelTdpData(firstChild, model, [], function(d) {
                        if (isAll) {
                            flag = d.level >= level
                        } else {
                            flag = d.level == level
                        }
                        if (!_.has(d, 'isGroup') && flag) {
                            result.count += 1;
                            result.list.push(d);
                        }
                    });
                }
            } catch (e) {


                console.log(e);
                return { count: 0, list: [] };
            }

            return result;
        }

    }

    //快捷键
    dokeyDownFnq (diagram) {
        var myDiagram = this.diagram;
        var e = myDiagram.lastInput;
        var cmd = myDiagram.commandHandler;
        var node = myDiagram.selection.first();

        // if (e.event.altKey) {
        //     if (e.key == "Q") {
        //         autoLayoutAll();
        //         return;
        //     } else if (e.key == "R") {
        //         centerNode();
        //         return;
        //     } else if (e.key == "C") {
        //         centerCurrentNode();
        //         return;
        //     } else if (e.key == "A") {
        //         zoomToFit();
        //         return;
        //     }
        // }
        if (e.event.keyCode >= 65 && e.event.keyCode <= 90 && !e.event.altKey && !e.event.ctrlKey && !e.event.shiftKey) {
            // e.bubbles = true;
            e.bubbles = false;
            this.selectText(e, diagram);
            return true;
        }

        if (e.event.keyCode === 13) { // could also check for e.control or e.shift
            if (node && node.data.category == 'Root' ) {
                this.addFollowerGround();
            } else if(node && node.data.category == 'dipan'){
                this.addFollowerGround();
            }

        } else if (e.event.keyCode === 9) { // could also check for e.control or e.shift
            if (node && node.data.category == 'Root') {

                this.addNewCircle();
            } else if(node && node.data.category == 'dipan'){
                this.addNewCircle();
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
            e.diagram.commandHandler.deleteSelection();
        } else if (e.event.keyCode == 113) { //F2,覆盖地盘默认行为
            this.selectText();
        } else if (e.event.keyCode == 37) { //左
            this.moveWithinNodes('left');
        } else if (e.event.keyCode == 38) { //上
            this.moveWithinNodes('up');
        } else if (e.event.keyCode == 39) { //右
            this.moveWithinNodes('right');
        } else if (e.event.keyCode == 40) { //下
            this.moveWithinNodes('down');
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


function computeEffectiveCollection(parts) {
    var coll = new go.Set(go.Part);
    var node = parts.first();
    if (node) {
        helpers.travelParts(node, function(p) {
            coll.add(p);
        })
    } else {
        coll.addAll(parts);
    }
    var tool = this;

    return go.DraggingTool.prototype.computeEffectiveCollection.call(this, coll);
};

function applyTheme2Node(follower, myDiagram) {
    var tdCurrentTheme = myDiagram.__trtd.tdCurrentTheme
    // follower.strokeWidth = tdCurrentTheme.borderWidth;
    // follower.stroke = tdCurrentTheme.borderColor;
    myDiagram.model.setDataProperty(follower, 'strokeWidth', tdCurrentTheme.borderWidth);
    myDiagram.model.setDataProperty(follower, 'stroke', tdCurrentTheme.borderColor);
    if (tdCurrentTheme.colorRange == null) {
        // follower.fill = randomColor({luminosity: 'light', count: 1})[0];
        myDiagram.model.setDataProperty(follower, 'fill', randomColor({ luminosity: 'light', count: 1 })[0]);
    } else if (tdCurrentTheme.colorRange instanceof Array) {
        var tmpColor = "white";
        if (follower.level >= tdCurrentTheme.colorRange.length) {
            tmpColor = tdCurrentTheme.colorRange[follower.level % tdCurrentTheme.colorRange.length];
        } else {
            tmpColor = tdCurrentTheme.colorRange[follower.level];
        }
        // follower.fill = tmpColor;
        myDiagram.model.setDataProperty(follower, 'fill', tmpColor);
    } else if (tdCurrentTheme.colorRange == "random") {
        //层级颜色一样的随机色
        if (follower.prev) {
            var preNode = myDiagram.findNodeForKey(follower.prev);
            if (preNode) {
                // follower.fill = preNode.data.fill;
                myDiagram.model.setDataProperty(follower, 'fill', preNode.data.fill);
            } else {
                // follower.fill = randomColor({luminosity: 'light', count: 1})[0];
                myDiagram.model.setDataProperty(follower, 'fill', randomColor({ luminosity: 'light', count: 1 })[0]);
            }

        } else {
            // follower.fill = randomColor({luminosity: 'light', count: 1})[0];
            myDiagram.model.setDataProperty(follower, 'fill', randomColor({ luminosity: 'light', count: 1 })[0]);
        }
    } else {
        // follower.fill = "rgba(0,0,0,0)";
        if (tdCurrentTheme.colorRange == "white") {
            myDiagram.model.setDataProperty(follower, 'fill', "white");
        } else {
            myDiagram.model.setDataProperty(follower, 'fill', "rgba(0,0,0,0)");
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

function getRootNodeData(model) {
    var root = null;
    root = model.nodeDataArray.find((o)=>{
        if(!o.isGroup && o.category == "Root" && o.level == 0){
            return true;
        }
    })

    return root;
}





// function cxcommand (obj, val) {
//     var diagram = obj.diagram;
//     var myDiagram = obj.diagram;
//     if (!(diagram.currentTool instanceof go.ContextMenuTool)) return;
//     switch (val) {
//         // case "Paste": diagram.commandHandler.pasteSelection(diagram.lastInput.documentPoint); break;
//         case "addChildNodeMenu":
//             tdAddChildNode(obj);
//             break;
//         case "addLevelNodeMenu":
//             tdAddLevelNode(obj);
//             break;
//         case "changeDipanBgMenu":
//             changeDipanBackgroundImg();
//             break;
//         case "removeDipanBgMenu":
//             removeDipanBackgroundImg(obj);
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
//             //var node = myDiagram.findPartAt(myDiagram.lastInput.documentPoint, false);
//             var node = myDiagram.selection.first();
//             myDiagram.startTransaction();
//             myDiagram.model.setDataProperty(node.data, "selectable", node.data.selectable != undefined ? (!node.data.selectable) : false);
//             myDiagram.commitTransaction();
//             break;
//         case "orderChildNode":
//             orderChildNode(obj);
//             break;
//         case "clearOrderChildNode":
//             clearOrderChildNode(obj);
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


// 清除节点的关系属性，比如父节点索引，子节点索引等
function clearRelProperty(data) {
    data.level = 0;
    delete data.prev;
    delete data.isparent;
    delete data.next;
    delete data.group;
    delete data.parent;
    return data;
}

// 复制单个节点
function duplicateNode(obj) {
    var myDiagram = obj.diagram;
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

// export default Trtd;
module.exports = Trtd;