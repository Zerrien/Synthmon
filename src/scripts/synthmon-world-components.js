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
ECS.Components.WorldFaces.prototype = {
	inverseFace : function(_facing) {
		return faces_inverse[_facing];
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

ECS.Components.WorldKeyboardControlled = function WorldKeyboardControlled() {
}
ECS.Components.WorldKeyboardControlled.prototype.name = "worldkeyboardcontrolled";

ECS.Components.WorldCollider = function WorldCollider() {

}
ECS.Components.WorldCollider.prototype.name = "worldcollider";

ECS.Components.WorldLargeCollision = function WorldLargeCollision(_w, _h, _x, _y) {
	//Some things are large, and collidable.
	this.width = _w;
	this.height = _h;
	this.xOffset = _x || 0;
	this.yOffset = _y || 0;
}
ECS.Components.WorldLargeCollision.prototype.name = "worldlargecollision";
ECS.Components.WorldSize = function WorldSize(_w, _h, _x, _y) {
	this.width = _w;
	this.height = _h;
	this.xAnchor = _x || 0;
	this.yAnchor = _y || 0;
}
ECS.Components.WorldSize.prototype.name = "worldsize";

ECS.Components.WorldPushable = function WorldPushable() {
}
ECS.Components.WorldPushable.prototype.name = "worldpushable";

ECS.Components.WorldCanPush = function WorldCanPush(_val) {
	this.strength = _val;
	this.curStrength = _val;
}
ECS.Components.WorldCanPush.prototype.name = "worldcanpush";

ECS.Components.WorldPusher = function WorldPusher() {

}
ECS.Components.WorldPusher.prototype.name = "worldpusher";

ECS.Components.WorldPortal = function WorldPortal(_dest, _params, _xOff, _yOff) {
	this.destination = _dest;
	this.params = _params;
	this.xOff = _xOff;
	this.yOff = _yOff;
}
ECS.Components.WorldPortal.prototype.name = "worldportal";