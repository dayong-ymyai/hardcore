var $ = go.GraphObject.make
var svg = require('../datas/svg.template');

// 返回svg节点
module.exports = function createArcNodeTemplate (diagram) {
    var properties = {
        figure: "Circle",
        fill: "white",
        strokeWidth: 2,
        stroke: "black",
        fontSize: 15,
        font: "sans-serif"
    };
    return $(go.Node, "Spot",{
                name: "NODE",
                zOrder: 10,
                layerName: "default",
                // isLayoutPositioned: false,
                // defaultStretch: go.GraphObject.Horizontal,
                padding: 0,
                "_controlExpand": true,
                // layerName: "Foreground",
                locationSpot: go.Spot.LeftCenter,
                resizeCellSize: new go.Size(1, 1),
                locationObjectName: "SHAPE",
                resizable: true,
                resizeObjectName: "SHAPE", // user can resize the Shape
                rotatable: true,
                mouseDragEnter: function(e, obj) {
                    console.log("mouseDragEnter line")
                },
                mouseDrop: function(e, obj) {
                    var node = obj.part;
                    console.log("mouseDropmouseDropmouseDropmouseDrop line")
                },
                // rotateObjectName: "SHAPE", // rotate the Shape without rotating the label
                click: (e, node)=>{
                    console.log(node.data)
                },
                deletable: false,
                doubleClick: function (e, node) {
                    // doubleClickCreateNodeType(e);
                    if(!node.selectable){
                        var part = e.diagram.findObjectAt(e.documentPoint,
                          // Navigation function
                            function(x) { return x.part; },
                            // Because of the navigation function, x will always be a Part.
                            function(x) { return x.canSelect() && x.data.category=="wave"; }
                        )
                        if(part){
                            e.diagram.select(part)
                            part.doubleClick(e, part)
                        }
                        // var it = parts.iterator;
                        // while (it.next()) {
                        //   console.log("#" + it.key + " is " + it.value);
                        // }
                        
                        console.log("partpart...........",part)
                    }
                },
                selectable: true,
                selectionObjectName:"SHAPE",
                movable: true,
                angle: 0,
                //toMaxLinks: 1,
                layoutConditions: go.Part.LayoutStandard,
                //layoutConditions:~go.Part.LayoutAdded,
                // fromLinkable: true, toLinkable: true,
                alignment: go.Spot.Center,
                alignmentFocus: go.Spot.Center,
                resizeAdornmentTemplate: diagram.__trtd.nodeResizeAdornmentTemplate(),
                // rotateAdornmentTemplate: nodeRotateAdornmentTemplate,
                contextMenu: $(go.Adornment),
                // contextMenu: $(go.Adornment),
            },
            new go.Binding("zOrder", "zOrder").makeTwoWay(),
            new go.Binding("selectable", "selectable").makeTwoWay(),
            new go.Binding("locationSpot", "locationSpot", function(v){
                return go.Spot.parse(v)
            }).makeTwoWay(function(v){
                return go.Spot.stringify(v)
            }),
            new go.Binding("movable", "movable").makeTwoWay(),
            new go.Binding("visible", "visible").makeTwoWay(),
            new go.Binding("deletable", "deletable").makeTwoWay(),
            new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
            new go.Binding("angle", "angle").makeTwoWay(function(v,m,a){
                // console.log("wwwwwwwwwwwwwwwww:",v," m:",m.angle," a:",a)
                return v
                a.startTransaction()
                var group = a.findNodeDataForKey(m.group)
                // a.setDataProperty(group, "angle", v)
                for(var i=0;i<a.nodeDataArray.length-1;i++){
                    if(a.nodeDataArray[i].group == group.key && a.nodeDataArray[i].category!="line"){
                        var nodeData = a.nodeDataArray[i]
                        var lineLoc = go.Point.parse(m.loc)
                        var nodeLoc = go.Point.parse(nodeData.loc)
                        console.log('111111111')
                        // distanceSquaredPoint
                        var cp = lineLoc,_rotatePoint = lineLoc // 旋转中心
                        
                        var relativeLocation = nodeLoc.copy().subtract(lineLoc) // 原来的相对位置
                        var newangle = v;
                        var originalAngle = m.angle||0
                        var ang = newangle - originalAngle;  // 直线旋转的角度
                        // var cp = _rotatePoint; 
                        var angle = (nodeData.angle||0) + ang; // 橄榄旋转的角度
                        var loc = cp.copy().add(relativeLocation);
                        var dir = cp.directionPoint(loc);
                        var newrad = (ang + dir) * (Math.PI / 180);
                        var centerLocationOffset = lineLoc.copy().subtract(nodeLoc);
                        // var locoffset = centerLocationOffset.copy();
                        // locoffset.rotate(ang);
                        var dist = Math.sqrt(cp.distanceSquaredPoint(loc));
                        var offset = new go.Point(0,0).subtract(cp.copy())
                        var cpOrigin = new go.Point(0,0)
                        var nodeOrigin = nodeLoc.copy().offset(offset.x, offset.y)
                        var newNodeOrigin = nodeOrigin.rotate(ang)
                        var newNodeLoc = newNodeOrigin.copy().offset(-offset.x, -offset.y)
                        console.log("newNodeLoc", newNodeLoc)
                        // var location = new go.Point(cp.x + dist * Math.cos(newrad),
                        //     cp.y + dist * Math.sin(newrad)).subtract(locoffset); 
                        a.setDataProperty(nodeData, "loc", go.Point.stringify(newNodeLoc))                                   
                        a.setDataProperty(nodeData, "angle", v)
                    }
                }
                // var group = a.findNodeDataForKey(m.group)
                a.setDataProperty(group, "angle", v)
                a.commitTransaction()
                return v;
            }),

                $(go.Shape, 'LineH', {
                    name: "SHAPE",
                    alignment: go.Spot.Left,alignmentFocus: go.Spot.Left,
                    stretch: go.GraphObject.Horizontal,
                    strokeCap: "round",
                    // geometryString: "M 0,0 a50,50 0 1,1 100,0",
                    // geometryString: "M 0 50 L 100 100 L 100 200",
                    // margin: 10,
                    strokeDashArray: [0, 0],
                    width: 300,
                    height:20,
                    margin:0,
                    fill: "white",
                    strokeWidth: 3, 
                    stroke: "black",
                    minSize: new go.Size(NaN, 10),
                    maxSize: new go.Size(NaN, 20)
                    },
                    // $(go.TextBlock, "alignment: Left", { row: 0, column: 0 }),
                    new go.Binding("fill", "fill").makeTwoWay(function(v){
                        return v;
                    }),
                    new go.Binding("stroke", "stroke").makeTwoWay(function(v){
                        return v;
                    }),
                    new go.Binding("strokeDashArray", "strokeDashArray", function(v){
                        return JSON.parse(v)
                    }).makeTwoWay(function(v){
                        return  JSON.stringify(v);
                    }),
                    new go.Binding("strokeWidth", "strokeWidth").makeTwoWay(function(v){
                        return v;
                    }),
                    // new go.Binding("width", "width").makeTwoWay(),
                    // new go.Binding("height", "height").makeTwoWay(),
                    new go.Binding("desiredSize", "desiredSize", function(v, d) {
                        // console.log("vd m", v, d )
                        if(!v) return d.part.findObject("SHAPE").measuredBounds.size;
                        return go.Size.parse(v)
                    }).makeTwoWay(function(v) {
                        return go.Size.stringify(v)
                    }),

                    // new go.Binding("geometryString", "geometryString", function(v) {
                    //     return v;
                    // }),
                ),
                $(go.Shape, {
                    name: "BeginArrow",
                    visible: false,
                    margin:0,
                    alignment: new go.Spot(0,0.5,10,0),
                     alignmentFocus: go.Spot.Right,
                    geometryString: "M 0,-4 l -8,4 8,4",
                    strokeCap: "round",
                    // geometryString: "M 0 50 L 100 100 L 100 200",
                    fill: "black",
                    width:10,
                    height:15,

                    strokeWidth: 3, 
                    stroke: "black",
                    // minSize: new go.Size(50, 50),
                    },
                    new go.Binding("fill", "stroke",function(v){
                        return v;
                    }),
                    new go.Binding("stroke", "stroke").makeTwoWay(function(v){
                        return v;
                    }),
                    new go.Binding("strokeWidth", "strokeWidth").makeTwoWay(function(v){
                        return v;
                    }),
                    new go.Binding("visible", "showBeginArrow"),
                    // new go.Binding("angle", "angle", function(v) {
                    //     // var va = (v / 2) * Math.sqrt(2);
                    //     // console.log("desiredSize",v)
                    //     return v
                    // }).ofObject("SHAPE"),
                    // new go.Binding("desiredSize", "desiredSize", function(v) {
                    //     // var va = (v / 2) * Math.sqrt(2);
                    //     // console.log("desiredSize",v)
                    //     return v
                    // }).ofObject("BACKGROUND"),
                    // new go.Binding("angle", "angle", function(v) {
                    //     // var va = (v / 2) * Math.sqrt(2);
                    //     // console.log("desiredSize",v)
                    //     return v
                    // }).ofObject("BACKGROUND"),
                    // new go.Binding("geometryString", "geometryStringArrow", function(v) {
                    //     return v;
                    // }),
                ),
                $(go.Shape, {
                    name: "EndArrow",
                    visible: false,
                    margin:0,
                    alignment: new go.Spot(1,0.5,0,0),
                     alignmentFocus: go.Spot.Right,
                    geometryString: "M 0,-4 l 8,4 -8,4",
                    strokeCap: "round",
                    // geometryString: "M 0 50 L 100 100 L 100 200",
                    fill: "black",
                    width:10,
                    height:15,

                    strokeWidth: 3, 
                    stroke: "black",
                    // minSize: new go.Size(50, 50),
                    },
                    new go.Binding("fill", "stroke",function(v){
                        return v;
                    }),
                    new go.Binding("stroke", "stroke").makeTwoWay(function(v){
                        return v;
                    }),
                    new go.Binding("strokeWidth", "strokeWidth").makeTwoWay(function(v){
                        return v;
                    }),
                    new go.Binding("visible", "showEndArrow"),
                    // new go.Binding("angle", "angle", function(v) {
                    //     // var va = (v / 2) * Math.sqrt(2);
                    //     // console.log("desiredSize",v)
                    //     return v
                    // }).ofObject("SHAPE"),
                    // new go.Binding("desiredSize", "desiredSize", function(v) {
                    //     // var va = (v / 2) * Math.sqrt(2);
                    //     // console.log("desiredSize",v)
                    //     return v
                    // }).ofObject("BACKGROUND"),
                    // new go.Binding("angle", "angle", function(v) {
                    //     // var va = (v / 2) * Math.sqrt(2);
                    //     // console.log("desiredSize",v)
                    //     return v
                    // }).ofObject("BACKGROUND"),
                    // new go.Binding("geometryString", "geometryStringArrow", function(v) {
                    //     return v;
                    // }),
                ),
                $(go.Shape, {
                    name: "Arrow",
                    visible: true,
                    margin:0,
                    alignment: new go.Spot(1,0.5,5,0),
                     alignmentFocus: go.Spot.Right,
                    geometryString: "F M 158,-4 l 8,4 -8,4 2,-4 z",
                    strokeCap: "round",
                    // geometryString: "M 0 50 L 100 100 L 100 200",
                    fill: "black",
                    width:20,
                    height:15,

                    strokeWidth: 3, 
                    stroke: "black",
                    // minSize: new go.Size(50, 50),
                    },
                    new go.Binding("fill", "stroke",function(v){
                        return v;
                    }),
                    new go.Binding("stroke", "stroke").makeTwoWay(function(v){
                        return v;
                    }),
                    new go.Binding("strokeWidth", "strokeWidth").makeTwoWay(function(v){
                        return v;
                    }),
                    new go.Binding("visible", "showArrow"),
                    // new go.Binding("angle", "angle", function(v) {
                    //     // var va = (v / 2) * Math.sqrt(2);
                    //     // console.log("desiredSize",v)
                    //     return v
                    // }).ofObject("SHAPE"),
                    // new go.Binding("desiredSize", "desiredSize", function(v) {
                    //     // var va = (v / 2) * Math.sqrt(2);
                    //     // console.log("desiredSize",v)
                    //     return v
                    // }).ofObject("BACKGROUND"),
                    // new go.Binding("angle", "angle", function(v) {
                    //     // var va = (v / 2) * Math.sqrt(2);
                    //     // console.log("desiredSize",v)
                    //     return v
                    // }).ofObject("BACKGROUND"),
                    // new go.Binding("geometryString", "geometryStringArrow", function(v) {
                    //     return v;
                    // }),
                )
    )

}

function doubleClickCreateNodeType(e){
    // console.log('eeeeeeeeeeeeeee:', e);
    var myDiagram = e.diagram;
    myDiagram.startTransaction();
    var text = { text: "双击编辑文本", category: 'text' };
    text.loc = go.Point.stringify(myDiagram.lastInput.documentPoint);
    myDiagram.model.addNodeData(text);
    myDiagram.commitTransaction()
}