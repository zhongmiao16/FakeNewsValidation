/*
 * Example plugin template
 */
var jsPsychOperationSpanRecall = (function (jspsych) {
  'use strict';

    // jsPsych.pluginAPI.registerPreload('visual-search-circle', 'target', 'image');
    // jsPsych.pluginAPI.registerPreload('visual-search-circle', 'foil', 'image');
    // jsPsych.pluginAPI.registerPreload('visual-search-circle', 'fixation_image', 'image');
    const info = {
      name: 'operation-span-recall',
      description: '',
      parameters: {
        trial_duration: {
          type:jspsych.ParameterType.INT,
          pretty_name: 'Trial duration',
          default: null,
          description: 'How long to show the trial.'
        },
        size_cells: {
          type: jspsych.ParameterType.INT,
          pretty_name: 'Size of cell',
          default: 70,
          description: 'Size of each cell on numpad'
        },
        correct_order: {
          type:jspsych.ParameterType.INT,
          default: undefined,
          description: 'Record the correct array'
        }
      }
    };

  class OperationSpanRecall {
    constructor(jsPsych) {
        this.jsPsych = jsPsych;
    }

  trial(display_element, trial) {

    // making matrix:
    var grid = 3;
    var recalledGrid = [];
    var correctLetters = trial.correct_order
    var display = " "

    var setSize = correctLetters.length
    var leftOver = 12-setSize

    var numbertobutton = {
      "0": "F",
      "1": "H",
      "2": "J",
      "3": "K",
      "4": "L",
      "5": "N",
      "6": "P",
      "7": "Q",
      "8": "R",
      "9": "S",
      "10": "T",
      "11": "V"
    }

  function indexOfArray(val, array) {
    var
      hash = {},
      indexes = {},
      i, j;
    for(i = 0; i < array.length; i++) {
      hash[array[i]] = i;
    }
    return (hash.hasOwnProperty(val)) ? hash[val] : -1;
  };


  function recordClick(data) {
    var tt = data.getAttribute('id')
    var tt = ("#"+tt)
    display_element.querySelector(tt).className = 'jspsych-operation-span-recall'
    var recalledN = (data.getAttribute('data-choice'));
    recalledGrid.push(numbertobutton[recalledN])
    var div = document.getElementById('recall_space');
    display += numbertobutton[recalledN] + " "
    div.innerHTML = display;
   // return recalledN
  }

  function clearSpace(){
    recalledGrid = recalledGrid.slice(0, (recalledGrid.length-1))
    console.log(recalledGrid)
    var div = document.getElementById('recall_space');
    display = display.slice(0, (display.length-2))
    div.innerHTML = display
   // return recalledGrid
  }

  var matrix = [];
  for (var i=0; i<4; i++){
    var m1 = i;
    for (var h=0; h<3; h++){
      var m2 = h;
      matrix.push([m1,m2])
    }
  };

  var paper_size = [(3*(trial.size_cells+30)), ((4*(trial.size_cells+20))+100)];

  display_element.innerHTML = '<div id="jspsych-html-button-response-btngroup" style= "position: relative; width:' + paper_size[0] +  'px; height:' + paper_size[1] + 'px"></div>';
  var paper = display_element.querySelector("#jspsych-html-button-response-btngroup");

  paper.innerHTML += '<div class="recall-space" style="position: absolute; top:'+ 0 +'px; left:'+(paper_size[0]/2-310)+'px; width:600px; height:64px" id="recall_space">'+ recalledGrid +'</div>';


  var buttons = ["F","H","J","K","L","N","P","Q","R","S","T","V"]

  for (var i = 0; i < matrix.length; i++) {
    var str = buttons[i]
    paper.innerHTML += '<div class="jspsych-operation-span-recall" style="position: absolute; top:'+ (matrix[i][0]*(trial.size_cells+20)+80) +'px; left:'+matrix[i][1]*(trial.size_cells+30)+'px; width:'+(trial.size_cells-6)+'px; height:'+(trial.size_cells-
   6)+'px"; id="jspsych-spatial-span-grid-button-' + i +'" data-choice="'+i+'">'+str+'</div>'
}


    display_element.innerHTML += '<div class="jspsych-btn-numpad" style="display: inline-block; margin:'+10+' '+2+'" id="jspsych-html-button-response-button-clear">Backspace</div>';

    display_element.innerHTML += '<div class="jspsych-btn-numpad" style="display: inline-block; margin:'+10+' '+40+'" id="jspsych-html-button-response-button" >Continue</div>';

  // Display letters when clicked using addEventListener instead of onclick
    for (var i = 0; i < matrix.length; i++) {
      display_element.querySelector('#jspsych-spatial-span-grid-button-' + i).addEventListener('click', (e) => recordClick(e.target))
    }

  // Clear letter when using backspace button using addEventListener instead of onclick
  display_element.querySelector('#jspsych-html-button-response-button-clear').addEventListener('click', (e)=> clearSpace(e.target))


  var start_time = performance.now();

  display_element.querySelector('#jspsych-html-button-response-button').addEventListener('click', function(e){
        var acc=0
        for (var i=0; i<correctLetters.length; i++){
          if (recalledGrid[i] == correctLetters[i]){
            acc += 1
          }
        }
      //  console.log(correctLetters, )
      //console.log(indexOfArray(correctGrid[1], matrix), recalledGrid[1])
  after_response(acc);
  });

  var response = {
    rt: null,
    button: null
  };

  function clear_display(){
    display_element.innerHTML = '';
}

  const end_trial = () => {
    // kill any remaining setTimeout handlers
    this.jsPsych.pluginAPI.clearAllTimeouts();

    // gather the data to store for the trial
    var trial_data = {
      rt: response.rt,
      recall: recalledGrid,
      stimuli: correctLetters,
      accuracy: response.button
    };

    // move on to the next trial
    this.jsPsych.finishTrial(trial_data);
  };

  function after_response(choice) {
    // measure rt
    var end_time = performance.now();
    var rt = end_time - start_time;
    var choiceRecord = choice;
    response.button = choice;
    response.rt = rt;

    // after a valid response, the stimulus will have the CSS class 'responded'
    // which can be used to provide visual feedback that a response was recorded
    //display_element.querySelector('#jspsych-html-button-response-stimulus').className += ' responded';

    // disable all the buttons after a response
    var btns = document.querySelectorAll('.jspsych-html-button-response-button button');
    for(var i=0; i<btns.length; i++){
      //btns[i].removeEventListener('click');
      btns[i].setAttribute('disabled', 'disabled');
    }

    clear_display();
    end_trial();
  };

  if (trial.trial_duration !== null) {
    this.jsPsych.pluginAPI.setTimeout(function() {
      clear_display();
      end_trial();
    }, trial.trial_duration);
  }}}

    OperationSpanRecall.info = info;

    return OperationSpanRecall;

  })(jsPsychModule);