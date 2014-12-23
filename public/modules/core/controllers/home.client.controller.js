'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication', 'Socketclient',
	function($scope, Authentication, Socketclient) {
		// This provides Authentication context.
		$scope.authentication = Authentication;
		//var socket = io('http://localhost');
 		// socket.on('connect', function(){});

 		$scope.nombreusu1 = 'User 1';
    	$scope.nombreusu2 = 'User 2';
    	$scope.errors = false;
    	$scope.user_err = 'no error';

    	 $scope.data = [
		  {x: 0, value: 0, otherValue: 0},
		  {x: 1, value: 0, otherValue: 0},
		  {x: 2, value: 0, otherValue: 0},
		  {x: 3, value: 0, otherValue: 0},
		  {x: 4, value: 0, otherValue: 0},
		  {x: 5, value: 0, otherValue: 0},
		  {x: 6, value: 0, otherValue: 0},
		  {x: 7, value: 0, otherValue: 0}
		];

		$scope.options = {
		  axes: {
		    x: {key: 'x', labelFunction: function(value) {switch(value){case 1: return 'Mon'; case 2: return 'Tue'; case 3: return 'Wed'; case 4: return 'Thu'; case 5: return 'Fri'; case 6: return 'Sat'; case 7: return 'Sun'; default: return value} ;}, type: 'linear', min: 0, max: 8, ticks: 8},
		   
		  },
		  series: [
		    {y: 'value', color: 'red', thickness: '4px', striped: true, label:  $scope.nombreusu1 },
		    {y: 'otherValue', color: 'green', thickness: '4px', visible: true, drawDots: true, dotSize: 2, label: $scope.nombreusu2 }
		  ],
		  lineMode: 'linear',
		  tension: 0.7,
		  tooltip: {mode: 'scrubber', formatter: function(x, y, series) {
		    var serie = series.label, res = 1;

		    if (serie == 'User 1') res = 1; else res =  2;
		    switch(res){ case 1: return $scope.nombreusu1 + ' '+ y + ' tweets on ' + getDay(x); default: return $scope.nombreusu2+ ' '+ y + ' tweets on ' + getDay(x) ;}
		  }},
		  drawLegend: true,
		  drawDots: true,
		  columnsHGap: 5
		}

 		var getDay = function(day){
	      switch(day){
	        case 1: return 'Monday';
	        case 2: return 'Tuesday';
	        case 3: return 'Wednesday';
	        case 4: return 'Thursday';
	        case 5: return 'Friday';
	        case 6: return 'Saturday';
	        case 7: return 'Sunday';
	        default: return 'unknown';
	      }
	    };


 		 $scope.submit = function($event) {
	      Socketclient.emit('getTweets', $scope.user1, $scope.user2);
	     
	    };

	    Socketclient.on('getTweets', function(data){
	    	$scope.errors = false;
	    	console.log(data);

	    	$scope.nombreusu1 = data.user1.user;
	    	$scope.nombreusu2 = data.user2.user;

	      $scope.data[0].value = data.user1.date[''];
	      $scope.data[1].value = data.user1.date['Mon'];
	      $scope.data[2].value = data.user1.date['Tue']; 
	      $scope.data[3].value = data.user1.date['Wed']; 
	      $scope.data[4].value = data.user1.date['Thu'];  
	      $scope.data[5].value = data.user1.date['Fri']; 
	      $scope.data[6].value = data.user1.date['Sat']; 
	      $scope.data[7].value = data.user1.date['Sun']; 

	      $scope.data[0].otherValue = data.user2.date[''];
	      $scope.data[1].otherValue = data.user2.date['Mon'];
	      $scope.data[2].otherValue = data.user2.date['Tue']; 
	      $scope.data[3].otherValue = data.user2.date['Wed']; 
	      $scope.data[4].otherValue = data.user2.date['Thu'];  
	      $scope.data[5].otherValue = data.user2.date['Fri']; 
	      $scope.data[6].otherValue = data.user2.date['Sat']; 
	      $scope.data[7].otherValue = data.user2.date['Sun']; 

	    });

		Socketclient.on('errors', function(data){
			console.log('llamado');
			$scope.user_err = data;
			$scope.errors = true;
		});




	}
]);