function Item() {

}

function Synthmon() {
	this.stats = {
		"Attack":10,
		"Defense":10,
		"Speed":10,
		"HP":10,
		"P-Attack":10,
		"P-Defense":10
	};
	this.name = "Piggen";
	this.abilities = [
		new Ability(),
		new Ability(),
		new Ability(),
		new Ability()
	]

	this.maxHP = this.stats.HP;
	this.curHP = this.maxHP;
}

function Ability() {

}