Bullet = function(record) {
	var x;
	var y;
	
	if(record !== undefined && record !== null && record !== '') {
		this.x = record[0];
		this.y = record[1];
	}
};