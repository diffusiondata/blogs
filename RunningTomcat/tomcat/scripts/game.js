Game = function() {
	var canvas;
	var context;
	var images;
	var scale;
	
	var players = [];
	var bullets = [];
	var clouds = [];
	var smoke = [];
	
	var foreground_canvas;
	var foreground_ctx;

	var drawable_canvas;
	var drawable_ctx;
	
	var sfx_gunshot;
	var sfx_explosion;
	var sfx_hit;
};

Game.prototype.init = function(container) {
	var self = this;

	DiffusionClient.addTopicListener('dogfight/player', function(msg) {
		self.onPlayerData(msg, self);
	});
	DiffusionClient.addTopicListener('dogfight/bullets', function(msg) {
		self.onBulletData(msg, self);
	});
	DiffusionClient.addTopicListener('dogfight/clouds', function(msg) {
		self.onCloudData(msg, self);
	});
	DiffusionClient.addTopicListener('dogfight/powerups', function(msg) {
		self.onPowerupData(msg, self);
	});
	
	
	DiffusionClient.connect({
		wsURL : 'ws://localhost:8081',
		libPath : '/tomcat/lib/DIFFUSION',
		flashURL : 'httpc://localhost:8081/',
		flashTransport: 'C',
		XHRURL : 'http://localhost:8081/',
		disableXHR: true,
		disableIframe : true,
		cascadeTimeout : 30000,
		debug : false,
		topic : 'dogfight//',
		onCallbackFunction : self.onConnect,
		onDataFunction : self.onData
	});
	
	var width = $(document).width() - 8;
	var height = $(document).height() - $('.header').height() - 8;
	if(width != 1024) {
		width = 1024;
	}
	if(height != 768) {
		height = 768;
	}
	this.scale = Math.min(width/1024, height/768);
	
	this.canvas = document.createElement('canvas');
	this.canvas.width = width;
	this.canvas.height = height;
	$('.arena').append(this.canvas);
	
	//this.canvas = document.getElementById(container);
	
	this.context = this.canvas.getContext('2d');
	this.context.beginPath();
	this.context.rect(0,0,width*this.scale,height*this.scale);
	this.context.clip();
	this.context.closePath();

	this.foreground_canvas = document.createElement('canvas');
	this.foreground_canvas.width = this.canvas.width;
	this.foreground_canvas.height = this.canvas.height;
	this.foreground_ctx = this.foreground_canvas.getContext('2d');

	this.collision_canvas1 = document.createElement('canvas');
	this.collision_canvas1.width = 32;
	this.collision_canvas1.height = 32;
	this.collision_ctx1 = this.collision_canvas1.getContext('2d');
	this.collision_ctx1.globalCompositeOperation = 'source-over';

	this.collision_canvas2 = document.createElement('canvas');
	this.collision_canvas2.width = 32;
	this.collision_canvas2.height = 32;
	this.collision_ctx2 = this.collision_canvas2.getContext('2d');
	this.collision_ctx2.globalCompositeOperation = 'destination-over';

	this.drawable_canvas = document.createElement('canvas');
	this.drawable_canvas.width = 48;
	this.drawable_canvas.height = 48;
	this.drawable_ctx = this.drawable_canvas.getContext('2d');

	this.load_images();
	
	this.sfx_gunshot = new Audio('sounds/gunshot.ogg');
	this.sfx_explosion = new Audio('sounds/explosion.ogg');
	this.sfx_hit = new Audio('sounds/hit.ogg');
	
	this.clouds = [];
	this.bullets = [];
	
	var directionKeys = [37, 38, 39, 40];	// left, Up, Right, Down
	
	window.addEventListener('keydown', function(evt) {
		if ($.inArray(evt.keyCode, directionKeys) > -1) {
			evt.preventDefault();
		} 
		
		self.key_event(evt);
	}, false);
	window.addEventListener('keyup', function(evt) {
		if ($.inArray(evt.keyCode, directionKeys) > -1) {
			evt.preventDefault();
		}
		
		self.key_event(evt);
	}, false);
	
	this.draw_everything(this);
};

Game.prototype.onConnect = function(connected) {
};

Game.prototype.addPlayer = function(name) {
	var register = new TopicMessage('dogfight/command', name);
	register.addUserHeader('R');
	DiffusionClient.sendTopicMessage(register);
};

Game.prototype.onPlayerData = function(msg, self) {
	var command = msg.getUserHeaders()[0];
	
	switch(command) {
		case 'X': // Remove player
			var clientID = msg.getBody();
			for(var i in self.players) {
				if(self.players[i].clientID === clientID) {
					this.players[i] = new Player();
				}
			}
			break;
		default:
			if(msg.isInitialTopicLoad()) {
				self.players = [];
				for( var i = 0; i < msg.getNumberOfRecords(); i++) {
					self.players[i] = new Player();
					self.players[i].image = self.images['plane' + (i+1)];
					switch(i) {
					case 0:
					case 4:
						this.players[i].colour = '#004900';
						break;
					case 1:
					case 5:
						this.players[i].colour = '#000a4a';
						break;
					case 2:
					case 6:
						this.players[i].colour = '#4a0c00';
						break;
					case 3:
					case 7:
						this.players[i].colour = '#4a0047';
						break;
					default:
						this.players[i].colour = '#000000';
						break;
					}
				}
			}
	
			for( var i = 0; i < msg.getNumberOfRecords(); i++) {
				var record = msg.getFields(i);
				var player = self.players[i];
				player.update_record(record);
			}
			break;
	}
	return true;
};

Game.prototype.onBulletData = function(msg, self) {
	var count = self.bullets.length;
	self.bullets = [];
	for(var i = 0; i < msg.getNumberOfRecords(); i++) {
		self.bullets.push(new Bullet(msg.getFields(i)));
	}
	if(self.bullets.length > count) {
		self.sfx_gunshot.src = self.sfx_gunshot.src;
		self.sfx_gunshot.play();
	}
};

Game.prototype.onCloudData = function(msg, self) {
	self.clouds = [];
	for(var i = 0; i < msg.getNumberOfRecords(); i++) {
		self.clouds.push(new Cloud(msg.getFields(i)));
	}
};

Game.prototype.onPowerupData = function(msg, self) {
	self.powerups = [];
	for(var i = 0; i < msg.getNumberOfRecords(); i++) {
		self.powerups.push(new Powerup(msg.getFields(i)));
	}
};

Game.prototype.onData = function(msg) {
	// console.log('got data', msg);
};

Game.prototype.load_images = function() {
	var images = {
		plane1 		: 'images/plane1.png',
		plane2 		: 'images/plane2.png',
		plane3 		: 'images/plane3.png',
		plane4 		: 'images/plane4.png',
		plane5 		: 'images/plane1.png',
		plane6 		: 'images/plane2.png',
		plane7 		: 'images/plane3.png',
		plane8 		: 'images/plane4.png',
		cloud1 		: 'images/cloud1.png',
		cloud2 		: 'images/cloud2.png',
		explosion1  : 'images/explosion01.png',
		explosion2  : 'images/explosion02.png',
		explosion3  : 'images/explosion03.png',
		explosion4  : 'images/explosion04.png',
		explosion5  : 'images/explosion05.png',
		explosion6  : 'images/explosion06.png',
		explosion7  : 'images/explosion07.png',
		explosion8  : 'images/explosion08.png',
		explosion9  : 'images/explosion09.png',
		explosion10 : 'images/explosion10.png',
		explosion11 : 'images/explosion11.png',
		explosion12 : 'images/explosion12.png',
		explosion13 : 'images/explosion13.png',
		explosion14 : 'images/explosion14.png',
		explosion15 : 'images/explosion15.png',
		explosion16 : 'images/explosion16.png',
		explosion17 : 'images/explosion17.png',
		explosion18 : 'images/explosion18.png',
		explosion19 : 'images/explosion19.png',
		explosion20 : 'images/explosion20.png',
		explosion21 : 'images/explosion21.png',
		explosion22 : 'images/explosion22.png',
		explosion23 : 'images/explosion23.png',
		explosion24 : 'images/explosion24.png',
		explosion25 : 'images/explosion25.png',
		explosion26 : 'images/explosion26.png',
		explosion27 : 'images/explosion27.png',
		explosion28 : 'images/explosion28.png',
		explosion29 : 'images/explosion29.png',
		explosion30 : 'images/explosion30.png',
		explosion31 : 'images/explosion31.png',
		explosion32 : 'images/explosion32.png',
		explosion33 : 'images/explosion33.png',
		explosion34 : 'images/explosion34.png',
		explosion35 : 'images/explosion35.png',
		explosion36 : 'images/explosion36.png',
		explosion37 : 'images/explosion37.png',
		explosion38 : 'images/explosion38.png',
		explosion39 : 'images/explosion39.png',
		explosion40 : 'images/explosion40.png',
		powerup0	: 'images/crate_health.png',
		powerup1	: 'images/crate_shield.png',
		powerup2	: 'images/crate_3way.png',
		powerup3	: 'images/crate_burst.png'
	};

	this.images = {};

	for( var i in images) {
		this.images[i] = new Image();
		this.images[i].src = images[i];
	}
};

Game.prototype.draw_everything = function(self) {
	this.context.save();
	
	this.context.scale(this.scale, this.scale);

	self.draw_background();	
	self.draw_powerups();
	self.draw_players();
	self.draw_smoke();
	self.draw_bullets();
	self.draw_foreground();
	self.draw_scores();
	
	this.context.restore();
	
	setTimeout(function() {self.draw_everything(self);}, 20);
};

Game.prototype.draw_foreground = function() {
	if(this.clouds !== undefined) {
		this.foreground_ctx.beginPath();
		this.foreground_ctx.clearRect(0, 0, this.foreground_canvas.width, this.foreground_canvas.height);
		this.foreground_ctx.closePath();
		for(var i in this.clouds) {
			var cloud = this.clouds[i];
			this.foreground_ctx.drawImage(cloud.image, cloud.x, cloud.y);
		}
	}
	this.context.drawImage(this.foreground_canvas, 0, 0);
};

Game.prototype.draw_background = function() {
	this.context.beginPath();
	this.context.fillStyle = '#c8ecff';
	this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
	this.context.closePath();
};

Game.prototype.draw_scores = function() {
	this.context.font = '32px Army';
	this.context.textBaseline = 'top';
	this.context.fillStyle = '#070';
	this.context.strokeStyle = 'rgba(0,128,0,0.5)';

	if(this.players !== undefined) {
		for(var i = 0; i < this.players.length; i++) {
			this.context.beginPath();

			var x = ((i%4) * this.canvas.width) / 4;
			var y = i < 4 ? 0 : this.canvas.height - 70; 
			var name = this.players[i].name;
			if(name === undefined) {
				name = '< Join now! >';
			}
			this.context.fillStyle = this.players[i].colour;
			this.context.fillText(name, x+8, y+8);
			this.context.fillText('' + (this.players[i].score !== undefined ? this.players[i].score : 0), x+8, y+50);
			this.context.strokeRect(x+8, y+32, 200, 16);
			var health = Math.max(this.players[i].health, 0);
			if(health > 4) {
				this.context.fillStyle = '#070';
			}
			if(health > 2 && health <= 4) {
				this.context.fillStyle = '#770';
			}
			if(health <= 2) {
				this.context.fillStyle = '#700';
			}
			this.context.fillRect(x+8, y+32, 40 * health, 16);
			this.context.closePath();
		}
	}
};

Game.prototype.draw_players = function() {
	if(this.players !== undefined) {
		for( var i = 0; i < this.players.length; i++) {
			this.draw_player(this.players[i]);
		}
	}
};

Game.prototype.draw_player = function(player) {
	
	if(player.clientID === undefined || player.clientID === null
			|| player.clientID == '') {
		return;
	}
	
	if(player.rotation === undefined) {
		player.rotation = 0;
	}

	this.drawable_canvas.width = this.drawable_canvas.width;
	this.drawable_ctx.clearRect(0, 0, 48, 48);
	this.drawable_ctx.translate(24, 24);

	if(player.invulnerability > 0) {
		this.drawable_ctx.beginPath();
		this.drawable_ctx.arc(0, 0, 16, 0, 2*Math.PI);
		var opacity = player.invulnerability / 2000; // opacity in effect below 2s left
		var colour = 'rgba(255,0,0,' + opacity + ')';
		this.drawable_ctx.strokeStyle = colour;
		this.drawable_ctx.lineWidth = 2;
		this.drawable_ctx.shadowColor = colour;
		this.drawable_ctx.shadowBlur = 8;
		this.drawable_ctx.stroke();
		this.drawable_ctx.closePath();
	}
	
	this.drawable_ctx.rotate(player.rotation);
	if(player.health >= 0) {
		this.drawable_ctx.drawImage(player.image, -16, -16);
		player.explosion = undefined;
	}
	else {
		if(player.explosion === undefined) {
			this.sfx_explosion.play();
			player.explosion = 1;
			player.timer = setInterval(function() { player.explosion++; }, 100);
		}
		if(player.explosion > 40) {
			clearInterval(player.timer);
		}
		if(player.explosion !== undefined && player.explosion > 0 && player.explosion <= 40) {
			this.drawable_ctx.drawImage(this.images['explosion' + player.explosion], -16, -16);
		}
	}
	this.drawable_ctx.rotate(-player.rotation);
	
	this.drawable_ctx.translate(-24, -24);
	
	if(player.health >= 0) {
		this.drawable_ctx.beginPath();
		this.drawable_ctx.font = '8px Sans';
		this.drawable_ctx.textBaseline = 'top';
		this.drawable_ctx.fillText(player.name, 0, 0);
		this.drawable_ctx.closePath();
	}
	
	this.context.drawImage(this.drawable_canvas, player.x - 24, player.y - 24);
	
	// TODO: Optimise this so we only draw the images we really need
	this.context.drawImage(this.drawable_canvas, player.x - 24 + this.canvas.width, player.y - 24);
	this.context.drawImage(this.drawable_canvas, player.x - 24, player.y - 24 + this.canvas.height);
	this.context.drawImage(this.drawable_canvas, player.x - 24 + this.canvas.width, player.y - 24 + this.canvas.height);

	this.context.drawImage(this.drawable_canvas, player.x - 24 - this.canvas.width, player.y - 24);
	this.context.drawImage(this.drawable_canvas, player.x - 24, player.y - 24 - this.canvas.height);
	this.context.drawImage(this.drawable_canvas, player.x - 24 - this.canvas.width, player.y - 24 - this.canvas.height);
	
	if(player.health < 5) {
		var chance = (Math.random() * 100);
		if(chance > (100 - 4*(5 - player.health))) {
			if(this.smoke === undefined) {
				this.smoke = [];
			}
			this.smoke.push(new Smoke({x:player.x, y:player.y}));
		}
	}
};

Game.prototype.draw_bullets = function() {
	if(this.bullets !== undefined) {
		this.context.fillStyle = '#f00';
		for(var i = 0; i < this.bullets.length; i++) {
			this.context.beginPath();	
			this.context.arc(this.bullets[i].x, this.bullets[i].y, 2, 0, 2*Math.PI);
			this.context.fill();
			this.context.closePath();
		}
	}
};

Game.prototype.draw_powerups = function() {
	if(this.powerups !== undefined) {
		var oldAlpha = this.context.globalAlpha;
		for(var i = 0; i < this.powerups.length; i++) {
			if(this.powerups[i].age === undefined) {
				continue;	
			}
			if(this.powerups[i].age < 2000) {
				this.context.globalAlpha = this.powerups[i].age / 2000;
			}
			else {
				this.context.globalAlpha = 1;
			}
			this.context.drawImage(this.images['powerup' + this.powerups[i].type], this.powerups[i].x-16, this.powerups[i].y-16);
		}
		this.context.globalAlpha = oldAlpha;
	}
};

Game.prototype.draw_smoke = function() {
	if(this.smoke !== undefined) {
		var oldAlpha = this.context.globalAlpha;
		for(var i = 0; i < this.smoke.length; i++) {
			var s = this.smoke[i];
			if(s.age < 2000) {
				this.context.globalAlpha = s.age / 2000;
			}
			else {
				this.context.globalAlpha = 1;
			}
			this.context.drawImage(s.image, s.x-16, s.y-16);
			s.age = s.age - 20;
			
			if(s.age < 0) {
				this.smoke.splice(i, 1);
			}
		}		
		this.context.globalAlpha = oldAlpha;
	}
};

Game.prototype.key_event = function(evt) {
	var self = this;
	switch(evt.keyCode) {
	case 32: // Space/fire
		if(evt.type == 'keydown') {
			self.fire();
		}
		break;
	case 37: // Rotate left
		if(evt.type == 'keydown') {
			self.rotate_left();
		} else {
			self.rotate_stop();
		}
		break;
	case 38: // Up / faster
		if(evt.type == 'keydown') {
			self.send_faster();
		}
		break;
	case 39: // Rotate right
		if(evt.type == 'keydown') {
			self.rotate_right();
		} else {
			self.rotate_stop();
		}
		break;
	case 40: // Down / slower
		if(evt.type == 'keydown') {
			self.send_slower();
		}
		break;
	default:
		break;
	}
	return true;
};

Game.prototype.fire = function() {
	var msg = new TopicMessage('dogfight/command', 'X');
	msg.addUserHeader('B');
	DiffusionClient.sendTopicMessage(msg);
};

Game.prototype.send_faster = function() {
	var msg = new TopicMessage('dogfight/command', 'F');
	msg.addUserHeader('M');
	DiffusionClient.sendTopicMessage(msg);
};

Game.prototype.send_slower = function() {
	var msg = new TopicMessage('dogfight/command', 'S');
	msg.addUserHeader('M');
	DiffusionClient.sendTopicMessage(msg);
};

Game.prototype.rotate_left = function() {
	var msg = new TopicMessage('dogfight/command', 'L');
	msg.addUserHeader('M');
	DiffusionClient.sendTopicMessage(msg);
};

Game.prototype.rotate_right = function() {
	var msg = new TopicMessage('dogfight/command', 'R');
	msg.addUserHeader('M');
	DiffusionClient.sendTopicMessage(msg);
};

Game.prototype.rotate_stop = function() {
	var msg = new TopicMessage('dogfight/command', 'RS');
	msg.addUserHeader('M');
	DiffusionClient.sendTopicMessage(msg);
};
