"use strict";
var fps = 60;
var graphics, logic, game_state, menu, sound_system;

//----------------------------------------------------------------------------------
// Entry point starting when the page has been loaded
//----------------------------------------------------------------------------------
$(document).ready(function(){
  WordList.load_all();
  Settings.load();

  game_state = new GameState();
  logic = new Logic();
  sound_system = new SoundManager();

  graphics = new Graphics();
  graphics.ui_update();

  menu = new Menu();
  Settings.apply();

  $(window).keydown(input_first);
  $(window).click(input_first);
  $(window).resize(() => { graphics.resize() } );
  $(document).bind(
  	'msfullscreenchange webkitfullscreenchange mozfullscreenchange fullscreenchange', 
  	() => {graphics.fullscreen_change(); }
  );
  setInterval(frame_update, 1000/fps);
});
//----------------------------------------------------------------------------------
// This is where we update and draw each frame
//----------------------------------------------------------------------------------
function frame_update (){
  logic.frame_update();
  graphics.draw();
  if (Settings.debug) {
  	Debug.draw();
  }
}
//----------------------------------------------------------------------------------
// Handling keyboard input
//----------------------------------------------------------------------------------
function input_first(event) {
  $(window).off("keydown");
  $(window).off("click");
  $(window).keydown(input);
  if (event.type === "keydown") input(event);
  if(menu.on_main) sound_system.main_menu();
}
function input(event) {
  var k = event.key.toLowerCase();
  
  //console.log("onKey():" + k);
  if (k === " " || k === "enter"){
  	if (game_state.running){
  		if (game_state.input === "") return;
  		if (logic.shoot()) {
  			sound_system.shoot();
  		} else {
  			sound_system.dud();
  		}
  	} else {
  		menu.perform();
  	}
  	event.preventDefault();
  } else if (k === "f10" || k === "pause" || k === "escape" ){
  	if (game_state.running){
  		menu.pause();
  		sound_system.pause();
  	} else if (k === "escape") {
  		menu.back();
  	} else if (game_state.active){
  		menu.resume();
  	}
  	event.preventDefault();
  }	else if (k.match(/\w/) && k === k.match(/\w/)[0] && game_state.running){
  	logic.input(k);
  	if (game_state.single_letter_mode){
  	  if (logic.shoot()) {
  			sound_system.shoot();
  		} else {
  			sound_system.dud();
  		}
  	} else {
  		sound_system.type();
  	}
  	event.preventDefault();
  } else if (!game_state.running) {
  	if (k === "arrowup" || k === "k") {
  		menu.up();
  		sound_system.menu_click();
      event.preventDefault();
  	} else if (k === "arrowdown" || k === "j") {
  		menu.down();
  		sound_system.menu_click();
      event.preventDefault();
  	}	else if (k === "arrowleft" || k === "h") {
  		menu.left();
      event.preventDefault();
  	}	else if (k === "arrowright" || k === "l") {
  		menu.right();
      event.preventDefault();
  	}
  }
  graphics.ui_update();
};