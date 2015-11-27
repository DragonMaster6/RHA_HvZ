<?php
/*
 * Programmers: Ben Matson and Ben Lexa
 * Date Created: November 12, 2015
 * Purpose: This is where players and GMs will go to login to their profile
*/
?>
<center>
<div id = "error_container">
	<?php echo $error;?>
</div>
<div id="success_container"></div>

<form action = "<?php echo site_url('players/login');?>" method = "post">
<div id="login_container">
<table>
	<tr>
		<th> Login </th>
	</tr>
	<tr>
		<td> Username: </td>
		<td> <input type="text" name="username" class="login_field"></td>
	</tr>
	<tr>
		<td> Password: </td>
		<td> <input type="password" name="password" class="login_field"></td>
	</tr>
	<tr>
		<td colspan="2"> <button type="button" id="signup_btn" style="float:right" onclick="$('#signup_container').slideToggle('slow')">Sign up</button> <input type = "submit" value = "Play" style="float:right"></td>
	</tr>
	<tr>
		<td colspan="2">
			<div id="signup_container">
				<table>
					<tr>
						<td>First name:</td>
						<td><input type="text" name="fname_in" id="fname_in"></td>
					</tr>
					<tr>
						<td>Last name: </td>
						<td>  <input type="text" name="lname_in" id="lname_in"></td>
					</tr>
					<tr>
						<td>Username: </td>
						<td><input type="text" name="dname_in" id="dname_in"></td>
					</tr>
					<tr>
						<td>Password: </td>
						<td><input type="password" name="pass_in" id="pass_in"></td>
					</tr>
					<tr>
						<td>Reenter: </td>
						<td><input type="password" name="reenter" id="reenter"></td>
					</tr>
					<tr>
						<td>Gender: </td>
						<td>Male <input type="radio" name="gender_in" class="gender_in" value="M"> Female <input type="radio" name="gender_in" class="gender_in" value="F"></td>
					</tr>
					<tr>
						<td colspan="2"><button type="button" id="recruit_btn" style="float:right">RECRUIT</button></td>
					</tr>
				</table>
			</div>
		</td>
		</tr>
</table>
</div>
</form>
</center>