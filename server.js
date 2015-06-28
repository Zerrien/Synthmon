var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({port: 8080});
var wsArray = [];

wss.on('connection', function(_wsc) {
	wsArray.push(_wsc);
	_wsc.id = (+new Date()).toString(16) + (Math.random() * 100000000 | 0).toString(16) + wsArray.length;
	_wsc.send(JSON.stringify({
		"messageType":"OWNER_ID",
		"playerID":_wsc.id
	}));
	/*
		Gather positional data from database...
	*/
	var randA = Math.floor(Math.random() * 10)
	_wsc.send(JSON.stringify({
		"messageType":"WORLD_DATA",
		"playerID":_wsc.id,
		"position":{
			x:randA,
			y:1
		}

	}));
	_wsc.x = randA;
	_wsc.y = 1;
	_wsc.facing = "right";
	_wsc.speed = 250;
	_wsc.destX = 0;
	_wsc.destY = 0;
	_wsc.curCycle = 0;
	_wsc.state = "standing";


	wsArray[wsArray.length - 1].on("message", function(_msg) {
		var result;
		try {
			result = JSON.parse(_msg);
		} catch (_error) {
		}
		if(result) {
			if(this.id == result.playerid) {
				this.x = result.x;
				this.y = result.y;
				this.facing = result.facing;
				this.destX = result.destX;
				this.destY = result.destY;
				this.curCycle = result.curCycle;
				this.state = result.state;
			}
			//console.log(result.x);
		}
	});
});

setInterval(function() {
	for(var i = 0; i < wsArray.length; i++) {
		for(var j = 0; j < wsArray.length; j++) {
			if(i != j) {
				try {
					wsArray[i].send(JSON.stringify({
						"messageType":"WORLD_DATA",
						"playerID":wsArray[j].id,
						"position":{
							x:wsArray[j].x,
							y:wsArray[j].y
						},
						"facing":wsArray[j].facing,
						"destX":wsArray[j].destX,
						"destY":wsArray[j].destY,
						"curCycle":wsArray[j].curCycle,
						"state":wsArray[j].state
					}));
				} catch (_err) {
					var tempID = wsArray[i].id;
					wsArray.splice(i, 1);
					i--;

					for(var k = 0; k < wsArray.length; k++) {
						try {
							wsArray[i].send(JSON.stringify({
								"playerID":tempID,
								"messageType":"REMOVE_PLAYER"
							}));
						} catch(_err) {

						}
					}
				}
			}
		}
	}
	//console.log(wsArray.length);
}, 1000 / 30)