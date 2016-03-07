<?php
/*
 * Programmers: Ben Matson and Ben Lexa
 * Date Created: November 12, 2015
 * Purpose: Retrieves information from the players relation from the database
*/

class player_model extends CI_Model{
	public function __construct(){
		$this->load->database();
	}


	// CREATE methods
	// A new user wants to sign up so add them to the database
	public function createPlayer($values){
		// Escape all the values for security purposes
		$fname = $this->db->escape($values['fname']);
		$lname = $this->db->escape($values['lname']);
		$dname = $this->db->escape($values['dname']);
		$pass = $this->db->escape($values['pass']);
		$gender = $this->db->escape($values['gender']);
		$result = $dname." has successfully joined the survival legion. Login to continue";	// assume that there isn't another player with the same dname

		// First check to make sure that there isn't another player with the same dname
		$query = $this->db->query("select dname from players where dname=".$dname);		

		if(empty($query->result_array()[0])){
			// Submit the query
			$query = $this->db->query("insert into players (fname,lname,dname,pass,gender
										) values (
										".$fname.",
										".$lname.",
										".$dname.",
										".$pass.",
										".$gender.");");
		}else{
			$result = "There is already an account with: ".$dname; 
		}


		return $result;
	}


	//READ methods
	public function usrAuth ($user, $pass)
	{
		$result = -1;
		$user = $this->db->escape($user);
		$pass = $this->db->escape($pass);
		$query = $this->db->query("select pID from players where dname =".$user. "and pass =".$pass);
		$auth_result = $query->result_array();
		if (!empty($auth_result))
		{
			$result = $auth_result[0]["pID"];
		}
		return $result;
	}

	public function getPlayerStats($pID)
	{
		$query = $this->db->query("select dname from players where pID =".$pID);
		$dName = $query->result_array();
		if (!empty($dName))
		{
			$result = $dName[0]["dname"];
		}
		return $result;
	}

	public function getProfile($pID){
		$query = $this->db->query("select fname, lname, dname, email, pass, gender, gm, gameCount from players where pID=".$pID);
		return $query->result_array()[0];
	}

	// Tests if the player is a Game moderator
	public function isGM($pID){
		$query = $this->db->query("select gm from players where pID=".$pID);

		return $query->result_array()[0]["gm"];
	}

	// UPATE methods
	public function updateProfile($profile){
		$query = $this->db->query("update players set 
										fname=".$this->db->escape($profile['fname']).",
										lname=".$this->db->escape($profile['lname']).",
										dname=".$this->db->escape($profile['dname']).",
										email=".$this->db->escape($profile['email']).",
										gender=".$this->db->escape($profile['gender'])."
										where pID=".$profile['pID']
								);

		return $query;
	}


	// DELETE methods

	public function deleteProfile($pID){
		$query = $this->db->query("delete from players where pID=".$pID);
		return $query;
	}
}