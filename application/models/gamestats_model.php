<?php
/*
 * Programmers: Ben Matson and Ben Lexa
<<<<<<< HEAD
 * Date Created: November 16, 2015
 * Purpose: Retrieves game stats data from the database
=======
 * Date Created: November 12, 2015
 * Purpose: Retrieves information from the players relation from the database
>>>>>>> origin/master
*/

class gamestats_model extends CI_Model{
	public function __construct(){
		$this->load->database();
	}

// CREATE methods


// READ methods
	// Ben Matson 11/16: Note that you might need the $sID to pick the correct game other wise you will get a lot of tuples since the player has played many games
	public function getStats ($pID)
	{
		$query = $this->db->query("select hScore, zScore, lastKill from gamestats where pID =".$pID);
		$stats = $query->result_array();
		
	}

// UPDATE methods


// DELETE methods

}