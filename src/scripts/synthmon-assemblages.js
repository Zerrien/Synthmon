/*
ECS.Assemblages = {
	BattleText : function BattleText(_s, _f) {
		var entity = new ECS.Entity();
		entity.addComponent(new ECS.Components.UIPosition(canvas.width / 2, 300));
		var theText = new ECS.Components.UIText(_s, 100);
		entity.addComponent(theText);
		entity.addComponent(new ECS.Components.Action(function() {
			_f();
			theText.hasCont = true;
		}));
		return entity;
	}
};
*/