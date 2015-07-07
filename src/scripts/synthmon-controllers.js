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
}

function ImageController() {
	this.images = {};
	for(var imageName in worldData.images) {
		this.images[imageName] = new Image();
		this.images[imageName].src = worldData.images[imageName];
	}
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
						"name":"Olee!!!!",
						"action":function() {
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
						ECS.entities2.push(abilityMenu);
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
				ECS.entities2.splice(ECS.entities2.indexOf(menu));
			}));
			for(var i = 0; i < BattleController.getPro().abilities.length; i++) {
				var ability = BattleController.getPro().abilities[i];
				menu.c("uilist").options.push(
					{
						"name":ability.name,
						"action":function() {
							BattleController.action = {
								"type":"attack",
								"use":ability
							}
						}
					}
				);
			}
			menu.c("uilist").options.push(
				{
					"name":"Back",
					"action":function() {
							ECS.entities2.splice(ECS.entities2.indexOf(menu));
					}
				}
			);

			return menu;
		}
	}
}