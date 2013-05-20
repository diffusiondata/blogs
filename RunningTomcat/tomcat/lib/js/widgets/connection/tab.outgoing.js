NS( "diffusion.widget.connection.view.outgoing", function() {
	// -- Boilerplate
	var self = this;
	this.paused = false;
	this.container = '#diffusion-widget-outgoing';
	
	// -- Observables
	this.messages = ko.observableArray([]);
	
	// -- Callbacks
	this.addMessage = function( type, message ) {
		if( diffusion.widget.connection.active && !this.paused) {
			
			if( self.messages().length > 900 ) {
				self.messages.pop();
			}
			
			var type = diffusion.util.message.names[type] || type;
			
			var topic = message.getTopic();
			var message = message.displayFormat();
			
			self.messages.unshift({ type: type, topic: topic, message: message, timestamp: self.getTimestamp() });
		}
	}
	
	this.toggelPause = function() {
		self.paused = !self.paused;
	}
	
	this.clearMessages = function() {
		self.messages.removeAll();
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
	
	// -- Listeners
	diffusion.client.addListener( "sendMessage", this.addMessage, this );
	diffusion.client.addListener( "onCallbackFunction", this.clearMessages, this );
}, true );