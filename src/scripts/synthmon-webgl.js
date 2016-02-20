function initShaders() {
	var shaderList = [
		{"name":"lambert", "properties":{"vertPos":"a_vertPos", "vertNorm":"a_vertNorm", "uvCoord":"a_uvCoord"}, "uniforms":["u_mMatrix", "u_cMatrix", "u_wMatrix", "u_pMatrix", "u_cameraPos", "u_selected"]}
	];
	for(var i = 0; i < shaderList.length; i++) {
		var shaderName = shaderList[i].name;
		var fragShader = getShader(shaderName + "-fs");
		var vertShader = getShader(shaderName + "-vs");

		shaders[shaderName] = {"program":gl.createProgram()};
		//gl.useProgram(shaders[shaderName].program);
		gl.attachShader(shaders[shaderName].program, fragShader);
		gl.attachShader(shaders[shaderName].program, vertShader);

		gl.linkProgram(shaders[shaderName].program);
		gl.useProgram(shaders[shaderName].program);

		if(!gl.getProgramParameter(shaders[shaderName].program, gl.LINK_STATUS)) {
			alert("WebGL-EzStart Error: Unable to init shader program");
		}

		for(property in shaderList[i].properties) {
			shaders[shaderName][property] = gl.getAttribLocation(shaders[shaderName].program, shaderList[i].properties[property]);
			gl.enableVertexAttribArray(shaders[shaderName][property]);
		}

		shaders[shaderName].uniforms = shaderList[i].uniforms;
	}
	shaderStack.push(shaders.lambert);
}

var shaderStack = [];

function getShader(_id) {
	/*
		Pretty much the Firefox tutorial.
	*/
	var shaderScript, theSource, currentChild, shader;
	shaderScript = document.getElementById(_id);
	if(!shaderScript) {
		return null;
	}

	theSource = "";
	currentChild = shaderScript.firstChild;
	while(currentChild) {
		if(currentChild.nodeType == currentChild.TEXT_NODE) {
			theSource += currentChild.textContent;
		}
		currentChild = currentChild.nextSibling;
	}
	if(shaderScript.type == "x-shader/x-fragment") {
		shader = gl.createShader(gl.FRAGMENT_SHADER);
	} else if (shaderScript.type == "x-shader/x-vertex") {
		shader = gl.createShader(gl.VERTEX_SHADER);
	} else {
		return null;
	}
	gl.shaderSource(shader, theSource);
	gl.compileShader(shader);
	if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		alert("WebGL-EzStart Error: An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader));
		return null;
	}
	return shader;
}

function drawApp(_app) {
	//console.log(_app);
	gl.bindBuffer(gl.ARRAY_BUFFER, _app.vertexBuffer);
	gl.vertexAttribPointer(getCurrentShader().vertPos, _app.vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, _app.textureBuffer);
	gl.vertexAttribPointer(getCurrentShader().uvCoord, _app.textureBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, _app.normalBuffer);
	gl.vertexAttribPointer(getCurrentShader().vertNorm, _app.normalBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, _app.indexBuffer);

	gl.drawElements(gl.TRIANGLES, _app.indexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
}

function setUniform(_n, _v, _n1) {
	if(_v.length == 16) {
		gl.uniformMatrix4fv(gl.getUniformLocation(getCurrentShader().program, _n), false, _v);
	}  else if (typeof _v === 'number') {
		gl.uniform1f(gl.getUniformLocation(getCurrentShader().program, _n), _v);
	} else if (_v.length == 3) {
		gl.uniform3fv(gl.getUniformLocation(getCurrentShader().program, _n), _v);
	} else {
		gl.activeTexture(33984 + _n1);
  		gl.bindTexture(gl.TEXTURE_2D, _v);
  		gl.uniform1i(gl.getUniformLocation(getCurrentShader().program, _n), _n1);
		//alert("Attempting to pass unknown-type uniform");
	}
}

function getIdentity() {
	return [1, 0, 0, 0,
			0, 1, 0, 0, 
			0, 0, 1, 0, 
			0, 0, 0, 1];
}

function handleTextureLoaded(_img, _texture) {
	gl.bindTexture(gl.TEXTURE_2D, _texture);
	if(_img.name === "piggen_colored") {
		//This is probably because of a bug.
		gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
	}
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, _img);

	if(_img.name.indexOf("Ground") != -1) {
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_NEAREST);
	} else {
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
	}
	gl.generateMipmap(gl.TEXTURE_2D);

	
	gl.bindTexture(gl.TEXTURE_2D, null);
}

var rttFramebuffer;
var rttTexture;

function initTextureFramebuffer() {
	rttFramebuffer = gl.createFramebuffer();
	gl.bindFramebuffer(gl.FRAMEBUFFER, rttFramebuffer);

	rttFramebuffer.width = 512;
	rttFramebuffer.height = 512;

	rttTexture = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, rttTexture);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, rttFramebuffer.width, rttFramebuffer.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    gl.generateMipmap(gl.TEXTURE_2D);
   

    var renderbuffer = gl.createRenderbuffer();
    gl.bindRenderbuffer(gl.RENDERBUFFER, renderbuffer);
    gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, rttFramebuffer.width, rttFramebuffer.height)

    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, rttTexture, 0);
    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, renderbuffer);

    gl.bindTexture(gl.TEXTURE_2D, null);
    gl.bindRenderbuffer(gl.RENDERBUFFER, null);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
}

function getCurrentShader() {
	return shaderStack[shaderStack.length - 1];
}
function pushShader(_shader) {
	shaderStack.push(_shader);
	gl.useProgram(_shader.program);
}
function popShader(_shader) {
	shaderStack.pop();
	gl.useProgram(shaderStack[shaderStack.length - 1].program);
}