Pumpidu PeerJS
=======

It is an example from the book "PhoneGap by Example" which implements video/audio real time communication web and mobile applications with help of PeerJS.

> WebRTC is not supported by some of browsers yet. We can check current state of it on the website http://iswebrtcreadyyet.com/

> PeerJS is a wrapper for browser’s WebRTC implementation. It is aimed to simplify peer-to-peer connection management. PeerJS provides functionality for listing connected clients.

## Installation Prerequisites
- Install Node.js from [Node.js official website](http://nodejs.org/)
- Install Cordova with NPM: `$ npm install -g cordova`

### What is Crosswalk and why we need it
When we develop with PhoneGap/Cordova, we use standard WebView system provides for us. The situation is not bad with iOS. WebView in iOS from version to version works almost the same. There are only small changes and improvements provided for the time.
But with Android situation is totally different. In the different variations of the platform there are used different versions of the WebView. There are differences in:
-	JavaScript API
-	CSS properties support and syntax
-	Specific interface rendering flow

And a lot more differences and odds could be found.
And it is where Crosswalk is very handy. As a WebView it uses the latest version of the Google Chromium. It is adding next benefits:
-	Same WebView on all Android 4.x platforms
-	Available Chrome DevTools
-	Great performance of JavaScript, HTML and CSS

We can easily add Crosswalk like presented below:
```
$ cordova plugin add https://github.com/MobileChromeApps/cordova-plugin-crosswalk-webview.git#1.0.0
```

## Client
#### Android Setup
Setting up the project to run the application on Android platform looks a little bit easier. But also has its complexity. To run the application in the Android simulator or on Android device connected to our computer, we need the following:
-	OS: Linux or Windows or Mac
-	Java: Oracle JDK
-	IDE: Android Studio
-	Android SDK

### Clone
After that you can clone this repo and we can run the application.

## Server
We need to have signaling (STUN) server:
```
$ cd server
$ npm install
```

### Rinning
Start signaling server:
```
$ cd server
$ node server.js
```
Start client in browser:
```
$ cd client/www
$ python -m SimpleHTTPServer 8000
```
And start mobile application on the real device:
```
$ cd client/www
$ cordova run android
```

Now we can open http://localhost:8000 in the browser where we will see our web application. And on the mobile application we can do everything the same.
