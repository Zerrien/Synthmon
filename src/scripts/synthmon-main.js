var canvas, ctx;
var curTime, prevTime, tTime, dTime;


var player, world;

var keyPress = [];
var keyboardKeys = [];

var IS_DEBUG = false;

function init() {
	canvas = document.getElementById("game");
	canvas.width = 800;
	canvas.height = 600;
	ctx = canvas.getContext("2d");

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

	var xobj = new XMLHttpRequest();
	xobj.overrideMimeType("application/json");
	xobj.open('get', './src/json/theworld.json', true);
	xobj.onreadystatechange = function() {
		if(xobj.readyState == 4 && xobj.status == "200") {
			
			worldData = JSON.parse(xobj.responseText);
			world = new WorldController();
			images = new ImageController();

			player = new ECS.Entity();

			//World-components
			player.addComponent(new ECS.Components.WorldSprite(images.images.explorer));
			player.addComponent(new ECS.Components.WorldPosition(0, 0));
			player.addComponent(new ECS.Components.WorldFaces("north"));
			player.addComponent(new ECS.Components.WorldMoves());
			player.addComponent(new ECS.Components.WorldAnimation({
				"standing":[0],
				"spinning":[0, 1],
				"jumping":[0, 1],
				"sliding":[0, 1],
				"walking":[0, 1],
				"floating":[2, 3],
				"superpushed":[0,1]
			}));
			player.addComponent(new ECS.Components.WorldCollider());
			player.addComponent(new ECS.Components.WorldCanPush(1));

			//Control-components
			player.addComponent(new ECS.Components.WorldKeyboardControlled());

			//Meta-components.
			player.addComponent(new ECS.Components.Inventory());
			player.c('inventory').items.push("Item1");
			player.c('inventory').items.push("Item1");
			player.c('inventory').items.push("Item1");
			player.c('inventory').items.push("Item1");
			player.addComponent(new ECS.Components.Trainer());
			player.c('trainer').synthmon.push(new Synthmon(true));
			player.c('trainer').synthmon.push(new Synthmon(true));
			player.c('trainer').synthmon.push(new Synthmon(true));
			player.c('trainer').synthmon.push(new Synthmon(true));

			ECS.entities.push(player);

			world.init();

			/*
			loadZone(0);
			*/

			/*
				Technically, this is where things will be read.
			*/

			setInterval(gameLoop, 10);
		}
	}
	xobj.send(null);
}

ECS.States = {};

ECS.States.WorldControl = [
	ECS.Systems.WorldAI,
	ECS.Systems.WorldKeyboard,
	ECS.Systems.WorldCollision,
	ECS.Systems.WorldLogic,
	ECS.Systems.WorldRender
]

ECS.States.WorldUI = [
	ECS.Systems.WorldAI,
	ECS.Systems.UIKeyboard,
	ECS.Systems.WorldCollision,
	ECS.Systems.WorldLogic,
	ECS.Systems.WorldRender,
	ECS.Systems.WorldUI
]

ECS.States.Battle = [
	ECS.Systems.BattleControl,
	ECS.Systems.BattleLogic,
	ECS.Systems.BattleRender,
	ECS.Systems.WorldUI
]

var gameState = 0;

ECS.entities2 = [];

function loadZone(_name) {
	if(_name == 0) {
		world.init();
	} else {
		var door = new ECS.Entity();
		door.addComponent(new ECS.Components.WorldSprite(images.images.door));
		door.addComponent(new ECS.Components.WorldPosition(6,12));
		door.addComponent(new ECS.Components.WorldCollider());
		door.addComponent(new ECS.Components.WorldPortal(0, {
			"x":12,
			"y":2,
			"facing":"south"
		}));
		ECS.entities.push(door);
	}
}

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
			for(var i = 0; i < ECS.States.Battle.length; i++) {
				ECS.States.Battle[i](ECS.entities2);
			}
			break;
	}

	prevTime = curTime;
}

