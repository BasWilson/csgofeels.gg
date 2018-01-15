function scrollDown() {
  $('#message').animate({
  scrollTop: $('#message').get(0).scrollHeight}, 500);
}

var message;
var data;

function sendMessage() {

    name = name;
    message = document.getElementById('messageField').value;

    if (message == "") {
      //ignore input
    } else {
      data = {
        message: message
      }
      socket.emit('message', data)

      document.getElementById('messageField').value = "";
      scrollDown();
    }
}

socket.on('message', function (data) {
message = '<a id="message" class="chatText">'+"USERNAME: " + data.message+'</a><br>';
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
