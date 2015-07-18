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








/*
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
		if(BattleController.events.length == 0) {
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
					} else if (keyboardKeys[32] || keyboardKeys[69]) {
						keyboardKeys[32] = false;
						keyboardKeys[69] = false;
						uiL.options[uiL.curIndex].action();
					}
				}
			}
		} else {
			var uiDB = entity.c("uidialoguebox");
			if(uiDB) {
				if(keyboardKeys[32] || keyboardKeys[69]) {
					keyboardKeys[32] = false;
					keyboardKeys[69] = false;
					var isDone = uiDB.progress();
					if(isDone && BattleController.events[0].queue) {
						BattleController.events[0].queue = false;
						BattleController.events[0].skip = true;
					} else if (isDone && !BattleController.events[0].queue) {
						
					}
				}
			}
		}
	}
}
*/







/*
ECS.Systems.BattleLogic = function BattleLogic(_e) {
	//Actions
	if(BattleController.action != null) {
		enemyAction();
		evaluateTurn();
	}


	//Events
	var curEvent = BC.firstEvent();
	if(curEvent) {
		if(curEvent.curTime == -1) {
			curEvent.add();
			curEvent.startAction();
		}
		curEvent.curTime += dTime;
		if(curEvent.v) {
			if(curEvent.minimum != undefined && curEvent.maximum != undefined) {
				curEvent.v[curEvent.vL] = Math.max(Math.min(curEvent.origin + curEvent.val * (Math.min(curEvent.curTime, curEvent.dur) / curEvent.dur), maximum), curEvent.minimum);
			} else if (curEvent.minimum != undefined) {
				curEvent.v[curEvent.vL] = Math.max(curEvent.origin + curEvent.val * (Math.min(curEvent.curTime, curEvent.dur) / curEvent.dur), curEvent.minimum);
			} else if (curEvent.maximum != undefined) {
				curEvent.v[curEvent.vL] = Math.min(curEvent.origin + curEvent.val * (Math.min(curEvent.curTime, curEvent.dur) / curEvent.dur), curEvent.maximum);
			} else {
				curEvent.v[curEvent.vL] = curEvent.origin + curEvent.val * (Math.min(curEvent.curTime, curEvent.dur) / curEvent.dur);
			}	
		}
		if((curEvent.duration <= curEvent.curTime && !curEvent.queue) || curEvent.skip) {
			if(curEvent.v) {
				if(curEvent.reset) {
					curEvent.v[curEvent.vL] = curEvent.origin;
				} else {
					if(curEvent.minimum != undefined && curEvent.maximum != undefined) {
						curEvent.v[curEvent.vL] = Math.max(Math.min(curEvent.origin + curEvent.val, maximum), curEvent.minimum);
					} else if (curEvent.minimum != undefined) {
						curEvent.v[curEvent.vL] = Math.max(curEvent.origin + curEvent.val, curEvent.minimum);
					} else if (curEvent.maximum != undefined) {
						curEvent.v[curEvent.vL] = Math.min(curEvent.origin + curEvent.val, curEvent.maximum);
					} else {
						curEvent.v[curEvent.vL] = curEvent.origin + curEvent.val;
					}	
				}
			}
			curEvent.endAction();
			curEvent.remove();
			BC.events.splice(0, 1);
		}

	}
}
*/





/*
ECS.Systems.BattleRen2der = function Battle2Render(_e) {
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
				var bS = entity.c("battlesprite");
				var bSh = entity.c("battleshake");
				var bA = entity.c("battleanimated");
				if(bA) {
					bA.curTime += dTime;
					var curIndex = Math.floor(bA.curTime / bA.time);
					ctx.drawImage(bS.img,
						//Source Corner
						64 * (curIndex % 3), 64 *  ((curIndex - (curIndex % 3)) / 3),
						//Source Size
						64, 64,
						//World Position
						uiP.x, uiP.y,
						//World Size
						64, 64);
				} else {
					if(entity.c("battleshake")) {
						ctx.drawImage(entity.c("battlesprite").img, uiP.x + (Math.sin(tTime / 100)) * 32, uiP.y);
					} else {
						ctx.drawImage(entity.c("battlesprite").img, uiP.x, uiP.y);
					}
				}
				
			}
		}
	}

	var proSynth = BattleController.getProCurrent();
	var antSynth = BattleController.getAntCurrent();

	ctx.fillStyle = "red";
	ctx.fillRect(0, 128, 128, 16);
	if(BC.connections.antMonSprite) {
		ctx.fillRect(128, 0, 128, 16);
	}
	ctx.fillStyle = "green";
	ctx.fillRect(0, 128, 128 * proSynth.curHP / proSynth.maxHP, 16);
	if(BC.connections.antMonSprite) {
		ctx.fillRect(128, 0, 128 * antSynth.curHP / antSynth.maxHP, 16);
	}

	var proList = BC.getProtagonist().synthmon;
	var antList = BC.getAntagonist().synthmon;

	for(var i = 0; i < 6; i++) {
		if(proList[i]) {
			if(proList[i].curHP <= 0) {
				ctx.drawImage(images.images.dead_drive, 128 / 2 - 16 * 3 + i * 16, 0);
			} else {
				ctx.drawImage(images.images.alive_drive, 128 / 2 - 16 * 3 + i * 16, 0);
			}
			
		} else {
			ctx.drawImage(images.images.empty_drive, 128 / 2 - 16 * 3 + i * 16, 0);
		}

		if(!BC.type) {
			if(antList[i]) {
				if(antList[i].curHP <= 0) {
					ctx.drawImage(images.images.dead_drive, 128 / 2 - 16 * 3 + 128 + i * 16, 128);
				} else {
					ctx.drawImage(images.images.alive_drive, 128 / 2 - 16 * 3 + 128 + i * 16, 128);
				}
			} else {
				ctx.drawImage(images.images.empty_drive, 128 / 2 - 16 * 3 + 128 + i * 16, 128);
			}
		}
	}
	ctx.fillStyle = "black";
	ctx.fillText(Math.floor(BC.getProCurrent().curHP) + " / " + BC.getProCurrent().maxHP, 0, 128 + 24);
	ctx.fillText("Level: " + BC.getProCurrent().level, 0, 128 + 32);

	if(BC.connections.antMonSprite) {
		ctx.textAlign = "right";
		ctx.fillText(Math.floor(BC.getAntCurrent().curHP) + " / " + BC.getAntCurrent().maxHP, 128 * 2, 128 + 24);
		ctx.fillText("Level: " + BC.getAntCurrent().level, 128 * 2, 128 + 32);
	}

	ctx.restore();
}
*/
ECS.Systems.BattleUI = function BattleUI(_e) {

}