var ECS = {};
ECS.entities = [];
ECS.entities2 = [];

ECS.Components = {};
ECS.Assemblages = {};
ECS.Systems = {};

//Scenes are combinations of systems, even if they don't employ Entities or Components.
//Title Scene
//Main Menu Scene
//Overworld Scene
//Battle Scene
//Other minigame scenes.
ECS.Scenes = {};

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

function findComponent(_name) {
	for(var _component in ECS.Components) {
		if(_component.toLowerCase() == _name) {
			return _component;
		}
	}
	return null;
}

ECS.Entity.prototype.dupe = function() {
	var entity = new ECS.Entity();
	for(var _components in this.components) {
		var component = findComponent(_components);
		entity.addComponent(new ECS.Components[component]());
		for(var _variables in this.components[_components]) {
			entity.c(_components)[_variables] = this.c(_components)[_variables];
		}
	}
	return entity;
}