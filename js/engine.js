var engine = (function() {
	var tthis = {
		player : false,
		enemies : [],
		isStarted : false,
		isDead : false,
		isVictory : false,
		score : 9999,
		currTime : 0
	};
	var canvas = $("#game")[0];
	var timer = false;
	
	function distance(x1,y1,x2,y2) {
		return Math.sqrt( (x1-x2)*(x1-x2) + (y1-y2)*(y1-y2) );
	}
	
	function update() {
		if( tthis.isStarted ) {
			TWEEN.update();
			var currX = tthis.player.x, currY = tthis.player.y;
			for(var i=0, len=tthis.enemies.length; i<len; i++) {
				var enemy = tthis.enemies[i];
				if( distance(enemy.x, enemy.y, currX, currY) <= ( globals.ENTITY_RADIUS + globals.ENTITY_BORDER ) ) {
					tthis.endGame();
					break;
				}
			}
			if( map.visited.length == 19 ) {
				tthis.endGame(true);
			}
		}
	}

	function render() {
		// map
		map.render();
		
		// render visited locations
		for(var i=0,len=map.visited.length; i<len; i++) {
			var p = map.calculateToXY(map.visited[i]);
			draw.circle(p.x, p.y, globals.ENTITY_RADIUS, globals.ENTITY_BORDER, "#AA0", "#FAFA00" );
		}
		// render power locations
		for(var i=0,len=map.powers.length; i<len; i++) {
			var p = map.calculateToXY(map.powers[i]);
			draw.circle(p.x, p.y, globals.ENTITY_RADIUS*3, globals.ENTITY_BORDER, "rgba(250,250,250,0.6)", "rgba(250,250,250,0.3)" );
		}
		
		// render player
		if(tthis.player) {
			tthis.player.render();
		}
		// render enemies
		for(var i=0, len=tthis.enemies.length; i<len; i++) {
			tthis.enemies[i].render();
		}
		
		// render game screen and message
		if(!tthis.isStarted) {
			draw.rect(0,0,canvas.width,canvas.height,"rgba(0, 0, 0, 0.8)");
			var highScore = getLocalHighScore();
			if( highScore !== false ) {
				draw.text("BEST SCORE : "+tthis.lpad(highScore,4),308,20,"16px","rgba(255,255,255,0.8)");
			}
			draw.text("ENNEADECA",165,100,"72px","rgba(255,255,255,0.8)");
			draw.text("Press SPACE to start game",230,570,"24px","rgba(255,255,255,0.8)");
			var color = "rgba(255,0,0,0.95)";
			if(tthis.isDead) {
				draw.text("GAME OVER",210,300,"56px",color);
			} else if( tthis.isVictory ) {
				color = "rgba(250,250,0,0.95)";
				draw.text("YOU WON!",235,300,"56px",color);
			} else {
				// how to play
				draw.line(380,270,380,370);
				draw.line(305,280,455,360);
				draw.line(305,360,455,280);
				draw.text("Q",290,272,"36px");
				draw.text("W",362,262,"36px");
				draw.text("E",452,272,"36px");
				draw.text("S",368,402,"36px");
				draw.text("A",285,392,"36px");
				draw.text("D",455,392,"36px");
				draw.text("☼ : SPACE",285,455,"36px");
			}
			if(tthis.isDead || tthis.isVictory) {
				draw.text("Score: "+tthis.lpad(tthis.score,4),286,360,"36px",color);
				draw.circle(273,392, globals.ENTITY_RADIUS, globals.ENTITY_BORDER, "#AA0", "#FAFA00" );
				draw.text(map.visited.length+"/19",285,400,"24px",color);
				draw.circle(367,392, globals.ENTITY_RADIUS*1.5, globals.ENTITY_BORDER, "rgba(250,250,250,0.6)", "rgba(250,250,250,0.3)" );
				draw.text((globals.MAX_POWERS-map.powers.length)+"/"+globals.MAX_POWERS,380,400,"24px",color);
				draw.text((tthis.currTime/10).toFixed(1) + "s",437,400,"24px",color);
			}
		} else {
			// render status text
			var status = "Power: ",i = globals.MAX_POWERS-map.powers.length;
			while(i-->0) { status += "☼"; }
			draw.text(status,30,40,"18px","rgba(255,255,255,0.95)");
			draw.text("Lights: " + map.visited.length + "/19",680,40,"18px","rgba(255,255,255,0.95)");
			draw.text((tthis.currTime/10).toFixed(1) + "s",370,590,"18px","rgba(255,255,255,0.95)");
		}
	}
	
	function supportsHTML5Storage() {
		try {
			return 'localStorage' in window && window['localStorage'] !== null;
		} catch (e) {
			return false;
		}
	}
	tthis.supportsHTML5Storage = supportsHTML5Storage;
	
	function saveLocalHighScore(score) {
		if( supportsHTML5Storage() ) {
			if( score > localStorage.getItem("enneadeca_score") ) {
				localStorage.setItem("enneadeca_score",score);
			}
		}
	}
	
	function incStatistics(type) {
		if( supportsHTML5Storage() ) {
			localStorage.setItem("enneadeca_"+type, parseInt(localStorage.getItem("enneadeca_"+type)||0) + 1);
		}
	}
	
	function getLocalHighScore() {
		if( supportsHTML5Storage() ) {
			return localStorage.getItem("enneadeca_score") || 0;
		} else {
			return false;
		}
	}
	
	function loop() {
		update();
		draw.clearScreen();
		render();
		
		requestAnimFrame(loop);
		
	}
	
	function timerFunc() {
		if(tthis.isStarted) {
			tthis.currTime++;
			setTimeout(timerFunc,100);
		}
	}
	
	tthis.newGame = function() {
		incStatistics("new_game");
		// just in case
		if(timer) { clearInterval(timer); }
		TWEEN.removeAll();
		// initialize the map and game system
		map.lines = jQuery.extend(true, [], defMapLines);
		map.visited = [10]; map.powers = [];
		tthis.isStarted = true;
		tthis.isDead = tthis.isVictory = false;
		tthis.numOfHardLights = 3;
		tthis.currTime = 0;
		timerFunc();
		// calculate direction (connection between the points)
		map.calculateDirections();
		// create player
		tthis.player = new Player(10);
		// create the enemies
		tthis.enemies = [];
		tthis.enemies.push( new Enemy(1) );
		tthis.enemies.push( new Enemy(2) );
		tthis.enemies.push( new Enemy(3) );
		tthis.enemies.push( new Enemy(17) );
		tthis.enemies.push( new Enemy(18) );
		tthis.enemies.push( new Enemy(19) );
		
		// start moving the enemies
		for(var i=0; i<tthis.enemies.length; i++) {
			tthis.enemies[i].move();
		}
	};
	
	tthis.lpad = function(str, width, z) {
		z = z || ' ';
		str = str + '';
		return str.length >= width ? str : new Array(width - str.length + 1).join(z) + str;
	}
	
	tthis.endGame = function(victory) {
		incStatistics(victory ? "victory" : "dead");
		if(timer) { clearInterval(timer); }
		TWEEN.removeAll();
		tthis.isDead = !victory;
		tthis.isStarted = false;
		tthis.isVictory = victory;
		var timeRemaining = 600 - tthis.currTime; // 60s = 600*100ms (we count in 100ms)
		var powersRemaining = globals.MAX_POWERS - map.powers.length;
		tthis.score = 250 * ((map.visited.length > globals.MAX_POWERS && powersRemaining > 0) ? powersRemaining : 0)
					+ 100 * (map.visited.length-1)
					+ 3 * ((victory && timeRemaining>0) ? timeRemaining : 0);
		saveLocalHighScore(tthis.score);
	};
	
	tthis.start = function() {
		// init the canvas
		draw.init( canvas );
		// start the game loop
		loop();
	};
	
	return tthis;
})();