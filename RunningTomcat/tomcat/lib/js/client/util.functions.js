
var Map = function() {
  var keys = {};
  var length = 0;
  var defaultValue = null;

  var self = this;

  self.put = function(k, v) {
    if (!self.containsKey(k)) {
      length++;
    }
    keys[k] = v;
  };

  self.get = function(k) {
    var v = keys[k];
    if (v) {
    	return v;
    } else {
    	return {
    		fire : function() {}
    	};
    }
  };

  self.length = function() {
    return keys.length();
  }

  self.containsKey = function(k) {
    for (var k in keys) {
      if (k == k) {
        return true;
      }
    };
    return false;
  };

  self.del = function(k) {
    if (keys[k]) {
      var v = keys[k];
      delete keys[k];
      length--;
    }
  };
};

var Observer = function() {
    var subjects = [];
    var proxy = {};
    var self = this;

    self.subscribe = function(subject, context) {
    	var context = context || {};
    	subjects.push( { func: subject, context: context } );
    };

    self.unsubscribe = function(subject) {
    	 for( var i = 0; i < subjects.length; ++i ) {
         	if( subjects[i].func === subject ) {
         		return subjects.splice(i,1);
         	}
         }
    };

    self.fire = function( args ) {
        var args = Array.prototype.slice.call( args );
        for( var i = 0; i < subjects.length; ++i ) {
        	subjects[i].func.apply( subjects[i].context, args );
        }
    };

    self.clear = function() {
      subjects = [];
    };
};

// Converts an object literal into a formatted string representation of property/value pairs
function printify(obj, indent) {
	var result = "";
	if (indent == null)
		indent = "";

	for( var property in obj ) {
		var value = obj[property];
		if( typeof value == 'string' ) {
			value = "'" + value + "'";
		} else if( typeof value == 'object' ) {
			if( value instanceof Array ) {
				// Just let JS convert the Array to a string!
				value = "[ " + value + " ]";
			} else {
				// Recursive dump
				// (replace " " by "\t" or something else if you prefer)
				var od = printify(value, indent + "  ");
				// If you like { on the same line as the key
				// value = "{\n" + od + "\n" + indent + "}";
				// If you prefer { and } to be aligned
				value = "\n" + indent + "{\n" + od + "\n" + indent + "}";
			}
		}
		
		result += indent + "'" + property + "' : " + value + ",\n";
	}
	
	return result.replace(/,\n$/, "");
}

function contains(a, obj) {
    for (var i = 0; i < a.length; i++) {
        if (a[i] === obj) {
            return true;
        }
    }
    return false;
}

function randomString(length) {
  var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
  var randomstring = '';
  for (var i=0; i<length; i++) {
    var rnum = Math.floor(Math.random() * chars.length);
    randomstring += chars.substring(rnum,rnum+1);
  }
  return randomstring;
}
