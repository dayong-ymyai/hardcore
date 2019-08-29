var $ = go.GraphObject.make;
var Base = require("./base");
var helpers = require("../helpers/helpers.gojs");

class PicGroupNodeTemplate extends Base {
  constructor(options) {
    super(options);
    // this.nodeProperties = {}
    var offsetBig = {
      cbianText1: "490.19843547330686 -207.92899577343746",
      cbianText2: "179.32782881269065 -477.3356656420584",
      cbianText3: "373.5304832720494 -373.95951083813827",
      axisXText: "530 8",
      axisYText: "-15 -517"
    };
    var offsetSmall = {
      cbianText1: "131.233937586588 -72",
      cbianText2: "46.592920782221995 -128.5569669100272",
      cbianText3: "99.53048327204942 -103.06601717798208",
      axisXText: "147 3",
      axisYText: "-3 -147"
    };
    this.cbianThemes = [
      {
        name: "cbian1",
        type: "small",
        textStrokes: ["#0e399d", "#cb1c27", "#FFC000"],
        picture: "https://static.365trtd.com/system/cbian/cbian.png",
        offsets: offsetSmall,
        size: [150, 150],
        pictureBig: "https://static.365trtd.com/system/cbian/cbian1_big.png",
        offsetsBig: offsetBig,
        sizeBig: [500, 500]
      },
      {
        name: "cbian_red",
        type: "small",
        textStrokes: ["red", "red", "red"],
        picture: "https://static.365trtd.com/system/cbian/cbian_red.png",
        offsets: offsetSmall,
        size: [150, 150],
        pictureBig: "https://static.365trtd.com/system/cbian/cbian_big_red.png",
        offsetsBig: offsetBig,
        sizeBig: [500, 500]
      },
      {
        name: "cbian_blue",
        type: "small",
        textStrokes: ["blue", "blue", "blue"],
        picture: "https://static.365trtd.com/system/cbian/cbian_blue.png",
        offsets: offsetSmall,
        size: [150, 150],
        pictureBig:
          "https://static.365trtd.com/system/cbian/cbian_big_blue.png",
        offsetsBig: offsetBig,
        sizeBig: [500, 500]
      },
      {
        name: "cbian_green",
        type: "small",
        textStrokes: ["green", "green", "green"],
        picture: "https://static.365trtd.com/system/cbian/cbian_green.png",
        offsets: offsetSmall,
        size: [150, 150],
        pictureBig:
          "https://static.365trtd.com/system/cbian/cbian_big_green.png",
        offsetsBig: offsetBig,
        sizeBig: [500, 500]
      }
      // {
      //   name: "cbian1_big",
      //   type: "big",
      //   textStrokes: ["#0e399d", "#cb1c27", "#FFC000"],
      //   picture: "https://static.365trtd.com/system/cbian/cbian1_big.png",
      //   offsets: offsetBig,
      //   size:[500,500]
      // }
    ];
  }

  changeCbianSize(node, cbianType) {
    if (!node) return;
    if (!cbianType) return;
    var cbianThemes = this.cbianThemes;
    var cbianName = node.data.cbianName || "cbian1";
    // var smallThemes = cbianThemes.filter((o)=>o.type == "small")
    // var bigThemes = cbianThemes.filter((o)=>o.type == "big")
    // var cbianName = node.data.cbianName || "cbian1";
    var index = null,
      theme = null;
    for (var i = 0, len = cbianThemes.length; i < len; i++) {
      if (cbianThemes[i].name == cbianName) {
        index = i;
        theme = cbianThemes[i];
        break;
      }
    }
    // var curTheme = cbianThemes[index];
    // if(curTheme.type == "small"){

    // }
    if (index == null) {
      return;
    }
    // var nextIndex = (index + 1) % cbianThemes.length;
    var baseNode, cbianText1, cbianText2, cbianText3, axisXText, axisYText, pic;
    if (theme) {
      // var theme = cbianThemes[nextIndex];
      var it = node.findSubGraphParts().iterator;
      while (it.next()) {
        var n = it.value;
        if (n.data.role == "theme") {
          baseNode = n;
        }
        if (n.data.role == "cbianText1") {
          cbianText1 = n;
        }
        if (n.data.role == "cbianText2") {
          cbianText2 = n;
        }
        if (n.data.role == "cbianText3") {
          cbianText3 = n;
        }
        if (n.data.role == "axisXText") {
          axisXText = n;
        }
        if (n.data.role == "axisYText") {
          axisYText = n;
        }
        if (n.data.category == "pic") {
          pic = n;
        }
      }
    }
    var diagram = node.diagram;
    if (!baseNode) {
      return;
    }
    var propertyPicture = "picture";
    var propertySize = "size";
    var propertyoffset = "offsets";
    // var propertyPicture = "picture"
    if (cbianType == "big") {
      propertyPicture = "pictureBig";
      propertySize = "sizeBig";
      propertyoffset = "offsetsBig";
    }
    diagram.model.startTransaction();

    diagram.model.setDataProperty(pic.data, "picture", theme[propertyPicture]);
    diagram.model.setDataProperty(pic.data, "width", theme[propertySize][0]);
    diagram.model.setDataProperty(pic.data, "height", theme[propertySize][1]);
    diagram.model.setDataProperty(node.data, "cbianType", cbianType);
    diagram.model.setDataProperty(node.data, "cbianName", cbianName);
    window.localStorage.setItem("cbianName", JSON.stringify(theme));

    var nodeNameList = [
      "cbianText1",
      "cbianText2",
      "cbianText3",
      "axisXText",
      "axisYText"
    ];
    for (var i = 0; i < nodeNameList.length; i++) {
      var nodeName = nodeNameList[i];
      var tmpPoint, tmpNode;
      tmpNode = eval(nodeName);
      tmpPoint = theme[propertyoffset][nodeName];
      if (cbianText1 && tmpPoint) {
        tmpPoint = go.Point.parse(tmpPoint);
        diagram.model.setDataProperty(
          tmpNode.data,
          "loc",
          go.Point.stringify(
            baseNode.location.copy().offset(tmpPoint.x, tmpPoint.y)
          )
        );
      }
    }
    diagram.model.commitTransaction();
  }

  changeCbianName(node, cbianName) {
    if (!node) return;
    if (!cbianName) return;
    var cbianThemes = this.cbianThemes;

    // var smallThemes = cbianThemes.filter((o)=>o.type == "small")
    // var bigThemes = cbianThemes.filter((o)=>o.type == "big")
    // var cbianName = node.data.cbianName || "cbian1";
    var index = null,
      theme = null;
    for (var i = 0, len = cbianThemes.length; i < len; i++) {
      if (cbianThemes[i].name == cbianName) {
        index = i;
        theme = cbianThemes[i];
        break;
      }
    }
    // var curTheme = cbianThemes[index];
    // if(curTheme.type == "small"){

    // }
    if (index == null) {
      return;
    }
    // var nextIndex = (index + 1) % cbianThemes.length;
    var baseNode, cbianText1, cbianText2, cbianText3, axisXText, axisYText, pic;
    if (theme) {
      // var theme = cbianThemes[nextIndex];
      var it = node.findSubGraphParts().iterator;
      while (it.next()) {
        var n = it.value;
        if (n.data.role == "theme") {
          baseNode = n;
        }
        if (n.data.role == "cbianText1") {
          cbianText1 = n;
        }
        if (n.data.role == "cbianText2") {
          cbianText2 = n;
        }
        if (n.data.role == "cbianText3") {
          cbianText3 = n;
        }
        if (n.data.role == "axisXText") {
          axisXText = n;
        }
        if (n.data.role == "axisYText") {
          axisYText = n;
        }
        if (n.data.category == "pic") {
          pic = n;
        }
      }
    }
    var diagram = node.diagram;
    if (!baseNode) {
      return;
    }
    var propertyPicture = "picture";
    if (node.data.cbianType == "big") {
      propertyPicture = "pictureBig";
    }
    diagram.model.startTransaction();

    diagram.model.setDataProperty(pic.data, "picture", theme[propertyPicture]);
    diagram.model.setDataProperty(node.data, "cbianName", cbianName);
    window.localStorage.setItem("cbianName", JSON.stringify(theme));
    // window.localStorage.setItem("cbianType",theme.type)
    // console.log("cbian theme")
    if (cbianText1) {
      diagram.model.setDataProperty(
        cbianText1.data,
        "textStroke",
        theme.textStrokes[0]
      );
    }
    if (cbianText2) {
      diagram.model.setDataProperty(
        cbianText2.data,
        "textStroke",
        theme.textStrokes[1]
      );
    }
    if (cbianText3) {
      diagram.model.setDataProperty(
        cbianText3.data,
        "textStroke",
        theme.textStrokes[2]
      );
    }
    diagram.model.commitTransaction();
  }

  getNodeSelectionAdornmentTemplate() {
    return $(
      go.Adornment,
      "Spot",
      $(
        go.Panel,
        "Auto",
        $(go.Shape, { fill: null, stroke: "dodgerblue", strokeWidth: 1 }),
        $(go.Placeholder) // this represents the selected Node
      ),
      //$("TreeExpanderButton",
      $(
        go.Panel,
        "Vertical",
        {
          name: "ButtonIcon1",
          alignment: new go.Spot(0, 1, -20, 20),
          alignmentFocus: go.Spot.Center,
          width: 60,
          height: 60,
          isActionable: true
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
    ); // end Adornment;
  }

  nodeResizeAdornmentTemplate() {
    return $(
      go.Adornment,
      "Spot",
      $(go.Placeholder), // takes size and position of adorned object
      $(
        go.Shape,
        "Circle", // left resize handle
        {
          alignment: go.Spot.TopLeft,
          alignmentFocus: go.Spot.BottomRight,
          cursor: "col-resize",
          desiredSize: new go.Size(30, 30),
          fill: "lightblue",
          stroke: "dodgerblue"
        }
      ),
      $(
        go.Shape,
        "Circle", // right resize handle
        {
          alignment: go.Spot.BottomRight,
          alignmentFocus: go.Spot.TopLeft,
          cursor: "col-resize",
          desiredSize: new go.Size(30, 30),
          fill: "lightblue",
          stroke: "dodgerblue"
        }
      )
    );
  }

  addFreeText(e, node) {
    console.log("eeeeeeeeeee", e);
    this.changeCbianThemeColor(e, node);
    return;
    var data = {
      text: "总结文本",
      deletable: true,
      fill: "black",
      iconVisible: false,
      locationSpot: "0 0.5 0 0",
      textAlign: "left",
      category: "autoText",
      loc: go.Point.stringify(e.documentPoint),
      movable: true,
      group: node.data.key
    };
    this.diagram.startTransaction("addFreeText");
    this.diagram.model.addNodeData(data);
    this.diagram.commitTransaction("addFreeText");
  }

  getNodeTemplate() {
    var diagram = this.diagram;
    var that = this;
    return $(
      go.Group,
      "Auto",
      {
        __trtdNode: that,
        // selectionObjectName: "groupBorder",
        layerName: "default",
        locationObjectName: "placeholder",
        zOrder: 5,
        // margin:30,
        // padding:30,
        background: "rgba(0,0,0,0)",
        rotatable: false,
        // minSize: new go.Size(200,100),
        locationSpot: go.Spot.BottomLeft,
        click: (e, node) => {
          console.log(node.data);
        },
        layout: $(go.Layout),
        doubleClick: function(e, node) {
          // that.addLabelText(e, node)
          var index = 0;
          for (var i = 0; i < that.cbianThemes.length; i++) {
            if (that.cbianThemes[i].name == node.data.cbianName) {
              index = i;
              break;
            }
          }
          var nextIndex = (index + 1) % that.cbianThemes.length;
          that.changeCbianName(node, that.cbianThemes[nextIndex].name);
          // that.addFreeText(e, node);
        },
        contextMenu: $(go.Adornment),
        layoutConditions:
          go.Part.LayoutStandard &
          go.Part.LayoutRemoved &
          go.Part.LayoutAdded &
          go.Part.LayoutNodeSized
      },
      new go.Binding("location", "loc", function(v) {
        // console.log("go.Point.parsego.Point.parsego.Point.parse")
        return go.Point.parse(v);
      }).makeTwoWay(go.Point.stringify),
      new go.Binding("angle", "angle").makeTwoWay(function(v, data) {
        return v;
      }),
      new go.Binding("isShadowed", "isShadowed").makeTwoWay(),
      new go.Binding("selectable", "selectable").makeTwoWay(),
      new go.Binding("movable", "movable").makeTwoWay(),
      new go.Binding("deletable", "deletable").makeTwoWay(),
      new go.Binding("layerName", "layerName").makeTwoWay(),

      $(
        go.Placeholder, // represents the area of all member parts,
        { padding: 30, alignment: go.Spot.Center, name: "placeholder" }
      ) // with some extra padding around them
    );
  }
}

module.exports = PicGroupNodeTemplate;
