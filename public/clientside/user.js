var socket = io();


socket.on('balance', function () { // Show the player balance
    getBalance();
});

//For a strange reason these only work from here
socket.on('wonDice', function (dicePercentage) {
  $("#output").text("ROLLED "+ dicePercentage + ", you won!");
  document.getElementById("output").style.color = "white" ;
  getBalance();
});
socket.on('lostDice', function (dicePercentage) {
  $("#output").text("ROLLED "+ dicePercentage + ", you lost!");
  document.getElementById("output").style.color = "red" ;
  getBalance();
});
