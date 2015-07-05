ECS.Components.WorldPosition = function WorldPosition(_x, _y, _zone) {
	this.zone = _zone || 0;
	this.x = _x;
	this.y = _y;
}
ECS.Components.WorldPosition.prototype.name = "worldposition";

ECS.Components.WorldSprite = function WorldSprite(_img) {
	this.img = _img;
}
ECS.Components.WorldSprite.prototype.name = "worldsprite";

ECS.Components.WorldFaces = function WorldFaces(_facing) {
	this.facing = _facing || "south";
}
var faces_inverse = {
	"north":"south",
	"south":"north",
	"east":"west",
	"west":"east"
}
var faces_xy = {
	"north":{x:0, y:-1},
	"south":{x:0, y:1},
	"east":{x:1, y:0},
	"west":{x:-1, y:0},
}
ECS.Components.WorldFaces.prototype = {
	inverseFace : function(_facing) {
		_facing = _facing || this.facing;
		return faces_inverse[_facing];
	},
	facingTile : function() {
		return faces_xy[this.facing];
	}
}
ECS.Components.WorldFaces.prototype.name = "worldfaces";

ECS.Components.WorldSheet = function WorldSheet(_num, _w, _h) {
	this.num = _num;
	this.width = _w;
	this.height = _h;
}
ECS.Components.WorldSheet.prototype.name = "worldsheet";

ECS.Components.WorldMoves = function WorldMoves() {
	this.state = "standing";
	this.destX = 0;
	this.destY = 0;
	this.curSpeed = 100;
	this.baseSpeed = 250;
	this.curCycle = 0;
}
ECS.Components.WorldMoves.prototype.name = "worldmoves";

ECS.Components.WorldAnimation = function WorldAnimation(_params) {
	this.params = _params || {};
}
ECS.Components.WorldAnimation.prototype.name = "worldanimation";

ECS.Components.WorldKeyboardControlled = function WorldKeyboardControlled() {
}
ECS.Components.WorldKeyboardControlled.prototype.name = "worldkeyboardcontrolled";

ECS.Components.WorldCollider = function WorldCollider() {

}
ECS.Components.WorldCollider.prototype.name = "worldcollider";

ECS.Components.WorldFacingCollider = function WorldFacingCollider() {

}
ECS.Components.WorldFacingCollider.prototype.name = "worldfacingcollider";

ECS.Components.WorldLargeCollision = function WorldLargeCollision(_w, _h, _x, _y) {
	//Some things are large, and collidable.
	this.width = _w || 1;
	this.height = _h || 1;
	this.xOffset = _x || 0;
	this.yOffset = _y || 0;
}
ECS.Components.WorldLargeCollision.prototype.name = "worldlargecollision";

ECS.Components.WorldSize = function WorldSize(_w, _h) {
	this.width = _w || 1;
	this.height = _h || 1;
}
ECS.Components.WorldSize.prototype.name = "worldsize";


ECS.Components.WorldOffset = function WorldOffset(_x, _y) {
	this.xOffset = _x || 0;
	this.yOffset = _y || 0;
}

ECS.Components.WorldOffset.prototype.name = "worldoffset";


ECS.Components.WorldPushable = function WorldPushable() {
}
ECS.Components.WorldPushable.prototype.name = "worldpushable";

ECS.Components.WorldCanPush = function WorldCanPush(_val) {
	this.strength = _val;
	this.curStrength = _val;
}
ECS.Components.WorldCanPush.prototype.name = "worldcanpush";

ECS.Components.WorldPortal = function WorldPortal(_dest, _params, _xOff, _yOff) {
	this.destination = _dest;
	this.params = _params;
	this.xOff = _xOff;
	this.yOff = _yOff;
}
ECS.Components.WorldPortal.prototype.name = "worldportal";

/*
	AI Components
*/
ECS.Components.WorldConveyor = function WorldConveyor(_type) {
	this.type = _type || "spinning";
}
ECS.Components.WorldConveyor.prototype.name = "worldconveyor";

ECS.Components.WorldSuperPusher = function WorldSuperPusher() {

}
ECS.Components.WorldSuperPusher.prototype.name = "worldsuperpusher";
ECS.Components.WorldStopper = function WorldStopper() {

}
ECS.Components.WorldStopper.prototype.name = "worldstopper";

ECS.Components.WorldChatty = function WorldChatty(_saying) {
	this.saying = _saying;
}
ECS.Components.WorldChatty.prototype.name = "worldchatty";

ECS.Components.WorldSlippery = function WorldSlippery() {
}
ECS.Components.WorldSlippery.prototype.name = "worldslippery";

ECS.Components.WorldFloor = function WorldFloor() {

}
ECS.Components.WorldFloor.prototype.name = "worldfloor";