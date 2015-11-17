<?php
/*
 * Programmers: Ben Matson and Ben Lexa
 * Date Created: November 12, 2015
 * Purpose: Retrieves information from the players relation from the database
*/

class gamestats_model extends CI_Model{
	public function __construct(){
		$this->load->database();
	}


	// CREATE methods


	//READ methods
	public function getStats ($pID)
	{
		$query = $this->db->query("select hScore, zScore, lastKill from gamestats where pID =".$pID);
		$stats = $query->result_array();
		
	}
	// UPATE methods


	// DELETE methods
}