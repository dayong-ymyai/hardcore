var $ = go.GraphObject.make;

module.exports = // 返回图片天盘的独立节点模板
function createPictureSingleNodeTemplate (diagram) {
    // var $ = go.GraphObject.make;
    var properties = {
        figure: "Circle",
        fill: "white",
        strokeWidth: 1,
        stroke: "#767678",
        fontSize: 15,
        font: "sans-serif"
    };
    return $(go.Node, "Auto", {
        name: "NODE",
        "_controlExpand": true,
        layerName: "Background",
        // layerName: "Foreground",
        zOrder: 20,
        locationSpot: go.Spot.Center,
        resizeCellSize: new go.Size(10, 10),
        locationObjectName: "SHAPE",
        resizable: true,
        resizeObjectName: "SHAPE", // user can resize the Shape
        rotatable: true,
        rotateObjectName: "SHAPE", // rotate the Shape without rotating the label
        doubleClick: function (e, node) {
            // interactions.selectText(e, node)
            console.log(node.data)
            if(node.diagram.__trtd.nodeDoubleClickListener){
                node.diagram.__trtd.nodeDoubleClickListener(node)
            }
            
        },
        click: function(e, node) {
            console.log(node.data)
            if(node.diagram.__trtd.nodeClickListener){
                node.diagram.__trtd.nodeClickListener(node)
            }
            // showNodeToolBar(e,node);
        },
        selectable: true,
        movable: true,
        angle: 0,
        //toMaxLinks: 1,
        layoutConditions: go.Part.LayoutStandard,
        //layoutConditions:~go.Part.LayoutAdded,
        // fromLinkable: true, toLinkable: true,
        alignment: go.Spot.Center,
        alignmentFocus: go.Spot.Center,
        resizeAdornmentTemplate: diagram.__trtd.nodeResizeAdornmentTemplate(),
        //rotateAdornmentTemplate: nodeRotateAdornmentTemplate,
        contextMenu: diagram.__trtd.nodeContextMenu,
        selectionAdornmentTemplate: function() {
            var $ = go.GraphObject.make;
            return $(go.Adornment, "Spot",
                $(go.Panel, "Auto",
                    $(go.Shape, { fill: null, stroke: "blue", strokeWidth: 1 }),
                    $(go.Placeholder) // this represents the selected Node

                ),
                //$("TreeExpanderButton",
                $(go.Panel, "Vertical", {
                        name: "ButtonIcon1",
                        alignment: new go.Spot(0, 1, -20, 20),
                        alignmentFocus: go.Spot.Center,
                        width: 60,
                        height: 60,
                        isActionable: true,
                        // click: interactions.expandCollapse // this function is defined below
                    },

                    $(go.Shape, "Circle", {
                        fill: "rgba(1,1,1,0)",
                        strokeWidth: 0,
                        stroke: "green",
                        width: 50,
                        height: 50
                    })

                )
            ); // end Adornment
        }(),
        contextMenu: function() {
            var $ = go.GraphObject.make;
            return $(go.Adornment, "Vertical",
                $("ContextMenuButton",
                    $(go.TextBlock, "删除"), {
                        click: function(e, obj) {
                            e.diagram.commandHandler.deleteSelection();
                        }
                    }),
                $("ContextMenuButton",
                    $(go.TextBlock, "居中"), {
                        click: function(e, obj) {
                            centerPicture();
                        }
                    }),
                $("ContextMenuButton",
                    $(go.TextBlock, "等宽高"), {
                        click: function(e, obj) {
                            equalWidthHeightPicture();
                        }
                    }),
                $("ContextMenuButton",
                    $(go.TextBlock, "原始比例", { stroke: "gray" }), {
                        click: function(e, obj) {
                            //equalWidthHeightPicture();
                        }
                    }),
                $("ContextMenuButton",
                    $(go.TextBlock, "至于顶层"), {
                        click: function(e, obj) {
                            //bringToBackground();
                            bringToLayer("Foreground");
                        }
                    }),
                $("ContextMenuButton",
                    $(go.TextBlock, "至于底层"), {
                        click: function(e, obj) {
                            bringToLayer("Background");
                        }
                    }),
                $("ContextMenuButton",
                    $(go.TextBlock, "上移一层"), {
                        click: function(e, obj) {
                            bringToLayer(null);
                        }
                    }),
                $("ContextMenuButton",
                    $(go.TextBlock, "固定",
                        new go.Binding("text", "", function(d, obj) {
                            var node = obj.part;
                            return node.data.selectable != undefined ? (node.data.selectable ? "固定" : "取消固定") : "固定";
                        })
                    ), {
                        name: "fixnode",
                        click: function(e, obj) {
                            var diagram = obj.diagram;
                            var node = obj.part;
                            diagram.startTransaction();
                            //node.setProperties({"movable":node.data.movable?(!node.data.movable):true});
                            diagram.model.setDataProperty(node.data, "selectable", node.data.selectable != undefined ? (!node.data.selectable) : false);
                            diagram.commitTransaction();
                        }
                    }
                )
            );
        }()},
        new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
        new go.Binding("isShadowed", "isShadowed").makeTwoWay(),
        new go.Binding("selectable", "selectable").makeTwoWay(),
        new go.Binding("movable", "movable").makeTwoWay(),
        new go.Binding("layerName", "layerName", function(v, d) {
            return v ? v : "";
        }).makeTwoWay(function(v) {
            return v;
        }),
        $(go.TextBlock, // the text label
            new go.Binding("text", "text")),
        $(go.Picture, // the icon showing the logo
            // You should set the desiredSize (or width and height)
            // whenever you know what size the Picture should be.
            { name: "SHAPE" }, {
                successFunction: function(pict, evt) {
                    if ((!pict.width || !pict.height) && (!pict.part.data.width || !pict.part.data.height)) {
                        pict.width = pict.element.width;
                        pict.height = pict.element.height;
                    }
                }
            }, {
                sourceCrossOrigin: function(pict) {
                    return "";
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
            }),
            new go.Binding("angle", "pictureangle").makeTwoWay(),
            new go.Binding("opacity", "opacity", function(v, d) {
                return v ? parseFloat(v) : 1;
            }).makeTwoWay(function(v) {
                return v;
            })
        )
    );
}