var Document = require('./lib/document');
var Scene = require('./elements/scene');
var Vector = require('./forks/vector');
var Euler = require('./forks/euler');

module.exports = {
  createDocument: Document.createDocument,
  setLoader: Document.setLoader,

  Document: Document,
  Scene: Scene,
  Vector: Vector,
  Euler: Euler
};
