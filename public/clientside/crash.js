var socket = io();
var betAmount;
var crashData;
var activeGame = false;
var chartInterval;
var crashArray = [];


/////////////
//CRASH LINE
/////////////
var c = document.getElementById("crashCanvas");
var ctx = c.getContext("2d");
ctx.beginPath();
ctx.moveTo(60,540); // Go 100 over actual canvas size, this way crash starts at 0.

//CANVAS STYLING
ctx.lineWidth = 100;

function createLine(n) {
  if (activeGame == true) {

    n = n * 40;//This is why we go 100 over canvas size
    n = 540 - n;// Go 100 over actual canvas size, this way crash starts at 0.

    ctx.lineTo(60, n);
    ctx.stroke();
    ctx.strokeStyle = 'rgb(244, 75, 66)';

  }
}
function startCrash() {

  //Set HTML values to active game values
  $("#searchBTN").text("Get out");
  $("#output").text("Bets are locked in");
  $("#betTextField").attr("background-color", "grey");
  document.getElementById("crashValue").style.color = "rgb(244, 75, 66)";
  $("#betTextField").attr("disabled", "disabled");
  activeGame = true
}

function startCrashIntermission() {

  //Start the progress bar upto next game
  var timeleft = 1000;
  var crashtimer = setInterval(function(){
    document.getElementById("progressBar").value = 0 + --timeleft ;
    if(timeleft <= 0)
      clearInterval(crashtimer);
  },10);
}
function crashed(crashData) {

  //Reset all HTML values back to normal

  $("#searchBTN").text("Place Bet");
  $("#output").text("Place a bet");
  $("#crashValue").text("x"+ crashData.crashPercentage);
  document.getElementById("crashValue").style.color = "red" ;
  $("#betTextField").removeAttr("disabled");
  $("#progressBar").val(1000);
  $("#betTextField").attr("cursor", "text");
  activeGame = false;

}

function placeBet(betAmount) { //Send your bet to the server
  betAmount = document.getElementById('betTextField').value;
  socket.emit('crashBet', betAmount);
}

function setCrashValue(n) {
  $("#crashValue").text("x" +n);
}

function getOutCrash() { //Try to leave the current active crash
  socket.emit('getOut');
}

socket.on('gotOut', function (data) { // Succesfully got out in active crash game
  $("#output").text("You got out");
});

socket.on('inactive', function () { // Set everything for new round
  $("#searchBTN").text("Place Bet");
  $("#output").text("Place a bet");
  $("#betTextField").removeAttr("disabled");
  $("#betTextField").attr("cursor", "text");
});

socket.on('invalidBet', function () { //Your bet failed to validate with the server
  $("#output").text('Minimum bet is 0.1 coins');
});

socket.on('validBet', function (betAmount) { //Your placed bet has been validated with the server
  $("#output").text('Placed ' + betAmount + ' coins!');
});

socket.on('crashStart', function () { // Server has started Crash round
  startCrash();
});

socket.on('crashIntermission', function (data) { // Server has started Crash round
  startCrashIntermission();
});
socket.on('crashValue', function (n) { // Server has started Crash round
  setCrashValue(n);
  createLine(n);
});
socket.on('crashed', function (crashData) { // Server crashed it
  crashed(crashData);
});

socket.on('playerCount', function (playercount) { // Show the online player count
  $("#playerCount").text("Online Players: " + playercount);
});
