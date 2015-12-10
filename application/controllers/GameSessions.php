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
	public function create(){
		// the GM wants to create a new session
		// extract the data from the post
		date_default_timezone_set("America/Denver");
		$session['title'] = $this->input->post('title');
		$session['type'] = $this->input->post('type');
		$session['start'] = date("Y-m-d H:i:s", $this->input->post('start'));
		$session['finish'] = date("Y-m-d H:i:s", $this->input->post('finish'));

		// insert into the database now
		$success = $this->gamesession_model->createSession($session);


		echo json_encode($success);
	}

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

	public function show($sID){
		$data['session'] = $this->gamesession_model->getSession($sID);
		$data['games'] = $this->game_model->getGames();

		echo json_encode($data);
	}

/*=============================
******** UPDATE methods *******
===============================
*/
	public function edit($sID){
		date_default_timezone_set("America/Denver");
		$session['sID'] = $sID;
		$session['title'] = $this->input->post('title');
		$session['type'] = $this->input->post('type');
		$session['start'] = date("Y-m-d H:i:s", $this->input->post('start'));
		$session['finish'] = date("Y-m-d H:i:s", $this->input->post('finish'));

		// find and update that session entry
		$success = $this->gamesession_model->updateSession($session);

		echo json_encode($success);
	}

/*=============================
******** DELETE methods *******
===============================
*/
}