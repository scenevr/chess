var util = require('util');
var SpatialElement = require('./spatial-element');

function Link () {
  SpatialElement.call(this, 'link');
}

util.inherits(Link, SpatialElement);

Link.prototype.reflect = true;

module.exports = Link;
