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
	//Add a player to a session by creating a game stats entry
	public function joinSession($sID, $pID, $title, $currentBadges)
	{
		$success = 0;
		$returnText = "Successfully joined the ".$title." session";

		$flag = 0;

		$index = 0;

		while(1==1)
		{
			$badge = mt_rand(100000, 999999);
			foreach($currentBadges as $badgeIndex)
			{
				if ($badgeIndex == $badge)
				{
					$flag = 1;
				}
			}
			if ($flag == 0)
			{
				break;
			}
			$flag = 0;
		}

		$query = $this->db->query("insert into gamestats (sID, pID, badge) values (".$sID.",".$pID.",".$badge.");");

		return $returnText;
	}

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
		$query = $this->db->query("select gs.sID from gamestats gs join gamesession s on gs.sID=s.sID where gs.pID=".$this->db->escape($pID)." and s.dateFinish > NOW() and s.dateStart < NOW()");
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

	public function getBadges($sID)
	{
		$query = $this->db->query("select badge from gamestats where sID=".$sID);
		$badges = $query->result_array();

		return $badges;

	}

// UPDATE methods
	public function confirmKill($sID, $pID, $currentBadges, $enteredBadge)
	{
		$flag = 0;
		foreach($currentBadges as $badgeIndex)
		{
			if ($badgeIndex['badge'] == $enteredBadge && $badgeIndex['badge'] != 0)
			{
				$flag = 1;
				break;
			}
		}
		if ($flag == 1)
		{
			$query = $this->db->query("update gamestats set hScore = NOW(), lastKill = NOW(), badge = '0' where badge =".$enteredBadge." and sID=".$sID);
			$query = $this->db->query("update gamestats set zScore=zScore+1, lastKill = NOW() where sID=".$sID." and pID=".$pID);

		}

		return $flag;
	}

// DELETE methods
	public function leaveSession($sID, $pID, $title)
	{
		$success = 0;
		$returnText = "Successfully left the ".$title." session";

		$query = $this->db->query("delete from gamestats where pID=".$pID." and sID=".$sID);

		return $returnText;
	}
	 public function deleteProfile($pID){
	 	$query = $this->db->query("delete from gamestats where pID=".$pID);
	 	return $query;
	 }
}