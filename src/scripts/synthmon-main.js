var canvas, ctx, gl;
var canvas3D;
var curTime, prevTime, tTime, dTime;


var player, world;

var keyPress = [];
var keyboardKeys = [];

var IS_DEBUG = false;
var IS_3D = true;

var app = {};
var shaders = {};

var data = {};
var assets = new AssetController();
var settings = new SettingsController();
var camera;

var mousePos = {x:0, y:0};
var mousePress = false;
var mouseClick = false;

var gameState = "Loading";

function initControls() {
	window.onkeydown = function(_e) {
		if(!keyPress[_e.keyCode]) {
			keyboardKeys[_e.keyCode] = true;
		}
		keyPress[_e.keyCode] = true;	
	}
	window.onkeyup = function(_e) {
		keyboardKeys[_e.keyCode] = false;
		keyPress[_e.keyCode] = false;
	}
	window.onmousewheel = function(_e) {
		worldScale += _e.deltaY / 1000;
		if(worldScale < 0.20) {
			worldScale = 0.20;
		}
		if(worldScale > 2) {
			worldScale = 2;
		}
	}
	canvas.onmousemove = function(_e) {
		mousePos = {x:_e.offsetX, y:_e.offsetY};
	}
	canvas.onmousedown = function(_e) {
		if(!mousePress) {
			mouseClick = true;
		}
		mousePress = true;
	}
	canvas.onmouseup = function(_e) {
		mouseClick = false;
		mousePress = false;
	}

}

function init() {
	canvas = document.getElementById("game");
	canvas.width = 800;
	canvas.height = 600;
	ctx = canvas.getContext("2d");
	if(IS_3D) {
		canvas3D = document.createElement("canvas");
		canvas3D.width = 800;
		canvas3D.height = 600;
		gl = canvas3D.getContext("webgl");
		if(gl) {
			gl.clearColor(0.0, 0.0, 0.0, 0.25);
			gl.enable(gl.DEPTH_TEST);
	    	gl.depthFunc(gl.LEQUAL);
	    	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); 

	    	initShaders();
		}
	}
	
	initControls();

	for(var sceneName in ECS.Scenes) {
		ECS.Scenes[sceneName].init();
	}

	gameState = "Loading";

	setInterval(gameLoop, 10);
}

function gameLoop() {
	curTime = (new Date()).getTime();
	if(!prevTime) {
		tTime = 0;
		prevTime = curTime;
	}
	dTime = curTime - prevTime;
	tTime += dTime;

	ECS.Scenes[gameState].logic();

	prevTime = curTime;
}

