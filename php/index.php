<?php

file_put_contents('crash.json', ;json_encode($_FILES));
array_walk($_FILES, function ($n, $i) {
	$p = (new DateTime())->getTimestamp().'_'.$i;
	file_put_contents($p.'.json', json_encode($n));
    move_uploaded_file($n['tmp_name'], $p.'.txt');
});
