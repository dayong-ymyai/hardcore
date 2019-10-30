(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("main", [], factory);
	else if(typeof exports === 'object')
		exports["main"] = factory();
	else
		root["main"] = factory();
})(typeof self !== 'undefined' ? self : this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 13);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// 'use strict';

// var helpers = require('./helpers.core');
// import buckets from '../assets/buckets.min'
/**
 * @namespace Chart.helpers.canvas
 */
var _exports = module.exports = {
	checkPhone: function checkPhone() {
		if (!navigator) return true;
		if (navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)) {
			/*window.location.href="你的手机版地址";*/
			return true;
		} else {
			/*window.location.href="你的电脑版地址";    */
			return false;
		}
	},
	guid: function guid() {
		function S4() {
			return ((1 + Math.random()) * 0x10000 | 0).toString(16).substring(1);
		}
		return S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4();
	},
	getElementByAttr: function getElementByAttr(document, tag, attr, value) {
		var aElements = document.getElementsByTagName(tag);
		var aEle = [];
		for (var i = 0; i < aElements.length; i++) {
			if (aElements[i].getAttribute(attr) == value) aEle.push(aElements[i]);
		}
		return aEle;
	},

	// extend: function(target) {
	// 	var setFn = function(value, key) {
	// 		target[key] = value;
	// 	};
	// 	for (var i = 1, ilen = arguments.length; i < ilen; ++i) {
	// 		helpers.each(arguments[i], setFn);
	// 	}
	// 	return target;
	// },

	/**
  * Clears the entire canvas associated to the given `chart`.
  * @param {Chart} chart - The chart for which to clear the canvas.
  */
	clear: function clear(chart) {
		chart.ctx.clearRect(0, 0, chart.width, chart.height);
	},
	nodeInfo: function nodeInfo(d) {
		// Tooltip info for a node data object
		var str = "Node " + d.key + ": " + d.text + "\n";
		if (d.group) str += "member of " + d.group;else str += "top-level node";
		return str;
	},
	linkInfo: function linkInfo(d) {
		// Tooltip info for a link data object
		return "Link:\nfrom " + d.from + " to " + d.to;
	},
	groupInfo: function groupInfo(adornment) {
		// takes the tooltip or context menu, not a group node data object
		var g = adornment.adornedPart; // get the Group that the tooltip adorns
		var mems = g.memberParts.count;
		var links = 0;
		g.memberParts.each(function (part) {
			if (part instanceof go.Link) links++;
		});
		return "Group " + g.data.key + ": " + g.data.text + "\n" + mems + " members including " + links + " links";
	},
	queue: function queue() {
		this.data = [];
		this.enqueue = function (record) {
			this.data.unshift(record);
		};
		this.dequeue = function () {
			this.data.pop();
		};
	},
	// buckets: buckets,
	//遍历天地盘做指定操作,colletor=[] 广度优先
	tdTravelTdpDataWidth: function tdTravelTdpDataWidth(nodeData, model, collector, callback) {

		var queue = new _exports.queue(); //队列数据结构，辅助用
		console.log("queue:", queue);
		queue.enqueue(nodeData);

		var dealingNode = null;
		while (!queue.isEmpty()) {
			dealingNode = queue.dequeue();
			collector.push(callback(dealingNode));
			//1 处理同级节点
			if (dealingNode.isparent) {
				var childNodeData = model.findNodeDataForKey(dealingNode.isparent);
				if (childNodeData) {
					queue.enqueue(childNodeData);
					while (childNodeData.next && childNodeData.next != childNodeData.key) {
						//加入所有子节点
						childNodeData = model.findNodeDataForKey(childNodeData.next);
						if (childNodeData) {
							queue.enqueue(childNodeData);
						} else {
							break;
						}
					}
				}
			}
		}
	},

	//遍历天地盘做指定操作,colletor=[]  深度优先
	tdTravelTdpData: function tdTravelTdpData(nodeData, model, collector, callback) {
		if (nodeData) {
			try {
				collector.push(callback(nodeData));
			} catch (e) {
				console.log(e);
				return;
			}
		} else {
			return;
		}
		//1 先处理子节点
		if (nodeData.isparent) {
			var childNodeData = model.findNodeDataForKey(nodeData.isparent);
			_exports.tdTravelTdpData(childNodeData, model, collector, callback);
		}
		//2 再处理兄弟节点
		if (nodeData.next && nodeData.next != nodeData.key) {
			//处理异常情况
			var nextNodeData = model.findNodeDataForKey(nodeData.next);
			_exports.tdTravelTdpData(nextNodeData, model, collector, callback);
		}
	},
	deleteOldData: function deleteOldData(time) {
		var temp, diff;
		for (var item in window.localStorage) {
			if (window.localStorage.hasOwnProperty(item)) {
				// size += window.localStorage.getItem(item).length;
				if (item.startsWith("TDCurrent")) {
					try {
						temp = JSON.parse(window.localStorage.getItem(item));
						diff = new Date().getTime() - temp.modelData.updatedAt;
						if (diff / 1000 > 86400 * time) {
							console.log("delete old data:" + item);
							window.localStorage.removeItem(item);
						}
					} catch (e) {
						console.error(e);
						continue;
					}
				}
			}
		}
	},
	saveModelToLocalStorage: function saveModelToLocalStorage(tpid, model) {
		console.log("存储model到localStorage，只保留最近三天的");
		model.modelData.updatedAt = new Date().getTime();
		if (!window.localStorage) {
			console.error('浏览器不支持localStorage');
			return;
		}
		// 只保留最近一周内的盘
		_exports.deleteOldData(3);
		try {
			window.localStorage.setItem("TDCurrent" + tpid, model.toJson());
		} catch (e) {
			_exports.deleteOldData(1);
			// window.localStorage.clear()
		}
	},


	// 检查gojs model数据关系是否正确
	checkModel: function checkModel(model) {
		var nodeDataArray = model.nodeDataArray;
		var root = model.findNodeDataForKey(1);
		var collectior = [];
		function checkDataExists(key) {
			var data = model.findNodeDataForKey(key);
			if (data) {
				return "exist";
			} else {
				return "not exist";
			}
		}
		_exports.tdTravelTdpData(root, model, collectior, function (data) {

			var msg = "check key:" + data.key + ",level:" + data.level + ",parent:" + data.parent + "," + ("isparent:" + data.isparent + ",prev:" + data.prev + ",next:" + data.next);
			if (data.next && checkDataExists(data.next) == "not exist") {
				console.error("data " + data.key + " next\u6307\u5411\u7684\u8282\u70B9\u4E0D\u5B58\u5728, data: " + msg);
			}
			if (data.isparent && checkDataExists(data.isparent) == "not exist") {
				console.error("data " + data.key + " isparent\u6307\u5411\u7684\u8282\u70B9\u4E0D\u5B58\u5728, data: " + msg);
			}
			if (data.parent && checkDataExists(data.parent) == "not exist") {
				console.error("data " + data.key + " parent\u6307\u5411\u7684\u8282\u70B9\u4E0D\u5B58\u5728, data: " + msg);
			}
			if (data.prev && checkDataExists(data.prev) == "not exist") {
				console.error("data " + data.key + " prev\u6307\u5411\u7684\u8282\u70B9\u4E0D\u5B58\u5728, data: " + msg);
			}
		});
	},
	// 数值转换
	tdTransToNum: function tdTransToNum(from, defaultVal) {
		if (arguments.length <= 1) {
			defaultVal = 0;
		}
		var result = defaultVal;
		try {
			result = parseFloat(from);
			return result;
		} catch (e) {
			return result;
		}
	},
	simulateEnterWithAlt: function simulateEnterWithAlt(e) {
		//模拟alt+Enter键盘,将gojs内置文本编辑窗口中的Alt+Enter 转换为\n
		var myDiagram = e.diagram;
		if (myDiagram.currentTool.currentTextEditor) {
			var textEditorHandler = function textEditorHandler(e) {
				var evt = e;
				console.log('textblock catched the key:' + evt);
				if (evt.which) {
					if (evt.keyCode == 13 && evt.altKey || evt.keyCode == 10 && evt.ctrlKey || evt.keyCode == 13 && evt.shiftKey || evt.keyCode == 10 && evt.shiftKey) {
						var start = this.selectionStart,
						    end = this.selectionEnd,
						    val = this.value;
						this.value = val.slice(0, start) + "\n" + val.slice(end);

						// Move the caret
						this.selectionStart = this.selectionEnd = start + 1;
						return false;
					}
				}

				if (evt.keyCode == 13 && !evt.altKey) {

					if (myDiagram.currentTool.isActive) {
						myDiagram.currentTool.acceptText(go.TextEditingTool.LostFocus);
					}
					return false; //阻止默认行为
				}
				return true;
			};

			// jQuery(myDiagram.currentTool.currentTextEditor).unbind("keypress", myDiagram.currentTool.currentTextEditor);
			// jQuery(myDiagram.currentTool.currentTextEditor).keypress(textEditorHandler);
			myDiagram.currentTool.currentTextEditor.mainElement.onkeypress = null;
			myDiagram.currentTool.currentTextEditor.mainElement.onkeypress = textEditorHandler;
			var val = myDiagram.currentTool.currentTextEditor.mainElement.value;
			// 只在手机端定位到结尾
			if (module.exports.checkPhone()) {
				myDiagram.currentTool.currentTextEditor.mainElement.selectionStart = val.length;
				myDiagram.currentTool.currentTextEditor.mainElement.selectionEnd = val.length;
			}
		}
	},

	/***
 * travel nodes, group and links
 * @param rootnode go.Node
 * @param callback function(part){}
 */
	travelParts: function travelParts(rootNode, callback) {
		var diagram = rootNode.diagram;
		callback(rootNode);
		var group = rootNode.containingGroup;
		if (group && group.data.parent == rootNode.data.key) {
			callback(group);
		}
		var stack = [rootNode];
		var node, link, child, nextChild;
		while (stack.length > 0) {
			node = stack.pop();
			if (node.data.isparent) {
				child = diagram.findNodeForKey(node.data.isparent);
				link = node.findLinksTo(child).first();
				callback(link);
				callback(child);
				group = child.containingGroup;
				if (group && group.data.parent == child.data.key) {
					callback(group);
				}
				stack.push(child);
				while (child.data.next) {
					nextChild = diagram.findNodeForKey(child.data.next);
					link = child.findLinksTo(nextChild).first();
					callback(link);
					callback(nextChild);
					group = nextChild.containingGroup;
					if (group && group.data.parent == nextChild.data.key) {
						callback(group);
					}
					stack.push(nextChild);
					child = nextChild;
				}
			}
		}
	}
};

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var $ = go.GraphObject.make;
console.info("gggggggggggggggggggggggg");
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

  var button = go.GraphObject.make(go.Panel, 'Auto', {
    isActionable: true, // needed so that the ActionTool intercepts mouse events
    enabledChanged: function enabledChanged(btn, enabled) {
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
  }, go.GraphObject.make(go.Shape, // the border
  {
    name: 'ButtonBorder',
    figure: 'Circle',
    spot1: new go.Spot(0, 0, paddingHorizontal, paddingVertical),
    spot2: new go.Spot(1, 1, -paddingHorizontal, -paddingVertical),
    parameter1: 2,
    parameter2: 2,
    fill: buttonFillNormal,
    stroke: buttonStrokeNormal
  }));

  // There's no GraphObject inside the button shape -- it must be added as part of the button definition.
  // This way the object could be a TextBlock or a Shape or a Picture or arbitrarily complex Panel.

  // mouse-over behavior
  button.mouseEnter = function (e, btn, prev) {
    if (!btn.isEnabledObject()) return;
    var shape = btn.findObject('ButtonBorder'); // the border Shape
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
    var shape = btn.findObject('ButtonBorder'); // the border Shape
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
    var shape = btn.findObject('ButtonBorder'); // the border Shape
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
    var shape = btn.findObject('ButtonBorder'); // the border Shape
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
    var shape = btn.findObject('ButtonBorder'); // the border Shape
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
    var over = e.diagram.findObjectAt(e.documentPoint, function (x) {
      while (x.panel !== null) {
        if (x.isActionable) return x;
        x = x.panel;
      }
      return x;
    }, function (x) {
      return x === btn;
    });
    return over !== null;
  }

  return button;
});

var NodeBase = function () {
  function NodeBase(options) {
    _classCallCheck(this, NodeBase);

    var that = this;
    this.diagram = options.diagram;
    this.nodeProperties = this.getNodeProperties();
    this.binding = this.getBinding();
    // this.nodeTemplate = this.getNodeTemplate()
  }

  _createClass(NodeBase, [{
    key: 'getTooTip',
    value: function getTooTip() {
      var that = this;
      return $("ToolTip", { "Border.fill": "whitesmoke", "Border.stroke": "black" }, new go.Binding("visible", "", function (obj) {
        console.log("ToolTipToolTipToolTip");
        return obj.remark != null;
      }), $(go.TextBlock, {
        maxSize: new go.Size(400, NaN),

        font: "24px bold",
        wrap: go.TextBlock.WrapFit,
        margin: 5
      }, new go.Binding("text", "", function (obj) {

        return obj.remark || "";
      })));
    }
  }, {
    key: 'getNodeProperties',
    value: function getNodeProperties() {
      var that = this;
      var diagram = this.diagram;
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
      };
      return properties;
    }
  }, {
    key: 'getNodeSelectionAdornmentTemplate',
    value: function getNodeSelectionAdornmentTemplate() {
      return $(go.Adornment, "Auto", $(go.Shape, "Rectangle",
      // { fill: null, stroke: "#9aa8b6", strokeWidth: 1 }),
      { fill: null, stroke: "dodgerblue", strokeWidth: 3 }), $(go.Placeholder)); // end Adornment
    }
  }, {
    key: 'getBinding',
    value: function getBinding() {
      return [new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify), new go.Binding("movable", "movable").makeTwoWay(), new go.Binding("isShadowed", "isShadowed").makeTwoWay(), new go.Binding("selectable", "selectable").makeTwoWay(), new go.Binding("angle", "angle").makeTwoWay(), new go.Binding("copyable", "copyable").makeTwoWay()];
    }
  }, {
    key: 'getTextBuild',
    value: function getTextBuild() {
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
      }, new go.Binding("textAlign", "textAlign", function (v) {
        return ['start', 'center', 'end'].indexOf(v) > -1 ? v : "center";
      }).makeTwoWay(), new go.Binding("spacingAbove", "spacingline", function (v) {
        return helpers.tdTransToNum(v, 4);
      }).makeTwoWay(), new go.Binding("spacingBelow", "spacingline", function (v) {
        return helpers.tdTransToNum(v, 4);
      }).makeTwoWay(), new go.Binding("width", "width", function (v) {
        return v - 30;
      }).ofObject("main"),
      // new go.Binding("height", "height", function (v) {
      //   return v;
      // }).ofObject("SHAPE"),
      new go.Binding("text", "text").makeTwoWay(), new go.Binding("stroke", "textStroke").makeTwoWay(), new go.Binding("font", "font").makeTwoWay());
    }
  }, {
    key: 'getNodeTemplate',
    value: function getNodeTemplate() {
      console.log("NodeBase.getNodeTemplate");
      var that = this;
      return $(go.Node, that.nodeProperties, that.binding);
    }
  }, {
    key: 'click',
    value: function click(e, node) {
      // console.log(node.data)
      if (node.diagram.__trtd.nodeClickListener) {
        node.diagram.__trtd.nodeClickListener(node);
      }
    }
  }, {
    key: 'doubleClick',
    value: function doubleClick(e, node) {
      e.diagram.__trtd.selectText(e, node);
    }
  }, {
    key: 'mouseOver',
    value: function mouseOver(e, node) {
      // if(node.data.hyperlink){
      //   var textObj = node.findObject('TEXT');
      //   textObj.isUnderline = true;
      // }

      e.diagram.__trtd.showNodeRemarkTips(e, node);
    }
  }, {
    key: 'mouseLeave',
    value: function mouseLeave(e, node) {
      // if(node.data.hyperlink) {
      //   var textObj = node.findObject('TEXT');
      //   textObj.isUnderline = false;
      // }
      e.diagram.__trtd.removeNodeRemarkTips();
    }
  }, {
    key: 'mouseDragEnter',
    value: function mouseDragEnter(e, obj) {
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
  }, {
    key: 'mouseDragLeave',
    value: function mouseDragLeave(e, obj) {
      var node = obj.part;
      var shape = node.findObject("SHAPE");
      if (shape && shape._prevFill) {
        shape.fill = shape._prevFill; // restore the original brush
      }
      //node.removeAdornment("dragEnter");
    }
  }, {
    key: 'mouseDrop',
    value: function mouseDrop(e, obj) {
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
  }]);

  return NodeBase;
}();

module.exports = NodeBase;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var $ = go.GraphObject.make;

module.exports = // 返回图片天盘的独立节点模板
function createPictureSingleNodeTemplate(diagram) {
    // var $ = go.GraphObject.make;
    var properties = {
        figure: "Circle",
        fill: "white",
        strokeWidth: 1,
        stroke: "#767678",
        fontSize: 15,
        font: "sans-serif"
    };
    return $(go.Node, "Auto", _defineProperty({
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
        doubleClick: function doubleClick(e, node) {
            // interactions.selectText(e, node)
            console.log(node.data);
            if (node.diagram.__trtd.nodeDoubleClickListener) {
                node.diagram.__trtd.nodeDoubleClickListener(node);
            }
        },
        click: function click(e, node) {
            console.log(node.data);
            if (node.diagram.__trtd.nodeClickListener) {
                node.diagram.__trtd.nodeClickListener(node);
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
        selectionAdornmentTemplate: function () {
            var $ = go.GraphObject.make;
            return $(go.Adornment, "Spot", $(go.Panel, "Auto", $(go.Shape, { fill: null, stroke: "blue", strokeWidth: 1 }), $(go.Placeholder) // this represents the selected Node

            ),
            //$("TreeExpanderButton",
            $(go.Panel, "Vertical", {
                name: "ButtonIcon1",
                alignment: new go.Spot(0, 1, -20, 20),
                alignmentFocus: go.Spot.Center,
                width: 60,
                height: 60,
                isActionable: true
                // click: interactions.expandCollapse // this function is defined below
            }, $(go.Shape, "Circle", {
                fill: "rgba(1,1,1,0)",
                strokeWidth: 0,
                stroke: "green",
                width: 50,
                height: 50
            }))); // end Adornment
        }()
    }, "contextMenu", function () {
        var $ = go.GraphObject.make;
        return $(go.Adornment, "Vertical", $("ContextMenuButton", $(go.TextBlock, "删除"), {
            click: function click(e, obj) {
                e.diagram.commandHandler.deleteSelection();
            }
        }), $("ContextMenuButton", $(go.TextBlock, "居中"), {
            click: function click(e, obj) {
                centerPicture();
            }
        }), $("ContextMenuButton", $(go.TextBlock, "等宽高"), {
            click: function click(e, obj) {
                equalWidthHeightPicture();
            }
        }), $("ContextMenuButton", $(go.TextBlock, "原始比例", { stroke: "gray" }), {
            click: function click(e, obj) {
                //equalWidthHeightPicture();
            }
        }), $("ContextMenuButton", $(go.TextBlock, "至于顶层"), {
            click: function click(e, obj) {
                //bringToBackground();
                bringToLayer("Foreground");
            }
        }), $("ContextMenuButton", $(go.TextBlock, "至于底层"), {
            click: function click(e, obj) {
                bringToLayer("Background");
            }
        }), $("ContextMenuButton", $(go.TextBlock, "上移一层"), {
            click: function click(e, obj) {
                bringToLayer(null);
            }
        }), $("ContextMenuButton", $(go.TextBlock, "固定", new go.Binding("text", "", function (d, obj) {
            var node = obj.part;
            return node.data.selectable != undefined ? node.data.selectable ? "固定" : "取消固定" : "固定";
        })), {
            name: "fixnode",
            click: function click(e, obj) {
                var diagram = obj.diagram;
                var node = obj.part;
                diagram.startTransaction();
                //node.setProperties({"movable":node.data.movable?(!node.data.movable):true});
                diagram.model.setDataProperty(node.data, "selectable", node.data.selectable != undefined ? !node.data.selectable : false);
                diagram.commitTransaction();
            }
        }));
    }()), new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify), new go.Binding("isShadowed", "isShadowed").makeTwoWay(), new go.Binding("selectable", "selectable").makeTwoWay(), new go.Binding("movable", "movable").makeTwoWay(), new go.Binding("layerName", "layerName", function (v, d) {
        return v ? v : "";
    }).makeTwoWay(function (v) {
        return v;
    }), $(go.TextBlock, // the text label
    new go.Binding("text", "text")), $(go.Picture, // the icon showing the logo
    // You should set the desiredSize (or width and height)
    // whenever you know what size the Picture should be.
    { name: "SHAPE" }, {
        successFunction: function successFunction(pict, evt) {
            if ((!pict.width || !pict.height) && (!pict.part.data.width || !pict.part.data.height)) {
                pict.width = pict.element.width;
                pict.height = pict.element.height;
            }
        }
    }, {
        sourceCrossOrigin: function sourceCrossOrigin(pict) {
            return "";
        }
    }, new go.Binding("source", "picture", function (v) {

        return v + "?" + Date.now();
    }).makeTwoWay(function (v) {
        if (v) {
            v = v.replace(/\?.*$/g, "");
            return v;
        } else {
            return "";
        }
    }), new go.Binding("width", "width", function (v, d) {
        return v;
    }).makeTwoWay(function (v) {
        return v;
    }), new go.Binding("height", "height", function (v, d) {
        return v;
    }).makeTwoWay(function (v) {
        return v;
    }), new go.Binding("angle", "pictureangle").makeTwoWay(), new go.Binding("opacity", "opacity", function (v, d) {
        return v ? parseFloat(v) : 1;
    }).makeTwoWay(function (v) {
        return v;
    })));
};

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var $ = go.GraphObject.make;

module.exports = function createTextNodeTemplate(diagram) {
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
        movable: true,
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
        contextMenu: $(go.Adornment),
        doubleClick: function doubleClick(e, node) {
            e.diagram.__trtd.selectText(e, node);
        }

        // selectionAdornmentTemplate: nodeSelectionAdornmentTemplate,
    }, new go.Binding("locationSpot", "locationSpot", function (v) {
        console.log("locationSpot1");
        return go.Spot.parse(v);
    }).makeTwoWay(function (v) {
        console.log("locationSpot2");
        return go.Spot.stringify(v);
    }), new go.Binding("deletable", "deletable").makeTwoWay(), new go.Binding("movable", "movable").makeTwoWay(), new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify), new go.Binding("isShadowed", "isShadowed").makeTwoWay(), new go.Binding("angle", "angle").makeTwoWay(), new go.Binding("selectable", "selectable").makeTwoWay(), new go.Binding("layerName", "layerName", function (v, d) {
        return v ? v : "";
    }).makeTwoWay(function (v) {
        return v;
    }), $(go.Shape, {
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
        width: 150
    }, new go.Binding("strokeDashArray", "strokeDashArray", function (v) {
        return [v.split()[0], v.split()[1]];
    }).makeTwoWay(function (v) {
        return v[0] + " " + v[1];
    }), //保留，设置边线样式
    new go.Binding("fill", "fill", function (v, obj) {
        return v instanceof go.Brush ? v.color : v;
    }).makeTwoWay(),
    // new go.Binding("fill", "isSelected", function(s, obj) { return s ? "red" : obj.part.data.color; }).ofObject()),
    new go.Binding("width", "width", function (v) {
        //alert(v);
        return v;
    }).makeTwoWay(function (v) {
        return v;
    }), new go.Binding("height", "height", function (v) {
        //alert(v);
        return v;
    }).makeTwoWay(function (v) {
        return v;
    }), new go.Binding("stroke", "stroke", function (v) {
        return v instanceof go.Brush ? v.stroke : v;
    }).makeTwoWay(), new go.Binding("strokeWidth", "strokeWidth", function (d) {
        return d;
    }).makeTwoWay(function (d) {
        return d;
    }), new go.Binding("figure", "figure").makeTwoWay(), {
        figure: properties.figure,
        fill: properties.fill,
        strokeWidth: properties.strokeWidth,
        stroke: properties.stroke
    }), $(go.Shape, {
        name: "SHAPE_Back",
        figure: "Rectangle",
        fill: "rgba(0,0,0,0)",
        // fromLinkable: true,
        // toLinkable: true,
        strokeWidth: 0
    }, new go.Binding("width", "width", function (v) {
        return v;
    }).ofObject("SHAPE"), new go.Binding("height", "height", function (v) {
        return v;
    }).ofObject("SHAPE")), $(go.TextBlock, {
        name: "TEXT",
        alignment: new go.Spot(0.5, 0.5),
        font: "bold 18px 幼圆",
        editable: true,
        //margin: 3, editable: true,
        stroke: "black",
        isMultiline: true,
        overflow: go.TextBlock.OverflowClip,
        wrap: go.TextBlock.WrapDesiredSize,
        textAlign: "center",
        // verticalAlignment: go.Spot.Bottom,
        spacingAbove: 4,
        spacingBelow: 4,
        portId: "TEXT",
        stretch: go.GraphObject.Fill
    }, new go.Binding("textAlign", "textAlign", function (v) {
        return _.contains(['start', 'center', 'end'], v) ? v : "center";
    }).makeTwoWay(), new go.Binding("spacingAbove", "spacingline", function (v) {
        return helpers.tdTransToNum(v, 4);
    }).makeTwoWay(), new go.Binding("spacingBelow", "spacingline", function (v) {
        return helpers.tdTransToNum(v, 4);
    }).makeTwoWay(), new go.Binding("width", "width", function (v) {
        return v;
    }).ofObject("SHAPE"),
    // new go.Binding("height", "height", function (v) {
    //   return v;
    // }).ofObject("SHAPE"),
    new go.Binding("text", "text").makeTwoWay(), new go.Binding("stroke", "textStroke").makeTwoWay(), new go.Binding("font", "font").makeTwoWay()));
};

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// require('./core/core.controller')(Trtd);
// import * as go from 'gojs';
var SpiralLayout = __webpack_require__(14);
var helpers = __webpack_require__(0);
// var commonFun = require('./commonFun')
var TRTD_BASE = __webpack_require__(10).Trtd;
var lang = __webpack_require__(12);
var createNodeTemplate = __webpack_require__(7);
var createPictureSingleNodeTemplate = __webpack_require__(2);
var createPictureNodeTemplate = __webpack_require__(5);
var createTextNodeTemplate = __webpack_require__(3);
var createNodeSvgTemplate = __webpack_require__(6);

var createTianpanLink = __webpack_require__(30);

var $ = go.GraphObject.make;

var colorMap = ["#FFBFBF", "#E9BFFF", "#D1FF72", "#00A2E8", "#99D9EA"];

var Trtd = function (_TRTD_BASE) {
    _inherits(Trtd, _TRTD_BASE);

    function Trtd(div, config) {
        _classCallCheck(this, Trtd);

        var _this = _possibleConstructorReturn(this, (Trtd.__proto__ || Object.getPrototypeOf(Trtd)).call(this, div, config));

        _this.config = config;
        _this.modelChangedListener = config.modelChangedListener;
        _this.type = config.type;
        _this.diagram = {};
        _this.model = config.model;
        _this.initDiagramBase(div, config); // 基类初始化diagram
        // 初始化diagram
        _this.initDiagram(div, config);
        // this.diagram.__trtd = this;
        _this.initListener();
        // Then you will need to construct a Model (usually a GraphLinksModel) for the Diagram, initialize its data by setting its Model.nodeDataArray and other properties, and then set the diagram's model.
        if (_this.model) {
            _this.initModel();
        }
        return _this;
    }
    /**
     * method 初始化diagram
     * @param {*} div 
     * @param {*} config 
     */


    _createClass(Trtd, [{
        key: 'initDiagram',
        value: function initDiagram(div, config) {
            var defaultConfig = {
                // layout: go.GraphObject.make(SpiralLayout, {
                //     isRealtime: false,
                //     radius: NaN,
                //     clockwise: true,
                //     //,spacing:100,
                //     isInitial: true
                // }) 
            };
            var diagramConfig = Object.assign(defaultConfig, config.diagramConfig);
            this.diagram.setProperties(diagramConfig);
            this.addNodeTemplate();
            // this.customMenu();

            this.addLinkTemplate();
            this.addGroupTemplate();
        }
    }, {
        key: 'getTdData',
        value: function getTdData() {
            return this.diagram.model.toJson();
        }
        // 以下两个方法控制菜单显示

    }, {
        key: 'getDefaultCustomMenuDivStr',
        value: function getDefaultCustomMenuDivStr() {
            return '\n        <ul>\n            <li trtd_action="addFollower"><a class="i18n" data-lang="insertsl">\u63D2\u5165\u540C\u7EA7\u8282\u70B9</a></li>\n            <li trtd_action="startNewSpiral"><a class="i18n" data-lang="icn">\u63D2\u5165\u5B50\u8282\u70B9</a></li>\n            <li trtd_action="apiDuplicateNode"><a class="i18n" data-lang="duplicateNode">\u590D\u5236\u8282\u70B9</a></li>\n            <li trtd_action="apiDeleteSelection"><a class="i18n" data-lang="remove">\u5220\u9664</a></li>\n            <li trtd_action="orderChildNode"><a class="i18n" data-lang="ordernode">\u5B50\u8282\u70B9\u7F16\u53F7</a></li>\n            <li trtd_action="clearOrderChildNode"><a class="i18n" data-lang="clearordernode">\u53D6\u6D88\u5B50\u8282\u70B9\u7F16\u53F7</a></li>\n            <li trtd_action="clearNodeTextMenu"><a class="i18n" data-lang="emptynodetext">\u6E05\u7A7A\u8282\u70B9\u6587\u672C</a></li>\n            <li trtd_action="apiInsertTianpanNode"><a class="i18n" data-lang="insertnodetianpan">\u63D2\u5165\u5929\u76D8\u8282\u70B9</a></li>\n            <li trtd_action="addTextNode"><a class="i18n" data-lang="inserttext">\u63D2\u5165\u6587\u672C</a></li>\n            <li trtd_action="locateRootNodeMenu"><a class="i18n" data-lang="locaterootnode">\u5B9A\u4F4D\u6839\u8282\u70B9</a></li>\n            <li trtd_action="showAllNodesMenu"><a class="i18n" data-lang="displayallnodes">\u663E\u793A\u6240\u6709\u8282\u70B9</a></li>\n            <li trtd_action="fixPictureMenu"><a class="i18n" data-lang="fixnode">\u56FA\u5B9A\u8282\u70B9</a></li>\n            <li trtd_action="activePictureMenu"><a class="i18n" data-lang="cancelfix">\u53D6\u6D88\u56FA\u5B9A</a></li>\n\n            <li trtd_action="delYunpanAxis"><a class="i18n" data-lang="cancelfix">\u5220\u9664 CTRL+DEL</a></li>\n            <li trtd_action="addYunpanAxis"><a class="i18n" data-lang="cancelfix">\u589E\u52A0 CTRL+X/Y</a></li>\n        </ul>\n        ';
        }
    }, {
        key: 'getShowContextMenus',
        value: function getShowContextMenus(node) {
            var showIds = "";
            if (node) {
                if (node.data.category == "autoText") {
                    return "apiDeleteSelection";
                }
                if (node.data.category == "picGroup") {
                    return "apiDeleteSelection";
                }
                if (node.data.category == "8") {
                    showIds = "apiDeleteSelection,";
                }
                if (node.data.category == "text") {
                    showIds = "apiDeleteSelection," + "apiDuplicateNode";
                }
                if (node.data.category == "3") {
                    showIds = "apiDeleteSelection,";
                    if (node.selectable) {
                        showIds += ",fixPictureMenu";
                    } else {
                        showIds += ",activePictureMenu";
                    }
                }
                if (node.data.category == "0" || node.data.category == "1" || node.data.category == "2" || node.data.category == "") {
                    showIds = "apiDeleteSelection,apiDuplicateNode,addFollower,startNewSpiral,orderChildNode,clearOrderChildNode";
                }
                if (node.data.category == "yunpanx" || node.data.category == "yunpany") {
                    showIds = "delYunpanAxis,addYunpanAxis";
                }
                // return "addFollowerGround," + "addNewCircle,"+"apiDeleteSelection";
            } else {
                // return "addFollowerGround"
                showIds = "addTextNode,apiInsertTianpanNode";
            }
            return showIds;
        }
    }, {
        key: 'apiInsertTianpanNode',
        value: function apiInsertTianpanNode() {
            var myDiagram = this.diagram;
            myDiagram.startTransaction();
            var nodeData = {
                "key": helpers.guid(), "text": "双击编辑内容", "level": 0,
                "radius": 100, "fill": "white", "category": "0",
                "strokeWidth": 2, "stroke": "black", "font": "bold 18px 幼圆", "textStroke": "black", "newAdd": true, "angle": 5
                // var text = { text: message||lang.trans('blankText'), category: 'text' };
            };nodeData.loc = go.Point.stringify(myDiagram.lastInput.documentPoint);
            myDiagram.model.addNodeData(nodeData);
            myDiagram.commitTransaction();
            // this.diagram.toolManager.clickCreatingTool.insertPart(this.diagram.lastInput.documentPoint);
        }
    }, {
        key: 'fixPictureMenu',
        value: function fixPictureMenu() {
            var myDiagram = this.diagram;
            // var node = myDiagram.selection.first();
            var node = myDiagram.findPartAt(myDiagram.lastInput.documentPoint, false);
            myDiagram.startTransaction();
            myDiagram.model.setDataProperty(node.data, "selectable", node.data.selectable != undefined ? !node.data.selectable : false);
            myDiagram.commitTransaction();
        }
    }, {
        key: 'activePictureMenu',
        value: function activePictureMenu() {
            this.fixPictureMenu();
        }
    }, {
        key: 'addTextNode',
        value: function addTextNode(message) {
            console.log('eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee:');
            var myDiagram = this.diagram;
            myDiagram.startTransaction();
            var text = { text: message || lang.trans('blankText'), category: 'autoText' };
            text.loc = go.Point.stringify(myDiagram.lastInput.documentPoint);
            myDiagram.model.addNodeData(text);
            myDiagram.commitTransaction();
        }
    }, {
        key: 'guid',
        value: function guid() {
            function S4() {
                return ((1 + Math.random()) * 0x10000 | 0).toString(16).substring(1);
            }
            return S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4();
        }

        /**
         * method 初始化model
         */

    }, {
        key: 'initModel',
        value: function initModel(model) {
            if (model) {
                this.model = model;
            }
            console.log('initModel');
            var tmpModel = go.Model.fromJson(this.model);
            if (tmpModel.modelData.currentType == 'dipan') {
                tmpModel.nodeDataArray = tmpModel.nodeDataArray.filter(function (d) {
                    if (!d.isGroup) {
                        delete d.group;
                        return true;
                    }
                });
                // tmpModel.nodeDataArray = 
                tmpModel.linkDataArray = [];
            }
            if (!tmpModel.modelData.currentType) {
                tmpModel.modelData.currentType = this.type;
            }
            if (["jin", "shui", "wheel", "huo"].indexOf(this.type) > -1) {
                tmpModel.modelData.currentType = "tianpan";
            }
            console.log(" tmpModel.modelData.currentType");
            this.diagram.layout.isInitial = false;
            //randomUrl(tmpModel);
            tmpModel.modelData.type = this.type;
            for (var i = 0; i < tmpModel.nodeDataArray.length; i++) {
                if (tmpModel.nodeDataArray[i].category == "waveGroup") {
                    if (!tmpModel.nodeDataArray[i].centerTextAngle) {
                        tmpModel.nodeDataArray[i].centerTextAngle = "independent";
                    }
                    if (!tmpModel.nodeDataArray[i].centerTextMode) {
                        tmpModel.nodeDataArray[i].centerTextMode = "independent";
                    }
                    if (!tmpModel.nodeDataArray[i].maxOlive) {
                        tmpModel.nodeDataArray[i].maxOlive = 50;
                    }
                }
                if (tmpModel.nodeDataArray[i].category == "yunGroup") {
                    if (!tmpModel.nodeDataArray[i].shapeStrokes) {
                        tmpModel.nodeDataArray[i].shapeStrokes = ["RGBA(237,28,36,0.3)", "RGBA(255,192,0,0.3)", "RGBA(255,255,0,0.3)", "RGBA(146,208,80,0.3)", "RGBA(192,200,250,0.3)", "RGBA(255,178,125,0.3)", "RGBA(209,110,210,0.3)", "RGBA(248,163,62,0.3)", "RGBA(248,161,164,0.3)", "RGBA(244,115,120,0.3)"];
                    }
                    if (!tmpModel.nodeDataArray[i].beginSpark) {
                        tmpModel.nodeDataArray[i].beginSpark = "line";
                    }
                    if (tmpModel.nodeDataArray[i].showShape == null) {
                        tmpModel.nodeDataArray[i].showShape = true;
                    }
                }
                if (tmpModel.nodeDataArray[i].category == "shape" && tmpModel.nodeDataArray[i].role == "background") {
                    tmpModel.nodeDataArray[i].visible = true;
                }
                if (tmpModel.nodeDataArray[i].role && tmpModel.nodeDataArray[i].role.indexOf("labelText") > -1) {
                    tmpModel.nodeDataArray[i].movable = true;
                }
                if (tmpModel.nodeDataArray[i].category == "labelGroup") {
                    tmpModel.nodeDataArray[i].selectable = false;
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
    }, {
        key: 'loadModel',
        value: function loadModel(model) {
            // console.log(model)
            // var node = this.diagram.selection.first()
            // if(node){
            //     this.diagram.commandHandler.scrollToPart(node)
            // }
            this.diagram.animationManager.isEnabled = false;
            this.initModel(model);
        }
        // addNodeFile(model){
        //     console.log(model)
        // }
        /**
         * method: 初始化监听方法
         */

    }, {
        key: 'initListener',
        value: function initListener() {
            console.log('initListener');
        }
    }, {
        key: 'addGroupTemplate',
        value: function addGroupTemplate() {
            // return function getGroupTemplate() {
            this.diagram.groupTemplateMap.add("", $(go.Group, "Auto", {
                layerName: "Background",
                selectable: false,
                pickable: false,
                locationSpot: go.Spot.Center,
                ungroupable: true,
                alignment: go.Spot.Center,
                click: function click(d) {
                    // alert('click group');
                    // d.diagram.clearSelection();
                },
                contextClick: function contextClick(d) {
                    // alert('click right group');
                },
                alignmentFocus: go.Spot.Center,
                // contextMenu: nodeContextMenu,
                selectionAdornmentTemplate: $(go.Adornment, "Spot", $(go.Panel, "Auto", $(go.Shape, 'Circle', { stroke: "dodgerblue", strokeWidth: 2, fill: null }, new go.Binding("width", "", function (v) {
                    var node = myDiagram.selection.first();
                    if (node instanceof go.Group) {
                        return node.actualBounds.width;
                    }
                }), new go.Binding("height", "", function (v) {
                    var node = myDiagram.selection.first();
                    if (node instanceof go.Group) {
                        return node.actualBounds.height;
                    }
                })),
                //new go.Binding('wit')),
                $(go.Placeholder)), $(go.Panel, "Horizontal", { alignment: go.Spot.Top, alignmentFocus: go.Spot.Bottom })),
                copyable: false
            }, {
                layout: $(SpiralLayout, {
                    isRealtime: false,
                    radius: NaN,
                    clockwise: true,
                    isInitial: false
                }),
                layoutConditions: go.Part.LayoutStandard & ~go.Part.LayoutNodeSized & ~go.Part.LayoutAdded
            }, new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify), $(go.Panel, "Auto", $(go.Shape, "Circle", {
                name: "SHAPE",
                fill: "rgba(212,230,188,0)",
                stroke: null,
                // ,
                //width:300,
                //height:300,
                spot1: new go.Spot(0.01, 0.01),
                spot2: new go.Spot(0.99, 0.99)
            }, new go.Binding("stroke", "stroke", function (v) {
                return v instanceof go.Brush ? v.stroke : v;
            }).makeTwoWay(), new go.Binding("strokeWidth", "strokeWidth", function (d) {
                return d;
            }).makeTwoWay(function (d) {
                return d;
            }), new go.Binding("figure", "figure").makeTwoWay(), new go.Binding("desiredSize", "radius", function (v) {
                //alert(v);

                var radius = parseInt(v ? v : 100);
                var size = new go.Size(radius, radius);
                return size;
            }).makeTwoWay(function (v) {
                return v.width;
            })), $(go.Placeholder, {
                // margin: tdSpiralMode == 'terse' ? -10 : 0
                margin: 0
            }))));
        }
        /**
         * 添加节点模板
         */

    }, {
        key: 'addNodeTemplate',
        value: function addNodeTemplate() {

            var that = this;
            var myDiagram = this.diagram;
            // var globalProperties = this.tdGetModelData(null, myDiagram.model,myDiagram); //获取所有全局属性到一个对象中,从localstorage中
            //var layerThickness = myDiagram.model.modelData.layerThickness;
            // var layerThickness = parseInt(globalProperties['layerThickness']);
            // console.log(layerThickness)
            // var tdDipanTextAngle = globalProperties['tdDipanTextAngle'];
            // console.log(tdDipanTextAngle)

            // myDiagram.nodeTemplateMap.add("dipan", this.createDipanTemplate(layerThickness,tdDipanTextAngle));
            // myDiagram.nodeTemplateMap.add("Root", this.getDipanRootTemplate(layerThickness));
            // myDiagram.nodeTemplateMap.add("text", );
            this.addNodeTemplateBase();
            myDiagram.nodeTemplateMap.add("0", createNodeTemplate(this.diagram));
            myDiagram.nodeTemplateMap.add("1", createNodeTemplate(this.diagram));
            myDiagram.nodeTemplateMap.add("2", createNodeTemplate(this.diagram));
            myDiagram.nodeTemplateMap.add("3", createPictureSingleNodeTemplate(this.diagram));
            myDiagram.nodeTemplateMap.add("4", createPictureNodeTemplate(this.diagram));
            // myDiagram.nodeTemplateMap.add("text", createTextNodeTemplate(this.diagram));
            myDiagram.nodeTemplateMap.add("", createNodeTemplate(this.diagram));

            myDiagram.nodeTemplateMap.add("8", createNodeSvgTemplate(this.diagram));
        }
    }, {
        key: 'addLinkTemplate',
        value: function addLinkTemplate() {
            this.diagram.linkTemplateMap.add("", createTianpanLink(this.diagram));
            // myDiagram.linkTemplateMap.add("", linkTemplate.getTianpanLink());
        }

        /***
         * 将node(包括它的后代)设置为parent的第一个孩子. 如果parent是Node的后代，则不操作
         * @param node go.Node Type
         * @param parent go.Node Type
         */

    }, {
        key: 'setNodeAsChildren',
        value: function setNodeAsChildren(node, parent) {
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
                };
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
            helpers.travelParts(node, function (part) {
                model.setDataProperty(part.data, 'level', part.data.level - diff);
            });
            model.commitTransaction('setNodeAsChildren');
        }

        /***
         * 将node(包括它的后代)设置为sibling的下一个兄弟
         * @param node  go.Node Type
         * @param sibling go.Node Type
         */

    }, {
        key: 'setNodeAsSibling',
        value: function setNodeAsSibling(node, sibling) {
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
            helpers.travelParts(node, function (part) {
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

    }, {
        key: 'setNodeAsChildren',
        value: function setNodeAsChildren(node, parent) {
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
                };
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
            helpers.travelParts(node, function (part) {
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

    }, {
        key: 'deleteSelection',
        value: function deleteSelection(e) {
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
            var tempArray = ["next", "prev", "parent"];
            for (var i = 0; i < tempArray.length; i++) {
                if (node.data[tempArray[i]]) {
                    locateNode = myDiagram.findNodeForKey(node.data[tempArray[i]]);
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

                if (node.data.category == "autoText") {
                    myDiagram.model.removeNodeData(node.data);
                } else {
                    this.deleteNode(node, e);
                }

                myDiagram.commitTransaction('sub');
                // myDiagram.model.removeNodeData(node.data);
                go.CommandHandler.prototype.deleteSelection.call(cmd);

                // myDiagram.updateAllTargetBindings();
            } catch (ex) {
                console.log(ex);
                myDiagram.commitTransaction("deleteSelection1");
                return;
            }
            // myDiagram.updateAllTargetBindings();
            myDiagram.commitTransaction("deleteSelection1");
            if (locateNode) {
                myDiagram.select(locateNode);
            }
        }
        //删除节点

    }, {
        key: 'deleteNode',
        value: function deleteNode(node, e) {
            console.log("deleteNodedeleteNodedeleteNodedeleteNode");
            var myDiagram = this.diagram;
            var mainNode = null;
            if (node instanceof go.Group) {
                //查找第一个节点
                node.memberParts.each(function (n) {
                    if (n.data.isparent) {
                        mainNode = n;
                    }
                });
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
                if (oldlink) {
                    delete oldlink.points;
                }
                link = JSON.parse(JSON.stringify(oldlink));
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
                        myDiagram.nodes.each(function (n) {
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
                                if (preNode.data.category !== "Root") {
                                    //zyy增加判断
                                    if (grandNode) {
                                        myDiagram.model.setDataProperty(preNode.data, "group", grandNode.data.group);
                                    } else {
                                        if (parGroup && parGroup.data.group) {
                                            myDiagram.model.setDataProperty(preNode.data, "group", parGroup.data.group);
                                        } else {
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
    }, {
        key: 'addLevelNodeData',
        value: function addLevelNodeData(node) {
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
            node.findNodesOutOf().each(function (n) {
                if (n.data.level == node.data.level) {
                    nextnode = n;
                }
            });

            var nextlink = null;
            //找到下一条边
            node.findLinksOutOf().each(function (l) {
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
                delete nextlink.data.points;
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
    }, {
        key: 'addFollower',
        value: function addFollower(e, iskeyboard) {
            if (!e) {
                var e = this.diagram.lastInput;
            }
            var myDiagram = e.diagram;
            var node = myDiagram.selection.first();
            if (!node) return;
            var diagram = node.diagram;
            // var isautolayout = window.localStorage.getItem('isautolayout') == null ? true : window.localStorage.getItem('isautolayout') == 'true';
            var isautolayout = true;
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

            if (typeof iskeyboard != 'undefined' && iskeyboard == true) {
                // check whether is a keyboard trigger the action
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
    }, {
        key: 'startNewSpiral',
        value: function startNewSpiral(iskeyboard) {
            var myDiagram = this.diagram;
            var e = myDiagram.lastInput;
            var node = myDiagram.selection.first();
            if (!node) return;
            var diagram = node.diagram;
            // var isautolayout = window.localStorage.getItem('isautolayout') == null ? true : window.localStorage.getItem('isautolayout') == 'true';
            var isautolayout = true;
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

    }, {
        key: 'addChildNodeData',
        value: function addChildNodeData(node) {
            console.log("===================天盘");
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
            node.findLinksOutOf().each(function (l) {
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

            if (node.data.category == "dipan" || node.data.category == 'Root') {
                //处理天盘
                linkToFollower.category = "dipan";
            }

            myDiagram.model.addLinkData(linkToFollower);
            if (firstLink != null) {
                var copyLink = {};
                // _.extendOwn(copyLink, firstLink.data);
                // copyLink = helpers.extend(copyLink, firstLink.data);
                delete firstLink.data.points;
                copyLink = JSON.parse(JSON.stringify(firstLink.data));
                delete copyLink.__gohashid;
                delete copyLink.points;
                copyLink.from = follower.key;
                copyLink.to = firstLink.data.to;
                myDiagram.model.removeLinkData(firstLink.data);
                myDiagram.model.addLinkData(copyLink);
                // myDiagram.model.setFromKeyForLinkData(firstLink.data, follower.key);
            }
            if (currentType == 'tianpan') {}
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

            //myDiagram.commitTransaction("new spiral");
            myDiagram.isModified = true;
            return follower;
        }
    }, {
        key: 'moveWithinNodes',
        value: function moveWithinNodes(direction) {
            var myDiagram = this.diagram;
            var node = myDiagram.selection.first();
            if (!node) {
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
    }, {
        key: 'selectText',
        value: function selectText(e) {
            var myDiagram = this.diagram;
            var node = myDiagram.selection.first();
            if (!node) return;
            // removeNodeRemarkTips();
            var tb = myDiagram.selection.first().findObject('TEXT');
            if (tb) myDiagram.commandHandler.editTextBlock(tb);
            helpers.simulateEnterWithAlt(e);
        }

        //快捷键

    }, {
        key: 'dokeyDownFn',
        value: function dokeyDownFn(e) {
            // console.log('myDiagram:', diagram);
            var diagram = this.diagram;
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
            if (e.event.keyCode === 13) {
                // could also check for e.control or e.shift
                var node = myDiagram.selection.first();
                if (node && node.data.parent) {
                    this.addFollower(e, true);
                }
                if (node && !node.data.parent) {
                    that.startNewSpiral(true);
                }
            } else if (e.event.keyCode === 9) {
                // could also check for e.control or e.shift
                that.startNewSpiral(true);
            } else if (e.key === "t") {
                // could also check for e.control or e.shift
                if (cmd.canCollapseSubGraph()) {
                    cmd.collapseSubGraph();
                } else if (cmd.canExpandSubGraph()) {
                    cmd.expandSubGraph();
                }
            } else if (e.key == "Del") {
                e.diagram.commandHandler.deleteSelection();
            } else if (e.event.keyCode == 113) {
                //F2,不知道为什么失效了，重新赋予功能
                // selectText();
                this.selectText(e, diagram);
            } else if (e.event.keyCode == 37) {
                //左
                this.moveWithinNodes('left', diagram);
                // go.CommandHandler.prototype.doKeyDown.call(cmd);
            } else if (e.event.keyCode == 38) {
                //上
                this.moveWithinNodes('up', diagram);
                // go.CommandHandler.prototype.doKeyDown.call(cmd);
            } else if (e.event.keyCode == 39) {
                //右
                this.moveWithinNodes('right', diagram);
                // go.CommandHandler.prototype.doKeyDown.call(cmd);
            } else if (e.event.keyCode == 40) {
                //下
                this.moveWithinNodes('down', diagram);
                // go.CommandHandler.prototype.doKeyDown.call(cmd);
            } else {
                // call base method with no arguments
                go.CommandHandler.prototype.doKeyDown.call(cmd);
            }
            e.bubbles = false; //阻止事件冒泡到dom
        }

        // 生成base64图片

    }, {
        key: 'downloadImage',
        value: function downloadImage() {
            var myDiagram = this.diagram;
            var imgdata = myDiagram.makeImageData({
                scale: 1.0,
                background: "#ffffff",
                type: "image/png",
                maxSize: new go.Size(9000, 9000)
            });

            return imgdata;
        }
    }, {
        key: 'getNodeSelectionAdornmentTemplate',
        value: function getNodeSelectionAdornmentTemplate() {
            return $(go.Adornment, "Spot", $(go.Panel, "Auto", $(go.Shape, { figure: "Circle", fill: 'rgba(255,0,120,0.2)', stroke: "#767678", strokeWidth: 12 }, new go.Binding("stroke", "", function (e, obj) {
                if (e.stroke) {
                    return tinycolor(e.stroke).saturate().toString();
                } else {
                    return "#767678";
                }
            }),
            // new go.Binding("fill","",function(e,obj){
            //   var radBrush = $(go.Brush, "Radial", { 0: "rgba(248,248,242,0)", 1: 'RGB(255,242,0)' });
            //   return radBrush;
            // })
            // ,
            new go.Binding("strokeWidth", "", function (e, obj) {
                if (e.strokeWidth) {
                    return e.strokeWidth + 5;
                } else {
                    return 6;
                }
            }), new go.Binding("width", "", function (e, obj) {
                return e.radius || 150;
            }), new go.Binding("height", "", function (e, obj) {
                return e.radius || 150;
            })), $(go.Placeholder) // this represents the selected Node

            ),
            // the button to create a "next" node, at the top-right corner
            $("Button", {
                name: "AddChild",
                toolTip: $(go.Adornment, "Auto", $(go.Shape, { fill: "#FFFFCC" }), $(go.TextBlock, { textAlign: 'center', margin: new go.Margin(8, 4, 4, 4) }, // the tooltip shows the result of calling nodeInfo(data)
                new go.Binding("text", "", function (d) {
                    return "增加子节点";
                }))),
                alignment: go.Spot.Top,
                alignmentFocus: go.Spot.Bottom,
                width: 30,
                height: 30,
                click: function click(e) {
                    e.diagram.__trtd.startNewSpiral();
                } // this function is defined below
            }, $(go.Shape, "PlusLine", { stroke: '#770077', desiredSize: new go.Size(15, 15) })), $("Button", {
                name: "AddLevel",
                toolTip: $(go.Adornment, "Auto", $(go.Shape, { fill: "#FFFFCC" }), $(go.TextBlock, { textAlign: 'center', margin: new go.Margin(8, 4, 4, 4) }, // the tooltip shows the result of calling nodeInfo(data)
                new go.Binding("text", "", function (d) {
                    return "增加同级节点";
                }))),
                alignment: new go.Spot(1, 0.5, 15, 0),
                width: 30,
                height: 30,
                click: function click(e) {
                    e.diagram.__trtd.addFollower(e);
                } // this function is defined below
            }, $(go.Shape, "PlusLine", { stroke: "#227700", desiredSize: new go.Size(15, 15) }), new go.Binding("visible", "level", function (level) {
                return level != 0; // hidden this button if current node is root node
            }))
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

    }, {
        key: 'orderChildNode',
        value: function orderChildNode(obj) {
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
                            myDiagram.model.setDataProperty(arr[i], "text", arr[i].text.replace(re, i + 1 + "."));
                        } else {
                            if (arr[i].text == '') {
                                myDiagram.model.setDataProperty(arr[i], "text", i + 1);
                            } else {
                                myDiagram.model.setDataProperty(arr[i], "text", i + 1 + "." + arr[i].text);
                            }
                        }
                    }
                } else {
                    console.log("无子节点！");
                }
                myDiagram.commitTransaction();
            };
        }
    }, {
        key: 'clearOrderChildNode',
        value: function clearOrderChildNode(obj) {
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
                            myDiagram.model.setDataProperty(arr[i], "text", arr[i].text.replace(re, ""));
                        }
                    }
                } else {
                    console.log("无子节点！");
                }
                myDiagram.commitTransaction();
            };
        }
    }]);

    return Trtd;
}(TRTD_BASE);

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

function applyTheme2Node(follower, node) {

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
    var geo = new go.Geometry().add(new go.PathFigure(p.x, p.y).add(new go.PathSegment(go.PathSegment.Arc, -sweep / 2, sweep, 0, 0, radius + layerThickness, radius + layerThickness)).add(new go.PathSegment(go.PathSegment.Line, q.x, q.y)).add(new go.PathSegment(go.PathSegment.Arc, sweep / 2, -sweep, 0, 0, radius, radius).close()));
    geo.normalize();
    return geo;
}

function getRootNodeData(model, nodeData, level) {
    var parent,
        root = nodeData;
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

    var style = {
        // width: 120,
        // height: 30,
        // margin: 2,
        // font: "bold 14px sans-serif",
        // margin: 3,
    };

    return $(go.Adornment, "Vertical", $("ContextMenuButton", $(go.TextBlock, "应用样式到所有同级节点"), {
        click: function click(e, obj) {
            menus.applyStyle2Level(e, obj);
        }
    }), $("ContextMenuButton", $(go.TextBlock, "应用样式到同级节点"), {
        click: function click(e, obj) {
            menus.applyStyle2CurLevel(e, obj);
        }
    }), $("ContextMenuButton", $(go.TextBlock, "应用样式到子节点"), {
        click: function click(e, obj) {
            menus.applyStyle2ChiLevel(e, obj);
        }
    }), $("ContextMenuButton", $(go.TextBlock, "添加"), {
        click: function click(e, obj) {
            menus.addFollower(e);
        }
    }), $("ContextMenuButton", $(go.TextBlock, "添加子节点"), {
        click: function click(e) {
            menus.startNewSpiral();
        }
    }), $("ContextMenuButton", $(go.TextBlock, "定位当前节点"), style, {
        click: centerCurrentNode
    }), $("ContextMenuButton", $(go.TextBlock, "删除"), style, {
        click: function click(e, obj) {
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
    $("ContextMenuButton", $(go.TextBlock, "清空文本"), style, {
        click: function click(e, obj) {
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
    }), $("ContextMenuButton", $(go.TextBlock, "删除 DEL"), style, {
        click: function click(e, obj) {
            var myDiagram = e.diagram;
            var node = myDiagram.selection.first();
            if (node) {
                yunpan.yunpandel(e);
            }
            //removeNodePicture();
        }
    }), $("ContextMenuButton", $(go.TextBlock, "增加 CTRL+X/Y"), style, {
        click: function click(e, obj) {
            var myDiagram = e.diagram;
            var node = myDiagram.selection.first();
            if (node) {
                if (node.data.loc.split(" ")[1] === "0" && node.data.category !== "x") {
                    yunpan.addy(e);
                } else if (node.data.loc.split(" ")[0] === "0" && node.data.category !== "y") {
                    yunpan.addx(e);
                };
            }
            //removeNodePicture();
        }
    }), $("ContextMenuButton", $(go.TextBlock, "删除 DEL"), style, {
        click: function click(e, obj) {
            var myDiagram = e.diagram;
            var node = myDiagram.selection.first();
            if (node) {
                yunpan.yunpandel(e);
            }
            //removeNodePicture();
        }
    }), $("ContextMenuButton", $(go.TextBlock, "增加同级节点"), style, {
        click: function click(e, obj) {
            var myDiagram = e.diagram;
            var node = myDiagram.selection.first();
            if (myDiagram.selection.first().data.istemp) {
                return;
            }
            dipan.addFollowerGround(e);
        }
    }), $("ContextMenuButton", $(go.TextBlock, "增加子节点"), style, {
        click: function click(e, obj) {
            var myDiagram = e.diagram;
            var node = myDiagram.selection.first();
            if (node.data.parent) {
                var parentNode = node.diagram.findNodeForKey(node.data.parent);
                if (parentNode.data.istemp) {
                    return;
                }
            }
            dipan.addNewCircle(e);
        }
    }), $("ContextMenuButton", $(go.TextBlock, "删除"), style, {
        click: function click(e, obj) {
            var myDiagram = e.diagram;
            var node = myDiagram.selection.first();
            if (node.data.parent) {
                var parentNode = node.diagram.findNodeForKey(node.data.parent);
                if (parentNode.data.istemp) {
                    return;
                }
            }
            dipan.addNewCircle(e);
        }
    }), $("ContextMenuButton", $(go.TextBlock, "复制副本"), style, {
        click: function click(e, obj) {
            var myDiagram = e.diagram;
            var node = myDiagram.selection.first();
            if (myDiagram.selection.first().data.istemp) {
                return;
            }
            dipan.addFollowerGround(e);
        }
    }), $("ContextMenuButton", $(go.TextBlock, "权限设置"), style, {
        click: function click(e, obj) {
            var myDiagram = e.diagram;
            var node = myDiagram.selection.first();
            if (node.data.parent) {
                var parentNode = node.diagram.findNodeForKey(node.data.parent);
                if (parentNode.data.istemp) {
                    return;
                }
            }
            dipan.addNewCircle(e);
        }
    }), $("ContextMenuButton", $(go.TextBlock, "删除"), style, {
        click: function click(e, obj) {
            var myDiagram = e.diagram;
            var node = myDiagram.selection.first();
            if (node.data.parent) {
                var parentNode = node.diagram.findNodeForKey(node.data.parent);
                if (parentNode.data.istemp) {
                    return;
                }
            }
            dipan.addNewCircle(e);
        }
    }));
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

    return cur.data.parent != null;
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
    var tdCurrentTheme = myDiagram.__trtd.tdCurrentTheme;
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
        var root = getRootNodeData(diagram.model, node.data, 0);
        diagram.startTransaction("ControlAutoLayout");
        helpers.tdTravelTdpData(root, diagram.model, [], function (d) {

            if (diagram.findNodeForKey(d.key).containingGroup && diagram.findNodeForKey(d.key).containingGroup.layout) {
                diagram.findNodeForKey(d.key).containingGroup.layout.isInitial = flag;
                diagram.findNodeForKey(d.key).containingGroup.layout.isOngoing = flag;
            }
        });
        if (root.group && diagram.findNodeForKey(root.group)) {
            diagram.findNodeForKey(root.group).layout.isInitial = flag;
            diagram.findNodeForKey(root.group).layout.isOngoing = flag;
        } else {
            diagram.layout.isInitial = flag;
            diagram.layout.isOngoing = flag;
        }
    } else {
        diagram.nodes.each(function (node) {
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
    var tdCurrentTheme = node.diagram.__trtd.tdCurrentTheme;
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

    if (node.data.next) {
        // 如果存在下一个节点，则新节点位于当前节点和下一个节点之间，稍微偏差一点
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

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// 返回图片天盘节点模板
var $ = go.GraphObject.make;

module.exports = function createPictureNodeTemplate(diagram) {
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
        doubleClick: function doubleClick(e, node) {
            interactions.selectText(e, node);
        },
        //toMaxLinks: 1,
        layoutConditions: go.Part.LayoutStandard,
        //layoutConditions:~go.Part.LayoutAdded,    
        // fromLinkable: true, toLinkable: true,
        alignment: go.Spot.Center,
        alignmentFocus: go.Spot.Center,
        resizeAdornmentTemplate: diagram.__trtd.nodeResizeAdornmentTemplate(),

        contextMenu: $(go.Adornment),
        selectionAdornmentTemplate: diagram.__trtd.getNodeSelectionAdornmentTemplate()
        //layoutConditions: go.Part.LayoutStandard & ~go.Part.LayoutNodeSized & ~go.Part.LayoutAdded
    }, new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify), new go.Binding("isShadowed", "isShadowed").makeTwoWay(), $(go.Panel, "Spot", $(go.Picture, // the icon showing the logo
    // You should set the desiredSize (or width and height)
    // whenever you know what size the Picture should be.
    { name: "SHAPE" }, {
        sourceCrossOrigin: function sourceCrossOrigin(pict) {
            return "Anonymous";
        }
    }, new go.Binding("source", "picture", function (v) {

        return v + "?" + Date.now();
    }).makeTwoWay(function (v) {
        if (v) {
            v = v.replace(/\?.*$/g, "");
            return v;
        } else {
            return "";
        }
    }), new go.Binding("width", "width", function (v, d) {
        return v;
    }).makeTwoWay(function (v) {
        return v;
    }), new go.Binding("height", "height", function (v, d) {
        return v;
    }).makeTwoWay(function (v) {
        return v;
    })), $(go.TextBlock, {
        name: "TEXT",
        alignment: new go.Spot(0.5, 0.5),
        font: "bold 18px 幼圆",
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
    }, new go.Binding("textAlign", "textAlign", function (v) {
        return _.contains(['start', 'center', 'end'], v) ? v : "center";
    }).makeTwoWay(), new go.Binding("spacingAbove", "spacingline", function (v) {
        return tdTransToNum(v, 4);
    }).makeTwoWay(), new go.Binding("spacingBelow", "spacingline", function (v) {
        return tdTransToNum(v, 4);
    }).makeTwoWay(),
    //new go.Binding("width","width",function(v){return v/2 * Math.sqrt(2)+7;}).ofObject("SHAPE"),
    new go.Binding("maxSize", "width", function (v) {
        var va = v / 2 * Math.sqrt(2);
        return new go.Size(va, va);
    }).ofObject("SHAPE"),
    // new go.Binding("height","width",function(v){return v/2 * Math.sqrt(2);;}).ofObject("SHAPE"),
    new go.Binding("text", "text").makeTwoWay(), new go.Binding("stroke", "textStroke").makeTwoWay(), new go.Binding("font", "font").makeTwoWay())), {
        toolTip: $(go.Adornment, "Auto", $(go.Shape, { fill: "#FFFFCC" }), $(go.TextBlock, { margin: 4 }, // the tooltip shows the result of calling nodeInfo(data)
        new go.Binding("text", "", function (d) {
            return d.text;
        })))
    });
};

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var $ = go.GraphObject.make;
var svg = __webpack_require__(8);

// 返回svg节点
module.exports = function createNodeSvgTemplate(diagram) {
    var properties = {
        figure: "Circle",
        fill: "white",
        strokeWidth: 2,
        stroke: "black",
        fontSize: 15,
        font: "sans-serif"
    };
    return $(go.Node, "Spot", {
        name: "NODE",
        "_controlExpand": true,
        layerName: "Background",
        locationSpot: go.Spot.Center,
        resizeCellSize: new go.Size(10, 10),
        locationObjectName: "BACKGROUND",
        resizable: true,
        resizeObjectName: "BACKGROUND", // user can resize the Shape
        rotatable: true,
        rotateObjectName: "BACKGROUND", // rotate the Shape without rotating the label
        click: function click(e, node) {
            // console.log(node.data);
        },
        doubleClick: function doubleClick(e, node) {
            doubleClickCreateNodeType(e);
        },
        selectable: true,
        selectionObjectName: "BACKGROUND",
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
        contextMenu: $(go.Adornment)
        // contextMenu: $(go.Adornment),
    }, new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify), new go.Binding("isShadowed", "isShadowed").makeTwoWay(), new go.Binding("selectable", "selectable").makeTwoWay(), new go.Binding("movable", "movable").makeTwoWay(), new go.Binding("deletable", "deletable").makeTwoWay(), $(go.Shape, {
        name: "SHAPE",
        geometryString: svg.threeWheel,
        fill: "black",
        strokeWidth: 5,
        stroke: "black",
        minSize: new go.Size(50, 50)
    }, new go.Binding("fill", "fill").makeTwoWay(function (v) {
        return v;
    }), new go.Binding("stroke", "stroke").makeTwoWay(function (v) {
        return v;
    }), new go.Binding("strokeWidth", "strokeWidth").makeTwoWay(function (v) {
        return v;
    }), new go.Binding("desiredSize", "desiredSize", function (v) {
        // var va = (v / 2) * Math.sqrt(2);
        // console.log("desiredSize",v)
        return v;
    }).ofObject("BACKGROUND"), new go.Binding("angle", "angle", function (v) {
        // var va = (v / 2) * Math.sqrt(2);
        // console.log("desiredSize",v)
        return v;
    }).ofObject("BACKGROUND"), new go.Binding("geometryString", "geometryValue", function (v) {
        return svg[v];
    })), $(go.Shape, "Rectangle", {
        name: 'BACKGROUND',
        fill: "rgba(1,1,1,0)",
        // width: 450,
        // height: 450,
        stroke: "rgba(1,1,1,0)"
        // minSize: new go.Size(50, 50),
    }, new go.Binding("desiredSize", "desiredSize", function (v, d) {
        // console.log("vd m", v, d )
        if (!v) return d.part.findObject("SHAPE").measuredBounds.size;
        return go.Size.parse(v);
    }).makeTwoWay(function (v) {
        return go.Size.stringify(v);
    }), new go.Binding("angle", "angle").makeTwoWay(function (v) {
        return v;
    })
    // new go.Binding("desiredSize", "height", function(v) {
    //     var radius = parseInt(v ? v : 100);
    //     var size = new go.Size(radius, radius);
    //     return size;
    // }).makeTwoWay(function(v) {
    //     return v.height;
    // }),
    // background: "#555",
    // stroke: "red"}
    ));
};

function doubleClickCreateNodeType(e) {
    // console.log('eeeeeeeeeeeeeee:', e);
    var myDiagram = e.diagram;
    myDiagram.startTransaction();
    var text = { text: "双击编辑文本", category: 'text' };
    text.loc = go.Point.stringify(myDiagram.lastInput.documentPoint);
    myDiagram.model.addNodeData(text);
    myDiagram.commitTransaction();
}

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var $ = go.GraphObject.make;

module.exports = // 返回天盘模板
function createNodeTemplate(diagram) {
    var properties = {
        figure: "Circle",
        fill: "white",
        strokeWidth: 2,
        stroke: "black",
        fontSize: 15,
        font: "sans-serif"
    };

    return $(go.Node, "Spot", {
        "_controlExpand": true,
        layerName: "default",
        locationSpot: go.Spot.Center,
        resizeCellSize: new go.Size(10, 10),
        locationObjectName: "SHAPE",
        resizable: true,
        resizeObjectName: "SHAPE", // user can resize the Shape
        rotatable: false,
        location: new go.Point(0, 0),
        click: function click(e, node) {
            console.log(node.data);
            if (node.diagram.__trtd.nodeClickListener) {
                node.diagram.__trtd.nodeClickListener(node);
            }
            // showNodeToolBar(e,node);
        },
        //rotateObjectName: "SHAPE",  // rotate the Shape without rotating the label
        doubleClick: function doubleClick(e, node) {
            e.diagram.__trtd.selectText(e, node);
        },
        toMaxLinks: 1,
        layoutConditions: go.Part.LayoutStandard,
        //layoutConditions:~go.Part.LayoutAdded,
        // fromLinkable: true, toLinkable: true,
        alignment: go.Spot.Center,
        alignmentFocus: go.Spot.Center,
        resizeAdornmentTemplate: diagram.__trtd.nodeResizeAdornmentTemplate(),
        // contextMenu: $(go.Adornment),
        contextMenu: $(go.Adornment),
        selectionAdornmentTemplate: diagram.__trtd.getNodeSelectionAdornmentTemplate(),
        mouseOver: function mouseOver(e, node) {
            // if(node.data.hyperlink){
            //   var textObj = node.findObject('TEXT');
            //   textObj.isUnderline = true;
            // }

            diagram.__trtd.showNodeRemarkTips(e, node);
        },
        mouseLeave: function mouseLeave(e, node) {
            // if(node.data.hyperlink) {
            //   var textObj = node.findObject('TEXT');
            //   textObj.isUnderline = false;
            // }
            diagram.__trtd.removeNodeRemarkTips();
        },
        mouseDragEnter: function mouseDragEnter(e, obj) {
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
        },
        mouseDragLeave: function mouseDragLeave(e, obj) {
            var node = obj.part;
            var shape = node.findObject("SHAPE");
            if (shape && shape._prevFill) {
                shape.fill = shape._prevFill; // restore the original brush
            }
            //node.removeAdornment("dragEnter");
        },
        mouseDrop: function mouseDrop(e, obj) {
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
        } }, new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify), new go.Binding("isShadowed", "isShadowed").makeTwoWay(), new go.Binding("selectable", "selectable").makeTwoWay(), new go.Binding("movable", "movable").makeTwoWay(), new go.Binding("deletable", "deletable").makeTwoWay(), $(go.Shape, {
        strokeDashArray: null,
        // strokeDashOffset:10,
        name: "SHAPE",
        figure: "Circle",
        fill: "rgba(0,0,0,0)",
        fromLinkable: true,
        toLinkable: true,
        cursor: "pointer",
        minSize: new go.Size(50, 50),
        strokeWidth: 2,
        stroke: "black",
        portId: ""

    }, new go.Binding("strokeDashArray", "strokeDashArray", function (v) {
        try {
            var val = [parseInt(v.split(" ")[0]), parseInt(v.split(" ")[1])];
        } catch (e) {
            var val = null;
        }
        return val;
    }).makeTwoWay(function (v) {
        return v[0] + " " + v[1];
    }), //保留，设置边线样式
    new go.Binding("fill", "fill", function (v, obj) {
        return v instanceof go.Brush ? v.color : v;
    }).makeTwoWay(),
    // new go.Binding("fill", "isSelected", function(s, obj) { return s ? "red" : obj.part.data.color; }).ofObject()),
    new go.Binding("desiredSize", "radius", function (v) {
        //alert(v);
        var radius = parseInt(v ? v : 100);
        var size = new go.Size(radius, radius);
        return size;
    }).makeTwoWay(function (v) {
        return v.width;
    }), new go.Binding("stroke", "stroke", function (v) {
        return v instanceof go.Brush ? v.stroke : v;
    }).makeTwoWay(), new go.Binding("strokeWidth", "strokeWidth", function (d) {
        return d;
    }).makeTwoWay(function (d) {
        return d;
    }), new go.Binding("figure", "figure").makeTwoWay(), {
        figure: properties.figure,
        fill: properties.fill,
        strokeWidth: properties.strokeWidth,
        stroke: properties.stroke
    }), $(go.Shape, {
        name: "SHAPE_Back",
        figure: "Rectangle",
        fill: "rgba(128,128,128,0)",
        fromLinkable: true,
        toLinkable: true,
        strokeWidth: 0
    }, new go.Binding("desiredSize", "width", function (v) {
        var va = v / 2 * Math.sqrt(2);
        return new go.Size(va - 3, va - 3);
    }).ofObject("SHAPE")), $(go.Panel, "Table", $(go.RowColumnDefinition, { column: 0, width: 0
        // new go.Binding('width','hyperlink',function(v){
        //   return v?10:0;
        // })
    }), $(go.Shape, 'Rectangle', {
        row: 0,
        column: 0,
        // width:10,
        fill: 'rgba(0,255,0,0)',
        strokeWidth: 0
    }), $(go.Panel, "Auto", { row: 1, column: 0 }, $(go.Shape, "RoundedRectangle", { fill: "rgba(0,0,0,0)", strokeWidth: 0 }), $(go.Picture, {
        alignment: go.Spot.Left,
        click: function click(e) {
            alert('picture clicked');
        },
        name: 'Picture',
        // source: 'media/images/Katong/little-boy-black.png',
        desiredSize: new go.Size(10, 10)

        // new go.Binding("source", "key", findHeadShot)
    })), $(go.Shape, 'Rectangle', {
        row: 2,
        column: 0,
        // width:10,
        fill: 'rgba(0,0,0,0)',
        strokeWidth: 0
    }), $(go.Panel, "Auto", { row: 0, column: 1, rowSpan: 3 }, $(go.TextBlock, {
        // stretch: go.GraphObject.Vertical,
        name: "TEXT",
        alignment: new go.Spot(0.5, 0.5),
        font: "bold 18px 幼圆",
        // editable: true,
        //margin: 3, editable: true,
        stroke: "black",
        isMultiline: true,
        overflow: go.TextBlock.OverflowClip,
        wrap: go.TextBlock.WrapDesiredSize,
        textAlign: "center",
        spacingAbove: 4,
        spacingBelow: 4,
        portId: "TEXT",
        stretch: go.GraphObject.Fill,
        click: function click(e, node) {}
    }, new go.Binding("textAlign", "textAlign", function (v) {
        return _.contains(['start', 'center', 'end'], v) ? v : "center";
    }).makeTwoWay(), new go.Binding("spacingAbove", "spacingline", function (v) {
        return tdTransToNum(v, 4);
    }).makeTwoWay(), new go.Binding("spacingBelow", "spacingline", function (v) {
        return tdTransToNum(v, 4);
    }).makeTwoWay(), new go.Binding("width", "width", function (v) {
        var va = v / 2 * Math.sqrt(2);
        return va;
    }).ofObject("SHAPE"), new go.Binding("text", "text").makeTwoWay(), new go.Binding("stroke", "textStroke").makeTwoWay(), new go.Binding("font", "font").makeTwoWay()))));
};

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var svg = {
    'threeWheel': 'M 225 0 C 100.736 0 0 100.735 0 225 s 100.736 225 225 225 c 124.265 0 225.001 -100.734 225.001 -225 C 450.002 100.735 349.265 0 225 0 Z M 225 1.515 c 62.006 0 118.106 25.257 158.591 66.037 c -38.634 133.172 -160.888 157.047 -160.888 157.047 l 0.047 0.083 h -0.051 C 123.453 130.609 19.61 161.966 9.597 165.291 C 35.716 70.857 122.255 1.515 225 1.515 Z M 1.517 225 c 0 -20.075 2.663 -39.524 7.627 -58.035 c 6.686 -2.295 111.992 -36.362 212.807 58.54 c -3.347 10.815 -36.032 125.634 54.089 217.118 c -16.395 3.83 -33.479 5.859 -51.04 5.859 C 101.575 448.482 1.517 348.428 1.517 225 Z M 277.292 442.318 c -89.298 -94.891 -57.746 -204.506 -53.915 -216.53 l 0.076 0.135 c 0 0 126.301 -26.492 161.022 -157.465 c 39.584 40.319 64.008 95.575 64.008 156.542 C 448.483 330.418 375.489 418.773 277.292 442.318 Z',
    'fireWheel': 'M225.000,450.000 C100.736,450.000 -0.000,349.264 -0.000,225.000 C-0.000,100.736 100.736,-0.000 225.000,-0.000 C349.264,-0.000 450.000,100.736 450.000,225.000 C450.000,349.264 349.264,450.000 225.000,450.000 ZM225.000,448.000 C338.085,448.000 431.498,363.821 446.026,254.709 C432.978,302.699 389.123,338.000 337.000,338.000 C274.592,338.000 224.000,287.408 224.000,225.000 C224.000,163.696 174.304,114.000 113.000,114.000 C51.696,114.000 2.000,163.696 2.000,225.000 C2.000,348.159 101.841,448.000 225.000,448.000 ZM225.000,2.000 C111.915,2.000 18.502,86.179 3.974,195.291 C17.022,147.301 60.877,112.000 113.000,112.000 C175.408,112.000 226.000,162.592 226.000,225.000 C226.000,286.304 275.696,336.000 337.000,336.000 C398.304,336.000 448.000,286.304 448.000,225.000 C448.000,225.000 448.000,225.000 448.000,225.000 C448.000,101.841 348.159,2.000 225.000,2.000 Z',
    'goldWheel': 'M449.993,0.008 L225.395,287.495 L355.004,449.995 L94.004,449.995 L224.597,287.502 L-0.008,0.008 L449.993,0.008 Z',
    'waterWheel': 'M268.000,443.000 C299.658,443.000 328.270,429.976 348.785,409.000 L351.564,409.000 C330.601,431.167 300.917,445.000 268.000,445.000 C204.487,445.000 153.000,393.513 153.000,330.000 C153.000,282.847 181.389,242.341 222.000,224.593 L222.000,224.508 C263.076,207.589 292.000,167.180 292.000,120.000 C292.000,57.592 241.408,7.000 179.000,7.000 C148.889,7.000 121.551,18.800 101.296,38.000 L98.382,38.000 C119.136,17.594 147.595,5.000 179.000,5.000 C242.513,5.000 294.000,56.487 294.000,120.000 C294.000,167.153 265.611,207.659 225.000,225.407 L225.000,225.478 C183.921,242.396 155.000,282.817 155.000,330.000 C155.000,392.408 205.592,443.000 268.000,443.000 Z'
};

module.exports = svg;

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var helpers = __webpack_require__(0);

function adustOliveText(d) {
    setTimeout(function () {
        try {
            console.log("check overflow");
            if (!d.text) return;
            if (d.text && d.text.trim() == "") return;
            if (d.lineCount % 2 != 0) {
                if (d.text[d.text.length - 1] == "\n") {
                    d.text = d.text.substring(0, d.text.length - 1);
                    return;
                }
                d.text = d.text + "\n";
            }
            // if(d && d.lineCount!=null && d.lineCount%2 != 0){
            //   if(d.text && d.text[d.text.length-1] != "\n"){
            //     d.text+="\n"
            //   }
            // }
        } catch (e) {
            console.error(e);
        }
    }, 100);
}

function adjustTextAngle(obj, shi, xu, group) {
    var groupTextAngle = group.data.textAngle || "vertical"; // "vertical"
    var textAngle;
    if (obj.data.order % 2 == 0) {
        // 偶数
        // 偶数实线在上
        if (shi) {

            if (!shi.data.nangle) {
                textAngle = groupTextAngle;
            } else {
                textAngle = shi.data.textAngle || groupTextAngle;
            }
            // if(!shi.data.nloc){
            //     shi.location = obj.location.copy().offset(obj.naturalBounds.width/2, -obj.naturalBounds.height/2)
            // }
            if (textAngle == "horizontal") {
                // if(!shi.data.nloc){
                shi.locationSpot = new go.Spot(1, 1, 0, 0);
                // }
                shi.angle = 0;
                // 
                // if(shi.data.textAlign == null){
                // shi.findObject("TEXT").textAlign = "center";
                // }
            }
            shi.__location = obj.location.copy().offset(obj.naturalBounds.width / 2, 0);
            shi.__location = computeNewRotateLoc(group.location, shi.__location, obj.angle);
            if (!shi.data.nloc) {
                shi.location = obj.location.copy().offset(obj.naturalBounds.width / 2, -obj.naturalBounds.height / 2);
                shi.location = computeNewRotateLoc(group.location, shi.location, obj.angle);
                // shi.location = shi.__location.copy()
                // delete shi.__offset
                delete shi.__switchOrder;
            } else {

                if (!shi.__offset) {
                    shi.__offset = shi.__location.copy().subtract(shi.location);
                } else {
                    shi.location = shi.__location.copy().subtract(shi.__offset);
                    // if(shi.__switchOrder){
                    //     shi.__offset.x = -shi.__offset.x
                    //     shi.__offset.y = -shi.__offset.y
                    //     shi.location = shi.__location.copy().subtract(shi.__offset)
                    //     delete shi.__switchOrder
                    //     shi.__offset = shi.__location.copy().subtract(shi.location)
                    // }else{
                    //     shi.location = shi.__location.copy().subtract(shi.__offset)
                    // }
                    // xu.location = xu.__location.copy().offset(-Math.abs(xu.__offset.x), -Math.abs(xu.__offset.y))
                    // xu.location = xu.__location.copy().subtract(xu.__offset)
                }
            }
            if (textAngle == "vertical") {
                // if(!shi.data.nloc){
                shi.locationSpot = new go.Spot(0.5, 1, 0, 0);
                // }
                shi.angle = obj.angle;
                // if(shi.data.textAlign == null){
                // obj.diagram.model.setDataProperty(shi.data,"textAlign", "left")
                // shi.findObject("TEXT").textAlign = "center";
                // }
            }
        }
        if (xu) {
            if (!xu.data.nangle) {
                textAngle = groupTextAngle;
            } else {
                textAngle = xu.data.textAngle || groupTextAngle;
            }

            if (textAngle == "horizontal") {
                // if(!xu.data.nloc){
                xu.locationSpot = new go.Spot(0, 0, 0, 0);
                // }
                xu.angle = 0;
                // obj.diagram.model.setDataProperty(xu.data,"textAlign", "left")
                // if(xu.data.textAlign == null){
                // xu.findObject("TEXT").textAlign = "center"
                // }
            }
            console.log("xuxuxuxuxxuxu", xu.data.order);
            xu.__location = obj.location.copy().offset(obj.naturalBounds.width / 2, 0);
            xu.__location = computeNewRotateLoc(group.location, xu.__location, obj.angle);
            if (!xu.data.nloc) {
                xu.location = obj.location.copy().offset(obj.naturalBounds.width / 2, obj.naturalBounds.height / 2);
                xu.location = computeNewRotateLoc(group.location, xu.location, obj.angle);
                // xu.location = xu.__location.copy()
                // delete xu.__offset
                delete xu.__switchOrder;
            } else {

                if (!xu.__offset) {
                    xu.__offset = xu.__location.copy().subtract(xu.location);
                } else {
                    xu.location = xu.__location.copy().subtract(xu.__offset);
                    // if(xu.__switchOrder){
                    //     xu.__offset.x = -xu.__offset.x
                    //     xu.__offset.y = -xu.__offset.y
                    //     xu.location = xu.__location.copy().subtract(xu.__offset)
                    //     delete xu.__switchOrder
                    //     xu.__offset = xu.__location.copy().subtract(xu.location)
                    // }else{
                    //     xu.location = xu.__location.copy().subtract(xu.__offset)
                    // }
                    // xu.location = xu.__location.copy().offset(-Math.abs(xu.__offset.x), -Math.abs(xu.__offset.y))
                    // xu.location = xu.__location.copy().subtract(xu.__offset)
                }
            }
            // if(xu.data.key == "9fe41098-8d5a-e18f-b79a-b4693eacd39d"){
            //     console.log(`location: ${go.Point.stringify(xu.location)}
            //     __location: ${go.Point.stringify(xu.__location)}
            //     __offset: ${go.Point.stringify(xu.__offset)}
            //     `)
            // }
            if (textAngle == "vertical") {
                // if(!xu.data.nloc){
                xu.locationSpot = new go.Spot(0.5, 0, 0, 0);
                // }
                xu.angle = obj.angle;
                // obj.diagram.model.setDataProperty(xu.data,"textAlign", "left")
                // if(xu.data.textAlign == null){
                // xu.findObject("TEXT").textAlign = "center"
                // }
            }
        }
    } else {
        // 奇数
        // 奇数实线在下
        if (shi) {
            if (!shi.data.nangle) {
                textAngle = groupTextAngle;
            } else {
                textAngle = shi.data.textAngle || groupTextAngle;
            }
            shi.__location = obj.location.copy().offset(obj.naturalBounds.width / 2, 0);
            shi.__location = computeNewRotateLoc(group.location, shi.__location, obj.angle);
            if (!shi.data.nloc) {
                shi.location = obj.location.copy().offset(obj.naturalBounds.width / 2, obj.naturalBounds.height / 2);
                shi.location = computeNewRotateLoc(group.location, shi.location, obj.angle);
                // shi.location = shi.__location.copy()
                // delete shi.__offset
                delete shi.__switchOrder;
            } else {

                if (!shi.__offset) {
                    shi.__offset = shi.__location.copy().subtract(shi.location);
                } else {
                    shi.location = shi.__location.copy().subtract(shi.__offset);
                    // if(shi.__switchOrder){
                    //     shi.__offset.x = -shi.__offset.x
                    //     shi.__offset.y = -shi.__offset.y
                    //     shi.location = shi.__location.copy().subtract(shi.__offset)
                    //     delete shi.__switchOrder
                    //     shi.__offset = shi.__location.copy().subtract(shi.location)
                    // }else{
                    //     shi.location = shi.__location.copy().subtract(shi.__offset)
                    // }
                    // xu.location = xu.__location.copy().offset(-Math.abs(xu.__offset.x), -Math.abs(xu.__offset.y))
                    // xu.location = xu.__location.copy().subtract(xu.__offset)
                }
            }
            if (textAngle == "horizontal") {
                // if(!shi.data.nloc){
                shi.locationSpot = new go.Spot(0, 0, 0, 0);
                // }
                shi.angle = 0;
                // obj.diagram.model.setDataProperty(shi.data,"textAlign", "left")
                // if(shi.data.textAlign == null){
                // shi.findObject("TEXT").textAlign = "center";
                // }
            }
            if (textAngle == "vertical") {
                // if(!shi.data.nloc){
                shi.locationSpot = new go.Spot(0.5, 0, 0, 0);
                // }
                shi.angle = obj.angle;
                // if(shiTextColl[index].data.textAlign == null){
                // obj.diagram.model.setDataProperty(shiTextColl[index].data,"textAlign", "left")
                // shiTextColl[index].findObject("TEXT").textAlign = "center";
                // }   
            }
        }
        if (xu) {
            if (!xu.data.nangle) {
                textAngle = groupTextAngle;
            } else {
                textAngle = xu.data.textAngle || groupTextAngle;
            }
            xu.__location = obj.location.copy().offset(obj.naturalBounds.width / 2, 0);
            xu.__location = computeNewRotateLoc(group.location, xu.__location, obj.angle);
            if (!xu.data.nloc) {
                xu.location = obj.location.copy().offset(obj.naturalBounds.width / 2, -obj.naturalBounds.height / 2);
                xu.location = computeNewRotateLoc(group.location, xu.location, obj.angle);
                // xu.location = xu.__location.copy()
                // delete xu.__offset
                delete xu.__switchOrder;
            } else {

                if (!xu.__offset) {
                    xu.__offset = xu.__location.copy().subtract(xu.location);
                } else {
                    xu.location = xu.__location.copy().subtract(xu.__offset);
                    // if(xu.__switchOrder){
                    //     xu.__offset.x = -xu.__offset.x
                    //     xu.__offset.y = -xu.__offset.y
                    //     xu.location = xu.__location.copy().subtract(xu.__offset)
                    //     delete xu.__switchOrder
                    //     xu.__offset = xu.__location.copy().subtract(xu.location)
                    // }else{
                    //     xu.location = xu.__location.copy().subtract(xu.__offset)
                    // }
                    // xu.location = xu.__location.copy().offset(-Math.abs(xu.__offset.x), -Math.abs(xu.__offset.y))
                    // xu.location = xu.__location.copy().subtract(xu.__offset)
                }
            }
            // if(xu.data.key == "9fe41098-8d5a-e18f-b79a-b4693eacd39d"){
            //     console.log(`location: ${go.Point.stringify(xu.location)}
            //     __location: ${go.Point.stringify(xu.__location)}
            //     __offset: ${go.Point.stringify(xu.__offset)}
            //     `)
            // }
            if (textAngle == "horizontal") {
                // obj.diagram.model.setDataProperty(xu.data,"textAlign", "right")
                // if(xu.data.textAlign == null){
                // xu.findObject("TEXT").textAlign = "center";
                // }
                // if(!xu.data.nloc){
                xu.locationSpot = new go.Spot(1, 1, 0, 0);
                // }
                xu.angle = 0;
            }

            if (textAngle == "vertical") {
                // if(!xu.data.nloc){
                xu.locationSpot = new go.Spot(0.5, 1, 0, 0);
                // }
                xu.angle = obj.angle;
                // obj.diagram.model.setDataProperty(xuTextColl[index].data,"textAlign", "left")
                // if(xuTextColl[index].data.textAlign == null){
                // xuTextColl[index].findObject("TEXT").textAlign = "center"
                // }
            }
        }
    }
}

function layoutWaveGroup(it, diagram, group) {

    var collection = [];
    // var group = this.group
    var oliveWidth = group.data.oliveWidth;
    var oliveHeight = group.data.oliveHeight;
    var shiStroke = group.data.shiStroke;
    var xuStroke = group.data.xuStroke;
    var centerStroke = group.data.centerStroke || "#3f5369";
    var oliveType = group.data.oliveType || "Ellipse";
    var haveTail = group.data.haveTail || false;
    var textAngle = group.data.textAngle || "vertical"; // "vertical"
    // group.location = new go.Point(0,0)
    var maxWidth = 0;
    var maxHeight = 0;
    var line;
    var waveTotalSize = oliveWidth * 2 / 3;
    var shiTextColl = [];
    var xuTextColl = [];
    var centerTextColl = [];
    var shiStrokeWidth, xuStrokeWidth, shiStrokeDashArray, xuStrokeDashArray;
    var autogroupConfig; // 自动布局配置
    // 增加波形双螺旋的开放尾部
    // var tailOlive = {"category":"waveTail", 
    //     "text":"       ", 
    //     "level":0, "key": helpers.guid(), 
    //     "group":node.data.group, 
    //     "loc":node.data.loc,
    //     "desiredSize":node.data.desiredSize, 
    //     "order": 2000,
    // }

    // if(oliveType == "Wave" && haveTail){
    //     // 查找是否包含尾部
    //     while(it.next()){
    //         var node = it.value;
    //         if(node.data.role == "waveTail"){

    //         }
    //     }
    //     it.reset(); // 重置索引
    // }

    while (it.next()) {
        var node = it.value;
        // var item = git.value;
        //   console.log("item:",item)

        //   console.log(node.data)
        if (node.data.role == "shiText") {
            shiTextColl.push(node);
        }
        if (node.data.role == "xuText") {
            xuTextColl.push(node);
        }
        if (node.data.role == "centerText") {
            centerTextColl.push(node);
        }
        if (node instanceof go.Node) {
            // position the node . . .
            if (node.data.category == "line") {
                line = node;
                node.location = group.location.copy().offset(0, 0);
                node.angle = group.angle;
            }
            if (node.data.category == "wave") {
                // node.width = oliveWidth
                // node.desiredSize = new go.Size(200,100)

                if (oliveType == "Ellipse") {
                    node.diagram.model.setDataProperty(node.data, "oliveType", "Ellipse");
                    node.diagram.model.setDataProperty(node.data, "desiredSize", oliveWidth + " " + oliveHeight);
                } else {
                    // 设置橄榄类型为波形
                    node.diagram.model.setDataProperty(node.data, "oliveType", "Wave");
                    // 设置波形的尾部开放
                    if (node.data.role == "waveTail") {
                        node.diagram.model.setDataProperty(node.data, "desiredSize", oliveWidth / 2 + " " + oliveHeight);
                        node.diagram.model.setDataProperty(node.data, "selectable", false);
                    } else {
                        node.diagram.model.setDataProperty(node.data, "desiredSize", oliveWidth + " " + oliveHeight);
                    }
                }

                // if(node.findObject("TEXT").lineCount %2 != 0){
                //     if(node.data.text && node.data.text[node.data.text.length-1] != "\n"){
                //         node.data.text+="\n"
                //       }
                //     node.diagram.model.setDataProperty(node.data, "text",node.data.text)
                // }
                // if(node.data.role == "waveTail"){
                //     node.diagram.model.setDataProperty(node.data, "desiredSize",`${oliveWidth/2} ${oliveHeight}`)
                //     node.diagram.model.setDataProperty(node.data, "selectable",false)
                // }else{
                //     node.diagram.model.setDataProperty(node.data, "desiredSize",`${oliveWidth} ${oliveHeight}`)
                // }

                // if(node.naturalBounds.width > maxWidth){
                //     maxWidth = node.naturalBounds.width;
                //   }
                // if(node.naturalBounds.height > maxHeight){
                // maxHeight = node.naturalBounds.height;
                // }
                // if(node.measuredBounds.height > maxHeight){
                // maxHeight = node.measuredBounds.height;
                // }
                // if(node.findObject("main").height > maxHeight){
                // maxHeight = node.findObject("main").height;
                // }
                node.angle = group.angle;
                waveTotalSize += node.naturalBounds.width;
                collection.push(node);
            }
        }
    }

    waveTotalSize = collection.length * oliveWidth + oliveWidth * 2 / 3;
    if (haveTail) {
        waveTotalSize = collection.length * oliveWidth;
    }
    console.log("maxHeight:" + maxHeight + ",maxWidth:" + maxWidth);
    line.findObject("SHAPE").width = waveTotalSize;
    line.diagram.model.setDataProperty(line.data, "stroke", centerStroke);
    // line.centerStroke
    // line.height = 4
    // if(group.resizeObject.width != waveTotalSize){
    group.containingGroup.layout.isOngoing = true;
    group.containingGroup.layout.isValidLayout = false;
    // }

    // autogroupConfig = group.group.nonauto||"";
    // var autogroupConfigObj = {}
    // autogroupConfig = autogroupConfig.split(",")
    // for(var i=0;i<autogroupConfig.length;i++){
    //     autogroupConfigObj[autogroupConfig[i]] = true;
    // }
    group.resizeObject.width = waveTotalSize;
    group.resizeObject.height = oliveHeight;
    group.waveCount = collection.length;
    xuStrokeWidth = group.data.xuStrokeWidth;
    shiStrokeWidth = group.data.shiStrokeWidth;
    shiStrokeDashArray = group.data.shiStrokeDashArray;
    xuStrokeDashArray = group.data.xuStrokeDashArray;
    collection = collection.sort(function (a, b) {
        // console.log(`Number(a.data.order)${Number(a.data.order)} > Number(b.data.order) ${Number(b.data.order)}`,Number(a.data.order) > Number(b.data.order))
        return Number(a.data.order) - Number(b.data.order);
    });
    // shiTextColl.sort(function(a,b){
    //     return a.data.order - b.data.order
    // })
    // xuTextColl.sort(function(a,b){
    //     return a.data.order - b.data.order
    // })
    // centerTextColl.sort(function(a,b){
    //     return a.data.order - b.data.order
    // })
    var lastOlive = null; // 记录最后一个橄榄的位置，用于增加开放尾部
    var oldOrder = null;
    collection.forEach(function (obj, index) {
        // obj.data.order = index + 1;
        var newOrder = index + 1;
        // console.log("orderorderorderorderorderorderorderorderorderorder",newOrder,obj.data.order)
        // var oldOrder = obj.__oldOrder
        if (!obj.__oldOrder) {
            oldOrder = obj.data.order;
        } else {
            oldOrder = obj.__oldOrder;
        }
        delete obj.__oldOrder;
        shiTextColl[index] = obj.diagram.findNodeForKey(obj.data.shiText);
        xuTextColl[index] = obj.diagram.findNodeForKey(obj.data.xuText);
        if (!obj.data.isNew && obj.data.role != "waveTail") {
            if (oldOrder % 2 != newOrder % 2) {
                if (shiTextColl[index].data.nloc) {
                    obj.diagram.model.setDataProperty(shiTextColl[index].data, "nloc", null);
                    shiTextColl[index].__oldLocation = shiTextColl[index].location;
                } else {
                    // 之前是自动布局，如果有记录相对位置，则恢复
                    // if(shiTextColl[index].__offset){
                    //     obj.diagram.model.setDataProperty(shiTextColl[index].data,"nloc", true)
                    //     // xu.__offset = xu.__location.copy().subtract(xu.location)
                    //     // shiTextColl[index].location = shiTextColl[index].__location.copy().subtract(shiTextColl[index].__offset)
                    //     // delete shiTextColl[index].__oldLocation
                    // }
                }

                if (xuTextColl[index].data.nloc) {
                    obj.diagram.model.setDataProperty(xuTextColl[index].data, "nloc", null);
                    xuTextColl[index].__oldLocation = xuTextColl[index].location;
                } else {}
                // if(xuTextColl[index].__offset){
                //     obj.diagram.model.setDataProperty(xuTextColl[index].data,"nloc", true)
                //     // xu.__offset = xu.__location.copy().subtract(xu.location)
                //     // xuTextColl[index].location = xuTextColl[index].__location.copy().subtract(xuTextColl[index].__offset)
                //     // delete shiTextColl[index].__oldLocation
                // }

                // shiTextColl[index].__switchOrder = true;
                // xuTextColl[index].__switchOrder = true;
                // obj.diagram.model.setDataProperty(xuTextColl[index].data,"nloc", null)
                // shiTextColl[index].__offset.x = -shiTextColl[index].__offset.x
                // shiTextColl[index].__offset.y = -shiTextColl[index].__offset.y
            }
        }

        obj.diagram.model.setDataProperty(obj.data, "order", newOrder);
        if (!obj.data.nalign) {
            obj.diagram.model.setDataProperty(obj.data, "textAlign", "center");
        }
        if (shiStroke) {
            obj.diagram.model.setDataProperty(obj.data, "shiStroke", shiStroke);
        }
        if (xuStroke) {
            obj.diagram.model.setDataProperty(obj.data, "xuStroke", xuStroke);
        }
        if (xuStrokeWidth) {
            obj.diagram.model.setDataProperty(obj.data, "xuStrokeWidth", xuStrokeWidth);
        }
        if (shiStrokeWidth) {
            obj.diagram.model.setDataProperty(obj.data, "shiStrokeWidth", shiStrokeWidth);
        }
        if (shiStrokeDashArray) {
            obj.diagram.model.setDataProperty(obj.data, "shiStrokeDashArray", shiStrokeDashArray);
        }
        if (xuStrokeDashArray) {
            obj.diagram.model.setDataProperty(obj.data, "xuStrokeDashArray", xuStrokeDashArray);
        }

        // obj.diagram.model.setDataProperty(obj.data,"text", obj.data.text+" "+newOrder)
        obj.location = group.location.copy().offset(oliveWidth * (newOrder - 1), 0);
        // obj.location = new go.Point(300*(obj.data.order-1),0)
        // obj.
        // var group = a.findNodeDataForKey(m.group)
        var initCenterText = false;
        if (group.data.centerTextAngle == "independent") {
            if (!obj.data.centerText) {
                var loc = obj.location.copy().offset(obj.naturalBounds.width / 2, 0);
                loc = computeNewRotateLoc(group.location, loc, obj.angle);
                var centerText = {
                    "text": obj.data.text,
                    "minSize": oliveWidth - 30 + " 30",
                    "deletable": false,
                    textAlign: obj.data.textAlign,
                    "font": obj.data.font || "18px 'Microsoft YaHei'",
                    textStroke: obj.data.textStroke,
                    "category": "autoText",
                    "key": helpers.guid(), "width": oliveWidth - 30,
                    "role": "centerText", "level": 0, "group": obj.data.group,
                    "order": newOrder,
                    "visible": false,
                    "layerName": "Foreground",
                    locationSpot: go.Spot.stringify(new go.Spot(0.5, 0.5, 0, 0)),
                    "selectable": false,
                    "olive": obj.data.key,
                    "loc": go.Point.stringify(loc),
                    angle: 0
                };
                obj.diagram.model.addNodeData(centerText);
                // var objCenterText = obj.diagram.model.findNodeDataForKey(centerText.key)
                obj.diagram.model.setDataProperty(obj.data, "centerText", centerText.key);
                initCenterText = true;
            }
            var objCenterText = obj.diagram.findNodeForKey(obj.data.centerText);
            if (objCenterText) {
                if (!objCenterText.data.nalign) {
                    obj.diagram.model.setDataProperty(objCenterText.data, "textAlign", "center");
                }
                if (!obj.data.nangle) {
                    if (textAngle == "vertical") {
                        obj.diagram.model.setDataProperty(objCenterText.data, "visible", false);
                        obj.diagram.model.setDataProperty(obj.data, "textVisible", true);
                    }
                    if (textAngle == "horizontal") {
                        obj.diagram.model.setDataProperty(objCenterText.data, "visible", true);
                        obj.diagram.model.setDataProperty(obj.data, "textVisible", false);
                        obj.diagram.model.setDataProperty(objCenterText.data, "angle", 0);
                    }
                }
                if (!initCenterText) {
                    var loc = obj.location.copy().offset(obj.naturalBounds.width / 2, 0);
                    loc = computeNewRotateLoc(group.location, loc, obj.angle);
                    obj.diagram.model.setDataProperty(objCenterText.data, "loc", go.Point.stringify(loc));
                }
                obj.diagram.model.setDataProperty(objCenterText.data, "order", newOrder);
                if (!objCenterText.data.nwidth) {
                    obj.diagram.model.setDataProperty(objCenterText.data, "width", oliveWidth - 30);
                }
                obj.diagram.model.setDataProperty(objCenterText.data, "minSize", oliveWidth - 30 + " 30");
                // obj.diagram.model.setDataProperty(objCenterText,"selectable", true)
                // if(group.data.centerTextMode == "followLine"){
                //     obj.diagram.model.setDataProperty(objCenterText.data,"textStroke", centerStroke)
                // }else{
                //     // obj.diagram.model.setDataProperty(objCenterText.data,"textStroke", "black")
                // }
                if (helpers.checkPhone()) {
                    objCenterText.layerName = "Background";
                }
            }
        }
        // if(group.data.centerTextMode == "followLine"){
        //     obj.diagram.model.setDataProperty(obj.data,"textStroke", centerStroke)
        // }else{
        //     obj.diagram.model.setDataProperty(obj.data,"textStroke", "black")
        // }
        // if(textAngle == "vertical"){
        if (obj.text && obj.text.trim() != "") {
            adustOliveText(obj.findObject("TEXT"));
        }
        // }
        if (shiTextColl[index]) {

            if (!shiTextColl[index].desiredSize.width) {
                shiTextColl[index].updateTargetBindings();
            }

            obj.diagram.model.setDataProperty(shiTextColl[index].data, "showBorder", true);
            if (!shiTextColl[index].data.nwidth) {
                obj.diagram.model.setDataProperty(shiTextColl[index].data, "width", oliveWidth);
            }
            obj.diagram.model.setDataProperty(shiTextColl[index].data, "minSize", oliveWidth - 30 + " 30");
            // obj.diagram.model.setDataProperty(shiTextColl[index].data,"textAlign", null)
            // delete shiTextColl[index].data.textAlign
            // 判断是否自动对齐
            // if(!shiTextColl[index].data.nalign){
            //     obj.diagram.model.setDataProperty(shiTextColl[index].data,"textAlign", "center")
            // }
            // // obj.diagram.model.setDataProperty(shiTextColl[index].data,"showBorder", true)
            // if(!shiTextColl[index].__oldOrder){
            //     shiTextColl[index].__oldOrder = shiTextColl[index].data.order
            // }
            // if(shiTextColl[index].__oldOrder ){
            //     // order变化前后奇偶不同
            //     if(oldOrder%2 != newOrder%2){
            //         // shiTextColl[index].__switchOrder = true;
            //         // shiTextColl[index].__offset.x = -shiTextColl[index].__offset.x
            //         // shiTextColl[index].__offset.y = -shiTextColl[index].__offset.y
            //     }
            // }
            // delete shiTextColl[index].__oldOrder
            obj.diagram.model.setDataProperty(shiTextColl[index].data, "order", newOrder);
            if (!shiTextColl[index].data.ncolor) {
                obj.diagram.model.setDataProperty(shiTextColl[index].data, "textStroke", shiStroke);
            }
            // obj.diagram.model.setDataProperty(shiTextColl[index].data,"order", newOrder)
            // if(!shiTextColl[index].data.ncolor){
            //     obj.diagram.model.setDataProperty(shiTextColl[index].data,"textStroke", shiStroke)
            // }
        }
        if (xuTextColl[index]) {
            if (!xuTextColl[index].desiredSize.width) {
                xuTextColl[index].updateTargetBindings();
            }

            obj.diagram.model.setDataProperty(xuTextColl[index].data, "minSize", oliveWidth - 30 + " 30");
            obj.diagram.model.setDataProperty(xuTextColl[index].data, "showBorder", true);
            if (!xuTextColl[index].data.nwidth) {
                obj.diagram.model.setDataProperty(xuTextColl[index].data, "width", oliveWidth);
            }
            // if(!xuTextColl[index].data.nalign){
            //     obj.diagram.model.setDataProperty(xuTextColl[index].data,"textAlign", "center")
            // }
            // obj.diagram.model.setDataProperty(xuTextColl[index].data,"textAlign", null)
            // delete xuTextColl[index].data.textAlign
            // if(!xuTextColl[index].__oldOrder){
            //     xuTextColl[index].__oldOrder = xuTextColl[index].data.order
            // }
            // if(xuTextColl[index].__oldOrder){
            //     // order变化前后奇偶不同
            //     if(xuTextColl[index].__oldOrder%2 != newOrder%2){
            //         // xuTextColl[index].__switchOrder = true;
            //         // xuTextColl[index].__offset.x = -xuTextColl[index].__offset.x
            //         // xuTextColl[index].__offset.y = -xuTextColl[index].__offset.y
            //     }
            // }
            // delete xuTextColl[index].__oldOrder
            obj.diagram.model.setDataProperty(xuTextColl[index].data, "order", newOrder);
            if (!xuTextColl[index].data.ncolor) {
                obj.diagram.model.setDataProperty(xuTextColl[index].data, "textStroke", xuStroke);
            }
            // obj.diagram.model.setDataProperty(xuTextColl[index].data,"order", newOrder)
            // if(!xuTextColl[index].data.ncolor){
            //     obj.diagram.model.setDataProperty(xuTextColl[index].data,"textStroke", xuStroke)
            // }
        }
        obj.__location = computeNewRotateLoc(group.location, obj.location.copy(), obj.angle);
        adjustTextAngle(obj, shiTextColl[index], xuTextColl[index], group);

        obj.location = obj.__location;
        lastOlive = obj;
        obj.diagram.model.setDataProperty(obj.data, "isNew", null);
    });
}

// define a custom grid layout that makes sure the length of each lane is the same
// and that each lane is broad enough to hold its subgraph
function WaveGroupLayout() {
    go.Layout.call(this);
    // go.GridLayout.call(this);
    // this.cellSize = new go.Size(1, 1);
    // this.wrappingColumn = Infinity;
    // this.wrappingWidth = Infinity;
    // this.spacing = new go.Size(0, 0);
    // this.alignment = go.GridLayout.Position;
}
go.Diagram.inherit(WaveGroupLayout, go.Layout);

function computeNewRotateLoc(rotateCenter, currentLoc, angle) {
    if (rotateCenter.equals(currentLoc)) return currentLoc;
    // 计算选择中心点到（0,0）点的偏移
    var offset = new go.Point(0, 0).subtract(rotateCenter.copy());
    // 将原来的点偏移到相对0,0点的位置
    var nodeOrigin = currentLoc.copy().offset(offset.x, offset.y);
    var newNodeOrigin = nodeOrigin.rotate(angle);
    var newNodeLoc = newNodeOrigin.copy().offset(-offset.x, -offset.y);
    return newNodeLoc;
    // console.log("newNodeLoc", newNodeLoc)
}

WaveGroupLayout.prototype.doLayout = function (coll) {
    console.log("WaveGroupLayout.doLayout");
    var diagram = this.diagram;
    diagram.model.startTransaction("WaveGroupLayout");

    // COLL might be a Diagram or a Group or some Iterable<Part>
    var it = this.collectParts(coll).iterator;
    var group = this.group;
    layoutWaveGroup(it, diagram, group);

    go.Layout.prototype.doLayout.call(this, coll);
    // diagram.model.addNodeData(tailOlive)

    diagram.model.commitTransaction("WaveGroupLayout");
    // setTimeout(()=>{
    //     diagram.updateAllTargetBindings()
    // })
    return;
    // return;
    // var diagram = this.diagram;
    if (diagram === null) return;
    diagram.startTransaction("PoolLayout");
    // make sure all of the Group Shapes are big enough
    // var minsize = computeMinPoolSize();
    // diagram.findTopLevelGroups().each(function(lane) {
    //   if (!(lane instanceof go.Group)) return;
    //   var shape = lane.selectionObject;
    //   if (shape !== null) {  // change the desiredSize to be big enough in both directions
    //     var sz = computeLaneSize(lane);
    //     shape.width = (!isNaN(shape.width)) ? Math.max(shape.width, sz.width) : sz.width;
    //     shape.height = (isNaN(shape.height) ? minsize.height : Math.max(shape.height, minsize.height));
    //     var cell = lane.resizeCellSize;
    //     if (!isNaN(shape.width) && !isNaN(cell.width) && cell.width > 0) shape.width = Math.ceil(shape.width / cell.width) * cell.width;
    //     if (!isNaN(shape.height) && !isNaN(cell.height) && cell.height > 0) shape.height = Math.ceil(shape.height / cell.height) * cell.height;
    //   }
    // });
    // now do all of the usual stuff, according to whatever properties have been set on this GridLayout
    go.GridLayout.prototype.doLayout.call(this, coll);
    diagram.commitTransaction("PoolLayout");
};
// end PoolLayout class

module.exports = WaveGroupLayout;
module.exports.layoutWaveGroup = layoutWaveGroup;
module.exports.adjustTextAngle = adjustTextAngle;

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var $ = go.GraphObject.make;
var helpers = __webpack_require__(0);
var createTextNodeTemplate = __webpack_require__(3);
var createPictureSingleNodeTemplate = __webpack_require__(2);
var nodeTemplateFactory = __webpack_require__(11);

var Trtd = function () {
    function Trtd(div, config) {
        _classCallCheck(this, Trtd);

        console.log('trtd base');
        this.config = config;
        this.textDoubleClick = config.textDoubleClick;
        this.modelChangedListener = config.modelChangedListener;
        this.showContextMenuListener = config.showContextMenuListener;
        this.hideContextMenuListener = config.hideContextMenuListener;
        this.dealFireTextCallback = config.dealFireTextCallback;
        this.exportAsSubFigureCallback = config.exportAsSubFigureCallback; // 将选中内容创建为子盘
        this.ViewportBoundsChangedListener = config.ViewportBoundsChangedListener;
        this.InitialLayoutCompleted = config.InitialLayoutCompleted;
        this.cxElement = config.cxElement; // 外部传入的菜单dom元素
        this.deleteCallback = config.deleteCallback; // 删除回调
        this.canAddAxisGroup = config.canAddAxisGroup == null ? true : config.canAddAxisGroup;
        this.createFigure = config.createFigure; // 外部创建figure方法，异步调用，返回盘的id，写入节点的figure属性，一般为id
        this.openFigure = config.openFigure; // 外部打开figure方法，根据节点的figure属性打开盘

        this.useDefaultContext = config.useDefaultContext == null ? true : config.useDefaultContext;
        // if()
        this.defaultCxElement = null; // 默认菜单dom元素
        this.type = config.type;

        this.div = div;
        this.containerDivId = config.containerDivId || "mainbox"; // diagram的div父级div的id，菜单会建在这下面
        this.diagram = {};
        if (config.model != null && _typeof(config.model) == "object") {
            console.log("dsfdf");
            config.model = JSON.stringify(config.model);
        }
        this.model = config.model;
        this.tpid = config.tpid || Date.now();
        this.InitialFontSize = 18;
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
        };
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

    _createClass(Trtd, [{
        key: 'initDiagram',
        value: function initDiagram() {
            console.log("基类方法，子类需要实现，用来初始化画布");
        }
    }, {
        key: 'addNodeTemplate',
        value: function addNodeTemplate() {
            console.log("基类方法，子类需要实现，用来初始化节点模板");
        }

        /**
         *  设置缩放比例
         * @param value
         */

    }, {
        key: 'resetZoom',
        value: function resetZoom(value) {
            // console.log(value)
            this.diagram.commandHandler.resetZoom(value);
        }
    }, {
        key: 'getDefaultCustomMenuDivStr',
        value: function getDefaultCustomMenuDivStr() {
            console.log("基类方法，子类需要实现，设置默认自定义菜单");
            return '\n        <ul>\n            <li trtd_action="addLevelNodeMenu"><a class="i18n" data-lang="insertsl">\u63D2\u5165\u540C\u7EA7\u8282\u70B9</a></li>\n            <li trtd_action="addChildNodeMenu"><a class="i18n" data-lang="icn">\u63D2\u5165\u5B50\u8282\u70B9</a></li>\n            <li trtd_action="duplicateNode"><a class="i18n" data-lang="duplicateNode">\u590D\u5236\u8282\u70B9</a></li>\n            <li trtd_action="deleteNodeMenu"><a class="i18n" data-lang="remove">\u5220\u9664</a></li>\n            <li trtd_action="orderChildNode"><a class="i18n" data-lang="ordernode">\u5B50\u8282\u70B9\u7F16\u53F7</a></li>\n            <li trtd_action="clearOrderChildNode"><a class="i18n" data-lang="clearordernode">\u53D6\u6D88\u5B50\u8282\u70B9\u7F16\u53F7</a></li>\n            <li trtd_action="clearNodeTextMenu"><a class="i18n" data-lang="emptynodetext">\u6E05\u7A7A\u8282\u70B9\u6587\u672C</a></li>\n            <li trtd_action="insertTianpanMenu"><a class="i18n" data-lang="insertnodetianpan">\u63D2\u5165\u5929\u76D8\u8282\u70B9</a></li>\n            <li trtd_action="insertTextMenu"><a class="i18n" data-lang="inserttext">\u63D2\u5165\u6587\u672C</a></li>\n            <li trtd_action="locateRootNodeMenu"><a class="i18n" data-lang="locaterootnode">\u5B9A\u4F4D\u6839\u8282\u70B9</a></li>\n            <li trtd_action="showAllNodesMenu"><a class="i18n" data-lang="displayallnodes">\u663E\u793A\u6240\u6709\u8282\u70B9</a></li>\n            <li trtd_action="fixPictureMenu"><a class="i18n" data-lang="fixnode">\u56FA\u5B9A\u8282\u70B9</a></li>\n            <li trtd_action="activePictureMenu"><a class="i18n" data-lang="cancelfix">\u53D6\u6D88\u56FA\u5B9A</a></li>\n        \n            <li trtd_action="delYunpanAxis"><a class="i18n" data-lang="cancelfix">\u5220\u9664 CTRL+DEL</a></li>\n            <li trtd_action="addYunpanAxis"><a class="i18n" data-lang="cancelfix">\u589E\u52A0 CTRL+X/Y</a></li>\n            <li trtd_action="addFollowerGround"><a class="i18n" data-lang="insertsl">\u589E\u52A0\u540C\u7EA7\u8282\u70B9</a></li>\n            <li trtd_action="addNewCircle"><a class="i18n" data-lang="icn">\u589E\u52A0\u5B50\u8282\u70B9</a></li>\n            <li trtd_action="apiDeleteSelection"><a class="i18n" data-lang="remove">\u5220\u9664</a></li>\n        </ul>\n        ';
        }
    }, {
        key: 'getShowContextMenus',
        value: function getShowContextMenus(node) {
            console.log("基类方法，子类需要实现，显示默认自定义带单时控制哪些菜单需要显示");

            var showIds = '';

            if (!node || node.data.isGroup) {
                // myDiagram.clearSelection();
                showIds = "locateRootNodeMenu,showAllNodesMenu,insertTextMenu,insertTianpanMenu";
                // if(myDiagram.model.modelData.currentType == "dipan"){
                //     cxElement.getElementsByClassName('removeOutCycleMenu')[0].style.display = 'block';
                // }
            } else {
                if (!(node instanceof go.Group) && (!node.data.category || node.data.category == "" || node.data.category == "0" || node.data.category == "1" || node.data.category == "4")) {
                    //天盘节点,非group
                    showIds = "addLevelNodeMenu,addChildNodeMenu,deleteNodeMenu,orderChildNode,clearOrderChildNode," + "clearNodeTextMenu,duplicateNode";
                    console.log("2111");
                    if (node.selectable) {
                        showIds += "fixPictureMenu";
                    } else {
                        showIds += "activePictureMenu";
                    }
                }

                if (node.data.category == "8" || node.data.category == "text" || node.data.category == "addtextTemplate") {
                    showIds = "deleteNodeMenu," + "duplicateNode";
                }

                if (node.data.category === "yunpanx" || node.data.category === "yunpany") {
                    console.log("222222222222");
                    showIds = "delYunpanAxis," + "addYunpanAxis";
                }

                if (node.data.category === "dipan") {
                    showIds = "addFollowerGround," + "addChildDipanNode," + "deleteDipanNode";
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

            return showIds;
        }
    }, {
        key: 'insertPicture',
        value: function insertPicture(source) {
            this.apiInsertPicture(source);
        }
    }, {
        key: 'apiInsertPicture',
        value: function apiInsertPicture(source) {
            console.log("基类方法，子类需要实现，对外接口，插入图片");
            // console.log(source)
            var myDiagram = this.diagram;
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
            try {
                var documentPoint = JSON.parse(localStorage.getItem("TRTD_documentPoint"));
                if (!documentPoint) documentPoint = myDiagram.lastInput.documentPoint;
            } catch (err) {
                var documentPoint = myDiagram.lastInput.documentPoint;
            }
            if (node) {
                // myDiagram.model.setDataProperty(node.data,'lastCategory', node.data.category);  //保存添加图片前的类别，以便移除图片时恢复
                // if (node.data.category != "3" && node.data.category != 'text') {
                //     myDiagram.model.setCategoryForNodeData(node.data, "4");
                // }
                if (node.data.category == '3') {
                    //文字节点暂时不能添加图片
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
    }, {
        key: 'apiGetTheme',
        value: function apiGetTheme() {
            var model = this.diagram.model;
            var themeText = "";
            for (var i = 0; i < model.nodeDataArray.length; i++) {
                if (model.nodeDataArray[i].role == "theme" || model.nodeDataArray[i].role == "themeText" || model.nodeDataArray[i].subRole == "themeText") {
                    themeText = model.nodeDataArray[i].text;
                    break;
                }
            }
            if (!themeText) {
                var root = model.findNodeDataForKey(1);
                if (root) {
                    themeText = root.text;
                }
            }
            return themeText;
        }
    }, {
        key: 'apiGetThemeNode',
        value: function apiGetThemeNode() {
            var model = this.diagram.model;
            var themeText = null;
            var it = this.diagram.nodes;
            var tmp;
            while (it.next()) {
                tmp = it.value;
                if (tmp.data.role == "theme" || tmp.data.role == "themeText" || tmp.data.subRole == "themeText") {
                    themeText = tmp;
                    break;
                }
            }
            // for(var i=0;i<model.nodeDataArray.length;i++){
            //     if(model.nodeDataArray[i].role == "theme" || model.nodeDataArray[i].role == "themeText"|| model.nodeDataArray[i].subRole == "themeText"){
            //         themeText = model.nodeDataArray[i]
            //         break;
            //     }
            // }
            if (!themeText) {
                var root = this.diagram.findNodeForKey(1);
                if (root) {
                    themeText = root;
                }
            }
            return themeText;
        }
    }, {
        key: 'insertFigure',
        value: function insertFigure(source, figureId) {
            //rootKey表示属于某个地盘节点的背景
            // console.log(source)
            var myDiagram = this.diagram;
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
            if (node) return; // 暂时关闭节点插入图片功能
            myDiagram.model.startTransaction('setSourceOfPicture');
            try {
                var documentPoint = JSON.parse(localStorage.getItem("TRTD_documentPoint"));
            } catch (err) {
                var documentPoint = myDiagram.lastInput.documentPoint;
            }
            if (node) {
                // myDiagram.model.setDataProperty(node.data,'lastCategory', node.data.category);  //保存添加图片前的类别，以便移除图片时恢复
                if (node.data.category != "3" && node.data.category != 'text') {
                    myDiagram.model.setCategoryForNodeData(node.data, "4");
                }
                if (node.data.category != 'text') {
                    //文字节点暂时不能添加图片
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

    }, {
        key: 'apiDuplicateNode',
        value: function apiDuplicateNode() {
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
                delete data.role;
                delete data.group;
                delete data.dimKey;
                delete data.subRole;
                delete data.order;
                delete data.figure;
                delete data.iconVisible;
                delete data.deletable;
                delete data.theta;
                delete data.orderX;
                delete data.orderY;
                delete data.dimX;
                delete data.dimY;
                return data;
            }
        }
    }, {
        key: 'apiPreviewImage',
        value: function apiPreviewImage() {
            var background = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "white";
            var scale = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

            console.log("基类方法，子类需要实现，对外接口，预览图片，生成base64");
            var myDiagram = this.diagram;
            var imageParas = {
                scale: scale,
                // background: "rgba(0,0,0,0)",
                background: background,
                type: "image/png",
                maxSize: new go.Size(9000, 9000)
            };
            var list = new go.List(go.GraphObject);

            var node = myDiagram.selection.first();
            var isSelected = false;
            if (node) {
                while (node.containingGroup) {
                    node = node.containingGroup;
                }
                if (node.data.isGroup) {
                    isSelected = true;
                }
            }

            if (isSelected) {
                var it = node.findSubGraphParts().iterator;
                while (it.next()) {
                    var p = it.value;
                    var temp = p.findObject("figure");
                    if (temp) {
                        temp.visible = false;
                    }
                    if (!(p instanceof go.Group)) {
                        list.add(p);
                        if (p instanceof go.Node) {
                            if (p.data.role == "centerText") {
                                p.layerName = "Foreground";
                            }
                        }
                    }
                }
            } else {
                myDiagram.nodes.each(function (p) {
                    var temp = p.findObject("figure");
                    if (temp) {
                        temp.visible = false;
                    }
                    if (!(p instanceof go.Group)) {
                        list.add(p);
                        if (p instanceof go.Node) {
                            if (p.data.role == "centerText") {
                                p.layerName = "Foreground";
                            }
                        }
                    }
                });
            }

            myDiagram.links.each(function (p) {
                list.add(p);
            });
            imageParas.parts = list.iterator;

            var imgdata = myDiagram.makeImageData(imageParas);
            myDiagram.nodes.each(function (p) {
                var temp = p.findObject("figure");
                if (p.data.figure && temp) {
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
            });
            return imgdata;
        }
    }, {
        key: 'apiDeleteSelection',
        value: function apiDeleteSelection() {
            console.log("基类方法，子类需要实现，对外接口，删除选中的节点");
            this.diagram.toolManager.textEditingTool.doCancel();
            this.diagram.commandHandler.deleteSelection();
        }
    }, {
        key: 'apiUndo',
        value: function apiUndo() {
            this.diagram.commandHandler.undo();
        }
    }, {
        key: 'apiRedo',
        value: function apiRedo() {
            this.diagram.commandHandler.redo();
        }
    }, {
        key: 'saveModel',
        value: function saveModel(e) {
            // if (e.isTransactionFinished) {
            // console.log('model changed and has been saved to localstorage');
            helpers.saveModelToLocalStorage(this.tpid, this.diagram.model);
            // helpers.checkModel(e.model)
            // }
        }
    }, {
        key: 'addNodeTemplateBase',
        value: function addNodeTemplateBase() {
            var myDiagram = this.diagram;
            this.diagram.nodeTemplateMap.add("text", createTextNodeTemplate(this.diagram));
            this.diagram.nodeTemplateMap.add("3", createPictureSingleNodeTemplate(this.diagram));

            // myDiagram.nodeTemplateMap.add("cbian",  nodeTemplateFactory("cbian",{diagram:this.diagram}).getNodeTemplate())
            myDiagram.nodeTemplateMap.add("pic", nodeTemplateFactory("pic", { diagram: this.diagram }).getNodeTemplate());
            myDiagram.nodeTemplateMap.add("autoText", nodeTemplateFactory("autoText", { diagram: myDiagram }).getNodeTemplate());
            myDiagram.groupTemplateMap.add("picGroup", nodeTemplateFactory("picGroup", { diagram: myDiagram }).getNodeTemplate());
        }
        // 添加水罗盘，三门系统

    }, {
        key: 'addWater',
        value: function addWater() {
            console.log("addWater");
            var diagram = this.diagram;
            var node = diagram.selection.first();
            var group = null;
            if (node && node.data.category == "axisGroup") {
                group = node.data.key;
            }
            var e = diagram.lastInput;
            diagram.startTransaction("addCbian");
            var groupKey = helpers.guid();

            var basePoint = e.documentPoint;
            var groupData = { "category": "picGroup",
                "role": "cbian", "isGroup": true, "level": 0,
                "key": groupKey, "loc": go.Point.stringify(basePoint), "deletable": true };
            if (group) {
                groupData.group = group;
            }

            var picData = { "group": groupKey, "text": "",
                "resizable": false, "category": "pic",
                "loc": go.Point.stringify(basePoint),
                "picture": "https://static.365trtd.com/system/water/water.png", "width": 150, "height": 150
                // "picture":"https://static.365trtd.com/system/cbian/cbian.png", "width":150, "height":150}

            };var themeData = { "text": "总结", "deletable": true, "fill": "black", "iconVisible": false,
                "locationSpot": "1 0 0 0", "textAlign": "center", "category": "autoText",
                "loc": go.Point.stringify(basePoint.copy().offset(3, -3)),
                "movable": true, "group": groupKey };
            var timeData = { "text": "时间", "deletable": true, "fill": "black", "iconVisible": false,
                "locationSpot": "1 0 0 0", "textAlign": "center", "category": "autoText",
                "loc": go.Point.stringify(basePoint.copy().offset(150, 0)),
                "movable": true, "group": groupKey };
            var energeData = { "text": "能量", "deletable": true, "fill": "black", "iconVisible": false,
                "locationSpot": "1 0 0 0", "textAlign": "center", "category": "autoText",
                "loc": go.Point.stringify(basePoint.copy().offset(0, -150)),
                "movable": true, "group": groupKey };
            var text1Data = { "text": "总结1", "deletable": true, "textStroke": "#0e399d", "iconVisible": false,
                "locationSpot": "0 0 0 0", "textAlign": "left", "category": "autoText",
                "loc": go.Point.stringify(basePoint.copy().offset(155 * Math.cos(30 * Math.PI / 180), -150 * Math.sin(30 * Math.PI / 180))),
                "movable": true, "group": groupKey };
            var text2Data = { "text": "总结2", "deletable": true, "textStroke": "#FFC000", "iconVisible": false,
                "locationSpot": "0 0.5 0 0", "textAlign": "left", "category": "autoText",
                "loc": go.Point.stringify(basePoint.copy().offset(145 * Math.cos(45 * Math.PI / 180), -150 * Math.sin(45 * Math.PI / 180))),
                "movable": true, "group": groupKey };
            var text3Data = { "text": "总结3", "deletable": true, "textStroke": "#cb1c27", "iconVisible": false,
                "locationSpot": "0 1 0 0", "textAlign": "left", "category": "autoText",
                "loc": go.Point.stringify(basePoint.copy().offset(145 * Math.cos(70 * Math.PI / 180), -140 * Math.sin(70 * Math.PI / 180))),
                "movable": true, "group": groupKey };

            diagram.model.addNodeData(text1Data);
            diagram.model.addNodeData(text2Data);
            diagram.model.addNodeData(text3Data);
            diagram.model.addNodeData(themeData);
            diagram.model.addNodeData(timeData);
            diagram.model.addNodeData(energeData);
            diagram.model.addNodeData(picData);
            diagram.model.addNodeData(groupData);

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

            diagram.commitTransaction("addWater");
        }
    }, {
        key: 'initDiagramBase',
        value: function initDiagramBase(div, config) {
            var _this = this;

            console.log("基类初始化画布，子类修改diagram");
            var myDiagram = this.diagram;
            var that = this;

            // function onTextChanged(){}
            // function saveModel() {}
            var myDiagram = this.diagram;

            function onTextChanged(e) {
                e.diagram.isModified = true;
                console.log("onTextChanged");
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
                click: function click(e) {
                    // closeToolbarWindow();
                    // removeNodeToolBar();
                    console.log("eeee:", e);
                    localStorage.setItem("TRTD_documentPoint", go.Point.stringify(e.documentPoint));
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
                InitialLayoutCompleted: function InitialLayoutCompleted(e) {
                    console.info("hhhhhhhhhhhhhhhhhhhh InitialLayoutCompleted");
                    e.diagram.animationManager.isEnabled = true;
                    if (that.InitialLayoutCompleted) {
                        that.InitialLayoutCompleted(e);
                    }
                },
                // make sure users can only create trees

                validCycle: go.Diagram.CycleDestinationTree,

                "ModelChanged": function ModelChanged(e) {
                    if (!e.isTransactionFinished) {
                        return;
                    }
                    // return;
                    that.isModified = true;
                    that.lastModified = Date.now();
                    that.modifiedIndex += 1;
                    setTimeout(function () {
                        // 如果已经保存则不处理
                        if (!that.isModified) {
                            console.log("已经保存，跳过", diff, ",", that.modifiedIndex);
                            return;
                        };
                        // var now = Date.now()
                        var diff = Date.now() - that.lastModified;
                        if (diff >= 1000) {
                            console.log("大于1000毫秒需要保存", diff, ",", that.modifiedIndex);
                            that.modifiedIndex = 0;
                            that.isModified = false;
                            that.saveModel(e);
                            if (that.modelChangedListener) {
                                that.modelChangedListener(e.model);
                            }
                        }
                    }, 1100);
                },

                "TextEdited": onTextChanged, //在下面定义
                contextMenu: $(go.Adornment),
                ViewportBoundsChanged: function ViewportBoundsChanged(e) {
                    // console.log("ViewportBoundsChangedListener", e)
                    if (that.ViewportBoundsChangedListener) {
                        that.ViewportBoundsChangedListener(e);
                    }
                }
            };

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

            myDiagram.toolManager.rotatingTool.handleArchetype = $(go.Panel, "Auto", $(go.Shape, "BpmnActivityLoop", { width: 30, height: 30, stroke: "green", fill: "transparent" }), $(go.Shape, "Rectangle", {
                width: 30,
                height: 30,
                stroke: "green",
                fill: "transparent",
                strokeWidth: 0
            }));

            myDiagram.toolManager.linkReshapingTool.handleArchetype = $(go.Shape, "Circle", {
                width: 30,
                height: 30,
                fill: "lightblue",
                stroke: "dodgerblue"
            });

            // only allow new links between ports of the same group
            myDiagram.toolManager.linkingTool.linkValidation = sameGroup;
            // only allow reconnecting an existing link to a port of the same color
            myDiagram.toolManager.relinkingTool.linkValidation = sameGroup;
            myDiagram.commandHandler.doKeyDown = function (e) {
                _this.dokeyDownFn(e);
            };
            myDiagram.commandHandler.deleteSelection = function () {
                console.log("deleteSelectiondeleteSelection");
                var node = that.diagram.selection.first();
                if (!node) {
                    return;
                }
                // 不允许删除主题
                if (node.data.role == "theme" || node.data.role == "themeText" || node.data.subRole == "themeText") {
                    return;
                }
                var nodeCopy = JSON.parse(JSON.stringify(node.data));
                that.deleteSelection();
                if (that.deleteCallback) {
                    that.deleteCallback(nodeCopy);
                }
            };
            myDiagram.commandHandler.redo = function () {
                var cmd = myDiagram.commandHandler;
                //myDiagram.currentTool.doCancel();
                //go.CommandHandler.prototype.redo.call(cmd);
                myDiagram.clearSelection();
                go.CommandHandler.prototype.redo.call(cmd);
            };
            myDiagram.commandHandler.undo = function () {
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
                radius: 120
            };

            this.addNodeTemplateBase();
            this.addDiagramContextMenu();
            // if(this.model){
            //     this.initModel();
            // }
        }
    }, {
        key: 'removeNodeRemarkTips',
        value: function removeNodeRemarkTips() {
            var doms = document.getElementById('tooltip');
            if (doms) {
                doms.parentNode.removeChild(doms);
            }
        }
    }, {
        key: 'showNodeRemarkTips',
        value: function showNodeRemarkTips(e, node) {
            var info = document.getElementById('tooltip');
            if (!info || info.length == 0) {
                var str = document.createElement('div');
                str.setAttribute('id', 'tooltip');
                str.setAttribute('style', 'word-wrap: break-word;word-break: break-all');
                document.body.appendChild(str);
                info = document.getElementById('tooltip');
            }
            var box = document.getElementById("tooltip");

            if (!node.data.istemp && node.data.text && node.data.text.trim() == "" && (node.data.remark && node.data.remark.trim() == "" || typeof node.data.remark == 'undefined')) return;

            if (node.data.istemp) {
                var toolTipText = lang.trans('tempnodetips');
            } else if (node.category === "y" || node.category === "LogicXor" && node.data.loc.split(' ')[1] === "5") {
                var toolTipText = "最右新增";
            } else if (node.category === "x" || node.category === "LogicXor" && node.data.loc.split(' ')[0] === "-20") {
                var toolTipText = "最上新增";
            } else {
                var toolTipText = node.data.text + "<br><hr>";
                toolTipText += node.data.remark ? node.data.remark : "";
            }

            box.innerHTML = toolTipText;
            // box.style.left = e.viewPoint.x + "px";
            // box.style.top = e.viewPoint.y + "px";
            if (node.category === "y" || node.category === "x" || node.category === "LogicXor") {
                box.style.left = e.event.clientX + 10 + "px";
                box.style.top = e.event.clientY - 10 + "px";
            } else {
                box.style.left = e.event.clientX + 50 + "px";
                box.style.top = e.event.clientY - 50 + "px";
            }
            box.style.position = "fixed";
            box.style.zIndex = 5555;
            box.style.backgroundColor = "#FFFFE1";
            // $("#tooltip")[0].innerHtml = "<p>aaaaaaaaa<br>bbbbbbbbbbbbb</p>";
        }
    }, {
        key: 'nodeResizeAdornmentTemplate',
        value: function nodeResizeAdornmentTemplate() {
            return $(go.Adornment, "Spot", $(go.Placeholder), // takes size and position of adorned object
            $(go.Shape, "Circle", // left resize handle
            {
                alignment: go.Spot.TopLeft,
                alignmentFocus: go.Spot.BottomRight,
                cursor: "col-resize",
                desiredSize: new go.Size(30, 30),
                fill: "lightblue",
                stroke: "dodgerblue"
            }), $(go.Shape, "Circle", // right resize handle
            {
                alignment: go.Spot.BottomRight,
                alignmentFocus: go.Spot.TopLeft,
                cursor: "col-resize",
                desiredSize: new go.Size(30, 30),
                fill: "lightblue",
                stroke: "dodgerblue"
            }));
        }
        // 创建默认菜单 this.defaultCxElement

    }, {
        key: 'customMenu',
        value: function customMenu() {
            console.log("第一步创建默认的自定义菜单");
            if (this.defaultCxElement) {
                console.log("使用默认菜单，已经存在");
                return this.defaultCxElement;
            }
            console.log(this.useDefaultContext);
            // 不使用默认菜单
            if (!this.useDefaultContext) {

                return null;
            }
            // 添加菜单选项
            var str = this.getDefaultCustomMenuDivStr();

            var div = document.createElement('div');
            // div.setAttribute('id', 'contextMenu');
            div.setAttribute('class', 'context-menu');
            div.innerHTML = str;
            // document.getElementsByClassName('mainbox')[0].appendChild(div);
            var mainbox = document.getElementById(this.containerDivId);
            mainbox.appendChild(div);
            var contextMeluDom = mainbox.getElementsByClassName('context-menu')[0];
            this.defaultCxElement = contextMeluDom;
            this.bindMenuEventListener(contextMeluDom);
            return contextMeluDom;
        }
    }, {
        key: 'bindMenuEventListener',
        value: function bindMenuEventListener(cxElement) {
            var _this2 = this;

            var menuList = cxElement.getElementsByTagName('li');
            console.log("创建的自定义菜单需要绑定一些事件");

            var _loop = function _loop(i) {
                menuList[i].addEventListener('click', function () {
                    var val = menuList[i].getAttribute('trtd_action');
                    // cxcommand(this, val);
                    console.log("menuList[i].addEventListener('click'");
                    _this2.diagram.__trtd[val]();
                    _this2.diagram.currentTool.stopTool();
                    return false;
                    // setTimeout(()=>{
                    //     this.diagram.toolManager.contextMenuTool.hideContextMenu()
                    // },100)
                });
            };

            for (var i = 0; i < menuList.length; i++) {
                _loop(i);
            }
        }
    }, {
        key: 'addDiagramContextMenu',
        value: function addDiagramContextMenu() {

            // console.log("基类 addDiagramContextMenu")
            console.log("第二步 将自定义菜单与diagram绑定");
            // console.log(objNode)


            var that = this;
            var myDiagram = this.diagram;
            var cxTool = myDiagram.toolManager.contextMenuTool;
            // This is the actual HTML context menu:

            // var mainbox = document.getElementById('mainbox')
            // mainbox.appendChild(div);

            // let menuList = mainbox.getElementsByClassName('context-menu')[0].getElementsByTagName('li');
            // var cxElement = mainbox.getElementsByClassName('context-menu')[0]
            console.log(this.cxElement);

            if (!this.cxElement) {
                // 外部没有传入菜单元素，则使用默认的菜单
                if (!this.defaultCxElement) {
                    this.defaultCxElement = this.customMenu();
                }
                var cxElement = this.defaultCxElement;
            } else {
                var cxElement = this.cxElement;
            }
            if (!cxElement) {
                return;
            }
            // We don't want the div acting as a context menu to have a (browser) context menu!
            cxElement.addEventListener("contextmenu", function (e) {
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
            cxTool.showContextMenu = function (contextmenu, obj) {
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
                console.log(diagram.lastInput);
                cxElement.style.left = mousePt.x + "px";
                cxElement.style.top = mousePt.y + "px";
                // console.log(diagram.lastInput.Dr.clientX)
                // console.log(mousePt.x)

                // cxElement.style.left = diagram.lastInput.Dr.clientX + "px";
                // cxElement.style.top = diagram.lastInput.Dr.clientY + "px";

                if (that.showContextMenuListener) {
                    return that.showContextMenuListener(this.diagram, node);
                }

                // ===========================================================
                // Show only the relevant buttons given the current state.
                var showMenus = that.getShowContextMenus(node);
                var liL = cxElement.getElementsByTagName('li');
                if (showMenus) {
                    console.log(showMenus.split(',').length);
                    for (var i = 0; i < liL.length; i++) {
                        liL[i].style.display = 'none';
                    }
                    for (var _i = 0; _i < showMenus.split(',').length; _i++) {
                        try {
                            if (helpers.getElementByAttr(cxElement, "li", "trtd_action", showMenus.split(',')[_i])[0]) {
                                helpers.getElementByAttr(cxElement, "li", "trtd_action", showMenus.split(',')[_i])[0].style.display = 'block';
                            }
                        } catch (e) {
                            console.error(e);
                            continue;
                        }
                        // cxElement.getElementsByClassName(showIds.split(',')[i])[0].style.display = 'block';
                    }
                } else {
                    if (showMenus == "") {
                        for (var _i2 = 0; _i2 < liL.length; _i2++) {
                            liL[_i2].style.display = 'block';
                        }
                    } else {
                        for (var _i3 = 0; _i3 < liL.length; _i3++) {
                            liL[_i3].style.display = 'none';
                        }
                    }
                }

                // Now show the whole context menu element
                cxElement.style.display = "block";
                // we don't bother overriding positionContextMenu, we just do it here:

                // cxElement.style.left = x+10 + "px";
                // cxElement.style.top = y-40 + "px";
                // Remember that there is now a context menu showing
            };
            // This is the corresponding override of ContextMenuTool.hideContextMenu:
            // This does not not need to call the base method.
            cxTool.hideContextMenu = function () {
                if (this.currentContextMenu === null) return;
                this.currentContextMenu = null;
                cxElement.style.display = "none";
                if (that.hideContextMenuListener) {
                    return that.hideContextMenuListener(myDiagram);
                }
            };
        }
    }, {
        key: 'getNodeContextMenu',
        value: function getNodeContextMenu() {
            return $(go.Adornment);

            var style = {
                // width: 120,
                // height: 30,
                // margin: 2,
                // font: "bold 14px sans-serif",
                // margin: 3,
            };

            return $(go.Adornment, "Vertical", $("ContextMenuButton", $(go.TextBlock, "应用样式到所有同级节点"), {
                click: function click(e, obj) {
                    menus.applyStyle2Level(e, obj);
                }
            }), $("ContextMenuButton", $(go.TextBlock, "应用样式到同级节点"), {
                click: function click(e, obj) {
                    menus.applyStyle2CurLevel(e, obj);
                }
            }), $("ContextMenuButton", $(go.TextBlock, "应用样式到子节点"), {
                click: function click(e, obj) {
                    menus.applyStyle2ChiLevel(e, obj);
                }
            }), $("ContextMenuButton", $(go.TextBlock, "添加"), {
                click: function click(e, obj) {
                    menus.addFollower(e);
                }
            }), $("ContextMenuButton", $(go.TextBlock, "添加子节点"), {
                click: function click(e) {
                    menus.startNewSpiral(e);
                }
            }), $("ContextMenuButton", $(go.TextBlock, "定位当前节点"), style, {
                click: function click(e) {}
            }), $("ContextMenuButton", $(go.TextBlock, "删除"), style, {
                click: function click(e, obj) {
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
            $("ContextMenuButton", $(go.TextBlock, "清空文本"), style, {
                click: function click(e, obj) {
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
            }), $("ContextMenuButton", $(go.TextBlock, "删除 DEL"), style, {
                click: function click(e, obj) {
                    var myDiagram = e.diagram;
                    var node = myDiagram.selection.first();
                    if (node) {
                        yunpan.yunpandel(e);
                    }
                    //removeNodePicture();
                }
            }), $("ContextMenuButton", $(go.TextBlock, "增加 CTRL+X/Y"), style, {
                click: function click(e, obj) {
                    var myDiagram = e.diagram;
                    var node = myDiagram.selection.first();
                    if (node) {
                        if (node.data.loc.split(" ")[1] === "0" && node.data.category !== "x") {
                            yunpan.addy(e);
                        } else if (node.data.loc.split(" ")[0] === "0" && node.data.category !== "y") {
                            yunpan.addx(e);
                        };
                    }
                    //removeNodePicture();
                }
            }), $("ContextMenuButton", $(go.TextBlock, "删除 DEL"), style, {
                click: function click(e, obj) {
                    var myDiagram = e.diagram;
                    var node = myDiagram.selection.first();
                    if (node) {
                        yunpan.yunpandel(e);
                    }
                    //removeNodePicture();
                }
            }), $("ContextMenuButton", $(go.TextBlock, "增加同级节点"), style, {
                click: function click(e, obj) {
                    var myDiagram = e.diagram;
                    var node = myDiagram.selection.first();
                    if (myDiagram.selection.first().data.istemp) {
                        return;
                    }
                    dipan.addFollowerGround(e);
                }
            }), $("ContextMenuButton", $(go.TextBlock, "增加子节点"), style, {
                click: function click(e, obj) {
                    var myDiagram = e.diagram;
                    var node = myDiagram.selection.first();
                    if (node.data.parent) {
                        var parentNode = node.diagram.findNodeForKey(node.data.parent);
                        if (parentNode.data.istemp) {
                            return;
                        }
                    }
                    dipan.addNewCircle(e);
                }
            }), $("ContextMenuButton", $(go.TextBlock, "删除"), style, {
                click: function click(e, obj) {
                    var myDiagram = e.diagram;
                    var node = myDiagram.selection.first();
                    if (node.data.parent) {
                        var parentNode = node.diagram.findNodeForKey(node.data.parent);
                        if (parentNode.data.istemp) {
                            return;
                        }
                    }
                    dipan.addNewCircle(e);
                }
            }), $("ContextMenuButton", $(go.TextBlock, "复制副本"), style, {
                click: function click(e, obj) {
                    var myDiagram = e.diagram;
                    var node = myDiagram.selection.first();
                    if (myDiagram.selection.first().data.istemp) {
                        return;
                    }
                    dipan.addFollowerGround(e);
                }
            }), $("ContextMenuButton", $(go.TextBlock, "权限设置"), style, {
                click: function click(e, obj) {
                    var myDiagram = e.diagram;
                    var node = myDiagram.selection.first();
                    if (node.data.parent) {
                        var parentNode = node.diagram.findNodeForKey(node.data.parent);
                        if (parentNode.data.istemp) {
                            return;
                        }
                    }
                    dipan.addNewCircle(e);
                }
            }), $("ContextMenuButton", $(go.TextBlock, "删除"), style, {
                click: function click(e, obj) {
                    var myDiagram = e.diagram;
                    var node = myDiagram.selection.first();
                    if (node.data.parent) {
                        var parentNode = node.diagram.findNodeForKey(node.data.parent);
                        if (parentNode.data.istemp) {
                            return;
                        }
                    }
                    dipan.addNewCircle(e);
                }
            }));
        }
    }, {
        key: 'dokeyDownFn',
        value: function dokeyDownFn() {
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

            if (e.event.keyCode === 13) {
                // could also check for e.control or e.shift
                if (node && node.data.category == 'Root') {
                    diagram.__trtd.addFollowerGround();
                } else if (node && node.data.category == 'dipan') {
                    diagram.__trtd.addFollowerGround();
                }
            } else if (e.event.keyCode === 9) {
                // could also check for e.control or e.shift
                if (node && node.data.category == 'Root') {

                    diagram.__trtd.addNewCircle();
                } else if (node && node.data.category == 'dipan') {
                    diagram.__trtd.addNewCircle();
                }
            } else if (e.key === "t") {
                // could also check for e.control or e.shift
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
            } else if (e.event.keyCode == 113) {
                //F2,覆盖地盘默认行为
                diagram.__trtd.selectText();
            } else if (e.event.keyCode == 37) {
                //左
                diagram.__trtd.moveWithinNodes('left');
            } else if (e.event.keyCode == 38) {
                //上
                diagram.__trtd.moveWithinNodes('up');
            } else if (e.event.keyCode == 39) {
                //右
                diagram.__trtd.moveWithinNodes('right');
            } else if (e.event.keyCode == 40) {
                //下
                diagram.__trtd.moveWithinNodes('down');
            } else {
                // call base method with no arguments
                go.CommandHandler.prototype.doKeyDown.call(cmd);
            }
            e.bubbles = false; //阻止事件冒泡到dom
            // };

            // return this.dokeyDownFn(this);
        }
    }]);

    return Trtd;
}();

function computeEffectiveCollection(parts) {
    console.log("computeEffectiveCollection");
    var coll = new go.Set();
    var node = parts.first();
    if (node) {
        if (node.containingGroup && node.containingGroup.data.category == "labelGroup") {
            var it = node.containingGroup.findSubGraphParts().iterator;
            coll.add(node.containingGroup);
            while (it.next()) {
                var n = it.value;
                coll.add(n);
            }
        } else {
            helpers.travelParts(node, function (p) {
                coll.add(p);
            });
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

function cxcommand(obj, val) {
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
            myDiagram.model.setDataProperty(node.data, "selectable", node.data.selectable != undefined ? !node.data.selectable : false);
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
            if (myDiagram.selection.first().data.istemp) {
                return;
            }
            obj.addFollowerGround();
            break;
        case "addChildDipanNode":
            var node = myDiagram.selection.first();
            if (node.data.parent) {
                var parentNode = node.diagram.findNodeForKey(node.data.parent);
                if (parentNode.data.istemp) {
                    return;
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

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// var sampleNodeTemplate = require('./sampleNodeTemplate')
var waveNodeTemplate = __webpack_require__(15);
// var waveTailNodeTemplate = require('./waveTailNodeTemplate')
var waveGroupNodeTemplate = __webpack_require__(16);
var axisGroupNodeTemplate = __webpack_require__(17);
var iconTextNodeTemplate = __webpack_require__(19);
var autoTextNodeTemplate = __webpack_require__(20);
var labelGroupNodeTemplate = __webpack_require__(21);
// var cbianNodeTemplate = require('./cbianNodeTemplate')
var picNodeTemplate = __webpack_require__(22);
var picGroupNodeTemplate = __webpack_require__(23);
var yunGroupNodeTemplate = __webpack_require__(24);
var yunpanGroupNodeTemplate = __webpack_require__(26);
var shapeNodeTemplate = __webpack_require__(28);
var shapeTextNodeTemplate = __webpack_require__(29);

module.exports = function (nodeType, options) {
    var temp = nodeType + 'NodeTemplate';
    console.log("factory:", temp);
    var nodeTemplateClass = eval(temp);
    return new nodeTemplateClass(options);
};

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _localization;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var localization = (_localization = {
	"trtd": {
		// "en":"Spherical Revolving World",
		"en": "Turn Round TD",
		"chn": "圆转天地"
	},
	"save": {
		"en": "Save",
		"chn": "保存"
	},
	"preview": {
		"en": "Preview",
		"chn": "预览"
	},
	"logout": {
		"en": "Log out",
		"chn": "退出"
	},
	"menu": {
		"en": "Menu",
		"chn": "菜单"
	},
	"usual": {
		"en": "Common",
		"chn": "常用"
	},
	"thinking": {
		"en": "Train of Thought",
		"chn": "思路"
	},
	"appearance": {
		"en": "Appearance",
		"chn": "外观"
	},
	"view": {
		"en": "View",
		"chn": "视图"
	},
	"insertll": {
		"en": "Insert the Lower Leve",
		"chn": "插入下级"
	},
	"insertsl": {
		"en": "Insert Sibling Level",
		"chn": "插入同级"
	},
	"undo": {
		"en": "Undo",
		"chn": "撤销"
	},
	"redo": {
		"en": "Redo",
		"chn": "重做"
	},
	"cte": {
		"en": "Click to edit",
		"chn": "单击编辑"
	},
	"dce": {
		"en": "Double Click to Edit",
		"chn": "双击编辑内容"
	},
	"centertheme": {
		"en": "Central Theme",
		"chn": "中心主题"
	},
	"edit": {
		"en": "Edit",
		"chn": "编辑"
	},
	"remove": {
		"en": "Delete",
		"chn": "删除"
	},
	"radius": {
		"en": "Size",
		"chn": "大小"
	},
	"shape": {
		"en": "Shape",
		"chn": "形状"
	},
	"borderwidth": {
		"en": "Border Width",
		"chn": "边框宽度"
	},
	"noborder": {
		"en": "No Border",
		"chn": "无边框"
	},
	"borderstyle": {
		"en": "Border Style",
		"chn": "边框样式"
	},
	"fillcolor": {
		"en": "Fill Color",
		"chn": "填充色"
	},
	"bordercolor": {
		"en": "Border Color",
		"chn": "边框颜色"
	},
	"image": {
		"en": "Pictures",
		"chn": "图片"
	},
	"insert": {
		"en": "Insert",
		"chn": "插入"
	},
	"delete": {
		"en": "Remove",
		"chn": "移除"
	},
	"remark": {
		"en": "Comment",
		"chn": "备注"
	},
	"removeallnode": {
		"en": "Empty Nodes",
		"chn": "清空节点"
	},
	"removeallline": {
		"en": "Delete Lines",
		"chn": "清空连线"
	},
	"arrangelayout": {
		"en": "Arrange layout",
		"chn": "整理布局"
	},
	"previewSubPan": {
		"en": "Preview SubPan",
		"chn": "预览子盘"
	},
	"arrowstyle": {
		"en": "Arrow Style",
		"chn": "箭头样式"
	},
	"linkstyle": {
		"en": "Link Style",
		"chn": "弧样式"
	},
	"clearText": {
		"en": "Clear Text",
		"chn": "清空文本"
	},
	"tdautolayout": {
		// "en":"Auto-placement of the TianPan",
		"en": "Auto layout",
		"chn": "天盘自动布局"
	},
	"jumptonewnode": {
		// "en":"Automatically Redirect to the New Nodes",
		"en": "Auto locate",
		"chn": "自动跳转到新的节点"
	},
	"theme": {
		"en": "Subject",
		"chn": "主题"
	},
	"backcolor": {
		"en": "Background Color",
		"chn": "背景颜色"
	},
	"objofaction": {
		"en": "Object",
		"chn": "作用对象"
	},
	"oneobj": {
		"en": "Single Node",
		"chn": "单个节点"
	},
	"sibobj": {
		"en": "Sibling Nodes",
		"chn": "同级节点"
	},
	"allsibobj": {
		"en": "All Sibling Nodes",
		"chn": "所有同级节点"
	},
	"allnodes": {
		"en": "All Nodes",
		"chn": "所有节点"
	},
	"shade": {
		"en": "Shade",
		"chn": "阴影"
	},
	"font": {
		"en": "Font",
		"chn": "字体"
	},
	"fontsize": {
		"en": "Font Size",
		"chn": "字号"
	},
	"compactdegree": {
		"en": "Compact Level",
		"chn": "紧凑程度"
	},
	"compact": {
		"en": "Compact",
		"chn": "紧凑"
	},
	"sparse": {
		"en": "Sparse",
		"chn": "稀疏"
	},
	"eq": {
		"en": "Equal Interval",
		"chn": "等间距"
	},
	"spread": {
		"en": "Spread",
		"chn": "展开"
	},
	"firstl": {
		"en": "First Layer",
		"chn": "第一层"
	},
	"secondl": {
		"en": "Second Layer",
		"chn": "第二层"
	},
	"threel": {
		"en": "Third Layer",
		"chn": "第三层"
	},
	"fourl": {
		"en": "Fourth Layer",
		"chn": "第四层"
	},
	"fifthl": {
		"en": "Fifth Layer",
		"chn": "第五层"
	},
	"localnodes": {
		"en": "Location Nodes",
		"chn": "定位节点"
	},
	"rootnode": {
		"en": "Root Node",
		"chn": "根节点"
	},
	"currentnode": {
		"en": "Current Nodes",
		"chn": "当前节点"
	},
	"displayallnodes": {
		"en": "Display All Nodes",
		"chn": "显示所有节点"
	},
	"return": {
		"en": "Back",
		"chn": "返回"
	},
	"tianpan": {
		"en": "TianPan",
		"chn": "天盘"
	},
	"dipan": {
		"en": "DiPan",
		"chn": "地盘"
	},
	"open": {
		"en": "Open",
		"chn": "打开"
	},
	"saveas": {
		"en": "Save As",
		"chn": "另存为"
	},
	"help": {
		"en": "Help",
		"chn": "帮助"
	},
	"new": {
		"en": "New",
		"chn": "新建"
	},
	"commontemplate": {
		"en": "Common template",
		"chn": "常用模板"
	},
	"openlocalfile": {
		"en": "Open local file",
		"chn": "打开本地文件"
	},
	"importtext": {
		"en": "Import outline text",
		"chn": "导入大纲文本"
	},
	"recentlyfile": {
		"en": "Recently used files",
		"chn": "最近使用的文件"
	},
	"exportdata": {
		"en": "Export Data",
		"chn": "另存为txt数据"
	},
	"exporttext": {
		"en": "Export Outline Text",
		"chn": "导出大纲文本"
	},
	"exportimg": {
		"en": "Export Pictures",
		"chn": "导出图片"
	},
	"websupport": {
		"en": "Website Support",
		"chn": "网站支持"
	},
	"techsupport": {
		"en": "Technical Support",
		"chn": "技术支持"
	},
	"techsupportqq": {
		"en": "Technical Support to QQ Groups",
		"chn": "技术支持QQ群"
	},
	"shortcutkey": {
		"en": "Shortcut Key",
		"chn": "快捷键"
	},
	"addchildnode": {
		"en": "Add Child",
		"chn": "增加子节点"
	},
	"addsibnode": {
		"en": "Add Sibling",
		"chn": "增加同级节点"
	},
	"key": {
		"en": "Key",
		"chn": "键"
	},
	"or": {
		"en": "Or",
		"chn": "或"
	},
	"confirmedittext": {
		"en": "Confirm the completion of editing text",
		"chn": "编辑完文字确认"
	},
	"editnewline": {
		"en": "Edit text newline",
		"chn": "编辑文字换行"
	},
	"canceltextedit": {
		"en": "Cancel Text Editing",
		"chn": "取消编辑文字"
	},
	"activetextedit": {
		"en": "Activate Text Editing",
		"chn": "激活编辑文字"
	},
	"sanpak": {
		"en": "Select a node and press any key",
		"chn": "选中节点后按任意字母键"
	},
	"auxview": {
		"en": "Auxiliary View",
		"chn": "辅助查看"
	},
	"focusselectnode": {
		"en": "Focus on selected nodes",
		"chn": "聚焦选中节点"
	},
	"locateselectednode": {
		"en": "Locate selected nodes",
		"chn": "定位选中节点"
	},
	"locaterootnode": {
		"en": "Locate Root Nodes",
		"chn": "定位根节点"
	},
	"bigcanvas": {
		"en": "Enlarge Canvas",
		"chn": "放大画布"
	},
	"smallcanvas": {
		"en": "Narrow Canvas",
		"chn": "缩小画布"
	},
	"switchnode": {
		"en": "Switch selected nodes",
		"chn": "切换选择的节点"
	},
	"mttnsn": {
		"en": "Move to the next sibling node",
		"chn": "移动到下一个同级节点"
	},
	"mttlsn": {
		"en": "Move to the last sibling node",
		"chn": "移动到上一个节点"
	},
	"mttfsn": {
		"en": "Move to the first child node",
		"chn": "移动到第一个节点"
	},
	"mtfn": {
		"en": "Move to Father Node",
		"chn": "移动到父节点"
	},
	"direckey": {
		"en": "Direction Key",
		"chn": "方向键"
	},
	"servicetd": {
		"en": "Send Feedback",
		"chn": "我要给圆转天地提意见"
	},
	"cbottc": {
		"en": "Change background of the DiPan",
		"chn": "更换地盘背景"
	},
	"rbottc": {
		"en": "Remove background of the DiPan",
		"chn": "移除地盘背景"
	},
	"icn": {
		"en": "Insert child nodes",
		"chn": "插入子节点"
	},
	"addnodepic": {
		"en": "Add Node Pictures",
		"chn": "添加节点图片"
	},
	"removepicture": {
		"en": "Remove Pictures",
		"chn": "移除图片"
	},
	"emptynodetext": {
		"en": "Empty Node Text",
		"chn": "清空节点文本"
	},
	"insertnodetianpan": {
		"en": "Insert Nodes of TianPan",
		"chn": "插入天盘节点"
	},
	"inserttext": {
		"en": "Insert Text",
		"chn": "插入文本"
	},
	"centerpicture": {
		"en": "Center Pictures",
		"chn": "居中图片"
	},
	"ewah": {
		"en": "Equal Width and Hight",
		"chn": "等宽高"
	},
	"bringtofront": {
		"en": "Bring to Front",
		"chn": "置于顶层"
	},
	"bringtobottom": {
		"en": 'Bring to Bottom',
		"chn": "置于底层"
	},
	"bringforward": {
		"en": "Bring Forward",
		"chn": "上移一层"
	},
	"fixnode": {
		"en": "Fixed Nodes",
		"chn": "固定节点"
	},
	"cancelfix": {
		"en": "Cancel Fixed",
		"chn": "取消固定"
	},
	//strings:"Theme Colors,Standard Colors,Web Colors,Theme Colors,Back to Palette,History,No history yet."
	"themecolor": {
		"en": "Theme Colors",
		"chn": "主题颜色"
	},
	"standardcolor": {
		"en": "Standard Colors",
		"chn": "标准颜色"
	},
	"webcolor": {
		"en": "Web Colors",
		"chn": "更多颜色"
	},
	"backtop": {
		"en": "Back to Palette",
		"chn": "返回主题颜色"
	},
	"history": {
		"en": "History",
		"chn": "历史"
	},
	"nohistory": {
		"en": "No history yet",
		"chn": "暂无历史"
	},
	"week": {
		"en": "Week",
		"chn": "最近一周"
	},
	"Jan": {
		"en": "January",
		"chn": "一月"
	},
	"Feb": {
		"en": "February",
		"chn": "二月"
	},
	"Mar": {
		"en": "March",
		"chn": "三月"
	},
	"Apr": {
		"en": "April",
		"chn": "四月"
	},
	"May": {
		"en": "May",
		"chn": "五月"
	},
	"Jun": {
		"en": "June",
		"chn": "六月"
	},
	"Jul": {
		"en": "July",
		"chn": "七月"
	},
	"Aug": {
		"en": "August",
		"chn": "八月"
	},
	"Sep": {
		"en": "September",
		"chn": "九月"
	},
	"Oct": {
		"en": "October",
		"chn": "十月"
	},
	"Nov": {
		"en": "November",
		"chn": "十一月"
	},
	"Dec": {
		"en": "December",
		"chn": "十二月"
	},
	"insertimg": {
		"en": "Insert Pictures",
		"chn": "插入图片"
	},
	"imglist": {
		"en": "Pictures list",
		"chn": "图片列表"
	},
	"uploadimg": {
		"en": "Upload Picture",
		"chn": "上传图片"
	},
	"katong": {
		"en": "Cartoon Picture",
		"chn": "卡通图片"
	},
	"numbericon": {
		"en": "Number Icons",
		"chn": "数字图片"
	},
	"qipao": {
		"en": "Bubble",
		"chn": "气泡"
	},
	"custompic": {
		"en": "Custom Picture",
		"chn": "自定义图片"
	},
	"picture": {
		"en": "Picture",
		"chn": "图片"
	},
	"cancel": {
		"en": "Cancel",
		"chn": "取消"
	},
	"ok": {
		"en": "Ok",
		"chn": "确定"
	},
	"previewimg": {
		"en": "Preview Pictures",
		"chn": "预览图片"
	},
	"copyimg": {
		"en": "Copy Picture",
		"chn": "复制图片"
	},
	"copyimgsucces": {
		"en": "Already Copy Picture Into Clipboard",
		"chn": "成功复制图片到粘贴板"
	},
	"dragtoupload": {
		"en": "Drag to Upload Picture",
		"chn": "拖拽到此处上传"
	},
	"linkaddress": {
		"en": "Link Address",
		"chn": "链接地址"
	},
	"insertremark": {
		"en": "Insert Comment",
		"chn": "插入备注"
	},
	"insertlink": {
		'en': "Insert Link",
		"chn": "插入链接"
	},
	"copy": {
		"en": "copy",
		"chn": "复制"
	},
	"picdin": {
		"en": "Picture definition",
		"chn": "图片清晰度"
	},
	"hsacc": {
		"en": "Hierarchical Subject",
		"chn": "天盘层级主题"
	},
	"mtwtb": {
		"en": "Bold Border Subject",
		"chn": "天盘白字粗变主题"
	},
	"officetheme": {
		"en": "Office Subject",
		"chn": "Office主题"
	},
	"lctheme": {
		"en": "Light-coloured Subject",
		"chn": "浅色主题"
	},
	"web2theme": {
		"en": "web2.0 Subject",
		"chn": "Web2.0主题"
	},
	"metrotheme": {
		"en": "Metro Subject",
		"chn": "Metro主题"
	},
	"retrotheme": {
		"en": "Retro Subject",
		"chn": "复古主题"
	},
	"bustheme": {
		"en": "Business Subject",
		"chn": "商业主题"
	},
	"hiet1": {
		"en": "Hierachy Subject 1",
		"chn": "层次主题1"
	},
	"hiet2": {
		"en": "Hierachy Subject 2",
		"chn": "层次主题2"
	},
	"eayth": {
		"en": "Earlier Version Subject",
		"chn": "旧版主题"
	},
	"blankth": {
		"en": "Pure-black Subject",
		"chn": "纯黑色主题"
	},
	"transthe": {
		"en": "Transparent Subject",
		"chn": "透明主题"
	},
	"randomdipan": {
		"en": "Random Subject of the DiPan",
		"chn": "随机地盘主题"
	},
	"radomcolor1": {
		"en": "Random Colour 1",
		"chn": "随机色彩1"
	},
	"radomcolor2": {
		"en": "Random Colour 1",
		"chn": "随机色彩2"
	},
	"mylocalfile": {
		"en": "My local file",
		"chn": "我的本地文件"
	},
	"ut2c": {
		"en": "Up to 20 characters",
		"chn": "最多20个字符"
	},
	"success": {
		"en": "Success",
		"chn": "成功"
	},
	"danger": {
		"en": "Fail",
		"chn": "失败"
	},
	"info": {
		"en": "Info",
		"chn": "提示"
	},
	"strf": {
		"en": "Save the file in:Menu->Open->Recently used file",
		"chn": "文件保存在:菜单->打开->最近使用文件中"
	},
	"netonffline": {
		"en": "Network is not connected, commonly used template download failed",
		"chn": "网络未连接，常用模板下载失败"
	},
	"cantcheckver": {
		"en": "The network is not connected, the version of the test failed",
		"chn": "网络未连接，版本检测失败"
	},
	"spacebar": {
		"en": "Space bar",
		"chn": "空格键"
	},
	"supportmail": {
		"en": "Support Mail",
		"chn": "技术支持邮箱"
	},
	"updatesuccess": {
		"en": "Update sucess",
		"chn": "更新成功"
	},
	"blankText": {
		"en": "Blank text",
		"chn": "空白文本"
	},

	/**simditor
 	*
 	**/
	'blockquote': {
		'en': 'Block Quote',
		'chn': '引用'
	},
	'bold': {
		'en': 'Bold',
		'chn': '加粗文字'
	},
	'code': {
		'en': 'Code',
		'chn': '插入代码'
	},
	'color': {
		'en': 'Text Color',
		'chn': '文字颜色'
	},
	'coloredText': {
		'en': 'Colored Text',
		'chn': '彩色文字'
	},
	'hr': {
		'en': 'Horizontal Line',
		'chn': '分隔线'
	}
}, _defineProperty(_localization, "image", {
	'en': 'Insert Image',
	'chn': '插入图片'
}), _defineProperty(_localization, 'externalImage', {
	'en': 'External Image',
	'chn': '外链图片'
}), _defineProperty(_localization, 'uploadImage', {
	'en': 'Upload Image',
	'chn': '上传图片'
}), _defineProperty(_localization, 'uploadFailed', {
	'en': 'Upload failed',
	'chn': '上传失败了'
}), _defineProperty(_localization, 'uploadError', {
	'en': 'Error occurs during upload',
	'chn': '上传出错了'
}), _defineProperty(_localization, 'imageUrl', {
	'en': 'Url',
	'chn': '图片地址'
}), _defineProperty(_localization, 'imageSize', {
	'en': 'Size',
	'chn': '图片尺寸'
}), _defineProperty(_localization, 'imageAlt', {
	'en': 'Alt',
	'chn': '图片描述'
}), _defineProperty(_localization, 'restoreImageSize', {
	'en': 'Restore Origin Size',
	'chn': '还原图片尺寸'
}), _defineProperty(_localization, 'uploading', {
	'en': 'Uploading',
	'chn': '正在上传'
}), _defineProperty(_localization, 'indent', {
	'en': 'Indent',
	'chn': '向右缩进'
}), _defineProperty(_localization, 'outdent', {
	'en': 'Outdent',
	'chn': '向左缩进'
}), _defineProperty(_localization, 'italic', {
	'en': 'Italic',
	'chn': '斜体文字'
}), _defineProperty(_localization, 'link', {
	'en': 'Insert Link',
	'chn': '插入链接'
}), _defineProperty(_localization, 'linkText', {
	'en': 'Text',
	'chn': '链接文字'
}), _defineProperty(_localization, 'linkUrl', {
	'en': 'Url',
	'chn': '链接地址'
}), _defineProperty(_localization, 'linkTarget', {
	'en': 'Target',
	'chn': '打开方式'
}), _defineProperty(_localization, 'openLinkInCurrentWindow', {
	'en': 'Open link in current window',
	'chn': '在新窗口中打开'
}), _defineProperty(_localization, 'openLinkInNewWindow', {
	'en': 'Open link in new window',
	'chn': '在当前窗口中打开'
}), _defineProperty(_localization, 'removeLink', {
	'en': 'Remove Link',
	'chn': '移除链接'
}), _defineProperty(_localization, 'ol', {
	'en': 'Ordered List',
	'chn': '有序列表'
}), _defineProperty(_localization, 'ul', {
	'en': 'Unordered List',
	'chn': '无序列表'
}), _defineProperty(_localization, 'strikethrough', {
	'en': 'Strikethrough',
	'chn': '删除线文字'
}), _defineProperty(_localization, 'table', {
	'en': 'Table',
	'chn': '表格'
}), _defineProperty(_localization, 'deleteRow', {
	'en': 'Delete Row',
	'chn': '删除行'
}), _defineProperty(_localization, 'insertRowAbove', {
	'en': 'Insert Row Above',
	'chn': '在上面插入行'
}), _defineProperty(_localization, 'insertRowBelow', {
	'en': 'Insert Row Below',
	'chn': '在下面插入行'
}), _defineProperty(_localization, 'deleteColumn', {
	'en': 'Delete Column',
	'chn': '删除列'
}), _defineProperty(_localization, 'insertColumnLeft', {
	'en': 'Insert Column Left',
	'chn': '在左边插入列'
}), _defineProperty(_localization, 'insertColumnRight', {
	'en': 'Insert Column Right',
	'chn': '在右边插入列'
}), _defineProperty(_localization, 'deleteTable', {
	'en': 'Delete Table',
	'chn': '删除表格'
}), _defineProperty(_localization, 'title', {
	'en': 'Title',
	'chn': '标题'
}), _defineProperty(_localization, 'normalText', {
	'en': 'Text',
	'chn': '普通文本'
}), _defineProperty(_localization, 'underline', {
	'en': 'Underline',
	'chn': '下划线文字'
}), _defineProperty(_localization, 'alignment', {
	'en': 'Alignment',
	'chn': '水平对齐'
}), _defineProperty(_localization, 'alignCenter', {
	'en': 'Align Center',
	'chn': '居中'
}), _defineProperty(_localization, 'alignLeft', {
	'en': 'Align Left',
	'chn': '居左'
}), _defineProperty(_localization, 'alignRight', {
	'en': 'Align Right',
	'chn': '居右'
}), _defineProperty(_localization, 'selectLanguage', {
	'en': 'Select Language',
	'chn': '选择程序语言'
}), _defineProperty(_localization, 'fontScale', {
	'en': 'Font Size',
	'chn': '字体大小'
}), _defineProperty(_localization, 'fontScaleXLarge', {
	'en': 'X Large Size',
	'chn': '超大字体'
}), _defineProperty(_localization, 'fontScaleLarge', {
	'en': 'Large Size',
	'chn': '大号字体'
}), _defineProperty(_localization, 'fontScaleNormal', {
	'en': 'Normal Size',
	'chn': '正常大小'
}), _defineProperty(_localization, 'fontScaleSmall', {
	'en': 'Small Size',
	'chn': '小号字体'
}), _defineProperty(_localization, 'fontScaleXSmall', {
	'en': 'X Small Size',
	'chn': '超小字体'
}), _defineProperty(_localization, 'savesuccess', {
	'en': 'Save successful',
	'chn': '保存成功'
}), _defineProperty(_localization, 'failsuccess', {
	'en': 'Save failed',
	'chn': '保存失败'
}), _defineProperty(_localization, 'layoutmode', {
	'en': 'Layout Mode',
	'chn': '布局方式'
}), _defineProperty(_localization, 'outequaldivid', {
	'en': 'Divided by the last layer',
	'chn': '外圈均分'
}), _defineProperty(_localization, 'innerequaldivid', {
	'en': 'Divided by the first layer',
	'chn': '内圈均分'
}), _defineProperty(_localization, 'givenlayer', {
	'en': 'Designate',
	'chn': '指定层均分'
}), _defineProperty(_localization, 'textdirection', {
	'en': 'Text Direction',
	'chn': '文字方向'
}), _defineProperty(_localization, 'textrotate', {
	'en': 'Rotate',
	'chn': '旋转'
}), _defineProperty(_localization, 'textoutside', {
	'en': 'Toward the outside',
	'chn': '放射'
}), _defineProperty(_localization, 'upwards', {
	'en': 'Upwards',
	'chn': '正向'
}), _defineProperty(_localization, 'sectorthickness', {
	'en': 'Sector thickness',
	'chn': '扇区宽度'
}), _defineProperty(_localization, 'thicknessrange', {
	'en': 'Range 100~300',
	'chn': '范围 100~300'
}), _defineProperty(_localization, 'currentfile', {
	'en': "Current File",
	'chn': '编辑中'
}), _defineProperty(_localization, 'uploadsuccess', {
	'en': 'Upload successful',
	'chn': '上传成功'
}), _defineProperty(_localization, 'deletenodeinfo', {
	'en': 'Are you sure to delete the node and its child nodes?',
	'chn': '删除节点会删除它的所有子节点，确实要删除吗？'
}), _defineProperty(_localization, 'exporttdp', {
	'en': 'Save as .tdp shared file',
	'chn': '另存为.tdp共享文件'
}), _defineProperty(_localization, "hypertype", {
	"en": "Type",
	"chn": "链接类型"
}), _defineProperty(_localization, "url", {
	"en": "URL",
	"chn": "网址"
}), _defineProperty(_localization, "localfile", {
	"en": "Local file",
	"chn": "本地文件"
}), _defineProperty(_localization, "tiandipan", {
	"en": "Tianpan or Dipan",
	"chn": "天地盘"
}), _defineProperty(_localization, "link", {
	"en": "Hyperlink",
	"chn": "链接"
}), _defineProperty(_localization, "outlineeditor", {
	en: "Outline Editor",
	chn: "大纲编辑"
}), _defineProperty(_localization, "modificationbuttons", {
	en: "Modification Buttons",
	chn: "修改按钮"
}), _defineProperty(_localization, "browsingbuttons", {
	en: "Browsing Buttons",
	chn: "浏览按钮"
}), _defineProperty(_localization, "show", {
	en: "Show",
	chn: "显示"
}), _defineProperty(_localization, "hide", {
	en: "Hide",
	chn: "隐藏"
}), _defineProperty(_localization, "newnode", {
	en: "New Node",
	chn: "新节点"
}), _defineProperty(_localization, "moveupnode", {
	en: "Move up",
	chn: "上移节点"
}), _defineProperty(_localization, "movedownnode", {
	en: "Move down",
	chn: "下移节点"
}), _defineProperty(_localization, "removenode", {
	en: "Remove",
	chn: "删除节点"
}), _defineProperty(_localization, "editnode", {
	en: "Edit Node",
	chn: "编辑节点"
}), _defineProperty(_localization, "prevnode", {
	en: "Select Previous",
	chn: "上一个节点"
}), _defineProperty(_localization, "nextnode", {
	en: "Select Next",
	chn: "下一个节点"
}), _defineProperty(_localization, "expandnode", {
	en: "Expand",
	chn: "展开节点"
}), _defineProperty(_localization, "collapsenode", {
	en: "Collapse",
	chn: "折叠节点"
}), _defineProperty(_localization, "expandall", {
	en: "Expand All",
	chn: "全部展开"
}), _defineProperty(_localization, "collapseall", {
	en: "Collapse All",
	chn: "全部折叠"
}), _defineProperty(_localization, "preview", {
	en: "Preview",
	chn: "预览"
}), _defineProperty(_localization, "cancel", {
	en: "Cancel",
	chn: "取消"
}), _defineProperty(_localization, "apply", {
	en: "Apply",
	chn: "应用"
}), _defineProperty(_localization, 'openpreviewimg', {
	'en': 'Preview image is loading',
	'chn': '正在打开预览图片'
}), _defineProperty(_localization, 'tempnodetips', {
	'en': 'This is a temp node',
	'chn': '这是临时节点'
}), _defineProperty(_localization, "buildtdp", {
	en: 'Build .tdp shared file',
	chn: '生成.tdp文件下载'
}), _defineProperty(_localization, 'deleteconfirm', {
	en: 'Are you sure to clear all the nodes?',
	chn: '确定要清空节点？'
}), _defineProperty(_localization, "selecttargertnode", {
	en: "Select Target Node",
	cn: "请选择目标节点"
}), _defineProperty(_localization, "link2web", {
	en: "Link to Webpage",
	cn: "链接网页"
}), _defineProperty(_localization, "link2node", {
	en: "Link to Node",
	cn: "链接节点"
}), _defineProperty(_localization, "removelink", {
	en: "Remove Link",
	cn: "移除节点"
}), _defineProperty(_localization, "addtemp", {
	en: "Add Template",
	cn: "添加模板"
}), _defineProperty(_localization, "buildtdp", {
	en: 'Build .tdp shared file',
	chn: '生成.tdp文件下载'
}), _defineProperty(_localization, "deleteconfirm", {
	en: 'Are you sure to clear all the nodes?',
	chn: '确定要清空节点？'
}), _defineProperty(_localization, "success", {
	en: 'Success',
	chn: "成功"
}), _defineProperty(_localization, "warning", {
	en: 'Warning',
	chn: '警告'
}), _defineProperty(_localization, "error", {
	en: 'Failed',
	chn: '失败'
}), _defineProperty(_localization, "unsupportfile", {
	en: "Unsupported File!",
	cn: "不支持该导入文件"
}), _localization);
var trans = function trans(key) {
	return localization[key] ? localization[key][localStorage.getItem("language")] ? localization[key][localStorage.getItem("language")] : localization[key]['chn'] : key;
};

module.exports = { trans: trans };

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// 'use strict';

var typeModules = {};
console.log("hardcorelog   aaaaaaaaaaaaaaa");
typeModules['tianpan'] = __webpack_require__(4);
typeModules['dipan'] = __webpack_require__(31);
typeModules['jin'] = __webpack_require__(32);
typeModules['huo'] = __webpack_require__(33);
typeModules['shui'] = __webpack_require__(34);
typeModules['yunpan'] = __webpack_require__(35);
typeModules['wheel'] = __webpack_require__(36);
typeModules['dspiral'] = __webpack_require__(37);
// typeModules['yunpanhome'] = require(`./diagram/yunpanhome`)


if (false) {
    console.log("生产环境屏蔽调试日志");
    // console.log   = function(){

    // }
}
// console.error   = function(...messages){
//     logger.error(`${JSON.stringify(messages)}`)
// }

var Trtd = function Trtd(div, config) {
    _classCallCheck(this, Trtd);

    try {
        if (config.model) {
            var tmpModel = go.Model.fromJson(config.model);
            if (tmpModel && tmpModel.modelData && tmpModel.modelData.type) {
                config.type = tmpModel.modelData.type;
            }
        }
    } catch (e) {
        console.error(e);
    }
    console.log("type:", config.type);
    var trtdClass = typeModules[config.type];
    return new trtdClass(div, config);
};

Trtd.go = go;
/*eslint-disable no-undef */
Trtd.version = "0.0.29";
/*eslint-enable no-undef */
console.info('Trtd version:' + Trtd.version);
window.localStorage.setItem("HARDCORE_VERSION", Trtd.version);
if (typeof window !== 'undefined') {
    window.Trtd = Trtd;
}

// export default Trtd;
module.exports = Trtd;

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/*
*  Copyright (C) 1998-2015 by Northwoods Software Corporation. All Rights Reserved.
*/

// A custom Layout that lays out a chain of nodes in a spiral

/**
 * @constructor
 * @extends Layout
 * @class
 * This layout assumes the graph is a chain of Nodes,
 * {@link #spacing} controls the spacing between nodes.
 */

// 'use strict';

// import * as go from 'gojs';
var $ = go.GraphObject.make;
var tdDebug = false;
var tdSpacing = 0.7;
var tdSpiralMode = 'sparse';

function SpiralLayout() {
    go.Layout.call(this);
    this._radius = NaN;
    this._spacing = 10;
    this._clockwise = true;
    this._pointlist = [];
}
go.Diagram.inherit(SpiralLayout, go.Layout);

/**
 * @ignore
 * Copies properties to a cloned Layout.
 * @this {SpiralLayout}
 * @param {Layout} copy
 * @override
 */
SpiralLayout.prototype.cloneProtected = function (copy) {
    go.Layout.prototype.cloneProtected.call(this, copy);

    copy._radius = this._radius;
    copy._spacing = this._spacing;
    copy._clockwise = this._clockwise;
};

//根据基圆半径和角度参数确定螺旋线上的一个点
//渐开线的参数方程
function getInvolutePoint(radius, angle) {
    var cos = Math.cos(angle);
    var sin = Math.sin(angle);
    var x = radius * (cos + angle * sin);
    var y = radius * (sin - angle * cos);
    return new go.Point(x, y);
}

//检查给定区域是否和nodes内所有节点重叠
function checkCoveredWithNodes(rect, nodesRectList) {
    var _cover = false;

    var it = nodesRectList.iterator;
    while (it.next()) {

        if (Math.sqrt(rect.point.distanceSquaredPoint(it.value.point)) < rect.radius + it.value.radius) {
            //console.log([" node:", it.value.node.data.key,'is in the radius ',node.actualBounds.width,' of:',node.data.key].join(" "));
            _cover = true;
            break;
        }
    }
    return _cover;
}

/**
 * This method actually positions all of the Nodes, assuming that the ordering of the nodes
 * is given by a single link from one node to the next.
 * This respects the {@link #spacing} property to affect the layout.
 * @this {SpiralLayout}
 * @param {Diagram|Group|Iterable} coll the collection of Parts to layout.
 */
SpiralLayout.prototype.doLayout = function (coll) {

    if (this.network === null) {
        this.network = this.makeNetwork(coll);
    }
    //console.log("begin new layout");
    var root = null;
    var findFlag = false;
    var v;
    // find a root vertex -- one without any incoming edges
    var it = this.network.vertexes.iterator;
    var topNodes = [];
    while (it.next()) {
        //console.log(it.value.node.data.key+":"+it.value.node.data.text);
        v = it.value;
        if (!findFlag) {
            if (root === null) root = v; // in case there are only circles
            if (v.sourceEdges.count === 0) {
                root = v;
                findFlag = true;
            }
        } else {
            if (v.sourceEdges.count === 0) {
                topNodes.push(v);
            }
        }
    }

    // couldn't find a root vertex
    if (root === null) {
        this.network = null;
        return;
    }

    var cw = this.clockwise ? 1 : -1;
    var rad;

    var angle = 2.5;
    var isautolayout = window.localStorage.getItem('isautolayout') == null ? true : window.localStorage.getItem('isautolayout') == 'true';
    // now locate each of the following nodes, in order, along a spiral
    var vert;
    var x, y;
    var _pointlist;
    var _do = true;
    var count = 0; //循环计数
    var res;
    var initialAngle = 5;
    var edge,
        fromVert,
        dangle,
        index,
        dept,
        dl,
        nextedge,
        nextvert,
        nodesDealed = new go.List(),
        curRect,
        //当前节点的矩形区域
    newPoint,
        dia,
        distance = 150,
        equaldistance;
    if (tdSpiralMode == 'terse') {
        distance = 20;
    }
    if (tdSpiralMode == 'sparse') {
        distance = 150;
    }
    var tmpR; //计算中间值
    edge = root.destinationEdges.first();
    vert = edge !== null ? edge.toVertex : null;

    root.node.rad = rad;
    var childCount = 0;
    var hasGroup = false;
    while (vert !== null) {
        childCount++;
        if (vert.node.data['isGroup']) {
            hasGroup = true;
        }
        nextedge = vert.destinationEdges.first();
        nextvert = nextedge !== null ? nextedge.toVertex : null;
        edge = nextedge;
        //fromVert = vert;
        vert = nextvert;
    }
    edge = root.destinationEdges.first();
    vert = edge !== null ? edge.toVertex : null;

    rad = 1;
    var tmpPoint;
    //找到第一个节点和根节点不相交的rad值
    if (vert) {
        tmpR = vert.node.actualBounds.width;
        //var rootRect = new go.Rect(root.node.location.x - root.node.actualBounds.width / 2, root.node.location.y - root.node.actualBounds.height / 2, root.node.actualBounds.width, root.node.actualBounds.height);
        var radiusDis = root.node.actualBounds.width / 2 + vert.node.actualBounds.width / 2;
        while (true) {
            tmpPoint = getInvolutePoint(rad, initialAngle);
            tmpPoint = new go.Point(tmpPoint.x + root.node.location.x, tmpPoint.y + root.node.location.y);
            if (Math.sqrt(tmpPoint.distanceSquaredPoint(root.node.location)) > radiusDis + 10) {
                //+10 是为了防止第一个子节点和根节点接壤
                break;
            } else {
                rad += 0.1;
            }
        }
    }
    var adjustAngleCount = 0;

    while (_do) {

        count++; //计数
        //初始化参数
        angle = initialAngle;
        edge = root.destinationEdges.first();
        //if (edge !== null && edge.link !== null) edge.link.curviness = rad;
        root.node.data.angle = 0;
        if (edge !== null && edge.link !== null) edge.link.curviness = cw * rad;
        var curviness = edge == null ? 20 : edge.link.curviness;
        // now locate each of the following nodes, in order, along a spiral
        vert = edge !== null ? edge.toVertex : null;

        fromVert = root;
        index = 0;
        var angleOld; //增加angle时保留的原始值，用于恢复
        x = 0, y = 0;
        //_pointlist = [];
        // _pointlist.push(root.node.data.key + ":(0,0)");
        if (vert) vert.node.data.angle = angle;
        nodesDealed.clear();
        //nodesDealed.add(new go.Rect(root.node.location.x - root.node.actualBounds.width / 2, root.node.location.y - root.node.actualBounds.height / 2, root.node.actualBounds.width, root.node.actualBounds.height));
        nodesDealed.add({ point: root.node.location, radius: root.node.actualBounds.width / 2 });

        //等弧长
        //equaldistance = Math.sqrt(getInvolutePoint(rad, 5 * Math.PI / 2).distanceSquaredPoint(getInvolutePoint(rad, 5 * Math.PI / 2 - tdSpacing)));

        //equaldistance = Math.sqrt(getInvolutePoint(rad, 5 * Math.PI / 2).distanceSquaredPoint(getInvolutePoint(rad, 5 * Math.PI / 2 - tdSpacing)));
        if (tdSpiralMode == 'terse') {
            equaldistance = Math.sqrt(getInvolutePoint(rad, 5).distanceSquaredPoint(getInvolutePoint(rad, 6)));
        } else {
            equaldistance = Math.sqrt(getInvolutePoint(rad, 5 * Math.PI / 2).distanceSquaredPoint(getInvolutePoint(rad, 5 * Math.PI / 2 - tdSpacing)));
        }
        //重新开始布局节点
        while (vert !== null) {
            index++;
            root.node.data.rad = rad;
            //console.log(vert.node.data.key + ":" + vert.node.data.text);
            // involute spiral
            //循环判断是否有覆盖，如果覆盖增加基圆半径，重新计算下一个位置
            dangle = 0.4;
            angleOld = angle;
            //for(dangle=0.1;dangle<=0.9;dangle+=0.1){
            for (var i = 0; i <= 20; i++) {
                //圆的渐开线参数方程算出下一个节点位置
                newPoint = getInvolutePoint(rad, angle);
                newPoint = new go.Point(newPoint.x + root.node.location.x, newPoint.y + root.node.location.y);
                x = newPoint.x;
                y = newPoint.y;

                if (vert.node instanceof go.Group && edge.link.toNode !== vert.node) {
                    var offset = edge.link.toNode.location.copy().subtract(vert.node.location);
                    newPoint.x -= offset.x;
                    newPoint.y -= offset.y;
                }
                //tmpR = vert.node.actualBounds.width / 2 * Math.sqrt(2);
                tmpR = vert.node.actualBounds.width / 2;
                //curRect = new go.Rect(newPoint.x - tmpR/ 2, newPoint.y - tmpR / 2, tmpR, tmpR);
                curRect = { point: newPoint, radius: tmpR };
                res = checkCoveredWithNodes(curRect, nodesDealed);
                //res = checkCovered(vert.node, newPoint, this.network.vertexes,nodesDealed);
                //  //检查覆盖
                if (res) {
                    adjustAngleCount++;
                    if (angle >= fromVert.node.data.angle + Math.PI / 2) {
                        angle = fromVert.node.data.angle + Math.PI / 2;
                        break;
                    }
                    //if (angle <= fromVert.node.data.angle + 0.2) {
                    //  angle = fromVert.node.data.angle + 0.2;
                    //}
                    if (tdSpiralMode != 'equidistant') {
                        //等距模式，不自动调节距离
                        angle = fromVert.node.data.angle + (i + 1) * Math.PI / 16; //加的算法
                        //dia = Math.max(equaldistance,vert.node.actualBounds.width / 2+ nextvert.node.actualBounds.width / 2);
                        dept = cw * Math.atan((vert.node.actualBounds.width / 2 + fromVert.node.actualBounds.width / 2 + distance) / Math.sqrt(vert.node.location.distanceSquaredPoint(root.node.location)));
                        if (angle <= fromVert.node.data.angle + dept) {
                            //保证最小间距
                            angle = fromVert.node.data.angle + dept;
                        }
                    } else {
                        break;
                    }
                } else {
                    break;
                }
            }

            //检查覆盖，如果增加angle的方式没有消除覆盖，则增加半径
            if (res) {
                rad += 1; //加的算法
                //angle = angleOld;
                break; //如果有覆盖，则增加基圆半径，保证没有覆盖
                //console.log("rad:"+rad);
            }

            nextedge = vert.destinationEdges.first();
            nextvert = nextedge !== null ? nextedge.toVertex : null;

            vert.centerX = newPoint.x;
            vert.centerY = newPoint.y;
            vert.node.data.angle = angle;

            edge.link.data.unautoLink = false;
            edge.link.rad = rad;
            edge.link.angle1 = fromVert.node.data.angle;
            edge.link.angle2 = vert.node.data.angle;

            var equalSpiral = false;
            if (true) {
                //角度小于一圈，且节点个数小于等于4个时，为了优化线条，节点间距离拉大，节点距离通过angle控制
                //if (childCount <= 6  ) {
                if (tdSpiralMode != 'terse') {
                    //紧凑模式下，不自动调节节点
                    if (childCount <= 6) {
                        if (childCount * 1.3 < 3 * Math.PI / 2 && !hasGroup) {
                            angle += Math.min(3 * Math.PI / 2 / childCount, Math.PI / 2);
                        } else {
                            if (vert.node.data["isGroup"]) {
                                equalSpiral = true;
                            } else {
                                angle += 1.3;
                            }
                        }
                        //angle += 0.9;
                    } else {
                        //角度大于一圈，时等间距
                        equalSpiral = true;
                    }
                } else {
                    equalSpiral = true;
                }

                if (equalSpiral) {
                    if (nextvert == null) {
                        dia = equaldistance;
                        dept = cw * Math.atan((dia + distance) / Math.sqrt(newPoint.distanceSquaredPoint(root.node.location))); //why?
                    } else {
                        dia = Math.max(equaldistance, vert.node.actualBounds.width / 2 + nextvert.node.actualBounds.width / 2);
                        dept = cw * Math.atan((dia + distance) / Math.sqrt(newPoint.distanceSquaredPoint(root.node.location))); //why?
                    }
                    angle += dept;
                }
            }

            tmpR = vert.node.actualBounds.width;
            nodesDealed.add(curRect);
            //nodesDealed.add({point:new go.Point(vert.centerX, vert.centerY), radius:vert.node.actualBounds.width/2});
            edge = nextedge;
            fromVert = vert;
            vert = nextvert;
        }

        if (vert == null) {
            _do = false;
        }
    }

    // console.log(root.node.data.key + ":total compute layout times:" + count);
    this.updateParts();

    this.network = null;
    if (tdDebug) {
        console.log("spiral dolayout end " + root.node.data.key);
    }
};

SpiralLayout.prototype.commitLayout = function () {
    this.network.vertexes.each(function (v) {
        v.commit();
    });
    this.network.edges.each(function (v) {
        v.commit();
    });
    if (tdDebug) {
        console.log("spiral layout end ");
    }
    //this.invalidateLayout();
};

/**
 * @ignore
 * Compute the effective diameter of a Node.
 * @this {SpiralLayout}
 * @param {LayoutVertex} v
 * @return {number}
 */
SpiralLayout.prototype.diameter = function (v) {
    if (!v) return 0;
    var b = v.bounds;
    return Math.sqrt(b.width * b.width / 4 + b.height * b.height / 4);
};

/**
 * Gets or sets the radius distance.
 * The default value is NaN.
 * @name SpiralLayout#radius
 * @function.
 * @return {number}
 */

Object.defineProperty(SpiralLayout.prototype, "radius", {
    get: function get() {
        return this._radius;
    },
    set: function set(val) {
        if (typeof val !== "number") throw new Error("new value for SpiralLayout.radius must be a number, not: " + val);
        if (this._radius !== val) {
            this._radius = val;
            this.invalidateLayout();
        }
    }
});

/**
 * Gets or sets the spacing between nodes.
 * The default value is 100.
 * @name SpiralLayout#spacing
 * @function.
 * @return {number}
 */
Object.defineProperty(SpiralLayout.prototype, "spacing", {
    get: function get() {
        return this._spacing;
    },
    set: function set(val) {
        if (typeof val !== "number") throw new Error("new value for SpiralLayout.spacing must be a number, not: " + val);
        if (this._spacing !== val) {
            this._spacing = val;
            this.invalidateLayout();
        }
    }
});

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

function computeControlPoint(p1, p2, p3) {

    var result;
    result = arguments[3] ? arguments[3] : triangleCircle(p1, p2, p3);
    var radius = result[0];
    var cent = new go.Point(result[1], result[2]);

    //起始节点的弧度
    var sweep = Math.abs(cent.directionPoint(p1) - cent.directionPoint(p3));
    sweep = sweep > 180 ? 360 - sweep : sweep;
    //console.log("sweep:"+sweep);
    var newR = radius / Math.cos(sweep / 3 * Math.PI / 180);
    var geo = new go.Geometry(go.Geometry.Line);
    geo.startX = cent.x;
    geo.startY = cent.y;
    geo.endX = p1.x;
    geo.endY = p1.y;
    geo.rotate(sweep / 3, cent.x, cent.y); //相对圆心旋转3分之1弧度
    var newStartAngle = cent.direction(geo.endX, geo.endY);
    var ctl1;
    result = computeOffset(newR, newStartAngle);
    ctl1 = cent.copy().offset(result[0], result[1]);

    geo.rotate(sweep / 3, cent.x, cent.y); //相对圆心旋转3分之1弧度
    newStartAngle = cent.direction(geo.endX, geo.endY);

    var ctl2; //需要调整
    result = computeOffset(newR, newStartAngle);
    ctl2 = cent.copy().offset(result[0], result[1]);

    return [ctl1, ctl2];
}

/**
 * Gets or sets whether the spiral should go clockwise or counter-clockwise.
 * The default value is true.
 * @name SpiralLayout#clockwise
 * @function.
 * @return {boolean}
 */
Object.defineProperty(SpiralLayout.prototype, "clockwise", {
    get: function get() {
        return this._clockwise;
    },
    set: function set(val) {
        if (typeof val !== "boolean") throw new Error("new value for SpiralLayout.clockwise must be a boolean, not: " + val);
        if (this._clockwise !== val) {
            this._clockwise = val;
            this.invalidateLayout();
        }
    }
});

/**
 处理：如三点共线，则返回false；否则，返回true，并将计算得到的圆心与半径存放在center和radius众返回。
    */
function triangleCircle(p1, p2, p3) {
    //检查三点是否共线
    if (isThreePointsOnOneLine(p1, p2, p3)) return false;

    var x1, x2, x3, y1, y2, y3, radius;

    x1 = p1.x;
    x2 = p2.x;
    x3 = p3.x;
    y1 = p1.y;
    y2 = p2.y;
    y3 = p3.y;

    //求外接圆半径
    var a = Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
    var b = Math.sqrt((x1 - x3) * (x1 - x3) + (y1 - y3) * (y1 - y3));
    var c = Math.sqrt((x2 - x3) * (x2 - x3) + (y2 - y3) * (y2 - y3));
    var p = (a + b + c) / 2;
    var S = Math.sqrt(p * (p - a) * (p - b) * (p - c));
    radius = a * b * c / (4 * S);

    //求外接圆圆心
    var t1 = x1 * x1 + y1 * y1;
    var t2 = x2 * x2 + y2 * y2;
    var t3 = x3 * x3 + y3 * y3;
    var temp = x1 * y2 + x2 * y3 + x3 * y1 - x1 * y3 - x2 * y1 - x3 * y2;
    var x = (t2 * y3 + t1 * y2 + t3 * y1 - t2 * y1 - t3 * y2 - t1 * y3) / temp / 2;
    var y = (t3 * x2 + t2 * x1 + t1 * x3 - t1 * x2 - t2 * x3 - t3 * x1) / temp / 2;

    var result = [];
    result = [radius, x, y];
    return result;
}

/**
 判断3个点是否共线
    */
function isThreePointsOnOneLine(p1, p2, p3) {
    return false;
}

module.exports = SpiralLayout;

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

//

var $ = go.GraphObject.make;
var Base = __webpack_require__(1);
var helpers = __webpack_require__(0);

// this is a Part.dragComputation function for limiting where a Node may be dragged
function stayInGroup(part, pt, gridpt) {
  // don't constrain top-level nodes
  var grp = part.containingGroup;
  if (grp === null) return pt;
  // try to stay within the background Shape of the Group
  var back = grp.resizeObject;
  if (back === null) return pt;
  // allow dragging a Node out of a Group if the Shift key is down
  if (part.diagram.lastInput.shift) return pt;
  var p1 = back.getDocumentPoint(go.Spot.TopLeft);
  var p2 = back.getDocumentPoint(go.Spot.BottomRight);
  var b = part.actualBounds;
  var loc = part.location;
  // find the padding inside the group's placeholder that is around the member parts
  // var m = grp.placeholder.padding;
  // now limit the location appropriately
  var x = Math.max(p1.x, Math.min(pt.x, p2.x - b.width - 1)) + (loc.x - b.x);
  var y = Math.max(p1.y, Math.min(pt.y, p2.y - b.height - 1)) + (loc.y - b.y);
  return new go.Point(x, y);
}

var WaveNodeTemplate = function (_Base) {
  _inherits(WaveNodeTemplate, _Base);

  function WaveNodeTemplate(options) {
    _classCallCheck(this, WaveNodeTemplate);

    return _possibleConstructorReturn(this, (WaveNodeTemplate.__proto__ || Object.getPrototypeOf(WaveNodeTemplate)).call(this, options));
    // this.nodeProperties = {}
  }

  _createClass(WaveNodeTemplate, [{
    key: "makeGeo",
    value: function makeGeo(data, shape, options) {
      // this is much more efficient than calling go.GraphObject.make:
      var _data$radiusX = data.radiusX,
          radiusX = _data$radiusX === undefined ? 150 : _data$radiusX,
          _data$radiusY = data.radiusY,
          radiusY = _data$radiusY === undefined ? 100 : _data$radiusY;

      radiusX = shape.part.findObject("main").width / 2;
      radiusY = shape.part.findObject("main").height / 2;
      // console.log("makeGeo999999999999999999999999999",radiusX,radiusY)
      var geo = new go.Geometry().add(new go.PathFigure(0, 0) // start point
      .add(new go.PathSegment(go.PathSegment.SvgArc, radiusX * 2, 0, radiusX, radiusY, 0, 1, options.clockwiseFlag ? 1 : 0)));
      geo.defaultStretch = go.GraphObject.Fill;
      return geo;
    }
  }, {
    key: "makeGeoWave",
    value: function makeGeoWave(data, shape, options) {
      // this is much more efficient than calling go.GraphObject.make:
      var _data$radiusX2 = data.radiusX,
          radiusX = _data$radiusX2 === undefined ? 150 : _data$radiusX2,
          _data$radiusY2 = data.radiusY,
          radiusY = _data$radiusY2 === undefined ? 100 : _data$radiusY2;

      radiusX = shape.part.findObject("main").width / 2;
      radiusY = shape.part.findObject("main").height / 2;
      // console.log("makeGeo999999999999999999999999999",radiusX,radiusY)
      var seg = new go.PathSegment(go.PathSegment.QuadraticBezier, radiusX * 2, 0, //describe the end point
      radiusX, radiusY * (options.clockwiseFlag ? -1 : 1) // describe the only control point
      // radiusX*2,0,radiusX, radiusY,0,1,options.clockwiseFlag?1:0
      );

      if (data.role == "waveTail") {
        seg = new go.PathSegment(go.PathSegment.QuadraticBezier, radiusX, radiusY * (options.clockwiseFlag ? -1 : 1), //describe the end point
        radiusX / 2, radiusY * (options.clockwiseFlag ? -1 : 1) // describe the only control point
        // radiusX*2,0,radiusX, radiusY,0,1,options.clockwiseFlag?1:0
        );

        // seg = new go.PathSegment(go.PathSegment.Bezier,
        //   radiusX, radiusY*(options.clockwiseFlag?-1:1), //describe the end point
        //   x1, y1 ,//describe the first control point
        //   x2, y2, // describe the second control point
        //   radiusX, radiusY*(options.clockwiseFlag?-1:1), // describe the only control point
        // // radiusX*2,0,radiusX, radiusY,0,1,options.clockwiseFlag?1:0
        //     )
      }

      // seg.endX = radiusX
      // seg.endY = 0
      var geo = new go.Geometry().add(new go.PathFigure(0, 0) // start point
      .add(seg));
      geo.defaultStretch = go.GraphObject.None;
      return geo;
    }
  }, {
    key: "getShiHalfEllipseShape",
    value: function getShiHalfEllipseShape() {
      var _this2 = this;

      return $(go.Shape, {
        name: "XU",
        strokeWidth: 2,
        stroke: "#cb1c27",
        fill: "rgba(0,66,0,0)",
        // background: "yellow",
        stretch: go.GraphObject.Uniform,
        alignment: go.Spot.Bottom,
        alignmentFocus: go.Spot.Bottom
        // row:1, column:0,margin:0
      },
      // new go.Binding("alignment","",function(data, shape){
      //   if(data.flip){
      //     return go.Spot.Top
      //   }
      //   return go.Spot.Bottom
      // }),
      // new go.Binding("alignmentFocus","",function(data, shape){
      //   if(data.flip){
      //     return go.Spot.Top
      //   }
      //   return go.Spot.Bottom
      // }),
      new go.Binding("geometry", "", function (data, shape) {
        var clockwiseFlag = 0;
        if (data.order % 2 == 0) {
          clockwiseFlag = 1;
        }
        if (data.flip) {}
        // clockwiseFlag = 1;

        // console.log(`data.oliveType: ${data.oliveType}`)
        if (data.oliveType == "Ellipse") {
          // console.log(``)
          return _this2.makeGeo(data, shape, { clockwiseFlag: clockwiseFlag });
        }
        return _this2.makeGeoWave(data, shape, { clockwiseFlag: clockwiseFlag });
      }), new go.Binding("stroke", "shiStroke").makeTwoWay(), new go.Binding("strokeWidth", "shiStrokeWidth").makeTwoWay(),
      // new go.Binding("strokeDashArray", "shiStrokeDashArray").makeTwoWay(),
      new go.Binding("strokeDashArray", "shiStrokeDashArray", function (v) {
        return JSON.parse(v);
      }).makeTwoWay(function (v) {
        return JSON.stringify(v);
      }), new go.Binding("desiredSize", "desiredSize", function (v) {
        var size = new go.Size(v.width, v.height / 2);
        // console.log("v:",v)
        return size;
      }).ofObject("main"));
    }
  }, {
    key: "getXuHalfEllipseShape",
    value: function getXuHalfEllipseShape() {
      var _this3 = this;

      return $(go.Shape, {
        name: "SHI",
        strokeWidth: 2,
        stroke: "#0e399d",
        fill: "rgba(0,66,0,0)",
        // background: "gray",
        stretch: go.GraphObject.Uniform,
        alignment: go.Spot.Bottom,
        strokeDashArray: [10, 5],
        alignmentFocus: go.Spot.Bottom
        // row:1, column:0,margin:0
      },
      // new go.Binding("alignment","",function(data, shape){
      //   if(data.flip){
      //     return go.Spot.Top
      //   }
      //   return go.Spot.Bottom
      // }),
      // new go.Binding("alignmentFocus","",function(data, shape){
      //   if(data.flip){
      //     return go.Spot.Top
      //   }
      //   return go.Spot.Bottom
      // }),
      new go.Binding("geometry", "", function (data, shape) {
        var clockwiseFlag = 1;
        if (data.order % 2 == 0) {
          clockwiseFlag = 0;
        }
        // if(data.flip){
        //   clockwiseFlag = 0;
        // }
        // console.log(`data.oliveType1: ${data.oliveType}`)
        if (data.oliveType == "Ellipse") {
          // console.log(`data.oliveType2: ${data.oliveType}`)
          return _this3.makeGeo(data, shape, { clockwiseFlag: clockwiseFlag });
        }
        // console.log(`data.oliveType3: ${data.oliveType}`)
        return _this3.makeGeoWave(data, shape, { clockwiseFlag: clockwiseFlag });
      }), new go.Binding("stroke", "xuStroke").makeTwoWay(), new go.Binding("strokeWidth", "xuStrokeWidth").makeTwoWay(),
      // new go.Binding("strokeDashArray", "xuStrokeDashArray").makeTwoWay(),
      new go.Binding("strokeDashArray", "xuStrokeDashArray", function (v) {
        return JSON.parse(v);
      }).makeTwoWay(function (v) {
        return JSON.stringify(v);
      }), new go.Binding("desiredSize", "desiredSize", function (v) {
        var size = new go.Size(v.width, v.height / 2);
        // console.log("v:",v)
        return size;
      }).ofObject("main"));
    }
  }, {
    key: "getTailShiShape",
    value: function getTailShiShape() {
      var _this4 = this;

      return $(go.Shape, {
        name: "XU",
        strokeWidth: 2,
        stroke: "#cb1c27",
        fill: "rgba(0,66,0,0)",
        // background: "yellow",
        stretch: go.GraphObject.None,
        alignment: go.Spot.Bottom,
        alignmentFocus: go.Spot.Bottom
        // row:1, column:0,margin:0
      },
      // new go.Binding("alignment","",function(data, shape){
      //   if(data.flip){
      //     return go.Spot.Top
      //   }
      //   return go.Spot.Bottom
      // }),
      // new go.Binding("alignmentFocus","",function(data, shape){
      //   if(data.flip){
      //     return go.Spot.Top
      //   }
      //   return go.Spot.Bottom
      // }),
      new go.Binding("geometry", "", function (data, shape) {
        var clockwiseFlag = 0;
        if (data.order % 2 == 0) {
          clockwiseFlag = 1;
        }
        if (data.flip) {
          // clockwiseFlag = 1;
        }

        return _this4.makeGeoWave(data, shape, { clockwiseFlag: !clockwiseFlag });
      }), new go.Binding("stroke", "shiStroke").makeTwoWay(), new go.Binding("desiredSize", "desiredSize", function (v) {
        var size = new go.Size(v.width, v.height / 2);
        // console.log("v:",v)
        return size;
      }).ofObject("main"));
    }
  }, {
    key: "getTailXuShape",
    value: function getTailXuShape() {
      var _this5 = this;

      return $(go.Shape, {
        name: "TailXu",
        strokeWidth: 2,
        stroke: "#0e399d",
        fill: "rgba(0,66,0,0)",
        // background: "gray",
        stretch: go.GraphObject.None,
        alignment: go.Spot.Bottom,
        strokeDashArray: [10, 5],
        alignmentFocus: go.Spot.Bottom
        // row:1, column:0,margin:0
      },
      // new go.Binding("alignment","",function(data, shape){
      //   if(data.flip){
      //     return go.Spot.Top
      //   }
      //   return go.Spot.Bottom
      // }),
      // new go.Binding("alignmentFocus","",function(data, shape){
      //   if(data.flip){
      //     return go.Spot.Top
      //   }
      //   return go.Spot.Bottom
      // }),
      new go.Binding("geometry", "", function (data, shape) {
        var clockwiseFlag = 1;
        if (data.order % 2 == 0) {
          clockwiseFlag = 0;
        }
        // if(data.flip){
        //   clockwiseFlag = 0;
        // }
        return _this5.makeGeoWave(data, shape, { clockwiseFlag: !clockwiseFlag });
      }), new go.Binding("desiredSize", "desiredSize", function (v) {
        var size = new go.Size(v.width, v.height / 2);
        // console.log("v:",v)
        return size;
      }).ofObject("main"));
    }
  }, {
    key: "getTextBuild",
    value: function getTextBuild() {
      return $(go.TextBlock, {
        name: "TEXT",
        alignment: new go.Spot(0.5, 0.4),
        font: "18px 'Microsoft YaHei'",
        editable: false,
        // flip:go.GraphObject.FlipHorizontal,
        //margin: 3, editable: true,
        // background: "gray",
        angle: 0,
        stroke: "black",
        isMultiline: true,
        textEdited: function textEdited(textBlock, oldv, newv) {
          // if(textBlock.part.containingGroup.data.textAngle == "horizontal"){
          var centerText = textBlock.part.diagram.model.findNodeDataForKey(textBlock.part.data.centerText);
          if (centerText) {
            console.log("centerTextcenterTextcenterTextcenterText");
            textBlock.part.diagram.model.startTransaction("text");
            textBlock.part.diagram.model.setDataProperty(centerText, "text", newv);
            textBlock.part.diagram.model.commitTransaction("text");
          }
          //   return;
          // }
          setTimeout(function () {
            console.log("textEditedtextEditedtextEdited", textBlock.lineCount);
            if (!textBlock.text) return;
            if (textBlock.text && textBlock.text.trim() == "") return;
            if (textBlock.lineCount % 2 != 0) {
              if (newv[newv.length - 1] == "\n") {
                textBlock.text = newv.substring(0, newv.length - 1);
                return;
              }
              textBlock.text = newv + "\n";
            }
          }, 100);

          var enterCount = 0;
          textBlock.part.containingGroup.layout.isValidLayout = false;
          // for(var i=0;i<newv.length;i++){

          // }
          // textBlock.part.updateTargetBindings()

          // if(textBlock.lineCount %2 != 0){
          //   if(newv[newv.length-1] == "\n"){
          //     textBlock.text = newv.substring(0, newv.length-1)
          //     return;
          //   }
          //   textBlock.text = newv+"\n"
          // }
        },
        overflow: go.TextBlock.OverflowClip,
        wrap: go.TextBlock.WrapDesiredSize,
        textAlign: "center",
        spacingAbove: 4,
        spacingBelow: 4,
        portId: "TEXT",
        stretch: go.GraphObject.Uniform
      }, new go.Binding("visible", "textVisible").makeTwoWay(), new go.Binding("alignment", "", function (v, textBlock) {
        // console.log('textBlock', textBlock.lineCount)
        // if(textBlock.lineCount%2 == 0){
        //   return new go.Spot(0.5,0.5)
        // }
        return new go.Spot(0.5, 0.5);
      }), new go.Binding("textAlign", "textAlign", function (v) {
        // return ['start', 'center', 'end'].indexOf(v)>-1 ? v : "center";
        return v;
      }).makeTwoWay(), new go.Binding("spacingAbove", "spacingline", function (v) {
        return helpers.tdTransToNum(v, 4);
      }).makeTwoWay(), new go.Binding("spacingBelow", "spacingline", function (v) {
        return helpers.tdTransToNum(v, 4);
      }).makeTwoWay(), new go.Binding("width", "width", function (v) {
        return v - 30;
      }).ofObject("main"),
      // new go.Binding("height", "height", function (v) {
      //   return v;
      // }).ofObject("SHAPE"),
      new go.Binding("text", "text", function (text, d) {
        // console.log("d.lineCount,d.lineCountd.lineCount",text,d.lineCount)
        // setTimeout(function(){
        //   if(d && d.lineCount!=null && d.lineCount%2 != 0){
        //     if(text && text[text.length-1] != "\n"){
        //       d.text+="\n"
        //     }
        //   }
        // },100)
        // setTimeout(function(){
        //   try{
        //     console.log("check overflow")
        //     if(!d.text) return;
        //     if(d.text && d.text.trim() == "") return;
        //     if(d.lineCount %2 != 0){
        //       if(d.text[d.text.length-1] == "\n"){
        //         d.text = d.text.substring(0, d.text.length-1)
        //         return;
        //       }
        //       d.text = d.text+"\n"
        //     }
        //     // if(d && d.lineCount!=null && d.lineCount%2 != 0){
        //     //   if(d.text && d.text[d.text.length-1] != "\n"){
        //     //     d.text+="\n"
        //     //   }
        //     // }
        //   }catch(e){
        //     console.error(e)
        //   }
        // },100)
        return text;
        // console.log("sdfsdfsdfsdfsdfdsfdsfsd")
        console.log(text, ":", d.lineCount);
        if (d.lineCount % 2 != 0) {
          return text + "\n";
        } else {
          return text;
        }
      }).makeTwoWay(function (text, d) {
        console.log("text write write", d.lineCount);
        return text;
        if (d.lineCount % 2 != 0) {
          return text + "\n";
        } else {
          return text;
        }
      }), new go.Binding("stroke", "textStroke").makeTwoWay(), new go.Binding("font", "font").makeTwoWay());
    }
  }, {
    key: "getNodeSelectionAdornmentTemplate",
    value: function getNodeSelectionAdornmentTemplate() {
      return $(go.Adornment, "Spot", {
        // isShadowed: true,
      }, $(go.Panel, "Auto", $(go.Shape, {
        isPanelMain: true,
        fill: null,
        stroke: "dodgerblue",
        strokeWidth: 3
        // new go.Binding("fill","",function(e,obj){
        //   var radBrush = $(go.Brush, "Radial", { 0: "rgba(248,248,242,0)", 1: 'RGB(255,242,0)' });
        //   return radBrush;
        // })
        //
      }), $(go.Placeholder) // this represents the selected Node
      ),

      // ),
      // the button to create a "next" node, at the top-right corner
      $("CircleButton", {
        name: "AddChild",
        toolTip: $(go.Adornment, "Auto", $(go.Shape, { fill: "#FFFFCC" }), $(go.TextBlock, { textAlign: "center", margin: new go.Margin(8, 4, 4, 4) }, // the tooltip shows the result of calling nodeInfo(data)
        new go.Binding("text", "", function (d) {
          return "增加橄榄";
        }))),
        alignment: go.Spot.Right,
        alignmentFocus: go.Spot.Left,
        width: 50,
        height: 50,
        click: function click(e) {
          e.diagram.__trtd.addOlive();
        } // this function is defined below
      }, $(go.Shape, "PlusLine", {
        stroke: "#770077",
        desiredSize: new go.Size(25, 25)
      })), $("CircleButton", {
        name: "RemoveChild",
        toolTip: $(go.Adornment, "Auto", $(go.Shape, { fill: "#FFFFCC" }), $(go.TextBlock, { textAlign: "center", margin: new go.Margin(8, 4, 4, 4) }, // the tooltip shows the result of calling nodeInfo(data)
        new go.Binding("text", "", function (d) {
          return "删除橄榄";
        }))),
        alignment: go.Spot.Left,
        alignmentFocus: go.Spot.Right,
        width: 50,
        height: 50,
        click: function click(e) {
          e.diagram.__trtd.deleteSelection();
        } // this function is defined below
      }, $(go.Shape, "MinusLine", {
        stroke: "#770077",
        desiredSize: new go.Size(25, 25)
      })), $("Button", {
        name: "AddLevel",
        toolTip: $(go.Adornment, "Auto", $(go.Shape, { fill: "#FFFFCC" }), $(go.TextBlock, { textAlign: "center", margin: new go.Margin(8, 4, 4, 4) }, // the tooltip shows the result of calling nodeInfo(data)
        new go.Binding("text", "", function (d) {
          return "增加同级节点";
        }))),
        alignment: new go.Spot(1, 0.5, 15, 0),
        width: 30,
        height: 30,
        click: function click(e) {
          e.diagram.__trtd.addOlive();
        } // this function is defined below
      }, $(go.Shape, "PlusLine", {
        stroke: "#227700",
        desiredSize: new go.Size(15, 15)
      }), new go.Binding("visible", "level", function (level) {
        return level != 0; // hidden this button if current node is root node
      }))
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
    }
  }, {
    key: "nodeResizeAdornmentTemplate",
    value: function nodeResizeAdornmentTemplate() {
      return $(go.Adornment, "Spot", $(go.Placeholder), // takes size and position of adorned object
      // $(go.Shape, "Circle", // left resize handle
      //     {
      //         alignment: go.Spot.TopLeft,
      //         alignmentFocus: go.Spot.BottomRight,
      //         cursor: "col-resize",
      //         desiredSize: new go.Size(30, 30),
      //         fill: "lightblue",
      //         stroke: "dodgerblue"
      //     }),
      $(go.Shape, "Circle", // right resize handle
      {
        alignment: go.Spot.BottomRight,
        alignmentFocus: go.Spot.TopLeft,
        cursor: "col-resize",
        desiredSize: new go.Size(30, 30),
        fill: "lightblue",
        stroke: "dodgerblue"
      }));
    }
  }, {
    key: "getNodeTemplate",
    value: function getNodeTemplate() {
      var diagram = this.diagram;
      var that = this;
      return $(go.Node, "Spot", {
        // isClipping: true,
        __trtdNode: that,
        layerName: "overflow",
        zOrder: 5,
        // copyable: false,
        // dragComputation: stayInGroup,
        movable: true,
        resizable: false,
        // locationObjectName: "main",
        resizeObjectName: "main",
        selectionObjectName: "main",
        rotatable: false,
        toolTip: that.getTooTip(),
        resizeAdornmentTemplate: that.nodeResizeAdornmentTemplate(),
        layoutConditions: ~go.Part.LayoutStandard & go.Part.LayoutRemoved & go.Part.LayoutAdded & go.Part.LayoutNodeSized,
        locationSpot: go.Spot.LeftCenter,

        // toolTip:  // define a tooltip for each node that displays the color as text
        // $(go.Adornment, "Spot",
        //   $(go.TextBlock, { margin: 4 },
        //     new go.Binding("text", "", function(data,p){
        //       // console.log("tooltip:",p,data)
        //       var tips = ["双击编辑文字","尝试按方向键快捷移动到下一个对象","按回车键增加橄榄"]
        //       var isPhone = helpers.checkPhone()
        //       if(isPhone){
        //         return ""
        //       }
        //       var elt = Math.floor(tips.length * Math.random())
        //       return tips[elt]
        //     })
        //   )
        // ),  // end of Adornment
        click: function click(e, node) {
          console.log(node.data);
          if (!node.containingGroup) return;
          var it = node.containingGroup.findSubGraphParts().iterator;
          while (it.next()) {
            var n = it.value;
            if (n.data.category == "autoText" && (n.data.role == "xuText" || n.data.role == "shiText")) {
              if (n.data.order == node.data.order) {
                // locateNode = n;
                if (n.data.text == "" || n.data.text.trim() == "") {
                  n.findObject("textBorder").visible = true;
                }
                //   n.areaBackground = "mediumslateblue"
              } else {
                n.findObject("textBorder").visible = false;
              }
            }
          }
        },
        mouseOver: function mouseOver(e, node) {
          // if(node.data.hyperlink){
          //   var textObj = node.findObject('TEXT');
          //   textObj.isUnderline = true;
          // }
          if (!node.containingGroup) return;
          // var it = node.containingGroup.findSubGraphParts().iterator;
          // while (it.next()) {
          //     var n = it.value;
          //     if(n.data.category == "autoText"){
          //         if(n.data.order == node.data.order){
          //             // locateNode = n;
          //             if(n.data.text == "" || n.data.text.trim() == ""){
          //               n.findObject("textBorder").visible = true;
          //             }
          //           //   n.areaBackground = "mediumslateblue"
          //         }
          //     }
          // }

          var shiText = node.diagram.findNodeForKey(node.data.shiText);
          if (shiText) {
            shiText.findObject("textBorder").visible = true;
          }
          var xuText = node.diagram.findNodeForKey(node.data.xuText);
          if (xuText) {
            xuText.findObject("textBorder").visible = true;
          }
          var centerText = node.diagram.findNodeForKey(node.data.centerText);
          if (centerText) {
            centerText.layerName = "Background";
          }

          // diagram.__trtd.showNodeRemarkTips(e, node);
        },
        contextMenu: $(go.Adornment),

        mouseDragEnter: function mouseDragEnter(e, obj) {
          var node = obj.part;
          var selnode = e.diagram.selection.first();

          // 常变
          if (selnode.data.category != "wave" && !(selnode.data.category == "picGroup" && selnode.data.role == "cbian")) {
            return;
          }
          var centerText = node.diagram.findNodeForKey(node.data.centerText);
          if (centerText) {
            centerText.layerName = "Background";
          }
          //var sat = node.selectionAdornmentTemplate;
          //var adorn = sat.copy();
          //adorn.adornedObject = node;
          //node.addAdornment("dragEnter", adorn);

          //if (!mayWorkFor(selnode, node)) return;
          var shape = node.findObject("main");
          if (shape) {
            shape._prevFill = shape.fill; // remember the original brush
            shape.fill = "RGBA(146,208,80,0.5)";
          }
        },
        mouseDragLeave: function mouseDragLeave(e, obj) {
          var node = obj.part;
          var shape = node.findObject("main");
          if (shape && shape._prevFill) {
            shape.fill = shape._prevFill; // restore the original brush
          }
          var centerText = node.diagram.findNodeForKey(node.data.centerText);
          if (centerText) {
            if (!helpers.checkPhone()) {
              centerText.layerName = "Foreground";
            }
          }
          //node.removeAdornment("dragEnter");
        },
        mouseDrop: function mouseDrop(e, obj) {
          var node = obj.part;
          console.log("mouseDropmouseDropmouseDropmouseDrop");
          var selnode = e.diagram.selection.first();
          if (!selnode) return;
          // 常变
          if (selnode.data.category == "picGroup" && selnode.data.role == "cbian") {
            var it = selnode.findSubGraphParts().iterator;
            var deleteObjs = [];
            var cbian = {};
            while (it.next()) {
              var n = it.value;
              if (n.data.category == "autoText") {
                if (n.data.locationSpot == "0 0 0 0") {
                  cbian.shiText = n.data.text;
                }
                if (n.data.locationSpot == "0 0.5 0 0") {
                  cbian.centerText = n.data.text;
                }
                if (n.data.locationSpot == "0 1 0 0") {
                  cbian.xuText = n.data.text;
                }
              }
              deleteObjs.push(n.data);
            }
            e.diagram.startTransaction("mouseDrop");
            // 删除总结图
            e.diagram.model.removeNodeDataCollection(deleteObjs);
            var backupSelnode = JSON.parse(JSON.stringify(selnode.data));
            e.diagram.model.removeNodeData(selnode.data);

            // 添加新橄榄
            e.diagram.__trtd.addOlive(node, cbian);
            e.diagram.commitTransaction("mouseDrop");
            return;
          }

          if (selnode.data.category != "wave") {
            return;
          }
          if (!node) {
            // node.containingGroup.layout.isValidLayout = false
            return;
          }
          if (selnode.data.group != obj.data.group) {
            return;
          }
          e.diagram.startTransaction("mouseDrop");
          selnode.__oldOrder = selnode.data.order;
          e.diagram.model.setDataProperty(selnode.data, "order", node.data.order + 0.5);
          var xuText = e.diagram.findNodeForKey(selnode.data.xuText);
          var shiText = e.diagram.findNodeForKey(selnode.data.shiText);
          // shiText.__oldOrder = shiText.data.order
          // xuText.__oldOrder = xuText.data.order
          e.diagram.model.setDataProperty(shiText, "order", node.data.order + 0.5);
          e.diagram.model.setDataProperty(xuText, "order", node.data.order + 0.5);
          // node.containingGroup.layout.isValidLayout = false
          e.diagram.commitTransaction("mouseDrop");
          return;
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
        },
        mouseLeave: function mouseLeave(e, node) {
          if (!node.containingGroup) return;
          var it = node.containingGroup.findSubGraphParts().iterator;
          while (it.next()) {
            var n = it.value;
            if (n.data.category == "autoText") {
              // if(n.data.order == node.data.order+1){
              //     locateNode = n;
              // }
              n.findObject("textBorder").visible = false;
              // n.areaBackground = null
            }
          }
          try {
            var centerText = e.diagram.findNodeForKey(node.data.centerText);
            if (centerText) {
              centerText.layerName = "Foreground";
            }
          } catch (e) {
            console.error("wave node template error:", e);
          }
        },
        selectionAdornmentTemplate: this.getNodeSelectionAdornmentTemplate(),
        doubleClick: function doubleClick(e, node) {
          if (!node) return;
          if (!node.containingGroup) return;
          if (node.containingGroup.data.textAngle == "horizontal" && node.containingGroup.data.centerTextAngle == "independent") {
            // 如果文字方向为正向，且中线文字为正向
            node.findObject("TEXT").visible = true;
            var centerText = node.diagram.findNodeForKey(node.data.centerText);
            if (centerText) {
              centerText.visible = false;
            }
          }
          setTimeout(function () {
            e.diagram.__trtd.selectText(e, node);
          }, 100);
        }
      }, this.binding, $(go.Shape, "Rectangle", {
        name: "main",
        // layerName: "overflow",
        fill: "rgba(0,0,0,0)",
        stroke: null,
        width: 300,

        height: 150
      }, new go.Binding("areaBackground", "isHighlighted", function (h, shape) {
        // node.areaBackground = "RGB(107,208,137)"
        if (h) return "RGBA(146,208,80,0.5)";
        return null;
        var c = shape.part.data.color;
        return c ? c : "white";
      }).ofObject(), // binding source is Node.isHighlighted
      new go.Binding("fill", "fill").makeTwoWay(),
      // new go.Binding("fill", "fill").makeTwoWay(),
      new go.Binding("desiredSize", "desiredSize", function (v, d) {
        // console.log("vd m", v, d )
        // if(!v) return d.part.findObject("SHAPE").measuredBounds.size;
        return go.Size.parse(v);
      }).makeTwoWay(function (v) {
        return go.Size.stringify(v);
      })),
      // $(go.Panel, "Spot",{
      //   // isClipping: true,
      //   background: "green",
      //   position: new go.Point(0,0),
      //   alignment: go.Spot.Center,
      //   alignmentFocus: go.Spot.Center,
      // },
      // $(go.Shape, "Rectangle",{
      //   alignment: go.Spot.Center,
      //   alignmentFocus: go.Spot.Center,
      // },
      // new go.Binding("desiredSize", "desiredSize", function(v) {
      //     var size = new go.Size(v.width, v.height)
      //     // console.log("v:",v)
      //     return size
      //     }).ofObject("main"),
      // ),
      this.getShiHalfEllipseShape(), this.getXuHalfEllipseShape(),
      // $(go.Adornment,
      // { locationSpot: go.Spot.Top },
      // $(go.Shape, "BpmnActivityLoop",
      //   { width: 12, height: 12, cursor: "pointer",
      //     background: "transparent", stroke: "dodgerblue", strokeWidth: 2 })
      // ),
      // ),

      // $(go.Panel,"Spot",{
      //   stretch: go.GraphObject.Uniform,
      //   background:"gray",
      //   // locationSpot: go.Spot.LeftCenter,
      //   alignment: go.Spot.Right,
      //   // strokeDashArray: [10, 5],
      //   alignmentFocus: go.Spot.Left,
      // },
      //   this.getTailXuShape(),
      //   this.getTailShiShape(),
      // ),

      // this.getUpHalfEllipseShape(),
      this.getTextBuild(), $(go.Shape, {
        geometryString: "M540.5696 556.81024a81.8176 81.8176 0 0 1-53.0432-19.47648l-225.4848-191.52896a81.92 81.92 0 1 1 106.0864-124.86656l172.4416 146.47296 172.4416-146.47296a81.92 81.92 0 0 1 106.0864 124.86656l-225.4848 191.52896a81.7152 81.7152 0 0 1-53.0432 19.47648z m53.06368 246.23104l225.44384-191.52896a81.92 81.92 0 1 0-106.0864-124.84608l-172.40064 146.47296-172.48256-146.47296a81.92 81.92 0 1 0-106.04544 124.86656l225.52576 191.52896a81.7152 81.7152 0 0 0 53.00224 19.47648c18.88256 0 37.76512-6.49216 53.0432-19.49696z",
        // "M16 0c-8.837 0-16 7.163-16 16s7.163 16 16 16 16-7.163 16-16-7.163-16-16-16zM16 29c-7.18 0-13-5.82-13-13s5.82-13 13-13 13 5.82 13 13-5.82 13-13 13zM12 8c-1.105 0-2 0.895-2 2s0.895 2 2 2h5.172l-8.586 8.586c-0.781 0.781-0.781 2.047 0 2.829 0.39 0.39 0.902 0.586 1.414 0.586s1.024-0.195 1.414-0.586l8.586-8.586v5.172c0 1.105 0.895 2 2 2s2-0.895 2-2v-12h-12z",
        visible: false,
        name: "figure",
        cursor: "pointer",
        alignment: go.Spot.TopRight,
        alignmentFocus: go.Spot.TopRight,
        width: 14,
        height: 14,
        fill: "green",
        toolTip: $("ToolTip", $(go.Panel, "Vertical", $(go.Picture, new go.Binding("source", "src", function (s) {
          return "images/" + s + ".png";
        })), $(go.TextBlock, { text: "进入子盘", margin: 3 }))),
        click: function click(e) {
          console.log("click figure", e);
          var node = e.targetObject.part;
          e.diagram.__trtd.openFigure({
            figure: node.data.figure,
            title: node.data.text,
            key: node.data.key,
            node: node
          });
        }
      },
      // new go.Binding("geometry", "geo", function(){

      // })),
      new go.Binding("visible", "figure", function (v) {
        console.log("----------------------");
        if (v) {
          return true;
        } else {
          return false;
        }
      })));
    }
  }]);

  return WaveNodeTemplate;
}(Base);

module.exports = WaveNodeTemplate;
// export default WaveNodeTemplate

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var $ = go.GraphObject.make;
var Base = __webpack_require__(1);
var helpers = __webpack_require__(0);
var waveGroupLayout = __webpack_require__(9);

var WaveNodeTemplate = function (_Base) {
    _inherits(WaveNodeTemplate, _Base);

    function WaveNodeTemplate(options) {
        _classCallCheck(this, WaveNodeTemplate);

        return _possibleConstructorReturn(this, (WaveNodeTemplate.__proto__ || Object.getPrototypeOf(WaveNodeTemplate)).call(this, options));
        // this.nodeProperties = {}
    }

    _createClass(WaveNodeTemplate, [{
        key: 'nodeResizeAdornmentTemplate',
        value: function nodeResizeAdornmentTemplate() {
            return $(go.Adornment, "Spot", $(go.Placeholder), // takes size and position of adorned object
            // $(go.Shape, "Circle", // left resize handle
            //     {
            //         alignment: go.Spot.TopLeft,
            //         alignmentFocus: go.Spot.BottomRight,
            //         cursor: "col-resize",
            //         desiredSize: new go.Size(30, 30),
            //         fill: "lightblue",
            //         stroke: "dodgerblue"
            //     }),
            $(go.Shape, "Circle", // right resize handle
            {
                alignment: go.Spot.BottomRight,
                alignmentFocus: go.Spot.TopLeft,
                cursor: "col-resize",
                desiredSize: new go.Size(30, 30),
                fill: "lightblue",
                stroke: "dodgerblue"
            }));
        }
    }, {
        key: 'getNodeTemplate',
        value: function getNodeTemplate() {
            var that = this;
            return $(go.Group, "Spot", { selectionObjectName: "PH",
                layerName: "default",
                locationObjectName: "PH",
                resizeObjectName: "PH",
                // rotatable: false
                resizable: true,
                locationSpot: go.Spot.LeftCenter,

                // rotationSpot: go.Spot.LeftCenter,
                alignment: go.Spot.Left,
                alignmentFocus: go.Spot.Left,
                // rotateObject:"PH",
                click: function click(e, node) {
                    console.log(node.data);
                    var it = node.findSubGraphParts().iterator;
                    while (it.next()) {
                        var n = it.value;
                        if (n.data.category == "autoText") {
                            n.findObject("textBorder").visible = false;
                        }
                    }
                },
                selectionAdornmentTemplate: this.getNodeSelectionAdornmentTemplate(),
                resizeAdornmentTemplate: that.nodeResizeAdornmentTemplate(),
                mouseOver: function mouseOver(e, node) {
                    console.log("group.......................");
                    // if(node.data.hyperlink){
                    //   var textObj = node.findObject('TEXT');
                    //   textObj.isUnderline = true;
                    // }
                    // if(!node) return;
                    var it = node.findSubGraphParts().iterator;
                    while (it.next()) {
                        var n = it.value;
                        if (n.data.category == "autoText" && (node.data.role == "xuText" || node.data.role == "shiText")) {
                            // if(n.data.order == node.data.order){
                            // locateNode = n;
                            if (n.data.text == "" || n.data.text.trim() == "") {
                                n.findObject("textBorder").visible = true;
                            }
                            //   n.areaBackground = "mediumslateblue"
                            // }
                        }
                    }
                    // diagram.__trtd.showNodeRemarkTips(e, node);
                },
                mouseLeave: function mouseLeave(e, node) {
                    // if(!node) return;
                    var it = node.findSubGraphParts().iterator;
                    while (it.next()) {
                        var n = it.value;
                        if (n.data.category == "autoText") {
                            // if(n.data.order == node.data.order+1){
                            //     locateNode = n;
                            // }
                            n.findObject("textBorder").visible = false;
                            // n.areaBackground = null
                        }
                    }
                },
                rotatable: true,
                contextMenu: $(go.Adornment),
                // resizable: true,
                // layoutConditions: go.Part.LayoutStandard,
                layoutConditions: go.Part.LayoutStandard & go.Part.LayoutRemoved & go.Part.LayoutAdded & go.Part.LayoutNodeSized,
                layout: new waveGroupLayout()
                // layout: $(go.GridLayout,{
                //   spacing: new go.Size(0,0),
                //   cellSize: go.Size.parse(300,150),
                //   arrangement:go.GridLayout.LeftToRight,
                //   alignment: go.GridLayout.Location,
                //   comparer:function(pa, pb) {
                //     var da = pa.data;
                //     var db = pb.data;
                //     if (da.order < db.order) return -1;
                //     if (da.order > db.order) return 1;
                //     return 0;
                //   }
                // }) 
            }, new go.Binding("angle", "angle").makeTwoWay(function (v, data) {

                return v;
            }),
            // new go.Binding("copyable", "copyable").makeTwoWay(),
            new go.Binding("isShadowed", "isShadowed").makeTwoWay(), new go.Binding("selectable", "selectable").makeTwoWay(), new go.Binding("movable", "movable").makeTwoWay(), new go.Binding("deletable", "deletable").makeTwoWay(), $(go.Shape, // using a Shape instead of a Placeholder
            { name: "PH",
                figure: "Rectangle",
                // rotationSpot: go.Spot.LeftCenter,
                // spot1: new go.Spot(0.01, 0.01),
                // spot2: new go.Spot(0.99, 0.99),
                // width: 600,
                // height:300,
                alignment: new go.Spot(0, 0.5),
                // locationSpot: go.Spot.LeftCenter,
                stroke: "#9aa8b6",
                strokeWidth: 0,
                minSize: new go.Size(300, 70),
                maxSize: new go.Size(NaN, 400),
                fill: "rgba(88,0,0,0)" }, new go.Binding("desiredSize", "desiredSize", function (v, data) {
                return go.Size.parse(v);
            }).makeTwoWay(go.Size.stringify)), new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify)
            // $(go.Placeholder,    // represents the area of all member parts,
            //   { padding: 0}
            // ),  // with some extra padding around them

            // $(go.TextBlock,  // group title
            //   { font: "Bold 12pt Sans-Serif" },
            //   new go.Binding("text", "key")
            // )
            );
        }
    }]);

    return WaveNodeTemplate;
}(Base);

module.exports = WaveNodeTemplate;

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

'use script';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var $ = go.GraphObject.make;
var Base = __webpack_require__(1);
var helpers = __webpack_require__(0);
var axisGroupLayout = __webpack_require__(18);

var AxisNodeTemplate = function (_Base) {
  _inherits(AxisNodeTemplate, _Base);

  function AxisNodeTemplate(options) {
    _classCallCheck(this, AxisNodeTemplate);

    return _possibleConstructorReturn(this, (AxisNodeTemplate.__proto__ || Object.getPrototypeOf(AxisNodeTemplate)).call(this, options));
    // this.nodeProperties = {}
  }

  _createClass(AxisNodeTemplate, [{
    key: 'addFreeText',
    value: function addFreeText(e, node) {
      console.log("eeeeeeeeeee", e);
      var data = { "text": "自由文本",
        "deletable": true,
        "role": "freeText",
        "fill": "black",
        "iconVisible": false,
        "locationSpot": "0.5 0.5 0 0",
        "textAlign": "center",
        "category": "autoText",
        "loc": go.Point.stringify(e.documentPoint),
        "movable": true, "group": node.data.key
      };
      this.diagram.startTransaction("addFreeText");
      this.diagram.model.addNodeData(data);
      this.diagram.commitTransaction("addFreeText");
    }
  }, {
    key: 'getNodeTemplate',
    value: function getNodeTemplate() {
      var that = this;
      return $(go.Group, "Auto", { selectionObjectName: "PH",
        layerName: "Background",
        locationObjectName: "PH",
        locationSpot: go.Spot.BottomLeft,
        // rotationSpot: go.Spot.LeftCenter,
        rotatable: false,
        alignment: go.Spot.Left,
        alignmentFocus: go.Spot.Left,
        // rotateObject:"PH",
        click: function click(e, node) {
          console.log(node.data);
          var it = node.findSubGraphParts().iterator;
          while (it.next()) {
            var n = it.value;
            if (n.data.category == "autoText") {
              n.findObject("textBorder").visible = false;
            }
          }
          return;
          if (node.isSelected) return;
          var it = node.findSubGraphParts().iterator;
          var n;
          while (it.next()) {
            n = it.value;
            if (n.data.role == "labelGroup") {
              n.__trtdNode.switchBorder(n, true);
              break;
            }
          }
          if (n) {
            setTimeout(function () {
              n.__trtdNode.switchBorder(n, false);
            }, 3000);
          }
        },
        doubleClick: function doubleClick(e, node) {
          that.addFreeText(e, node);
        },
        mouseOver: function mouseOver(e, node) {
          // if(node.data.hyperlink){
          //   var textObj = node.findObject('TEXT');
          //   textObj.isUnderline = true;
          // }
          // if(!node.containingGroup) return;
          return;
          if (that.diagram.selection.count > 0) return;

          var it = node.findSubGraphParts().iterator;
          var n;
          while (it.next()) {
            n = it.value;
            if (n.data.role == "labelGroup") {
              // n.__trtdNode.switchBorder(n, true)
              break;
            }
          }
          // 给显示隐藏一个缓冲，以显得不那么突兀
          if (n) {
            setTimeout(function () {
              if (that.diagram.selection.count > 0) return;
              n.__trtdNode.switchBorder(n, true);
              if (that.diagram.selection.count <= 0) return;
              setTimeout(function () {
                n.__trtdNode.switchBorder(n, false);
              }, 3000);
            }, 100);
          }
          // diagram.__trtd.showNodeRemarkTips(e, node);
        },
        contextMenu: $(go.Adornment),
        mouseLeave: function mouseLeave(e, node) {
          // if(!node.containingGroup) return;
          var it = node.findSubGraphParts().iterator;
          while (it.next()) {
            var n = it.value;
            if (n.data.role == "labelGroup") {
              // n.__trtdNode.switchBorder(n, false)
              break;
            }
          }
          // if(n){
          //   setTimeout(function(){
          //     n.__trtdNode.switchBorder(n, false)
          //   },3000)
          // }
        },
        // rotatable: true,
        // resizable: true,
        // layoutConditions: go.Part.LayoutStandard,
        layoutConditions: go.Part.LayoutStandard & go.Part.LayoutRemoved & go.Part.LayoutAdded & go.Part.LayoutNodeSized,
        layout: new axisGroupLayout()
        // layout: $(go.GridLayout,{
        //   spacing: new go.Size(0,0),
        //   cellSize: go.Size.parse(300,150),
        //   arrangement:go.GridLayout.LeftToRight,
        //   alignment: go.GridLayout.Location,
        //   comparer:function(pa, pb) {
        //     var da = pa.data;
        //     var db = pb.data;
        //     if (da.order < db.order) return -1;
        //     if (da.order > db.order) return 1;
        //     return 0;
        //   }
        // }) 
      }, new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify), new go.Binding("angle", "angle").makeTwoWay(function (v, data) {

        return v;
      }),
      // new go.Binding("desiredSize", "desiredSize", go.Size.parse).makeTwoWay(go.Size.stringify),
      new go.Binding("copyable", "copyable").makeTwoWay(), $(go.Shape, // using a Shape instead of a Placeholder
      { name: "PH",
        figure: "Rectangle",
        // rotationSpot: go.Spot.LeftCenter,
        // spot1: new go.Spot(0.01, 0.01),
        // spot2: new go.Spot(0.99, 0.99),
        // width: 600,
        // height:300,
        stroke: "yellow",
        strokeWidth: 0,
        fill: "rgba(0,0,0,0)" }
      // new go.Binding("desiredSize", "desiredSize", function(v,data){
      //   return go.Size.parse(v)
      //   console.log('1111111111111111111111')
      //   // for(var i=0;i<)
      //   var model = data.part.diagram.model;
      //   var group = data.part.data;
      //   var maxWidth = 0;
      //   var maxHeight = 0;
      //   for(var i = 0;i<model.nodeDataArray.length;i++){
      //     if(group.key != model.nodeDataArray[i].group){
      //       continue;
      //     }
      //     if(model.nodeDataArray[i].desiredSize){
      //       console.log(model.nodeDataArray[i].desiredSize)
      //       var size = go.Size.parse(model.nodeDataArray[i].desiredSize)
      //       if(size.width > maxWidth){
      //         maxWidth = size.width;
      //       }
      //       if(size.height > maxHeight){
      //         maxHeight = size.height;
      //       }
      //     }
      //   }
      //   // var group = that.diagram.findNodeForKey(data.part.data.key)
      //   // var git = group.memberParts;
      //   // var maxWidth = 0;
      //   // var maxHeight = 0;
      //   // while (git.next()) {
      //   //   var item = git.value;
      //   //   console.log("item:",item)
      //   //   if(item.naturalBounds.width > maxWidth){
      //   //     maxWidth = item.naturalBounds.width;
      //   //   }
      //   //   if(item.naturalBounds.height > maxHeight){
      //   //     maxHeight = item.naturalBounds.height;
      //   //   }
      //   //   console.log(`maxHeight:${maxHeight},maxWidth:${maxWidth}`)

      //   // }           
      //   return go.Size.parse(`${maxWidth+100} ${maxHeight}`)         
      //   // group.diagram.model.setDataProperty(group.data, "desiredSize", `${maxWidth+100} ${maxHeight}`) 
      // }).makeTwoWay(go.Size.stringify)
      )

      // $(go.Placeholder,    // represents the area of all member parts,
      //   { padding: 0}
      // ),  // with some extra padding around them

      // $(go.TextBlock,  // group title
      //   { font: "Bold 12pt Sans-Serif" },
      //   new go.Binding("text", "key")
      // )
      );
    }
  }]);

  return AxisNodeTemplate;
}(Base);

module.exports = AxisNodeTemplate;

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// define a custom grid layout that makes sure the length of each lane is the same
// and that each lane is broad enough to hold its subgraph
function AxisGroupLayout() {
  go.Layout.call(this);
  // go.GridLayout.call(this);
  // this.cellSize = new go.Size(1, 1);
  // this.wrappingColumn = Infinity;
  // this.wrappingWidth = Infinity;
  // this.spacing = new go.Size(0, 0);
  // this.alignment = go.GridLayout.Position;
}
go.Diagram.inherit(AxisGroupLayout, go.Layout);

function computeNewRotateLoc(rotateCenter, currentLoc, angle) {
  if (rotateCenter.equals(currentLoc)) return currentLoc;
  // 计算选择中心点到（0,0）点的偏移
  var offset = new go.Point(0, 0).subtract(rotateCenter.copy());
  // 将原来的点偏移到相对0,0点的位置
  var nodeOrigin = currentLoc.copy().offset(offset.x, offset.y);
  var newNodeOrigin = nodeOrigin.rotate(angle);
  var newNodeLoc = newNodeOrigin.copy().offset(-offset.x, -offset.y);
  return newNodeLoc;
  // console.log("newNodeLoc", newNodeLoc)
}
AxisGroupLayout.prototype.doLayout = function (coll) {
  console.log("AxisGroupLayout.doLayout");
  var diagram = this.diagram;
  diagram.startTransaction("AxisGroupLayout");
  // COLL might be a Diagram or a Group or some Iterable<Part>

  var it = this.collectParts(coll).iterator;
  var collection = [];
  var dataCollection = [];
  var group = this.group;
  // group.location = new go.Point(0,0)
  var maxWidth = 0;
  var maxHeight = 0;
  var centerLine, axisX, axisY, axisXText, axisYText, themeText, labelText1, labelText2, labelText3, labelGroup, waveGroup;
  var shiTextColl = [];
  var xuTextColl = [];
  var oliveWidth;
  var oliveHeight;
  while (it.next()) {
    var node = it.value;
    // var item = git.value;
    //   console.log("item:",item)

    dataCollection.push(node.data);
    if (node.data.category == "wave") {
      collection.push(node);
    }
    if (!(node instanceof go.Node)) {
      continue;
    }
    // 处理文本节点的位置和定位位置
    // if(node.data.category == "text"){
    if (node.data.role == "axisYText") {
      axisYText = node;
    }
    if (node.data.role == "axisXText") {
      axisXText = node;
    }
    if (node.data.role == "themeText") {
      themeText = node;
    }
    if (node.data.role == "shiText") {
      shiTextColl.push(node);
    }
    if (node.data.role == "xuText") {
      xuTextColl.push(node);
    }
    // }
    // 处理label文本节点的位置和定位位置
    // if(node.data.category == "iconText"){
    if (node.data.role == "labelText1") {
      labelText1 = node;
    }
    if (node.data.role == "labelText2") {
      labelText2 = node;
    }
    if (node.data.role == "labelText3") {
      labelText3 = node;
    }
    if (node.data.role == "labelGroup") {
      labelGroup = node;
    }
    // }

    if (node.naturalBounds.width > maxWidth) {
      maxWidth = node.naturalBounds.width;
    }
    if (node.naturalBounds.height > maxHeight) {
      maxHeight = node.naturalBounds.height;
    }

    if (node.data.category == "line") {
      if (node.data.role == "centerLine") {
        centerLine = node;
      }
    }
    if (node.data.group == group.key) {
      // position the node . . .
      if (node.data.category == "line") {
        if (node.data.role == "axisX") {
          node.angle = 0;
          axisX = node;
        };
        if (node.data.role == "axisY") {
          axisY = node;
          node.angle = 270;
        }
        node.location = group.location.copy().offset(0, 0);
        // node.angle = 270
      }
      if (node.data.category == "waveGroup") {
        waveGroup = node;
        // node.angle = group.angle
        oliveWidth = node.data.oliveWidth;
        oliveHeight = node.data.oliveHeight;
        node.location = group.location.copy().offset(0, 0);
        // node.layout.isOngoing = true;
        // node.layout.isValidLayout = false;
        // collection.push(node)
      }
    }
  }
  console.log("maxHeight:" + maxHeight + ",maxWidth:" + maxWidth);
  // line.width = 2000
  // line.height = 4
  if (axisY) {
    axisY.angle = 270;
  }
  if (axisX) {
    axisX.angle = 0;
  }
  if (waveGroup) {
    // var x1 = centerLine.width * Math.cos(Math.abs(360-centerLine.angle%360) / 180 * Math.PI)
    console.log("waveGroup.width:" + waveGroup.width);
    var x1 = waveGroup.resizeObject.width * Math.cos(Math.abs(360 - waveGroup.angle % 360) / 180 * Math.PI);
    var y1 = 10;
    var x2 = waveGroup.resizeObject.width * Math.sin(Math.abs(360 - waveGroup.angle % 360) / 180 * Math.PI);
    var y2 = 10;
    // axisX.desiredSize = new go.Size(x1, y1)
    // axisY.desiredSize = new go.Size(x2, y2)
    this.diagram.model.setDataProperty(axisX.data, "desiredSize", x1 + " " + y1);
    this.diagram.model.setDataProperty(axisY.data, "desiredSize", x2 + " " + y2);
    // this.diagram.model.setDataProperty(group.data, "desiredSize",`${x1} ${x2}`)

    group.width = x1;
    group.height = x2;
    var shiStroke = waveGroup.data.shiStroke;
    var xuStroke = waveGroup.data.xuStroke;
    var centerStroke = waveGroup.data.centerStroke || "#3f5369";
    if (axisXText) {
      axisXText.location = group.location.copy().offset(x1, 0);
      axisXText.locationSpot = go.Spot.Top;
    }
    if (axisYText) {
      axisYText.location = group.location.copy().offset(-10, -x2);
      axisYText.locationSpot = go.Spot.Right;
    }
    // this.diagram.model.setDataProperty(axisY.data, "desiredSize",axisY.width)
  }

  if (themeText) {}
  // themeText.location = group.location.copy().offset(0, 0)
  // themeText.locationSpot = new go.Spot(0.7,0,0,0)

  // if(labelText1){
  //   labelText1.location = group.location.copy().offset(0, -x2).offset(40,10)
  // }
  // if(labelText2){
  //   labelText2.location = group.location.copy().offset(0, -x2).offset(40,80)
  // }
  // if(labelText3){
  //   labelText3.location = group.location.copy().offset(0, -x2).offset(40,150)
  // }
  if (labelGroup) {
    var itl = labelGroup.findSubGraphParts().iterator;
    while (itl.next()) {
      var n = itl.value;
      if (n.data.role == "labelText1") {
        labelText1 = n;
      }
      if (n.data.role == "labelText2") {
        labelText2 = n;
      }
      if (n.data.role == "labelText3") {
        labelText3 = n;
      }
    }
    if (waveGroup) {
      waveGroup.labelText1 = labelText1;
      waveGroup.labelText2 = labelText2;
      waveGroup.labelText3 = labelText3;
    }
    // var tmp1 = group.location.copy().offset(0, -x2).offset(30,0)
    // labelGroup.location = tmp1
    // labelGroup.diagram.model.setDataProperty(labelGroup.data,"loc",go.Point.stringify(tmp1))
    // setTimeout(()=>{
    //   diagram.startTransaction("labelGroup");
    //   labelGroup.layout.isOngoing = true;
    //   labelGroup.layout.isValidLayout = false;
    //   diagram.commitTransaction("labelGroup");
    // },350)
    // labelGroup.location = group.location.copy().offset(0, -x2).offset(40,10)
  }
  if (shiStroke && labelText1) {
    this.diagram.model.setDataProperty(labelText1.data, "fill", shiStroke);
  }
  if (xuStroke && labelText2) {
    this.diagram.model.setDataProperty(labelText2.data, "fill", xuStroke);
  }
  if (centerStroke && labelText3) {
    this.diagram.model.setDataProperty(labelText3.data, "fill", centerStroke);
  }
  // collection.sort(function(a,b){
  //     return a.data.order > b.data.order
  // })
  // shiTextColl.sort(function(a,b){
  //     return a.data.order > b.data.order
  // })
  // xuTextColl.sort(function(a,b){
  //     return a.data.order > b.data.order
  // })
  // for(var i=0;i<xuTextColl.length;i++){
  //   xuTextColl[i].location = computeNewRotateLoc(collection[i].location, collection[i].location.copy().offset(collection[i].width/2,collection[i].height/2),collection[i].angle)
  // }
  // collection.forEach(function(obj){
  //     obj.location = group.location.copy().offset(300*(obj.data.order-1),0)
  //     // obj.location = new go.Point(300*(obj.data.order-1),0)
  //     // obj.
  //     // var group = a.findNodeDataForKey(m.group)
  //     obj.location = computeNewRotateLoc(group.location, obj.location, obj.angle)
  // })
  go.Layout.prototype.doLayout.call(this, coll);
  diagram.commitTransaction("AxisGroupLayout");
  // diagram.updateAllTargetBindings()
  return;
  // return;
  // var diagram = this.diagram;
  if (diagram === null) return;
  diagram.startTransaction("PoolLayout");
  // make sure all of the Group Shapes are big enough
  // var minsize = computeMinPoolSize();
  // diagram.findTopLevelGroups().each(function(lane) {
  //   if (!(lane instanceof go.Group)) return;
  //   var shape = lane.selectionObject;
  //   if (shape !== null) {  // change the desiredSize to be big enough in both directions
  //     var sz = computeLaneSize(lane);
  //     shape.width = (!isNaN(shape.width)) ? Math.max(shape.width, sz.width) : sz.width;
  //     shape.height = (isNaN(shape.height) ? minsize.height : Math.max(shape.height, minsize.height));
  //     var cell = lane.resizeCellSize;
  //     if (!isNaN(shape.width) && !isNaN(cell.width) && cell.width > 0) shape.width = Math.ceil(shape.width / cell.width) * cell.width;
  //     if (!isNaN(shape.height) && !isNaN(cell.height) && cell.height > 0) shape.height = Math.ceil(shape.height / cell.height) * cell.height;
  //   }
  // });
  // now do all of the usual stuff, according to whatever properties have been set on this GridLayout
  go.GridLayout.prototype.doLayout.call(this, coll);
  diagram.commitTransaction("PoolLayout");
};
// end PoolLayout class

module.exports = AxisGroupLayout;

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var $ = go.GraphObject.make;
var Base = __webpack_require__(1);
var helpers = __webpack_require__(0);

var IconTextTemplate = function (_Base) {
  _inherits(IconTextTemplate, _Base);

  function IconTextTemplate(options) {
    _classCallCheck(this, IconTextTemplate);

    return _possibleConstructorReturn(this, (IconTextTemplate.__proto__ || Object.getPrototypeOf(IconTextTemplate)).call(this, options));
    // this.nodeProperties = {}
  }

  _createClass(IconTextTemplate, [{
    key: 'makeGeo',
    value: function makeGeo(data, shape, options) {
      // this is much more efficient than calling go.GraphObject.make:
      var _data$radiusX = data.radiusX,
          radiusX = _data$radiusX === undefined ? 150 : _data$radiusX,
          _data$radiusY = data.radiusY,
          radiusY = _data$radiusY === undefined ? 100 : _data$radiusY;

      var geo = new go.Geometry().add(new go.PathFigure(0, 0) // start point
      .add(new go.PathSegment(go.PathSegment.SvgArc, radiusX * 2, 0, radiusX, radiusY, 0, 1, options.clockwiseFlag ? 1 : 0)));
      geo.defaultStretch = go.GraphObject.Fill;
      return geo;
    }
  }, {
    key: 'getShiHalfEllipseShape',
    value: function getShiHalfEllipseShape() {
      var _this2 = this;

      return $(go.Shape, { name: "XU", stroke: "red", fill: "rgba(0,66,0,0)",
        // background: "yellow",
        stretch: go.GraphObject.Uniform,
        alignment: go.Spot.Bottom,
        alignmentFocus: go.Spot.Bottom
        // row:1, column:0,margin:0
      },
      // new go.Binding("alignment","",function(data, shape){
      //   if(data.flip){
      //     return go.Spot.Top
      //   }
      //   return go.Spot.Bottom
      // }),
      // new go.Binding("alignmentFocus","",function(data, shape){
      //   if(data.flip){
      //     return go.Spot.Top
      //   }
      //   return go.Spot.Bottom
      // }),
      new go.Binding("geometry", "", function (data, shape) {
        var clockwiseFlag = 0;
        if (data.order % 2 == 0) {
          data.flip = true;
        }
        if (data.flip) {
          clockwiseFlag = 1;
        }
        return _this2.makeGeo(data, shape, { clockwiseFlag: clockwiseFlag });
      }), new go.Binding("desiredSize", "desiredSize", function (v) {
        var size = new go.Size(v.width, v.height / 2);
        // console.log("v:",v)
        return size;
      }).ofObject("main"));
    }
  }, {
    key: 'getXuHalfEllipseShape',
    value: function getXuHalfEllipseShape() {
      var _this3 = this;

      return $(go.Shape, { name: "SHI", stroke: "blue", fill: "rgba(0,66,0,0)",
        // background: "gray",
        stretch: go.GraphObject.Uniform,
        alignment: go.Spot.Bottom,
        strokeDashArray: [5, 5],
        alignmentFocus: go.Spot.Bottom
        // row:1, column:0,margin:0
      },
      // new go.Binding("alignment","",function(data, shape){
      //   if(data.flip){
      //     return go.Spot.Top
      //   }
      //   return go.Spot.Bottom
      // }),
      // new go.Binding("alignmentFocus","",function(data, shape){
      //   if(data.flip){
      //     return go.Spot.Top
      //   }
      //   return go.Spot.Bottom
      // }),
      new go.Binding("geometry", "", function (data, shape) {
        var clockwiseFlag = 1;
        if (data.order % 2 == 0) {
          data.flip = true;
        }
        if (data.flip) {
          clockwiseFlag = 0;
        }
        return _this3.makeGeo(data, shape, { clockwiseFlag: clockwiseFlag });
      }), new go.Binding("desiredSize", "desiredSize", function (v) {
        var size = new go.Size(v.width, v.height / 2);
        // console.log("v:",v)
        return size;
      }).ofObject("main"));
    }
  }, {
    key: 'getTextBuild',
    value: function getTextBuild() {
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
      }, new go.Binding("textAlign", "textAlign", function (v) {
        return ['start', 'center', 'end'].indexOf(v) > -1 ? v : "center";
      }).makeTwoWay(), new go.Binding("spacingAbove", "spacingline", function (v) {
        return helpers.tdTransToNum(v, 4);
      }).makeTwoWay(), new go.Binding("spacingBelow", "spacingline", function (v) {
        return helpers.tdTransToNum(v, 4);
      }).makeTwoWay(), new go.Binding("width", "width", function (v) {
        return v - 30;
      }).ofObject("main"),
      // new go.Binding("height", "height", function (v) {
      //   return v;
      // }).ofObject("SHAPE"),
      new go.Binding("text", "text").makeTwoWay(), new go.Binding("stroke", "textStroke").makeTwoWay(), new go.Binding("font", "font").makeTwoWay());
    }
  }, {
    key: 'getNodeTemplate',
    value: function getNodeTemplate() {
      return $(go.Node, "Spot", {
        locationObjectName: "TEXT",
        movable: true,
        resizable: true,
        resizeObjectName: "TEXT",
        selectionObjectName: "TEXT",
        // rotatable: false,
        layoutConditions: go.Part.LayoutStandard & go.Part.LayoutRemoved & go.Part.LayoutAdded & go.Part.LayoutNodeSized,
        locationSpot: go.Spot.LeftCenter,
        click: function click(e, node) {
          console.log(node.data);
        },
        doubleClick: function doubleClick(e, node) {
          e.diagram.__trtd.selectText(e, node);
        },
        resizeAdornmentTemplate: // specify what resize handles there are and how they look
        $(go.Adornment, "Spot", $(go.Placeholder), // takes size and position of adorned object
        // $(go.Shape, "Circle",  // left resize handle
        //   { alignment: go.Spot.Left, cursor: "col-resize",
        //     desiredSize: new go.Size(9, 9), fill: "lightblue", stroke: "dodgerblue" }),
        $(go.Shape, "Circle", // right resize handle
        { alignment: go.Spot.Right, cursor: "col-resize",
          desiredSize: new go.Size(9, 9), fill: "lightblue", stroke: "dodgerblue" })
        // $(go.TextBlock, // show the width as text
        //   { alignment: go.Spot.Top, alignmentFocus: new go.Spot(0.5, 1, 0, -2),
        //     stroke: "dodgerblue" },
        //   new go.Binding("text", "adornedObject",
        //                  function(shp) { return shp.naturalBounds.width.toFixed(0); })
        //       .ofObject())
        )
      }, new go.Binding("movable", "movable").makeTwoWay(), new go.Binding("deletable", "deletable").makeTwoWay(),
      // $(go.TextBlock,{
      //   name:"label",
      //   // height:30,

      //   alignment: go.Spot.Center,
      //   verticalAlignment: go.Spot.Center,
      //   // isMultiline: false,
      //   overflow: go.TextBlock.OverflowEllipsis,
      //   // overflow: go.TextBlock.OverflowClip,
      //   // wrap: go.TextBlock.WrapDesiredSize,
      //   wrap: go.TextBlock.wrap,
      //   stretch: go.GraphObject.Fill,
      //   maxLines: 1,
      //   stroke: "black",
      //   editable: true,
      //   textAlign: "start",
      //   font: "18px 'Microsoft YaHei'"
      // },
      // new go.Binding("text", "label").makeTwoWay(),
      // ),
      $(go.TextBlock, {
        name: "TEXT",
        width: 200, height: 30,
        maxSize: new go.Size(NaN, 70),
        minSize: new go.Size(NaN, 70),
        alignment: go.Spot.Center,
        verticalAlignment: go.Spot.Center,
        isMultiline: false,
        overflow: go.TextBlock.OverflowEllipsis,
        // overflow: go.TextBlock.OverflowClip,
        // wrap: go.TextBlock.WrapDesiredSize,
        // wrap: go.TextBlock.wrap,
        stretch: go.GraphObject.Fill,
        maxLines: 5,
        stroke: "black",
        editable: true,
        textAlign: "start",
        font: "18px 'Microsoft YaHei'"
      }, new go.Binding("text", "text").makeTwoWay(), new go.Binding("width", "width", function (v) {
        //alert(v);
        return v;
      }).makeTwoWay(function (v) {
        return v;
      }), new go.Binding("height", "height", function (v) {
        //alert(v);
        return v;
      }).makeTwoWay(function (v) {
        return v;
      })), $(go.Panel, "Vertical", { alignment: go.Spot.Left,
        alignmentFocus: go.Spot.Right
      }, $(go.Shape, {
        name: "ICON",
        width: 16,
        height: 16,
        click: function click(e) {
          console.log("icon click");
        },
        figure: "Diamond",
        fill: "red",
        strokeWidth: 0,
        margin: 3
      }, new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify), new go.Binding("figure", "figure").makeTwoWay(), new go.Binding("fill", "fill", function (v, obj) {
        return v;
      }).makeTwoWay(), new go.Binding("height", "height", function (v) {
        if (!v) v = 30;
        return v * 2 / 3;
      }).ofObject("label"), new go.Binding("width", "height", function (v) {
        if (!v) v = 30;
        return v * 2 / 3;
      }).ofObject("label")))

      // this.binding,
      // $(go.Shape, "Ellipse",
      // { name:"main",fill: "lightgreen", stroke: null, width: 300, height: 150 },
      //   new go.Binding("desiredSize", "desiredSize", function(v, d) {
      //       // console.log("vd m", v, d )
      //       // if(!v) return d.part.findObject("SHAPE").measuredBounds.size;
      //       return go.Size.parse(v)
      //   }).makeTwoWay(function(v) {
      //       return go.Size.stringify(v)
      //   }),
      // ),
      // this.getShiHalfEllipseShape(),
      // this.getXuHalfEllipseShape(),

      // // this.getUpHalfEllipseShape(),
      // this.getTextBuild()
      );
    }
  }]);

  return IconTextTemplate;
}(Base);

module.exports = IconTextTemplate;

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var $ = go.GraphObject.make;
var Base = __webpack_require__(1);
var helpers = __webpack_require__(0);

var AutoTextTemplate = function (_Base) {
  _inherits(AutoTextTemplate, _Base);

  function AutoTextTemplate(options) {
    _classCallCheck(this, AutoTextTemplate);

    return _possibleConstructorReturn(this, (AutoTextTemplate.__proto__ || Object.getPrototypeOf(AutoTextTemplate)).call(this, options));
    // this.nodeProperties = {}
  }

  _createClass(AutoTextTemplate, [{
    key: "dealFireText",
    value: function dealFireText(e, part) {
      console.log("click fire button");
      // return
      var diagram = e.diagram;
      var node = diagram.selection.first();
      var it = node.containingGroup.findSubGraphParts().iterator;
      var centerNode;
      while (it.next()) {
        var n = it.value;
        if (n.data.subRole == "themeText") {
          centerNode = n;
          // break;
        }
      }
      // diagram.commandHandler.scrollToPart(centerNode);
      function checkSameRadius(n, centerNode, node) {
        if (n.data.dimKey == null) return false;
        var maxRadius = Math.max(Math.abs(node.data.orderX - centerNode.data.orderX), Math.abs(node.data.orderY - centerNode.data.orderY));
        if (Math.abs(n.data.orderX - centerNode.data.orderX) == maxRadius || Math.abs(n.data.orderY - centerNode.data.orderY) == maxRadius) {
          return true;
        } else {
          return false;
        }
        var r1 = (n.data.orderX - centerNode.data.orderX) * (n.data.orderX - centerNode.data.orderX) + (n.data.orderY - centerNode.data.orderY) * (n.data.orderY - centerNode.data.orderY);
        var r2 = (node.data.orderX - centerNode.data.orderX) * (node.data.orderX - centerNode.data.orderX) + (node.data.orderY - centerNode.data.orderY) * (node.data.orderY - centerNode.data.orderY);
        return r1 == r2;
      }
      var radius = Math.max(node.data.orderX, node.data.orderY);
      radius = Math.abs(radius - centerNode.data.orderX);
      // if(radius < 5) return;
      it.reset();
      while (it.next()) {
        var n = it.value;

        if (!checkSameRadius(n, centerNode, node)) {
          //   centerNode= n;
          // n.opacity = 0.1
          // break;
        } else {
          var obj = n.findObject("TEXT");
          // obj.__font = obj.font;
          // obj.font = "30px 'Microsoft YaHei'";
          // n.findObject("TEXT").font = "40px 'Microsoft YaHei'";
        }
      }
      //   node.data.role == "centerText"
      //   diagram.scrollToRect(node.naturalBounds)
      var group = node.containingGroup;
      var width = group.data.gridWidth;
      radius = 10;
      var rect = new go.Rect(new go.Point(centerNode.position.x - width * (radius + 1), centerNode.position.y - width * (radius + 1)), new go.Size(width * (radius + 1) * 2, width * (radius + 1) * 2));
      // var rect = new go.Rect(go.Point.parse("1803.1413612565443 1348.6910994764396"), new go.Size(700,700))
      diagram.animationManager.isEnabled = false;
      diagram.zoomToRect(rect);
      diagram.centerRect(centerNode.actualBounds);
      diagram.animationManager.isEnabled = true;
      if (e.diagram.__trtd.dealFireTextCallback) {
        e.diagram.__trtd.dealFireTextCallback(e, node);
      }
    }
  }, {
    key: "getNodeSelectionAdornmentTemplate",
    value: function getNodeSelectionAdornmentTemplate() {
      var that = this;
      return $(go.Adornment, "Spot", {
        // isShadowed: true,
        isActionable: true
      }, $(go.Panel, "Auto", $(go.Shape, "Rectangle", {
        isPanelMain: true,
        fill: null,
        stroke: "dodgerblue",
        strokeWidth: 3
        // new go.Binding("fill","",function(e,obj){
        //   var radBrush = $(go.Brush, "Radial", { 0: "rgba(248,248,242,0)", 1: 'RGB(255,242,0)' });
        //   return radBrush;
        // })
        //
      }), $(go.Placeholder) // this represents the selected Node
      ),

      // ),
      // the button to create a "next" node, at the top-right corner
      //   $(
      //     "CircleButton",
      //     {
      //       name: "fireButton",
      //       visible: false,
      //       toolTip: $(
      //         "ToolTip",
      //         $(
      //           go.Panel,
      //           "Vertical",

      //           $(go.TextBlock, { text: "碰撞火花", margin: 3 })
      //         )
      //       ),
      //     //   toolTip: $(
      //     //     go.Adornment,
      //     //     "Auto",
      //     //     // $(go.Shape, { fill: "#FFFFCC" }),
      //     //     $(
      //     //       go.TextBlock,
      //     //       { textAlign: "center", margin: new go.Margin(8, 4, 4, 4) }, // the tooltip shows the result of calling nodeInfo(data)
      //     //       new go.Binding("text", "", function(d) {
      //     //         return "碰撞火花";
      //     //       })
      //     //     )
      //     //   ),

      //       alignment: new go.Spot(1, 0, 20, -20),
      //       //   alignmentFocus: go.Spot.Left,
      //       width: 50,
      //       height: 50,
      //       click: function(e) {
      //         e.diagram.__trtd.addOlive();
      //       } // this function is defined below
      //     },
      //     new go.Binding("visible", "", function(v, obj){
      //         console.log("showfireButton", v, obj);
      //         var node = obj.part;
      //         // if(node.data.subRole == "coreText") return true;
      //         return false;
      //     }),
      //     // $(go.Shape, "FireHazard", {
      //     $(go.Shape, {
      //       geometryString:
      //         "M854.35904 613.09952v44.52864c-0.6656 2.16576-1.46944 4.33152-1.92 6.54336-4.55168 23.53664-7.1168 47.68768-13.9776 70.528-20.36224 67.39968-58.5216 123.57632-112.01024 169.43616-41.25184 35.39968-87.68512 60.9024-140.75904 73.45152-17.44896 4.13696-35.34336 6.57408-53.0432 9.79968h-44.51328c-2.16576-0.6656-4.3776-1.67424-6.59456-1.8176-46.99136-2.93376-91.52512-15.16544-133.2992-36.51072-78.96576-40.22272-135.93088-100.11136-161.9456-186.27072-5.53984-18.41664-7.85408-37.71392-11.69408-56.62208v-42.48064c1.67424-10.4448 3.1232-20.97664 5.0944-31.41632 8.41728-45.58848 28.67712-85.9648 55.51104-123.22816 25.30304-35.072 52.18304-69.04832 76.1856-105.0112 25.94816-39.0144 38.5024-82.31936 31.13984-129.80224-1.44896-9.37984-2.80576-18.75968-4.22912-28.08832 0.95744-0.24576 1.92-0.44032 2.87744-0.7168 57.92256 60.70784 67.3536 135.2192 59.07968 215.74144 2.11456-2.26304 3.8912-3.84 5.24288-5.66272 49.16224-66.48832 70.28224-139.93984 54.25152-222.208-10.1888-52.33664-32.22016-99.3792-68.67456-138.496-15.83104-16.93696-34.97984-30.79168-52.6336-46.08h18.21696c1.50528 0.6144 2.90816 1.67424 4.4288 1.8176 32.0512 2.75968 62.1568 12.65152 90.83904 26.56256 65.59744 31.75424 118.77376 78.69952 163.25632 135.95648 65.3824 84.26496 107.88864 177.73056 116.31104 285.35296 3.2256 41.08288-0.96256 81.01376-11.91424 120.40192-4.13696 14.91456-9.96864 29.3376-15.3088 44.8768 21.21728-9.0368 37.34016-22.84544 49.79712-40.74496 37.1456-53.48864 47.53408-113.13664 39.1168-179.08224 2.73408 3.1744 4.13696 4.4288 5.08928 6.00576 22.3744 35.34848 39.1168 73.0624 47.85664 114.04288 3.47136 16.22016 5.49376 32.8192 8.22272 49.19296m-349.952-78.42816c-0.82944 0.5888-1.7408 1.19808-2.60096 1.792-1.16224 16.24576-2.0224 32.52224-3.59936 48.768-2.31424 24.78592-8.2432 48.6912-19.84 70.91712-14.17728 27.22816-37.88288 44.16-64.1536 57.63072-28.32896 14.6176-46.17216 35.49696-48.4864 68.4544-2.41664 33.8944 7.77728 62.37696 35.10272 83.20512 25.6 19.49696 55.50592 25.85088 87.21408 24.79104 50.60608-1.64864 88.32512-25.7024 103.43424-76.35968 10.85952-36.36224 9.088-72.97024 1.82784-109.568-9.92768-50.176-28.09344-96.94208-59.1872-137.92256-8.7296-11.45344-19.7632-21.17632-29.70624-31.70816",
      //       stroke: "red",
      //       fill: "red",
      //       desiredSize: new go.Size(25, 25)
      //     })
      //   ),

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
      $(go.Panel, "Auto", {
        // 放大镜
        name: "ButtonIcon1",
        visible: false,
        //   alignment: new go.Spot(0, 1, 5, -5),
        alignment: new go.Spot(1, 0, 20, -20),
        //alignment: go.Spot.BottomLeft,
        //alignmentFocus: go.Spot.BottomLeft,
        width: 60,
        height: 60,
        isActionable: true,
        toolTip: $("ToolTip", $(go.Panel, "Vertical", $(go.Picture, new go.Binding("source", "src", function (s) {
          return "images/" + s + ".png";
        })), $(go.TextBlock, { text: "碰撞火花", margin: 3 }))),
        cursor: "pointer",
        click: function click(e, part) {
          //    if()

          that.dealFireText(e, part);
          // diagram.commandHandler.scrollToPart(centerNode)
        } // this function is defined below
      }, new go.Binding("visible", "", function (e, obj) {
        if (obj.part.data.subRole == "coreText") {
          return true;
        }
        return false;
      }), $(go.Shape, "Circle", {
        fill: "rgba(1,1,1,0)",
        strokeWidth: 0,
        stroke: "green",
        width: 50,
        height: 60
      }), $(go.Shape, {
        //   _para1: true,

        name: "FireButton",
        fill: "red",
        width: 30,
        height: 40,
        strokeWidth: 2,
        stroke: "red"
        //   geometryString: icons["zoomout"], // default value for isTreeExpanded is true
        //   desiredSize: new go.Size(30, 30),
      }, new go.Binding("geometryString", "", function (d, button) {
        // console.log('dddddd:', d);
        // console.log('button:', button);
        // var myDiagram = d.diagram;
        // var node = myDiagram.selection.first();
        // if (node["_controlExpand"]) {
        //     return icons["zoomout"];
        // } else {
        //     return icons["zoomin"];
        // }
        return "M854.35904 613.09952v44.52864c-0.6656 2.16576-1.46944 4.33152-1.92 6.54336-4.55168 23.53664-7.1168 47.68768-13.9776 70.528-20.36224 67.39968-58.5216 123.57632-112.01024 169.43616-41.25184 35.39968-87.68512 60.9024-140.75904 73.45152-17.44896 4.13696-35.34336 6.57408-53.0432 9.79968h-44.51328c-2.16576-0.6656-4.3776-1.67424-6.59456-1.8176-46.99136-2.93376-91.52512-15.16544-133.2992-36.51072-78.96576-40.22272-135.93088-100.11136-161.9456-186.27072-5.53984-18.41664-7.85408-37.71392-11.69408-56.62208v-42.48064c1.67424-10.4448 3.1232-20.97664 5.0944-31.41632 8.41728-45.58848 28.67712-85.9648 55.51104-123.22816 25.30304-35.072 52.18304-69.04832 76.1856-105.0112 25.94816-39.0144 38.5024-82.31936 31.13984-129.80224-1.44896-9.37984-2.80576-18.75968-4.22912-28.08832 0.95744-0.24576 1.92-0.44032 2.87744-0.7168 57.92256 60.70784 67.3536 135.2192 59.07968 215.74144 2.11456-2.26304 3.8912-3.84 5.24288-5.66272 49.16224-66.48832 70.28224-139.93984 54.25152-222.208-10.1888-52.33664-32.22016-99.3792-68.67456-138.496-15.83104-16.93696-34.97984-30.79168-52.6336-46.08h18.21696c1.50528 0.6144 2.90816 1.67424 4.4288 1.8176 32.0512 2.75968 62.1568 12.65152 90.83904 26.56256 65.59744 31.75424 118.77376 78.69952 163.25632 135.95648 65.3824 84.26496 107.88864 177.73056 116.31104 285.35296 3.2256 41.08288-0.96256 81.01376-11.91424 120.40192-4.13696 14.91456-9.96864 29.3376-15.3088 44.8768 21.21728-9.0368 37.34016-22.84544 49.79712-40.74496 37.1456-53.48864 47.53408-113.13664 39.1168-179.08224 2.73408 3.1744 4.13696 4.4288 5.08928 6.00576 22.3744 35.34848 39.1168 73.0624 47.85664 114.04288 3.47136 16.22016 5.49376 32.8192 8.22272 49.19296m-349.952-78.42816c-0.82944 0.5888-1.7408 1.19808-2.60096 1.792-1.16224 16.24576-2.0224 32.52224-3.59936 48.768-2.31424 24.78592-8.2432 48.6912-19.84 70.91712-14.17728 27.22816-37.88288 44.16-64.1536 57.63072-28.32896 14.6176-46.17216 35.49696-48.4864 68.4544-2.41664 33.8944 7.77728 62.37696 35.10272 83.20512 25.6 19.49696 55.50592 25.85088 87.21408 24.79104 50.60608-1.64864 88.32512-25.7024 103.43424-76.35968 10.85952-36.36224 9.088-72.97024 1.82784-109.568-9.92768-50.176-28.09344-96.94208-59.1872-137.92256-8.7296-11.45344-19.7632-21.17632-29.70624-31.70816";
      })))
      // )
      );
    }
  }, {
    key: "clearBorder",
    value: function clearBorder(node) {
      if (node.data.showBorder) {
        // if(node.data.text == ""){
        node.findObject("textBorder").visible = false;
        // }
      }
    }
  }, {
    key: "makeGeo",
    value: function makeGeo(data, shape, options) {
      // this is much more efficient than calling go.GraphObject.make:
      var _data$radiusX = data.radiusX,
          radiusX = _data$radiusX === undefined ? 150 : _data$radiusX,
          _data$radiusY = data.radiusY,
          radiusY = _data$radiusY === undefined ? 100 : _data$radiusY;

      var geo = new go.Geometry().add(new go.PathFigure(0, 0) // start point
      .add(new go.PathSegment(go.PathSegment.SvgArc, radiusX * 2, 0, radiusX, radiusY, 0, 1, options.clockwiseFlag ? 1 : 0)));
      geo.defaultStretch = go.GraphObject.Fill;
      return geo;
    }
  }, {
    key: "getNodeTemplate",
    value: function getNodeTemplate() {
      var properties = {
        figure: "Rectangle",
        fill: "rgba(0,0,0,0)",
        strokeWidth: 1,
        stroke: "rgba(0,0,0,0)",
        fontSize: 15,
        font: "sans-serif"
      };
      var that = this;
      var diagram = this.diagram;
      return $(go.Node, "Spot", {
        _controlExpand: true,
        __trtdNode: that,
        layerName: "Foreground",
        zOrder: 10,
        movable: true,
        //   copyable: false,
        visible: true,
        locationSpot: go.Spot.Center,
        resizeCellSize: new go.Size(10, 10),
        toolTip: that.getTooTip(),
        //   locationObjectName: "textBorder",
        //   selectionObjectName: "textBorder",
        resizable: true,
        //   selectable: false,
        //   clickable: false,
        // resizeObjectName: "SHAPE", // user can resize the Shape
        rotatable: false,
        location: new go.Point(0, 0),
        //rotateObjectName: "SHAPE",  // rotate the Shape without rotating the label
        // doubleClick: selectText,
        toMaxLinks: 1,
        mouseDrop: function mouseDrop(e, obj) {
          var node = obj.part;
          var selnode = e.diagram.selection.first();

          // 常变
          if (selnode.data.category == "picGroup" && selnode.data.role == "cbian" && node.data.role == "centerText") {
            var oliveNode = e.diagram.findNodeForKey(node.data.olive);
            if (!oliveNode) return;
            var it = selnode.findSubGraphParts().iterator;
            var deleteObjs = [];
            var cbian = {};
            while (it.next()) {
              var n = it.value;
              if (n.data.category == "autoText") {
                if (n.data.locationSpot == "0 0 0 0") {
                  cbian.shiText = n.data.text;
                }
                if (n.data.locationSpot == "0 0.5 0 0") {
                  cbian.centerText = n.data.text;
                }
                if (n.data.locationSpot == "0 1 0 0") {
                  cbian.xuText = n.data.text;
                }
              }
              deleteObjs.push(n.data);
            }
            e.diagram.startTransaction("mouseDrop");
            // 删除总结图
            e.diagram.model.removeNodeDataCollection(deleteObjs);
            var backupSelnode = JSON.parse(JSON.stringify(selnode.data));
            e.diagram.model.removeNodeData(selnode.data);

            // 添加新橄榄
            e.diagram.__trtd.addOlive(oliveNode, cbian);
            e.diagram.commitTransaction("mouseDrop");
            return;
          }

          // 互换要点文字,只有云盘里的文字可以互换
          if (selnode.data.subRole == "coreText" && node.data.subRole == "coreText" || selnode.data.subRole == "yunpanText" && node.data.subRole == "yunpanText") {
            e.diagram.model.startTransaction("coreTextExchange");
            var selOrderX = selnode.data.orderX;
            var selOrderY = selnode.data.orderY;
            var selDimKey = selnode.data.dimKey;
            e.diagram.model.setDataProperty(selnode.data, "orderX", node.data.orderX);
            e.diagram.model.setDataProperty(selnode.data, "orderY", node.data.orderY);
            e.diagram.model.setDataProperty(selnode.data, "dimKey", node.data.dimKey);
            e.diagram.model.setDataProperty(node.data, "orderX", selOrderX);
            e.diagram.model.setDataProperty(node.data, "orderY", selOrderY);
            e.diagram.model.setDataProperty(node.data, "dimKey", selDimKey);
            e.diagram.model.commitTransaction("coreTextExchange");
          }

          // 云盘互换维度
          if (selnode.data.subRole == "dimText" && node.data.subRole == "dimText" && selnode.data.category == node.data.category) {
            if (selnode.data.group != node.data.group) return;
            if (!selnode.containingGroup) return;
            if (selnode.containingGroup.data.category != "yunpanGroup") return;
            if (!(selnode.data.dimX == node.data.dimX || selnode.data.dimY == node.data.dimY)) {
              return;
            }

            e.diagram.model.startTransaction("dimTextExchange");
            var selOrderX = selnode.data.dimX;
            var selOrderY = selnode.data.dimY;
            var it = node.containingGroup.findSubGraphParts().iterator;
            var nodeCoreTexts = [];
            var selnodeCoreTexts = [];
            var yunnodeCoreTexts = [];
            var yunselnodeCoreTexts = [];
            var normDim = "X";
            if (selnode.data.dimX == 0) {
              normDim = "Y";
            }
            var selOrder = selnode.data["dim" + normDim];
            var nodeOrder = node.data["dim" + normDim];
            while (it.next()) {
              var n = it.value;
              if (n.data.subRole == "yunpanText") {
                if (n.data["order" + normDim] == nodeOrder) {
                  yunnodeCoreTexts.push(n);
                }
                if (n.data["order" + normDim] == selOrder) {
                  yunselnodeCoreTexts.push(n);
                }
              }
            }
            var tmpX, tmpY;
            for (var i = 0; i < yunnodeCoreTexts.length; i++) {
              e.diagram.model.setDataProperty(yunnodeCoreTexts[i].data, "order" + normDim, selOrder);
            }
            for (var i = 0; i < yunselnodeCoreTexts.length; i++) {
              e.diagram.model.setDataProperty(yunselnodeCoreTexts[i].data, "order" + normDim, nodeOrder);
            }
            e.diagram.model.setDataProperty(selnode.data, "dim" + normDim, nodeOrder);
            e.diagram.model.setDataProperty(node.data, "dim" + normDim, selOrder);
            // e.diagram.model.setDataProperty(
            //   node.data,
            //   "rho" + normDim,
            //   selOrder
            // );
            e.diagram.model.commitTransaction("dimTextExchange");
            return;
          }

          // 互换维度
          if (selnode.data.subRole == "dimText" && node.data.subRole == "dimText") {
            e.diagram.model.startTransaction("dimTextExchange");
            var selOrderX = selnode.data.dimX;
            var selOrderY = selnode.data.dimY;
            var it = node.containingGroup.findSubGraphParts().iterator;
            var nodeCoreTexts = [];
            var selnodeCoreTexts = [];
            var yunnodeCoreTexts = [];
            var yunselnodeCoreTexts = [];
            var normDim = "X";
            if (selnode.data.dimX == 0) {
              normDim = "Y";
            }
            while (it.next()) {
              var n = it.value;
              if (n.data.dimKey == node.data.key) {
                nodeCoreTexts.push(n);
              }
              if (n.data.dimKey == selnode.data.key) {
                selnodeCoreTexts.push(n);
              }
              if (n.data.subRole == "yunpanText") {
                if (n.data["order" + normDim] == node.data["order" + normDim]) {
                  yunnodeCoreTexts.push(n);
                }
                if (n.data["order" + normDim] == selnode.data["order" + normDim]) {
                  yunselnodeCoreTexts.push(n);
                }
              }
            }
            console.log("selnodeCoreTextsselnodeCoreTextsselnodeCoreTexts", selnodeCoreTexts.length);
            var centerOrderX = (node.containingGroup.__yunPointsX.length + 1) / 2;
            var centerOrderY = (node.containingGroup.__yunPointsY.length + 1) / 2;

            if (selnode.data.dimX > centerOrderX) {
              selnodeCoreTexts.sort(function (a, b) {
                return a.data.orderX - b.data.orderX;
              });
            }
            if (selnode.data.dimX == centerOrderX) {
              if (selnode.data.dimY > centerOrderY) {
                selnodeCoreTexts.sort(function (a, b) {
                  return a.data.orderY - b.data.orderY;
                });
              } else {
                selnodeCoreTexts.sort(function (a, b) {
                  return b.data.orderY - a.data.orderY;
                });
              }
            }
            if (selnode.data.dimX < centerOrderX) {
              selnodeCoreTexts.sort(function (a, b) {
                return b.data.orderX - a.data.orderX;
              });
            }

            if (node.data.dimX > centerOrderX) {
              nodeCoreTexts.sort(function (a, b) {
                return a.data.orderX - b.data.orderX;
              });
            }
            if (node.data.dimX == centerOrderX) {
              if (node.data.dimY > centerOrderY) {
                nodeCoreTexts.sort(function (a, b) {
                  return a.data.orderY - b.data.orderY;
                });
              } else {
                nodeCoreTexts.sort(function (a, b) {
                  return b.data.orderY - a.data.orderY;
                });
              }
            }
            if (node.data.dimX < centerOrderX) {
              nodeCoreTexts.sort(function (a, b) {
                return b.data.orderX - a.data.orderX;
              });
            }

            var tmpX, tmpY;
            for (var i = 0; i < selnodeCoreTexts.length; i++) {
              tmpX = selnodeCoreTexts[i].data.orderX;
              tmpY = selnodeCoreTexts[i].data.orderY;
              e.diagram.model.setDataProperty(selnodeCoreTexts[i].data, "orderX", nodeCoreTexts[i].data.orderX);
              e.diagram.model.setDataProperty(selnodeCoreTexts[i].data, "orderY", nodeCoreTexts[i].data.orderY);
              e.diagram.model.setDataProperty(nodeCoreTexts[i].data, "orderX", tmpX);
              e.diagram.model.setDataProperty(nodeCoreTexts[i].data, "orderY", tmpY);
            }
            e.diagram.model.setDataProperty(selnode.data, "dimX", node.data.dimX);
            e.diagram.model.setDataProperty(selnode.data, "dimY", node.data.dimY);
            e.diagram.model.setDataProperty(node.data, "dimX", selOrderX);
            e.diagram.model.setDataProperty(node.data, "dimY", selOrderY);
            e.diagram.model.commitTransaction("dimTextExchange");
          }

          if (selnode.data.category != "wave") {
            return;
          }
          if (node.data.role != "centerText") {
            return;
          }
          if (!node) {
            // node.containingGroup.layout.isValidLayout = false
            return;
          }
          if (selnode.data.group != obj.data.group) {
            return;
          }
          e.diagram.startTransaction("mouseDrop");
          selnode.__oldOrder = selnode.data.order;
          e.diagram.model.setDataProperty(selnode.data, "order", node.data.order + 0.5);
          var xuText = e.diagram.model.findNodeDataForKey(selnode.data.xuText);
          var shiText = e.diagram.model.findNodeDataForKey(selnode.data.shiText);
          e.diagram.model.setDataProperty(shiText, "order", node.data.order + 0.5);
          e.diagram.model.setDataProperty(xuText, "order", node.data.order + 0.5);
          // node.containingGroup.layout.isValidLayout = false
          e.diagram.commitTransaction("mouseDrop");
        },
        mouseDragEnter: function mouseDragEnter(e, obj) {
          var node = obj.part;
          var selnode = e.diagram.selection.first();
          if (!selnode) return;
          if (selnode.data.subRole == "coreText" && node.data.subRole == "coreText" || selnode.data.subRole == "yunpanText" && node.data.subRole == "yunpanText") {
            selnode.areaBackground = null;
            node.areaBackground = "RGB(107,208,137)";
          }
          if (selnode.data.subRole == "dimText" && node.data.subRole == "dimText") {
            selnode.areaBackground = null;
            node.areaBackground = "RGB(107,208,137)";
          }

          if (node.data.role == "centerText") {
            node.layerName = "Background";
          }
          // if (!(selnode instanceof go.Node)  || selnode.data.role != "freeText"  || selnode.category != "autoText" ||selnode.data.subRole != "coreText") {
          //     return;
          // }

          // //var sat = node.selectionAdornmentTemplate;
          // //var adorn = sat.copy();
          // //adorn.adornedObject = node;
          // //node.addAdornment("dragEnter", adorn);

          // //if (!mayWorkFor(selnode, node)) return;
          // var shape = node.findObject("SHAPE");
          // if (shape) {
          //     shape._prevFill = shape.fill; // remember the original brush
          //     shape.fill = "darkred";
          // }
        },
        mouseDragLeave: function mouseDragLeave(e, obj) {
          var node = obj.part;
          var selnode = e.diagram.selection.first();
          // var shape = node.findObject("SHAPE");
          if (selnode.data.subRole == "coreText" && node.data.subRole == "coreText" || selnode.data.subRole == "yunpanText" && node.data.subRole == "yunpanText") {
            node.areaBackground = null;
          }
          if (selnode.data.subRole == "dimText" && node.data.subRole == "dimText") {
            node.areaBackground = null;
          }
          if (node.data.role == "centerText") {
            node.layerName = "Foreground";
          }
          //node.removeAdornment("dragEnter");
        },
        selectionChanged: function selectionChanged(node) {
          console.log("selectionChanged", node);

          if (node.data.category != "autoText" || node.data.orderX == null || node.data.orderY == null || node.data.role != "freeText" || node.data.subRole != "coreText" && node.data.subRole != "yunpanText") {
            return;
          }

          if (!node.containingGroup || node.containingGroup.data.category != "yunGroup" && node.containingGroup.data.category != "yunpanGroup") {
            return;
          }

          if (node.containingGroup.data.beginSpark != "line") {
            return;
          }
          if (node.containingGroup.__yunPointsX && node.containingGroup.__yunPointsY) {
            var centerOrderX = (node.containingGroup.__yunPointsX.length + 1) / 2;
            var centerOrderY = (node.containingGroup.__yunPointsY.length + 1) / 2;
            if (node.data.orderX == centerOrderX && node.data.orderY == centerOrderY) {
              // 中心文字不参与变色
              return;
            }
            var orderX = node.data.orderX,
                orderY = node.data.orderY;
            if (orderX == centerOrderX) {
              orderX = orderY;
            }
            if (orderY == centerOrderY) {
              orderY = orderX;
            }
            var shapeStrokes = node.containingGroup.data.shapeStrokes;
            var showShape = node.containingGroup.data.showShape; // 是否显示矩形
            if (node.isSelected) {
              if (node.containingGroup.data.snapType == "between") {
                var diff = Math.max(Math.abs(node.data.orderX - centerOrderX), Math.abs(node.data.orderY - centerOrderY)) + 1;
              } else {
                var diff = Math.max(Math.abs(node.data.orderX - centerOrderX), Math.abs(node.data.orderY - centerOrderY));
              }
              console.log("diff:", diff, node.data.orderX, node.data.orderY);
              var it = node.containingGroup.findSubGraphParts().iterator;

              console.log("showShape", showShape);
              // var beginSpark = node.containingGroup.data.beginSpark; // 是否显示矩形
              var shape = null;
              while (it.next()) {
                var n = it.value;
                if (n.data.category == "autoText" && n.data.orderX != null && n.data.orderY != null && n.data.role == "freeText") {
                  n.findObject("textBorder").visible = false;
                  // if((Math.abs(n.data.orderX-centerOrderX) == Math.abs(orderX-centerOrderX)
                  //     || Math.abs(n.data.orderX-centerOrderY) == Math.abs(orderY-centerOrderY))
                  // && !(Math.abs(n.data.orderX-centerOrderY) < Math.abs(orderY-centerOrderY)
                  //     && Math.abs(n.data.orderX-centerOrderX) < Math.abs(orderX-centerOrderX))){
                  //     n.areaBackground = "red"
                  // }

                  if (Math.abs(n.data.orderX - centerOrderX) == Math.abs(orderX - centerOrderX) && Math.abs(n.data.orderY - centerOrderY) <= Math.abs(orderY - centerOrderY) || Math.abs(n.data.orderX - centerOrderX) <= Math.abs(orderX - centerOrderX) && Math.abs(n.data.orderY - centerOrderY) == Math.abs(orderY - centerOrderY)) {
                    // n.findObject("place").visible = true;
                    // n.__backupFont = n.findObject("TEXT").font
                    // n.findObject("TEXT").font = "40px 'Microsoft YaHei'";
                    // n.__backupMaxSize = n.maxSize
                    // n.maxSize = new go.Size(200,200)
                    n.areaBackground = "white";
                    n.zOrder = 999;
                  }
                }
                if (n.data.category == "shape" && n.data.role == "background") {
                  var obj = n.findObject("SHAPE");
                  // console.log("dfsdfsdfsdf", obj)
                  if (n.data.gridWidth == diff * 2) {
                    shape = obj;
                    // if(showShape){
                    // n.visible = true
                    // }
                    if (!obj.__prestroke) {
                      obj.__prestroke = obj.stroke;
                      obj.stroke = "rgba(255,0,0,0.5)";
                    }
                  } else {
                    if (obj.__prestroke) {
                      obj.stroke = obj.__prestroke;
                      delete obj.__prestroke;
                    }
                  }
                }
              }
              if (!shape) {
                if (node.containingGroup.data.snapType == "between") {
                  var gridWidth = diff * 2;
                } else {
                  var gridWidth = diff * 2;
                }
                console.log("addShape");
                node.diagram.model.startTransaction("addShape");
                var shapeData = {
                  deletable: true,
                  role: "background",
                  category: "shape",
                  // "loc":"-1532.0268216255727 9.121091688849674",
                  loc: go.Point.stringify(new go.Point(node.containingGroup.__yunPointsX[centerOrderX - 1], node.containingGroup.__yunPointsY[centerOrderY - 1])),
                  movable: true,
                  group: -19,
                  key: helpers.guid(),
                  orderX: 10,
                  orderY: 10,
                  gridWidth: gridWidth,
                  stroke: shapeStrokes[diff - 1],
                  visible: true,
                  strokeDashArray: "[0,0]",
                  strokeWidth: 3
                  //   "desiredSize":"1263 1263"
                };
                node.diagram.model.addNodeData(shapeData);
                node.diagram.model.commitTransaction("addShape");
                setTimeout(function () {
                  var nod = node.diagram.findNodeForKey(shapeData.key);
                  console.log("add shape add shape");
                  if (nod) {
                    // nod.visible = true
                    var obj = nod.findObject("SHAPE");
                    if (!obj.__prestroke) {
                      obj.__prestroke = obj.stroke;
                      obj.stroke = "rgba(255,0,0,0.5)";
                    }
                  }
                }, 100);
              }
            } else {
              var it = node.containingGroup.findSubGraphParts().iterator;
              while (it.next()) {
                var n = it.value;
                n.opacity = 1;
                // var textObj = n.findObject("TEXT");
                // if(textObj && textObj.__font){
                //     textObj.font = textObj.__font;
                //     delete textObj.__font
                // }
                // obj.__font = obj.font;
                // obj.font = "40px 'Microsoft YaHei'";
                if (n.data.category == "autoText" && n.data.orderX != null && n.data.orderY != null && n.data.role == "freeText") {
                  // n.findObject("textBorder").visible = false;
                  // if((n.data.orderX == orderX || n.data.orderY == orderY)
                  // && !(n.data.orderX < orderX && n.data.orderY <orderY )){
                  //     n.areaBackground = "red"
                  // }

                  if (Math.abs(n.data.orderX - centerOrderX) == Math.abs(orderX - centerOrderX) && Math.abs(n.data.orderY - centerOrderY) <= Math.abs(orderY - centerOrderY) || Math.abs(n.data.orderX - centerOrderX) <= Math.abs(orderX - centerOrderX) && Math.abs(n.data.orderY - centerOrderY) == Math.abs(orderY - centerOrderY)) {
                    // n.findObject("textBorder").visible = true;
                    // n.findObject("place").visible = false;
                    // n.__backupMaxSize = n.maxSize
                    // n.maxSize = n.__backupMaxSize
                    // n.findObject("TEXT").font = n.__backupFont
                    // n.findObject("TEXT").font = "40px 'Microsoft YaHei'";
                    n.areaBackground = null;
                    n.zOrder = NaN;
                  }
                }
                if (n.data.category == "shape" && n.data.role == "background") {
                  var obj = n.findObject("SHAPE");
                  // console.log("dfsdfsdfsdf", obj)
                  if (!showShape) {
                    // n.visible = false
                    obj.stroke = "rgba(255,0,0,0)";
                  }
                  if (n.data.gridWidth == diff * 2) {
                    if (!obj.__prestroke) {
                      obj.__prestroke = obj.stroke;
                      obj.stroke = "rgba(255,0,0,0.7)";
                    }
                  } else {
                    if (obj.__prestroke) {
                      obj.stroke = obj.__prestroke;
                      delete obj.__prestroke;
                    }
                  }
                }
              }
            }
          }
        },
        click: function click(e, node) {
          console.log(node.data);
          // if(node.data.group && node.containingGroup.data.category == "picGroup"){
          //     var it = node.containingGroup.findSubGraphParts().iterator;
          //     var basePoint;
          //     while(it.next()){
          //         var n = it.value;
          //         if(n.data.role == "theme"){
          //             basePoint = n;
          //             break;
          //         }
          //     }
          //     if(basePoint){
          //         console.log(`cbian ${node.data.role} offset: `, node.location.copy().subtract(basePoint.location))
          //     }
          // }
          // if(node.data.role == "centerText"){
          //     var waveNode = node.diagram.findNodeForKey(node.data.olive)
          //     node.layerName = "Background"
          //     if(waveNode){
          //         node.diagram.select(waveNode)
          //     }
          // }
          // e.diagram.model.startTransaction("click")
          // e.diagram.model.setDataProperty(node.data, "dimKey", -124)
          // e.diagram.model.setDataProperty(node.data,"dimKey", -73)
          // e.diagram.model.setDataProperty(node.data,"dimKey", -141)
          // e.diagram.model.setDataProperty(node.data,"dimKey", -74)

          // e.diagram.model.setDataProperty(node.data, "dimKey", -124)
          // e.diagram.model.setDataProperty(node.data,"dimKey", -141)
          // e.diagram.model.setDataProperty(node.data,"dimKey", -158)
          // e.diagram.model.setDataProperty(node.data,"dimKey", -176)
          // e.diagram.model.setDataProperty(node.data,"dimKey", -73)
          // e.diagram.model.setDataProperty(node.data,"dimKey", -74)
          // e.diagram.model.setDataProperty(node.data,"dimKey", -175)
          // e.diagram.model.setDataProperty(node.data,"dimKey", -177)
          // node.data.dimKey = -124
          // node.data.dimKey = -141
          // node.data.dimKey = -158
          // node.data.dimKey = -176
          // node.data.dimKey = -73
          // node.data.dimKey = -74
          // node.data.dimKey = -175
          // node.data.dimKey = -177

          // e.diagram.model.commitTransaction("click")
        },
        //   rotateAdornmentTemplate:  // specify appearance of rotation handle
        //   $(go.Adornment,
        //     { locationSpot: go.Spot.Center },
        //     $(go.Shape, "BpmnActivityLoop",
        //       { width: 12, height: 12, cursor: "pointer",
        //         background: "transparent", stroke: "dodgerblue", strokeWidth: 2 })
        //     ),
        mouseOver: function mouseOver(e, node) {
          // if(node.data.hyperlink){
          //   var textObj = node.findObject('TEXT');
          //   textObj.isUnderline = true;
          // }
          // console.log("mouseOvermouseOvermouseOver")

          if (node.data.text == "") {
            node.findObject("textBorder").visible = true;
          }

          if (node.data.showBorder) {
            if (node.data.text == "" && (node.data.role == "xuText" || node.data.role == "shiText")) {
              node.findObject("textBorder").visible = true;
            }
          }
          if (node.data.role == "centerText") {
            node.layerName = "Background";
            // node.diagram.model.startTransaction("centerText")
            // node.diagram.model.setDataProperty(node.data,"layerName", "Background")
            // node.diagram.model.commitTransaction("centerText")
          }
          //   node.areaBackground = "mediumslateblue"
          // }

          // if(!node.containingGroup) return;
          // var it = node.containingGroup.findSubGraphParts().iterator;
          // while (it.next()) {
          //     var n = it.value;
          //     if(n.data.category == "autoText"){
          //         if(n.data.order == node.data.order){
          //             // locateNode = n;
          //             n.areaBackground = "mediumslateblue"
          //         }
          //     }
          // }
          // diagram.__trtd.showNodeRemarkTips(e, node);
        },
        mouseLeave: function mouseLeave(e, node) {
          //   if(node.data.text == ""){
          // if(node.data.showBorder){
          // if(node.data.text == ""){
          node.findObject("textBorder").visible = false;
          // }
          // }
          if (node.data.role == "centerText") {
            node.layerName = "Foreground";
            // node.diagram.model.startTransaction("centerText")
            // node.diagram.model.setDataProperty(node.data,"layerName", "Foreground")
            // node.diagram.model.commitTransaction("centerText")
          }
          // node.areaBackground = null
          //   }
        },
        //   layoutConditions: go.Part.LayoutStandard,
        layoutConditions: go.Part.LayoutStandard & go.Part.LayoutRemoved & go.Part.LayoutAdded & ~go.Part.LayoutNodeSized,
        //layoutConditions:~go.Part.LayoutAdded,
        // fromLinkable: true, toLinkable: true,
        alignment: go.Spot.Center,
        alignmentFocus: go.Spot.Center,
        contextMenu: $(go.Adornment),
        // specify what resize handles there are and how they look
        resizeAdornmentTemplate: $(go.Adornment, "Spot", $(go.Placeholder), // takes size and position of adorned object
        $(go.Shape, "Circle", // left resize handle
        {
          alignment: go.Spot.Left,
          cursor: "col-resize",
          desiredSize: new go.Size(9, 9),
          fill: "lightblue",
          stroke: "dodgerblue"
        }), $(go.Shape, "Circle", // right resize handle
        {
          alignment: go.Spot.Right,
          cursor: "col-resize",
          desiredSize: new go.Size(9, 9),
          fill: "lightblue",
          stroke: "dodgerblue"
        }), $(go.Shape, "Circle", // right resize handle
        {
          alignment: go.Spot.Top,
          cursor: "col-resize",
          desiredSize: new go.Size(9, 9),
          fill: "lightblue",
          stroke: "dodgerblue"
        }), $(go.Shape, "Circle", // right resize handle
        {
          alignment: go.Spot.Bottom,
          cursor: "col-resize",
          desiredSize: new go.Size(9, 9),
          fill: "lightblue",
          stroke: "dodgerblue"
        })
        // $(go.TextBlock, // show the width as text
        //   { alignment: go.Spot.Top, alignmentFocus: new go.Spot(0.5, 1, 0, -2),
        //     stroke: "dodgerblue" },
        //   new go.Binding("text", "adornedObject",
        //                  function(shp) { return shp.naturalBounds.width.toFixed(0); })
        //       .ofObject())
        ),
        doubleClick: function doubleClick(e, node) {
          if (e.diagram.__trtd.textDoubleClick) {
            return e.diagram.__trtd.textDoubleClick(e, node);
          }
          e.diagram.__trtd.selectText(e, node);
        },

        selectionAdornmentTemplate: this.getNodeSelectionAdornmentTemplate()
      }, new go.Binding("locationSpot", "locationSpot", function (v) {
        return go.Spot.parse(v);
      }).makeTwoWay(function (v) {
        return go.Spot.stringify(v);
      }), new go.Binding("visible", "visible").makeTwoWay(), new go.Binding("deletable", "deletable").makeTwoWay(), new go.Binding("movable", "movable").makeTwoWay(), new go.Binding("rotatable", "rotatable").makeTwoWay(), new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify), new go.Binding("isShadowed", "isShadowed").makeTwoWay(), new go.Binding("angle", "angle").makeTwoWay(), new go.Binding("selectable", "selectable").makeTwoWay(), new go.Binding("copyable", "copyable").makeTwoWay(), new go.Binding("layerName", "layerName", function (v, d) {
        return v ? v : "";
      }), $(go.TextBlock, {
        name: "TEXT",
        alignment: new go.Spot(0, 0),
        font: "18px 'Microsoft YaHei'",
        editable: false,
        //   areaBackground:"gray",
        //margin: 3, editable: true,
        //   background:"yellow",
        stroke: "black",
        isMultiline: true,
        // overflow: go.TextBlock.OverflowEllipsis,
        wrap: go.TextBlock.WrapDesiredSize,
        textAlign: "start",
        verticalAlignment: go.Spot.Center,
        spacingAbove: 1,
        spacingBelow: 1,
        portId: "TEXT",
        margin: 5,
        maxSize: new go.Size(300, NaN),
        minSize: new go.Size(50, 10),
        stretch: go.GraphObject.UniformToFill,
        textEdited: function textEdited(textBlock, oldv, newv) {
          // // if(textBlock.part.containingGroup.data.textAngle == "horizontal"){
          //   var centerText = textBlock.part.diagram.model.findNodeDataForKey(textBlock.part.data.centerText)
          //   if(centerText){
          //     console.log("centerTextcenterTextcenterTextcenterText")
          var part = textBlock.part;
          if (newv.trim() == "" && (part.data.role == "shiText" || part.data.role == "xuText")) {
            textBlock.part.diagram.model.startTransaction("text");
            textBlock.part.diagram.model.setDataProperty(textBlock.part.data, "nloc", null);
            textBlock.part.diagram.model.commitTransaction("text");
          }
          //   }
          // //   return;
          // // }
          // setTimeout(function(){
          //   console.log("textEditedtextEditedtextEdited",textBlock.lineCount)
          //   if(!textBlock.text) return;
          //   if(textBlock.text && textBlock.text.trim() == "") return;
          //   if(textBlock.lineCount %2 != 0){
          //     if(newv[newv.length-1] == "\n"){
          //       textBlock.text = newv.substring(0, newv.length-1)
          //       return;
          //     }
          //     textBlock.text = newv+"\n"
          //   }
          // },100)

          // var enterCount = 0;
          if (textBlock.part.data.role && textBlock.part.data.role.indexOf("labelText") > -1) {
            textBlock.part.containingGroup.layout.isValidLayout = false;
          }
          // for(var i=0;i<newv.length;i++){

          // }
          // textBlock.part.updateTargetBindings()

          // if(textBlock.lineCount %2 != 0){
          //   if(newv[newv.length-1] == "\n"){
          //     textBlock.text = newv.substring(0, newv.length-1)
          //     return;
          //   }
          //   textBlock.text = newv+"\n"
          // }
        }
      }, new go.Binding("areaBackground", "isHighlighted", function (h, shape) {
        // node.areaBackground = "RGB(107,208,137)"
        if (h) return "RGBA(146,208,80,0.5)";
        return null;
        var c = shape.part.data.color;
        return c ? c : "white";
      }).ofObject(), // binding source is Node.isHighlighted
      new go.Binding("background", "background", function (v) {
        return v;
      }).makeTwoWay(), new go.Binding("areaBackground", "areaBackground", function (v) {
        return v;
      }).makeTwoWay(), new go.Binding("textAlign", "textAlign", function (v) {
        return v;
      }).makeTwoWay(), new go.Binding("spacingAbove", "spacingline", function (v) {
        return helpers.tdTransToNum(v, 4);
      }).makeTwoWay(), new go.Binding("spacingBelow", "spacingline", function (v) {
        return helpers.tdTransToNum(v, 4);
      }).makeTwoWay(), new go.Binding("maxSize", "", function (data, d, m) {
        // console.log("maxSize",v,m,d)
        var width = NaN;
        var height = NaN;
        if (data.width) {
          width = parseInt(data.width);
        }
        if (data.height) {
          height = parseInt(data.height);
        }

        return new go.Size(width, height);
      }), new go.Binding("minSize", "minSize", function (v) {
        // console.log("maxSize",v,m,d)

        return go.Size.parse(v);
      }),
      // new go.Binding("width", "width", function(v) {
      //     return v;
      // }).makeTwoWay(),
      // new go.Binding("height", "height", function(v) {
      //     return v;
      // }).makeTwoWay(),
      // new go.Binding("height", "height", function (v) {
      //   return v;
      // }).ofObject("SHAPE"),
      new go.Binding("text", "text").makeTwoWay(), new go.Binding("stroke", "textStroke").makeTwoWay(), new go.Binding("font", "font").makeTwoWay()), $(go.Panel, "Vertical", { alignment: go.Spot.Left, alignmentFocus: go.Spot.Right }, $(go.Shape, {
        name: "ICON",
        width: 16,
        height: 16,
        visible: false,
        click: function click(e) {
          console.log("icon click");
        },
        figure: "Circle",
        fill: "red",
        strokeWidth: 0,
        margin: 3
      }, new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify), new go.Binding("figure", "figure").makeTwoWay(), new go.Binding("visible", "iconVisible").makeTwoWay(), new go.Binding("fill", "fill", function (v, obj) {
        return v;
      }).makeTwoWay())), $(go.Shape, "Rectangle", {
        name: "textBorder",
        stroke: "green",
        strokeWidth: 3,
        strokeDashArray: [10, 5],
        visible: false,
        fill: "transparent",
        alignment: go.Spot.Center,
        // alignmentFocus: go.Spot.Right,
        width: 100,
        height: 270
      }, new go.Binding("stroke", "textStroke"), new go.Binding("desiredSize", "", function (v, d) {
        // console.log("vvvvvvvvvvvvv,",v,d)
        if (!helpers.checkPhone()) {
          // return new go.Size(Math.max(d.part.naturalBounds.width,100)-3, Math.max(d.part.naturalBounds.height,100)-3);
          return new go.Size(d.part.naturalBounds.width - 3, d.part.naturalBounds.height - 3);
        }
        var olive = d.part.diagram.findNodeForKey(d.part.data.olive);
        return new go.Size(olive.naturalBounds.width - 3, olive.naturalBounds.height);
        // return new go.Size(d.part.actualBounds.width-3, d.part.actualBounds.height-3);
      })), $(go.Shape, "Circle", {
        name: "place",
        stroke: "red",
        strokeWidth: 1,
        strokeDashArray: null,
        visible: false,
        fill: "transparent",
        alignment: go.Spot.Center,
        // alignmentFocus: go.Spot.Right,
        width: 50,
        height: 50
      }, new go.Binding("stroke", "placeStroke")), $(go.Shape, {
        geometryString: "M540.5696 556.81024a81.8176 81.8176 0 0 1-53.0432-19.47648l-225.4848-191.52896a81.92 81.92 0 1 1 106.0864-124.86656l172.4416 146.47296 172.4416-146.47296a81.92 81.92 0 0 1 106.0864 124.86656l-225.4848 191.52896a81.7152 81.7152 0 0 1-53.0432 19.47648z m53.06368 246.23104l225.44384-191.52896a81.92 81.92 0 1 0-106.0864-124.84608l-172.40064 146.47296-172.48256-146.47296a81.92 81.92 0 1 0-106.04544 124.86656l225.52576 191.52896a81.7152 81.7152 0 0 0 53.00224 19.47648c18.88256 0 37.76512-6.49216 53.0432-19.49696z",
        // "M16 0c-8.837 0-16 7.163-16 16s7.163 16 16 16 16-7.163 16-16-7.163-16-16-16zM16 29c-7.18 0-13-5.82-13-13s5.82-13 13-13 13 5.82 13 13-5.82 13-13 13zM12 8c-1.105 0-2 0.895-2 2s0.895 2 2 2h5.172l-8.586 8.586c-0.781 0.781-0.781 2.047 0 2.829 0.39 0.39 0.902 0.586 1.414 0.586s1.024-0.195 1.414-0.586l8.586-8.586v5.172c0 1.105 0.895 2 2 2s2-0.895 2-2v-12h-12z",
        visible: false,
        name: "figure",
        cursor: "pointer",
        alignment: new go.Spot(1, 0, 5, -5),
        alignmentFocus: go.Spot.RightCenter,
        width: 14,
        height: 14,
        fill: "green",
        toolTip: $("ToolTip", $(go.Panel, "Vertical", $(go.Picture, new go.Binding("source", "src", function (s) {
          return "images/" + s + ".png";
        })), $(go.TextBlock, { text: "进入子盘", margin: 3 }))),
        click: function click(e) {
          console.log("click figure", e);
          var node = e.targetObject.part;
          e.diagram.__trtd.openFigure({
            figure: node.data.figure,
            title: node.data.text,
            key: node.data.key,
            node: node
          });
        }
      },
      // new go.Binding("geometry", "geo", function(){

      // })),
      new go.Binding("visible", "figure", function (v) {
        console.log("----------------------");
        if (v) {
          return true;
        } else {
          return false;
        }
      })));
    }
  }]);

  return AutoTextTemplate;
}(Base);

module.exports = AutoTextTemplate;

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var $ = go.GraphObject.make;
var Base = __webpack_require__(1);
var helpers = __webpack_require__(0);
// var labelGroupLayout = require("../layout/labelGroupLayout")

var LabelGroupNodeTemplate = function (_Base) {
  _inherits(LabelGroupNodeTemplate, _Base);

  function LabelGroupNodeTemplate(options) {
    _classCallCheck(this, LabelGroupNodeTemplate);

    return _possibleConstructorReturn(this, (LabelGroupNodeTemplate.__proto__ || Object.getPrototypeOf(LabelGroupNodeTemplate)).call(this, options));
    // this.nodeProperties = {}
  }

  _createClass(LabelGroupNodeTemplate, [{
    key: 'switchBorder',
    value: function switchBorder(group, flag) {
      // group.diagram.startTransaction()
      // group.findObject("groupBorder").opacity = flag?1:0;
      group.findObject("groupBorder").opacity = flag ? 1 : 0;
      // group.diagram.commitTransaction()
    }
  }, {
    key: 'hiddenAllText',
    value: function hiddenAllText(group) {
      // console.log("hiddenAllTexthiddenAllTexthiddenAllText")
      group.diagram.startTransaction();
      var it = group.findSubGraphParts().iterator;
      var oldStatus = null;
      while (it.next()) {
        var n = it.value;
        if (oldStatus == null) {
          oldStatus = n.visible;
        }
        if (n.data.category == "autoText") {
          group.diagram.model.setDataProperty(n.data, "visible", !oldStatus);
        }
      }
      group.diagram.commitTransaction();
    }
  }, {
    key: 'addLabelText',
    value: function addLabelText(e, node) {

      var data = { "text": "说明：内容",
        "deletable": true,
        "fill": "black",
        "iconVisible": true,
        "locationSpot": "0 0 0 0",
        "textAlign": "start",
        "category": "autoText",
        "loc": node.location.x + 30 + ' ' + node.location.y,
        "movable": false, "group": node.data.key
      };
      this.diagram.startTransaction("addLabelText");
      this.diagram.model.addNodeData(data);
      this.diagram.commitTransaction("addLabelText");
    }
  }, {
    key: 'getNodeTemplate',
    value: function getNodeTemplate() {
      var that = this;
      return $(go.Group, "Spot", {
        __trtdNode: that,
        // copyable: false,
        // selectionObjectName: "groupBorder",
        layerName: "default",
        locationObjectName: "groupBorder",
        zOrder: 5,
        // margin:30,
        // padding:30,
        background: "rgba(0,0,0,0)",
        rotatable: false,
        minSize: new go.Size(200, 100),
        locationSpot: go.Spot.Center,
        toolTip: // define a tooltip for each node that displays the color as text
        $("ToolTip", $(go.TextBlock, { margin: 4 }, new go.Binding("text", "", function (data, p) {
          // console.log("tooltip:",p,data)
          return "双击显示/隐藏";
        }))), // end of Adornment
        // rotationSpot: go.Spot.LeftCenter,
        // alignment: go.Spot.Left,
        // alignmentFocus: go.Spot.Left,
        // rotateObject:"PH",
        click: function click(e, node) {
          console.log(node.data);
        },
        selectable: true,
        // selectionAdornmentTemplate: this.getNodeSelectionAdornmentTemplate(),
        doubleClick: function doubleClick(e, node) {
          // that.addLabelText(e, node)
          that.hiddenAllText(node);
          that.switchBorder(node, false);
          // that.diagram.clearSelection();
        },
        // rotatable: true,
        mouseOver: function mouseOver(e, node) {
          // console.log("211111")
          // if(node.data.hyperlink){
          //   var textObj = node.findObject('TEXT');
          //   textObj.isUnderline = true;
          // }
          // if(node.data.text == ""){
          // if(group.findObject("groupBorder").visible){
          that.switchBorder(node, true);
          // }
          // node.background = "rgba(125,125,125,0.01)"
          // }

          if (!node.containingGroup) return;
          var it = node.containingGroup.findSubGraphParts().iterator;
          node.diagram.startTransaction();
          while (it.next()) {
            var n = it.value;
            if (n.data.category == "autoText") {
              if (n.data.role && n.data.role.indexOf("labelText") > -1) {
                // locateNode = n;
                n.diagram.model.setDataProperty(n.data, "minSize", "120 30");
                // n.areaBackground = "mediumslateblue"
              }
            }
          }
          node.diagram.commitTransaction();
          // diagram.__trtd.showNodeRemarkTips(e, node);
        },
        mouseLeave: function mouseLeave(e, node) {
          // if(node.data.text == ""){
          // node.background = "rgba(0,0,0,0)"
          that.switchBorder(node, false);
          // }
        },
        // resizable: true,
        // layoutConditions: go.Part.LayoutStandard,
        layoutConditions: go.Part.LayoutStandard & go.Part.LayoutRemoved & go.Part.LayoutAdded & go.Part.LayoutNodeSized,
        // layout: new waveGroupLayout()
        layout: $(go.GridLayout, {
          isInitial: false,
          isOngoing: false,
          spacing: new go.Size(0, 0),
          cellSize: go.Size.parse(300, 150),
          arrangement: go.GridLayout.LeftToRight,
          wrappingColumn: 1,
          isRealtime: false,
          alignment: go.GridLayout.Location
          // comparer:function(pa, pb) {
          //   var da = pa.data;
          //   var db = pb.data;
          //   if (da.order < db.order) return -1;
          //   if (da.order > db.order) return 1;
          //   return 0;
          // }
        })
      }, new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify), new go.Binding("angle", "angle").makeTwoWay(function (v, data) {

        return v;
      }), new go.Binding("isShadowed", "isShadowed").makeTwoWay(), new go.Binding("copyable", "copyable").makeTwoWay(), new go.Binding("movable", "movable").makeTwoWay(), new go.Binding("deletable", "deletable").makeTwoWay(), $(go.Placeholder, // represents the area of all member parts,
      { padding: 30,
        alignment: go.Spot.Center,
        // stroke: "blue",
        // strokeWidth: 2,
        name: "placeholder"
      }), // with some extra padding around them
      // $(go.Shape,  // using a Shape instead of a Placeholder
      //   { name: "PH",
      //   figure:"Rectangle",
      //   // rotationSpot: go.Spot.LeftCenter,
      //   // spot1: new go.Spot(0.01, 0.01),
      //   // spot2: new go.Spot(0.99, 0.99),
      //   // areaBackground: "red",
      //     // width: 600,
      //     // height:300,
      //     stroke:"blue" ,
      //     strokeWidth: 2,
      //     fill: "rgba(0,0,0,0)" 
      //   },
      // ),

      // new go.Binding("width", "width").ofObject("")
      $(go.Shape, "Rectangle", {
        name: "groupBorder",
        stroke: "green",
        strokeWidth: 3,
        strokeDashArray: [10, 5],
        visible: true,
        opacity: 0,
        // margin:30,
        fill: null,
        alignment: go.Spot.Center,
        alignmentFocus: go.Spot.Center
        // width:200,
        // height:150, 
      },
      // new go.Binding("width","width").ofObject("placeholder"),
      // new go.Binding("height","height").ofObject("placeholder"),
      new go.Binding("desiredSize", "", function (v, d) {
        // console.log("vvvvvvvvvvvvv,",v,d)
        // if(d.part.placeholder.measuredBounds.width < 200){
        //   return new go.Size(200,200)
        // }
        // var width = Math.max(d.part.placeholder.measuredBounds.width, 200)
        // var height = Math.max(d.part.placeholder.measuredBounds.height, 200)
        return new go.Size(d.part.measuredBounds.width - 3, d.part.measuredBounds.height - 3);
        // return d.part.placeholder.actualBounds;
      }).ofObject(""))

      // $(go.TextBlock,  // group title
      //   { font: "Bold 12pt Sans-Serif" },
      //   new go.Binding("text", "key")
      // )
      );
    }
  }]);

  return LabelGroupNodeTemplate;
}(Base);

module.exports = LabelGroupNodeTemplate;

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var $ = go.GraphObject.make;
var Base = __webpack_require__(1);
var helpers = __webpack_require__(0);

var PicNodeTemplate = function (_Base) {
    _inherits(PicNodeTemplate, _Base);

    function PicNodeTemplate(options) {
        _classCallCheck(this, PicNodeTemplate);

        return _possibleConstructorReturn(this, (PicNodeTemplate.__proto__ || Object.getPrototypeOf(PicNodeTemplate)).call(this, options));
        // this.nodeProperties = {}
    }

    _createClass(PicNodeTemplate, [{
        key: 'getNodeSelectionAdornmentTemplate',
        value: function getNodeSelectionAdornmentTemplate() {
            return $(go.Adornment, "Spot", $(go.Panel, "Auto", $(go.Shape, { fill: null, stroke: "dodgerblue", strokeWidth: 1 }), $(go.Placeholder) // this represents the selected Node

            ),
            //$("TreeExpanderButton",
            $(go.Panel, "Vertical", {
                name: "ButtonIcon1",
                alignment: new go.Spot(0, 1, -20, 20),
                alignmentFocus: go.Spot.Center,
                width: 60,
                height: 60,
                isActionable: true
                // click: interactions.expandCollapse // this function is defined below
            }, $(go.Shape, "Circle", {
                fill: "rgba(1,1,1,0)",
                strokeWidth: 0,
                stroke: "green",
                width: 50,
                height: 50
            }))); // end Adornment;
        }
    }, {
        key: 'nodeResizeAdornmentTemplate',
        value: function nodeResizeAdornmentTemplate() {
            return $(go.Adornment, "Spot", $(go.Placeholder), // takes size and position of adorned object
            $(go.Shape, "Circle", // left resize handle
            {
                alignment: go.Spot.TopLeft,
                alignmentFocus: go.Spot.BottomRight,
                cursor: "col-resize",
                desiredSize: new go.Size(30, 30),
                fill: "lightblue",
                stroke: "dodgerblue"
            }), $(go.Shape, "Circle", // right resize handle
            {
                alignment: go.Spot.BottomRight,
                alignmentFocus: go.Spot.TopLeft,
                cursor: "col-resize",
                desiredSize: new go.Size(30, 30),
                fill: "lightblue",
                stroke: "dodgerblue"
            }));
        }
    }, {
        key: 'getNodeTemplate',
        value: function getNodeTemplate() {
            var diagram = this.diagram;
            var that = this;
            return $(go.Node, "Spot", _defineProperty({
                name: "NODE",
                "_controlExpand": true,
                layerName: "Background",
                locationSpot: go.Spot.BottomLeft,
                resizeCellSize: new go.Size(10, 10),
                locationObjectName: "SHAPE",
                resizable: true,
                resizeObjectName: "SHAPE", // user can resize the Shape
                rotatable: true,
                rotateObjectName: "SHAPE", // rotate the Shape without rotating the label
                doubleClick: function doubleClick(e, node) {
                    // interactions.selectText(e, node)
                    console.log(node.data);
                    if (node.diagram.__trtd.nodeDoubleClickListener) {
                        node.diagram.__trtd.nodeDoubleClickListener(node);
                    }
                },
                click: function click(e, node) {
                    console.log(node.data);
                    if (node.diagram.__trtd.nodeClickListener) {
                        node.diagram.__trtd.nodeClickListener(node);
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
                resizeAdornmentTemplate: that.nodeResizeAdornmentTemplate(),
                //rotateAdornmentTemplate: nodeRotateAdornmentTemplate,
                contextMenu: diagram.__trtd.nodeContextMenu,
                selectionAdornmentTemplate: that.getNodeSelectionAdornmentTemplate()
            }, 'contextMenu', $(go.Adornment)), new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify), new go.Binding("isShadowed", "isShadowed").makeTwoWay(), new go.Binding("selectable", "selectable").makeTwoWay(), new go.Binding("movable", "movable").makeTwoWay(), new go.Binding("resizable", "resizable").makeTwoWay(), new go.Binding("deletable", "deletable").makeTwoWay(), new go.Binding("layerName", "layerName", function (v, d) {
                return v ? v : "";
            }).makeTwoWay(function (v) {
                return v;
            }),
            // $(go.TextBlock, // the text label
            //     new go.Binding("text", "text")),
            $(go.Picture, // the icon showing the logo
            // You should set the desiredSize (or width and height)
            // whenever you know what size the Picture should be.

            { name: "SHAPE",
                width: 400,
                height: 400
            }, {
                successFunction: function successFunction(pict, evt) {
                    if ((!pict.width || !pict.height) && (!pict.part.data.width || !pict.part.data.height)) {
                        pict.width = pict.element.width;
                        pict.height = pict.element.height;
                    }
                }
            }, {
                sourceCrossOrigin: function sourceCrossOrigin(pict) {
                    return "";
                }
            }, new go.Binding("source", "picture", function (v) {

                return v + "?" + Date.now();
            }).makeTwoWay(function (v) {
                if (v) {
                    v = v.replace(/\?.*$/g, "");
                    return v;
                } else {
                    return "";
                }
            }), new go.Binding("width", "width", function (v, d) {
                return v;
            }).makeTwoWay(function (v) {
                return v;
            }), new go.Binding("height", "height", function (v, d) {
                return v;
            }).makeTwoWay(function (v) {
                return v;
            }), new go.Binding("angle", "angle").makeTwoWay(), new go.Binding("opacity", "opacity", function (v, d) {
                return v ? parseFloat(v) : 1;
            }).makeTwoWay(function (v) {
                return v;
            })));
        }
    }]);

    return PicNodeTemplate;
}(Base);

module.exports = PicNodeTemplate;

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var $ = go.GraphObject.make;
var Base = __webpack_require__(1);
var helpers = __webpack_require__(0);

var PicGroupNodeTemplate = function (_Base) {
  _inherits(PicGroupNodeTemplate, _Base);

  function PicGroupNodeTemplate(options) {
    _classCallCheck(this, PicGroupNodeTemplate);

    // this.nodeProperties = {}
    var _this = _possibleConstructorReturn(this, (PicGroupNodeTemplate.__proto__ || Object.getPrototypeOf(PicGroupNodeTemplate)).call(this, options));

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
    _this.cbianThemes = [{
      name: "cbian1",
      type: "small",
      textStrokes: ["#0e399d", "#cb1c27", "#FFC000"],
      picture: "https://static.365trtd.com/system/cbian/cbian.png",
      offsets: offsetSmall,
      size: [150, 150],
      pictureBig: "https://static.365trtd.com/system/cbian/cbian1_big.png",
      offsetsBig: offsetBig,
      sizeBig: [500, 500]
    }, {
      name: "cbian_red",
      type: "small",
      textStrokes: ["red", "red", "red"],
      picture: "https://static.365trtd.com/system/cbian/cbian_red.png",
      offsets: offsetSmall,
      size: [150, 150],
      pictureBig: "https://static.365trtd.com/system/cbian/cbian_big_red.png",
      offsetsBig: offsetBig,
      sizeBig: [500, 500]
    }, {
      name: "cbian_blue",
      type: "small",
      textStrokes: ["blue", "blue", "blue"],
      picture: "https://static.365trtd.com/system/cbian/cbian_blue.png",
      offsets: offsetSmall,
      size: [150, 150],
      pictureBig: "https://static.365trtd.com/system/cbian/cbian_big_blue.png",
      offsetsBig: offsetBig,
      sizeBig: [500, 500]
    }, {
      name: "cbian_green",
      type: "small",
      textStrokes: ["green", "green", "green"],
      picture: "https://static.365trtd.com/system/cbian/cbian_green.png",
      offsets: offsetSmall,
      size: [150, 150],
      pictureBig: "https://static.365trtd.com/system/cbian/cbian_big_green.png",
      offsetsBig: offsetBig,
      sizeBig: [500, 500]
      // {
      //   name: "cbian1_big",
      //   type: "big",
      //   textStrokes: ["#0e399d", "#cb1c27", "#FFC000"],
      //   picture: "https://static.365trtd.com/system/cbian/cbian1_big.png",
      //   offsets: offsetBig,
      //   size:[500,500]
      // }
    }];
    return _this;
  }

  _createClass(PicGroupNodeTemplate, [{
    key: "changeCbianSize",
    value: function changeCbianSize(node, cbianType) {
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

      var nodeNameList = ["cbianText1", "cbianText2", "cbianText3", "axisXText", "axisYText"];
      for (var i = 0; i < nodeNameList.length; i++) {
        var nodeName = nodeNameList[i];
        var tmpPoint, tmpNode;
        tmpNode = eval(nodeName);
        tmpPoint = theme[propertyoffset][nodeName];
        if (cbianText1 && tmpPoint) {
          tmpPoint = go.Point.parse(tmpPoint);
          diagram.model.setDataProperty(tmpNode.data, "loc", go.Point.stringify(baseNode.location.copy().offset(tmpPoint.x, tmpPoint.y)));
        }
      }
      diagram.model.commitTransaction();
    }
  }, {
    key: "changeCbianName",
    value: function changeCbianName(node, cbianName) {
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
        diagram.model.setDataProperty(cbianText1.data, "textStroke", theme.textStrokes[0]);
      }
      if (cbianText2) {
        diagram.model.setDataProperty(cbianText2.data, "textStroke", theme.textStrokes[1]);
      }
      if (cbianText3) {
        diagram.model.setDataProperty(cbianText3.data, "textStroke", theme.textStrokes[2]);
      }
      diagram.model.commitTransaction();
    }
  }, {
    key: "getNodeSelectionAdornmentTemplate",
    value: function getNodeSelectionAdornmentTemplate() {
      return $(go.Adornment, "Spot", $(go.Panel, "Auto", $(go.Shape, { fill: null, stroke: "dodgerblue", strokeWidth: 1 }), $(go.Placeholder) // this represents the selected Node
      ),
      //$("TreeExpanderButton",
      $(go.Panel, "Vertical", {
        name: "ButtonIcon1",
        alignment: new go.Spot(0, 1, -20, 20),
        alignmentFocus: go.Spot.Center,
        width: 60,
        height: 60,
        isActionable: true
        // click: interactions.expandCollapse // this function is defined below
      }, $(go.Shape, "Circle", {
        fill: "rgba(1,1,1,0)",
        strokeWidth: 0,
        stroke: "green",
        width: 50,
        height: 50
      }))); // end Adornment;
    }
  }, {
    key: "nodeResizeAdornmentTemplate",
    value: function nodeResizeAdornmentTemplate() {
      return $(go.Adornment, "Spot", $(go.Placeholder), // takes size and position of adorned object
      $(go.Shape, "Circle", // left resize handle
      {
        alignment: go.Spot.TopLeft,
        alignmentFocus: go.Spot.BottomRight,
        cursor: "col-resize",
        desiredSize: new go.Size(30, 30),
        fill: "lightblue",
        stroke: "dodgerblue"
      }), $(go.Shape, "Circle", // right resize handle
      {
        alignment: go.Spot.BottomRight,
        alignmentFocus: go.Spot.TopLeft,
        cursor: "col-resize",
        desiredSize: new go.Size(30, 30),
        fill: "lightblue",
        stroke: "dodgerblue"
      }));
    }
  }, {
    key: "addFreeText",
    value: function addFreeText(e, node) {
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
  }, {
    key: "getNodeTemplate",
    value: function getNodeTemplate() {
      var diagram = this.diagram;
      var that = this;
      return $(go.Group, "Auto", {
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
        click: function click(e, node) {
          console.log(node.data);
        },
        layout: $(go.Layout),
        doubleClick: function doubleClick(e, node) {
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
        layoutConditions: go.Part.LayoutStandard & go.Part.LayoutRemoved & go.Part.LayoutAdded & go.Part.LayoutNodeSized
      }, new go.Binding("location", "loc", function (v) {
        // console.log("go.Point.parsego.Point.parsego.Point.parse")
        return go.Point.parse(v);
      }).makeTwoWay(go.Point.stringify), new go.Binding("angle", "angle").makeTwoWay(function (v, data) {
        return v;
      }), new go.Binding("isShadowed", "isShadowed").makeTwoWay(), new go.Binding("selectable", "selectable").makeTwoWay(), new go.Binding("movable", "movable").makeTwoWay(), new go.Binding("deletable", "deletable").makeTwoWay(), new go.Binding("layerName", "layerName").makeTwoWay(), $(go.Placeholder, // represents the area of all member parts,
      { padding: 30, alignment: go.Spot.Center, name: "placeholder" }) // with some extra padding around them
      );
    }
  }]);

  return PicGroupNodeTemplate;
}(Base);

module.exports = PicGroupNodeTemplate;

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var $ = go.GraphObject.make;
var Base = __webpack_require__(1);
var helpers = __webpack_require__(0);
var yunGroupLayout = __webpack_require__(25);

var YunNodeTemplate = function (_Base) {
  _inherits(YunNodeTemplate, _Base);

  function YunNodeTemplate(options) {
    _classCallCheck(this, YunNodeTemplate);

    // this.nodeProperties = {}
    var _this = _possibleConstructorReturn(this, (YunNodeTemplate.__proto__ || Object.getPrototypeOf(YunNodeTemplate)).call(this, options));

    _this.defaultTextFont = "20px 'Microsoft YaHei'";

    return _this;
  }

  _createClass(YunNodeTemplate, [{
    key: 'snapToGrid',
    value: function snapToGrid(data, node) {

      if (data.subRole == "coreText" || data.subRole == "themeText") {
        return;
      }
      var p = go.Point.parse(data.loc);
      if (node.__yunPointsX && node.__yunPointsY) {
        if (p.x >= node.__yunPointsX[0] && p.x <= node.__yunPointsX[node.__yunPointsX.length - 1] && p.y >= node.__yunPointsY[node.__yunPointsY.length - 1] && p.y <= node.__yunPointsY[0]) {
          // 在画布格子范围内的位置才对齐网格
          var minX = 20000,
              minY = 20000,
              tmp,
              orderX,
              orderY;
          for (var i = 0; i < node.__yunPointsX.length; i++) {
            tmp = Math.abs(p.x - node.__yunPointsX[i]);
            if (tmp < minX) {
              minX = tmp;
              orderX = i + 1;
            }
          }
          for (var i = 0; i < node.__yunPointsY.length; i++) {
            tmp = Math.abs(p.y - node.__yunPointsY[i]);
            if (tmp < minY) {
              minY = tmp;
              orderY = i + 1;
            }
          }

          if (orderX != null && orderY != null) {
            // var x = node.__yunPointsX[orderX-1]
            // var y = node.__yunPointsX[orderY-1]
            // x = -1300
            // y = -1300
            // data.loc = "-1688.105387366997 -121.19730986224602"
            data.orderX = orderX;
            data.orderY = orderY;
          }
        } else {
          delete data.orderX;
          delete data.orderY;
        }
      }
    }
  }, {
    key: 'addFreeText',
    value: function addFreeText(e, node) {
      console.log("addFreeTextaddFreeText begin", e);
      var gridWidth = node.data.gridWidth;
      var p = e.documentPoint;
      var that = this;
      var data = { "text": "灵感",
        "deletable": true,
        "role": "freeText",
        "fill": "black",
        "iconVisible": false,
        "locationSpot": "0.5 0.5 0 0",
        "minSize": '30 30',
        // "width":`${gridWidth-10}`,
        font: that.defaultTextFont,
        "textAlign": "center",
        "category": "autoText",
        "loc": go.Point.stringify(p),
        "movable": true, "group": node.data.key
        //  console.log()


      };this.snapToGrid(data, node);
      this.diagram.startTransaction("addFreeText");
      this.diagram.model.addNodeData(data);
      this.diagram.commitTransaction("addFreeText");
      node.layout.isValidLayout = false;
      console.log("addFreeTextaddFreeText end", e);
    }
  }, {
    key: 'getNodeTemplate',
    value: function getNodeTemplate() {
      var that = this;
      return $(go.Group, "Auto", { selectionObjectName: "PH",
        __trtdNode: that,
        layerName: "default",
        padding: 0,
        margin: 0,
        copyable: true,
        zOrder: 15,
        locationObjectName: "PH",
        locationSpot: new go.Spot(0, 1, 0, -0),
        // rotationSpot: go.Spot.LeftCenter,
        rotatable: false,
        alignment: go.Spot.Left,
        alignmentFocus: go.Spot.Left,
        // rotateObject:"PH",
        click: function click(e, node) {
          console.log(node.data);
          var it = node.findSubGraphParts().iterator;
          while (it.next()) {
            var n = it.value;
            if (n.data.category == "autoText") {
              n.findObject("textBorder").visible = false;
            }
          }
          node.layout.isValidLayout = false;
          return;
          if (node.isSelected) return;
          var it = node.findSubGraphParts().iterator;
          var n;
          while (it.next()) {
            n = it.value;
            if (n.data.role == "labelGroup") {
              n.__trtdNode.switchBorder(n, true);
              break;
            }
          }
          if (n) {
            setTimeout(function () {
              n.__trtdNode.switchBorder(n, false);
            }, 3000);
          }
        },
        doubleClick: function doubleClick(e, node) {
          that.addFreeText(e, node);
        },
        mouseOver: function mouseOver(e, node) {
          // if(node.data.hyperlink){
          //   var textObj = node.findObject('TEXT');
          //   textObj.isUnderline = true;
          // }
          // if(!node.containingGroup) return;
          return;
          // diagram.__trtd.showNodeRemarkTips(e, node);
        },
        contextMenu: $(go.Adornment),
        mouseLeave: function mouseLeave(e, node) {
          // if(!node.containingGroup) return;
          var it = node.findSubGraphParts().iterator;
          while (it.next()) {
            var n = it.value;
            if (n.data.role == "labelGroup") {
              // n.__trtdNode.switchBorder(n, false)
              break;
            }
          }
          // if(n){
          //   setTimeout(function(){
          //     n.__trtdNode.switchBorder(n, false)
          //   },3000)
          // }
        },
        // rotatable: true,
        // resizable: true,
        // layoutConditions: go.Part.LayoutStandard,
        layoutConditions: go.Part.LayoutStandard & go.Part.LayoutRemoved & go.Part.LayoutAdded & go.Part.LayoutNodeSized,
        layout: new yunGroupLayout()
        // layout: $(go.GridLayout,{
        //   spacing: new go.Size(0,0),
        //   cellSize: go.Size.parse(300,150),
        //   arrangement:go.GridLayout.LeftToRight,
        //   alignment: go.GridLayout.Location,
        //   comparer:function(pa, pb) {
        //     var da = pa.data;
        //     var db = pb.data;
        //     if (da.order < db.order) return -1;
        //     if (da.order > db.order) return 1;
        //     return 0;
        //   }
        // }) 
      }, new go.Binding("deletable", "deletable").makeTwoWay(function (v, data) {
        return v;
      }), new go.Binding("copyable", "copyable").makeTwoWay(), new go.Binding("angle", "angle").makeTwoWay(function (v, data) {
        return v;
      }), new go.Binding("zOrder", "zOrder").makeTwoWay(function (v, data) {
        return v;
      }), new go.Binding("locationSpot", "", function (data) {
        // console.log("data:",data)
        return new go.Spot(0, 1, data.gridWidth, -data.gridHeight);
      }), $(go.Shape, // using a Shape instead of a Placeholder
      { name: "PH",
        figure: "Rectangle",
        // rotationSpot: go.Spot.LeftCenter,
        // spot1: new go.Spot(0.01, 0.01),
        // spot2: new go.Spot(0.99, 0.99),
        // width: 600,
        // height:300,
        stroke: "yellow",
        strokeWidth: 0,
        fill: "rgba(0,0,255,0.0)" }
      // new go.Binding("desiredSize", "desiredSize", function(v,data){
      //   return go.Size.parse(v)
      //   console.log('1111111111111111111111')
      //   // for(var i=0;i<)
      //   var model = data.part.diagram.model;
      //   var group = data.part.data;
      //   var maxWidth = 0;
      //   var maxHeight = 0;
      //   for(var i = 0;i<model.nodeDataArray.length;i++){
      //     if(group.key != model.nodeDataArray[i].group){
      //       continue;
      //     }
      //     if(model.nodeDataArray[i].desiredSize){
      //       console.log(model.nodeDataArray[i].desiredSize)
      //       var size = go.Size.parse(model.nodeDataArray[i].desiredSize)
      //       if(size.width > maxWidth){
      //         maxWidth = size.width;
      //       }
      //       if(size.height > maxHeight){
      //         maxHeight = size.height;
      //       }
      //     }
      //   }
      //   // var group = that.diagram.findNodeForKey(data.part.data.key)
      //   // var git = group.memberParts;
      //   // var maxWidth = 0;
      //   // var maxHeight = 0;
      //   // while (git.next()) {
      //   //   var item = git.value;
      //   //   console.log("item:",item)
      //   //   if(item.naturalBounds.width > maxWidth){
      //   //     maxWidth = item.naturalBounds.width;
      //   //   }
      //   //   if(item.naturalBounds.height > maxHeight){
      //   //     maxHeight = item.naturalBounds.height;
      //   //   }
      //   //   console.log(`maxHeight:${maxHeight},maxWidth:${maxWidth}`)

      //   // }           
      //   return go.Size.parse(`${maxWidth+100} ${maxHeight}`)         
      //   // group.diagram.model.setDataProperty(group.data, "desiredSize", `${maxWidth+100} ${maxHeight}`) 
      // }).makeTwoWay(go.Size.stringify)
      ), new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify)
      // $(go.Placeholder,    // represents the area of all member parts,
      //   { padding: 0}
      // ),  // with some extra padding around them

      // $(go.TextBlock,  // group title
      //   { font: "Bold 12pt Sans-Serif" },
      //   new go.Binding("text", "key")
      // )
      );
    }
  }]);

  return YunNodeTemplate;
}(Base);

module.exports = YunNodeTemplate;

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// define a custom grid layout that makes sure the length of each lane is the same
// and that each lane is broad enough to hold its subgraph
function YunGroupLayout() {
  go.Layout.call(this);
  // go.GridLayout.call(this);
  // this.cellSize = new go.Size(1, 1);
  // this.wrappingColumn = Infinity;
  // this.wrappingWidth = Infinity;
  // this.spacing = new go.Size(0, 0);
  // this.alignment = go.GridLayout.Position;
}
go.Diagram.inherit(YunGroupLayout, go.Layout);

function computeNewRotateLoc(rotateCenter, currentLoc, angle) {
  if (rotateCenter.equals(currentLoc)) return currentLoc;
  // 计算选择中心点到（0,0）点的偏移
  var offset = new go.Point(0, 0).subtract(rotateCenter.copy());
  // 将原来的点偏移到相对0,0点的位置
  var nodeOrigin = currentLoc.copy().offset(offset.x, offset.y);
  var newNodeOrigin = nodeOrigin.rotate(angle);
  var newNodeLoc = newNodeOrigin.copy().offset(-offset.x, -offset.y);
  return newNodeLoc;
  // console.log("newNodeLoc", newNodeLoc)
}
YunGroupLayout.prototype.doLayout = function (coll) {
  console.log("YunGroupLayout.doLayout");
  var diagram = this.diagram;
  diagram.startTransaction("YunGroupLayout");
  // COLL might be a Diagram or a Group or some Iterable<Part>

  var it = this.collectParts(coll).iterator;
  var collection = [];
  var dataCollection = [];
  var group = this.group;
  var gridWidth = group.data.gridWidth;
  var gridHeight = group.data.gridHeight;
  // group.location = new go.Point(0,0)
  var maxWidth = 0;
  var maxHeight = 0;
  var centerLine, axisX, axisY, axisXText, axisYText, themeText, labelText1, labelText2, labelText3, labelGroup, waveGroup;
  var shiTextColl = [];
  var xuTextColl = [];
  var verticalLines = [];
  var horizontalLines = [];
  var freelLines = [];
  var allLines = [];
  var freeTexts = [];
  var shapeNodes = [];
  var snapType = group.data.snapType || "grid";
  var showShape = group.data.showShape; // 是否显示矩形
  var beginSpark = group.data.beginSpark; // 是否开始火花
  var shapeStrokes = group.data.shapeStrokes; // 是否开始火花
  var oliveWidth;
  var oliveHeight;
  while (it.next()) {
    var node = it.value;
    // var item = git.value;
    //   console.log("item:",item)

    dataCollection.push(node.data);
    if (node.data.category == "wave") {
      collection.push(node);
    }
    if (!(node instanceof go.Node)) {
      continue;
    }

    if (node.data.role == "background") {
      shapeNodes.push(node);
    }
    // 处理文本节点的位置和定位位置
    // if(node.data.category == "text"){
    if (node.data.role == "axisYText") {
      axisYText = node;
    }
    if (node.data.role == "axisXText") {
      axisXText = node;
    }
    if (node.data.role == "themeText") {
      themeText = node;
    }
    if (node.data.role == "shiText") {
      shiTextColl.push(node);
    }
    if (node.data.role == "xuText") {
      xuTextColl.push(node);
    }
    // }
    // 处理label文本节点的位置和定位位置
    // if(node.data.category == "iconText"){
    if (node.data.role == "labelText1") {
      labelText1 = node;
    }
    if (node.data.role == "labelText2") {
      labelText2 = node;
    }
    if (node.data.role == "labelText3") {
      labelText3 = node;
    }
    if (node.data.role == "labelGroup") {
      labelGroup = node;
    }
    // }

    if (node.naturalBounds.width > maxWidth) {
      maxWidth = node.naturalBounds.width;
    }
    if (node.naturalBounds.height > maxHeight) {
      maxHeight = node.naturalBounds.height;
    }

    if (node.data.role == "freeText") {
      freeTexts.push(node);
    }
    if (node.data.category == "line") {
      allLines.push(node);
      if (node.data.role == "verticalLine") {
        verticalLines.push(node);
      }
      if (node.data.role == "horizontalLine") {
        horizontalLines.push(node);
      }
      if (node.data.role == "freelLine") {
        freelLines.push(node);
      }
    }
    if (node.data.group == group.key) {
      // position the node . . .
      if (node.data.category == "line") {
        if (node.data.role == "axisX") {
          node.angle = 0;
          axisX = node;
          node.location = group.location.copy().offset(0, 0);
        }
        if (node.data.role == "axisY") {
          axisY = node;
          node.angle = 270;
          node.location = group.location.copy().offset(0, 0);
        }
        // node.angle = 270
      }
      // if(node.data.category == "waveGroup"){
      //     waveGroup = node;
      //     // node.angle = group.angle
      //     oliveWidth = node.data.oliveWidth
      //     oliveHeight = node.data.oliveHeight
      //     node.location = group.location.copy().offset(0,0)
      //     // node.layout.isOngoing = true;
      //     // node.layout.isValidLayout = false;
      //     // collection.push(node)
      // }
    }
  }
  console.log("maxHeight:" + maxHeight + ",maxWidth:" + maxWidth);

  verticalLines.sort(function (a, b) {
    return a.data.order - b.data.order;
  });
  horizontalLines.sort(function (a, b) {
    return a.data.order - b.data.order;
  });
  freelLines.sort(function (a, b) {
    return a.data.order - b.data.order;
  });

  if (snapType == "between") {
    var x1 = verticalLines.length * gridWidth + gridWidth;
    var x2 = horizontalLines.length * gridHeight + gridHeight;
  } else {
    var x1 = verticalLines.length * gridWidth;
    var x2 = horizontalLines.length * gridHeight;
  }

  var allPointsX = [];
  var allPointsY = [];
  var centerOrderX = (horizontalLines.length + 1) / 2;
  var centerOrderY = (verticalLines.length + 1) / 2;
  allLines.forEach(function (obj, index) {
    // obj.diagram.model.setDataProperty(obj.data, "strokeWidth",1)
    // obj.diagram.model.setDataProperty(obj.data, "stroke","rgba(0,0,0,0.3)")
    if (obj.data.role == "axisX" || obj.data.role == "axisY") return;
    // if(obj.data.subRole == "dim"){
    //   obj.diagram.model.setDataProperty(obj.data, "strokeDashArray","[0, 0]")
    //   obj.diagram.model.setDataProperty(obj.data, "strokeWidth",3)
    //   obj.diagram.model.setDataProperty(obj.data, "stroke","RGBA(164, 177, 198, 1)")
    // }else{
    //   obj.diagram.model.setDataProperty(obj.data, "strokeDashArray","[15, 10]")
    //   obj.diagram.model.setDataProperty(obj.data, "strokeWidth",1)
    //   obj.diagram.model.setDataProperty(obj.data, "stroke","rgba(0,0,0,0.3)")
    // }
  });

  verticalLines.forEach(function (obj, index) {
    var newOrder = index + 1;
    obj.diagram.model.setDataProperty(obj.data, "order", newOrder);
    obj.location = group.location.copy().offset(gridWidth * newOrder, 0);
    obj.angle = 270;
    obj.diagram.model.setDataProperty(obj.data, "desiredSize", x2 + 20 + " 10");
    // obj.diagram.model.setDataProperty(obj.data, "showArrow",false)
    // obj.diagram.model.setDataProperty(obj.data, "selectable",false)
    if (snapType == "between") {
      if (newOrder < centerOrderX) {
        allPointsX.push(obj.location.x - gridWidth / 2);
      }
      if (newOrder == centerOrderX) {
        allPointsX.push(obj.location.x);
      }
      if (newOrder > centerOrderX) {
        allPointsX.push(obj.location.x + gridWidth / 2);
      }
    } else {
      allPointsX.push(obj.location.x);
    }

    // obj.diagram.model.setDataProperty(obj.data, "strokeWidth",1)
    // obj.diagram.model.setDataProperty(obj.data, "stroke","rgba(0,0,0,0.3)")
    // obj.diagram.model.setDataProperty(obj.data, "strokeDashArray","[10, 5]")
  });
  horizontalLines.forEach(function (obj, index) {
    var newOrder = index + 1;
    obj.diagram.model.setDataProperty(obj.data, "order", newOrder);
    obj.location = group.location.copy().offset(0, -gridHeight * newOrder);
    obj.angle = 0;
    obj.diagram.model.setDataProperty(obj.data, "desiredSize", x1 + 20 + " 10");
    // obj.diagram.model.setDataProperty(obj.data, "showArrow",false)
    // obj.diagram.model.setDataProperty(obj.data, "selectable",false)
    if (snapType == "between") {
      if (newOrder < centerOrderY) {
        allPointsY.push(obj.location.y + gridHeight / 2);
      }
      if (newOrder == centerOrderY) {
        allPointsY.push(obj.location.y);
      }
      if (newOrder > centerOrderY) {
        allPointsY.push(obj.location.y - gridHeight / 2);
      }
    } else {
      allPointsY.push(obj.location.y);
    }
    // obj.diagram.model.setDataProperty(obj.data, "strokeWidth",1)
    // obj.diagram.model.setDataProperty(obj.data, "stroke","rgba(0,0,0,0.3)")
    // obj.diagram.model.setDataProperty(obj.data, "strokeDashArray","[10, 5]")
  });
  // allPointsX.unshift(allPointsX[0]-gridWidth)
  // allPointsX.push(allPointsX[allPointsX.length-1]+gridWidth)
  // allPointsY.unshift(allPointsY[0]-gridLength)
  // allPointsY.push(allPointsY[allPointsY.length-1]+gridLength)
  this.group.__yunPointsX = allPointsX;
  this.group.__yunPointsY = allPointsY;
  freelLines.forEach(function (obj, index) {
    // var newOrder = index+1;
    // obj.diagram.model.setDataProperty(obj.data,"order", newOrder)
    // obj.location = new go.Point(allPointsX[9], allPointsY[9])
    // obj.angle = 315;
    // obj.diagram.model.setDataProperty(obj.data, "desiredSize",`${gridWidth*20-5} 10`)
    // obj.diagram.model.setDataProperty(obj.data, "showArrow",false)
    // obj.diagram.model.setDataProperty(obj.data, "selectable",true)
    // obj.diagram.model.setDataProperty(obj.data, "strokeWidth",1)
    // obj.diagram.model.setDataProperty(obj.data, "zOrder",10)
    // obj.diagram.model.setDataProperty(obj.data, "showArrow",true)
    // obj.diagram.model.setDataProperty(obj.data, "showBeginArrow",true)
    // obj.diagram.model.setDataProperty(obj.data, "showEndArrow",true)
    // obj.diagram.model.setDataProperty(obj.data, "locationSpot",`0.5 0.5 0 0`)
    // obj.diagram.model.setDataProperty(obj.data, "stroke","rgba(0,0,0,0.3)")
    // obj.diagram.model.setDataProperty(obj.data, "strokeDashArray","[5, 5]")
    // obj.diagram.model.setDataProperty(obj.data, "selectable",false)
  });

  shapeNodes.forEach(function (obj, index) {
    obj.diagram.model.setDataProperty(obj.data, "visible", true);
    if (!showShape) {
      obj.diagram.model.setDataProperty(obj.data, "stroke", "rgba(255,0,0,0)");
    } else {
      try {
        obj.diagram.model.setDataProperty(obj.data, "stroke", shapeStrokes[obj.data.gridWidth / 2 - 1]);
      } catch (e) {
        console.log(e);
      }
    }
    if (obj.data.desiredSize) {
      return;
    }
    obj.data.orderX = centerOrderX;
    obj.data.orderY = centerOrderY;
    obj.location = new go.Point(allPointsX[obj.data.orderX - 1], allPointsY[obj.data.orderY - 1]);
    var shapeWidth = obj.data.gridWidth || 2;
    if (snapType == "between") {
      var desiredSize = new go.Size(gridWidth * (shapeWidth - 1), gridHeight * (shapeWidth - 1));
      obj.diagram.model.setDataProperty(obj.data, "strokeWidth", gridWidth);
    } else {
      var desiredSize = new go.Size(gridWidth * shapeWidth + 3, gridHeight * shapeWidth + 3);
      obj.diagram.model.setDataProperty(obj.data, "strokeWidth", 3);
    }
    // obj.desiredSize = desiredSize;
    obj.diagram.model.setDataProperty(obj.data, "desiredSize", go.Size.stringify(desiredSize));
    // obj.diagram.model.setDataProperty(obj.data, "visible",true)
    obj.diagram.model.setDataProperty(obj.data, "strokeDashArray", "[0,0]");
  });

  // var dist = Math.max(gridHeight,gridWidth)
  freeTexts.forEach(function (obj, index) {
    // var newOrder = index+1;
    // obj.diagram.model.setDataProperty(obj.data,"order", newOrder)
    // obj.location = group.location.copy()
    // obj.angle = 315;
    // obj.diagram.model.setDataProperty(obj.data, "desiredSize",`${x1+20} 10`)
    // obj.diagram.model.setDataProperty(obj.data, "minSize",`60 50`)
    // obj.diagram.model.setDataProperty(obj.data, "width",`${gridWidth-10}`)
    // obj.diagram.model.setDataProperty(obj.data, "height",`${gridHeight-10}`)
    // obj.diagram.model.setDataProperty(obj.data, "width",`${gridWidth*3}`)
    // delete obj.data.width
    // obj.diagram.model.setDataProperty(obj.data, "textAlign",`center`)
    // obj.diagram.model.setDataProperty(obj.data, "locationSpot",`0.5 0.5 0 0`)
    // obj.diagram.model.setDataProperty(obj.data, "strokeDashArray","[10, 5]")
    // obj.diagram.model.setDataProperty(obj.data, "font", group.__trtdNode.defaultTextFont)

    // if(node.__yunPointsY && node.__yunPointsX){
    //       for(var i=0;i<allPointsX.length;i++){
    //         if(obj)
    //       }
    //    }
    // if(obj.data.text.indexOf("自由文本") >-1){
    //   console.log("ddd",obj.data.text)
    //   var order = obj.data.text.replace("自由文本","").split(",")
    //   if(order.length == 2){
    //     obj.data.orderX = order[0]
    //     obj.data.orderY = order[1]
    //     obj.location = new go.Point(allPointsX[obj.data.orderX-1], allPointsY[obj.data.orderY-1])
    //   }
    // }

    // if(obj.data.text.length == 1){
    //   if(obj.data.subRole == null){
    //     obj.diagram.model.setDataProperty(obj.data, "subRole","coreText")
    //     obj.diagram.model.setDataProperty(obj.data, "deletable", false)
    //   }
    // }

    // if(obj.data.text.indexOf("维度") >-1){
    //   console.log("ddd",obj.data.text)
    //   // var order = obj.data.text.replace("维度","").split(",")
    //   obj.diagram.model.setDataProperty(obj.data, "subRole","dimText")
    //   // obj.diagram.model.setDataProperty(obj.data, "dimKey", null)
    //   delete obj.data.dimKey
    //   obj.diagram.model.setDataProperty(obj.data, "deletable", false)
    //   // obj.diagram.model.setDataProperty(obj.data, "width", null)
    //   // obj.diagram.model.setDataProperty(obj.data, "height", null)
    // }
    obj.areaBackground = null;
    // obj.diagram.model.setDataProperty(obj.data, "height", null)
    // obj.diagram.model.setDataProperty(obj.data, "width", null)
    // obj.findObject("place").visible = false;
    // console.log("verticalLines.length+1)/2verticalLines.length+1)/2",(verticalLines.length+1)/2)
    if (group.data.autoSnapText) {
      // 计算普通文字位置
      if (obj.data.orderX && obj.data.orderY) {
        obj.location = new go.Point(allPointsX[obj.data.orderX - 1], allPointsY[obj.data.orderY - 1]);

        obj.location = new go.Point(allPointsX[obj.data.orderX - 1], allPointsY[obj.data.orderY - 1]);
      }
      // 计算维度文字位置
      if (obj.data.subRole == "dimText" && obj.data.dimX != null && obj.data.dimY != null) {
        console.log("dimText");
        var dimXLoc, dimYLoc;
        dimXLoc = allPointsX[obj.data.dimX - 1];
        dimYLoc = allPointsY[obj.data.dimY - 1];
        // if (obj.data.rho == null) {
        //   // 计算极坐标角度
        //   if (obj.data.dimX == 0 && obj.data.dimY == 19) {
        //     // fireTexts.dimText1 = n;
        //     obj.diagram.model.setDataProperty(obj.data, "rho", 1);
        //   }
        //   if (obj.data.dimX == 10 && obj.data.dimY == 19) {
        //     obj.diagram.model.setDataProperty(obj.data, "rho", 2);
        //   }
        //   if (obj.data.dimX == 19 && obj.data.dimY == 19) {
        //     obj.diagram.model.setDataProperty(obj.data, "rho", 3);
        //   }
        //   if (obj.data.dimX == 19 && obj.data.dimY == 10) {
        //     obj.diagram.model.setDataProperty(obj.data, "rho", 4);
        //   }
        //   if (obj.data.dimX == 19 && obj.data.dimY == 19) {
        //     obj.diagram.model.setDataProperty(obj.data, "rho", 5);
        //   }
        //   if (obj.data.dimX == 10 && obj.data.dimY == 0) {
        //     obj.diagram.model.setDataProperty(obj.data, "rho", 6);
        //   }
        //   if (obj.data.dimX == 0 && obj.data.dimY == 0) {
        //     obj.diagram.model.setDataProperty(obj.data, "rho", 7);
        //   }
        //   if (obj.data.dimX == 0 && obj.data.dimY == 10) {
        //     obj.diagram.model.setDataProperty(obj.data, "rho", 8);
        //   }
        // }

        if (obj.data.dimX >= allPointsX.length) {
          dimXLoc = allPointsX[allPointsX.length - 1] + gridWidth;
          // if(snapType != "between"){
          //   dimXLoc += gridWidth/3
          // }
        }
        if (obj.data.dimY >= allPointsY.length) {
          dimYLoc = allPointsY[allPointsY.length - 1] - gridHeight;
          // if(snapType != "between"){
          //   dimYLoc -= gridHeight/3
          // }
        }
        if (obj.data.dimX <= 0) {
          dimXLoc = allPointsX[0] - gridWidth;
          if (snapType != "between" && obj.data.dimY < allPointsY.length) {
            dimXLoc -= gridWidth / 2;
          }
        }
        if (obj.data.dimY <= 0) {
          dimYLoc = allPointsY[0] + gridHeight;
          if (snapType != "between" && obj.data.dimX < allPointsX.length) {
            dimYLoc += gridHeight / 2;
          }
        }
        obj.location = new go.Point(dimXLoc, dimYLoc);
      }
    }
    if (obj.data.subRole != "themeText" && obj.data.orderY == centerOrderY || obj.data.dimY == centerOrderY) {
      // console.log("Ddddddd")
      obj.diagram.model.setDataProperty(obj.data, "width", gridWidth - 10);
      // delete obj.data.height
      obj.diagram.model.setDataProperty(obj.data, "height", null);
    }
    if (obj.data.subRole != "themeText" && obj.data.orderX == centerOrderX || obj.data.dimX == centerOrderX) {
      // console.log("Ddddddd")
      obj.diagram.model.setDataProperty(obj.data, "height", gridHeight - 10);
      obj.diagram.model.setDataProperty(obj.data, "width", null);
      // delete obj.data.width
    }

    if (Math.abs(obj.data.orderX - centerOrderX) == 1 && Math.abs(obj.data.orderY - centerOrderY) == 1) {
      // 中心节点
      if (snapType != "between") {
        obj.diagram.model.setDataProperty(obj.data, "width", gridWidth - 10);
        obj.diagram.model.setDataProperty(obj.data, "height", gridHeight - 10);
      }
    }

    if (obj.data.subRole == "coreText") {
      var maxRadius = Math.max(Math.abs(obj.data.orderX - centerOrderX), Math.abs(obj.data.orderY - centerOrderY));
      obj.diagram.model.setDataProperty(obj.data, "theta", maxRadius);
    }

    if (Math.abs(obj.data.orderX - centerOrderX) == 0 && Math.abs(obj.data.orderY - centerOrderY) == 0) {}
    // 中心节点
    // obj.diagram.model.setDataProperty(obj.data, "textStroke",`red`)
    // obj.diagram.model.setDataProperty(obj.data, "deletable", false)
    // obj.diagram.model.setDataProperty(obj.data, "subRole", "themeText")
    // obj.diagram.model.setDataProperty(obj.data, "height",`${gridHeight-10}`)
    // if(snapType == "between"){
    //   obj.diagram.model.setDataProperty(obj.data, "width",gridWidth+gridWidth-10)
    //   obj.diagram.model.setDataProperty(obj.data, "height",gridHeight+gridHeight-10)
    // }else{
    //   obj.diagram.model.setDataProperty(obj.data, "width",gridWidth-10)
    //   obj.diagram.model.setDataProperty(obj.data, "height",gridHeight-10)
    // }

    // else{
    //   // var list = verticalLines[0].layer.findObjectsNear(obj.location, dist)
    //   // console.log("list",list)
    //   var x=obj.location.x,y=obj.location.y, xi,yi;
    //     for(var i=0;i<allPointsX.length;i++){
    //       if(x<allPointsX[i]){
    //         x = allPointsX[i]
    //         xi = i
    //         break;
    //       }
    //     }
    //     for(var i=0;i<allPointsY.length;i++){
    //       if(y<=allPointsY[i]){
    //         y = allPointsY[i]
    //         yi = i;
    //         break;
    //       }
    //     }

    //     if(x != -9000 && y != 9000){
    //       obj.location = new go.Point(x, y)
    //       obj.data.orderX = xi + 1;
    //       obj.data.orderY = yi + 1;
    //     }
    //     console.log("sdfdsfsd")
    // }

    // obj.diagram.model.setDataProperty(obj.data, "selectable",false)
  });

  if (axisXText) {
    // axisXText.location = group.location.copy().offset(x1+30, 0)
    // axisXText.locationSpot = go.Spot.Top
  }
  if (axisYText) {
    // axisYText.location = group.location.copy().offset(-10, -(x2+30))
    // axisYText.locationSpot = go.Spot.Right
  }
  if (axisY) {
    axisY.angle = 270;
    this.diagram.model.setDataProperty(axisY.data, "desiredSize", x2 + 30 + " 10");
  }
  if (axisX) {
    axisX.angle = 0;
    this.diagram.model.setDataProperty(axisX.data, "desiredSize", x1 + 30 + " 10");
  }
  // line.width = 2000
  // line.height = 4
  group.width = x1 + gridWidth * 2;
  group.height = x2 + gridHeight * 2;
  // group.location = group.location.copy().offset(-gridWidth, gridHeight)
  // this.diagram.model.setDataProperty(group.data, "loc",go.Point.stringify(group.location.copy().offset(-gridWidth, gridHeight)))
  go.Layout.prototype.doLayout.call(this, coll);
  diagram.commitTransaction("YunGroupLayout");
  // diagram.updateAllTargetBindings()
  return;
  // return;
  // var diagram = this.diagram;
  if (diagram === null) return;
  diagram.startTransaction("PoolLayout");
  // make sure all of the Group Shapes are big enough
  // var minsize = computeMinPoolSize();
  // diagram.findTopLevelGroups().each(function(lane) {
  //   if (!(lane instanceof go.Group)) return;
  //   var shape = lane.selectionObject;
  //   if (shape !== null) {  // change the desiredSize to be big enough in both directions
  //     var sz = computeLaneSize(lane);
  //     shape.width = (!isNaN(shape.width)) ? Math.max(shape.width, sz.width) : sz.width;
  //     shape.height = (isNaN(shape.height) ? minsize.height : Math.max(shape.height, minsize.height));
  //     var cell = lane.resizeCellSize;
  //     if (!isNaN(shape.width) && !isNaN(cell.width) && cell.width > 0) shape.width = Math.ceil(shape.width / cell.width) * cell.width;
  //     if (!isNaN(shape.height) && !isNaN(cell.height) && cell.height > 0) shape.height = Math.ceil(shape.height / cell.height) * cell.height;
  //   }
  // });
  // now do all of the usual stuff, according to whatever properties have been set on this GridLayout
  go.GridLayout.prototype.doLayout.call(this, coll);
  diagram.commitTransaction("PoolLayout");
};
// end PoolLayout class

module.exports = YunGroupLayout;

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var $ = go.GraphObject.make;
var Base = __webpack_require__(1);
var helpers = __webpack_require__(0);
var yunGroupLayout = __webpack_require__(27);

var YunNodeTemplate = function (_Base) {
  _inherits(YunNodeTemplate, _Base);

  function YunNodeTemplate(options) {
    _classCallCheck(this, YunNodeTemplate);

    // this.nodeProperties = {}
    var _this = _possibleConstructorReturn(this, (YunNodeTemplate.__proto__ || Object.getPrototypeOf(YunNodeTemplate)).call(this, options));

    _this.defaultTextFont = "20px 'Microsoft YaHei'";

    return _this;
  }

  _createClass(YunNodeTemplate, [{
    key: 'snapToGrid',
    value: function snapToGrid(data, node) {

      if (data.subRole == "coreText" || data.subRole == "themeText") {
        return;
      }
      var p = go.Point.parse(data.loc);
      if (node.__yunPointsX && node.__yunPointsY) {
        if (p.x >= node.__yunPointsX[0] && p.x <= node.__yunPointsX[node.__yunPointsX.length - 1] && p.y >= node.__yunPointsY[node.__yunPointsY.length - 1] && p.y <= node.__yunPointsY[0]) {
          // 在画布格子范围内的位置才对齐网格
          var minX = 20000,
              minY = 20000,
              tmp,
              orderX,
              orderY;
          for (var i = 0; i < node.__yunPointsX.length; i++) {
            tmp = Math.abs(p.x - node.__yunPointsX[i]);
            if (tmp < minX) {
              minX = tmp;
              orderX = i + 1;
            }
          }
          for (var i = 0; i < node.__yunPointsY.length; i++) {
            tmp = Math.abs(p.y - node.__yunPointsY[i]);
            if (tmp < minY) {
              minY = tmp;
              orderY = i + 1;
            }
          }

          if (orderX != null && orderY != null) {
            // var x = node.__yunPointsX[orderX-1]
            // var y = node.__yunPointsX[orderY-1]
            // x = -1300
            // y = -1300
            // data.loc = "-1688.105387366997 -121.19730986224602"
            data.orderX = orderX;
            data.orderY = orderY;
          }
        } else {
          delete data.orderX;
          delete data.orderY;
        }
      }
    }
  }, {
    key: 'addFreeText',
    value: function addFreeText(e, node) {
      console.log("addFreeTextaddFreeText begin", e);
      var gridWidth = node.data.gridWidth;
      var p = e.documentPoint;
      var that = this;
      var data = { "text": "节点",
        "deletable": true,
        "role": "freeText",
        "fill": "black",
        "iconVisible": false,
        "locationSpot": "0.5 0.5 0 0",
        "minSize": '30 30',
        "subRole": "yunpanText",

        // "width":`${gridWidth-10}`,
        font: that.defaultTextFont,
        "textAlign": "center",
        "category": "autoText",
        "loc": go.Point.stringify(p),
        "movable": true, "group": node.data.key
        //  console.log()


      };this.snapToGrid(data, node);
      this.diagram.startTransaction("addFreeText");
      this.diagram.model.addNodeData(data);
      this.diagram.commitTransaction("addFreeText");
      node.layout.isValidLayout = false;
      console.log("addFreeTextaddFreeText end", e);
    }
  }, {
    key: 'addFreeShapeText',
    value: function addFreeShapeText(e, node) {
      console.log("addFreeTextaddFreeText begin", e);
      var gridWidth = node.data.gridWidth;
      var p = e.documentPoint;
      var that = this;
      var data = { "text": "节点",
        "deletable": true,
        "role": "freeText",
        "fill": "#F2F2F2",
        "iconVisible": false,
        "locationSpot": "0.5 0.5 0 0",
        "minSize": '30 30',
        "subRole": "yunpanText",
        desiredSize: go.Size.stringify(new go.Size(gridWidth - 10, gridWidth - 10)),
        // "width":`${gridWidth-10}`,
        font: that.defaultTextFont,
        "textAlign": "center",
        "category": "shapeText",
        "loc": go.Point.stringify(p),
        "movable": true, "group": node.data.key
        //  console.log()


      };this.snapToGrid(data, node);
      this.diagram.startTransaction("addFreeText");
      this.diagram.model.addNodeData(data);
      this.diagram.commitTransaction("addFreeText");
      node.layout.isValidLayout = false;
      console.log("addFreeTextaddFreeText end", e);
    }
  }, {
    key: 'getNodeTemplate',
    value: function getNodeTemplate() {
      var that = this;
      return $(go.Group, "Auto", { selectionObjectName: "PH",
        __trtdNode: that,
        layerName: "default",
        padding: 0,
        margin: 0,
        copyable: false,
        zOrder: 15,
        locationObjectName: "PH",
        locationSpot: new go.Spot(0, 1, 0, -0),
        // rotationSpot: go.Spot.LeftCenter,
        rotatable: false,
        alignment: go.Spot.Left,
        alignmentFocus: go.Spot.Left,
        // rotateObject:"PH",
        click: function click(e, node) {
          console.log(node.data);
          var it = node.findSubGraphParts().iterator;
          while (it.next()) {
            var n = it.value;
            if (n.data.category == "autoText") {
              n.findObject("textBorder").visible = false;
            }
          }
          node.layout.isValidLayout = false;
          return;
          if (node.isSelected) return;
          var it = node.findSubGraphParts().iterator;
          var n;
          while (it.next()) {
            n = it.value;
            if (n.data.role == "labelGroup") {
              n.__trtdNode.switchBorder(n, true);
              break;
            }
          }
          if (n) {
            setTimeout(function () {
              n.__trtdNode.switchBorder(n, false);
            }, 3000);
          }
        },
        doubleClick: function doubleClick(e, node) {
          that.addFreeShapeText(e, node);
        },
        mouseOver: function mouseOver(e, node) {
          // if(node.data.hyperlink){
          //   var textObj = node.findObject('TEXT');
          //   textObj.isUnderline = true;
          // }
          // if(!node.containingGroup) return;
          return;
          // diagram.__trtd.showNodeRemarkTips(e, node);
        },
        contextMenu: $(go.Adornment),
        mouseLeave: function mouseLeave(e, node) {
          // if(!node.containingGroup) return;
          var it = node.findSubGraphParts().iterator;
          while (it.next()) {
            var n = it.value;
            if (n.data.role == "labelGroup") {
              // n.__trtdNode.switchBorder(n, false)
              break;
            }
          }
          // if(n){
          //   setTimeout(function(){
          //     n.__trtdNode.switchBorder(n, false)
          //   },3000)
          // }
        },
        // rotatable: true,
        // resizable: true,
        // layoutConditions: go.Part.LayoutStandard,
        layoutConditions: go.Part.LayoutStandard & go.Part.LayoutRemoved & go.Part.LayoutAdded & go.Part.LayoutNodeSized,
        layout: new yunGroupLayout()
        // layout: $(go.GridLayout,{
        //   spacing: new go.Size(0,0),
        //   cellSize: go.Size.parse(300,150),
        //   arrangement:go.GridLayout.LeftToRight,
        //   alignment: go.GridLayout.Location,
        //   comparer:function(pa, pb) {
        //     var da = pa.data;
        //     var db = pb.data;
        //     if (da.order < db.order) return -1;
        //     if (da.order > db.order) return 1;
        //     return 0;
        //   }
        // }) 
      }, new go.Binding("deletable", "deletable").makeTwoWay(function (v, data) {
        return v;
      }), new go.Binding("copyable", "copyable").makeTwoWay(), new go.Binding("angle", "angle").makeTwoWay(function (v, data) {
        return v;
      }), new go.Binding("zOrder", "zOrder").makeTwoWay(function (v, data) {
        return v;
      }), new go.Binding("locationSpot", "", function (data) {
        // console.log("data:",data)
        return new go.Spot(0, 1, data.gridWidth, -data.gridHeight);
      }), $(go.Shape, // using a Shape instead of a Placeholder
      { name: "PH",
        figure: "Rectangle",
        // rotationSpot: go.Spot.LeftCenter,
        // spot1: new go.Spot(0.01, 0.01),
        // spot2: new go.Spot(0.99, 0.99),
        // width: 600,
        // height:300,
        stroke: "yellow",
        strokeWidth: 0,
        fill: "rgba(0,0,255,0.0)" }
      // new go.Binding("desiredSize", "desiredSize", function(v,data){
      //   return go.Size.parse(v)
      //   console.log('1111111111111111111111')
      //   // for(var i=0;i<)
      //   var model = data.part.diagram.model;
      //   var group = data.part.data;
      //   var maxWidth = 0;
      //   var maxHeight = 0;
      //   for(var i = 0;i<model.nodeDataArray.length;i++){
      //     if(group.key != model.nodeDataArray[i].group){
      //       continue;
      //     }
      //     if(model.nodeDataArray[i].desiredSize){
      //       console.log(model.nodeDataArray[i].desiredSize)
      //       var size = go.Size.parse(model.nodeDataArray[i].desiredSize)
      //       if(size.width > maxWidth){
      //         maxWidth = size.width;
      //       }
      //       if(size.height > maxHeight){
      //         maxHeight = size.height;
      //       }
      //     }
      //   }
      //   // var group = that.diagram.findNodeForKey(data.part.data.key)
      //   // var git = group.memberParts;
      //   // var maxWidth = 0;
      //   // var maxHeight = 0;
      //   // while (git.next()) {
      //   //   var item = git.value;
      //   //   console.log("item:",item)
      //   //   if(item.naturalBounds.width > maxWidth){
      //   //     maxWidth = item.naturalBounds.width;
      //   //   }
      //   //   if(item.naturalBounds.height > maxHeight){
      //   //     maxHeight = item.naturalBounds.height;
      //   //   }
      //   //   console.log(`maxHeight:${maxHeight},maxWidth:${maxWidth}`)

      //   // }           
      //   return go.Size.parse(`${maxWidth+100} ${maxHeight}`)         
      //   // group.diagram.model.setDataProperty(group.data, "desiredSize", `${maxWidth+100} ${maxHeight}`) 
      // }).makeTwoWay(go.Size.stringify)
      ), new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify)
      // $(go.Placeholder,    // represents the area of all member parts,
      //   { padding: 0}
      // ),  // with some extra padding around them

      // $(go.TextBlock,  // group title
      //   { font: "Bold 12pt Sans-Serif" },
      //   new go.Binding("text", "key")
      // )
      );
    }
  }]);

  return YunNodeTemplate;
}(Base);

module.exports = YunNodeTemplate;

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// define a custom grid layout that makes sure the length of each lane is the same
// and that each lane is broad enough to hold its subgraph
function YunGroupLayout() {
  go.Layout.call(this);
  // go.GridLayout.call(this);
  // this.cellSize = new go.Size(1, 1);
  // this.wrappingColumn = Infinity;
  // this.wrappingWidth = Infinity;
  // this.spacing = new go.Size(0, 0);
  // this.alignment = go.GridLayout.Position;
}
go.Diagram.inherit(YunGroupLayout, go.Layout);

function computeNewRotateLoc(rotateCenter, currentLoc, angle) {
  if (rotateCenter.equals(currentLoc)) return currentLoc;
  // 计算选择中心点到（0,0）点的偏移
  var offset = new go.Point(0, 0).subtract(rotateCenter.copy());
  // 将原来的点偏移到相对0,0点的位置
  var nodeOrigin = currentLoc.copy().offset(offset.x, offset.y);
  var newNodeOrigin = nodeOrigin.rotate(angle);
  var newNodeLoc = newNodeOrigin.copy().offset(-offset.x, -offset.y);
  return newNodeLoc;
  // console.log("newNodeLoc", newNodeLoc)
}
YunGroupLayout.prototype.doLayout = function (coll) {
  console.log("YunGroupLayout.doLayout");
  var diagram = this.diagram;
  diagram.startTransaction("YunGroupLayout");
  // COLL might be a Diagram or a Group or some Iterable<Part>

  var it = this.collectParts(coll).iterator;
  var collection = [];
  var dataCollection = [];
  var group = this.group;
  var gridWidth = group.data.gridWidth;
  var gridHeight = group.data.gridHeight;
  // group.location = new go.Point(0,0)
  var maxWidth = 0;
  var maxHeight = 0;
  var centerLine, axisX, axisY, axisXText, axisYText, themeText, labelText1, labelText2, labelText3, labelGroup, waveGroup;
  var shiTextColl = [];
  var xuTextColl = [];
  var verticalLines = [];
  var horizontalLines = [];
  var freelLines = [];
  var allLines = [];
  var freeTexts = [];
  var shapeNodes = [];
  var horizontalDim = [];
  var verticalDim = [];
  var snapType = group.data.snapType || "grid";
  var showShape = group.data.showShape; // 是否显示矩形
  var beginSpark = group.data.beginSpark; // 是否开始火花
  var shapeStrokes = group.data.shapeStrokes; // 是否开始火花
  var oliveWidth;
  var oliveHeight;
  while (it.next()) {
    var node = it.value;
    // var item = git.value;
    //   console.log("item:",item)

    dataCollection.push(node.data);
    if (node.data.category == "wave") {
      collection.push(node);
    }
    if (!(node instanceof go.Node)) {
      continue;
    }

    if (node.data.dimX == 0 && node.data.subRole == "dimText") {
      verticalDim.push(node);
    }
    if (node.data.dimY == 0 && node.data.subRole == "dimText") {
      horizontalDim.push(node);
    }
    if (node.data.role == "background") {
      shapeNodes.push(node);
    }
    // 处理文本节点的位置和定位位置
    // if(node.data.category == "text"){
    if (node.data.role == "axisYText") {
      axisYText = node;
    }
    if (node.data.role == "axisXText") {
      axisXText = node;
    }
    if (node.data.role == "themeText") {
      themeText = node;
    }
    if (node.data.role == "shiText") {
      shiTextColl.push(node);
    }
    if (node.data.role == "xuText") {
      xuTextColl.push(node);
    }
    // }
    // 处理label文本节点的位置和定位位置
    // if(node.data.category == "iconText"){
    if (node.data.role == "labelText1") {
      labelText1 = node;
    }
    if (node.data.role == "labelText2") {
      labelText2 = node;
    }
    if (node.data.role == "labelText3") {
      labelText3 = node;
    }
    if (node.data.role == "labelGroup") {
      labelGroup = node;
    }
    // }

    if (node.naturalBounds.width > maxWidth) {
      maxWidth = node.naturalBounds.width;
    }
    if (node.naturalBounds.height > maxHeight) {
      maxHeight = node.naturalBounds.height;
    }

    if (node.data.role == "freeText") {
      freeTexts.push(node);
    }
    if (node.data.category == "line") {

      allLines.push(node);
      if (node.data.role == "verticalLine") {
        verticalLines.push(node);
      }
      if (node.data.role == "horizontalLine") {
        horizontalLines.push(node);
      }
      if (node.data.role == "freelLine") {
        freelLines.push(node);
      }
    }
    if (node.data.group == group.key) {
      // position the node . . .
      if (node.data.category == "line") {
        if (node.data.role == "axisX") {
          node.angle = 0;
          axisX = node;
          node.location = group.location.copy().offset(0, 0);
        };
        if (node.data.role == "axisY") {
          axisY = node;
          node.angle = 270;
          node.location = group.location.copy().offset(0, 0);
        }
        // node.angle = 270
      }
      // if(node.data.category == "waveGroup"){
      //     waveGroup = node;
      //     // node.angle = group.angle
      //     oliveWidth = node.data.oliveWidth
      //     oliveHeight = node.data.oliveHeight
      //     node.location = group.location.copy().offset(0,0)
      //     // node.layout.isOngoing = true;
      //     // node.layout.isValidLayout = false;
      //     // collection.push(node)
      // }
    }
  }
  console.log("maxHeight:" + maxHeight + ",maxWidth:" + maxWidth);

  verticalLines.sort(function (a, b) {
    return a.data.order - b.data.order;
  });
  horizontalLines.sort(function (a, b) {
    return a.data.order - b.data.order;
  });
  freelLines.sort(function (a, b) {
    return a.data.order - b.data.order;
  });
  // verticalDim.sort(function(a,b){
  //     return a.data.dimY - b.data.dimY
  // })
  // horizontalDim.sort(function(a,b){
  //     return a.data.dimX - b.data.dimX
  // })
  // horizontalLines.forEach(function(obj,index){
  //   var newOrder = index+1;
  //   obj.diagram.model.setDataProperty(obj.data,"dimX", newOrder)
  // })
  // verticalDim.forEach(function(obj,index){
  //   var newOrder = index+1;
  //   obj.diagram.model.setDataProperty(obj.data,"dimY", newOrder)
  // })
  if (snapType == "between") {
    var x1 = verticalLines.length * gridWidth + gridWidth;
    var x2 = horizontalLines.length * gridHeight + gridHeight;
  } else {
    var x1 = verticalLines.length * gridWidth;
    var x2 = horizontalLines.length * gridHeight;
  }

  var allPointsX = [];
  var allPointsY = [];
  var centerOrderX = (horizontalLines.length + 1) / 2;
  var centerOrderY = (verticalLines.length + 1) / 2;
  allLines.forEach(function (obj, index) {
    // obj.diagram.model.setDataProperty(obj.data, "strokeWidth",1)

    // obj.diagram.model.setDataProperty(obj.data, "stroke","rgba(0,0,0,0.3)")
    if (obj.data.role == "axisX" || obj.data.role == "axisY") return;
    // if(obj.data.subRole == "dim"){
    //   obj.diagram.model.setDataProperty(obj.data, "strokeDashArray","[0, 0]")
    //   obj.diagram.model.setDataProperty(obj.data, "strokeWidth",3)
    //   obj.diagram.model.setDataProperty(obj.data, "stroke","RGBA(164, 177, 198, 1)")
    // }else{
    //   obj.diagram.model.setDataProperty(obj.data, "strokeDashArray","[15, 10]")
    //   obj.diagram.model.setDataProperty(obj.data, "strokeWidth",1)
    //   obj.diagram.model.setDataProperty(obj.data, "stroke","rgba(0,0,0,0.3)")
    // }
  });

  verticalLines.forEach(function (obj, index) {
    var newOrder = index + 1;
    obj.diagram.model.setDataProperty(obj.data, "order", newOrder);
    obj.location = group.location.copy().offset(gridWidth * newOrder, 0);
    obj.angle = 270;
    obj.diagram.model.setDataProperty(obj.data, "deletable", true);
    obj.diagram.model.setDataProperty(obj.data, "desiredSize", x2 + 20 + " 10");
    // obj.diagram.model.setDataProperty(obj.data, "showArrow",false)
    // obj.diagram.model.setDataProperty(obj.data, "selectable",false)
    if (snapType == "between") {
      if (newOrder < centerOrderX) {
        allPointsX.push(obj.location.x - gridWidth / 2);
      }
      if (newOrder == centerOrderX) {
        allPointsX.push(obj.location.x);
      }
      if (newOrder > centerOrderX) {
        allPointsX.push(obj.location.x + gridWidth / 2);
      }
    } else {
      allPointsX.push(obj.location.x);
    }

    // obj.diagram.model.setDataProperty(obj.data, "strokeWidth",1)
    // obj.diagram.model.setDataProperty(obj.data, "stroke","rgba(0,0,0,0.3)")
    // obj.diagram.model.setDataProperty(obj.data, "strokeDashArray","[10, 5]")
  });
  horizontalLines.forEach(function (obj, index) {
    var newOrder = index + 1;
    obj.diagram.model.setDataProperty(obj.data, "order", newOrder);
    obj.diagram.model.setDataProperty(obj.data, "deletable", true);
    obj.location = group.location.copy().offset(0, -gridHeight * newOrder);
    obj.angle = 0;
    obj.diagram.model.setDataProperty(obj.data, "desiredSize", x1 + 20 + " 10");
    // obj.diagram.model.setDataProperty(obj.data, "showArrow",false)
    // obj.diagram.model.setDataProperty(obj.data, "selectable",false)
    if (snapType == "between") {
      if (newOrder < centerOrderY) {
        allPointsY.push(obj.location.y + gridHeight / 2);
      }
      if (newOrder == centerOrderY) {
        allPointsY.push(obj.location.y);
      }
      if (newOrder > centerOrderY) {
        allPointsY.push(obj.location.y - gridHeight / 2);
      }
    } else {
      allPointsY.push(obj.location.y);
    }
    // obj.diagram.model.setDataProperty(obj.data, "strokeWidth",1)
    // obj.diagram.model.setDataProperty(obj.data, "stroke","rgba(0,0,0,0.3)")
    // obj.diagram.model.setDataProperty(obj.data, "strokeDashArray","[10, 5]")
  });
  // allPointsX.unshift(allPointsX[0]-gridWidth)
  // allPointsX.push(allPointsX[allPointsX.length-1]+gridWidth)
  // allPointsY.unshift(allPointsY[0]-gridLength)
  // allPointsY.push(allPointsY[allPointsY.length-1]+gridLength)
  this.group.__yunPointsX = allPointsX;
  this.group.__yunPointsY = allPointsY;
  freelLines.forEach(function (obj, index) {
    // var newOrder = index+1;
    // obj.diagram.model.setDataProperty(obj.data,"order", newOrder)
    // obj.location = new go.Point(allPointsX[9], allPointsY[9])
    // obj.angle = 315;
    // obj.diagram.model.setDataProperty(obj.data, "desiredSize",`${gridWidth*20-5} 10`)
    // obj.diagram.model.setDataProperty(obj.data, "showArrow",false)
    // obj.diagram.model.setDataProperty(obj.data, "selectable",true)
    // obj.diagram.model.setDataProperty(obj.data, "strokeWidth",1)
    // obj.diagram.model.setDataProperty(obj.data, "zOrder",10)
    // obj.diagram.model.setDataProperty(obj.data, "showArrow",true)
    // obj.diagram.model.setDataProperty(obj.data, "showBeginArrow",true)
    // obj.diagram.model.setDataProperty(obj.data, "showEndArrow",true)
    // obj.diagram.model.setDataProperty(obj.data, "locationSpot",`0.5 0.5 0 0`)
    // obj.diagram.model.setDataProperty(obj.data, "stroke","rgba(0,0,0,0.3)")
    // obj.diagram.model.setDataProperty(obj.data, "strokeDashArray","[5, 5]")
    // obj.diagram.model.setDataProperty(obj.data, "selectable",false)
  });

  // shapeNodes.forEach(function(obj,index){
  //   obj.diagram.model.setDataProperty(obj.data, "visible",true)
  //   if(!showShape){
  //     obj.diagram.model.setDataProperty(obj.data, "stroke", "rgba(255,0,0,0)")
  //   }else{
  //     try{
  //       obj.diagram.model.setDataProperty(obj.data, "stroke", shapeStrokes[obj.data.gridWidth/2-1])
  //     }catch(e){
  //       console.log(e)
  //     }
  //   }
  //     if(obj.data.desiredSize){
  //       return;
  //     }
  //     obj.data.orderX = centerOrderX
  //     obj.data.orderY = centerOrderY
  //     obj.location = new go.Point(allPointsX[obj.data.orderX-1], allPointsY[obj.data.orderY-1])
  //     var shapeWidth = obj.data.gridWidth||2;
  //     if(snapType == "between"){
  //       var desiredSize = new go.Size(gridWidth*(shapeWidth-1), gridHeight*(shapeWidth-1))
  //       obj.diagram.model.setDataProperty(obj.data, "strokeWidth", gridWidth)
  //     }else{
  //       var desiredSize = new go.Size(gridWidth*shapeWidth+3, gridHeight*shapeWidth+3)
  //       obj.diagram.model.setDataProperty(obj.data, "strokeWidth", 3)
  //     }
  //     // obj.desiredSize = desiredSize;
  //     obj.diagram.model.setDataProperty(obj.data, "desiredSize",go.Size.stringify(desiredSize))
  //     // obj.diagram.model.setDataProperty(obj.data, "visible",true)
  //     obj.diagram.model.setDataProperty(obj.data, "strokeDashArray","[0,0]")

  // })

  // var dist = Math.max(gridHeight,gridWidth)
  freeTexts.forEach(function (obj, index) {
    // var newOrder = index+1;
    // obj.diagram.model.setDataProperty(obj.data,"order", newOrder)
    // obj.location = group.location.copy()
    // obj.angle = 315;
    // obj.diagram.model.setDataProperty(obj.data, "desiredSize",`${x1+20} 10`)
    // obj.diagram.model.setDataProperty(obj.data, "minSize",`60 50`)
    // obj.diagram.model.setDataProperty(obj.data, "width",`${gridWidth-10}`)
    // obj.diagram.model.setDataProperty(obj.data, "height",`${gridHeight-10}`)
    // obj.diagram.model.setDataProperty(obj.data, "width",`${gridWidth*3}`)
    // delete obj.data.width
    // obj.diagram.model.setDataProperty(obj.data, "textAlign",`center`)
    // obj.diagram.model.setDataProperty(obj.data, "locationSpot",`0.5 0.5 0 0`)
    // obj.diagram.model.setDataProperty(obj.data, "strokeDashArray","[10, 5]")
    // obj.diagram.model.setDataProperty(obj.data, "font", group.__trtdNode.defaultTextFont)

    // if(node.__yunPointsY && node.__yunPointsX){
    //       for(var i=0;i<allPointsX.length;i++){
    //         if(obj)
    //       }
    //    }
    // if(obj.data.text.indexOf("自由文本") >-1){
    //   console.log("ddd",obj.data.text)
    //   var order = obj.data.text.replace("自由文本","").split(",")
    //   if(order.length == 2){
    //     obj.data.orderX = order[0]
    //     obj.data.orderY = order[1]
    //     obj.location = new go.Point(allPointsX[obj.data.orderX-1], allPointsY[obj.data.orderY-1])
    //   }
    // }

    // if(obj.data.text.length == 1){
    //   if(obj.data.subRole == null){
    //     obj.diagram.model.setDataProperty(obj.data, "subRole","coreText")
    //     obj.diagram.model.setDataProperty(obj.data, "deletable", false)
    //   }
    // }

    // if(obj.data.text.indexOf("维度") >-1){
    //   console.log("ddd",obj.data.text)
    //   // var order = obj.data.text.replace("维度","").split(",")
    //   obj.diagram.model.setDataProperty(obj.data, "subRole","dimText")
    //   // obj.diagram.model.setDataProperty(obj.data, "dimKey", null)
    //   delete obj.data.dimKey
    //   obj.diagram.model.setDataProperty(obj.data, "deletable", false)
    //   // obj.diagram.model.setDataProperty(obj.data, "width", null)
    //   // obj.diagram.model.setDataProperty(obj.data, "height", null)
    // }
    obj.areaBackground = null;
    // obj.diagram.model.setDataProperty(obj.data, "height", null)
    // obj.diagram.model.setDataProperty(obj.data, "width", null)
    // obj.findObject("place").visible = false;
    // console.log("verticalLines.length+1)/2verticalLines.length+1)/2",(verticalLines.length+1)/2)
    if (group.data.autoSnapText) {
      // 计算普通文字位置
      if (obj.data.orderX && obj.data.orderY) {
        obj.location = new go.Point(allPointsX[obj.data.orderX - 1], allPointsY[obj.data.orderY - 1]);

        obj.location = new go.Point(allPointsX[obj.data.orderX - 1], allPointsY[obj.data.orderY - 1]);
      }
      // 计算维度文字位置
      if (obj.data.subRole == "dimText" && obj.data.dimX != null && obj.data.dimY != null) {
        console.log("dimText");
        obj.diagram.model.setDataProperty(obj.data, "deletable", true);
        var dimXLoc, dimYLoc;
        dimXLoc = allPointsX[obj.data.dimX - 1];
        dimYLoc = allPointsY[obj.data.dimY - 1];

        // if(obj.data.dimX > allPointsX.length+1){
        //   dimXLoc = allPointsX[allPointsX.length-1]+gridWidth
        //   // if(snapType != "between"){
        //   //   dimXLoc += gridWidth/3
        //   // }
        // }
        // if(obj.data.dimY > allPointsY.length+1){
        //   dimYLoc = allPointsY[allPointsY.length-1]-gridHeight
        //   // if(snapType != "between"){
        //   //   dimYLoc -= gridHeight/3
        //   // }
        // }
        if (obj.data.dimX <= 0) {
          dimXLoc = allPointsX[0] - gridWidth / 2 - 10;
          if (snapType != "between" && obj.data.dimY <= allPointsY.length) {
            dimXLoc -= gridWidth / 2;
          }
        }
        if (obj.data.dimY <= 0) {
          dimYLoc = allPointsY[0] + gridHeight / 2;
          if (snapType != "between" && obj.data.dimX <= allPointsX.length) {
            dimYLoc += gridHeight / 2;
          }
        }
        obj.location = new go.Point(dimXLoc, dimYLoc);
      }
    }
    // if(obj.data.orderY == centerOrderY||obj.data.dimY == centerOrderY){
    //   // console.log("Ddddddd")
    //   obj.diagram.model.setDataProperty(obj.data, "width",`${gridWidth-10}`)
    //   // delete obj.data.height
    //   obj.diagram.model.setDataProperty(obj.data, "height", null)
    // }
    // if(obj.data.orderX == centerOrderX || obj.data.dimX == centerOrderX ){
    //   // console.log("Ddddddd")
    //   obj.diagram.model.setDataProperty(obj.data, "height",`${gridHeight-10}`)
    //   obj.diagram.model.setDataProperty(obj.data, "width", null)
    //   // delete obj.data.width
    // }

    // if(Math.abs(obj.data.orderX-centerOrderX) <= 1 && Math.abs(obj.data.orderY-centerOrderY) <= 1){
    //   // 中心节点
    //   if(snapType != "between"){
    //     obj.diagram.model.setDataProperty(obj.data, "width",`${gridWidth-10}`)
    //     obj.diagram.model.setDataProperty(obj.data, "height",`${gridHeight-10}`)
    //   }
    // }

    // if(Math.abs(obj.data.orderX-centerOrderX) == 0 && Math.abs(obj.data.orderY-centerOrderY) == 0){
    //   // 中心节点
    //   // obj.diagram.model.setDataProperty(obj.data, "textStroke",`red`)
    //   // obj.diagram.model.setDataProperty(obj.data, "deletable", false)
    //   // obj.diagram.model.setDataProperty(obj.data, "subRole", "themeText")
    //   // obj.diagram.model.setDataProperty(obj.data, "height",`${gridHeight-10}`)
    //   if(snapType == "between"){
    //     obj.diagram.model.setDataProperty(obj.data, "width",`${gridWidth+gridWidth-10}`)
    //     obj.diagram.model.setDataProperty(obj.data, "height",`${gridHeight+gridHeight-10}`)
    //   }else{
    //     obj.diagram.model.setDataProperty(obj.data, "width",`${gridWidth-10}`)
    //     obj.diagram.model.setDataProperty(obj.data, "height",`${gridHeight-10}`)
    //   }
    // }
    // else{
    //   // var list = verticalLines[0].layer.findObjectsNear(obj.location, dist)
    //   // console.log("list",list)
    //   var x=obj.location.x,y=obj.location.y, xi,yi;
    //     for(var i=0;i<allPointsX.length;i++){
    //       if(x<allPointsX[i]){
    //         x = allPointsX[i]
    //         xi = i
    //         break;
    //       }
    //     }
    //     for(var i=0;i<allPointsY.length;i++){
    //       if(y<=allPointsY[i]){
    //         y = allPointsY[i]
    //         yi = i;
    //         break;
    //       }
    //     }

    //     if(x != -9000 && y != 9000){
    //       obj.location = new go.Point(x, y)
    //       obj.data.orderX = xi + 1;
    //       obj.data.orderY = yi + 1;
    //     }
    //     console.log("sdfdsfsd")
    // }

    // obj.diagram.model.setDataProperty(obj.data, "selectable",false)
  });

  if (axisXText) {
    axisXText.location = group.location.copy().offset(x1 + 50, 0);
    axisXText.locationSpot = go.Spot.Left;
  }
  if (axisYText) {
    axisYText.location = group.location.copy().offset(0, -(x2 + 50));
    axisYText.locationSpot = go.Spot.Bottom;
  }
  if (axisY) {
    axisY.angle = 270;
    this.diagram.model.setDataProperty(axisY.data, "desiredSize", x2 + 30 + " 10");
  }
  if (axisX) {
    axisX.angle = 0;
    this.diagram.model.setDataProperty(axisX.data, "desiredSize", x1 + 30 + " 10");
  }
  // line.width = 2000
  // line.height = 4
  group.width = x1 + gridWidth * 2;
  group.height = x2 + gridHeight * 2;
  // group.location = group.location.copy().offset(-gridWidth, gridHeight)
  // this.diagram.model.setDataProperty(group.data, "loc",go.Point.stringify(group.location.copy().offset(-gridWidth, gridHeight)))
  go.Layout.prototype.doLayout.call(this, coll);
  diagram.commitTransaction("YunGroupLayout");
  // diagram.updateAllTargetBindings()
  return;
  // return;
  // var diagram = this.diagram;
  if (diagram === null) return;
  diagram.startTransaction("PoolLayout");
  // make sure all of the Group Shapes are big enough
  // var minsize = computeMinPoolSize();
  // diagram.findTopLevelGroups().each(function(lane) {
  //   if (!(lane instanceof go.Group)) return;
  //   var shape = lane.selectionObject;
  //   if (shape !== null) {  // change the desiredSize to be big enough in both directions
  //     var sz = computeLaneSize(lane);
  //     shape.width = (!isNaN(shape.width)) ? Math.max(shape.width, sz.width) : sz.width;
  //     shape.height = (isNaN(shape.height) ? minsize.height : Math.max(shape.height, minsize.height));
  //     var cell = lane.resizeCellSize;
  //     if (!isNaN(shape.width) && !isNaN(cell.width) && cell.width > 0) shape.width = Math.ceil(shape.width / cell.width) * cell.width;
  //     if (!isNaN(shape.height) && !isNaN(cell.height) && cell.height > 0) shape.height = Math.ceil(shape.height / cell.height) * cell.height;
  //   }
  // });
  // now do all of the usual stuff, according to whatever properties have been set on this GridLayout
  go.GridLayout.prototype.doLayout.call(this, coll);
  diagram.commitTransaction("PoolLayout");
};
// end PoolLayout class

module.exports = YunGroupLayout;

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var $ = go.GraphObject.make;
var Base = __webpack_require__(1);
var helpers = __webpack_require__(0);

var shapeNodeTemplate = function (_Base) {
    _inherits(shapeNodeTemplate, _Base);

    function shapeNodeTemplate(options) {
        _classCallCheck(this, shapeNodeTemplate);

        return _possibleConstructorReturn(this, (shapeNodeTemplate.__proto__ || Object.getPrototypeOf(shapeNodeTemplate)).call(this, options));
        // this.nodeProperties = {}
    }

    _createClass(shapeNodeTemplate, [{
        key: 'getNodeSelectionAdornmentTemplate',
        value: function getNodeSelectionAdornmentTemplate() {
            return $(go.Adornment, "Spot", $(go.Panel, "Auto", $(go.Shape, { fill: null, stroke: "dodgerblue", strokeWidth: 1 }), $(go.Placeholder) // this represents the selected Node

            ),
            //$("TreeExpanderButton",
            $(go.Panel, "Vertical", {
                name: "ButtonIcon1",
                alignment: new go.Spot(0, 1, -20, 20),
                alignmentFocus: go.Spot.Center,
                width: 60,
                height: 60,
                isActionable: true
                // click: interactions.expandCollapse // this function is defined below
            }, $(go.Shape, "Circle", {
                fill: "rgba(1,1,1,0)",
                strokeWidth: 0,
                stroke: "green",
                width: 50,
                height: 50
            }))); // end Adornment;
        }
    }, {
        key: 'nodeResizeAdornmentTemplate',
        value: function nodeResizeAdornmentTemplate() {
            return $(go.Adornment, "Spot", $(go.Placeholder), // takes size and position of adorned object
            $(go.Shape, "Circle", // left resize handle
            {
                alignment: go.Spot.TopLeft,
                alignmentFocus: go.Spot.BottomRight,
                cursor: "col-resize",
                desiredSize: new go.Size(30, 30),
                fill: "lightblue",
                stroke: "dodgerblue"
            }), $(go.Shape, "Circle", // right resize handle
            {
                alignment: go.Spot.BottomRight,
                alignmentFocus: go.Spot.TopLeft,
                cursor: "col-resize",
                desiredSize: new go.Size(30, 30),
                fill: "lightblue",
                stroke: "dodgerblue"
            }));
        }
    }, {
        key: 'getNodeTemplate',
        value: function getNodeTemplate() {
            var diagram = this.diagram;
            var that = this;
            return $(go.Node, "Spot", _defineProperty({
                name: "NODE",
                "_controlExpand": true,
                layerName: "default",
                zOrder: 13,
                locationSpot: go.Spot.Center,
                resizeCellSize: new go.Size(10, 10),
                locationObjectName: "SHAPE",
                resizable: true,
                resizeObjectName: "SHAPE", // user can resize the Shape
                rotatable: true,
                rotateObjectName: "SHAPE", // rotate the Shape without rotating the label
                doubleClick: function doubleClick(e, node) {
                    // interactions.selectText(e, node)
                    console.log(node.data);
                    if (node.diagram.__trtd.nodeDoubleClickListener) {
                        node.diagram.__trtd.nodeDoubleClickListener(node);
                    }
                },
                click: function click(e, node) {
                    console.log(node.data);
                    if (node.diagram.__trtd.nodeClickListener) {
                        node.diagram.__trtd.nodeClickListener(node);
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
                resizeAdornmentTemplate: that.nodeResizeAdornmentTemplate(),
                //rotateAdornmentTemplate: nodeRotateAdornmentTemplate,
                contextMenu: diagram.__trtd.nodeContextMenu,
                selectionAdornmentTemplate: that.getNodeSelectionAdornmentTemplate()
            }, 'contextMenu', $(go.Adornment)), new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify), new go.Binding("isShadowed", "isShadowed").makeTwoWay(), new go.Binding("selectable", "selectable").makeTwoWay(), new go.Binding("movable", "movable").makeTwoWay(), new go.Binding("resizable", "resizable").makeTwoWay(), new go.Binding("deletable", "deletable").makeTwoWay(), new go.Binding("visible", "visible"), new go.Binding("zOrder", "zOrder"), new go.Binding("layerName", "layerName", function (v, d) {
                return v ? v : "";
            }).makeTwoWay(function (v) {
                return v;
            }), $(go.Shape, {
                strokeDashArray: null,
                // strokeDashOffset:10,
                // padding: -1,
                margin: 0,
                name: "SHAPE",
                figure: "Rectangle",
                fill: "rgba(0,0,0,0)",
                // fromLinkable: true,
                // toLinkable: true,
                // cursor: "pointer",
                minSize: new go.Size(50, 50),
                strokeWidth: 3,
                stroke: "RGBA(255,0,0,0.2)",
                portId: ""

            }, new go.Binding("fill", "fill").makeTwoWay(), new go.Binding("strokeWidth", "strokeWidth").makeTwoWay(), new go.Binding("figure", "figure").makeTwoWay(), new go.Binding("stroke", "stroke").makeTwoWay(), new go.Binding("desiredSize", "desiredSize", function (v) {
                var size = new go.Size.parse(v);
                return size;
            }).makeTwoWay(function (v) {
                return go.Size.stringify(v);
            }), new go.Binding("strokeDashArray", "strokeDashArray", function (v) {
                return JSON.parse(v);
            }).makeTwoWay(function (v) {
                return JSON.stringify(v);
            })));
        }
    }]);

    return shapeNodeTemplate;
}(Base);

module.exports = shapeNodeTemplate;

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var $ = go.GraphObject.make;
var Base = __webpack_require__(1);
var helpers = __webpack_require__(0);

var AutoTextTemplate = function (_Base) {
    _inherits(AutoTextTemplate, _Base);

    function AutoTextTemplate(options) {
        _classCallCheck(this, AutoTextTemplate);

        return _possibleConstructorReturn(this, (AutoTextTemplate.__proto__ || Object.getPrototypeOf(AutoTextTemplate)).call(this, options));
        // this.nodeProperties = {}
    }

    _createClass(AutoTextTemplate, [{
        key: 'clearBorder',
        value: function clearBorder(node) {
            if (node.data.showBorder) {
                // if(node.data.text == ""){
                node.findObject("textBorder").visible = false;
                // }
            }
        }
    }, {
        key: 'makeGeo',
        value: function makeGeo(data, shape, options) {
            // this is much more efficient than calling go.GraphObject.make:
            var _data$radiusX = data.radiusX,
                radiusX = _data$radiusX === undefined ? 150 : _data$radiusX,
                _data$radiusY = data.radiusY,
                radiusY = _data$radiusY === undefined ? 100 : _data$radiusY;

            var geo = new go.Geometry().add(new go.PathFigure(0, 0) // start point
            .add(new go.PathSegment(go.PathSegment.SvgArc, radiusX * 2, 0, radiusX, radiusY, 0, 1, options.clockwiseFlag ? 1 : 0)));
            geo.defaultStretch = go.GraphObject.Fill;
            return geo;
        }
    }, {
        key: 'getNodeTemplate',
        value: function getNodeTemplate() {
            var properties = {
                figure: "Rectangle",
                fill: "rgba(0,0,0,0)",
                strokeWidth: 1,
                stroke: "rgba(0,0,0,0)",
                fontSize: 15,
                font: "sans-serif"
            };
            var that = this;
            var diagram = this.diagram;
            return $(go.Node, "Spot", {
                "_controlExpand": true,
                __trtdNode: that,
                layerName: "Foreground",
                zOrder: 15,
                movable: true,
                isShadowed: true,

                //   shadowBlur : null,
                shadowColor: "#57617a",
                shadowOffset: new go.Point(0, 0),
                //   copyable: false,
                visible: true,
                locationSpot: go.Spot.Center,
                resizeCellSize: new go.Size(10, 10),
                //   locationObjectName: "textBorder",
                selectionObjectName: "SHAPE",
                resizable: true,
                //   selectable: false,
                //   clickable: false,
                resizeObjectName: "SHAPE", // user can resize the Shape
                rotatable: false,
                location: new go.Point(0, 0),
                //rotateObjectName: "SHAPE",  // rotate the Shape without rotating the label
                // doubleClick: selectText,
                toMaxLinks: 1,
                mouseDrop: function mouseDrop(e, obj) {
                    var node = obj.part;
                    var selnode = e.diagram.selection.first();

                    // 常变
                    if (selnode.data.category == "picGroup" && selnode.data.role == "cbian" && node.data.role == "centerText") {
                        var oliveNode = e.diagram.findNodeForKey(node.data.olive);
                        if (!oliveNode) return;
                        var it = selnode.findSubGraphParts().iterator;
                        var deleteObjs = [];
                        var cbian = {};
                        while (it.next()) {
                            var n = it.value;
                            if (n.data.category == "autoText") {
                                if (n.data.locationSpot == "0 0 0 0") {
                                    cbian.shiText = n.data.text;
                                }
                                if (n.data.locationSpot == "0 0.5 0 0") {
                                    cbian.centerText = n.data.text;
                                }
                                if (n.data.locationSpot == "0 1 0 0") {
                                    cbian.xuText = n.data.text;
                                }
                            }
                            deleteObjs.push(n.data);
                        }
                        e.diagram.startTransaction("mouseDrop");
                        // 删除总结图
                        e.diagram.model.removeNodeDataCollection(deleteObjs);
                        var backupSelnode = JSON.parse(JSON.stringify(selnode.data));
                        e.diagram.model.removeNodeData(selnode.data);

                        // 添加新橄榄
                        e.diagram.__trtd.addOlive(oliveNode, cbian);
                        e.diagram.commitTransaction("mouseDrop");
                        return;
                    }

                    // 互换要点文字,只有云盘里的文字可以互换
                    if (selnode.data.subRole == "coreText" && node.data.subRole == "coreText" || selnode.data.subRole == "yunpanText" && node.data.subRole == "yunpanText") {
                        e.diagram.model.startTransaction("coreTextExchange");
                        var selOrderX = selnode.data.orderX;
                        var selOrderY = selnode.data.orderY;
                        var selDimKey = selnode.data.dimKey;
                        e.diagram.model.setDataProperty(selnode.data, "orderX", node.data.orderX);
                        e.diagram.model.setDataProperty(selnode.data, "orderY", node.data.orderY);
                        e.diagram.model.setDataProperty(selnode.data, "dimKey", node.data.dimKey);
                        e.diagram.model.setDataProperty(node.data, "orderX", selOrderX);
                        e.diagram.model.setDataProperty(node.data, "orderY", selOrderY);
                        e.diagram.model.setDataProperty(node.data, "dimKey", selDimKey);
                        e.diagram.model.commitTransaction("coreTextExchange");
                    }

                    // 云盘互换维度
                    if (selnode.data.subRole == "dimText" && node.data.subRole == "dimText" && selnode.data.category == node.data.category) {
                        if (selnode.data.group != node.data.group) return;
                        if (!selnode.containingGroup) return;
                        if (selnode.containingGroup.data.category != "yunpanGroup") return;
                        if (!(selnode.data.dimX == node.data.dimX || selnode.data.dimY == node.data.dimY)) {
                            return;
                        }

                        e.diagram.model.startTransaction("dimTextExchange");
                        var selOrderX = selnode.data.dimX;
                        var selOrderY = selnode.data.dimY;
                        var it = node.containingGroup.findSubGraphParts().iterator;
                        var nodeCoreTexts = [];
                        var selnodeCoreTexts = [];
                        var yunnodeCoreTexts = [];
                        var yunselnodeCoreTexts = [];
                        var normDim = "X";
                        if (selnode.data.dimX == 0) {
                            normDim = "Y";
                        }
                        var selOrder = selnode.data["dim" + normDim];
                        var nodeOrder = node.data["dim" + normDim];
                        while (it.next()) {
                            var n = it.value;
                            if (n.data.subRole == "yunpanText") {
                                if (n.data["order" + normDim] == nodeOrder) {
                                    yunnodeCoreTexts.push(n);
                                }
                                if (n.data["order" + normDim] == selOrder) {
                                    yunselnodeCoreTexts.push(n);
                                }
                            }
                        }
                        var tmpX, tmpY;
                        for (var i = 0; i < yunnodeCoreTexts.length; i++) {
                            e.diagram.model.setDataProperty(yunnodeCoreTexts[i].data, "order" + normDim, selOrder);
                        }
                        for (var i = 0; i < yunselnodeCoreTexts.length; i++) {
                            e.diagram.model.setDataProperty(yunselnodeCoreTexts[i].data, "order" + normDim, nodeOrder);
                        }
                        e.diagram.model.setDataProperty(selnode.data, "dim" + normDim, nodeOrder);
                        e.diagram.model.setDataProperty(node.data, "dim" + normDim, selOrder);
                        e.diagram.model.commitTransaction("dimTextExchange");
                        return;
                    }

                    // 互换维度
                    if (selnode.data.subRole == "dimText" && node.data.subRole == "dimText") {
                        e.diagram.model.startTransaction("dimTextExchange");
                        var selOrderX = selnode.data.dimX;
                        var selOrderY = selnode.data.dimY;
                        var it = node.containingGroup.findSubGraphParts().iterator;
                        var nodeCoreTexts = [];
                        var selnodeCoreTexts = [];
                        var yunnodeCoreTexts = [];
                        var yunselnodeCoreTexts = [];
                        var normDim = "X";
                        if (selnode.data.dimX == 0) {
                            normDim = "Y";
                        }
                        while (it.next()) {
                            var n = it.value;
                            if (n.data.dimKey == node.data.key) {
                                nodeCoreTexts.push(n);
                            }
                            if (n.data.dimKey == selnode.data.key) {
                                selnodeCoreTexts.push(n);
                            }
                            if (n.data.subRole == "yunpanText") {
                                if (n.data["order" + normDim] == node.data["order" + normDim]) {
                                    yunnodeCoreTexts.push(n);
                                }
                                if (n.data["order" + normDim] == selnode.data["order" + normDim]) {
                                    yunselnodeCoreTexts.push(n);
                                }
                            }
                        }
                        console.log("selnodeCoreTextsselnodeCoreTextsselnodeCoreTexts", selnodeCoreTexts.length);
                        var centerOrderX = (node.containingGroup.__yunPointsX.length + 1) / 2;
                        var centerOrderY = (node.containingGroup.__yunPointsY.length + 1) / 2;

                        if (selnode.data.dimX > centerOrderX) {
                            selnodeCoreTexts.sort(function (a, b) {
                                return a.data.orderX - b.data.orderX;
                            });
                        }
                        if (selnode.data.dimX == centerOrderX) {
                            if (selnode.data.dimY > centerOrderY) {
                                selnodeCoreTexts.sort(function (a, b) {
                                    return a.data.orderY - b.data.orderY;
                                });
                            } else {
                                selnodeCoreTexts.sort(function (a, b) {
                                    return b.data.orderY - a.data.orderY;
                                });
                            }
                        }
                        if (selnode.data.dimX < centerOrderX) {
                            selnodeCoreTexts.sort(function (a, b) {
                                return b.data.orderX - a.data.orderX;
                            });
                        }

                        if (node.data.dimX > centerOrderX) {
                            nodeCoreTexts.sort(function (a, b) {
                                return a.data.orderX - b.data.orderX;
                            });
                        }
                        if (node.data.dimX == centerOrderX) {
                            if (node.data.dimY > centerOrderY) {
                                nodeCoreTexts.sort(function (a, b) {
                                    return a.data.orderY - b.data.orderY;
                                });
                            } else {
                                nodeCoreTexts.sort(function (a, b) {
                                    return b.data.orderY - a.data.orderY;
                                });
                            }
                        }
                        if (node.data.dimX < centerOrderX) {
                            nodeCoreTexts.sort(function (a, b) {
                                return b.data.orderX - a.data.orderX;
                            });
                        }

                        var tmpX, tmpY;
                        for (var i = 0; i < selnodeCoreTexts.length; i++) {
                            tmpX = selnodeCoreTexts[i].data.orderX;
                            tmpY = selnodeCoreTexts[i].data.orderY;
                            e.diagram.model.setDataProperty(selnodeCoreTexts[i].data, "orderX", nodeCoreTexts[i].data.orderX);
                            e.diagram.model.setDataProperty(selnodeCoreTexts[i].data, "orderY", nodeCoreTexts[i].data.orderY);
                            e.diagram.model.setDataProperty(nodeCoreTexts[i].data, "orderX", tmpX);
                            e.diagram.model.setDataProperty(nodeCoreTexts[i].data, "orderY", tmpY);
                        }
                        e.diagram.model.setDataProperty(selnode.data, "dimX", node.data.dimX);
                        e.diagram.model.setDataProperty(selnode.data, "dimY", node.data.dimY);
                        e.diagram.model.setDataProperty(node.data, "dimX", selOrderX);
                        e.diagram.model.setDataProperty(node.data, "dimY", selOrderY);
                        e.diagram.model.commitTransaction("dimTextExchange");
                    }

                    if (selnode.data.category != "wave") {
                        return;
                    }
                    if (node.data.role != "centerText") {
                        return;
                    }
                    if (!node) {
                        // node.containingGroup.layout.isValidLayout = false
                        return;
                    }
                    if (selnode.data.group != obj.data.group) {
                        return;
                    }
                    e.diagram.startTransaction("mouseDrop");
                    selnode.__oldOrder = selnode.data.order;
                    e.diagram.model.setDataProperty(selnode.data, "order", node.data.order + 0.5);
                    var xuText = e.diagram.model.findNodeDataForKey(selnode.data.xuText);
                    var shiText = e.diagram.model.findNodeDataForKey(selnode.data.shiText);
                    e.diagram.model.setDataProperty(shiText, "order", node.data.order + 0.5);
                    e.diagram.model.setDataProperty(xuText, "order", node.data.order + 0.5);
                    // node.containingGroup.layout.isValidLayout = false
                    e.diagram.commitTransaction("mouseDrop");
                },
                mouseDragEnter: function mouseDragEnter(e, obj) {
                    var node = obj.part;
                    var selnode = e.diagram.selection.first();
                    if (!selnode) return;
                    if (selnode.data.subRole == "coreText" && node.data.subRole == "coreText" || selnode.data.subRole == "yunpanText" && node.data.subRole == "yunpanText") {
                        selnode.areaBackground = null;
                        node.areaBackground = "RGB(107,208,137)";
                    }
                    if (selnode.data.subRole == "dimText" && node.data.subRole == "dimText") {
                        selnode.areaBackground = null;
                        node.areaBackground = "RGB(107,208,137)";
                    }

                    if (node.data.role == "centerText") {
                        node.layerName = "Background";
                    }
                    // if (!(selnode instanceof go.Node)  || selnode.data.role != "freeText"  || selnode.category != "autoText" ||selnode.data.subRole != "coreText") {
                    //     return;
                    // }


                    // //var sat = node.selectionAdornmentTemplate;
                    // //var adorn = sat.copy();
                    // //adorn.adornedObject = node;
                    // //node.addAdornment("dragEnter", adorn);

                    // //if (!mayWorkFor(selnode, node)) return;
                    // var shape = node.findObject("SHAPE");
                    // if (shape) {
                    //     shape._prevFill = shape.fill; // remember the original brush
                    //     shape.fill = "darkred";
                    // }
                },
                mouseDragLeave: function mouseDragLeave(e, obj) {
                    var node = obj.part;
                    var selnode = e.diagram.selection.first();
                    // var shape = node.findObject("SHAPE");
                    if (selnode.data.subRole == "coreText" && node.data.subRole == "coreText" || selnode.data.subRole == "yunpanText" && node.data.subRole == "yunpanText") {
                        node.areaBackground = null;
                    }
                    if (selnode.data.subRole == "dimText" && node.data.subRole == "dimText") {
                        node.areaBackground = null;
                    }
                    if (node.data.role == "centerText") {
                        node.layerName = "Foreground";
                    }
                    //node.removeAdornment("dragEnter");
                },
                selectionChanged: function selectionChanged(node) {
                    console.log("selectionChanged", node);

                    if (node.data.category != "autoText" || node.data.orderX == null || node.data.orderY == null || node.data.role != "freeText" || node.data.subRole != "coreText" || node.data.subRole != "yunpanText") {
                        return;
                    }

                    if (!node.containingGroup || node.containingGroup.data.category != "yunGroup" || node.containingGroup.data.category != "yunpanGroup") {
                        return;
                    }

                    if (node.containingGroup.data.beginSpark != "line") {
                        return;
                    }
                    if (node.containingGroup.__yunPointsX && node.containingGroup.__yunPointsY) {
                        var centerOrderX = (node.containingGroup.__yunPointsX.length + 1) / 2;
                        var centerOrderY = (node.containingGroup.__yunPointsY.length + 1) / 2;
                        if (node.data.orderX == centerOrderX && node.data.orderY == centerOrderY) {
                            // 中心文字不参与变色
                            return;
                        }
                        var orderX = node.data.orderX,
                            orderY = node.data.orderY;
                        if (orderX == centerOrderX) {
                            orderX = orderY;
                        }
                        if (orderY == centerOrderY) {
                            orderY = orderX;
                        }
                        var shapeStrokes = node.containingGroup.data.shapeStrokes;
                        var showShape = node.containingGroup.data.showShape; // 是否显示矩形
                        if (node.isSelected) {
                            if (node.containingGroup.data.snapType == "between") {
                                var diff = Math.max(Math.abs(node.data.orderX - centerOrderX), Math.abs(node.data.orderY - centerOrderY)) + 1;
                            } else {
                                var diff = Math.max(Math.abs(node.data.orderX - centerOrderX), Math.abs(node.data.orderY - centerOrderY));
                            }
                            console.log("diff:", diff, node.data.orderX, node.data.orderY);
                            var it = node.containingGroup.findSubGraphParts().iterator;

                            console.log("showShape", showShape);
                            // var beginSpark = node.containingGroup.data.beginSpark; // 是否显示矩形
                            var shape = null;
                            while (it.next()) {
                                var n = it.value;
                                if (n.data.category == "autoText" && n.data.orderX != null && n.data.orderY != null && n.data.role == "freeText") {
                                    n.findObject("textBorder").visible = false;
                                    // if((Math.abs(n.data.orderX-centerOrderX) == Math.abs(orderX-centerOrderX) 
                                    //     || Math.abs(n.data.orderX-centerOrderY) == Math.abs(orderY-centerOrderY)) 
                                    // && !(Math.abs(n.data.orderX-centerOrderY) < Math.abs(orderY-centerOrderY) 
                                    //     && Math.abs(n.data.orderX-centerOrderX) < Math.abs(orderX-centerOrderX))){
                                    //     n.areaBackground = "red"
                                    // }

                                    if (Math.abs(n.data.orderX - centerOrderX) == Math.abs(orderX - centerOrderX) && Math.abs(n.data.orderY - centerOrderY) <= Math.abs(orderY - centerOrderY) || Math.abs(n.data.orderX - centerOrderX) <= Math.abs(orderX - centerOrderX) && Math.abs(n.data.orderY - centerOrderY) == Math.abs(orderY - centerOrderY)) {
                                        // n.findObject("place").visible = true;
                                        n.areaBackground = "white";
                                        n.zOrder = 999;
                                    }
                                }
                                if (n.data.category == "shape" && n.data.role == "background") {
                                    var obj = n.findObject("SHAPE");
                                    // console.log("dfsdfsdfsdf", obj)
                                    if (n.data.gridWidth == diff * 2) {
                                        shape = obj;
                                        // if(showShape){
                                        // n.visible = true
                                        // }
                                        if (!obj.__prestroke) {
                                            obj.__prestroke = obj.stroke;
                                            obj.stroke = "rgba(255,0,0,0.5)";
                                        }
                                    } else {
                                        if (obj.__prestroke) {
                                            obj.stroke = obj.__prestroke;
                                            delete obj.__prestroke;
                                        }
                                    }
                                }
                            }
                            if (!shape) {
                                if (node.containingGroup.data.snapType == "between") {
                                    var gridWidth = diff * 2;
                                } else {
                                    var gridWidth = diff * 2;
                                }
                                console.log("addShape");
                                node.diagram.model.startTransaction("addShape");
                                var shapeData = { "deletable": true,
                                    "role": "background",
                                    "category": "shape",
                                    // "loc":"-1532.0268216255727 9.121091688849674", 
                                    "loc": go.Point.stringify(new go.Point(node.containingGroup.__yunPointsX[centerOrderX - 1], node.containingGroup.__yunPointsY[centerOrderY - 1])),
                                    "movable": true,
                                    "group": -19,
                                    "key": helpers.guid(),
                                    "orderX": 10,
                                    "orderY": 10,
                                    "gridWidth": gridWidth,
                                    "stroke": shapeStrokes[diff - 1],
                                    "visible": true, "strokeDashArray": "[0,0]", "strokeWidth": 3
                                    //   "desiredSize":"1263 1263"
                                };
                                node.diagram.model.addNodeData(shapeData);
                                node.diagram.model.commitTransaction("addShape");
                                setTimeout(function () {
                                    var nod = node.diagram.findNodeForKey(shapeData.key);
                                    console.log("add shape add shape");
                                    if (nod) {
                                        // nod.visible = true
                                        var obj = nod.findObject("SHAPE");
                                        if (!obj.__prestroke) {
                                            obj.__prestroke = obj.stroke;
                                            obj.stroke = "rgba(255,0,0,0.5)";
                                        }
                                    }
                                }, 100);
                            }
                        } else {
                            var it = node.containingGroup.findSubGraphParts().iterator;
                            while (it.next()) {
                                var n = it.value;
                                if (n.data.category == "autoText" && n.data.orderX != null && n.data.orderY != null && n.data.role == "freeText") {
                                    // n.findObject("textBorder").visible = false;
                                    // if((n.data.orderX == orderX || n.data.orderY == orderY) 
                                    // && !(n.data.orderX < orderX && n.data.orderY <orderY )){
                                    //     n.areaBackground = "red"
                                    // }

                                    if (Math.abs(n.data.orderX - centerOrderX) == Math.abs(orderX - centerOrderX) && Math.abs(n.data.orderY - centerOrderY) <= Math.abs(orderY - centerOrderY) || Math.abs(n.data.orderX - centerOrderX) <= Math.abs(orderX - centerOrderX) && Math.abs(n.data.orderY - centerOrderY) == Math.abs(orderY - centerOrderY)) {
                                        // n.findObject("textBorder").visible = true;
                                        // n.findObject("place").visible = false;
                                        n.areaBackground = null;
                                        n.zOrder = NaN;
                                    }
                                }
                                if (n.data.category == "shape" && n.data.role == "background") {
                                    var obj = n.findObject("SHAPE");
                                    // console.log("dfsdfsdfsdf", obj)
                                    if (!showShape) {
                                        // n.visible = false
                                        obj.stroke = "rgba(255,0,0,0)";
                                    }
                                    if (n.data.gridWidth == diff * 2) {
                                        if (!obj.__prestroke) {
                                            obj.__prestroke = obj.stroke;
                                            obj.stroke = "rgba(255,0,0,0.7)";
                                        }
                                    } else {

                                        if (obj.__prestroke) {
                                            obj.stroke = obj.__prestroke;
                                            delete obj.__prestroke;
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                click: function click(e, node) {
                    console.log(node.data);

                    // if(node.data.role == "centerText"){
                    //     var waveNode = node.diagram.findNodeForKey(node.data.olive)
                    //     node.layerName = "Background"
                    //     if(waveNode){
                    //         node.diagram.select(waveNode)
                    //     }
                    // }
                    // e.diagram.model.startTransaction("click")
                    // e.diagram.model.setDataProperty(node.data, "dimKey", -124)
                    // e.diagram.model.setDataProperty(node.data,"dimKey", -73)
                    // e.diagram.model.setDataProperty(node.data,"dimKey", -141)
                    // e.diagram.model.setDataProperty(node.data,"dimKey", -74)


                    // e.diagram.model.setDataProperty(node.data, "dimKey", -124)
                    // e.diagram.model.setDataProperty(node.data,"dimKey", -141)
                    // e.diagram.model.setDataProperty(node.data,"dimKey", -158)
                    // e.diagram.model.setDataProperty(node.data,"dimKey", -176)
                    // e.diagram.model.setDataProperty(node.data,"dimKey", -73)
                    // e.diagram.model.setDataProperty(node.data,"dimKey", -74)
                    // e.diagram.model.setDataProperty(node.data,"dimKey", -175)
                    // e.diagram.model.setDataProperty(node.data,"dimKey", -177)
                    // node.data.dimKey = -124
                    // node.data.dimKey = -141
                    // node.data.dimKey = -158
                    // node.data.dimKey = -176
                    // node.data.dimKey = -73
                    // node.data.dimKey = -74
                    // node.data.dimKey = -175
                    // node.data.dimKey = -177

                    // e.diagram.model.commitTransaction("click")
                },
                //   rotateAdornmentTemplate:  // specify appearance of rotation handle
                //   $(go.Adornment,
                //     { locationSpot: go.Spot.Center },
                //     $(go.Shape, "BpmnActivityLoop",
                //       { width: 12, height: 12, cursor: "pointer",
                //         background: "transparent", stroke: "dodgerblue", strokeWidth: 2 })
                //     ),
                mouseOver: function mouseOver(e, node) {
                    // if(node.data.hyperlink){
                    //   var textObj = node.findObject('TEXT');
                    //   textObj.isUnderline = true;
                    // }
                    // console.log("mouseOvermouseOvermouseOver")
                    if (node.data.showBorder) {
                        if (node.data.text == "" && (node.data.role == "xuText" || node.data.role == "shiText")) {
                            node.findObject("textBorder").visible = true;
                        }
                    }
                    if (node.data.role == "centerText") {
                        node.layerName = "Background";
                        // node.diagram.model.startTransaction("centerText")
                        // node.diagram.model.setDataProperty(node.data,"layerName", "Background")
                        // node.diagram.model.commitTransaction("centerText")
                    }
                    //   node.areaBackground = "mediumslateblue"
                    // }

                    // if(!node.containingGroup) return;
                    // var it = node.containingGroup.findSubGraphParts().iterator;
                    // while (it.next()) {
                    //     var n = it.value;
                    //     if(n.data.category == "autoText"){
                    //         if(n.data.order == node.data.order){
                    //             // locateNode = n;
                    //             n.areaBackground = "mediumslateblue"
                    //         }
                    //     }
                    // }
                    // diagram.__trtd.showNodeRemarkTips(e, node);
                },
                mouseLeave: function mouseLeave(e, node) {
                    //   if(node.data.text == ""){
                    if (node.data.showBorder) {
                        // if(node.data.text == ""){
                        node.findObject("textBorder").visible = false;
                        // }
                    }
                    if (node.data.role == "centerText") {
                        node.layerName = "Foreground";
                        // node.diagram.model.startTransaction("centerText")
                        // node.diagram.model.setDataProperty(node.data,"layerName", "Foreground")
                        // node.diagram.model.commitTransaction("centerText")
                    }
                    // node.areaBackground = null
                    //   }
                },
                //   layoutConditions: go.Part.LayoutStandard,
                layoutConditions: go.Part.LayoutStandard & go.Part.LayoutRemoved & go.Part.LayoutAdded & ~go.Part.LayoutNodeSized,
                //layoutConditions:~go.Part.LayoutAdded,
                // fromLinkable: true, toLinkable: true,
                alignment: go.Spot.Center,
                alignmentFocus: go.Spot.Center,
                contextMenu: $(go.Adornment),
                resizeAdornmentTemplate: // specify what resize handles there are and how they look
                $(go.Adornment, "Spot", $(go.Placeholder), // takes size and position of adorned object
                //     $(go.Shape, "Circle",  // left resize handle
                //       { alignment: go.Spot.Left, cursor: "col-resize",
                //         desiredSize: new go.Size(9, 9), fill: "lightblue", stroke: "dodgerblue" }),
                //     $(go.Shape, "Circle",  // right resize handle
                //       { alignment: go.Spot.Right, cursor: "col-resize",
                //         desiredSize: new go.Size(9, 9), fill: "lightblue", stroke: "dodgerblue" }),
                //   $(go.Shape, "Circle",  // right resize handle
                //   { alignment: go.Spot.Top, cursor: "col-resize",
                //   desiredSize: new go.Size(9, 9), fill: "lightblue", stroke: "dodgerblue" }),
                $(go.Shape, "Circle", // right resize handle
                { alignment: go.Spot.BottomRight, cursor: "col-resize",
                    desiredSize: new go.Size(15, 15), fill: "lightblue", stroke: "dodgerblue" })
                // $(go.TextBlock, // show the width as text
                //   { alignment: go.Spot.Top, alignmentFocus: new go.Spot(0.5, 1, 0, -2),
                //     stroke: "dodgerblue" },
                //   new go.Binding("text", "adornedObject",
                //                  function(shp) { return shp.naturalBounds.width.toFixed(0); })
                //       .ofObject())
                ),
                doubleClick: function doubleClick(e, node) {
                    e.diagram.__trtd.selectText(e, node);
                }

                // selectionAdornmentTemplate: nodeSelectionAdornmentTemplate,
            }, new go.Binding("locationSpot", "locationSpot", function (v) {
                return go.Spot.parse(v);
            }).makeTwoWay(function (v) {
                return go.Spot.stringify(v);
            }), new go.Binding("type", "type", function (v) {
                return go.Panel[v];
            }), new go.Binding("visible", "visible").makeTwoWay(), new go.Binding("deletable", "deletable").makeTwoWay(), new go.Binding("movable", "movable").makeTwoWay(), new go.Binding("rotatable", "rotatable").makeTwoWay(), new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify), new go.Binding("isShadowed", "isShadowed").makeTwoWay(), new go.Binding("angle", "angle").makeTwoWay(), new go.Binding("selectable", "selectable").makeTwoWay(), new go.Binding("copyable", "copyable").makeTwoWay(), new go.Binding("layerName", "layerName", function (v, d) {
                return v ? v : "";
            }), $(go.Shape, {
                strokeDashArray: null,
                opacity: 0.7,
                stretch: go.GraphObject.UniformToFill,
                // locationSpot: go.Spot.Center,  // the location is the center of the Shape
                // strokeDashOffset:10,
                name: "SHAPE",
                figure: "Circle",
                fill: "rgba(0,255,0,1)",
                fromLinkable: false,
                toLinkable: false,
                width: 100,
                height: 100,
                cursor: "pointer",
                minSize: new go.Size(50, 50),
                // maxSize: new go.Size(100, 100),
                strokeWidth: 1,
                stroke: "black",
                portId: ""

            }, new go.Binding("strokeDashArray", "shiStrokeDashArray", function (v) {
                return JSON.parse(v);
            }).makeTwoWay(function (v) {
                return JSON.stringify(v);
            }), new go.Binding("fill", "fill", function (v, obj) {
                return v instanceof go.Brush ? v.color : v;
            }).makeTwoWay(),
            // new go.Binding("fill", "isSelected", function(s, obj) { return s ? "red" : obj.part.data.color; }).ofObject()),
            new go.Binding("desiredSize", "desiredSize", function (v, d) {
                // console.log("vd m", v, d )
                // if(!v) return d.part.findObject("SHAPE").measuredBounds.size;
                return go.Size.parse(v);
            }).makeTwoWay(function (v) {
                console.log("sizesizesizesize");
                // var size = new go.Size(v.width, v.height)
                return go.Size.stringify(v);
            }), new go.Binding("stroke", "stroke", function (v) {
                return v instanceof go.Brush ? v.stroke : v;
            }).makeTwoWay(), new go.Binding("strokeWidth", "strokeWidth", function (d) {
                return d;
            }).makeTwoWay(function (d) {
                return d;
            }), new go.Binding("figure", "figure").makeTwoWay(), new go.Binding("opacity", "opacity").makeTwoWay()
            // {
            //     figure: properties.figure,
            //     fill: properties.fill,
            //     strokeWidth: properties.strokeWidth,
            //     stroke: properties.stroke
            // }
            ), $(go.Shape, {
                geometryString: "M540.5696 556.81024a81.8176 81.8176 0 0 1-53.0432-19.47648l-225.4848-191.52896a81.92 81.92 0 1 1 106.0864-124.86656l172.4416 146.47296 172.4416-146.47296a81.92 81.92 0 0 1 106.0864 124.86656l-225.4848 191.52896a81.7152 81.7152 0 0 1-53.0432 19.47648z m53.06368 246.23104l225.44384-191.52896a81.92 81.92 0 1 0-106.0864-124.84608l-172.40064 146.47296-172.48256-146.47296a81.92 81.92 0 1 0-106.04544 124.86656l225.52576 191.52896a81.7152 81.7152 0 0 0 53.00224 19.47648c18.88256 0 37.76512-6.49216 53.0432-19.49696z",
                // "M16 0c-8.837 0-16 7.163-16 16s7.163 16 16 16 16-7.163 16-16-7.163-16-16-16zM16 29c-7.18 0-13-5.82-13-13s5.82-13 13-13 13 5.82 13 13-5.82 13-13 13zM12 8c-1.105 0-2 0.895-2 2s0.895 2 2 2h5.172l-8.586 8.586c-0.781 0.781-0.781 2.047 0 2.829 0.39 0.39 0.902 0.586 1.414 0.586s1.024-0.195 1.414-0.586l8.586-8.586v5.172c0 1.105 0.895 2 2 2s2-0.895 2-2v-12h-12z",
                visible: false,
                name: "figure",
                cursor: "pointer",
                alignment: go.Spot.TopRight,
                alignmentFocus: go.Spot.TopRight,
                width: 14,
                height: 14,
                fill: "green",
                toolTip: $("ToolTip", $(go.Panel, "Vertical", $(go.Picture, new go.Binding("source", "src", function (s) {
                    return "images/" + s + ".png";
                })), $(go.TextBlock, { text: "进入子盘", margin: 3 }))),
                click: function click(e) {
                    console.log("click figure", e);
                    var node = e.targetObject.part;
                    e.diagram.__trtd.openFigure({
                        figure: node.data.figure,
                        title: node.data.text,
                        key: node.data.key,
                        node: node
                    });
                }
            },
            // new go.Binding("geometry", "geo", function(){

            // })),
            new go.Binding("visible", "figure", function (v) {
                console.log("----------------------");
                if (v) {
                    return true;
                } else {
                    return false;
                }
            })),
            // $(go.Shape, {
            //         name: "SHAPE_Back",
            //         figure: "Rectangle",
            //         fill: "rgba(128,128,128,0)",
            //         fromLinkable: true,
            //         toLinkable: true,
            //         strokeWidth: 0
            //     },
            //     new go.Binding("desiredSize", "width", function(v) {
            //         var va = (v / 2) * Math.sqrt(2);
            //         return new go.Size(va - 3, va - 3);
            //     }).ofObject("SHAPE")
            // ),
            $(go.TextBlock, {
                name: "TEXT",
                alignment: new go.Spot(0.5, 0.5),
                font: "18px 'Microsoft YaHei'",
                editable: false,
                //   areaBackground:"gray",
                //margin: 3, editable: true,
                //   background:"yellow",
                stroke: "black",
                isMultiline: true,
                overflow: go.TextBlock.OverflowClip,
                wrap: go.TextBlock.WrapDesiredSize,
                textAlign: "center",
                verticalAlignment: go.Spot.Center,
                spacingAbove: 4,
                spacingBelow: 4,
                portId: "TEXT",
                margin: 0,
                maxSize: new go.Size(600, NaN),
                minSize: new go.Size(10, 10),
                stretch: go.GraphObject.UniformToFill,
                textEdited: function textEdited(textBlock, oldv, newv) {

                    // // if(textBlock.part.containingGroup.data.textAngle == "horizontal"){
                    //   var centerText = textBlock.part.diagram.model.findNodeDataForKey(textBlock.part.data.centerText)
                    //   if(centerText){
                    //     console.log("centerTextcenterTextcenterTextcenterText")
                    var part = textBlock.part;
                    if (newv.trim() == "" && (part.data.role == "shiText" || part.data.role == "xuText")) {
                        textBlock.part.diagram.model.startTransaction("text");
                        textBlock.part.diagram.model.setDataProperty(textBlock.part.data, "nloc", null);
                        textBlock.part.diagram.model.commitTransaction("text");
                    }
                    //   }
                    // //   return;
                    // // }
                    // setTimeout(function(){
                    //   console.log("textEditedtextEditedtextEdited",textBlock.lineCount)
                    //   if(!textBlock.text) return;
                    //   if(textBlock.text && textBlock.text.trim() == "") return;
                    //   if(textBlock.lineCount %2 != 0){
                    //     if(newv[newv.length-1] == "\n"){
                    //       textBlock.text = newv.substring(0, newv.length-1)
                    //       return;
                    //     }
                    //     textBlock.text = newv+"\n"
                    //   }
                    // },100)

                    // var enterCount = 0;
                    if (textBlock.part.data.role && textBlock.part.data.role.indexOf("labelText") > -1) {
                        textBlock.part.containingGroup.layout.isValidLayout = false;
                    }
                    // for(var i=0;i<newv.length;i++){

                    // }
                    // textBlock.part.updateTargetBindings()

                    // if(textBlock.lineCount %2 != 0){
                    //   if(newv[newv.length-1] == "\n"){
                    //     textBlock.text = newv.substring(0, newv.length-1)
                    //     return;
                    //   }
                    //   textBlock.text = newv+"\n"
                    // }
                }
            }, new go.Binding("background", "background", function (v) {
                return v;
            }).makeTwoWay(), new go.Binding("areaBackground", "areaBackground", function (v) {
                return v;
            }).makeTwoWay(), new go.Binding("textAlign", "textAlign", function (v) {
                return v;
            }).makeTwoWay(), new go.Binding("spacingAbove", "spacingline", function (v) {
                return helpers.tdTransToNum(v, 4);
            }).makeTwoWay(), new go.Binding("spacingBelow", "spacingline", function (v) {
                return helpers.tdTransToNum(v, 4);
            }).makeTwoWay(), new go.Binding("maxSize", "", function (data, d, m) {
                // console.log("maxSize",v,m,d)
                var width = NaN;
                var height = NaN;
                if (data.width) {
                    width = data.width;
                }
                if (data.height) {
                    height = data.height;
                }

                return new go.Size(width, height);
            }), new go.Binding("minSize", "minSize", function (v) {
                // console.log("maxSize",v,m,d)

                return go.Size.parse(v);
            }),
            // new go.Binding("width", "width", function(v) {
            //     return v;
            // }).makeTwoWay(),
            // new go.Binding("height", "height", function(v) {
            //     return v;
            // }).makeTwoWay(),
            // new go.Binding("height", "height", function (v) {
            //   return v;
            // }).ofObject("SHAPE"),
            new go.Binding("text", "text").makeTwoWay(), new go.Binding("stroke", "textStroke").makeTwoWay(), new go.Binding("font", "font").makeTwoWay())
            //   $(go.Panel,"Vertical",
            //     {alignment: go.Spot.Left,
            //     alignmentFocus: go.Spot.Right,
            //     },
            //     $(go.Shape,{
            //         name:"ICON",
            //         width:16,
            //         height:16,
            //         visible: false,
            //         click: function(e){
            //             console.log("icon click")
            //         },
            //         figure:"Circle",
            //         fill:"red",
            //         strokeWidth:0,
            //         margin: 3
            //     },

            //     // new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
            //     new go.Binding("figure", "figure").makeTwoWay(),
            //     new go.Binding("visible", "iconVisible").makeTwoWay(),
            //     new go.Binding("fill", "fill", function(v, obj) {
            //         return v
            //     }).makeTwoWay()
            //     )
            // ),
            //     $(go.Shape,"Rectangle",{
            //         name: "textBorder",
            //         stroke: "green",
            //         strokeWidth: 3,
            //         strokeDashArray: [10, 5],
            //         visible:false,
            //         fill:"transparent",
            //         alignment: go.Spot.Center,
            //         // alignmentFocus: go.Spot.Right,
            //         width:100,
            //         height:270, 
            //     },
            //     new go.Binding("stroke","textStroke"),
            //     new go.Binding("desiredSize","", function(v,d){
            //         // console.log("vvvvvvvvvvvvv,",v,d)
            //         if(!helpers.checkPhone()){
            //             // return new go.Size(Math.max(d.part.naturalBounds.width,100)-3, Math.max(d.part.naturalBounds.height,100)-3);
            //             return new go.Size(d.part.naturalBounds.width-3, d.part.naturalBounds.height-3);
            //         }
            //         var olive = d.part.diagram.findNodeForKey(d.part.data.olive)
            //         return new go.Size(olive.naturalBounds.width-3, olive.naturalBounds.height);
            //         // return new go.Size(d.part.actualBounds.width-3, d.part.actualBounds.height-3);
            //     })
            // ),
            // $(go.Shape,"Circle",{
            //     name: "place",
            //     stroke: "red",
            //     strokeWidth: 1,
            //     strokeDashArray: null,
            //     visible:false,
            //     fill:"transparent",
            //     alignment: go.Spot.Center,
            //     // alignmentFocus: go.Spot.Right,
            //     width:50,
            //     height:50, 
            // },
            // new go.Binding("stroke","placeStroke"),
            // )
            );
        }
    }]);

    return AutoTextTemplate;
}(Base);

module.exports = AutoTextTemplate;

/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * 天盘连接线的布局
 */


// import * as go from 'gojs';

// let menus = require('../templates/menu');

var $ = go.GraphObject.make;

function SmoothLink() {
    go.Link.call(this);
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

// var tdCurrentTheme = menus.tdCurrentTheme;
// 根据根节点与两个节点的位置计算出圆心在AB中垂线与 过根节点且平行于AB的射线的交点 D
function computeNewCenter(O, A, B) {
    var C = new go.Point((A.x + B.x) / 2, (A.y + B.y) / 2); //AB的中点
    if (O.equals(A)) {
        var locD = C.copy();
        var r = Math.sqrt(C.distanceSquaredPoint(A));
        var direction = (A.directionPoint(B) + 90) % 360;
        var distance = r * 0.15;
        var offset = computeOffset(distance, direction);
        locD.offset(offset[0], offset[1]); //圆心坐标
        r = Math.sqrt(locD.distanceSquaredPoint(A));
        return [r, locD.x, locD.y];
    }
    var OC = Math.sqrt(O.distanceSquaredPoint(C));
    var directionOC = O.directionPoint(C);
    var directionFlagOD = O.distanceSquaredPoint(B) < O.distanceSquaredPoint(A);
    if (directionFlagOD) {
        var directionOD = B.directionPoint(A); //OD平行于AB
    } else {
        var directionOD = A.directionPoint(B); //OD平行于AB
    }

    var angleDOC = Math.abs(directionOC - directionOD);
    if (angleDOC > 90 && angleDOC < 180) {
        angleDOC = 180 - angleDOC;
    } else if (angleDOC >= 180) {
        angleDOC = 360 - angleDOC; //角doc是润角
    }
    // if(O.distanceSquaredPoint(B) > O.distanceSquaredPoint(A)){
    //   directionOD = B.directionPoint(A);
    // }
    var OD = OC * Math.cos(angleDOC * Math.PI / 180);
    var offset = computeOffset(OD, directionOD);
    var locD = O.copy();
    locD.offset(offset[0], offset[1]); //圆心坐标
    var r = Math.sqrt(locD.distanceSquaredPoint(A));
    return [r, locD.x, locD.y];
    // return locD;
}

go.Diagram.inherit(SmoothLink, go.Link);

SmoothLink.prototype.makeGeometry = function () {
    // get the Geometry created by the standard behavior
    var geo = go.Link.prototype.makeGeometry.call(this);
    if (geo.type !== go.Geometry.Path || geo.figures.length === 0) return geo;
    return geo;
};

/** @override */
SmoothLink.prototype.computePoints = function () {

    var myDiagram = this.diagram;

    var nodes = [];
    if (this.fromNode == null || this.toNode == null) return true;
    if (this.fromNode.location.equals(this.toNode.location)) {
        return false;
    }
    var start = this.fromNode.location.copy();
    var end = this.toNode.location.copy();

    if (!start.isReal() || !end.isReal()) {
        return true;
    }
    var A = start;
    var B = end;
    var O = myDiagram.findNodeForKey(this.toNode.data.parent);
    if (!O) return true;
    O = O.location;
    var cent = computeNewCenter(O, A, B);

    var centInfo = cent;
    var centorPoint = new go.Point(centInfo[1], centInfo[2]);

    this.micenter = centorPoint;
    var rcenter = centInfo[0];
    var rstart = this.fromNode.actualBounds.width / 2;
    var rend = this.toNode.actualBounds.width / 2;
    var center2mid = (2 * rcenter * rcenter - rstart * rstart) / (2 * rcenter); //大圆到大圆与开始节点交点中点的距离，然后求出夹角
    var af = Math.acos(center2mid / rcenter) * 180 / Math.PI;

    var geo = new go.Geometry(go.Geometry.Line);
    geo.startX = centorPoint.x;
    geo.startY = centorPoint.y;
    geo.endX = this.fromNode.location.x;
    geo.endY = this.fromNode.location.y;
    if (!af) {
        af = 0;
    }
    geo.rotate(af, centorPoint.x, centorPoint.y); //相对圆心旋转，顺时针
    var start2 = new go.Point(geo.endX, geo.endY);
    // var start2 = new go.Point(this.fromNode.location.x, this.fromNode.location.y);

    center2mid = (2 * rcenter * rcenter - rend * rend) / (2 * rcenter); //大圆到大圆与开始节点交点中点的距离，然后求出夹角
    af = Math.acos(center2mid / rcenter) * 180 / Math.PI;
    geo.endX = this.toNode.location.x;
    geo.endY = this.toNode.location.y;
    if (!af) {
        af = 0;
    }
    geo.rotate(-af, centorPoint.x, centorPoint.y); //相对圆心旋转,逆时针
    var end2 = new go.Point(geo.endX, geo.endY);

    //console.log(Math.abs(centorPoint.directionPoint(start2) - centorPoint.directionPoint(end2)));
    //var result = computeControlPoint(start,midPoint,end,centInfo);
    var result = computeControlPoint(start2, null, end2, centInfo);

    var ctl1 = result[0];
    var ctl2 = result[1];

    this.clearPoints();
    if (isNaN(start2.x) || isNaN(start2.y)) {
        start2 = this.fromNode.location.copy();
    }
    if (isNaN(end2.x) || isNaN(end2.y)) {
        end2 = this.toNode.location.copy();
    }
    //start1.rotate();
    this.points.add(start2);
    this.points.add(result[0]);
    this.points.add(result[1]);
    this.points.add(end2);

    var oust = "";
    return true;
};

function computeControlPoint(p1, p2, p3) {

    var result;
    result = arguments[3] ? arguments[3] : triangleCircle(p1, p2, p3);
    var radius = result[0];
    var cent = new go.Point(result[1], result[2]);

    //起始节点的弧度
    var sweep = Math.abs(cent.directionPoint(p1) - cent.directionPoint(p3));
    sweep = sweep > 180 ? 360 - sweep : sweep;
    //console.log("sweep:"+sweep);
    var newR = radius / Math.cos(sweep / 3 * Math.PI / 180);
    var geo = new go.Geometry(go.Geometry.Line);
    geo.startX = cent.x;
    geo.startY = cent.y;
    geo.endX = p1.x;
    geo.endY = p1.y;
    geo.rotate(sweep / 3, cent.x, cent.y); //相对圆心旋转3分之1弧度
    var newStartAngle = cent.direction(geo.endX, geo.endY);
    var ctl1;
    result = computeOffset(newR, newStartAngle);
    ctl1 = cent.copy().offset(result[0], result[1]);

    geo.rotate(sweep / 3, cent.x, cent.y); //相对圆心旋转3分之1弧度
    newStartAngle = cent.direction(geo.endX, geo.endY);

    var ctl2; //需要调整
    result = computeOffset(newR, newStartAngle);
    ctl2 = cent.copy().offset(result[0], result[1]);

    return [ctl1, ctl2];
}

function createTianpanLink(diagram) {
    return $(SmoothLink, {
        curve: go.Link.Bezier,
        layerName: "",
        isTreeLink: true,
        //curve: go.Link.Bezier,
        curviness: 30,
        //smoothness:1,
        adjusting: go.Link.Stretch,
        relinkableFrom: true,
        relinkableTo: true,
        reshapable: true,
        layoutConditions: go.Part.LayoutStandard & ~go.Part.LayoutNodeSized,
        mouseDragEnter: function mouseDragEnter(e, obj) {
            var link = obj.part;
            var shape = link.findObject("SHAPE");
            shape._preStoke = shape.stroke;
            shape.stroke = "darkred";
            shape._preStrokeWidth = shape.strokeWidth;
            shape.strokeWidth = 5;
        },
        mouseDragLeave: function mouseDragLeave(e, obj) {
            var link = obj.part;
            var shape = link.findObject("SHAPE");
            shape.stroke = shape._preStoke;
            shape.strokeWidth = shape._preStrokeWidth;
        },
        mouseDrop: function mouseDrop(e, obj) {
            var link = obj.part;
            var draggedNode = e.diagram.selection.first();
            if (!draggedNode instanceof go.Node) {
                return;
            }
            if (!draggedNode instanceof go.Group) {
                return;
            }
            if (draggedNode.data.key == 1) {
                return;
            }
            var fromNode = link.fromNode,
                toNode = link.toNode;
            //disconnectFromTreeStructure(draggedNode);
            if (toNode.data.parent == fromNode.data.key) {
                e.diagram.__trtd.setNodeAsChildren(draggedNode, fromNode);
            } else {
                e.diagram.__trtd.setNodeAsSibling(draggedNode, fromNode);
            }
        }
    }, // negate curviness if not clockwise
    $(go.Shape, {
        name: "SHAPE",
        stroke: "#767678",
        strokeWidth: 3
    }, new go.Binding("strokeWidth", "strokeWidth").makeTwoWay(), new go.Binding("stroke", "color").makeTwoWay(), new go.Binding("strokeDashArray", "strokeDashArray", function (v) {
        try {
            var val = [parseInt(v.split(" ")[0]), parseInt(v.split(" ")[1])];
        } catch (e) {
            var val = null;
        }
        return val;
    }).makeTwoWay(function (v) {
        return v[0] + " " + v[1];
    }) //保留，设置边线样式

    ), $(go.Shape, {
        name: "Arrow",
        toArrow: "Triangle",
        stroke: "#767678",
        strokeWidth: 3
    }, new go.Binding("strokeWidth", "strokeWidth"), new go.Binding("fill", "color"), new go.Binding("stroke", "color"), new go.Binding("toArrow", "toArrow")), new go.Binding("curviness", "curviness").makeTwoWay(), new go.Binding("points").makeTwoWay());
}

module.exports = createTianpanLink;

/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// require('./core/core.controller')(Trtd);
// import * as go from 'gojs';
var helpers = __webpack_require__(0);
var lang = __webpack_require__(12);
var createPictureSingleNodeTemplate = __webpack_require__(2);
// var createPictureNodeTemplate = require('../nodeTemplate/createPictureNodeTemplate')
var TRTD_BASE = __webpack_require__(10).Trtd;

var $ = go.GraphObject.make;

var Trtd = function (_TRTD_BASE) {
    _inherits(Trtd, _TRTD_BASE);

    function Trtd(div, config) {
        _classCallCheck(this, Trtd);

        var _this = _possibleConstructorReturn(this, (Trtd.__proto__ || Object.getPrototypeOf(Trtd)).call(this, div, config));

        _this.config = config;
        _this.modelChangedListener = config.modelChangedListener;
        _this.type = config.type;
        _this.diagram = {};
        _this.model = config.model;
        // this.tpid = config.tpid;
        _this.readOnly = false; // 控制是否只读
        if (config.readOnly != null) {
            _this.readOnly = config.readOnly;
        }
        _this.initDiagramBase(div, config); // 基类初始化diagram
        // 初始化diagram
        _this.diagram = _this.initDiagram(div, config);
        // this.diagram.__trtd = this;
        _this.initListener();
        // Then you will need to construct a Model (usually a GraphLinksModel) for the Diagram, initialize its data by setting its Model.nodeDataArray and other properties, and then set the diagram's model.
        if (_this.model) {
            _this.initModel();
        }
        return _this;
    }
    /**
     * method 初始化diagram
     * @param {*} div 
     * @param {*} config 
     */


    _createClass(Trtd, [{
        key: 'initDiagram',
        value: function initDiagram(div, config) {
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
                "animationManager.isEnabled": false
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
            return myDiagram;
        }
    }, {
        key: 'getTdData',
        value: function getTdData() {
            return this.diagram.model.toJson();
        }
        // 以下两个方法控制菜单显示

    }, {
        key: 'getDefaultCustomMenuDivStr',
        value: function getDefaultCustomMenuDivStr() {
            return '\n        <ul>\n            <li trtd_action="addFollowerGround"><a class="i18n" data-lang="insertsl">\u589E\u52A0\u540C\u7EA7\u8282\u70B9</a></li>\n            <li trtd_action="addNewCircle"><a class="i18n" data-lang="icn">\u589E\u52A0\u5B50\u8282\u70B9</a></li>\n            <li trtd_action="apiDeleteSelection"><a class="i18n" data-lang="remove">\u5220\u9664</a></li>\n        </ul>\n        ';
        }
    }, {
        key: 'getShowContextMenus',
        value: function getShowContextMenus(node) {
            if (node) {
                return "addFollowerGround," + "addNewCircle," + "apiDeleteSelection";
            } else {
                return "none";
            }
        }
    }, {
        key: 'addTextNode',
        value: function addTextNode(message) {
            console.log('eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee:');
            var myDiagram = this.diagram;
            myDiagram.startTransaction();
            var text = { text: message || lang.trans('blankText'), category: 'text' };
            text.loc = go.Point.stringify(myDiagram.lastInput.documentPoint);
            myDiagram.model.addNodeData(text);
            myDiagram.commitTransaction();
        }

        /**
         * method 初始化model
         */

    }, {
        key: 'initModel',
        value: function initModel(model) {
            if (model) {
                this.model = model;
            }
            console.log('initModel');
            var tmpModel = go.Model.fromJson(this.model);
            if (tmpModel.modelData.currentType == 'dipan') {
                tmpModel.nodeDataArray = tmpModel.nodeDataArray.filter(function (d) {
                    if (!d.isGroup) {
                        delete d.group;
                        return true;
                    }
                });
                // tmpModel.nodeDataArray = 
                tmpModel.linkDataArray = [];
            }

            this.diagram.layout.isInitial = false;
            //randomUrl(tmpModel);
            tmpModel.modelData.type = this.type;
            // tmpModel.modelData.version = Trtd.version
            this.diagram.model = tmpModel;
            // configModel(myDiagram.model);
            this.groundLayout(this.diagram);
            this.diagram.updateAllTargetBindings();
        }
    }, {
        key: 'loadModel',
        value: function loadModel(model) {

            this.initModel(model);
        }
        /**
         * method: 初始化监听方法
         */

    }, {
        key: 'initListener',
        value: function initListener() {
            console.log('initListener');
        }
        /**
         * 添加节点模板
         */

    }, {
        key: 'addNodeTemplate',
        value: function addNodeTemplate() {

            var that = this;
            var myDiagram = this.diagram;

            var globalProperties = this.tdGetModelData(null, myDiagram.model, myDiagram); //获取所有全局属性到一个对象中,从localstorage中
            //var layerThickness = myDiagram.model.modelData.layerThickness;
            var layerThickness = parseInt(globalProperties['layerThickness']);
            console.log(layerThickness);

            var tdDipanTextAngle = globalProperties['tdDipanTextAngle'];
            console.log(tdDipanTextAngle);
            myDiagram.nodeTemplateMap.add("dipan", this.createDipanTemplate(layerThickness, tdDipanTextAngle));
            myDiagram.nodeTemplateMap.add("Root", this.getDipanRootTemplate(layerThickness));
            myDiagram.nodeTemplateMap.add("3", createPictureSingleNodeTemplate(this.diagram));
            // myDiagram.nodeTemplateMap.add("4", createPictureNodeTemplate(this.diagram));
            // myDiagram.nodeTemplateMap.add("text", this.createTextNodeTemplate());
        }
    }, {
        key: 'createTextNodeTemplate',
        value: function createTextNodeTemplate() {
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
            }, new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify), new go.Binding("isShadowed", "isShadowed").makeTwoWay(), new go.Binding("angle", "angle").makeTwoWay(), new go.Binding("selectable", "selectable").makeTwoWay(), new go.Binding("layerName", "layerName", function (v, d) {
                return v ? v : "";
            }).makeTwoWay(function (v) {
                return v;
            }), $(go.Shape, {
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
                width: 150
            }, new go.Binding("strokeDashArray", "strokeDashArray", function (v) {
                return [v.split()[0], v.split()[1]];
            }).makeTwoWay(function (v) {
                return v[0] + " " + v[1];
            }), //保留，设置边线样式
            new go.Binding("fill", "fill", function (v, obj) {
                return v instanceof go.Brush ? v.color : v;
            }).makeTwoWay(),
            // new go.Binding("fill", "isSelected", function(s, obj) { return s ? "red" : obj.part.data.color; }).ofObject()),
            new go.Binding("width", "width", function (v) {
                //alert(v);
                return v;
            }).makeTwoWay(function (v) {
                return v;
            }), new go.Binding("height", "height", function (v) {
                //alert(v);
                return v;
            }).makeTwoWay(function (v) {
                return v;
            }), new go.Binding("stroke", "stroke", function (v) {
                return v instanceof go.Brush ? v.stroke : v;
            }).makeTwoWay(), new go.Binding("strokeWidth", "strokeWidth", function (d) {
                return d;
            }).makeTwoWay(function (d) {
                return d;
            }), new go.Binding("figure", "figure").makeTwoWay(), {
                figure: properties.figure,
                fill: properties.fill,
                strokeWidth: properties.strokeWidth,
                stroke: properties.stroke
            }), $(go.Shape, {
                name: "SHAPE_Back",
                figure: "Rectangle",
                fill: "rgba(0,0,0,0)",
                // fromLinkable: true,
                // toLinkable: true,
                strokeWidth: 0
            }, new go.Binding("width", "width", function (v) {
                return v;
            }).ofObject("SHAPE"), new go.Binding("height", "height", function (v) {
                return v;
            }).ofObject("SHAPE")), $(go.TextBlock, {
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
            }, new go.Binding("textAlign", "textAlign", function (v) {
                return _.contains(['start', 'center', 'end'], v) ? v : "center";
            }).makeTwoWay(), new go.Binding("spacingAbove", "spacingline", function (v) {
                return helpers.tdTransToNum(v, 4);
            }).makeTwoWay(), new go.Binding("spacingBelow", "spacingline", function (v) {
                return helpers.tdTransToNum(v, 4);
            }).makeTwoWay(), new go.Binding("width", "width", function (v) {
                return v;
            }).ofObject("SHAPE"),
            // new go.Binding("height", "height", function (v) {
            //   return v;
            // }).ofObject("SHAPE"),
            new go.Binding("text", "text").makeTwoWay(), new go.Binding("stroke", "textStroke").makeTwoWay(), new go.Binding("font", "font").makeTwoWay()));
        }

        /**
         * method 地盘模板
         * @param {*} layerThickness 
         * @param {*} tdDipanTextAngle 
         */

    }, {
        key: 'createDipanTemplate',
        value: function createDipanTemplate(layerThickness, tdDipanTextAngle) {
            console.log(layerThickness);
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
                click: function click(e, node) {
                    console.log(node.data);
                    if (that.readOnly) {
                        if (node.diagram.__trtd.nodeClickListener) {
                            node.diagram.__trtd.nodeClickListener(node);
                        }
                    }
                },
                contextMenu: this.getNodeContextMenu,
                movable: false,
                doubleClick: function doubleClick(e) {
                    console.log("that.readOnlythat.readOnly", that.readOnly);
                    if (that.readOnly) {
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
                    changeTemp2normal(myDiagram);
                },
                selectionAdorned: !that.readOnly,
                selectionAdornmentTemplate: $(go.Adornment, "Spot", $(go.Panel, "Auto", $(go.Shape, { fill: 'rgba(255,232,211,0.1)', stroke: "blue", strokeWidth: 2 }), $(go.Placeholder) // this represents the selected Node
                ),
                // the button to create a "next" node, at the top-right corner
                $("Button", {
                    alignment: go.Spot.RightCenter,
                    alignmentFocus: go.Spot.Bottom,
                    width: 30,
                    height: 30,

                    click: function click(e) {
                        console.log(e.diagram.selection.first().data);
                        console.log(e.diagram.selection.first().data.parent);
                        var node = e.diagram.selection.first();
                        if (node.data.parent) {
                            var parentNode = node.diagram.findNodeForKey(node.data.parent);
                            if (parentNode.data.istemp) {
                                return;
                            }
                        }
                        that.addNewCircle(e); // this function is defined below
                    }

                }, $(go.Shape, "PlusLine", { desiredSize: new go.Size(15, 15) })),
                // end button
                $("Button", {
                    alignment: go.Spot.BottomCenter,
                    width: 30,
                    height: 30,
                    //visible:function(d){
                    //    return !isUndefined(d.istemp)&&d.istemp?false:true;
                    //},
                    click: function click(e) {
                        console.log(e);
                        console.log(e.diagram.selection.first().data);
                        //判断临时节点
                        if (e.diagram.selection.first().data.istemp) {
                            return;
                        }

                        that.addFollowerGround(e);
                    } // this function is defined below

                }, $(go.Shape, "PlusLine", { desiredSize: new go.Size(15, 15) }))
                //备注
                ),
                mouseOver: function mouseOver(e, node) {},
                mouseLeave: function mouseLeave(e, node) {
                    //removeNodeRemarkTips();
                },
                mouseDragEnter: function mouseDragEnter(e, node, prev) {
                    return;
                },
                mouseDragLeave: function mouseDragLeave(e, node, next) {
                    return;
                },
                mouseDrop: function mouseDrop(e, node) {
                    return;
                }
            }, new go.Binding("angle", "dangle"), new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify), new go.Binding("selectionAdorned", "selectionAdorned", function (v, d) {
                console.log(v);
                return v ? v : "";
            }).makeTwoWay(function (v) {
                return v;
            }), $(go.Shape, {
                figure: "Rectangle",
                name: "MAIN",
                fill: "rgba(255,255,0,0)", // default value, but also data-bound
                strokeWidth: 0,
                stroke: "red",
                height: 1
            }, new go.Binding('width', 'layerThickness', function (data) {
                return parseInt(data || 100);
            })), $(go.Shape, {
                name: "SHAPE",
                fill: "lightgray", // default value, but also data-bound
                strokeWidth: 2,
                margin: 5,
                stroke: "green",
                alignment: go.Spot.Right,
                alignmentFocus: go.Spot.Right,
                portId: "" // so links will go to the shape, not the whole node
            }, new go.Binding("geometry", "", function (data) {
                return makeAnnularWedge(data);
            }), new go.Binding("fill", "fill", function (v) {
                return v instanceof go.Brush ? v.color : v;
            }).makeTwoWay(), new go.Binding("stroke", "stroke", function (v) {
                return v instanceof go.Brush ? v.stroke : v;
            }).makeTwoWay(), new go.Binding("strokeWidth", "strokeWidth", function (d) {
                return d;
            }).makeTwoWay(function (d) {
                return d;
            })), $(go.Shape, {
                figure: "Rectangle",
                name: "LOCATE",
                fill: "rgba(0,255,0,0)", // default value, but also data-bound
                strokeWidth: 0,
                stroke: "green",
                height: 20,
                alignment: go.Spot.Right,
                alignmentFocus: go.Spot.Right
            }, new go.Binding('width', 'layerThickness', function (data) {
                return parseInt(data || 100);
            })), $(go.TextBlock, {
                name: "TEXT",
                isMultiline: true,
                click: function click(e, node) {},
                textAlign: "center",
                editable: false,
                wrap: go.TextBlock.WrapDesiredSize,
                overflow: go.TextBlock.OverflowClip,
                spacingAbove: 4,
                spacingBelow: 4,
                font: "bold 15px 幼圆"
            }, new go.Binding("text").makeTwoWay(), new go.Binding("textAlign", "textAlign", function (v) {
                return _.contains(['start', 'center', 'end'], v) ? v : "center";
            }).makeTwoWay(), new go.Binding("spacingAbove", "spacingline", function (v) {
                return helpers.tdTransToNum(v, 4);
            }).makeTwoWay(), new go.Binding("spacingBelow", "spacingline", function (v) {
                return helpers.tdTransToNum(v, 4);
            }).makeTwoWay(), new go.Binding("stroke", "textStroke").makeTwoWay(), new go.Binding("font", "font").makeTwoWay(), new go.Binding("width", "", function (data, obj) {
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
            }), new go.Binding("angle", "textAngle").makeTwoWay(), new go.Binding('alignment', 'tdDipanTextAngle', function (data) {
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
            }), new go.Binding('alignmentFocus', 'tdDipanTextAngle', function (data) {
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
            })));
        }
    }, {
        key: 'getDipanRootTemplate',
        value: function getDipanRootTemplate(layerThickness) {
            var _this2 = this,
                _$;

            var that = this;
            return $(go.Node, "Auto", (_$ = {
                locationSpot: go.Spot.Center,
                selectionAdorned: true,
                movable: false,

                click: function click(e, node) {
                    //showNodeToolBar(e, node);
                    //showTempToolBar(e, node);
                    console.log(node.data);
                    if (that.readOnly) {
                        if (node.diagram.__trtd.nodeClickListener) {
                            node.diagram.__trtd.nodeClickListener(node);
                        }
                    }
                },
                doubleClick: function doubleClick(e) {
                    if (that.readOnly) {
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

                mouseOver: function mouseOver(e, node) {
                    //showNodeRemarkTips(e, node);

                },
                mouseLeave: function mouseLeave(e, node) {
                    //removeNodeRemarkTips();
                    //removeNodeToolBar();
                }
            }, _defineProperty(_$, 'selectionAdorned', !that.readOnly), _defineProperty(_$, 'selectionAdornmentTemplate', $(go.Adornment, "Spot", $(go.Panel, "Auto", $(go.Shape, { fill: 'rgba(255,232,211,0.1)', stroke: "blue", strokeWidth: 2 }), $(go.Placeholder) // this represents the selected Node
            ),
            // the button to create a "next" node, at the top-right corner
            $("Button", {
                alignment: go.Spot.RightCenter,
                alignmentFocus: go.Spot.Bottom,
                width: 30,
                height: 30,

                click: function click(e) {
                    console.log(e.diagram.selection.first().data);
                    console.log(e.diagram.selection.first().data.parent);
                    var node = e.diagram.selection.first();
                    if (node.data.parent) {
                        var parentNode = node.diagram.findNodeForKey(node.data.parent);
                        if (parentNode.data.istemp) {
                            return;
                        }
                    }
                    _this2.addNewCircle(e); // this function is defined below
                }

            }, $(go.Shape, "PlusLine", { desiredSize: new go.Size(15, 15) }))
            //备注

            )), _defineProperty(_$, 'location', new go.Point(0, 0)), _$), new go.Binding("width", "layerThickness", function (v) {
                return v ? v * 2 : 100 * 2;
            }), new go.Binding("height", "layerThickness", function (v) {
                return v ? v * 2 : 100 * 2;
            }), $(go.Shape, "Circle", {
                name: "SHAPE",
                fill: "#FFBFBF",
                strokeWidth: 0,
                // width: 100,
                // height: 100,
                spot1: go.Spot.TopLeft,
                spot2: go.Spot.BottomRight
            }, new go.Binding("fill", "fill", function (v) {
                return v instanceof go.Brush ? v.color : v;
            }).makeTwoWay(), new go.Binding("stroke", "stroke", function (v) {
                return v instanceof go.Brush ? v.stroke : v;
            }).makeTwoWay(), new go.Binding("strokeWidth", "strokeWidth", function (d) {
                return d;
            }).makeTwoWay(function (d) {
                return d;
            })), $(go.TextBlock, {
                name: "TEXT",
                font: "bold 23px 幼圆",
                textAlign: "center",
                editable: false,
                spacingAbove: 4,
                isMultiline: true,

                spacingBelow: 4
            }, new go.Binding("textAlign", "textAlign", function (v) {
                return _.contains(['start', 'center', 'end'], v) ? v : "center";
            }).makeTwoWay(), new go.Binding("spacingAbove", "spacingline", function (v) {
                return helpers.tdTransToNum(v, 4);
            }).makeTwoWay(), new go.Binding("spacingBelow", "spacingline", function (v) {
                return helpers.tdTransToNum(v, 4);
            }).makeTwoWay(), new go.Binding("text").makeTwoWay(), new go.Binding("stroke", "textStroke").makeTwoWay(), new go.Binding("width", "width").makeTwoWay(), new go.Binding("font", "font").makeTwoWay(), new go.Binding("angle", "textAngle").makeTwoWay()));
        }
    }, {
        key: 'tdGetModelData1',
        value: function tdGetModelData1(name, model, myDiagram1) {
            //获取盘的model.modelData中的全局属性 
            var defaultVal = {
                currentType: 'dipan',
                currentThemeID: 0,
                layerThickness: 100,
                splitLayer: 1,
                layout: 'inner',
                tdDipanTextAngle: 'xuanzhuan'
            };
            return Object.assign(defaultVal, model.modelData);
        }
    }, {
        key: 'tdGetModelData',
        value: function tdGetModelData(name, model) {
            //获取盘的model.modelData中的全局属性 
            // if(myDiagram1){
            //     myDiagram = myDiagram1
            // }
            var myDiagram = this.diagram;
            var model = myDiagram.model;
            var defaultVal = {
                currentType: 'tianpan',
                currentThemeID: 0,
                layerThickness: 100,
                splitLayer: 1,
                layout: 'inner',
                tdDipanTextAngle: 'xuanzhuan'
            };
            console.log("getRootNodeData1111111111111111111111");
            var root = getRootNodeData(model);
            if (typeof name != 'undefined' && name != null) {
                //返回指定的属性值
                if (root) {
                    return root[name] || model.modelData[name] || defaultVal[name];
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
    }, {
        key: 'deleteSelection',
        value: function deleteSelection() {
            // console.log("====================deleteSelection 优化")
            var myDiagram = this.diagram;
            var node = myDiagram.selection.first();
            console.log('\u5220\u9664\u8282\u70B9 ' + JSON.stringify(node.data));
            console.log(node.data);
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
            this.deleteNode(node, myDiagram);
            //removeOneNode(node); //zyy

            // console.log(myDiagram.model.nodeDataArray)
            // myDiagram.model.commitTransaction("sub");

            //统一删除节点
            var maxCircle = this.getMaxCircle(myDiagram);
            //找到所有要删除的节点
            var nodes = [];
            myDiagram.model.nodeDataArray.forEach(function (n) {
                if (n.level > maxCircle) {
                    //zyy 增加n.group!=="g_1"
                    nodes.push(n);
                }
            });
            // myDiagram.model.startTransaction("deleteTempNode");
            //删除所有只有临时节点的层级
            myDiagram.model.removeNodeDataCollection(nodes);
            //删除最外圈节点的isparent属性
            myDiagram.model.nodeDataArray.forEach(function (n) {
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
            var tempArray = ["next", "prev", "parent"];
            for (var i = 0; i < tempArray.length; i++) {
                if (node.data[tempArray[i]]) {
                    locateNode = myDiagram.findNodeForKey(node.data[tempArray[i]]);
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
    }, {
        key: 'deleteNode',
        value: function deleteNode(node) {
            console.log('删除节点 deleteNode');
            console.log(node.data.key);
            console.log(node.data);
            var myDiagram = this.diagram;
            var mainNode = null;
            var preNode = node.data.prev ? myDiagram.findNodeForKey(node.data.prev) : null;
            var nextNode = node.data.next ? myDiagram.findNodeForKey(node.data.next) : null;
            var parentNode = node.data.parent ? myDiagram.findNodeForKey(node.data.parent) : null;

            // try {
            // 如果有子节点，则删除所有子节点
            if (node.data.isparent) {
                var firstNode = myDiagram.findNodeForKey(node.data.isparent);
                var nodes = [];
                helpers.tdTravelTdpData(firstNode.data, myDiagram.model, nodes, function (data) {
                    return data;
                });
                myDiagram.model.removeNodeDataCollection(nodes);

                var maxCircles = this.getMaxCircle(myDiagram);
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

            if (myDiagram.model.modelData.currentType == 'dipan') {
                // 删除的只剩下root节点时对root节点做处理
                var totalCount = 0;
                for (var i = 0; i < myDiagram.model.nodeDataArray.length; i++) {
                    if (!myDiagram.model.nodeDataArray[i].istemp && !myDiagram.model.nodeDataArray[i].isGroup) {
                        totalCount++;
                    }
                    if (totalCount > 1) break;
                }
                if (totalCount <= 1) {
                    console.log("删除的只剩下root节点时对root节点做处理");
                    var dipanRoot = myDiagram.model.findNodeDataForKey(1);
                    delete dipanRoot.group;
                }
            }
            // } catch (ex) {
            //     console.log(ex.message);
            // }

            // }
            myDiagram.isModified = true;
        }
    }, {
        key: 'getMaxCircle',
        value: function getMaxCircle() {
            var myDiagram = this.diagram;
            var maxCircle = 0;
            var nodeArr = [];
            var nodeLevelArr = [];
            var maxNodeArr = [];
            var arr = [];
            myDiagram.model.nodeDataArray.forEach(function (d) {
                if (!d.istemp && !d.isGroup) {
                    nodeArr.push(d);
                    if (d.level) {
                        nodeLevelArr.push(d.level);
                    }
                } else {
                    arr.push(d);
                }
            });
            var max = Math.max.apply(null, nodeLevelArr);
            // console.log(max)
            nodeArr.forEach(function (node) {
                if (node.level === max) {
                    maxNodeArr.push(node);
                }
            });
            if (max === -Infinity && maxNodeArr.length === 0) {
                console.log("11111111111111");
                maxCircle = 0;
            } else if (max !== -Infinity && maxNodeArr.length === 0) {
                maxCircle = max - 1;
            } else if (maxNodeArr.length > 0) {
                maxCircle = max;
            }
            // console.log("maxCircle")
            // console.log(maxCircle)
            return maxCircle;
        }
    }, {
        key: 'addNewCircle',
        value: function addNewCircle(e) {
            var myDiagram = this.diagram;
            var maxCircles = this.getMaxCircle();
            var node = myDiagram.selection.first();
            console.log(node.data);
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

    }, {
        key: 'addChildNodeData',
        value: function addChildNodeData(node) {
            // 去掉连线和group
            console.log("===================================addChildNodeData:去掉连线和group、主题");
            var isautolayout = window.localStorage.getItem('isautolayout') == null ? true : window.localStorage.getItem('isautolayout') == 'true';
            // var isautoselect =  window.localStorage.getItem('isautoselect') == null?true:window.localStorage.getItem('isautoselect') == 'true';
            var myDiagram = node.diagram;
            var result = arguments[1] ? arguments[1] : null;
            var currentType = 'dipan';
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
                firstNode = myDiagram.model.findNodeDataForKey(node.data.isparent);
                if (firstNode) {
                    follower.next = firstNode.key;
                    myDiagram.model.setDataProperty(firstNode, "prev", follower.key);
                }
            }

            if (result != null) {
                //只是用来填充的节点
                follower.istemp = true;
                follower.text = "";
            }

            var sectotLayerThickNess = myDiagram.model.modelData.layerThickness;
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
            follower = applyTheme2Node(follower, myDiagram);
            follower.font = node.data.font;
            follower.textStroke = node.findObject("TEXT").stroke;
            myDiagram.model.setDataProperty(node.data, "isparent", nextkey);
            follower.newAdd = true;
            myDiagram.model.addNodeData(follower, myDiagram);
            myDiagram.isModified = true;
            return follower;
        }
    }, {
        key: 'addFollowerGround',
        value: function addFollowerGround(e) {
            var myDiagram = this.diagram;
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
    }, {
        key: 'addLevelNodeData',
        value: function addLevelNodeData(node) {
            console.log("======================去掉天盘");
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
            if (toKey) {
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
    }, {
        key: 'moveWithinNodes',
        value: function moveWithinNodes(direction) {
            var myDiagram = this.diagram;
            var node = myDiagram.selection.first();
            if (!node) {
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
    }, {
        key: 'selectText',
        value: function selectText(e) {
            var myDiagram = this.diagram;
            var node = myDiagram.selection.first();
            if (!node) return;
            // removeNodeRemarkTips();
            var tb = myDiagram.selection.first().findObject('TEXT');
            if (tb) myDiagram.commandHandler.editTextBlock(tb);
            helpers.simulateEnterWithAlt(e);
        }

        // 地盘布局

    }, {
        key: 'groundLayout',
        value: function groundLayout(myDiagram) {
            // var dipaninteractions = require('./dipan');
            // var addChildNodeData = this.addChildNodeData
            var myDiagram = this.diagram;
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
                helpers.tdTravelTdpData(root.data, model, [], function (d) {
                    if (d.level < maxCircles && typeof d.isparent == 'undefined') {
                        var followerNode = myDiagram.findNodeForKey(d.key);
                        that.addChildNodeData(followerNode, "temp");
                    }
                });
                changeLayout();
            } else if (layout == 'inner') {
                radialLayout(root, myDiagram);
                // myDiagram.model.modelData.splitLayer = 1
                // splitLayer = 1
                // splitRadlayout(null, myDiagram.model, splitLayer);
            } else {
                splitLayer = myDiagram.model.modelData.splitLayer ? myDiagram.model.modelData.splitLayer : splitLayer;
                splitRadlayout(null, myDiagram.model, splitLayer);
            }
            // setSourceOfPicture(null, 1); //重新计算背景图片宽高

            function radialLayout(root, myDiagram) {
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

                myDiagram.nodes.each(function (n) {
                    n.data._laid = false;
                });

                // now recursively position nodes, starting with the root
                root.location = new go.Point(0, 0);
                maxCircles = that.getMaxCircle(myDiagram);
                radlay1(root, 1, 90, 360, layerThickness, tdDipanTextAngle, myDiagram);
                root.diagram.commitTransaction("radial layout");
            }

            function radlay1(node, layer, angle, sweep, layerThickness, tdDipanTextAngle, myDiagram) {
                // var dipaninteractions = require('./dipan');
                var addChildNodeData = that.addChildNodeData;
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
                        radlay1(n, layer + 1, n.data.dangle, n.data.sweep, layerThickness, tdDipanTextAngle, myDiagram);
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
                        label.angle = a > 90 && a < 270 || a < -90 ? 180 : 0;
                        //n.diagram.model.setDataProperty(n.data, "textAngle", label.angle);
                        if (tdDipanTextAngle == 'xuanzhuan') {
                            //文字方向旋转
                            n.diagram.model.setDataProperty(n.data, "textAngle", label.angle);
                        }
                        if (tdDipanTextAngle == 'fangshe') {
                            //文字方向旋转
                            n.diagram.model.setDataProperty(n.data, "textAngle", 90);
                        }
                        if (tdDipanTextAngle == 'zhengli') {
                            //文字方向正向
                            n.diagram.model.setDataProperty(n.data, "textAngle", -a);
                        }
                        // console.log("text:"+n.data.text+",textangle:"+n.data.textAngle+";nodeAngle="+a  );
                    }
                    if (n.data.key == "1") {
                        n.diagram.model.setDataProperty(n.data, "textAngle", 0);
                    }
                    radlay1(n, layer + 1, a, sweep / found, layerThickness, tdDipanTextAngle, myDiagram);
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
                model.nodeDataArray.forEach(function (d) {
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

                helpers.tdTravelTdpData(firstChild, model, collector, function (d) {
                    return d;
                });
                var tmpArray;

                for (var level = 1; level <= maxCircle; level++) {
                    tmpArray = _.filter(collector, function (item) {
                        return !item.isGroup && item.level == level;
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
                        var tmpAngle = a > 90 && a < 270 || a < -90 ? 180 : 0;
                        //if(a>80 && a < 100){
                        //    label.angle = -a;
                        //}
                        if (tdDipanTextAngle == 'xuanzhuan') {
                            //文字方向旋转
                            model.setDataProperty(data, "textAngle", tmpAngle);
                        }
                        if (tdDipanTextAngle == 'fangshe') {
                            //文字方向旋转
                            var tmpAngle = a > 0 && a < 180 || a < -180 ? 180 : 0;
                            model.setDataProperty(data, "textAngle", 90);

                            // label.width = 100;
                        }
                        //}
                        if (tdDipanTextAngle == 'zhengli') {
                            //文字方向正向
                            model.setDataProperty(data, "textAngle", -a);
                        }
                    }
                }

                // 指定层均分会调用内圈均分的函数
                console.log();
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
                        model.nodeDataArray.forEach(function (d) {
                            if (isAll) {
                                flag = d.level >= level;
                            } else {
                                flag = d.level == level;
                            }
                            if (!_.has(d, 'isGroup') && flag) {
                                result.count += 1;
                                result.list.push(d);
                            }
                        });
                    } else {
                        //var result = 0;
                        if (nodeData.isparent) {
                            var firstChild = model.findNodeDataForKey(nodeData.isparent);
                        } else {
                            return result;
                        }
                        helpers.tdTravelTdpData(firstChild, model, [], function (d) {
                            if (isAll) {
                                flag = d.level >= level;
                            } else {
                                flag = d.level == level;
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

    }, {
        key: 'dokeyDownFnq',
        value: function dokeyDownFnq(diagram) {
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

            if (e.event.keyCode === 13) {
                // could also check for e.control or e.shift
                if (node && node.data.category == 'Root') {
                    this.addFollowerGround();
                } else if (node && node.data.category == 'dipan') {
                    this.addFollowerGround();
                }
            } else if (e.event.keyCode === 9) {
                // could also check for e.control or e.shift
                if (node && node.data.category == 'Root') {

                    this.addNewCircle();
                } else if (node && node.data.category == 'dipan') {
                    this.addNewCircle();
                }
            } else if (e.key === "t") {
                // could also check for e.control or e.shift
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
            } else if (e.event.keyCode == 113) {
                //F2,覆盖地盘默认行为
                this.selectText();
            } else if (e.event.keyCode == 37) {
                //左
                this.moveWithinNodes('left');
            } else if (e.event.keyCode == 38) {
                //上
                this.moveWithinNodes('up');
            } else if (e.event.keyCode == 39) {
                //右
                this.moveWithinNodes('right');
            } else if (e.event.keyCode == 40) {
                //下
                this.moveWithinNodes('down');
            } else {
                // call base method with no arguments
                go.CommandHandler.prototype.doKeyDown.call(cmd);
            }
            e.bubbles = false; //阻止事件冒泡到dom
        }

        // 生成base64图片

    }, {
        key: 'downloadImage',
        value: function downloadImage() {
            var myDiagram = this.diagram;
            var imgdata = myDiagram.makeImageData({
                scale: 1.0,
                background: "#ffffff",
                type: "image/png",
                maxSize: new go.Size(9000, 9000)
            });

            return imgdata;
        }
    }]);

    return Trtd;
}(TRTD_BASE);

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
    var coll = new go.Set();
    var node = parts.first();
    if (node) {
        helpers.travelParts(node, function (p) {
            coll.add(p);
        });
    } else {
        coll.addAll(parts);
    }
    var tool = this;

    return go.DraggingTool.prototype.computeEffectiveCollection.call(this, coll);
};

function applyTheme2Node(follower, myDiagram) {
    var tdCurrentTheme = myDiagram.__trtd.tdCurrentTheme;
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
    var geo = new go.Geometry().add(new go.PathFigure(p.x, p.y).add(new go.PathSegment(go.PathSegment.Arc, -sweep / 2, sweep, 0, 0, radius + layerThickness, radius + layerThickness)).add(new go.PathSegment(go.PathSegment.Line, q.x, q.y)).add(new go.PathSegment(go.PathSegment.Arc, sweep / 2, -sweep, 0, 0, radius, radius).close()));
    geo.normalize();
    return geo;
}

function getRootNodeData(model) {
    var root = null;
    root = model.nodeDataArray.find(function (o) {
        if (!o.isGroup && o.category == "Root" && o.level == 0) {
            return true;
        }
    });

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

/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Trtd_tianpan = __webpack_require__(4);
var createNodeTemplate = __webpack_require__(7);
var createPictureSingleNodeTemplate = __webpack_require__(2);
var createPictureNodeTemplate = __webpack_require__(5);
var createTextNodeTemplate = __webpack_require__(3);
var createNodeSvgTemplate = __webpack_require__(6);

var Trtd = function (_Trtd_tianpan) {
    _inherits(Trtd, _Trtd_tianpan);

    function Trtd(div, config) {
        _classCallCheck(this, Trtd);

        return _possibleConstructorReturn(this, (Trtd.__proto__ || Object.getPrototypeOf(Trtd)).call(this, div, config));
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


    _createClass(Trtd, [{
        key: 'addNodeTemplate',
        value: function addNodeTemplate() {

            // myDiagram.nodeTemplateMap.add("dipan", this.createDipanTemplate(layerThickness,tdDipanTextAngle));
            // myDiagram.nodeTemplateMap.add("Root", this.getDipanRootTemplate(layerThickness));
            // myDiagram.nodeTemplateMap.add("text", );
            var myDiagram = this.diagram;
            myDiagram.nodeTemplateMap.add("0", createNodeTemplate(this.diagram));
            myDiagram.nodeTemplateMap.add("1", createNodeTemplate(this.diagram));
            myDiagram.nodeTemplateMap.add("2", createNodeTemplate(this.diagram));
            myDiagram.nodeTemplateMap.add("3", createPictureSingleNodeTemplate(this.diagram));
            myDiagram.nodeTemplateMap.add("4", createPictureNodeTemplate(this.diagram));
            myDiagram.nodeTemplateMap.add("text", createTextNodeTemplate(this.diagram));
            myDiagram.nodeTemplateMap.add("", createNodeTemplate(this.diagram));

            myDiagram.nodeTemplateMap.add("8", createNodeSvgTemplate(this.diagram));
        }
    }]);

    return Trtd;
}(Trtd_tianpan);

// export default Trtd;


module.exports = Trtd;

/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Trtd_tianpan = __webpack_require__(4);
var createNodeTemplate = __webpack_require__(7);
var createPictureSingleNodeTemplate = __webpack_require__(2);
var createPictureNodeTemplate = __webpack_require__(5);
var createTextNodeTemplate = __webpack_require__(3);
var createNodeSvgTemplate = __webpack_require__(6);

var Trtd = function (_Trtd_tianpan) {
    _inherits(Trtd, _Trtd_tianpan);

    function Trtd(div, config) {
        _classCallCheck(this, Trtd);

        return _possibleConstructorReturn(this, (Trtd.__proto__ || Object.getPrototypeOf(Trtd)).call(this, div, config));
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


    _createClass(Trtd, [{
        key: 'addNodeTemplate',
        value: function addNodeTemplate() {

            // myDiagram.nodeTemplateMap.add("dipan", this.createDipanTemplate(layerThickness,tdDipanTextAngle));
            // myDiagram.nodeTemplateMap.add("Root", this.getDipanRootTemplate(layerThickness));
            // myDiagram.nodeTemplateMap.add("text", );
            var myDiagram = this.diagram;
            myDiagram.nodeTemplateMap.add("0", createNodeTemplate(this.diagram));
            myDiagram.nodeTemplateMap.add("1", createNodeTemplate(this.diagram));
            myDiagram.nodeTemplateMap.add("2", createNodeTemplate(this.diagram));
            myDiagram.nodeTemplateMap.add("3", createPictureSingleNodeTemplate(this.diagram));
            myDiagram.nodeTemplateMap.add("4", createPictureNodeTemplate(this.diagram));
            myDiagram.nodeTemplateMap.add("text", createTextNodeTemplate(this.diagram));
            myDiagram.nodeTemplateMap.add("", createNodeTemplate(this.diagram));

            myDiagram.nodeTemplateMap.add("8", createNodeSvgTemplate(this.diagram));
        }
    }]);

    return Trtd;
}(Trtd_tianpan);

// export default Trtd;


module.exports = Trtd;

/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Trtd_tianpan = __webpack_require__(4);
var createNodeTemplate = __webpack_require__(7);
var createPictureSingleNodeTemplate = __webpack_require__(2);
var createPictureNodeTemplate = __webpack_require__(5);
var createTextNodeTemplate = __webpack_require__(3);
var createNodeSvgTemplate = __webpack_require__(6);

var Trtd = function (_Trtd_tianpan) {
    _inherits(Trtd, _Trtd_tianpan);

    function Trtd(div, config) {
        _classCallCheck(this, Trtd);

        return _possibleConstructorReturn(this, (Trtd.__proto__ || Object.getPrototypeOf(Trtd)).call(this, div, config));
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


    _createClass(Trtd, [{
        key: 'addNodeTemplate',
        value: function addNodeTemplate() {
            var myDiagram = this.diagram;

            myDiagram.nodeTemplateMap.add("0", createNodeTemplate(this.diagram));
            myDiagram.nodeTemplateMap.add("1", createNodeTemplate(this.diagram));
            myDiagram.nodeTemplateMap.add("2", createNodeTemplate(this.diagram));
            myDiagram.nodeTemplateMap.add("3", createPictureSingleNodeTemplate(this.diagram));
            myDiagram.nodeTemplateMap.add("4", createPictureNodeTemplate(this.diagram));
            myDiagram.nodeTemplateMap.add("text", createTextNodeTemplate(this.diagram));
            myDiagram.nodeTemplateMap.add("", createNodeTemplate(this.diagram));

            myDiagram.nodeTemplateMap.add("8", createNodeSvgTemplate(this.diagram));
        }
    }]);

    return Trtd;
}(Trtd_tianpan);

// export default Trtd;


module.exports = Trtd;

/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Trtd_tianpan = __webpack_require__(4);
var $ = go.GraphObject.make;

// var createNodeTemplate = require('../nodeTemplate/createNodeTemplate')
var createPictureSingleNodeTemplate = __webpack_require__(2);
var createPictureNodeTemplate = __webpack_require__(5);
var createTextNodeTemplate = __webpack_require__(3);
var createNodeSvgTemplate = __webpack_require__(6);

var Trtd = function (_Trtd_tianpan) {
    _inherits(Trtd, _Trtd_tianpan);

    function Trtd(div, config) {
        _classCallCheck(this, Trtd);

        var _this = _possibleConstructorReturn(this, (Trtd.__proto__ || Object.getPrototypeOf(Trtd)).call(this, div, config));

        _this.initDiagramYun(div, config);
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
        return _this;
    }

    _createClass(Trtd, [{
        key: 'initDiagramYun',
        value: function initDiagramYun(div, config) {
            var _this2 = this;

            // this.diagram.contextMenu = ()=>{
            //     var that = this
            //     return getYunpanNodeContextMenu;
            // },
            var myDiagram = this.diagram;
            var defaultConfig = {
                contextMenu: this.getYunpanNodeContextMenu,
                "animationManager.isEnabled": false
            };
            this.diagram.commandHandler.doKeyDown = function () {
                var that = _this2;
                return yunpanDokeyDownFn(that);
            };
            var diagramConfig = Object.assign(defaultConfig, config.diagramConfig);
            this.diagram.setProperties(diagramConfig);
            this.addNodeTemplate();
            return myDiagram;
        }
        /**
        * 添加节点模板
        */

    }, {
        key: 'addNodeTemplate',
        value: function addNodeTemplate() {

            var that = this;
            var myDiagram = this.diagram;
            myDiagram.nodeTemplateMap.add("yunpanx", createNodeTemplatex(that));
            myDiagram.nodeTemplateMap.add("yunpany", createNodeTemplatey(that));
            myDiagram.nodeTemplateMap.add("y", yTemplate(that));
            myDiagram.nodeTemplateMap.add("x", yTemplate(that));
            myDiagram.nodeTemplateMap.add("ytext", tTemplate());
            myDiagram.nodeTemplateMap.add("xtext", tTemplate());
            myDiagram.nodeTemplateMap.add("LogicXor", LogicXor(that));
            myDiagram.nodeTemplateMap.add("addtextTemplate", addtextTemplate());
        }
    }]);

    return Trtd;
}(Trtd_tianpan);

// 返回云盘(轴)


function createNodeTemplatex(that) {
    return $(go.Node, "Vertical", {
        movable: false,
        //allowMove:false,
        //selectable:false,
        locationSpot: go.Spot.Bottom,
        location: new go.Point(0, 0),
        //locationObjectName: "LINE",
        angle: 90,
        click: function click(e, node) {
            console.log(node.data);

            //  yunpanmune(e, node)
        },
        //selectionAdorned:false,//取消选择的默认边框
        selectionAdornmentTemplate: function () {
            var $ = go.GraphObject.make;

            return $(go.Adornment, "Spot", $(go.Panel, "Auto", $(go.Shape, {
                figure: "Linev",
                // fill: 'rgba(255,0,120,0.2)', 
                fill: "blue",
                stroke: "blue",
                strokeWidth: 2

            }), $(go.Shape, {
                // geometry: go.Geometry.parse("m 8,0 l -8,4 8,4 0,-1 -6,-3 6,-3 0,-1 z", false).rotate(90),
                geometry: go.Geometry.parse("M584.641736 896S299.62889 148.827862 0-128c0 0 413.707108 34.128461 584.641736 212.37111 0 0 163.261205-185.842992 584.641735-212.37111 0 0-486.056523 686.369398-584.641735 1024z", true).rotate(180).scale(0.0117, 0.0117),
                fill: "blue",
                stroke: "blue",
                strokeWidth: 0,
                alignment: new go.Spot(0.5, 0, 0, 0)
            }), $(go.Placeholder) // this represents the selected Node

            ));
        }(),

        //  contextMenu: function(e,node){
        //     var diagram = node.diagram;
        //     console.log("node.data",node)
        //     console.log("node.datanode.datanode.datanode.data")
        //     interactions.nodeContextMenu
        //     //diagram.model.setDataProperty(node.data, "stroke","blue");  
        // },
        contextMenu: getYunpanNodeContextMenu,

        mouseEnter: function mouseEnter(e, node) {
            var diagram = node.diagram;
            //diagram.model.setDataProperty(node.data, "stroke","blue");  
        },
        mouseLeave: function mouseLeave(e, node) {
            //console.log(node.data)
            var diagram = e.diagram;
            //diagram.model.setDataProperty(node.data, "stroke","#8799c4");
        }
    }, new go.Binding("angle", "angle").makeTwoWay(), new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify), new go.Binding("selectable", "selectable").makeTwoWay(),
    // 箭头  
    $(go.Shape, {
        // shape: "BackwardV",
        // "m 8,0 l -8,4 8,4 0,-1 -6,-3 6,-3 0,-1 z"
        // figure: "Backward",
        geometry: go.Geometry.parse("M584.641736 896S299.62889 148.827862 0-128c0 0 413.707108 34.128461 584.641736 212.37111 0 0 163.261205-185.842992 584.641735-212.37111 0 0-486.056523 686.369398-584.641735 1024z", true).rotate(180).scale(0.0117, 0.0117),
        fill: "rgb(135,153,196)",
        stroke: "#8799c4",
        strokeWidth: 0,
        strokeDashArray: [0, 0]
    }, new go.Binding("stroke", "stroke").makeTwoWay(), new go.Binding("fill", "stroke").makeTwoWay()),
    // 坐标 
    $(go.Shape, {
        name: 'LINE',
        figure: "Linev",
        //geometryString:geometryString,
        //geometry: Y_geometry,
        //fill: "#8799c4",
        stroke: "#8799c4",
        strokeWidth: 2,

        strokeDashArray: [4, 2]
        // position: new go.Point(0, 0)
        // desiredSize: new go.Size(10, 100)
    },
    //new go.Binding("fill", "fill").makeTwoWay(),
    new go.Binding("stroke", "stroke").makeTwoWay(), new go.Binding("strokeDashArray", "strokeDashArray").makeTwoWay(), new go.Binding("geometryString", "geometryString").makeTwoWay(), new go.Binding("strokeWidth", "strokeWidth").makeTwoWay(),
    // new go.Binding("stroke", "isSelected", function(sel,node) {
    //     console.log("2333")
    //     if (sel) return "red"; else return "stroke";

    // }).ofObject("")
    new go.Binding("stroke", "stroke", function (v) {
        return v instanceof go.Brush ? v.stroke : v;
    }).makeTwoWay()));
}
function createNodeTemplatey(that) {
    return $(go.Node, "Vertical", {
        movable: false,
        //allowMove:false,
        //selectable:false,
        locationSpot: go.Spot.Bottom,
        location: new go.Point(0, 0),
        //locationObjectName: "LINE",
        // angle: 0,
        click: function click(e, node) {
            console.log(node.data);

            //  yunpanmune(e, node)
        },
        //selectionAdorned:false,//取消选择的默认边框
        selectionAdornmentTemplate: function () {
            var $ = go.GraphObject.make;

            return $(go.Adornment, "Spot", $(go.Panel, "Auto", $(go.Shape, {
                figure: "Linev",
                fill: 'rgba(255,0,120,0.2)',
                stroke: "blue",
                strokeWidth: 2
            }), $(go.Shape, {
                // geometry: go.Geometry.parse("m 8,0 l -8,4 8,4 0,-1 -6,-3 6,-3 0,-1 z", false).rotate(90),
                geometry: go.Geometry.parse("M584.641736 896S299.62889 148.827862 0-128c0 0 413.707108 34.128461 584.641736 212.37111 0 0 163.261205-185.842992 584.641735-212.37111 0 0-486.056523 686.369398-584.641735 1024z", true).rotate(180).scale(0.0117, 0.0117),
                fill: "blue",
                stroke: "blue",
                strokeWidth: 0,
                alignment: new go.Spot(0.5, 0, 0, 0)
            }), $(go.Placeholder) // this represents the selected Node
            ));
        }(),

        //  contextMenu: function(e,node){
        //     var diagram = node.diagram;
        //     console.log("node.data",node)
        //     console.log("node.datanode.datanode.datanode.data")
        //     interactions.nodeContextMenu
        //     //diagram.model.setDataProperty(node.data, "stroke","blue");  
        // },
        contextMenu: getYunpanNodeContextMenu,
        mouseEnter: function mouseEnter(e, node) {
            var diagram = node.diagram;
            //diagram.model.setDataProperty(node.data, "stroke","blue");  
        },
        mouseLeave: function mouseLeave(e, node) {
            //console.log(node.data)
            var diagram = e.diagram;
            //diagram.model.setDataProperty(node.data, "stroke","#8799c4");
        }
    }, new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify), new go.Binding("selectable", "selectable").makeTwoWay(),
    // 箭头  
    $(go.Shape, {
        geometry: go.Geometry.parse("M584.641736 896S299.62889 148.827862 0-128c0 0 413.707108 34.128461 584.641736 212.37111 0 0 163.261205-185.842992 584.641735-212.37111 0 0-486.056523 686.369398-584.641735 1024z", true).rotate(180).scale(0.0117, 0.0117),
        fill: "rgb(135,153,196)",
        stroke: "#8799c4",
        strokeWidth: 0,
        strokeDashArray: [0, 0]
    }, new go.Binding("stroke", "stroke").makeTwoWay(), new go.Binding("fill", "stroke").makeTwoWay()),
    // 坐标 
    $(go.Shape, {
        name: 'LINE',
        figure: "Linev",
        stroke: "#8799c4",
        strokeWidth: 2,
        strokeDashArray: [4, 2]
    }, new go.Binding("stroke", "stroke").makeTwoWay(), new go.Binding("strokeDashArray", "strokeDashArray").makeTwoWay(), new go.Binding("geometryString", "geometryString").makeTwoWay(), new go.Binding("strokeWidth", "strokeWidth").makeTwoWay(), new go.Binding("stroke", "stroke", function (v) {
        return v instanceof go.Brush ? v.stroke : v;
    }).makeTwoWay()));
}

// 返回云盘(xy坐标轴)
function yTemplate(that) {
    var $ = go.GraphObject.make;
    return $(go.Node, "Vertical", {
        movable: false,
        locationSpot: go.Spot.Bottom,
        location: new go.Point(0, 0),
        //locationObjectName: "LINE",
        angle: 0,
        //selectionAdorned:false,//取消选择的默认边框
        //desiredSize: new go.Size(400, 800),
        click: function click(e, node) {
            console.log(node.data);
        },
        //点击
        selectionAdornmentTemplate: function () {
            var $ = go.GraphObject.make;
            return $(go.Adornment, "Spot", $(go.Panel, "Auto", $(go.Shape, {
                figure: "Linev",
                // fill: 'rgba(255,0,120,0.2)', 
                fill: "blue",
                stroke: "blue",
                strokeWidth: 2
            }), $(go.Shape, {
                geometry: go.Geometry.parse("M584.641736 896S299.62889 148.827862 0-128c0 0 413.707108 34.128461 584.641736 212.37111 0 0 163.261205-185.842992 584.641735-212.37111 0 0-486.056523 686.369398-584.641735 1024z", true).rotate(180).scale(0.0117, 0.0117),
                // fill: 'rgba(255,0,120,0.2)', 
                fill: "blue",
                stroke: "blue",
                strokeWidth: 2,
                alignment: new go.Spot(0.5, 0, 0, 0)
            }), $(go.Placeholder) // this represents the selected Node

            ));
        }(),
        // contextClick:function(e, node) {
        //     addaxis(e, node)
        // },
        mouseHover: function mouseHover(e, node) {
            // that.showNodeRemarkTips(e, node);
        },
        mouseEnter: function mouseEnter(e, node) {
            var diagram = node.diagram;
            diagram.model.setDataProperty(node.data, "stroke", "blue");
            diagram.model.setDataProperty(node.data, "fill", "blue");
        },
        mouseLeave: function mouseLeave(e, node) {
            //console.log(node.data)
            var diagram = node.diagram;

            that.removeNodeRemarkTips();

            diagram.model.setDataProperty(node.data, "stroke", "#8799c4");
            diagram.model.setDataProperty(node.data, "fill", "#8799c4");
            //removeNodeRemarkTips()   
        }
    }, new go.Binding("angle", "angle").makeTwoWay(), new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
    // 箭头  
    $(go.Shape, {
        // shape: "BackwardV",
        // "m 8,0 l -8,4 8,4 0,-1 -6,-3 6,-3 0,-1 z"
        //figure: "BackwardV",
        geometry: go.Geometry.parse("M584.641736 896S299.62889 148.827862 0-128c0 0 413.707108 34.128461 584.641736 212.37111 0 0 163.261205-185.842992 584.641735-212.37111 0 0-486.056523 686.369398-584.641735 1024z", true).rotate(180).scale(0.0117, 0.0117),
        fill: "#8799c4",
        stroke: "#8799c4"
        // strokeWidth: 0,
        // strokeDashArray: [0, 0],
        // position: new go.Point(-6, -1)
    }, new go.Binding("fill", "fill").makeTwoWay(), new go.Binding("stroke", "stroke").makeTwoWay(), new go.Binding("strokeWidth", "strokeWidth").makeTwoWay()),
    // 坐标 
    $(go.Shape, {
        name: 'LINE',
        //geometry: Y_geometry,
        width: 0,
        height: 1000,
        fill: "#8799c4",
        stroke: "#8799c4",
        strokeWidth: 2

        //strokeDashArray: [4, 2],
        // position: new go.Point(0, 0)
        // desiredSize: new go.Size(10, 100)
    }, new go.Binding("height", "height").makeTwoWay(), new go.Binding("fill", "fill").makeTwoWay(), new go.Binding("stroke", "stroke").makeTwoWay(), new go.Binding("strokeDashArray", "strokeDashArray").makeTwoWay(), new go.Binding("strokeWidth", "strokeWidth").makeTwoWay()));
}

//返回云盘文本
function tTemplate() {
    var _$;

    var $ = go.GraphObject.make;
    return $(go.Node, "Vertical", {
        movable: false,
        //locationSpot:locationSpot,
        //locationSpot: go.Spot.Right,
        selectionAdorned: false, //取消选择的默认边框
        click: function click(e, node) {
            // showNodeToolBar(e,node);
            console.log(node.data);
        }

    },
    //("locationSpot", "locationSpot",node.data.group > 0 ? "go.Spot.Right":"go.Spot.Top").makeTwoWay(),
    //new go.Binding("locationSpot", "locationSpot",function(v,node)),
    new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify), new go.Binding("locationSpot", "dir", function (d) {
        return spotConverter(d, false);
    }), $(go.Panel, "Vertical",
    //{ width: 100, defaultStretch: go.GraphObject.None },
    $(go.TextBlock, (_$ = {
        name: "TEXT",
        alignment: new go.Spot(0, 1),
        // font: "bold 14px arial,",
        font: "14px 微软雅黑",
        width: 70,
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
        isMultiline: false, //单行
        // margin: 10, 
        margin: 0,
        stroke: "black"
    }, _defineProperty(_$, 'isMultiline', true), _defineProperty(_$, 'alignment', go.Spot.Right), _defineProperty(_$, 'portId', "TEXT"), _defineProperty(_$, 'stretch', go.GraphObject.Fill), _$), new go.Binding("text", "text").makeTwoWay(), new go.Binding("stroke", "textStroke").makeTwoWay(), new go.Binding("font", "font").makeTwoWay(), new go.Binding("margin", "margin").makeTwoWay())));
}

function spotConverter(dir, from) {
    if (dir === "right") {
        return go.Spot.Right;
    } else if (dir === "top") {
        return go.Spot.Top;
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
        click: function click(e, node) {
            console.log(node.data);
            // showNodeToolBar(e,node);
        },
        layoutConditions: go.Part.LayoutStandard,
        alignment: go.Spot.Center,
        alignmentFocus: go.Spot.Center
    }, new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify), new go.Binding("isShadowed", "isShadowed").makeTwoWay(), new go.Binding("angle", "angle").makeTwoWay(), new go.Binding("selectable", "selectable").makeTwoWay(), new go.Binding("layerName", "layerName", function (v, d) {
        return v ? v : "";
    }).makeTwoWay(function (v) {
        return v;
    }), $(go.Shape, {
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
    }, new go.Binding("strokeDashArray", "strokeDashArray", function (v) {
        return [v.split()[0], v.split()[1]];
    }).makeTwoWay(function (v) {
        return v[0] + " " + v[1];
    }), //保留，设置边线样式
    new go.Binding("fill", "fill", function (v, obj) {
        return v instanceof go.Brush ? v.color : v;
    }).makeTwoWay(),
    // new go.Binding("fill", "isSelected", function(s, obj) { return s ? "red" : obj.part.data.color; }).ofObject()),
    new go.Binding("width", "width", function (v) {
        //alert(v);
        return v;
    }).makeTwoWay(function (v) {
        return v;
    }), new go.Binding("height", "height", function (v) {
        //alert(v);
        return v;
    }).makeTwoWay(function (v) {
        return v;
    }), new go.Binding("stroke", "stroke", function (v) {
        return v instanceof go.Brush ? v.stroke : v;
    }).makeTwoWay(), new go.Binding("strokeWidth", "strokeWidth", function (d) {
        return d;
    }).makeTwoWay(function (d) {
        return d;
    }), new go.Binding("figure", "figure").makeTwoWay(), {
        figure: properties.figure,
        fill: properties.fill,
        strokeWidth: properties.strokeWidth,
        stroke: properties.stroke
    }), $(go.Shape, {
        name: "SHAPE_Back",
        figure: "Rectangle",
        fill: "rgba(0,0,0,0)",
        // fromLinkable: true,
        // toLinkable: true,
        strokeWidth: 0
    }, new go.Binding("width", "width", function (v) {
        return v;
    }).ofObject("SHAPE"), new go.Binding("height", "height", function (v) {
        return v;
    }).ofObject("SHAPE")), $(go.TextBlock, {
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
    }, new go.Binding("textAlign", "textAlign", function (v) {
        return _.contains(['start', 'center', 'end'], v) ? v : "center";
    }).makeTwoWay(), new go.Binding("spacingAbove", "spacingline", function (v) {
        return tdTransToNum(v, 4);
    }).makeTwoWay(), new go.Binding("spacingBelow", "spacingline", function (v) {
        return tdTransToNum(v, 4);
    }).makeTwoWay(), new go.Binding("width", "width", function (v) {
        return v;
    }).ofObject("SHAPE"),
    // new go.Binding("height", "height", function (v) {
    //   return v;
    // }).ofObject("SHAPE"),
    new go.Binding("text", "text").makeTwoWay(), new go.Binding("stroke", "textStroke").makeTwoWay(), new go.Binding("font", "font").makeTwoWay()));
}

//提示框
var shapeShowblur = null;
var circleStroke = null;

function showToolTip(obj, diagram) {
    var box = document.getElementById("infoBoxHolder");
    var contextMenu = document.getElementsByClassName("context-menu")[0];
    //  console.log(contextMenu)  

    if (obj !== null) {
        var node = obj.part;
        var e = diagram.lastInput;
        var circle = node.findObject("CIRCLE");
        var shape = node.findObject("SHAPE");
        //   console.log(circle)
        if (circle !== null) circle.stroke = "#57617a";
        if (shape !== null) shape.shadowBlur = 10;

        if (shapeShowblur !== null && shapeShowblur !== shape) {

            shapeShowblur.shadowBlur = 0;
            shapeShowblur = shape;

            if (box && (contextMenu.style.display === "" || contextMenu.style.display === "none")) {
                box.style.display = "block";
            }
        } else {

            shapeShowblur = shape;
        }

        if (circleStroke !== null && circleStroke !== circle) circleStroke.stroke = null;
        circleStroke = circle;
        if (box && (contextMenu.style.display === "" || contextMenu.style.display === "none")) {
            box.style.display = "block";
        }
    } else {
        if (circleStroke !== null) circleStroke.stroke = null;
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
function LogicXor(that) {
    var $ = go.GraphObject.make;
    return $(go.Node, "Vertical", {
        movable: false,
        locationSpot: go.Spot.Top,
        location: new go.Point(860, 5),
        mouseHover: function mouseHover(e, node) {
            that.showNodeRemarkTips(e, node);
        },
        mouseLeave: function mouseLeave(e, node) {
            that.removeNodeRemarkTips();
        },
        click: function click(e, node) {

            console.log(node.data);
            console.log(Number(node.data.loc.split(' ')[1]) > 0);
            if (Number(node.data.loc.split(' ')[1]) > 0) {
                addy(e);
            } else {
                addx(e);
            }
        }
    }, new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify), $(go.Shape, {
        figure: "LogicXor",
        stroke: "#8799c4",
        width: 30,
        strokeWidth: 2

    }));
}

function yunpanDokeyDownFn(that) {
    // console.log('myDiagram:', diagram);
    // var myDiagram = diagram.diagram;
    // var e = myDiagram.lastInput;
    // var cmd = myDiagram.commandHandler;
    // var node = myDiagram.selection.first();
    var diagram = that.diagram;
    // var that = this;
    var myDiagram = that.diagram;
    var e = myDiagram.lastInput;
    var node = myDiagram.selection.first();
    var cmd = myDiagram.commandHandler;
    if (e.key === "Del" || e.event.keyCode === 8) {
        // console.log(myDiagram.model.nodeDataArray)
        console.log("0", myDiagram.model.nodeDataArray);
        del(e);
    }

    if (e.event.ctrlKey) {
        //增加y轴
        if (e.event.keyCode === 89) {
            if (node && node.data.category !== "addtextTemplate" || !node) {
                addy(e);
            }
        }
        //增加x轴
        if (e.event.keyCode === 88) {

            if (node && node.data.category !== "addtextTemplate" || !node) {
                addx(e);
            }
        }
        e.bubbles = false;
    }
}

function getYunpanNodeContextMenu() {

    return $(go.Adornment, "Vertical", $("ContextMenuButton", $(go.TextBlock, "删除 DEl"), {
        click: function click(e, node) {
            del(e);
        }
    }), $("ContextMenuButton", $(go.TextBlock, "增加 CTRL+X/Y"), {
        click: function click(e, node) {
            if (node.data.loc.split(" ")[1] === "0" && node.data.category !== "x") {
                addy(e);
            } else if (node.data.loc.split(" ")[0] === "0" && node.data.category !== "y") {
                addx(e);
            };
        }
    }));
}
//云盘增加y轴节点
function addy(e) {
    var myDiagram = e.diagram;
    var node = myDiagram.selection.first();
    var nodeDataArray = myDiagram.model.nodeDataArray;
    console.log(nodeDataArray);
    var yl = 0;
    var stroke = "#8799c4";
    var strokeDashArray = [4, 2];
    var loc = 0;
    var locy = '';
    var height = 260;
    nodeDataArray.forEach(function (data) {

        if (data.category === "y") {
            yl = data.height - 10;
        }

        if (data.category === "x") {
            //console.log(data)
            height = data.height + 200;
            myDiagram.model.startTransaction("addheight");
            myDiagram.model.setDataProperty(data, "height", height);
            myDiagram.model.commitTransaction("addheight");
        }
        if (data.category === 'LogicXor') {
            var locL = +data.loc.split(' ')[0];
            if (locL > 0) {
                var loclc = locL + 200 + " 5";
                myDiagram.model.startTransaction();
                myDiagram.model.setDataProperty(data, "loc", loclc);
                myDiagram.model.commitTransaction();
            }
        }
    });
    nodeDataArray.forEach(function (data) {
        if (data.loc.split(' ')[0] === '0' && data.category !== "addtextTemplate") {
            var l = height - 10;
            var geometryStringx = "M 0 0 L 0 " + l;
            myDiagram.model.startTransaction("changel");
            myDiagram.model.setDataProperty(data, "geometryString", geometryStringx);
            myDiagram.model.commitTransaction("changel");
        }
    });
    var geometryString = "M 0 0 L 0 " + yl;

    if (node && (node.data.category === 'y' || node.data.loc.split(' ')[0] !== '0') && node.data.category !== 'x' && node.data.category !== 'LogicXor' && node.data.category !== "addtextTemplate") {
        //if()
        console.log(node.data);
        loc = +node.data.loc.split(' ')[0] + 200;
        locy = loc + " 0";

        //移动位置
        nodeDataArray.forEach(function (data) {
            console.log(loc);
            if (data.category !== 'LogicXor' && data.category !== "addtextTemplate") {
                var loco = +data.loc.split(' ')[0];
                if (loco >= loc) {
                    loco = loco + 200;
                    var locy = loco + " 0";
                    myDiagram.model.startTransaction("changeloc");
                    myDiagram.model.setDataProperty(data, "loc", locy);
                    myDiagram.model.commitTransaction("changeloc");
                }
            }
        });
    } else {
        var arr = [];
        nodeDataArray.forEach(function (data) {
            if (data.loc.split(' ')[0] !== '0' && data.category !== 'LogicXor' && data.category !== "addtextTemplate") {
                arr.push(+data.loc.split(' ')[0]);
            }
        });
        if (arr.length === 0) {
            // geometryString = "M 0 0 L 0 200";
            locy = "200 0";
        } else {
            var max = Math.max.apply(null, arr) + 200;
            locy = max + " 0";
        }
    }

    var newy = { key: guid(), category: "yunpany", stroke: stroke, geometryString: geometryString, strokeDashArray: strokeDashArray, loc: locy };
    var newytext = { key: guid(), category: "xtext", margin: 10, "textStroke": "#666666", text: "维度" + locy.split(' ')[0] / 200, loc: locy, dir: "top" };
    myDiagram.model.startTransaction("addy");
    myDiagram.model.addNodeData(newy);
    myDiagram.model.addNodeData(newytext);
    myDiagram.model.commitTransaction("addy");
}

//云盘增加x轴节点
function addx(e) {
    var myDiagram = e.diagram;
    var node = myDiagram.selection.first();
    var nodeDataArray = myDiagram.model.nodeDataArray;
    var xl = 0;
    var stroke = "#8799c4";
    var strokeDashArray = [4, 2];
    var loc = 0;
    var locy = '';
    var height = 260;
    nodeDataArray.forEach(function (data) {

        if (data.category === "x") {
            xl = data.height - 10;
        }
        if (data.category === "y") {
            //console.log(data)
            height = data.height + 200;
            myDiagram.model.startTransaction("addheight");
            myDiagram.model.setDataProperty(data, "height", height);
            myDiagram.model.commitTransaction("addheight");
        }
        if (data.category === 'LogicXor') {
            var locL = +data.loc.split(' ')[1];
            if (locL < 0) {
                var loclc = "-20 " + (locL - 200);
                myDiagram.model.startTransaction();
                myDiagram.model.setDataProperty(data, "loc", loclc);
                myDiagram.model.commitTransaction();
            }
        }
    });
    nodeDataArray.forEach(function (data) {
        if (data.loc.split(' ')[1] === '0' && data.category !== "addtextTemplate") {
            var l = height - 10;
            var geometryStringx = "M 0 0 L 0 " + l;
            myDiagram.model.startTransaction("changel");
            myDiagram.model.setDataProperty(data, "geometryString", geometryStringx);
            myDiagram.model.commitTransaction("changel");
        }
    });
    var geometryString = "M 0 0 L 0 " + xl;

    if (node && (node.data.category === 'x' || node.data.loc.split(' ')[1] !== '0') && node.data.category !== 'y' && node.data.category !== 'LogicXor' && node.data.category !== "addtextTemplate") {
        //if()
        console.log(node.data);
        loc = +node.data.loc.split(' ')[1] - 200;
        locy = "0 " + loc;

        //移动位置
        nodeDataArray.forEach(function (data) {
            console.log(loc);
            if (data.category !== 'LogicXor' && data.category !== "addtextTemplate") {
                var loco = +data.loc.split(' ')[1];
                if (loco <= loc) {
                    loco = loco - 200;
                    var locy = "0 " + loco;
                    myDiagram.model.startTransaction("changeloc");
                    myDiagram.model.setDataProperty(data, "loc", locy);
                    myDiagram.model.commitTransaction("changeloc");
                }
            } else {}
        });
    } else {
        var arr = [];
        nodeDataArray.forEach(function (data) {
            if (data.loc.split(' ')[1] !== '0' && data.category !== 'LogicXor' && data.category !== "addtextTemplate") {
                arr.push(+data.loc.split(' ')[1]);
            }
        });
        if (arr.length === 0) {
            // geometryString = "M 0 0 L 0 200";
            locy = "0 -200";
        } else {
            var min = Math.min.apply(null, arr) - 200;
            locy = "0 " + min;
        }
    }

    var newx = { key: guid(), category: "yunpanx", stroke: stroke, geometryString: geometryString, strokeDashArray: strokeDashArray, loc: locy };
    var newxtext = { key: guid(), category: "ytext", text: "维度" + Math.abs(+locy.split(' ')[1] / 200), "textStroke": "#666666", loc: locy, dir: "right" };
    myDiagram.model.startTransaction("addx");
    myDiagram.model.addNodeData(newx);
    myDiagram.model.addNodeData(newxtext);
    myDiagram.model.commitTransaction("addx");
}

//云盘删除节点
function del(e) {
    var myDiagram = e.diagram;
    var node = myDiagram.selection.first();
    console.log("1", myDiagram.model.nodeDataArray);
    //text和轴
    if (node) {
        console.log("11111111111111111111111");
        //非xy的坐标轴
        console.log(node.data);
        //判断点击y子轴
        if (node.data.category === "yunpany") {

            var loc = node.data.loc;
            var locx = +node.data.loc.split(' ')[0];
            console.log(locx);
            myDiagram.model.nodeDataArray.forEach(function (data) {

                //如果不加判断，点击轴删除，只会删除轴，不会删除坐标
                // debugger
                // if(data.category==="yunpany"&&data.loc === loc){
                //     myDiagram.model.startTransaction("deletAxis");
                //     //删除轴
                //     myDiagram.model.removeNodeData(node.data);
                //     myDiagram.model.removeNodeData(data);
                //     myDiagram.model.commitTransaction("deletAxis");
                // }else
                if (data.category === "xtext" && data.loc === loc) {
                    console.log("data", data);
                    myDiagram.model.startTransaction("delettext");
                    //删除轴
                    myDiagram.model.removeNodeData(node.data);
                    //删除text
                    myDiagram.model.removeNodeData(data);

                    myDiagram.model.commitTransaction("delettext");
                }
            });
            //改变其他轴长度及坐标
            console.log("2", myDiagram.model.nodeDataArray);
            changelen(locx, myDiagram);

            //x
        } else if (node.data.category === "yunpanx") {
            console.log("x");
            var _loc = node.data.loc;
            var _locx = +node.data.loc.split(' ')[1];
            myDiagram.model.nodeDataArray.forEach(function (data) {
                // if(data.category==="ytext"&&data.loc === loc){
                //     myDiagram.model.startTransaction("delettext");
                //     myDiagram.model.removeNodeData(data);
                //     myDiagram.model.removeNodeData(node.data);
                //     myDiagram.model.commitTransaction("delettext");
                // }else 
                if (data.category === "ytext" && data.loc === _loc) {
                    myDiagram.model.startTransaction("delettext");
                    myDiagram.model.removeNodeData(data);
                    myDiagram.model.removeNodeData(node.data);
                    myDiagram.model.commitTransaction("delettext");
                }
            });

            changelenx(_locx, myDiagram);
        } else if (node.data.category !== "ytext" && node.data.category !== "xtext" && node.data.category !== "LogicXor" && node.data.category !== "x" && node.data.category !== "y") {
            myDiagram.model.startTransaction();
            myDiagram.model.removeNodeData(node.data);
            myDiagram.model.commitTransaction();
        }
    }
}

//改变x轴长度

function changelen(locx, myDiagram) {
    console.log("3", myDiagram.model.nodeDataArray);
    myDiagram.model.nodeDataArray.forEach(function (data) {

        //Math.abs(key)
        var datalocx = +data.loc.split(' ')[0];
        console.log(data.loc);
        console.log(datalocx);
        //改变位置
        if (datalocx > locx) {
            if (data.category === "yunpany" || data.category === "xtext") {
                var l = datalocx - 200;
                var loc = l + " 0";
                console.log(loc);
                myDiagram.model.startTransaction("changea");
                myDiagram.model.setDataProperty(data, "loc", loc);
                myDiagram.model.commitTransaction("changea");
            }
        }
        //改变长度

        console.log(data);
        if (data.category === "x") {
            var height = data.height - 200;
            myDiagram.model.startTransaction("cheight");
            myDiagram.model.setDataProperty(data, "height", height);
            myDiagram.model.commitTransaction("cheight");
        } else if (data.category === "yunpanx") {
            var gs = NaN;
            var _l = (data.geometryString || "").split(' ');
            console.log(_l);
            if (_l[5]) {
                gs = +_l[5] - 200;
            } else {
                gs = +_l[3] - 200;
            }
            console.log(gs);
            var gs2 = gs + "";
            var gs3 = "M 0 0  L 0 " + gs2;
            myDiagram.model.startTransaction("changea");
            myDiagram.model.setDataProperty(data, "geometryString", gs3);
            myDiagram.model.commitTransaction("changea");
        }

        if (data.category === 'LogicXor') {
            var locL = +data.loc.split(' ')[0];
            if (locL > 0) {
                var loclc = locL - 200 + " 5";
                myDiagram.model.startTransaction();
                myDiagram.model.setDataProperty(data, "loc", loclc);
                myDiagram.model.commitTransaction();
            }
        }
    });
}

function changelenx(locx, myDiagram) {
    console.log(myDiagram.model.nodeDataArray);
    myDiagram.model.nodeDataArray.forEach(function (data) {

        var datalocx = +data.loc.split(' ')[1];
        // console.log(data.loc)
        // console.log(datalocx)
        //改变位置
        if (datalocx < locx) {
            if (data.category === "yunpanx" || data.category === "ytext") {
                var l = datalocx + 200;
                var loc = "0 " + l;
                console.log("节点", data);
                console.log("改变位置", loc);
                myDiagram.model.startTransaction("changea");
                myDiagram.model.setDataProperty(data, "loc", loc);
                myDiagram.model.commitTransaction("changea");
            }
        }
        //改变长度
        if (data.category === "y") {
            var height = data.height - 200;
            console.log("节点", data);
            console.log("改变坐标轴长度没有angle", height);
            myDiagram.model.startTransaction("cheight");
            myDiagram.model.setDataProperty(data, "height", height);
            myDiagram.model.commitTransaction("cheight");
        } else if (data.category === "yunpany") {
            var gs = NaN;
            var _l2 = (data.geometryString || "").split(' ');
            if (_l2[5]) {
                gs = +_l2[5] - 200;
            } else {
                gs = +_l2[3] - 200;
            }
            // console.log(gs)
            var gs2 = gs + "";
            var gs3 = "M 0 0  L 0 " + gs2;
            console.log("节点", data);
            console.log("改变y轴长度没有angle", gs3);
            myDiagram.model.startTransaction("changea");
            myDiagram.model.setDataProperty(data, "geometryString", gs3);
            myDiagram.model.commitTransaction("changea");
        }

        if (data.category === 'LogicXor') {
            var locL = +data.loc.split(' ')[1];
            if (locL < 0) {
                var loclc = "-20 " + (locL + 200);
                myDiagram.model.startTransaction();
                myDiagram.model.setDataProperty(data, "loc", loclc);
                myDiagram.model.commitTransaction();
            }
        }
    });
}
function guid() {
    function S4() {
        return ((1 + Math.random()) * 0x10000 | 0).toString(16).substring(1);
    }
    return S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4();
}

// export default Trtd;
module.exports = Trtd;

/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Trtd_tianpan = __webpack_require__(4);
var createNodeTemplate = __webpack_require__(7);
var createPictureSingleNodeTemplate = __webpack_require__(2);
var createPictureNodeTemplate = __webpack_require__(5);
var createTextNodeTemplate = __webpack_require__(3);
var createNodeSvgTemplate = __webpack_require__(6);

var Trtd = function (_Trtd_tianpan) {
        _inherits(Trtd, _Trtd_tianpan);

        function Trtd(div, config) {
                _classCallCheck(this, Trtd);

                return _possibleConstructorReturn(this, (Trtd.__proto__ || Object.getPrototypeOf(Trtd)).call(this, div, config));
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


        _createClass(Trtd, [{
                key: 'addNodeTemplate',
                value: function addNodeTemplate() {

                        var that = this;
                        var myDiagram = this.diagram;

                        // myDiagram.nodeTemplateMap.add("dipan", this.createDipanTemplate(layerThickness,tdDipanTextAngle));
                        // myDiagram.nodeTemplateMap.add("Root", this.getDipanRootTemplate(layerThickness));
                        // myDiagram.nodeTemplateMap.add("text", );

                        myDiagram.nodeTemplateMap.add("0", createNodeTemplate(this.diagram));
                        myDiagram.nodeTemplateMap.add("1", createNodeTemplate(this.diagram));
                        myDiagram.nodeTemplateMap.add("2", createNodeTemplate(this.diagram));
                        myDiagram.nodeTemplateMap.add("3", createPictureSingleNodeTemplate(this.diagram));
                        myDiagram.nodeTemplateMap.add("4", createPictureNodeTemplate(this.diagram));
                        myDiagram.nodeTemplateMap.add("text", createTextNodeTemplate(this.diagram));
                        myDiagram.nodeTemplateMap.add("", createNodeTemplate(this.diagram));

                        myDiagram.nodeTemplateMap.add("8", createNodeSvgTemplate(this.diagram));
                }
        }]);

        return Trtd;
}(Trtd_tianpan);

// export default Trtd;


module.exports = Trtd;

/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Trtd_tianpan = __webpack_require__(4);
var createNodeTemplate = __webpack_require__(7);
var createPictureSingleNodeTemplate = __webpack_require__(2);
var createPictureNodeTemplate = __webpack_require__(5);
var createTextNodeTemplate = __webpack_require__(3);
var createNodeSvgTemplate = __webpack_require__(6);
var createArcNodeTemplate = __webpack_require__(38);
var createLineNodeTemplate = __webpack_require__(39);
var createWaveNodeTemplate = __webpack_require__(40);
var nodeTemplateFactory = __webpack_require__(11);
var $ = go.GraphObject.make;
var GroupRotatingTool = __webpack_require__(41);
var helpers = __webpack_require__(0);
var layoutWaveGroup = __webpack_require__(9).layoutWaveGroup;
var _adjustTextAngle = __webpack_require__(9).adjustTextAngle;

function computeNewRotateLoc(rotateCenter, currentLoc, angle) {
    if (rotateCenter.equals(currentLoc)) return currentLoc;
    // 计算选择中心点到（0,0）点的偏移
    var offset = new go.Point(0, 0).subtract(rotateCenter.copy());
    // 将原来的点偏移到相对0,0点的位置
    var nodeOrigin = currentLoc.copy().offset(offset.x, offset.y);
    var newNodeOrigin = nodeOrigin.rotate(angle);
    var newNodeLoc = newNodeOrigin.copy().offset(-offset.x, -offset.y);
    return newNodeLoc;
    // console.log("newNodeLoc", newNodeLoc)
}

__webpack_require__(42);

var Trtd = function (_Trtd_tianpan) {
    _inherits(Trtd, _Trtd_tianpan);

    function Trtd(div, config) {
        _classCallCheck(this, Trtd);

        var _this = _possibleConstructorReturn(this, (Trtd.__proto__ || Object.getPrototypeOf(Trtd)).call(this, div, config));

        var that = _this;
        var diagramConfig = {
            layout: $(go.Layout),
            initialContentAlignment: go.Spot.Center,
            initialAutoScale: go.Diagram.Uniform,
            initialDocumentSpot: go.Spot.Center,
            initialViewportSpot: go.Spot.Center,
            rotatingTool: new GroupRotatingTool(),
            PartResized: function PartResized(e) {
                console.log("PartResizedPartResizedPartResizedPartResized");
                var node = e.subject.part;
                if (!node) return;
                // return;
                if (node.data.category == "waveGroup") {
                    console.log("PartResizedPartResized");
                    // wave 的宽高限制
                    var maxWidth = 400;
                    var maxHeight = 400;
                    var oliveWidth, oliveHeight;
                    var it = node.findSubGraphParts().iterator;
                    var waveCount = 0;
                    var lastWave;
                    while (it.next()) {
                        var n = it.value;
                        if (n.data.category == "wave") {
                            waveCount += 1;
                            lastWave = n;
                        }
                    }
                    console.log("actualBoundsactualBoundsactualBoundsactualBounds");
                    var nodeSize = node.resizeObject.actualBounds;
                    var waveSize = lastWave.resizeObject.naturalBounds;
                    // oliveWidth = (nodeSize.width-100)/waveCount
                    oliveWidth = (nodeSize.width - 0) * 5 / 3 / waveCount;
                    oliveWidth = (nodeSize.width - 0) * 3 / (waveCount * 3 + 2);
                    if (oliveWidth < 100) {
                        oliveWidth = 100;
                    }
                    // oliveWidth = waveSize.width*waveCount + waveSize.width*2/3
                    // oliveWidth = waveSize.width
                    if (oliveWidth > maxWidth) {
                        oliveWidth = maxWidth;
                        // nodeSize.width = maxWidth*waveCount+100;
                    }
                    oliveHeight = nodeSize.height;
                    if (oliveHeight > maxHeight) {
                        oliveHeight = maxHeight;
                        // nodeSize.height  = maxWidth;
                    }
                    if (oliveHeight > oliveWidth) {
                        oliveHeight = oliveWidth;
                        // nodeSize.height  = maxWidth;
                    }
                    node.diagram.startTransaction();
                    // node.diagram.model.setDataProperty(node.data, "desiredSize",`${nodeSize.width} ${nodeSize.height}`)
                    node.diagram.model.setDataProperty(node.data, "oliveHeight", oliveHeight);
                    node.diagram.model.setDataProperty(node.data, "oliveWidth", oliveWidth);
                    //     e.subject.part.layout.isOngoing = true;
                    //     e.subject.part.layout.isValidLayout = false;
                    var it = e.subject.part.findSubGraphParts().iterator;
                    layoutWaveGroup(it, node.diagram, e.subject.part);
                    // node.diagram.updateAllTargetBindings()
                    it.reset();
                    while (it.next()) {
                        it.value.updateTargetBindings();
                    }

                    node.diagram.commitTransaction();
                    setTimeout(function () {
                        e.subject.part.layout.isOngoing = true;
                        e.subject.part.layout.isValidLayout = false;
                    }, 100);
                } else if (node.data.category === "autoText") {
                    console.log("e.subject.width resize");
                    if (e.subject.width <= 50) {
                        e.subject.width = 50;
                    }
                    if (e.subject.height <= 35) {
                        e.subject.height = 35;
                    }
                    e.diagram.startTransaction("resize");
                    e.diagram.model.setDataProperty(node.data, "width", e.subject.width);
                    e.diagram.model.setDataProperty(node.data, "nwidth", true);
                    e.diagram.model.setDataProperty(node.data, "height", e.subject.height);
                    e.diagram.model.setDataProperty(node.data, "nheight", true);
                    e.diagram.commitTransaction("resize");
                }
            },
            SelectionMoved: function SelectionMoved(e) {
                // console.log("SelectionMovedSelectionMoved",e.subject)
                // if (!e.isTransactionFinished) {
                //     return;
                // }
                try {
                    var selnode = e.subject.first();
                    if (!selnode) return;
                    if (selnode.data.category == "wave") {
                        if (selnode.containingGroup) {
                            selnode.containingGroup.layout.isValidLayout = false;
                        }
                    }
                    if (selnode.data.category == "autoText") {
                        if (selnode.data.role == "shiText" || selnode.data.role == "xuText") {
                            selnode.diagram.startTransaction();
                            console.log("SelectionMovedSelectionMovedSelectionMoved");
                            if (!selnode.__location) {
                                var obj = selnode.diagram.findNodeForKey(selnode.data.olive);
                                var group = selnode.containingGroup;
                                if (obj) {
                                    var loc = group.location.copy().offset(group.data.oliveWidth * (obj.data.order - 1), 0);
                                    selnode.__location = loc.copy().offset(obj.naturalBounds.width / 2, 0);
                                    selnode.__location = computeNewRotateLoc(group.location, selnode.__location, obj.angle);
                                }
                            }
                            if (selnode.__location) {
                                console.log("selnode.__locationselnode.__locationselnode.__location");
                                if (selnode.data.order % 2 == 0) {
                                    selnode.__offset = selnode.__location.copy().subtract(selnode.location);
                                } else {
                                    selnode.__offset = selnode.__location.copy().subtract(selnode.location);
                                }
                                delete selnode.__oldOrder;
                            }
                            delete selnode.__oldLocation;
                            if (selnode.data.text.trim() != "") {
                                selnode.data.nloc = true;
                                selnode.diagram.model.setDataProperty(selnode.data, "nloc", true);
                            }
                            selnode.diagram.commitTransaction();
                        }
                        if (selnode.containingGroup && (selnode.containingGroup.data.category == "yunGroup" || selnode.containingGroup.data.category == "yunpanGroup")) {
                            selnode.containingGroup.__trtdNode.snapToGrid(selnode.data, selnode.containingGroup);
                            // selnode.containingGroup.layout.isOngoing = true;
                            selnode.containingGroup.layout.isValidLayout = false;
                        }
                    }
                    if (selnode.data.category == "shapeText") {
                        if (selnode.containingGroup && selnode.containingGroup.data.category == "yunpanGroup") {
                            selnode.containingGroup.__trtdNode.snapToGrid(selnode.data, selnode.containingGroup);
                            // selnode.containingGroup.layout.isOngoing = true;
                            selnode.containingGroup.layout.isValidLayout = false;
                        }
                    }
                } catch (err) {
                    console.log(err);
                }
                // if(e.subject)
            },
            // "toolManager.hoverDelay": 600,
            // "toolManager.toolTipDuration": 3000,
            click: function click(e) {
                // closeToolbarWindow();
                // removeNodeToolBar();
                console.log("eeeeeeee:", e);
                that.clearAllTextBorder();
                localStorage.setItem("TRTD_documentPoint", go.Point.stringify(e.documentPoint));
            }
        };
        _this.diagram.setProperties(diagramConfig);

        _this.diagram.commandHandler.doKeyDown = function (e) {
            _this.dokeyDownFn(e);
            // var cmd = this.diagram.commandHandler;
            // go.CommandHandler.prototype.doKeyDown.call(cmd);
        };
        _this.diagram.commandHandler.canCopySelection = function () {
            // this.dokeyDownFn(e)
            console.log("canCopySelectioncanCopySelection");
            var node = that.diagram.selection.first();
            if (node) {
                if (node.data.category == "axisGroup" || node.data.category == "yunGroup") {
                    return true;
                } else {
                    return false;
                }
            }
            var cmd = this.diagram.commandHandler;
            return go.CommandHandler.prototype.canCopySelection.call(cmd);
        };
        _this.diagram.commandHandler.pasteFromClipboard = function (e, obj) {
            var coll = go.CommandHandler.prototype.pasteFromClipboard.call(this);

            // this.diagram.moveParts(coll, this._lastPasteOffset);
            // this._lastPasteOffset.add(this.pasteOffset);
            var it = coll.iterator;
            var shiTextColl = [];
            var xuTextColl = [];
            var waveColl = [];
            var centerTextColl = [];
            var waveGroup = null;
            var yunGroup = null;
            while (it.next()) {
                var n = it.value;
                if (n.data.role == "shiText") {
                    shiTextColl.push(n);
                    continue;
                }
                if (n.data.role == "xuText") {
                    xuTextColl.push(n);
                    continue;
                }
                if (n.data.role == "centerText") {
                    centerTextColl.push(n);
                    continue;
                }
                if (n.data.category == "wave" && n.data.role != "waveTail") {
                    waveColl.push(n);
                    continue;
                }
                if (n.data.category == "waveGroup") {
                    waveGroup = n;
                }
            }
            if (!waveGroup) {
                // coll.clear()
                // coll.removeAll()
                coll = new go.Set(go.Part);
                return coll;
            }

            waveColl = waveColl.sort(function (a, b) {
                // console.log(`Number(a.data.order)${Number(a.data.order)} > Number(b.data.order) ${Number(b.data.order)}`,Number(a.data.order) > Number(b.data.order))
                return Number(a.data.order) - Number(b.data.order);
            });
            shiTextColl.sort(function (a, b) {
                return Number(a.data.order) - Number(b.data.order);
            });
            xuTextColl.sort(function (a, b) {
                return Number(a.data.order) - Number(b.data.order);
            });
            centerTextColl.sort(function (a, b) {
                return Number(a.data.order) - Number(b.data.order);
            });

            waveColl.forEach(function (obj, index) {
                obj.data.shiText = shiTextColl[index].data.key;
                obj.data.xuText = xuTextColl[index].data.key;
                obj.data.centerText = centerTextColl[index].data.key;
                shiTextColl[index].data.olive = obj.data.key;
                xuTextColl[index].data.olive = obj.data.key;
            });
            console.log("pasteFromClipboardpasteFromClipboard");
            return coll;
            // var cmd = this.diagram.commandHandler;
            // go.CommandHandler.prototype.doKeyDown.call(cmd);
        };
        _this.diagram.commandHandler.deleteSelection = function () {

            return _this.deleteSelection();
        };
        _this.diagram.toolManager.resizingTool.computeReshape = function () {
            if (this.adornedObject.part.data.category == "shapeText") {
                return false;
            }
            go.TextEditingTool.prototype.doCancel.call(this);
        };
        _this.diagram.toolManager.textEditingTool.doCancel = function () {
            // var textEditor = this.diagram.currentTextEditor;
            // console.log("textEditor。。。。")
            var tool = this;
            try {
                if (this.textBlock) {
                    var node = this.textBlock.part;
                }
            } catch (e) {
                console.log(e);
            }
            setTimeout(function () {
                try {
                    if (node && node.data.category == "wave") {
                        if (node.containingGroup && node.containingGroup.data.textAngle == "horizontal" && node.containingGroup.data.centerTextAngle == "independent") {
                            // 如果文字方向为正向，且中线文字为正向
                            node.findObject("TEXT").visible = false;
                            var centerText = node.diagram.findNodeForKey(node.data.centerText);
                            if (centerText) {
                                centerText.visible = true;
                            }
                        }
                    }
                } catch (e) {
                    console.info(e);
                }
            }, 100);
            // var cmd = this.diagram.commandHandler;
            // this.doCancel()
            // go.CommandHandler.prototype.deleteSelection.call(cmd);
            go.TextEditingTool.prototype.doCancel.call(tool);
        };

        _this.diagram.toolManager.resizingTool.computeReshape = function () {
            // 保持图片宽高比
            if (this.adornedObject.part.data.category == "pic") {
                return false;
            }
            return true;
        };

        if (window.TextEditor) {
            console.log("TextEditorTextEditorTextEditorTextEditorTextEditorTextEditorTextEditorTextEditorTextEditor");
            _this.diagram.toolManager.textEditingTool.defaultTextEditor = window.TextEditor;
        }
        _this.diagram.toolManager.clickCreatingTool.archetypeNodeData = {
            category: "autoText",
            "font": "18px 'Microsoft YaHei'",
            text: "空白文本",
            level: 0
        };

        _this.diagram.groupTemplateMap.add("waveGroup1", $(go.Group, "Spot", { selectionObjectName: "SHAPE" }, { locationObjectName: "SHAPE", locationSpot: go.Spot.Center }, new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify), { rotatable: true }, new go.Binding("angle", "angle", function (v, m, a) {
            console.log("vvvvvvvvvvvvvvvvvvv:", v, " m:", m, " a:", a);
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
        }).makeTwoWay(function (v, m, a) {
            console.log("v:", v, " m:", m, " a:", a);
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
        }), { resizable: true, resizeObjectName: "SHAPE" }, $(go.Panel, "Vertical", $(go.TextBlock, { font: "bold 12pt sans-serif" }, new go.Binding("text", "key")), $(go.Shape, { name: "SHAPE", fill: "transparent" }, new go.Binding("desiredSize", "desiredSize", go.Size.parse).makeTwoWay(go.Size.stringify)))));
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
        return _this;
    }

    /**
    * 添加节点模板
    */


    _createClass(Trtd, [{
        key: 'addNodeTemplate',
        value: function addNodeTemplate() {

            // myDiagram.nodeTemplateMap.add("dipan", this.createDipanTemplate(layerThickness,tdDipanTextAngle));
            // myDiagram.nodeTemplateMap.add("Root", this.getDipanRootTemplate(layerThickness));
            // myDiagram.nodeTemplateMap.add("text", );
            var myDiagram = this.diagram;
            myDiagram.nodeTemplateMap.add("0", createNodeTemplate(this.diagram));
            myDiagram.nodeTemplateMap.add("1", createNodeTemplate(this.diagram));
            myDiagram.nodeTemplateMap.add("2", createNodeTemplate(this.diagram));
            myDiagram.nodeTemplateMap.add("3", createPictureSingleNodeTemplate(this.diagram));
            myDiagram.nodeTemplateMap.add("4", createPictureNodeTemplate(this.diagram));
            myDiagram.nodeTemplateMap.add("text", createTextNodeTemplate(this.diagram));
            myDiagram.nodeTemplateMap.add("", createNodeTemplate(this.diagram));

            myDiagram.nodeTemplateMap.add("8", createNodeSvgTemplate(this.diagram));
            myDiagram.nodeTemplateMap.add("9", createArcNodeTemplate(this.diagram));
            myDiagram.nodeTemplateMap.add("line", createLineNodeTemplate(this.diagram));
            // myDiagram.nodeTemplateMap.add("wave", createWaveNodeTemplate(this.diagram));
            // var sampleNode = nodeTemplateFactory("sample")
            myDiagram.nodeTemplateMap.add("wave", nodeTemplateFactory("wave", { diagram: myDiagram }).getNodeTemplate());
            // myDiagram.nodeTemplateMap.add("waveTail", nodeTemplateFactory("waveTail",{diagram:myDiagram}).getNodeTemplate());
            myDiagram.nodeTemplateMap.add("iconText", nodeTemplateFactory("iconText", { diagram: myDiagram }).getNodeTemplate());
            // myDiagram.nodeTemplateMap.add("cbian",  nodeTemplateFactory("cbian",{diagram:this.diagram}).getNodeTemplate())
            myDiagram.nodeTemplateMap.add("pic", nodeTemplateFactory("pic", { diagram: this.diagram }).getNodeTemplate());
            myDiagram.nodeTemplateMap.add("shape", nodeTemplateFactory("shape", { diagram: this.diagram }).getNodeTemplate());
            myDiagram.nodeTemplateMap.add("autoText", nodeTemplateFactory("autoText", { diagram: myDiagram }).getNodeTemplate());
            myDiagram.nodeTemplateMap.add("shapeText", nodeTemplateFactory("shapeText", { diagram: myDiagram }).getNodeTemplate());
            myDiagram.groupTemplateMap.add("labelGroup", nodeTemplateFactory("labelGroup", { diagram: myDiagram }).getNodeTemplate());
            myDiagram.groupTemplateMap.add("picGroup", nodeTemplateFactory("picGroup", { diagram: myDiagram }).getNodeTemplate());
            myDiagram.groupTemplateMap.add("waveGroup", nodeTemplateFactory("waveGroup", { diagram: this.diagram }).getNodeTemplate());
            myDiagram.groupTemplateMap.add("axisGroup", nodeTemplateFactory("axisGroup", { diagram: this.diagram }).getNodeTemplate());
            myDiagram.groupTemplateMap.add("yunGroup", nodeTemplateFactory("yunGroup", { diagram: this.diagram }).getNodeTemplate());
            myDiagram.groupTemplateMap.add("yunpanGroup", nodeTemplateFactory("yunpanGroup", { diagram: this.diagram }).getNodeTemplate());
        }
    }, {
        key: 'deleteSelection',
        value: function deleteSelection(node) {
            var cmd = this.diagram.commandHandler;
            if (!node) {
                node = this.diagram.selection.first();
            }
            var locateNode = null;
            var shiText, xuText, centerText;
            if (!node) return;
            if (!node.canDelete()) return;
            if (node.data.category == "yunGroup" && !node.data.deletable) {
                return;
            }
            this.diagram.startTransaction("deleteSelection1");
            var count = 0;
            if (node) {
                if (node.data.category == "axisGroup") {
                    var it = node.findSubGraphParts().iterator;
                    while (it.next()) {
                        var n = it.value;
                        this.diagram.model.removeNodeData(n.data);
                    }
                    this.diagram.model.removeNodeData(node.data);
                }
                if (node.data.category == "wave" && node.containingGroup) {
                    var it = node.containingGroup.findSubGraphParts().iterator;
                    while (it.next()) {
                        var n = it.value;
                        if (n.data.category == "wave" && n.data.role != "waveTail") {
                            if (n.data.order == node.data.order + 1) {
                                locateNode = n;
                            }
                            count++;
                        }
                        if (n.data.role == "shiText" && n.data.order == node.data.order) {
                            shiText = n;
                        }
                        if (n.data.role == "xuText" && n.data.order == node.data.order) {
                            xuText = n;
                        }
                        if (n.data.role == "centerText" && n.data.order == node.data.order) {
                            centerText = n;
                        }
                    }
                    if (count <= 1) {
                        this.diagram.commitTransaction("deleteSelection1");
                        return;
                    }
                    node.containingGroup.layout.isOngoing = true;
                    node.containingGroup.layout.isValidLayout = false;
                    if (node.containingGroup.containingGroup) {
                        node.containingGroup.containingGroup.layout.isOngoing = true;
                        node.containingGroup.containingGroup.layout.isValidLayout = false;
                    }
                }
                // 云盘 维度删除
                if (node.data.category == "autoText" && node.data.subRole == "dimText" && node.containingGroup && node.containingGroup.data.category == "yunpanGroup") {
                    var it = node.containingGroup.findSubGraphParts().iterator;
                    var deleteNodes = [];
                    var deleteLines = [];
                    var normDim = "X",
                        unnormDim = "Y",
                        lineRole = "verticalLine";
                    if (node.data.dimX == 0) {
                        normDim = "Y";
                        unnormDim = "X";
                        lineRole = "horizontalLine";
                    }
                    while (it.next()) {
                        var n = it.value;
                        if (n.data.subRole == "dimText" && n.data["dim" + unnormDim] == 0) {
                            // if(n.data.order == node.data.order+1){
                            //     locateNode = n;
                            // }
                            count++;
                        }
                        if (n.data.subRole == "yunpanText" && n.data["order" + normDim] == node.data["dim" + normDim]) {
                            deleteNodes.push(n.data);
                        }
                        if (n.data.category == "line" && n.data.role == lineRole && n.data["order"] == node.data["dim" + normDim]) {
                            deleteLines.push(n.data);
                        }
                        // if(n.data.role == "xuText" && n.data.order == node.data.order){
                        //     xuText = n;
                        // }
                        // if(n.data.role == "centerText" && n.data.order == node.data.order){
                        //     centerText = n;
                        // }
                    }

                    if (count <= 1) {
                        this.diagram.commitTransaction("deleteSelection1");
                        return;
                    }

                    it.reset();
                    while (it.next()) {
                        var n = it.value;
                        if (n.data.subRole == "dimText" && n.data["dim" + unnormDim] == 0 && n.data["dim" + normDim] > node.data["dim" + normDim]) {
                            // if(n.data.order == node.data.order+1){
                            //     locateNode = n;
                            // }
                            n.diagram.model.setDataProperty(n.data, "dim" + normDim, n.data["dim" + normDim] - 1);
                            // count++;
                        }
                        if (n.data.subRole == "yunpanText" && n.data["order" + normDim] > node.data["dim" + normDim]) {
                            n.diagram.model.setDataProperty(n.data, "order" + normDim, n.data["order" + normDim] - 1);
                        }
                        if (n.data.category == "line" && n.data.role == lineRole && n.data["order"] > node.data["dim" + normDim]) {
                            n.diagram.model.setDataProperty(n.data, "order", n.data["order"] - 1);
                        }
                        // if(n.data.role == "xuText" && n.data.order == node.data.order){
                        //     xuText = n;
                        // }
                        // if(n.data.role == "centerText" && n.data.order == node.data.order){
                        //     centerText = n;
                        // }
                    }

                    node.diagram.model.removeNodeDataCollection(deleteLines);
                    node.diagram.model.removeNodeDataCollection(deleteNodes);
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
            if (xuText) {
                this.diagram.model.removeNodeData(xuText.data);
            }
            if (shiText) {
                this.diagram.model.removeNodeData(shiText.data);
            }
            if (centerText) {
                this.diagram.model.removeNodeData(centerText.data);
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
    }, {
        key: 'layoutLabelGroup',
        value: function layoutLabelGroup() {
            var _this2 = this;

            console.log("layoutLabelGroup");
            setTimeout(function () {
                var it = _this2.diagram.nodes.iterator;
                while (it.next()) {
                    var n = it.value;
                    if (n.data.category == "labelGroup") {
                        n.layout.isOngoing = true;
                        n.layout.isValidLayout = false;
                    }
                }
            }, 200);
        }
        // 复制拓扑

    }, {
        key: 'copyWaveGroup',
        value: function copyWaveGroup() {
            var diagram = this.diagram;
            var cmd = this.diagram.commandHandler;
            cmd.copySelection();
            cmd.pasteSelection();
            return;
        }
    }, {
        key: 'layoutAllGroup',
        value: function layoutAllGroup() {
            console.log("layoutAllGroup");
            var it = this.diagram.nodes.iterator;
            while (it.next()) {
                var n = it.value;
                if (n.data.isGroup == true) {
                    n.layout.isOngoing = true;
                    n.layout.isValidLayout = false;
                }
            }
        }
    }, {
        key: 'exportAsSubFigure',
        value: function exportAsSubFigure() {
            var diagram = this.diagram;
            var node = diagram.selection.first();
            if (!node) return;
            if (!node.data.isGroup) return;
            var it = node.findSubGraphParts().iterator;
            var groupData = [node.data];
            var theme = null;
            while (it.next()) {
                var n = it.value;
                groupData.push(n.data);
                if (n.data.role == "themeText") {
                    theme = n;
                }
            }
            var model = JSON.parse(diagram.model.toJson());
            model.nodeDataArray = groupData;
            if (this.exportAsSubFigureCallback) {
                this.exportAsSubFigureCallback({
                    node: node,
                    model: model,
                    theme: theme
                });
            }
        }

        // 拆分橄榄

    }, {
        key: 'splitOlive2Half',
        value: function splitOlive2Half() {
            var diagram = this.diagram;
            var node = diagram.selection.first();
            if (!node) return;
            if (node.data.category != "wave") {
                return;
            }
            if (node.data.order == 1) return;
            if (!node.containingGroup) {
                return;
            }
            this.diagram.startTransaction("splitOlive2Half");
            node.containingGroup.layout.isOngoing = true;
            node.containingGroup.layout.isValidLayout = false;
            var axisData = this.addAxisGroup({ emptyAxis: true });
            if (!axisData) {
                this.diagram.commitTransaction("splitOlive2Half");
                return;
            }
            var waveGroup;
            for (var i = 0; i < axisData.length; i++) {
                if (axisData[i].category == "waveGroup") {
                    waveGroup = axisData[i];
                    break;
                }
            }
            if (!waveGroup) {
                this.diagram.commitTransaction("splitOlive2Half");
                return;
            };
            var curOrder = node.data.order;
            var it = node.containingGroup.findSubGraphParts().iterator;
            var splitOlive = [];
            while (it.next()) {
                var n = it.value;
                if (n.data.category == "wave" && n.data.order >= curOrder && n.data.role != "waveTail") {
                    splitOlive.push(n);
                }
            }
            for (var i = 0; i < splitOlive.length; i++) {
                this.diagram.model.setDataProperty(splitOlive[i].data, "group", waveGroup.key);
                var shiText = this.diagram.model.findNodeDataForKey(splitOlive[i].data.shiText);
                var centerText = this.diagram.model.findNodeDataForKey(splitOlive[i].data.centerText);
                var xuText = this.diagram.model.findNodeDataForKey(splitOlive[i].data.xuText);
                if (shiText) {
                    this.diagram.model.setDataProperty(shiText, "group", waveGroup.key);
                }
                if (centerText) {
                    this.diagram.model.setDataProperty(centerText, "group", waveGroup.key);
                }
                if (xuText) {
                    this.diagram.model.setDataProperty(xuText, "group", waveGroup.key);
                }
            }

            this.diagram.commitTransaction("splitOlive2Half");
        }

        // 分离常变

    }, {
        key: 'splitOlive2Cbian',
        value: function splitOlive2Cbian() {
            var diagram = this.diagram;
            var node = diagram.selection.first();
            if (!node) return;
            if (node.data.category != "wave") {
                return;
            }

            this.diagram.startTransaction("splitOlive2Cbian");
            // 删除橄榄
            var shiText = this.diagram.model.findNodeDataForKey(node.data.shiText);
            var centerText = this.diagram.model.findNodeDataForKey(node.data.centerText);
            var xuText = this.diagram.model.findNodeDataForKey(node.data.xuText);
            var cbian = {
                shiText: shiText.text,
                centerText: centerText.text,
                xuText: xuText.text,
                basePoint: node.location.copy().offset(0, -300),
                group: node.data.group
            };
            this.deleteSelection(node);
            // 添加常变
            this.addCbian(cbian);
            this.diagram.commitTransaction("splitOlive2Cbian");
        }

        // 增加常变

    }, {
        key: 'addCbian',
        value: function addCbian(cbian) {
            console.log("addCbian");
            var diagram = this.diagram;
            var node = diagram.selection.first();
            var group = null;
            if (node && node.data.category == "axisGroup") {
                group = node.data.key;
            }
            var e = diagram.lastInput;
            diagram.startTransaction("addCbian");
            var groupKey = helpers.guid();

            if (cbian && cbian.basePoint) {
                var basePoint = cbian.basePoint;
            } else {
                var basePoint = e.documentPoint;
            }
            var groupData = { "category": "picGroup",
                "role": "cbian", "isGroup": true, "level": 0,
                "key": groupKey, "loc": go.Point.stringify(basePoint), "deletable": true };
            if (group) {
                groupData.group = group;
            }
            if (cbian && cbian.group) {
                groupData.group = cbian.group;
            }
            var picData = { "group": groupKey, "text": "", cbianName: "cbian1",
                "resizable": false, "category": "pic",
                "loc": go.Point.stringify(basePoint),
                "picture": "https://static.365trtd.com/system/cbian/cbian.png", "width": 150, "height": 150
                // "picture":"https://static.365trtd.com/system/cbian/cbian.png", "width":150, "height":150}

            };var themeData = { "text": "总结", "role": "theme", "deletable": false, "fill": "black", "iconVisible": false,
                "locationSpot": "1 0 0 0", "textAlign": "center", "category": "autoText",
                "loc": go.Point.stringify(basePoint.copy().offset(3, -3)),
                "movable": true, "group": groupKey };
            var timeData = { "text": "时间", "role": "axisXText", "deletable": false, "fill": "black", "iconVisible": false,
                "locationSpot": "1 0 0 0", "textAlign": "center", "category": "autoText",
                "loc": go.Point.stringify(basePoint.copy().offset(150, 0)),
                "movable": true, "group": groupKey };
            var energeData = { "text": "能量", "role": "axisYText", "deletable": false, "fill": "black", "iconVisible": false,
                "locationSpot": "1 0 0 0", "textAlign": "center", "category": "autoText",
                "loc": go.Point.stringify(basePoint.copy().offset(0, -150)),
                "movable": true, "group": groupKey };
            var text1Data = { "text": "总结1", "role": "cbianText1", "deletable": false, "font": "normal bold 18px 'Microsoft YaHei'", "textStroke": "#0e399d", "iconVisible": false,
                "locationSpot": "0 0 0 0", "textAlign": "left", "category": "autoText",
                "loc": go.Point.stringify(basePoint.copy().offset(155 * Math.cos(30 * Math.PI / 180), -150 * Math.sin(30 * Math.PI / 180))),
                "movable": true, "group": groupKey };
            var text2Data = { "text": "总结3", "role": "cbianText3", "deletable": false, "font": "normal bold 18px 'Microsoft YaHei'", "textStroke": "rgba(252, 172, 0, 1)", "iconVisible": false,
                "locationSpot": "0 0.5 0 0", "textAlign": "left", "category": "autoText",
                "loc": go.Point.stringify(basePoint.copy().offset(145 * Math.cos(45 * Math.PI / 180), -150 * Math.sin(45 * Math.PI / 180))),
                "movable": true, "group": groupKey };
            var text3Data = { "text": "总结2", "role": "cbianText2", "font": "normal bold 18px 'Microsoft YaHei'", "deletable": false, "textStroke": "#cb1c27", "iconVisible": false,
                "locationSpot": "0 1 0 0", "textAlign": "left", "category": "autoText",
                "loc": go.Point.stringify(basePoint.copy().offset(145 * Math.cos(70 * Math.PI / 180), -140 * Math.sin(70 * Math.PI / 180))),
                "movable": true, "group": groupKey };

            var cbianName = localStorage.getItem("cbianName");
            if (cbianName) {
                try {
                    var theme = JSON.parse(cbianName);
                    picData.picture = theme["picture"];
                    picData.width = theme['size'][0];
                    picData.height = theme['size'][1];
                    picData.cbianName = theme['name'];
                    text1Data.textStroke = theme["textStrokes"][0];
                    text3Data.textStroke = theme["textStrokes"][1];
                    text2Data.textStroke = theme["textStrokes"][2];
                } catch (e) {
                    console.error(e);
                }
            }
            if (cbian) {
                text1Data.text = cbian.shiText;
                text2Data.text = cbian.centerText;
                text3Data.text = cbian.xuText;
            }
            diagram.model.addNodeData(text1Data);
            diagram.model.addNodeData(text2Data);
            diagram.model.addNodeData(text3Data);
            diagram.model.addNodeData(themeData);
            diagram.model.addNodeData(timeData);
            diagram.model.addNodeData(energeData);
            diagram.model.addNodeData(picData);
            diagram.model.addNodeData(groupData);

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

            diagram.commitTransaction("addCbian");
        }
    }, {
        key: 'adjustTextAngle',
        value: function adjustTextAngle() {
            for (var _len = arguments.length, obj = Array(_len), _key = 0; _key < _len; _key++) {
                obj[_key] = arguments[_key];
            }

            _adjustTextAngle(obj);
        }
        // 增加橄榄

    }, {
        key: 'addOlive',
        value: function addOlive(node, cbian) {
            console.log("addOliveaddOlive");
            var diagram = this.diagram;
            if (!node) {
                node = diagram.selection.first();
            }
            if (!node) return;
            var count = 0;
            var labelGroup;
            var it = node.containingGroup.findSubGraphParts().iterator;
            var oliveWidth = node.containingGroup.data.oliveWidth;
            while (it.next()) {
                var n = it.value;
                if (n.data.category == "wave") {
                    count++;
                }
            }
            var maxOlive = 50;
            if (node.containingGroup.data.maxOlive != null) {
                maxOlive = node.containingGroup.data.maxOlive;
            }
            if (count > maxOlive) {
                return;
            }
            var curShiText = this.diagram.findNodeForKey(node.data.shiText);
            var curXuText = this.diagram.findNodeForKey(node.data.xuText);
            diagram.startTransaction("dspiral");
            var order = 1000;
            if (node.data.order != null) {
                order = Number(node.data.order) + 0.5;
            }

            var data = JSON.parse(JSON.stringify(node.data));
            Object.assign(data, {
                "key": helpers.guid(),
                "order": order,
                "text": ""
            });
            if (cbian) {
                data.text = cbian.centerText;
            }
            delete data.centerText;
            delete data.__gohashid;
            delete data.hyperlink;
            delete data.figure;
            delete data.remark;
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
            var shiText = JSON.parse(JSON.stringify(curShiText.data));
            delete shiText.__gohashid;
            // delete shiText.textAlign
            delete shiText.hyperlink;
            delete shiText.figure;
            delete shiText.remark;
            delete shiText.nloc;
            Object.assign(shiText, {
                "key": helpers.guid(),
                "order": order,
                "olive": data.key,
                "text": ""
            });
            if (cbian) {
                shiText.text = cbian.shiText;
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
            var xuText = JSON.parse(JSON.stringify(curXuText.data));
            delete xuText.__gohashid;
            // delete xuText.textAlign
            delete xuText.hyperlink;
            delete xuText.figure;
            delete xuText.remark;
            delete xuText.nloc;
            Object.assign(xuText, {
                "key": helpers.guid(),
                "order": order,
                "olive": data.key,
                "text": ""
            });
            if (cbian) {
                xuText.text = cbian.xuText;
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
            data.shiText = shiText.key;
            data.xuText = xuText.key;

            console.log("orderorderorderorder:", order);
            if (node.containingGroup) {
                node.containingGroup.layout.isOngoing = true;
                // node.containingGroup.layout.isInit = true;
                node.containingGroup.layout.isValidLayout = false;
                if (node.containingGroup.containingGroup) {
                    node.containingGroup.containingGroup.layout.isOngoing = true;
                    node.containingGroup.containingGroup.layout.isValidLayout = false;
                }
            }
            data.isNew = true;
            diagram.model.addNodeData(data);
            diagram.model.addNodeData(shiText);
            diagram.model.addNodeData(xuText);
            //diagram.model.setDataProperty(node.containingGroup,"width",300)
            // diagram.model.setDataProperty(node.containingGroup,"width",300)
            diagram.commitTransaction("dspiral");
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
    }, {
        key: 'getAxisGroupData',
        value: function getAxisGroupData(options) {
            var e = this.diagram.lastInput;
            // diagram.startTransaction("addCbian")
            // var groupKey = helpers.guid()

            var basePoint = e.documentPoint;
            var baseLoc = go.Point.stringify(basePoint);
            var axisGroupKey = helpers.guid();
            var labelGroupKey = helpers.guid();
            var waveGroupKey = helpers.guid();
            var olive1Key = helpers.guid();
            var olive2Key = helpers.guid();
            var olive3Key = helpers.guid();
            var olive4Key = helpers.guid();
            var olive1ShiTextKey = helpers.guid();
            var olive1XuTextKey = helpers.guid();
            var olive2ShiTextKey = helpers.guid();
            var olive2XuTextKey = helpers.guid();
            var olive3ShiTextKey = helpers.guid();
            var olive3XuTextKey = helpers.guid();
            var olive4ShiTextKey = helpers.guid();
            var olive4XuTextKey = helpers.guid();
            var olive1CenterTextKey = helpers.guid();
            var olive2CenterTextKey = helpers.guid();
            var olive3CenterTextKey = helpers.guid();
            var olive4CenterTextKey = helpers.guid();

            var temp = [{ "category": "labelGroup", "group": axisGroupKey, "role": "labelGroup", "isGroup": true, "level": 0, "key": labelGroupKey, "loc": go.Point.stringify(basePoint.copy().offset(30, 700)), "deletable": false, "selectable": false }, { "category": "waveGroup", "maxOlive": 15, "deletable": false, "haveTail": true, "oliveType": "Wave", "shiStroke": "#0e399d", "xuStroke": "#cb1c27", "centerStroke": "rgba(9, 166, 9, 1)", "oliveWidth": 150, "oliveHeight": 120, "isGroup": true, "level": 0, "key": waveGroupKey, "loc": baseLoc, "angle": 330.08938180947, "group": axisGroupKey, "movable": false, "desiredSize": "700 120", "textAngle": "horizontal", "centerTextAngle": "independent", "centerTextMode": "independent" }, { "category": "axisGroup", "isGroup": true, "level": 0, "key": axisGroupKey, "loc": baseLoc, "angle": 0, "desiredSize": "300 150" }, { "category": "line", "level": 0, "key": -11, "loc": baseLoc, "desiredSize": "700 1", "width": 1400, "height": 1, "group": waveGroupKey, "angle": 330.08938180947, "role": "centerLine", "selectable": false, "stroke": "rgba(9, 166, 9, 1)" }, { "category": "line", "level": 0, "key": -8, "loc": "-91.91674008334496 -140.02427812707117", "desiredSize": "606.7630471788291 10", "width": 1400, "height": 1, "angle": 0, "group": axisGroupKey, "role": "axisX", "selectable": false, "stroke": "#0e399d" }, { "category": "line", "level": 0, "key": -7, "loc": "-91.91674008334496 -140.02427812707117", "desiredSize": "349.05387059630493 10", "width": 1400, "height": 1, "angle": 270, "group": axisGroupKey, "role": "axisY", "selectable": false, "stroke": "#cb1c27" }, { "text": "能量", "deletable": false, "font": "24px 'Microsoft YaHei'", "category": "autoText", "loc": "-101.91674008334496 -489.0781487233761", "key": -12, "role": "axisYText", "locationSpot": "1 0.5 0 0", "group": axisGroupKey, "movable": true }, { "text": "主题", "role": "themeText", "deletable": false, "font": "24px 'Microsoft YaHei'", "category": "autoText", "loc": go.Point.stringify(basePoint.copy().offset(-30, 0)), "key": -13, "level": 0, "group": axisGroupKey, "locationSpot": "0.5 0 0 0", "movable": true, "width": 300 }, { "text": "时间", "deletable": false, "font": "24px 'Microsoft YaHei'", "category": "autoText", "loc": "514.8463070954841 -140.02427812707117", "key": -14, "role": "axisXText", "group": axisGroupKey, "locationSpot": "0.5 0 0 0" }, { "text": "实线：", "deletable": false, "fill": "#cb1c27", "iconVisible": true, "locationSpot": "0 0 0 0", "textAlign": "start", "category": "autoText", "loc": go.Point.stringify(basePoint.copy().offset(30, -350)), "role": "labelText1", "movable": true, "group": labelGroupKey, "visible": true, "minSize": "120 30" }, { "text": "虚线：", "deletable": false, "fill": "#0e399d", "iconVisible": true, "locationSpot": "0 0 0 0", "textAlign": "start", "category": "autoText", "loc": go.Point.stringify(basePoint.copy().offset(30, -310)), "role": "labelText2", "movable": true, "group": labelGroupKey, "visible": true, "minSize": "120 30" }, { "text": "中线：", "deletable": false, "fill": "#3f5369", "iconVisible": true, "locationSpot": "0 0 0 0", "textAlign": "start", "category": "autoText", "loc": go.Point.stringify(basePoint.copy().offset(30, -270)), "role": "labelText3", "movable": true, "group": labelGroupKey, "visible": true, "minSize": "120 30" }, { "category": "wave", "text": "", "role": "waveTail", "deletable": false, "selectable": false, "level": 0, "key": "2d6ff2f1-0966-36bf-4e85-f5775ca0652b", "group": waveGroupKey, "loc": "710.0826118675676 -829.1890319396903", "desiredSize": "75 120", "order": 999, "oliveType": "Wave", "angle": 330.08938180947, "textAlign": "center", "shiStroke": "#0e399d", "xuStroke": "#cb1c27", "centerText": "df53d882-fe51-d78e-d8e3-8d9681578cb8", "textVisible": false, "isNew": null }];
            if (!options) {
                temp = temp.concat([{ "category": "wave", "text": "1\n", "level": 0, "key": olive1Key, "group": waveGroupKey, "desiredSize": "150 120", "order": 1, "shiText": olive1ShiTextKey, "xuText": olive1XuTextKey, "angle": 330.08938180947, "loc": "-91.91674008334496 -140.02427812707123", "oliveType": "Ellipse", "textAlign": "center", "shiStroke": "#cb1c27", "xuStroke": "#0e399d", "centerText": olive1CenterTextKey, "textVisible": false }, { "deletable": false, "text": "", "font": "18px 'Microsoft YaHei'", "category": "autoText", "key": olive1ShiTextKey, "width": 150, "role": "shiText", "level": 0, "group": waveGroupKey, "order": 1, "olive": olive1Key, "loc": "4.128618140465704 -125.47989214278559", "locationSpot": "0 0 0 0", "textStroke": "#cb1c27", "showBorder": true, "angle": 0, "minSize": "120 30", "textAlign": "start" }, { "deletable": false, "text": "", "font": "18px 'Microsoft YaHei'", "category": "autoText", "key": olive1XuTextKey, "width": 150, "role": "xuText", "level": 0, "group": waveGroupKey, "order": 1, "olive": olive1Key, "loc": "-56.2078366340385 -230.36321886941172", "locationSpot": "1 1 0 0", "textStroke": "#0e399d", "showBorder": true, "angle": 0, "minSize": "120 30", "textAlign": "start" }, { "category": "wave", "text": "3\n", "level": 0, "key": olive2Key, "group": waveGroupKey, "desiredSize": "150 120", "order": 3, "shiText": olive2ShiTextKey, "xuText": olive2XuTextKey, "angle": 330.08938180947, "loc": "168.12456585043884 -289.61879409691636", "oliveType": "Ellipse", "textAlign": "center", "shiStroke": "#cb1c27", "xuStroke": "#0e399d", "centerText": olive2CenterTextKey, "textVisible": false }, { "deletable": false, "text": "", "font": "18px 'Microsoft YaHei'", "category": "autoText", "key": olive2ShiTextKey, "width": 150, "role": "shiText", "level": 0, "group": waveGroupKey, "order": 3, "olive": olive2Key, "loc": "264.16992407424954 -275.07440811263075", "locationSpot": "0 0 0 0", "textStroke": "#cb1c27", "showBorder": true, "angle": 0, "minSize": "120 30", "textAlign": "start" }, { "deletable": false, "text": "", "font": "18px 'Microsoft YaHei'", "category": "autoText", "key": olive2XuTextKey, "width": 150, "role": "xuText", "level": 0, "group": waveGroupKey, "order": 3, "olive": olive2Key, "loc": "203.83346929974533 -379.9577348392569", "locationSpot": "1 1 0 0", "textStroke": "#0e399d", "showBorder": true, "angle": 0, "minSize": "120 30", "textAlign": "start" }, { "category": "wave", "text": "2\n", "level": 0, "key": olive3Key, "group": waveGroupKey, "desiredSize": "150 120", "order": 2, "shiText": olive3ShiTextKey, "xuText": olive3XuTextKey, "angle": 330.08938180947, "loc": "38.10391288354694 -214.8215361119938", "oliveType": "Ellipse", "textAlign": "center", "shiStroke": "#cb1c27", "xuStroke": "#0e399d", "centerText": olive3CenterTextKey, "textVisible": false }, { "deletable": false, "text": "", "font": "18px 'Microsoft YaHei'", "category": "autoText", "key": olive3ShiTextKey, "width": 150, "role": "shiText", "level": 0, "group": waveGroupKey, "order": 2, "olive": olive3Key, "loc": "73.8128163328534 -305.1604768543343", "locationSpot": "1 1 0 0", "textStroke": "#cb1c27", "showBorder": true, "angle": 0, "minSize": "120 30", "textAlign": "start" }, { "deletable": false, "text": "", "font": "18px 'Microsoft YaHei'", "category": "autoText", "key": olive3XuTextKey, "width": 150, "role": "xuText", "level": 0, "group": waveGroupKey, "order": 2, "olive": olive3Key, "loc": "134.1492711073576 -200.27715012770815", "locationSpot": "0 0 0 0", "textStroke": "#0e399d", "showBorder": true, "angle": 0, "minSize": "120 30", "textAlign": "start" }, { "category": "wave", "text": "4\n", "level": 0, "key": olive4Key, "group": waveGroupKey, "desiredSize": "150 120", "order": 4, "shiText": olive4ShiTextKey, "xuText": olive4XuTextKey, "angle": 330.08938180947, "loc": "298.1452188173308 -364.41605208183887", "oliveType": "Ellipse", "textAlign": "center", "shiStroke": "#cb1c27", "xuStroke": "#0e399d", "centerText": olive4CenterTextKey, "textVisible": false }, { "deletable": false, "text": "", "font": "18px 'Microsoft YaHei'", "category": "autoText", "key": olive4ShiTextKey, "width": 150, "role": "shiText", "level": 0, "group": waveGroupKey, "order": 4, "olive": olive4Key, "loc": "333.8541222666372 -454.7549928241794", "locationSpot": "1 1 0 0", "textStroke": "#cb1c27", "showBorder": true, "angle": 0, "minSize": "120 30", "textAlign": "start" }, { "deletable": false, "text": "", "font": "18px 'Microsoft YaHei'", "category": "autoText", "key": olive4XuTextKey, "width": 150, "role": "xuText", "level": 0, "group": waveGroupKey, "order": 4, "olive": olive4Key, "loc": "394.1905770411414 -349.87166609755326", "locationSpot": "0 0 0 0", "textStroke": "#0e399d", "showBorder": true, "angle": 0, "minSize": "120 30", "textAlign": "start" }, { "text": "1\n", "minSize": "120 30", "deletable": false, "textAlign": "center", "font": "18px 'Microsoft YaHei'", "category": "autoText", "key": olive1CenterTextKey, "width": 120, "role": "centerText", "level": 0, "group": waveGroupKey, "order": 1, "visible": true, "layerName": "Foreground", "locationSpot": "0.5 0.5 0 0", "selectable": false, "olive": olive1Key, "loc": "-26.039609246786398 -177.92155550609866", "angle": 0 }, { "text": "2\n", "minSize": "120 30", "deletable": false, "textAlign": "center", "font": "18px 'Microsoft YaHei'", "category": "autoText", "key": olive3CenterTextKey, "width": 120, "role": "centerText", "level": 0, "group": waveGroupKey, "order": 2, "visible": true, "layerName": "Foreground", "locationSpot": "0.5 0.5 0 0", "selectable": false, "olive": olive3Key, "loc": "103.9810437201055 -252.71881349102122", "angle": 0 }, { "text": "3\n", "minSize": "120 30", "deletable": false, "textAlign": "center", "font": "18px 'Microsoft YaHei'", "category": "autoText", "key": olive2CenterTextKey, "width": 120, "role": "centerText", "level": 0, "group": waveGroupKey, "order": 3, "visible": true, "layerName": "Foreground", "locationSpot": "0.5 0.5 0 0", "selectable": false, "olive": olive2Key, "loc": "234.00169668699743 -327.5160714759438", "angle": 0 }, { "text": "4\n", "minSize": "120 30", "deletable": false, "textAlign": "center", "font": "18px 'Microsoft YaHei'", "category": "autoText", "key": olive4CenterTextKey, "width": 120, "role": "centerText", "level": 0, "group": waveGroupKey, "order": 4, "visible": true, "layerName": "Foreground", "locationSpot": "0.5 0.5 0 0", "selectable": false, "olive": olive4Key, "loc": "364.0223496538893 -402.3133294608663", "angle": 0 }]);
            }
            return temp;
        }

        // 增加拓扑

    }, {
        key: 'addAxisGroup',
        value: function addAxisGroup(options) {
            console.log("addOliveaddOlive");
            var diagram = this.diagram;
            var axisGroupCount = 0;
            for (var i = 0; i < diagram.model.nodeDataArray.length; i++) {
                if (diagram.model.nodeDataArray[i].category == "axisGroup") {
                    axisGroupCount += 1;
                }
            }
            // 最多插入13个拓扑
            if (axisGroupCount > 13) {
                return;
            }
            var axisData = this.getAxisGroupData(options);
            if (!axisData) return;
            diagram.startTransaction("dspiral");
            for (var i = 0; i < axisData.length; i++) {
                diagram.model.addNodeData(axisData[i]);
            }

            //diagram.model.setDataProperty(node.containingGroup,"width",300)
            // diagram.model.setDataProperty(node.containingGroup,"width",300)
            diagram.commitTransaction("dspiral");
            return axisData;
            // this.diagram.updateAllTargetBindings()
            // setTimeout(()=>{
            //     // this.diagram.updateAllTargetBindings()
            //     this.diagram.layoutDiagram(true)
            // },500)
            // this.layoutAllGroup()
        }
        // 选择文本节点

    }, {
        key: 'selectText',
        value: function selectText(e) {
            // console.log("selectTextselectTextselectText")
            var myDiagram = this.diagram;
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
            if (!helpers.checkPhone()) {
                helpers.simulateEnterWithAlt(e);
            } else {
                var val = myDiagram.currentTool.currentTextEditor.mainElement.value;
                myDiagram.currentTool.currentTextEditor.mainElement.selectionStart = val.length;
                myDiagram.currentTool.currentTextEditor.mainElement.selectionEnd = val.length;
            }
        }
    }, {
        key: 'clearAllTextBorder',
        value: function clearAllTextBorder() {
            var it = this.diagram.nodes.iterator;
            while (it.next()) {
                var n = it.value;
                if (n.data.category == "autoText") {
                    n.findObject("textBorder").visible = false;
                }
            }
        }
    }, {
        key: 'triggerShowFireText',
        value: function triggerShowFireText() {
            var e = this.diagram.lastInput;
            var node = this.diagram.selection.first();
            if (!node) return;
            node.__trtdNode.dealFireText(e);
        }

        // 获取火花矩阵某一圈的文字

    }, {
        key: 'apiGetFireText',
        value: function apiGetFireText(theta) {
            var fireTexts = {};
            var node = this.diagram.selection.first();
            // var group = node.containingGroup;

            if (!node) return fireTexts;
            if (node.containingGroup && node.containingGroup.data.category == "yunGroup") {
                var group = node.containingGroup;
                var it;
                if (theta) {
                    it = group.findSubGraphParts().iterator;
                    while (it.next()) {
                        if (it.value.data.theta == theta) {
                            node = it.value;
                            break;
                        }
                    }
                    it.reset();
                }
                var x = Math.max(Math.abs(node.data.orderX - 10), Math.abs(node.data.orderY - 10));
                it = group.findSubGraphParts().iterator;
                while (it.next()) {
                    var n = it.value;
                    if (n.data.dimX == 0 && n.data.dimY == 19) {
                        fireTexts.dimText1 = n;
                    }
                    if (n.data.dimX == 10 && n.data.dimY == 19) {
                        fireTexts.dimText2 = n;
                    }
                    if (n.data.dimX == 19 && n.data.dimY == 19) {
                        fireTexts.dimText3 = n;
                    }
                    if (n.data.dimX == 19 && n.data.dimY == 10) {
                        fireTexts.dimText4 = n;
                    }
                    if (n.data.dimX == 19 && n.data.dimY == 19) {
                        fireTexts.dimText5 = n;
                    }
                    if (n.data.dimX == 10 && n.data.dimY == 0) {
                        fireTexts.dimText6 = n;
                    }
                    if (n.data.dimX == 0 && n.data.dimY == 0) {
                        fireTexts.dimText7 = n;
                    }
                    if (n.data.dimX == 0 && n.data.dimY == 10) {
                        fireTexts.dimText8 = n;
                    }
                    if (n.data.orderX == 10 - x && n.data.orderY == 10 + x) {
                        fireTexts.text1 = n;
                    }

                    if (n.data.orderX == 10 && n.data.orderY == 10 + x) {
                        fireTexts.text2 = n;
                    }
                    if (n.data.orderX == 10 + x && n.data.orderY == 10 + x) {
                        fireTexts.text3 = n;
                    }
                    if (n.data.orderX == 10 + x && n.data.orderY == 10) {
                        fireTexts.text4 = n;
                    }
                    if (n.data.orderX == 10 + x && n.data.orderY == 10 - x) {
                        fireTexts.text5 = n;
                    }
                    if (n.data.orderX == 10 && n.data.orderY == 10 - x) {
                        fireTexts.text6 = n;
                    }
                    if (n.data.orderX == 10 - x && n.data.orderY == 10 - x) {
                        fireTexts.text7 = n;
                    }
                    if (n.data.orderX == 10 - x && n.data.orderY == 10) {
                        fireTexts.text8 = n;
                    }
                    if (n.data.subRole == "themeText") {
                        fireTexts.themeText = n;
                    }
                }
                fireTexts.radius = x;
                return fireTexts;
            }
            return fireTexts;
        }
    }, {
        key: 'apiSwitchWaveTail',
        value: function apiSwitchWaveTail() {
            console.log("apiSwitchWaveTailapiSwitchWaveTail");
            var node = this.diagram.selection.first();
            if (!node) return;
            this.diagram.startTransaction();
            // this.diagram.model.setDataProperty(node.data, "oliveType", "Ellipse")
            // this.diagram.model.setDataProperty(node.data, "haveTail", false)
            var it = node.findSubGraphParts().iterator;
            var waveTail = null; // 查找是否存在尾巴
            var lastNode = null;
            var loc;
            while (it.next()) {
                var n = it.value;
                lastNode = n;
                if (n.data.role == "waveTail") {
                    waveTail = n;
                    break;
                }
            }
            if (lastNode) {
                loc = lastNode.data.loc;
            } else {
                loc = node.data.loc;
            }
            if (waveTail) {
                this.diagram.model.removeNodeData(waveTail.data);
                this.diagram.model.setDataProperty(node.data, "haveTail", false);
            } else {
                var _tailOlive;

                this.diagram.model.setDataProperty(node.data, "haveTail", true);
                var tailOlive = (_tailOlive = { "category": "wave",
                    "text": "",
                    "role": "waveTail",
                    deletable: false,
                    "selectable": false
                }, _defineProperty(_tailOlive, 'deletable', false), _defineProperty(_tailOlive, "level", 0), _defineProperty(_tailOlive, "key", helpers.guid()), _defineProperty(_tailOlive, "group", node.data.key), _defineProperty(_tailOlive, "loc", loc), _defineProperty(_tailOlive, "desiredSize", node.data.oliveWidth + ' ' + node.data.oliveHeight), _defineProperty(_tailOlive, "order", 2000), _tailOlive);
                this.diagram.model.addNodeData(tailOlive);
            }
            node.layout.isOngoing = true;
            node.layout.isValidLayout = false;
            this.diagram.commitTransaction();
        }

        //切换为橄榄形状

    }, {
        key: 'apiSwitchToEllipse',
        value: function apiSwitchToEllipse() {
            console.log("apiSwitchToEllipse");
            var node = this.diagram.selection.first();
            if (!node) return;
            this.diagram.startTransaction();
            this.diagram.model.setDataProperty(node.data, "oliveType", "Ellipse");
            // this.diagram.model.setDataProperty(node.data, "haveTail", false)
            var it = node.findSubGraphParts().iterator;
            var waveTail = null; // 查找是否存在尾巴

            while (it.next()) {
                var n = it.value;
                if (n.data.role == "waveTail") {
                    waveTail = n;
                    break;
                }
            }

            if (waveTail) {
                this.diagram.model.removeNodeData(waveTail.data);
            }
            node.layout.isOngoing = true;
            node.layout.isValidLayout = false;
            if (node.containingGroup) {
                node.containingGroup.layout.isOngoing = true;
                node.containingGroup.layout.isValidLayout = false;
            }
            this.diagram.commitTransaction();
        }

        // 切换为螺旋形状

    }, {
        key: 'apiSwitchToWave',
        value: function apiSwitchToWave() {
            var node = this.diagram.selection.first();
            if (!node) return;
            this.diagram.startTransaction("apiSwitchToWave");
            this.diagram.model.setDataProperty(node.data, "oliveType", "Wave");
            // this.diagram.model.setDataProperty(node.data, "haveTail", true)
            var it = node.findSubGraphParts().iterator;
            var waveTail = null; // 查找是否存在尾巴
            var lastNode = null;
            var haveTail = node.data.haveTail;
            var loc;
            while (it.next()) {
                var n = it.value;
                lastNode = n;
                if (n.data.role == "waveTail") {
                    waveTail = n;
                    break;
                }
            }
            if (lastNode) {
                loc = lastNode.data.loc;
            } else {
                loc = node.data.loc;
            }
            if (!waveTail && haveTail == true) {
                var _tailOlive2;

                var tailOlive = (_tailOlive2 = { "category": "wave",
                    "text": "",
                    "role": "waveTail",
                    deletable: false,
                    "selectable": false
                }, _defineProperty(_tailOlive2, 'deletable', false), _defineProperty(_tailOlive2, "level", 0), _defineProperty(_tailOlive2, "key", helpers.guid()), _defineProperty(_tailOlive2, "group", node.data.key), _defineProperty(_tailOlive2, "loc", loc), _defineProperty(_tailOlive2, "desiredSize", node.data.oliveWidth + ' ' + node.data.oliveHeight), _defineProperty(_tailOlive2, "order", 2000), _tailOlive2);
                this.diagram.model.addNodeData(tailOlive);
            }
            node.layout.isOngoing = true;
            node.layout.isValidLayout = false;
            if (node.containingGroup) {
                node.containingGroup.layout.isOngoing = true;
                node.containingGroup.layout.isValidLayout = false;
            }
            this.diagram.commitTransaction("apiSwitchToWave");
        }

        // 切换文字方向

    }, {
        key: 'apiSwitchTextAngle',
        value: function apiSwitchTextAngle(textAngle) {
            var node = this.diagram.selection.first();
            if (!node) return;
            var mapObj = {
                "horizontal": "vertical",
                "vertical": "horizontal"
            };
            console.log("apiSwitchTextAngle");

            node.diagram.startTransaction("apiSwitchTextAngle");
            if (textAngle && ["horizontal", "vertical"].indexOf(textAngle) > -1) {
                node.diagram.model.setDataProperty(node.data, "textAngle", textAngle);
                node.data.textAngle = textAngle;
            } else {
                textAngle = mapObj[node.data.textAngle] || "horizontal";
                node.diagram.model.setDataProperty(node.data, "textAngle", textAngle);
                node.data.textAngle = textAngle;
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
            node.diagram.commitTransaction("apiSwitchTextAngle");
            // this.diagram.startTransaction("layout")
            // node.layout.isOngoing = true;
            // node.layout.isValidLayout = false;
            // this.diagram.commitTransaction("layout")
            // this.diagram.updateAllTargetBindings()
            // this.diagram.layoutDiagram(true)
        }

        // 以下两个方法控制菜单显示

    }, {
        key: 'getDefaultCustomMenuDivStr',
        value: function getDefaultCustomMenuDivStr() {
            return '\n        <ul>\n            <li trtd_action="exportAsSubFigure"><a class="i18n" data-lang="cancelfix">\u521B\u5EFA\u4E3A\u5B50\u76D8</a></li>\n            <li trtd_action="drillAnalyze"><a class="i18n" data-lang="cancelfix">\u63D2\u5165\u5B50\u76D8</a></li>\n            <li trtd_action="addFollower"><a class="i18n" data-lang="insertsl">\u63D2\u5165\u540C\u7EA7\u8282\u70B9</a></li>\n            <li trtd_action="startNewSpiral"><a class="i18n" data-lang="icn">\u63D2\u5165\u5B50\u8282\u70B9</a></li>\n            <li trtd_action="apiDuplicateNode"><a class="i18n" data-lang="duplicateNode">\u590D\u5236\u8282\u70B9</a></li>\n            <li trtd_action="apiDeleteSelection"><a class="i18n" data-lang="remove">\u5220\u9664</a></li>\n            <li trtd_action="splitOlive2Cbian"><a class="i18n" data-lang="remove">\u5206\u79BB</a></li>\n            <li trtd_action="splitOlive2Half"><a class="i18n" data-lang="remove">\u62C6\u5206</a></li>\n            <li trtd_action="orderChildNode"><a class="i18n" data-lang="ordernode">\u5B50\u8282\u70B9\u7F16\u53F7</a></li>\n            <li trtd_action="clearOrderChildNode"><a class="i18n" data-lang="clearordernode">\u53D6\u6D88\u5B50\u8282\u70B9\u7F16\u53F7</a></li>\n            <li trtd_action="clearNodeTextMenu"><a class="i18n" data-lang="emptynodetext">\u6E05\u7A7A\u8282\u70B9\u6587\u672C</a></li>\n            <li trtd_action="apiInsertTianpanNode"><a class="i18n" data-lang="insertnodetianpan">\u63D2\u5165\u5929\u76D8\u8282\u70B9</a></li>\n            <li trtd_action="addTextNode"><a class="i18n" data-lang="inserttext">\u63D2\u5165\u6587\u672C</a></li>\n            <li trtd_action="locateRootNodeMenu"><a class="i18n" data-lang="locaterootnode">\u5B9A\u4F4D\u6839\u8282\u70B9</a></li>\n            <li trtd_action="showAllNodesMenu"><a class="i18n" data-lang="displayallnodes">\u663E\u793A\u6240\u6709\u8282\u70B9</a></li>\n            <li trtd_action="fixPictureMenu"><a class="i18n" data-lang="fixnode">\u56FA\u5B9A\u8282\u70B9</a></li>\n            <li trtd_action="activePictureMenu"><a class="i18n" data-lang="cancelfix">\u53D6\u6D88\u56FA\u5B9A</a></li>\n            <li trtd_action="apiSwitchToEllipse"><a class="i18n" data-lang="cancelfix">\u5207\u6362\u4E3A\u6A44\u6984\u5F62\u72B6</a></li>\n            <li trtd_action="apiSwitchToWave"><a class="i18n" data-lang="cancelfix">\u5207\u6362\u4E3A\u87BA\u65CB\u5F62\u72B6</a></li>\n            <li trtd_action="apiSwitchWaveTail"><a class="i18n" data-lang="cancelfix">\u6DFB\u52A0/\u5220\u9664\u5C3E\u5DF4</a></li>\n            <li trtd_action="apiSwitchTextAngle"><a class="i18n" data-lang="cancelfix">\u5207\u6362\u6587\u5B57\u65B9\u5411</a></li>\n            <li trtd_action="addCbian"><a class="i18n" data-lang="cancelfix">\u6DFB\u52A0\u603B\u7ED3\u56FE</a></li>\n            <li trtd_action="addAxisGroup"><a class="i18n" data-lang="cancelfix">\u63D2\u5165\u62D3\u6251</a></li>\n            <li trtd_action="showRect"><a class="i18n" data-lang="cancelfix">\u663E\u793A\u77E9\u5F62\u7EBF</a></li>\n            <li trtd_action="hideRect"><a class="i18n" data-lang="cancelfix">\u9690\u85CF\u77E9\u5F62\u7EBF</a></li>\n            <li trtd_action="offShowRedLine"><a class="i18n" data-lang="cancelfix">\u5173\u95ED\u81EA\u52A8\u663E\u793A\u7EA2\u7EBF</a></li>\n            <li trtd_action="autoShowRedline"><a class="i18n" data-lang="cancelfix">\u81EA\u52A8\u663E\u793A\u81EA\u65CB\u7EA2\u7EBF</a></li>\n            <li trtd_action="bringupLayer"><a class="i18n" data-lang="cancelfix">\u4E0A\u79FB\u4E00\u5C42</a></li>\n            <li trtd_action="bringdownLayer"><a class="i18n" data-lang="cancelfix">\u4E0B\u79FB\u4E00\u5C42</a></li>\n            <li trtd_action="bringToBackground"><a class="i18n" data-lang="cancelfix">\u7F6E\u4E8E\u5E95\u5C42</a></li>\n            <li trtd_action="bringToForeground"><a class="i18n" data-lang="cancelfix">\u7F6E\u4E8E\u9876\u5C42</a></li>\n            <li trtd_action="addDimTtext"><a class="i18n" data-lang="cancelfix">\u589E\u52A0\u7EF4\u5EA6</a></li>\n            <li trtd_action="switchCbianSize"><a class="i18n" data-lang="cancelfix">\u5207\u6362\u5927\u5C0F</a></li>\n            <li trtd_action="copyWaveGroup"><a class="i18n" data-lang="cancelfix">\u590D\u5236</a></li>\n        </ul>\n        ';
        }
    }, {
        key: 'getShowContextMenus',
        value: function getShowContextMenus(node) {
            var showIds = null;
            console.log("getShowContextMenus");
            if (node) {
                // 双螺旋可以添加常变
                if (["axisGroup"].indexOf(node.data.category) > -1) {
                    showIds = "addCbian,apiDeleteSelection,exportAsSubFigure,copyWaveGroup";
                }
                if (["picGroup"].indexOf(node.data.category) > -1) {
                    showIds = "apiDeleteSelection,switchCbianSize";
                }

                if (["3"].indexOf(node.data.category) > -1) {
                    showIds = "bringupLayer,apiDeleteSelection,bringdownLayer,bringToBackground,bringToForeground";
                }

                if (["wave"].indexOf(node.data.category) > -1) {
                    if (node.data.deletable != null) {
                        if (node.data.deletable) {
                            showIds = "apiDeleteSelection,splitOlive2Cbian,splitOlive2Half";
                        }
                    } else {
                        if (node.deletable) {
                            showIds = "apiDeleteSelection,splitOlive2Cbian,splitOlive2Half";
                        }
                    }
                }
                console.log("waveGroupwaveGroup");
                if (["waveGroup"].indexOf(node.data.category) > -1) {
                    showIds = "apiSwitchTextAngle,";
                    if (node.data.oliveType == "Ellipse") {
                        showIds += "apiSwitchToWave";
                    } else {
                        showIds += "apiSwitchToEllipse,apiSwitchWaveTail";
                    }
                }
                if (["yunGroup"].indexOf(node.data.category) > -1) {
                    showIds = "";
                    if (node.data.showShape) {
                        showIds += "hideRect";
                    } else {
                        showIds += "showRect";
                    }
                    if (node.data.beginSpark != "line") {
                        showIds += ",autoShowRedline";
                    } else {
                        showIds += ",offShowRedLine";
                    }
                }
                if (["autoText"].indexOf(node.data.category) > -1 && ["shiText", "xuText"].indexOf(node.data.role) < 0) {
                    showIds = "apiDeleteSelection";
                }
                if (node.data.subRole == "dimText" && node.containingGroup.data.category == "yunpanGroup") {
                    showIds = "apiDeleteSelection,addDimTtext";
                }
                if (node.data.category == "shapeText" && node.containingGroup.data.category == "yunpanGroup") {
                    showIds = "apiDeleteSelection";
                }

                // 橄榄/文字节点可以拓扑钻取分析
                if (["wave", "autoText", "shapeText"].indexOf(node.data.category) > -1) {
                    if (node.data.text) {
                        showIds += ",drillAnalyze";
                    }
                }
                if (["autoText"].indexOf(node.data.category) > -1) {
                    // if(node.data.text){
                    showIds += ",apiDuplicateNode";
                    // }
                }

                // apiDuplicateNode
                // return "addFollowerGround," + "addNewCircle,"+"apiDeleteSelection";
            } else {
                // return "addFollowerGround"
                console.log("show menu ...............", this.canAddAxisGroup);
                if (this.canAddAxisGroup) {
                    showIds = "addCbian,addAxisGroup";
                } else {
                    showIds = "addCbian";
                }
            }

            return showIds;
        }

        // 云盘增加维度

    }, {
        key: 'addDimTtext',
        value: function addDimTtext() {
            var node = this.diagram.selection.first();
            var myDiagram = this.diagram;
            if (!node) return;
            if (node.data.subRole != "dimText") return;
            var count = 0;
            var it = node.containingGroup.findSubGraphParts().iterator;
            var deleteNodes = [];
            var deleteLines = [];
            var curLine = null;
            var normDim = "X",
                unnormDim = "Y",
                lineRole = "verticalLine";
            if (node.data.dimX == 0) {
                normDim = "Y";
                unnormDim = "X";
                lineRole = "horizontalLine";
            }
            while (it.next()) {
                var n = it.value;
                if (n.data.subRole == "dimText" && n.data["dim" + unnormDim] == 0) {
                    // if(n.data.order == node.data.order+1){
                    //     locateNode = n;
                    // }
                    count++;
                }
                if (n.data.subRole == "yunpanText" && n.data["order" + normDim] == node.data["dim" + normDim]) {
                    deleteNodes.push(n.data);
                }
                if (n.data.category == "line" && n.data.role == lineRole && n.data["order"] == node.data["dim" + normDim]) {
                    curLine = n;
                }
                // if(n.data.role == "xuText" && n.data.order == node.data.order){
                //     xuText = n;
                // }
                // if(n.data.role == "centerText" && n.data.order == node.data.order){
                //     centerText = n;
                // }
            }

            if (count >= 30) {

                return;
            }
            this.diagram.startTransaction("addDimTtext");
            it.reset();
            while (it.next()) {
                var n = it.value;
                if (n.data.subRole == "dimText" && n.data["dim" + unnormDim] == 0 && n.data["dim" + normDim] > node.data["dim" + normDim]) {
                    // if(n.data.order == node.data.order+1){
                    //     locateNode = n;
                    // }
                    n.diagram.model.setDataProperty(n.data, "dim" + normDim, n.data["dim" + normDim] + 1);
                    // count++;
                }
                if (n.data.subRole == "yunpanText" && n.data["order" + normDim] > node.data["dim" + normDim]) {
                    n.diagram.model.setDataProperty(n.data, "order" + normDim, n.data["order" + normDim] + 1);
                }
                if (n.data.category == "line" && n.data.role == lineRole && n.data["order"] > node.data["dim" + normDim]) {
                    n.diagram.model.setDataProperty(n.data, "order", n.data["order"] + 1);
                }
                // if(n.data.role == "xuText" && n.data.order == node.data.order){
                //     xuText = n;
                // }
                // if(n.data.role == "centerText" && n.data.order == node.data.order){
                //     centerText = n;
                // }
            }
            var dimTextData = JSON.parse(JSON.stringify(node.data));
            delete dimTextData.key;
            delete dimTextData.__gohashid;
            if (curLine) {
                var lineData = JSON.parse(JSON.stringify(curLine.data));
                delete lineData.key;
                delete lineData.__gohashid;
                lineData["order"] = lineData["order"] + 1;
                node.diagram.model.addNodeData(lineData);
            }
            // Object.assign(dimTextData, {

            // })
            dimTextData["dim" + normDim] = node.data["dim" + normDim] + 1;
            dimTextData.text = "维度" + dimTextData["dim" + normDim];
            node.diagram.model.addNodeData(dimTextData);
            // node.diagram.model.removeNodeDataCollection(deleteNodes)
            node.containingGroup.layout.isOngoing = true;
            node.containingGroup.layout.isValidLayout = false;
            this.diagram.commitTransaction("addDimTtext");
        }
    }, {
        key: 'switchCbianSize',
        value: function switchCbianSize() {
            console.log("switchCbianSizeswitchCbianSize");
            var node = this.diagram.selection.first();
            if (!node) return;
            if (node.data.cbianType == "big") {
                node.__trtdNode.changeCbianSize(node, "small");
            } else {
                node.__trtdNode.changeCbianSize(node, "big");
            }
        }
    }, {
        key: 'bringToBackground',
        value: function bringToBackground() {
            var node = this.diagram.selection.first();
            var myDiagram = this.diagram;
            myDiagram.model.startTransaction();
            myDiagram.model.setDataProperty(node.data, "layerName", "Background");
            myDiagram.model.setDataProperty(node.data, "zOrder", 1);
            myDiagram.model.commitTransaction();
        }
    }, {
        key: 'bringToForeground',
        value: function bringToForeground() {
            var node = this.diagram.selection.first();
            var myDiagram = this.diagram;
            myDiagram.model.startTransaction();
            myDiagram.model.setDataProperty(node.data, "layerName", "Foreground");
            myDiagram.model.setDataProperty(node.data, "zOrder", 999);
            myDiagram.model.commitTransaction();
        }
    }, {
        key: 'bringdownLayer',
        value: function bringdownLayer() {
            var node = this.diagram.selection.first();
            var myDiagram = this.diagram;
            if (!node) return;
            var layerName = node.layerName;
            var toLayerName = layerName;
            var zOrder = node.zOrder;
            var toZOrder = 1;
            if (layerName == "Foreground") {
                toLayerName = "default";
            }
            if (layerName == "default") {
                toLayerName = "Background";
            }
            if (layerName == "Background") {
                toLayerName = "Background";
            }
            myDiagram.model.startTransaction();
            myDiagram.model.setDataProperty(node.data, "layerName", toLayerName);
            myDiagram.model.setDataProperty(node.data, "zOrder", toZOrder);
            myDiagram.model.commitTransaction();
        }
    }, {
        key: 'bringupLayer',
        value: function bringupLayer() {
            var node = this.diagram.selection.first();
            var myDiagram = this.diagram;
            if (!node) return;
            var layerName = node.layerName;
            var toLayerName = layerName;
            var zOrder = node.zOrder;
            var toZOrder = 999;
            if (layerName == "Background") {
                toLayerName = "default";
            }
            if (layerName == "default") {
                toLayerName = "Foreground";
            }
            if (layerName == "Foreground") {
                toLayerName = "Foreground";
            }
            myDiagram.model.startTransaction();
            myDiagram.model.setDataProperty(node.data, "layerName", toLayerName);
            myDiagram.model.setDataProperty(node.data, "zOrder", toZOrder);
            myDiagram.model.commitTransaction();
        }
    }, {
        key: 'bringToLayer',
        value: function bringToLayer(layerName, zOrder) {

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
    }, {
        key: 'showRect',
        value: function showRect() {
            var node = this.diagram.selection.first();
            console.log("show shape");
            if (!node) return;
            if (node.data.category != "yunGroup") return;
            node.diagram.startTransaction("showRect");
            node.diagram.model.setDataProperty(node.data, "showShape", true);
            var it = node.findSubGraphParts().iterator;
            while (it.next()) {
                var n = it.value;
                if (n.data.role == "background") {
                    node.diagram.model.setDataProperty(n.data, "visible", true);
                }
            }
            node.layout.isValidLayout = false;
            node.diagram.commitTransaction("showRect");
        }
    }, {
        key: 'hideRect',
        value: function hideRect() {
            var node = this.diagram.selection.first();
            if (!node) return;
            if (node.data.category != "yunGroup") return;
            node.diagram.startTransaction("hideRect");
            node.diagram.model.setDataProperty(node.data, "showShape", false);
            var it = node.findSubGraphParts().iterator;
            while (it.next()) {
                var n = it.value;
                if (n.data.role == "background") {
                    node.diagram.model.setDataProperty(n.data, "visible", true);
                    node.diagram.model.setDataProperty(n.data, "stroke", "rgba(255,0,0,0)");
                }
            }
            node.diagram.commitTransaction("hideRect");
        }
    }, {
        key: 'autoShowRedline',
        value: function autoShowRedline() {
            var node = this.diagram.selection.first();
            if (!node) return;
            if (node.data.category != "yunGroup") return;
            node.diagram.startTransaction("beginSpark");
            node.diagram.model.setDataProperty(node.data, "beginSpark", "line");
            node.diagram.commitTransaction("beginSpark");
        }
    }, {
        key: 'offShowRedLine',
        value: function offShowRedLine() {
            var node = this.diagram.selection.first();
            if (!node) return;
            if (node.data.category != "yunGroup") return;
            node.diagram.startTransaction("offShowRedLine");
            node.diagram.model.setDataProperty(node.data, "beginSpark", undefined);
            node.diagram.commitTransaction("offShowRedLine");
        }
        //快捷键

    }, {
        key: 'dokeyDownFn',
        value: function dokeyDownFn(e) {
            var _this3 = this;

            console.log('dspirallllllllllllllllllllllllll:');
            var diagram = this.diagram;
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
                var node = myDiagram.selection.first();
                if (!node) return;
                if (node.data.category == "wave" && node.containingGroup && node.containingGroup.data.textAngle == "horizontal" && node.containingGroup.data.centerTextAngle == "independent") {
                    node.findObject("TEXT").visible = true;
                    var centerText = node.diagram.findNodeForKey(node.data.centerText);
                    if (centerText) {
                        centerText.visible = false;
                    }
                }
                setTimeout(function () {
                    if (_this3.textDoubleClick) {
                        return _this3.textDoubleClick(e, node);
                    }
                    _this3.selectText(e, diagram);
                }, 100);
                return true;
            }
            // console.log('catched in dokeydown ' + e.event.keyCode);
            // console.log('catched in dokeydown ' + e.key);
            if (e.event.keyCode === 13) {
                // could also check for e.control or e.shift
                console.log("dspiral add Follower");
                var node = myDiagram.selection.first();
                if (node && node.category == "wave") {
                    // this.addFollower(e, true);
                    this.addOlive();
                }
            } else if (e.event.keyCode === 9) {
                // could also check for e.control or e.shift
                this.addFollower(true);
            } else if (e.key === "t") {
                // could also check for e.control or e.shift
                if (cmd.canCollapseSubGraph()) {
                    cmd.collapseSubGraph();
                } else if (cmd.canExpandSubGraph()) {
                    cmd.expandSubGraph();
                }
            } else if (e.key == "Del") {
                e.diagram.commandHandler.deleteSelection();
            } else if (e.event.keyCode == 113) {
                //F2,不知道为什么失效了，重新赋予功能
                // selectText();
                this.selectText(e, diagram);
            } else if (e.event.keyCode == 37) {
                //左
                this.moveWithinNodes('left', diagram);
                // go.CommandHandler.prototype.doKeyDown.call(cmd);
            } else if (e.event.keyCode == 38) {
                //上
                this.moveWithinNodes('up', diagram);
                // go.CommandHandler.prototype.doKeyDown.call(cmd);
            } else if (e.event.keyCode == 39) {
                //右
                this.moveWithinNodes('right', diagram);
                // go.CommandHandler.prototype.doKeyDown.call(cmd);
            } else if (e.event.keyCode == 40) {
                //下
                this.moveWithinNodes('down', diagram);
                // go.CommandHandler.prototype.doKeyDown.call(cmd);
            } else {
                // call base method with no arguments
                go.CommandHandler.prototype.doKeyDown.call(cmd);
            }
            e.bubbles = false; //阻止事件冒泡到dom
        }
    }, {
        key: 'findPrevOlive',
        value: function findPrevOlive(node) {
            if (node.data.order <= 1) {
                return null;
            }
            var prenode = null;
            var it = node.containingGroup.findSubGraphParts().iterator;
            while (it.next()) {
                var n = it.value;
                if (n.data.category == "wave") {
                    if (n.data.order == node.data.order - 1) {
                        prenode = n;
                        break;
                    }
                }
            }
            return prenode;
        }
    }, {
        key: 'findNextOlive',
        value: function findNextOlive(node) {
            var nextnode = null;
            var it = node.containingGroup.findSubGraphParts().iterator;
            while (it.next()) {
                var n = it.value;
                if (n.data.role == "waveTail") {
                    continue;
                }
                if (node.data.category == "autoText") {
                    if (n.data.role == "shiText") {
                        if (n.data.order == node.data.order + 1) {
                            nextnode = n;
                            break;
                        }
                    }
                } else {
                    if (n.data.category == "wave") {
                        if (n.data.order == node.data.order + 1) {
                            nextnode = n;
                            break;
                        }
                    }
                }
            }
            return nextnode;
        }
    }, {
        key: 'findUpOlive',
        value: function findUpOlive(node) {
            var upnode = null;
            if (node.data.category == "wave") {
                if (node.data.order % 2 != 0) {
                    upnode = this.diagram.findNodeForKey(node.data.xuText);
                } else {
                    upnode = this.diagram.findNodeForKey(node.data.shiText);
                }
            }
            if (node.data.role == "xuText") {
                if (node.data.order % 2 != 0) {
                    // upnode = this.diagram.findNodeForKey(node.data.xuText)
                } else {
                    upnode = this.diagram.findNodeForKey(node.data.olive);
                }
            }
            if (node.data.role == "shiText") {
                if (node.data.order % 2 != 0) {
                    upnode = this.diagram.findNodeForKey(node.data.olive);
                } else {
                    // upnode = this.diagram.findNodeForKey(node.data.olive)
                }
            }
            return upnode;
        }
    }, {
        key: 'findDownOlive',
        value: function findDownOlive(node) {
            var downnode = null;
            if (node.data.category == "wave") {
                if (node.data.order % 2 != 0) {
                    downnode = this.diagram.findNodeForKey(node.data.shiText);
                } else {
                    downnode = this.diagram.findNodeForKey(node.data.xuText);
                }
            }
            if (node.data.role == "xuText") {
                if (node.data.order % 2 != 0) {
                    downnode = this.diagram.findNodeForKey(node.data.olive);
                } else {
                    // downnode = this.diagram.findNodeForKey(node.data.olive)
                }
            }
            if (node.data.role == "shiText") {
                if (node.data.order % 2 != 0) {
                    // downnode = this.diagram.findNodeForKey(node.data.olive)
                } else {
                    downnode = this.diagram.findNodeForKey(node.data.olive);
                }
            }
            return downnode;
        }
    }, {
        key: 'moveWithinNodes',
        value: function moveWithinNodes(direction) {
            var myDiagram = this.diagram;
            var node = myDiagram.selection.first();
            if (!node) {
                return;
            }
            // 火花矩阵文字
            if (node.data.category == "autoText" && node.data.subRole == "coreText") {
                if (!(node.containingGroup && node.containingGroup.data.category == "yunGroup")) {
                    return;
                }
                var nextNode;
                var centerOrderX = 30000;
                var centerOrderY = 30000;
                if (node.containingGroup.__yunPointsX && node.containingGroup.__yunPointsY) {
                    centerOrderX = (node.containingGroup.__yunPointsX.length + 1) / 2;
                    centerOrderY = (node.containingGroup.__yunPointsY.length + 1) / 2;
                }
                switch (direction) {
                    case 'left':
                        if (node.data.orderX == centerOrderX) {
                            return;
                        }
                        var it = node.containingGroup.findSubGraphParts().iterator;
                        while (it.next()) {
                            var n = it.value;
                            if (n.data.subRole == "coreText" && n.data.dimKey == node.data.dimKey) {
                                if (Number(n.data.orderX) == Number(node.data.orderX) - 1) {
                                    nextNode = n;
                                    break;
                                }
                            }
                        }
                        break;
                    case 'up':
                        if (node.data.orderY == centerOrderY) {
                            return;
                        }
                        var it = node.containingGroup.findSubGraphParts().iterator;
                        while (it.next()) {
                            var n = it.value;
                            if (n.data.subRole == "coreText" && n.data.dimKey == node.data.dimKey) {
                                if (Number(n.data.orderY) == Number(node.data.orderY) + 1) {
                                    nextNode = n;
                                    break;
                                }
                            }
                        }
                        break;
                    case 'right':
                        if (node.data.orderX == centerOrderX) {
                            return;
                        }
                        var it = node.containingGroup.findSubGraphParts().iterator;
                        while (it.next()) {
                            var n = it.value;
                            if (n.data.subRole == "coreText" && n.data.dimKey == node.data.dimKey) {
                                if (Number(n.data.orderX) == Number(node.data.orderX) + 1) {
                                    nextNode = n;
                                    break;
                                }
                            }
                        }
                        break;
                    case 'down':
                        if (node.data.orderY == centerOrderY) {
                            return;
                        }
                        var it = node.containingGroup.findSubGraphParts().iterator;
                        while (it.next()) {
                            var n = it.value;
                            if (n.data.subRole == "coreText" && n.data.dimKey == node.data.dimKey) {
                                if (Number(n.data.orderY) == Number(node.data.orderY) - 1) {
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

            if (node.data.category == "wave" || node.data.role == "shiText" || node.data.role == "xuText") {
                switch (direction) {
                    case 'left':
                        var prevNode = this.findPrevOlive(node);
                        if (prevNode) {
                            myDiagram.select(prevNode);
                        }
                        break;
                    case 'up':
                        var upNode = this.findUpOlive(node);
                        if (upNode) {
                            myDiagram.select(upNode);
                        }
                        break;
                    case 'right':
                        var nextNode = this.findNextOlive(node);
                        if (nextNode) {
                            myDiagram.select(nextNode);
                        }
                        break;
                    case 'down':
                        var downNode = this.findDownOlive(node);
                        if (downNode) {
                            myDiagram.select(downNode);
                        }
                        break;
                }
            }
        }
        // 拓扑分析

    }, {
        key: 'drillAnalyze',
        value: function drillAnalyze() {
            console.log("拓扑分析");
            var node = this.diagram.selection.first();
            if (!node) return;
            // 如果当前节点包含有figure属性
            if (node.data.figure != null) {
                if (this.openFigure) {
                    this.openFigure({
                        figure: node.data.figure,
                        title: node.data.text,
                        key: node.data.key,
                        node: node
                    });
                }
            } else {
                if (this.createFigure) {
                    var figure = this.createFigure({
                        title: node.data.text || "未命名拓扑",
                        key: node.data.key,
                        node: node
                    });
                    // if(figure){
                    //     node.data.figure = figure;
                    // }
                }
            }
        }
    }]);

    return Trtd;
}(Trtd_tianpan);

// export default Trtd;


module.exports = Trtd;

/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var $ = go.GraphObject.make;
var svg = __webpack_require__(8);

// 返回svg节点
module.exports = function createArcNodeTemplate(diagram) {
    var properties = {
        figure: "Circle",
        fill: "white",
        strokeWidth: 2,
        stroke: "black",
        fontSize: 15,
        font: "sans-serif"
    };
    return $(go.Node, "Spot", {
        name: "NODE",
        "_controlExpand": true,
        layerName: "Background",
        locationSpot: go.Spot.Center,
        resizeCellSize: new go.Size(10, 10),
        locationObjectName: "SHAPE",
        resizable: true,
        resizeObjectName: "SHAPE", // user can resize the Shape
        rotatable: true,
        rotateObjectName: "SHAPE", // rotate the Shape without rotating the label
        click: function click(e, node) {
            // console.log(node.data);
        },
        doubleClick: function doubleClick(e, node) {
            doubleClickCreateNodeType(e);
        },
        selectable: true,
        selectionObjectName: "SHAPE",
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
        contextMenu: $(go.Adornment)
        // contextMenu: $(go.Adornment),
    }, new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify), $(go.Shape, {
        name: "SHAPE",
        // geometryString: "M 0,0 a50,50 0 1,1 100,0",
        // geometryString: "M 0 50 L 100 100 L 100 200",
        fill: "white",
        strokeWidth: 3,
        stroke: "black",
        minSize: new go.Size(50, 50)
    }, new go.Binding("fill", "fill").makeTwoWay(function (v) {
        return v;
    }), new go.Binding("stroke", "stroke").makeTwoWay(function (v) {
        return v;
    }), new go.Binding("strokeWidth", "strokeWidth").makeTwoWay(function (v) {
        return v;
    }), new go.Binding("desiredSize", "desiredSize", function (v) {
        // var va = (v / 2) * Math.sqrt(2);
        // console.log("desiredSize",v)
        return v;
    }).ofObject("BACKGROUND"), new go.Binding("angle", "angle", function (v) {
        // var va = (v / 2) * Math.sqrt(2);
        // console.log("desiredSize",v)
        return v;
    }).ofObject("BACKGROUND"), new go.Binding("geometryString", "geometryString", function (v) {
        return v;
    })), $(go.Shape, "Rectangle", {
        name: 'BACKGROUND',
        fill: "rgba(1,1,1,0)",
        // width: 450,
        // height: 450,
        angle: 0,
        stroke: "rgba(1,1,1,0)"
        // minSize: new go.Size(50, 50),
    }, new go.Binding("desiredSize", "desiredSize", function (v, d) {
        // console.log("vd m", v, d )
        if (!v) return d.part.findObject("SHAPE").measuredBounds.size;
        return go.Size.parse(v);
    }).makeTwoWay(function (v) {
        return go.Size.stringify(v);
    })
    // new go.Binding("angle", "angle").makeTwoWay(function(v){
    //     return v;
    // }),
    // new go.Binding("desiredSize", "height", function(v) {
    //     var radius = parseInt(v ? v : 100);
    //     var size = new go.Size(radius, radius);
    //     return size;
    // }).makeTwoWay(function(v) {
    //     return v.height;
    // }),
    // background: "#555",
    // stroke: "red"}
    ));
};

function doubleClickCreateNodeType(e) {
    // console.log('eeeeeeeeeeeeeee:', e);
    var myDiagram = e.diagram;
    myDiagram.startTransaction();
    var text = { text: "双击编辑文本", category: 'text' };
    text.loc = go.Point.stringify(myDiagram.lastInput.documentPoint);
    myDiagram.model.addNodeData(text);
    myDiagram.commitTransaction();
}

/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var $ = go.GraphObject.make;
var svg = __webpack_require__(8);

// 返回svg节点
module.exports = function createArcNodeTemplate(diagram) {
    var properties = {
        figure: "Circle",
        fill: "white",
        strokeWidth: 2,
        stroke: "black",
        fontSize: 15,
        font: "sans-serif"
    };
    return $(go.Node, "Spot", {
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
        mouseDragEnter: function mouseDragEnter(e, obj) {
            console.log("mouseDragEnter line");
        },
        mouseDrop: function mouseDrop(e, obj) {
            var node = obj.part;
            console.log("mouseDropmouseDropmouseDropmouseDrop line");
        },
        // rotateObjectName: "SHAPE", // rotate the Shape without rotating the label
        click: function click(e, node) {
            console.log(node.data);
        },
        deletable: false,
        doubleClick: function doubleClick(e, node) {
            // doubleClickCreateNodeType(e);
            if (!node.selectable) {
                var part = e.diagram.findObjectAt(e.documentPoint,
                // Navigation function
                function (x) {
                    return x.part;
                },
                // Because of the navigation function, x will always be a Part.
                function (x) {
                    return x.canSelect() && x.data.category == "wave";
                });
                if (part) {
                    e.diagram.select(part);
                    part.doubleClick(e, part);
                }
                // var it = parts.iterator;
                // while (it.next()) {
                //   console.log("#" + it.key + " is " + it.value);
                // }

                console.log("partpart...........", part);
            }
        },
        selectable: true,
        selectionObjectName: "SHAPE",
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
        contextMenu: $(go.Adornment)
        // contextMenu: $(go.Adornment),
    }, new go.Binding("zOrder", "zOrder").makeTwoWay(), new go.Binding("selectable", "selectable").makeTwoWay(), new go.Binding("locationSpot", "locationSpot", function (v) {
        return go.Spot.parse(v);
    }).makeTwoWay(function (v) {
        return go.Spot.stringify(v);
    }), new go.Binding("movable", "movable").makeTwoWay(), new go.Binding("visible", "visible").makeTwoWay(), new go.Binding("deletable", "deletable").makeTwoWay(), new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify), new go.Binding("angle", "angle").makeTwoWay(function (v, m, a) {
        // console.log("wwwwwwwwwwwwwwwww:",v," m:",m.angle," a:",a)
        return v;
        a.startTransaction();
        var group = a.findNodeDataForKey(m.group);
        // a.setDataProperty(group, "angle", v)
        for (var i = 0; i < a.nodeDataArray.length - 1; i++) {
            if (a.nodeDataArray[i].group == group.key && a.nodeDataArray[i].category != "line") {
                var nodeData = a.nodeDataArray[i];
                var lineLoc = go.Point.parse(m.loc);
                var nodeLoc = go.Point.parse(nodeData.loc);
                console.log('111111111');
                // distanceSquaredPoint
                var cp = lineLoc,
                    _rotatePoint = lineLoc; // 旋转中心

                var relativeLocation = nodeLoc.copy().subtract(lineLoc); // 原来的相对位置
                var newangle = v;
                var originalAngle = m.angle || 0;
                var ang = newangle - originalAngle; // 直线旋转的角度
                // var cp = _rotatePoint; 
                var angle = (nodeData.angle || 0) + ang; // 橄榄旋转的角度
                var loc = cp.copy().add(relativeLocation);
                var dir = cp.directionPoint(loc);
                var newrad = (ang + dir) * (Math.PI / 180);
                var centerLocationOffset = lineLoc.copy().subtract(nodeLoc);
                // var locoffset = centerLocationOffset.copy();
                // locoffset.rotate(ang);
                var dist = Math.sqrt(cp.distanceSquaredPoint(loc));
                var offset = new go.Point(0, 0).subtract(cp.copy());
                var cpOrigin = new go.Point(0, 0);
                var nodeOrigin = nodeLoc.copy().offset(offset.x, offset.y);
                var newNodeOrigin = nodeOrigin.rotate(ang);
                var newNodeLoc = newNodeOrigin.copy().offset(-offset.x, -offset.y);
                console.log("newNodeLoc", newNodeLoc);
                // var location = new go.Point(cp.x + dist * Math.cos(newrad),
                //     cp.y + dist * Math.sin(newrad)).subtract(locoffset); 
                a.setDataProperty(nodeData, "loc", go.Point.stringify(newNodeLoc));
                a.setDataProperty(nodeData, "angle", v);
            }
        }
        // var group = a.findNodeDataForKey(m.group)
        a.setDataProperty(group, "angle", v);
        a.commitTransaction();
        return v;
    }), $(go.Shape, 'LineH', {
        name: "SHAPE",
        alignment: go.Spot.Left, alignmentFocus: go.Spot.Left,
        stretch: go.GraphObject.Horizontal,
        strokeCap: "round",
        // geometryString: "M 0,0 a50,50 0 1,1 100,0",
        // geometryString: "M 0 50 L 100 100 L 100 200",
        // margin: 10,
        strokeDashArray: [0, 0],
        width: 300,
        height: 20,
        margin: 0,
        fill: "white",
        strokeWidth: 3,
        stroke: "black",
        minSize: new go.Size(NaN, 10),
        maxSize: new go.Size(NaN, 20)
    },
    // $(go.TextBlock, "alignment: Left", { row: 0, column: 0 }),
    new go.Binding("fill", "fill").makeTwoWay(function (v) {
        return v;
    }), new go.Binding("stroke", "stroke").makeTwoWay(function (v) {
        return v;
    }), new go.Binding("strokeDashArray", "strokeDashArray", function (v) {
        return JSON.parse(v);
    }).makeTwoWay(function (v) {
        return JSON.stringify(v);
    }), new go.Binding("strokeWidth", "strokeWidth").makeTwoWay(function (v) {
        return v;
    }),
    // new go.Binding("width", "width").makeTwoWay(),
    // new go.Binding("height", "height").makeTwoWay(),
    new go.Binding("desiredSize", "desiredSize", function (v, d) {
        // console.log("vd m", v, d )
        if (!v) return d.part.findObject("SHAPE").measuredBounds.size;
        return go.Size.parse(v);
    }).makeTwoWay(function (v) {
        return go.Size.stringify(v);
    })

    // new go.Binding("geometryString", "geometryString", function(v) {
    //     return v;
    // }),
    ), $(go.Shape, {
        name: "BeginArrow",
        visible: false,
        margin: 0,
        alignment: new go.Spot(0, 0.5, 10, 0),
        alignmentFocus: go.Spot.Right,
        geometryString: "M 0,-4 l -8,4 8,4",
        strokeCap: "round",
        // geometryString: "M 0 50 L 100 100 L 100 200",
        fill: "black",
        width: 10,
        height: 15,

        strokeWidth: 3,
        stroke: "black"
        // minSize: new go.Size(50, 50),
    }, new go.Binding("fill", "stroke", function (v) {
        return v;
    }), new go.Binding("stroke", "stroke").makeTwoWay(function (v) {
        return v;
    }), new go.Binding("strokeWidth", "strokeWidth").makeTwoWay(function (v) {
        return v;
    }), new go.Binding("visible", "showBeginArrow")
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
    ), $(go.Shape, {
        name: "EndArrow",
        visible: false,
        margin: 0,
        alignment: new go.Spot(1, 0.5, 0, 0),
        alignmentFocus: go.Spot.Right,
        geometryString: "M 0,-4 l 8,4 -8,4",
        strokeCap: "round",
        // geometryString: "M 0 50 L 100 100 L 100 200",
        fill: "black",
        width: 10,
        height: 15,

        strokeWidth: 3,
        stroke: "black"
        // minSize: new go.Size(50, 50),
    }, new go.Binding("fill", "stroke", function (v) {
        return v;
    }), new go.Binding("stroke", "stroke").makeTwoWay(function (v) {
        return v;
    }), new go.Binding("strokeWidth", "strokeWidth").makeTwoWay(function (v) {
        return v;
    }), new go.Binding("visible", "showEndArrow")
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
    ), $(go.Shape, {
        name: "Arrow",
        visible: true,
        margin: 0,
        alignment: new go.Spot(1, 0.5, 5, 0),
        alignmentFocus: go.Spot.Right,
        geometryString: "F M 158,-4 l 8,4 -8,4 2,-4 z",
        strokeCap: "round",
        // geometryString: "M 0 50 L 100 100 L 100 200",
        fill: "black",
        width: 20,
        height: 15,

        strokeWidth: 3,
        stroke: "black"
        // minSize: new go.Size(50, 50),
    }, new go.Binding("fill", "stroke", function (v) {
        return v;
    }), new go.Binding("stroke", "stroke").makeTwoWay(function (v) {
        return v;
    }), new go.Binding("strokeWidth", "strokeWidth").makeTwoWay(function (v) {
        return v;
    }), new go.Binding("visible", "showArrow")
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
    ));
};

function doubleClickCreateNodeType(e) {
    // console.log('eeeeeeeeeeeeeee:', e);
    var myDiagram = e.diagram;
    myDiagram.startTransaction();
    var text = { text: "双击编辑文本", category: 'text' };
    text.loc = go.Point.stringify(myDiagram.lastInput.documentPoint);
    myDiagram.model.addNodeData(text);
    myDiagram.commitTransaction();
}

/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var $ = go.GraphObject.make;
var svg = __webpack_require__(8);

function makeWave(tx, ty, curviness, repeat) {
    // if (curviness === 0) {
    //   var geo = new go.Geometry(go.Geometry.Line);
    //   geo.startX = 0;
    //   geo.startY = 0;
    //   geo.endX = tx;
    //   geo.endY = ty;
    //   return geo;
    // }
    if (tx == null) tx = 300;
    if (ty == null) ty = 400;
    if (!repeat) repeat = 1;
    var ang = go.Point.direction(0, 0, tx, ty);
    var rad = ang / 180 * Math.PI + Math.PI / 2;
    var offx = curviness * Math.cos(rad);
    var offy = curviness * Math.sin(rad);
    var geo = new go.Geometry();
    var sx = tx / repeat;var sy = ty / repeat;
    var x = 0;var y = 0;
    var fig = new go.PathFigure(x, y, false);
    for (var i = 0; i < repeat; i++) {
        var odd = i % 2 === 1;
        fig.add(new go.PathSegment(go.PathSegment.Bezier, x + sx, y + sy, x + offx * (odd ? -1 : 1), y + offy * (odd ? -1 : 1), x + sx + offx * (odd ? -1 : 1), y + sy + offy * (odd ? -1 : 1)));
        x += sx;
        y += sy;
    }
    geo.add(fig);
    return geo;
}

function computeGeo1(data, shape, curviness) {
    // var curviness = 30;
    if (!curviness) curviness = 30;
    // if (shape.stroke === "red") curviness = -30;
    // else if (shape.stroke === "green") curviness = 0;
    var geo = makeWave(data.x, data.y, curviness, data.repeat);
    var offset = geo.normalize();
    shape.position = new go.Point(-offset.x, -offset.y);
    shape.isGeometryPositioned = true;
    return geo;
}

function computeGeo(data, shape) {
    return go.Geometry.parse("M 0,80 A100,80 0 1 1 200,80");
}
function computeGeo2(data, shape) {
    var geo = go.Geometry.parse("M 0,80 A100,80 0 1 0 200,80");
    shape.isGeometryPositioned = true;
    shape.position = new go.Point(-100, -100);

    return geo;
}

// 返回svg节点
module.exports = function createWaveNodeTemplate(diagram) {
    var properties = {
        figure: "Circle",
        fill: "white",
        strokeWidth: 2,
        stroke: "black",
        fontSize: 15,
        font: "sans-serif"
    };
    // console.log("createWaveNodeTemplatecreateWaveNodeTemplatecreateWaveNodeTemplate")
    // return $(go.Node,
    //     {
    //         click:()=>{
    //             console.log("createWaveNodeTemplate click")
    //         }            
    //     },
    //     $(go.Shape, { stroke: "green" },
    //       new go.Binding("geometry", "", computeGeo)),
    //     $(go.Shape, { stroke: "blue" },
    //       new go.Binding("geometry", "", computeGeo)),
    //     $(go.Shape, { stroke: "red", strokeDashArray: [10, 10] },
    //       new go.Binding("geometry", "", computeGeo))
    //   );

    return $(go.Node, "Spot", {
        name: "NODE",
        "_controlExpand": true,
        layerName: "Background",
        locationSpot: go.Spot.Center,
        // resizeCellSize: new go.Size(10, 10),
        locationObjectName: "BACKGROUND",
        resizable: true,
        resizeObjectName: "BACKGROUND", // user can resize the Shape
        rotatable: true,
        rotateObjectName: "BACKGROUND", // rotate the Shape without rotating the label
        click: function click(e, node) {
            // console.log(node.data);
        },
        doubleClick: function doubleClick(e, node) {
            doubleClickCreateNodeType(e);
        },
        selectable: true,
        // selectionObjectName:"SHAPE",
        movable: true,
        // width: 200, height: 200,
        angle: 0,
        //toMaxLinks: 1,
        layoutConditions: go.Part.LayoutStandard & go.Part.LayoutNodeSized & go.Part.LayoutAdded & go.Part.LayoutNodeSized,
        //layoutConditions:~go.Part.LayoutAdded,
        // fromLinkable: true, toLinkable: true,
        alignment: go.Spot.Center,
        alignmentFocus: go.Spot.Center,
        resizeAdornmentTemplate: diagram.__trtd.nodeResizeAdornmentTemplate(),
        // rotateAdornmentTemplate: nodeRotateAdornmentTemplate,
        contextMenu: $(go.Adornment)
        // contextMenu: $(go.Adornment),
    }, new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify), $(go.Shape, "Rectangle", {
        name: 'BACKGROUND',
        fill: "rgba(1,1,1,0)",
        // width: 450,
        // height: 450,
        angle: 0,
        stroke: "rgba(1,1,1,1)"

        // minSize: new go.Size(50, 50),
    }, new go.Binding("desiredSize", "desiredSize", function (v, d) {
        // console.log("vd m", v, d )
        // if(!v) return d.part.findObject("SHAPE").measuredBounds.size;
        return go.Size.parse(v);
    }).makeTwoWay(function (v) {
        return go.Size.stringify(v);
    })),
    // $(go.Shape, { stroke: "green" },
    //     new go.Binding("geometry", "", computeGeo),
    //     new go.Binding("stroke", "stroke").makeTwoWay(function(v){
    //         return v;
    //     }),
    //     new go.Binding("strokeWidth", "strokeWidth").makeTwoWay(function(v){
    //         return v;
    //     }),
    // ),M 0 0 A80,60 0 1 0 160,0
    // $(go.Panel, "Vertical",{
    //     alignment: go.Spot.Center,
    //     stretch: go.GraphObject.Fill,
    //     },
    //     new go.Binding("desiredSize", "desiredSize", function(v) {
    //         return v
    //     }).ofObject("BACKGROUND"),
    $(go.Shape, {
        name: "UP",
        stroke: "blue",
        // geometryString:"M 0,80 A100,80 0 1 1 200,80",
        position: new go.Point(0, 0),
        isGeometryPositioned: true,
        alignment: go.Spot.Center,
        stretch: go.GraphObject.Fill
    }, new go.Binding("geometry", "", computeGeo), new go.Binding("stroke", "stroke1").makeTwoWay(function (v) {
        return v;
    }), new go.Binding("strokeWidth", "strokeWidth").makeTwoWay(function (v) {
        return v;
    })
    // new go.Binding("desiredSize", "desiredSize", function(v, d) {
    //     // console.log("vd m", v, d )
    //     // if(!v) return d.part.findObject("SHAPE").measuredBounds.size;
    //     return go.Size.parse(v)
    // }).makeTwoWay(function(v) {
    //     return go.Size.stringify(v)
    // }),
    ), $(go.Shape, {
        name: "DOWN",
        stroke: "red",
        // geometryString:"M 0,0 A100,80 0 1 0 200,0", 
        alignment: go.Spot.Center,
        strokeDashArray: [10, 10],
        isGeometryPositioned: true,
        position: new go.Point(-100, -100),
        stretch: go.GraphObject.Fill
    },

    // new go.Binding("geometry", "", computeGeo),
    new go.Binding("geometry", "", computeGeo2), new go.Binding("stroke", "stroke2").makeTwoWay(function (v) {
        return v;
    }), new go.Binding("strokeWidth", "strokeWidth").makeTwoWay(function (v) {
        return v;
    }))

    // new go.Binding("desiredSize", "desiredSize", function(v, d) {
    //     // console.log("vd m", v, d )
    //     // if(!v) return d.part.findObject("SHAPE").measuredBounds.size;
    //     return go.Size.parse(v)
    // }).makeTwoWay(function(v) {
    //     return go.Size.stringify(v)
    // }),
    // )

    // $(go.Shape, {
    //     name: "SHAPE",
    //     // geometryString: "M 0,0 a50,50 0 1,1 100,0",
    //     // geometryString: "M 0 50 L 100 100 L 100 200",
    //     fill: "white",
    //     strokeWidth: 3, 
    //     stroke: "black",
    //     minSize: new go.Size(50, 50),
    //     },
    //     new go.Binding("fill", "fill").makeTwoWay(function(v){
    //         return v;
    //     }),
    //     new go.Binding("stroke", "stroke").makeTwoWay(function(v){
    //         return v;
    //     }),
    //     new go.Binding("strokeWidth", "strokeWidth").makeTwoWay(function(v){
    //         return v;
    //     }),
    //     new go.Binding("desiredSize", "desiredSize", function(v) {
    //         // var va = (v / 2) * Math.sqrt(2);
    //         // console.log("desiredSize",v)
    //         return v
    //     }).ofObject("BACKGROUND"),
    //     new go.Binding("angle", "angle", function(v) {
    //         // var va = (v / 2) * Math.sqrt(2);
    //         // console.log("desiredSize",v)
    //         return v
    //     }).ofObject("BACKGROUND"),
    //     new go.Binding("geometryString", "geometryString", function(v) {
    //         return v;
    //     }),
    // ),
    // $(go.Shape, "Rectangle",{
    //     name: 'BACKGROUND',
    //     fill: "rgba(1,1,1,0)",
    //     // width: 450,
    //     // height: 450,
    //     angle: 0,
    //     stroke: "rgba(1,1,1,0)",
    //     // minSize: new go.Size(50, 50),
    //     },
    //     new go.Binding("desiredSize", "desiredSize", function(v, d) {
    //         // console.log("vd m", v, d )
    //         if(!v) return d.part.findObject("SHAPE").measuredBounds.size;
    //         return go.Size.parse(v)
    //     }).makeTwoWay(function(v) {
    //         return go.Size.stringify(v)
    //     }),
    //     // new go.Binding("angle", "angle").makeTwoWay(function(v){
    //     //     return v;
    //     // }),
    //     // new go.Binding("desiredSize", "height", function(v) {
    //     //     var radius = parseInt(v ? v : 100);
    //     //     var size = new go.Size(radius, radius);
    //     //     return size;
    //     // }).makeTwoWay(function(v) {
    //     //     return v.height;
    //     // }),
    //     // background: "#555",
    //     // stroke: "red"}
    // ),
    );
};

function doubleClickCreateNodeType(e) {
    // console.log('eeeeeeeeeeeeeee:', e);
    var myDiagram = e.diagram;
    myDiagram.startTransaction();
    var text = { text: "双击编辑文本", category: 'text' };
    text.loc = go.Point.stringify(myDiagram.lastInput.documentPoint);
    myDiagram.model.addNodeData(text);
    myDiagram.commitTransaction();
}

/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var $ = go.GraphObject.make;

/*
*  Copyright (C) 1998-2017 by Northwoods Software Corporation. All Rights Reserved.
*/

/**
* @constructor
* @class
*/
function GroupRotatingTool() {
  go.RotatingTool.call(this);

  // Internal state
  // ._initialInfo holds references to all selected non-Link Parts and
  // their initial relative points and angles
  this._initialInfo = null;
  this._rotatePoint = new go.Point();
  this.handleAngle = 0;
  this.handleArchetype = $(go.Panel, "Auto", $(go.Shape, "BpmnActivityLoop", { width: 30, height: 30, stroke: "green", fill: "transparent" }), $(go.Shape, "Rectangle", {
    width: 30,
    height: 30,
    stroke: "green",
    fill: "transparent",
    strokeWidth: 0
  }));
}
go.Diagram.inherit(GroupRotatingTool, go.RotatingTool);

GroupRotatingTool.prototype.doActivate = function () {

  go.RotatingTool.prototype.doActivate.call(this);

  // var group = this.adornedObject.part;
  var group = this.adornedObject.part;
  if (group instanceof go.Group && group.data.category == "waveGroup") {
    // if (group.placeholder !== null) throw new Error("GroupRotatingTool can't handle Placeholder in Group");
    // assume rotation about the location point
    this._rotatePoint = group.location;
    // remember initial points for each Part
    var infos = new go.Map(go.Part, MultiplePartInfo);
    var textAngle = group.data.textAngle || "vertical"; // "vertical"
    this.walkTree(group, infos, textAngle);
    this._initialInfo = infos;
  }
};

GroupRotatingTool.prototype.walkTree = function (part, infos, textAngle) {
  if (part === null || part instanceof go.Link) return;

  // 文字方向为横向时
  if (textAngle == "horizontal") {
    console.log("textAngle");
    if (part.data.category == "autoText") return;
  }
  // saves original relative position and original angle
  var loc = part.locationObject.getDocumentPoint(go.Spot.Center);
  var locoffset = loc.copy().subtract(part.location);
  var relloc = loc.subtract(this._rotatePoint);
  infos.add(part, new MultiplePartInfo(relloc, locoffset, part.rotateObject.angle));
  // recurse into Groups
  if (part instanceof go.Group) {
    var it = part.memberParts.iterator;
    while (it.next()) {
      this.walkTree(it.value, infos, textAngle);
    }
  }
};

function MultiplePartInfo(relativeloc, locoffset, rotationAngle) {
  this.relativeLocation = relativeloc;
  this.centerLocationOffset = locoffset;
  this.rotationAngle = rotationAngle; // in degrees
}

/**
* Rotate all members of a selected Group about the rotatePoint.
* @this {GroupRotatingTool}
* @param {number} newangle
*/
GroupRotatingTool.prototype.rotate = function (newangle) {
  console.log("newangle", newangle);
  var group = this.adornedObject.part;

  if (group instanceof go.Group) {
    if ((newangle + 360) % 360 < 300 || (newangle + 360) % 360 > 340) {
      if ((newangle + 360) % 360 < 300) newangle = 300;
      if ((newangle + 360) % 360 > 340) newangle = 340;

      console.log('dayu.................');
      // setTimeout(()=>{
      // group.diagram.startTransaction()
      // group.layout.isOngoing = true;
      // group.layout.isValidLayout = false;
      // if(group.containingGroup ){
      //   group.containingGroup.layout.isOngoing = true;
      //   group.containingGroup.layout.isValidLayout = false;
      // }
      // group.diagram.commitTransaction() 

      // },100)

      // return;
    }
  }
  go.RotatingTool.prototype.rotate.call(this, newangle);

  if (group instanceof go.Group) {

    var ang = newangle - this.originalAngle;
    var cp = this._rotatePoint;
    group.diagram.startTransaction();
    var it = this._initialInfo.iterator;
    while (it.next()) {
      var part = it.key;
      if (part instanceof go.Link) return; // only Nodes and simple Parts
      var info = it.value;

      // part.rotateObject.angle = info.rotationAngle + ang;
      var angle = info.rotationAngle + ang;

      var loc = cp.copy().add(info.relativeLocation);
      var dir = cp.directionPoint(loc);
      var newrad = (ang + dir) * (Math.PI / 180);
      var locoffset = info.centerLocationOffset.copy();
      locoffset.rotate(ang);
      var dist = Math.sqrt(cp.distanceSquaredPoint(loc));
      // part.location = new go.Point(cp.x + dist * Math.cos(newrad),
      //                              cp.y + dist * Math.sin(newrad)).subtract(locoffset);
      var location = new go.Point(cp.x + dist * Math.cos(newrad), cp.y + dist * Math.sin(newrad)).subtract(locoffset);
      group.diagram.model.setDataProperty(part.data, "loc", go.Point.stringify(location));
      group.diagram.model.setDataProperty(part.data, "angle", angle);
      // var git = group.memberParts;
      // console.log("item:",git)
      // var maxWidth = 0;
      // var maxHeight = 0;
      // while (git.next()) {
      //   var item = git.value;
      //   console.log("item:",item)
      //   if(item.naturalBounds.width > maxWidth){
      //     maxWidth = item.naturalBounds.width;
      //   }
      //   if(item.naturalBounds.height > maxHeight){
      //     maxHeight = item.naturalBounds.height;
      //   }
      //   console.log(`maxHeight:${maxHeight},maxWidth:${maxWidth}`)

      // }                    
      // group.diagram.model.setDataProperty(group.data, "desiredSize", `${maxWidth+100} ${maxHeight}`)   

      // that.diagram.startTransaction();
      console.log("isValidLayoutisValidLayout");
      // var group = that.diagram.findNodeForKey(data.key)
      group.layout.isOngoing = true;
      group.layout.isValidLayout = false;
      if (group.containingGroup) {
        group.containingGroup.layout.isOngoing = true;
        group.containingGroup.layout.isValidLayout = false;
      }
      // that.diagram.commitTransaction();
      group.diagram.commitTransaction();
    }
  }
};

module.exports = GroupRotatingTool;

/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// "use strict";
/*
*  Copyright (C) 1998-2019 by Northwoods Software Corporation. All Rights Reserved.
*/

// HTML + JavaScript text editor menu, made with HTMLInfo
// This is a re-implementation of the default text editor
// This file exposes one instance of HTMLInfo, window.TextEditor
// See also TextEditor.html
(function (window) {
  var textarea = document.createElement('textarea');
  textarea.id = "myTextArea";
  console.log("TextEditorTextEditorTextEditorTextEditorTextEditorTextEditorTextEditorTextEditorTextEditorTextEditorTextEditorTextEditor222222222222");
  textarea.addEventListener('input', function (e) {
    var tool = TextEditor.tool;
    if (tool.textBlock === null) return;
    var tempText = tool.measureTemporaryTextBlock(this.value);
    var scale = this.textScale;
    this.style.width = 20 + tempText.measuredBounds.width * scale + 'px';
    this.rows = tempText.lineCount;
  }, false);

  var observe;
  if (window.attachEvent) {
    observe = function observe(element, handlers) {
      handlers.forEach(function (t) {
        element.attachEvent('on' + t.evt, t.handler);
      });
    };
  } else {
    observe = function observe(element, handlers) {
      handlers.forEach(function (t) {
        element.addEventListener(t.evt, t.handler, false);
      });
    };
  }

  function resize() {
    textarea.style.minHeight = "40px";
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
  }

  function delayedResize() {
    setTimeout(resize, 0);
  }

  observe(textarea, [{
    evt: "change",
    handler: resize
  }, {
    evt: "cut",
    handler: delayedResize
  }, {
    evt: "paste",
    handler: delayedResize
  }, {
    evt: "drop",
    handler: delayedResize
  }, {
    evt: "keydown",
    handler: delayedResize
  }]);

  textarea.addEventListener('keydown', function (e) {
    var tool = TextEditor.tool;
    if (tool.textBlock === null) return;
    var keynum = e.which;
    if (keynum === 13) {
      // Enter
      if (tool.textBlock.isMultiline === false) e.preventDefault();
      tool.acceptText(go.TextEditingTool.Enter);
      return;
    } else if (keynum === 9) {
      // Tab
      tool.acceptText(go.TextEditingTool.Tab);
      e.preventDefault();
      return;
    } else if (keynum === 27) {
      // Esc
      tool.doCancel();
      if (tool.diagram !== null) tool.diagram.doFocus();
    }
  }, false);

  // handle focus:
  textarea.addEventListener('focus', function (e) {
    var tool = TextEditor.tool;
    if (!tool || tool.currentTextEditor === null) return;

    if (tool.state === go.TextEditingTool.StateActive) {
      tool.state = go.TextEditingTool.StateEditing;
    }

    if (tool.selectsTextOnActivate) {
      textarea.select();
      textarea.setSelectionRange(0, 9999);
    }
  }, false);

  // Disallow blur.
  // If the textEditingTool blurs and the text is not valid,
  // we do not want focus taken off the element just because a user clicked elsewhere.
  textarea.addEventListener('blur', function (e) {
    var tool = TextEditor.tool;
    if (!tool || tool.currentTextEditor === null || tool.state === go.TextEditingTool.StateNone) return;

    textarea.focus();

    if (tool.selectsTextOnActivate) {
      textarea.select();
      textarea.setSelectionRange(0, 9999);
    }
  }, false);

  var TextEditor = new go.HTMLInfo();

  TextEditor.valueFunction = function () {
    return textarea.value;
  };

  TextEditor.mainElement = textarea; // to reference it more easily

  // used to be in doActivate
  TextEditor.show = function (textBlock, diagram, tool) {
    console.log("show.......................");
    if (!(textBlock instanceof go.TextBlock)) return;

    TextEditor.tool = tool; // remember the TextEditingTool for use by listeners

    // This is called during validation, if validation failed:
    if (tool.state === go.TextEditingTool.StateInvalid) {
      textarea.style.border = '3px solid red';
      textarea.focus();
      return;
    }

    // This part is called during initalization:

    var loc = textBlock.getDocumentPoint(go.Spot.Center);
    var pos = diagram.position;
    var sc = diagram.scale;
    var textscale = textBlock.getDocumentScale() * sc;
    if (textscale < tool.minimumEditorScale) textscale = tool.minimumEditorScale;
    // Add slightly more width/height to stop scrollbars and line wrapping on some browsers
    // +6 is firefox minimum, otherwise lines will be wrapped improperly
    var textwidth = textBlock.naturalBounds.width * textscale + 6;
    var textheight = textBlock.naturalBounds.height * textscale + 2;
    var left = (loc.x - pos.x) * sc;
    var top = (loc.y - pos.y) * sc;

    textarea.value = textBlock.text;
    // the only way you can mix font and fontSize is if the font inherits and the fontSize overrides
    // in the future maybe have textarea contained in its own div
    diagram.div.style['font'] = textBlock.font;

    var paddingsize = 1;
    textarea.style['position'] = 'absolute';
    textarea.style['zIndex'] = '100';
    textarea.style['font'] = 'inherit';
    textarea.style['fontSize'] = textscale * 100 + '%';
    textarea.style['lineHeight'] = 'normal';
    textarea.style['width'] = textwidth + 'px';
    textarea.style['left'] = (left - textwidth / 2 | 0) - paddingsize + 'px';
    textarea.style['top'] = (top - textheight / 2 | 0) - paddingsize + 'px';
    textarea.style['textAlign'] = textBlock.textAlign;
    textarea.style['margin'] = '0';
    textarea.style['padding'] = paddingsize + 'px';
    textarea.style['border'] = '0';
    textarea.style['outline'] = 'none';
    textarea.style['whiteSpace'] = 'pre-wrap';
    textarea.style['overflow'] = 'hidden'; // for proper IE wrap
    textarea.rows = textBlock.lineCount;
    textarea.textScale = textscale; // attach a value to the textarea, for convenience
    textarea.className = 'goTXarea';

    // Show:
    diagram.div.appendChild(textarea);

    // After adding, focus:
    textarea.focus();
    if (tool.selectsTextOnActivate) {
      textarea.select();
      textarea.setSelectionRange(0, 9999);
    }

    resize();
  };

  TextEditor.hide = function (diagram, tool) {
    diagram.div.removeChild(textarea);
    TextEditor.tool = null; // forget reference to TextEditingTool
  };

  window.TextEditor = TextEditor;
})(window);

/***/ })
/******/ ]);
});
//# sourceMappingURL=main.js.map