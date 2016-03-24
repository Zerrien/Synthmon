'use strict'

class Matrix {
	constructor() {
		if(typeof arguments[0] == "object" && arguments[0].length !== undefined) {
			if(arguments[0].length == 9) {
				console.log("Array 3x3!");
				for(var i = 0; i < arguments[0].length; i++) {
					if(typeof arguments[0][i] !== 'number') {
						throw "more panic!"
					}
				}
				this.size = 3;
				this.array = arguments[0];
			} else if (arguments[0].length == 16) {
				console.log("Array 4x4!");
				for(var i = 0; i < arguments[0].length; i++) {
					if(typeof arguments[0][i] !== 'number') {
						throw "more panic!"
					}
				}
				this.size = 4;
				this.array = arguments[0];
			}
		} else if (arguments.length == 9) {
			this.size = 3;
			this.array = [];
			for(var i = 0; i < arguments.length; i++) {
				if(typeof arguments[i] !== 'number') {
					throw "PAnIC";
				}
				this.array.push(arguments[i]);
			}
		} else if (arguments.length == 12) {
			this.size = 4;
			this.array = [];
			for(var i = 0; i < arguments.length; i++) {
				if(typeof arguments[i] !== 'number') {
					throw "PAnIC";
				}
				this.array.push(arguments[i]);
			}
		} else if (arguments[0] instanceof Matrix) {
			this.size = arguments[0].size;
			this.array = [];
			for(var i = 0; i < arguments[0].array; i++) {
				this.array[i] = arguments[0].array;
			}
		}
	}
	copy() {
		return new Matrix();
	}
	addS(scalar) {
		// scalar add
	}
	add(matrix) {
		// cell-by-cell f0 = a0 + b0
	}
	subS(scalar) {
		// scalar sub
	}
	sub(matrix) {
		// cell-by-cell f0 = a0 - b0
	}
	multS(scalar) {
		// Scalar mult
	}
	mult(matrix) {
		// A crazy mess
	}
	divS(scalar) {
		// Scalar division across all cells
	}
	div(matrix) {
		// Multiply by the inverse of matrix
	}
	xRot(radians) {

	}
	yRot(radians) {

	}
	zRot(radians) {

	}
	translate(x, y, z) {

	}
	invert() {

	}
	transpose() {

	}
	scale(x, y, z) {

	}
	static makePerspective(fovRadians, aspectRatio, nearDist, farDist) {

	}
	static makeOrthographic(width, height, nearDist, farDist) {

	}
	static makeLookAt(eyeVector, centerVector, upVector) {

	}
	static identity(_s) {
		_s = _s || 4;
		var a = [];
		for(var i = 0; i < _s * _s; ++i) {
			if(Math.floor((i - (i % _s)) / _s) === i % _s) {
				a.push(1);
			} else {
				a.push(0);
			}
		}
		return new Matrix(a);
	}
	get determinant() {
		// Useful, probably.
	}
}
class Vector {
	constructor(x, y, z) {
		// Probably a better way to do this
		// Also consider Z being optional in the constructor
		if(x instanceof Vector) {
			this.x = x.x;
			this.y = x.y;
			this.z = x.z;
		} else if (typeof x == "object") {
			if(typeof x.x == "number" && typeof x.y == "number" && typeof x.z == "number") {
				this.x = x.x;
				this.y = x.y;
				this.z = x.z;
			} else {
				// Probably throw and error here
			}
		} else if (typeof x == "number" && typeof y == "number" && typeof z == "number") {
			this.x = x;
			this.y = y;
			this.z = z;
		} else {
			// Probably throw an error here
		}
	}
	add(vec) {
		// Could we turn this into add(vec | scalar)?
		// add(1) vs add(new Vector(1, 1, 1))?
		// Confusing?
		if(Vector.hasXYZ(vec)) {
			this.x += vec.x;
			this.y += vec.y;
			this.z += vec.z;
			return this;
		} else {
			// Probably error
		}
	}
	addS(scalar) {
		if(typeof scalar == "number") {
			this.x += scalar;
			this.y += scalar;
			this.z += scalar;
			return this;
		} else {
			// Probably error
		}

	}
	sub(vec) {
		if(Vector.hasXYZ(vec)) {
			this.x -= vec.x;
			this.y -= vec.y;
			this.z -= vec.z;
			return this;
		} else {
			// Error
		}
	}
	subS(scalar) {
		if(typeof scalar == "number") {
			this.x -= scalar;
			this.y -= scalar;
			this.z -= scalar;
			return this;
		} else {
			// Error
		}
	}
	divS(scalar) {
		if(typeof scalar == "number") {
			this.x /= scalar;
			this.y /= scalar;
			this.z /= scalar;
			return this;
		} else {
			// Error
		}
	}
	multS(scalar) {
		if(typeof scalar == "number") {
			this.x *= scalar;
			this.y *= scalar;
			this.z *= scalar;
			return this;
		} else {
			// Error
		}
	}
	dot(vec) {
		// vec mult -> scalar
		if(Vector.hasXYZ(vec)) {
			return this.x * vec.x + this.y * vec.y + this.z * vec.z;
		} else {
			// Error
		}
	}
	cross(vec) {
		// vec mult -> vec
		if(Vector.hasXYZ(vec)) {
			// xyzzy
			return new Vector(this.y * vec.z - this.z * vec.y, this.z * vec.x - this.x * vec.z, this.x * vec.y - this.y * vec.x);
		} else {
			// Error
		}
	}
	normalize() {
		this.divS(this.magnitude);
		return this;
	}
	rotate(radians) {
		// Complicated...
	}
	max(num) {
		if(typeof num == "number") {
			if(this.magnitude < num) {
				this.normalize().multS(num);
			}
			return this;
		} else {
			// Error
		}
	}
	min(num) {
		if(typeof num == "number") {
			if(this.magnitude > num) {
				this.normalize().multS(num);
			}
			return this;
		} else {
			// Error
		}
	}
	projectionS(b) {
		// α = a dot bUnit
		return this.dot(b.normal);
	}
	projection(b) {
		// a1 = α * bUnit
		return new Vector(b.normal.multS(this.projectionS(b)));
	}
	rejection(b) {
		// a2 = a - a1
		return this.copy().sub(this.projection(b));
	}
	copy() {
		return new Vector(this);
	}
	get magnitude() {
		return Math.sqrt(Math.pow(this.x,2) + Math.pow(this.y,2) + Math.pow(this.z,2))
	}
	get normal() {
		// .copy().normalize()
		return this.copy().normalize();
	}
	get heading() {
		// this is complicated?
		//return Math.atan2()

	}
	static hasXYZ(vec) {
		if(vec instanceof Vector) return true;
		if (typeof vec.x == "number" && typeof vec.y == "number" && typeof vec.z == "number") return true;
		return false;
	}
}
class Rectangle {
	constructor() {

	}
}
class Circle {
	constructor() {
		
	}
}