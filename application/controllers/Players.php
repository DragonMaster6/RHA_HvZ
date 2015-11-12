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

		// Load any helper classes
		$this->load->helper("url_helper");

		// Load any library classes
	}

// CREATE methods go here

// READ methods go here

	// Main screen for the user - displays current game play
	public function index(){

		// Render appropriate view
	}

	// Main login screen for users not currently authenticated
	public function start(){

		// Render views here
		$this->load->view("players/header");
		$this->load->view("players/login");
		$this->load->view("players/footer");
	}

// UPDATE methods go here

	// this will handle the login transaction
	public function login(){

	}

	// this will handle the logout transaction
	public function logout(){
		
	}

// DELETE methods go here
}