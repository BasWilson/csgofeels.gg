/*

We need to start handeling all connections from main.js

then depending on the HTTP request we load a certain game.js

for instance for the colors gamemode we will get a HTTP request for localhost/colors.
We include serverside/colors.js and handle the user from in there with use of export function.

Sample main.js code:
*/
var express = require('express');
var app = express();
var http = require('http').Server(app);
var path = require('path')
var colors = require('serverside/colors.js')
var io = require('socket.io')(http);

app.use(express.static(path.join(__dirname, 'public')));

app.get('/colors', function(req, res){
res.sendFile(__dirname + '/views/colors.html');
});


/*
Then colors.js should look something like this
*/
module.exports = {
  joinColorsGameMode: function (socket) {
    socket.join('ColorsRoom');
  }
};

io.on('connection', function(socket){
});
