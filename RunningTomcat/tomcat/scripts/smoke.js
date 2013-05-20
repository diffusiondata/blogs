Smoke = function(record) {
	var image;
	var x;
	var y;
	var age;
	
	if(record !== undefined && record !== null) {
		this.image = game.images['explosion35'];
		this.x = record.x;
		this.y = record.y;
		this.age = 2000;
	}
};