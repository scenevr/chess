var util = require('util');
var SpatialElement = require('./spatial-element');

function Text () {
  SpatialElement.call(this, 'text');
}

util.inherits(Text, SpatialElement);

Text.prototype.reflect = true;

module.exports = Text;
