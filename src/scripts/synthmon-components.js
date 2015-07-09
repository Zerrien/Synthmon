ECS.Components.Inventory = function Inventory() {
	this.items = [];
}
ECS.Components.Inventory.prototype.name = "inventory";

ECS.Components.Trainer = function Trainer() {
	this.synthmon = [];
}
ECS.Components.Trainer.prototype.name = "trainer";


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

