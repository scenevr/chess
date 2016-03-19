var dom = require('../lib/dom-lite');
var Element = require('../elements/element');
var Script = require('../elements/script');
var Box = require('../elements/box');
var Group = require('../elements/group');
var Voxel = require('../elements/voxel');
var Plane = require('../elements/plane');
var Spawn = require('../elements/spawn');
var Player = require('../elements/player');
var Billboard = require('../elements/billboard');
var Model = require('../elements/model');
var Link = require('../elements/link');
var Text = require('../elements/text');
var Skybox = require('../elements/skybox');
var Fog = require('../elements/fog');
var Audio = require('../elements/audio');
var Document = dom.Document;
var Node = require('./node');

module.exports = Document;

var Scene = require('../elements/scene');

Document.prototype.markAsDead = function (uuid) {
  this.deadNodes[uuid] = (new Date()).valueOf();
  delete this.nodeMap[uuid];
};

Document.prototype.markAsDirty = function (node) {
  this.dirtyNodes[node.uuid] = node;
};

Document.prototype.getElementByUUID = function (uuid) {
  return this.nodeMap[uuid];
};

Document.prototype.createElement = function (tag) {
  var self = this;
  var node;

  if (tag === 'script') {
    node = new Script();
  } else if (tag === 'box') {
    node = new Box();
  } else if (tag === 'group') {
    node = new Group();
  } else if (tag === 'text') {
    node = new Text();
  } else if (tag === 'voxel') {
    node = new Voxel();
  } else if (tag === 'plane') {
    node = new Plane();
  } else if (tag === 'player') {
    node = new Player();
  } else if (tag === 'billboard') {
    node = new Billboard();
  } else if (tag === 'link') {
    node = new Link();
  } else if (tag === 'model') {
    node = new Model();
  } else if (tag === 'spawn') {
    node = new Spawn();
  } else if (tag === 'fog') {
    node = new Fog();
  } else if (tag === 'skybox') {
    node = new Skybox();
  } else if (tag === 'audio') {
    node = new Audio();
  } else if (tag === 'scene') {
    node = new Scene();
  } else {
    node = new Node(tag);
  }

  Object.defineProperties(node, {
    uuid: {
      get: function () {
        return this._uuid;
      },
      set: function (value) {
        delete self.nodeMap[this._uuid];
        this._uuid = value;
        self.nodeMap[this._uuid] = this;
      }
    }
  });

  if (node.reflect) {
    node.observeSelf();
  }

  node.ownerDocument = this;
  node.eventTargets = {};
  return node;
};

Document.prototype.appendChild = function (child) {
  this.scene.appendChild(child);
};

/**
 * Replace this document's content with the contetnt defined by the given XML string
 */
Document.prototype.load = function (filename) {
  var self = this;

  this.scene = null;
  this.originalFilename = filename;

  // If not defined explicitly as false, then we're async
  if (this.async !== false) {
    Document.asyncLoader(filename, function (err, content) {
      if (err) {
        self.dispatchEvent('error', { target: self });
      } else {
        self.loadXML(content);

        // try {
        // } catch(e) {
        //   self.dispatchEvent('error', { target: self });
        // }

        self.dispatchEvent('load', { target: self });
      }
    });

  // Sync
  } else {
    var content = Document.syncLoader(filename);
    self.loadXML(content);
  }

  return this;
};

/**
 * Replace this document's content with the contetnt defined by the given XML string
 */
Document.prototype.loadXML = function (xml) {
  var self = this;
  this.scene = null;

  var parsedScene = new Element('null');
  parsedScene.ownerDocument = this;
  parsedScene.innerXML = xml;

  parsedScene.childNodes.forEach(function (node) {
    if (node instanceof Scene) {
      self.scene = node;
    }
  });

  if (!this.scene) {
    throw new Error("Can't find a <scene /> element");
  }

  return this;
};

/**
 * Create a new, empty document
 */
Document.createDocument = function () {
  var d;
  d = new Document();
  d.deadNodes = {};
  d.dirtyNodes = {};
  d.nodeMap = {};
  d.scene = d.createElement('scene');

  return d;
};

/**
 * Stub implementation of syncLoader: simply throws an error.
 * Replaced with Document.setLodaer()
 */
Document.syncLoader = function (filename) {
  throw new Error('No file loader provided with Document.setLoader');
};

/**
 * Stub implementation of asyncLoader: simply calls the error callback
 * Replaced with Document.setLodaer()
 */
Document.asyncLoader = function (filename, callback) {
  callback('No file loader provided with Document.setLoader');
};

/**
 * Set the loader that is used to request XML files by filename/url.
 * Without a loader set, these functions will return an error
 */
Document.setLoader = function (loader) {
  if (loader.syncLoader && loader.asyncLoader) {
    Document.syncLoader = loader.syncLoader;
    Document.asyncLoader = loader.asyncLoader;
  } else {
    throw new Error('Bad loader passed to Document.setLoader(); it expects syncLoader and asyncLoader propeties');
  }

  return Document;
};
