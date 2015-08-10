/*
	What is an item?

	Well, first, we must define, what is 'what'?

	An item is an image, a description, and uses.
	Is an item the amount of the item there is?
*/

var ItemSchema = {
	"potion":{
		"name":"Potion",
		"description":"Delicious! Great at healing your Synthmon.",
		"use":{

		},
		"image":"inventory_potion"
	},
	"fruitA":{
		"name":"An Fruit",
		"description":"An unusual fruit. Filling and healthy!",
		"use":{

		},
		"image":"inventory_potion"
	},
	"revive":{
		"name":"Revive",
		"description":"Don't worry, we'll turn that KO into OK!",
		"use":{

		}
	},
	"phxdown":{
		"name":"Phoenix Down",
		"description":"Down is a noun, not a verb.",
		"use":{

		}
	},
	"strboost":{
		"name":"Strength Boost",
		"description":"ROARAROAOGOAGOGAGOOG",
		"use":{
			
		}
	}
}


function Item(_item) {
	if(_item) {
		this.name = _item.name;
		this.description = _item.description;
		this.image = _item.image;
	} else {
		this.name = "DEV_ITEM_NAME";
		this.description = "DEV_ITEM_DESCRIPTION";
		this.image = "DEV_ITEM_IMAGE_NAME";
	}
	this.use = {
		"ref":this,
		//Being held.
		"held":function() {

		},
		//Used in the over world.
		"world":function() {
			var dialogue = new ECS.Entity();
			dialogue.addComponent(new ECS.Components.UIPosition(64, 0));
			dialogue.addComponent(new ECS.Components.UIDialogueBox(this.ref.description));
			dialogue.addComponent(new ECS.Components.UIZIndex(5));
			ECS.entities.push(dialogue);

			var objectControl = new ECS.Entity();
			objectControl.addComponent(new ECS.Components.UIPosition(64, 64));
			objectControl.addComponent(new ECS.Components.UIList([
				{
					"name":"Use",
					"action":function() {
						ECS.entities.splice(ECS.entities.indexOf(objectControl));
						ECS.entities.splice(ECS.entities.indexOf(dialogue));

						var dialogue2 = new ECS.Entity();
						dialogue2.addComponent(new ECS.Components.UIPosition(64, 0));
						dialogue2.addComponent(new ECS.Components.UIDialogueBox("You can do that here!"));
						dialogue2.addComponent(new ECS.Components.UIZIndex(5));
						ECS.entities.push(dialogue2);
					}
				},
				{
					"name":"Back",
					"action":function() {
						ECS.entities.splice(ECS.entities.indexOf(objectControl));
						ECS.entities.splice(ECS.entities.indexOf(dialogue));
					}
				}
			]));
			objectControl.addComponent(new ECS.Components.UIZIndex(6));
			ECS.entities.push(objectControl);
		},
		//Used in battle.
		"battle":function() {

		}
	};
}
/*
	Using placeholder mechanics in the mean time.

	Not final.
*/
function Synthmon(_OP) {
	this.stats = {
		"Attack":10,
		"Defense":10,
		"Speed":10,
		"HP":10,
		"P-Attack":10,
		"P-Defense":10
	};
	this.stats = {
		"Attack":{
			"value":49,
			"PV":_OP ? 10 : 0,
			"TV":0
		},
		"Defense":{
			"value":49,
			"PV":_OP ? 10 : 0,
			"TV":0
		},
		"Speed":{
			"value":45,
			"PV":_OP ? 10 : 0,
			"TV":0
		},
		"HP":{
			"value":45,
			"PV":_OP ? 10 : 0,
			"TV":0
		},
		"P-Attack":{
			"value":65,
			"PV":_OP ? 10 : 0,
			"TV":0
		},
		"P-Defense":{
			"value":65,
			"PV":_OP ? 10 : 0,
			"TV":0
		}
	}
	this.name = "Piggen";
	this.abilities = [
		new Ability(),
		new Ability(),
		new Ability(),
		new Ability()
	]
	this.level = _OP ? 7 : 5;
	this.maxHP = this.getEvalStat("HP");
	this.curHP = this.maxHP;
	
}
Synthmon.prototype = {
	getEvalStat: function(_name) {
		if(_name == "HP") {
			return Math.floor((((this.stats.HP.PV + (2 * this.stats.HP.value) + this.stats.HP.TV / 4 + 100) * this.level) / 100) + 10);
		} else {
			return Math.floor((((this.stats[_name].PV + (2 * this.stats[_name].value) + this.stats[_name].TV / 4) * this.level) / 100) + 5);
		}
	},
	getEvalDmg : function(_enemy, _ability) {
		return Math.floor(((2 * this.level + 10) / 250 * (this.getEvalStat("Attack") / _enemy.getEvalStat("Defense")) * _ability.power) + 2);
	}
}

var abilityNames = ["Tackle", "Water Gun", "Bubble Blow", "Headbutt", "Slam", "Water Cannon", "Water Gush", "Slice"];

function Ability() {
	this.name = abilityNames[Math.floor(Math.random() * abilityNames.length)];
	this.power = 50;
}