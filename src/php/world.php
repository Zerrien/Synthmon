<?php
	header('Content-Type:text/plain');

	$world = file_get_contents("../json/theworld.json");
	$world = json_decode($world, true);

	if(isset($_GET['set']) && isset($_GET['data'])) {
		$chunk = $_GET['set'];
		$data = json_decode($_GET['data'], true);
		if(isset($world['chunks'][$chunk]['objects'][key($data)])) {
			if($data[key($data)] == null) {
				unset($world['chunks'][$chunk]['objects'][key($data)]);
				echo("Removed object with ID: ".key($data));
			} else {
				$world['chunks'][$chunk]['objects'][key($data)] = $data[key($data)];
				echo("Updated object with ID: ".key($data));
			}
		} else {
			$world['chunks'][$chunk]['objects'][key($data)] = $data[key($data)];
			echo("Added object with ID: ".key($data));
		}
	} else {
		echo("No Set/Data included.");
	}
	
	$fHandle = fopen("../json/theworld.json", 'w') or die("Can't open file.");
	fwrite($fHandle, json_encode($world, JSON_PRETTY_PRINT));
	fClose($fHandle);
	
?>