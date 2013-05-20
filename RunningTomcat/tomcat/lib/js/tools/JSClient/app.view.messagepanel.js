NS( "app.view.messagepanel", function() {
	var self = this;
	this.container = $('#message-tab');
	
	/* ----------- Variables */
	this.message = ko.observable("Your message here...");
	
	this.lastAck = ko.observable();
	this.timeout = ko.observable(2000);
	
	this.repeat = ko.observable(1);
	this.frequency = ko.observable(100);
	
	this.connected = ko.observable(false);
	this.requireAck = ko.observable(false);
	
	/* ---------- Internal functions for closures */
	var sendTimer = null;
	var sendInterval = 1;
	var sendMessage = function() {
		var timeout = undefined;
		var message = self.message();
		
		message = message.replace( "<FD>", "\u0002" );
		message = message.replace( "<RD>", "\u0003" );
		
		if( self.requireAck() ) {
			timeout = self.timeout();
		}
		
		app.client.send( app.client.getOption('topic'), self.message(), timeout );
	}
	
	/* ----------- Callback functions */
	this.send = function() {
		var repeat = self.repeat();
		if( repeat == 1 ) {
			sendMessage();
		} else {
			sendTimer = setInterval( function() {
				var i = self.repeat();
				if( i --> 0 ) {
					sendMessage();
					self.repeat( i );
				} else {
					self.stop();
					self.repeat( 1 );
				}
			}, self.frequency() );
		}
	}
	
	this.sendAck = function() {
		
	}
	
	this.stop = function() {
		if( sendTimer ) {
			clearInterval( sendTimer );
		}
	}
	
	this.clear = function() {
		app.view.outputpanel.clear();
	}
	
	/* ----------- Listeners */
	app.client.addListeners({
		onCallbackFunction : function( connected ){
			self.connected( connected );
		},
		sendMessage : function(type, topic, val, ack) {
			if( ack ) {
				self.lastAck( ack );
			}
		}
	}, this );
	
}, true);
