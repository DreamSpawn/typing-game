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
		game_state.escalate_delay -= elapsed;
		if(game_state.escalate_delay < 0){
			game_state.escalate_delay = Settings.escalate_time;
			game_state.word_delay *= 0.95;
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
		}
	
		return hit;
	}
	
	static spawn_word() {
		var new_word;
		if (Settings.random_speed){
			new_word = Word.fromList(Math.random() * 0.01 + 0.01);
		} else {
			new_word = Word.fromList(0.01);
		}
		game_state.words.push(new_word);
		graphics.spawn_word();
	}
	
	static word_crash() {
		for (var i = 0; i < game_state.words.length;) {
			if (game_state.words[i].dist < Settings.crash_clear) {
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
				sound_system.game_over();
			}
		}
		game_state.input = "";
		graphics.ui_update();
	}
	
	static score_word(word) {
		word.calc_score();
		if (game_state.words.length === 0){
			// Spawn 2 new words and reset delay
			Logic.spawn_word();
			game_state.current_delay = 0;

			word.score *= 2; // Bonus score for clearing screen
			game_state.escalate_delay = 0; // Speed up word spawn rate when screen is cleared
			game_state.screen_clears++;
		}
		game_state.score += word.score;
		game_state.scored++;
	}
}






