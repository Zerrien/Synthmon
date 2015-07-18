/*
	Each part is standalone.
*/

/*
	Main todos:
		Replace all ECS.Entities2 with battleEntities
		Continue laying out the events.
		Make a fresh UI. (UHG.)
			Better in the long run, future me, I promise.
		Worry if the event system is dynamic enough.
*/


ECS.Scenes.Battle = {
	"systems":[
		"BattleControl",
		"BattleLogic",
		"BattleRender"
	],
	"entities":[],
	"logic":function() {
		for(var i = 0 ; i < this.systems.length; i++) {
			if(this.systems[i]) {
				this.systems[i](this.entities);
			}
		}
	},
	"init":function() {
		for(var i = 0; i < this.systems.length; i++) {
			this.systems[i] = ECS.Systems[this.systems[i]];
		}
	}
};

var battleEntities = ECS.Scenes.Battle.entities; //Alias

function BattleEvent(_dur, _sA, _eA) {
	this.curTime = -1;
	this.duration = _dur;
	this.startAction = _sA || function() {};
	this.endAction = _eA || function() {};

	this.toAdd = [];
	this.toRemove = [];

	this.queue = false;
	this.isSkip = false;
	this.add = function() {
		for(var i = 0; i < this.toAdd.length; i++) {
			ECS.entities2.push(this.toAdd[i]);
		}
	}
	this.remove = function() {
		for(var i = 0; i < this.toRemove.length; i++) {
			ECS.entities2.splice(ECS.entities2.indexOf(this.toRemove[i]), 1);
		}
	}
	this.short = function(_e) {
		this.toAdd.push(_e);
		this.toRemove.push(_e);
	}
	this.setVariable = function(_var, _varLoc, _value, _duration, _reset) {
		this.v = _var;
		this.vL = _varLoc;
		this.val = _value;
		this.dur = _duration;
		this.reset = _reset;
		this.origin = this.v[this.vL];
	}
}

var BattleController = {
	"protagonist":null,
	"antagonist":null,
	"proCur":null,
	"antCur":null,
	"type":null,

	"state":null,

	"action":null,
	"enemyAction":null,
	"events":[],
	"connections":{
		"proMonSprite":null,
		"antMonSprite":null
	},
	"getProtagonist":function() {
		return this.protagonist.c("trainer");
	},
	"getAntagonist":function() {
		return this.antagonist.c("trainer");
	},
	"getProCurrent":function() {
		return this.protagonist.c("trainer").synthmon[this.proCur];
	},
	"getAntCurrent":function() {
		return this.antagonist.c("trainer").synthmon[this.antCur];
	},
	"setCurrent":function(_who, _which) {
		console.log(_who)
		if(_who == "antagonist") {
			this.antCur = this.getAntagonist().synthmon.indexOf(_which);
			console.log(this.antCur);
		} else if (_who == "protagonist") {
			this.proCur = this.getProtagonist().synthmon.indexOf(_which);
		} else {
			console.log("???");
		}
	},
	"configure":function(_pro, _ant, _type) {
		//Not sure if this belongs in the battle configure.
		ECS.entities2 = [];

		this.protagonist = _pro;
		this.antagonist = _ant;

		this.proCur = 0;
		this.antCur = 0;

		this.state = 0;
		this.type = _type || null;

		var battleMenu = MenuController.combatMenu.make();
		ECS.entities2.push(battleMenu);

		/*
		makeBattleStartEvent(_type);
		*/
		makeBattleStartEvent(_type);

		//Not sure if this belongs in the battle configure.
		gameState = 2;
	},
	"firstEvent":function() {
		return this.events[0];	
	}
}

var BC = BattleController; //Alias


ECS.Systems.BattleControl = function BattleControl(_e) {
	//Check UI elements. Do things.
}
ECS.Systems.BattleLogic = function BattleLogic(_e) {
	//Contemplate P vs NP
}
ECS.Systems.BattleRender = function BattleRender(_e) {
	//Display some colours.
}



/*
	Turn logic stuff.
		What team member
		What attack
*/

function evaluateTurn() {
	var pAct = BattleController.action;
	var eAct = BattleController.enemyAction;
	if(pAct.type == "attack" && eAct.type == "attack") {
		var pSpd = BC.getProCurrent().getEvalStat("Speed");
		var aSpd = BC.getAntCurrent().getEvalStat("Speed");

		if(pSpd == aSpd) {
			var offset = Math.floor(Math.random() * 2);
			if(offset == 0) {
				pSpd += 1;
			} else {
				pSpd -= 1;
			}
		}
		var secondTurn = true;
		if(pSpd > aSpd) {
			var outcome = makeTurnEvent("protagonist", pAct.use);
			if(outcome == "LOSS") {
				//console.log("Player won!");
				var winningDialog = makeUIDialogue("You won!");
				var winningEvent = new BattleEvent(1000, null, function() {
					gameState = 0;
				});
				winningEvent.short(winningDialog);
				winningEvent.queue = true;
				BC.events.push(winningEvent);
				secondTurn = false;
			} else if (outcome != "SECOND_TURN") {
				secondTurn = false;
			}
		} else {
			//Antagonist's turn.
			var outcome = makeTurnEvent("antagonist", eAct.use);
			if(outcome == "LOSS") {
				var losingDialog = makeUIDialogue("You lost....");
				var losingEvent = new BattleEvent(1000, null, function() {
					gameState = 0;
					//Include return to home functionality.
				});
				losingEvent.short(losingDialog);
				losingEvent.queue = true;
				BC.events.push(losingEvent);
			} else if (outcome != "SECOND_TURN") {
				secondTurn = false;
			}
		}

		if(secondTurn) {
			if(pSpd > aSpd) {
				var outcome = makeTurnEvent("antagonist", eAct.use);
				if(outcome == "LOSS") {
					var losingDialog = makeUIDialogue("You lost....");
					var losingEvent = new BattleEvent(1000, null, function() {
						gameState = 0;
						//Include return to home functionality.
						
					});
					losingEvent.short(losingDialog);
					losingEvent.queue = true;
					BC.events.push(losingEvent);
				}
			} else {
				var outcome = makeTurnEvent("protagonist", pAct.use);
				if(outcome == "LOSS") {
					var winningDialog = makeUIDialogue("You won!");
					var winningEvent = new BattleEvent(1000, null, function() {
						gameState = 0;
					});
					winningEvent.short(winningDialog);
					winningEvent.queue = true;
					BC.events.push(winningEvent);
				}
			}
		}
	}


	BattleController.action = null;
	BattleController.enemyAction = null;
}

function enemyAction() {
	//Currently picking a random ability.
	//This includes mid-swaps, items, etc.
	BattleController.enemyAction = {
		"type":"attack",
		"use":BattleController.antagonist.c('trainer').synthmon[0].abilities[Math.floor(Math.random())]
	}
}


/*
	Make specific events.
		KO
		Attacks
		Sends out Synthmon
		Ect.
*/

function makeBattleStartEvent() {
	var playerSprite = new ECS.Entity();
	playerSprite.addComponent(new ECS.Components.UIPosition(0, 0));
	playerSprite.addComponent(new ECS.Components.BattleSprite(images.images.player));

	var enemySprite = new ECS.Entity();
	enemySprite.addComponent(new ECS.Components.UIPosition(128, 0));
	enemySprite.addComponent(new ECS.Components.BattleSprite(images.images.opponent));

	var shortsBattle = makeUIDialogue("Enemy Trainer wants to battle!!!");
	var firstEvent = new BattleEvent(1000);
	firstEvent.short(shortsBattle);
	firstEvent.toAdd.push(playerSprite);
	firstEvent.toAdd.push(enemySprite);
	firstEvent.queue = true;

	var secondEvent = sendSynthmonEvent(BC.getAntagonist(), BC.getAntCurrent(), "antagonist");
	secondEvent.toRemove.push(enemySprite);
	secondEvent.setVariable(enemySprite.c("uiposition"), "x", 128, 1000, false);


	var thirdEvent = sendSynthmonEvent(BC.getProtagonist(), BC.getProCurrent(), "protagonist");
	thirdEvent.toRemove.push(playerSprite);
	thirdEvent.setVariable(playerSprite.c("uiposition"), "x", -128, 1000, false);

	BC.events.push(firstEvent);
	BC.events.push(secondEvent);
	BC.events.push(thirdEvent);
}

function makeAttackEvent(_who, _action, _dmg) {
	var target, targetImg, abilityImg, dialogueLine;
	if(_who == "protagonist") {
		target = BC.getAntCurrent();
		targetImg = BC.connections.antMonSprite;
		abilityImg = images.images.water_attack;
		dialogueLine = BC.getProCurrent().name + " used " + _action.name + "!";
	} else {
		target = BC.getProCurrent();
		targetImg = BC.connections.proMonSprite;
		abilityImg = images.images.water_attack_back;
		dialogueLine = "Enemy " + BC.getAntCurrent().name + " used " + _action.name + "!";
	}

	var attackDialogue = makeUIDialogue(dialogueLine);
	var dialogueEvent = new BattleEvent(1000);
	dialogueEvent.toAdd.push(attackDialogue);

	var waterAttack = new ECS.Entity();
	waterAttack.addComponent(new ECS.Components.UIPosition(64 + 32,  32));
	waterAttack.addComponent(new ECS.Components.BattleSprite(abilityImg));
	waterAttack.addComponent(new ECS.Components.BattleAnimated(3, 3, 500 / 9));
	var animationEvent = new BattleEvent(500);
	animationEvent.short(waterAttack);

	var damageEvent = new BattleEvent(500, function() {
		targetImg.addComponent(new ECS.Components.BattleShake());
	}, function() {
		targetImg.removeComponent("battleshake");
	});
	damageEvent.setVariable(target, "curHP", -1 * _dmg, 500, false);
	damageEvent.minimum = 0;
	damageEvent.toRemove.push(dialogueEvent);

	BC.events.push(dialogueEvent);
	BC.events.push(animationEvent);
	BC.events.push(damageEvent);
}

function makeFaintedEvent(_who) {
	var target, targetImg, dir;
	if(_who == "protagonist") {
		target = BC.getProCurrent();
		targetImg = BC.connections.proMonSprite;
		BC.connections.proMonSprite = null;
		dir = -128;
	} else {
		target = BC.getAntCurrent();
		targetImg = BC.connections.antMonSprite;
		BC.connections.antMonSprite = null;
		dir = 128;
	}

	var hasFaintedDialogue = makeUIDialogue(target.name + " has fainted!");
	var faintedEvent = new BattleEvent(1000, null, function() {
		ECS.entities2.splice(ECS.entities2.indexOf(targetImg), 1);
	});
	faintedEvent.setVariable(targetImg.c("uiposition"), "x", dir, 1000, false);
	faintedEvent.short(hasFaintedDialogue);
	faintedEvent.queue = true;

	BC.events.push(faintedEvent);
}

function makeTurnEvent(_side, _action) {
	var from, to, toOwner, enemy;
	if(_side == "protagonist") {
		from = BC.getProCurrent();
		to = BC.getAntCurrent();
		toOwner = BC.getAntagonist();
		enemy = "antagonist";
	} else if (_side == "antagonist") {
		from = BC.getAntCurrent();
		to = BC.getProCurrent();
		toOwner = BC.getProtagonist();
		enemy = "protagonist";
	}

	var dmg = from.getEvalDmg(to, _action);
	makeAttackEvent(_side, _action, dmg);
	if(to.curHP - dmg <= 0) {
		makeFaintedEvent(enemy);
		var remaining = toOwner.hasHealthy(to);
		if(remaining) {
			var chosen = remaining[Math.floor(Math.random() * remaining.length)];
			var sendEvent = sendSynthmonEvent(toOwner, chosen, enemy);
			BC.events.push(sendEvent);
			return "FAINTED";
		} else {
			//game over for this user!
			return "LOSS";
		}
	}
	return "SECOND_TURN";

}

function sendSynthmonEvent(_who, _what, _side) {
	var monSprite = new ECS.Entity();
	if(_side == "antagonist") {
		monSprite.addComponent(new ECS.Components.UIPosition(128, 0));
		monSprite.addComponent(new ECS.Components.BattleSprite(images.images.piggen_front));
		BC.connections.antMonSprite = monSprite;
	} else if (_side == "protagonist") {
		monSprite.addComponent(new ECS.Components.UIPosition(0, 0));
		monSprite.addComponent(new ECS.Components.BattleSprite(images.images.piggen_back));
		BC.connections.proMonSprite = monSprite;
	}

	var dialogue = "";
	if(_side == "protagonist" && BC.protagonist == player) {
		dialogue = "Go! " + _what.name + "!";
	} else {
		dialogue = _who.tName + " sends out " + _what.name + "!";
	}

	var sendMon = makeUIDialogue(dialogue);
	var sendEvent = new BattleEvent(1000, function() {
		BC.setCurrent(_side, _what);
	});
	sendEvent.toAdd.push(monSprite);
	sendEvent.short(sendMon);
	sendEvent.queue = true;
	return sendEvent;
}

/*
	Helper functions
*/

//1) Uses old UI Component code
//2) Should be an assemblage.
function makeUIDialogue(_string) {
	var dialogue = new ECS.Entity();
	dialogue.addComponent(new ECS.Components.UIPosition(64, 0));
	dialogue.addComponent(new ECS.Components.UIDialogueBox(_string));
	return dialogue;
}
