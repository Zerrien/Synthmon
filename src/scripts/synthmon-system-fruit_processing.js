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
	},
	"states":[
		"spin_game",
		"tap_game",
		"click_game"
	]
};
var fruitEntities = ECS.Scenes.FruitGame.entities; //Alias
var fruitState = null;

initFruitGame(_type) {
	fruitState = _type;
}


ECS.Systems.FruitControl = function FruitControl() {
	switch(fruitState) {
		case "spin_game",
		case "tap_game",
		case "click_game",
		default:
			break;
	}
}

ECS.Systems.FruitLogic = function FruitLogic() {
	switch(fruitState) {
		case "spin_game",
		case "tap_game",
		case "click_game",
		default:
			break;
	}
}

ECS.Systems.FruitRender = function FruitRender() {
	switch(fruitState) {
		case "spin_game",
		case "tap_game",
		case "click_game",
		default:
			break;
	}
}