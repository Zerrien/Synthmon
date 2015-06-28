var explorer = new Image();
explorer.src = "./explorer32.png";

var prevTime;
var player;

function init() {
	canvas = document.getElementById("game");
	canvas.width = 1024;
	canvas.height = 1024;
	ctx = canvas.getContext("2d");


	/*
	var entity = new ECS.Entity();
	entity.addComponent(new ECS.Components.WorldPosition(0, 0));
	entity.addComponent(new ECS.Components.WorldSprite(explorer));
	ECS.entities.push(entity);
	*/

	setInterval(logic, 10)

}

var systems = [
	ECS.Systems.WorldRender
]

function logic() {
	curTime = (new Date()).getTime();
	if(!prevTime) {
		tTime = 0;
		prevTime = curTime;
	}
	dTime = curTime - prevTime;
	tTime += dTime;

	for(var i = 0; i < systems.length; i++) {
		systems[i](ECS.entities);
	}

	prevTime = curTime;
}

