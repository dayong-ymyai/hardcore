var $ = go.GraphObject.make;
var Base = require('./base')

class SampleNodeTemplate extends Base {
    constructor(options){
        super(options)
        this.nodeProperties = Object.assign(
            this.nodeProperties,
            {
                type: go.Panel.Auto,
            }
        )
    }
    
    getNodeTemplate(){
        console.log("SampleNodeTemplate.getNodeTemplate")
        var that = this;
        return $(go.Node, 
            that.nodeProperties,
            that.binding,
            $(go.TextBlock, {
                name: "TEXT",
                alignment: new go.Spot(0.5, 0.5),
                font: "bold 18 px 幼圆",
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
}

module.exports = SampleNodeTemplate
