'use strict';

// var helpers = require('./helpers.core');
// import buckets from '../assets/buckets.min'
/**
 * @namespace Chart.helpers.canvas
 */
var exports = module.exports = {

	checkPhone(){
			if(!navigator) return true;
			if ((navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i))) {
				/*window.location.href="你的手机版地址";*/
				return true
			}
			else {
				/*window.location.href="你的电脑版地址";    */
				return false
			}
	},

	guid() {
		function S4() {
			return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
		}
		return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
	},

	getElementByAttr(document, tag,attr,value)
	{
		var aElements=document.getElementsByTagName(tag);
		var aEle=[];
		for(var i=0;i<aElements.length;i++)
		{
			if(aElements[i].getAttribute(attr)==value)
				aEle.push( aElements[i] );
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
	clear: function(chart) {
		chart.ctx.clearRect(0, 0, chart.width, chart.height);
	},
	nodeInfo: function(d) {  // Tooltip info for a node data object
		var str = "Node " + d.key + ": " + d.text + "\n";
		if (d.group)
		  str += "member of " + d.group;
		else
		  str += "top-level node";
		return str;
	},
	linkInfo: function(d) {  // Tooltip info for a link data object
		return "Link:\nfrom " + d.from + " to " + d.to;
	},
	groupInfo: function(adornment) {  // takes the tooltip or context menu, not a group node data object
		var g = adornment.adornedPart;  // get the Group that the tooltip adorns
		var mems = g.memberParts.count;
		var links = 0;
		g.memberParts.each(function(part) {
			if (part instanceof go.Link) links++;
		});
		return "Group " + g.data.key + ": " + g.data.text + "\n" + mems + " members including " + links + " links";
	},
	queue: function(){
		this.data = [];
		this.enqueue = function(record) {
			this.data.unshift(record);
		  }
		this.dequeue = function() {
			this.data.pop();
		}
	},
	// buckets: buckets,
		//遍历天地盘做指定操作,colletor=[] 广度优先
		tdTravelTdpDataWidth: function(nodeData, model, collector, callback) {
			
			var queue = new exports.queue(); //队列数据结构，辅助用
			console.log("queue:",queue)
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
						while (childNodeData.next && childNodeData.next != childNodeData.key) { //加入所有子节点
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
		tdTravelTdpData: function(nodeData, model, collector, callback) {
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
					exports.tdTravelTdpData(childNodeData, model, collector, callback);
			}
			//2 再处理兄弟节点
			if (nodeData.next && nodeData.next != nodeData.key) { //处理异常情况
					var nextNodeData = model.findNodeDataForKey(nodeData.next);
					exports.tdTravelTdpData(nextNodeData, model, collector, callback);
			}
		},
		deleteOldData(time){
			var  temp, diff;
			for(var item in window.localStorage) {
				if(window.localStorage.hasOwnProperty(item)) {
					// size += window.localStorage.getItem(item).length;
					if(item.startsWith("TDCurrent")){
						try{
							temp = JSON.parse(window.localStorage.getItem(item))
							diff =  new Date().getTime() - temp.modelData.updatedAt;
							if(diff/1000 > 86400*time){
								console.log("delete old data:"+item)
								window.localStorage.removeItem(item)
							}
						}catch(e){
							console.error(e)
							continue;
						}
					}
				}
			}
		},
		saveModelToLocalStorage(tpid, model){
			console.log("存储model到localStorage，只保留最近三天的")
			model.modelData.updatedAt = new Date().getTime()
			if(!window.localStorage) {
				console.error('浏览器不支持localStorage');
				return;
			}		
			// 只保留最近一周内的盘
			exports.deleteOldData(3)
			try{
				window.localStorage.setItem("TDCurrent" + tpid, model.toJson());
			}catch(e){
				exports.deleteOldData(1)
				// window.localStorage.clear()
			}
		},

		// 检查gojs model数据关系是否正确
		checkModel: function(model){
			var nodeDataArray = model.nodeDataArray
			var root = model.findNodeDataForKey(1)
			var collectior = []
			function checkDataExists(key){
				var data = model.findNodeDataForKey(key)
				if(data){
					return "exist"
				}else{
					return "not exist"
				}
			}
			exports.tdTravelTdpData(root, model, collectior, function(data){
				
				var msg = `check key:${data.key},level:${data.level},parent:${data.parent},`+
				`isparent:${data.isparent},prev:${data.prev},next:${data.next}`
				if(data.next && checkDataExists(data.next) == "not exist"){
					console.error(`data ${data.key} next指向的节点不存在, data: ${msg}`)
				}
				if(data.isparent && checkDataExists(data.isparent) == "not exist"){
					console.error(`data ${data.key} isparent指向的节点不存在, data: ${msg}`)
				}
				if(data.parent && checkDataExists(data.parent) == "not exist"){
					console.error(`data ${data.key} parent指向的节点不存在, data: ${msg}`)
				}
				if(data.prev && checkDataExists(data.prev) == "not exist"){
					console.error(`data ${data.key} prev指向的节点不存在, data: ${msg}`)
				}
			})
		},
		// 数值转换
		tdTransToNum(from, defaultVal) {
			if(arguments.length <= 1){
				defaultVal = 0
			}
			var result = defaultVal;
			try {
				result = parseFloat(from);
				return result;
			} catch (e) {
				return result;
			}
			},	
		simulateEnterWithAlt(e) { //模拟alt+Enter键盘,将gojs内置文本编辑窗口中的Alt+Enter 转换为\n
			var myDiagram = e.diagram;
			if (myDiagram.currentTool.currentTextEditor) {
				// jQuery(myDiagram.currentTool.currentTextEditor).unbind("keypress", myDiagram.currentTool.currentTextEditor);
				// jQuery(myDiagram.currentTool.currentTextEditor).keypress(textEditorHandler);
				myDiagram.currentTool.currentTextEditor.mainElement.onkeypress = null;
				myDiagram.currentTool.currentTextEditor.mainElement.onkeypress = textEditorHandler;
				var val = myDiagram.currentTool.currentTextEditor.mainElement.value
				// 只在手机端定位到结尾
				if(module.exports.checkPhone()){
					myDiagram.currentTool.currentTextEditor.mainElement.selectionStart = val.length; 
					myDiagram.currentTool.currentTextEditor.mainElement.selectionEnd = val.length; 
				}
				function textEditorHandler(e) {
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
				}
			}
		},
		/***
 * travel nodes, group and links
 * @param rootnode go.Node
 * @param callback function(part){}
 */
travelParts(rootNode, callback) {
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
