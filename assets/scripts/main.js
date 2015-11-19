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
		$("#data_container").html("<h3> This is a test of the Survivor List </h3>");
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
});