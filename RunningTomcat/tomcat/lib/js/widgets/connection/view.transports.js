NS( "diffusion.widget.connection.view.transports", function() {
	// -- Boilerplate
	var self = this;
	this.container = '#diffusion-widget-transports';
	
	// -- Observables
	this.transports = ko.observableArray( diffusion.util.transports );
	
	// -- Callbacks
	this.init = function() {
		ko.utils.arrayForEach( self.transports(), function( transport ) {
			diffusion.client.setTransport( transport.id, transport.value );
			if( transport.value ) $('#' + transport.id ).addClass( 'btn-primary' );
		});
	};
	
	this.setTransport = function( val ) {
		var index = self.transports.indexOf( val );
		var transport = self.transports()[ index ];
		
		transport.value = !transport.value;
		diffusion.client.setTransport( transport.id, transport.value );
		
		$('#' + transport.id ).toggleClass( "btn-primary" ).removeClass( 'btn-warning' ).removeClass( 'btn-danger' ).removeClass( 'btn-success' );
	};
	
	this.handleCascade = function( t ) {
		var transport = ko.utils.arrayFirst( self.transports(), function( val ) { 
			return val.name == t;
		});
		
		if( transport ) {
			var element = $('#' + transport.id );
			if( element.hasClass('btn-primary') ) {
				element.addClass('btn-danger');
			} else {
				element.addClass('btn-warning');
			}	
		}
	}
	
	this.handlePreConnect = function() {
		ko.utils.arrayForEach( this.transports(), function( transport ) {
			$('#' + transport.id ).removeClass( 'btn-error' ).removeClass( 'btn-success' ).removeClass('btn-warning');
		});
	}
	
	this.handleConnect = function( connected ) {
		if( connected ) {
			var name = DiffusionClient.getTransportName();
			var transport = ko.utils.arrayFirst( self.transports(), function( val ) { 
				return val.name == name;
			});
			
			$('#' + transport.id ).addClass('btn-success');
		}
	}
	
	// -- Listeners
	diffusion.client.addListener( "preConnect", this.handlePreConnect, this );
	diffusion.client.addListener( "onCascadeFunction", this.handleCascade, this );
	diffusion.client.addListener( "onCallbackFunction", this.handleConnect, this );
}, true );