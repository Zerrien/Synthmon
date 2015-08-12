function GUI() {
	this.elements = [];
	this.x = 0;
	this.y = 0;
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
		_element.parent = this;
		this.elements.push(_element);
		this.sortElements();
		
	},
	removeElement  :function(_element) {
		for(var i = 0; i < this.elements.length; i++) {
			if(this.elements[i] == _element) {
				this.elements.splice(i, 1);
			}
		}
		this.sortElements();
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
		for(var i = this.elements.length - 1; i >= 0; i--) {
			if(this.elements[i].control) {
				if(this.elements[i].control()) {
					return;
				}
			}
		}
	},
	sortElements : function() {
		this.elements.sort(function(_a, _b) {
			if(_a.zIndex && _b.zIndex) {
				if(_a.zIndex > _b.zIndex) {
					return 1;
				} else if (_a.zIndex < _b.zIndex) {
					return -1;
				} else {
					console.log("Two matching zIndexii...")
					return 0;
				}
			} else if (_a.zIndex) {
				return 1;
			} else if (_b.zIndex) {
				return -1;
			} else {
				return 0;
			}
		});
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
	this.w = _w;
	this.h = _h;

	this.zIndex = 0;

	this.parent = null;
	this.children = [];
}
gui_Container.prototype = {
	draw : function(_ctx) {
		_ctx.save();
		var offset = getTrueOffset(this);
		_ctx.fillStyle = "white";
		_ctx.fillRect(offset.x, offset.y, this.w, this.h);
		_ctx.strokeRect(offset.x, offset.y, this.w, this.h);
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
				if(this.children[i].control()) {
					return true;
				}
			}
		}
		var offset = getTrueOffset(this);
		if(mousePos.x > offset.x && mousePos.x <= offset.x + this.w && mousePos.y > offset.y && mousePos.y <= offset.y + this.h) {
			if(mouseClick || mousePress) {
				return true;
			}
		}

		return false;
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
					this.isDown = false;
					return true;
				}
				this.isDown = false;
			}
		} else {
			this.isOver = false;
			this.isDown = false;
		}
		return false;
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
	this.refreshList();

	this.observedLength = this.children.length;
	console.log(this.observedLength, this.list.length);
	this.parent = null;

	this.canvas = document.createElement("canvas");
	this.canvas.width = this.w;
	this.canvas.height = this.h;
	this.ctx = this.canvas.getContext("2d");
}

gui_List.prototype = {
	draw : function(_ctx) {
		if(this.observedLength - 3 != this.list.length) {
			this.refreshList();
			this.observedLength = this.children.length;
			//console.log("???");
		}
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
	},
	refreshList : function() {
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
	
		console.log("Ref: " + this.list.length);
		for(var i = 0; i < this.list.length; i++) {
			this.addChild(new gui_ListItem(this.list[i].name, i, this.w - 20, 40, function() {
			}, assets.images[this.list[i].image], this.list[i]));
		}
	}
}

function gui_ListItem(_string, _index, _w, _h, _action, _img, _item) {
	this.string = _string;
	this.index = _index;
	this.w = _w;
	this.h = _h;
	this.x = 0;
	this.y = 0;

	this.itemRef = _item;

	this.img = _img;

	this.parent = null;
}
gui_ListItem.prototype = {
	draw : function(_ctx) {
		_ctx.save();
		var offset = getLocalOffset(this);

		var scrollOffset = -1 * this.parent.scroll * (this.parent.list.length * this.h - this.parent.h);
		//-1 * this.curPercentage * (this.list.length * 32 - this.h) + 32 * i

		if(this.isDown) {
			offset.x += 1;
			offset.y += 1;
		}

		if(this.isOver) {
			_ctx.fillStyle = "red";
			_ctx.strokeStyle = "red";
		} else {
			_ctx.fillStyle = "black";
			_ctx.strokeStyle = "black";
		}

		_ctx.strokeRect(offset.x, offset.y + this.h * this.index + scrollOffset, this.w, this.h);
		_ctx.fillText(this.string, offset.x + this.w / 2, offset.y + this.h * this.index + this.h / 2 + scrollOffset);
		if(this.img) {
			_ctx.drawImage(this.img, offset.x, offset.y + this.h * this.index + scrollOffset, this.h, this.h);
		}

		_ctx.restore();
	},
	control : function() {
		var offset = getTrueOffset(this);
		var scrollOffset = -1 * this.parent.scroll * (this.parent.list.length * this.h - this.parent.h);
		if(mousePos.x > offset.x && mousePos.x <= offset.x + this.w && mousePos.y > offset.y + this.index * this.h + scrollOffset && mousePos.y <= offset.y + this.h + this.index * this.h + scrollOffset) {
			if(Math.abs(scrollOffset) <= this.h + this.h * this.index && mousePos.y >= offset.y && mousePos.y <= offset.y + this.parent.h) {
				this.isOver = true;
				if(mouseClick) {
					mouseClick = false;
					this.isDown = true;
				} else if (!mouseClick && !mousePress) {
					if(this.isDown) {
						if(this.onInteract) {
							this.onInteract();
						} else {
							//console.log(this.itemRef);
							//For now, they're items.

							//World use, world equip, battle use.
							if(this.itemRef.use.worlduse) {
								var use = this.itemRef.use.worlduse;
								use.ref = this.itemRef;
								if(use.action == "target_synthmon") {
									var synthContainer = new gui_Container(40, 40, 400, 400);
									ECS.Scenes.World.gui.addElement(synthContainer, -1);

									console.log(use);

									synthContainer.addChild(new gui_Text("Use " + this.string + " on who?", 200, 20));
									synthContainer.addChild(new gui_PlayerSynthmon(20, 40, 400 - 40, 400 - 60, function() {
										switch(use.effect.target) {
											case "hp":
												if(use.effect.type == "add") {
													this.synthmonRef.heal(use.effect.amount);
												} else if (use.effect.type == "sub") {
													this.synthmonRef.heal(-1 * use.effect.amount);
												}
												break;
											default:
												console.warn("Attempting to apply unknown effect target... Debug further.")
												break;
										}

										player.c("inventory").removeItem(use.ref);

										ECS.Scenes.World.gui.removeElement(synthContainer);
									}));
									synthContainer.addChild(new gui_Button("X", 400 - 20, 0, 20, 20, function() {
										ECS.Scenes.World.gui.removeElement(synthContainer);
									}));

								}
							}

						}
					}
					this.isDown = false;
				}
			} else {
				this.isOver = false;
				this.isDown = false;
			}
		} else {
			this.isOver = false;
			this.isDown = false;
		}
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

function gui_Text(_string, _x, _y) {
	this.string = _string;
	this.x = _x;
	this.y = _y;
	this.parent = null;
}
gui_Text.prototype = {
	draw : function(_ctx) {
		_ctx.save();

		var offset = getTrueOffset(this);

		_ctx.textAlign = "center";
		_ctx.textBaseline = "middle";

		_ctx.fillStyle = "black";
		_ctx.fillText(this.string, offset.x, offset.y);

		_ctx.restore();
	}
}


function gui_PlayerSynthmon(_x, _y, _w, _h, _func) {
	this.x = _x;
	this.y = _y;

	this.w = _w;
	this.h = _h;

	this.func = _func;

	this.children = [];

	for(var i = 0; i < player.c("trainer").synthmon.length; i++) {
		var synth = new gui_Synthmon(player.c("trainer").synthmon[i], i, this.w / 2, this.h / 3);
		synth.func = this.func;
		synth.onInteract = function() {
			this.func();
		}
		this.addChild(synth);
	}

	this.parent = null;
}
gui_PlayerSynthmon.prototype = {
	draw : function(_ctx) {
		_ctx.save();
		var offset = getTrueOffset(this);

		_ctx.strokeRect(offset.x, offset.y, this.w, this.h);

		for(var i = 0; i < this.children.length; i++) {
			if(this.children[i].draw) {
				this.children[i].draw(_ctx);
			}
		}
		_ctx.restore();
	},
	addChild : function(_obj) {
		this.children.push(_obj);
		_obj.parent = this;
	},
	control : function(_obj) {
		for(var i = 0; i < this.children.length; i++) {
			if(this.children[i].control) {
				this.children[i].control();
			}
		}
	}
}

function gui_Synthmon(_synthmonRef, _i, _w, _h) {
	this.x = 0;
	this.y = 0;
	this.w = _w;
	this.h = _h;

	this.index = _i;
	this.synthmonRef = _synthmonRef;
}
gui_Synthmon.prototype = {
	draw : function(_ctx) {
		_ctx.save();
		var offset = getTrueOffset(this);
		if(this.isDown) {
			offset.x += 1;
			offset.y += 1;
		}
		//console.log()
		if(this.isOver) {
			_ctx.strokeStyle = "red";
		} else {
			_ctx.strokeStyle = "black";
		}
		_ctx.strokeRect(offset.x + (this.index % 2) * this.w, offset.y + (this.index - (this.index % 2)) / 2 * this.h, this.w, this.h);
		_ctx.drawImage(assets.images['piggen_front'], offset.x + (this.index % 2) * this.w, offset.y + (this.index - (this.index % 2)) / 2 * this.h + this.h / 4, this.h / 2, this.h / 2);
		_ctx.fillStyle = "black";
		_ctx.fillText(this.synthmonRef.name, offset.x + this.h / 2 + (this.index % 2) * this.w, offset.y + 20 + (this.index - (this.index % 2)) / 2 * this.h);
		_ctx.fillText(this.synthmonRef.curHP + " / " + this.synthmonRef.maxHP, offset.x + 10 + (this.index % 2) * this.w, offset.y + this.h - 25 + (this.index - (this.index % 2)) / 2 * this.h)

		_ctx.fillStyle = "red";
		_ctx.fillRect(offset.x + (this.index % 2) * this.w, offset.y + this.h - 20 + (this.index - (this.index % 2)) / 2 * this.h, this.w, 20);

		_ctx.fillStyle = "green";
		_ctx.fillRect(offset.x + (this.index % 2) * this.w, offset.y + this.h - 20 + (this.index - (this.index % 2)) / 2 * this.h, this.w * this.synthmonRef.curHP / this.synthmonRef.maxHP, 20);

		_ctx.restore();
	},
	control : function() {
		var offset = getTrueOffset(this);
		
		if(mousePos.x > offset.x + (this.index % 2) * this.w && mousePos.x <= offset.x + (this.index % 2) * this.w + this.w 
			&& mousePos.y > offset.y + (this.index - (this.index % 2)) / 2 * this.h && mousePos.y <= offset.y + (this.index - (this.index % 2)) / 2 * this.h + this.h) {
			this.isOver = true;
			if(mouseClick) {
				mouseClick = false;
				this.isDown = true;
			} else if (!mouseClick && !mousePress) {
				if(this.isDown) {
					this.onInteract();
					this.isDown = false;
					return true;
				}
				this.isDown = false;
			}
		} else {
			this.isOver = false;
			this.isDown = false;
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
	},
	control : function() {
		if(keyboardKeys[32]) {
			keyboardKeys[32] = false;
			if(this.onInteract) {
				this.onInteract();
			}
		}
	}
}