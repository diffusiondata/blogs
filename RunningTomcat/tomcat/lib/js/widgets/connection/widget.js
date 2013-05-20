NS("diffusion.widget.connection", function() {
	var self = this;
	this.active = false;
	
	// Bind view models to html
	this.init = function() {
		this.client = diffusion.client;

		for( var view in this.view ) {
			ko.applyBindings( this.view[view], $( this.view[view].container)[0] );
			
			if( this.view[view]['init'] ) {
				this.view[view].init();
			}
		}
		
		this.button = $('#diffusion-widget-control');
		this.widget = $('#diffusion-widget-container').find('.tabbable').find('.tab-content').slideUp(0);
			
		this.button.click( function() {
			self.widget.slideToggle();
			self.active = !self.active;
			
			if( self.active ) {
				self.button.text( "Hide connection panel" );
			} else {
				self.button.text( "Show connection panel" );
			}
		});
	};
}, true);


// Bootstrap!
$(function() {
	diffusion.widget.connection.init();
});