var http = require('http'),
	socketio = require('socket.io'),
	Twit = require('twit');

//var socket = require('socket.io-client')('http://localhost:3000');

var T = new Twit({
  consumer_key: 'gfYGCykfMjBcPL0lHUBysF3rP',
  consumer_secret: 'LQ9uHD0D3YA2au9wbAlKcbZm9bxaU9UviBADM83WTcqb3AYOXi',
  access_token: '47284658-iixEtlfVC6SA2KUS6fuar0tJAFiiWm6wSVzsIsTJz',
  access_token_secret: 'wG4aZuwztgHZUzLyfYDrhgckCpsyJM0zaEya0VXOc2VWT'
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

					T.get('statuses/user_timeline', { screen_name: u1, count: 199, contributor_details: true }, function(err, data, response) {
					    console.log(data[0].user.screen_name);
					    var ardates = [];
					    for (var i = 0; i < 199; i++){
					      	ardates.push(data[i].created_at.slice(0,3)); 
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
						      	ardates.push(data[i].created_at.slice(0,3)); 
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
					io.sockets.emit('errors','user 1 does not exist');
				}

			});

			// paquetito1 y paquetito2 are horrible names for real production apps, but since this is for fun I let them stay.


			

			
		});



	});
}