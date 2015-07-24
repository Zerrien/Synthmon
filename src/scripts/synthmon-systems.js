/*
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
*/

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
				if(keyboardKeys[32] || keyboardKeys[69]) {
					keyboardKeys[32] = keyboardKeys[69] = false;
					var isDone = entity.c("uidialoguebox").progress();
					if(isDone && !uiZI) {
						ECS.entities.splice(ECS.entities.indexOf(entity), 1);
						gameState = 0;
						if(entity.c("uidialoguebox").onclose) {
							entity.c("uidialoguebox").onclose();
						}
					} else if (isDone) {
						ECS.entities.splice(ECS.entities.indexOf(entity), 1);
					}				
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
			uiDB.curTime += dTime;
			ctx.fillText(uiDB.string.substring(0, Math.floor(uiDB.curTime / uiDB.tick)), canvas.width / 8, canvas.height * 4 / 5);
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
						} else if (result.c("worldbattler")) {
							if(result.c("worldfaces")) {
								result.c("worldfaces").facing = wF.inverseFace();
							}
							gameState = 1;
							var box = new ECS.Entity();
							box.addComponent(new ECS.Components.UIPosition(0, 0));
							if(result.c("trainer").synthmon[0].curHP > 0) {
								var challenge = new ECS.Components.UIDialogueBox(result.c("worldbattler").saying);
								challenge.onclose = function() {
									BC.configure(player, result);
								}
								box.addComponent(challenge);
								ECS.entities.push(box);
							} else {
								var challenge = new ECS.Components.UIDialogueBox(result.c("worldbattler").defeatedSaying);
								box.addComponent(challenge);
								ECS.entities.push(box);
							}
						}
					}
				} else if (keyboardKeys[81]) {
					//keyboardKeys[81] = false;
					var entity = new ECS.Entity();
					entity.addComponent(new ECS.Components.WorldPosition(0, offsetk--));
					entity.addComponent(new ECS.Components.WorldSprite(images.images.boulder));
					entity.addComponent(new ECS.Components.WorldCollider());
					ECS.entities.push(entity);
					//console.log(Math.abs(offsetk));
					//console.log("??");
				}
				if(isMove) {
					wM.state = "walking";
					wM.curCycle = 0;
				}
			}
		}
	}
}
var offsetk = 0;


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
			var wW = entity.c("worldwire");
			var wC = wW.connection;
			if(wC.c(wW.component)[wW.value]) {
				entity.c(wW.link)[wW.val] = wW.on;
			} else {
				entity.c(wW.link)[wW.val] = wW.off;
			}
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

function WorldEvent(_monitor, _loc, _for, _action) {
	this.monitor = _monitor;
	this.loc = _loc;
	this.for = _for;
	this.action = _action;
	this.check = function() {
		if(this.monitor[this.loc] == this.for) {
			this.action();
		}
	}
}

var wEvents = [];

/*
function BattleEvent(_dur, _sA, _eA) {
	this.curTime = -1;
	this.duration = _dur;
	this.startAction = _sA || function() {};
	this.endAction = _eA || function() {};

	this.toAdd = [];
	this.toRemove = [];

	this.queue = false;
	this.isSkip = false;
	this.add = function() {
		for(var i = 0; i < this.toAdd.length; i++) {
			
			battleEntities.push(this.toAdd[i]);
		}
	}
	this.remove = function() {
		for(var i = 0; i < this.toRemove.length; i++) {
			battleEntities.splice(battleEntities.indexOf(this.toRemove[i]), 1);
		}
	}
	this.short = function(_e) {
		this.toAdd.push(_e);
		this.toRemove.push(_e);
	}
	this.setVariable = function(_var, _varLoc, _value, _duration, _reset) {
		this.v = _var;
		this.vL = _varLoc;
		this.val = _value;
		this.dur = _duration;
		this.reset = _reset;
		this.origin = this.v[this.vL];
	}
}
*/

ECS.Systems.WorldEvents = function WorldEvents(_e) {
	for(var i = 0; i < wEvents.length; i++) {
		wEvents[i].check();
	}
}

ECS.Systems.WorldCollision = function WorldCollision(_e) {
	var curTime = new Date().getTime();
	for(var entityID in _e) {
		var entity = _e[entityID];
		var wP = entity.c("worldposition");
		var wM = entity.c("worldmoves");
		if(wP && wM) {
			if(wP.state != "standing") {
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

							//console.log(rwPo.destination);


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
	world.trackPos(player)
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

var worldScale = 1;

ECS.Systems.WorldRender = function WorldRender(_e) {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = "rgba(0, 0, 0, 0.125)";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = "black";
	ctx.save();

	/*
		Replace with CameraController in the future.
	*/

	if(IS_DEBUG) {
		ctx.scale(0.5, 0.5);
		ctx.translate(canvas.width / 2, canvas.height / 2);
	}
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

			var amount = 3;
			if(IS_DEBUG) {
				amount = 5;
			}
			amount = (amount - 1) / 2;
			for(var i = -amount; i <= amount; i++) {
				for(var j = -amount; j <= amount; j++) {
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
