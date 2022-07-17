"use strict";
/*
graphics_word.js
@author Mikkel Westh

Containing graphics functions specifically related to drawing words and word
boxes on screen.
*/

//----------------------------------------------------------------------------------
// Calculating and saving word position of a shot word
//----------------------------------------------------------------------------------
Graphics.prototype.shoot = function (word) {
  this.scored_words.push(word);
  word.time = Date.now();

  word.y = this.word_bottom_y / 100 * (100 - word.dist) + 1 + this.font_size / 2;
  word.score_width = this.main_ctx.measureText("" + word.score).width;
  this.gun_angle = Math.atan2(this.gun_y - word.y, this.gun_x - word.x) - Math.PI / 2;
}
//----------------------------------------------------------------------------------
// Calculating and saving word position of crashed words
//----------------------------------------------------------------------------------
Graphics.prototype.crash = function (word) {
  this.crashed_words.push(word);

  word.time = Date.now();
  word.y = this.word_bottom_y / 100 * (100 - word.dist) + 1 + this.font_size / 2;
}
//----------------------------------------------------------------------------------
// Calculating and saving word horizontal position
//----------------------------------------------------------------------------------
Graphics.prototype.spawn_word = function () {
  var word = game_state.words[game_state.words.length - 1];
  this.word_calc_horizontal(word);
}

Graphics.prototype.word_calc_horizontal = function (word) {
  word.width = this.main_ctx.measureText(word.text).width+this.font_padding_w*2;
  word.width_legs = word.width + 2 * this.img_legs.width;
  word.left = (this.main.width-word.width - this.img_legs.width*2 -2)/100*word.pos + this.img_legs.width + 1;
  word.x = word.left + word.width/2;
  word.right = word.left + word.width;
}
//----------------------------------------------------------------------------------
// Drawing box with input text
//----------------------------------------------------------------------------------
Graphics.prototype.draw_input = function(){
  if (!game_state.input) return;
  var width = this.ui_ctx.measureText(game_state.input).width+this.font_padding_w*2;
  var left = this.main.width/2-width/2;

  this.word_box(
    game_state.input,
    left,
    this.input_top,
    width,"green",
    this.ui_ctx,
    this.word_height * this.scale_h
  );
}
//----------------------------------------------------------------------------------
// Drawing incomming words on screen
//----------------------------------------------------------------------------------
Graphics.prototype.draw_words = function(){
  game_state.words.forEach(this.draw_single_word,this);
  this.scored_words.forEach(this.draw_scored_word,this);
  this.crashed_words.forEach(this.draw_dead_word,this);
}

Graphics.prototype.draw_single_word = function(word){
  var top = this.word_bottom_y/100*(100-word.dist) + 1 - this.font_padding_h;
  var center_y = top + this.word_height/2;
  var bottom = top + this.word_height;
  
  this.main_ctx.lineWidth = "2";
  var border = parseInt(this.main_ctx.lineWidth);

  var img_mouth = this.img_mouth[Math.floor((word.dist * 0.5) % 2)];
  this.main_ctx.drawImage(img_mouth, word.x-img_mouth.width/2, bottom + border, img_mouth.width, img_mouth.height);

  if ((word.dist * 0.5) % 2 >= 1){
    this.main_ctx.translate(0, center_y+this.img_legs.height/2);
    this.main_ctx.transform(1, 0, 0, -1, 0, 0);
  } else {
    this.main_ctx.translate(0, center_y-this.img_legs.height/2);
  }
  this.main_ctx.drawImage(this.img_legs,word.right+border,0,this.img_legs.width,this.img_legs.height);
  this.main_ctx.translate(word.left - border,0);
  this.main_ctx.transform(-1, 0, 0, 1, 0, 0);
  this.main_ctx.drawImage(this.img_legs,0,0,this.img_legs.width,this.img_legs.height);
  this.main_ctx.setTransform(1, 0, 0, 1, 0, 0);

  this.word_box(word.text, word.left, top, word.width, "red",this.main_ctx);
  if (Settings.show_input && word.text.startsWith(game_state.input)) {
    this.main_ctx.fillStyle="#ff4d4d";
    this.main_ctx.fillText(game_state.input,word.left+this.font_padding_w,top+this.font_padding_h);
  }
}
//----------------------------------------------------------------------------------
// Utility function for drawing words in a box
//----------------------------------------------------------------------------------
Graphics.prototype.word_box = function(text, left, top, width, color, context, height){
  height = height != null ? height : this.word_height;
  context.beginPath();
  context.fillStyle="#0f0f0f";
  context.strokeStyle=color;
  context.rect(left,top,width,height);
  context.stroke();
  context.fill();
  context.fillStyle=color;
  context.fillText(text,left+this.font_padding_w,top+this.font_padding_h);
}
//----------------------------------------------------------------------------------
// Utility function for drawing word's scoring animations
//----------------------------------------------------------------------------------
Graphics.prototype.draw_scored_word = function(word){
  // draw explosion first
  this.draw_dead_word(word);

  // draw score
  var dead_for = Date.now() - word.time;
  if (dead_for < this.score_time + this.score_fade) {
    var alpha = 0;
    if (dead_for < this.score_time) {
      alpha = 1 - (dead_for - this.score_time) / this.score_fade;
    }
    else {
      alpha = 1;
    }
    var offset_y = dead_for / 1000 * this.score_speed;
    this.main_ctx.fillStyle = "hsl(" + Math.random() * 360 + ", 100%, 50%," + alpha + ")";
    this.main_ctx.fillText("" + word.score,word.x-word.score_width/2,word.y - offset_y);
  }
}
//----------------------------------------------------------------------------------
// Utility function for drawing word's death animations
//----------------------------------------------------------------------------------
Graphics.prototype.draw_dead_word = function(word){
  var dead_for = Date.now() - word.time;

  var width = word.width_legs*2;
  var height = this.word_height_mouth*2;
  
  if(dead_for < this.explosion_time){
    var index = Math.floor(dead_for / this.explosion_time * this.img_explotion.length);
    this.main_ctx.drawImage( 
      this.img_explotion[index],
      word.x - width / 2,
      word.y - height / 2,
      width,
      height
    );
  }
}


