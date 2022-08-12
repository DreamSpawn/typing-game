"use strict";
/*
logic_word.js
@author Mikkel Westh

Containing game logic functions related to the Word class
*/
//----------------------------------------------------------------------------------
// list sources - sorted by word difficulty
//----------------------------------------------------------------------------------
var src_homerow = "word_lists/list_home_row.txt";
var src_en = "word_lists/list_en.txt";
var src_ut = "word_lists/list_ut.txt";
var src_ro = "word_lists/list_ro.txt";
var src_ci = "word_lists/list_ci.txt";
var src_pv = "word_lists/list_pv.txt";
var src_wm = "word_lists/list_wm.txt";
var src_bygh = "word_lists/list_bygh.txt";
var src_qzx = "word_lists/list_qzx.txt";

class Word {
  static max_dist = 100000;

  //----------------------------------------------------------------------------------
  // Contructor
  //----------------------------------------------------------------------------------
  constructor(text, pos, speed) {
    this.text = text;
    this.pos = pos;
    this.speed = speed;
    this.dist = Word.max_dist;
    this.time_allive = 0;
  }
  //-----------------------------------------------------------------------------
  // Updating word position depending on word speed and time passed
  //-----------------------------------------------------------------------------
  update(time) {
    this.time_allive += time;
    this.dist -= this.speed * time;
    return this.dist < 0;
  }
  //-----------------------------------------------------------------------------
  // Calculate time before impact
  //-----------------------------------------------------------------------------
  eta() {
    return this.dist / this.speed;
  }
  //-----------------------------------------------------------------------------
  // Calculate distance in percent
  //-----------------------------------------------------------------------------
  dist_p() {
    return this.dist / Word.max_dist * 100;
  }
  //-----------------------------------------------------------------------------
  // calculate the score of the word
  //-----------------------------------------------------------------------------
  calc_score(){
    this.score = 0;
    var previous = "";
    // calculating base value
    var letters = this.text.split("");
    letters.forEach(letter =>{
      // no score for the same letter twice in a row
      if (letter.localeCompare(previous) === 0) return;
      previous = letter;

      if(letter.match(/[asdfjkl]/) !== null) this.score += 20;
      else if(letter.match(/[en]/) !== null) this.score += 23; 
      else if(letter.match(/[ut]/) !== null) this.score += 24;
      else if(letter.match(/[ro]/) !== null) this.score += 25;
      else if(letter.match(/[ci]/) !== null) this.score += 28;
      else if(letter.match(/[pv]/) !== null) this.score += 29;
      else if(letter.match(/[wm]/) !== null) this.score += 30;
      else if(letter.match(/[bygh]/) !== null) this.score += 31;
      else if(letter.match(/[qzx]/) !== null) this.score += 32;
    });
    // calculating bonuses
    this.score *= 0.9 + this.text.length/10;
    this.score *= 1.5 - game_state.hitpoints_max/10 ;
    this.score *= this.time_allive < 10000 ? 2 - this.time_allive/10000 : 1;
    this.score *= game_state.bonus_multi;
    // rounding down
    this.score = Math.floor(this.score);
  }
  //-----------------------------------------------------------------------------
  // Creating a random word from the previously loaded list
  //-----------------------------------------------------------------------------
  static fromList(speed, pos) {
    if (!WordList.current) return null;

    var list = WordList.current;
    var index = Math.floor(Math.random() * list.length);

    pos = pos ?? Math.random() * 100;
    return new Word(list[index], pos, speed);
  }
}

//-----------------------------------------------------------------------------
// Storage class for words to use in game
//-----------------------------------------------------------------------------
class WordList {
  constructor (name, url) {
    this.name = name;
    this.words = [];
    this.load(url);
  }
  //-----------------------------------------------------------------------------
  // Loading a list of words from the specified url
  //-----------------------------------------------------------------------------
  load(url) {
    var xmlhttp = new XMLHttpRequest();
    var list = this;
    xmlhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        var raw = this.responseText;
        list.words = raw.split("\n"); // split the list using newline as seperator
        WordList.pending--;
        if (WordList.pending === 0) {
          WordList.update_list();
        }
      }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
    WordList.pending = WordList.pending ? WordList.pending + 1 : 1;
  }
  //-----------------------------------------------------------------------------
  // Makes a list of words based on difficulty settings
  //-----------------------------------------------------------------------------
  static update_list() {
    WordList.current = [];
    for(var i = 0; i <= WordList.letter_difficulty; i++) {
      if (WordList.word_length_max === 7){
        WordList.current = WordList.current.concat(WordList.all[i].words);
      } else if (WordList.word_length_max === 1) {
        WordList.current = WordList.current.concat(WordList.all[i].name.split(""));
      } else {
        WordList.all[i].words.forEach(element => {
          if (element.length <= WordList.word_length_max){
            WordList.current.push(element);
          }          
        });
      }
    }
  }
  //-----------------------------------------------------------------------------
  // Load all the lists of words
  //-----------------------------------------------------------------------------
  static load_all(){
    WordList.all = [];
    WordList.all.push(new WordList("asdfjkl", src_homerow));
    WordList.all.push(new WordList("en", src_en));
    WordList.all.push(new WordList("ut", src_ut));
    WordList.all.push(new WordList("ro", src_ro));
    WordList.all.push(new WordList("ci", src_ci));
    WordList.all.push(new WordList("pv", src_pv));
    WordList.all.push(new WordList("wm", src_wm));
    WordList.all.push(new WordList("bygh", src_bygh));
    WordList.all.push(new WordList("qzx", src_qzx));
  }
}

WordList.letter_difficulty = 0;
WordList.word_length_max = 7;

