/**
 * @author Push Technology Ltd
 * @class This is the DiffusionClient singleton.
 * 
 * DiffusionClient class
 */
DiffusionClient = new function () {
	this.version = "4.5.2";
	this.buildNumber = "01";
	this.isInvalidFunction = false;
	this.listeners = [];
	this.serviceListeners = [];
	this.credentials = null;
	this.topicListenerRef = 0;
	this.serviceListenerRef = 0;
	this.reconnectAttempts = 0;
	this.isDebugging = false;
	this.serverProtocolVersion = -1;
	this.messageLengthSize = -1;
	this.fragmentMap = {};
	
	if(navigator.appVersion.match('MSIE') == 'MSIE') {
		/**
		 * True if browser is IE
		 * @returns {Boolean} 
		 */
		this.isIE = true;
	} else {
		this.isIE = false;	
	}
	
	if(navigator.appVersion.match('MSIE 9.0') == 'MSIE 9.0') {
		/**
		 * True if browser IE9
		 * @returns {Boolean}
		 */
		this.isIE9 = true;
	} else {
		this.isIE9 = false;
	}
	
	if(navigator.userAgent.indexOf("Firefox") == -1) {
		/**
		 * True if browser Firefox
		 * @returns {Boolean}
		 */
		this.isFirefox = false;
	} else {
		this.isFirefox = true;
	}
	
	if(navigator.platform.indexOf("Win") == -1) {
		/**
		 * True if platform is windows
		 * @returns {Boolean}
		 */
		this.isWindows = false;
	} else {
		this.isWindows = true;
	}
	/**
	 * Connect to Diffusion using a DiffusionClientConnectionDetails Object, with optional credentials
	 * @param {Object} connectionDetails See connection details class for more information {@link DiffusionClientConnectionDetails}
	 * @param {DiffusionClientCredentials} credentials See client credentials class for more information {@link DiffusionClientCredentials}
	 * @example
	 * DiffusionClient.connect({ topic : "Fred", onDataEvent: function(msg){ // do something } });
	 * 
	 * @example
	 * DiffusionClient.connect({ topic : "Fred", onDataEvent: function(msg){ // do something } }, { username : "Bert", password : "admin" });
	 */
	this.connect = function(connectionDetails, credentials) {
		DiffusionClient.close();
		
		if(credentials) {
			this.setCredentials(credentials);
		}
		
		this.connectionDetails = this.extend(new DiffusionClientConnectionDetails(), connectionDetails);
		
		if( this.connectionDetails.debug == true ) {
			this.setDebugging(true);
		}
		
		this.trace(navigator.userAgent);			
		this.trace("DiffusionClient: Version " +this.version + " build " + this.buildNumber);
	
		if(typeof connectionDetails.onInvalidClientFunction == 'function') {
			this.isInvalidFunction = true;
		}
		
		setTimeout(function() {
			if(DiffusionClient.diffusionTransport.isConnected == false) {
				if(typeof DiffusionClient.connectionDetails.callbackFunction == 'function') {
					DiffusionClient.connectionDetails.callbackFunction(false);
				}
			}
		}, this.connectionDetails.timeoutMS);
	
		// Lets make sure that the DiffusionContainer exists, if not create it
		var container = document.getElementById('DiffusionContainer');
		if(container == null) {
			container = document.createElement('div');
			container.id = 'DiffusionContainer';
			container.style.width = '0px';
			container.style.height = '0px';
			document.body.appendChild(container);
		}
		
		this.diffusionTransport = new DiffusionClientTransport();
		this.diffusionTransport.cascade();

		window.onbeforeunload = function() {
			if(typeof DiffusionClient.connectionDetails.onBeforeUnloadFunction == 'function') {
				DiffusionClient.connectionDetails.onBeforeUnloadFunction();
			}
			if (DiffusionClient.diffusionTransport != null) {
				if(DiffusionClient.diffusionTransport.isConnected) {
					DiffusionClient.close();
				}
			}
		}
	
		document.onkeydown = this.checkEscape;
		document.onkeypress = this.checkEscape;
	}
	
	/**
	 * Reconnect to Diffusion using existing DiffusionClientConnectionDetails and Client ID.
	 * Utilises existing onCallbackFunction to indicate success or failure, with a second 
	 * boolean parameter to denote that this is a reconnect result.
	 * 
	 * Example for automatic reconnecting:
	 * 
	 * DiffusionClient.connect({ 
	 * 	onCallbackFunction : function( isConnected, isReconnect) {
	 * 		if( !isConnected && isReconnect ) DiffusionClient.reconnect();
	 * 		}
	 *  },
	 *  onLostConnectionFunction : function() {
	 *  	DiffusionClient.reconnect();
	 *  }
	 * });
	 *  
	 */
	this.reconnect = function() {
		if( DiffusionClient.diffusionTransport 
			&& !DiffusionClient.diffusionTransport.isConnected
			&& DiffusionClient.getClientID() ) {
			
			this.diffusionTransport.reconnect();
		}
	}
	
	/**
	 * Check if the Diffusion Client is currently connected
	 * @returns {Boolean} Whether the client is connected or not
	 */
	this.isConnected = function() {
		if(DiffusionClient.diffusionTransport) {
			return DiffusionClient.diffusionTransport.isConnected;
		}
		return false;
	}
	
	/**
	 * Check if the Diffusion Client is connected as a result of reconnection
	 * @returns {Boolean} Whether the client has been reconnected or not
	 */
	this.isReconnected = function() {
		if( DiffusionClient.diffusionTransport ) {
			return DiffusionClient.diffusionTransport.isConnected && DiffusionClient.diffusionTransport.isReconnected;
		}
		
		return false;
	}
	
	/**
	 * Set the user credentials
	 * @param {credentials} DiffusionClientCredentials The credentials to be supplied
	 */
	this.setCredentials = function(credentials) {
		if(credentials != null) {
			this.credentials = this.extend(new DiffusionClientCredentials(), credentials);
		}
	}
	/**
	 * Get the credentials for this client
	 * @returns {DiffusionClientCredentials}
	 */
	this.getCredentials = function() {
		return this.credentials;
	}
	/**
	 * Subscribe to a topic, if a subscription is made to an already subscribed topic, the client will receive another load message
	 * @param {String} topic or TopicSet pattern
	 */
	this.subscribe = function(topic) {
		if(this.isTransportValid()) {
			this.diffusionTransport.subscribe(topic);
		}
	}
	/**
	 * Unsubscribe from a topic
	 * @param {String} topic or TopicSet pattern
	 */
	this.unsubscribe = function(topic) {
		if(this.isTransportValid()) {
			this.diffusionTransport.unsubscribe(topic);
		}
	}
	/**
	 * Send TopicMessage.  
	 * @param {topicMessage} TopicMessage See {@link TopicMessage}
	 */
	this.sendTopicMessage = function(topicMessage) {
		if(this.isTransportValid()) {
			var message = topicMessage.getMessage();
			if((message != null && message != "") || topicMessage.userHeaders != null) {
				this.diffusionTransport.sendTopicMessage(topicMessage);
			}
		}
	}
	/**
	 * Send a message to the Diffusion Server on a given topic with the specified message
	 * @param {String} topic
	 * @param {String} message
	 */
	this.send = function(topic, message) {
		if(this.isTransportValid()) {
			if(message != null && message != "") {
				this.diffusionTransport.send(topic, message);
			}
		}
	}
	/**
	 * Send a credentials message to the Diffusion Server
	 * @param {Object} credentials
	 */
	this.sendCredentials = function(credentials) {
		if(this.isTransportValid()) {
			this.setCredentials(credentials);
			this.diffusionTransport.sendCredentials(credentials);
		}
	}
	/**
	 * Send a ping request to the Diffusion server.  The response to this will be a {@link PingMessage}
	 */
	this.ping = function() {
		if(this.isTransportValid()) {
			this.diffusionTransport.ping();
		}
	}
	/**
	 * Send a message acknowledgement back to the server.  This will be required if autoAck is set to false
	 * @param WebClientMessage The WebClientMessage to acknowledge
	 */
	this.acknowledge = function(webClientMessage) {
		if(this.isTransportValid()) {
			var ackID = webClientMessage.getAckID();
			if(ackID != null) {
				this.diffusionTransport.sendAckResponse(ackID);
				webClientMessage.setAcknowledged();
			}
		}
	}
	/**
	 * Fetch topic state on a given topic. This data will arrive on the onData method and any topic listeners
	 * @param {String} topic or TopicSet expression
	 * @param {String} correlationID
	 */
	this.fetch = function(topic, correlationID) {
		if(this.isTransportValid()) {
			if(correlationID) {
				this.diffusionTransport.fetch(topic, correlationID);
			} else {
				this.diffusionTransport.fetch(topic, null);
			}
		}
	}
	/**
	 * Send a command message. The topic message contains the topic name, headers and message body
	 * to be sent to the Diffusion server.
	 * @param {String} command The command to send
	 * @param {int} correlationID
	 * @param {topicMessage} TopicMessage See {@link TopicMessage}
	 */
	this.command = function(command, correlationID, topicMessage) {
		if(this.isTransportValid()) {
			this.diffusionTransport.command(command, correlationID, topicMessage);
		}
	}
	/**
	 * Send a page message. This is a variant of a command message, but does not require 
	 * a correlation ID.
	 * @param {String} Type The page command type (e.g. "O", "R", "N", etc)
	 * @param {topicMessage} TopicMessage See {@link TopicMessage}
	 */
	this.page = function(type, topicMessage) {
		if(this.isTransportValid()) {
			this.diffusionTransport.command(type, null, topicMessage);
		}
	}
	
	/**
	 * Check if the current transport being used by Diffusion Client is valid
	 * @returns {Boolean} Whether the transport is valid
	 */
	this.isTransportValid = function() {
		if(!this.diffusionTransport) {
			return false;
		} else {
			return this.diffusionTransport.isValid();
		}
	}
	/**
	 * Close the connection
	 */
	this.close = function() {
		if(this.diffusionTransport != null) {
			this.diffusionTransport.close();
		}
	}
	/**
	 * Add a topic listener
	 * @param {String} regex The regex is a String representation of a matches regex pattern on the topic name.  For an exact match, use ^topicname$
	 * @param {function} function This is the function to all with a WebClientMessage if the pattern matches
	 * @param {Object} context When the function is called above, it will retain the this context of what was passed to this method
	 * @returns {int} a reference to the topic loader, this is required if you wish to remove the topic loader
	 */
	this.addTopicListener = function(regex, functionPointer, thisContext) {
		var handle = this.topicListenerRef++;
		if(typeof thisContext == 'undefined') {
			thisContext = arguments.callee;
		}
		this.listeners.push(new TopicListener(regex,functionPointer,handle,thisContext));		
		return handle;
	}
			
	/**
	 * Add a Timed Topic listener
	 * @param {String} regex The regex is a String representation of a matches regex pattern on the topic name.  For an exact match, use ^topicname$
	 * @param {function} functionPointer This is the function to all with a WebClientMessage if the pattern matches
	 * @param {int} time Interval in millisecond to call the @function.
	 * @param {boolean} force Call the @function even if any message has been received	
	 * @param {Object} thisContext When the function is called above, it will retain the this context of what was passed to this method
	 * @returns {int} a reference to the topic loader, this is required if you wish to remove the topic loader
	 */
	this.addTimedTopicListener = function(regex, functionPointer, time, force, thisContext) {
		var handle = this.topicListenerRef++;
		if(typeof thisContext == 'undefined') {
			thisContext = arguments.callee;
		}				
		this.listeners.push(new TimedTopicListener(regex,functionPointer,handle,time,force,thisContext));		
		return handle;
	}	
	
	/**
	 * Add a service listener
	 *
	 * @param {String} regex The regex is a String representation of a matches regex pattern on the topic name.  For an exact match, use ^topicname$
	 * @param {function} function This is the function to call with a WebClientMessage if the pattern matches
	 * @param {Object} thisContext When the function is called above, it will retain the this context of what was passed to this method
	 * @returns {int} ListenerID A reference to the topic listener, this is required if you wish to remove the topic listener
	 */
	this.addServiceListener = function(regex, functionPointer, thisContext) {
		var handle = this.serviceListenerRef++;
		if(typeof thisContext == 'undefined') {
			thisContext = arguments.callee;
		}
		this.serviceListeners.push(new TopicListener(regex,functionPointer,handle,thisContext));
		return handle;
	}
	
	/**
	 * Adds a Service topic listener, taking the topic from the supplied message.
	 * 
	 * @param {TopicMessage} TopicMessage The message from which the appropriate Topic is taken.
	 * @param {function} function The handler function that will be called by the listener
	 * @returns {number} ListenerID A reference to the generated topic listener
	 */
	this.createServiceTopicHandler = function(message, handler) {
		return this.addServiceListener('^' + message.getTopic() + '$', handler);
	}

	/**
	 * Remove the topic listener
	 * @param {int} handle
	 */
	this.removeTopicListener = function(handle) {
		var topicListener;		
		for(var i=0; i < this.listeners.length; i++) {
			topicListener = this.listeners[i];			
			if(topicListener.getHandle() == handle){				
				this.listeners.splice(i,1);
				return;							
			}					
		}
	}	
	
	/**
	 * Remove the Timed topic listener
	 * @param {int} handle
	 */
	this.removeTimedTopicListener = function(handle) {
		var timedTopicListener;		
		for(var i=0; i < this.listeners.length; i++) {
			timedTopicListener = this.listeners[i];			
			if( timedTopicListener.getHandle() == handle) {				
				timedTopicListener.stop(); 
				this.listeners.splice(i,1);
				return;
			}
		}
	}
	
	
	
	/**
	 * Remove all topic listeners
	 * 
	 * This function would be required, if the connection was lost and the client was going to used to re-connect
	 */
	this.removeAllTopicListeners = function() {
		this.listeners = [];
	}
	
	/**
	 * @ignore
	 */
	this.checkEscape = function(e) {
		if(!e) e = event;
		if(e.keyCode == 27) return false;
	}
	/**
	 * Extends objA by copying all properties of objB to objA.
	 * @param {Object} objA
	 * @param {Object} objB
	 * @returns {Object} objA with all elements of objB copied into it
	 */
	this.extend = function(objA, objB) {
		for(var i in objB) {
			objA[i] = objB[i];
		}
		return objA;
	}
	/**
	 * Bind a function to a given context
	 * @param {Function} function
	 * @param {Object} context
	 * @returns {function} The bound function
	 */
	this.bind = function(fn, thisObj) {
		return function() {
			var args = Array.prototype.slice.call(arguments, 0);
			return fn.apply(thisObj, args);
		}
	}
	/**
	 * Get the current client ID
	 * @return {String} the Diffusion ClientID
	 */
	this.getClientID = function() {
		return this.diffusionTransport.clientID;
	}
	/**
	 * Get the client protocol version
	 * @return {number} the client protocol version number 
	 */
	this.getClientProtocolVersion = function() {
		return 4;
	}
	/**
	 * Get the name of the current transport
	 * @return {String} the name of the transport used
	 */
	this.getTransportName = function() {
		return this.diffusionTransport.transportName;
	}
	/**
	 * Get the server protocol version
	 * @return {number} the server protocol version number 
	 */
	this.getServerProtocolVersion = function() {
		return this.serverProtocolVersion;
	}
	
	/**
	 * Set debugging for Diffusion
	 * @param {Boolean} value
	 */
	this.setDebugging = function(value) {
		if(value == false) {
			// Set the trace function to be empty
			/**
			 * @ignore
			 */
			this.trace = function(message) { };
			this.isDebugging = false;
		} else {
			this.isDebugging = true;
			
			if(window.console && window.console.log) {
				/**
				 * @ignore
				 */
				this.trace  = function(message) { console.log(DiffusionClient.timestamp()+message) };
			} else if(window.opera && opera.postError) {
				/**
				 * @ignore
				 */
				this.trace = function(message) { opera.postError(DiffusionClient.timestamp()+message) };
			} else {
				this.isDebugging = false;
				// No logging possible..
				/**
				 * @ignore
				 */
				this.trace = function(message) { };
			}
		}
	}
	/**
	 * Send output to the Debug Console
	 * @param {Object} message
	 */
	this.trace = function(message) {
		// This is an empty function as it will be populated
		// by DiffusionClient.setDebugging(boolean);
	}
	/**
	 * Format current time in timestamp format of HH:mm:ss.SS
	 * @returns {String} timestamp
	 */
	this.timestamp = function() {
		var date = new Date();
		return date.getHours() +":"+date.getMinutes()+":"+date.getSeconds()+"."+date.getMilliseconds()+" : ";
	}
	/**
	 * Gets the last time (milliseconds since epoch) there was any interaction between the client and the server
	 * @returns {number} Last interaction time in milliseconds since epoch
	 */
	this.getLastInteraction = function() {
		return this.diffusionTransport.getLastInteraction();
	}
	/**
	 * Detect if flash present, with the minimum version passed as a parameter
	 * @param {String} version The minimum version required
	 * @returns {Boolean} true if flash player at the version specified is present
	 */
	this.hasFlash = function(version) {	
		if(window.ActiveXObject) {
			try {
				obj = new ActiveXObject("ShockwaveFlash.ShockwaveFlash");
				ver = obj.GetVariable("$version").replace(/([a-z]|[A-Z]|\s)+/, "").split(",");
				if(ver[0] >= version) {
					return true;
				}
			} catch(ignore) {
				return false;
			}
		}
		if(navigator.plugins && navigator.mimeTypes.length){
			try {
				var x = navigator.plugins["Shockwave Flash"];
				if(x && x.description) {
					ver = x.description.replace(/([a-z]|[A-Z]|\s)+/, "").replace(/(\s+r|\s+b[0-9]+)/, ".").split(".");
					if(ver[0] >= version) {
						return true;
					}
				} else {
				return false;
				}
			} catch(ig) {
				return false;
			}
		}
	}
	 /**
	 * Detect if Silverlight present, this currently looks for version 4.0.5 or above
	 * @returns {Boolean} true if a silverlight player is present
	 */
	this.hasSilverlight = function() {
		try {
			var plugin=null;
			if(this.isIE) {
				plugin = new ActiveXObject('AgControl.AgControl');
				if(plugin) {
					return plugin.isVersionSupported('4.0.5');
				} else {
					return false;
				}
			}
	        if (navigator.plugins['Silverlight Plug-In']) {
	        	container = document.createElement('div');
	            document.body.appendChild(container);
	            container.innerHTML= '<embed type="application/x-silverlight" src="data:," />';
	            plugin = container.childNodes[0];
				var result = plugin.isVersionSupported('4.0.5');
				document.body.removeChild(container);
				return result;
			}
			return false;
		}catch(ignore) {
			return false;
		}
	}
	/**
	 * Returns the Web Socket object (if any).
	 * @returns {Websocket} the Web Socket object
	 */
	this.getWebSocket = function(url) {
		var webSocket = null;
		
		if("WebSocket" in window) {
			webSocket = new WebSocket(url);
		}
		else if("MozWebSocket" in window) {
			webSocket = new MozWebSocket(url);
		}
		return webSocket;
	}
}
/**
 * @author dhudson
 * 
 * DiffusionClientTransport class
 */
DiffusionClientTransport = function() {
	this.clientID;
	this.transportName;	
	
	this.isClosing = false;
	this.isConnected = false;
	
	this.isReconnected = false;
	this.isReconnecting = false;
	
	this.messageCount = 0;
	
	this._cd = DiffusionClient.connectionDetails;
	this._dc = DiffusionClient;
	
	this.aliasMap = [];
	this.transports = [];
	this.transports.push({ name: "WebSocket", transport : new DiffusionWSTransport() });
	this.transports.push({ name: "Flash", transport : new DiffusionFlashTransport() });
	this.transports.push({ name: "Silverlight", transport : new DiffusionSilverlightTransport() });
	this.transports.push({ name: "XmlHttpRequest", transport : new DiffusionXHRTransport() });
	this.transports.push({ name: "Iframe", transport : new DiffusionIframeTransport });
	this.nextAckSequence = 0;
	this.ackManager =[];	
	this.lastInteraction;
}
DiffusionClientTransport.prototype.cascade = function() {
	// If it's a failed reconnect, then simply trigger callback
	if( this.isReconnecting ) {
		this.isReconnecting = this.isReconnected = false;
		
		if(typeof this._cd.onCallbackFunction == 'function') {
			this._cd.onCallbackFunction(false, true);
		}
		
		return;
	}

	if( this.transports.length > 0 ) {
		var trans = this.transports.shift();
		this.transport = trans.transport;
		this.transportName = trans.name;
		
		if (typeof this._cd.onCascadeFunction == 'function') {
			this._cd.onCascadeFunction(trans.name);
		}
		
		DiffusionClient.trace("Transport: cascade: about to attempt to connect to " + trans.name);

		this.lastInteraction = new Date().getTime();
		
		this.transport.connect();
	} else {
		// Exhausted transports
		if (typeof this._cd.onCascadeFunction == 'function') {
			this._cd.onCascadeFunction("None");
		}
		
		if(typeof this._cd.onCallbackFunction == 'function') {
			this._cd.onCallbackFunction(false);
		}		
	}
}

DiffusionClientTransport.prototype.reconnect = function() {
	if( !this.isConnected && !this.isReconnecting ) {
		
		this.isClosing = false;
		this.isReconnecting = true;
		
		this.transport.connect(true);
	}
}

DiffusionClientTransport.prototype.getLastInteraction = function() {
	return this.lastInteraction;
}

DiffusionClientTransport.prototype.isValid = function() {
	if(this.isConnected== false || this.isClosing == true) {
		if(this._dc.isInvalidFunction) {
			this._cd.onInvalidClientFunction();
		}
		return false;
	}
	// Update the last interaction time
	this.lastInteraction = new Date().getTime();
	return true;
}
DiffusionClientTransport.prototype.connectionRejected = function() {
	if(typeof DiffusionClient.connectionDetails.onConnectionRejectFunction == 'function') {
		DiffusionClient.connectionDetails.onConnectionRejectFunction();
	}
}
DiffusionClientTransport.prototype.close = function() {
	this.isConnected = false;
	this.isClosing = true;
	this.isReconnected = false;
	this.isReconnecting = false;
	
	if( this.transport != null ) {
		this.transport.close();
	}
}
DiffusionClientTransport.prototype.sendTopicMessage = function(topicMessage) {
	DiffusionClient.trace("Sending topic message..." + topicMessage.getMessage());
	if(topicMessage.getAckRequired()) {
		// Add this to the AckManager
		var ackProcess = new DiffusionAckProcess(topicMessage);
		this.ackManager[topicMessage.getAckID()] = ackProcess;
	}
	
	this.transport.sendTopicMessage(topicMessage);
}
DiffusionClientTransport.prototype.send = function(topic, message) {
	DiffusionClient.trace("Sending ..." + message);
	this.transport.send(topic, message);
}
DiffusionClientTransport.prototype.subscribe = function(topic) {
	DiffusionClient.trace("Subscribe ... "+ topic);
	this.transport.subscribe(topic);
}
DiffusionClientTransport.prototype.unsubscribe = function(topic) {
	DiffusionClient.trace("Unsubscribe ... " +topic);
	this.transport.unsubscribe(topic);
}
DiffusionClientTransport.prototype.sendAckResponse = function(ackID) {
	DiffusionClient.trace("Send ack response " + ackID);
	this.transport.sendAckResponse(ackID);
}
DiffusionClientTransport.prototype.sendCredentials = function(credentials) {
	DiffusionClient.trace("Send credentials ");
	this.transport.sendCredentials(credentials);
}
DiffusionClientTransport.prototype.fetch = function(topic, correlationID) {
	if(correlationID) {
		DiffusionClient.trace("Fetch " + topic + " : " + correlationID);
		this.transport.fetch(topic,correlationID);
	} else {
		DiffusionClient.trace("Fetch " + topic);
		this.transport.fetch(topic,null);
	}
}
DiffusionClientTransport.prototype.command = function(command, correlationID, topicMessage) {
	DiffusionClient.trace("Send command " + command);
	this.transport.command(command, correlationID, topicMessage);
}
DiffusionClientTransport.prototype.page = function(type, topicMessage) {
	DiffusionClient.trace("Send page command " + type);
	this.transport.command(type, null, topicMessage);
}
DiffusionClientTransport.prototype.connected = function(clientID) {
	this._dc.trace("Client ID = " + clientID);
	
	this.isConnected = true;
	
	if( this.isReconnecting ) {
		this.isReconnecting = false;
		this.isReconnected = (this.clientID == clientID);
	}
	
	this.clientID = clientID;
	
	if( typeof this._cd.onCallbackFunction == 'function' ) {
		this._cd.onCallbackFunction(true, this.isReconnected );
	}
	
	this.lastInteraction = new Date().getTime();
}
DiffusionClientTransport.prototype.ping = function() {
	if (!this.isClosing && !this.isClosed) { 
		this.transport.ping(new Date().getTime(),"0");
	}
}
DiffusionClientTransport.prototype.handleMessages = function(data){
	this.lastInteraction = new Date().getTime();
	
	try {
		if (data != "") {
			var messages = data.split("\u0008");
			do {
				var message = messages.shift();

				var rawType = message.charCodeAt(0);

				if((rawType & 0x40) === 0x40) {
						var fragmentedMessage = new FragmentedMessage(message);
						var assembled = fragmentedMessage.process();
						if(assembled === null) {
							continue;
						}
						message = assembled;
				}
				var messageType = message.charCodeAt(0) & ~0x40;
				
				switch (messageType) {
					case 28:
						// Abort
						if (typeof this._cd.onAbortFunction == 'function') {
							this._cd.onAbortFunction();
						}
						// Stop polling
						this.isClosing = true;
						return;
					case 24:
						// Its a server ping..
						if (typeof this._cd.onPingFunction == 'function') {
							this._cd.onPingFunction(new PingMessage(message));
						}
						break;
					case 25:
						// Its a client ping, this will only get here on Http Client
						var header = message.split("\u0002")[0];
						var timestamp = header.substr(1, (header.length-2));
						this.transport.sendClientPingResponse(timestamp);
						break;
					case 27:
						// Server rejected Credentials
						if(typeof this._cd.onServerRejectedCredentialsFunction == 'function') {
							this._cd.onServerRejectedCredentialsFunction();
						}
						break;
					case 29:
						// Lost connection
						this.isClosing = true;
						this.isConnected = false;
						
						this.isReconnecting = false;
						
						if(typeof this._cd.onLostConnectionFunction == 'function') {
							this._cd.onLostConnectionFunction();
						}
										
						return;
					case 32:
						// Ack response
						var ackID = parseInt(message.substr(1, (message.length -1)));
						this.processAckResponse(ackID)
						break;
					case 35:
						// Topic Status
						var data = message.substr(1, (message.length -2));
						var header = data.split("\u0002");
						var topicData = header[0].split("!");
						
						//Remove from alias map.
						if(topicData.length > 1) {
							delete this.aliasMap[topicData[1]];
						}
						
						if(typeof this._cd.onTopicStatusFunction == 'function') {
							var alias = null;
							if(topicData.length > 1) {
								alias = topicData[1];
							}
							var topicStatusMessage = new TopicStatusMessage(topicData[0], alias, header[1]);
							this._cd.onTopicStatusFunction(topicStatusMessage);
						}
						break;
					case 40: // Command Topic Load
					case 41: // Command Topic Notification
						var commandMessage = new CommandMessage(message, this.messageCount++);
						this.aliasCheck(commandMessage);
						this.dispatchMessage(commandMessage);
						break;
					case 42: // Fragment cancel
						var data = message.substr(1, (message.length - 2));
						DiffusionClient.fragmentMap[data] = undefined;
						break;
					default:
						try {
							var webClientMessage = new WebClientMessage(message, this.messageCount++);
							// If its an Ack message, send the response
							if(webClientMessage.isAckMessage() && this._cd.autoAck) {
								this.transport.sendAckResponse(webClientMessage.getAckID());
								webClientMessage.setAcknowledged();
							}
							
							this.aliasCheck(webClientMessage);
							this.dispatchMessage(webClientMessage);
						}
						catch (e) {
							DiffusionClient.trace("DiffusionClient: Error processing data " + e);
						}
						break;
				} // Switch
			} while(messages.length);
		}
	}
	catch (e) {
		DiffusionClient.trace("DiffusionClient:  Error processing data " + e);
	}
}
DiffusionClientTransport.prototype.aliasCheck = function(message) {							
	if(message.isInitialTopicLoad()) {
		var alias = message.getTopic().split("!");
		if(alias.length == 2) {
			this.aliasMap[alias[1]] = alias[0];
			message.setTopic(alias[0]);
		}
	} else {
		// Delta message
		if(message.getTopic().charCodeAt(0) == 33) {
			// Its an alias
			message.setTopic(this.aliasMap[message.getTopic().substr(1)]);
		}
	}
}
DiffusionClientTransport.prototype.dispatchMessage = function(message) {
	var dispatched = false;
	// First, try to process service listeners.
	if(message instanceof CommandMessage) {
		dispatched = this.dispatchToListeners(DiffusionClient.serviceListeners, message);
	}
	// Next try the standard topic listeners.
	if(!dispatched) {
		dispatched = this.dispatchToListeners(DiffusionClient.listeners, message);
	}
	// If no listener returned true, send to the normal onDataEvent function
	if(!dispatched) {
		this._cd.onDataFunction(message);
	}
}

DiffusionClientTransport.prototype.dispatchToListeners = function(listenerList, message) {
	if(listenerList.length > 0) {
		var workingList = listenerList.slice(0).reverse(); // slice() gives us a copy
		var count = workingList.length
		do {
			--count;
			var topicListener = workingList[count];
			if (message.getTopic().match(topicListener.getRegex())) {
				try {
					if(topicListener.callFunction(message) == true){
						return true;
					}									
				}catch(e) {
					DiffusionClient.trace("Problem with topicListener " + topicListener.handle + " : " + e);
				}
			}
		} while(count);
	}
	return false;
}
DiffusionClientTransport.prototype.getNextAckID = function() {
	return this.nextAckSequence++;
}
DiffusionClientTransport.prototype.processAckResponse = function(ackID) {
	var ackProcess = this.ackManager[ackID];
	if( ackProcess != null) {
		ackProcess.cancel();
		delete this.ackManager[ackID];
	}	
}
/**
 * @author dhudson
 *		
 * DiffusionWSTransport class -- implements DiffusionTransportInterface
 */
DiffusionWSTransport = function() {
	this.webSocket;
	this.hasConnected = false;
	this.timeoutVar;
}
DiffusionWSTransport.prototype.send = function(topic, message) {
	this.writeBytes("\u0015" + topic + "\u0001" + message);
}
DiffusionWSTransport.prototype.sendTopicMessage = function(topicMessage) {
	var message;
	if(topicMessage.getAckRequired()) {
		message = "\u001F" + topicMessage.getTopic() + "\u0002" + topicMessage.getAckID();
	} else {
		message = "\u0015" + topicMessage.getTopic();
	}
	
	var headers = topicMessage.getUserHeaders();
	if(headers != null && headers.length > 0) {
		message += "\u0002";
		message += headers.join("\u0002")
	}
	
	message += "\u0001";
	message += topicMessage.getMessage();
	
	this.writeBytes(message);
}
DiffusionWSTransport.prototype.sendCredentials = function(credentials) {
	this.writeBytes("\u001a" + credentials.toRecord());
}
DiffusionWSTransport.prototype.subscribe = function(topic) {
	this.writeBytes("\u0016" + topic);
}
DiffusionWSTransport.prototype.unsubscribe = function(topic) {
	this.writeBytes("\u0017" + topic);
}
DiffusionWSTransport.prototype.ping = function(timeStamp, queueSize) {
	this.writeBytes("\u0018" + timeStamp + "\u0002" +  queueSize);
}
DiffusionWSTransport.prototype.sendAckResponse = function(ack) {
	this.writeBytes("\u0020" + ack)
}
DiffusionWSTransport.prototype.fetch = function(topic, correlationID) {
	if(correlationID != null) {
		this.writeBytes("\u0021" + topic + "\u0002" + correlationID);
	} else {
		this.writeBytes("\u0021" + topic);
	}
}
DiffusionWSTransport.prototype.command = function(command, correlationID, topicMessage) {
	var message;
	message = "\u0024" + topicMessage.getTopic() + "\u0002" + command;
	if(correlationID !== undefined && correlationID !== null) {
		message += "\u0002" + correlationID
	}

	var headers = topicMessage.getUserHeaders();
	if(headers != null && headers.length > 0) {
		message += "\u0002";
		message += headers.join("\u0002");
	}
	message += "\u0001";
	if(topicMessage.getMessage()) {
		message += topicMessage.getMessage();
	}

	this.writeBytes(message);
}
	
DiffusionWSTransport.prototype.close = function() {	
	this.writeBytes("\u001D");
	if(this.webSocket != null) {
		this.webSocket.onclose = null;
		this.webSocket.close();
	}
}
DiffusionWSTransport.prototype.sendClientPingResponse = function(header) {
	this.writeBytes("\u0019" + header + "\u0001");
}
DiffusionWSTransport.prototype.connect = function(doReconnect) {
	var _cd = DiffusionClient.connectionDetails;
	
	if(_cd.disableWS) {
		DiffusionClient.diffusionTransport.cascade();
		return;
	}
	
	this.hasConnected = false;
	
	DiffusionClient.trace("WebSocket connect");
	
	try {

		var url = _cd.wsURL + _cd.context + "/diffusion?t=" + encodeURIComponent(DiffusionClient.connectionDetails.topic) +"&v=" + DiffusionClient.getClientProtocolVersion() + "&ty=WB";

		if( doReconnect ) {
			url += "&c=" + DiffusionClient.getClientID();
		}
		
		if(DiffusionClient.credentials != null) {
			url += "&username="+ encodeURIComponent(DiffusionClient.credentials.username) + "&password="+ encodeURIComponent(DiffusionClient.credentials.password);
		}
		
		DiffusionClient.trace("WebSocket URL: " + url);

		var webSocket = DiffusionClient.getWebSocket(url);
		
		if(webSocket == null) {
			DiffusionClient.diffusionTransport.cascade();
			return;
		}
		
		this.webSocket = webSocket;
		this.webSocket.onopen = DiffusionClient.bind(this.onWSConnect,this);
		this.webSocket.onclose = DiffusionClient.bind(this.onWSClose, this);
		this.webSocket.onmessage = DiffusionClient.bind(this.onWSHandshake, this);
		
		this.timeoutVar = setTimeout(DiffusionClient.bind(this.onTimeout,this), _cd.wsTimeout);
		
	}catch(e) {
		DiffusionClient.trace("WebSocket connect exception " + e);
		clearTimeout(this.timeoutVar);
		// If we get here, there is no web socket..
		DiffusionClient.diffusionTransport.cascade();
		return;
	}
}
DiffusionWSTransport.prototype.writeBytes = function(message) {
	try {
		this.webSocket.send(message);
	} catch(e) {
		DiffusionClient.trace("WebSocket: Unable to send message: " + message);
	}
}
DiffusionWSTransport.prototype.onTimeout = function() {
	if( !this.hasConnected ) {
		DiffusionClient.trace("WebSocket Timeout Cascade");
		
		this.webSocket.onopen = null;
		this.webSocket.onclose = null;
		this.webSocket.onmessage = null;
		
		if( this.webSocket != null ) {
			this.webSocket.close();
		}
		
		DiffusionClient.diffusionTransport.cascade();
	}
}
DiffusionWSTransport.prototype.onWSConnect = function(evt) {
	DiffusionClient.trace("onWSConnect");
	clearTimeout(this.timeoutVar);
}
DiffusionWSTransport.prototype.onWSHandshake = function(evt) {	
	var data = evt.data.split("\u0002");
	DiffusionClient.serverProtocolVersion = parseInt(data.shift());
	
	if(data[0] == "100"||data[0] == "105") {
		this.hasConnected = true;
		this.webSocket.onmessage = DiffusionClient.diffusionTransport.transport.onWSMessage;
		DiffusionClient.diffusionTransport.connected(data[1]);
	} else {
		if(data[0] == "111") {
			DiffusionClient.diffusionTransport.connectionRejected();
		}
	}
}
DiffusionWSTransport.prototype.onWSMessage = function(evt) {
	DiffusionClient.trace("WebSocket: " + evt.data);
	DiffusionClient.diffusionTransport.handleMessages(evt.data);
}
DiffusionWSTransport.prototype.onWSClose = function(evt) {
	DiffusionClient.trace("onWSClose " + this.hasConnected);

	clearTimeout(this.timeoutVar);
	if(!this.hasConnected || (evt.wasClean !== 'undefined' && evt.wasClean === false)) {
		// Connection rejected by browser
		DiffusionClient.diffusionTransport.cascade();
		return;
	}
	
	if (DiffusionClient.diffusionTransport.isClosing != true) {
		DiffusionClient.diffusionTransport.isClosing = true;
		DiffusionClient.diffusionTransport.isConnected = false;
		
		if (typeof DiffusionClient.connectionDetails.onLostConnectionFunction == 'function') {
			DiffusionClient.connectionDetails.onLostConnectionFunction();
		}
	}
}
/**
 * @author dhudson
 * 
 * DiffusionFlashTransport class  -- implements DiffusionTransportInterface
 */
DiffusionFlashTransport = function() {
	this.flashConnection = null;
	this.segments = new Array();
}
DiffusionFlashTransport.prototype.close = function () {
	try {
		if(this.flashConnection != null) {
			this.flashConnection.close();
		}
	}catch(e) {
	}
}
DiffusionFlashTransport.prototype.sendTopicMessage = function(topicMessage) {
	this.flashConnection.sendTopicMessage(topicMessage.toRecord());
}
DiffusionFlashTransport.prototype.sendCredentials = function(credentials) {
	this.flashConnection.sendCredentials(credentials.toRecord());
}
DiffusionFlashTransport.prototype.send = function(header, message) {
	this.flashConnection.send(header,message);
}

DiffusionFlashTransport.prototype.command = function(command, correlationID, topicMessage) {
	this.flashConnection.command(command, correlationID, topicMessage.toRecord());
}

DiffusionFlashTransport.prototype.subscribe = function(topic) {
	this.flashConnection.subscribe(topic);
}
DiffusionFlashTransport.prototype.unsubscribe = function(topic) {
	this.flashConnection.unsubscribe(topic);
}
DiffusionFlashTransport.prototype.ping = function(timeStamp, queueSize) {
	this.flashConnection.ping(timeStamp,queueSize);
}
DiffusionFlashTransport.prototype.fetch = function(topic, correlationID) {
	if(correlationID) {
		topic += "\u0003" + correlationID;
	}
	this.flashConnection.fetch(topic);
}
DiffusionFlashTransport.prototype.connect = function( doReconnect ) {
	var _cd = DiffusionClient.connectionDetails;
	
	if( doReconnect && this.flashConnection != null ) {
		this.flashConnection.reconnect();
		return;
	} 
		
	if(_cd.disableFlash) {
		DiffusionClient.diffusionTransport.cascade();
		return;
	}
	
	if (!DiffusionClient.hasFlash(9)) {
		DiffusionClient.diffusionTransport.cascade();
		return;
	}
	
	DiffusionClient.trace("Flash connect");
	
	this.clearPlugin();

	var flashUrl = DiffusionClient.connectionDetails.context + _cd.libPath + "/DiffusionClient.swf?v=4.5.2_01&host="+_cd.flashHost+"&port="+_cd.flashPort+"&topic="+encodeURIComponent(_cd.topic);
	flashUrl += "&batch=DiffusionClient.diffusionTransport.transport.onFlashBatch&callback=DiffusionClient.diffusionTransport.transport.onFlashConnect&onDataEvent=DiffusionClient.diffusionTransport.handleMessages";
	flashUrl += "&transport="+_cd.flashTransport+"&durl="+_cd.flashURL+"&tio="+_cd.flashTimeout;
	
    DiffusionClient.trace(_cd.libPath);
    DiffusionClient.trace(flashUrl);

	if(DiffusionClient.credentials != null) {
		flashUrl += "&username="+ encodeURIComponent(DiffusionClient.credentials.username) + "&password="+ encodeURIComponent(DiffusionClient.credentials.password);
	}
	if(DiffusionClient.isDebugging) {
		flashUrl += "&onTrace=DiffusionClient.trace";
	}
	if(DiffusionClient.isIE) {
		flashUrl += "&date="+new Date();
	}
	var flashHtml = '<object width="0" height="0" id="DiffusionClientFlash" type="application/x-shockwave-flash" data="'+flashUrl+'" >';
	flashHtml += '<param name="allowScriptAccess" value="always" />';
	flashHtml += '<param name="bgcolor" value="#ffffff" />';
	flashHtml += '<param name="movie" value="'+flashUrl+'" />';
	flashHtml += '<param name="scale" value="noscale" />';
	flashHtml += '<param name="salign" value="lt" />';
	flashHtml += '</object>';
	
	var container = document.getElementById('DiffusionContainer');
	var div = document.createElement("div");
	div.innerHTML = flashHtml;
	container.appendChild(div);

	this.timeoutVar = setTimeout(DiffusionClient.bind(this.onTimeout,this), _cd.cascadeTimeout);
}

DiffusionFlashTransport.prototype.onTimeout = function() {
	DiffusionClient.trace("Flash Timeout Cascade");
	
	if( !DiffusionClient.diffusionTransport.isReconnecting ) {
		this.clearPlugin();
	}
	
	DiffusionClient.diffusionTransport.cascade();	
}
DiffusionFlashTransport.prototype.clearPlugin = function() {
	try {
		var container = document.getElementById('DiffusionContainer');
		var fc = document.getElementById('DiffusionClientFlash');
		if (fc != null) {
			// Remove old node
			var parent = fc.parentNode;
			parent.removeChild(fc);
			container.removeChild(parent);
		}
	} catch(e) {
	}	
}
DiffusionFlashTransport.prototype.onFlashConnect = function(val) {
	clearTimeout(this.timeoutVar);
	
	if(val == false) {
		DiffusionClient.trace("Flash Connection not successful.");		
		DiffusionClient.diffusionTransport.cascade();
		return;
	}
	else {
		var connectionData = val.split('\u0002');
		DiffusionClient.serverProtocolVersion = connectionData[0];
		DiffusionClient.trace("Flash Connection successful.");
		this.flashConnection = document["DiffusionClientFlash"];
		if(this.flashConnection == null) {
			this.flashConnection = window["DiffusionClientFlash"];
		}
		DiffusionClient.diffusionTransport.connected(connectionData[1]);
	}
}
DiffusionFlashTransport.prototype.onFlashBatch = function(data) {
	if(data.charAt(0) == "\u0003") {
		// Last one in the batch
		this.segments.push(data.substr(1));
		DiffusionClient.diffusionTransport.handleMessages(this.segments.join(""));
		this.segments = new Array();
	} else {
		this.segments.push(data);
		DiffusionClient.trace("Segment " + this.segments.length);
	}
} 
/**
 * @author dhudson
 * 
 * DiffusionSilverlightTransport class  -- implements DiffusionTransportInterface
 */
DiffusionSilverlightTransport = function() {
	this.silverlightConnection = null;
}
DiffusionSilverlightTransport.prototype.close = function () {
	if(this.silverlightConnection != null) {
		this.silverlightConnection.close();
	}
}
DiffusionSilverlightTransport.prototype.send = function(header, message) {
	this.silverlightConnection.send(header,message);
}
DiffusionSilverlightTransport.prototype.command = function(command, correlationID, topicMessage) {
	this.silverlightConnection.command(command, correlationID, topicMessage.toRecord());
}
DiffusionSilverlightTransport.prototype.sendTopicMessage = function(topicMessage) {	
	this.silverlightConnection.sendTopicMessage(topicMessage.toRecord());
}
DiffusionSilverlightTransport.prototype.sendCredentials = function(credentials) {
	this.silverlightConnection.sendCredentials(credentials.toRecord());
}
DiffusionSilverlightTransport.prototype.subscribe = function(topic) {
	this.silverlightConnection.subscribe(topic);
}
DiffusionSilverlightTransport.prototype.unsubscribe = function(topic) {
	this.silverlightConnection.unsubscribe(topic);
}
DiffusionSilverlightTransport.prototype.ping = function(timeStamp,queueSize) {
	this.silverlightConnection.ping(timeStamp,queueSize);
}
DiffusionSilverlightTransport.prototype.sendAckResponse = function(ackID) {
	this.silverlightConnection.sendAckResponse(ackID);
}
DiffusionSilverlightTransport.prototype.fetch = function(topic, correlationID) {
	if(correlationID) {
		topic += "\u0003" + correlationID;
	}
	this.silverlightConnection.fetch(topic);
}
DiffusionSilverlightTransport.prototype.connect = function( doReconnect ) {
	if( doReconnect && this.silverlightConnection != null ) {
		this.silverlightConnection.reconnect();
		return;
	}
	
	var _cd = DiffusionClient.connectionDetails;
		
	if(_cd.disableSilverlight) {
		DiffusionClient.diffusionTransport.cascade();
		return;
	}
	
	if(!DiffusionClient.hasSilverlight()) {
		DiffusionClient.diffusionTransport.cascade();
		return;
	}
	
	DiffusionClient.trace("Silverlight connect");

	this.clearPlugin();
	
	var silverlightUrl = DiffusionClient.connectionDetails.context + _cd.libPath + "/DiffusionClient.xap?v=4.5.2_01";
	var silverlightHtml = '<object data="data:application/x-silverlight-2," id="DiffusionClientSilverlight" type="application/x-silverlight-2" width="1" height="1">';
	silverlightHtml += '<param name="source" value="'+silverlightUrl+'" />';
	silverlightHtml += '<param name="onError" value="DiffusionClient.diffusionTransport.transport.onSilverlightError" />'
  	var topics;
	if (_cd.topic != null) {
      topics = _cd.topic.split(',').join('|');
  	}
  	else {
      topics = "";
  	}

	var initParams = "host="+_cd.silverlightHost+",port="+_cd.silverlightPort+",topic="+topics+",onDataEvent=DiffusionClient.diffusionTransport.handleMessages,";
	initParams += "callback=DiffusionClient.diffusionTransport.transport.onSilverlightConnect,transport="+_cd.silverlightTransport+",durl="+_cd.silverlightURL;
	
	if( doReconnect ) {
		initParams += ",clientid="+DiffusionClient.getClientID();
	}
	
	if(DiffusionClient.credentials != null) {
		initParams += ",username="+DiffusionClient.credentials.username + ",password="+DiffusionClient.credentials.password
	}
	
	if(DiffusionClient.isDebugging) {
		initParams += ",debugging=true";
	}
	
	silverlightHtml += '<param name="initParams" value="' + initParams + '" />'
	silverlightHtml += '<param name="minRuntimeVersion" value="4.0.50401.0" />'
	silverlightHtml += '<param name="autoUpgrade" value="false" />'
	silverlightHtml += '</object>';

	var container = document.getElementById('DiffusionContainer');
	
	var div = document.createElement("div");
	
	div.style.position="fixed";
	div.style.left="0px";
	div.style.top="0px";
	div.innerHTML = silverlightHtml;

	container.appendChild(div);
	
	this.timeoutVar = setTimeout(DiffusionClient.bind(this.onTimeout,this), _cd.cascadeTimeout);
}
DiffusionSilverlightTransport.prototype.onTimeout = function() {
	DiffusionClient.trace("Silverlight Timeout Cascade");

	if( !DiffusionClient.diffusionTransport.isReconnecting ) {
		this.clearPlugin();
	}
	
	DiffusionClient.diffusionTransport.cascade();	
}
DiffusionSilverlightTransport.prototype.clearPlugin = function() {
	try {
		var container = document.getElementById('DiffusionContainer');
		var fc = document.getElementById('DiffusionClientSilverlight');
		if (fc != null) {
			// Remove old node
			var parent = fc.parentNode;
			parent.removeChild(fc);
			container.removeChild(parent);
		}
	} catch(e) {
	}	
}
DiffusionSilverlightTransport.prototype.onSilverlightConnect = function(val) {
	clearTimeout(this.timeoutVar);
	
	if(val == false) {
		DiffusionClient.trace("Silverlight Connection not successful.");		
		DiffusionClient.diffusionTransport.cascade();
	}
	else {
		DiffusionClient.trace("Silverlight Connection successful.");
		var connectionData = val.split('\u0002');
		DiffusionClient.serverProtocolVersion = connectionData[0];
		
		var sjsbridge = null
		sjsbridge = document["DiffusionClientSilverlight"];
		if(sjsbridge == null) {
			sjsbridge = window["DiffusionClientSilverlight"];
		}
		
		this.silverlightConnection = sjsbridge.content.DiffusionJavaScriptClient;
		
		DiffusionClient.diffusionTransport.connected(connectionData[1]);
	}
}
DiffusionSilverlightTransport.prototype.onSilverlightError = function(sender, args) {
	DiffusionClient.trace("Silverlight Connection not successful. (Error)");
    var appSource = "";

    if (sender != null && sender != 0) {
      appSource = sender.getHost().Source;
    }

    var errorType = args.ErrorType;
    var iErrorCode = args.ErrorCode;

    if (errorType == "ImageError" || errorType == "MediaError") {
      return;
    }

    var errMsg = "Unhandled Error in Silverlight Application " +  appSource + "\n" ;
    errMsg += "Code: "+ iErrorCode + " Category: " + errorType + " Message: " + args.ErrorMessage + "\n";
    if (errorType == "ParserError") {
        errMsg += "File: " + args.xamlFile + " Line: " + args.lineNumber + " Position: " + args.charPosition + "\n";
    }
    else if (errorType == "RuntimeError") {           
        if (args.lineNumber != 0) {
            errMsg += "Line: " + args.lineNumber + " Position: " +  args.charPosition + "\n";
        }
        errMsg += "MethodName: " + args.methodName + "\n";
    }
    DiffusionClient.trace(errMsg);
}
/**
 * @author dhudson
 * 
 * DiffusionXHRTransport class  -- implements DiffusionTransportInterface
 */
DiffusionXHRTransport = function() {
	this.serverUrl = DiffusionClient.connectionDetails.XHRURL + DiffusionClient.connectionDetails.context + "/diffusion/";
	this.requests = new Array();
	this.isSending=false;
	this.requestListener=null;
	this.retryCount = 0;
	this.isNativeXmlHttp = false;
	this.seq = 0;
	this.aborted = false;
}
DiffusionXHRTransport.prototype.sendTopicMessage = function(topicMessage) {
	var headers = { "m": "2", "c":  DiffusionClient.getClientID(), "t" : encodeURIComponent(topicMessage.getTopic()), "s" : this.seq++ };

	if(topicMessage.getUserHeaders() != null) {
		headers.u=encodeURIComponent(topicMessage.getUserHeaders().join("\u0002"));
	}
	
	if(topicMessage.getAckRequired()) {
		headers.a = topicMessage.getAckID();
	}
	
	var requestWrapper = this.createDiffusionRequest(headers);
	requestWrapper.data = topicMessage.getMessage();
	
	this.processRequest(requestWrapper);
}
DiffusionXHRTransport.prototype.send = function(topic, message) {	
	var requestWrapper = this.createDiffusionRequest({"m" : "2", "c" : DiffusionClient.getClientID(), "t" : encodeURIComponent(topic), "s" : this.seq++});
	requestWrapper.data = message;
	this.processRequest(requestWrapper);
}
DiffusionXHRTransport.prototype.XHRSubscription = function(topic, action) {
	this.processRequest(this.createDiffusionRequest({"m" : action, "c" : DiffusionClient.getClientID(), "t" : encodeURIComponent(topic), "s" : this.seq++} ));
}
DiffusionXHRTransport.prototype.subscribe = function(topic) {
	this.XHRSubscription(encodeURIComponent(topic),"22");
}
DiffusionXHRTransport.prototype.unsubscribe = function(topic) {
	this.XHRSubscription(encodeURIComponent(topic),"23");	
}
DiffusionXHRTransport.prototype.ping = function(timeStamp,queueSize) {
	this.processRequest(this.createDiffusionRequest({"m" : "24", "c" : DiffusionClient.getClientID(), "u" :  encodeURIComponent([timeStamp,queueSize].join("\u0002")), "s" : this.seq++ } ));
}
DiffusionXHRTransport.prototype.sendClientPingResponse = function(header) {
	this.processRequest(this.createDiffusionRequest({"m" : "25", "c" : DiffusionClient.getClientID(), "u" : header, "s" : this.seq++ }));
}
DiffusionXHRTransport.prototype.sendAckResponse = function(ack) {
	this.processRequest(this.createDiffusionRequest({"m" : "32", "c" : DiffusionClient.getClientID(), "u" : ack, "s" : this.seq++ }));
}
DiffusionXHRTransport.prototype.fetch = function(topic, correlationID) {
	var headers = {"m" : "33", "c" : DiffusionClient.getClientID(), "t" : encodeURIComponent(topic), "s" : this.seq++ }
	
	if(correlationID) {
		headers.u = correlationID;
	}
	
	this.processRequest(this.createDiffusionRequest(headers));
}
DiffusionXHRTransport.prototype.command = function(command, correlationID, topicMessage) {
	var headers = { "m" : "36",
					"c" : DiffusionClient.getClientID(),
					"t" : encodeURIComponent(topicMessage.getTopic()),
					"s" : this.seq++ };

	headers.u = command;
	if(correlationID !== undefined && correlationID !== null) {
		headers.u += "\u0002" + correlationID;
	}
	if(topicMessage.getUserHeaders() != null) {
		headers.u += "\u0002";
		headers.u += topicMessage.getUserHeaders().join("\u0002");
	}

	if(headers.u!=undefined || headers.u!=null){
		headers.u = encodeURIComponent(headers.u);	
	}
	
	if(topicMessage.getAckRequired()) {
		headers.a = topicMessage.getAckID();
	}

	
	var requestWrapper = this.createDiffusionRequest(headers);
	requestWrapper.data = topicMessage.getMessage();

	this.processRequest(requestWrapper);
}

DiffusionXHRTransport.prototype.sendCredentials = function(credentials) {
	this.processRequest(this.createDiffusionRequest({"m" : "26", "c" : DiffusionClient.getClientID(), "username" : encodeURIComponent(credentials.username), "password" : encodeURIComponent(credentials.password), "s" : this.seq++}));
}
DiffusionXHRTransport.prototype.close = function() {
	if(this.pollRequest) {
		this.aborted = true;
		this.pollRequest.abort();	
	}
	
	// Needs to be sync
	var request = this.createXHRTransport();
	request.open("POST", this.serverUrl, false);
	request.setRequestHeader("m","29");
	request.setRequestHeader("c",DiffusionClient.getClientID());
	try {
		request.send("");
	} catch(e) {
	}
}
DiffusionXHRTransport.prototype.poll = function() {
	if(DiffusionClient.diffusionTransport.isClosing) {
		return;
	}
	
	var _this = this;
	var request = this.createDiffusionRequest({"m" : "1", "c" : DiffusionClient.getClientID() }).request;
	
	request.onreadystatechange = function() {
		if(_this.aborted) {
			// God bless IE9
			return;
		}
	
		if(request.readyState == 4) {
			if(request.status == 200) {
				DiffusionClient.diffusionTransport.handleMessages(request.responseText);
				_this.retryCount = 0;
				_this.poll();		
			}else if (DiffusionClient.diffusionTransport.isClosing != true) {					
				// Connection has been lost
				DiffusionClient.diffusionTransport.isClosing = true;
				DiffusionClient.diffusionTransport.isConnected = false;
					
				// Trash any requests awaiting
				this.requests = [];
				if (typeof DiffusionClient.connectionDetails.onLostConnectionFunction == 'function') {
					DiffusionClient.connectionDetails.onLostConnectionFunction();
				}
			}				
		}
	}
	
	this.pollRequest = request;
	request.send("");
}
DiffusionXHRTransport.prototype.connect = function( doReconnect ) {
	this.seq = 0;
	
	if(DiffusionClient.connectionDetails.disableXHR == true) {
		DiffusionClient.diffusionTransport.cascade();
		return;
	}
	if(this.detectXmlHttp() == false) {
		DiffusionClient.diffusionTransport.cascade();
		return;
	}
	
	DiffusionClient.trace("XHR connect");
	
	var _this = this;
	var headers = {
		m : "0",
		ty : "B",
		t : encodeURIComponent(DiffusionClient.connectionDetails.topic),
		tt : DiffusionClient.connectionDetails.transportTimeout,
		v : DiffusionClient.getClientProtocolVersion()
	}
	
	if( doReconnect ) {
		headers.c = DiffusionClient.getClientID();
	}
	
	var creds = DiffusionClient.getCredentials();
	
	if(creds != null) {
		headers.username = encodeURIComponent(creds.username);
		headers.password = encodeURIComponent(creds.password);
	}
	
	var request = this.createDiffusionRequest(headers).request;
	request.onreadystatechange = function() {
		if(request.readyState == 4 ) {
			if (request.status == 200) {
				var somedata = request.responseText.split("\u0002");
				// First byte is protocol version
				DiffusionClient.serverProtocolVersion = somedata.shift();
				var responseCode = somedata.shift();
				DiffusionClient.messageLengthSize = somedata.shift();

				if (responseCode == "100"||responseCode == "105") {
					DiffusionClient.diffusionTransport.connected(somedata[0]);
					_this.poll();
				} else {
					if(responseCode == "111") {
						DiffusionClient.diffusionTransport.connectionRejected();
					}
					
					DiffusionClient.diffusionTransport.cascade();
				}
			} else {
				DiffusionClient.diffusionTransport.cascade();
			}
		}
	}
	request.send("");
}
DiffusionXHRTransport.prototype.createXHRTransport = function() {
	if(this.isNativeXmlHttp) {
		return new XMLHttpRequest(); 
	} else {
		return new ActiveXObject(this.activeXName);
	}
}
DiffusionXHRTransport.prototype.processRequest = function(request) {	
	
	if(request != null) {
		this.requests.push(request);
	}
	
	if(this.isSending) {
		return;
	}
	
	if(this.requests.length == 0 ) {
		return;
	}
	
	var requestWrapper = this.requests.shift();
	var sendRequest = requestWrapper.request;

	var _this = this;

	sendRequest.onreadystatechange = function(){
		try {
			if (sendRequest.readyState == 4) {
				if (sendRequest.status == 0) {
					DiffusionClient.trace("checkRequest - lost connection");
					
					DiffusionClient.diffusionTransport.isClosing = true;
					DiffusionClient.diffusionTransport.isConnected = false;
					
					if (typeof DiffusionClient.connectionDetails.onLostConnectionFunction == 'function') {
						DiffusionClient.connectionDetails.onLostConnectionFunction();
					}
				}
				_this.isSending = false;
				setTimeout(function(){
					_this.processRequest(null);
				}, 0);
			}
		} 
		catch (e) {
			DiffusionClient.trace("error: processRequest " + e);
		}
	}
	this.isSending = true;
	sendRequest.send(requestWrapper.data);
}
DiffusionXHRTransport.prototype.createDiffusionRequest = function(headers) {
	var request = this.createXHRTransport();
	request.open("POST", this.serverUrl, true);
	for(var header in headers) {
		try {
			request.setRequestHeader(header,headers[header]);			
		} catch(e) {
			DiffusionClient.trace("Can't set header " + header + ":"+headers.join(":"));
		}
	}
	
	var requestWrapper = { 'data' : "", 'request' : request };
	return requestWrapper;
}
DiffusionXHRTransport.prototype.detectXmlHttp = function() {
	var xmlhttp = null;
	// Can we get a native request
	try {
		xmlhttp = new XMLHttpRequest();
		DiffusionClient.trace("detectXmlHttp: got native");
		if(xmlhttp != null) {
			this.isNativeXmlHttp = true;
			return true;
		}
	} catch(e){}
		
	if(DiffusionClient.isIE) {
		var activeXNames = new Array('MSXML2.XMLHTTP.4.0', 'MSXML2.XMLHTTP.3.0', 'MSXML2.XMLHTTP', 'Microsoft.XMLHTTP');
		for(var i=0; i< activeXNames.length; ++i) {
			try {
				xmlhttp = new ActiveXObject(activeXNames[i]);
			}
			catch(e){}
			if(xmlhttp != null) {
				this.activeXName = activeXNames[i];
				DiffusionClient.trace("detectXmlHttp: " + this.activeXName);
				return true;
			}
		}
	}
	return false;
}
/**
 * @author dhudson
 * 
 * DiffusionIframeTransport class  -- implements DiffusionTransportInterface
 */
DiffusionIframeTransport = function() {
	this.container=document.getElementById('DiffusionContainer');
	this.requests = new Array();
	this.pollFrame=null;
	this.connectFrame=null;
	this.baseURL = DiffusionClient.connectionDetails.context + "/diffusion/";
	this.isSending = false;
	this.seq = 0;
}
DiffusionIframeTransport.prototype.send = function(topic, message) {
	this.post("?m=2&c="+DiffusionClient.getClientID()+"&t="+encodeURIComponent(topic)+"&d="+encodeURIComponent(message));
}
DiffusionIframeTransport.prototype.sendTopicMessage = function(topicMessage) {
	var url = "?m=2&c="+DiffusionClient.getClientID()+"&t="+encodeURIComponent(topicMessage.getTopic())+"&d="+encodeURIComponent(topicMessage.getMessage());
	if(topicMessage.getUserHeaders() != null) {
		url += "&u="+encodeURIComponent(topicMessage.getUserHeaders().join("\u0002"));
	}
	if(topicMessage.getAckRequired()) {
		url += "&a="+topicMessage.getAckID();
	}
	this.post(url);
}
DiffusionIframeTransport.prototype.subscribe = function(topic) {
	this.post("?m=22&c="+DiffusionClient.getClientID()+"&t="+encodeURIComponent(topic));
}
DiffusionIframeTransport.prototype.unsubscribe = function(topic) {
	this.post("?m=23&c="+DiffusionClient.getClientID()+"&t="+encodeURIComponent(topic));
}
DiffusionIframeTransport.prototype.ping = function(timeStamp, queueSize) {
	this.post("?m=24&c="+DiffusionClient.getClientID()+"&u="+ encodeURIComponent(timeStamp + "\u0002" + queueSize));
}
DiffusionIframeTransport.prototype.sendAckResponse = function(ack) {
	this.post("?m=32&c="+DiffusionClient.getClientID()+"&u="+ack);
}
DiffusionIframeTransport.prototype.sendCredentials = function(credentials) {
	this.post("?m=26&c="+DiffusionClient.getClientID()+"&username="+encodeURIComponent(credentials.username)+"&password="+encodeURIComponent(credentials.password));
}
DiffusionIframeTransport.prototype.fetch = function(topic, correlationID) {
	if(correlationID) {
		this.post("?m=33&c="+DiffusionClient.getClientID()+"&t="+encodeURIComponent(topic)+"&u"+correlationID);		
	}else {
		this.post("?m=33&c="+DiffusionClient.getClientID()+"&t="+encodeURIComponent(topic));
	}
}
DiffusionIframeTransport.prototype.command = function(command, correlationID, topicMessage) {
	var url = "?m=36&c="+DiffusionClient.getClientID()+"&t="+encodeURIComponent(topicMessage.getTopic())+"&d="+encodeURIComponent(topicMessage.getMessage());

	url += "&u=" + command;
	if(correlationID !== undefined && correlationID !== null) {
		url += encodeURIComponent("\u0002" + correlationID);
	}
	if(topicMessage.getUserHeaders() != null) {
		url += encodeURIComponent("\u0002" + topicMessage.getUserHeaders().join("\u0002"));
	}
	
	if(topicMessage.getAckRequired()) {
		url += "&a="+topicMessage.getAckID();
	}
	this.post(url);
}
DiffusionIframeTransport.prototype.close = function() {
	if( this.connectFrame != null ) {
	
		var url = this.baseURL + "?m=29&c="+DiffusionClient.getClientID();	
		DiffusionClient.trace("close : " +url);
		
		if( DiffusionClient.isIE ) {
			this.connectFrame.src = url;	
		} else {
			this.connectFrame.contentDocument.location.replace(url);
		}
		
		this.container.removeChild( this.pollFrame );
		this.pollFrame = null;
		
		this.container.removeChild( this.connectFrame );
		this.connectFrame = null;
	}
}
DiffusionIframeTransport.prototype.sendClientPingResponse = function(header) {
		this.post("?m=25&c="+DiffusionClient.getClientID()+"&u="+header);
}
DiffusionIframeTransport.prototype.connect = function( doReconnect ) {
	this.seq = 0;
	
	var _cd = DiffusionClient.connectionDetails;
	
	if(_cd.disableIframe) {
		DiffusionClient.diffusionTransport.cascade();
		return;
	}
	
	var url = this.baseURL + "?m=0&ty=B&t="+encodeURIComponent(_cd.topic)+"&tt="+_cd.transportTimeout+"&v="+DiffusionClient.getClientProtocolVersion();
	
	if( doReconnect ) {
		url += "&c="+DiffusionClient.getClientID();
	}
	
	if( DiffusionClient.credentials != null ) {
		url += "&username="+ encodeURIComponent(DiffusionClient.credentials.username) +"&password="+ encodeURIComponent(DiffusionClient.credentials.password);
	}
	
	this.connectFrame = this.createFrame('DIT', url, false);
	setTimeout(function(){
		if (DiffusionClient.diffusionTransport.isConnected == false) {
			DiffusionClient.diffusionTransport.cascade();
		}
	}, 500);
}
DiffusionIframeTransport.prototype.poll = function() {
	if( DiffusionClient.diffusionTransport.isClosing ) {
		return;
	}
	
	var url = this.baseURL + "?m=1&c="+DiffusionClient.getClientID()+"&nc="+new Date().valueOf();
	this.pollFrame = this.createFrame('DITP', url, true);
}
DiffusionIframeTransport.prototype.createFrame = function(id, url, isPolling){
	try {
		var node = document.getElementById(id);
		if(node) {
			this.container.removeChild(node);
		}
	} catch(e) { }
	
	var iframe;
	var props = { id : id, name	: id, src : url },
		evnts = [ "onload", "onerror", "onunload" ],
		callback = DiffusionClient.diffusionTransport.transport.process;
		
	try {
		iframe = document.createElement('<iframe id="'+props.id+'" name="'+props.id+'" src="'+props.src+'">');
	} catch(e) {
		iframe = document.createElement("iframe");
		for( var p in props ) iframe[p] = props[p];
	}

	iframe.style.width = "0px";
	iframe.style.height = "0px";
	iframe.style.border = "none";
	
	if( isPolling ) {
		if( iframe.attachEvent ) {
			while( evnts.length ) iframe.attachEvent(evnts.pop(), callback);
		} else {
			while( evnts.length ) iframe[evnts.pop()] = callback;
		}
	}
	
	this.container.appendChild(iframe);
	return iframe;
}
DiffusionIframeTransport.prototype.post = function(url) {
	this.requests.push(url);
	if(this.isSending == false) {
		this.isSending = true;
		_this = this;
		setTimeout(function() {
			_this.processRequest();
		},  80);		
	}
}
DiffusionIframeTransport.prototype.processRequest = function() {
	if(this.requests.length > 0) {
		var url = this.baseURL + this.requests.shift()+"&s="+this.seq++;
		if (this.connectFrame != null) {
			if(DiffusionClient.isIE) {
				this.connectFrame.src = url;	
			} else if( this.connectFrame.contentDocument ) {
				this.connectFrame.contentDocument.location.replace(url);
			}
		}
	}
	
	if(this.requests.length > 0) {
		_this = this;
		setTimeout(function() {
			_this.processRequest();
			},  80);
	} else {
		this.isSending = false;
	}
}

DiffusionIframeTransport.prototype.process = function() {
	try {
		var frame = DiffusionClient.diffusionTransport.transport.pollFrame;
		if( frame ) {
			var content = frame.contentWindow ? frame.contentWindow.document : frame.contentDocument ? frame.contentDocument : frame.document;
			if( content !== undefined && content.getElementsByTagName("script").length > 0 ) {	
				return DiffusionClient.diffusionTransport.transport.poll();
			} 
		}
	} catch(e) {
		DiffusionClient.trace("Error: Diffusion iFrame Transport: process " + e);
	}
	
	// Diffusion has gone away
	if( DiffusionClient.diffusionTransport.isClosing != true) {
		DiffusionClient.diffusionTransport.isClosing = true;
		DiffusionClient.diffusionTransport.isConnected = false;
		
		if (typeof DiffusionClient.connectionDetails.onLostConnectionFunction == 'function') {
			DiffusionClient.connectionDetails.onLostConnectionFunction();
		}
	}
}
/**
 * @author Push Technology Ltd
 * @class DiffusionClientConnectionDetails
 * This class specifies all of the possible connection detail parameters.
 * This class is used as a default and any connection details passed into the connect method of {@link DiffusionClient} will be extended by this class
 */
DiffusionClientConnectionDetails = function() {
	/**
	 * Enable console logging for the connection&#46; 
	 * 
	 * @type Boolean
	 * @default false
	 */
	this.debug = false;
	/**
	 * This is the html path that the Diffusion libraries are stored&#46;
	 * 
	 * @type String
	 * @default "/lib/DIFFUSION"
	 */
	this.libPath = "/lib/DIFFUSION";
	
	/**
	 * If a Diffusion deployment is in a application server, a context will need to be specified&#46;
	 * 
	 * @type String
	 * @default ""
	 */
	this.context = "";
	
	/**
	 * This is the timeout (in ms) for cascading if the transport fails to load&#46;
	 * 
	 * @type Number
	 * @default 4000
	 */
	this.cascadeTimeout = 4000;
	
	/**
	 * The host name of which the flash socket will connect to&#46;
	 * 
	 * @type String
	 * @default window.location.hostname
	 */
	this.flashHost = window.location.hostname;
	
	/**
	 * This is the port of which the flash socket will connect to&#46;
	 * 
	 * @type Number
	 * @default window.location.port
	 */
	this.flashPort = (( window.location.port == 0) ? 80 : window.location.port);
	
	/**
	 * This is the URL to use if HTTP Transport is to be used within the Flash Player
	 * 
	 * @type String
	 * @default location.protocol + "//" + location.host
	 */
	this.flashURL = location.protocol + "//" + location.host
	
	/**
	 * This controls the flash transport&#46; By default it is set to cascade, which means that it will try a socket connection first,
	 * if that fails, then it will try the HTTP transport. Valid values are S socket, H HTTP, C cascade.
	 * 
	 * @type String
	 * @default "S"
	 */
	this.flashTransport = "S";
	
	/**
	 * This is the number of millis that the socket connection will try before cascading down to HTTP&#46;
	 * 
	 * @type Number
	 * @default 3000
	 */
	this.flashTimeout = 3000;
	
	/**
	 * Disable the flash transport&#46;
	 * 
	 * @type Boolean
	 * @default false
	 */
	this.disableFlash = false;
	
	/**
	 * The host name of which the silverlight socket will connect to&#46;
	 * 
	 * @type String
	 * @default window.location.hostname
	 */
	this.silverlightHost = window.location.hostname;
	
	/**
	 * This is the port of which the silverlight socket will connect to&#46;
	 * 
	 * @type Number
	 * @default 4503
	 */
	this.silverlightPort = 4503;
	
	/**
	 * This is the URL to use if HTTP Transport is to be used within the Silverlight Player
	 * 
	 * @type String
	 * @default location.protocol + "//" + location.host
	 */
	this.silverlightURL = location.protocol + "//" + location.host
	
	/**
	 * This controls the silverlight transport, by default it is set to cascade, which means that it will try a socket connection first,
	 * if that fails, then it will try the HTTP transport. Valid values are S socket, H HTTP, C cascade.
	 * 
	 * @type String
	 * @default "S"
	 */
	this.silverlightTransport = "S";
	
	/**
	 * Disable the silverlight transport&#46;
	 * 
	 * @type Boolean
	 * @default false
	 */
	this.disableSilverlight = false;
	
	/**
	 * This is where it is possible to change where the XmlHttpRequests get served from, if MOD_PROXY not being used and there is a sub domain available&#46;
	 * 
	 * @type String
	 * @default location.protocol + "//" + location.host
	 */
	this.XHRURL = location.protocol + "//" + location.host
	
	/**
	 * This is the number of retries the XmlHttpRequest transport will make before it announces that it has lost connection with the Diffusion Server&#46;  
	 * 
	 * @type Number
	 * @default 3
	 */
	this.XHRretryCount = 3;
	
	/**
	 * This is the number of millis to wait to announce that it was not possible to connect to Diffusion&#46;
	 * 
	 * @type Number
	 * @default 4000
	 */
	this.timeoutMS = 4000;
	
	/**
	 * This is the number of seconds to hold open a XmlHttpRequest / IFrame poll whilst awaiting data&#46;
	 * 
	 * @type Number
	 * @default 90
	 */
	this.transportTimeout = 90;
	
	/**
	 * Disable the XHR transport&#46;
	 * 
	 * @type Boolean
	 * @default false
	 */
	this.disableXHR = false;
	
	/**
	 * This is the Web Socket URL&#46;
	 * 
	 * @type String
	 * @default "ws://" + location.host
	 */
	this.wsURL = "ws";
	if(location.protocol=="https:"){
		this.wsURL += "s";
	}
	this.wsURL += "://" + location.host;
	
	/**
	 * Connection timeout for web sockets in millis&#46;
	 * 
	 * @type Number
	 * @default 2000
	 */
	this.wsTimeout = 2000;
	
	/**
	 * Disable the Web Socket transport&#46; 
	 * 
	 * @type Boolean
	 * @default false
	 */
	this.disableWS = false; 
	
	/**
	 * Disable iFrame transport&#46;
	 * 
	 * @type Boolean
	 * @default false
	 */
	this.disableIframe = false;
	
	/**
	 * This is the topic to connect to diffusion with&#46;
	 * 
	 * @type String
	 * @default null
	 */
	this.topic = null;
	
	/**
	 * This flag determines if the Diffusion Client will auto acknowledge messages sent from the server with the Ack / Nak flag set, or if set to false it is down to the 
	 * client implementation to send the Ack back&#46;
	 * 
	 * @type Boolean
	 * @default True
	 */
	this.autoAck = true;
	
	/**
	 * This is the function that will be responsible for handling messages from Diffusion.  This function will be called with a argument of WebClientMessage&#46; 
	 * This function will be called even if there is a topic listener in place for a topic&#46;
	 * 
	 * @example
	 * var details = new DiffusionClientConnectionDetails();
	 * details.onDataFunction = function(msg) {
	 * 	// Do something
	 * }
	 * 
	 * @type Function
	 * @default null
	 */
	this.onDataFunction = null;
	
	/**
	 * This function is called when the user closes the browser or navigates away from the page.
	 * @type Function
	 * @default null
	 */
	this.onBeforeUnloadFunction = null;
	
	/**
	 * This function is called when Diffusion has connected, or exhausted all transports and can not connect&#46; 
	 * <p>This function is supplied with two boolean parameters, indicating if the client has connected, and if it is a reconnect.
	 * 
	 * @type Function
	 * @default null
	 * 
	 * @example
	 * var details = new DiffusionClientConnectionDetails();
	 * details.onCallbackFunction = function(isConnected, isReconnect) {
	 * 	if (isConnected) {
	 * 		// We know we're connected
	 * 
	 * 		if (!isReconnect) {
	 * 			// If we're connecting for the first time, init stuff
	 * 		}
	 * 	}
	 * }
	 */
	this.onCallbackFunction = null;
	
	/**
	 * This function is called when an invalid Diffusion operation is called, for instance if Diffusion&#46;subscribe was called before Diffusion&#46;connect(&#46;&#46;)&#46;
	 * <p>This function is supplied with no parameters.
	 * 
	 * @type Function
	 * @default null
	 */
	this.onInvalidClientFunction = null;
	
	/**
	 * This function is called when the DiffusionClient cascades transports&#46;
	 * <p>The function is supplied with an argument of the {String} transport name, or NONE if all transport are exhausted.
	 * @type Function
	 * @default null
	 */
	this.onCascadeFunction = null;
	
	/**
	 * This function is called with an argument of PingMessage when the ping response has been returned from the server.
	 * 
	 * @type Function
	 * @default null
	 */
	this.onPingFunction = null;
	
	/**
	 * This function is called when the Diffusion Server has terminated the client connected (or the connection has been banned)&#46;
	 * <p>This function is supplied with no parameters.
	 * 
	 * @type Function
	 * @default null
	 */
	this.onAbortFunction = null;
	
	/**
	 * This function is called when the DiffusionClient has lost connection with the Diffusion Server&#46;
	 * <p>This function will be supplied with no parameters.
	 * 
	 * @type Function
	 * @default null
	 */
	this.onLostConnectionFunction = null;
	
	/**
	 * This function is called when the DiffusionClient connection has been rejected by the Diffusion Server, this is due to incorrect credentials&#46;
	 * <p>This function is called with no parameters.
	 * 
	 * @type Function
	 * @default null
	 */
	this.onConnectionRejectFunction = null;
	
	/**
	 * This function is called when a message that has been requested as Acknowledge didn't respond in time&#46;
	 * <p>This function will be supplied with a parameter of the topic message that wasn't acknowledged
	 * 
	 * @type Function
	 * @default null
	 */
	this.onMessageNotAcknowledgedFunction = null;
	
	/**
	 * This function is called after a DiffusionClient.sendCredentials and the server rejected the credentials&#46;
	 * <p>This function will be supplied with no parameters.
	 * 
	 * @type Function
	 * @default null
	 */ 
	 this.onServerRejectedCredentialsFunction = null;
	 
	 /**
	  * This function is called if a topic that a client was subscribed to status has changed (topic removal implemented for now)&#46;
	  * Status of R returned for removed&#46;
	  * <p>This function will be supplied with one argument of a TopicStatusMessage.
	  * 
	  * @type Function
	  * @default null
	  */
	 this.onTopicStatusFunction = null;
}
/**
 * @author Push Technology Ltd
 * @class DiffusionRecord
 * 
 * A class representing a Record. This provides an API for putting values into a message.
 */
DiffusionRecord = function( ) {
	this.fields = [];
	DiffusionRecord.prototype.addFields.apply( this, arguments );
}

DiffusionRecord.prototype.fieldDelimiter = "\u0002";
DiffusionRecord.prototype.recordDelimiter = "\u0001";

/**
 * Set the field value at a given index
 * @param {Number} index The field index
 * @param {String} field The value to set
 */
DiffusionRecord.prototype.setField = function( index, field ) {
	if( this.fields[ index ]  ) {
		this.fields[ index ] = field;
	}
}

/**
 * Add a field at a particular index
 * <p>If the index is greater than current field list, the field will be appended
 * 
 * @param {Number} index The index at which to add the field
 * @param {String} field the value to set
 */
DiffusionRecord.prototype.addField = function( index, field ) {
	// Optimise for general case of appending fields - push is faster than splice
	if( index >= this.fields.length ) {
		this.fields.push( field );
	} else {
		this.fields.splice( index, 0, field );
	}
}

/**
 * Append one or more fields to this record
 * @param {String[]|String...} fields An array of Strings or multiple string arguments
 */
DiffusionRecord.prototype.addFields = function( field ) {
	if( field ) {
		var fields = typeof field === "string" ? arguments : field;
		var length = fields.length, i = 0;
		
		for(; i < length; ++i ) {
			this.fields.push( fields[i] );
		}
	}
}

/**
 * Removes the field at the specified index
 * @param {Number} index
 */
DiffusionRecord.prototype.removeField = function( index ) {
	this.fields.splice( index, 1);
}

/**
 * Gets the field at the specified index
 * @param {Number} index
 * @returns {String} field
 */
DiffusionRecord.prototype.getField = function( index ) {
	return this.fields[ index ];
}

/**
 * Get a copy of all fields in this record as an array
 * @returns {Array} field array
 */
DiffusionRecord.prototype.getFields = function() {
	return this.fields.concat();
}

/**
 * Returns the string representation of this Record (with correct delimiters)
 * @returns {String} the string representation
 */
DiffusionRecord.prototype.toString = function() {
	return this.fields.join( this.fieldDelimiter );
}

/**
 * Returns the number of fields in this Record
 * @returns {Number} number of fields.
 */
DiffusionRecord.prototype.size = function() {
	return this.fields.length;
}
/**
 * @author Push Technology Ltd
 * @class WebClientMessage
 * 
 * This is the class that all normal messages from the server will be instantiated with.
 */
WebClientMessage = function(response, messageCount) {
	this.messageCount = messageCount;
	this.messageType = response.charCodeAt(0);
	this.timeStamp = new Date();

	this.ackID = null;
	this.needsAcknowledge = false;
	
	this.records = [];
	this.headers = [];
	
	// Maintain lengths and pointers to allow us to traverse through fields/records easily
	this.fieldslength = 0;
	
	this.fieldPointer = 0;
	this.recordPointer = 0;
	this.recordFieldPointer = 0;
	
	this.header = "";
	this.message = "";
	
	this.payload = response;
	this.parseResponse( response );
	
	this.recordlength = this.records.length;
	this.headerlength = this.headers.length;
	
	this.topic = this.headers.shift().slice( 1 );
	
	if(this.messageType == 30 || this.messageType == 31) {
		this.ackID = this.headers.shift();
		this.needsAcknowledge = true;
	}
}

WebClientMessage.prototype.displayFormatRecordRegex = new RegExp( DiffusionRecord.prototype.recordDelimiter,"g");
WebClientMessage.prototype.displayFormatFieldRegex = new RegExp( DiffusionRecord.prototype.fieldDelimiter,"g");


/**
 * Get the header for this message
 * @returns {String} the header information of the message
 */
WebClientMessage.prototype.getHeader = function() {
	return this.header;
}

/**
 * Get the body of this message as String
 * @returns {String} the message sent from Diffusion to the client
 */
WebClientMessage.prototype.getBody = function() {
	return this.payload.substr((this.getHeader().length+1));
}

/**
 * Check if this message is an ITL message
 * @returns {Boolean} true if the message type is a ITL message
 */
WebClientMessage.prototype.isInitialTopicLoad = function() {
	return (this.messageType == 20 || this.messageType == 30);
}

/**
 * Check if this message is a fetch message
 * @returns {Boolean}
 */
WebClientMessage.prototype.isFetchMessage = function() {
	return (this.messageType == 34);
}

/**
 * Check if this message is a delta message
 * @returns {Boolean} true if the message type is a delta message
 */
WebClientMessage.prototype.isDeltaMessage = function() {
	return (this.messageType == 21 || this.messageType == 31);
}


/**
 * Get the topic on which this message was sent
 * @returns {String} the topic of this message
 */
WebClientMessage.prototype.getTopic = function() {
	return this.topic;
}

/**
 * Set the topic for this message
 * @param {String} topic
 */
WebClientMessage.prototype.setTopic = function(topic) {
	this.topic = topic;
}

/**
 * Get the number of records in this message
 * @returns {Number} the number of Diffusion records held in this message
 */
WebClientMessage.prototype.getNumberOfRecords = function() {
	return this.records.length;
}

/**
 * Get the fields contained within the specified record
 * @param {Number} index
 * @returns {Array} fields contained in the record of the given index
 */
WebClientMessage.prototype.getFields = function(index) {
	if( this.records[index] ) {
		return this.records[index].getFields();
	}
}

/**
 * Get the record at the specified index
 * @param {Number} index
 * @returns {DiffusionRecord} record at given index
 */
WebClientMessage.prototype.getRecord = function(index) {
	return this.records[index];
}

/**
 * Get the records contained within this message
 * @returns {Array} records contained in the message
 */
WebClientMessage.prototype.getRecords = function() {
	return this.records.concat();
}

/**
 * Checks to see if there is unread data in the message
 * @returns {Boolean} 
 */
WebClientMessage.prototype.hasRemaining = function() {
	return this.fieldslength > this.fieldPointer;
}

/**
 * Returns the next available field if it exists
 * @returns {String} next field from record
 */
WebClientMessage.prototype.nextField = function() {
	// Loop to next record with content (if necessary) 
	while( this.records[ this.recordPointer ] && this.records[ this.recordPointer ].size() <= this.recordFieldPointer ) {
		this.recordPointer++;
		this.recordFieldPointer = 0;
	}
	
	if( this.records[ this.recordPointer ] ) {
		this.fieldPointer++;
		return this.records[ this.recordPointer ].getField( this.recordFieldPointer++ );
	}
}

/**
 * Returns the next available record if it exists
 * @returns {DiffusionRecord} next record in message
 */
WebClientMessage.prototype.nextRecord = function() {
	if( this.recordlength > this.recordPointer ) {
		this.fieldPointer += ( this.records[ this.recordPointer ].size() - this.recordFieldPointer );
		this.recordFieldPointer = 0;
		return this.records[ this.recordPointer++ ];
	}
}
/**
 * Reset all record and field pointers
 */
WebClientMessage.prototype.rewind = function() {
	this.fieldPointer = this.recordPointer = this.recordFieldPointer = 0;
}

/**
 * Get the JSON representation of this message, if sent as such
 * @returns {Object} the message as an object if the message was sent in JSON format
 */
WebClientMessage.prototype.getJSONObject = function() {
	var jsonString = this.records[0].getField(0);
	
	if( window.JSON && typeof window.JSON.parse === "function" ) {
		return JSON.parse( jsonString );
	} else {
		return eval("("+jsonString+")");
	}
}

/**
 * Get a date representing when this message was created
 * @returns {Date} the time of when the message was created
 */
WebClientMessage.prototype.getTimestampAsDate = function() {
	return this.timeStamp;
}

/**
 * Get a localised String representation of when this message was created
 * @returns {String} the message creation time in locale date format
 */
WebClientMessage.prototype.localeTimeString = function() {
	return this.timeStamp.toLocaleTimeString();
}

/**
 * Get the sequence number of this message.
 * <p>This is also the same as the number of messages that have been produced by this connection.
 * @returns {Number} message count
 */
WebClientMessage.prototype.getMessageCount = function() {
	return this.messageCount;
}

/**
 * Get user headers
 * @returns {Array} an array of user headers if any were sent with the message or an empty array if none were sent
 */
WebClientMessage.prototype.getUserHeaders = function() {
	return this.headers;
}

/**
 * Get the header at a particular index
 * @param {Number} index
 * @returns {String} the user header at a given index
 */
WebClientMessage.prototype.getUserHeader = function(index) {
	return this.headers[index];
}

/**
 * Get the final part of the topic name
 * @returns {String} the final element of the topic name
 * @example if the topic name is a/b/c this function would return c
 */
WebClientMessage.prototype.getBaseTopic =  function() {
	return this.topic.substr((this.topic.lastIndexOf('/')+1), this.topic.length);
}


/**
 * Check if the message requires an Acknowledgement
 * @returns {Boolean} true if this message needed an Acknowledgement.  There is no need for the user to send the Ack, as the transport will do this
 */
WebClientMessage.prototype.isAckMessage = function() {
	return (this.messageType == 30 || this.messageType == 31);
}

/**
 * If this message requires an acknowledgement, get the Ack ID
 * @returns {String} the Ack ID
 */
WebClientMessage.prototype.getAckID = function() {
	return this.ackID;
}

/**
 * This method is used internally when the message has been acknowledged
 */
WebClientMessage.prototype.setAcknowledged = function() {
	this.needsAcknowledge = false;
}


/**
 * Check whether this message has been acknowledged
 * @returns {Boolean} true if the message needs to be acknowledged
 */
WebClientMessage.prototype.needsAcknowledgement = function() {
	return this.needsAcknowledge;
}

/**
 * Get a string representation of the message, with human-readable delimiters
 * @returns {String} the messages with <RD>'s and <FD>'s
 */
WebClientMessage.prototype.displayFormat = function() {
	var display=""; 
	if(this.headerslength>0) {
		display = "[" + this.headers.join("|") + "]";
	}
	
	display += this.getBody().replace( this.displayFormatRecordRegex,"<RD>");
	display = display.replace( this.displayFormatFieldRegex,"<FD>");

	return display;
}

/**
 * Sets records and headers from response string
 * @param {String} response
 */
WebClientMessage.prototype.parseResponse = function( response ) {
	var parts = response.split( DiffusionRecord.prototype.recordDelimiter ), length = parts.length, i = 0;
	for(; i < length; ++i ) {
		var fields = parts[i].split( DiffusionRecord.prototype.fieldDelimiter );
		
		if( i === 0 ) {
			this.header = parts[i];
			this.headers = fields;
		} else {
			this.fieldslength += fields.length;
			this.records.push( new DiffusionRecord( fields ) );
		}
	}
}/**
 * @author Push Technology Ltd
 * @class TopicMessage
 * 
 * This allows the instantiation of full messages on the client, to be populated via the exposed API and then sent to the server. 
 */
TopicMessage = function(topic, message) {
	this.topic = topic;
	this.isCrypted = false;
	this.userHeaders = null;
	this.isAckRequested = false;
	this.ackTimeout = 0;
	
	this.records = [];
	
	this.parseMessage( message );
	this.message = message;
}

/**
 * Return the string representation of the message body
 * Alias for asString method
 * 
 * @deprecated Use TopicMessage.asString instead
 * @returns {String} the message 
 */
TopicMessage.prototype.getMessage = function() {
	return this.asString();
}

/**
 * Set message value from string
 * Alias for put method
 * @deprecated Use TopicMessage.put instead
 * @param {String} message
 */
TopicMessage.prototype.setMessage = function(message) {
	this.put( message );
}

/**
 * Set message value from string
 * @param {String} message
 */
TopicMessage.prototype.put = function( message) {
	this.parseMessage( message );
}

/**
 * Insert one or more fields into the current record.
 * @param {String[]|String...} fields Either an array, or multiple strings
 */
TopicMessage.prototype.putFields = function( field ) {
	if( field ) {
		if( !this.records.length ) {
			this.records.push( new DiffusionRecord() );
		}
		
		var fields = typeof field === "string" ? arguments : field;
		this.records[ this.records.length -1 ].addFields( fields );
	}
}

/**
 * Insert one or more fields into a new record.
 * 
 * @param {String[]|String...} fields Either an array, or multiple strings
 */
TopicMessage.prototype.putRecord = function( field ) {
	if( field ) {
		var fields = typeof field === "string" ? arguments : field;
		this.records.push( new DiffusionRecord( fields ) );
	}
}

/**
 * Put one or more Records into the message
 * @param {DiffusionRecord[]|DiffusionRecord...} records Either an array, or multiple DiffusionRecords
 */
TopicMessage.prototype.putRecords = function( record ) {
	if( record ) {
		var records = record instanceof DiffusionRecord ? arguments : record;
		var i = 0, length = records.length;
		
		for(; i<length; ++i) {
			this.records.push(records[i]);
		}
	}
}


/**
 * Returns the records held in the message
 * @return {Array} records
 */
TopicMessage.prototype.asRecords = function() {
	return this.records;
}

/**
 * Returns an array of all fields contained within message
 * @return {Array} fields
 */
TopicMessage.prototype.asFields = function() {
	var fields = [], length = this.records.length, i = 0;
	for(; i < length; ++i ) {
		fields.push.apply( fields, this.records[i].getFields() );
	}
	return fields;
}

/**
 * Returns the message body with correct delimiters
 * @return {String} message body
 */
TopicMessage.prototype.asString = function() {
	return this.records.join( DiffusionRecord.prototype.recordDelimiter );
}

/**
 * Returns the message body, formatted to display tags instead of character entities as delimiters
 * @returns {String} the messages with <RD>'s and <FD>'s
 */
TopicMessage.prototype.displayFormat = function() {
	return this.asString().replace( this.displayFormatRecordRegex,"<RD>").replace( this.displayFormatFieldRegex,"<FD>");
}

/**
 * @ignore
 */
TopicMessage.prototype.displayFormatRecordRegex = new RegExp( DiffusionRecord.prototype.recordDelimiter,"g");

/**
 * @ignore
 */
TopicMessage.prototype.displayFormatFieldRegex = new RegExp( DiffusionRecord.prototype.fieldDelimiter,"g");

/**
 * Convert message string into records and fields 
 * @param {String} message
 */
TopicMessage.prototype.parseMessage = function( message ) {
	if( message ) {
		var parts = message.split( DiffusionRecord.prototype.recordDelimiter ), length = parts.length, i = 0;
		for(; i < length; ++i ) {
			var fields = parts[i].split( DiffusionRecord.prototype.fieldDelimiter );
			this.records.push( new DiffusionRecord( fields ) );
		}
	}
}


/**
 * Returns the topic assigned to this TopicMessage
 * @returns {String} topic
 */
TopicMessage.prototype.getTopic = function() {
	return this.topic;
}

/**
 * Set headers by array
 * @param {String[]} headers
 */
TopicMessage.prototype.setUserHeaders = function(headers) {
	this.userHeaders = headers;
}

/**
 * Get the current user headers
 * @returns {Array} the current array of headers, or null if there are no headers
 */
TopicMessage.prototype.getUserHeaders = function() {
	return this.userHeaders;
}

/**
 * Add a user header to the current headers
 * @param {String} header
 */
TopicMessage.prototype.addUserHeader = function(header) {
	if(this.userHeaders == null) {
		this.userHeaders = [];
	}
	this.userHeaders.push(header);
}

/**
 * Set whether this message is sent as encrypted data
 * @param {Boolean} value
 */
TopicMessage.prototype.setCrypted = function(value){
	this.isCrypted = value;
}

/**
 * Check if this message is set to be encrypted
 * @returns {Boolean} has encrypted encoded been requested
 */
TopicMessage.prototype.getCrytped = function() {
	return this.isCrypted;
}

/**
 * Check if this message requires an Ack
 * @returns {Boolean} true if an Acknowledgement is requested for this message
 */
TopicMessage.prototype.getAckRequired = function() {
	return this.isAckRequested;
}

/**
 * Set this message to require an Ack
 * @param {int} Set the timeout (ms) for the server to respond
 * @returns {String} the Ack ID
 */
TopicMessage.prototype.setAckRequired = function(timeout) {
	this.isAckRequested = true;
	this.ackTimeout = timeout;
	this.ackID = DiffusionClient.diffusionTransport.getNextAckID();
	return this.ackID;
}

/**
 * Get the ack ID set for this message
 * @returns {String} the Ack ID
 */
TopicMessage.prototype.getAckID = function() {
	return this.ackID;
}

/**
 * Get the ack timeout for this message
 * @returns {int} the ack timeout (ms)
 */
TopicMessage.prototype.getAckTimeout = function() {
	return this.ackTimeout;
}

/**
 * Set the timeout to be used if this message requires an Ack
 * @param {int} set the ack timeout (ms)
 */
TopicMessage.prototype.setAckTimeout = function(timeout) {
	this.ackTimeout = timeout;
}

/**
 * @ignore
 */
TopicMessage.prototype.toRecord = function() {
	var delim = "\u0003";
	var record = this.topic + delim + this.asString() + delim + this.isCrypted + delim + this.isAckRequested;
	
	if(this.isAckRequested) {
		record += delim + this.ackID;
	}
	
	if(this.userHeaders != null) {
		record += delim + this.userHeaders.join(delim);
	}
	
	return record; 
}
/**
 * @author Push Technology Ltd
 * @class PingMessage
 * 
 * This is the response from a DiffusionClient.ping request.  This message contains the latency of the round trip as well as the client queue size on the server
 */
PingMessage = function(response) {
	var data = response.split("\u0002");
	this.timestamp = data[0].substr(1, data[0].length);
	this.queueSize = data[1].substr(0, (data[1].length -1) );
}
/**
 * Get the timestamp sent from the server
 * @returns {String} the timestamp sent from the server. String representation of number of millis since epoch
 */
PingMessage.prototype.getTimestamp = function() {
	return this.timestamp;
}
/**
 * Get the Diffusion Server current queue size 
 * @returns {String} the current size of the client queue on the server
 */
PingMessage.prototype.getQueueSize = function() {
	return this.queueSize;
}
/**
 * Get the number of milliseconds that this message has existed for
 * @returns {Number} current time minus the time from the server
 */
PingMessage.prototype.getTimeSinceCreation = function() {
	return (new Date().getTime() - new Number(this.timestamp));
}
/**
 * @author Push Technology Ltd
 * @class DiffusionClientCredentials
 * This class specifies all of the user credentials.
 * This class is used as a default and any connection details passed into the connect method of {@link DiffusionClient} will be extended by this class
 */
DiffusionClientCredentials = function() {
	/**
	 * A token that can be referenced by the Diffusion Server as username
	 * 
	 * @type String
	 * @default ""
	 */
	this.username = "";
	
	/**
	 * A token that can be referenced by the Diffusion Server as password
	 * 
	 * @type String
	 * @default ""
	 */
	this.password = "";

	/**
	 * @ignore
	 */
	this.toRecord = function() {
		return this.username +"\u0002" + this.password;
	}
}/**
 * @author Push Technology Ltd
 * @class DiffusionAckProcess
 */
DiffusionAckProcess = function(topicMessage) {
	DiffusionClient.trace("DiffusionAckProcess "+topicMessage.getAckID());
	this.topicMessage = topicMessage;
	// Set up the timer event
	var _this = this;
	this.timeout = setTimeout( function() {
		_this.onTimeout(_this)
	}, topicMessage.getAckTimeout()); 
}
DiffusionAckProcess.prototype.cancel = function() {
	DiffusionClient.trace("DiffusionAckProcess: cancel "+this.topicMessage.getAckID());
	clearTimeout(this.timeout);
}
DiffusionAckProcess.prototype.onTimeout = function(ackProcess) {
	DiffusionClient.trace("DiffusionAckProcess: onTimeout "+this.topicMessage.getAckID());
	try {
		DiffusionClient.connectionDetails.onMessageNotAcknowledgedFunction(this.topicMessage);
	}catch(e) {
		DiffusionClient.trace("DiffusionAckProcess: unable to call onMessageNotAcknowledged " + e);
	}
}/**
 * @author Push Technology Ltd
 * @class TopicStatusMessage
 * 
 * Topic Status Messages are used to deliver notifications on changes to Topics
 */
TopicStatusMessage = function(topic, alias, status) {
	this.topic = topic;
	this.alias = alias;
	this.status = status;
}
/**
 * Get the topic to which this message belongs.
 * @returns {String} the topic name
 */
TopicStatusMessage.prototype.getTopic = function() {
	return this.topic;
}

/**
 * Get the Topic Alias for this message's topic.
 * @returns {String} the topic alias
 */
TopicStatusMessage.prototype.getAlias = function() {
	return this.alias;
}

/**
 * Get the status of this message's topic.
 * @returns {String} the topic status
 */
TopicStatusMessage.prototype.getStatus = function() {
	return this.status;
}/**
 * @author Push Technology Ltd
 * @class FragmentedMessage
 */
FragmentedMessage = function(message) {
	this.payload = message;
	this.messageType = message.charCodeAt(0);
	this.rows = message.split('\u0001');
	this.headers = this.rows[0].split('\u0002');
	
	var data = this.headers.shift();
	
	this.topic = data.substr(1, data.length);
	
	this.baseType = null;
	this.fragmentedType = this.messageType;
	this.baseType = this.messageType & ~0x40;
	
	this.correlationId = this.headers[0];

	this.totalSize = null;
	var parts = this.headers[1].split('/');
	this.partNumber = parts[0];
	this.totalParts = parts[1];
	if(this.totalParts != null) {
		this.totalSize = this.headers[2];
	}
}

/**
 * Returns the Correlation ID for this message
 * @returns {Number} Correlation ID
 */
FragmentedMessage.prototype.getCorrelationId = function () {
	return this.correlationId;
}

/**
 * Returns the header string as supplied from the server
 * @returns {String} Header string
 */
FragmentedMessage.prototype.getHeader = function() {
	return this.rows[0];
}

/**
 * Returns the message headers as an array
 * @returns {String[]} Headers
 */
FragmentedMessage.prototype.getHeaders = function() {
	return this.headers;
}

/**
 * Get the message body
 * @returns {String} Body
 */
FragmentedMessage.prototype.getBody = function() {
	return this.payload.substr((this.getHeader().length+1));
}

/**
 * Get the type for this message
 * @returns {Number} Type
 */
FragmentedMessage.prototype.getBaseType = function() {
	return this.baseType;
}

/**
 * Get the part number for this particular fragment
 * @returns {Number} Part number
 */
FragmentedMessage.prototype.getPartNumber = function() {
	return this.partNumber;
}

/**
 * Get the total number of parts for the message
 * @returns {Number} Total parts
 */
FragmentedMessage.prototype.getTotalParts = function() {
	return this.totalParts;
}

/**
 * Attempts to assemble a complete message from the fragments currently received
 * @returns {String} Assembled message
 */
FragmentedMessage.prototype.process = function() {
	if(DiffusionClient.fragmentMap[this.correlationId] === undefined) {
		DiffusionClient.fragmentMap[this.correlationId] = {};
	}
	DiffusionClient.fragmentMap[this.correlationId][this.partNumber] = this;

	var fragments = DiffusionClient.fragmentMap[this.correlationId];
	var first = DiffusionClient.fragmentMap[this.correlationId]['1'];
	if(first === undefined) {
		return null;
	}

	// Quickly count the fragments
	var count = 0;
	for(var key in fragments) {
		count++;
	}
	if(count < first.getTotalParts()) {
		return null;
	}
	
	var headers = '';
	for(var i = 3; i < first.getHeaders().length; i++) {
		if(i > 3) {
			headers = headers + '\u0002';
		}
		headers = headers + first.getHeaders()[i];
	}
	var body = '';
	for(var f in fragments) {
		body = body + fragments[f].getBody();
	}
	
	var assembled = String.fromCharCode(this.baseType) + this.topic + '\u0002' + headers + '\u0001' + body;
	
	return assembled;
}/**
 * @author Push Technology Ltd
 * @class CommandMessage
 */
CommandMessage = function(response, messageCount) {

	WebClientMessage.call(this, response, messageCount);

	if(this.isInitialTopicLoad()) {
		this.category = this.headers.shift();
		this.topicType = this.headers.shift();
		this.notificationType = undefined;
	}
	else {
		this.category = undefined;
		this.topicType = undefined;
		this.notificationType = this.headers.shift();
	}
}

for(var i in WebClientMessage.prototype) {
	CommandMessage.prototype[i] = WebClientMessage.prototype[i];
}

/**
 * Check if this message is an ITL
 * @returns {Boolean}
 */
CommandMessage.prototype.isInitialTopicLoad = function() {
	return (this.messageType == 40);
}

/**
 * Check if this message is a Delta message
 * @returns {Boolean}
 */
CommandMessage.prototype.isDeltaMessage = function() {
	return (this.messageType == 41);
}

/**
 * Get the category for this command message
 * @returns {String|undefined} category
 */
CommandMessage.prototype.getCategory = function() {
	return this.category;
}

/**
 * Get the type of topic for this command message
 * @returns {String|undefined} type
 */
CommandMessage.prototype.getTopicType = function() {
	return this.topicType;
}

/**
 * Get the type of notification for this message
 * @returns {String} notification type
 */
CommandMessage.prototype.getNotificationType = function() {
	return this.notificationType;
}

CommandMessage.prototype.SERVICE_CATEGORY = 0;
CommandMessage.prototype.PAGED_CATEGORY = 1;
/**
 * @author Push Technology Ltd
 * @class TimedTopicListener
 */
TopicListener = function(regex,functionPointer,handle,context) {
	this.regex = new RegExp(regex);
	this.fp = functionPointer;
	this.context = context;	
	this.handle = handle;	
}

TopicListener.prototype.getHandle = function() {	
	return this.handle;
}

TopicListener.prototype.getRegex = function() {	
	return this.regex;
}
	
TopicListener.prototype.callFunction = function(message) {	
	try{
		if(this.fp.apply(this.context, [message]) == true) {
			return true;
		}
	}catch(e){
		DiffusionClient.trace("Problem with TopicListener " + this.handle + " : " + e);
	}
	return false;
}		

/**
 * @author Push Technology Ltd
 * @class TimedTopicListener
 */

TimedTopicListener = function(regex,functionPointer,handle,time,force,context) {		
	this.regex = new RegExp(regex);
	this.fp = functionPointer;
	this.handle = handle;
	this.time = time;
	this.force = force;
	this.context = context;	
	this.time = time;
	this.messagesList = new Array();
	
	//Start Timer
	this.timer = setInterval( (function(self) {
		return function() {
			self.onTimerEvent();
		}
	})(this),time);
}

TimedTopicListener.prototype.getRegex = function() {
	return this.regex;
}

TimedTopicListener.prototype.getHandle = function() {
	return this.handle;
}

TimedTopicListener.prototype.stop = function(){
	clearInterval(this.timer);
}

TimedTopicListener.prototype.callFunction = function(message) {
	this.messagesList.push(message);
	//It isn't possible to return the "consumed" argument as TopicListener does, because this TimedTopicListener is Asynchronous.
	return false;
}

TimedTopicListener.prototype.onTimerEvent = function() {
	if ((this.force) || (this.messagesList.length>0)){
		try{
			//Make a copy of the messages
			var messageListCopy = this.messagesList.concat();		
			//Clear the messageList
			this.messagesList.length = 0;
			
			//Call the Function
			this.fp.apply(this.context, [messageListCopy]);			
			
		}catch (e) {
			DiffusionClient.trace("Problem with TimedTopicListener:onTimerEvent: " + e);
		}			
	}	
}


