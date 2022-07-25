<?php
  header("Cache-Control: no-cache, no-store, must-revalidate"); // HTTP 1.1.
  header("Pragma: no-cache"); // HTTP 1.0.
  header("Expires: 0"); // Proxies.

  function addScript($src) { 
    ?>
      <script src="<?=$src?>?v=<?=filemtime(__DIR__."/".$src)?>" type="text/javascript" defer="defer" ></script>
      <!-- <?=__DIR__."/typegame/".$src?> -->
    <?php
  }

?>
<!-- Copyright Mikkel Westh 2022 -->
<!DOCTYPE html>
<html>
<head>
  <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
  <meta http-equiv="Pragma" content="no-cache" />
  <meta http-equiv="Expires" content="0" />
  <meta charset="utf-8">
  <title>TypingGame</title>
  <meta property="og:title" content="Typing Game" />
  <meta property="og:type" content="website" />
  <meta property="og:description" content="A game that runs in your browser for practicing touch typing" />
  <meta property="og:url" content="http://typegame.westh.it" />
  <meta property="og:image" content="http://typegame.westh.it/theme/pelle/screenshot.png" />
  
  <link rel="stylesheet" type="text/css" href="theme/default/style.css">
  <link rel="shortcut icon" href="favicon.ico" type="image/x-icon">
  
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js"></script>

  <?=addScript("scripts/main.js")?>
  <?=addScript("scripts/menu.js")?>
  <?=addScript("scripts/settings.js")?>
  
  <?=addScript("scripts/graphics/graphics.js")?>
  <?=addScript("scripts/graphics/words.js")?>
  <?=addScript("scripts/graphics/menu.js")?>
  
  <?=addScript("scripts/logic/logic.js")?>
  <?=addScript("scripts/logic/words.js")?>
  <?=addScript("scripts/logic/gamestate.js")?>
  
  <?=addScript("scripts/sound.js")?>

  <?=addScript("scripts/graphics/debug.js")?>
</head>

<body>
  <canvas id ="background"></canvas>
  <canvas id ="main_canvas"></canvas>
  <canvas id ="ui_canvas"></canvas>
  <canvas id ="debug_canvas"></canvas>
</body>
</html>