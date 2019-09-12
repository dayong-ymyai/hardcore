var $ = go.GraphObject.make;
console.info("gggggggggggggggggggggggg")
go.GraphObject.defineBuilder('CircleButton', function (args) {
    // default colors for 'Button' shape
    var buttonFillNormal = '#F5F5F5';
    var buttonStrokeNormal = '#BDBDBD';
    var buttonFillOver = '#E0E0E0';
    var buttonStrokeOver = '#9E9E9E';
    var buttonFillPressed = '#BDBDBD'; // set to null for no button pressed effects
    var buttonStrokePressed = '#9E9E9E';
    var buttonFillDisabled = '#E5E5E5';
  
    // padding inside the ButtonBorder to match sizing from previous versions
    var paddingHorizontal = 2.76142374915397;
    var paddingVertical = 2.761423749153969;
  
    var button = (
      go.GraphObject.make(go.Panel, 'Auto',
        {
          isActionable: true,  // needed so that the ActionTool intercepts mouse events
          enabledChanged: function (btn, enabled) {
            var shape = btn.findObject('ButtonBorder');
            if (shape !== null) {
              shape.fill = enabled ? btn['_buttonFillNormal'] : btn['_buttonFillDisabled'];
            }
          },
          cursor: 'pointer',
          // save these values for the mouseEnter and mouseLeave event handlers
          '_buttonFillNormal': buttonFillNormal,
          '_buttonStrokeNormal': buttonStrokeNormal,
          '_buttonFillOver': buttonFillOver,
          '_buttonStrokeOver': buttonStrokeOver,
          '_buttonFillPressed': buttonFillPressed,
          '_buttonStrokePressed': buttonStrokePressed,
          '_buttonFillDisabled': buttonFillDisabled
        },
        go.GraphObject.make(go.Shape,  // the border
          {
            name: 'ButtonBorder',
            figure: 'Circle',
            spot1: new go.Spot(0, 0, paddingHorizontal, paddingVertical),
            spot2: new go.Spot(1, 1, -paddingHorizontal, -paddingVertical),
            parameter1: 2,
            parameter2: 2,
            fill: buttonFillNormal,
            stroke: buttonStrokeNormal
          }
        )
      )
    );
  
    // There's no GraphObject inside the button shape -- it must be added as part of the button definition.
    // This way the object could be a TextBlock or a Shape or a Picture or arbitrarily complex Panel.
  
    // mouse-over behavior
    button.mouseEnter = function (e, btn, prev) {
      if (!btn.isEnabledObject()) return;
      var shape = btn.findObject('ButtonBorder');  // the border Shape
      if (shape instanceof go.Shape) {
        var brush = btn['_buttonFillOver'];
        btn['_buttonFillNormal'] = shape.fill;
        shape.fill = brush;
        brush = btn['_buttonStrokeOver'];
        btn['_buttonStrokeNormal'] = shape.stroke;
        shape.stroke = brush;
      }
    };
  
    button.mouseLeave = function (e, btn, prev) {
      if (!btn.isEnabledObject()) return;
      var shape = btn.findObject('ButtonBorder');  // the border Shape
      if (shape instanceof go.Shape) {
        shape.fill = btn['_buttonFillNormal'];
        shape.stroke = btn['_buttonStrokeNormal'];
      }
    };
  
    // mousedown/mouseup behavior
    button.actionDown = function (e, btn) {
      if (!btn.isEnabledObject()) return;
      if (btn['_buttonFillPressed'] === null) return;
      if (e.button !== 0) return;
      var shape = btn.findObject('ButtonBorder');  // the border Shape
      if (shape instanceof go.Shape) {
        var diagram = e.diagram;
        var oldskip = diagram.skipsUndoManager;
        diagram.skipsUndoManager = true;
        var brush = btn['_buttonFillPressed'];
        btn['_buttonFillOver'] = shape.fill;
        shape.fill = brush;
        brush = btn['_buttonStrokePressed'];
        btn['_buttonStrokeOver'] = shape.stroke;
        shape.stroke = brush;
        diagram.skipsUndoManager = oldskip;
      }
    };
  
    button.actionUp = function (e, btn) {
      if (!btn.isEnabledObject()) return;
      if (btn['_buttonFillPressed'] === null) return;
      if (e.button !== 0) return;
      var shape = btn.findObject('ButtonBorder');  // the border Shape
      if (shape instanceof go.Shape) {
        var diagram = e.diagram;
        var oldskip = diagram.skipsUndoManager;
        diagram.skipsUndoManager = true;
        if (overButton(e, btn)) {
          shape.fill = btn['_buttonFillOver'];
          shape.stroke = btn['_buttonStrokeOver'];
        } else {
          shape.fill = btn['_buttonFillNormal'];
          shape.stroke = btn['_buttonStrokeNormal'];
        }
        diagram.skipsUndoManager = oldskip;
      }
    };
  
    button.actionCancel = function (e, btn) {
      if (!btn.isEnabledObject()) return;
      if (btn['_buttonFillPressed'] === null) return;
      var shape = btn.findObject('ButtonBorder');  // the border Shape
      if (shape instanceof go.Shape) {
        var diagram = e.diagram;
        var oldskip = diagram.skipsUndoManager;
        diagram.skipsUndoManager = true;
        if (overButton(e, btn)) {
          shape.fill = btn['_buttonFillOver'];
          shape.stroke = btn['_buttonStrokeOver'];
        } else {
          shape.fill = btn['_buttonFillNormal'];
          shape.stroke = btn['_buttonStrokeNormal'];
        }
        diagram.skipsUndoManager = oldskip;
      }
    };
  
    button.actionMove = function (e, btn) {
      if (!btn.isEnabledObject()) return;
      if (btn['_buttonFillPressed'] === null) return;
      var diagram = e.diagram;
      if (diagram.firstInput.button !== 0) return;
      diagram.currentTool.standardMouseOver();
      if (overButton(e, btn)) {
        var shape = btn.findObject('ButtonBorder');
        if (shape instanceof go.Shape) {
          var oldskip = diagram.skipsUndoManager;
          diagram.skipsUndoManager = true;
          var brush = btn['_buttonFillPressed'];
          if (shape.fill !== brush) shape.fill = brush;
          brush = btn['_buttonStrokePressed'];
          if (shape.stroke !== brush) shape.stroke = brush;
          diagram.skipsUndoManager = oldskip;
        }
      }
    };
  
    function overButton(e, btn) {
      var over = e.diagram.findObjectAt(
        e.documentPoint,
        function (x) {
          while (x.panel !== null) {
            if (x.isActionable) return x;
            x = x.panel;
          }
          return x;
        },
        function (x) { return x === btn; }
      );
      return over !== null;
    }
  
    return button;
  });
  
class NodeBase {
    constructor(options){
        var that = this
        this.diagram = options.diagram
        this.nodeProperties = this.getNodeProperties()
        this.binding = this.getBinding()
        // this.nodeTemplate = this.getNodeTemplate()
    }

    getTooTip() {
      var that = this;
      return $(
        "ToolTip",
        { "Border.fill": "whitesmoke", "Border.stroke": "black" },
        new go.Binding("visible", "", function(obj) {
          console.log("ToolTipToolTipToolTip");
          return obj.remark != null;
        }),
        $(
          go.TextBlock,
          {
            maxSize: new go.Size(400, NaN),
  
            font: "24px bold",
            wrap: go.TextBlock.WrapFit,
            margin: 5
          },
  
          new go.Binding("text", "", function(obj) {
           
            return obj.remark || "";
          })
        )
      );
    }

    getNodeProperties(){
        var that = this
        var diagram = this.diagram
        var properties = {
            // type: go.Panel.Auto,
            // "_controlExpand": true,
            // layerName: "default",
            // locationSpot: go.Spot.Center,
            // resizeCellSize: new go.Size(10, 10),
            // // locationObjectName: "SHAPE",
            // resizable: true,
            // // resizeObjectName: "SHAPE", // user can resize the Shape
            // rotatable: false,
            // location: new go.Point(0, 0),
            // click: that.click,
            // //rotateObjectName: "SHAPE",  // rotate the Shape without rotating the label
            // doubleClick: that.doubleClick,
            // toMaxLinks: 1,
            // layoutConditions: go.Part.LayoutStandard,
            // //layoutConditions:~go.Part.LayoutAdded,
            // // fromLinkable: true, toLinkable: true,
            // alignment: go.Spot.Center,
            // alignmentFocus: go.Spot.Center,
            // resizeAdornmentTemplate: diagram.__trtd.nodeResizeAdornmentTemplate(),
            // // contextMenu: $(go.Adornment),
            // contextMenu: $(go.Adornment),
            // selectionAdornmentTemplate: diagram.__trtd.getNodeSelectionAdornmentTemplate(),
            // mouseOver: that.mouseOver,
            // mouseLeave: that.mouseLeave,
            // mouseDragEnter: that.mouseDragEnter,
            // mouseDragLeave: that.mouseDragLeave,
            // mouseDrop: that.mouseDrop
        }
        return properties
    }

    getNodeSelectionAdornmentTemplate(){
      return  $(go.Adornment, "Auto",
          $(go.Shape, "Rectangle",
          // { fill: null, stroke: "#9aa8b6", strokeWidth: 1 }),
          { fill: null, stroke: "dodgerblue", strokeWidth: 3 }),
          $(go.Placeholder)
        )  // end Adornment
    }

    getBinding(){
        return [
            new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
            new go.Binding("movable", "movable").makeTwoWay(),
            new go.Binding("isShadowed", "isShadowed").makeTwoWay(),
            new go.Binding("selectable", "selectable").makeTwoWay(),
            new go.Binding("angle", "angle").makeTwoWay(),
            new go.Binding("copyable", "copyable").makeTwoWay(),
        ]
    }
    getTextBuild(){
        return $(go.TextBlock, {
                name: "TEXT",
                alignment: new go.Spot(0.5, 0.4),
                font: "bold 18px 幼圆",
                editable: true,
                // flip:go.GraphObject.FlipHorizontal,
                //margin: 3, editable: true,
                stroke: "black",
                isMultiline: true,
                overflow: go.TextBlock.OverflowClip,
                wrap: go.TextBlock.WrapDesiredSize,
                textAlign: "center",
                spacingAbove: 4,
                spacingBelow: 4,
                portId: "TEXT",
                stretch: go.GraphObject.Uniform
            },
            new go.Binding("textAlign", "textAlign", function(v) {
                return ['start', 'center', 'end'].indexOf(v)>-1 ? v : "center";
            }).makeTwoWay(),
            new go.Binding("spacingAbove", "spacingline", function(v) {
                return helpers.tdTransToNum(v, 4);
            }).makeTwoWay(),
            new go.Binding("spacingBelow", "spacingline", function(v) {
                return helpers.tdTransToNum(v, 4);
            }).makeTwoWay(),
            new go.Binding("width", "width", function(v) {
                return v-30;
            }).ofObject("main"),
            // new go.Binding("height", "height", function (v) {
            //   return v;
            // }).ofObject("SHAPE"),
            new go.Binding("text", "text").makeTwoWay(),
            new go.Binding("stroke", "textStroke").makeTwoWay(),
            new go.Binding("font", "font").makeTwoWay()
        )
      }
      
    getNodeTemplate(){
        console.log("NodeBase.getNodeTemplate")
        var that = this;
        return $(go.Node, 
            that.nodeProperties,
            that.binding
        );
    }

    click(e, node){
        // console.log(node.data)
        if(node.diagram.__trtd.nodeClickListener){
            node.diagram.__trtd.nodeClickListener(node)
        }
    }

    doubleClick(e, node){
        e.diagram.__trtd.selectText(e, node)
    }

    mouseOver(e, node) {
        // if(node.data.hyperlink){
        //   var textObj = node.findObject('TEXT');
        //   textObj.isUnderline = true;
        // }

        e.diagram.__trtd.showNodeRemarkTips(e, node);

    }

    mouseLeave(e, node) {
        // if(node.data.hyperlink) {
        //   var textObj = node.findObject('TEXT');
        //   textObj.isUnderline = false;
        // }
        e.diagram.__trtd.removeNodeRemarkTips();
    }
    mouseDragEnter(e, obj) {
        var node = obj.part;
        var selnode = e.diagram.selection.first();
        if (!(selnode instanceof go.Node) || selnode.category == "3" || selnode.category == "text" || selnode.key == 1) {
            return;
        }
        //var sat = node.selectionAdornmentTemplate;
        //var adorn = sat.copy();
        //adorn.adornedObject = node;
        //node.addAdornment("dragEnter", adorn);

        //if (!mayWorkFor(selnode, node)) return;
        var shape = node.findObject("SHAPE");
        if (shape) {
            shape._prevFill = shape.fill; // remember the original brush
            shape.fill = "darkred";
        }

    }
    mouseDragLeave(e, obj) {
        var node = obj.part;
        var shape = node.findObject("SHAPE");
        if (shape && shape._prevFill) {
            shape.fill = shape._prevFill; // restore the original brush
        }
        //node.removeAdornment("dragEnter");
    }
    mouseDrop(e, obj) {
        var node = obj.part;
        var selnode = e.diagram.selection.first();
        if (!(selnode instanceof go.Node) || selnode.data.category == "3" || selnode.data.category == "text" || selnode.data.key == 1) {
            return;
        }

        if (node.data.isparent) {
            var child = e.diagram.findNodeForKey(node.data.isparent);
            while (child.data.next) {
                child = e.diagram.findNodeForKey(child.data.next);
            }
            if (child.data.key == selnode.data.key) {
                //最后一个子节点拖放到父节点上时，不做任何操作
                return;
            }
            e.diagram.__trtd.setNodeAsSibling(selnode, child);
        } else {
            e.diagram.__trtd.setNodeAsChildren(selnode, node);
        }
    }
}

module.exports = NodeBase