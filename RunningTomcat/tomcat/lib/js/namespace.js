/**
 * Utility function to produce globally namespaced objects.
 * 
 * @author Peter Hughes
 * 
 * Usage examples:
 * 
 *  - Object literals (works for any type of object)
 * NS( "com.foo.obj", {
 * 	method : function() { .. }
 * });
 * 
 * com.foo.obj.method();
 * 
 * 
 *  - Class references
 *  NS( "com.foo.person", function( name ) {
 *  	this.name = name;
 *  });
 *  
 *  var person = new com.foo.person( "Peter" );
 * 
 * 
 *  - Global instances
 * NS( "com.foo.instance", function() {
 * 		this.property = "foo";
 * 		this.method = function() {
 * 			return this.property;
 * 		}
 * }, true);
 * 
 * var ouput = com.foo.instance.method();
 *
 */
(function(undefined) {
    var namespace = function( identifier, contents, obj ) {
        if( identifier === undefined || identifier.length == 0 ) {
            throw Error("A namespace identifier must be supplied");
        }
        
        var global = window, parts = identifier.split(".");
        
        for( var i = 0; i < parts.length; ++i ) {
        	global = global[ parts[i] ] = global[ parts[i] ] || (i == parts.length-1 && !obj ? contents : {} );
        }
        
        if( obj && contents.call ) {
        	contents.call( global );
        }
    };
    
    // Amusingly, Firefox will break if we use "Namespace" as the method,
    // as this is a native function that can't be overwritten.
    namespace( "NS", namespace );
}());