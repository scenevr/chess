var util = require('util');
var Element = require('./element');

function Skybox () {
  Element.call(this, 'skybox');
}

util.inherits(Skybox, Element);

Skybox.prototype.reflect = true;

module.exports = Skybox;
