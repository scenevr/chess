var test = require('tape');
var Node = require('../lib/node');
var Document = require('../lib/document');
var ownerDocument = Document.createDocument();

test('should create', function (t) {
  var n = new Node('foobar');
  t.ok(n instanceof Node);
  t.end();
});

test('should set text', function (t) {
  var n = new Node('foobar');
  n.ownerDocument = ownerDocument;
  n.innerXML = 'hello world';
  t.equal(n.textContent, 'hello world');
  t.end();
});

test('should create nodes', function (t) {
  var n = new Node('foobar');
  n.ownerDocument = ownerDocument;
  n.innerXML = "<box id='dave' />";
  t.equal(n.firstChild.nodeName, 'box');
  t.equal(n.firstChild.id, 'dave');
  t.end();
});

test('uuid lifecycle', function (t) {
  var d = Document.createDocument();
  var n = d.createElement('box');
  t.ok(!n.uuid, 'no uuid');

  d.scene.appendChild(n);
  var uuid = n.uuid;
  t.ok(n.uuid, 'uuid assigned');

  // Sam said we should keep stable uuids when removing from the dom
  d.scene.removeChild(n);
  t.ok(n.uuid, 'uuid still assigned');

  var n2 = n.cloneNode();
  t.ok(!n2.uuid, 'no uuid on clone');

  d.scene.appendChild(n);
  t.same(n.uuid, uuid, 'uuid stable');

  d.scene.appendChild(n2);
  t.notSame(n.uuid, n2.uuid, 'uuids are different');

  t.end();
});

test('should get xml', function (t) {
  var n = new Node('foobar');
  n.ownerDocument = ownerDocument;
  n.innerXML = "<box id='dave' />";
  n.firstChild.id = 'mary';
  n.firstChild.setAttribute('class', 'nothing');
  t.ok(n.innerXML.match(/<box id="mary" class="nothing".+/));
  t.end();
});

test('should ignore underscored attributes', function (t) {
  var n = new Node('foobar');
  n.ownerDocument = ownerDocument;
  n.innerXML = '<box />';
  n.firstChild._position = {
    toString: function () {
      return '1 2 3';
    }
  };
  t.ok(n.innerXML.match(/<box position="1 2 3"><.box>/));
  t.end();
});
