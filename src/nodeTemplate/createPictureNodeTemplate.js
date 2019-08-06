// 返回图片天盘节点模板
var $ = go.GraphObject.make;

module.exports = function createPictureNodeTemplate (diagram) {
    // var $ = go.GraphObject.make;

    return $(go.Node, "Auto", {
            "_controlExpand": true,
            layerName: "default",
            locationSpot: go.Spot.Center,
            resizeCellSize: new go.Size(10, 10),
            locationObjectName: "SHAPE",
            resizable: true,
            resizeObjectName: "SHAPE", // user can resize the Shape
            rotatable: false,
            //rotateObjectName: "SHAPE",  // rotate the Shape without rotating the label
            doubleClick: function (e, node) {
                interactions.selectText(e, node)
            },
            //toMaxLinks: 1,
            layoutConditions: go.Part.LayoutStandard,
            //layoutConditions:~go.Part.LayoutAdded,    
            // fromLinkable: true, toLinkable: true,
            alignment: go.Spot.Center,
            alignmentFocus: go.Spot.Center,
            resizeAdornmentTemplate: diagram.__trtd.nodeResizeAdornmentTemplate(),

            contextMenu: diagram.__trtd.getNodeContextMenu(),
            selectionAdornmentTemplate: diagram.__trtd.getNodeSelectionAdornmentTemplate()
        //layoutConditions: go.Part.LayoutStandard & ~go.Part.LayoutNodeSized & ~go.Part.LayoutAdded
        },
        new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
        new go.Binding("isShadowed", "isShadowed").makeTwoWay(),
        $(go.Panel, "Spot",
            $(go.Picture, // the icon showing the logo
                // You should set the desiredSize (or width and height)
                // whenever you know what size the Picture should be.
                { name: "SHAPE" }, {
                    sourceCrossOrigin: function(pict) {
                        return "Anonymous";
                    }
                },
                new go.Binding("source", "picture", function(v){
                    
                    return v+"?"+Date.now()

                }).makeTwoWay(function(v){
                    if(v){
                        v = v.replace(/\?.*$/g,"")
                        return v
                    }else{
                        return ""
                    }
                }),
                new go.Binding("width", "width", function(v, d) {
                    return v;
                }).makeTwoWay(function(v) {
                    return v;
                }),
                new go.Binding("height", "height", function(v, d) {
                    return v;
                }).makeTwoWay(function(v) {
                    return v;
                })
            ),
            $(go.TextBlock, {
                    name: "TEXT",
                    alignment: new go.Spot(0.5, 0.5),
                    font: "bold " + diagram.__trtd.InitialFontSize + "px 幼圆",
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
                        //,width:100
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
                //new go.Binding("width","width",function(v){return v/2 * Math.sqrt(2)+7;}).ofObject("SHAPE"),
                new go.Binding("maxSize", "width", function(v) {
                    var va = v / 2 * Math.sqrt(2);
                    return new go.Size(va, va);
                }).ofObject("SHAPE"),
                // new go.Binding("height","width",function(v){return v/2 * Math.sqrt(2);;}).ofObject("SHAPE"),
                new go.Binding("text", "text").makeTwoWay(),
                new go.Binding("stroke", "textStroke").makeTwoWay(),
                new go.Binding("font", "font").makeTwoWay()
            )
        ), {
            toolTip: $(go.Adornment, "Auto",
                $(go.Shape, { fill: "#FFFFCC" }),
                $(go.TextBlock, { margin: 4 }, // the tooltip shows the result of calling nodeInfo(data)
                    new go.Binding("text", "", function(d) {
                        return d.text;
                    })
                )
            )
        }
    );
}