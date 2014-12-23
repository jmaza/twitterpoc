var http = require('http'),
	socketio = require('socket.io'),
	Twit = require('twit');

//var socket = require('socket.io-client')('http://localhost:3000');

var T = new Twit({
  consumer_key: 'jYLEYGgABYVQ3ZKXGGMLuhyy4',
  consumer_secret: 'dkWRWeP9zqH32Lv5adqRhgKv3vi6NGt9MdkOwi5S3dIFxLEyLz',
  access_token: '47284658-3tgWhKqGzCHe3Ot9lxBXi0NvkRW8WpkAwDq27NMFS',
  access_token_secret: 'AkQi4f6QWPkhZQosr9wyYEJUqTK7AeDB7hnCGY37po517'
});

//wire up the code for handling sockets connections

module.exports = function(app) {

	var server = http.createServer(app);

	io = socketio.listen(server);

	server.listen(3000);

	//io.on('connect', function(){ console.log('connected') });

	io.on('connection', function(socket){
		console.log('wut?');

		socket.on('getTweets', function(u1, u2) {
			console.log('barbaro');
			console.log(u1);
			console.log(u2);
			var paquetito1 = {};
			var paquetito2 = {};

			T.get('users/lookup', { screen_name: u1 }, function(err, data, response) {
				if (typeof(data) != "undefined"){

					T.get('users/lookup', { screen_name: u2 }, function(err, data, response) {
					if (typeof(data) != "undefined"){

						T.get('statuses/user_timeline', { screen_name: u1, count: 199, contributor_details: true }, function(err, data, response) {
						    console.log(data[0].user.screen_name);
						    var ardates = [];
						    for (var i = 0; i < 199; i++){
						    	if (typeof(data[i]) != "undefined"){
						      		ardates.push(data[i].created_at.slice(0,3)); 
						      	}
						      }
						    // un objeto{} con cada date con su numero 
						    var dates = ardates.reduce(function (acc, curr) {
							  if (typeof acc[curr] == 'undefined') { acc[curr] = 1; } else { acc[curr] += 1; }
							  return acc; }, {});

						    //var paquetito = {};
						    paquetito1.user = data[0].user.screen_name;
						    paquetito1.date = dates; //no es el formato del email.

						    // esta nested, pero works fine! (Evito hacer dos methods)

						    T.get('statuses/user_timeline', { screen_name: u2, count: 199, contributor_details: true }, function(err, data, response) {
							    console.log(data[0].user.screen_name);

							    var ardates = [];
							    for (var i = 0; i < 199; i++){
							    	if (typeof(data[i]) != "undefined"){
							      		ardates.push(data[i].created_at.slice(0,3)); 
							      	}
							      }
							    // un objeto{} con cada date con su numero 
							    var dates = ardates.reduce(function (acc, curr) {
								  if (typeof acc[curr] == 'undefined') { acc[curr] = 1; } else { acc[curr] += 1; }
								  return acc; }, {});

							    //var paquetito = {};
							    paquetito2.user = data[0].user.screen_name;
							    paquetito2.date = dates; //no es el formato del email.
							    var paqueton = {};
							    paqueton.user1 = paquetito1;
							    paqueton.user2 = paquetito2;


							    io.sockets.emit('getTweets',paqueton); // uso io porque quiero mandarselo a todos los clients
						  	});

						   
						});
					}
					else {
						console.log('errorsdsd');
						io.sockets.emit('errors','user 2 does not exist');
					}

				});
				}
				else {
					console.log('errorsdsd');
					io.sockets.emit('errors','user 1 does not exist');
				}

			});

			// paquetito1 y paquetito2 are horrible names for real production apps, but since this is for fun I let them stay.


			

			
		});



	});
}