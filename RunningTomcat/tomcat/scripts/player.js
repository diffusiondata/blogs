Player = function(p) {
	var clientID;
	var name;
	
	var x;
	var y;
	var speed;
	var rotation;
	
	var health;
	var invulnerability;
	var score;
	
	var image;
	var explosion;
	var colour;
	
	if(p !== undefined) {
		this.clientID = p.clientID;
		this.name = p.name;
		this.x = p.x;
		this.y = p.y;
		this.speed = p.speed;
		this.rotation = p.rotation;
		this.health = p.health;
		this.invulnerability = p.invulnerability;
		this.score = p.score;
		this.image = p.image;
		this.colour = p.colour;
	}
};

Player.prototype._update = function(field, value) {
	return value.length > 0 ? value : field;
};

Player.prototype.update_record = function(record) {
	this.clientID = this._update(this.clientID, record[0]);
	this.name = this._update(this.name, record[1]);
	this.x = this._update(this.x, record[2]);
	this.y = this._update(this.y, record[3]);
	this.speed = this._update(this.speed, record[4]);
	this.rotation = this._update(this.rotation, record[5]);
	this.health = this._update(this.health, record[6]);
	this.invulnerability = this._update(this.invulnerability, record[7]);
	this.score = this._update(this.score, record[8]);
};
