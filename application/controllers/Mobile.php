<?php
/* Programmer: Ben Matson
 * Date Created: March 5, 2016
 * Purpose: A controller to handle requests from the mobile app
*/

class Mobile extends CI_Controller{
	public function __construct(){
		parent::__construct();		// always call the parent function

		// load any models that the controller may need to use
		$this->load->model("player_model");
	}

// CREATE methods go here


// READ methods go here
	public function login(){
		$username = $this->input->post("username");
		$password = $this->input->post("password");
		$isAuth = $this->player_model->usrAuth($username, $password);

		$data["success"] = $isAuth;
		echo json_encode($data);
	}

// UPDATE methods go here


// DELETE methods go here
}