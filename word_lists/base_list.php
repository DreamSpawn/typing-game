<?php /*
$source = fopen("vocab_exp.txt", "r");
$target = fopen("full_list.txt", "w");

$line = "";
$previous = "";
while (!feof($source)){
  $line = fgets($source);
  $words = array();
  if(preg_match('/^\"([a-z]+)\"/', $line, $words) === 1){
    if (strcmp($words[1] , $previous) === 0) continue;
    //echo($previous . ":" . strcmp($words[1] , $previous) . ":");
    $previous = $words[1];
    echo($words[1] . "<br>");
    fwrite($target, $words[1] . "\n");
  }
}

fclose($source);
fclose($target);*/
echo("This script has been disabled for now");
?>