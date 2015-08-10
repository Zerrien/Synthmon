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
		for(var i = 0; i < this.elements.length; i++) {
			if(this.elements[i].control) {
				this.elements[i].control();
			}
		}
	}
}

function getTrueOffset(_obj) {
	var tObj = _obj;
	var x = y = 0;
	while(tObj.parent) {
		x += tObj.x;
		y += tObj.y;
		tObj = tObj.parent;
	}
	return {x:x, y:y};
}
function getLocalOffset(_obj) {
	var tObj = _obj;
	var x = y = 0;
	while(tObj.parent) {
		if(!tObj.canvas) {
			x += tObj.x;
			y += tObj.y;
			tObj = tObj.parent;
		} else {
			tObj = {};
		}
	}
	return {x:x, y:y};
}


function gui_Container(_x, _y, _w, _h) {
	this.x = _x;
	this.y = _y;
	this.width = _w;
	this.height = _h;

	this.zIndex = 0;

	this.parent = null;
	this.children = [];
}
gui_Container.prototype = {
	draw : function(_ctx) {
		_ctx.save();
		var offset = getTrueOffset(this);
		_ctx.fillStyle = "white";
		_ctx.fillRect(offset.x, offset.y, this.width, this.height);
		_ctx.strokeRect(offset.x, offset.y, this.width, this.height);
		for(var i = 0; i < this.children.length; i++) {
			if(this.children[i].draw) {
				this.children[i].draw(_ctx);
			}
		}
		_ctx.restore();
	},
	control : function() {
		for(var i = 0; i < this.children.length; i++) {
			if(this.children[i].control) {
				this.children[i].control();
			}
		}
	},
	addChild : function(_obj) {
		this.children.push(_obj);
		_obj.parent = this;
	}
}

function gui_Button(_string, _x, _y, _w, _h, _action) {
	this.x = _x;
	this.y = _y;
	this.w = _w;
	this.h = _h;

	this.string = _string;
	this.onInteract = _action;

	this.isOver = false;
	this.isDown = false;

	this.parent = null;
}

gui_Button.prototype = {
	draw : function(_ctx) {
		_ctx.save();
		var offset = getLocalOffset(this);
		if(this.isDown) {
			offset.x += 1;
			offset.y += 1;
		}

		_ctx.textAlign = "center";
		_ctx.textBaseline = "middle";

		if(this.isOver) {
			_ctx.strokeStyle = "red";
			_ctx.fillStyle = "red";
		} else {
			_ctx.strokeStyle = "black";
			_ctx.fillStyle = "black";
		}
		_ctx.strokeRect(offset.x, offset.y, this.w, this.h);
		_ctx.fillText(this.string, offset.x + this.w / 2, offset.y + this.h / 2)

		_ctx.restore();
	},
	control : function() {
		var offset = getTrueOffset(this);
		if(mousePos.x > offset.x && mousePos.x <= offset.x + this.w && mousePos.y > offset.y && mousePos.y <= offset.y + this.h) {
			this.isOver = true;
			if(mouseClick) {
				mouseClick = false;
				this.isDown = true;
			} else if (!mouseClick && !mousePress) {
				if(this.isDown) {
					this.onInteract();
				}
				this.isDown = false;
			}
		} else {
			this.isOver = false;
			this.isDown = false;
		}
	}
}

function gui_List(_list, _x, _y, _w, _h) {
	this.list = _list;
	this.x = _x;
	this.y = _y;
	this.w = _w;
	this.h = _h;

	this.scroll = 0;

	this.children = [];

	this.addChild(new gui_Button("^", this.w - 20, 0, 20, 20, function() {
		console.log("^");
		this.parent.scroll -= 0.1;
		if(this.parent.scroll < 0) {
			this.parent.scroll = 0;
		}
	}));
	this.addChild(new gui_Button("v", this.w - 20, this.h - 20, 20, 20, function() {
		console.log("v");
		this.parent.scroll += 0.1;
		if(this.parent.scroll > 1) {
			this.parent.scroll = 1;
		}
	}));
	this.addChild(new gui_Slider(this, "scroll", this.w - 20, 20, 20, this.h - 40, function() {

	}))

	for(var i = 0; i < this.list.length; i++) {
		this.addChild(new gui_ListItem(this.list[i].name, i, this.w - 20, 40, function() {

		}, assets.images[this.list[i].image]));
		console.log(assets.images);
	}

	this.parent = null;

	this.canvas = document.createElement("canvas");
	this.canvas.width = this.w;
	this.canvas.height = this.h;
	this.ctx = this.canvas.getContext("2d");
}

gui_List.prototype = {
	draw : function(_ctx) {
		var offset = getTrueOffset(this);
		var localOffset = getLocalOffset(this);

		this.ctx.clearRect(0, 0, this.w, this.h);
		this.ctx.strokeRect(localOffset.x, localOffset.y, this.w, this.h);
		for(var i = 0; i < this.children.length; i++) {
			if(this.children[i].draw) {
				this.children[i].draw(this.ctx);
			}
		}

		_ctx.save();
		_ctx.drawImage(this.canvas, offset.x, offset.y);
		_ctx.restore();
	},
	addChild : function(_obj) {
		this.children.push(_obj);
		_obj.parent = this;
	},
	control : function() {
		for(var i = 0; i < this.children.length; i++) {
			if(this.children[i].control) {
				this.children[i].control();
			}
		}
	}
}

function gui_ListItem(_string, _index, _w, _h, _action, _img) {
	this.string = _string;
	this.index = _index;
	this.w = _w;
	this.h = _h;
	this.x = 0;
	this.y = 0;

	this.img = _img;

	this.parent = null;
}
gui_ListItem.prototype = {
	draw : function(_ctx) {
		_ctx.save();
		var offset = getLocalOffset(this);

		var scrollOffset = this.parent.list.length * this.parent.scroll * this.h;
		scrollOffset = -1 * this.parent.scroll * (this.parent.list.length * this.h - this.parent.h);
		//-1 * this.curPercentage * (this.list.length * 32 - this.h) + 32 * i
		_ctx.fillStyle = "black";

		_ctx.strokeRect(offset.x, offset.y + this.h * this.index + scrollOffset, this.w, this.h);
		_ctx.fillText(this.string, offset.x + this.w / 2, offset.y + this.h * this.index + this.h / 2 + scrollOffset);
		if(this.img) {
			_ctx.drawImage(this.img, offset.x, offset.y + this.h * this.index + scrollOffset, this.h, this.h);
		}

		_ctx.restore();
	}
}

function gui_Slider(_who, _what, _x, _y, _w, _h, _action) {
	this.obj = _who;
	this.var = _what;

	//this.scroll = this.obj[this.var];

	this.x = _x;
	this.y = _y;
	this.w = _w;
	this.h = _h;
	this.action = _action;
}

gui_Slider.prototype = {
	draw : function (_ctx) {
		_ctx.save();
		var offset = getLocalOffset(this);
		var scroll = this.obj[this.var];
		_ctx.strokeRect(offset.x, offset.y, this.w, this.h);
		if(this.isOver) {
			_ctx.strokeStyle = "red";
		} else {
			_ctx.strokeStyle = "black";
		}
		_ctx.strokeRect(offset.x, offset.y + scroll * (this.h - this.w), this.w, this.w);
		_ctx.restore();
	},
	control : function() {
		var offset = getTrueOffset(this);
		var scroll = this.obj[this.var];
		if(mousePos.x > offset.x && mousePos.x <= offset.x + this.w && mousePos.y > offset.y + scroll * (this.h - this.w) && mousePos.y <= offset.y + this.w + scroll * (this.h - this.w)) {
			this.isOver = true;
			if(mouseClick) {
				mouseClick = false;
				this.isDown = true;
				this.yOff = mousePos.y - offset.y - scroll * (this.h - this.w);
			} else if (!mouseClick && !mousePress) {
				if(this.isDown) {
				}
				this.isDown = false;
			}
		} else {
			this.isOver = false;
			if (!mouseClick && !mousePress) {
				this.isDown = false;
			}
		}
		if(this.isDown) {
			this.obj[this.var] = Math.max(Math.min((mousePos.y - offset.y - this.yOff) / this.h, 1), 0);
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