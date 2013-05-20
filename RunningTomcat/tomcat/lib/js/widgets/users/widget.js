NS("diffusion.widget.users", function() {
	// -- Boilerplate
	var self = this;
	this.container = '#diffusion-widget-users';
	
	this.init = function() {
		ko.applyBindings( self, self.container );
	}
	
	this.applySubscriptions = function() {
		DiffusionClient.subscribe( "" );
	}
	
	diffusion.client.addListener( "onCallbackFunction", self.applySubscriptions, self );
}, true);

//Bootstrap!
$(function() {
	diffusion.widget.users.init();
});