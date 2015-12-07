<?php
/* Programmers: Ben Matson and Ben Lexa
 * Date Created: November 12, 2015
 * Purpose: Direct user actions to appropriate methods and prepare the proper data to be displayed to the user
 			This deals with users wanting to sign up, login, and display their stats
*/

class Players extends CI_Controller{
	public function __construct(){
		parent::__construct();
		// Load any models that this controller may need to use
		$this->load->model("player_model");
		$this->load->model("game_model");
		$this->load->model("gamesession_model");
		$this->load->model("gamestats_model");

		// Load any helper classes
		$this->load->helper("url_helper");

		// Load any library classes
		$this->load->library("session");
	}

// CREATE methods go here
	// sign up method to create a new player account
	public function signup(){
		// retrieve all the values
		$player['fname'] = $this->input->post('fname');
		$player['lname'] = $this->input->post('lname');
		$player['dname'] = $this->input->post('dname');
		$player['pass'] = $this->input->post('pass');
		$player['gender'] = $this->input->post('gender');

		$data['message'] = $this->player_model->createPlayer($player);

		echo json_encode($data);
	}

	public function join()
	{
		$sID = $this->input->post("sID");
		$pID = $this->input->post("pID");
		$title = $this->gamesession_model->getSessionTitle($sID);
		$currentBadges = $this->gamestats_model->getBadges();
		$success = $this->gamestats_model->joinSession($sID, $pID, $title, $currentBadges);

		$data['attempt'] = $success;
		echo json_encode($data);
	}

// READ methods go here

	// Main screen for the user - displays current game play
	public function index(){
		// Render appropriate view
		// to a logic switch. If the user is not signed in, automatically display the login page
		if(isset($_SESSION['pID'])){
			// set any global variables for this particular view
			$data["pID"] = $_SESSION["pID"];
			$data["sID"] = $this->gamestats_model->getCurrentSession($_SESSION['pID']);		// returns the current session that the player is in

			// Check to make sure if the player is a zombie that they haven't starved
			// (NOTE: We will need to check the game type later to see if starvation is allowed)
			if($data['sID'] != -1){
				$data["inGame"] = $this->gamestats_model->inGame($data["sID"], $data["pID"]);
				$data["isZombie"] = $this->gamestats_model->isZombie($data["sID"], $data["pID"]);
				if($data["isZombie"]){
					$data["starve_count"] = $this->gamestats_model->getStats($data["sID"], $data["pID"])["lastKill"];
				}
			}else{
				$data["isZombie"] = 0;
			}

			//$data["stats"] = $this->gamestats_model->getStats(1, $pID);
			$this->load->view("players/header");
			$this->load->view("players/index", $data);
			$this->load->view("players/footer");
		}else{
			redirect('players/start');
		}
	}

	// This gets a player's profile such as email, username, password, etc
	public function show($pID){
		$data["playerInfo"] = $this->player_model->getProfile($pID);
		echo json_encode($data);
	}

	// Main login screen for users not currently authenticated
	public function start(){
		$data["error"] = $this->session->userdata('error');
		unset($_SESSION['error']);

		// Render views here
		$this->load->view("players/login_header");
		$this->load->view("players/login", $data);
		$this->load->view("players/footer");
	}

	// this will handle the login transaction
	public function login(){
		$username = $this->input->post("username");
		$password = $this->input->post("password"); 
		$isAuth = $this->player_model->usrAuth($username, $password);

		//render appropriate views based on user authentication
		if($isAuth != -1)
		{
			$_SESSION["pID"] = $isAuth;
			redirect('players/index');
		}
		else
		{
			$_SESSION["error"] = "Invalid Username or Password";
			redirect("players/start");
		}


	}

	// this will handle the logout transaction
	public function logout(){
		$_SESSION['pID'] = null;
		redirect('players/start');
		
	}

	public function playerStats()
	{
		$sID = $this->input->post('sID');
		$pID = $this->input->post('pID');
		$data["stats"] = $this->gamestats_model->getStats($sID, $pID);
		//$data["playerInfo"] = $this->player_model->getPlayerStats($pID);
		echo json_encode($data);
	}


	// This retrieves current players in a given session from AJAX and sorts them depending on their game status
	public function listSurvivors()
	{
		$sID = $this->input->post('sID');
		$playerList = $this->gamestats_model->getPlayers($sID);
		$data["survivors"] = [];
		$data["zombies"] = [];
		$data["departed"] = [];
		// Set the default timezone to the mountain time zone
		date_default_timezone_set("America/Denver");
		$currentDateTime = strtotime(date("Y-m-d H:i:s"));
		$starveLimit = 172800;

		foreach ($playerList as $player)
		{
			if ($player['hScore'] != NULL)
			{
				if ($currentDateTime - (strtotime($player['lastKill'])) > $starveLimit)
				{
					array_push($data["departed"], $player);
				}
				else
				{
					array_push($data["zombies"], $player);
				}
				
			}
			else
			{
				array_push($data["survivors"], $player);
			}

		}
		echo json_encode($data);

	}

	//This retrieves ongoing game sessions and alerts
	public function getAlerts()
	{
		$pID = $this->input->post('pID');
		$sID = $this->input->post('sID');

		$playerSessions = $this->gamestats_model->getJoinedSessions($pID);
		$sessions = $this->gamesession_model->getSessions();
		$data["sessionsJoined"] = [];
		$data["sessions"] = [];
		$data["alerts"] = "";

		foreach($sessions as $session){
			$found = false;
			foreach($playerSessions as $pSession){
				if($pSession['sID'] == $session['sID']){
					array_push($data['sessionsJoined'], $session);
					$found = true;
					break;
				}
			}

			// determine if a player joined the session or not
			if(!$found){
				array_push($data["sessions"],$session);
			}
		}


		echo json_encode($data);	
	}

// UPDATE methods go here

// DELETE methods go here

	public function leave()
	{
		$sID = $this->input->post("sID");
		$pID = $this->input->post("pID");
		$title = $this->gamesession_model->getSessionTitle($sID);
		$success = $this->gamestats_model->leaveSession($sID, $pID, $title);

		$data['attempt'] = $success;
		echo json_encode($data);
	}
}