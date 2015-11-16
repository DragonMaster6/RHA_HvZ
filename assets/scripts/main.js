/*
 * Programmers: Ben Matson and Ben Lexa
 * Date Created: November 12, 2015
 * Purpose: Used to handle user interactivity and talk with the server
*/

$(document).ready(function(){
	$("#stats_btn").on("click", function(){
		$("#data_container").html("<h3> This is a test of the Data Display </h3>");
	});
	$("#sList_btn").on("click", function(){
		$("#data_container").html("<h3> This is a test of the Survivor List </h3>");
	});
});