"use strict";
//----------------------------------------------------------------------------------
// Image sources
//----------------------------------------------------------------------------------
   
// background
var src_background = "theme/pelle/BG.png";
   
// user interface
var src_shield = "theme/pelle/Shield.png";
var src_shield_glow = "theme/pelle/Shield_glow.png";
var src_gunstand = "theme/pelle/Gunstand.png";
var src_gun = "theme/pelle/Gun.png";
var src_hp = "theme/pelle/liv.png";
   
//main
var src_legs = "theme/pelle/Ben.png";
var src_mouth = [
  "theme/pelle/Mund_aaben.png",
  "theme/pelle/Mund_luk.png"
];
var src_explotion = "theme/pelle/explotin5_.png";

//----------------------------------------------------------------------------------
// Graphical settings
//----------------------------------------------------------------------------------
   
// font settings
var font_size = 30;
var font = "bold " + this.font_size + "px Courier";
var font_padding_h = 5;
var font_padding_w = 5;
var word_height = this.font_size + this.font_padding_h * 2;
    
// score and hitpoint placement
var hp_margin_x = 10;
var hp_margin_y = 10;
var hp_padding_x = 5;
var hp_score_margin = 10;

// input placement
var input_margin = 10;
var bottom_margin = 80;
    
class Graphics {
  constructor() {
    //----------------------------------------------------------------------------------
    // Animation times
    //----------------------------------------------------------------------------------
    // laser times
    this.laser_time = 100; // vissible time in milliseconds
    this.laser_fade = 200; // fade time in milliseconds

    // score times
    this.score_time = 500; // vissible time in milliseconds
    this.score_fade = 500; // fade time in milliseconds
    this.score_speed = 50 // pixels per second

    //death animation
    this.explosion_time = 500 // death animation duration in milliseconds
    this.discard_time = Math.min(this.explosion_time, this.score_time+this.score_fade) + 100;
    
    //----------------------------------------------------------------------------------
    // Initialising drawing canvases
    //----------------------------------------------------------------------------------
    this.main = $("#main_canvas")[0];
    this.main_ctx = this.main.getContext("2d");
    this.load_main_images();
   
    this.background = $("#background")[0];
    this.background_ctx = this.background.getContext("2d");
    this.load_backround_images();
   
    this.ui = $("#ui_canvas")[0];
    this.ui_ctx = this.ui.getContext("2d");
    this.load_UI_images();
    this.gun_angle = 0;

    this.debug = $("#debug_canvas")[0];
    this.debug_ctx = this.ui.getContext("2d");

    this.menu = new Graphics_Menu();
    this.is_fullscreen = false;

    // getting initial size of browser window
    this.resize();
  }
  //----------------------------------------------------------------------------------
  // Saving values for resized window and redrawing background and userinterface
  //----------------------------------------------------------------------------------
  resize() {
  /*  // updating canvas sizes
    this.main.width = this.main.clientWidth;
    this.main.height = this.main.clientHeight;
    
    this.background.width = this.background.clientWidth;
    this.background.height = this.background.clientHeight;
    
    this.ui.width = this.ui.clientWidth;
    this.ui.height = this.ui.clientHeight;*/
    var ratio = this.main.clientWidth / this.main.clientHeight;
    var width, height;
    if( ratio < 1){
      width = 1000;
      height = width / ratio;
    } else {
      height = 1000;
      width = height*ratio;
    }

    this.main.width = width;
    this.main.height = height;
    
    this.background.width = width;
    this.background.height = height;
    
    this.ui.width = width;
    this.ui.height = height;
    
    this.debug.width = width;
    this.debug.height = height;

    //----------------------------------------------------------------------------------
    // Graphical settings
    //----------------------------------------------------------------------------------
    // font settings
    this.font_size = 40;
    this.font_style = "bold";
    this.font_name = "Courier";
    this.font = this.font_style + " " + this.font_size + "px " + this.font_name;
    this.font_padding_h = 8;
    this.font_padding_w = 8;
    this.word_height = this.font_size + this.font_padding_h * 2;
    
    // score and hitpoint placement
    this.hp_margin_x = 10;
    this.hp_margin_y = 10;
    this.hp_padding_x = 5;
    this.hp_score_margin = 10;

    this.scale_h = height / 1000;

    // input placement
    this.input_placement = height * 0.07;
    this.word_border_offset = height * 0.15
    
    this.main_ctx.font = this.font;
    this.main_ctx.textAlign = "left";
    this.main_ctx.textBaseline = "top";

    this.ui_ctx.font = this.font_style + " " + this.font_size*this.scale_h + "px " + this.font_name;
    this.ui_ctx.textAlign = "left";
    this.ui_ctx.textBaseline = "top";

    this.word_border = this.main.height - this.word_border_offset;
    this.input_top =  this.main.height - this.input_placement;
    
    this.word_bottom_y = this.word_border - this.font_size - this.font_padding_h - this.img_mouth[0].height - 1;
    this.word_height_mouth = this.word_height + this.img_mouth[0].height;
    
    this.hp_top = this.main.height - ( this.hp_margin_y + this.font_size + this.font_padding_h * 2) * this.scale_h;
    this.score_top = this.hp_top - ( this.hp_score_margin + this.font_size + this.font_padding_h * 2) * this.scale_h;
    
    this.gun_x = this.main.width / 2;
    this.gun_y = this.word_border + this.word_border_offset / 2;
    this.gun_width = this.img_gun.width * this.scale_h;
    this.gun_height = this.img_gun.height * this.scale_h;
    this.gun_stand_width = this.img_gunstand.width * this.scale_h;
    this.gun_stand_height = this.img_gunstand.height * this.scale_h;

    game_state.words.forEach(word => {
      graphics.word_calc_horizontal(word);
    });
    
    this.draw_background();
    this.ui_update();
  }
  //----------------------------------------------------------------------------------
  // Callback for when full screen mode changes
  //----------------------------------------------------------------------------------
  fullscreen_change(){
    this.is_fullscreen = 
      document.fullScreen || 
      document.mozFullScreen || 
      document.webkitIsFullScreen ||
      document.msfullscreen;
      this.ui_update();
  }
  //----------------------------------------------------------------------------------
  // Drawing backround
  //----------------------------------------------------------------------------------
  draw_background() {
    this.background_ctx.drawImage(this.img_backgound, 0, 0, this.background.width*this.scale_h, this.background.height);
    //Draws a line at the word impact point (not needed when using the shield image)
    /*  this.background_ctx.strokeStyle = "white";
    this.background_ctx.moveTo(0, this.word_border);
    this.background_ctx.lineTo(this.background.width, this.word_border);
    this.background_ctx.stroke();*/
  }
  //----------------------------------------------------------------------------------
  // Drawing active game elements
  //----------------------------------------------------------------------------------
  draw() {
    this.main_ctx.clearRect(0, 0, this.main.width, this.main.height);
    // checking if we recently shot a word
    // and drawing laser if needed
    var word = game_state.scored_words[0];
    if (word != null && Date.now() < word.time + this.laser_time + this.laser_fade) {
      var alpha = 0;
      if (Date.now() > word.time + this.laser_time) {
        alpha = 1 - (Date.now() - word.time - this.laser_time) / this.laser_fade;
      }
      else {
        alpha = 1;
      }
      this.main_ctx.lineWidth = "5";
      this.main_ctx.strokeStyle = "rgba(255,0,0," + alpha + ")";
      this.main_ctx.beginPath();
      this.main_ctx.moveTo(this.gun_x, this.gun_y);
      this.main_ctx.lineTo(word.x, word.y);
      this.main_ctx.stroke();
    }
  
    // drawinf words on top of other elements
    this.draw_words();
  
    // cleaning out old words
    var words = game_state.scored_words;
    while (words.length > 0 && words[words.length - 1].time < Date.now() - this.discard_time) {
      words.pop();
    }
  }
  //----------------------------------------------------------------------------------
  // Drawing user interface elements
  //----------------------------------------------------------------------------------
  ui_update() {
    this.ui_ctx.clearRect(0, 0, this.main.width, this.main.height);
  
    this.ui_ctx.globalAlpha= 1 / (game_state.hitpoints_max - 1) * (game_state.hitpoints_current - 1);
    this.ui_ctx.drawImage(this.img_shield, 0, this.word_border, this.background.width, this.img_shield.height);
    this.ui_ctx.drawImage(this.img_shield_glow, 0, this.word_border - this.img_shield_glow.height, this.background.width, this.img_shield_glow.height);
    this.ui_ctx.globalAlpha=1;
    
    // gun
    this.ui_ctx.translate(this.gun_x, this.gun_y);
    this.ui_ctx.rotate(this.gun_angle);
    this.ui_ctx.drawImage(
      this.img_gun,
      -this.gun_width / 2,
      -this.gun_height + this.gun_width / 2,
      this.gun_width,
      this.gun_height
    );
    this.ui_ctx.setTransform(1, 0, 0, 1, 0, 0);
    
    this.ui_ctx.drawImage(
      this.img_gunstand,
      this.background.width / 2 - this.gun_stand_width / 2,
      this.background.height - this.gun_stand_height,
      this.gun_stand_width,
      this.gun_stand_height
    );
    
    // input
    this.ui_ctx.lineWidth = "2";
    this.draw_input();

    if (game_state.hitpoints_max !== 10) {
      // score
      var score_text = "Score : " + (game_state.score || 0);
      var width = this.ui_ctx.measureText(score_text).width+this.font_padding_w*2;
      this.word_box(
        score_text,
        this.hp_margin_x,
        this.score_top,
        width, "yellow",
        this.ui_ctx,
        this.word_height*this.scale_h
      );

    // hitpoints
      width = ((this.img_hp.width + this.hp_padding_x) * game_state.hitpoints_max - this.hp_padding_x + this.font_padding_w*2);
      var height = this.img_hp.height + this.font_padding_h * 2;
      this.word_box("", this.hp_margin_x, this.hp_top, width * this.scale_h, "red", this.ui_ctx, height * this.scale_h);
      for (var i = 0; i < game_state.hitpoints_current;i++){
        this.ui_ctx.drawImage(this.img_hp, 
          this.hp_margin_x + this.font_padding_w + (this.img_hp.width + this.hp_padding_x * this.scale_h) * i, 
          this.hp_top + this.font_padding_h, 
          this.img_hp.width * this.scale_h, 
          this.img_hp.height * this.scale_h
        );
      }
    }

    //draw the menu on top of everything if the game isn't running
    if(!game_state.running){
      document.body.style.cursor = "auto";
      if (menu) this.menu.draw(this.ui_ctx);
    } else {
      document.body.style.cursor = "none";
    }
  }
  //----------------------------------------------------------------------------------
  // loading main images
  //----------------------------------------------------------------------------------
  load_main_images() {
    var tracker = {};
    tracker.count = 0;
    this.img_legs = this.load_image(src_legs, tracker);
    this.img_mouth = [];
    this.img_mouth[0] = this.load_image(src_mouth[0], tracker);
    this.img_mouth[1] = this.load_image(src_mouth[1], tracker);
    this.img_explotion = this.load_animation(src_explotion, 5, tracker);
  }
  //----------------------------------------------------------------------------------
  // loading background images and drawing background when done
  //----------------------------------------------------------------------------------
  load_backround_images() {
    var graphics = this;
    var tracker = {};
    tracker.count = 0;
    tracker.done = function () { graphics.draw_background(); };
    this.img_backgound = this.load_image(src_background, tracker);
  }
  //----------------------------------------------------------------------------------
  // loading user interface images and drawing user interface when done
  //----------------------------------------------------------------------------------
  load_UI_images() {
    var graphics = this;
    var tracker = {};
    tracker.count = 0;
    tracker.done = function () { 
      graphics.resize();
      graphics.ui_update(); 
    };
    this.img_shield = this.load_image(src_shield, tracker);
    this.img_shield_glow = this.load_image(src_shield_glow, tracker);
    this.img_gun = this.load_image(src_gun, tracker);
    this.img_gunstand = this.load_image(src_gunstand, tracker);
    this.img_hp = this.load_image(src_hp, tracker);
  }
  //----------------------------------------------------------------------------------
  // Utility function to load images
  //----------------------------------------------------------------------------------
  load_image(url, tracker) {
    tracker.count++;
    var img = new Image();
    img.onload = function () {
      this.loaded = true;
      tracker.count--;
      if (tracker.count <= 0 & tracker.done != null) {
        tracker.done();
      }
    };
    img.src = url;
    return img;
  }
  //----------------------------------------------------------------------------------
  // Utility function to load images
  //----------------------------------------------------------------------------------
  load_animation(url, frames, tracker){
    var type = url.slice(-4);
    url = url.slice(0,-4);
    var animation = [];
    for (var i = 1; i <= frames; i++ ){
      animation.push(this.load_image(url + ("0" + i).slice(-2) + type, tracker));
    }
    return animation;
  }

  //----------------------------------------------------------------------------------
  // Utility function to toggle full screen
  //----------------------------------------------------------------------------------
  set_fullscreen(fullscreen) {
    var elem = document.documentElement;

    /* View in fullscreen */
    if (fullscreen) {
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.mozRequestFullScreen) { /* Firefox */
        elem.mozRequestFullScreen();
      } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
        elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) { /* IE/Edge */
        elem.msRequestFullscreen();
      }
    } else {
    /* Close fullscreen */
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) { /* Firefox */
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) { /* Chrome, Safari and Opera */
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) { /* IE/Edge */
        document.msExitFullscreen();
      }
    }    
  }

}
