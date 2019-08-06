    var helpers = require('../helpers/helpers.gojs')

    // define a custom grid layout that makes sure the length of each lane is the same
    // and that each lane is broad enough to hold its subgraph
    function labelGroupLayout() {
        // go.Layout.call(this);
        go.GridLayout.call(this);
        // this.cellSize = new go.Size(1, 1);
        // this.wrappingColumn = Infinity;
        // this.wrappingWidth = Infinity;
        // this.spacing = new go.Size(0, 0);
        // this.alignment = go.GridLayout.Position;
      }
      go.Diagram.inherit(labelGroupLayout, go.GridLayout);
  
      labelGroupLayout.prototype.doLayout = function(coll) {
        console.log("labelGroupLayout.doLayout")
        var diagram = this.diagram;
        diagram.model.startTransaction("labelGroupLayout")
        go.GridLayout.prototype.doLayout.call(this, coll);

        // diagram.model.addNodeData(tailOlive)
        diagram.model.commitTransaction("labelGroupLayout");
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

      module.exports = labelGroupLayout