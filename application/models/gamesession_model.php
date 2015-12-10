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
		$query = $this->db->query("select s.*, COUNT(gs.sID) as numPlay from gamesession s left join gamestats gs on s.sID = gs.sID where dateFinish >= NOW() group by sID order by dateStart");		// Ben Matson Edit: 12/9/15: Gathers more information on the session itself such as # of players playing
		$sessions = $query->result_array();
		
		return $sessions;
	}

	public function getSessionTitle($sID)
	{
		$query = $this->db->query("select title from gamesession where sID = ".$sID);
		$title = $query->result_array();

		return $title[0]['title'];
	}




// UPDATE methods


// DELETE methods
}