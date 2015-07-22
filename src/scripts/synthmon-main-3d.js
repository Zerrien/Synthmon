var canvas, ctx;
var curTime, prevTime, tTime, dTime;


var player, world;

var keyPress = [];
var keyboardKeys = [];

var IS_DEBUG = false;

var shaders = {};

function initShaders() {
	var shaderList = [
		{"name":"lambert", "properties":{"vertPos":"a_vertPos"}, "uniforms":["u_mMatrix", "u_cMatrix", "u_wMatrix", "u_pMatrix", "u_cameraPos", "u_selected"]}
	];
	for(var i = 0; i < shaderList.length; i++) {
		var shaderName = shaderList[i].name;
		var fragShader = getShader(shaderName + "-fs");
		var vertShader = getShader(shaderName + "-vs");

		shaders[shaderName] = {"program":gl.createProgram()};
		//gl.useProgram(shaders[shaderName].program);
		gl.attachShader(shaders[shaderName].program, fragShader);
		gl.attachShader(shaders[shaderName].program, vertShader);
		gl.linkProgram(shaders[shaderName].program);

		if(!gl.getProgramParameter(shaders[shaderName].program, gl.LINK_STATUS)) {
			alert("WebGL-EzStart Error: Unable to init shader program");
		}

		for(property in shaderList[i].properties) {
			shaders[shaderName][property] = gl.getAttribLocation(shaders[shaderName].program, shaderList[i].properties[property]);
			gl.enableVertexAttribArray(shaders[shaderName][property]);
		}

		shaders[shaderName].uniforms = shaderList[i].uniforms;
	}
}

function getShader(_id) {
	/*
		Pretty much the Firefox tutorial.
	*/
	var shaderScript, theSource, currentChild, shader;
	shaderScript = document.getElementById(_id);
	if(!shaderScript) {
		return null;
	}

	theSource = "";
	currentChild = shaderScript.firstChild;
	while(currentChild) {
		if(currentChild.nodeType == currentChild.TEXT_NODE) {
			theSource += currentChild.textContent;
		}
		currentChild = currentChild.nextSibling;
	}
	if(shaderScript.type == "x-shader/x-fragment") {
		shader = gl.createShader(gl.FRAGMENT_SHADER);
	} else if (shaderScript.type == "x-shader/x-vertex") {
		shader = gl.createShader(gl.VERTEX_SHADER);
	} else {
		return null;
	}
	gl.shaderSource(shader, theSource);
	gl.compileShader(shader);
	if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		alert("WebGL-EzStart Error: An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader));
		return null;
	}
	return shader;
}
var app = {};

function init() {
	canvas = document.getElementById("game");
	canvas.width = 800;
	canvas.height = 600;
	gl = canvas.getContext("webgl");
	if(gl) {
		gl.clearColor(0.0, 0.0, 0.0, 0.25);
		gl.enable(gl.DEPTH_TEST);
	    gl.depthFunc(gl.LEQUAL);
	    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); 

	    initShaders();

	    OBJ.downloadMeshes({
	    	"cube":"box.obj"
	    }, function(_meshes) {
	    	app.meshes = _meshes;
			for(model in app.meshes) {
				OBJ.initMeshBuffers(gl, app.meshes[model]);
			}

			var xobj = new XMLHttpRequest();
			xobj.overrideMimeType("application/json");
			xobj.open('get', './src/json/theworld.json?null', true);
			xobj.onreadystatechange = function() {
				if(xobj.readyState == 4 && xobj.status == "200") {
					
					worldData = JSON.parse(xobj.responseText);
					world = new WorldController();
					images = new ImageController();
		
					player = new ECS.Entity();
		
					//World-components
					player.addComponent(new ECS.Components.WorldSprite(images.images.explorer));
					var playerPos = new ECS.Components.WorldPosition(0, 0);
					playerPos.zone = "playerUpstairs";
					player.addComponent(playerPos);
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
					player.addComponent(new ECS.Components.Revives());
					player.addComponent(new ECS.Components.WorldCollider());
					player.addComponent(new ECS.Components.WorldCanPush(1));
		
					//Control-components
					player.addComponent(new ECS.Components.WorldKeyboardControlled());
		
					//Meta-components.
					player.addComponent(new ECS.Components.Inventory());
					
					player.c('inventory').items.push(new Item(ItemSchema.potion));
					player.c('inventory').items.push(new Item(ItemSchema.fruitA));
					//player.c('inventory').items.push(new Item());
					//player.c('inventory').items.push(new Item());
					//player.c('inventory').items.push(new Item());
		
					player.addComponent(new ECS.Components.Trainer());
					player.c('trainer').synthmon.push(new Synthmon(true));
					//player.c('trainer').synthmon.push(new Synthmon(true));
					//player.c('trainer').synthmon.push(new Synthmon(true));
					//player.c('trainer').synthmon.push(new Synthmon(true));
		
					ECS.entities.push(player);
		
					//world.init();
		
					for(var sceneName in ECS.Scenes) {
						ECS.Scenes[sceneName].init();
					}
		
					/*
					loadZone(0);
					*/
					loadZone(playerPos.zone);
		
					/*
						Technically, this is where things will be read.
					*/
		
					setInterval(gameLoop, 10);
				}
			}
			xobj.send(null);
	    });
	}

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

	
}

ECS.States = {};

ECS.Systems.World3DRender = function World3DRender(_e) {

	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	gl.disable(gl.CULL_FACE);
	gl.enable(gl.DEPTH_TEST);
	gl.enable(gl.BLEND);
	gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

	gl.useProgram(shaders.lambert.program);

	var perspectiveMatrix = makePerspective(Math.PI/4, canvas.width/canvas.height, 1, 1000.0);

	var pP = player.c("worldposition");
	var pM = player.c("worldmoves");
	var pShift = player.c("worldmoves");
	var pShiftX = pShift.curCycle / pShift.curSpeed * pShift.destX;
	var pShiftY = pShift.curCycle / pShift.curSpeed * pShift.destY;
	var viewMatrix = getIdentity();
	//viewMatrix = matrixMultiply(viewMatrix, makeYRotation(Math.PI / 8));
	viewMatrix = matrixMultiply(viewMatrix, makeTranslation(-1 * pP.x - pShiftX, 0, -1 * pP.y - pShiftY));


	
	viewMatrix = matrixMultiply(viewMatrix, makeYRotation(Math.PI / 16));
	viewMatrix = matrixMultiply(viewMatrix, makeXRotation(Math.PI / 4));

	viewMatrix = matrixMultiply(viewMatrix, makeTranslation(0, 0, -50));
	
	//
	

	var worldMatrix = getIdentity();
	//worldMatrix = matrixMultiply(worldMatrix, makeTranslation(0, 100000, 0))
	//worldMatrix = matrixMultiply(perspectiveMatrix, viewMatrix);
	//console.log(makeTranslation(0, 0, 0));
	

	//console.log(shaders.lambert.program.vertPos);

	var i = 0;
	for(var entityID in _e) {
		i++;
		var entity = _e[entityID];
		var wP = entity.c("worldposition");
		if(wP) {
			var eShift = entity.c("worldmoves");
			var eShiftX = eShiftY = 0;
			if(eShift) {
				eShiftX = eShift.curCycle / eShift.curSpeed * eShift.destX;
				eShiftY = eShift.curCycle / eShift.curSpeed * eShift.destY;
				//console.log(eShiftX);
			}

			var modelMatrix = getIdentity();
			modelMatrix = matrixMultiply(modelMatrix, makeScale(1 / 10, 1 / 10, 1 / 10));
			modelMatrix = matrixMultiply(modelMatrix, makeTranslation(wP.x + eShiftX, 0, wP.y + eShiftY));

			setUniform("u_wMatrix", matrixMultiply(viewMatrix, perspectiveMatrix));
			setUniform("u_mMatrix", modelMatrix);

			drawApp(app.meshes.cube);
		}
	}
	console.log(i);

	//console.log(app.meshes)
	//console.log("!!");
}

ECS.States.WorldControl = [
	ECS.Systems.WorldEvents,
	ECS.Systems.WorldAI,
	ECS.Systems.WorldKeyboard,
	ECS.Systems.WorldCollision,
	ECS.Systems.WorldLogic,
	//ECS.Systems.WorldRender
	ECS.Systems.World3DRender
]

ECS.States.WorldUI = [
	ECS.Systems.WorldEvents,
	ECS.Systems.WorldAI,
	ECS.Systems.UIKeyboard,
	ECS.Systems.WorldCollision,
	ECS.Systems.WorldLogic,
	ECS.Systems.World3DRender
	//ECS.Systems.WorldRender,
	//ECS.Systems.WorldUI
]

function drawApp(_app) {
	//console.log(_app);
	gl.bindBuffer(gl.ARRAY_BUFFER, _app.vertexBuffer);
	gl.vertexAttribPointer(shaders.lambert.vertPos, _app.vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);

	//gl.bindBuffer(gl.ARRAY_BUFFER, _app.textureBuffer);
	//gl.vertexAttribPointer(shaders.lambert.program.uvCoord, _app.textureBuffer.itemSize, gl.FLOAT, false, 0, 0);

	//gl.bindBuffer(gl.ARRAY_BUFFER, _app.normalBuffer);
	//gl.vertexAttribPointer(shaders.lambert.program.vertNorm, _app.normalBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, _app.indexBuffer);

	gl.drawElements(gl.TRIANGLES, _app.indexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
}

function setUniform(_n, _v, _n1) {
	if(_v.length == 16) {
		gl.uniformMatrix4fv(gl.getUniformLocation(shaders.lambert.program, _n), false, _v);
	}  else if (typeof _v === 'number') {
		gl.uniform1f(gl.getUniformLocation(shaders.lambert.program, _n), _v);
	} else if (_v.length == 3) {
		gl.uniform3fv(gl.getUniformLocation(shaders.lambert.program, _n), _v);
	} else {
		gl.activeTexture(33984 + _n1);
  		gl.bindTexture(gl.TEXTURE_2D, _v);
  		gl.uniform1i(gl.getUniformLocation(shaders.lambert.program, _n), _n1);
		//alert("Attempting to pass unknown-type uniform");
	}
}

var gameState = 0;

ECS.entities2 = [];

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
						/*
						"connection":{
                            "name":"pressurePlate",
                            "component":"worldpressure",
                            "value":"isActivated"
                        }
                        */
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
			/*
			for(var i = 0; i < ECS.States.Battle.length; i++) {
				ECS.States.Battle[i](ECS.entities2);
			}
			*/
			ECS.Scenes.Battle.logic();
			break;
	}

	prevTime = curTime;
}


function getIdentity() {
	return [1, 0, 0, 0,
			0, 1, 0, 0, 
			0, 0, 1, 0, 
			0, 0, 0, 1];
}