/*
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
*/
function checkCollision(_e, _x, _y, _ex) {
	for(var entityID in _e) {
		var entity = _e[entityID];
		if(entity != _ex) {
			var wP = entity.c("worldposition");
			var wM = entity.c("worldmoves");
			if(wP && entity.c("worldcollider")) {
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
				if(wP.x + wLC.xOffset <= _x && wP.x + wLC.xOffset + wLC.width > _x && wP.y + wLC.yOffset <= _y && wP.y + wLC.yOffset + wLC.height > _y) {
					return entity;
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
					ECS.entities.splice(ECS.entities.indexOf(entity));
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
					isMove = true;
				} else if (keyboardKeys[83]) {
					wF.facing = "south";
					wM.destY = 1;
					isMove = true;
				} else if (keyboardKeys[65]) {
					wF.facing = "west";
					wM.destX = -1;
					isMove = true;
				} else if (keyboardKeys[68]) {
					wF.facing = "east";
					wM.destX = 1;
					isMove = true;
				} else if (keyboardKeys[69]) {
					keyboardKeys[69] = false;
					gameState = 1;

					var menu = worldMenuController.worldmainmenu.make();
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
		if(entity.c("worldpusher")) {
			var wPu = entity.c("worldpusher");
			var wP = entity.c("worldposition");
			
			var result = checkCollision(_e, wP.x, wP.y);
			if(result) {
				var rwM = result.c("worldmoves");
				var rF = result.c("worldfaces");
				var rcP = result.c("worldcanpush");
				if(rwM.state == "standing") {
					if(wPu.pushTime >= rwM.curSpeed && result.c("worldkeyboardcontrolled")) {

					} else {
						switch(entity.c("worldfaces").facing) {
							case "north":
								if(rF) {
									rF.facing = "north";
								}
								if(rcP) {
									rcP.curStrength = rcP.strength;
								}
								rwM.state = "spinning";
								rwM.destX = 0;
								rwM.destY = -1;
								rwM.curCycle = 0;
								if(wPu.lastPush != result) {
									wPu.lastPush = result;
									wPu.pushTime = 0;
								} else {
									wPu.pushTime += dTime;
								}
								
								break;
							case "south":
								if(rF) {
									rF.facing = "south";
								}
								if(rcP) {
									rcP.curStrength = rcP.strength;
								}
								rwM.state = "spinning";
								rwM.destX = 0;
								rwM.destY = 1;
								rwM.curCycle = 0;
								if(wPu.lastPush != result) {
									wPu.lastPush = result;
									wPu.pushTime = 0;
								} else {
									wPu.pushTime += dTime;
								}
								break;
							case "east":
								if(rF) {
									rF.facing = "east";
								}
								rwM.state = "spinning";
								rwM.destX = 1;
								rwM.destY = 0;
								rwM.curCycle = 0;
								if(wPu.lastPush != result) {
									wPu.lastPush = result;
									wPu.pushTime = 0;
								} else {
									wPu.pushTime += dTime;
								}
								if(rcP) {
									rcP.curStrength = rcP.strength;
								}
								break;
							case "west":
								if(rF) {
									rF.facing = "west";
								}
								rwM.state = "spinning";
								rwM.destX = -1;
								rwM.destY = 0;
								rwM.curCycle = 0;
								if(wPu.lastPush != result) {
									wPu.lastPush = result;
									wPu.pushTime = 0;
								} else {
									wPu.pushTime += dTime;
								}
								if(rcP) {
									rcP.curStrength = rcP.strength;
								}
								break;
						}
					}
					
				}
			} else {

				wPu.lastPush = null;
				wPu.pushTime = 0;
			}
		}
	}
}

ECS.Systems.WorldCollision = function WorldCollision(_e) {
	for(var entityID in _e) {
		var entity = _e[entityID];
		var wP = entity.c("worldposition");
		var wM = entity.c("worldmoves");
		var wCP = entity.c("worldcanpush");
		if(wP && wM && wM.state != "standing") {
			var result = checkCollision(_e, wP.x + wM.destX, wP.y + wM.destY, entity);
			if(result) {
				var rwM = result.c("worldmoves");
				var rwP = result.c("worldportal");
				if(rwM) {
					if(result.c("worldpushable") && rwM.state == "standing" && wCP && wCP.curStrength >= 1) {
						rwM.state = "walking";
						rwM.curSpeed = 500;
						rwM.destX = wM.destX;
						rwM.destY = wM.destY;
						rwM.curCycle = 0;

						wM.state = "standing";
						wM.destX = 0;
						wM.destY = 0;
						wM.curCycle = 0;

						if(result.c("worldcanpush")) {
							result.c("worldcanpush").curStrength = wCP.curStrength - 1;
						}
					} else {
						wM.state = "standing";
						wM.destX = 0;
						wM.destY = 0;
						wM.curCycle = 0;
					}
				} else if (rwP && entity == player) {
					//console.log("Portal hit!");
					//ECS.entityStack.push(ECS.entities);
					if(rwP.xOff && rwP.yOff) {
						if(result.c("worldposition").x + rwP.xOff == wP.x + wM.destX && result.c("worldposition").y + rwP.yOff == wP.y + wM.destY) {
							ECS.entities = [];
							ECS.entities.push(player);

							for(var keyID in keyboardKeys) {
								keyboardKeys[keyID] = false;
							}

							wP.x = rwP.params.x;
							wP.y = rwP.params.y;
							wP.zone = rwP.destination;

							loadZone(rwP.destination);
						}


						wM.state = "standing";
						wM.destX = 0;
						wM.destY = 0;
						wM.curCycle = 0;
					} else {
						ECS.entities = [];
						ECS.entities.push(player);

						wM.state = "standing";
						wM.destX = 0;
						wM.destY = 0;
						wM.curCycle = 0;

						for(var keyID in keyboardKeys) {
							keyboardKeys[keyID] = false;
						}

						wP.x = rwP.params.x;
						wP.y = rwP.params.y;
						wP.zone = rwP.destination;

						loadZone(rwP.destination);
					}
				} else {
					wM.state = "standing";
					wM.destX = 0;
					wM.destY = 0;
					wM.curCycle = 0;
				}


				/*
				if(rwM) {

					if(result.c("worldpushable") && rwM.state == "standing" && wCP && wCP.strength >= 1) {
						rwM.state = "walking";
						rwM.curSpeed = 500;
						rwM.destX = wM.destX;
						rwM.destY = wM.destY;
						rwM.curCycle = 0;

						if(result.c("worldcanpush")) {
							result.c("worldcanpush").strength = wCP.strength - 1;
						}
					}
					if(wM.curCycle <= rwM.curCycle) {
						wM.state = "standing";
						wM.destX = 0;
						wM.destY = 0;
						wM.curCycle = 0;
					}
				} else {
					wM.state = "standing";
					wM.destX = 0;
					wM.destY = 0;
					wM.curCycle = 0;
				}
				*/
				
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
					wM.state = "standing";
					wP.x += wM.destX;
					wP.y += wM.destY;
					wM.destX = 0;
					wM.destY = 0;
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
	
	
	for(var entityID in _e) {
		var entity = _e[entityID];
		var wP = entity.c("worldposition");
		var wS = entity.c("worldsprite");
		if(wP && wS) {
			var wF = entity.c("worldfaces");
			var wM = entity.c("worldmoves");
			var wSh = entity.c("worldsheet");
			var wSi = entity.c("worldsize");

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

			var shiftX, shiftY;
			shiftX = shiftY = 0;

			if(wF) {
				if(wM && wM.state == "spinning") {
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

			if(wM) {
				shiftX = wM.curCycle / wM.curSpeed * TILE_SIZE * wM.destX;
				shiftY = wM.curCycle / wM.curSpeed * TILE_SIZE * wM.destY;
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
