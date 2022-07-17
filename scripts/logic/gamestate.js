class GameState {
  constructor() {
    this.hitpoints_max = 5;
    this.running = false;
    this.active = false;
    this.lost = false;
		this.words = [];
		this.scored_words = [];
		this.crashed_words = [];
  }

  reset(){
		this.input = "";
		this.words = [];
		this.scored_words = [];
		this.crashed_words = [];
    this.score = 0;
    this.typos = 0;
    this.strokes = 0;
    this.scored = 0;
    this.hitpoints_current = this.hitpoints_max;
    this.lost = false;
    this.single_letter_mode = false;
    this.time_played = 0;
    this.screen_clears = 0;
    this.current_delay = 500; // give players ½ a second before the first word
    this.word_delay = Settings.word_delay;
    this.escalate_delay = Settings.escalate_time;
  }
}