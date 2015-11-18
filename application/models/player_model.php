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

	// UPATE methods


	// DELETE methods
}