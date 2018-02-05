var time = 0;

var timer = setInterval(function() {
  time = time + 0.1;
  document.getElementById('output').innerHTML = time.toFixed(2) + " seconds";
},100);

$("#blueBtn").click(function() {
  clearInterval(timer);
});
