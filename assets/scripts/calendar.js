/*
 * Programmers: Ben Matson
 * Date Created: November 16, 2015
 * Purpose: handles the calendar view on the main page
*/


$(document).ready(function(){
	// global variables to help with URL
	var SITE_DOMAIN = "http://localhost/index.php/";
	var BASE_DOMAIN = "http://localhost/";

	// Retrieve the current time and date
	var timeStamp = new Date();
	var months = ["January","Feburary", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	displayCalendar(timeStamp.getMonth()+1);
	$("#calendar_header").html(months[timeStamp.getMonth()]);


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