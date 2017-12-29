var express = require('express');
var app = express();
var http = require('http').Server(app);
var path = require('path')
var timer = require('./modules/timer');
var io = require('socket.io')(http);
var sha256 = require('js-sha256');
var randomFloat = require('random-float');

var crashData;
var f1, f2, f3, f4, crashFloat, finalCrash;
var crashID;
var userID;
var hash;
var playercount = 0;
var CrashActive = false;
var currentPercentage = 1;
var crashSpeed = 0.01;

function startCrash() {
  hash = sha256.create();
  hash.update("fdsfgdsfdsghjighbdfugdfiyug");
  if (CrashActive == true) {
    //Do nothing;
  } else {
    //crashIntermission(); old
    startCrashIntermission();
  }
}

function crash(f1, f2, f3, f4, crashFloat, finalCrash) {
  //Create crash game here
       console.log('Crash starting, HASH: '+hash);
       calculateCrash(crashData);
       CrashActive = true;
}

function crashIntermission() {
  io.emit('crashIntermission');
  setTimeout(function(){
        crash(crashData);
       }, 10000);
       setTimeout(function(){
             io.emit('crashed', crashData);
             CrashActive = false;
           }, 25000); // Crash is now running for 15 seconds, then show results to client
}

function calculateCrash(f1, f2, f3, f4, crashFloat, finalCrash) {
  f1 = randomFloat(1, 100);
  f2 = randomFloat(1, 100);
  f3 = randomFloat(1, 100);
  f4 = randomFloat(1, 100);
  crashFloat = f1+f2+f3+f4*1.2;
  console.log('Calculated Crash Float: '+crashFloat);

  if (crashFloat > 0.0 && crashFloat < 100.0) {
    finalCrash = randomFloat(0.0, 10.0)
  }
  if (crashFloat > 99.0 && crashFloat < 151.0) {
    finalCrash = randomFloat(0.0, 4.0)
  }
  if (crashFloat > 149.0 && crashFloat < 301.0) {
    finalCrash = randomFloat(0.0, 3.0)
  }
  if (crashFloat > 299.0 && crashFloat < 399.0) {
    finalCrash = randomFloat(0.0, 10.0)
  }
  if (crashFloat > 400.0 && crashFloat < 420.0) {
    finalCrash = randomFloat(30.0, 80.0)
  }
  if (crashFloat > 419.0 && crashFloat < 481.0) {
    finalCrash = randomFloat(30.0, 150.0)
  }

  console.log('Final Crash Float: '+finalCrash);

  finalCrash = finalCrash + 1;
  var n = finalCrash.toFixed(2);

  crashData = {
    crashPercentage: n,
    crashHash: hash
  };
  io.emit('crashStart', crashData); //Start the actual crash
}

function startCrashIntermission() {

  io.emit('crashIntermission');
  setTimeout(function(){
          crash(crashData);
          var crashtimer = setInterval(function(){

            //Emit the percentage to clients every 100ms
            currentPercentage = currentPercentage + crashSpeed; // Add 0.01% every 100ms
            var n = currentPercentage.toFixed(2); // Change the number to two decimals

            io.emit('crashValue', n); // Emit the crash% every 100ms to client

            if (n > 1.5) {
              crashSpeed = 0.015;
            }
            if (n > 2) {
              crashSpeed = 0.015;
            }
            if (n > 3) {
              crashSpeed = 0.02;
            }
            if (n > 4) {
              crashSpeed = 0.025;
            }
            if (n > 5) {
              crashSpeed = 0.03;
            }
            if (n > 7) {
              crashSpeed = 0.04;
            }
            if (n > 10) {
              crashSpeed = 0.06;
            }
            if (n > 20) {
              crashSpeed = 0.08;
            }

            if(n == crashData.crashPercentage || n > crashData.crashPercentage) { // Checks if the currentPercentage == crashData%.

              CrashActive = false; // Set to false
              io.emit('crashed', crashData); // Emit to clients we crashed
              console.log("Crashed at " + n);
              clearInterval(crashtimer); // clear the interval
              n = 1;
              currentPercentage = 1;
            }

          },100);
       }, 10000);

}

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res){
res.sendFile(__dirname + '/views/crash.html');
});

io.on('connection', function(socket){
    playercount ++;
    console.log('user connected, Online users: ' + playercount);
    io.emit('playerCount', playercount);

  socket.on('disconnect', function(){
    playercount --;
    console.log('user disconnected, Online users: ' + playercount);
    io.emit('playerCount', playercount);

  });


  socket.on('bet', function(betAmount){
    console.log(betAmount+ " Bet");
    if (betAmount < 0.1) {
      socket.emit('invalidBet', betAmount);
    } else {
      socket.emit('validBet', betAmount);
      startCrash();
    }
  });

  socket.on('getOut', function () {
    socket.emit('gotOut');
  })


});

http.listen(3000, function(){
  console.log('Server Started');
});
