var socket = io();

//For a strange reason these only work from here
socket.on('wonDice', function (dicePercentage) {
  var win = true;
  $("#output").text("ROLLED "+ dicePercentage + ", you won!");
  document.getElementById("output").style.color = "white" ;
  showPopup(dicePercentage, win);
  setBalance(win);
});
socket.on('lostDice', function (dicePercentage) {
  var win = false;
  $("#output").text("ROLLED "+ dicePercentage + ", you lost!");
  document.getElementById("output").style.color = "rgb(244, 75, 66)" ;
  showPopup(dicePercentage, win);
  setBalance(win);
});

function showPopup(dicePercentage, win, value) {
  //Check if user has disabled popups
  var popups = Cookies.get('dicepopups');
  if (popups == 1) {
    //hide
  } else {
    if (win == true) {
      $("#popup-text").text("ROLLED "+ dicePercentage + ", you won!");
      document.getElementById("popup-text").style.color = "white";
    } else {
      $("#popup-text").text("ROLLED "+ dicePercentage + ", you lost!");
      document.getElementById("popup-text").style.color = "rgb(244, 75, 66)";
    }
    $( ".dice-popup" ).fadeIn("fast");
    $(".dice-popup").css("display", "inline-flex");
    $( ".bodyWrapper" ).fadeOut("fast");
  }
}

function showBalancePopup() {
      $("#generic-popup-text").text("You don't have enough balance!");
      document.getElementById("generic-popup-text").style.color = "white";
    $( ".generic-popup" ).fadeIn("fast")
    $(".generic-popup").css("display", "inline-flex");
    $( ".bodyWrapper" ).fadeOut("fast");
}

$("#close-popup-button").click(function() {
  closePopup();
});

$("#generic-close-popup-button").click(function() {
  closePopup();
});
function closePopup(dicePercentage) {
  $( ".dice-popup" ).fadeOut("fast");
  $( ".generic-popup" ).fadeOut("fast");
  $( ".bodyWrapper" ).fadeIn("fast");

  //Set popup cookie
    if ($('#disable-popup').is(":checked"))
  {
    var popups = 1;
    Cookies.set('dicepopups', popups, { expires: 7 });
  }

}

socket.on('balance', function () { // Show the player balance
    getBalance();
});

socket.on('invalidBalance', function () {
  showBalancePopup();
});
