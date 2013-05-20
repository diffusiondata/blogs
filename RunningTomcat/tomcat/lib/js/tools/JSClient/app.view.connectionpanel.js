/**
 * Panel handles connection details, and connection-related interactions
 */
NS( "app.view.connectionpanel", function() {
	var self = this;
	this.container = $('#panel-connection');
		
	// Boolean - used to set active/inactive states for buttons
	this.connected = ko.observable(false);
	
	this.host = ko.observable();
	this.host.subscribe( function(val) {
		app.client.setHost( val );
	});
	
	this.port = ko.observable();
	this.port.subscribe( function(val) {
		app.client.setPort( val );
	});
	
	// Credentials
	this.username = ko.observable();
	this.username.subscribe( function(val) {
		app.client.setUsername( val );
	});
	
	this.password = ko.observable();
	this.password.subscribe( function(val) {
		app.client.setPassword( val );
	});
	
	// Toggable options
	var options = app.client.getOptions();
	for( var o in options ) {
		this[ o ] = ko.observable( options[o] );
		this[ o ].subscribe( function(val) {
			app.client.setOption( o, val );
		});
	}
	
	// Used to display details once connected
	this.clientDetails = ko.observableArray([]);
	
	this.classBase = "table table-condensed table-bordered small clearfix ";
	this.className = ko.observable( "" );
	
	// Setup transport toggles
	this.transports = ko.observableArray( diffusion.util.transports );
		
	// ------ Interaction functions
	this.init = function() {
		ko.utils.arrayForEach( self.transports(), function( transport ) {
			diffusion.client.setTransport( transport.id, transport.value );
			if( transport.value ) $('#' + transport.id ).addClass( 'btn-primary' );
		});
	};
	
	this.connect = function() {
		self.clientDetails.removeAll();
		
		ko.utils.arrayForEach( self.transports(), function( transport ) {
			$('#' + transport.id ).removeClass( 'btn-danger' );
		});
		
		app.client.connect();
	}
	
	this.disconnect = function() {
		app.client.disconnect();
	}
	
	this.reconnect = function() {
		app.client.reconnect();
	}

	this.login = function() {
		app.client.login();
	}
	
	this.setTransport = function( val ) {
		var index = self.transports.indexOf( val );
		var transport = self.transports()[ index ];
		
		transport.value = !transport.value;
		diffusion.client.setTransport( transport.id, transport.value );
		
		$('#' + transport.id ).toggleClass( "btn-primary" ).removeClass( 'btn-danger' ).removeClass( 'btn-success' );
	};
	
	this.handleCascade = function( t ) {
		var transport = ko.utils.arrayFirst( self.transports(), function( val ) { 
			return val.name == t;
		});
		
		if( transport ) {
			var element = $('#' + transport.id );
			if( element.hasClass('btn-primary') ) {
				element.addClass('btn-danger');
			}
		}
	}
	
	this.handlePing = function( msg ) {
		self.clientDetails.push({ name : "RTT", value: msg.getTimeSinceCreation() + "ms" });
		self.clientDetails.push({ name : "Queue size", value: msg.getQueueSize().toString() });
	};
	
	this.handlePreConnect = function() {
		ko.utils.arrayForEach( this.transports(), function( transport ) {
			$('#' + transport.id ).removeClass( 'btn-error' ).removeClass( 'btn-success' ).removeClass('btn-warning');
		});
	}
	
	this.handleDisconnection = function() {
		this.connected( false );
		//this.clientDetails.removeAll();
	}
	
	this.handleConnect = function( connected ) {
		if( connected ) {
			self.connected(true);
			self.className( self.classBase + "alert-success" );
			
			var name = DiffusionClient.getTransportName();
			var transport = ko.utils.arrayFirst( self.transports(), function( val ) { 
				return val.name == name;
			});
			
			$('#' + transport.id ).addClass('btn-success');
			
			self.clientDetails.push({name: "Client ID", value : DiffusionClient.getClientID() });
			self.clientDetails.push({name: "Client Protocol Version", value : DiffusionClient.getClientProtocolVersion() });
			self.clientDetails.push({name: "Server Protocol Version", value : DiffusionClient.getServerProtocolVersion() });
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
		this.clientDetails.push({ name: "Error", value: "Server rejected connection" });
	}
	
	this.handleRejectedCrendetials = function() {
		this.handleDisconnection();
		
		this.className( this.classBase + "alert-error" );
		this.clientDetails.push({ name: "Error", value: "Server rejected credentials" });
	}
	
	
	// -- Listeners
	diffusion.client.addListener( "preConnect", this.handlePreConnect, this );
	diffusion.client.addListener( "disconnect", this.handleDisconnection, this );
	
	diffusion.client.addListener( "onPingFunction", this.handlePing, this );
	diffusion.client.addListener( "onAbortFunction", this.handleAborted, this );
	diffusion.client.addListener( "onCascadeFunction", this.handleCascade, this );

	diffusion.client.addListener( "onCallbackFunction", this.handleConnect, this );
	diffusion.client.addListener( "onLostConnectionFunction", this.handleLostConnection, this );
	diffusion.client.addListener( "onConnectionRejectFunction", this.handleRejected, this );
	diffusion.client.addListener( "onServerRejectedCredentialsFunction", this.handleRejectedCredentials, this );
}, true );

