ECS.Components.Inventory = function Inventory() {
	this.items = [];
}
ECS.Components.Inventory.prototype = {
	removeItem : function(_item) {

		for(var i = 0; i < this.items.length; i++) {
			if(this.items[i] == _item) {
				console.log(_item);
				console.log(this.items.length);
				this.items.splice(i, 1);
				console.log(this.items.length);
			}
		}
	}
}
ECS.Components.Inventory.prototype.name = "inventory";

ECS.Components.Trainer = function Trainer(_name) {
	this.synthmon = [];
	this.tName = "DEV_NAME" || _name;
}
ECS.Components.Trainer.prototype = {
	hasHealthy : function(_exclude) {
		var healthy = [];
		for(var i = 0; i < this.synthmon.length; i++) {
			if(this.synthmon[i].curHP > 0 && this.synthmon[i] != _exclude) {
				healthy.push(this.synthmon[i])
			}
		}
		return healthy.length > 0 ? healthy : null;
	}
}
ECS.Components.Trainer.prototype.name = "trainer";

ECS.Components.Revives = function Revives() {
	this.zone = "playerUpstairs";
	this.position = {x:0, y:0};
}
ECS.Components.Revives.prototype.name = "revives";


ECS.Components.UIPosition = function UIPosition(_x, _y) {
	this.x = _x;
	this.y = _y;
}
ECS.Components.UIPosition.prototype.name = "uiposition";

ECS.Components.UIList = function UIList(_options, _terminate) {
	this.options = _options;
	this.curIndex = 0;
	this.terminate = _terminate;
}
ECS.Components.UIList.prototype = {
	up : function() {
		this.curIndex--;
		if(this.curIndex < 0) {
			this.curIndex = this.options.length - 1;
		}
	},
	down : function() {
		this.curIndex++;
		if(this.curIndex > this.options.length - 1) {
			this.curIndex = 0;
		}
	}
}
ECS.Components.UIList.prototype.name = "uilist";

ECS.Components.UIZIndex = function UIZIndex(_num) {
	this.zindex = _num;
}
ECS.Components.UIZIndex.prototype.name = "uizindex";

ECS.Components.UIDialogueBox = function UIDialogueBox(_string) {
	this.string = _string;
	this.tick = 50;
	this.curTime = 0;
}
ECS.Components.UIDialogueBox.prototype = {
	progress : function() {
		if(this.curTime < this.string.length * this.tick) {
			this.curTime = this.string.length * this.tick;
			return false;
		} else {
			return true;
		}
	}
}
ECS.Components.UIDialogueBox.prototype.name = "uidialoguebox";

