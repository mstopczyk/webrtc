var applicationHost = "http://localhost:8080";

var joinoutApp = angular.module('joinoutApp', []);

// przydatne zmienne
// $scope.registered_user_id 
// $scope.peerServer


joinoutApp.controller('MainCtrl', function($scope, $filter, $http) {
	
	var peerServer;
	
	$scope.registerNewUser = function() {
		
		var generated_double_id = Math.random();
		var generated_string_id = generated_double_id.toString().replace(".", "");
		
		var positionInJson = angular.toJson({
            "user_name":$scope.userName,"user_id":generated_string_id
        });
        
        $http({method: 'POST', url: applicationHost+'/users', data:JSON.stringify(positionInJson)}).
            success(function(data, status, headers, config) {
               $scope.registered_user_name = data.user_name;
               $scope.registered_user_id = data.user_id;
               
               $scope.readRegisteredUsers();
			   $scope.registerCreatePeerServer();
			   
			   $scope.enableUserMedia();			// previously Step1
			   
            }).
            error(function(data, status, headers, config) {
                alert("error code 01");
            });
            
		};
		
	$scope.readRegisteredUsers = function() {
		$http({method: 'GET', url: applicationHost+'/users'}).
            success(function(data, status, headers, config) {
               $scope.users = data;
            }).
            error(function(data, status, headers, config) {
                alert("error code 04");
            });
		};	
		
		
		/////////
			$scope.registerCreatePeerServer = function() {
		
			$scope.peerServer = new Peer($scope.registered_user_id , { key: 'fs74lpm5eqe8w7b9', debug: 3, config: {'iceServers': [
			{ url: 'stun:stun.l.google.com:19302' } // Pass in optional STUN and TURN server for maximum network compatibility
				]}});
		
			$scope.peerServer.on('open', function(){
			  $('#my-id').text($scope.peerServer.id);
			});
			
			
		    // Receiving a call
			$scope.peerServer.on('call', function(call){
			  // Answer the call automatically (instead of prompting user) for demo purposes
			  call.answer(window.localStream);
			  $scope.handleCall(call);		
			});
		
		    $scope.peerServer.on('error', function(err){
				alert(err.message);
				// Return to step 2 if error occurs
				$scope.showHideDivs();	
			});		
		
		};
		
		
		
		/////////////////
	$scope.makeACall = function(user) {
		// Initiate a call!
        var call = $scope.peerServer.call(user.user_id, window.localStream);
        $scope.handleCall(call);	
		
		};
		
		
	$scope.finishACall = function() {
		window.existingCall.close();
        $scope.showHideDivs();	
		};		
		
		///////////////
		
		$scope.enableUserMedia = function() {
			
			      // Get audio/video stream
      navigator.getUserMedia({audio: true, video: true}, function(stream){
        // Set your video displays
        $('#my-video').prop('src', URL.createObjectURL(stream));

        window.localStream = stream;
        $scope.showHideDivs();	
      }, function(){ $('#step1-error').show(); });
   
		};
		
		
		///////////////////
		
		$scope.showHideDivs = function() {		
			$('#step1, #step3').hide();
			$('#step2').show();
		};	
		
		//////////////////////
		
		$scope.handleCall = function(call) {		
			      // Hang up on an existing call if present
      if (window.existingCall) {
        window.existingCall.close();
      }

      // Wait for stream on the call, then set peer video display
      call.on('stream', function(stream){
        $('#their-video').prop('src', URL.createObjectURL(stream));
      });

      // UI stuff
      window.existingCall = call;
      $('#their-id').text(call.peer);
      call.on('close', $scope.showHideDivs);
      $('#step1, #step2').hide();
      $('#step3').show();
		};	
		
		
		/////////////
		
	$scope.readRegisteredUsers();
	
	
	
	
	
	
	
});
