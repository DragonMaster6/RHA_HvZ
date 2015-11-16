<?php
/*
 * Programmers: Ben Matson and Ben Lexa
 * Date Created: November 12, 2015
 * Purpose: This is where players and GMs will go to login to their profile
*/
?>

<table>
	<tr>
		<th> Login </th>
	</tr>
	<tr>
		<td> Username: </td>
		<td> <input type="text" id="username" class="login_field"></td>
	</tr>
	<tr>
		<td> Password: </td>
		<td> <input type="password" id="password" class="login_field"></td>
	</tr>
	<tr>
		<td> <button id="login_btn"> Play </button> <br>
			<button id="signup_btn"> Sign up</button>
			<div id="signup_container">
				Here is where the sign up form will go<br>
				(Note: this won't be displayed until the user clicks the Sign up button)
			</div>
		</td>
</table>