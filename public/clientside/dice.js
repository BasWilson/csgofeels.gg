var socket = io();
var activeGame = false;

var dice = {
  percentage: 0,
  multiplier: 0,
  winChance: 0,
  profitOnWin: 0,
  betAmount: 0,
  over: true
};


setInterval(function(){
  dice.percentage = document.getElementById("percentageField").value;
  dice.percentage = document.getElementById("sliderDice").value;
  dice.multiplier = document.getElementById("multiplierField").value;
  dice.winChance = document.getElementById("winchanceField").value;
  dice.betAmount = document.getElementById("betAmountField").value;



  //calc profit on win REDO OBVIOUSLY
  dice.multiplier = dice.percentage * 0.04;

  //
  dice.multiplier = dice.multiplier.toFixed(2);
  dice.profitOnWin = dice.multiplier * dice.betAmount;
  dice.profitOnWin = dice.profitOnWin.toFixed(2);
  document.getElementById('multiplierField').value = dice.multiplier;
  document.getElementById('profitOnWin').innerHTML = dice.profitOnWin;

  var overunder = document.getElementById("overunder").checked;
  document.getElementById('percentageField').value = dice.percentage + "%";

  if (overunder == true) {
    $("#overundertext").text("ROLLING UNDER");
    document.getElementById("overundertext").style.color = "white" ;
    dice.over = false;
    document.getElementById('winchanceField').value = dice.percentage + "%";
  } else {
    dice.over = true;
    document.getElementById("overundertext").style.color = "rgb(238, 0, 255)" ;
    $("#overundertext").text("ROLLING OVER");
    document.getElementById('winchanceField').value = 100 - dice.percentage + "%";
  }

}, 20);

$("#rollBTN").click(function() {
  socket.emit('diceData', dice);
});

socket.on('wonDice', function (dicePercentage) {
  $("#output").text("ROLLED "+ dicePercentage + ", you won!");
  document.getElementById("output").style.color = "rgb(238, 0, 255)" ;
})
socket.on('lostDice', function (dicePercentage) {
  $("#output").text("ROLLED "+ dicePercentage + ", you lost!");
  document.getElementById("output").style.color = "red" ;
})

socket.on('playerCount', function (playercount) { // Show the online player count
  $("#playerCount").text("Online Players: " + playercount);
});
