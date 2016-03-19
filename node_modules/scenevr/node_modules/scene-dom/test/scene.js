var test = require('tape');
var SceneDOM = require('../').setLoader(require('../lib/document-fs-loader'));
var Scene = require('../elements/scene');
var Script = require('../elements/script');
var Box = require('../elements/box');
var Group = require('../elements/group');
var Voxel = require('../elements/voxel');
var Text = require('../elements/text');
var Plane = require('../elements/plane');
var Spawn = require('../elements/spawn');
var Model = require('../elements/model');
var Link = require('../elements/link');
var Skybox = require('../elements/skybox');
var Fog = require('../elements/fog');
var Audio = require('../elements/audio');

// Small helper function to load fixtures
function sceneFixtureLoader (fixtureFilename) {
  var doc = SceneDOM.createDocument();
  doc.async = false;
  doc.load(process.cwd() + '/test/fixtures/' + fixtureFilename);
  return doc.scene;
}

test('should create', function (t) {
  var s;
  s = new Scene();
  t.ok(s instanceof Scene);
  t.equal(s.nodeName, 'scene');
  t.end();
});

test('should load scene', function (t) {
  var scene = sceneFixtureLoader('hello.xml');

  t.equal(scene.childNodes.length, 7);

  var box = scene.childNodes[1];
  t.ok(box instanceof Box);
  t.equal(box.position.y, 10.0);

  var script = scene.childNodes[5];
  t.ok(script instanceof Script);
  t.end();
});

test('should load scene with <script /> tags', function (t) {
  var scene = sceneFixtureLoader('script_tag.xml');

  t.equal(scene.childNodes.length, 11);

  var script = scene.childNodes[3];
  t.ok(script instanceof Script);
  t.ok(script.textContent.match(/10 < 20/));
  t.end();
});

test('should load external scripts', function (t) {
  var scene = sceneFixtureLoader('script_tag.xml');
  scene.start();
  t.same(scene.getAttribute('testloaded'), '4');
  scene.stop();
  t.end();
});

test('should not explode on missing scripts', function (t) {
  var scene = sceneFixtureLoader('missing-file.xml');
  scene.start();
  t.same(scene.getAttribute('testloaded'), 'true');
  scene.stop();
  t.end();
});

test('should load', function (t) {
  var scene = sceneFixtureLoader('all_tags.xml');

  t.ok(scene.childNodes.length > 3);
  t.ok(scene instanceof Scene);
  t.end();
});

test('should parse spawn', function (t) {
  var scene = sceneFixtureLoader('all_tags.xml');

  t.equal(scene.getElementsByTagName('spawn').length, 1);
  t.ok(scene.getElementsByTagName('spawn')[0] instanceof Spawn);
  t.end();
});

test('should parse billboard', function (t) {
  var scene = sceneFixtureLoader('all_tags.xml');

  t.equal(scene.getElementsByTagName('billboard').length, 1);
  t.ok(scene.getElementsByTagName('billboard')[0].innerHTML.match(/<h1>Welcome/));
  t.ok(scene.getElementsByTagName('billboard')[0].innerHTML.match(/<!\[CDATA\[/));
  t.ok(scene.getElementsByTagName('billboard')[0].innerHTML.match(/stuff and things/));
  t.end();
});

test('should parse model', function (t) {
  var scene = sceneFixtureLoader('all_tags.xml');

  t.equal(scene.getElementsByTagName('model').length, 1);
  t.ok(scene.getElementsByTagName('model')[0].src.match(/blah.obj/));
  t.ok(scene.getElementsByTagName('model')[0] instanceof Model);
  t.end();
});

test('should parse link', function (t) {
  var scene = sceneFixtureLoader('all_tags.xml');

  t.equal(scene.getElementsByTagName('link').length, 1);
  t.ok(scene.getElementsByTagName('link')[0].href.match(/test/));
  t.ok(scene.getElementsByTagName('link')[0] instanceof Link);
  t.end();
});

test('should parse skybox', function (t) {
  var scene = sceneFixtureLoader('all_tags.xml');

  t.equal(scene.getElementsByTagName('skybox').length, 1);
  t.ok(scene.getElementsByTagName('skybox')[0].src.match(/blah/));
  t.ok(scene.getElementsByTagName('skybox')[0] instanceof Skybox);
  t.end();
});

test('should parse audio', function (t) {
  var scene = sceneFixtureLoader('all_tags.xml');

  t.equal(scene.getElementsByTagName('audio').length, 1);
  t.ok(scene.getElementsByTagName('audio')[0].src.match(/drone/));
  t.ok(scene.getElementsByTagName('audio')[0] instanceof Audio);
  t.end();
});

test('should parse fog', function (t) {
  var scene = sceneFixtureLoader('all_tags.xml');

  t.equal(scene.getElementsByTagName('fog').length, 1);
  t.ok(scene.getElementsByTagName('fog')[0].style.color.match('#fff'));
  t.ok(scene.getElementsByTagName('fog')[0].near.match('100'));
  t.ok(scene.getElementsByTagName('fog')[0] instanceof Fog);
  t.end();
});

test('should parse plane', function (t) {
  var scene = sceneFixtureLoader('all_tags.xml');

  t.equal(scene.getElementsByTagName('plane').length, 1);
  t.ok(scene.getElementsByTagName('plane')[0].style.textureMap.match('url'));
  t.ok(scene.getElementsByTagName('plane')[0] instanceof Plane);
  t.end();
});

test('should parse voxel', function (t) {
  var scene = sceneFixtureLoader('all_tags.xml');

  t.equal(scene.getElementsByTagName('voxel').length, 1);
  t.ok(scene.getElementsByTagName('voxel')[0] instanceof Voxel);
  t.end();
});

test('should parse text', function (t) {
  var scene = sceneFixtureLoader('all_tags.xml');

  t.equal(scene.getElementsByTagName('text').length, 1);
  t.ok(scene.getElementsByTagName('text')[0] instanceof Text);
  t.end();
});

test('should parse group', function (t) {
  var scene = sceneFixtureLoader('all_tags.xml');
  t.equal(scene.getElementsByTagName('group').length, 1);

  var group = scene.getElementsByTagName('group')[0];
  t.ok(group instanceof Group);
  t.equal(group.rotation.y, Math.PI / 2);
  t.equal(group.getElementsByTagName('box').length, 2);
  t.equal(group.getElementsByTagName('box')[0].position.x, 1);

  t.end();
});

