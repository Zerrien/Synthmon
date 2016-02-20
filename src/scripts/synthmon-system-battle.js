/*
	Each part is standalone.
*/

/*
	Main todos:
		Replace all battleEntities with battleEntities
		Continue laying out the events.
		Make a fresh UI. (UHG.)
			Better in the long run, current me, I promise. -- future me
		Worry if the event system is dynamic enough.
*/

ECS.Scenes.Battle = {
	"systems":[
		"BattleControl",
		"BattleLogic",
		"BattleRender",
		"BattleUI"
	],
	"entities":[],
	"logic":function() {
		for(var i = 0 ; i < this.systems.length; i++) {
			if(this.systems[i]) {
				this.systems[i](battleEntities);
			}
		}
	},
	"init":function() {
		battleEntities = this.entities;
		for(var i = 0; i < this.systems.length; i++) {
			this.systems[i] = ECS.Systems[this.systems[i]];
		}
	}
};
var BattleController = {
	teams: [],
	configure: function (_pro, _ant) {
		battleEntities = [];
		//teams.push(_pro);
		//teams.push(_ant);
		this.teams.push({
			who:_pro,
			cur:0
		});
		this.teams.push({
			who:_ant,
			cur:0
		});
		this.state = 0;
		gameState = 2;

	},
	configureTeam: function(_who) {
	}
}
var BC = BattleController; 
ECS.Systems.BattleControl = function BattleControl(_e) {

}
ECS.Systems.BattleLogic = function BattleLogic(_e) {
	switch(BC.gameState) {
		case 0:
			break;
		case 1:
			break;
		case 2:
			break;
	}
}
ECS.Systems.BattleRender = function BattleRender(_e) {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = "rgba(0, 0, 0, 0.125)";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = "black";

	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	var perspectiveMatrix = makePerspective(Math.PI / 4, 800 / 600, 1, 128);
	
	var viewMatrix = getIdentity();

	setUniform("u_pMatrix", perspectiveMatrix);

	viewMatrix = matrixMultiply(viewMatrix, makeYRotation(Math.sin(tTime / 10000) * Math.PI));
	viewMatrix = matrixMultiply(viewMatrix, makeXRotation(Math.PI / 6));
	viewMatrix = matrixMultiply(viewMatrix, makeTranslation(0, 0, -10));
	setUniform("u_vMatrix", viewMatrix);


	var modelMatrix = getIdentity();
	modelMatrix = matrixMultiply(modelMatrix, makeYRotation(Math.PI + -1 * Math.PI /4));
	modelMatrix = matrixMultiply(modelMatrix, makeTranslation(1, 0, 1));
	setUniform("u_mMatrix", modelMatrix);
	setUniform("u_sampler", assets.textures['piggen_colored'].texture, 0);
	drawApp(assets.models.piggen);

	modelMatrix = getIdentity();

	modelMatrix = matrixMultiply(modelMatrix, makeYRotation(-1 * Math.PI /4));
	modelMatrix = matrixMultiply(modelMatrix, makeTranslation(-1, 0, -1));
	setUniform("u_mMatrix", modelMatrix);
	setUniform("u_sampler", assets.textures['piggen_colored'].texture, 0);
	drawApp(assets.models.piggen);

	modelMatrix = getIdentity();

	modelMatrix = makeScale(10, 10, 10);
	setUniform("u_mMatrix", modelMatrix);
	setUniform("u_sampler", assets.textures['grassGroundTexture'].texture, 0);
	drawApp(assets.models.groundPlane);

	tctx.clearRect(0, 0, 800, 600);
	tctx.drawImage(canvas, 0, 0);

	ctx.clearRect(0, 0, 800, 600);
	ctx.drawImage(canvas3D, 0, 0);
}
ECS.Systems.BattleUI = function BattleUI(_e) {

}