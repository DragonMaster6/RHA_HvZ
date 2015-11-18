<?php
/*
 * Programmers: Ben Matson and Ben Lexa
 * Date Created: November 16, 2015
 * Purpose: This is the main console for all players and GMs. This is where players can see
 *			current scores, new games, objectives, and change their profile when needed
*/
?>
<input type = "hidden" id = "player" value = "<?php echo $pID;?>">
<input type = "hidden" id = "session" value = "<?php echo $sID;?>">

<div id="stats_container">
	<button id="stats_btn"> Stats </button>
	<button id="sList_btn"> Survivors </button>

	<div id="data_container">
	</div>
</div>

<div id="calendar_container">
	<div id="calendar_header">
	</div>
	<div id="calendar">
	</div>
</div>

<div id="zombie_tool_container">
This is where the kill tool and zombie starve counter will go
</div>
