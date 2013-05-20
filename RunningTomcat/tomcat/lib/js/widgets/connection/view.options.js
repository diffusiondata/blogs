NS( "diffusion.widget.connection.view.options", function() {
	// -- Boilerplate
	var self = this;
	this.container = '#diffusion-widget-options';
	
	
	this.createCallback = function( key ) {
		var option = key;
		return function( value ) {
			console.log( option, value );
			diffusion.client.setOption( option, value );
		}
	}
	
	// Toggable options
	var options = diffusion.client.getOptions();
	for( var o in options ) {
		this[ o ] = ko.observable( options[o] );
		this[ o ].subscribe( this.createCallback( o ) );
	}
}, true );