
// var sampleNodeTemplate = require('./sampleNodeTemplate')
var waveNodeTemplate = require('./waveNodeTemplate')
// var waveTailNodeTemplate = require('./waveTailNodeTemplate')
var waveGroupNodeTemplate = require('./waveGroupNodeTemplate')
var axisGroupNodeTemplate = require('./axisGroupNodeTemplate')
var iconTextNodeTemplate = require('./iconTextNodeTemplate')
var autoTextNodeTemplate = require('./autoTextNodeTemplate')
var labelGroupNodeTemplate = require('./labelGroupNodeTemplate')
// var cbianNodeTemplate = require('./cbianNodeTemplate')
var picNodeTemplate = require('./picNodeTemplate')
var picGroupNodeTemplate = require('./picGroupNodeTemplate')
var yunGroupNodeTemplate = require('./yunGroupNodeTemplate')
var yunpanGroupNodeTemplate = require('./yunpanGroupNodeTemplate')
var shapeNodeTemplate = require('./shapeNodeTemplate')
var shapeTextNodeTemplate = require('./shapeTextNodeTemplate')

module.exports =  function(nodeType, options){
    var temp = `${nodeType}NodeTemplate`
    console.log("factory:",temp)
    var nodeTemplateClass = eval(temp)
    return new nodeTemplateClass(options)
}