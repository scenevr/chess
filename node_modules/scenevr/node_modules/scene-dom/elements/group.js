var util = require('util');
var SpatialElement = require('./spatial-element');

function Group () {
  SpatialElement.call(this, 'group');
}

util.inherits(Group, SpatialElement);

Group.prototype.reflect = true;

module.exports = Group;
