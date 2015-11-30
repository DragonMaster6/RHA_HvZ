<?php
/*
 * Programmers: Ben Matson and Ben Lexa
 * Date Created: November 16, 2015
 * Purpose: Retrieves data from the gamesession table in the database
*/

class gamesession_model extends CI_Model{
	public function __construct(){
		$this->load->database();
	}

// CREATE methods


// READ methods
	public function getSessions()
	{	
		$query = $this->db->query("select * from gamesession where dateFinish >= NOW()");
		$sessions = $query->result_array();
		
		return $sessions;
	}




// UPDATE methods


// DELETE methods
}