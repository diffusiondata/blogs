NS("app", function() {
	this.client = diffusion.client;

	this.init = function() {
		for( var v in this.view ) {
			var view = this.view[v];
			if( view ) {
				ko.applyBindings( view, view.container[0] );
				if( view['init'] ) view.init();
			}
		}
	}
}, true);