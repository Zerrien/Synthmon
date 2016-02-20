function createUIElement(_type, _x, _y, _pos) {
	var tElem = document.createElement(_type);
	if(_pos) {
		tElem.style.position = "absolute";
	}
	tElem.style.left = _x + "px";
	tElem.style.top = _y + "px";
	return tElem;
}


/*
function testFunc(_gui) {
	_gui.addChild(new GUIElement(50, 50));
	_gui.addChild(new GUIContainer(100, 50, 100, 100));
	_gui.addChild(new GUITextLine(50, 100, "Hello, world!"));
}

function GUIController() {
	this.elements = [];
}
GUIController.prototype = {
	render: function(_ctx) {
		for(var i = 0; i < this.elements.length; i++) {
			this.elements[i].draw(_ctx);
		}
	},
	control: function() {

	},
	addChild: function(_elem) {
		this.elements.push(_elem);
	}
}
function GUIElement(_x, _y) {
	this.x = _x;
	this.y = _y;
	this.zIndex;
	this.children = [];
	this.parent;
}
GUIElement.prototype = {
	draw: function(_ctx) {
		_ctx.save();
		_ctx.beginPath();
		_ctx.arc(this.x, this.y, 10, 0, Math.PI * 2);
		_ctx.stroke();
		this.drawChildren(_ctx);
		_ctx.restore();
	},
	drawChildren: function(_ctx) {
		for(var i = 0; i < this.children.length; i++) {
			this.children[i].draw(_ctx);
		}
	},
	addChild: function(_elem) {
		this.children.push(_elem);
		_elem.parent = this;
	}
}
GUIContainer.prototype = new GUIElement();
GUIContainer.prototype.constructor = GUIContainer;
function GUIContainer(_x, _y, _w, _h) {
	this.x = _x;
	this.y = _y;
	this.w = _w;
	this.h = _h;
	this.parent;
	this.canvas = document.createElement("canvas");
	this.canvas.width = this.w;
	this.canvas.height = this.h;
	this.ctx = this.canvas.getContext("2d");
}
GUIContainer.prototype.draw = function(_ctx) {
	_ctx.save();
	this.ctx.save();
	this.ctx.fillStyle = "white";
	this.ctx.fillRect(0, 0, this.w, this.h);
	this.ctx.strokeRect(0, 0, this.w, this.h);
	this.drawChildren(this.ctx);
	this.ctx.restore();
	_ctx.drawImage(this.canvas, this.x, this.y);
	_ctx.restore();
}
GUITextLine.prototype = new GUIElement();
GUITextLine.prototype.constructor = GUITextLine;
function GUITextLine(_x, _y, _s) {
	this.x = _x;
	this.y = _y;
	this.s = _s;
	this.parent;
}
GUITextLine.prototype.draw = function(_ctx) {
	_ctx.save();
	_ctx.fillText(this.s, this.x, this.y);
	_ctx.restore();
}
*/
/*
function GUI() {
	this.elements = [];
}
GUI.prototype = {
	getHighestIndex : function() {
		var maxIndex = 0;
		for(var i = 0; i < this.elements.length; i++) {
			if(this.elements[i].zIndex) {
				if(this.elements[i].zIndex > maxIndex) {
					maxIndex = this.elements[i].zIndex;
				}
			}
		}
		return maxIndex;
	},
	getOfHighestIndex : function() {
		var maxIndex = -1;
		var highest = null;
		for(var i = 0; i < this.elements.length; i++) {
			if(this.elements[i].zIndex) {
				if(this.elements[i].zIndex > maxIndex) {
					maxIndex = this.elements[i].zIndex;
					highest = this.elements[i];
				}
			}
		}
		return highest;
	},
	addElement : function(_element, _index) {
		if(_index == -1) {
			_element.zIndex = this.getHighestIndex() + 1;
		}
		this.elements.push(_element);
	},
	removeElement  :function(_element) {
		for(var i = 0; i < this.elements.length; i++) {
			if(this.elements[i] == _element) {
				this.elements.splice(i, 1);
			}
		}
	},
	draw : function(_ctx) {
		for(var i = 0; i < this.elements.length; i++) {
			if(this.elements[i].draw) {
				this.elements[i].draw(_ctx);
			}
		}
	},
	logic : function() {
		for(var i = 0; i < this.elements.length; i++) {
		}
	},
	control : function() {
		if(keyboardKeys[32]) {
			keyboardKeys[32] = false;
			if(this.getOfHighestIndex().onInteract) {
				this.getOfHighestIndex().onInteract();
			}
		}
	}
}

function gui_DialogBox(_string) {
	this.string = _string;
	this.zIndex = 0;
}
gui_DialogBox.prototype = {
	draw : function(_ctx) {
		_ctx.save();
		_ctx.fillStyle = "white";
		_ctx.fillRect(canvas.width / 8, canvas.height * 2 / 3, canvas.width * 6 / 8, canvas.height / 3 - 50);

		_ctx.fillStyle = "black"
		_ctx.font = "24px arial"
		_ctx.fillText(this.string, canvas.width / 8, canvas.height * 2 / 3 + 32);
		_ctx.restore();
	}
}
*/