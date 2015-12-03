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
	public function getStats ($sID, $pID)
	{
		$query = $this->db->query("select dname, hScore, zScore, lastKill, originalZ from gamestats join players on gamestats.pID = players.pID where gamestats.pID =".$pID." and gamestats.sID =".$sID);
		$stats = $query->result_array();
		return $stats[0];
		
	}

	public function getPlayers($sID)
	{
		$query = $this->db->query("select fname, lname, hScore, lastKill from gamestats join players on gamestats.pID = players.pID where gamestats.sID =".$sID);
		$players = $query->result_array();
		return $players; 
	}

	// retrieves the current session id a player is currently in; -1 otherwise
	public function getCurrentSession($pID){
		$result = -1;		// default to no sessions
		$query = $this->db->query("select sID from gamestats where pID=".$this->db->escape($pID));
		if(!empty($query->result_array()[0])){
			$result = $query->result_array()[0]['sID'];
		}

		return $result;
	}

	// Retrieve all the sessions that the player has joined
	public function getJoinedSessions($pID){
		$result = [];		// possibility the user has not joined a session
		$query = $this->db->query("select s.sID, s.title, s.dateStart, s.dateFinish from gamestats gs join gamesession s on gs.sID=s.sID where gs.pID=".$pID);
		if(!empty($query->result_array())){
			$result = $query->result_array();
		}

		return $result;
	}


	// determines whether or not a player is in the specified game
	public function inGame($sID, $pID, $starve=true){
		date_default_timezone_set("America/Denver");
		$current = strtotime(date("Y-m-d H:i:s"));
		$starveLimit = 172800;
		$result = TRUE;		// default to in game

		// get the player stats
		$query = $this->db->query("select * from gamestats where pID=".$pID." and sID=".$sID);
		$player = $query->result_array()[0];

		// If the player is a zombie, make sure their starve limit hasn't run out
		if($player["hScore"] != NULL){
			if(($current - strtotime($player["lastKill"])) > $starveLimit){
				$result = FALSE;
			}
		}

		return $result;
	}

	// returns if the player is a zombie or a survivor in a current session
	public function isZombie($sID, $pID){
		// get the player stats
		$query = $this->db->query("select * from gamestats where pID=".$pID." and sID=".$sID);
		$player = $query->result_array()[0];

		return ($player["hScore"] != NULL);
	}


// UPDATE methods


// DELETE methods

}