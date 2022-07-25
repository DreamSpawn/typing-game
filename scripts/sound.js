"use strict";

class SoundManager {
  constructor() {
    this.music_started = false;
    this.music_menu = new Sound("theme/pelle/TypeGame.mp3", true, 0.05);
    this.music_game = new Sound("theme/pelle/TypeGame_trapmix_02.mp3", true, 0.2);

    this.sound_fx = [];
    this.fx_laser = this.add_sound_fx("theme/pelle/laser.wav", false, 0.1);
    this.fx_buzz = this.add_sound_fx("theme/pelle/buzz.wav", false, 0.05);
    this.fx_boom = this.add_sound_fx("theme/pelle/explosion.ogg", false, 0.05);
    this.fx_type = this.add_sound_fx("theme/pelle/type_writer.wav",false,0.1);
    this.fx_menu_click = this.add_sound_fx("theme/pelle/menu_click.wav",false,0.1);

    this.music_current = null;

    this.music_menu_enabled = Settings.music_menu_enabled;
    this.music_game_enabled = Settings.music_game_enabled;
    this.set_music_volume(Settings.music_volume);
    
    this.sound_menu_enabled = Settings.sound_menu_enabled;
    this.sound_enabled = Settings.sound_enabled;
    this.sound_typing_enabled = Settings.sound_typing_enabled;
    this.set_sound_volume(Settings.sound_volume);
  }

  add_sound_fx(src, loop, volume){
    var fx = new Sound(src, loop, volume);
    this.sound_fx.push(fx);
    return fx;
  }
  //----------------------------------------------------------------------------------
  // Music controls
  //----------------------------------------------------------------------------------
  main_menu() {
    if (this.music_current !== null) this.music_current.pause();
    this.music_current = this.music_menu;
    if (this.music_menu_enabled) this.music_current.play();
    this.music_started = true;
  }

  game_start(){
    if (this.music_current !== null) this.music_current.pause();
    this.music_current = this.music_game;
    if (this.music_game_enabled) this.music_current.play();
  }

  game_over(){
    this.main_menu();
  }

  pause(){
    this.main_menu();
  }

  resume() {
    this.music_current.pause();
    this.music_current = this.music_game;
    if (this.music_game_enabled) this.music_current.resume();
  }
  //----------------------------------------------------------------------------------
  // Sound effect triggers
  //----------------------------------------------------------------------------------
  shoot(){
    this.play_sound(this.fx_laser);
    var boom = this.fx_boom;
    setTimeout( function() { sound_system.play_sound(boom)}, 100);
  }

  dud(){
    this.play_sound(this.fx_buzz);
  }

  crash () {
    this.play_sound(this.fx_boom);
  }

  type(){
    if (this.sound_typing_enabled){
      this.play_sound(this.fx_type);
    }
  }

  menu_click(){
    if(this.sound_menu_enabled){
      this.play_sound(this.fx_menu_click);
    }
  }

  play_sound(effect){
    if(this.sound_enabled){
      effect.play();
    }
  }
  //----------------------------------------------------------------------------------
  // Settings functions
  //----------------------------------------------------------------------------------
  set_music_volume(volume){
    this.music_volume = volume;
    this.music_menu.set_volume(volume / 5);
    this.music_game.set_volume(volume / 5);
  }

  set_sound_volume(volume){
    this.sound_volume = volume;
    this.sound_fx.forEach( item => {
      item.set_volume(volume/5);
    });
  }
}
//----------------------------------------------------------------------------------
// Audio element wrapper class
//----------------------------------------------------------------------------------
class Sound {
  constructor(src, loop, volume) {
    this.volume_modifier = volume ? volume : 0.1; 
    this.element = document.createElement("audio");
    this.element.src = src;
    this.element.loop = loop ? true : false;
    this.element.volume = this.volume_modifier;
  }

  set_volume(volume){
    this.element.volume = volume * this.volume_modifier;
  }

  play() {
    this.element.currentTime = 0;
    this.element.play();
  }

  pause(){
    this.element.pause();
  }

  resume() {
    this.element.play();
  }
}

