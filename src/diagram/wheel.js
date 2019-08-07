
var Trtd_tianpan = require('./tianpan')
var createNodeTemplate = require('../nodeTemplate/createNodeTemplate')
var createPictureSingleNodeTemplate = require('../nodeTemplate/createPictureSingleNodeTemplate')
var createPictureNodeTemplate = require('../nodeTemplate/createPictureNodeTemplate')
var createTextNodeTemplate = require('../nodeTemplate/createTextNodeTemplate')
var createNodeSvgTemplate = require('../nodeTemplate/createNodeSvgTemplate')


class Trtd extends Trtd_tianpan {
    constructor(div, config){
        super(div, config)
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
    addNodeTemplate(){

        var that = this;
        var myDiagram = this.diagram

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

        myDiagram.nodeTemplateMap.add("8",createNodeSvgTemplate(this.diagram));

        
    }
}

// export default Trtd;
module.exports = Trtd;