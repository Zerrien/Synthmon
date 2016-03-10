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
	constructor() {

	}
	add(vec) {

	}
	addS(scalar) {

	}
	sub(vec) {

	}
	subS(scalar) {

	}
	divS(scalar) {

	}
	multS(scalar) {

	}
	dot(vec) {
		// vec mult -> scalar
	}
	cross(vec) {
		// vec mult -> vec
	}
	normalize() {

	}
	rotate(radians) {

	}
	max(num) {

	}
	min(num) {

	}
	projectionS(b) {
		// α = a dot bUnit
	}
	projection(b) {
		// a1 = α * bUnit
	}
	rejection(b) {
		// a2 = a - a1
	}
	copy() {

	}
	get magnitude() {

	}
	get normal() {
		// .copy().normalize()
	}
	get heading() {

	}
}