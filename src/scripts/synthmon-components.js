ECS.Components.UIPosition = function UIPosition(_x, _y) {
	this.x = _x;
	this.y = _y;
}
ECS.Components.UIPosition.prototype.name = "uiposition";

ECS.Components.UIList = function UIList(_options) {
	this.options = _options;
	this.curIndex = 0;
}
ECS.Components.UIList.prototype.name = "uilist";




/*

ECS.Components.PlayerID = function PlayerID(_id) {
	this.id = _id;
}
ECS.Components.PlayerID.prototype.name = "playerid";

//Owns Synthmon
ECS.Components.Trainer = function Trainer() {
	this.monsters = [];
}
ECS.Components.Trainer.prototype.name = "trainer";

ECS.Components.Inventory = function Inventory() {
	this.items = [];
}
ECS.Components.Inventory.prototype.name = "inventory";

ECS.Components.WorldSprite = function WorldSprite(_img) {
	//Nearly everything has a sprite
	this.img = _img;
}
ECS.Components.WorldSprite.prototype.name = "worldsprite";
ECS.Components.WorldPosition = function WorldPosition(_x, _y, _zone) {
	//Nearly everything has a position
	this.zone = _zone || 0;
	this.x = _x;
	this.y = _y;
}
ECS.Components.WorldPosition.prototype.name = "worldposition";
ECS.Components.WorldFaces = function WorldFaces(_facing) {
	//Some things can look in a direction
	this.facing = _facing;
}
ECS.Components.WorldFaces.prototype = {
	inverseFace : function() {
		switch(this.facing) {
			case "left":
				return "right";
				break;
			case "right":
				return "left";
				break;
			case "down":
				return "up";
				break;
			case "up":
				return "down";
				break;
		}
	}
};
ECS.Components.WorldFaces.prototype.name = "worldfaces";
ECS.Components.WorldSheet = function WorldSheet(_tileNum) {
	//0, 1, 2, 3,
	//4, 5, 6, 7,
	//8, 9, 10, 11,
	//12
	this.num = _tileNum;
}
ECS.Components.WorldSheet.prototype.name = "worldsheet";
ECS.Components.WorldCollision = function WorldCollision() {
	//Some things are collidable
}
ECS.Components.WorldCollision.prototype.name = "worldcollision";
ECS.Components.WorldLargeCollision = function WorldLargeCollision(_w, _h, _x, _y) {
	//Some things are large, and collidable.
	this.width = _w;
	this.height = _h;
	this.xOffset = _x;
	this.yOffset = _y;
}
ECS.Components.WorldLargeCollision.prototype.name = "worldlargecollision";
ECS.Components.WorldSize = function WorldSize(_w, _h, _x, _y) {
	this.width = _w;
	this.height = _h;
	this.xAnchor = _x || 0;
	this.yAnchor = _y || 0;
}
ECS.Components.WorldSize.prototype.name = "worldsize";

ECS.Components.WorldMoves = function WorldMoves() {
	//Some objects can move
	this.state = "standing";
	this.destX = 0;
	this.destY = 0;
	this.speed = 250;
	this.curCycle = 0;
}
ECS.Components.WorldMoves.prototype.name = "worldmoves";

ECS.Components.WorldInteractable = function WorldInteractable(_event) {
	//Some things can be 'used' in some way
	//Chatting, entering a door, picking up.
	this.act = _event;
}
ECS.Components.WorldInteractable.prototype.name = "worldinteractable";

ECS.Components.WorldChatty = function WorldChatty(_string) {
	this.string = _string;
}
ECS.Components.WorldChatty.prototype.name = "worldchatty";

ECS.Components.WorldKeyboardControlled = function WorldKeyboardControlled() {
}
ECS.Components.WorldKeyboardControlled.prototype.name = "worldkeyboardcontrolled";

ECS.Components.MovementAI = function MovementAI() {
}
ECS.Components.MovementAI.prototype.name = "movementai";

ECS.Components.LineDetectionAI = function LineDetectionAI(_range) {
	this.range = _range;
}
ECS.Components.LineDetectionAI.prototype.name = "linedetectionai"

ECS.Components.UIText = function UIText(_str, _spd) {
	this.text = _str;
	this.speed = _spd;
	this.curTime = 0;
	this.hasCont = false;
}
ECS.Components.UIText.prototype = {
	isComplete : function() {
		if(this.text.length * this.speed < this.curTime && this.hasCont) {
			return true;
		}
		return false;
	}
}
ECS.Components.UIText.prototype.name = "uitext";
ECS.Components.UIPosition = function UIPosition(_x, _y) {
	this.x = _x;
	this.y = _y;
}
ECS.Components.UIPosition.prototype.name = "uiposition";

ECS.Components.Action = function Action(_act) {
	this.act = _act;
}
ECS.Components.Action.prototype.name = "action";

ECS.Components.KeyboardEvent = function KeyboardEvent(_key, _event) {
	this.key = _key;
	this.act = _event;
}
ECS.Components.KeyboardEvent.prototype.name = "keyboardevent";

ECS.Components.MonsterSprite = function MonsterSprite(_ref, _index) {
	this.ref = _ref;
	this.index = _index;
}
ECS.Components.MonsterSprite.prototype.name = "monstersprite";

ECS.Components.BattleSpriteShake = function BattleSpriteShake(_mX, _mY) {
	this.curTime = 0;
	this.maxX = _mX;
	this.maxY = _mY;
}
ECS.Components.BattleSpriteShake.prototype.name = "battlespriteshake";

ECS.Components.HealthBox = function HealthBox(_ref, _index) {
	this.ref = _ref;
	this.index = _index;
}
ECS.Components.HealthBox.prototype.name = "healthbox";

ECS.Components.MenuOptions = function MenuOptions(_list) {
	this.list = _list;
	this.curIndex = 0;
	this.zDepth = 0;
}
ECS.Components.MenuOptions.prototype = {
	advance : function() {
		this.curIndex++;
		if(this.curIndex >= this.list.length) {
			this.curIndex = 0;
		}
	},
	reverse : function() {
		this.curIndex--;
		if(this.curIndex < 0) {
			this.curIndex = this.list.length - 1;
		}
	}
}
ECS.Components.MenuOptions.prototype.name = "menuoptions";
*/