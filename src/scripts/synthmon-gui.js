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