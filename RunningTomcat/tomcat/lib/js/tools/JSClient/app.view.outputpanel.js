NS( "app.view.outputpanel", function() {
	// ------ Boilerplate
	var self = this;
	this.container = $('#tab-output');
	
	// ------ Internal variables
	this.messages = ko.observableArray([]);
	
	// ------ Callbacks
	this.clear = function(){
		self.messages.removeAll();
	}
	
	// ------ Listeners
	app.client.addListeners({
		onDataFunction : function( msg ) {
			self.messages.unshift({
				body : msg.displayFormat()
			});
			
			if( msg.needsAcknowledgement() ) {
				DiffusionClient.acknowledge( msg );
				DiffusionClient.trace("Javascript Client acknowledged message " + msg.getAckID() );
			}
		}
	}, this );
}, true);