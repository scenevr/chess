var test = require('tape');

var Dom = require('../');

test('impl', function (t) {
  var doc = Dom.createDocument();
  t.ok(doc instanceof Dom.Document);
  t.end();
});

test('vector', function (t) {
  var v = new Dom.Vector();
  t.same(v.x, 0.0);
  t.end();
});

test('euler', function (t) {
  var e = new Dom.Euler();
  t.same(e.x, 0.0);
  t.ok(e.setFromQuaternion);
  t.end();
});
