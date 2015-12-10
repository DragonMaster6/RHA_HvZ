<?php
/* Programmers: Ben Matson and Ben Lexa
 * Date Created: December 9, 2015
 * Purpose: Directs requests specific to game sessions such as retrieving sessions, creating them, etc
*/

class GameSessions extends CI_Controller{
	public function __construct(){
		parent::__construct();

		// load models here
		$this->load->model("gamesession_model");
		$this->load->model("game_model");

		// load helper classes
		$this->load->helper("url_helper");
	}


/*=============================
******** CREATE methods *******
===============================
*/


/*=============================
******** READ methods *******
===============================
*/
	public function index(){
		// this will display all the gameSessions for the GM
		// Note: this is an ajax request

		$data['sessions'] = $this->gamesession_model->getSessions();
		$data['games'] = $this->game_model->getGames();

		echo json_encode($data);
	}

/*=============================
******** UPDATE methods *******
===============================
*/


/*=============================
******** DELETE methods *******
===============================
*/
}