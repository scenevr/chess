# SceneDOM

This library represents a 3D world as an XML DOM. It's used by SceneVR as its main world representation; this library is designed to be used on either a web client or a NodeJS server.

## Usage

Install the library from NPM:

    npm install scene-dom

Once you have the

    var SceneDOM = require('scene-dom');

SceneDOM has the following properties:

 * `createDocument()`: create a new DOM document
 * `Vector`: constructor for new Vectors, used for attributes such as position & scaling on DOM elements
 * `Euler`: constructor for new Vectors, used for the rotation attribute on DOM elements

This is a simple usage example:

	var SceneDOM = require('scene-dom');
	var Vector = require('scene-dom').Vector;
	var Euler = require('scene-dom').Euler;

	var doc = SceneDOM.createDocument();
	doc.load(‘my-scene.xml');

	var box = document.createElement(‘box’);
	doc.scene.appendChild(box);

	box.position = new Vector(1,2,3);
	box.rotation = new Euler(0,Math.PI/2,0);

### Document methods

	`document.load(filename)`: Load a scene from an XML file
	`document.createElement(tagName)`: Create a new SceneDOM element

### Element lookup

	`document.getElementByID(id)`: Get an element by HTML ID
	`document.getElementByUUID(uuid)`: Get an element by UUID, used for syncing elements between client/server

### Element types

SceneDOM comes with the following elements:

 * `<audio>`: An audio element
 * `<billboard>`: A picture or HTML page rendered in-scene
 * `<box>`: A rectangular prism
 * `<fog>`: Distance fog details
 * `<link>`: A connection to another world
 * `<model>`: An imported 3D model
 * `<plane>`: An infinite plane
 * `<player>`: Avatar of a player
 * `<scene>`: The root scene node, which contains all other elements
 * `<script>`: JavaScript executed within the scene, to give it behavior
 * `<skybox>`: Skybox details
 * `<spawn>`: The spawn location for new players
