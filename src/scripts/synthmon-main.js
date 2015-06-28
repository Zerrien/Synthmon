var canvas, ctx;
var curTime, prevTime, tTime, dTime;
var gameState = 0;

var player, world;

/*
var explorer = new Image();
explorer.src = "./explorer32.png";

var doorSprite = new Image();
doorSprite.src = "./door.png";

var boulderSprite = new Image();
boulderSprite.src = "./boulder.png";

var pushSprite = new Image();
pushSprite.src = "./pushtile.png";

var boxSprite = new Image();
boxSprite.src = "./cardboardBox.png";

var boxTiles = new Image();
boxTiles.src = "./cardboardBoxTiles.png"

var bigtree = new Image();
bigtree.src = "./3x2tree.png"

var shoppe = new Image();
shoppe.src = "./shoppe.png";

var grass = new Image();
grass.src = "./bush.png";
*/

var keyPress = [];
var keyboardKeys = [];

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
			player.addComponent(new ECS.Components.WorldSprite(images.images.explorer));
			player.addComponent(new ECS.Components.WorldPosition(0, 0));
			player.addComponent(new ECS.Components.WorldFaces("north"));
			player.addComponent(new ECS.Components.WorldMoves());
		//player.c("worldmoves").curSpeed =
			player.addComponent(new ECS.Components.WorldKeyboardControlled());
			player.addComponent(new ECS.Components.WorldCollider());
			player.addComponent(new ECS.Components.WorldCanPush(1));
			ECS.entities.push(player);

			loadZone(0);

			/*
				Technically, this is where things will be read.
			*/

			setInterval(gameLoop, 10);
		}
	}
	xobj.send(null);
}

var systems = [
	ECS.Systems.WorldAI,
	ECS.Systems.WorldKeyboard,
	ECS.Systems.WorldCollision,
	ECS.Systems.WorldLogic,
	ECS.Systems.WorldRender
];

var systems2 = [
	ECS.Systems.WorldAI,
	ECS.Systems.UIKeyboard,
	ECS.Systems.WorldCollision,
	ECS.Systems.WorldLogic,
	ECS.Systems.WorldRender,
	ECS.Systems.WorldUI
]



function loadZone(_name) {
	if(_name == 0) {
		var k = 0;
		var pPos = player.c("worldposition");
		var pChunkX = pPos.x >> 5;
		var pChunkY = pPos.y >> 5;
		for(var obj in worldData.chunks[pChunkX+","+pChunkY].objects) {
			var object = worldData.chunks[pChunkX+","+pChunkY].objects[obj];
			var entity = new ECS.Entity();
			for(var componentID in object) {
				var details = object[componentID];
				if(ECS.Components[componentID]) {
					var component = new ECS.Components[componentID];
					if(componentID == "WorldSprite") {
						component.img = images.images[details.name];
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

			ECS.entities.push(entity);
		}
	} else {

		var door = new ECS.Entity();
		door.addComponent(new ECS.Components.WorldSprite(images.images.door));
		door.addComponent(new ECS.Components.WorldPosition(6,12));
		door.addComponent(new ECS.Components.WorldCollider());
		door.addComponent(new ECS.Components.WorldPortal(0, {
			"x":12,
			"y":5,
			"facing":"south"
		}));
		ECS.entities.push(door);
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
			for(var i = 0; i < systems.length; i++) {
				systems[i](ECS.entities);
			}
			break;
		case 1:
			for(var i = 0; i < systems2.length; i++) {
				systems2[i](ECS.entities);
			}
			break;
	}

	prevTime = curTime;
}

