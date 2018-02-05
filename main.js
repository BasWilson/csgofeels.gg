var express = require('express');
var app = express();
var http = require('http').Server(app);
var path = require('path')
var io = require('socket.io')(http);
var sha256 = require('js-sha256');
var randomFloat = require('random-float');


//OTHER STUFF
var userdata = require('./modules/userdata');
var general = require('./modules/general');
var tipping = require('./modules/tipping');

//GAMEMODES
var crash = require('./modules/crash');
var colors = require('./modules/colors');
var dice = require('./modules/dice');

//HANDLE PAGES HERE
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res){
res.sendFile(__dirname + '/views/dice.html');
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
app.get('/settings', function(req, res){
res.sendFile(__dirname + '/views/settings.html');
});
app.get('/colors', function(req, res){
res.sendFile(__dirname + '/views/colors.html');
});

//SOCKET CONNECTIONS
io.on('connection', function(socket){

    playercount ++;
    console.log('user connected, Online users: ' + playercount);
    io.emit('playerCount', playercount);

  socket.on('disconnect', function(){
    playercount --;
    console.log('user disconnected, Online users: ' + playercount);
    io.emit('playerCount', playercount);

  });

  ///CHAT
  socket.on('message', function(messageData){
    io.emit('message', messageData); // we send data back to all clients
  })

  ///CRASH
  socket.on('crashBet', function(gameData){

    if (gameData.betAmount <= 0.0) {
      socket.emit('invalidBet');
    } else {
      crash.startCrash();
    }
  });

  socket.on('getOut', function () {
    socket.emit('gotOut');
  });

  ///TIPPING
  socket.on('sendTip', function (tipData) {

    if (tipData.tipAmount <= 0.0) {
      socket.emit('invalidTip');
    } else {
      tipping.getBalanceForTip(tipData, socket);
    }
});

  ///DICE
  socket.on('diceData', function (gameData) {

    if (gameData.betAmount <= 0.0) {
      socket.emit('invalidColorsBet');
    } else {
    userdata.getBalance(gameData, socket);
    }
  })

  ///COLORS
  socket.on('colorsData', function (gameData) {

    if (gameData.betAmount <= 0.0) {
      socket.emit('invalidColorsBet');
    } else {
    userdata.getBalance(gameData, socket);
  }
  })
});

http.listen(3000, function(){
  console.log('Server Started');
});
