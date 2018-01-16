var socket = io();
var betAmount;
var crashData;
var activeGame = false;
var chartInterval;
var crashArray = [];

function startCrash() {

  //Set HTML values to active game values
  $("#searchBTN").text("Get out");
  $("#output").text("Bets are locked in");
  $("#betTextField").attr("background-color", "grey");
  document.getElementById("output2").style.color = "rgb(244, 75, 66)";
  $("#betTextField").attr("disabled", "disabled");
  activeGame = true
  setChart();
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
  $("#output2").text("CRASHED AT x"+ crashData.crashPercentage);
  document.getElementById("output2").style.color = "red" ;
  $("#betTextField").removeAttr("disabled");
  $("#progressBar").val(1000);
  $("#betTextField").attr("cursor", "text");
  activeGame = false;
  clearInterval(chartInterval);

}

function setChart(n) {

  chartInterval = setInterval(function(){

  var canvas = document.getElementById("myChart");
  var ctx = canvas.getContext('2d');

  // Global Options:
  Chart.defaults.global.defaultFontColor = 'rgb(244, 75, 66)';
  Chart.defaults.global.defaultFontSize = 16;

  var data = {
    labels: crashArray,
    datasets: [{
        label: "Crash",
        fill: true,
        lineTension: 0.1,
        backgroundColor: "rgba(244, 75, 66, 0.2)",
        borderColor: "rgb(244, 75, 66);",
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'miter',
        pointBorderColor: "white",
        pointBackgroundColor: "black",
        pointBorderWidth: 0,
        pointHoverRadius: 0,
        pointHoverBackgroundColor: "rgb(244, 75, 66)",
        pointHoverBorderColor: "rgb(244, 75, 66)",
        pointHoverBorderWidth: 2,
        pointRadius: 0,
        pointHitRadius: 0,
        // notice the gap in the data and the spanGaps: false
        data: crashArray,
        spanGaps: false,
      }
    ]
  };

  // Notice the scaleLabel at the same level as Ticks
  var options = {
    scales: {
              yAxes: [{
                  ticks: {
                      beginAtZero:true,
                      autoSkip: false
                  }
              }]
          }
  };

  // Chart declaration:
  var myBarChart = new Chart(ctx, {
    type: 'line',
    data: data,
    options: options
  });
}, 1000);
}

function setChartValue(n) {

  if (activeGame == true) {
    crashArray.push(n);
    console.log(crashArray);
  }
}
function placeBet(betAmount) { //Send your bet to the server
  betAmount = document.getElementById('betTextField').value;
  socket.emit('crashBet', betAmount);
}

function setCrashValue(n) {
  $("#output2").text("x" +n);
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
  setChartValue(n);
});
socket.on('crashed', function (crashData) { // Server crashed it
  crashed(crashData);
});

socket.on('playerCount', function (playercount) { // Show the online player count
  $("#playerCount").text("Online Players: " + playercount);
});
