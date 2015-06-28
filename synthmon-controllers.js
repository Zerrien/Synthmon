function WorldController() {
	this.images = {};
	this.images.interiors = {};
	for(var chunkID in worldData.chunks) {
		this.images[chunkID] = new Image();
		this.images[chunkID].src = worldData.chunks[chunkID].source;
	}
	for(var chunkID in worldData.interior) {
		this.images.interiors[chunkID] = new Image();
		this.images.interiors[chunkID].src = worldData.interior[chunkID].source;
	}
}

function ImageController() {
	this.images = {};
	for(var imageName in worldData.images) {
		this.images[imageName] = new Image();
		this.images[imageName].src = worldData.images[imageName];
	}
}

function WorldMenuController() {

}