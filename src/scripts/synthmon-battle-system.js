/*
	Each part is standalone.

	How to define the Battle System?

	Window? Screen? Scene? Bundles?

	"Scene".
*/

ECS.Scenes.Battle = {
	"systems":[
		ECS.Systems.BattleControl,
		ECS.Systems.BattleLogic,
		ECS.Systems.BattleRender
		//ECS.Systems.WorldUI
	],
	"entities":[]
};



ECS.Systems.BattleControl = function BattleControl() {

}
ECS.Systems.BattleLogic = function BattleLogic() {

}
ECS.Systems.BattleRender = function BattleRender() {

}