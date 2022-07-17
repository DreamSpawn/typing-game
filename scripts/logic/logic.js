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
		
		this.current_delay -= elapsed;
		if (this.current_delay <= 0) {
			this.current_delay += this.word_delay;
			this.spawn_word();
		}
		for (var i = 0; i < game_state.words.length; i++) {
			if (game_state.words[i].update(elapsed)) {
				this.crash_word(i);
				i--;
			}
		}

		if(!Settings.escalate) return;
		
		this.escalate_delay -= elapsed;
		if(this.escalate_delay < 0){
			this.escalate_delay = this.escalate_time;
			this.word_delay *= 0.95;
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
			this.score_word(index);
		} else {
			game_state.score -= this.penalty;
			game_state.typos++
		}

		if (game_state.words.length === 0){
			this.spawn_word();
			this.current_delay = 0;
			// TODO bonus score for clearing screen
			// TODO increase difficulty after several clears
		}
	
		return hit;
	}
	
	spawn_word() {
		var new_word;
		if (Settings.random_speed){
			new_word = Word.fromList(Math.random() * 0.01 + 0.01);
		} else {
			new_word = Word.fromList(0.01);
		}
		game_state.words.push(new_word);
		graphics.spawn_word();
	}
	
	crash_word(index) {
		var word = game_state.words.splice(index, 1)[0];
		game_state.crashed_words.unshift(word);
		if (game_state.hitpoints_max !== 10) game_state.hitpoints_current--;
		sound_system.crash();
		graphics.crash();
		if (game_state.hitpoints_current < 1){
			game_state.running = false;
			game_state.active = false;
			game_state.lost = true;
			menu.lost();
			sound_system.game_over();
		}
		graphics.ui_update();
	}
	
	score_word(index) {
		var word = game_state.words.splice(index, 1)[0];
		game_state.scored_words.unshift(word);
		game_state.score += word.calc_score();
		game_state.scored++;
	}
}






