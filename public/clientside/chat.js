var socket = io();

function scrollDown() {
  $('#message').animate({
  scrollTop: $('#message').get(0).scrollHeight}, 500);
}

var message;
var data;

function sendMessage() {
  var user = firebase.auth().currentUser;

      firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        // User is signed in.
        var usernameCookie = Cookies.get('username');

        message = document.getElementById('messageField').value;

        if (message == "") {
          //ignore input
        } else {
          data = {
            message: message,
            username: usernameCookie,
            uid: user.uid
          }
          socket.emit('message', data)

          document.getElementById('messageField').value = "";
          scrollDown();
        }
      } else {
        // No user is signed in.
        message = '<a id="message" class="chatText">'+"Server: "+ "You have to sign in!"+'</a><br>';
        $("#message").append(message);
      }
    });

}

socket.on('message', function (data) {
  var color;
  firebase.database().ref('/roles/' + data.uid).once('value').then(function(snapshot) {
    role = (snapshot.val() && snapshot.val().role);
    if (role == "Admin") {
      	color = "rgb(238,0,255)";
    }
    if (role == "Moderator") {
      	color = "red";
    }
    if (role == "Support") {
        color = "blue";
    }
    if (role == null) {
        role = "";
    }
    message = '<a id="'+data.uid+'" class="chatText"><span style="color:'+color+'; text-transform: uppercase;">'+role+'</span>'+" "+'<span class="lel" id="'+data.uid+'" data-name="'+data.username+'"  style="cursor: pointer">'+data.username+'</span>'+": "+ data.message+'</a><br>';
    $("#message").append(message);
    scrollDown();
    $("span").click(function(){
      var uid = $(this).attr("id");
      var name = $(this).attr("data-name")
      showProfilePopup(uid, name);
    });
  });

});

socket.on('highRoller', function (diceData) {
message = '<a id="message" class="chatText" style="color: green;">'+"SOMEONE JUST WON "+ diceData.profitOnWin+" COINS!"+'</a><br>';
$("#message").append(message);
scrollDown();
});

$("#sendBtn").click(function() {
  sendMessage();
});
$(document).keypress(function(e) {
  if(e.which == 13) {
    sendMessage();
  }
});

socket.on('balance', function (balance) {
  document.getElementById('balance').innerHTML = balance + " COINS";
});
