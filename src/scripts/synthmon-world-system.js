ECS.Scenes.World = {
	"systems":[
		"WorldAI",
		"WorldKeyboard",
		"WorldCollision",
		"WorldLogic",
		"WorldRender"
	],
	"entities":[],
	"logic":function() {
		for(var i = 0 ; i < this.systems.length; i++) {
			if(this.systems[i]) {
				this.systems[i](this.entities);
			}
		}
	},
	"init":function() {
		for(var i = 0; i < this.systems.length; i++) {
			this.systems[i] = ECS.Systems[this.systems[i]];
		}
	}
};

ECS.Systems.WorldAI = function WorldAI(_e) {
	//Artificial Intelligence is only as smert as the Artificier.
}
ECS.Systems.WorldKeyboard = function WorldKeyboard(_e) {
	//Takka takka takka.

	//To be renamed World Control? 
}
ECS.Systems.WorldCollision = function WorldCollision(_e) {
	//Bump, bump.
}
ECS.Systems.WorldLogic = function WorldLogic(_e) {
	//Consider this: disregard this.
}
ECS.Systems.WorldRender = function WorldRender(_e) {
	//And here is where we add the happy litle tree.
}