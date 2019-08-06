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
  this.handleAngle = 0
  this.handleArchetype =
    $(go.Panel, "Auto",
        $(go.Shape, "BpmnActivityLoop", { width: 30, height: 30, stroke: "green", fill: "transparent" }),
        $(go.Shape, "Rectangle", {
            width: 30,
            height: 30,
            stroke: "green",
            fill: "transparent",
            strokeWidth: 0
        })
    );
}
go.Diagram.inherit(GroupRotatingTool, go.RotatingTool);

GroupRotatingTool.prototype.doActivate = function() {
 
  go.RotatingTool.prototype.doActivate.call(this);

  // var group = this.adornedObject.part;
  var group = this.adornedObject.part; 
  if (group instanceof go.Group && group.data.category == "waveGroup") {
    // if (group.placeholder !== null) throw new Error("GroupRotatingTool can't handle Placeholder in Group");
    // assume rotation about the location point
    this._rotatePoint = group.location;
    // remember initial points for each Part
    var infos = new go.Map(go.Part, MultiplePartInfo);
    var textAngle = group.data.textAngle|| "vertical" // "vertical"
    this.walkTree(group, infos, textAngle);
    this._initialInfo = infos;
  }
}

GroupRotatingTool.prototype.walkTree = function(part, infos, textAngle) {
  if (part === null || part instanceof go.Link) return;

  // 文字方向为横向时
  if(textAngle == "horizontal"){
    console.log("textAngle")
    if(part.data.category == "autoText") return;
  }
  // saves original relative position and original angle
  var loc = part.locationObject.getDocumentPoint(go.Spot.Center);
  var locoffset = loc.copy().subtract(part.location);
  var relloc = loc.subtract(this._rotatePoint);
  infos.add(part, new MultiplePartInfo(relloc, locoffset, part.rotateObject.angle));
  // recurse into Groups
  if (part instanceof go.Group) {
    var it = part.memberParts.iterator;
    while (it.next()) this.walkTree(it.value, infos,textAngle);
  }
};

function MultiplePartInfo(relativeloc, locoffset, rotationAngle) {
  this.relativeLocation = relativeloc;
  this.centerLocationOffset = locoffset;
  this.rotationAngle = rotationAngle;  // in degrees
}

/**
* Rotate all members of a selected Group about the rotatePoint.
* @this {GroupRotatingTool}
* @param {number} newangle
*/
GroupRotatingTool.prototype.rotate = function(newangle) {
  console.log("newangle",newangle)
  var group = this.adornedObject.part;

  if (group instanceof go.Group) {
    if((newangle+360)%360<300|| (newangle+360)%360>340){
        if((newangle+360)%360<300) newangle=300
        if((newangle+360)%360>340) newangle=340

      console.log('dayu.................')
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
    group.diagram.startTransaction()
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
      var location = new go.Point(cp.x + dist * Math.cos(newrad),
                                   cp.y + dist * Math.sin(newrad)).subtract(locoffset);                                   
      group.diagram.model.setDataProperty(part.data, "loc", go.Point.stringify(location))                                   
      group.diagram.model.setDataProperty(part.data, "angle", angle) 
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
      console.log("isValidLayoutisValidLayout")
      // var group = that.diagram.findNodeForKey(data.key)
      group.layout.isOngoing = true;
      group.layout.isValidLayout = false;
      if(group.containingGroup ){
        group.containingGroup.layout.isOngoing = true;
        group.containingGroup.layout.isValidLayout = false;
      }
      // that.diagram.commitTransaction();
      group.diagram.commitTransaction()                          
    }
  }
}


module.exports = GroupRotatingTool