$(function() {

	$("#searchBTN").click(function() {
		var button = document.getElementById('searchBTN').innerHTML;

		if (button == "Place Bet") {
			placeBet();
		}
		if (button == "Get out") {
			getOutCrash();
		}

	});

});

$(document).ready(function(){
	$('.bodyWrapper').fadeIn(1500);

});
