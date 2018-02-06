function wonDice(dicePercentage) {
  var win = true;
  $("#output").text("ROLLED "+ dicePercentage + ", you won!");
  document.getElementById("output").style.color = "white" ;
  showPopup(dicePercentage, win);
  setBalance(win);
}

function lostDice(dicePercentage) {
  var win = false;
  $("#output").text("ROLLED "+ dicePercentage + ", you lost!");
  document.getElementById("output").style.color = "rgb(244, 75, 66)" ;
  showPopup(dicePercentage, win);
  setBalance(win);
}


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

function showGenericPopup(text) {
    $("#generic-popup-text").text(text);
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
$("#profile-close-popup-button").click(function() {
  closePopup();
});

function closePopup(dicePercentage) {
  $( ".dice-popup" ).fadeOut("fast");
  $( ".profile-popup" ).fadeOut("fast");
  $( ".generic-popup" ).fadeOut("fast");
  $( ".bodyWrapper" ).fadeIn("fast");

  //Set popup cookie
    if ($('#disable-popup').is(":checked"))
  {
    var popups = 1;
    Cookies.set('dicepopups', popups, { expires: 7 });
  }

}

function instantlyClosePopup() {
  $( ".dice-popup" ).hide();
  $( ".profile-popup" ).hide();
  $( ".generic-popup" ).hide();
  $( ".bodyWrapper" ).show();
}


///////////////
//TIPPING
///////////////
function tipPlayer(uid, tipAmount) {

  var user = firebase.auth().currentUser;

  tipAmount = document.getElementById('tipField').value;
  tipAmount = parseFloat(tipAmount);
  tipAmount = tipAmount.toFixed(2);
  tipData = {
    receiverUid: uid,
    senderUid: user.uid,
    tipAmount: tipAmount,
    tipperName: user.username
  };

  socketSendTip(tipData);
  //SET balance
  var newBalance = parseFloat(Cookies.get('balance'));
  newBalance = newBalance - parseFloat(tipAmount);
  newBalance = newBalance.toFixed(2);
  $('#balance').text(newBalance+" COINS");
  Cookies.set('balance', newBalance);

  instantlyClosePopup();
  var text = "You tipped "+tipAmount+" coins!"
  showGenericPopup(text);
}

function showProfilePopup(uid, name) {
    $("#profile-popup-text").text("View "+name+"'s Steam profile");
    $("#profile-popup-text").attr("href","http://steamcommunity.com/id/"+uid);

    document.getElementById("generic-popup-text").style.color = "white";
    $( ".profile-popup" ).fadeIn("fast")
    $(".profile-popup").css("display", "inline-flex");
    $( ".bodyWrapper" ).fadeOut("fast");

    $("#profile-tip-popup-button").click(function() {
      tipPlayer(uid);
    });
}

function invalidTip(text) {
  instantlyClosePopup();
  text = "Oops, something went wrong...";
  showGenericPopup(text);
}
