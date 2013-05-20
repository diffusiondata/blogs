NS( "diffusion.widget.connection.view.client", function() {
	// -- Boilerplate
	var self = this;
	this.container = '#diffusion-widget-client';
	
	this.connected = ko.observable(false);
	
	this.classBase = "table table-condensed table-bordered small clearfix ";
	this.className = ko.observable( "" );
	
	this.clientDetails = ko.observableArray([]);
	
	// -- Callbacks
	this.connect = function() {
		diffusion.client.connect();
	};
	
	this.disconnect = function() {
		diffusion.client.disconnect();
	}
	
	this.handleDisconnection = function() {
		this.connected( false );
		this.clientDetails.removeAll();
	}
	
	this.handleConnection = function( connected ) {
		self.clientDetails.removeAll();
	
		if( connected ) {
			this.connected( true );
			this.className( this.classBase + "alert-success" );
			
			this.clientDetails.push({ name: "Client ID", value: DiffusionClient.getClientID() });
			this.clientDetails.push({ name: "Client Transport", value: DiffusionClient.getTransportName() });
		} else {
			this.connected( false );
			this.className( this.classBase + "alert-error" );
			this.clientDetails.push({ name: "Error", value: "Could not connect" });
		}
	}
	
	this.handleLostConnection = function() {
		this.handleDisconnection();
		
		this.className( this.classBase + "alert-error" );
		this.clientDetails.push({ name: "Error", value: "Lost connection to server" });
	}
	
	this.handleAborted = function() {
		this.handleDisconnection();
		
		this.className( this.classBase + "alert-error" );
		this.clientDetails.push({ name: "Error", value: "Server aborted connection" });
	}
	
	this.handleRejected = function() {
		this.handleDisconnection();
		
		this.className( this.classBase + "alert-error" );
		this.clientDetails.push({ name: "Error", value: "Server rejected credentials" });
	}
	
	// -- Listeners
	diffusion.client.addListener( "disconnect", this.handleDisconnection, this );
	diffusion.client.addListener( "onAbortFunction", this.handleAborted, this );
	diffusion.client.addListener( "onCallbackFunction", this.handleConnection, this );
	diffusion.client.addListener( "onLostConnectionFunction", this.handleLostConnection, this );
	diffusion.client.addListener( "onServerRejectedCredentialsFunction", this.handleRejected, this );
}, true );