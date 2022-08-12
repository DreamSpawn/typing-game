class Debug {
  static font_color = "red";
  static font_size = 24;
  static font = "bold " + Debug.font_size + "px Courier";

  static debug_ctx 

  static init() {
    this.debug_ctx = $("#debug_canvas")[0].getContext("2d");
  }

  static println(text) {
    let context = Debug.debug_ctx;

    context.fillText(text, 0, 0);
    context.translate(0, Debug.font_size * 1.1);
  }

  static draw(){
    let context = Debug.debug_ctx;
    context.setTransform(1, 0, 0, 1, 0, 0);

    var width = context.canvas.width;
    var height = context.canvas.height;
    context.clearRect(0, 0, width, height);

    context.fillStyle = Debug.font_color;
    context.font = Debug.font;
    context.textAlign = "left";
    context.translate(0, Debug.font_size);

    Debug.println("Debug");
    Debug.println("Escalate time: " + game_state.escalate_delay);
    Debug.println("Word delay: " + game_state.word_delay);
    Debug.println("Word speed: " + game_state.base_speed);


    // if (menu.current.sub_text) {
    //   context.font = "bold " + font_size_small + "px Courier";
    //   if (menu.current.text_allign) {
    //     context.textAlign = menu.current.text_allign;
    //     if (context.textAlign === "left"){
    //       offset_x = -480;
    //     }
    //     context.translate(offset_x, 0);
    //   }
    //   if (Array.isArray(menu.current.sub_text)){
    //     menu.current.sub_text.forEach(item => {
    //       context.fillText(item, 0, 0);
    //       context.translate(0, font_size_small);
    //     });
    //   } else {
    //     context.fillText(menu.current.sub_text, 0, 0);
    //     context.translate(0, font_size_small);
    //   }
    //   context.font = "bold " + Debug.font_size + "px Courier";
    // }
    // context.textAlign = "center";
    // context.translate(-offset_x, Debug.font_size);

    // menu.current.sub_menu.forEach((item, index) => {
    //   var arrow_left = "";
    //   var arrow_right = "";
    //   if (index === menu.selected){
    //     arrow_left = "► ";
    //     arrow_right = " ◄"
    //   } 
    //   if (item.value !== null) {
    //     context.textAlign = "right";
    //     context.fillText(arrow_left + item.label, -20, 0);
    //     context.textAlign = "left";
    //     context.fillText(item.value + arrow_right, 20, 0);
    //     context.textAlign = "center";
    //   } else {
    //     context.fillText(arrow_left + item.label + arrow_right, 0, 0);
    //   }
    //   context.translate(0, Debug.font_size);
    // });
    // if (menu.current.parent !== null){
    //   if (menu.selected === menu.current.sub_menu.length){
    //     context.fillText("► Back ◄", 0, 0);
    //   } else {
    //     context.fillText("Back", 0, 0);
    //   }
    //   context.translate(0, Debug.font_size);
    // }
   
    // var padding = font_size_small*0.1;
    // context.font = "bold " + font_size_small + "px Courier";
    // context.textAlign = "left";
    // context.translate(-420, 0);
    // context.translate(0, font_size_small + padding);
    // context.fillText("Use up/down arrow keys or k/j to navigate menu", 0, 0);
    // context.translate(0, font_size_small + padding);
    // context.fillText("Use left/right arrow or h/l to change values", 0, 0);
    // context.translate(0, font_size_small + padding);
    // context.fillText("Press spacebar to activate", 0, 0);
    // context.translate(0, font_size_small + padding);
    // context.fillText("Press F10 or Escape to pause game at any point", 0, 0);

  }
}