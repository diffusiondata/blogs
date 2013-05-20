NS( "diffusion.widget.connection.view.incoming", function() {
	// -- Boilerplate
	var self = this;
	
	this.paused = ko.observable(false);
	this.pauseText = ko.computed(function() {
		return self.paused() ? "Start" : "Pause";
	});
	this.pauseClass = ko.computed(function() {
		return self.paused() ? "btn btn-info" : "btn btn-warning";
	});
	
	this.container = '#diffusion-widget-incoming';
	
	// -- Observables
	this.messages = ko.observableArray([]);
	
	// -- Callbacks
	this.addMessage = function( message ) {
		if( self.messages().length > 250 ) {
			self.messages.pop();
		}
		
		var type = diffusion.util.message.names[ message.messageType ] || message.messageType;
		
		var topic = message.getTopic();
		var message = message.displayFormat();
		
		self.messages.unshift({ type: type, topic: topic, message: message, timestamp: self.getTimestamp() });
	}
	
	this.clearMessages = function() {
		self.messages.removeAll();
	}
	
	this.togglePause = function() {
		self.paused( !self.paused() );
	}
	
	this.getTimestamp = function() {
		var date = new Date();
		var parts = [
		             date.getHours(),
		             date.getMinutes(),
		             date.getSeconds()
		            ];
		
		for( var i = 0; i < parts.length; ++i ) 
			if( parts[i].length == 1 ) 
				parts[i] = "0"+parts[i];
		
		return parts.join(":");
	}
	
	this.addListeners = function() {
		diffusion.client.addListener( "gotMessage", this.addMessage, this );
	}
	
	this.removeListeners = function() {
		diffusion.client.removeListener( "gotMessage", this.addMessage, this );
	}
	
	// -- Listeners
	this.paused.subscribe(function(pause) {
		pause ? self.removeListeners() : self.addListeners();
	});
	
	this.paused(true);
	diffusion.client.addListener( "onCallbackFunction", this.clearMessages, this );
}, true );