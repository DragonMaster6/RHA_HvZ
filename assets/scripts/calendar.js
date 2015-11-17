/*
 * Programmers: Ben Matson
 * Date Created: November 16, 2015
 * Purpose: handles the calendar view on the main page
*/


$(document).ready(function(){
	// global variables to help with URL
	var SITE_DOMAIN = "http://localhost/index.php";
	var BASE_DOMAIN = "http://localhost";

	// Retrieve the current time and date
	var timeStamp = new Date();
	var months = ["January","Feburary", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	$("#calendar").html(displayCalendar(timeStamp.getMonth()+1));
	$("#calendar_header").html(months[timeStamp.getMonth()]);


	// This function will retrieve current and future game events from the server based on the current time
	function getGameData(){
		// NOTE: The ajax call should pass in a date parameter for the database to compare to
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

	function displayDay(type){
		// type is the amount of days in a month
		var calendar = "";		// this will hold the html needed to display the calendar view
		var day = timeStamp.getDate();
		for(var i = 1; i < type+1; i++){
			calendar += "<div id='day-"+i+"' class='day'>"+i;

			// has the day already pasted 
			if(i < day){
				calendar += "<img class='done_day' src='"+BASE_DOMAIN+"/assets/pics/blackX.png'>";
			}

			calendar += "</div>";
			if(i%7 == 0){
				calendar += "<br>";
			}
		}

		return calendar;
	}
});