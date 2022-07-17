class Graphics_Menu {
  constructor(){
    this.font_color = "red";

    this.font_size = 40;
    this.font = "bold " + this.font_size + "px Courier";

    this.header_size = 80;
    this.header_font = "bold " + this.header_size + "px Courier";

    this.margin_y = 60;
  }

  draw(context){
    var font_before = context.font;
    var allign_before = context.textAlign;

    var width = context.canvas.width;
    var height = context.canvas.height;

    var font_size_small = this.font_size*0.8;

    context.fillStyle="#000000cf";
    context.rect(0, 0, width, height);
    context.fill();

    context.fillStyle = this.font_color;
    context.font = this.header_font;
    context.textAlign = "center";
    context.translate(width/2, this.margin_y);
    context.fillText(menu.current.header, 0, 0);
    context.translate(0, this.header_size);

    context.font = this.font;
    var offset_x = 0;
    if (menu.current.sub_text) {
      context.font = "bold " + font_size_small + "px Courier";
      if (menu.current.text_allign) {
        context.textAlign = menu.current.text_allign;
        if (context.textAlign === "left"){
          offset_x = -480;
        }
        context.translate(offset_x, 0);
      }
      if (Array.isArray(menu.current.sub_text)){
        menu.current.sub_text.forEach(item => {
          context.fillText(item, 0, 0);
          context.translate(0, font_size_small);
        });
      } else {
        context.fillText(menu.current.sub_text, 0, 0);
        context.translate(0, font_size_small);
      }
      context.font = "bold " + this.font_size + "px Courier";
    }
    context.textAlign = "center";
    context.translate(-offset_x, this.font_size);

    menu.current.sub_menu.forEach((item, index) => {
      var arrow_left = "";
      var arrow_right = "";
      if (index === menu.selected){
        arrow_left = "► ";
        arrow_right = " ◄"
      } 
      if (item.value !== null) {
        context.textAlign = "right";
        context.fillText(arrow_left + item.label, -20, 0);
        context.textAlign = "left";
        context.fillText(item.value + arrow_right, 20, 0);
        context.textAlign = "center";
      } else {
        context.fillText(arrow_left + item.label + arrow_right, 0, 0);
      }
      context.translate(0, this.font_size);
    });
    if (menu.current.parent !== null){
      if (menu.selected === menu.current.sub_menu.length){
        context.fillText("► Back ◄", 0, 0);
      } else {
        context.fillText("Back", 0, 0);
      }
      context.translate(0, this.font_size);
    }
   
    if (!menu.current.hidenav) {
      var padding = font_size_small*0.1;
      context.font = "bold " + font_size_small + "px Courier";
      context.textAlign = "left";
      context.translate(-420, 0);
      context.translate(0, font_size_small + padding);
      context.fillText("Use up/down arrow keys or k/j to navigate menu", 0, 0);
      context.translate(0, font_size_small + padding);
      context.fillText("Use left/right arrow or h/l to change values", 0, 0);
      context.translate(0, font_size_small + padding);
      context.fillText("Press Spacebar or Enter to activate", 0, 0);
      context.translate(0, font_size_small + padding);
      context.fillText("Press F10 or Escape to pause game at any point", 0, 0);
    }

    context.font = font_before;
    context.textAlign = allign_before;
    context.setTransform(1, 0, 0, 1, 0, 0);
  }
}