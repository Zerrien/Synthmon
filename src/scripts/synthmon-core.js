var ECS = {};
ECS.entities = [];
ECS.entities2 = [];

ECS.Components = {};
ECS.Assemblages = {};
ECS.Systems = {};

ECS.Entity = function Entity() {
	this.id = this.id = (+new Date()).toString(16) + (Math.random() * 100000000 | 0).toString(16) + ECS.Entity.prototype._count;
	ECS.Entity.prototype._count++;

	this.components = {};
	return this;
}

ECS.Entity.prototype._count = 0;

ECS.Entity.prototype.addComponent = function addComponent(_c) {
	this.components[_c.name] = _c;
	return this;
}

ECS.Entity.prototype.removeComponent = function removeComponent ( _c ) {
	var name = _c;
	if(typeof componentName === 'function') {
		name = _c.prototype.name;
	}
	delete this.components[name];
	return this;
};

ECS.Entity.prototype.c = function c(_c) {
	return this.components[_c];
}