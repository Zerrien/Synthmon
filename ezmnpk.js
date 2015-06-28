var contentObject = {
	"map":[
		{
			"pos":{
				x:0,
				y:0
			},
			"tile":"grass"
		},
		{
			"pos":{
				x:1,
				y:0
			},
			"tile":"water",
			"frame":0
		},
	]
}

function init() {
	
}

var abilityNames = [
	"Solar Flare",
	"Punch",
	"Skillshot",
	"Aerial",
	"Tactical Genius",
	"Thrust",
	"Tackle",
	"Greet"
];

function Ability() {
	this.power = 10;
	this.name = abilityNames[Math.floor(abilityNames.length * Math.random())];
}
Ability.prototype = {

}


var monsterNames = [
	"Billy",
	"Betsy",
	"Kyle",
	"George",
	"Bob",
	"DEATHLORD",
	"420_blazed",
	"Greased Up Deaf Guy",
	"Fancy Pantsy",
	"Imma Monster",
	"Judge",
	"Dredd",
	"Hillbilly"
];

function Monster() {
	this.stats = {
		"Attack": 10,
		"Defense": 10,
		"Speed": 10,
		"HP": 10,
		"P-Attack": 10,
		"P-Defense": 10,
	};
	this.name = monsterNames[Math.floor(monsterNames.length * Math.random())];
	this.abilities = [
		new Ability(),
		new Ability(),
		new Ability(),
		new Ability()
	]
	this.maxHP = this.stats.HP;
	this.curHP = this.maxHP;
	this.curHP = Math.random() * this.maxHP;
}
Monster.prototype = {

};

var itemNames = [
	"A Potion",
	"Bicycle",
	"Sunglasses",
	"Rubber Ball",
	"Leather Strap",
	"Belt Clasp",
	"Spectacles",
	"Discoball"
];

function Item() {
	this.name = itemNames[Math.floor(itemNames.length * Math.random())];
}


/*
function Player() {
	this.monsters = [
		new Monster()
	];
}
*/



var ECS = {};
ECS.entities = [];
ECS.entities2 = [];

ECS.Entity = function Entity() {
	this.id = this.id = (+new Date()).toString(16) + (Math.random() * 100000000 | 0).toString(16) + ECS.Entity.prototype._count;
	ECS.Entity.prototype._count++;

	this.components = {};
	return this;
}

ECS.Entity.prototype._count = 0;

ECS.Entity.prototype.addComponent = function addComponent(_c) {
	this.components[_c.name] = _c;
	return this;
}

ECS.Entity.prototype.removeComponent = function removeComponent ( _c ) {
	var name = _c;
	if(typeof componentName === 'function') {
		name = _c.prototype.name;
	}
	delete this.components[name];
	return this;
};

ECS.Entity.prototype.c = function c(_c) {
	return this.components[_c];
}


ECS.Components = {};

/*
	Meta-objects
*/
//Internet ID
ECS.Components.PlayerID = function PlayerID(_id) {
	this.id = _id;
}
ECS.Components.PlayerID.prototype.name = "playerid";

//Owns Synthmon
ECS.Components.Trainer = function Trainer() {
	this.monsters = [];
}
ECS.Components.Trainer.prototype.name = "trainer";

ECS.Components.Inventory = function Inventory() {
	this.items = [];
}
ECS.Components.Inventory.prototype.name = "inventory";




/*
	Redo world objects
*/

ECS.Components.WorldSprite = function WorldSprite(_img) {
	//Nearly everything has a sprite
	this.img = _img;
}
ECS.Components.WorldSprite.prototype.name = "worldsprite";
ECS.Components.WorldPosition = function WorldPosition(_x, _y, _zone) {
	//Nearly everything has a position
	this.zone = _zone || 0;
	this.x = _x;
	this.y = _y;
}
ECS.Components.WorldPosition.prototype.name = "worldposition";
ECS.Components.WorldFaces = function WorldFaces(_facing) {
	//Some things can look in a direction
	this.facing = _facing;
}
ECS.Components.WorldFaces.prototype = {
	inverseFace : function() {
		switch(this.facing) {
			case "left":
				return "right";
				break;
			case "right":
				return "left";
				break;
			case "down":
				return "up";
				break;
			case "up":
				return "down";
				break;
		}
	}
};
ECS.Components.WorldFaces.prototype.name = "worldfaces";
ECS.Components.WorldSheet = function WorldSheet(_tileNum) {
	//0, 1, 2, 3,
	//4, 5, 6, 7,
	//8, 9, 10, 11,
	//12
	this.num = _tileNum;
}
ECS.Components.WorldSheet.prototype.name = "worldsheet";
ECS.Components.WorldCollision = function WorldCollision() {
	//Some things are collidable
}
ECS.Components.WorldCollision.prototype.name = "worldcollision";
ECS.Components.WorldLargeCollision = function WorldLargeCollision(_w, _h, _x, _y) {
	//Some things are large, and collidable.
	this.width = _w;
	this.height = _h;
	this.xOffset = _x;
	this.yOffset = _y;
}
ECS.Components.WorldLargeCollision.prototype.name = "worldlargecollision";
ECS.Components.WorldSize = function WorldSize(_w, _h, _x, _y) {
	this.width = _w;
	this.height = _h;
	this.xAnchor = _x || 0;
	this.yAnchor = _y || 0;
}
ECS.Components.WorldSize.prototype.name = "worldsize";

ECS.Components.WorldMoves = function WorldMoves() {
	//Some objects can move
	this.state = "standing";
	this.destX = 0;
	this.destY = 0;
	this.speed = 250;
	this.curCycle = 0;
}
ECS.Components.WorldMoves.prototype.name = "worldmoves";

ECS.Components.WorldInteractable = function WorldInteractable(_event) {
	//Some things can be 'used' in some way
	//Chatting, entering a door, picking up.
	this.act = _event;
}
ECS.Components.WorldInteractable.prototype.name = "worldinteractable";

ECS.Components.WorldChatty = function WorldChatty(_string) {
	this.string = _string;
}
ECS.Components.WorldChatty.prototype.name = "worldchatty";

ECS.Components.WorldKeyboardControlled = function WorldKeyboardControlled() {
}
ECS.Components.WorldKeyboardControlled.prototype.name = "worldkeyboardcontrolled";

ECS.Components.MovementAI = function MovementAI() {
}
ECS.Components.MovementAI.prototype.name = "movementai";

ECS.Components.LineDetectionAI = function LineDetectionAI(_range) {
	this.range = _range;
}
ECS.Components.LineDetectionAI.prototype.name = "linedetectionai"

ECS.Components.UIText = function UIText(_str, _spd) {
	this.text = _str;
	this.speed = _spd;
	this.curTime = 0;
	this.hasCont = false;
}
ECS.Components.UIText.prototype = {
	isComplete : function() {
		if(this.text.length * this.speed < this.curTime && this.hasCont) {
			return true;
		}
		return false;
	}
}
ECS.Components.UIText.prototype.name = "uitext";
ECS.Components.UIPosition = function UIPosition(_x, _y) {
	this.x = _x;
	this.y = _y;
}
ECS.Components.UIPosition.prototype.name = "uiposition";

ECS.Components.Action = function Action(_act) {
	this.act = _act;
}
ECS.Components.Action.prototype.name = "action";

ECS.Components.KeyboardEvent = function KeyboardEvent(_key, _event) {
	this.key = _key;
	this.act = _event;
}
ECS.Components.KeyboardEvent.prototype.name = "keyboardevent";

ECS.Components.MonsterSprite = function MonsterSprite(_ref, _index) {
	this.ref = _ref;
	this.index = _index;
}
ECS.Components.MonsterSprite.prototype.name = "monstersprite";

ECS.Components.BattleSpriteShake = function BattleSpriteShake(_mX, _mY) {
	this.curTime = 0;
	this.maxX = _mX;
	this.maxY = _mY;
}
ECS.Components.BattleSpriteShake.prototype.name = "battlespriteshake";

ECS.Components.HealthBox = function HealthBox(_ref, _index) {
	this.ref = _ref;
	this.index = _index;
}
ECS.Components.HealthBox.prototype.name = "healthbox";

ECS.Components.MenuOptions = function MenuOptions(_list) {
	this.list = _list;
	this.curIndex = 0;
	this.zDepth = 0;
}
ECS.Components.MenuOptions.prototype = {
	advance : function() {
		this.curIndex++;
		if(this.curIndex >= this.list.length) {
			this.curIndex = 0;
		}
	},
	reverse : function() {
		this.curIndex--;
		if(this.curIndex < 0) {
			this.curIndex = this.list.length - 1;
		}
	}
}
ECS.Components.MenuOptions.prototype.name = "menuoptions";


ECS.Assemblages = {
	BattleText : function BattleText(_s, _f) {
		var entity = new ECS.Entity();
		entity.addComponent(new ECS.Components.UIPosition(canvas.width / 2, 300));
		var theText = new ECS.Components.UIText(_s, 100);
		entity.addComponent(theText);
		entity.addComponent(new ECS.Components.Action(function() {
			_f();
			theText.hasCont = true;
		}));
		return entity;
	}
};



ECS.Systems = {};
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
					/*
					var wI = fEntity.c("worldinteractable");
					if(wI) {
						wI.act();
					}
					*/
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

				/*
				keyboardKeys[69] = false;
				gameState = 1;

				var entity = new ECS.Entity();
				entity.addComponent(new ECS.Components.UIPosition(100, 100));
				entity.addComponent(new ECS.Components.MenuOptions(["Inventory", "Synthmon", "Information", "Leave Menu"]));
				ECS.entities.push(entity);
				*/

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
				/*
				webSocket.send(JSON.stringify({
					"playerid":pID.id,
					"x":wP.x,
					"y":wP.y,
					"state":wM.state,
					"curCycle":wM.curCycle,
					"destX":wM.destX,
					"destY":wM.destY,
					"facing":wF.facing
				}));
				*/
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
	
	/*
	if(is_debug) {
		var sum2 = 0;
		for(var i = 0; i < frameArray.length; i++) {
			sum2 += frameArray[i];
		}
		var avg2 = sum2 / frameArray.length;
	
		ctx.fillText(avg2.toFixed(2), 10, 20);
		ctx.fillText((1000 / avg2).toFixed(2) + " Avg. FPS", 10, 30)
		
		time = (new Date()).getTime() - time;
		timeArrays[3].push(time);
		var sum = 0;
		for(var i = 0; i < timeArrays[3].length; i++) {
			sum += timeArrays[3][i];
		}
		var avg = sum / timeArrays[3].length;
		document.getElementById("system4").innerHTML = avg.toFixed(2) + " "  + time.toFixed(2);
	}
	*/
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
						
						/*
						clearUI();
						if(interact.c("trainer")) {
							setUpBattle(player, interact);
							gameState = 2;
						} else {
							interact = null;
							gameState = 0;
						}
						*/
					}
				}
			}
		}
		/*
		//Old implementation, may return.
		if(entity.c("keyboardevent")) {
			if(keyboardKeys[entity.c("keyboardevent").key]) {
				keyboardKeys[entity.c("keyboardevent").key] = false;
				entity.c("keyboardevent").act();
			}
		}
		*/
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



function setUpBattle(_pro, _ant) {
	ECS.entities2 = [];


	var battlecontrol = new ECS.Entity();
	var theController = new ECS.Components.BattleController(_pro, _ant);
	battlecontrol.addComponent(theController);
	ECS.entities2.push(battlecontrol);

	var battleMenu = new ECS.Entity();
	var theOptions = new ECS.Components.MenuOptions([
		{
			"name":"Attack",
			"action": function() {
				var attackMenu = new ECS.Entity();
				var attacks = new ECS.Components.MenuOptions([]);
				for(var i = 0; i < theController.proCur.abilities.length; i++) {
					attacks.list.push({
						"name":theController.proCur.abilities[i].name,
						"action":function() {
							ECS.entities2.splice(ECS.entities2.indexOf(attackMenu));
							attackMenu = null;

							theController.action.type = "attack";
							theController.action.result = theController.proCur.abilities[this.index];
							theController.state = 1;
						},
						"index":i
					});
				}
				
				attacks.list.push({
					"name":"Back",
					"action" : function() {
						ECS.entities2.splice(ECS.entities2.indexOf(attackMenu));
						attackMenu = null;
					}
				})
				attacks.zDepth = 1;
				attackMenu.addComponent(attacks);
				attackMenu.addComponent(new ECS.Components.UIPosition(250, 125));
				ECS.entities2.push(attackMenu);
			}
		},
		{
			"name":"Items",
			"action": function() {
				console.log("Items!");
			}
		},
		{
			"name":"Synthmon",
			"action": function() {
				var monsterMenu = new ECS.Entity();
				var monstersList = new ECS.Components.MenuOptions([]);
				for(var i = 0; i < _pro.c("trainer").monsters.length; i++) {
					var theMon = 
					monstersList.list.push({
						"name":_pro.c("trainer").monsters[i].name,
						"action":function() {
							if(theController.proCur != _pro.c("trainer").monsters[this.index]) {
								//theController.proCur = _pro.c("trainer").monsters[this.index];
								ECS.entities2.splice(ECS.entities2.indexOf(monsterMenu));
								theController.action.type = "switch";
								theController.action.result = _pro.c("trainer").monsters[this.index];
								theController.state = 1;
							}
						},
						"index":i
					});
				}
				monstersList.list.push({
					"name":"Back",
					"action" : function() {
						ECS.entities2.splice(ECS.entities2.indexOf(monsterMenu));
						attackMenu = null;
					}
				})
				monstersList.zDepth = 1;
				monsterMenu.addComponent(monstersList);
				monsterMenu.addComponent(new ECS.Components.UIPosition(250, 125));
				ECS.entities2.push(monsterMenu);
			}
		},
		{
			"name":"Run",
			"action": function() {
				theController.action.type = "run";
				theController.action.result = "";
				theController.state = 1;
			}
		}
	]);
	battleMenu.addComponent(theOptions);
	battleMenu.addComponent(new ECS.Components.UIPosition(100, 100));
	ECS.entities2.push(battleMenu);

	var playerHealth = new ECS.Entity();
	playerHealth.addComponent(new ECS.Components.UIPosition(canvas.width - 400, 128 - 25));
	playerHealth.addComponent(new ECS.Components.HealthBox(theController, "proCur"))
	ECS.entities2.push(playerHealth);

	var enemyHealth = new ECS.Entity();
	enemyHealth.addComponent(new ECS.Components.UIPosition(canvas.width - 96, 128 - 25));
	enemyHealth.addComponent(new ECS.Components.HealthBox(theController, "antCur"))
	ECS.entities2.push(enemyHealth);

	var playerSprite = new ECS.Entity();
	playerSprite.addComponent(new ECS.Components.UIPosition(canvas.width - 400, 128));
	playerSprite.addComponent(new ECS.Components.MonsterSprite(theController, "proCur"))
	ECS.entities2.push(playerSprite);
	theController.connections.playerMonSprite = playerSprite;


	var enemySprite = new ECS.Entity();
	enemySprite.addComponent(new ECS.Components.UIPosition(canvas.width - 96, 128));
	enemySprite.addComponent(new ECS.Components.MonsterSprite(theController, "antCur"))
	ECS.entities2.push(enemySprite);
	theController.connections.enemyMonSprite = enemySprite;


	
	/*
		ctx.drawImage(vanilla, canvas.width - 400, 128);
		ctx.drawImage(deox, canvas.width - 96, 128);
	*/

}

/*
	Fight Dialogue
	Transition

	Smoke effect + field reveal

	Enemy Trainer scrolls by
	both pokemon sets revealed
	friendly trainer scrolls by

	"You are challenged" by Red
	
	PKMN Sent out Pikachu
	PKBall Sits on ground
	PK Ball explodes
	Pikachu reveal

	Trainer pulls back
	His pokemon slides on


	used Earthquake
	sprite of damage
	screen shakes
	health goes down

	its super effective
	pikachu fainted
	exp
*/


ECS.Systems.Battle = function Battle(_e) {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = "rgba(0, 0, 0, 0.125)";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = "black";
	for(var entityID in _e) {
		var entity = _e[entityID];
		var bC = entity.c("battlecontroller");
		if(bC) {
			//Draw the Pogeymans tiles
			for(var i = 0; i < 6; i++) {
				if(i < bC.protagonist.c("trainer").monsters.length) {
					ctx.fillRect(i * 20, 0, 20, 20);
				} else {
					ctx.strokeRect(i * 20, 0, 20, 20);
				}
				if(bC.protagonist.c("trainer").monsters.indexOf(bC.proCur) == i) {
					ctx.fillRect(i * 20 + 5, 25, 10, 10);
				}

				if(i < bC.antagonist.c("trainer").monsters.length) {
					ctx.fillRect(canvas.width - 20 - i * 20, 0, 20, 20);
				} else {
					ctx.strokeRect(canvas.width - 20 - i * 20, 0, 20, 20);
				}
				if(bC.antagonist.c("trainer").monsters.indexOf(bC.antCur) == i) {
					ctx.fillRect(canvas.width - 20 + 5 - i * 20, 25, 10, 10);
				}
			}

			switch(bC.state) {
				case 0:
					//Waiting for input
					break;
				case 1:
					//Sort actions.
					switch(bC.action.type) {
						case "switch":
							/*
							bC.proCur = bC.action.result;
							bC.state = 0;
							*/
							break;
						case "attack":
							/*
								Gonna get messy, again.
							*/
							/*
								First do battle calculation
							*/
							
							var ole = bC;
							bC.events.push(createBattleEvent({
								"startTime":0,
								"endTime":1000,
								"text":"Attack!",
								"effects":[
									{
										"effect":"shake",
										"target":ole.connections.playerMonSprite
									}
								]
							}));
							bC.state = 2;
							break;
						case "run":
							var textBox = new ECS.Entity();
							textBox.addComponent(new ECS.Components.UIPosition(canvas.width / 2, 300));
							textBox.addComponent(new ECS.Components.UIText("You can't run from a TRAINER BATTLE", 100));
							var actionThing = new ECS.Components.Action(function() {
								this.data.state = 0;
							});
							actionThing.data = bC;
							textBox.addComponent(actionThing);
							ECS.entities2.push(textBox);
							bC.state = 2;
							break;
					}
					break;
				case 2:
					//Evaluate event array
					if(bC.events.length > 0) {

						var theEvent = bC.events[0];
						if(theEvent.curTime < theEvent.startTime && theEvent.curTime + dTime >= theEvent.startTime) {
							if(theEvent.startAction) {
								theEvent.startAction();
							}
						}
						theEvent.curTime += dTime;
						if(theEvent.curTime >= theEvent.endTime) {
							if(theEvent.queue && theEvent.queue.c("uitext")) {
								if(theEvent.queue.c("uitext").isComplete()) {
									if(theEvent.endAction) {
										theEvent.endAction();
									}
									bC.events.splice(0, 1);
								}
							} else {
								if(theEvent.endAction) {
									theEvent.endAction();
								}
								bC.events.splice(0, 1);
							}
						}

					} else {
						//No more events
						bC.state = 0;
					}
					break;
				case 3:
					//Verify stuff
					break;
				case 4:
					//Ending screen.
					break;
				case 5:
					//All done!
					break;
			}
		}
	}
}

function BattleEvent(_s, _e, _sA, _eA) {
	this.startTime = _s;
	this.endTime = _e;
	this.curTime = -1;
	this.startAction = _sA || function() {
	}
	this.endAction = _eA || function() {
	}
	this.queue;
}

function createBattleEvent(_obj) {
	var effects = parseEffects(_obj.effects);
	var textBox;
	if(_obj.text) {
		textBox = new ECS.Assemblages.BattleText(_obj.text, function() {});
	}

	var theEvent = new BattleEvent(0, 1000, function() {
		for(var i = 0; i < effects.length; i++) {
			effects[i].target.addComponent(effects[i].component);
		}
		if(textBox) {
			ECS.entities2.push(textBox);
			this.queue = textBox;
		}
	}, function() {
		for(var i = 0; i < effects.length; i++) {
			effects[i].target.removeComponent(effects[i].component.name);
		}
		if(textBox) {
			ECS.entities2.splice(ECS.entities2.indexOf(textBox), 1);
		}
	});

	return theEvent;
}

function parseEffects(_array) {
	var effects = [];
	for(var i = 0; i < _array.length; i++) {
		effects.push(parseEffect(_array[i]));
	}
	return effects;
}

function parseEffect(_obj) {
	var component;
	switch(_obj.effect) {
		case "shake":
			component = {
				"target":_obj.target,
				"component":new ECS.Components.BattleSpriteShake(10, 0)
			};
			break;
	}
	return component;
}



var canvas = document.getElementById("game");
var curTime, prevTime, dTime, tTime;
var ctx;
var venusaur = new Image();
venusaur.src = "./venusar32.png"

var explorer = new Image();
explorer.src = "./explorer32.png";

var ground = new Image();
ground.src = "./ground.png";

var kid = new Image();
kid.src = "./breezy.png";


var deox = new Image();
deox.src = "./deox.png";

var vanilla = new Image();
vanilla.src = "./vanilla.png";

var waterSprite = new Image();
waterSprite.src = "./theWater.png"


var tree = new Image();
tree.src = "./tree2.png";

var centerSprite = new Image();
centerSprite.src = "./pokecenter.png";

var mainMapTest = new Image();
mainMapTest.src = "./map.png";

/*
var webSocket = new WebSocket("ws://goaggro.com:8080");
webSocket.onmessage = function(_msg) {
	var result = JSON.parse(_msg.data);
	if(result.messageType == "OWNER_ID") {
		player.addComponent(new ECS.Components.PlayerID(result.playerID));
	} else if (result.messageType == "WORLD_DATA") {
		if(player.c("playerid")) {
			if(player.c("playerid").id == result.playerID) {
				player.c("worldposition").x = result.position.x
				player.c("worldposition").y = result.position.y
			} else {
				
				//someone els's data
				
				var hasFound = false;
				for(var entityID in ECS.entities) {
					var entity = ECS.entities[entityID];
					
					if(entity.c("playerid") && entity.c("playerid").id == result.playerID) {
						entity.c("worldposition").x = result.position.x;
						entity.c("worldposition").y = result.position.y;
						var wMk = entity.c("worldmoves");
						wMk.curCycle = result.curCycle;
						wMk.destX = result.destX;
						wMk.destY = result.destY;
						entity.c("worldfaces").facing = result.facing;
						hasFound = true;
						break;
					}
				}
				if(!hasFound) {
					//console.log("No entities with that ID!");
					var randPlayer = new ECS.Entity();
					randPlayer.addComponent(new ECS.Components.PlayerID(result.playerID));
					randPlayer.addComponent(new ECS.Components.WorldMoves());
					randPlayer.addComponent(new ECS.Components.WorldFaces(result.facing));
					randPlayer.addComponent(new ECS.Components.WorldPosition(result.position.x, result.position.y));
					randPlayer.addComponent(new ECS.Components.WorldSprite(explorer));
					ECS.entities.push(randPlayer);
				}
			}
		} else {
			//No player ID recieved?!?!
		}
	} else if (result.messageType == "REMOVE_PLAYER") {
		for(var entityID in ECS.entities) {
			var entity = ECS.entities[entityID];
			if(entity.c("playerid") && entity.c("playerid").id == result.playerID) {
				ECS.entities.splice(entityID, 1);
			}
		}
		console.log("Removing a player!");
	} else {
		console.log(result.messageType)
	}
	//var result = JSON.parse(_msg);
	//console.log(result.playerID);
}
*/

var keyboardKeys = [];
var keyPress = [];
var gameState = 0;

var systems = [
	ECS.Systems.AI,
	ECS.Systems.KeyboardControl,
	ECS.Systems.Logic,
	ECS.Systems.Render
];

var menuSystems = [
	ECS.Systems.AI,
	ECS.Systems.UIControl,
	ECS.Systems.Logic,
	ECS.Systems.Render,
	ECS.Systems.DrawUI
];

var battleSystems = [
	ECS.Systems.UIControl,
	ECS.Systems.Battle,
	ECS.Systems.DrawUI

];


var player;
var interact;

if(canvas) {
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

	/*
	for(var i = 0; i < contentObject.map.length; i++) {
		var mapObject = contentObject.map[i];
		var entity = new ECS.Entity();
		entity.addComponent(new ECS.Components.WorldPosition(mapObject.pos.x, mapObject.pos.y));
		var sprite;
		switch(mapObject.tile) {
			case "grass":
				sprite = ground;
				break;
			case "water":
				sprite = waterSprite;
				break
		}
		entity.addComponent(new ECS.Components.WorldSprite(sprite));
		ECS.entities.push(entity);
	}
	*/
	/*
	for(var i = 0; i < 20; i++) {
		for(var j = 0; j < 20; j++) {
			var entity = new ECS.Entity();
			entity.addComponent(new ECS.Components.WorldPosition(i, j));
			entity.addComponent(new ECS.Components.WorldSprite(ground));
			ECS.entities.push(entity);
		}
	}
	*/

	var map = new ECS.Entity();
	map.addComponent(new ECS.Components.WorldPosition(-10, 0));
	map.addComponent(new ECS.Components.WorldSize(30, 30));
	map.addComponent(new ECS.Components.WorldSprite(mainMapTest))
	ECS.entities.push(map);

	for(var i = 0; i < 5; i++) {
		var entity = new ECS.Entity();
		entity.addComponent(new ECS.Components.WorldPosition(Math.floor(Math.random() * 20),Math.floor(Math.random() * 20)));
		entity.addComponent(new ECS.Components.WorldSprite(venusaur));
		entity.addComponent(new ECS.Components.WorldMoves());
		entity.c("worldmoves").speed = 1000;
		entity.addComponent(new ECS.Components.WorldFaces("down"));
		entity.addComponent(new ECS.Components.WorldCollision());

		entity.addComponent(new ECS.Components.MovementAI());
		ECS.entities.push(entity);
	}

	var kidE = new ECS.Entity();
	kidE.addComponent(new ECS.Components.WorldPosition(1, 1));
	kidE.addComponent(new ECS.Components.WorldSprite(kid));
	var kidEFaces = new ECS.Components.WorldFaces("down");
	kidE.addComponent(new ECS.Components.WorldCollision());
	kidE.addComponent(new ECS.Components.WorldChatty("SHORTS OH GOD SHORTS IN MY MOUTH123123123"));

	kidE.addComponent(kidEFaces);
	
	ECS.entities.push(kidE);

	var kidB = new ECS.Entity();
	kidB.addComponent(new ECS.Components.WorldPosition(1, 0));
	kidB.addComponent(new ECS.Components.WorldSprite(kid));
	kidB.addComponent(new ECS.Components.WorldFaces("down"));
	kidB.addComponent(new ECS.Components.WorldCollision());
	kidB.addComponent(new ECS.Components.WorldChatty("SHORTS OH GOD SHORTS IN MY MOUTH"));
	var kidBTrainer = new ECS.Components.Trainer();
	kidBTrainer.monsters.push(new Monster());
	kidBTrainer.monsters.push(new Monster());
	kidB.addComponent(kidBTrainer);
	kidB.addComponent(new ECS.Components.Action(function() {
		setUpBattle(player, interact);
		gameState = 2;
	}))
	ECS.entities.push(kidB);

	

	//Pokecenter
	var center = new ECS.Entity();
	center.addComponent(new ECS.Components.WorldPosition(7, 2));
	center.addComponent(new ECS.Components.WorldSprite(centerSprite));
	center.addComponent(new ECS.Components.WorldSize(5, 5));
	center.addComponent(new ECS.Components.WorldLargeCollision(5, 4, 0, 1));
	ECS.entities.push(center);




	player = new ECS.Entity();
	player.addComponent(new ECS.Components.WorldPosition(0, 0));
	player.addComponent(new ECS.Components.WorldSprite(explorer));
	player.addComponent(new ECS.Components.WorldMoves());
	player.addComponent(new ECS.Components.WorldFaces("right"));
	player.addComponent(new ECS.Components.WorldCollision());

	var pTrainer = new ECS.Components.Trainer();
	pTrainer.monsters.push(new Monster());
	pTrainer.monsters.push(new Monster());
	pTrainer.monsters.push(new Monster());
	pTrainer.monsters.push(new Monster());
	player.addComponent(pTrainer);

	var pInventory = new ECS.Components.Inventory();
	pInventory.items.push(new Item());
	pInventory.items.push(new Item());
	pInventory.items.push(new Item());
	pInventory.items.push(new Item());
	player.addComponent(pInventory);

	player.addComponent(new ECS.Components.WorldKeyboardControlled());
	ECS.entities.push(player);

	setInterval(logic, 10);
}

function logic() {
	curTime = (new Date()).getTime();
	if(!prevTime) {
		tTime = 0;
		prevTime = curTime;
	}
	dTime = curTime - prevTime;
	tTime += dTime;
	if(is_debug) {
		frameArray.push(dTime);
	}
	switch(gameState) {
		case 0:
			for(var i = 0; i < systems.length; i++) {
				if(is_debug) {
					var time = (new Date()).getTime();
				}
				systems[i](ECS.entities);
				if(is_debug) {
					debugFromTime(time, i);
				}
			}
			break;
		case 1:
			for(var i = 0; i < menuSystems.length; i++) {
				menuSystems[i](ECS.entities);
			}
			break;
		case 2:
			for(var i = 0; i < battleSystems.length; i++) {
				battleSystems[i](ECS.entities2);
			}
			break;
		case 3:
			break;
	}
	prevTime = curTime;
}

/*
	***********************
	DEBUG STUFF
	***********************
*/
var is_debug = false;
var timeArrays = [
	[],
	[],
	[],
	[]
]
var frameArray = [];

var systemsNames = [
	"AI",
	"KeyboardControl",
	"Logic",
	"Render"
];

function debugFromTime(_time, _index) {
	var time = (new Date()).getTime() - _time;
	timeArrays[_index].push(time);
	var sum = 0;
	for(var i = 0; i < timeArrays[_index].length; i++) {
		sum += timeArrays[_index][i];
	}
	var avg = sum / timeArrays[_index].length;
	document.getElementById("system" + _index).innerHTML = systemsNames[_index] + "<br>Sum: " + time.toFixed(0) + " Avg: " + avg.toFixed(3);
}