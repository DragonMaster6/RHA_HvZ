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

	// Setup the calendar view
	// Retrieve the current time and date
	var timeStamp = new Date();
	var months = ["January","Feburary", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	displayCalendar(timeStamp.getMonth()+1);
	$("#calendar_header").html(months[timeStamp.getMonth()]);

	// Dashboard controls
	$("#profile_btn").on("click", function(){
		var toggled = $(this).prop("value");
		if(toggled == "" || toggled == 0){
			$(this).prop("value", "1");
			$(this).html("Calendar");

			// fetch the user's profile
			getProfile();

		}else{
			$(this).prop("value", "0");
			$(this).html("Profile");

			// Setup the calendar container the way it should be
			$("#calendar_container").html("<div id='calendar_header'></div><div id='calendar'></div>");

			// display the calendar now
			$("#calendar_header").html(months[timeStamp.getMonth()]);
			displayCalendar(timeStamp.getMonth()+1);
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
				 	htmlOut += "<div class = joinedSession_list>" + sessionsJoined[index]['title'] + " " + sessionsJoined[index]['dateStart'] + " to " + sessionsJoined[index]['dateFinish'] + "<button class = 'leave_btn' value= "+ sessionsJoined[index]['sID']+"> Leave </button> </div>";
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

	$("#data_container").on("click", '.leave_btn', function ()
	{
		var session = $(this).val();
		var pID = $("#player").val();

		$.ajax({
				type: "post", 
				url: SITE_DOMAIN+"players/leave",
				dataType: "json",
				data: {sID: session, pID: pID}
			})
		.done(function(msg){
			getAlerts();
		});
	});


	// Get's the user's profile information
	function getProfile(){
		var htmlOut = "";

		// retrieve the player's id 
		var pID = $("#player").val();

		// send ajax request
		$.ajax({
			type: "post",
			url: SITE_DOMAIN+"players/profile/"+pID,
			dataType: "json",
		})
		.done(function(msg){
			var user = msg.playerInfo;
			htmlOut = "<div id='player_profile'>"+
							"First name: "+user['fname']+
							"Last name: "+user['lname']+"<br>"+
							"Username: "+user['dname']+"<br>"+
							"Email: "+user['email']+"<br>"+
							"Gender: "+user['gender']+"<br>"+
						"</div>";

			$("#calendar_container").html(htmlOut);
		});
	}


	/******************************************'
	************ Calendar Section **************
	=============================================*/
	// This function will retrieve current and future game events from the server based on the current time
	function getSessions(){
		
		alert("Got sessions before returning: "+sessionList.toString());
		return sessionList;
	}

	function displayCalendar(month){
		var calendar = "";		// this will hold the html needed to display the calendar view
		switch(month){
			case 1:
			case 3: 
			case 5: 
			case 7: 
			case 8: 
			case 10: 
			case 12:
				calendar = displayDay(31);
				break;

			case 2:
			case 4:
			case 6:
			case 9:
			case 11:
				calendar = displayDay(30);
				break;
			default:
				break;
		}

		return calendar;
	}

	function displayDay(type, sessions){
		// type is the amount of days in a month
		var session = $("#session").val();
		var pID = $("#player").val();
		var day = timeStamp.getDate();		// get today's day
		var calendar = "";		// this will hold the html needed to display the calendar view

		var sessions = [];		// holds all the sessions
		$.ajax({
				type: "post", 
				url: SITE_DOMAIN+"players/alerts",
				dataType: "json",
				data: {sID: session, pID: pID}
			})
			.done(function(msg){
				var sessions = msg.sessions;
				var sessionsJoined = msg.sessionsJoined;
				for(var i = 1; i < type+1; i++){
					var dayStyle = "day";		// based on the on-going sessions and to be held sessions
					var start, finish;
					$.each(sessions, function(index){
						var time = [
							sessions[index]['dateStart'].split(" "),
							sessions[index]['dateFinish'].split(" ")
						];
						start = new Date(time[0][0]);
						finish = new Date(time[1][0]);

						//calendar += "Start Time: "+start[0][0]+":"+start[0][1]+":"+start[0][2];

						// note that this statement does not check for year yet
						// note that this doesn't specify if the user has not joined a game yet
						/*if((timeStamp.getDate() >= start.getDate() && timeStamp.getDate() < finish.getDate())){
							dayStyle = "gameDay";
						}*/
						var testDay = new Date(timeStamp.getFullYear()+"-"+(timeStamp.getMonth()+1)+"-"+i);
						if(testDay >= start && testDay < finish){
							dayStyle = "waitDay";
						}
					});

					$.each(sessionsJoined, function(index){
						var time = [
							sessionsJoined[index]['dateStart'].split(" "),
							sessionsJoined[index]['dateFinish'].split(" ")
						];
						start = new Date(time[0][0]);
						finish = new Date(time[1][0]);

						//calendar += "Start Time: "+start[0][0]+":"+start[0][1]+":"+start[0][2];

						// note that this statement does not check for year yet
						// note that this doesn't specify if the user has not joined a game yet
						/*if((timeStamp.getDate() >= start.getDate() && timeStamp.getDate() < finish.getDate())){
							dayStyle = "gameDay";
						}*/
						var testDay = new Date(timeStamp.getFullYear()+"-"+(timeStamp.getMonth()+1)+"-"+i);
						if(testDay >= start && testDay < finish){
							dayStyle = "gameDay";
						}
					});

					


					calendar += "<div id='day-"+i+"' class='"+dayStyle+"'>"+i;

					// has the day already pasted 
					if(i < day){
						calendar += "<img class='done_day' src='"+BASE_DOMAIN+"/assets/pics/blackX.png'>";
					}

					calendar += "</div>";
					if(i%7 == 0){
						calendar += "<br>";
					}
				}


				// At last display the calendar
				$("#calendar").html(calendar);
			});
	}
});