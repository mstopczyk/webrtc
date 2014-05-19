var joinoutServerHost = "http://ec2-54-188-159-146.us-west-2.compute.amazonaws.com:8080";
var stunTurnServerHost = "ec2-54-188-159-146.us-west-2.compute.amazonaws.com";
var peerJsServerHost = "ec2-54-188-159-146.us-west-2.compute.amazonaws.com";

var joinoutApp = angular.module('joinoutApp',['ui.bootstrap']);

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
        
        $http({method: 'POST', url: joinoutServerHost+'/users', data:JSON.stringify(positionInJson)}).
            success(function(data, status, headers, config) {
               $scope.registered_user_name = data.user_name;
               $scope.registered_user_id = data.user_id;
               
               $scope.readRegisteredUsers();
			   $scope.createPeerServerConnection();
			   
			   $scope.enableUserMedia();
			   
            }).
            error(function(data, status, headers, config) {
                alert("error code 01");
            });
            
	};
		
	$scope.readRegisteredUsers = function() {
		
		$http({method: 'GET', url: joinoutServerHost+'/users'}).
            success(function(data, status, headers, config) {
               $scope.users = data;
            }).
            error(function(data, status, headers, config) {
                alert("error code ERR_CONNECTION_TIMED_OUT");
            });
	};	
		
	$scope.createPeerServerConnection = function() {
				
		// PeerJS object
		$scope.peerServer = new Peer($scope.registered_user_id , {host: peerJsServerHost, port: 9000, debug:3, 
			config: {'iceServers': [
			 {	url: 'turn:'+stunTurnServerHost+':3478',		credential: 'youhavetoberealistic',		username: 'ninefingers'		},
			 {	url: 'stun:'+stunTurnServerHost+':3478',		credential: 'youhavetoberealistic',		username: 'ninefingers'		}
			]}
		});
		
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
			$scope.hideInCallDiv();
		});		
		
	};
		
	$scope.makeACall = function(user) {
		// Initiate a call!
        var call = $scope.peerServer.call(user.user_id, window.localStream);
        $scope.handleCall(call);	
	};
		
	$scope.finishACall = function() {
		window.existingCall.close();
		$scope.hideInCallDiv();	
	};		
		
	$scope.enableUserMedia = function() {

		// Get audio/video stream
		navigator.getUserMedia({audio: true, video: true}, function(stream){
        
			// Set your video displays
			$('#my-video').prop('src', URL.createObjectURL(stream));
			window.localStream = stream;
			$('#smileAndHairDiv').show();
				
		}, function(){ alert("error code 08"); });
   
	};
		
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
		$scope.showInCallDiv();
		window.existingCall = call;
		$('#their-id').text(call.peer);
      
		call.on('close', $scope.hideInCallDiv);
	};	
		
	$scope.withoutMeFilter = function(user) {
		return !($scope.registered_user_id == user.user_id);
	};
	
	$scope.hideInCallDiv = function() {		
		$('#inCallDiv').hide();
		$('#inCallDiv2').hide();
	};	
		
	$scope.showInCallDiv = function() {		
		$('#inCallDiv').show();
		$('#inCallDiv2').show();
	};	
		
	// poll server every 10 sec  (expressed in miliseconds)   DOES NOT WORK 
	//$interval($scope.readRegisteredUsers(), 10000);
	$scope.readRegisteredUsers()
		
	// by default ukrywany niektore elementy
	$scope.hideInCallDiv();
	$('#smileAndHairDiv').hide();
	
});
