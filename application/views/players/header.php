<?php
/*
 * Programmers: Ben Matson and Ben Lexa
 * Date Created: November 16, 2015
 * Purpose: This template displays the header for the entire site including the banner, css, and scripts
*/
?>
<html>
<head>
	<title> UCCS RHA Humans vs. Zombies Game site </title>
	<?php
		$this->load->helper("html");
		$this->load->model("player_model");
		echo link_tag("assets/css/main.css");
	?>
	<script src="<?php echo base_url('assets/scripts/jquery-2.1.4.min.js');?>"></script>
	<script src="<?php echo base_url('assets/scripts/main.js');?>"></script>
	
</head>

<body>

	<center> <img src="<?php echo base_url('assets/pics/hvz-logo.jpg'); ?>">
	<div id="menu_container">
		<!-- Add create session button here -->
		<?php
			if($this->player_model->isGM($_SESSION['pID'])){
				echo "<button id='sessions_btn'> Sessions </button>";
			}
		?>
		<button id="rulebook_btn">Rule Book</button>
		<button id="contact_btn">Contact GM</button>
		<button id="calendar_btn">Calendar</button>
		<button id="profile_btn">Profile</button>
		<button id="logout_btn" onClick="window.location ='<?php echo site_url('players/logout'); ?>'"> Logout </button>
	</div>
	</center>
	