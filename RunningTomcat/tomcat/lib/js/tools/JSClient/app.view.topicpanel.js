NS( "app.view.topicpanel", function() {
	// ------ Internal variables
	var self = this;
	this.container = $('#panel-topic');
	
	// Knockout values
	this.active = ko.observable(false);
	this.topics = ko.observableArray([]);
	
	this.inputTopic = ko.observable();
	this.selectTopic = ko.observable();
	this.selectedTopic = ko.observable();
	
	// ------ Inputs
	this.topic = ko.computed( function() {
		return this.inputTopic() || this.selectTopic();
	}, this);
	
	this.topic.subscribe( function() {
		var topic = self.topic();
		
		// Actually subscribe
		app.client.setOption( 'topic', topic );
	});
	
		
	// ------ Interaction functions
	this.subscribe = function() {
		// Get Topic
		var topic = self.topic();
		app.client.subscribe( topic );
		
		// If using a new user entry, add to select list
		if( self.inputTopic() ) {			
			for( var i = 0; i < self.topics().length; ++i ) {
				if( self.topics()[i] == topic ) return;
			}
			
			self.topics.push( topic );
			self.selectedTopic( topic );
		}
	};
	
	this.unsubscribe = function() {
		var topic = self.topic();
		
		app.client.unsubscribe( topic );
	}
	
	this.ping = function() {
		app.client.ping();
	}
	
	this.fetch = function() {
		app.client.fetch( self.topic() );
	}
	
	this.handleDisconnection = function(){
		this.active(false);
	}

	// ------ Setup callbacks
	app.client.addListeners({
		onCallbackFunction : function( connected ) {
			if( connected ) {
				self.active(true);
			} else {
				self.active(false);
			} 
		}
	}, this );
	
	diffusion.client.addListener( "disconnect", this.handleDisconnection, this );

}, true);

