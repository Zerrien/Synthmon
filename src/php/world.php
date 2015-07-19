<?php
	header('Content-Type:text/plain');

	$world = file_get_contents("../json/theworld.json");
	$world = json_decode($world, true);

	if(isset($_GET['set']) && isset($_GET['data'])) {
		$depth = explode(":", $_GET['set']);
		$chunk = json_decode($_GET['data'], true);
		for($i = count($depth) - 1; $i >= 0; $i--) {
			$chunk = array($depth[$i] => $chunk);
		}
		//print_r($chunk);
		//$world = array_replace_recursive($world, $chunk);
		//$world['chunks']['1,0']
		$world['chunks'][$depth[1]] = $chunk['chunks'][$depth[1]];
		//print_r(json_encode($chunk['chunks'][$depth[1]]));
	} else {
		print_r($world);
	}

	
	$fHandle = fopen("../json/theworld.json", 'w') or die("Can't open file.");
	fwrite($fHandle, json_encode($world, JSON_PRETTY_PRINT));
	fClose($fHandle);
	
?>