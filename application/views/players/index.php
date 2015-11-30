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
	<button id="note_btn"> Alerts(num) </button>

	<div id="data_container">
	</div>
</div>

<div id="calendar_container">
	<div id="calendar_header">
	</div>
	<div id="calendar">
	</div>
</div>

<?php
	if($isZombie){
		date_default_timezone_get("America/Denver");
		$current = strtotime(date("Y-m-d H:i:s"));
		$lastK = strtotime($starve_count);
		$starve = 172800 - ($current - $lastK);
		echo "<div id='zombie_tool_container'>";
				if($starve > 0){
					echo "<input type='text' id='killNum'><button id='kill_btn'>Kill</button>";
				}
				echo "<div id='countdown' style='float:right'>".$starve."</div>	
			</div>";
	}
?>
