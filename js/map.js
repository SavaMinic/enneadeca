var mapTypes = [
	{ color : "#ccc", width : 3, onFinished : function(entity,linePos) {
		if(entity.getName() != "player") {
			entity.move();
		} else {
			map.updateLight(entity.position);
		}
	}},
	{ color : "#555", width : 3, onFinished : function(entity,linePos) {
		if(entity.getName() == "player") {
			map.updateLight(entity.position);
			map.lines.splice(linePos,1);
			map.calculateDirections(); //FIXME: some bug here?
		} else {
			entity.move();
		}
	}}
];

var dir = {	N : -5, NE : -2, E : 1, SE : 3, S : 5, SW : 2, W : -1, NW : -3 };

var globals = {
	PLAYER_SPEED : 1000,
	ENEMY_SPEED : 1400,
	ENTITY_RADIUS : 5,
	ENTITY_BORDER : 2,
	PLAYER_COLOR : "26,33,204",
	MAX_POWERS : 3
};

var defMapLines = [
	[1,2],[1,3],[2,4],[2,5],[2,7,1],[3,5],[3,6],[4,9],[4,7],[5,7],[5,8],[6,8],[6,11],
	[7,9],[7,10],[8,13],[8,11],[9,12],[9,14],[10,12],[10,13],[11,13,1],[11,16],
	[12,14],[12,15,1],[13,15],[13,16],[14,17],[15,17],[15,18],[16,18],[17,19],[18,19]
];

var map = {
	visited : [], powers : [],
	offsetX : 200, offsetY : 120, zoomX : 45, zoomY : 50,
	points : {
		1 : { x : 4, y : 0 }, 2 : { x : 2, y : 1 }, 3 : { x : 6, y : 1 },
		4 : { x : 0, y : 2 }, 5 : { x : 4, y : 2 },	6 : { x : 8, y : 2 },
		7 : { x : 2, y : 3 }, 8 : { x : 6, y : 3 },	9 : { x : 0, y : 4 },
		10 : { x : 4, y : 4 }, 11 : { x : 8, y : 4 }, 12 : { x : 2, y : 5 },
		13 : { x : 6, y : 5 }, 14 : { x : 0, y : 6 }, 15 : { x : 4, y : 6 },
		16 : { x : 8, y : 6 }, 17 : { x : 2, y : 7 }, 18 : { x : 6, y : 7 },
		19 : { x : 4, y : 8 }
	},
	updateLight : function(position) {
		var visitedPosition = map.visited.indexOf(position);
		if ( visitedPosition == -1 ) {
			map.visited.push( position );
		} else if( map.powers.indexOf(position) == -1 ) {
			map.visited.splice(visitedPosition,1);
		}
	},
	getLinePosition : function(p1,p2) {
		for(var i=0, len=map.lines.length; i<len; i++) {
			var line = map.lines[i];
			if( (line[0]==p1 && line[1]==p2) || (line[0]==p2 && line[1]==p1) ) {
				return i;
			}
		}
		return -1;
	},
	calculateDirections : function() {
		for(var i=1; i<=19; i++) {
			map.points[i].dirs = [];
		}
		for(var i=0, len=map.lines.length; i<len; i++) {
			var line = map.lines[i];
			var point1 = map.points[ line[0] ] , point2 = map.points[ line[1] ] ; 
			if( point1.dirs.indexOf(line[1]) == -1 ) { point1.dirs.push(line[1]); }
			if( point2.dirs.indexOf(line[0]) == -1 ) { point2.dirs.push(line[0]); }
		}
	},
	render : function() {
		var len = map.lines.length;
		for(var i=0; i<len; i++) {
			var line = map.lines[i];
			var lineType = line[2] ? mapTypes[ line[2] ] : mapTypes[0];
			var startPoint = map.calculateToXY( line[0] );
			var endPoint = map.calculateToXY( line[1] );
			draw.line(
				startPoint.x, startPoint.y, endPoint.x, endPoint.y,
				lineType.width, lineType.color
			);
		}
	},
	calculateToXY : function(point) {
		return {
			x : map.offsetX + map.points[ point ].x * map.zoomX,
			y : map.offsetY + map.points[ point ].y * map.zoomY
		};
	}
};
map.lines = jQuery.extend(true, [], defMapLines);