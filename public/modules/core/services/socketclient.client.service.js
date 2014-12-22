'use strict';

//pass the data to the client...

angular.module('core').factory('Socketclient', 
	function(socketFactory) {
		// Socketclient service logic
		// ...

		// Public API
		return socketFactory({
			ioSocket: io.connect('http://localhost:3000'),
			
		});
	}
);