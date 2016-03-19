var util = require('util');
var Element = require('./element');

function Spawn () {
  Element.call(this, 'spawn');
}

util.inherits(Spawn, Element);

Spawn.prototype.reflect = true;

module.exports = Spawn;
