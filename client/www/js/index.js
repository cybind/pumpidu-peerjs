var isBrowser = document.URL.indexOf( 'http://' ) !== -1 || document.URL.indexOf( 'https://' ) !== -1;
if ( !isBrowser ) {
    document.addEventListener('deviceready', init, false);
} else {
    init();
}        

function init() {

    // PeerJS server location
    var SERVER_IP = '192.168.0.101'; //home
    // var SERVER_IP = '192.168.1.227'; //office
    var SERVER_PORT = 9000;

    // DOM elements manipulated as user interacts with the app
    var callButton = document.querySelector("#callButton");
    var localVideo = document.querySelector("#localVideo");
    var remoteVideo = document.querySelector("#remoteVideo");

    // the ID set for this client
    var callerId = null;

    // PeerJS object, instantiated when this client connects with its
    // caller ID
    var peer = null;

    // the local video stream captured with getUserMedia()
    var localStream = null;

    // get the local video and audio stream and show preview in the
    // "LOCAL" video element
    // successCb: has the signature successCb(stream); receives
    // the local video stream as an argument
    var getLocalStream = function(successCb) {
        if (localStream && successCb) {
            successCb(localStream);
        } else {
            navigator.webkitGetUserMedia({
                    audio: true,
                    video: true
                },

                function(stream) {
                    localStream = stream;

                    localVideo.src = window.URL.createObjectURL(stream);

                    if (successCb) {
                        successCb(stream);
                    }
                },

                function(err) {
                    alert('Failed to access local camera');
                    console.log(err);
                }
            );
        }
    };

    // set the "REMOTE" video element source
    var showRemoteStream = function(stream) {
        remoteVideo.src = window.URL.createObjectURL(stream);
    };

    // set caller ID and connect to the PeerJS server
    var connect = function() {

        if (!callerId) {
            alert('Please enter your name first');
            setCallerId();
            return;
        }

        try {
            // create connection to the ID server
            console.log('create connection to the ID server');
            console.log('host: ' + SERVER_IP + ', port: ' + SERVER_PORT);
            peer = new Peer(callerId, {
                host: SERVER_IP,
                port: SERVER_PORT
            });

            // hack to get around the fact that if a server connection cannot
            // be established, the peer and its socket property both still have
            // open === true; instead, listen to the wrapped WebSocket
            // and show an error if its readyState becomes CLOSED
            peer.socket._socket.onclose = function() {
                alert('No connection to server');
                peer = null;
            };

            // get local stream ready for incoming calls once the wrapped
            // WebSocket is open
            peer.socket._socket.onopen = function() {
                getLocalStream(function() {
                    callButton.style.display = 'block';
                });
            };

            // handle events representing incoming calls
            peer.on('call', answer);
        } catch (e) {
            peer = null;
            alert('Error while connecting to server');
        }
    };

    // make an outgoing call
    var dial = function() {
        if (!peer) {
            alert('Please connect first');
            return;
        }

        if (!localStream) {
            alert('Could not start call as there is no local camera');
            return
        }

        var recipientId = prompt('Please enter recipient name');

        if (!recipientId) {
            alert('Could not start call as no recipient ID is set');
            dial();
            return;
        }

        getLocalStream(function(stream) {
            console.log('Outgoing call initiated');

            var call = peer.call(recipientId, stream);

            call.on('stream', showRemoteStream);

            call.on('error', function(e) {
                alert('Error with call');
                console.log(e.message);
            });
        });
    };

    // answer an incoming call
    var answer = function(call) {
        if (!peer) {
            alert('Cannot answer a call without a connection');
            return;
        }

        if (!localStream) {
            alert('Could not answer call as there is no localStream ready');
            return;
        }

        console.log('Incoming call answered');

        call.on('stream', showRemoteStream);

        call.answer(localStream);
    };

    var setCallerId = function () {
        callerId = prompt('Please enter your name');
        connect();
    };

    setCallerId();

    // wire up button events
    callButton.addEventListener('click', dial);
}