/*
 * Programmers: Ben Matson and Ben Lexa
 * Date Created: November 12, 2015
 * Purpose: Used to handle user interactivity and talk with the server
*/

$(document).ready(function(){
	var SITE_DOMAIN = "http://localhost/index.php/";
	var BASE_DOMAIN = "http://localhost/";


	// If the user presses the recruit button
	$("#recruit_btn").on("click", function(){
		// retrieve all the fields
		var gender;
		$(".gender_in").each(function(){
			if($(this).prop("checked")){
				gender = $(this).val();
			}
		});

		var data = {
			fname: $("#fname_in").val(),
			lname: $("#lname_in").val(),
			dname: $("#dname_in").val(),
			pass: $("#pass_in").val(),
			gender: gender
		};

		// NOTE: Be sure to check for empty fields
		// determine if the passwords match
		if(data.pass == $("#reenter").val()){
			// Pass the data onto the server now
			$.ajax({
				type: "post",
				url: SITE_DOMAIN+"players/signup",
				dataType: "json",
				data: data
			})
			.done(function(msg){
				$("#success_container").html(msg.message);
			})
			.fail(function(){
				$("#error_container").html("Error: Something went wrong in the sign up process");
			});
		}else{
			$("#error_container").html("Passwords do not match");
		}
	});


	// determine if the player is logged in and display the dashboard
	if($("#player").length != 0){
		getStats();
		$("#stats_btn").on("click", function(){
			getStats();
		});
		$("#sList_btn").on("click", function(){
			getSurvivors();
		});
		$("#note_btn").on("click", function(){
			getAlerts();
		});
	}


	// Get the zombie counter and start the count down
	if($("#zombie_tool_container").length != 0){
		// the person is a zombie, now extract the time from the other div
		var remaining = $("#countdown").html();
		var timer = setInterval(function(){
			var hour = Math.floor(remaining/60/60);
			var min = Math.floor((remaining/60)%60);
			var sec = Math.floor(remaining%60);

			if(remaining > 0){
				$("#countdown").html(hour+":"+min+":"+sec);
			}else{
				$("#countdown").html("YOU ARE DEAD");
				clearInterval(timer);
			}
			remaining -=1;
		}, 1000);

	}

/********* Misc Functions **************/
	function getStats()
	{
		var id = $("#player").val();
		var session = $("#session").val();
		if (session != -1 && session != null)
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
		}else{
			// display a place holder
			$("#data_container").html("There isn't an infectious outbreak currently in place");
		}
	}

	// Displays the list of survivors in a current game
	function getSurvivors()
	{
		var session = $("#session").val();
		var htmlOut = "";
		if (session != -1 && session != null)
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
				var departed = msg.departed;
				$.each(survivors, function(index){
					htmlOut += "<div>" + survivors[index]['fname'] + " " + survivors[index]['lname'] + "</div>";

				}); 
				$.each(zombies, function(index){
					htmlOut += "<div class = 'zombie_list'>" + zombies[index]['fname'] + " " + zombies[index]['lname'] + "</div>";

				}); 
				$.each(departed, function(index){
					htmlOut += "<div class = 'departed_list'>" + departed[index]['fname'] + " " + departed[index]['lname'] + "</div>";

				});
				$("#data_container").html(htmlOut);
			})
			.fail(function(){
				//alert("Getting stats failed");
			});
		}else{
			$("#data_container").html("There isn't an infectious outbreak currently in place");
		}
	}

	//Retrieves alerts and sessions from game sessions and GM alerts
	function getAlerts()
	{
		var session = $("#session").val();
		var pID = $("#player").val();
		var htmlOut = "";

		$.ajax({
				type: "post", 
				url: SITE_DOMAIN+"players/alerts",
				dataType: "json",
				data: {sID: session, pID: pID}
			})
			.done(function(msg){
				 var sessionsJoined = msg.sessionsJoined;
				 var sessions = msg.sessions
				 $.each(sessionsJoined, function(index){
				 	htmlOut += "<div class = joinedSession_list>" + sessionsJoined[index]['title'] + " " + sessionsJoined[index]['dateStart'] + " to " + sessionsJoined[index]['dateFinish'] + "</div>";
				 });
				 $.each(sessions, function(index){
				 	htmlOut += "<div class = session_list>" + sessions[index]['title'] + " " + sessions[index]['dateStart'] + " to " + sessions[index]['dateFinish'] + "<button class = 'join_btn' value= "+ sessions[index]['sID']+"> Join </button> </div>";
				 });
				 $("#data_container").html(htmlOut);
			});
	}

	$("#data_container").on("click", '.join_btn', function ()
	{
		var session = $(this).val();
		var pID = $("#player").val();

		$.ajax({
				type: "post", 
				url: SITE_DOMAIN+"players/join",
				dataType: "json",
				data: {sID: session, pID: pID}
			})
		.done(function(msg){
			getAlerts();
		});
	});

});