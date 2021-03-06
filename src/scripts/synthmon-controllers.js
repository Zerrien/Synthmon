function SettingsController() {
	this.soundVolume = 1;
	this.musicVolume = 1;
}


function WorldController() {
	this.images = {};
	this.images.interiors = {};
	for(var chunkID in data.chunks) {
		this.images[chunkID] = new Image();
		this.images[chunkID].src = data.chunks[chunkID].source;
	}
	for(var chunkID in data.interior) {
		this.images.interiors[chunkID] = new Image();
		this.images.interiors[chunkID].src = data.interior[chunkID].source;
	}
	this.lastChunk = null;
}
WorldController.prototype = {
	"trackPos":function(_player) {
		if(_player.c("worldposition").zone == 0) {
			var pChunkX = _player.c("worldposition").x >> 5;
			var pChunkY = _player.c("worldposition").y >> 5;
			if(!this.lastChunk) {
				this.lastChunk = {x:pChunkX, y:pChunkY};
			}
			if(this.lastChunk.x != pChunkX) {
				var diffX = this.lastChunk.x - pChunkX;
				var distanceX = pChunkX + diffX * 2;
				var forwardX = pChunkX + (diffX * - 1);
				for(var i = -1; i <= 1; i++) {
					unloadChunk(distanceX + "," + (pChunkY + i));
					loadZone(0, forwardX + "," + (pChunkY + i));
				}
			} else if (this.lastChunk.y != pChunkY) {
				var diffY = this.lastChunk.y - pChunkY;
				var distanceY = pChunkY + diffY * 2;
				var forwardY = pChunkY + (diffY * - 1);
				for(var i = -1; i <= 1; i++) {
					unloadChunk((pChunkX + i) + "," + distanceY);
					loadZone(0, (pChunkX + i) + "," + forwardY);
				}
			}
			this.lastChunk = {x:pChunkX, y:pChunkY};
			//console.log(_player.c("worldposition").x);
		}
	},
	"init":function() {
		if(player) {
			var pChunkX = player.c("worldposition").x >> 5;
			var pChunkY = player.c("worldposition").y >> 5;
			if(IS_DEBUG) {
				for(var i = -2; i <= 2; i++) {
					for(var j = -2; j <= 2; j++) {
						loadZone(0, i + "," + j);
					}
				}
			} else {
				for(var i = -1; i <= 1; i++) {
					for(var j = -1; j <= 1; j++) {
						loadZone(0, i + "," + j);
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




function CameraController(_who) {
	this.target = _who;
}

var MenuController = {
	"worldmainmenu":{
		"make":function() {
			var menu = createUIElement("div", 200, 200, "absolute");
			menu.className = "container";
			var result = createUIElement('button', 0, 0)
			result.innerHTML = "Click me!";
			menu.appendChild(result)
			return menu;
		}
	}
}
/*
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
*/

function AssetController() {
	this.images = {};
	this.sounds = {};
	this.models = {};
	this.textures = {};

	this.loadImages = function(_completed) {
		var sum = loaded = 0;
		for(var imageName in data.assets.images) {

			var imageAlias = this.images;
			sum++;
			this.images[imageName] = new Image();
			this.images[imageName].src = data.assets.images[imageName];
			this.images[imageName].onload = function() {
				imageAlias._loaded.current = ++loaded;
				if(sum == loaded) {
					_completed();
				}
			}
		}
		this.images._loaded = {
			"total":sum,
			"current":loaded
		};
	};

	this.loadSounds = function(_completed) {
		var sum = loaded = 0;
		for(var soundName in data.assets.sounds) {
			var soundAlias = this.sounds;
			sum++;
			this.sounds[soundName] = new Audio(data.assets.sounds[soundName]);

			this.sounds[soundName].addEventListener("canplaythrough", function() {
				soundAlias._loaded.current = ++loaded;
				if(sum == loaded) {
					_completed();
				}
			});
		}
		this.sounds._loaded = {
			"total":sum,
			"current":loaded
		};
	};

	this.loadModels = function(_completed) {
		var sum = loaded = 0;
		for(var modelName in data.assets.models) {
			var modelAlias = this.models;
			sum++;
			this.models[modelName] = "";
			/*
			var xobj = new XMLHttpRequest();
			xobj.open('get', data.assets.models[modelName], true);
			xobj.type = modelName;
			xobj.onreadystatechange = function() {
				if(xobj.readyState == 4 && xobj.status == "200") {
					modelAlias._loaded.current = ++loaded;
					modelAlias[modelName] = xobj.responseText;
					if(sum == loaded) {
						_completed();
					}
				}
			}
			xobj.send(null);
			*/
		}
		this.models._loaded = {
			"total":sum,
			"current":loaded
		};
		_completed();
	};

	this.loadTextures = function(_completed) {
		if(IS_3D) {
			var sum = loaded = 0;
			for(var textureName in data.assets.textures) {
				var textureAlias = this.textures;
				sum++;
				this.textures[textureName] = {}
				this.textures[textureName];
				this.textures[textureName].texture = gl.createTexture();
				this.textures[textureName].image = new Image();
				this.textures[textureName].image.name = textureName;
				this.textures[textureName].image.onload = function() {
					handleTextureLoaded(this, assets.textures[this.name].texture);
					textureAlias._loaded.current = ++loaded;
					if(sum == loaded) {
						_completed();
					}
				}
				this.textures[textureName].image.src = data.assets.textures[textureName];
			}
			this.textures._loaded = {
				"total":sum,
				"current":loaded
			};
		} else {
			var sum = loaded = 0;
			for(var textureName in data.assets.textures) {
				var textureAlias = this.textures;
				sum++;

				this.textures[textureName] = new Image();
				this.textures[textureName].src = data.assets.textures[textureName];
				this.textures[textureName].onload = function() {
					textureAlias._loaded.current = ++loaded;
					if(sum == loaded) {
						_completed();
					}
				}

			}
			this.textures._loaded = {
				"total":sum,
				"current":loaded
			};
		}
	};
}