ECS.Scenes.Loading = {
	"systems":[
		"LoadingLogic",
		"LoadingRender"
	],
	"entities":[],
	"logic":function() {
		for(var i = 0 ; i < this.systems.length; i++) {
			if(this.systems[i]) {
				this.systems[i](loadingEntities);
			}
		}
	},
	"init":function() {
		loadingEntities = this.entities;
		for(var i = 0; i < this.systems.length; i++) {
			this.systems[i] = ECS.Systems[this.systems[i]];
		}
	}
};

//No entities, but, follow convention.
var loadingEntities = ECS.Scenes.Loading.entities; //Alias
var loadingState = 0;
var loadingHas = false;
var loadingWords = [
	"Loading World Data...",
	"Loading Images...",
	"Loading Sounds...",
	"Loading Models...",
	"Loading Textures..."
];

ECS.Systems.LoadingLogic = function LoadingLogic(_e) {
	if(!loadingHas) {
		switch(loadingState) {
			case 0:
				var xobj = new XMLHttpRequest();
				xobj.overrideMimeType("application/json");
				xobj.open('get', './src/json/theworld.json?', true);
				xobj.onreadystatechange = function() {
					if(xobj.readyState == 4 && xobj.status == "200") {
						data = JSON.parse(xobj.responseText);
						loadingState = 1;
						loadingHas = false;
					}
				}
				xobj.send(null);
				loadingHas = true;
				break;
			case 1:
				assets.loadImages(function() {
					loadingState = 2;
					loadingHas = false;
				});
				loadingHas = true;
				break;
			case 2:
				assets.loadSounds(function() {
					loadingState = 3;
					loadingHas = false;
				});
				loadingHas = true;
				break;
			case 3:
				assets.loadModels(function() {
					loadingState = 4;
					loadingHas = false;
				})
				//loadingHas = true; //Uncomment when implement a working model loader.
				break;
			case 4:
				assets.loadTextures(function() {
					loadingState = 5;
					loadingHas = false;
				})
				loadingHas = true;
				break;
			case 5:
				setTimeout(function() {
					gameState = "MainMenu"
				}, 1);
				loadingHas = true;
				break;
		}
	}
}

ECS.Systems.LoadingRender = function LoadingRender(_e) {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = "rgba(0, 0, 0, 0.125)";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = "black";

	ctx.save();
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	if(loadingState != 5) {
		ctx.fillText(loadingWords[loadingState], canvas.width / 2, canvas.height / 2);
		var extraPercentage = 0;
		if(loadingHas) {
			switch(loadingState) {
				case 1:
					ctx.fillText(assets.images._loaded.current + " / " + assets.images._loaded.total, canvas.width / 2, canvas.height / 2 + 20);
					extraPercentage = assets.images._loaded.current / assets.images._loaded.total;
					break;
				case 2:
					ctx.fillText(assets.sounds._loaded.current + " / " + assets.sounds._loaded.total, canvas.width / 2, canvas.height / 2 + 20);
					extraPercentage = assets.sounds._loaded.current / assets.sounds._loaded.total;
					break;
				case 3:
					ctx.fillText(assets.models._loaded.current + " / " + assets.models._loaded.total, canvas.width / 2, canvas.height / 2 + 20);
					extraPercentage = assets.models._loaded.current / assets.models._loaded.total;
					break;
				case 4:
					ctx.fillText(assets.textures._loaded.current + " / " + assets.textures._loaded.total, canvas.width / 2, canvas.height / 2 + 20);
					extraPercentage = assets.textures._loaded.current / assets.textures._loaded.total;
					break;
			}
		}
		ctx.strokeRect(canvas.width / 2 - 200, canvas.height / 2 - 50, 400, 24);
		ctx.fillRect(canvas.width / 2 - 200, canvas.height / 2 - 50, 400 * ((loadingState + extraPercentage) / loadingWords.length ), 24);
	} else {
		ctx.fillText("I'm loaded", canvas.width / 2, canvas.height / 2)
	}
	ctx.restore();
}