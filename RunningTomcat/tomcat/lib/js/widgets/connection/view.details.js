NS( "diffusion.widget.connection.view.details", function() {
	// -- Boilerplate
	var self = this;
	this.container = '#diffusion-widget-details';
	
	// -- Observables
	this.host = ko.observable();
	this.port = ko.observable();
	
	this.username = ko.observable( diffusion.client.getUsername() );
	this.password = ko.observable( diffusion.client.getPassword() );
	
	// -- Callbacks
	this.updateHost = function( host ) {
		diffusion.client.setHost( host );
	}
	
	this.updatePort = function( port ) {
		diffusion.client.setPort( port );
	}
	
	this.updateUsername = function( username ) {
		diffusion.client.setUsername( username );
	}
	
	this.updatePassword = function( password ) {
		diffusion.client.setPassword( password );
	}
	
	// -- Listeners
	this.host.subscribe( this.updateHost );
	this.port.subscribe( this.updatePort );
	
	this.username.subscribe( this.updateUsername );
	this.password.subscribe( this.updatePassword );
}, true );