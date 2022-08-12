class GameState {
  static bonus_steps = 8;
  static bonus_max = 8;

  constructor() {
    this.running = false;
    this.active = false;
    this.lost = false;
    this.words = [];
    this.bonus_reset();
  }

  restart(){
    this.running = true;
    this.active = true;
    this.lost = false;
    this.words = [];

    this.hitpoints_max = Settings.hitpoints_max;
    this.hitpoints_current = this.hitpoints_max;

    this.input = "";
    this.score = 0;
    this.typos = 0;
    this.strokes = 0;
    this.scored = 0;
    this.single_letter_mode = WordList.word_length_max === 1;
    this.time_played = 0;
    this.screen_clears = 0;

    this.current_delay = 500; // give players ½ a second before the first word
    this.escalate_delay = Settings.escalate_time;
    this.base_speed = Settings.base_speed;

    this.bonus_reset();
  }

  bonus_up() {
    if (this.bonus_multi == GameState.bonus_max) return;

    this.bonus_pip ++;
    if (this.bonus_pip == GameState.bonus_steps) {
      this.bonus_multi = this.bonus_multi == 1 ? 2 : this.bonus_multi + 2;

      if (this.bonus_multi != GameState.bonus_max) { // We don't reset pips when at max, to indicate full bonus
        this.bonus_pip = 0;
      }
    }
    let speed_factor = (this.bonus_multi - 1)/(GameState.bonus_max - 1)
    this.word_delay = Settings.word_delay / (1 + speed_factor);
  }

  bonus_reset() {
    this.bonus_multi = 1;
    this.bonus_pip = 0;
    this.word_delay = Settings.word_delay;    
  }
}