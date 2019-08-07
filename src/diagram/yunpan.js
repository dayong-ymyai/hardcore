
var Trtd_tianpan = require('./tianpan')
var $ = go.GraphObject.make;

// var createNodeTemplate = require('../nodeTemplate/createNodeTemplate')
var createPictureSingleNodeTemplate = require('../nodeTemplate/createPictureSingleNodeTemplate')
var createPictureNodeTemplate = require('../nodeTemplate/createPictureNodeTemplate')
var createTextNodeTemplate = require('../nodeTemplate/createTextNodeTemplate')
var createNodeSvgTemplate = require('../nodeTemplate/createNodeSvgTemplate')


class Trtd extends Trtd_tianpan {
    constructor(div, config){
        super(div, config)
        this.initDiagramYun(div, config)
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

    initDiagramYun(div, config){
        // this.diagram.contextMenu = ()=>{
        //     var that = this
        //     return getYunpanNodeContextMenu;
        // },
        var myDiagram = this.diagram;
        var defaultConfig = {
            contextMenu:this.getYunpanNodeContextMenu,
            "animationManager.isEnabled": false,
        }
        this.diagram.commandHandler.doKeyDown = ()=>{
            var that = this
            return yunpanDokeyDownFn(that);
        }
        var diagramConfig = Object.assign(defaultConfig, config.diagramConfig);
        this.diagram.setProperties(diagramConfig);
        this.addNodeTemplate();
        return myDiagram
    }
     /**
     * 添加节点模板
     */
    addNodeTemplate(){

        var that = this;
        var myDiagram = this.diagram
        myDiagram.nodeTemplateMap.add("yunpanx",createNodeTemplatex(that));
        myDiagram.nodeTemplateMap.add("yunpany",createNodeTemplatey(that));
        myDiagram.nodeTemplateMap.add("y",yTemplate(that));
        myDiagram.nodeTemplateMap.add("x",yTemplate(that));
        myDiagram.nodeTemplateMap.add("ytext",tTemplate());
        myDiagram.nodeTemplateMap.add("xtext",tTemplate());
        myDiagram.nodeTemplateMap.add("LogicXor",LogicXor(that));
        myDiagram.nodeTemplateMap.add("addtextTemplate",addtextTemplate());

        
    }
}

// 返回云盘(轴)
function createNodeTemplatex (that) {
    return $(go.Node, "Vertical",
        {
            movable:false,
            //allowMove:false,
            //selectable:false,
            locationSpot: go.Spot.Bottom,
            location: new go.Point(0,0),
            //locationObjectName: "LINE",
            angle: 90,
            click: function(e, node) {
                console.log(node.data)
            
                //  yunpanmune(e, node)
                
            },
            //selectionAdorned:false,//取消选择的默认边框
            selectionAdornmentTemplate: function() {
                var $ = go.GraphObject.make;
              
                    return $(go.Adornment, "Spot",
                        $(go.Panel, "Auto",
                            
                            $(go.Shape, {
                                figure: "Linev", 
                                // fill: 'rgba(255,0,120,0.2)', 
                                fill:"blue",
                                stroke: "blue", 
                                strokeWidth: 2,
                                
                            },
                            ),
                            $(go.Shape,
                            { 
                                // geometry: go.Geometry.parse("m 8,0 l -8,4 8,4 0,-1 -6,-3 6,-3 0,-1 z", false).rotate(90),
                                geometry: go.Geometry.parse("M584.641736 896S299.62889 148.827862 0-128c0 0 413.707108 34.128461 584.641736 212.37111 0 0 163.261205-185.842992 584.641735-212.37111 0 0-486.056523 686.369398-584.641735 1024z", true).rotate(180).scale(0.0117,0.0117),
                                fill: "blue",
                                stroke: "blue",
                                strokeWidth: 0,
                                alignment: new go.Spot(0.5, 0, 0, 0)
                            }
                            ),
                            
                            $(go.Placeholder) // this represents the selected Node

                        ),

                    );
              
                
        
            }(),
        
            //  contextMenu: function(e,node){
            //     var diagram = node.diagram;
            //     console.log("node.data",node)
            //     console.log("node.datanode.datanode.datanode.data")
            //     interactions.nodeContextMenu
            //     //diagram.model.setDataProperty(node.data, "stroke","blue");  
            // },
            contextMenu:getYunpanNodeContextMenu,

            
            mouseEnter:function(e,node){
                var diagram = node.diagram
                //diagram.model.setDataProperty(node.data, "stroke","blue");  
            },
            mouseLeave:function(e,node){
                //console.log(node.data)
                var diagram = e.diagram
                //diagram.model.setDataProperty(node.data, "stroke","#8799c4");
            },
        },
        new go.Binding("angle", "angle").makeTwoWay(),
        new go.Binding("location", "loc",go.Point.parse).makeTwoWay(go.Point.stringify),
        new go.Binding("selectable", "selectable").makeTwoWay(),
        // 箭头  
        $(go.Shape, 
        { 
            // shape: "BackwardV",
            // "m 8,0 l -8,4 8,4 0,-1 -6,-3 6,-3 0,-1 z"
            // figure: "Backward",
            geometry: go.Geometry.parse("M584.641736 896S299.62889 148.827862 0-128c0 0 413.707108 34.128461 584.641736 212.37111 0 0 163.261205-185.842992 584.641735-212.37111 0 0-486.056523 686.369398-584.641735 1024z", true).rotate(180).scale(0.0117,0.0117),
            fill: "rgb(135,153,196)",
            stroke: "#8799c4",
            strokeWidth: 0,
            strokeDashArray: [0, 0],
        },
        new go.Binding("stroke", "stroke").makeTwoWay(),
        new go.Binding("fill", "stroke").makeTwoWay(),
        ),
        // 坐标 
        $(go.Shape,{ 
            name: 'LINE',
            figure: "Linev",
            //geometryString:geometryString,
            //geometry: Y_geometry,
            //fill: "#8799c4",
            stroke: "#8799c4",
            strokeWidth:2,
        
            strokeDashArray: [4, 2],
            // position: new go.Point(0, 0)
            // desiredSize: new go.Size(10, 100)
        },
        //new go.Binding("fill", "fill").makeTwoWay(),
        new go.Binding("stroke", "stroke").makeTwoWay(),
        new go.Binding("strokeDashArray", "strokeDashArray").makeTwoWay(),
        new go.Binding("geometryString", "geometryString").makeTwoWay(),
        new go.Binding("strokeWidth", "strokeWidth").makeTwoWay(),
        // new go.Binding("stroke", "isSelected", function(sel,node) {
        //     console.log("2333")
        //     if (sel) return "red"; else return "stroke";
            
        // }).ofObject("")
        new go.Binding("stroke", "stroke", function(v) {
                return v instanceof go.Brush ? v.stroke : v;
            }).makeTwoWay()
        ),
        
    )

    
}
function createNodeTemplatey (that) {
    return $(go.Node, "Vertical",
        {
            movable:false,
            //allowMove:false,
            //selectable:false,
            locationSpot: go.Spot.Bottom,
            location: new go.Point(0,0),
            //locationObjectName: "LINE",
            // angle: 0,
            click: function(e, node) {
                console.log(node.data)
            
                //  yunpanmune(e, node)
                
            },
            //selectionAdorned:false,//取消选择的默认边框
            selectionAdornmentTemplate: function() {
                var $ = go.GraphObject.make;
              
                    return $(go.Adornment, "Spot",
                        $(go.Panel, "Auto",
                            
                            $(go.Shape, {
                                figure: "Linev", 
                                fill: 'rgba(255,0,120,0.2)', 
                                stroke: "blue", 
                                strokeWidth: 2, 
                            },
                            ),
                            $(go.Shape,
                            { 
                                // geometry: go.Geometry.parse("m 8,0 l -8,4 8,4 0,-1 -6,-3 6,-3 0,-1 z", false).rotate(90),
                                geometry: go.Geometry.parse("M584.641736 896S299.62889 148.827862 0-128c0 0 413.707108 34.128461 584.641736 212.37111 0 0 163.261205-185.842992 584.641735-212.37111 0 0-486.056523 686.369398-584.641735 1024z", true).rotate(180).scale(0.0117,0.0117),
                                fill: "blue",
                                stroke: "blue",
                                strokeWidth: 0,
                                alignment: new go.Spot(0.5, 0, 0, 0)
                            }
                            ),
                            $(go.Placeholder) // this represents the selected Node
                        ),
                    );
            }(),
        
            //  contextMenu: function(e,node){
            //     var diagram = node.diagram;
            //     console.log("node.data",node)
            //     console.log("node.datanode.datanode.datanode.data")
            //     interactions.nodeContextMenu
            //     //diagram.model.setDataProperty(node.data, "stroke","blue");  
            // },
            contextMenu:getYunpanNodeContextMenu,
            mouseEnter:function(e,node){
                var diagram = node.diagram
                //diagram.model.setDataProperty(node.data, "stroke","blue");  
            },
            mouseLeave:function(e,node){
                //console.log(node.data)
                var diagram = e.diagram
                //diagram.model.setDataProperty(node.data, "stroke","#8799c4");
            },
        },
        new go.Binding("location", "loc",go.Point.parse).makeTwoWay(go.Point.stringify),
        new go.Binding("selectable", "selectable").makeTwoWay(),
        // 箭头  
        $(go.Shape, 
        {
            geometry: go.Geometry.parse("M584.641736 896S299.62889 148.827862 0-128c0 0 413.707108 34.128461 584.641736 212.37111 0 0 163.261205-185.842992 584.641735-212.37111 0 0-486.056523 686.369398-584.641735 1024z", true).rotate(180).scale(0.0117,0.0117),
            fill: "rgb(135,153,196)",
            stroke: "#8799c4",
            strokeWidth: 0,
            strokeDashArray: [0, 0],
        },
        new go.Binding("stroke", "stroke").makeTwoWay(),
        new go.Binding("fill", "stroke").makeTwoWay(),
        ),
        // 坐标 
        $(go.Shape,{ 
            name: 'LINE',
            figure: "Linev",
            stroke: "#8799c4",
            strokeWidth:2,
            strokeDashArray: [4, 2],
        },
        new go.Binding("stroke", "stroke").makeTwoWay(),
        new go.Binding("strokeDashArray", "strokeDashArray").makeTwoWay(),
        new go.Binding("geometryString", "geometryString").makeTwoWay(),
        new go.Binding("strokeWidth", "strokeWidth").makeTwoWay(),
        new go.Binding("stroke", "stroke", function(v) {
                return v instanceof go.Brush ? v.stroke : v;
            }).makeTwoWay()
        ),
        
    )

    
}




// 返回云盘(xy坐标轴)
function yTemplate(that){
    var $ = go.GraphObject.make;
    return $(go.Node, "Vertical",
    {
        movable:false,
        locationSpot: go.Spot.Bottom,
        location: new go.Point(0,0),
        //locationObjectName: "LINE",
        angle: 0,
        //selectionAdorned:false,//取消选择的默认边框
        //desiredSize: new go.Size(400, 800),
        click: function(e, node) {
            console.log(node.data) 
        },
        //点击
        selectionAdornmentTemplate: function() {
            var $ = go.GraphObject.make;
                return $(go.Adornment, "Spot",
                    $(go.Panel, "Auto",
                        $(go.Shape, {
                            figure: "Linev", 
                            // fill: 'rgba(255,0,120,0.2)', 
                            fill: "blue",
                            stroke: "blue", 
                            strokeWidth: 2,
                        },
                        ),
                        $(go.Shape,
                        { 
                            geometry: go.Geometry.parse("M584.641736 896S299.62889 148.827862 0-128c0 0 413.707108 34.128461 584.641736 212.37111 0 0 163.261205-185.842992 584.641735-212.37111 0 0-486.056523 686.369398-584.641735 1024z", true).rotate(180).scale(0.0117,0.0117),
                            // fill: 'rgba(255,0,120,0.2)', 
                            fill: "blue",
                            stroke: "blue",
                            strokeWidth: 2,
                            alignment: new go.Spot(0.5, 0, 0, 0)
                        }
                        ),
                        
                        $(go.Placeholder) // this represents the selected Node

                    ),

                );
        }(),
        // contextClick:function(e, node) {
        //     addaxis(e, node)
        // },
        mouseHover:function(e,node){   
            // that.showNodeRemarkTips(e, node);
        },
        mouseEnter:function(e,node){
            var diagram = node.diagram
            diagram.model.setDataProperty(node.data, "stroke","blue");
            diagram.model.setDataProperty(node.data, "fill","blue")   
  
        },
        mouseLeave:function(e,node){
            //console.log(node.data)
            var diagram = node.diagram
         
                that.removeNodeRemarkTips(); 
            
                diagram.model.setDataProperty(node.data, "stroke","#8799c4");
                diagram.model.setDataProperty(node.data, "fill","#8799c4");
            //removeNodeRemarkTips()   
        }, 
    },
    new go.Binding("angle", "angle").makeTwoWay(),
    new go.Binding("location", "loc",go.Point.parse).makeTwoWay(go.Point.stringify),
    // 箭头  
    $(go.Shape, 
    { 
        // shape: "BackwardV",
        // "m 8,0 l -8,4 8,4 0,-1 -6,-3 6,-3 0,-1 z"
        //figure: "BackwardV",
        geometry: go.Geometry.parse("M584.641736 896S299.62889 148.827862 0-128c0 0 413.707108 34.128461 584.641736 212.37111 0 0 163.261205-185.842992 584.641735-212.37111 0 0-486.056523 686.369398-584.641735 1024z", true).rotate(180).scale(0.0117,0.0117),
        fill: "#8799c4",
        stroke: "#8799c4",
        // strokeWidth: 0,
        // strokeDashArray: [0, 0],
        // position: new go.Point(-6, -1)
    },
    new go.Binding("fill", "fill").makeTwoWay(),
    new go.Binding("stroke", "stroke").makeTwoWay(),
    new go.Binding("strokeWidth", "strokeWidth").makeTwoWay(),
    ),
    // 坐标 
    $(go.Shape,{ 
        name: 'LINE',
        //geometry: Y_geometry,
        width:0,
        height:1000,
        fill: "#8799c4",
        stroke: "#8799c4",
        strokeWidth: 2,
       
        //strokeDashArray: [4, 2],
        // position: new go.Point(0, 0)
        // desiredSize: new go.Size(10, 100)
    },
    new go.Binding("height", "height").makeTwoWay(),
    new go.Binding("fill", "fill").makeTwoWay(),
    new go.Binding("stroke", "stroke").makeTwoWay(),
    new go.Binding("strokeDashArray", "strokeDashArray").makeTwoWay(),
    new go.Binding("strokeWidth", "strokeWidth").makeTwoWay(),
    ),
    
   
    )
}


//返回云盘文本
function tTemplate(){
    var $ = go.GraphObject.make;
    return $(go.Node, "Vertical",
    {
        movable:false,
        //locationSpot:locationSpot,
        //locationSpot: go.Spot.Right,
        selectionAdorned:false,//取消选择的默认边框
        click: function(e, node) {
            // showNodeToolBar(e,node);
            console.log(node.data)
        },
       
    },
    //("locationSpot", "locationSpot",node.data.group > 0 ? "go.Spot.Right":"go.Spot.Top").makeTwoWay(),
    //new go.Binding("locationSpot", "locationSpot",function(v,node)),
    new go.Binding("location", "loc",go.Point.parse).makeTwoWay(go.Point.stringify),
    new go.Binding("locationSpot", "dir", function(d) { return spotConverter(d, false); }),
    $(go.Panel, "Vertical",
    //{ width: 100, defaultStretch: go.GraphObject.None },
    $(go.TextBlock, {
            name: "TEXT",
            alignment: new go.Spot(0, 1),
            // font: "bold 14px arial,",
            font: "14px 微软雅黑",
            width:70,
            // height:40,
            //maxLines:7,
            // spacingAbove: 4,
            // spacingBelow: 4,
            // editable :false,//禁止编辑
            wrap: go.TextBlock.WrapDesiredSize,
            // margin:5,
            textAlign: "center",
            // verticalAlignment :"left",
            editable: true,
            isMultiline: false,//单行
            // margin: 10, 
            margin: 0, 
            stroke: "black",
            isMultiline: true,
            //overflow: go.TextBlock.OverflowClip,
            //wrap: go.TextBlock.WrapDesiredSize,
            alignment: go.Spot.Right,
            portId: "TEXT",
            stretch: go.GraphObject.Fill,
            //background:"green"
            // DoubleClick : false
            
        },
        new go.Binding("text", "text").makeTwoWay(),
        new go.Binding("stroke", "textStroke").makeTwoWay(),
        new go.Binding("font", "font").makeTwoWay(),
        new go.Binding("margin", "margin").makeTwoWay()
        )
    )
    )}
 

function spotConverter(dir, from) {
    if (dir === "right") {
    return  go.Spot.Right;
    } else if(dir === "top") {
    return (go.Spot.Top);
    }
}

//返回云盘增加文本
function addtextTemplate() {
    var $ = go.GraphObject.make;
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
            toMaxLinks: 1,
            click: function(e, node) {
                console.log(node.data)
                // showNodeToolBar(e,node);
            },
            layoutConditions: go.Part.LayoutStandard,
            alignment: go.Spot.Center,
            alignmentFocus: go.Spot.Center
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
                portId: ""
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
                font: "bold " + 18 + "px 幼圆",
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
                return tdTransToNum(v, 4);
            }).makeTwoWay(),
            new go.Binding("spacingBelow", "spacingline", function(v) {
                return tdTransToNum(v, 4);
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



//提示框
  var shapeShowblur = null;
  var circleStroke = null;

  function showToolTip(obj, diagram) {
    var box = document.getElementById("infoBoxHolder");
    var contextMenu= document.getElementsByClassName("context-menu")[0];
    //  console.log(contextMenu)  
    
    if (obj !== null) {
      var node = obj.part;
      var e = diagram.lastInput;
      var circle = node.findObject("CIRCLE");
      var shape= node.findObject("SHAPE"); 
    //   console.log(circle)
    if(circle !== null) circle.stroke = "#57617a";
    if(shape !== null)  shape.shadowBlur = 10;

    if (shapeShowblur !== null && shapeShowblur !== shape) {
        
        shapeShowblur.shadowBlur = 0;
        shapeShowblur = shape;
  
        if(box&&(contextMenu.style.display === ""||contextMenu.style.display === "none")){
            box.style.display = "block";
        }
    } else{
        
        shapeShowblur = shape;
    }

      
      
      if (circleStroke !== null && circleStroke !== circle) 
      circleStroke.stroke = null;
      circleStroke = circle;
        if(box&&(contextMenu.style.display === ""||contextMenu.style.display === "none")){
            box.style.display = "block";
        }
    } else {
      if (circleStroke !== null) 
      circleStroke.stroke = null;
      circleStroke = null;
    //   document.getElementById("infoBox").innerHTML = "";
     
      
    }

    
  }
    

  





// myDiagram.nodeTemplate =
// $(go.Node,
//   $(go.Shape, "Circle",
//     {
//       desiredSize: new go.Size(28, 28),
//       fill: radBrush, strokeWidth: 0, stroke: null
//     }), // no outline
//   {
//     locationSpot: go.Spot.Center,
//     click: showArrowInfo,  // defined below
//     toolTip:  // define a tooltip for each link that displays its information
//         $("ToolTip",
//           $(go.TextBlock, { margin: 4 },
//             new go.Binding("text", "", infoString).ofObject())
//         )
//   }
// );

//返回云盘图标
function LogicXor(that){
    var $ = go.GraphObject.make;
    return $(go.Node, "Vertical",
        {
            movable:false,
            locationSpot: go.Spot.Top,
            location: new go.Point(860,5),
            mouseHover:function(e,node){
                that.showNodeRemarkTips(e, node);
            },
            mouseLeave:function(e,node){
                that.removeNodeRemarkTips();    
            },
            click:function(e,node){
             
                console.log(node.data)
                console.log(Number(node.data.loc.split(' ')[1])>0)
                if(Number(node.data.loc.split(' ')[1])>0){
                    addy(e)
                }else{
                    addx(e)
                }
            }
        },     
        new go.Binding("location", "loc",go.Point.parse).makeTwoWay(go.Point.stringify),
        $(go.Shape, {
            figure: "LogicXor", 
            stroke: "#8799c4", 
            width:30,
            strokeWidth: 2,
            
        },
        )

    )
}

function yunpanDokeyDownFn (that) {
    // console.log('myDiagram:', diagram);
    // var myDiagram = diagram.diagram;
    // var e = myDiagram.lastInput;
    // var cmd = myDiagram.commandHandler;
    // var node = myDiagram.selection.first();
    var diagram = that.diagram
    // var that = this;
    var myDiagram = that.diagram;
    var e = myDiagram.lastInput;
    var node = myDiagram.selection.first();
    var cmd = myDiagram.commandHandler;
    if (e.key === "Del"|| e.event.keyCode === 8) { 
        // console.log(myDiagram.model.nodeDataArray)
        console.log("0",myDiagram.model.nodeDataArray)
        del(e)    
    }

    if(e.event.ctrlKey){
        //增加y轴
        if (e.event.keyCode === 89) {
            if((node&&node.data.category!== "addtextTemplate")||(!node)){
                addy(e);
            }
        }
        //增加x轴
        if (e.event.keyCode === 88) {
            
            if((node&&node.data.category!== "addtextTemplate")||(!node)){
                addx(e);
            }
        }
        e.bubbles = false; 
        }

    }


function getYunpanNodeContextMenu() {

    return $(go.Adornment, "Vertical",
        $("ContextMenuButton",
            $(go.TextBlock, "删除 DEl"), {
                click: function(e,node) {
                    del(e);
                }
            }),
        $("ContextMenuButton",
            $(go.TextBlock, "增加 CTRL+X/Y"), {
                click: function(e, node) {
                    if(node.data.loc.split(" ")[1] === "0"&&node.data.category!=="x"){
                        addy(e)
                    }else if(node.data.loc.split(" ")[0] === "0"&&node.data.category!=="y"){
                        addx(e)
                    }; 
                }
            })
        
    );
}
//云盘增加y轴节点
function addy(e){
    let myDiagram = e.diagram;
    let node = myDiagram.selection.first();
    let nodeDataArray = myDiagram.model.nodeDataArray;
    console.log(nodeDataArray)
    let yl = 0;
    let stroke ="#8799c4";
    let strokeDashArray=[4, 2];
    let loc = 0;
    let locy = '';
    let height = 260 ;
    nodeDataArray.forEach(function(data){
        
        if(data.category === "y"){
            yl = data.height - 10  
        }
        
        if(data.category==="x"){
        //console.log(data)
        height = data.height +200
        myDiagram.model.startTransaction("addheight");
        myDiagram.model.setDataProperty(data, "height",height);
        myDiagram.model.commitTransaction("addheight");
        }
        if(data.category === 'LogicXor'){
            let locL = +data.loc.split(' ')[0]
            if(locL>0){
                let loclc = (locL + 200) + " 5" 
                myDiagram.model.startTransaction();
                myDiagram.model.setDataProperty(data, "loc",loclc);
                myDiagram.model.commitTransaction();
            }
            
        }
    })
    nodeDataArray.forEach(function(data){
        if(data.loc.split(' ')[0] === '0'&&data.category!== "addtextTemplate"){
            let l = height - 10;
            let geometryStringx = "M 0 0 L 0 "+ l;
            myDiagram.model.startTransaction("changel");
            myDiagram.model.setDataProperty(data, "geometryString",geometryStringx);
            myDiagram.model.commitTransaction("changel");
        }
    })
    let geometryString= "M 0 0 L 0 "+yl
    
    if(node && (node.data.category === 'y'||node.data.loc.split(' ')[0] !== '0')&&node.data.category !== 'x'&&node.data.category !== 'LogicXor'&&node.data.category!== "addtextTemplate"){
        //if()
        console.log(node.data)
        loc = +node.data.loc.split(' ')[0] + 200;
        locy = loc + " 0"

        //移动位置
        nodeDataArray.forEach(function(data){
            console.log(loc)
            if(data.category !== 'LogicXor'&&data.category!== "addtextTemplate"){
                let loco = +data.loc.split(' ')[0]
                if(loco >= loc){
                    loco = loco+200;
                    var locy = loco + " 0"
                    myDiagram.model.startTransaction("changeloc");
                    myDiagram.model.setDataProperty(data, "loc",locy);
                    myDiagram.model.commitTransaction("changeloc");
                }
            }
            
    })
        
    }else {
        let arr =[]
        nodeDataArray.forEach(function(data){
            if(data.loc.split(' ')[0] !== '0'&&data.category !== 'LogicXor'&&data.category!== "addtextTemplate"){
                arr.push(+data.loc.split(' ')[0])
            }
        })
        if(arr.length === 0){
            // geometryString = "M 0 0 L 0 200";
            locy = "200 0"
        }else{
            var max= Math.max.apply(null,arr)+200 ;
            locy = max + " 0" 
        }
    }
    
    

    let newy = {key:guid(),category: "yunpany",stroke:stroke,geometryString:geometryString,strokeDashArray:strokeDashArray,loc: locy };
    let newytext = {key:guid(),category: "xtext",margin:10,"textStroke":"#666666",text:"维度"+locy.split(' ')[0]/200,loc: locy,dir: "top" };
    myDiagram.model.startTransaction("addy");
    myDiagram.model.addNodeData(newy);
    myDiagram.model.addNodeData(newytext);
    myDiagram.model.commitTransaction("addy");

        
}

//云盘增加x轴节点
function addx(e){
    let myDiagram = e.diagram;
    let node = myDiagram.selection.first();
    let nodeDataArray = myDiagram.model.nodeDataArray;
    let xl = 0;
    let stroke ="#8799c4";
    let strokeDashArray=[4, 2];
    let loc = 0;
    let locy = '';
    let height = 260 ;
    nodeDataArray.forEach(function(data){
        
        if(data.category === "x"){
            xl = data.height - 10  
        }
        if(data.category==="y"){
        //console.log(data)
        height = data.height +200
        myDiagram.model.startTransaction("addheight");
        myDiagram.model.setDataProperty(data, "height",height);
        myDiagram.model.commitTransaction("addheight");
        }
        if(data.category === 'LogicXor'){
            let locL = +data.loc.split(' ')[1]
            if(locL < 0){
                let loclc ="-20 "+(locL - 200)
                myDiagram.model.startTransaction();
                myDiagram.model.setDataProperty(data, "loc",loclc);
                myDiagram.model.commitTransaction();
            }
            
        }
    })
    nodeDataArray.forEach(function(data){
        if(data.loc.split(' ')[1] === '0'&&data.category!== "addtextTemplate"){
            let l = height - 10;
            let geometryStringx = "M 0 0 L 0 "+ l;
            myDiagram.model.startTransaction("changel");
            myDiagram.model.setDataProperty(data, "geometryString",geometryStringx);
            myDiagram.model.commitTransaction("changel");
        }
    })
    let geometryString= "M 0 0 L 0 "+xl
    
    if(node && (node.data.category === 'x'||node.data.loc.split(' ')[1] !== '0')&&node.data.category !== 'y'&&node.data.category !== 'LogicXor'&&node.data.category!== "addtextTemplate"){
        //if()
        console.log(node.data)
        loc = +node.data.loc.split(' ')[1] - 200;
        locy = "0 "+loc;

        //移动位置
        nodeDataArray.forEach(function(data){
            console.log(loc)
            if(data.category !== 'LogicXor'&&data.category!== "addtextTemplate"){
                let loco = +data.loc.split(' ')[1]
                if(loco <= loc){
                    loco = loco-200;
                    var locy = "0 "+loco
                    myDiagram.model.startTransaction("changeloc");
                    myDiagram.model.setDataProperty(data, "loc",locy);
                    myDiagram.model.commitTransaction("changeloc");
                }
            }else{

            }
            
    })
        
    }else {
        let arr =[]
        nodeDataArray.forEach(function(data){
            if(data.loc.split(' ')[1] !== '0'&&data.category !== 'LogicXor'&&data.category!== "addtextTemplate"){
                arr.push(+data.loc.split(' ')[1])
            }
        })
        if(arr.length === 0){
            // geometryString = "M 0 0 L 0 200";
            locy = "0 -200"
        }else{
            var min= Math.min.apply(null,arr)-200 ;
            locy = "0 "+min; 
        }
    }
    

    let newx = {key:guid(),category: "yunpanx",stroke:stroke,geometryString:geometryString,strokeDashArray:strokeDashArray,loc: locy };
    let newxtext = {key:guid(),category: "ytext",text:"维度"+Math.abs(+locy.split(' ')[1]/200),"textStroke":"#666666",loc: locy,dir: "right" };
    myDiagram.model.startTransaction("addx");
    myDiagram.model.addNodeData(newx);
    myDiagram.model.addNodeData(newxtext);
    myDiagram.model.commitTransaction("addx");


}


//云盘删除节点
function del(e){
    let myDiagram = e.diagram;
    let node = myDiagram.selection.first();
    console.log("1",myDiagram.model.nodeDataArray)
    //text和轴
    if (node) {
        console.log("11111111111111111111111")
        //非xy的坐标轴
        console.log(node.data)
        //判断点击y子轴
        if(node.data.category === "yunpany"){
           
            let loc = node.data.loc
            let locx = +node.data.loc.split(' ')[0]
            console.log(locx)
            myDiagram.model.nodeDataArray.forEach(function(data){

                //如果不加判断，点击轴删除，只会删除轴，不会删除坐标
                // debugger
                // if(data.category==="yunpany"&&data.loc === loc){
                //     myDiagram.model.startTransaction("deletAxis");
                //     //删除轴
                //     myDiagram.model.removeNodeData(node.data);
                //     myDiagram.model.removeNodeData(data);
                //     myDiagram.model.commitTransaction("deletAxis");
                // }else
                 if(data.category==="xtext"&&data.loc === loc){
                    console.log("data",data)
                    myDiagram.model.startTransaction("delettext");
                    //删除轴
                    myDiagram.model.removeNodeData(node.data);
                    //删除text
                    myDiagram.model.removeNodeData(data);
                    
                    myDiagram.model.commitTransaction("delettext");
                }
        
            })
            //改变其他轴长度及坐标
            console.log("2",myDiagram.model.nodeDataArray)
            changelen(locx,myDiagram)
            
        //x
        }else if(node.data.category === "yunpanx"){
            console.log("x")
            let loc = node.data.loc
            let locx = +node.data.loc.split(' ')[1]
            myDiagram.model.nodeDataArray.forEach(function(data){
                // if(data.category==="ytext"&&data.loc === loc){
                //     myDiagram.model.startTransaction("delettext");
                //     myDiagram.model.removeNodeData(data);
                //     myDiagram.model.removeNodeData(node.data);
                //     myDiagram.model.commitTransaction("delettext");
                // }else 
                if(data.category==="ytext"&&data.loc === loc){
                    myDiagram.model.startTransaction("delettext");
                    myDiagram.model.removeNodeData(data);
                    myDiagram.model.removeNodeData(node.data);
                    myDiagram.model.commitTransaction("delettext");
                }
                
            
            })
            
            changelenx(locx,myDiagram)
            
        }else if(node.data.category!=="ytext"&&node.data.category!=="xtext"&&node.data.category!=="LogicXor"&&node.data.category!=="x"&&node.data.category!=="y" ){
            myDiagram.model.startTransaction();
            myDiagram.model.removeNodeData(node.data);
            myDiagram.model.commitTransaction();
        }      
        
    }

}

//改变x轴长度

function changelen(locx,myDiagram){
    console.log("3",myDiagram.model.nodeDataArray)
    myDiagram.model.nodeDataArray.forEach(function(data){
                                
        //Math.abs(key)
        let datalocx = +data.loc.split(' ')[0]
        console.log(data.loc)
        console.log(datalocx)
        //改变位置
        if(datalocx > locx){
            if(data.category==="yunpany"||data.category==="xtext"){
                let l = datalocx-200
                let loc = l+" 0"
                console.log(loc)
                myDiagram.model.startTransaction("changea");
                myDiagram.model.setDataProperty(data, "loc",loc);
                myDiagram.model.commitTransaction("changea");
            }
            
        }
        //改变长度
     
            console.log(data)
            if(data.category==="x"){
                let height = data.height -200
                myDiagram.model.startTransaction("cheight");
                myDiagram.model.setDataProperty(data, "height",height);
                myDiagram.model.commitTransaction("cheight");
            }else if(data.category==="yunpanx"){
                let gs = NaN
                let l = (data.geometryString||"").split(' ')
                console.log(l)
                if(l[5]){
                    gs = +l[5] - 200;
                }else{
                    gs = +l[3] - 200;
                }
                console.log(gs)
                let gs2 = gs + "";
                let gs3 = "M 0 0  L 0 "+gs2;
                myDiagram.model.startTransaction("changea");
                myDiagram.model.setDataProperty(data, "geometryString",gs3);
                myDiagram.model.commitTransaction("changea");
            }
        
        if(data.category === 'LogicXor'){
            let locL = +data.loc.split(' ')[0]
            if(locL > 0){
                let loclc =(locL - 200) +" 5"
                myDiagram.model.startTransaction();
                myDiagram.model.setDataProperty(data, "loc",loclc);
                myDiagram.model.commitTransaction();
            }
        }
    })
}

function changelenx(locx,myDiagram){
    console.log(myDiagram.model.nodeDataArray)
    myDiagram.model.nodeDataArray.forEach(function(data){

    let datalocx = +data.loc.split(' ')[1]
    // console.log(data.loc)
    // console.log(datalocx)
    //改变位置
    if(datalocx < locx){
        if(data.category==="yunpanx"||data.category==="ytext"){
            let l = datalocx+200
            let loc = "0 "+l
            console.log("节点",data)
            console.log("改变位置",loc)
            myDiagram.model.startTransaction("changea");
            myDiagram.model.setDataProperty(data, "loc",loc);
            myDiagram.model.commitTransaction("changea");
        }
        
        
    }
    //改变长度
    if(data.category==="y"){
        let height = data.height -200
        console.log("节点",data)
        console.log("改变坐标轴长度没有angle",height)
        myDiagram.model.startTransaction("cheight");
        myDiagram.model.setDataProperty(data, "height",height);
        myDiagram.model.commitTransaction("cheight");
    }else if(data.category==="yunpany"){
        let gs = NaN
        let l = (data.geometryString||"").split(' ')
        if(l[5]){
            gs = +l[5] - 200;
        }else{
            gs = +l[3] - 200;
        }
        // console.log(gs)
        let gs2 = gs + "";
        let gs3 = "M 0 0  L 0 "+gs2;
        console.log("节点",data)
        console.log("改变y轴长度没有angle",gs3)
        myDiagram.model.startTransaction("changea");
        myDiagram.model.setDataProperty(data, "geometryString",gs3);
        myDiagram.model.commitTransaction("changea");
    }   

    if(data.category === 'LogicXor'){
            let locL = +data.loc.split(' ')[1]
            if(locL < 0){
                let loclc ="-20 "+(locL + 200) 
                myDiagram.model.startTransaction();
                myDiagram.model.setDataProperty(data, "loc",loclc);
                myDiagram.model.commitTransaction();
            }
        }
    })
}
function guid() {
    function S4() {
        return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    }
return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}

// export default Trtd;
module.exports = Trtd;