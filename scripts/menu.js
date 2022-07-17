"use strict";

class Menu {
  constructor(){
    this.header_deafult = "Main Menu";
    this.header_lost = "Game Over";
    this.header_pause = "Pause Menu";
    this.menu_initialize();
  }
  //----------------------------------------------------------------------------------
  // Game control functions
  //----------------------------------------------------------------------------------
  new_game() {
    Settings.apply();
    game_state.reset();
    game_state.single_letter_mode = WordList.word_length_max === 1;
    game_state.active = true;
    game_state.running = true;
    sound_system.game_start();
    game_state.last_start = Date.now();
  }

  pause() {
    game_state.running = false;
    game_state.time_played += Date.now() - game_state.last_start;
    this.current = this.pause_menu;
    this.previous_index = [];
  }

  resume() {
    game_state.running = true;
    sound_system.resume();
    game_state.last_start = Date.now();
  }

  lost () {
    game_state.time_played += Date.now() - game_state.last_start;
    this.current = this.main_menu;
    this.main_menu.header = this.header_lost;
    this.previous_index = [];
    // TODO more info here
    var seconds = (game_state.time_played / 1000) % 60;
    var minutes = (game_state.time_played / 60000) % 60;
    this.main_menu.sub_text = [ 
      "",
      "             Time Played: " + Math.floor(minutes) + ":" + ("0" + Math.floor(seconds)).slice(-2),
      "             Final score: " + game_state.score,
      "          Strokes/Minute: " + Math.round(game_state.strokes/minutes),
      game_state.single_letter_mode ? "" : 
      "            Words/Minute: " + Math.round(game_state.scored/minutes),
      "                  Errors: " + game_state.typos
    ];
    this.current.text_allign = "left";
  }
  //----------------------------------------------------------------------------------
  // Menu control functions
  //----------------------------------------------------------------------------------
  perform(){
    if (this.selected === this.current.sub_menu.length){
      this.back();
      return;
    }

    var item = this.current.sub_menu[this.selected]
    if (item.sub_menu !== null) {
      this.current = item;
      this.previous_index.push(this.selected);
      this.selected = 0;
    } else {
      item.perform_action();
    }
  }

  left(){
    if (this.selected === this.current.sub_menu.length){
      return;
    }
    this.current.sub_menu[this.selected].perform_left();
  }

  right(){
    if (this.selected === this.current.sub_menu.length){
      return;
    }
    this.current.sub_menu[this.selected].perform_right();
  }

  back(){
    this.main_menu.header = this.header_deafult;
    this.main_menu.sub_text = null;

    if (this.current.parent === null) {
      if (game_state.active) this.resume();
      return;
    }

    this.selected = this.previous_index.pop();
    this.current = this.current.parent;
    if (this.current === this.pause_menu && !game_state.active){
      this.current = this.main_menu;
    }
  }

  up(){
    do {
      this.select(-1);
    } while (
      this.current.sub_menu[this.selected] &&
      this.current.sub_menu[this.selected].filler === true
    );
  }

  down(){
    do {
      this.select(1);
    } while (
      this.current.sub_menu[this.selected] &&
      this.current.sub_menu[this.selected].filler === true
    );
  }

  select(n){
    if ( this.current.parent !== null) {
      this.selected = (this.selected + n) % (this.current.sub_menu.length + 1);
      this.selected = this.selected < 0 ? this.selected + this.current.sub_menu.length + 1: this.selected;
    } else {
      this.selected = (this.selected + n) % this.current.sub_menu.length;
      this.selected = this.selected < 0 ? this.selected + this.current.sub_menu.length : this.selected;
    }
  }
  //----------------------------------------------------------------------------------
  // Menu builder
  //----------------------------------------------------------------------------------
  menu_initialize(){
    //main menu
    this.main_menu = new MenuItem(this.header_deafult);

    //new game
    var new_game = new MenuItem("New Game");
    new_game.set_action(() => { menu.new_game(); });
    this.main_menu.add_item(new_game);

    //----------------------------------------------------------------------------------
    // Dificulty menu
    //----------------------------------------------------------------------------------
    var difficulty = new MenuItem("Difficulty");
    Object.defineProperty(difficulty, 'sub_text', { get: function() { 
      return game_state.active ? "Changes will be applied to the next game" : null; 
    }});
    Object.defineProperty(difficulty, 'label', { get: function() { 
      var level = Settings.difficulty_level; 
      return level === 0 ? "Difficulty (custom)" : "Difficulty (Level " + level + ")";
    }});
    this.main_menu.add_item(difficulty);

    // preset levels
    var level = new MenuItem("Level");
    level.set_right(() =>{
      Settings.set_difficulty_level(Settings.difficulty_level + 1);
    });
    level.set_left(() =>{
      Settings.set_difficulty_level(Settings.difficulty_level - 1);
    });
    Object.defineProperty(level, 'value', { get: function() { 
      return Settings.difficulty_level || "custom"; 
    }});
    difficulty.add_item(level);

    // Select max word length
    var word_length = new MenuItem("Maximum Word Length");
    word_length.set_right(() =>{
      Settings.set_difficulty(Settings.letter_difficulty, Settings.word_length_max + 1);
      Settings.difficulty_level = 0;
    });
    word_length.set_left(() =>{
      Settings.set_difficulty(Settings.letter_difficulty, Settings.word_length_max - 1);
      Settings.difficulty_level = 0;
    });
    Object.defineProperty(word_length, 'value', { get: function() { 
      return Settings.word_length_max === 7 ? "∞" : Settings.word_length_max; 
    }});
    difficulty.add_item(word_length);

    // Max hitpoints
    var hit_points = new MenuItem("Starting Hitpoints");
    hit_points.set_right(() =>{
      Settings.hitpoints_max = Settings.hitpoints_max === 10 ? 10 : Settings.hitpoints_max + 1;
      Settings.difficulty_level = 0;
    });
    hit_points.set_left(() =>{
      Settings.hitpoints_max = Settings.hitpoints_max === 1 ? 1 : Settings.hitpoints_max - 1;
      Settings.difficulty_level = 0;
    });
    Object.defineProperty(hit_points, 'value', { get: function() { 
      return Settings.hitpoints_max === 10 ? "∞" : Settings.hitpoints_max; 
    }});
    difficulty.add_item(hit_points);

    // Starting spawn rate
    var spawn_rate = new MenuItem("Word Spawn Rate");
    spawn_rate.set_right(() =>{
      Settings.spawn_rate = Settings.spawn_rate === 10 ? 10 : Settings.spawn_rate + 1;
      Settings.difficulty_level = 0;
    });
    spawn_rate.set_left(() =>{
      Settings.spawn_rate = Settings.spawn_rate === 1 ? 1 : Settings.spawn_rate - 1;
      Settings.difficulty_level = 0;
    });
    Object.defineProperty(spawn_rate, 'value', { get: function() { 
      return Settings.spawn_rate;
    }});
    difficulty.add_item(spawn_rate);

    // Escalate spawns over time 
    var escalate = new MenuItem("Escalate Spawn Rate");
    escalate.set_action(() => {
      Settings.escalate = !Settings.escalate;
      Settings.difficulty_level = 0;
    });
    escalate.set_left(escalate.action);
    escalate.set_right(escalate.action);
    Object.defineProperty(escalate, 'value', { get: function() { 
      return Settings.escalate ? "ON" : "OFF" ; 
    }});
    difficulty.add_item(escalate);

    // Escalate spawns over time 
    var random_speed = new MenuItem("Randomize Speed");
    random_speed.set_action(() => {
      Settings.random_speed = !Settings.random_speed;
      Settings.difficulty_level = 0;
    });
    random_speed.set_left(random_speed.action);
    random_speed.set_right(random_speed.action);
    Object.defineProperty(random_speed, 'value', { get: function() { 
      return Settings.random_speed ? "ON" : "OFF" ; 
    }});
    difficulty.add_item(random_speed);

    // Select included letters
    var space = new MenuItem("");
    space.filler = true;
    difficulty.add_item(space);

    var letters_label = new MenuItem("Included Letters:");
    letters_label.filler = true;
    difficulty.add_item(letters_label);

    var letter_difficulty = new MenuItem("");
    Object.defineProperty(letter_difficulty, 'label', { 
      get: function() {
        var letters = "asdfjklenutrocipvwmbyghqzx";
        var value = Settings.letter_difficulty;
        var index = 7;
        if (value <= 6) index += 2*value;
        if (value === 7) index = 23;
        if (value === 8) index = 26;
        return "|> " + letters.slice(0,index) + " <| " + letters.slice(index);
      },
    });
    letter_difficulty.set_right(() =>{
      Settings.set_difficulty(Settings.letter_difficulty + 1);
      Settings.difficulty_level = 0;
    });
    letter_difficulty.set_left(() =>{
      Settings.set_difficulty(Settings.letter_difficulty - 1);
      Settings.difficulty_level = 0;
    });
    difficulty.add_item(letter_difficulty);

    difficulty.add_item(space);

    //----------------------------------------------------------------------------------
    // Save difficulty
    //----------------------------------------------------------------------------------
    var save = new MenuItem("Save Difficulty");
    save.sub_text = [ 
      "This wil save your settings on your computer and", 
      "automatically load them next time you open the game.",
      "Do you accept saving this data on your computer?"
    ];
    difficulty.add_item(save);

    var yes = new MenuItem("I accept");
    yes.set_action(() => { 
      Settings.save_difficulty(); 
      menu.back();
    });
    save.add_item(yes);

    //----------------------------------------------------------------------------------
    // Settings menu
    //----------------------------------------------------------------------------------
    var settings_menu = new MenuItem("Settings");
    this.main_menu.add_item(settings_menu);
    
    //----------------------------------------------------------------------------------
    // Audio settings menu
    //----------------------------------------------------------------------------------
    var audio = new MenuItem("Audio Settings");
    settings_menu.add_item(audio);
    
    //menu clicks toggle
    var menu_sound = new MenuItem("Menu FX Toggle");
    menu_sound.value = Settings.sound_menu_enabled ? "ON" : "OFF";
    menu_sound.set_action(() => {
      if (Settings.menu_click_toggle()) {
        menu_sound.value = "ON";
      } else {
        menu_sound.value = "OFF";
      }
    });
    menu_sound.set_left(menu_sound.action);
    menu_sound.set_right(menu_sound.action);
    audio.add_item(menu_sound);

    //typing clicks toggle
    var typing = new MenuItem("Typing FX Toggle");
    typing.value = Settings.sound_typing_enabled ? "ON" : "OFF";
    typing.set_action(() => {
      if (Settings.typing_toggle()) {
        typing.value = "ON";
      } else {
        typing.value = "OFF";
      }
    });
    typing.set_left(typing.action);
    typing.set_right(typing.action);
    audio.add_item(typing);

    //sound fx toggle
    var sound = new MenuItem("Sound FX Toggle");
    sound.value = Settings.sound_enabled ? "ON" : "OFF";
    sound.set_action(() => {
      if (Settings.sound_toggle()) {
        sound.value = "ON";
      } else {
        sound.value = "OFF";
      }
    });
    sound.set_left(sound.action);
    sound.set_right(sound.action);
    audio.add_item(sound);

    //sound fx volume
    var sound_volume = new MenuItem("Sound FX Volume");
    Object.defineProperty(sound_volume, 'value', { 
      set: function(value) {
        var dashes = "----------";
        this._value = dashes.slice(0,value) + "|" + dashes.slice(value);
        },
      get: function() { 
        return this._value ; 
      }
    });
    sound_volume.set_right(() => {
      sound_volume.value = Settings.sound_up();
      sound_system.crash();
    });
    sound_volume.set_left(() => {
      sound_volume.value = Settings.sound_down();
      sound_system.crash();
    });
    sound_volume.value = Settings.sound_volume;
    audio.add_item(sound_volume);

    //menu music toggle
    var music_menu = new MenuItem("Menu Music Toggle");
    music_menu.value = Settings.music_menu_enabled ? "ON" : "OFF";
    music_menu.set_action(() => {
      if (Settings.music_menu_toggle()) {
        music_menu.value = "ON";
      } else {
        music_menu.value = "OFF";
      }
    });
    music_menu.set_left(music_menu.action);
    music_menu.set_right(music_menu.action);
    audio.add_item(music_menu);

    //game music toggle
    var music_game = new MenuItem("Game Music Toggle");
    music_game.value = Settings.music_game_enabled ? "ON" : "OFF";
    music_game.set_action(() => {
      if (Settings.music_game_toggle()) {
        music_game.value = "ON";
      } else {
        music_game.value = "OFF";
      }
    });
    music_game.set_left(music_game.action);
    music_game.set_right(music_game.action);
    audio.add_item(music_game);

    //music volume
    var music_volume = new MenuItem("Music Volume");
    Object.defineProperty(music_volume, 'value', { 
      set: function(value) {
        var dashes = "----------";
        this._value = dashes.slice(0,value) + "|" + dashes.slice(value);
        },
      get: function() { 
        return this._value ; 
      }
    });
    music_volume.set_right(() => {
      music_volume.value = Settings.music_up();
    });
    music_volume.set_left(() => {
      music_volume.value = Settings.music_down();
    });
    music_volume.value = Settings.music_volume;
    audio.add_item(music_volume);

    //----------------------------------------------------------------------------------
    // Full screen toggle
    //----------------------------------------------------------------------------------
    var fullscreen = new MenuItem("Full Screen:");
    fullscreen.set_action(() => {
        graphics.set_fullscreen(!graphics.is_fullscreen);
    });
    fullscreen.set_left(fullscreen.action);
    fullscreen.set_right(fullscreen.action);
    Object.defineProperty(fullscreen, 'label', { get: function() { 
      return graphics.is_fullscreen ? this.header + " ON" : this.header + " OFF" ; 
    }});
    settings_menu.add_item(fullscreen);

    //----------------------------------------------------------------------------------
    // Input on words toggle
    //----------------------------------------------------------------------------------
    var input_show = new MenuItem("Show input on words:");
    input_show.set_action(() => {
        Settings.show_input = !Settings.show_input;
    });
    input_show.set_left(input_show.action);
    input_show.set_right(input_show.action);
    Object.defineProperty(input_show, 'label', { get: function() { 
      return Settings.show_input ? this.header + " ON" : this.header + " OFF" ; 
    }});
    settings_menu.add_item(input_show);

    //----------------------------------------------------------------------------------
    // Save settings
    //----------------------------------------------------------------------------------
    var save = new MenuItem("Save Settings");
    save.sub_text = [ 
      "This wil save your settings on your computer and", 
      "automatically load them next time you open the game.",
      "Do you accept saving this data on your computer?"
    ];
    settings_menu.add_item(save);

    var yes = new MenuItem("I accept");
    yes.set_action(() => { 
      Settings.save_settings(); 
      menu.back();
    });
    save.add_item(yes);

    //----------------------------------------------------------------------------------
    // Instructions
    //----------------------------------------------------------------------------------
    var instructions = new MenuItem("How to play");
    instructions.sub_text = [
      "", 
      "The word you have typed is shown at the",
      "bottom center of the screen (below the canon).",
      "Once you have typed a word that matches any of",
      "the incoming words, you can \"fire\" it by",
      "pressing either spacebar or enter.",
      "In single letter mode the gun will fire as soon",
      "as you type any letter.",
      "If you fire the canon with a word that doesn't",
      "match any of the incoming words, it will fire a",
      "dud and you lose points.",
      "There is no way to delete characters, so if you",
      "make a typo, the only way to get rid of it, is to",
      "fire the gun.",
      "If a word makes it all the way down to your ",
      "shield, it will crash and cost you one hit point.",
      "Once you run out of hit points the game is over."
    ];
    instructions.text_allign = "left";
    instructions.sub_menu = [];
    this.main_menu.add_item(instructions);

    //----------------------------------------------------------------------------------
    // Credits
    //----------------------------------------------------------------------------------
    var credits = new MenuItem("Credits");
    credits.sub_text = [ 
      "",
      "",
      "                  Art & Music : Pelle Westh",
      "",
      "    Game Design & Programming : Mikkel Westh"
    ];
    credits.text_allign = "left";
    credits.sub_menu = [];
    this.main_menu.add_item(credits);

    //----------------------------------------------------------------------------------
    // Pause Menu
    //----------------------------------------------------------------------------------
    this.pause_menu = new MenuItem(this.header_pause);
    
    var resume = new MenuItem("Resume Game");
    resume.set_action(() => { menu.resume(); });
    this.pause_menu.add_item(resume);
    
    var restart = new MenuItem("Restart Game");
    restart.sub_text = [ "You will loose all progress.", "Are you sure?"];
    this.pause_menu.add_item(restart);
    
    var yes = new MenuItem("Yes");
    yes.set_action(() => { menu.new_game(); });
    restart.add_item(yes);
    
    for (var i = 1; i < this.main_menu.sub_menu.length; i++){
          this.pause_menu.add_item(this.main_menu.sub_menu[i]);
    }

    //----------------------------------------------------------------------------------
    // Setting up initial state
    //----------------------------------------------------------------------------------
    this.current = this.main_menu;
    this.selected = 0;
    this.previous_index = [];
  }
}

//----------------------------------------------------------------------------------
// Class for representing elements of the menu
//----------------------------------------------------------------------------------
class MenuItem {
  constructor(label,sub_menu){
    this.parent = null;
    this.label = label;
    this.header = label;
    this.sub_text = null;
    this.sub_menu = null;
    this.action = null;
    this.left = null;
    this.right = null;
    this.value = null;
  }

  set_action(func){
    this.action = func;
  }

  perform_action() {
    if (this.action instanceof Function){
      this.action();
      sound_system.menu_click();
    }
  }

  set_left(func){
    this.left = func;
  }

  perform_left() {
    if (this.left instanceof Function){
      this.left();
      sound_system.menu_click();
    }
  }

  set_right(func){
    this.right = func;
  }

  perform_right() {
    if (this.right instanceof Function){
      this.right();
      sound_system.menu_click();
    }
  }

  // add an item to the submenu
  add_item(menu_item) {
    if (this.sub_menu === null) {
      this.sub_menu = [];
    }
    menu_item.parent = this;
    this.sub_menu.push(menu_item);
  }
}