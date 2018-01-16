function scrollDown() {
  $('#message').animate({
  scrollTop: $('#message').get(0).scrollHeight}, 500);
}

var message;
var data;

function sendMessage() {

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
            username: usernameCookie
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
message = '<a id="message" class="chatText">'+data.username+": "+ data.message+'</a><br>';
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
