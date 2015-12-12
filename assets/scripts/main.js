/*
 * Programmers: Ben Matson and Ben Lexa
 * Date Created: November 12, 2015
 * Purpose: Used to handle user interactivity and talk with the server
*/

$(document).ready(function(){
	var SITE_DOMAIN = "http://localhost/index.php/";
	var BASE_DOMAIN = "http://localhost/";
	var timeStamp = new Date();
	var timer;
	var remaining;


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

	// Dashboard controls
	$("#calendar_btn").on("click", function(){
		// Setup the calendar container the way it should be
		$("#calendar_container").html("<div id='calendar_header'></div><div id='calendar'></div>");

		// display the calendar now
		$("#calendar_header").html(months[timeStamp.getMonth()]);
		displayCalendar(timeStamp.getMonth()+1);
	});

	$("#profile_btn").on("click", function(){
		// fetch the user's profile
		getProfile(false);
	});

	$("#sessions_btn").on("click",function(){
		// The player is a gm and so display the create sessions forum
		getSessions(false);
	});

	// determine if the player is logged in and display the dashboard
	if($("#player").length != 0){
		// Setup the calendar view
		// Retrieve the current time and date
		var months = ["January","Feburary", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
		displayCalendar(timeStamp.getMonth()+1);
		$("#calendar_header").html(months[timeStamp.getMonth()]);
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
		$("#zombie_tool_container").on("click", "#kill_btn", function(){
			confirmKill();
		});
	}


	// Get the zombie counter and start the count down
	if($("#zombie_tool_container").length != 0){
		// the person is a zombie, now extract the time from the other div
		remaining = $("#countdown").html();
		countdown();
	}

/********* Misc Functions **************/
	function countdown(){
		clearInterval(timer);
		remaining = $("#countdown").html();
		timer = setInterval(function(){
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
				 	htmlOut += "<div class = session_list>" + sessions[index]['title'] + " " + sessions[index]['dateStart'] + " to " + sessions[index]['dateFinish'] + "<br>Population thus far: "+sessions[index]['numPlay']+"<button class = 'join_btn' value= "+ sessions[index]['sID']+"> Join </button> </div>";
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
			// be sure to update the hidden fields
			if($("#session").val() == -1 && $("#session").val() != ""){
				$("#session").prop("value", session);
			}
			getAlerts();
			displayCalendar(timeStamp.getMonth()+1);
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
			// make sure that the hidden fields are correctly updated
			$("#session").prop("value","-1");
			getAlerts();
			displayCalendar(timeStamp.getMonth()+1);
		});
	});

	//function to handle the kill confimation process
	function confirmKill()
	{
		var session = $("#session").val();
		var pID = $("#player").val();
		var enteredBadge = $("#killNum").val();

		$.ajax({
				type: "post", 
				url: SITE_DOMAIN+"players/kill",
				dataType: "json",
				data: {sID: session, pID: pID, badge: enteredBadge}
			})
		.done(function(msg){
			if (msg.attempt)
			{
				getStats();
				$("#countdown").html(msg.lastkill);
				countdown();
				var audio = new Audio(BASE_DOMAIN+"/assets/pics/infected.wav");
				audio.play();
			}
			
		});
	}

	// Get's the user's profile information depending on if it is edit mode or not
	function getProfile(edit){
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
			var gameMod = (user['gm'] == 1) ? "Yes" : "No";
			var firstN = user['fname'];
			var lastN = user['lname'];
			var userN = user['dname'];
			var email = user['email'];
			var gender = user['gender'];
			var buttons = "<button id='edit_profile_btn'> Edit Profile </button><button id='delete_profile_btn'> Terminate </button>";

			// Display either preview mode or edit mode
			if(edit){
				firstN = "<input type='text' id='firstN' value='"+firstN+"'>";
				lastN = "<input type='text' id='lastN' value='"+lastN+"'>";
				userN = "<input type='text' id='userN' value='"+userN+"'>";
				email = "<input type='text' id='email' value='"+email+"'>";
				if(gender == "M"){
					gender = "Male: <input type='radio' name='gender' class='gender' value='M' checked> Female: <input type='radio' name='gender' class='gender' value='F'>";
				}else{
					gender = "Male: <input type='radio' name='gender' class='gender' value='M'> Female: <input type='radio' name='gender' class='gender' value='F' checked>";
				}
				buttons = "<button id='submit_profile_btn'> Update Profile </button><button id='cancel_changes_btn'>Cancel</button><button id='delete_profile_btn'> Terminate </button>";
			}

			htmlOut = "<div id='player_profile'>"+
							"First name: "+firstN+"<br>"+
							"Last name: "+lastN+"<br>"+
							"Username: "+userN+"<br>"+
							"Email: "+email+"<br>"+
							"Gender: "+gender+"<br>"+
							"Game Moderator: "+gameMod+"<br>"+
							"Number of games played: "+user['gameCount']+"<br><br>"+
							buttons+
						"</div>";

			$("#calendar_container").html(htmlOut);
		});
	}

	// This allows a player to edit their profile
	$("#calendar_container").on("click","#edit_profile_btn", function(){
		getProfile(true);
	});
	// This allows a user to cancel their changes
	$("#calendar_container").on("click","#cancel_changes_btn",function(){
		getProfile(false);
	});
	// This submits the players changes to their profile
	$("#calendar_container").on("click","#submit_profile_btn", function(){
		var firstN = $("#firstN").val();
		var lastN = $("#lastN").val();
		var userN = $("#userN").val();
		var email = $("#email").val();
		var gender;
		$(".gender:radio").each(function(){
			if($(this).prop("checked")){
				gender = $(this).val();
			}
		});

		// might want to do some data validation here

		// send ajax the new profile
		$.ajax({
			type: "post",
			url: SITE_DOMAIN+"players/update",
			dataType: "json",
			data: {fname: firstN, lname: lastN, dname: userN, email: email, gender: gender}
		})
		.done(function(msg){
			getProfile(false);
		});
	});
	// This will send a request to delete the user's account
	$("#calendar_container").on("click","#delete_profile_btn", function(){
		// First be sure to ask the player if they want to do this
		var response = confirm("Warning: this will delete everything you worked for and cannot be retrieved again. Continue?");
		if(response){
			// user has agreed to terminate their profile
			$.ajax({
				type: "post",
				url: SITE_DOMAIN+"players/delete",
			})
			.done(function(){
				// redirect to the main page
				window.location = SITE_DOMAIN;
			});

		}
	});

	/**** This section of code displays and handles session creations ****/
	function getSessions(edit){
		// edit parameter determines if the display needs to show text fields

		var htmlOut = "<h3> Planned Zombie Outbreaks </h3><button onClick='$(\"#create_session\").slideToggle(\"slow\");'> Create a new outbreak </button><br>";

		// send a request to get all sessions in progress and in the future
		$.ajax({
			type: "post",
			url: SITE_DOMAIN+"/gamesessions/index",
			dataType: "json"
		})
		.done(function(msg){
			var sessions = msg.sessions;
			var games = msg.games;
			var gameType;		// holds the html for game types
			gameType = "<select id='new_gameType'>";
			$.each(games, function(index){
				var type = games[index];
				gameType += "<option value='"+type['gID']+"'> "+type['title']+"</option>";
			});
			gameType += "</select>";

			htmlOut += "<div class='hide' id='create_session'>"+
							"Outbreak Title: <input type='text' id='new_title'><br>"+
							"Game type:"+gameType+"<br>"+
							"Starting date: <input type='text' id='new_start'><br>"+
							"Finishing date: <input type='text' id='new_finish'><br>"+
							"<button id='session_create_btn'>Begin Infection</button><br>"+
						"</div>";

			$.each(sessions, function(index){
				var session = sessions[index];
				var game; // holds the game details specified by the session
				
				htmlOut += "<div id='session-"+session['sID']+"' class='session_info'>";
				htmlOut += displaySession(session, games, edit);
				htmlOut += "</div>";
					
			});

			// display the results now
			$("#calendar_container").html(htmlOut);
		});
	}

	function displaySession(session, games, edit){
		// This function displays an individual session either in edit mode or not display mode
		var htmlOut = "";

		var gameType = "<select class='gameType'>"; // holds the html code to display the game

		// find the game type
		$.each(games, function(gIndex){
			var type = games[gIndex];
			if(type['gID'] == session['gType'] && !edit){
				game = type;
			}else{
				if(type['gID'] == session['gType']){
					gameType += "<option value='"+type['gID']+"' selected>"+type['title']+"</option>";	
				}else{
					gameType += "<option value='"+type['gID']+"'>"+type['title']+"</option>";
				}
			}
		});
		gameType += "</select>";

		// these variables will aid in displaying the proper features
		var title = session['title'];
		var start = session['dateStart'];
		var fin = session['dateFinish'];
		var buttons = "<button id='session_edit'>Edit</button><button id='session_delete_btn'>Delete</button><br>"

		// check for edit mode
		if(edit){
			title = "<input type='text' name='title' class='title' value='"+title+"'>";
			start = "<input type='text' name='start' class='start' value='"+start+"'>";
			fin = "<input type='text' name='finish' class='finish' value='"+fin+"'>";
			buttons = "<button id='session_sEdit_btn'>Submit</button><button id='session_cancel_btn'>Cancel</button><br>"
		}else{
			gameType = game['title'];
		}

		htmlOut += 		"Session Title: "+title+"<br>"+
						"Game Type: "+gameType+"<br>"+
						start+" to "+fin+"<br>"+
						"Number of Players: "+session['numPlay']+"<br>"+
						"Top Zombie: "+session['topZ']+"<br>"+
						"Top Human(s): "+session['topH']+"<br>"+
						buttons;

		return htmlOut;
	}

	/**** actions taken to modify/create sessions ****/
	$("#calendar_container").on("click", "#session_edit", function(){
		var sessionDiv = $(this).parent();
		var parentID = $(this).parent().prop("id").replace("session-","");

		// retrieve the session and then display with edits
		$.ajax({
			type: "post",
			url: SITE_DOMAIN+"/gamesessions/show/"+parentID,
			dataType: "json"
		})
		.done(function(msg){
			$(sessionDiv).html(displaySession(msg.session, msg.games, true));
		});

	});
	$("#calendar_container").on("click", "#session_cancel_btn", function(){
		// cancel button
		getSessions();
	});
	$("#calendar_container").on("click", "#session_sEdit_btn", function(){
		// submit changes button
		var parentID = "#"+$(this).parent().prop("id");
		var id = $(this).parent().prop("id").replace("session-","");
		// extract the data needed to pass to ajax
		var title = $(parentID+" .title").val();
		var gameType = $(parentID+" .gameType").val();
		var start = $(parentID+" .start").val();
		var fin = $(parentID+" .finish").val();

		// Be sure to do some data validation here
		// convert times into unix timestamps
		start = new Date(start);
			start = Date.parse(start)/1000;
		fin = new Date(fin);
			fin = Date.parse(fin)/1000;

		$.ajax({
			type: "post",
			url: SITE_DOMAIN+"/gamesession/edit/"+id,
			dataType: "json",
			data: {title: title, type: gameType, start: start, finish: fin}
		})
		.done(function(msg){
			getSessions(false);
		});

	});
	$("#calendar_container").on("click", "#session_create_btn", function(){
		// The GM wants to create a new infection outbreak. Gather the data now
		var title = $("#new_title").val();
		var gameType = $("#new_gameType").val();
		var start = $("#new_start").val();
		var fin = $("#new_finish").val();

		// Be sure to do some data validation here
		// convert times into unix timestamps
		start = new Date(start);
			start = Date.parse(start)/1000;
		fin = new Date(fin);
			fin = Date.parse(fin)/1000;

		// Send the data up to the server
		$.ajax({
			type: "post",
			url: SITE_DOMAIN+"/gamesession/create",
			dataType: "json",
			data: {title: title, type: gameType, start: start, finish: fin}
		})
		.done(function(msg){
			getSessions(false);
		});
	});
	$("#calendar_container").on("click", "#session_delete_btn", function(){
		// GM wants to delete all the contents from a session
		var parentID = "#"+$(this).parent().prop("id");
		var id = $(this).parent().prop("id").replace("session-", "");

		// Be sure to confirm that they want to delete EVERYTHING relating to that session
		var response = confirm("Deleting this will destroy all player data relating to this session.\n Continue to erase history TimeLord?");
		if(response){
			// They want to erase history. So be it
			$.ajax({
				type: "post",
				url: SITE_DOMAIN+"/gamesession/delete",
				dataType: "json",
				data: {sID: id}
			})
			.done(function(msg){
				getSessions(false);
			});
		}

	});

	/******************************************'
	************ Calendar Section **************
	=============================================*/
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