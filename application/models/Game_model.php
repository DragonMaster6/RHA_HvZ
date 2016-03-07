<?php
/*
 * Programmers: Ben Matson and Ben Lexa
<<<<<<< HEAD
 * Date Created: November 16, 2015
 * Purpose: Handles data from the game table in the database
=======
 * Date Created: November 12, 2015
 * Purpose: Retrieves information from the players relation from the database
>>>>>>> origin/master
*/

class game_model extends CI_Model{
	public function __construct(){
		$this->load->database();
	}

// CREATE methods


// READ methods
	public function getGames(){
		// returns a list of all the game types and their rules
		$query = $this->db->query("select * from game");

		return $query->result_array();
	}


// UPDATE methods


// DELETE methods
}