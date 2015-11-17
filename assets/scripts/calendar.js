/*
 * Programmers: Ben Matson
 * Date Created: November 16, 2015
 * Purpose: handles the calendar view on the main page
*/


$(document).ready(function(){
	$("#calendar_container").html(displayCalendar(1));

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
				for(var i = 1; i < 32; i++){
					calendar += "<div id='day-"+i+"' class='day'>"+i+"</div>";
					if(i%7 == 0){
						calendar += "<br>";
					}
				}
				break;
			default:
				break;
		}

		return calendar;
	}
});