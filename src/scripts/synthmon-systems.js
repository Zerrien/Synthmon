function checkCollision(_e, _x, _y, _ex) {
	for(var entityID in _e) {
		var entity = _e[entityID];
		if(entity != _ex) {
			var wP = entity.c("worldposition");
			var wM = entity.c("worldmoves");
			if(wP && (entity.c("worldcollider") || entity.c("worldfacingcollider"))) {
				if(wM) {
					if((wP.x == _x && wP.y == _y && wM.curCycle < wM.curSpeed / 2) || (wP.x + wM.destX == _x && wP.y + wM.destY == _y)) {
						return entity;
					}
				} else {
					if(wP.x == _x && wP.y == _y) {
						return entity;
					}
				}
			} else if (wP && entity.c("worldlargecollision")) {
				var wLC = entity.c("worldlargecollision")
				var wO = entity.c("worldoffset");
				if(wO) {
					if(wP.x + wLC.xOffset + wO.xOffset <= _x && wP.x + wLC.xOffset + wLC.width + wO.xOffset > _x && wP.y + wLC.yOffset + wO.yOffset <= _y && wP.y + wLC.yOffset + wLC.height + wO.yOffset > _y) {
						return entity;
					}
				} else {
					if(wP.x + wLC.xOffset <= _x && wP.x + wLC.xOffset + wLC.width > _x && wP.y + wLC.yOffset <= _y && wP.y + wLC.yOffset + wLC.height > _y) {
						return entity;
					}
				}
			}
		}
	}
	return null;
}

ECS.Systems.UIKeyboard = function UIKeyboard(_e) {
	var curIndex;
	for(var entityID in _e) {
		var entity = _e[entityID];
		var uiZI = entity.c("uizindex");
		if(uiZI) {
			if(!curIndex) {
				curIndex = uiZI.zindex;
			} else {
				if(curIndex < uiZI.zindex) {
					curIndex = uiZI.zindex;
				}
			}
		}
	}
	for(var entityID in _e) {
		var entity = _e[entityID];
		var uiZI = entity.c("uizindex");
		if(!curIndex || (uiZI && uiZI.zindex == curIndex)) {
			if(entity.c("uilist")) {
				var uiL = entity.c("uilist");
				if(keyboardKeys[87]) {
					keyboardKeys[87] = false;
					uiL.up();
				} else if (keyboardKeys[83]) {
					keyboardKeys[83] = false;
					uiL.down();
				} else if (keyboardKeys[32]) {
				} else if (keyboardKeys[69]) {
					keyboardKeys[69] = false;
					uiL.options[uiL.curIndex].action();
				}
			} else if(entity.c("uidialoguebox")) {
				if(keyboardKeys[32]) {
					keyboardKeys[32] = false;
					ECS.entities.splice(ECS.entities.indexOf(entity), 1);
					gameState = 0;
				}
			}
		}
	}
}
ECS.Systems.WorldUI = function WorldUI(_e) {
	ctx.save();
	for(var entityID in _e) {
		var entity = _e[entityID];
		var uiP = entity.c("uiposition");
		if(uiP && entity.c("uilist")) {
			var uiL = entity.c("uilist");
			ctx.font = "20px Consolas";
			ctx.textBaseline = "top"
			ctx.fillStyle = "white"
			ctx.fillRect(uiP.x - 10, uiP.y - 10, 2000, uiL.options.length * 20 + 20);
			ctx.strokeStyle = "black";
			ctx.strokeRect(uiP.x - 10, uiP.y - 10, 2000, uiL.options.length * 20 + 20);
			for(var i = 0; i < uiL.options.length; i++) {
				if(uiL.curIndex == i) {
					ctx.fillStyle = "red";
				} else {
					ctx.fillStyle = "black";
				}
				ctx.fillText(uiL.options[i].name, uiP.x, uiP.y + i * 20);
			}
		} else if (uiP && entity.c("uidialoguebox")) {
			var uiDB = entity.c("uidialoguebox");
			ctx.font = "20px Consolas";
			ctx.textBaseline = "top"
			ctx.fillStyle = "white"
			ctx.fillRect(canvas.width / 8, canvas.height * 4 / 5, canvas.width * 6 / 8, canvas.height / 5 - 20);
			ctx.fillStyle = "black";
			ctx.fillText(uiDB.string, canvas.width / 8, canvas.height * 4 / 5);
		}
 	}
 	ctx.restore();
}

ECS.Systems.WorldKeyboard = function WorldKeyboard(_e) {
	//87, 83, 65, 68;
	/*
		Could be rewritten to -just- check for the player?
	*/
	for(var entityID in _e) {
		var entity = _e[entityID];
		if(entity.c("worldkeyboardcontrolled")) {
			/*
				Could be generalized per component in the future.
			*/
			var wP = entity.c("worldposition");
			var wF = entity.c("worldfaces");
			var wM = entity.c("worldmoves");
			if(wP && wM && wM.state == "standing") {
				var isMove = false;
				if(keyboardKeys[87]) {
					wF.facing = "north";
					wM.destY = -1;
					wM.destX = 0;
					isMove = true;
				} else if (keyboardKeys[83]) {
					wF.facing = "south";
					wM.destY = 1;
					wM.destX = 0;
					isMove = true;
				} else if (keyboardKeys[65]) {
					wF.facing = "west";
					wM.destX = -1;
					wM.destY = 0;
					isMove = true;
				} else if (keyboardKeys[68]) {
					wF.facing = "east";
					wM.destX = 1;
					wM.destY = 0;
					isMove = true;
				} else if (keyboardKeys[69]) {
					keyboardKeys[69] = false;
					gameState = 1;
					var menu = MenuController.worldmainmenu.make();
					ECS.entities.push(menu);
				} else if (keyboardKeys[75]) {
					keyboardKeys[75] = false;
					configureBattle();
				} else if (keyboardKeys[32]) {
					keyboardKeys[32] = false;
					var facingXY = wF.facingTile();
					var result = checkCollision(_e, wP.x + facingXY.x, wP.y + facingXY.y);
					if(result) {
						if(result.c("worldchatty")) {
							if(result.c("worldfaces")) {
								result.c("worldfaces").facing = wF.inverseFace();
							}
							gameState = 1;
							var box = new ECS.Entity();
							box.addComponent(new ECS.Components.UIPosition(0, 0));
							box.addComponent(new ECS.Components.UIDialogueBox("helllo!"));
							ECS.entities.push(box);
						}
					}
				}
				if(isMove) {
					wM.state = "walking";
					wM.curCycle = 0;
				}
			}
		}
	}
}



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
				rwM.state = "sliding";
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
		}
	}
}

ECS.Systems.WorldCollision = function WorldCollision(_e) {
	for(var entityID in _e) {
		var entity = _e[entityID];
		var wP = entity.c("worldposition");
		var wM = entity.c("worldmoves");
		if(wP && wM) {
			if(wP.state != "standing") {
				var result = checkCollision(_e, wP.x + wM.destX, wP.y + wM.destY, entity);
				if(result) {
					if(result.c("worldpushable") && result.c("worldmoves") && entity.c("worldcanpush")) {
						var rwM = result.c("worldmoves");
						if(rwM.state == "standing") {
							rwM.state = "walking";
							rwM.curSpeed = 250;
							rwM.destX = wM.destX;
							rwM.destY = wM.destY;
							rwM.curCycle = 0;
						}
					} else if (result.c("worldportal")) {
						var rwP = result.c("worldposition");
						var rwPo = result.c("worldportal");
						var rwO = result.c("worldoffset");
						var xOff = (rwPo.xOff || 0) + (rwO ? rwO.xOffset : 0); //Mmm ternary
						var yOff = (rwPo.yOff || 0) + (rwO ? rwO.yOffset : 0);
						if(rwP.x + xOff == wP.x + wM.destX && rwP.y + yOff == wP.y + wM.destY) {
							ECS.entities = [];
							ECS.entities.push(player);

							for(var keyID in keyboardKeys) {
								keyboardKeys[keyID] = false;
							}

							wP.x = rwPo.params.x;
							wP.y = rwPo.params.y;
							wP.zone = rwPo.destination;

							loadZone(rwPo.destination);
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
					} else {
					}
					
				}
			}
		}
	}
}

var worldScale = 1;

ECS.Systems.WorldRender = function WorldRender(_e) {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = "rgba(0, 0, 0, 0.125)";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = "black";
	ctx.save();
	if(player) {
		var pPos = player.c("worldposition");
		var pShift = player.c("worldmoves");
		var pShiftX = pShift.curCycle / pShift.curSpeed * 32 * pShift.destX;
		var pShiftY = pShift.curCycle / pShift.curSpeed * 32 * pShift.destY;
		ctx.scale(worldScale, worldScale);
		ctx.translate(canvas.width / 2 / worldScale - pPos.x * 32 - pShiftX - 16, canvas.height / 2 / worldScale - pPos.y * 32 - pShiftY - 16);
		if(pPos.zone == 0) {
			var pChunkX = pPos.x >> 5;
			var pChunkY = pPos.y >> 5;
			for(var i = -1; i <= 1; i++) {
				for(var j = -1; j <= 1; j++) {
					if(world.images[(pChunkX+i)+","+(pChunkY+j)]) {
						ctx.drawImage(world.images[(pChunkX+i)+","+(pChunkY+j)], (i + pChunkX) * 1024, (j + pChunkY) * 1024);
					}
					
				}
			}
		} else {
			ctx.drawImage(world.images.interiors["houseA"], 0, 0);
		}
	}


	var anArray = [];
	for(var entityID in _e) {
		var entity = _e[entityID];
		var wP = entity.c("worldposition");
		if(wP) {
			anArray.push(entity);
		}
	}

	anArray.sort(function(_a, _b) {
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
			if(aP.y < bP.y) {
				return -1;
			} else if (aP.y > bP.y ) {
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

		}
	});


	for(var entityID in anArray) {
		var entity = anArray[entityID];
		var wP = entity.c("worldposition");
		var wS = entity.c("worldsprite");

		if(wP && wS) {
			var wF = entity.c("worldfaces");
			var wM = entity.c("worldmoves");
			var wSh = entity.c("worldsheet");
			var wSi = entity.c("worldsize");
			var wA = entity.c("worldanimation");
			var wO = entity.c("worldoffset");

			var TILE_SIZE = 32;
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

		if(wP && IS_DEBUG) {
			ctx.strokeStyle = "rgba(255, 0, 0, 0.5)";
			ctx.beginPath();
			ctx.arc(wP.x * 32 + 16, wP.y * 32 + 16, 16, 0, Math.PI * 2);
			ctx.stroke();

			ctx.strokeStyle = "rgba(255, 0, 0, 0.75)";
			if(entity.c("worldcollider")) {
				ctx.strokeRect(wP.x * 32 + 4, wP.y * 32 + 4, 32 - 8, 32 - 8);
			} else if (entity.c("worldlargecollision")) {
				var wLC = entity.c("worldlargecollision");
				var wO = entity.c("worldoffset");
				if(wO) {
					ctx.strokeRect((wP.x + wLC.xOffset + wO.xOffset) * 32 + 4, (wP.y + wLC.yOffset + wO.yOffset) * 32 + 4, 32 * wLC.width - 8, 32 * wLC.height - 8);
				} else {
					ctx.strokeRect((wP.x + wLC.xOffset) * 32 + 4, (wP.y + wLC.yOffset) * 32 + 4, 32 * wLC.width - 8, 32 * wLC.height - 8);
				}
			}
		}
	}

	ctx.restore();
}

var BattleController = {
	"protagonist":null,
	"antagonist":null,
	"proCur":null,
	"antCur":null,

	"state":null,

	"action":null,
	"events":[],
	"connections":{
		"proMonSprite":null,
		"antMonSprite":null
	},
	"getPro":function() {
		return this.protagonist.c("trainer").synthmon[BattleController.proCur];
	},
	"getAnt":function() {
		return this.antagonist.c("trainer").synthmon[BattleController.proCur];;
	}
}

function configureBattle() {
	BattleController.protagonist = player;

	var enemy = new ECS.Entity();
	enemy.addComponent(new ECS.Components.Trainer());
	enemy.c('trainer').synthmon.push(new Synthmon());
	enemy.c('trainer').synthmon.push(new Synthmon());
	enemy.c('trainer').synthmon.push(new Synthmon());
	enemy.c('trainer').synthmon.push(new Synthmon());

	BattleController.antagonist = enemy;

	BattleController.proCur = 0;
	BattleController.antCur = 0;

	BattleController.state = 0;

	//Events.

	var proMonsterSprite = new ECS.Entity();
	proMonsterSprite.addComponent(new ECS.Components.UIPosition(0, 0));
	proMonsterSprite.addComponent(new ECS.Components.BattleSprite(images.images.piggen_back));
	ECS.entities2.push(proMonsterSprite)

	var antMonsterSprite = new ECS.Entity();
	antMonsterSprite.addComponent(new ECS.Components.UIPosition(128, 0));
	antMonsterSprite.addComponent(new ECS.Components.BattleSprite(images.images.piggen_front));
	ECS.entities2.push(antMonsterSprite)

	BattleController.connections.proMonSprite = proMonsterSprite;
	BattleController.connections.antMonSprite = antMonsterSprite;


	var battleMenu = MenuController.combatMenu.make();
	ECS.entities2.push(battleMenu);

	gameState = 2;
}


ECS.Systems.BattleControl = function BattleControl(_e) {
	var curIndex;
	for(var entityID in _e) {
		var entity = _e[entityID];
		var uiZI = entity.c("uizindex");
		if(uiZI) {
			if(!curIndex) {
				curIndex = uiZI.zindex;
			} else {
				if(curIndex < uiZI.zindex) {
					curIndex = uiZI.zindex;
				}
			}
		}
	}
	for(var entityID in _e) {
		var entity = _e[entityID];
		var uiZI = entity.c("uizindex");
		if(!curIndex || (uiZI && uiZI.zindex == curIndex)) {
			if(entity.c("uilist")) {
				var uiL = entity.c("uilist");
				if(keyboardKeys[87]) {
					keyboardKeys[87] = false;
					uiL.up();
				} else if (keyboardKeys[83]) {
					keyboardKeys[83] = false;
					uiL.down();
				} else if (keyboardKeys[32]) {
				} else if (keyboardKeys[69]) {
					keyboardKeys[69] = false;
					uiL.options[uiL.curIndex].action();
				}
			}
		}
	}
}
ECS.Systems.BattleLogic = function BattleLogic(_e) {
	if(BattleController.action != null) {
		if(BattleController.action.type == "attack") {
			//Create a battle event.
			BattleController.events.push(new BattleEvent(0, 1000));
			BattleController.action = null;
		}
	}


	/*
		Events
	*/
	if(BattleController.events.length >= 1) {
		BattleController.events[0].curTime += dTime;
		if(BattleController.events[0].endTime <= BattleController.events[0].curTime) {
			BattleController.events.splice(0, 1);
		}
	}
}


function BattleEvent(_s, _e, _sA, _eA) {
	this.startTime = _s;
	this.endTime = _e;
	this.curTime = -1;
	this.startAction = _sA || function() {};
	this.endAction = _eA || function() {};
	this.queue;
}

ECS.Systems.BattleRender = function BattleRender(_e) {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = "rgba(0, 0, 0, 0.125)";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = "black";
	ctx.save();

	for(var entityID in _e) {
		var entity = _e[entityID];
		var uiP = entity.c("uiposition");
		if(uiP) {
			if(entity.c("battlesprite")) {
				ctx.drawImage(entity.c("battlesprite").img, uiP.x, uiP.y);
			}
		}
	}

	var proSynth = BattleController.getPro();
	var antSynth = BattleController.getAnt();

	ctx.fillStyle = "red";
	ctx.fillRect(0, 128, 128, 16);
	ctx.fillRect(128, 0, 128, 16);
	ctx.fillStyle = "green";
	ctx.fillRect(0, 128, 128 * proSynth.curHP / proSynth.maxHP, 16);
	ctx.fillRect(128, 0, 128 * antSynth.curHP / antSynth.maxHP, 16);

	ctx.restore();
}
ECS.Systems.BattleUI = function BattleUI(_e) {

}

/*
ECS.Systems.KeyboardControl = function KeyboardControl(_e) {
	//87, 83, 65, 68;
	for(var entityID in _e) {
		var entity = _e[entityID];
		var wM = entity.c("worldmoves");
		var wP = entity.c("worldposition");
		if(entity.c("worldkeyboardcontrolled") && wP && wM && wM.state == "standing") {
			var wF = entity.c("worldfaces");
			var canMove = false;
			if(keyboardKeys[87]) {
				wF.facing = "up";
				if(wP.y > 0 && !checkCollision(_e, wP.x, wP.y - 1)) {
					wM.destY = -1;
					canMove = true;
				}
			} else if(keyboardKeys[83]) {
				wF.facing = "down";
				if(wP.y < 19 && !checkCollision(_e, wP.x, wP.y + 1)) {
					wM.destY = 1;
					canMove = true;
				}
			} else if (keyboardKeys[65]) {
				wF.facing = "left";
				if(wP.x > 0 && !checkCollision(_e, wP.x - 1, wP.y)) {
					wM.destX = -1;
					canMove = true;
				}
			} else if (keyboardKeys[68]) { 
				wF.facing = "right";
				if(wP.x < 19 && !checkCollision(_e, wP.x + 1, wP.y)) {
					wM.destX = 1;
					canMove = true;
				}
			} else if (keyboardKeys[32]) {
				keyboardKeys[32] = false;
				var fEntity;
				switch(wF.facing) {
					case "left":
						fEntity = checkCollision(_e, wP.x - 1, wP.y);
						break;
					case "right":
						fEntity = checkCollision(_e, wP.x + 1, wP.y);
						break;
					case "up":
						fEntity = checkCollision(_e, wP.x, wP.y - 1);
						break;
					case "down":
						fEntity = checkCollision(_e, wP.x, wP.y + 1);
						break;
				}
				if(fEntity) {
					if(fEntity.c("worldchatty")) {
						gameState = 1;
						interact = fEntity;
						var textBox = new ECS.Entity();
						textBox.addComponent(new ECS.Components.UIPosition(canvas.width / 2, 300));
						textBox.addComponent(new ECS.Components.UIText(fEntity.c("worldchatty").string, 100));
						if(fEntity.c("action")) {
							textBox.addComponent(fEntity.c("action"));
						}
						if(fEntity.c("worldfaces")) {
							fEntity.c("worldfaces").facing = player.c("worldfaces").inverseFace();
						}
						ECS.entities.push(textBox);
					}
					//
					//var wI = fEntity.c("worldinteractable");
					//if(wI) {
					//	wI.act();
					//}
					
				}
			} else if (keyboardKeys[69]) {
				keyboardKeys[69] = false;
				gameState = 1;

				var entity = new ECS.Entity();
				entity.addComponent(new ECS.Components.UIPosition(100, 100));
				entity.addComponent(new ECS.Components.MenuOptions([
					{
						"name":"Inventory",
						"action":function() {
							var inventoryMenu = new ECS.Entity();
							var items = new ECS.Components.MenuOptions([]);
							for(var i = 0; i < player.c("inventory").items.length; i++) {
								items.list.push({
									"name":player.c("inventory").items[i].name,
									"action":function() {

									},
									"index":i
								})
							}
							items.list.push({
								"name":"Back",
								"action":function() {
									ECS.entities.splice(ECS.entities.indexOf(inventoryMenu), 1);
									inventoryMenu = null;
								}
							});
							items.zDepth = 1;
							inventoryMenu.addComponent(items);
							inventoryMenu.addComponent(new ECS.Components.UIPosition(250, 125));
							ECS.entities.push(inventoryMenu);


						}
					},
					{
						"name":"Synthmon",
						"action":function() {
							
						}
					},
					{
						"name":"Information",
						"action":function() {
							
						}
					},
					{
						"name":"Leave Menu",
						"action":function() {
							ECS.entities.splice(ECS.entities.indexOf(entity), 1);
							entity = null;
							clearUI();
							gameState = 0;
						}
					}
				]));
				ECS.entities.push(entity);

				
				//keyboardKeys[69] = false;
				//gameState = 1;
//
				//var entity = new ECS.Entity();
				//entity.addComponent(new ECS.Components.UIPosition(100, 100));
				//entity.addComponent(new ECS.Components.MenuOptions(["Inventory", "Synthmon", "Information", "Leave Menu"]));
				//ECS.entities.push(entity);
				

			}
			if(canMove) {
				wM.curCycle = 0;
				wM.state = "walking";
			}
		}
	}
}

function checkCollision(_e, _x, _y) {
	//Collision currently: BAD
	for(var entityID in _e) {
		var entity = _e[entityID];
		var wP = entity.c("worldposition");
		var wM = entity.c("worldmoves");
		if(entity.c("worldcollision") && wP) {
			if(wM) {
				if((wP.x == _x && wP.y == _y && wM.curCycle < wM.speed / 2) || (wP.x + wM.destX == _x && wP.y + wM.destY == _y)) {
					return entity;
				}
			} else {
				if(wP.x == _x && wP.y == _y) {
					return entity;
				}
			}
		} else if (entity.c("worldlargecollision")&& wP) {
			var wLC = entity.c("worldlargecollision")
			var colWidth = wLC.width;
			var colHeight = wLC.height;
			var xOff = wLC.xOffset;
			var yOff = wLC.yOffset;
			//Assume no wM
			if(wP.x + xOff <= _x && wP.x + xOff + colWidth > _x && wP.y + yOff <= _y && wP.y + yOff +  colHeight > _y) {
				return entity;
			}
		}
	}
	return false;
}



var moveai_array = ["left", "right", "down", "up"];
ECS.Systems.AI = function SystemAI(_e) {
	//AI System
	var hasTarget = false;
	for(var entityID in _e) {
		var entity = _e[entityID];
		var wM = entity.c("worldmoves");
		var wP = entity.c("worldposition");
		if(wM && wP && entity.c("movementai")) {
			if(wM.state == "standing" && Math.random() < 0.01) {
				var rand = Math.floor(Math.random() * 4);
				var canMove = false;
				if(entity.c("worldfaces")) {
					entity.c("worldfaces").facing = moveai_array[rand];
				}
				if(rand == 0) {
					if(wP.x > 0 && !checkCollision(_e, wP.x - 1, wP.y)) {
						wM.destX = -1;
						canMove = true;
					}
				} else if (rand == 1) {
					if(wP.x < 19 && !checkCollision(_e, wP.x + 1, wP.y)) {
						wM.destX = 1;
						canMove = true;
					}
				} else if (rand == 2) {
					if(wP.y < 19 && !checkCollision(_e, wP.x, wP.y + 1)) {
						wM.destY = 1;
						canMove = true;
					}
				} else {
					if(wP.y > 0 && !checkCollision(_e, wP.x, wP.y - 1)) {
						wM.destY = -1;
						canMove = true;
					}
				}
				if(canMove) {
					wM.curCycle = 0;
					wM.state = "walking";
				}
			}
		}
		//Redo directional AI
	}
}

ECS.Systems.Logic = function SystemLogic(_e) {
	//Logic System
	for(var entityID in _e) {
		var entity = _e[entityID];
		var wM = entity.c("worldmoves");
		if(wM && entity.c("worldposition")) {
			if(wM.state == "walking") {
				wM.curCycle += dTime;
				if(wM.curCycle >= wM.speed) {
					wM.curCycle = 0;
					wM.state = "standing";
					entity.c("worldposition").x += wM.destX;
					entity.c("worldposition").y += wM.destY;
					wM.destX = 0;
					wM.destY = 0;
				}
			}
			var wP = entity.c("worldposition")
			var pID = entity.c("playerid");
			var wF = entity.c("worldfaces");
			if(pID && wF) {
				
				//webSocket.send(JSON.stringify({
				//	"playerid":pID.id,
				//	"x":wP.x,
				//	"y":wP.y,
				//	"state":wM.state,
				//	"curCycle":wM.curCycle,
				//	"destX":wM.destX,
				//	"destY":wM.destY,
				//	"facing":wF.facing
				//}));
				
			}
		}
	}
}



ECS.Systems.Render = function SystemRender(_e) {
	//Render system
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = "rgba(0, 0, 0, 0.125)";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = "black";
	ctx.save();

	var pPos = player.c("worldposition");
	var pShift = player.c("worldmoves");
	var pShiftX = pShift.curCycle / pShift.speed * 32 * pShift.destX;
	var pShiftY = pShift.curCycle / pShift.speed * 32 * pShift.destY;

	ctx.translate(canvas.width / 2 - pPos.x * 32 - pShiftX, canvas.height / 2 - pPos.y * 32 - pShiftY);
	for(var entityID in _e) {
		var entity = _e[entityID];
		//Draw a world sprite
		if(entity.c("worldsprite") && entity.c("worldposition")) {
			var TILE_SIZE = 32;
			var width = 1;
			var height = 1;
			if(entity.c("worldsize")) {
				width = entity.c("worldsize").width;
				height = entity.c("worldsize").height;
			}
			var sourceX, sourceY, destX, destY;
			sourceY = sourceX = 0;
			destX = entity.c("worldposition").x * 32;
			destY = entity.c("worldposition").y * 32;

			var wM = entity.c("worldmoves");
			var shiftX, shiftY;
			shiftX = shiftY = 0;
			if(entity.c("worldfaces")) {
				switch(entity.c("worldfaces").facing) {
					case "left":
						sourceX = 3 * 32;
						break;
					case "up":
						sourceX = 1 * 32;
						break;
					case "right":
						sourceX = 2 * 32;
						break;
					case "down":
						sourceX = 0 * 32;
						break;
				}
			} else if (entity.c("worldsheet")) {
				sourceX = entity.c("worldsheet").num % 4;
				sourceY = (entity.c("worldsheet").num - sourceX) / 4;
				sourceX *= 32;
				sourceY *= 32;
			}
			if(wM) {
				shiftX = wM.curCycle / wM.speed * 32 * wM.destX;
				shiftY = wM.curCycle / wM.speed * 32 * wM.destY;
			}
			ctx.drawImage(entity.c("worldsprite").img, sourceX, sourceY, 32 * width, 32 * height, destX + shiftX, destY + shiftY, 32 * width, 32 * height);
		}
	}
	ctx.restore();
	ctx.fillText(dTime, 10, 10);
	
	
	//if(is_debug) {
	//	var sum2 = 0;
	//	for(var i = 0; i < frameArray.length; i++) {
	//		sum2 += frameArray[i];
	//	}
	//	var avg2 = sum2 / frameArray.length;
	//
	//	ctx.fillText(avg2.toFixed(2), 10, 20);
	//	ctx.fillText((1000 / avg2).toFixed(2) + " Avg. FPS", 10, 30)
	//	
	//	time = (new Date()).getTime() - time;
	//	timeArrays[3].push(time);
	//	var sum = 0;
	//	for(var i = 0; i < timeArrays[3].length; i++) {
	//		sum += timeArrays[3][i];
	//	}
	//	var avg = sum / timeArrays[3].length;
	//	document.getElementById("system4").innerHTML = avg.toFixed(2) + " "  + time.toFixed(2);
	//}
	
}

ECS.Systems.UIControl = function UIControl(_e) {
	//87, 83, 65, 68;
	var highestDepth = -1;
	var bC;
	for(var entityID in _e) {
		var entity = _e[entityID];
		var mO = entity.c("menuoptions");
		if(mO && mO.zDepth > highestDepth) {
			highestDepth = mO.zDepth;
		}

		var bCC = entity.c("battlecontroller");
		if(bCC) {
			bC = bCC;
		}
	}
	for(var entityID in _e) {
		//Debug option
		var entity = _e[entityID];		
		var mO = entity.c("menuoptions");
		var canInput = true;
		if(bC && bC.state != 0) {
			canInput = false;
		}
		if(mO && highestDepth == mO.zDepth && canInput) {
			if(keyboardKeys[83]) {
				keyboardKeys[83] = false;
				mO.advance();
			} else if (keyboardKeys[87]) {
				keyboardKeys[87] = false;
				mO.reverse();
			} else if (keyboardKeys[69] && mO.escapable) {
				keyboardKeys[69] = false;
				clearUI();
				gameState = 0;
			} else if (keyboardKeys[32] || keyboardKeys[68]) {
				keyboardKeys[32] = keyboardKeys[68] = false;
				if(mO.list[mO.curIndex].action) {
					mO.list[mO.curIndex].action();
				}
			} else if (keyboardKeys[65] || keyboardKeys[27]) {
				keyboardKeys[65] = keyboardKeys[27] = false;
				if(mO.zDepth != 0) {
					_e.splice(entityID, 1);
					entity = null;
				}
			}
		} else {
			//No mO, so everything else takes precedence.
			var uT = entity.c("uitext");
			if(uT) {
				if(keyboardKeys[32]) {
					keyboardKeys[32] = false;
					if(Math.floor(uT.curTime / uT.speed) < uT.text.length) {
						uT.curTime = uT.text.length * uT.speed;
					} else {
						if(entity.c("action")) {
							entity.c("action").act();
						} else {
							interact = null;
							gameState = 0;
							_e.splice(entityID, 1);
						}
						
						
						//clearUI();
						//if(interact.c("trainer")) {
						//	setUpBattle(player, interact);
						//	gameState = 2;
						//} else {
						//	interact = null;
						//	gameState = 0;
						//}
						
					}
				}
			}
		}
		
		////Old implementation, may return.
		//if(entity.c("keyboardevent")) {
		//	if(keyboardKeys[entity.c("keyboardevent").key]) {
		//		keyboardKeys[entity.c("keyboardevent").key] = false;
		//		entity.c("keyboardevent").act();
		//	}
		//}
		//
	}
}

function clearUI() {
	for(var entityID in ECS.entities) {
		var entity = ECS.entities[entityID];
		if(entity.c("uiposition")) {
			ECS.entities.splice(entityID, 1);
		}
	}
}

ECS.Systems.DrawUI = function DrawUI(_e) {
	for(var entityID in _e) {
		var entity = _e[entityID];
		var uP = entity.c("uiposition");
		if(uP) {
			if(entity.c("uitext")) {
				entity.c("uitext").curTime += dTime;
				var theString = entity.c("uitext").text.slice(0, Math.floor(entity.c("uitext").curTime / entity.c("uitext").speed));
				ctx.fillStyle = "white";
				ctx.fillRect(25, canvas.height - 125, canvas.width - 50, 100);
				ctx.fillStyle = "black";
				ctx.save();
				ctx.textBaseline = "top";
				ctx.font="30px Arial";
				ctx.fillText(theString, 25, canvas.height - 125);
				ctx.restore();
			} else if (entity.c("menuoptions")) {
				var mO = entity.c("menuoptions")
				for(var i = 0; i < mO.list.length; i++) {
					ctx.save();
					if(mO.curIndex == i) {
						ctx.font = "bold 20px Arial";
						ctx.fillText(">", uP.x - 20, uP.y + 20 * i);
					} else {
						ctx.font = "20px Arial";
					}
					ctx.fillText(mO.list[i].name, uP.x, uP.y + 20 * i);
					ctx.restore();
				}
			} else if (entity.c("healthbox")) {
				ctx.fillStyle = "red";
				ctx.fillRect(entity.c("uiposition").x, entity.c("uiposition").y, 96, 25)
				
				ctx.fillStyle = "green";
				//haha that code hahAHA HAH H AHAHHHSHDASDHfls;agjkdfsdfag
				ctx.fillRect(entity.c("uiposition").x, entity.c("uiposition").y, 96 * entity.c("healthbox").ref[entity.c("healthbox").index].curHP / entity.c("healthbox").ref[entity.c("healthbox").index].maxHP, 25)

				ctx.fillStyle = "black";
				ctx.strokeRect(entity.c("uiposition").x, entity.c("uiposition").y, 96, 25)
				
			} else if (entity.c("monstersprite")) {
				var x = uP.x;
				var y = uP.y;
				if(entity.c("battlespriteshake")) {
					x += Math.sin(entity.c("battlespriteshake").curTime / 100) * entity.c("battlespriteshake").maxX;


					entity.c("battlespriteshake").curTime += dTime;
				}
				ctx.drawImage(deox, x, y);
			}
		}
	} 
}

ECS.Components.BattleController = function BattleController(_pro, _ant) {
	this.protagonist = _pro;
	this.proCur = _pro.c("trainer").monsters[Math.floor(_pro.c("trainer").monsters.length * Math.random())];
	this.antagonist = _ant;
	this.antCur = _ant.c("trainer").monsters[Math.floor(_ant.c("trainer").monsters.length * Math.random())];
	this.state = 0;
	this.action = {};
	this.events = [];
	this.connections = {
		"playerMonSprite":null,
		"enemyMonSprite":null
	};
}
ECS.Components.BattleController.prototype.name = "battlecontroller";
*/
