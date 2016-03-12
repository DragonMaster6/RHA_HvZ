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

// ***************
// CREATE methods
// ***************
	// A new user wants to sign up so add them to the database
	public function createPlayer($values){
		// Escape all the values for security purposes
		$email = $this->db->escape($values['email']);
		$fname = $this->db->escape($values['fname']);
		$lname = $this->db->escape($values['lname']);
		$dname = $this->db->escape($values['dname']);
		$pass = $this->db->escape($values['pass']);
		$gender = $this->db->escape($values['gender']);
		$result["success"] = "";		// assume failure

		// First check to make sure that there isn't another player with the same dname
		$dquery = $this->db->query("select dname from players where BINARY dname=".$dname);	
		// Same goes for email
		$equery = $this->db->query("select email from players where BINARY email=".$email);
		$isDisplayName = $dquery->result_array();
		$isEmail = $equery->result_array();

		if(empty($isDisplayName) && empty($isEmail)){
			// Submit the query
			$result["success"] = $dname." has successfully joined the survival legion. Login to continue";
			$query = $this->db->query("insert into players (fname,lname,dname,email,pass,gender
										) values (
										".$fname.",
										".$lname.",
										".$dname.",
										".$email.",
										".$pass.",
										".$gender.");");
			
		}else{
			if(!empty($isDisplayName))
				$result["user_err"] = "Username already in use";
			if(!empty($isEmail))
				$result["email_err"] = "Email already in use";
		}


		return $result;
	}

// *************
// READ methods
// *************
	// Checks inputted credentials against database
	public function usrAuth ($user, $pass)
	{
		$result = -1;	// Default to failed login
		$user = $this->db->escape($user);
		$pass = $this->db->escape($pass);
		// user BINARY to search in case sensitive
		$query = $this->db->query("select pID from players where BINARY dname =".$user. "and BINARY pass =".$pass);
		$auth_result = $query->result_array();

		if (!empty($auth_result))
		{
			// The credentials match - return the player ID
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

// ***************
// UPATE methods
// ***************
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

// *****************
// DELETE methods
// *****************

	public function deleteProfile($pID){
		$query = $this->db->query("delete from players where pID=".$pID);
		return $query;
	}
}