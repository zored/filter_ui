<?php
array_walk($_FILES, function ($n) {
    move_uploaded_file($n['tmp_name'], getcwd() . DIRECTORY_SEPARATOR . (new DateTime())->getTimestamp());
});
