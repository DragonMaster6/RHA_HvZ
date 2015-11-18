<?php
/*
 * Programmers: Ben Matson and Ben Lexa
<<<<<<< HEAD
 * Date Created: November 16, 2015
 * Purpose: Retrieves data from the gamesession table in the database
=======
 * Date Created: November 12, 2015
 * Purpose: Retrieves information from the players relation from the database
>>>>>>> origin/master
*/

class gamesession_model extends CI_Model{
	public function __construct(){
		$this->load->database();
	}

// CREATE methods


// READ methods
	public function getCurrentSession()
	{	$result = -1;
		$query = $this->db->query("select sID from gamesession where dateStart <= NOW() and dateFinish >= NOW()");
		$sID = $query->result_array();
		if (!empty($sID))
		{
			$result = $sID[0]["sID"];
		}
		return $result;
	}
// UPDATE methods


// DELETE methods
}