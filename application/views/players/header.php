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
		echo link_tag("assets/css/main.css");
	?>
	<script src="<?php echo base_url('assets/scripts/jquery-2.1.4.min.js');?>"></script>
	<script src="<?php echo base_url('assets/scripts/main.js');?>"></script>
	<script src="<?php echo base_url('assets/scripts/calendar.js');?>"></script>
</head>

<body>

	<center> <img src="<?php echo base_url('assets/pics/hvz-logo.jpg'); ?>"> </center>
	<div id="menu_container">
	</div>
	