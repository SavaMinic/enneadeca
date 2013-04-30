function Entity(_name,_position,_speed) {
	var p = map.calculateToXY(_position);
	return {
		x : p.x,
		y : p.y,
		position : _position,
		speed : _speed,
		isMoving : false,
		setPosition : function(_x,_y) { x = _x; y = _y; },
		getName : function() { return _name; },
		fillColor : "#CC211A",
		borderColor : "#FF7744",
		size : 1,
		// default position change is random
		getNextPosition : function() {
			var dirs = map.points[this.position].dirs;
			return dirs[ Math.floor(Math.random() * dirs.length) ];
		},
		render : function() {
			draw.circle(this.x, this.y, globals.ENTITY_RADIUS * this.size, globals.ENTITY_BORDER, this.fillColor, this.borderColor );
		},
		move : function move() {
			var movingEntity = this;
			if( movingEntity.isMoving ) return;
			var nextPosition = movingEntity.getNextPosition();
			if( nextPosition == -1 ) {
				return;
			}
			var tween = new TWEEN.Tween( map.calculateToXY(movingEntity.position) )
				.to( map.calculateToXY( nextPosition ), movingEntity.speed )
				.easing( TWEEN.Easing.Linear.None )
				.onUpdate( function() {
					movingEntity.x = this.x;
					movingEntity.y = this.y;
				})
				.onStart( function() {
					movingEntity.isMoving = true;
				})
				.onComplete( function() {
					movingEntity.isMoving = false;
					var linePos	= map.getLinePosition( movingEntity.position, nextPosition );
					movingEntity.position = nextPosition;
					if( linePos != -1 ) {
						var line = map.lines[linePos];
						(line[2] ? mapTypes[ line[2] ] : mapTypes[0]).onFinished(movingEntity,linePos);
					} else {
						mapTypes[0].onFinished(movingEntity,linePos);
					}
				})
				.start();
		}
	};
};

function Enemy(_position) {
	if(!this.cnt) this.cnt = 1;
	return Entity("enemy" + ( this.cnt++), _position, globals.ENEMY_SPEED);
};

function Player(_position) {
	var player = new Entity("player",_position, globals.PLAYER_SPEED);
	player.nextDir = dir.SW;
	player.fillColor = "rgb(" + globals.PLAYER_COLOR + ")";
	player.borderColor = "#4477FF";
	player.getNextPosition = function() {
		var possiblePoint = this.position + this.nextDir;
		if( this.position == 1 || possiblePoint == 20 ) { possiblePoint -= 1; }
		else if( this.position == 19 || possiblePoint == 0 ) { possiblePoint += 1; }
		return (map.points[this.position].dirs.indexOf(possiblePoint) != -1) ? possiblePoint : -1;
	};
	var baseMove = player.move;
	player.move = function(direction) {
		player.nextDir = direction;
		baseMove.call(this);
	};
	return player;
};