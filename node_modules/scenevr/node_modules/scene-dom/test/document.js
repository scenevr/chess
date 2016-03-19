var test = require('tape');
var SceneDOM = require('../');
var Scene = require('../elements/scene');

test('Document', function (t) {
  t.test('document.scene created by default', function (t) {
    var doc = SceneDOM.createDocument();
    t.ok(doc.scene instanceof Scene, 'document.scene instance of Scene object');
    t.end();
  });

  t.test('UUIDs work', function (t) {
    var doc = SceneDOM.createDocument();
    var box = doc.createElement('box');
    doc.scene.appendChild(box);

    t.ok(box.uuid, 'New element has a UUID');
    t.equals(box, doc.getElementByUUID(box.uuid), 'document.getElementByUUID() returns correct object');

    box.uuid = '5';
    t.equals(box, doc.getElementByUUID(5), 'document.getElementByUUID() works after a manual UUID update');

    t.end();
  });

  t.test('document.appendChild appends to scene', function (t) {
    var doc = SceneDOM.createDocument();
    var box = doc.createElement('box');
    doc.appendChild(box);

    t.equals(box, doc.scene.childNodes[0], 'appended element in doc.scene.childNodes[0]');
    t.end();
  });

  t.test('document.load() works in asynchronously', function (t) {
    SceneDOM.setLoader(require('../lib/document-fs-loader'));

    t.plan(2);
    var doc = SceneDOM.createDocument();
    doc.addEventListener('load', function (e) {
      t.equals(e.target.getElementById('two').tagName, 'box', 'document content loaded successfully');
      t.pass('load event callback called');
      t.end();
    });
    doc.load(process.cwd() + '/test/fixtures/hello.xml');
  });

  t.test('document.load() works in synchronously', function (t) {
    var doc = SceneDOM.createDocument();
    doc.async = false;
    doc.load(process.cwd() + '/test/fixtures/hello.xml');
    t.equals(doc.getElementById('two').tagName, 'box', 'document content loaded successfully');
    t.end();
  });

  t.end();
});
