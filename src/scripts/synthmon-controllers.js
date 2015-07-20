function WorldController() {
	this.images = {};
	this.images.interiors = {};
	for(var chunkID in worldData.chunks) {
		this.images[chunkID] = new Image();
		this.images[chunkID].src = worldData.chunks[chunkID].source;
	}
	for(var chunkID in worldData.interior) {
		this.images.interiors[chunkID] = new Image();
		this.images.interiors[chunkID].src = worldData.interior[chunkID].source;
	}
	this.lastChunk = null;
}
WorldController.prototype = {
	"trackPos":function(_player) {
		var pChunkX = _player.c("worldposition").x >> 5;
		var pChunkY = _player.c("worldposition").y >> 5;
		if(!this.lastChunk) {
			this.lastChunk = {x:pChunkX, y:pChunkY};
		}
		if(this.lastChunk.x != pChunkX) {
			var diffX = this.lastChunk.x - pChunkX;
			var distanceX = pChunkX + diffX * 2;
			var forwardX = pChunkX + (diffX * - 1);
			if(IS_DEBUG) {
				for(var i = -2; i <= 2; i++) {
					unloadChunk(distanceX + "," + (pChunkY + i));
					loadChunk(forwardX + "," + (pChunkY + i));
				}
			} else {
				for(var i = -1; i <= 1; i++) {
					unloadChunk(distanceX + "," + (pChunkY + i));
					loadChunk(forwardX + "," + (pChunkY + i));
				}
			}
		} else if (this.lastChunk.y != pChunkY) {
		}
		this.lastChunk = {x:pChunkX, y:pChunkY};
		//console.log(_player.c("worldposition").x);
	},
	"init":function() {
		if(player) {
			var pChunkX = player.c("worldposition").x >> 5;
			var pChunkY = player.c("worldposition").y >> 5;
			if(IS_DEBUG) {
				for(var i = -2; i <= 2; i++) {
					for(var j = -2; j <= 2; j++) {
						loadChunk(i + "," + j);
					}
				}
			} else {
				for(var i = -1; i <= 1; i++) {
					for(var j = -1; j <= 1; j++) {
						loadChunk(i + "," + j);
					}
				}
			}
		} else {
			console.log("There ain't a player!");
		}
	}
}

function ImageController() {
	this.images = {};
	for(var imageName in worldData.images) {
		this.images[imageName] = new Image();
		this.images[imageName].src = worldData.images[imageName];
	}
}

var CameraController = {

}


var MenuController = {
	"worldmainmenu":{
		"make":function() {
			var menu = new ECS.Entity();
			menu.addComponent(new ECS.Components.UIPosition(canvas.width * 2 / 3, canvas.height / 2));
			menu.addComponent(new ECS.Components.UIList([
				{
					"name":"Inventory",
					"action":function() {
						var inventoryMenu = MenuController.inventoryMenu.make();
						inventoryMenu.addComponent(new ECS.Components.UIZIndex(1));
						ECS.entities.push(inventoryMenu);
					}
				},
				{
					"name":"Team",
					"action":function() {

					}
				},
				{
					"name":"Phone",
					"action":function() {

					}
				},
				{
					"name":"Status",
					"action":function() {

					}
				},
				{
					"name":"Close",
					"action":function() {
						ECS.entities.splice(ECS.entities.indexOf(menu));
						gameState = 0;
					}
				}
			], function() {
				ECS.entities.splice(ECS.entities.indexOf(menu));
				gameState = 0;
			}));
			return menu;
		}
	},
	"inventoryMenu":{
		"make":function() {
			var menu = new ECS.Entity();
			menu.addComponent(new ECS.Components.UIPosition(20, 20));
			menu.addComponent(new ECS.Components.UIList([], function() {
				ECS.entities.splice(ECS.entities.indexOf(menu));
			}));

			for(var i = 0; i < player.c("inventory").items.length; i++) {
				menu.c("uilist").options.push(
					{
						"name":player.c("inventory").items[i].name,
						"ref":i,
						"action":function() {
							player.c("inventory").items[this.ref].use.world();
						}
					}
				);
			}

			menu.c("uilist").options.push(
				{
					"name":"Close",
					"action":function() {
						ECS.entities.splice(ECS.entities.indexOf(menu));
					}
				}
			);

			return menu;
		}
	},
	"combatMenu":{
		"make":function() {
			var menu = new ECS.Entity();
			menu.addComponent(new ECS.Components.UIPosition(128 * 3, 0));
			menu.addComponent(new ECS.Components.UIList([
				{
					"name":"Attack",
					"action":function() {
						var abilityMenu = MenuController.abilityMenu.make();
						abilityMenu.addComponent(new ECS.Components.UIZIndex(1));
						battleEntities.push(abilityMenu);
					}
				},
				{
					"name":"Synthmon",
					"action":function() {
						
					}
				},
				{
					"name":"Items",
					"action":function() {
						
					}
				},
				{
					"name":"Run",
					"action":function() {
						
					}
				}
			], function() {
				console.log("Tried to close... Naughty, naughty.");
			}));
			return menu;
		}
	},
	"abilityMenu":{
		"make":function(_abilities) {
			var menu = new ECS.Entity();
			menu.addComponent(new ECS.Components.UIPosition(128 * 4, 0));
			menu.addComponent(new ECS.Components.UIList([], function() {
				battleEntities.splice(battleEntities.indexOf(menu));
			}));
			for(var i = 0; i < BattleController.getProCurrent().abilities.length; i++) {
				var ability = BattleController.getProCurrent().abilities[i];
				menu.c("uilist").options.push({
					"name":ability.name,
					"ref":i,
					"action":function() {
						battleEntities.splice(battleEntities.indexOf(menu), 1);
						BattleController.action = {
							"type":"attack",
							"use":BC.getProCurrent().abilities[this.ref]
						}
					}
				});
			}
			menu.c("uilist").options.push(
				{
					"name":"Back",
					"action":function() {
							battleEntities.splice(battleEntities.indexOf(menu), 1);
					}
				}
			);

			return menu;
		}
	}
}