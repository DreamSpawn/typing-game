"use strict";

class Settings{
  static legal_version = 1;  

  // Loading previously saved settings or use default values at startup
  static load() {
    // Legal settings
    Settings.debug = localStorage.debug === "true" ? true : false;

    // Legal settings
    Settings.legal_accept = parseInt(localStorage.legal_accept) === Settings.legal_version ? true : false;

    // Difficulty settings
    Settings.letter_difficulty = parseInt(localStorage.letter_difficulty) || 0;
    Settings.word_length_max = parseInt(localStorage.word_length_max) || 7;
    Settings.spawn_rate = parseInt(localStorage.spawn_rate) || 4;
    Settings.hitpoints_max = parseInt(localStorage.hitpoints_max) || 3;
    Settings.escalate = localStorage.escalate === "false" ? false : true;
    Settings.random_speed = localStorage.random_speed === "false" ? false : true;
    Settings.difficulty_level = parseInt(localStorage.difficulty_level);
    Settings.crash_clear = 50; // How much (in percent) of the screen is cleared when a word crash
    Settings.base_speed = 7;
    Settings.escalate_time = 5000; // this could possibly be a setting
    
    // Music settings
    Settings.music_menu_enabled = localStorage.music_menu_enabled === "false" ? false : true ;
    Settings.music_game_enabled = localStorage.music_game_enabled === "false" ? false : true ;
    Settings.music_volume = parseInt(localStorage.music_volume);
    Settings.music_volume = isNaN(Settings.music_volume) ? 5 : Settings.music_volume;

    // Sound FX settings
    Settings.sound_enabled = localStorage.sound_enabled === "false" ? false : true;
    Settings.sound_menu_enabled = localStorage.sound_menu_enabled === "false" ? false : true;
    Settings.sound_typing_enabled = localStorage.sound_typing_enabled == "false" ? false : true;
    Settings.sound_volume = parseInt(localStorage.sound_volume);
    Settings.sound_volume = isNaN(Settings.sound_volume) ? 5 : Settings.sound_volume;

    // Visual settings
    Settings.show_input = localStorage.show_input === "false" ? false : true;
  }

  // Accept legal stuff
  static accept_legal() {
    Settings.legal_accept = true;
    localStorage.legal_accept = Settings.legal_version;
  }

  // Save current settings for next visit
  static save_difficulty(){
    if (!Settings.legal_accept) return;

    // Difficulty settings
    localStorage.letter_difficulty = Settings.letter_difficulty;
    localStorage.word_length_max = Settings.word_length_max;
    localStorage.spawn_rate = Settings.spawn_rate;
    localStorage.hitpoints_max = Settings.hitpoints_max;
    localStorage.escalate = Settings.escalate;
    localStorage.random_speed = Settings.random_speed;
    localStorage.difficulty_level = Settings.difficulty_level;
  }

  static save_settings(){
    if (!Settings.legal_accept) return;

    // Music settings
    localStorage.music_menu_enabled = Settings.music_menu_enabled;
    localStorage.music_game_enabled = Settings.music_game_enabled;
    localStorage.music_volume = Settings.music_volume;

    // Sound FX settings
    localStorage.sound_enabled = Settings.sound_enabled;
    localStorage.sound_menu_enabled = Settings.sound_menu_enabled;
    localStorage.sound_typing_enabled = Settings.sound_typing_enabled;
    localStorage.sound_volume = Settings.sound_volume;

    // Visual settings
    localStorage.show_input = Settings.show_input;
  }

  // run whenever we start a new game
  static apply() {
    WordList.letter_difficulty = Settings.letter_difficulty;
    WordList.word_length_max = Settings.word_length_max;
    WordList.update_list();

    Settings.word_delay = 6000 / Settings.spawn_rate;
  }

  //-----------------------------------------------------------------------------
  // Difficulty settings
  //-----------------------------------------------------------------------------
  static set_difficulty(words, length){
    if (words < 0 || words >= WordList.all.length || 
        length < 1 || length > 7) return;

    Settings.letter_difficulty = words != null ? words : Settings.letter_difficulty; 
    Settings.word_length_max = length != null ? length : Settings.word_length_max;
  }

  static set_difficulty_level(level){
    if(level < 1 || level > Difficulty.level.length) return;
    
    Settings.difficulty_level = level;
    Difficulty.level[level - 1].apply();
  }
  //-----------------------------------------------------------------------------
  // Audio settings
  //-----------------------------------------------------------------------------

  //music settings
  static music_menu_toggle(){
    this.music_menu_enabled = !this.music_menu_enabled;
    if (this.music_menu_enabled) {
      sound_system.music_current.play();
    } else {
      sound_system.music_current.pause();
    }
    sound_system.music_menu_enabled = this.music_menu_enabled;
    return this.music_menu_enabled;
  }

  //music settings
  static music_game_toggle(){
    this.music_game_enabled = !this.music_game_enabled;
    sound_system.music_game_enabled = this.music_game_enabled;
    return this.music_game_enabled;
  }

  static music_up(){
    this.music_volume === 10 ? "" : this.music_volume++;
    sound_system.set_music_volume(this.music_volume);
    return this.music_volume;
  }
  static music_down(){
    this.music_volume === 0 ? "" : this.music_volume--;
    sound_system.set_music_volume(this.music_volume);
    return this.music_volume;
  }

  // sound fx general
  static sound_toggle(){
    this.sound_enabled = !this.sound_enabled;
    sound_system.sound_enabled = this.sound_enabled;
    return this.sound_enabled;
  }
  static sound_up(){
    this.sound_volume === 10 ? "" : this.sound_volume++;
    sound_system.set_sound_volume(this.sound_volume);
    return this.sound_volume;
  }
  static sound_down(){
    this.sound_volume === 0 ? "" : this.sound_volume--;
    sound_system.set_sound_volume(this.sound_volume);
    return this.sound_volume;
  }
  
  // special sound settings 
  static typing_toggle(){
    this.sound_typing_enabled = !this.sound_typing_enabled;
    sound_system.sound_typing_enabled = this.sound_typing_enabled;
    return this.sound_typing_enabled;
  }
  static menu_click_toggle(){
    this.sound_menu_enabled = !this.sound_menu_enabled;
    sound_system.sound_menu_enabled = this.sound_menu_enabled;
    return this.sound_menu_enabled;
  }
}

class Difficulty {
  constructor(letters,length,spawn,hitpoints,escalate,speed) {
    this.letter_difficulty = letters || 0; // max 8
    this.word_length_max = length || 7; // min 1
    this.spawn_rate = spawn || 4; // 1 - 10
    this.hitpoints_max = hitpoints || 3; // 1 - 10
    this.escalate = escalate === false ? false : true;
    this.random_speed = speed === false ? false : true;
  }

  apply() {
    Settings.set_difficulty(this.letter_difficulty,this.word_length_max);
    Settings.spawn_rate = this.spawn_rate;
    Settings.hitpoints_max = this.hitpoints_max;
    Settings.escalate = this.escalate;
    Settings.random_speed = this.random_speed;
  }
}

Difficulty.level = [
  new Difficulty(0,1,3,5,false,false),
  new Difficulty(3,1,5,3,true,true),
  new Difficulty(8,1,3,3,true,true),
  new Difficulty(4,3,3,3,true,true),
  new Difficulty(6,4,3,3,true,true),
  new Difficulty(7,5,3,3,true,true),
  new Difficulty(8,5,3,3,true,true),
  new Difficulty(8,6,3,3,true,true),
  new Difficulty(8,7,3,3,true,true),
  new Difficulty(8,7,5,1,true,true),
]