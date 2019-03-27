<?php

  	$db = new PDO('mysql:dbname=twitter-clone;host=localhost','root','');


	if(isset($_POST['bulletinText'])){
		$bulletinText = trim($_POST['bulletinText']);
		$dog_thought_text = $_POST['bulletinText'];
		}

	if(!empty($bulletinText)){

		$addedQuery = $db->prepare("
			INSERT INTO bulletins (
			author,bulletinText,author_id,author_name
			)
			VALUES (:author,:bulletinText,:id,:name)
		");


		$user = "charles";
		$id = 1;
		$fullname="McCharles";

		$addedQuery->execute([
			'author' => $user,
			'bulletinText' => $bulletinText,
			'id' => $id,
			'name' => $fullname
		]);
	}



?>
