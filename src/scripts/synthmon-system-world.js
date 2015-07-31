ECS.Scenes.World = {
	"systems":[
		"WorldAI",
		"WorldControl",
		"WorldCollision",
		"WorldLogic",
		"WorldRender",
		"WorldRender3D"
	],
	"entities":[],
	"logic":function() {
		for(var i = 0 ; i < this.systems.length; i++) {
			if(this.systems[i]) {
				this.systems[i](worldEntities);
			}
		}
	},
	"init":function() {
		worldEntities = this.entities;
		for(var i = 0; i < this.systems.length; i++) {
			this.systems[i] = ECS.Systems[this.systems[i]];
		}
	}
};
var worldEntities = ECS.Scenes.World.entities; //Alias

function worldNewGame() {
	player = new ECS.Entity();
	player.addComponent(new ECS.Components.WorldSprite(assets.images.explorer));
	var playerPos = new ECS.Components.WorldPosition(0, 0);
	playerPos.zone = "playerUpstairs";
	player.addComponent(playerPos);
	player.addComponent(new ECS.Components.WorldFaces("south"));
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
	player.addComponent(new ECS.Components.WorldModel());
	player.c('worldmodel').model = assets.models.player;
	player.c('worldmodel').texture = assets.textures['tex2'].texture;

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
	

	camera = new CameraController(player);
	world = new WorldController();

	loadZone(playerPos.zone);
}

function tArrayFind(_array, _key) {
	for(var i = 0; i < _array.length; i++) {
		if(_array[i].sID == _key) {
			console.log("???123123");
			return _array[i];
		}
	}
	return null;
}

function unloadChunk(_coords) {
	delete terrain[_coords];
	if(data.chunks[_coords] && data.chunks[_coords].objects) {
		var objectArray = data.chunks[_coords].objects;
		for(var objKey in objectArray) {
			var result = tArrayFind(worldEntities, _coords + objKey);
			if(result) {
				worldEntities.splice(worldEntities.indexOf(result), 1);
			}
		}
	}
}

function loadZone(_zone, _chunk) {
	var zoneData, xChunk, yChunk;
	if(_zone == 0) {
		//Time to load some chunks.
		if(!_chunk) {
			var pP = player.c("worldposition");
			zoneData = data.chunks[(pP.x >> 5) + "," + (pP.y >> 5)];
			_chunk = (pP.x >> 5) + "," + (pP.y >> 5);
			xChunk = (pP.x >> 5);
			yChunk = (pP.y >> 5);
		} else {
			zoneData = data.chunks[_chunk];
			var strSplit = _chunk.split(",");
			xChunk = strSplit[0];
			yChunk = strSplit[1];
		}
		if(!zoneData) {
			zoneData = {};
		}
		zoneData.terrain = {};
		zoneData.terrain.width = 32;
		zoneData.terrain.height = 32;
	} else {
		worldEntities = [];
		worldEntities.push(player);

		zoneData = data.interior[_zone];
		_chunk = _zone;
		terrain = {};
	}
	//terrain = null;
	if(zoneData) {
		for(var objName in zoneData.objects) {
			var object = zoneData.objects[objName];
			var entity = new ECS.Entity();
			for(var componentName in object) {
				var componentDetail = object[componentName];
				if(ECS.Components[componentName]) {
					var component = new ECS.Components[componentName];
					if(componentName == "WorldSprite") {
						component.img = assets.images[componentDetail.name];
						component.imgName = componentDetail.name;
					} else if (componentName == "WorldPosition") {
						component.x = componentDetail.x + (xChunk ? xChunk * 32 : 0);
						component.y = componentDetail.y + (yChunk ? yChunk * 32 : 0);
					} else if (componentName == "WorldModel") {
						component.model = assets.models[componentDetail.modelName];
						component.texture = assets.textures[componentDetail.modelTexture].texture;
					} else if (componentName == "Trainer") {

					} else if (componentName == "WorldWire") {

					} else {
						for(var variableName in componentDetail) {
							var variable = componentDetail[variableName];
							component[variableName] = variable;
						}
					}
					entity.addComponent(component);
				} else {
					console.warn("Unable to find component of type:" + componentID)
				}
			}
			entity.sID = (_chunk) + objName;
			worldEntities.push(entity);
		}
		constructTerrain(zoneData.terrain, _chunk);
	} else {
		console.warn("Warning: No ZoneData of " + _zone + " at chunk " + _chunk);
	}
}

function constructTerrain(_data, _chunk) {
	tMesh = {};
	tMesh.vNormals = [];
	tMesh.uvCoords = [];
	tMesh.vertices = [];
	tMesh.indices = [];
	var k = 0;
	for(var i = 0; i < _data.width; i++) {
		for(var j = 0; j < _data.height; j++) {
			tMesh.vNormals.push(1, 1, 1);
			tMesh.vNormals.push(1, 1, 1);
			tMesh.vNormals.push(1, 1, 1);
			tMesh.vNormals.push(1, 1, 1);
			tMesh.vNormals.push(1, 1, 1);
			tMesh.vNormals.push(1, 1, 1);

			tMesh.uvCoords.push(0, 0);
			tMesh.uvCoords.push(0, 1);
			tMesh.uvCoords.push(1, 1);

			tMesh.uvCoords.push(0, 0);
			tMesh.uvCoords.push(1, 0);
			tMesh.uvCoords.push(1, 1);

			tMesh.vertices.push(0 + i, 0, 0 + j);
			tMesh.vertices.push(1 + i, 0, 0 + j);
			tMesh.vertices.push(1 + i, 0, 1 + j);

			tMesh.vertices.push(0 + i, 0, 0 + j);
			tMesh.vertices.push(0 + i, 0, 1 + j);
			tMesh.vertices.push(1 + i, 0, 1 + j);

			tMesh.indices.push(k++);
			tMesh.indices.push(k++);
			tMesh.indices.push(k++);

			tMesh.indices.push(k++);
			tMesh.indices.push(k++);
			tMesh.indices.push(k++);
		}
	}

	//terrain = {};
	terrain[_chunk] = {};
	terrain[_chunk].normalBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, terrain[_chunk].normalBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(tMesh.vNormals), gl.STATIC_DRAW);
	terrain[_chunk].normalBuffer.itemSize = 3;
	terrain[_chunk].normalBuffer.numItems = tMesh.vNormals.length / 3;
	
	terrain[_chunk].textureBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, terrain[_chunk].textureBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(tMesh.uvCoords), gl.STATIC_DRAW);
	terrain[_chunk].textureBuffer.itemSize = 2;
	terrain[_chunk].textureBuffer.numItems = tMesh.uvCoords.length / 2;
	
	terrain[_chunk].vertexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, terrain[_chunk].vertexBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(tMesh.vertices), gl.STATIC_DRAW);
	terrain[_chunk].vertexBuffer.itemSize = 3;
	terrain[_chunk].vertexBuffer.numItems = tMesh.vertices.length / 3;
	
	terrain[_chunk].indexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, terrain[_chunk].indexBuffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(tMesh.indices), gl.STATIC_DRAW);
	terrain[_chunk].indexBuffer.itemSize = 1;
	terrain[_chunk].indexBuffer.numItems = tMesh.indices.length;
	//return terrain;
}

var terrain = null;

ECS.Systems.WorldAI = function WorldAI(_e) {
	for(var entityID in _e) {
		var entity = _e[entityID];
		if(entity.c("worldconveyor")) {
			var wC = entity.c("worldconveyor");
			var wP = entity.c("worldposition");
			var result = checkCollision(_e, wP.x, wP.y, entity);
			if(result) {
				var rwM = result.c("worldmoves");
				var rF = result.c("worldfaces");
				var rcP = result.c("worldcanpush");
				if(rwM.state == "standing") {
					if(wC.pushTime >= rwM.curSpeed && result.c("worldkeyboardcontrolled")) {
					} else {
						if(rF) {
							rF.facing = entity.c("worldfaces").facing;
						}
						if(rcP) {
							rcP.curStrength = rcP.strength;
						}
						rwM.state = wC.type;
						var facingXY = entity.c("worldfaces").facingTile();
						rwM.destX = facingXY.x;
						rwM.destY = facingXY.y;
						if(wC.lastPust != result) {
							wC.lastPush = result;
							wC.pushTime = 0;
						} else {
							wC.pusTime += dTime;
						}
					}
				}
			} else {
				wC.lastPush = null;
				wC.pushTime = 0;
			}
		} else if (entity.c("worldslippery")) {
			var wP = entity.c("worldposition");
			var result = checkCollision(_e, wP.x, wP.y, entity);
			if(result) {
				var rwM = result.c("worldmoves");
				if(rwM.destX != 0 || rwM.destY != 0) {
					rwM.state = "sliding";
				}
			}
		} else if (entity.c("worldsuperpusher")) {
			var wP = entity.c("worldposition");
			var wF = entity.c("worldfaces");
			var facingXY = wF.facingTile();
			var result = checkCollision(_e, wP.x, wP.y, entity);
			if(result) {
				var rwM = result.c("worldmoves");
				if(rwM.state == "standing") {
					rwM.state = "superpushed";
					rwM.destX = facingXY.x;
					rwM.destY = facingXY.y;
				}
			}
		} else if (entity.c("worldstopper")) {
			var wP = entity.c("worldposition");
			var result = checkCollision(_e, wP.x, wP.y, entity);
			if(result) {
				var rwM = result.c("worldmoves");
				if(rwM.state == "superpushed") {
					rwM.state = "walking"
				} else {

				}
				
			}
		} else if (entity.c("worldgrass")) {
			var wP = entity.c("worldposition");
			var result = checkCollision(_e, wP.x, wP.y, entity);
			if(result && result == player &&  result.c("worldmoves").state == "standing" && entity.c("worldgrass").last != player) {
				entity.c("worldgrass").last = player;
				if(Math.random() < 0.125) {
					var enemy = new ECS.Entity();
					enemy.addComponent(new ECS.Components.Trainer());
					enemy.c("trainer").synthmon.push(new Synthmon());
					BC.configure(player, enemy, "wild");
				}
			} else if(result == null) {
				entity.c("worldgrass").last = null;
			}
		} else if (entity.c("worldpressure")) {
			var wP = entity.c("worldposition");
			var result = checkCollision(_e, wP.x, wP.y, entity);
			if(result) {
				entity.c("worldpressure").isActivated = true;
			} else {
				entity.c("worldpressure").isActivated = false;
			}
		} else if (entity.c("worldwire")) {
			/*
			var wW = entity.c("worldwire");
			var wC = wW.connection;
			if(wC.c(wW.component)[wW.value]) {
				entity.c(wW.link)[wW.val] = wW.on;
			} else {
				entity.c(wW.link)[wW.val] = wW.off;
			}
			*/
		} else if (entity.c("worldlinearmonitor")) {
			var wP = entity.c("worldposition");
			var wL = entity.c("worldlinearmonitor");
			var wF = entity.c("worldfaces");
			var wM = entity.c("worldmoves");
			if(wL.enabled == true) {
				for(var i = 1; i <= wL.distance; i++) {
					var result = checkCollision(_e, wP.x + wF.facingTile().x * i, wP.y + wF.facingTile().y * i);
					if(result) {
						if(result == player) {
							wL.enabled = false;
							gameState = 1;
							wM.destX = wF.facingTile().x * (i-1);
							wM.destY = wF.facingTile().y * (i-1);
							wM.state = "walking";
							wM.curSpeed = 2000;
							wEvents.push(new WorldEvent(wM, "state", "standing", function() {
								//console.log("OLE!!!!");
							}))
						}
						i = wL.distance + 1;
					}
				}
			}
		}
	}
}

ECS.Systems.WorldControl = function WorldKeyboard(_e) {
	if(player.c("worldkeyboardcontrolled")) {
		var pP = player.c("worldposition");
		var pF = player.c("worldfaces");
		var pM = player.c("worldmoves");

		if(pM.state == "standing") {
			var isMove = false;
			if (keyboardKeys[87]) {
				pF.facing = "north";
				isMove = true;
			} else if(keyboardKeys[83]) {
				pF.facing = "south";
				isMove = true;
			} else if(keyboardKeys[65]) {
				pF.facing = "west";
				isMove = true;
			} else if (keyboardKeys[68]) {
				pF.facing = "east";
				isMove = true;
			}
			if(isMove) {
				pM.state = "walking";
				pM.curCycle = 0;
				pM.destX = pF.facingTile().x;
				pM.destY = pF.facingTile().y;
			}

			if(keyboardKeys[32]) {
				var result = checkCollision(_e, pP.x + pF.faces_xy().x, pP.y + pF.faces_xy().y);
				if(results) {
					//Interaction code.
				}
			}

		}
	}
}

ECS.Systems.WorldCollision = function WorldCollision(_e) {
	for(var entityID in _e) {
		var entity = _e[entityID];
		var wP = entity.c("worldposition");
		var wM = entity.c("worldmoves");
		if(wP && wM) {
			if(wM.state != "standing") {
				var result = checkCollision(_e, wP.x + wM.destX, wP.y + wM.destY, entity);
				if(result) {
					if(entity.c("worldcanpush") && result.c("worldpushable") && result.c("worldmoves")) {
						var rwM = result.c("worldmoves");
						if(wM.state != "standing" && rwM.state == "standing") {
							rwM.state = "walking";
							rwM.curSpeed = 250;
							rwM.destX = wM.destX;
							rwM.destY = wM.destY;
							rwM.curCycle = 0;
						}
					} else if(result.c("worldportal")) {
						var rwP = result.c("worldposition");
						var rwPo = result.c("worldportal");
						var rwO = result.c("worldoffset");
						var xOff = (rwPo.xOff || 0) + (rwO ? rwO.xOffset : 0); //Mmm ternary
						var yOff = (rwPo.yOff || 0) + (rwO ? rwO.yOffset : 0);
						if(rwP.x + xOff == wP.x + wM.destX && rwP.y + yOff == wP.y + wM.destY) {
							wP.x = rwPo.params.x;
							wP.y = rwPo.params.y;
							//console.log(rwPo.destination);
							if(wP.zone != 0 && rwPo.dest == 0) {
								worldEntities = [];
								worldEntities.push(player);	
							}
							for(var keyID in keyboardKeys) {
								keyboardKeys[keyID] = false;
							}
							
							wP.zone = rwPo.dest;
							if(wP.zone == 0) {
								world.init();
							} else {
								loadZone(rwPo.dest);
							}
						}
					} else if (result.c("worldfacingcollider")) {
						if(result.c("worldfaces").facing == entity.c("worldfaces").facing) {
							return;
						}
					}
					wM.state = "standing";
					wM.destX = 0;
					wM.destY = 0;
					wM.curCycle = 0;
				}
			}
		}
	}
}


ECS.Systems.WorldLogic = function WorldLogic(_e) {
	world.trackPos(player);
	for(var entityID in _e) {
		var entity = _e[entityID];
		var wP = entity.c("worldposition");
		var wM = entity.c("worldmoves");
		if(wP && wM) {
			if(wM.state != "standing") {
				wM.curCycle += dTime;
				if(wM.curCycle >= wM.curSpeed) {
					wM.curCycle = 0;
					wP.x += wM.destX;
					wP.y += wM.destY;
					if(!(wM.state == "sliding" || wM.state == "superpushed")) {
						wM.destX = 0;
						wM.destY = 0;
					}
					if(wM.state != "superpushed") {
						wM.state = "standing";
					}
				}
			} else {
				wM.destX = 0;
				wM.destY = 0;
			}
		}
	}
}
ECS.Systems.WorldRender = function WorldRender(_e) {
	var TILE_SIZE = 32;

	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = "rgba(0, 0, 0, 0.125)";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = "black";
	ctx.save();
	//Camera Control goes here.
	if(camera) {
		var cP = camera.target.c("worldposition");
		var cM = camera.target.c("worldmoves");
		var cShiftX = 0;
		var cShiftY = 0;
		if(cM) {
			cShiftX = cM.curCycle / cM.curSpeed * TILE_SIZE * cM.destX;
			cShiftY = cM.curCycle / cM.curSpeed * TILE_SIZE * cM.destY;
		} else {
			//Eventual for a specific camera movement component.
		}
		ctx.translate(canvas.width / 2 - TILE_SIZE / 2 - cP.x * TILE_SIZE - cShiftX, canvas.height / 2 - TILE_SIZE / 2 - cP.y * TILE_SIZE - cShiftY);

		if(cP.zone == 0) {
			for(var i = -1; i <= 1; i++) {
				for(var j = -1; j <= 1; j++) {
					var chunkInfo = ((cP.x >> 5) + i) + "," + ((cP.y >> 5) + j);
					if(world.images[chunkInfo]) {
						ctx.drawImage(world.images[chunkInfo], TILE_SIZE * 32 * (i + (cP.x >> 5)), TILE_SIZE * 32 * (j + (cP.y >> 5)));
					}
				}
			}
		} else {
			ctx.drawImage(world.images.interiors[cP.zone], 0, 0);
		}
	}

	


	_e.sort(function(_a, _b) {
		var aF = _a.c("worldfloor");
		var bF = _b.c("worldfloor");
		if(aF && bF) {
			return 0;
		} else if (aF) {
			return -1;
		} else if (bF) {
			return 1;
		} else {
			var aP = _a.c("worldposition");
			var bP = _b.c("worldposition");
			if(aP && bP) {
				if(aP.y < bP.y) {
					return -1;
				} else if (aP.y > bP.y) {
					return 1;
				} else {
					var aM = _a.c("worldmoves");
					var bM = _b.c("worldmoves");
					if(aM && bM) {
						if(aP.y + aM.destY < bP.y + bM.destY) {
							return -1;
						} else if (aP.y + aM.destY > bP.y + bM.destY) {
							return 1;
						} else {
							return 0;
						}
					} else {
						return 0;
					}
				}
			} else {
				return 0;
			}
		}
	});
	for(var entityID in _e) {
		var entity = _e[entityID];

		var wP = entity.c("worldposition");
		var wS = entity.c("worldsprite");
		if(wP && wS) {
			var wF = entity.c("worldfaces");
			var wM = entity.c("worldmoves");
			var wSh = entity.c("worldsheet");
			var wSi = entity.c("worldsize");
			var wA = entity.c("worldanimation");
			var wO = entity.c("worldoffset");

			
			var width, height;
			width = height = 1;
			if(wSi) {
				width *= wSi.width;
				height *= wSi.height;
			}

			var sourceX, sourceY, destX, destY;
			sourceY = sourceX = 0;

			destX = wP.x * TILE_SIZE;
			destY = wP.y * TILE_SIZE;
			if(wO) {
				destX += wO.xOffset * TILE_SIZE;
				destY += wO.yOffset * TILE_SIZE;
			}

			var shiftX, shiftY;
			shiftX = shiftY = 0;
			if(wM) {
				shiftX = wM.curCycle / wM.curSpeed * TILE_SIZE * wM.destX;
				shiftY = wM.curCycle / wM.curSpeed * TILE_SIZE * wM.destY;
				if(wM.state == "jumping") {
					shiftY -= Math.sin(wM.curCycle / wM.curSpeed * Math.PI) * 16;
				}
			}

			if(wF) {
				if(wA && wM) {
					if(wA.params[wM.state]) {
						sourceY = wA.params[wM.state][Math.floor(tTime / 120) % wA.params[wM.state].length] * TILE_SIZE;
					} else {
						console.warn("There is no WorldAnimation parameter for: " + wM.state);
					}
				}
				if(wM && (wM.state == "spinning" || wM.state == "superpushed")) {
					sourceX = Math.floor(tTime / 120) % 4 * TILE_SIZE;
				} else {
					switch(wF.facing) {
						case "west":
							sourceX = 3 * 32;
							break;
						case "north":
							sourceX = 1 * 32;
							break;
						case "east":
							sourceX = 2 * 32;
							break;
						case "south":
							sourceX = 0 * 32;
							break;
					}
				}
			} else if (wSh) {
				sourceX = wSh.num % wSh.width;
				sourceY = (wSh.num - sourceX) / wSh.width;
				sourceX *= TILE_SIZE;
				sourceY *= TILE_SIZE;
			}

			ctx.drawImage(wS.img,
				//Source Corner
				sourceX, sourceY,
				//Source Size
				TILE_SIZE * width, TILE_SIZE * height,
				//World Position
				destX + shiftX, destY + shiftY,
				//World Size
				TILE_SIZE * width, TILE_SIZE * height);
		}
	}

	ctx.restore();

	tctx.clearRect(0, 0, 800, 600);
	tctx.drawImage(canvas, 0, 0);

	ctx.clearRect(0, 0, 800, 600);
	if(IS_3D) {
		ctx.drawImage(canvas3D, 0, 0);
	}
}

var tCanvas = document.createElement("canvas");
tCanvas.width = 800;
tCanvas.height = 600;
var tctx = tCanvas.getContext('2d');
ECS.Systems.WorldRender3D = function WorldRender3D(_e) {
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	
	var perspectiveMatrix = makePerspective(Math.PI / 4, 800 / 600, 1, 128);
	var modelMatrix = getIdentity();
	var viewMatrix = getIdentity();

	setUniform("u_pMatrix", perspectiveMatrix);
	setUniform("u_mMatrix", modelMatrix);
	
	if(camera) {
		setUniform("u_sampler", assets.textures['grassGroundTexture'].texture, 0);
		var cP = camera.target.c("worldposition");
		var cM = camera.target.c("worldmoves");
		var cShiftX = 0;
		var cShiftY = 0;
		if(cM) {
			cShiftX = cM.curCycle / cM.curSpeed * cM.destX;
			cShiftY = cM.curCycle / cM.curSpeed * cM.destY;
		} else {
			//Eventual for a specific camera movement component.
		}
		//ctx.translate(canvas.width / 2 - TILE_SIZE / 2 - cP.x * TILE_SIZE - cShiftX, canvas.height / 2 - TILE_SIZE / 2 - cP.y * TILE_SIZE - cShiftY);
		viewMatrix = matrixMultiply(viewMatrix, makeTranslation(-1 * (cP.x + cShiftX), 0, -1 * (cP.y + cShiftY)));
		viewMatrix = matrixMultiply(viewMatrix, makeXRotation(Math.PI / 4));
		viewMatrix = matrixMultiply(viewMatrix, makeTranslation(0, 0, -15));
		setUniform("u_vMatrix", viewMatrix);
		if(terrain != null) {
		   	for(var chunkName in terrain) {
		   		modelMatrix = getIdentity();
		   		var xChunk = 0;
		   		var yChunk = 0;
		   		var strSplit = chunkName.split(",");
		   		if(strSplit.length == 2) {
					xChunk = strSplit[0];
					yChunk = strSplit[1];
				}
		   		modelMatrix = matrixMultiply(modelMatrix, makeTranslation(32 * xChunk - 0.5, 0, 32 * yChunk - 0.5));
		   		setUniform("u_mMatrix", modelMatrix);
		   		drawApp(terrain[chunkName]);
		   	}
	    } else {
	    }
	}

	
	
	for(var entityID in _e) {
		var entity = _e[entityID];
		var wP = entity.c("worldposition");
		var wS = entity.c("worldsprite");
		var wMdl = entity.c("worldmodel");
		if(wP && wS) {
			var wM = entity.c("worldmoves");
			var wF = entity.c("worldfaces");
			var wShiftX = wShiftY = 0;
			if(wM) {
				wShiftX = wM.curCycle / wM.curSpeed * wM.destX;
				wShiftY = wM.curCycle / wM.curSpeed * wM.destY;
			}
			modelMatrix = getIdentity();
			
			if(wF) {
				modelMatrix = matrixMultiply(modelMatrix, makeYRotation(wF.facingRot()));
			}

			modelMatrix = matrixMultiply(modelMatrix, makeTranslation(wP.x + wShiftX, 0, wP.y + wShiftY));
			setUniform("u_mMatrix", modelMatrix);
			if(wMdl) {
				setUniform("u_sampler", wMdl.texture, 0);
				drawApp(wMdl.model);
			} else {
				setUniform("u_sampler", assets.textures['tex1'].texture, 0);
				drawApp(assets.models.box);
			}
		}
	}
}



function checkCollision(_e, _x, _y, _ex) {
	for(var entityID in _e) {
		var entity = _e[entityID];
		if(entity != _ex) {
			var wP = entity.c("worldposition");
			var wC = entity.c("worldcollider");
			var wFC = entity.c("worldfacingcollider");
			var wLC = entity.c("worldlargecollision");
			var wO = entity.c("worldoffset");
			var wM = entity.c("worldmoves");
			if(wP && (wC || wFC || wLC)) {
				var xPos = wP.x;
				var yPos = wP.y;
				var width = height = 1;
				if(wO) {
					xPos += wO.xOffset;
					yPos += wO.yOffset;
				}
				if(wLC) {
					xPos += wLC.xOffset;
					yPos += wLC.yOffset;
					width = wLC.width;
					height = wLC.height;
				}
				if((xPos <= _x && xPos + width > _x && yPos <= _y && yPos + height > _y) ||
					(wM && (xPos + wM.destX <= _x && xPos + width + wM.destX > _x && yPos + wM.destY <= _y && yPos + height + wM.destY > _y))) {
					return entity;
				}
			}
		}
	}
	return null;
}