ECS.Components.BattleSprite = function BattleSprite(_img) {
	this.img = _img || new Image();
}
ECS.Components.BattleSprite.prototype.name = "battlesprite";

ECS.Components.BattleShake = function BattleShake() {

}
ECS.Components.BattleShake.prototype.name = "battleshake";

ECS.Components.BattleAnimated = function BattleAnimation(_w, _h, _t) {
	this.width = _w;
	this.height = _h;
	this.time = _t;
	this.curTime = 0;
}
ECS.Components.BattleAnimated.prototype.name = "battleanimated";