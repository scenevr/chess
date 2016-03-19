var util = require('util');
var Element = require('./element');

function Fog () {
  Element.call(this, 'fog');
}

util.inherits(Fog, Element);

Fog.prototype.reflect = true;

module.exports = Fog;
