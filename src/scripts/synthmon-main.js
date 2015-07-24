var canvas, ctx;
var curTime, prevTime, tTime, dTime;


var player, world;

var keyPress = [];
var keyboardKeys = [];

var IS_DEBUG = false;


var data = {};
var assets = new AssetController();
var settings = new SettingsController();
var camera;

var mousePos = {x:0, y:0};
var mousePress = false;
var mouseClick = false;

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

	initControls();

	for(var sceneName in ECS.Scenes) {
		ECS.Scenes[sceneName].init();
	}

	gameState = "Loading";

	setInterval(gameLoop, 10);
}

ECS.States = {};

ECS.States.WorldControl = [
	ECS.Systems.WorldEvents,
	ECS.Systems.WorldAI,
	ECS.Systems.WorldKeyboard,
	ECS.Systems.WorldCollision,
	ECS.Systems.WorldLogic,
	ECS.Systems.WorldRender
]

ECS.States.WorldUI = [
	ECS.Systems.WorldEvents,
	ECS.Systems.WorldAI,
	ECS.Systems.UIKeyboard,
	ECS.Systems.WorldCollision,
	ECS.Systems.WorldLogic,
	ECS.Systems.WorldRender,
	ECS.Systems.WorldUI
]


var gameState = 0;

ECS.entities2 = [];

/*
function loadZone(_name) {
	ECS.entities = [];
	ECS.entities.push(player);
	if(_name == 0) {
		world.init();
	} else {
		for(var obj in worldData.interior[_name].objects) {
			var object = worldData.interior[_name].objects[obj];
			var entity = new ECS.Entity();
			for(var componentID in object) {
				var details = object[componentID];
				if(ECS.Components[componentID]) {
					var component = new ECS.Components[componentID];
					if(componentID == "WorldSprite") {
						component.img = images.images[details.name];
					} else if(componentID == "Trainer") {
						component.synthmon.push(new Synthmon());
						component.synthmon.push(new Synthmon());
						component.synthmon.push(new Synthmon());
						component.synthmon.push(new Synthmon());
						component.tName = details["tName"]
						//component.synthmon.push(new Synthmon());
						//component.synthmon.push(new Synthmon());
						//component.synthmon.push(new Synthmon());
					} else if(componentID == "WorldPosition") {
						component.x = details.x;
						component.y = details.y;
					} else if(componentID == "WorldWire") {
						
						"connection":{
                            "name":"pressurePlate",
                            "component":"worldpressure",
                            "value":"isActivated"
                        }
                        
                        var attempt = tArrayFind(ECS.entities, details.connection.name);
                        if(attempt) {
                        	component.connection = attempt;
                        	component.component = details.connection.component;
                        	component.value = details.connection.value;

                        	component.on = details.link.on;
                        	component.off = details.link.off;

                        	component.link = details.link.name;
                        	component.val = details.link.value;
                        } else {
                        	component.connection = null;
                        	console.warn("Unable to find component of name: \"" + details.connection.name + "\" at coords: " + "Interior");
                        }
						

					} else {
						for(var value in details) {
							component[value] = details[value];
						}
					}
					entity.addComponent(component);
				} else {
					console.warn("Unable to find component of type:" + componentID)
				}
			}
			entity.sID = obj;
			ECS.entities.push(entity);
		}
	}
}

*/
function tArrayFind(_array, _key) {
	for(var i = 0; i < _array.length; i++) {
		if(_array[i].sID == _key) {
			return _array[i];
		}
	}
	return null;
}

function loadChunk(_coords) {
	if(worldData.chunks[_coords] && worldData.chunks[_coords].objects) {
		var splitArray = _coords.split(",");
		for(var obj in worldData.chunks[_coords].objects) {
			var object = worldData.chunks[_coords].objects[obj];
			var entity = new ECS.Entity();
			for(var componentID in object) {
				var details = object[componentID];
				if(ECS.Components[componentID]) {
					var component = new ECS.Components[componentID];
					if(componentID == "WorldSprite") {
						component.img = images.images[details.name];
					} else if(componentID == "Trainer") {
						component.synthmon.push(new Synthmon());
						component.synthmon.push(new Synthmon());
						component.synthmon.push(new Synthmon());
						component.synthmon.push(new Synthmon());
						component.tName = details["tName"]
						//component.synthmon.push(new Synthmon());
						//component.synthmon.push(new Synthmon());
						//component.synthmon.push(new Synthmon());
					} else if(componentID == "WorldPosition") {
						component.x = details.x + splitArray[0] * 32;
						component.y = details.y + splitArray[1] * 32;
					} else if(componentID == "WorldWire") {
						/*
						"connection":{
                            "name":"pressurePlate",
                            "component":"worldpressure",
                            "value":"isActivated"
                        }
                        */
                        var attempt = tArrayFind(ECS.entities, (_coords) + details.connection.name);
                        if(attempt) {
                        	component.connection = attempt;
                        	component.component = details.connection.component;
                        	component.value = details.connection.value;

                        	component.on = details.link.on;
                        	component.off = details.link.off;

                        	component.link = details.link.name;
                        	component.val = details.link.value;
                        } else {
                        	component.connection = null;
                        	console.warn("Unable to find component of name: \"" + details.connection.name + "\" at coords: " + _coords);
                        }
						

					} else {
						for(var value in details) {
							component[value] = details[value];
						}
					}
					entity.addComponent(component);
				} else {
					console.warn("Unable to find component of type:" + componentID)
				}
			}
			entity.sID = (_coords) + obj;
			ECS.entities.push(entity);
		}
	}
}

function unloadChunk(_coords) {
	if(worldData.chunks[_coords] && worldData.chunks[_coords].objects) {
		var splitArray = _coords.split(",");
		var objectArray = worldData.chunks[_coords].objects;
		for(var objKey in objectArray) {
			var result = tArrayFind(ECS.entities, _coords + objKey);
			if(result) {
				ECS.entities.splice(ECS.entities.indexOf(result), 1);

			}
		}
	}
}

function gameLoop() {
	curTime = (new Date()).getTime();
	if(!prevTime) {
		tTime = 0;
		prevTime = curTime;
	}
	dTime = curTime - prevTime;
	tTime += dTime;

	//console.log(ECS.Scenes);
	ECS.Scenes[gameState].logic();

	/*
	switch(gameState) {
		case 0:
			for(var i = 0; i < ECS.States.WorldControl.length; i++) {
				ECS.States.WorldControl[i](ECS.entities);
			}
			break;
		case 1:
			for(var i = 0; i < ECS.States.WorldUI.length; i++) {
				ECS.States.WorldUI[i](ECS.entities);
			}
			break;
		case 2:
			
			//for(var i = 0; i < ECS.States.Battle.length; i++) {
			//	ECS.States.Battle[i](ECS.entities2);
			//}
			
			ECS.Scenes.Battle.logic();
			break;
	}
	*/

	prevTime = curTime;
}

