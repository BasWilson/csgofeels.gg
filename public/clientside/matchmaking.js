var timer = new Timer();
var socket = io();
var betAmount;
var crashData;

function startCrash() {

  //Set HTML values to active game values
  $("#searchBTN").text("Get out");
  $("#output").text("Bets are locked in");
  $("#output2").text("Crash has started");
  $("#betTextField").attr("background-color", "grey");
  $("#betTextField").attr("disabled", "disabled");
}

function startCrashIntermission() {

  //Start the progress bar upto next game
  $("#output2").text("Waiting for next game...");
  var timeleft = 10;
  var crashtimer = setInterval(function(){
    document.getElementById("progressBar").value = 10 - --timeleft;
    if(timeleft <= 0)
      clearInterval(crashtimer);
  },1000);
}
function crashed(crashData) {

  //Reset all HTML values back to normal
  $("#searchBTN").text("Place Bet");
  $("#output").text("Place a bet");
  $("#output2").text("CRASHED AT "+ crashData.crashPercentage +"%");
  $("#betTextField").removeAttr("disabled");
  $("#betTextField").attr("cursor", "text");
}

function placeBet(betAmount) { //Send your bet to the server
  betAmount = document.getElementById('betTextField').value;
  socket.emit('bet', betAmount);
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

socket.on('crashStart', function (crashData) { // Server has started Crash round
  startCrash(crashData);
});

socket.on('crashIntermission', function (data) { // Server has started Crash round
  startCrashIntermission();
});
socket.on('crashed', function (crashData) { // Server crashed it
  crashed(crashData);
});

socket.on('playerCount', function (playercount) { // Show the online player count
  $("#playerCount").text("Online Players: " + playercount);
});
