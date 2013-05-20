function __diffusionClientWrapper() {
	// Shortcut to list of message types for reference
	var types = diffusion.util.message.types;
	
	// Maintain state
	var context = this;
	var proto = __diffusionClientWrapper.prototype;
	
	var cascades = [];
	
	// Status
	var isConnected = false;
	var isReconnect = false,
	isAuthenticated = false;
	
	// Counters
	var ackCounter = 0,
	fetchAckCounter = 0;
	
	// Config
	var connection = { }, credentials = { username : null, password : null };
	var transports = { }, transportType = "C";
	
	var options = {
		debug : true
	};	

	// Hold callbacks and their observers
	// Callbacks will be be referenced within the Diffusion Client connection details
	var callbacks = { }, observers = new Map();
	// Assign observer, and wrap a closure around callbacks to allow hookable functions
	for( var i = 0; i < proto.defaults.callbacks.length; ++i ) {
		var f = proto.defaults.callbacks[ i ];
		// Create observer to allow firing of events
		observers.put( f, new Observer() );
		callbacks[ f ] = (function() {
			var key = f;
			return function() {
				observers.get( key ).fire( arguments );
			}
		}());	
	}
	
	// Allow custom events to also be hooked into (but don't pass to connection details)
	for( var i = 0; i < proto.defaults.events.length; ++i ) {
		var key = proto.defaults.events[ i ];
		observers.put( key, new Observer() );
	}

	// Instantiate App object, fill out simple getters/setters
	var app = {
		setUsername : function( username ) {
			credentials.username = username;
			observers.get( "setOption" ).fire( [ "username", username] );
		},
		getUsername : function() {
			return credentials.username;
		},
		getPassword : function() {
			return credentials.password;
		},
		setPassword : function( password ) {
			credentials.password = password;
			observers.get( "setOption" ).fire( [ "password", password] );
		},
		setHost : function( host ) {
			connection.host = host;
			observers.get( "setOption" ).fire( [ "host", host] );
		},
		setPort : function( port ) {
			connection.port = port;
			observers.get( "setOption" ).fire( [ "port", port] );
		},
		setOptions : function( options ) {
			for( var o in options ) {
				this.setOption( o, options[ o ] );
			}
		},
		setOption : function( key, value ) {
			options[ key ] = value;
			observers.get( "setOption" ).fire( [key,value] );
		},
		getOption : function( key ) {
			return options[ key ];
		},
		getOptions : function() {
			return options;
		},
		setTransport : function( key, value ) {
			transports[ key ] = value;
			observers.get( "setOption" ).fire( ["transport", key, value] );
		},
		getTransports : function() {
			return transports;
		},
		setTransportType : function( value ) {
			transportType = value;
		},
		getTransportType : function() {
			return transportType;
		},
		addListener : function( key, listener, context ) {
			if( observers.get( key ) ) {
				observers.get( key ).subscribe( listener, context );
			}
		},
		addListeners : function( listeners, context ) {
			for( var l in listeners ) {
				this.addListener( l , listeners[ l ], context );
			}
		},
		removeListener : function( key, listener ) {
			if( observers.get( key ) ) {
				observers.get( key ).unsubscribe( listener );
			}
		}
	};
	
	// Diffusion specific functions
	app.reset = function() {
		cascades = [];
		messages = [];
	}
	
	var __diffusionClientConnect = DiffusionClient.connect;
	app.connect = DiffusionClient.connect = function( cd, cr ) {
		app.reset();
		
		if( isConnected ) {
			app.disconnect();
		}
		
		if( cd ) {
			for( var i = 0; i < proto.defaults.callbacks.length; ++i ) {
				var fn = proto.defaults.callbacks[ i ];
				if( cd[ fn ] ) {
					app.removeListener( fn, cd[ fn ] );
					app.addListener( fn, cd[ fn ] );
				}
			}
		}
		
		credentials = cr || credentials;
		
		app.setConnectionDetails( cd );
		
		if( observers.get( "preConnect" ) ) {
			observers.get( "preConnect" ).fire( connection );
		}
		
		__diffusionClientConnect.call( DiffusionClient, connection, credentials );
	};
	
	var __diffusionClientReconnect = DiffusionClient.reconnect;
	app.reconnect = DiffusionClient.reconnect = function() {
		if( observers.get( "reconnect" ) ) {
			observers.get( "reconnect" ).fire( connection );
		}
		
		__diffusionClientReconnect.call( DiffusionClient );
	}
	
	
	var __diffusionClientClose = DiffusionClient.close;
	app.disconnect = DiffusionClient.close = function() {
		isConnected = false;
		isReconnect = false;
		
		if( observers.get( "disconnect" ) ) {
			observers.get( "disconnect" ).fire( connection );
		}
		
		__diffusionClientClose.call( DiffusionClient );
	};
	
	app.getConnection = function() {
		this.setConnectionDetails( DiffusionClient.connectionDetails );
		var details = connection;
		
		for( var i = 0; i < proto.defaults.callbacks.length; ++i ) {
			delete details[ proto.defaults.callbacks[i] ];
		}
		
		return details;
	}
	
	app.login = function() {
		if( DiffusionClient.isConnected() ) {
			DiffusionClient.sendCredentials( credentials );
		}
	}
	
	app.toggleTransport = function( transport ) {
		if( transports[ transport ] !== undefined ) {
			return transports[ transport ] = !transports[ transport ];
		}
	}
	

	var __diffusionClientSubscribe = DiffusionClient.subscribe;
	app.subscribe = DiffusionClient.subscribe = function( topic ) {
		__diffusionClientSubscribe.call( DiffusionClient, topic);
		observers.get( "subscribe" ).fire( [types.subscribe, topic] );
	};
	
	var __diffusionClientUnsubscribe = DiffusionClient.unsubscribe;
	app.unsubscribe = DiffusionClient.unsubscribe = function( topic ) {
		__diffusionClientUnsubscribe.call( DiffusionClient, topic );
		observers.get( "unsubscribe" ).fire( [types.unsubscribe] );
	};
	
	
	var __diffusionClientFetch = DiffusionClient.fetch;
	app.fetch = DiffusionClient.fetch = function( topic ) {
		__diffusionClientFetch.call(DiffusionClient, topic);	
		observers.get( "fetch" ).fire( [types.fetch] );
	};
	
	app.command = function( topic, val ) {
		var msg = new CommandMessage(topic, 0, new TopicMessage(topic, val));
		DiffusionClient.sendCommand(topic, 0, cm);
		
		observers.get( "sendCommand" ).fire( [types.command, msg] );
	};
	
	var __diffusionClientSend = DiffusionClient.send;
	app.send = DiffusionClient.send = function( topic, val ) {
		__diffusionClientSend.call( DiffusionClient, topic, val );
		
		var msg = new TopicMessage( topic, val );
		observers.get( "sendMessage" ).fire( [types.delta, msg] );
	};
	
	var __diffusionClientSendTopicMessage = DiffusionClient.sendTopicMessage;
	app.sendMessage = DiffusionClient.sendTopicMessage = function( msg ) {
		__diffusionClientSendTopicMessage.call( DiffusionClient, msg );
		observers.get( "sendMessage" ).fire( [types.delta, msg] );
	}
	
	app.sendAck = function( topic, val ) {
		 var msg = new TopicMessage(topic, val);
		 msg.setAckRequired( options.requiredAck );
		 msg.ackId = ++ackCounter;
		 
		 DiffusionClient.sendTopicMessage( msg );
		 var msg = new TopicMessage( topic, val );
		 observers.get( "sendMessage" ).fire( [types.delta, msg ] );
	}
	
	app.page = function( command, message ) {
		var message = message || new TopicMessage( this.getOption('topic') );
		DiffusionClient.page( command, message );
		observers.get( "sendCommand" ).fire( ["paged", this.getOption('topic'), command] );
	};
	
	var __diffusionClientPing = DiffusionClient.ping;
	app.ping = DiffusionClient.ping = function() {
		observers.get( "sendPing" ).fire( [types.pingclient] );
		return __diffusionClientPing.call( DiffusionClient );
	};
	
	app.setConnectionDetails = function( config ) {
		// Ensure defaults are set
		var defaults = { 
			// NOTE  - Currently use same client/server libraries
			libPath : window.location.protocol + "//" + window.location.host + "/lib/DIFFUSION/"
		};

        if (config.libPath != undefined) {
            defaults.libPath = window.location.protocol + "//" + window.location.host + config.libPath;
        }
		
		var i = 0; for( var p in transports ) i++;
		if( i > 0 ) {
			// Protocol choices
		    defaults.disableWS 			= !transports.w;
		    defaults.disableFlash 		= !transports.f;
		    defaults.disableSilverlight	= !transports.s;
		    defaults.disableXHR 		= !transports.x;
		    defaults.disableIframe 		= !transports.i;
		}
		
		if( connection.host || connection.port ) {
			connection.host = connection.host || window.location.hostname;
			connection.port = connection.port || window.location.port;
			
			var address = connection.host + ":" + connection.port,
				httpaddress = "http://" + address,
				websocketaddress = "ws://" + address;
			
			// WebSockets
			defaults.wsURL = websocketaddress;
			
			// Flash
			defaults.flashURL = httpaddress;
			defaults.flashHost = connection.host;
			defaults.flashPort = connection.port;
			defaults.flashTransport = transportType;
			
			// Silverlight
			defaults.silverlightURL = httpaddress;
			defaults.silverlightHost = connection.host;
			defaults.silverlightPort = 4503;
			defaults.silverlightTransport = transportType;
		    
		    // XML HTTP Request
			defaults.XHRURL = httpaddress;

		    // IFrame
			defaults.context = "";//httpaddress;	
		}
		
		connection = $.extend( {}, config, connection, options, defaults, callbacks );
	}
	
	
	// Intercept internal methods
	var __DiffusionClientTransportHandleMessages = DiffusionClientTransport.prototype.handleMessages;
	DiffusionClientTransport.prototype.handleMessages = function( data ) {
		var msg = new WebClientMessage( data );
		observers.get( "gotMessage" ).fire( [msg] );
		__DiffusionClientTransportHandleMessages.call( DiffusionClient.diffusionTransport, data );
	}
	
	
	// Maintain internal connection state
	observers.get( "onCallbackFunction" ).subscribe( function( connected, reconnect ) {
		isConnected = connected;
		isReconnect = reconnect;
	});
	
	observers.get( "onServerRejectedCredentialsFunction" ).subscribe( function() {
		isAuthenticated = false;
	});

	// Automatically acknowledge messages if we get any
	observers.get( "onDataFunction" ).subscribe( function ( msg ) {
		if( msg.needsAcknowledgement() ) {
			DiffusionClient.acknowledge( msg );
		}
	});

	// Finished!
	return app;
}

// Defaults, funnily enough
__diffusionClientWrapper.prototype.defaults = {
	callbacks	: [
                	 "onAbortFunction",
                	 "onBeforeUnloadFunction",
                	 "onCallbackFunction",
                	 "onCascadeFunction",
                	 "onConnectionRejectFunction",
                	 "onDataFunction",
                	 "onLostConnectionFunction",
                	 "onInvalidClientFunction",
                	 "onTopicStatusFunction",
                	 "onServerRejectedCredentialsFunction",
                	 "onMessageNotAcknowledgedFunction",
                	 "onLoad",
                	 "onPingFunction"
                	],
	events		: [
           		   	"login",
           		 	"sendAck",
           		   	"sendMessage",
           		   	"gotMessage",
           		   	"setOption",
           		   	"preConnect",
           		   	"disconnect"
           		   ]
}

// Wrap it up nice with a ribbon on top. Or something.
NS( "diffusion.client", new __diffusionClientWrapper() );
