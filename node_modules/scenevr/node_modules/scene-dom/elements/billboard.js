var util = require('util');
var SpatialElement = require('./spatial-element');

function Billboard () {
  SpatialElement.call(this, 'billboard');
}

util.inherits(Billboard, SpatialElement);

Billboard.prototype.reflect = true;

module.exports = Billboard;
