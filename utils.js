'use strict'

class Matrix {
	constructor() {
		if(typeof arguments[0] == "object" && arguments[0].length !== undefined) {
			if(arguments[0].length == 9) {
				console.log("Array 3x3!");
			} else if (arguments[0].length == 16) {
				console.log("Array 4x4!");
			}
			// Stuff will go here
		} else if (arguments.length == 9) {
			for(var i = 0; i < arguments.length; i++) {
				if(typeof arguments[i] !== 'number') {
					throw "PAnIC";
				}
			}
			// Stuff will go here
		} else if (arguments.length == 12) {
			for(var i = 0; i < arguments.length; i++) {
				if(typeof arguments[i] !== 'number') {
					throw "PAnIC";
				}
			}
			// Stuff will go here
		}
	}
	identity() {
		return "oh yes";
	}
	static identity() {
		return "oh no";
	}
	get determinant() {
		return "oh goodness";
	}
}
class Vector {
	constructor() {

	}
}

var a = new Matrix([0, 1, 2, 3, 4, 5, 6, 7, "a"]);
console.log(a.identity());
console.log(Matrix.identity());