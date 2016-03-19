var util = require('util');
var SpatialElement = require('./spatial-element');
var ndarray = require('ndarray');
var crunch = require('voxel-crunch');
var createAOMesh = require('ao-mesher');
var fs = require('fs');

function atob (str) {
  return new Buffer(str, 'base64').toString('binary');
}

function Voxel () {
  SpatialElement.call(this, 'voxel');

  var self = this;
  var resolution = [32, 32, 32];
  var field = null;

  var getField = function () {
    if (field) {
      return field;
    }

    var src = self.getAttribute('src').replace(/^data:/, '');
    var rle = new Uint8Array(atob(src).split('').map(function (c) { return c.charCodeAt(0); }));
    // var rle = JSON.parse('[' + atob(src) + ']')
    var decoded = crunch.decode(rle, new Int32Array(resolution[0] * resolution[1] * resolution[2]));
    field = ndarray(decoded, resolution);

    return field;
  };

  var setSrcFromField = function () {
    // console.log(field.data.length)
    // console.log(crunch.encode(field.data).length)
    // console.log(crunch.encode(field.data))
    // console.log(buffer)
    // console.log()
    // console.log(btoa(.data))

    var rle = crunch.encode(field.data);
    var buffer = new Buffer(rle);

    self.setAttribute('src', 'data:' + buffer.toString('base64'));

    console.log(buffer.length);
  };

  this.setBlock = function (p, value) {
    console.log(p.x, p.y, p.z, value);
    getField().set(p.x, p.y, p.z, value);
    setSrcFromField();
  };

  this.saveObj = function (filename) {
    var vertData = createAOMesh(getField());
    var output = '';

    output += 'o voxel\n';

    var textures = {};

    var i = 0;
    while (i < vertData.length) {
      textures[vertData[i + 7]] = true;
      output += 'v ' + vertData[i + 0] + ' ' + vertData[i + 1] + ' ' + vertData[i + 2] + '\n';
      i += 8;
      output += 'v ' + vertData[i + 0] + ' ' + vertData[i + 1] + ' ' + vertData[i + 2] + '\n';
      i += 8;
      output += 'v ' + vertData[i + 0] + ' ' + vertData[i + 1] + ' ' + vertData[i + 2] + '\n';
      i += 8;
    }

    console.log(JSON.stringify(textures));

    var face;
    for (var texture = 0; texture < 16; texture++) {
      output += 'g texture' + texture + '\n';

      i = 0;
      face = 1;

      while (i < vertData.length) {
        if (vertData[i + 7] === texture) {
          output += 'f ' + (face + 0) + ' ' + (face + 1) + ' ' + (face + 2) + '\n';
        }

        face += 3;
        i += 24;
      }

      output += '\n';
    }

    fs.writeFile('/Users/ben/Projects/scene/lightmap/input.obj', output, function (err) {
      if (err) {
        throw err;
      }

      console.log('Wrote out input.obj');
    });

  };
}

util.inherits(Voxel, SpatialElement);

Voxel.prototype.reflect = true;

module.exports = Voxel;
