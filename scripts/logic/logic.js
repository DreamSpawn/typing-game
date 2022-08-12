"use strict";

class Logic {
  constructor() {
    this.penalty = 30;
    this.last_frame = 0;
  }
  
  frame_update() {
    var time = Date.now();
    var elapsed = this.last_frame !== 0 ? time - this.last_frame : 0;
    this.last_frame = time;
  
    if(!game_state.running) return;
    
    game_state.current_delay -= elapsed;
    if (game_state.current_delay <= 0) {
      game_state.current_delay += game_state.word_delay;
      Logic.spawn_word();
    }

    let crash = false;
    for (var i = 0; i < game_state.words.length; i++) {
      if (game_state.words[i].update(elapsed)) {
        crash = true;
      }
    }
    if (crash) Logic.word_crash();

    if(!Settings.escalate) return;
    
    if (crash) {
      // Reduce speed a bit when a word crashes
      game_state.escalate_delay = Settings.escalate_time;
      game_state.base_speed *= 0.90;
      if (game_state.base_speed < Settings.base_speed) {
        game_state.base_speed = Settings.base_speed;
      }
      return;
    }
    
    game_state.escalate_delay -= elapsed;
    if(game_state.escalate_delay < 0){
      game_state.escalate_delay = Settings.escalate_time;
      game_state.base_speed *= 1.05;
      if (game_state.base_speed > Settings.base_speed * 2) {
        game_state.base_speed = Settings.base_speed * 2;
      }
    }
  }
  
  input(letter) {
    game_state.input += letter;
    game_state.strokes++;
  }
  
  shoot() {
    var hit = false;
    var eta = Number.MAX_VALUE;
    var index = null;
    for (var i = 0; i < game_state.words.length; i++) {
      var word = game_state.words[i];
      if (word.text === game_state.input) {
        if (eta > word.eta()){
          eta = word.eta();
          index = i;
          hit = true;
        }
      }
    }
  
    game_state.input = "";
  
    if (hit) {
      let word = game_state.words.splice(index, 1)[0];
      Logic.score_word(word);
      graphics.shoot(word);
    } else {
      game_state.score -= this.penalty;
      game_state.typos++
      game_state.bonus_reset();
      if(Settings.escalate) {
        // Reduce word speed a bit when we make a mistake
        game_state.escalate_delay = Settings.escalate_time;
        game_state.base_speed *= 0.95;
        if (game_state.base_speed < Settings.base_speed) {
          game_state.base_speed = Settings.base_speed;
        }
      }
    }
  
    return hit;
  }
  
  static spawn_word(count) {
    count = count ?? 1; // Default count 1
    var pos = Math.random() * 100; // Position between 0-100
    var speed = game_state.base_speed;
    for (var i = 0; i < count; i++) {
      var extra_speed = Settings.random_speed ? Math.random() * speed : 0; 
      pos = (pos + i * 100/count) % 100; // Spread out simultaneously spawned words evenly

      var new_word = Word.fromList(speed + extra_speed, pos); // Generate word
      game_state.words.push(new_word); // Add word to active words
      graphics.prepare_word(new_word); // Do some calculations needed for drawing the word on screen
    }
  }
  
  static word_crash() {
    for (var i = 0; i < game_state.words.length;) {
      if (game_state.words[i].dist_p() < Settings.crash_clear) {
        let word = game_state.words.splice(i, 1)[0];
        graphics.crash(word);
      } else {
        i++;
      }
    }
    sound_system.crash();
    if (game_state.hitpoints_max !== 10) {
      game_state.hitpoints_current--;
      if (game_state.hitpoints_current < 0){
        game_state.running = false;
        game_state.active = false;
        game_state.lost = true;
        menu.lost();
      }
    }
    game_state.input = "";
    game_state.bonus_reset();
    graphics.ui_update();
  }
  
  static score_word(word) {
    word.calc_score();
    if (game_state.words.length === 0){
      // Spawn 2 new words and reset delay
      Logic.spawn_word(2);
      game_state.current_delay += game_state.word_delay;
      //game_state.current_delay = 0;

      word.score *= 2; // Bonus score for clearing screen
      game_state.escalate_delay = 0; // increase word speed when screen is cleared
      game_state.screen_clears++;
    }
    game_state.score += word.score;
    game_state.scored++;
    game_state.bonus_up();
  }
}






