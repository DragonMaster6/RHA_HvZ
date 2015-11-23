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
					htmlOut += "<div>" + survivors[index]['fname'] + " " + survivors[index]['lname'] + "</div> <br>";

				}); 
				$.each(zombies, function(index){
					htmlOut += "<div class = 'zombie_list'>" + zombies[index]['fname'] + " " + zombies[index]['lname'] + "</div> <br>";

				}); 
				$("#data_container").html(htmlOut);
			})
			.fail(function(){
				//alert("Getting stats failed");
			});
		}
	}
});