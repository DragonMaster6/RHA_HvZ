/*
 * Programmers: Ben Matson and Ben Lexa
 * Date Created: November 12, 2015
 * Purpose: Used to handle user interactivity and talk with the server
*/

$(document).ready(function(){
	var SITE_DOMAIN = "http://localhost/index.php/";
	var BASE_DOMAIN = "http://localhost/";

	
	getStats();
	$("#stats_btn").on("click", function(){
		getStats();
	});
	$("#sList_btn").on("click", function(){
		getSurvivors();
	});


	// Get the zombie counter and start the count down
	if($("#zombie_tool_container").length != 0){
		// the person is a zombie, now extract the time from the other div
		var remaining = $("#countdown").html();
		var timer = setInterval(function(){
			var hour = Math.floor(remaining/60/60);
			var min = Math.floor((remaining/60)%60);
			var sec = Math.floor(remaining%60);
			$("#countdown").html(hour+":"+min+":"+sec);
			remaining -=1;
		}, 1000);


	}

/********* Misc Functions **************/
	function getStats()
	{
		var id = $("#player").val();
		var session = $("#session").val();
		if (session != -1)
		{
			$.ajax({
				type: "post", 
				url: SITE_DOMAIN+"players/stats",
				dataType: "json",
				data: {sID: session, pID: id}
			})
			.done(function(msg){
				var stats = msg.stats;
				var htmlOut = "Welcome "+stats["dname"]+"<br> hScore: "+stats["hScore"]+"<br> zScore: "+stats["zScore"]+"<br> lastKill: "+stats["lastKill"]+"<br> originalZ: "+stats["originalZ"];
				$("#data_container").html(htmlOut);
			})
			.fail(function(){
				//alert("Getting stats failed");
			});
		}
	}

	// Displays the list of survivors in a current game
	function getSurvivors()
	{
		var session = $("#session").val();
		var htmlOut = "";
		if (session != -1)
		{
			$.ajax({
				type: "post", 
				url: SITE_DOMAIN+"players/survivors",
				dataType: "json",
				data: {sID: session}
			})
			.done(function(msg){
				var survivors = msg.survivors;
				var zombies = msg.zombies;
				$.each(survivors, function(index){
					htmlOut += "<div>" + survivors[index]['fname'] + " " + survivors[index]['lname'] + "</div>";

				}); 
				$.each(zombies, function(index){
					htmlOut += "<div class = 'zombie_list'>" + zombies[index]['fname'] + " " + zombies[index]['lname'] + "</div>";

				}); 
				$("#data_container").html(htmlOut);
			})
			.fail(function(){
				//alert("Getting stats failed");
			});
		}
	}
});