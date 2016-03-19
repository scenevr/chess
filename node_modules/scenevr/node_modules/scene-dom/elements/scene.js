var fs = require('fs');
var _ = require('underscore');
var vm = require('vm');
var Node = require('../lib/node');
var Vector = require('../lib/vector');
var Euler = require('../lib/euler');
var path = require('path');
var XMLHttpRequest = require('xhr2');
var util = require('util');

function Scene () {
  Node.call(this, 'scene');
}

util.inherits(Scene, Node);

module.exports = Scene;

Scene.prototype.stop = function () {
  this.clearTimeouts();
  this.childNodes = [];
};

Scene.prototype.insertBefore = function (el, ref) {
  Node.prototype.insertBefore.apply(this, [el, ref]);

  if (this.ownerDocument.mutationObserver) {
    this.ownerDocument.mutationObserver.addInsertEvent(el);
  }
};

Scene.prototype.clearTimeouts = function () {
  return null;
};

Scene.prototype.start = function (reflector, ticksPerSecond) {
  var document = this.ownerDocument;
  var timeouts = [];
  var intervals = [];

  this.ticksPerSecond = ticksPerSecond || 5;

  this.clearTimeouts = function () {
    timeouts.forEach(function (t) {
      clearTimeout(t);
    });
    intervals.forEach(function (i) {
      clearInterval(i);
    });
    timeouts = [];
    intervals = [];
  };

  // Wrap setInterval and setTimeout so that errors in callbacks don't
  // kill the server.

  var self = this,
    sandbox = {
      document: document,
      Vector: Vector,
      Euler: Euler,
      XMLHttpRequest: XMLHttpRequest,
      setInterval: function (func, timeout) {
        var handle = setInterval(function () {
          try {
            func();
          } catch (e) {
            console.log('[server] ' + document.filename + ':\n  ' + (e.toString()));
            clearInterval(handle);
          }
        }, timeout);
        intervals.push(handle);
        return handle;
      },

      setTimeout: function (func, timeout) {
        var handle = setTimeout(function () {
          try {
            func();
          } catch (e) {
            console.log('[server] ' + document.filename + ':\n  ' + (e.toString()));
          }
        }, timeout);
        timeouts.push(handle);
        return handle;
      },
      console: {
        log: function () {
          var message = Array.prototype.slice.call(arguments).join(' ');
          console.log('[log] ' + message);
          reflector.chatChannel.sendMessage(self, message);
        }
      }
    };

  // One sandbox for all script contexts
  sandbox = vm.createContext(sandbox);

  document.getElementsByTagName('script').map(function (scriptElement) {
    var script = null,
      code = null,
      cdata = _.detect(scriptElement.childNodes, function (node) {
        return node.nodeName === '#cdata';
      });

    if (scriptElement.src) {
      var base = path.dirname(document.originalFilename);
      var fullPath = path.resolve(base, './' + scriptElement.src);

      if (fullPath.indexOf(base) !== 0) {
        console.log('[server] Invalid path to script: ' + scriptElement.src);
        return;
      }

      if (!fs.existsSync(fullPath)) {
        console.log('[server] Unable to find script ' + scriptElement.src);
        return;
      }

      code = fs.readFileSync(fullPath);
    } else if (cdata) {
      code = cdata.data;
    } else {
      code = scriptElement.textContent;
    }

    try {
      script = vm.createScript(code, document.filename);
    } catch (e) {
      console.log('[server] Syntax error in ' + document.filename + ':\n  ' + (e.toString()));
      return;
    }

    try {
      // Run a script.
      script.runInContext(sandbox);
    } catch (e) {
      console.log('[server] Runtime error in ' + document.filename);
      console.log(e.toString());
    }
  });

  try {
    document.dispatchEvent('ready');
  } catch(e) {
    console.log('[server] ' + document.filename);
    console.log('  ' + e.stack.split('\n').slice(0, 2).join('\n  '));
  }
};

/**
 * Deprecated: use SceneDOM.createDocumentFromXML() instead
 */
Scene.load = function (filename, callback) {
  fs.readFile(filename, 'utf8', function (err, xml) {
    if (!err) {
      var document = require('../').createDocument().loadXML(xml);
      callback(document.scene);
    } else {
      throw new Error(err);
    }
  });
};
