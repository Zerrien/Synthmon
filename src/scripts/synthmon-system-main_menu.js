ECS.Scenes.MainMenu = {
	"systems":[
		"MainMenuControl",
		"MainMenuLogic",
		"MainMenuRender"
	],
	"entities":[],
	"logic":function() {
		for(var i = 0 ; i < this.systems.length; i++) {
			if(this.systems[i]) {
				this.systems[i](mainMenuEntities);
			}
		}
	},
	"init":function() {
		mainMenuEntities = this.entities;
		for(var i = 0; i < this.systems.length; i++) {
			this.systems[i] = ECS.Systems[this.systems[i]];
		}
	}
};

var mainMenuEntities = ECS.Scenes.MainMenu.entities; //Alias

var mainMenuState = 0;
//0 = main menu
//1 = new game
//2 = continue game
//3 = options menu

ECS.Systems.MainMenuControl = function MainMenuControl(_e) {
	if(mouseClick) {
		mouseClick = false;
		if(mainMenuState == 0) {
			if(mousePos.x > canvas.width / 2 - 200 && mousePos.x < canvas.width / 2 - 200 + 400 && mousePos.y > canvas.height / 2 - 50 - 100 && mousePos.y < canvas.height / 2 - 50 - 100 + 100) {
				//New game.
				worldNewGame();
				gameState = "World";
			} else if (mousePos.x > canvas.width / 2 - 200 && mousePos.x < canvas.width / 2 - 200 + 400 && mousePos.y > canvas.height / 2 - 50 + 25 && mousePos.y < canvas.height / 2 - 50 + 25 + 100) {
				//Contiue Game
			} else if (mousePos.x > canvas.width / 2 - 200 && mousePos.x < canvas.width / 2 - 200 + 400 && mousePos.y > canvas.height / 2 - 50 + 150 && mousePos.y < canvas.height / 2 - 50 + 150 + 100) {
				//Options

				mainMenuState = 3;
			}
		} else if (mainMenuState == 3) {
			if (mousePos.x > canvas.width / 2 - 200 && mousePos.x < canvas.width / 2 - 200 + 400 && mousePos.y > canvas.height / 2 - 50 + 150 && mousePos.y < canvas.height / 2 - 50 + 150 + 100) {
				//Options
				mainMenuState = 0;
			}
		}
	}
}
ECS.Systems.MainMenuLogic = function MainMenuLogic(_e) {

}
ECS.Systems.MainMenuRender = function MainMenuRender(_e) {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = "rgba(0, 0, 0, 0.125)";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = "black";

	ctx.save();
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	if(mainMenuState == 0) {
		//ctx.strokeStyle = "black";
		//ctx.fillStyle = "black";
		ctx.fillText("Main Menu", canvas.width / 2, canvas.height / 2 - 200);

		ctx.strokeRect(canvas.width / 2 - 200, canvas.height / 2 - 50 - 100, 400, 100)
		ctx.fillText("New Game", canvas.width / 2, canvas.height / 2 - 100);

		ctx.strokeRect(canvas.width / 2 - 200, canvas.height / 2 - 50 + 150, 400, 100)
		ctx.fillText("Options", canvas.width / 2, canvas.height / 2 + 150);

		//Check to see if there are cookies, to continue from.
		ctx.strokeStyle = "gray";
		ctx.fillStyle = "gray";
		ctx.strokeRect(canvas.width / 2 - 200, canvas.height / 2 - 50 + 25, 400, 100)
		ctx.fillText("Continue Game", canvas.width / 2, canvas.height / 2 + 25);		
	} else if (mainMenuState == 1) {

	} else if (mainMenuState == 2) {

	} else if (mainMenuState == 3) {
		ctx.fillText("Options", canvas.width / 2, canvas.height / 2 - 200);

		ctx.strokeRect(canvas.width / 2 - 200, canvas.height / 2 - 50 + 150, 400, 100)
		ctx.fillText("Back", canvas.width / 2, canvas.height / 2 + 150);
	}

	ctx.restore();
}