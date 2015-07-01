/*
var explorer = new Image();
explorer.src = "./explorer32.png";
*/

var prevTime;
var player;
var worldData, images;

var mousePos = {x:0, y:0};
var mousePos2 = {x:0, y:0};
var IS_DEBUG = true;

var isMouseDown = false;

var keyboardKeys = [];

function init() {
	canvas = document.getElementById("game");
	canvas.width = 1024;
	canvas.height = 1024;
	ctx = canvas.getContext("2d");

	canvas.onmousemove = function(_e) {
		mousePos = {x: _e.layerX, y:_e.layerY};
		mousePos2 = {x:_e.clientX, y:_e.clientY};
	}

	canvas.onmousedown = function(_e) {
		isMouseDown = true;
	}
	canvas.onmouseup = function(_e) {
		isMouseDown = false;
	}
	window.onkeydown = function(_e) {
		keyboardKeys[_e.keyCode] = true;
	}
	window.onkeyup = function(_e) {
		keyboardKeys[_e.keyCode] = false;
	}

	/*
	var entity = new ECS.Entity();
	entity.addComponent(new ECS.Components.WorldPosition(0, 0));
	entity.addComponent(new ECS.Components.WorldSprite(explorer));
	ECS.entities.push(entity);
	*/


	var xobj = new XMLHttpRequest();
	xobj.overrideMimeType("application/json");
	xobj.open('get', './src/json/theworld.json', true);
	xobj.onreadystatechange = function() {
		if(xobj.readyState == 4 && xobj.status == "200") {
			worldData = JSON.parse(xobj.responseText);
			images = new ImageController();
			loadZone();
			setInterval(logic, 10);
		}
	};
	xobj.send(null);
	

}

function loadZone() {
	var k = 0;
	/*
	var pPos = player.c("worldposition");
	var pChunkX = pPos.x >> 5;
	var pChunkY = pPos.y >> 5;
	*/
	var pChunkX = 1;
	var pChunkY = 0;
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
}


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

function checkXY(_e, _x, _y) {
	for(var entityID in _e) {
		var entity = _e[entityID];
		var wP = entity.c("worldposition");
		if(wP && wP.x == _x && wP.y == _y) {
			return entity;
		}
	}
	return null;
}

var curSelect = null;

function makeTooltip() {
	clearTooltip();

	var tooltip = document.createElement("div");
	tooltip.id = "tooltip";
	tooltip.style.width = "400px"
	tooltip.innerHTML = "Entity";
	tooltip.style.position = "absolute";
	tooltip.style.backgroundColor = "#444444";
	tooltip.style.color = "white";
	tooltip.style.padding = "8px";
	tooltip.style.left = mousePos2.x + 32;
	tooltip.style.top = mousePos2.y - 32;

	for(var _component in curSelect.components) {
		var component = document.createElement("div");
		component.style.clear = "both";
		var componentName = document.createElement("div");

		componentName.style.paddingLeft = "8px";
		componentName.innerHTML = _component;
		component.appendChild(componentName);
		for(var _variable in curSelect.components[_component]) {
			if(_variable != "name" && curSelect.components[_component][_variable].toString().indexOf("function") == -1) {
				var variable = document.createElement("div");
				variable.style.paddingLeft = "16px";
				variable.style.clear = "both";

				var variableName = document.createElement("div");
				variableName.innerHTML = _variable;
				variableName.style.float = "left";
				variable.appendChild(variableName);

				var variableValue = document.createElement("input");
				variableValue.var = _variable;
				variableValue.comp = _component;
				variableValue.style.textAlign = "right";
				variableValue.onchange = function(_e) {
					curSelect.c(this.comp)[this.var] = this.value;
				}
				variableValue.value = curSelect.components[_component][_variable];
				variableValue.style.float = "right";

				variable.appendChild(variableValue);
				component.appendChild(variable);
			}
		}

		

		tooltip.appendChild(component);
	}
	var blankDiv = document.createElement("div");
	blankDiv.style.clear = "both";
	tooltip.appendChild(blankDiv);
	var addComponent = document.createElement("input");
	addComponent.style.clear = "both";
	addComponent.onchange = function(_e) {
		if(ECS.Components[this.value]) {
			if(this.value == "WorldSprite") {
				makeImageSelect();
			} else {
				curSelect.addComponent(new ECS.Components[this.value]());

				var obj = {};
				obj[this.value] = {};
				worldData.chunks["1,0"]["objects"][curSelect.id] = obj;
	
				var xObj = new XMLHttpRequest();
				xObj.open('get', "./src/php/world.php?set="+"chunks:1,0"+"&data="+JSON.stringify(worldData.chunks["1,0"]), true);
				xObj.onreadystatechange = function() {
					if(xObj.readyState == 4 && xObj.status == "200") {
					}
				}
				xObj.send();


				makeTooltip();
			}
		} else {
			console.warn("No such component:" + this.value)
			this.value = "";
		}
	}

	tooltip.appendChild(addComponent);


	document.body.appendChild(tooltip);
}

function clearTooltip() {
	var newDiv = document.getElementById("newDiv");
	if(newDiv) {
		newDiv.parentNode.removeChild(newDiv);
	}
	var tooltip = document.getElementById("tooltip");
	if(tooltip) {
		tooltip.parentNode.removeChild(tooltip);
	}
}

function makeImageSelect() {
	var newDiv = document.createElement("div");
	newDiv.id = "newDiv";
	newDiv.style.position = "absolute";
	newDiv.style.backgroundColor = "#444444";
	newDiv.style.color = "white";
	newDiv.style.padding = "8px";
	newDiv.style.left = mousePos2.x + 32;
	newDiv.style.top = mousePos2.y - 32;

	for(var _images in images.images) {
		var img = images.images[_images];
		img.ref = images.images[_images];
		img.width = 32;
		img.height = 32;
		newDiv.appendChild(img);
		img.onclick = function(_e) {
			curSelect.addComponent(new ECS.Components.WorldSprite(this.ref));
			/****
	!!!!!!!!!!!!!!!!!!!!
			*/
			worldData.chunks["1,0"]["objects"][curSelect.id] = {
				"WorldSprite":{
					"name":"boulder"
				}
			};

			var xObj = new XMLHttpRequest();
			xObj.open('get', "./src/php/world.php?set="+"chunks:1,0"+"&data="+JSON.stringify(worldData.chunks["1,0"]), true);
			//console.log("?set="+"chunks:1,0"+"&data="+JSON.stringify(worldData.chunks["1,0"]));
			xObj.onreadystatechange = function() {
				if(xObj.readyState == 4 && xObj.status == "200") {
				}
			}
			xObj.send();

			makeTooltip();
		}
	}
	document.body.appendChild(newDiv);
}

ECS.Systems.ChunkMakerMouse = function ChunkMakerMouse(_e) {
	var curX, curY;
	curX = (mousePos.x - mousePos.x % 32) / 32;
	curY = (mousePos.y - mousePos.y % 32) / 32;

	if(isMouseDown) {
		isMouseDown = false;
		var result = checkXY(_e, curX, curY);
		if (keyboardKeys[17] && result) {
			ECS.entities.splice(ECS.entities.indexOf(result), 1);
		} else if(!curSelect) {
			if(result) {
				curSelect = result;
				makeTooltip();
			} else {
				var entity = new ECS.Entity();
				entity.addComponent(new ECS.Components.WorldPosition(curX, curY));

				worldData.chunks["1,0"]["objects"][entity.id] = {
					"WorldPosition":{
						"x":curX,
						"y":curY
					}
				};

				var xObj = new XMLHttpRequest();
				xObj.open('get', "./src/php/world.php?set="+"chunks:1,0"+"&data="+JSON.stringify(worldData.chunks["1,0"]), true);
				//console.log("?set="+"chunks:1,0"+"&data="+JSON.stringify(worldData.chunks["1,0"]));
				xObj.onreadystatechange = function() {
					if(xObj.readyState == 4 && xObj.status == "200") {
					}
				}
				xObj.send();

				ECS.entities.push(entity);
			}
		} else {
			if(keyboardKeys[16] && !result) {
				var entity = curSelect.dupe();
				entity.c("worldposition").x = curX;
				entity.c("worldposition").y = curY;
				ECS.entities.push(entity);
			}  else {
				curSelect = null;
				clearTooltip();
			}
		}
	}

	for(var entityID in _e) {
		var entity = _e[entityID];
	}
}

function createEntity() {

}

function editComponent() {
	
}



ECS.Systems.ChunkMakerUI = function ChunkMakerUI(_e) {
	ctx.save();


	for(var entityID in _e) {
		var entity = _e[entityID];
	}

	var curX, curY;
	curX = (mousePos.x - mousePos.x % 32) / 32;
	curY = (mousePos.y - mousePos.y % 32) / 32;
	ctx.strokeRect(curX * 32, curY * 32, 32, 32);

	ctx.restore();
}

var systems = [
	ECS.Systems.ChunkMakerMouse,
	ECS.Systems.WorldRender,
	ECS.Systems.ChunkMakerUI
]