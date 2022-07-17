<?php 
$source = fopen("full_list.txt", "r");
$target[0] = fopen("list_bygh.txt", "w");
$target[1] = fopen("list_wm.txt", "w");
$target[2] = fopen("list_pv.txt", "w");
$target[3] = fopen("list_ci.txt", "w");
$target[4] = fopen("list_ro.txt", "w");
$target[5] = fopen("list_ut.txt", "w");
$target[6] = fopen("list_en.txt", "w");
$target[7] = fopen("list_home_row.txt", "w");
$target[8] = fopen("list_qzx.txt", "w");

$line = "";
while (!feof($source)){
  $word = rtrim(fgets($source));
  $i = 7;
  if(preg_match('/[qzx]/', $word) === 1){
    $i = 8;
  } elseif(preg_match('/[bygh]/', $word) === 1){
      $i = 0;
  } elseif(preg_match('/[wm]/', $word) === 1){
    $i = 1;
  } elseif(preg_match('/[pv]/', $word) === 1){
    $i = 2;
  } elseif(preg_match('/[ci]/', $word) === 1){
    $i = 3;
  } elseif(preg_match('/[ro]/', $word) === 1){
    $i = 4;
  } elseif(preg_match('/[ut]/', $word) === 1){
    $i = 5;
  } elseif(preg_match('/[en]/', $word) === 1){
    $i = 6;
  } else {
    if ($word === "") continue;
  }
  if (ftell($target[$i]) !== 0){
    $word = "\n" . $word;
  }
  echo("word: $word, list:$i <br>" );
  fwrite($target[$i], $word);
}

fclose($source);
for ($i = 0; $i <= 8; $i++){
  fclose($target[$i]);
}
echo("done");
?>