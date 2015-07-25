/*
	Spin Mania
	Tap Deluxe
	Timed Clicker
*/
ECS.Scenes.FruitGame = {
	"systems":[
		"FruitControl",
		"FruitLogic",
		"FruitRender"
	],
	"entities":[],
	"logic":function() {
		for(var i = 0 ; i < this.systems.length; i++) {
			if(this.systems[i]) {
				this.systems[i](fruitEntities);
			}
		}
	},
	"init":function() {
		fruitEntities = this.entities;
		for(var i = 0; i < this.systems.length; i++) {
			this.systems[i] = ECS.Systems[this.systems[i]];
		}
	}
};
var fruitEntities = ECS.Scenes.FruitGame.entities; //Alias