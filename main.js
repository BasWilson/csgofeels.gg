var express = require('express');
var app = express();
var http = require('http').Server(app);
var path = require('path')
var timer = require('./modules/timer');
var io = require('socket.io')(http);
var sha256 = require('js-sha256');
var randomFloat = require('random-float');

//Firebase

var admin = require('firebase-admin');
var serviceAccount = require('./keys/serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: 'csgofeels-e3fc5',
    clientEmail: 'firebase-adminsdk-9ni9e@csgofeels-e3fc5.iam.gserviceaccount.com',
    privateKey: '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDpcIPnnDf5BuIh\nuQ37OFT5BiAR7uPtPZvFIDqXlEHwtFKhaymh1fltK7t4Mp1zX4yDLs8Ylmh+ikAi\nE/J0BFdwjvVfDCz7S7Pu7RdUsVP5r+1e4hJjYUIFjMK2mDlep0OvZe5gFDNt6Dbz\nFZunqIl/f2EF2bvdMyeiHOFUmfwZzxnpUhIQXyEHfJC9RJJni6bKywa8A5EOUd5R\npsfi02Lgil6+0wt+TMUkjHwJUc+K3ywo1UNBv72jAyhR2gOiijNuvtYsjPJ1VHAg\nNr3cRdB9i0M4DEr7tdp+n2Q2D2EHpID1p8c7RS1TYxQH670dYlR5qyM41Vcn4Jb3\nQp2HDuVhAgMBAAECggEALgDjqbreR/fsi/dHU1UGX93uZ4JTzh7IShiAG3uW5Bvx\nNcjj1zYPFc3av8T/xOsVSovouaB4fsl5eo3CR81MOw0dO2ovmiVQ1BrKsIDSuv/J\n0FtOguG5jFTxUWEd2zKs0s3MZIhOm0/6NjzxpCCBWkwsv2WpkV3Bp3+4Az9mUGJg\nvZeaqfn9gUlv1elymJttoYyB+06olVbM4YNz5w57jXlbkoB2ATP0VvgB9Qgvwk97\n088wrmPDPXbnPmbz/mHo7E9zT7KwjPhjdi9lq08IrTVzPNq36g4ym7R6xVZpJTxP\n/OrEwJiehOcUf2jNqjuJPXJkey4A6xhqCs/K17B0fQKBgQD99qBE+kFscihVTOWK\nciFZXxnSwBWG65s3oxTfykcEHNzqRq+kaMN0Hbhyxz/0ASPGVO9CDSmTVX0jv2JA\nL97IhaJODU1OlmJFrUM2sDWH4VuwN66J/PN2Ef8IEwL2/cj6MFZVH56y1822PnIG\nzchdbBLzlrdP1P/fjOLnqIQTTQKBgQDrT8E2VQgOQqUJhDeERzfcoHCCi6IV7fDj\nKT0gbGzmvaxkwjDcgjGhU0DRdGnhFAReNJt7HHcDXSenQZjXu8sKsUlgIlc6TuOl\n3II4nEEfya2+iIvDpVPMvfPQYQHKSz1bKzSkRiZ0MGDs7u/myKXDrRDiv8QB11Qd\nW63yqYxoZQKBgEEbFbE5OsZzaZWclgftBFGmCLe3mI0zH2KfAz3v3E7Ym2XP4z1R\nwjGlYODD5chG9oXkxkV3nF3x/5fHe4ea/hEH+TjrPhNUiDL2nRGLEN4ZzuiZDbzA\nRSXSrT/Dp/Hr07cX5zoBVizhGBKNZawK2z/f8efSjoH/x+zmcFEVKW7NAoGAM/nt\n555opR27bpqx2JoSkL0vnOZS6x0ftE2LnvnUJDOJPMhYGpz3cXb+PkXEjV7qiBR+\ns3baIvgUpjErHZvxgW8fkgiD0/FQ/3XxnaeGCwt1QTzQAmsmU3cxv7ltt81exCCL\nBC4qmEeHYU511zhCxTIZJLzPAskZX1K83Xjt9rECgYEAjMPUE3cIspSqZjPR4t9A\nga8BT1mgHxsCLzTw1j9nwSKpRAry45PkgGMXuou7YDaNiIe+IgkSPqsde/pPJds6\nYPnRpe9ZsmQ8JhigMWR7hRqqCJcbenU4z+N2sPGqQDyVtwRPy6TvmmmTs9w/rkQJ\n+kdbVnF3Y/5b0Xk9r0vRZZc=\n-----END PRIVATE KEY-----\n'
  }),
  databaseURL: 'https://csgofeels-e3fc5.firebaseio.com'
});


var refreshToken; // Get refresh token from OAuth2 flow

// Get a reference to the database service
var database = admin.database();

var crashData;
var f1, f2, f3, f4, crashFloat, finalCrash;
var crashID;
var userID;
var hash;
var playercount = 0;
var CrashActive = false;
var currentPercentage = 1;
var crashSpeed = 0.005;

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
  console.log('Final Crash Float: '+finalCrash);
  var n = finalCrash.toFixed(2);

  crashData = {
    crashPercentage: n,
    crashHash: hash
  };
  io.emit('crashStart'); //Start the actual crash
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

            if (n > 1.2) {
              crashSpeed = 0.011;
            }
            if (n > 1.3) {
              crashSpeed = 0.012;
            }
            if (n > 1.4) {
              crashSpeed = 0.013;
            }
            if (n > 1.5) {
              crashSpeed = 0.014;
            }
            if (n > 2) {
              crashSpeed = 0.015;
            }
            if (n > 2.5) {
              crashSpeed = 0.0165;
            }
            if (n > 3) {
              crashSpeed = 0.018;
            }
            if (n > 3.5) {
              crashSpeed = 0.02;
            }
            if (n > 4) {
              crashSpeed = 0.023;
            }
            if (n > 4.5) {
              crashSpeed = 0.026;
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


/////////
//Dice
/////////

function writeGameToDB(diceData) {
  admin.database().ref('users/' + diceData.userID + '/dice/games/' + diceData.gameID).set({
    userID: diceData.userID,
    bet: diceData.betAmount,
    profit: diceData.profitOnWin,
    gameID: diceData.gameID
  });
  admin.database().ref('games/dice/' + diceData.gameID).set({
    userID: diceData.userID,
    bet: diceData.betAmount,
    profit: diceData.profitOnWin,
    gameID: diceData.gameID
  });
}


app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res){
res.sendFile(__dirname + '/views/crash.html');
});
app.get('/dice', function(req, res){
res.sendFile(__dirname + '/views/dice.html');
});
app.get('/crash', function(req, res){
res.sendFile(__dirname + '/views/crash.html');
});
app.get('/roulette', function(req, res){
res.sendFile(__dirname + '/views/roulette.html');
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
  //Chat
  socket.on('message', function(messageData){
    io.emit('message', messageData); // we send data back to all clients
  })

  ///////////////
  ///CRASH
  ///////////////
  socket.on('crashBet', function(betAmount){
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
  });

  ///////////////
  ///DICE
  ///////////////
  socket.on('diceData', function (diceData) {
    verifyDice(diceData);
    function verifyDice (diceData, d1, d2, d3, d4, dicePercentage) {
      if (diceData.betAmount <= 0.0) {
        socket.emit('invalidDiceBet');
      } else {
        //Check if dice was correctly calculated
        diceData.multiplier = diceData.percentage * 0.04;
        diceData.multiplier = diceData.multiplier.toFixed(2);
        if (diceData.multiplier == diceData.profitOnWin) {
          console.log(diceData.winChance);

          //calcualte
          d1 = randomFloat(1, 100);
          d2 = randomFloat(1, 100);
          d3 = randomFloat(1, 100);
          d4 = randomFloat(1, 100);
          dicePercentage = d1+d2+d3;
          dicePercentage = dicePercentage / 3;
          var gameID = dicePercentage * d2 * d4 * d3 * d1 * d2;
          gameID = gameID.toFixed(0);
          diceData.gameID = gameID;
          dicePercentage = dicePercentage.toFixed(2);
          console.log('Calculated dice percentage: '+dicePercentage);

          if (diceData.over == true) {
            if (dicePercentage > diceData.percentage) {
              socket.emit('wonDice', dicePercentage);
              writeGameToDB(diceData);
            } else if (dicePercentage < diceData.percentage) {
              socket.emit('lostDice', dicePercentage);
              writeGameToDB(diceData);
            }
          } else {
            if (dicePercentage < diceData.winChance) {
              socket.emit('wonDice', dicePercentage);
              console.log(diceData);
              writeGameToDB(diceData);
            } else if (dicePercentage > diceData.winChance) {
              socket.emit('lostDice', dicePercentage);
              writeGameToDB(diceData);
            }

          }
        }
      }
    };
  })


});

http.listen(3000, function(){
  console.log('Server Started');
});
