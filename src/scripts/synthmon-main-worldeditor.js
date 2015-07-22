var canvas, ctx, assistBar;
var prevTime, tTIme, curTime, dTime;

var IS_DEBUG = true;

var player;
var world, worldData, images;

var keyboardKeys = [];
var keyPress = [];

var mouseClick = false;
var mousePress = false;

var mousePos = {x:0, y:0};
var curSelect = null;

function init() {
	assistBar = document.getElementById("assistBar");
	canvas = document.getElementById("game");
	canvas.width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
	canvas.height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
	ctx = canvas.getContext("2d");

	canvas.onmousedown = function(_e) {
		if(!mousePress) {
			mouseClick = true;
		}
		mousePress = true;
	}

	window.onmouseup = function(_e) {
		mousePress = false;
		mouseClick = false;
	}

	window.onmousemove = function(_e) {
		mousePos = {x:_e.clientX, y:_e.clientY};
	}

	window.onkeydown = function(_e) {
		//LURD 37,38,39,40
		if(!keyPress[_e.keyCode]) {
			keyboardKeys[_e.keyCode] = true;
		}
		keyPress[_e.keyCode] = true;	
	}

	window.onkeyup = function(_e) {
		keyboardKeys[_e.keyCode] = false;
		keyPress[_e.keyCode] = false;
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
			player.addComponent(new ECS.Components.WorldPosition(16, 16));
			player.c("worldposition").world = 0;
			player.addComponent(new ECS.Components.WorldSprite(images.images.explorer));
			player.addComponent(new ECS.Components.WorldMoves());

			world.init();

			setInterval(logic, 10);
		}
	}
	xobj.send(null);
}




function entityFindByPos(_x, _y) {
	for(var i = 0; i < ECS.entities.length; i++) {
		var entityPos = ECS.entities[i].c("worldposition");
		if(entityPos.x == _x && entityPos.y == _y) {
			return ECS.entities[i];
		}
	}
	return null;
}

function drawTooltip() {
	clearTooltip();

	var tooltip = document.createElement("div");
	tooltip.id = "tooltip";
	tooltip.style.cursor = "default";
	tooltip.style.left = mousePos.x + 16;
	tooltip.style.top = mousePos.y;


	var topBar = document.createElement("div");
	topBar.id = "tooltipDragBar";
	topBar.style.cursor = "-webkit-grab";
	tooltip.appendChild(topBar);
	topBar.onmousedown = function(_e) {
		topBar.style.cursor = "-webkit-grabbing";
		tooltip.clickOffsetX = _e.offsetX;
		tooltip.clickOffsetY = _e.offsetY;
		this.isMoving = setInterval(function() {
			tooltip.style.left = mousePos.x - tooltip.clickOffsetX - 4 - 4;
			tooltip.style.top = mousePos.y - tooltip.clickOffsetY - 4 - 4;
		}, 1);
	}
	topBar.onmouseup = function() {
		topBar.style.cursor = "-webkit-grab";
		clearInterval(this.isMoving);
	}

	var entityIDDiv = document.createElement("div");
	entityIDDiv.innerHTML = "Entity Name: " + curSelect.sID;
	tooltip.appendChild(entityIDDiv);

	for(var compName in curSelect.components) {
		var component = curSelect.components[compName];
		var componentContainer = document.createElement("div");
		componentContainer.className = "compContainer";
		var componentName = document.createElement("div");
		componentName.innerHTML = compName;
		componentName.className = "compName";
		componentContainer.appendChild(componentName);
		for(var varName in component) {
			if(typeof component[varName] == "object" && varName != "img") {
				for(var subObject in component[varName]) {
					var variableName = document.createElement("div");
					variableName.innerHTML = varName + " " + subObject;
					variableName.className = "varName";
					componentContainer.appendChild(variableName);

					var variableValue = document.createElement("input");
					variableValue.value = component[varName][subObject];
					variableValue.className = "varValue";
					componentContainer.appendChild(variableValue);
				}
			} else if(varName == "img") {
			} else if(varName != "name") {
				var variableName = document.createElement("div");
				variableName.innerHTML = varName;
				variableName.className = "varName";
				componentContainer.appendChild(variableName);

				var variableValue = document.createElement("input");
				variableValue.value = component[varName];
				variableValue.className = "varValue";
				variableValue.assoc = varName;
				variableValue.cAssoc = compName;
				variableValue.eAssoc = curSelect.sID;
				componentContainer.appendChild(variableValue);
				variableValue.onchange = function(_e) {
					curSelect.dataRef[findComponent(this.cAssoc)][this.assoc] = parseInt(this.value);
					curSelect.components[this.cAssoc][this.assoc] = parseInt(this.value);
					var tObj = {};
					tObj[curSelect.oID] = curSelect.dataRef;

					var chunkX = curSelect.c("worldposition").x >> 5;
					var chunkY = curSelect.c("worldposition").y >> 5;
									
					var xobj = new XMLHttpRequest();
					xobj.overrideMimeType("application/json");
					xobj.open('get', "./src/php/world.php?" + 
						"set=" + chunkX + "," + chunkY +
						"&data=" + JSON.stringify(tObj), true);
					xobj.onreadystatechange = function() {
						if(xobj.readyState == 4 && xobj.status == "200") {
							console.log(xobj.responseText);
						}
					}
					xobj.send(null);
				}
			}
		}


		tooltip.appendChild(componentContainer);
	}

	document.body.appendChild(tooltip);
}

function updateWorld(_chunk, _entity) {

}


function clearTooltip() {
	var tooltip = document.getElementById("tooltip");
	if(tooltip) {
		tooltip.parentNode.removeChild(tooltip);
	}
}


ECS.Systems.ChunkControl = function ChunkControl(_e) {
	var pP = player.c("worldposition");
	if(mouseClick) {
		mouseClick = false;
		var pP = player.c("worldposition");
		var details = getMouseDetails();
		var result = entityFindByPos(details.globalX, details.globalY);
		if(result) {
			curSelect = result;
			drawTooltip();
		}
	}



	if(keyPress[37]) {
		keyPress[37] = false;
		pP.x -= 1;
	} else if (keyPress[38]) {
		keyPress[38] = false;
		pP.y -= 1;
	} else if (keyPress[39]) {
		keyPress[39] = false;
		pP.x += 1;
	} else if (keyPress[40]) {
		keyPress[40] = false;
		pP.y += 1;
	}
}

function getMouseDetails() {
	var pP = player.c("worldposition");

	var xOff = (canvas.width / 2 - 8) % 16;
	var yOff = (canvas.height / 2 - 8) % 16;
	var xPos = Math.floor((mousePos.x - xOff) / 16);
	var yPos = Math.floor((mousePos.y - yOff) / 16);
	var globalX = pP.x - (Math.floor(canvas.width / 16 / 2) - xPos);
	var globalY = pP.y - (Math.floor(canvas.height / 16 / 2) - yPos);
	var chunkX = (pP.x - (Math.floor(canvas.width / 16 / 2) - xPos)) >> 5;
	var chunkY = (pP.y - (Math.floor(canvas.height / 16 / 2) - yPos)) >> 5;

	return {
		"xOff": xOff,
		"yOff": yOff,
		"xPos": xPos,
		"yPos": yPos,
		"globalX": globalX,
		"globalY": globalY,
		"chunkX": chunkX,
		"chunkY": chunkY
	}
}

ECS.Systems.ChunkUI = function ChunkUI(_e) {
	var details = getMouseDetails();

	ctx.save();
	ctx.textAlign = "right";
	ctx.fillText(details.globalX + "," + details.globalY, details.xOff + details.xPos * 16 - 4, details.yOff + details.yPos * 16);
	ctx.fillText(details.chunkX + "," + details.chunkY, details.xOff + details.xPos * 16 - 4, details.yOff + details.yPos * 16 + 12);
	ctx.restore();
	ctx.strokeRect(details.xOff + details.xPos * 16, details.yOff + details.yPos * 16, 16, 16);
}

var systems = [
	ECS.Systems.ChunkControl,
	ECS.Systems.WorldRender,
	ECS.Systems.ChunkUI
];

function logic() {
	curTime = (new Date()).getTime();
	if(!prevTime) {
		tTime = 0;
		prevTime = curTime;
	}
	dTime = curTime - prevTime;
	tTime += dTime;

	for(var i = 0; i < systems.length; i++) {
		systems[i](ECS.entities);
	}

	prevTime = curTime;
}

function loadChunk(_coords) {
	if(worldData.chunks[_coords] && worldData.chunks[_coords].objects) {
		var splitArray = _coords.split(",");
		for(var obj in worldData.chunks[_coords].objects) {
			var object = worldData.chunks[_coords].objects[obj];
			var entity = new ECS.Entity();
			entity.dataRef = object;
			for(var componentID in object) {
				var details = object[componentID];
				if(ECS.Components[componentID]) {
					var component = new ECS.Components[componentID];
					if(componentID == "WorldSprite") {
						component.img = images.images[details.name];
					} else if(componentID == "Trainer") {
						//component.synthmon.push(new Synthmon());
						//component.synthmon.push(new Synthmon());
						//component.synthmon.push(new Synthmon());
						//component.synthmon.push(new Synthmon());
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
			entity.oID = obj;
			
			ECS.entities.push(entity);
		}
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