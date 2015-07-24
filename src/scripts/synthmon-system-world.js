ECS.Scenes.World = {
	"systems":[
		"WorldAI",
		"WorldControl",
		"WorldCollision",
		"WorldLogic",
		"WorldRender"
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

	loadZone(playerPos.zone);
}

function loadZone(_zone) {
	var zoneData;
	if(_zone == 0) {
		//Time to load some chunks.
		var pP = player.c("worldposition");
		zoneData = data.chunks[(pP.x >> 5) + "," + (pP.y >> 5)];
	} else {
		worldEntities = [];
		worldEntities.push(player);

		zoneData = data.interior[_zone];
	}

	for(var objName in zoneData.objects) {
		var object = zoneData.objects[objName];
		var entity = new ECS.Entity();
		for(var componentName in object) {
			var componentDetail = object[componentName];
			if(ECS.Components[componentName]) {
				var component = new ECS.Components[componentName];
				if(componentName == "WorldSprite") {
					component.img = assets.images[componentDetail.name];
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
		worldEntities.push(entity)
	}
}

ECS.Systems.WorldAI = function WorldAI(_e) {
	for(var entityID in _e) {
		var entity = _e[entityID];
		if(entity.c("worldconveyor")) {

		} else if (entity.c("worldslippery")) {

		} else if (entity.c("worldsuperpusher")) {

		} else if (entity.c("worldstopper")) {
			
		} else if (entity.c("worldgrass")) {
			
		} else if (entity.c("worldpressure")) {
			
		} else if (entity.c("worldwire")) {
			
		} else if (entity.c("worldlinearmonitor")) {
			
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
							loadZone(rwPo.dest);
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
	//Consider this: disregard this.
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
	}

	_e.sort(function(_a, _b) {
		var aF = _a.c("worldfloor");
		var bF = _b.c("worldfloor");
		if(aF && bF) {
			return 0;
		} else if (aF) {
			return -1;
		} else if (bF) {
			1;
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
}
ECS.Systems.WorldRender3D = function WorldRender3D(_e) {
	//An omen.
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

				if(xPos <= _x && xPos + width > _x && yPos <= _y && yPos + height > _y) {
					return entity;
				}
			}
		}
	}
	return null;
}