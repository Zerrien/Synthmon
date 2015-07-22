function cross(_v1, _v2) {
	return [(_v1[1]*_v2[2]) - (_v1[2]*_v2[1]), (_v1[2]*_v2[0]) - (_v1[0]*_v2[2]), (_v1[0]*_v2[1]) - (_v1[1]*_v2[0])];
}

function dot(_v1, _v2) {
	return (_v1[0]*_v2[0]) + (_v1[1]*_v2[1]) + (_v1[2]*_v2[2]);
}

function vecAdd(_v1, _v2) {
  return [_v1[0] + _v2[0], _v1[1] + _v2[1], _v1[2] + _v2[2]];
}

function vecSub(_v1, _v2) {
	return [_v1[0] - _v2[0], _v1[1] - _v2[1], _v1[2] - _v2[2]];
}

function normalize(_v) {
	var length = Math.sqrt((_v[0] * _v[0]) + (_v[1] * _v[1]) + (_v[2] * _v[2]));
	return [_v[0] / length, _v[1] / length, _v[2] / length];
}

function makeTranslation(tx, ty, tz) {
  return [
     1,  0,  0,  0,
     0,  1,  0,  0,
     0,  0,  1,  0,
    tx, ty, tz,  1
  ];
}
function makeXRotation(angleInRadians) {
  var c = Math.cos(angleInRadians);
  var s = Math.sin(angleInRadians);

  return [
    1, 0, 0, 0,
    0, c, s, 0,
    0, -s, c, 0,
    0, 0, 0, 1
  ];
};
function makeYRotation(angleInRadians) {
  var c = Math.cos(angleInRadians);
  var s = Math.sin(angleInRadians);

  return [
    c, 0, -s, 0,
    0, 1, 0, 0,
    s, 0, c, 0,
    0, 0, 0, 1
  ];
};
function makeZRotation(angleInRadians) {
  var c = Math.cos(angleInRadians);
  var s = Math.sin(angleInRadians);
  return [
     c, s, 0, 0,
    -s, c, 0, 0,
     0, 0, 1, 0,
     0, 0, 0, 1,
  ];
}
function matrixMultiply(a, b) {
  var a00 = a[0*4+0];
  var a01 = a[0*4+1];
  var a02 = a[0*4+2];
  var a03 = a[0*4+3];
  var a10 = a[1*4+0];
  var a11 = a[1*4+1];
  var a12 = a[1*4+2];
  var a13 = a[1*4+3];
  var a20 = a[2*4+0];
  var a21 = a[2*4+1];
  var a22 = a[2*4+2];
  var a23 = a[2*4+3];
  var a30 = a[3*4+0];
  var a31 = a[3*4+1];
  var a32 = a[3*4+2];
  var a33 = a[3*4+3];
  var b00 = b[0*4+0];
  var b01 = b[0*4+1];
  var b02 = b[0*4+2];
  var b03 = b[0*4+3];
  var b10 = b[1*4+0];
  var b11 = b[1*4+1];
  var b12 = b[1*4+2];
  var b13 = b[1*4+3];
  var b20 = b[2*4+0];
  var b21 = b[2*4+1];
  var b22 = b[2*4+2];
  var b23 = b[2*4+3];
  var b30 = b[3*4+0];
  var b31 = b[3*4+1];
  var b32 = b[3*4+2];
  var b33 = b[3*4+3];
  return [a00 * b00 + a01 * b10 + a02 * b20 + a03 * b30,
          a00 * b01 + a01 * b11 + a02 * b21 + a03 * b31,
          a00 * b02 + a01 * b12 + a02 * b22 + a03 * b32,
          a00 * b03 + a01 * b13 + a02 * b23 + a03 * b33,
          a10 * b00 + a11 * b10 + a12 * b20 + a13 * b30,
          a10 * b01 + a11 * b11 + a12 * b21 + a13 * b31,
          a10 * b02 + a11 * b12 + a12 * b22 + a13 * b32,
          a10 * b03 + a11 * b13 + a12 * b23 + a13 * b33,
          a20 * b00 + a21 * b10 + a22 * b20 + a23 * b30,
          a20 * b01 + a21 * b11 + a22 * b21 + a23 * b31,
          a20 * b02 + a21 * b12 + a22 * b22 + a23 * b32,
          a20 * b03 + a21 * b13 + a22 * b23 + a23 * b33,
          a30 * b00 + a31 * b10 + a32 * b20 + a33 * b30,
          a30 * b01 + a31 * b11 + a32 * b21 + a33 * b31,
          a30 * b02 + a31 * b12 + a32 * b22 + a33 * b32,
          a30 * b03 + a31 * b13 + a32 * b23 + a33 * b33];
}
function makeInverse(m) {
  var m00 = m[0 * 4 + 0];
  var m01 = m[0 * 4 + 1];
  var m02 = m[0 * 4 + 2];
  var m03 = m[0 * 4 + 3];
  var m10 = m[1 * 4 + 0];
  var m11 = m[1 * 4 + 1];
  var m12 = m[1 * 4 + 2];
  var m13 = m[1 * 4 + 3];
  var m20 = m[2 * 4 + 0];
  var m21 = m[2 * 4 + 1];
  var m22 = m[2 * 4 + 2];
  var m23 = m[2 * 4 + 3];
  var m30 = m[3 * 4 + 0];
  var m31 = m[3 * 4 + 1];
  var m32 = m[3 * 4 + 2];
  var m33 = m[3 * 4 + 3];
  var tmp_0  = m22 * m33;
  var tmp_1  = m32 * m23;
  var tmp_2  = m12 * m33;
  var tmp_3  = m32 * m13;
  var tmp_4  = m12 * m23;
  var tmp_5  = m22 * m13;
  var tmp_6  = m02 * m33;
  var tmp_7  = m32 * m03;
  var tmp_8  = m02 * m23;
  var tmp_9  = m22 * m03;
  var tmp_10 = m02 * m13;
  var tmp_11 = m12 * m03;
  var tmp_12 = m20 * m31;
  var tmp_13 = m30 * m21;
  var tmp_14 = m10 * m31;
  var tmp_15 = m30 * m11;
  var tmp_16 = m10 * m21;
  var tmp_17 = m20 * m11;
  var tmp_18 = m00 * m31;
  var tmp_19 = m30 * m01;
  var tmp_20 = m00 * m21;
  var tmp_21 = m20 * m01;
  var tmp_22 = m00 * m11;
  var tmp_23 = m10 * m01;

  var t0 = (tmp_0 * m11 + tmp_3 * m21 + tmp_4 * m31) -
      (tmp_1 * m11 + tmp_2 * m21 + tmp_5 * m31);
  var t1 = (tmp_1 * m01 + tmp_6 * m21 + tmp_9 * m31) -
      (tmp_0 * m01 + tmp_7 * m21 + tmp_8 * m31);
  var t2 = (tmp_2 * m01 + tmp_7 * m11 + tmp_10 * m31) -
      (tmp_3 * m01 + tmp_6 * m11 + tmp_11 * m31);
  var t3 = (tmp_5 * m01 + tmp_8 * m11 + tmp_11 * m21) -
      (tmp_4 * m01 + tmp_9 * m11 + tmp_10 * m21);

  var d = 1.0 / (m00 * t0 + m10 * t1 + m20 * t2 + m30 * t3);

  return [
    d * t0,
    d * t1,
    d * t2,
    d * t3,
    d * ((tmp_1 * m10 + tmp_2 * m20 + tmp_5 * m30) -
          (tmp_0 * m10 + tmp_3 * m20 + tmp_4 * m30)),
    d * ((tmp_0 * m00 + tmp_7 * m20 + tmp_8 * m30) -
          (tmp_1 * m00 + tmp_6 * m20 + tmp_9 * m30)),
    d * ((tmp_3 * m00 + tmp_6 * m10 + tmp_11 * m30) -
          (tmp_2 * m00 + tmp_7 * m10 + tmp_10 * m30)),
    d * ((tmp_4 * m00 + tmp_9 * m10 + tmp_10 * m20) -
          (tmp_5 * m00 + tmp_8 * m10 + tmp_11 * m20)),
    d * ((tmp_12 * m13 + tmp_15 * m23 + tmp_16 * m33) -
          (tmp_13 * m13 + tmp_14 * m23 + tmp_17 * m33)),
    d * ((tmp_13 * m03 + tmp_18 * m23 + tmp_21 * m33) -
          (tmp_12 * m03 + tmp_19 * m23 + tmp_20 * m33)),
    d * ((tmp_14 * m03 + tmp_19 * m13 + tmp_22 * m33) -
          (tmp_15 * m03 + tmp_18 * m13 + tmp_23 * m33)),
    d * ((tmp_17 * m03 + tmp_20 * m13 + tmp_23 * m23) -
          (tmp_16 * m03 + tmp_21 * m13 + tmp_22 * m23)),
    d * ((tmp_14 * m22 + tmp_17 * m32 + tmp_13 * m12) -
          (tmp_16 * m32 + tmp_12 * m12 + tmp_15 * m22)),
    d * ((tmp_20 * m32 + tmp_12 * m02 + tmp_19 * m22) -
          (tmp_18 * m22 + tmp_21 * m32 + tmp_13 * m02)),
    d * ((tmp_18 * m12 + tmp_23 * m32 + tmp_15 * m02) -
          (tmp_22 * m32 + tmp_14 * m02 + tmp_19 * m12)),
    d * ((tmp_22 * m22 + tmp_16 * m02 + tmp_21 * m12) -
          (tmp_20 * m12 + tmp_23 * m22 + tmp_17 * m02))
  ];
}
function makePerspective(_fovRadians, aspect, near, far) {
	var f = Math.tan(Math.PI * 0.5 - 0.5 * _fovRadians);
	var rangeInv = 1.0 / (near - far);

	return [
		f / aspect, 0, 0, 0,
		0, f, 0, 0,
		0, 0, (near + far) * rangeInv, -1,
		0, 0, near * far * rangeInv * 2, 0
	];
}
function makeTranslation(tx, ty, tz) {
	return [
		1, 0, 0, 0,
		0, 1, 0, 0,
		0, 0, 1, 0,
		tx, ty, tz, 1
	];
}

function makeTranspose(_m) {
	return [
		_m[0],_m[4],_m[8],_m[12],
		_m[1],_m[5],_m[9],_m[13],
		_m[2],_m[6],_m[10],_m[14],
		_m[3],_m[7],_m[11],_m[15]
	];
}

function makeScale(sx, sy, sz) {
  return [
    sx, 0,  0,  0,
    0, sy,  0,  0,
    0,  0, sz,  0,
    0,  0,  0,  1,
  ];
}

function createLookAt(eye,centre,up) {
if (eye[0] == centre[0] && eye[1] == centre[1] && eye[2] == centre[2]) {
  return [1, 0, 0, 0,
          0, 1, 0, 0,
          0, 0, 1, 0,
          0, 0, 0, 1];
}
var z0,z1,z2,x0,x1,x2,y0,y1,y2,len;
//vec3.direction(eye, center, z);
z0 = eye[0] - centre[0];
z1 = eye[1] - centre[1];
z2 = eye[2] - centre[2];
// normalize (no check needed for 0 because of early return)
len = 1/Math.sqrt(z0*z0 + z1*z1 + z2*z2);
z0 *= len;
z1 *= len;
z2 *= len;
//vec3.normalize(vec3.cross(up, z, x));
x0 = up[1]*z2 - up[2]*z1;
x1 = up[2]*z0 - up[0]*z2;
x2 = up[0]*z1 - up[1]*z0;
len = Math.sqrt(x0*x0 + x1*x1 + x2*x2);
if (!len) {
x0 = 0;
x1 = 0;
x2 = 0;
} else {
len = 1/len;
x0 *= len;
x1 *= len;
x2 *= len;
};
//vec3.normalize(vec3.cross(z, x, y));
y0 = z1*x2 - z2*x1;
y1 = z2*x0 - z0*x2;
y2 = z0*x1 - z1*x0;
len = Math.sqrt(y0*y0 + y1*y1 + y2*y2);
if (!len) {
y0 = 0;
y1 = 0;
y2 = 0;
} else {
len = 1/len;
y0 *= len;
y1 *= len;
y2 *= len;
}
return [x0, y0, z0, 0,
x1, y1, z1, 0,
x2, y2, z2, 0,
-(x0*eye[0] + x1*eye[1] + x2*eye[2]), -(y0*eye[0] + y1*eye[1] + y2*eye[2]), -(z0*eye[0] + z1*eye[1] + z2*eye[2]), 1];
} 

function triangleIntersection(_t1, _t2, _t3, _o, _d) {
	var epsilon = 0.000001;
	var edge1, edge2;
	var P, Q, T;
	var det, inv_det, u, v;
	var t;
	edge1 = vecSub(_t2, _t1);
	edge2 = vecSub(_t3, _t1);
	P = cross(_d, edge2);
	det = dot(edge1, P);
	if(det > -epsilon && det < epsilon) return -1;
	inv_det = 1.0 / det;
	T = vecSub(_o, _t1);
	u = dot(T, P) * inv_det;
	if(u < 0 || u > 1) return -2;
	Q = cross(T, edge1);
	v = dot(_d, Q) * inv_det;
	if(v < 0 || v > 1) return -3;
	t = dot(edge2, Q) * inv_det;
	if(t > epsilon) {
		return t;
	}
	return -4;
}

function matrix4Mult(_m, _v) {
  return [
    _m[0]*_v[0] + _m[1]*_v[1] + _m[2]*_v[2] + _m[3]*_v[3],
    _m[0+4]*_v[0] + _m[1+4]*_v[1] + _m[2+4]*_v[2] + _m[3+4]*_v[3],
    _m[0+8]*_v[0] + _m[1+8]*_v[1] + _m[2+8]*_v[2] + _m[3+8]*_v[3],
    _m[0+12]*_v[0] + _m[1+12]*_v[1] + _m[2+12]*_v[2] + _m[3+12]*_v[3]
  ];
}
function vecDistance(_v1, _v2) {
  return Math.sqrt(Math.pow(_v2[0]-_v1[0],2)+Math.pow(_v2[1]-_v1[1],2)+Math.pow(_v2[2]-_v1[2],2));
}

function matrix4MultAlt(_m, _v) {
  return [
    _m[0]*_v[0] + _m[0+4]*_v[1] + _m[0+8]*_v[2] + _m[0+12]*_v[3],
    _m[1]*_v[0] + _m[1+4]*_v[1] + _m[1+8]*_v[2] + _m[1+12]*_v[3],
    _m[2]*_v[0] + _m[2+4]*_v[1] + _m[2+8]*_v[2] + _m[2+12]*_v[3],
    _m[3]*_v[0] + _m[3+4]*_v[1] + _m[3+8]*_v[2] + _m[3+12]*_v[3]
  ];
}