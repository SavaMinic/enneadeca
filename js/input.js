var input = (function() {
	var tthis = {};
	var isPlayerMoving = false;
	
	$(window).keydown( function(ev) {
		var code = (ev.keyCode ? ev.keyCode : ev.which);
		switch(code) {
			// SPACE
			case 32:
				if(!engine.isStarted) {
					engine.newGame();
				} else if(!engine.player.isMoving) {
					var p = engine.player.position;
					if( map.powers.length < globals.MAX_POWERS && map.powers.indexOf(p) == -1 ) {
						map.powers.push(p);
						map.updateLight(p);
					}
				}
				break;
			// ESC
			case 27:
				engine.isStarted = engine.isDead = engine.isVictory = false;
				break;
			/* W */	case 87: engine.player && engine.player.move(dir.N); break;
			/* E */	case 69: engine.player && engine.player.move(dir.NE); break;
			/* Q */	case 81: engine.player && engine.player.move(dir.NW); break;
			/* D */	case 68: engine.player && engine.player.move(dir.SE); break;
			/* A */	case 65: engine.player && engine.player.move(dir.SW); break;
			/* S */	case 83: engine.player && engine.player.move(dir.S); break;
			// /* C */	case 67: engine.player && engine.player.move(dir.SE); break;
			// /* X */	case 88: engine.player && engine.player.move(dir.S); break;
			// /* Z */	case 90: engine.player && engine.player.move(dir.SW); break;
			// /* D */	case 68: engine.player && engine.player.move(dir.E); break;
			// /* A */	case 65: engine.player && engine.player.move(dir.W); break;
			// statistics on .
			case 190:
				if( engine.supportsHTML5Storage() ) {
					var victory = localStorage.getItem("enneadeca_victory") || 0;
					var dead = localStorage.getItem("enneadeca_dead") || 0;
					var new_game = localStorage.getItem("enneadeca_new_game") || 0;
					alert("ENNEADECA STATISTICS\n"
							+ "Games started: " + new_game + "\n"
							+ "Won games: " + victory + "\n"
							+ "Lost games: " + dead);
				}
				break;
		}
	});
	
	return tthis;
})();