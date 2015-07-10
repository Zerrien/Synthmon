function Item() {

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

var abilityNames = ["One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten"]

function Ability() {
	this.name = abilityNames[Math.floor(Math.random() * abilityNames.length)];
	this.power = 50;
}