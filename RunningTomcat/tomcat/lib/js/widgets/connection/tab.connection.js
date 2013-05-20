NS( "diffusion.widget.connection.view.connectionTab", function() {
	// -- Boilerplate
	var self = this;
	this.container = '#diffusion-widget-connection';
	
	// -- Observables
	this.connectionDetails = ko.observableArray([]);
	
	// -- Callbacks
	this.updateConnection = function() {
		this.connectionDetails.removeAll();
		
		var details = diffusion.client.getConnection();
		for( var detail in details ){
			this.connectionDetails.push({name: detail, value: details[detail] });
		}
	};
	
	this.updateConnection();
	
	// -- Listeners
	diffusion.client.addListener( "setOption", this.updateConnection, this );
	diffusion.client.addListener( "onCallbackFunction", this.updateConnection, this );
}, true );