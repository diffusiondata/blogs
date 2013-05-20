Cloud = function(record) {
	var image;
	var x;
	var y;

	if(record !== undefined && record !== null && record !== '') {
		this.image = game.images['cloud' + ((record[0] % 2) + 1)];
		this.x = record[1];
		this.y = record[2];
	}
};

Cloud.prototype.update_record = function(record) {
	this.image = game.images['cloud' + ((record[0] % 2) + 1)];
	this.x = this._update(this.x, record[1]);
	this.y = this._update(this.y, record[2]);
};
