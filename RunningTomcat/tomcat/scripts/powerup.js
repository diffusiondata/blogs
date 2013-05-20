Powerup = function(record) {
	var type;
	var x;
	var y;
	var age;

	if(record !== undefined && record !== null && record !== '') {
		this.type = record[0];
		this.x = record[1];
		this.y = record[2];
		this.age = record[3];
	}
};
