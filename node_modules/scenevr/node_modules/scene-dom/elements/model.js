var util = require('util');
var SpatialElement = require('./spatial-element');

function Model () {
  SpatialElement.call(this, 'model');
}

util.inherits(Model, SpatialElement);

Model.prototype.reflect = true;

module.exports = Model;
