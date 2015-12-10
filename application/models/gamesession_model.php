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
	public function createSession($session){
		$title = $this->db->escape($session['title']);
		$gameType = $session['type'];
		$start = $this->db->escape($session['start']);
		$finish = $this->db->escape($session['finish']);

		$query = $this->db->query("insert into gamesession (title, gType, dateStart, dateFinish)
														values (".$title.",".$gameType.",".$start.",".$finish.")");

		return $query;
	}


// READ methods
	public function getSessions()
	{	
		$query = $this->db->query("select s.*, COUNT(gs.sID) as numPlay from gamesession s left join gamestats gs on s.sID = gs.sID where dateFinish >= NOW() group by sID order by dateStart");		// Ben Matson Edit: 12/9/15: Gathers more information on the session itself such as # of players playing
		$sessions = $query->result_array();
		
		return $sessions;
	}

	public function getSession($sID){
		// retrieves an individual session
		$query = $this->db->query("select s.*, COUNT(gs.sID) as numPlay from gamesession s left join gamestats gs on s.sID = gs.sID where dateFinish >= NOW() and s.sID=".$sID." group by sID order by dateStart");
		return $query->result_array()[0];
	}

	public function getSessionTitle($sID)
	{
		$query = $this->db->query("select title from gamesession where sID = ".$sID);
		$title = $query->result_array();

		return $title[0]['title'];
	}




// UPDATE methods
	public function updateSession($session){
		$title = $this->db->escape($session['title']);
		$gameType = $session['type'];
		$start = $this->db->escape($session['start']);
		$finish = $this->db->escape($session['finish']);

		$query = $this->db->query("update gamesession set
										title=".$title.",
										gType=".$gameType.",
										dateStart=".$start.",
										dateFinish=".$finish."
										 where sID=".$session['sID']);

		return $query;
	}


// DELETE methods
}