/**
 * jspsych-html-button-response
 * Josh de Leeuw
 *
 * plugin for displaying a stimulus and getting a keyboard response
 *
 * documentation: docs.jspsych.org
 *
 **/

var jsPsychHtmlButtonOperationSpan = (function (jspsych) {
  "use strict";

  const info = {
    name: "html-button-operationspan",
    description: "",
    parameters: {
      stimulus: {
        type: jspsych.ParameterType.HTML_STRING,
        pretty_name: "Stimulus",
        default: undefined,
        description: "The HTML string to be displayed",
      },
      /** Array containing the label(s) for the button(s). */
      choices: {
        type: jspsych.ParameterType.STRING,
        pretty_name: "Choices",
        default: undefined,
        array: true,
      },
      /** The HTML for creating button. Can create own style. Use the "%choice%" string to indicate where the label from the choices parameter should be inserted. */
      button_html: {
        type: jspsych.ParameterType.HTML_STRING,
        pretty_name: "Button HTML",
        default: '<button class="jspsych-btn">%choice%</button>',
        array: true,
      },
      /** Any content here will be displayed under the button(s). */
      prompt: {
        type: jspsych.ParameterType.HTML_STRING,
        pretty_name: "Prompt",
        default: null,
      },
      /** How long to show the stimulus. */
      stimulus_duration: {
        type: jspsych.ParameterType.INT,
        pretty_name: "Stimulus duration",
        default: null,
      },
      /** How long to show the trial. */
      trial_duration: {
        type: jspsych.ParameterType.INT,
        pretty_name: "Trial duration",
        default: null,
      },
      /** The vertical margin of the button. */
      margin_vertical: {
        type: jspsych.ParameterType.STRING,
        pretty_name: "Margin vertical",
        default: "0px",
      },
      /** The horizontal margin of the button. */
      margin_horizontal: {
        type: jspsych.ParameterType.STRING,
        pretty_name: "Margin horizontal",
        default: "8px",
      },
      /** If true, then trial will end when user responds. */
      response_ends_trial: {
        type: jspsych.ParameterType.BOOL,
        pretty_name: "Response ends trial",
        default: true,
      },
      equation_accuracy: {
        type: jspsych.ParameterType.BOOL,
        pretty_name: "Equation Accuracy",
        default: true,
        description: "If true (false), then response of 'true'('false') will be scored as 1.",
      },
    },
  };

  class HtmlButtonOperationSpan {
    constructor(jsPsych) {
      this.jsPsych = jsPsych;
    }
    trial(display_element, trial) {
      // display stimulus
      var html =
        '<div id="jspsych-html-button-response-stimulus">' +
        trial.stimulus +
        "</div>";

      //display buttons
      var buttons = [];
      if (Array.isArray(trial.button_html)) {
        if (trial.button_html.length == trial.choices.length) {
          buttons = trial.button_html;
        } else {
          console.error(
            "Error in html-button-response plugin. The length of the button_html array does not equal the length of the choices array"
          );
        }
      } else {
        for (var i = 0; i < trial.choices.length; i++) {
          buttons.push(trial.button_html);
        }
      }
      html += '<div id="jspsych-html-button-response-btngroup">';
      for (var i = 0; i < trial.choices.length; i++) {
        var str = buttons[i].replace(/%choice%/g, trial.choices[i]);
        html +=
          '<div class="jspsych-html-button-response-button" style="display: inline-block; margin:' +
          20 +
          " " +
          20 +
          '" id="jspsych-html-button-response-button-' +
          i +
          '" data-choice="' +
          i +
          '">' +
          str +
          "</div>";
      }
      html += "</div>";

      //show prompt if there is one
      if (trial.prompt !== null) {
        html += trial.prompt;
      }
      display_element.innerHTML = html;

      // start time
      var start_time = performance.now();

      var acc=0
      // add event listeners to buttons
      for (var i = 0; i < trial.choices.length; i++) {
        display_element
          .querySelector("#jspsych-html-button-response-button-" + i)
          .addEventListener("click", function (e) {
            var choice = e.currentTarget.getAttribute("data-choice"); // don't use dataset for jsdom compatibility
            if (trial.equation_accuracy==true && choice == 0) {
              acc = 1;
            } else if (trial.equation_accuracy ==false && choice == 1) {
              acc = 1;
            } else {
              acc = 0;
            }
            after_response(acc);
          });
      }

      // store response
      var response = {
        rt: null,
        button: null,
      };

      // function to handle responses by the subject
      function after_response(choice) {
        // measure rt
        var end_time = performance.now();
        var rt = end_time - start_time;
        response.button = choice;
        response.rt = rt;

        // after a valid response, the stimulus will have the CSS class 'responded'
        // which can be used to provide visual feedback that a response was recorded
        display_element.querySelector(
          "#jspsych-html-button-response-stimulus"
        ).className += " responded";

        // disable all the buttons after a response
        var btns = document.querySelectorAll(
          ".jspsych-html-button-response-button button"
        );
        for (var i = 0; i < btns.length; i++) {
          //btns[i].removeEventListener('click');
          btns[i].setAttribute("disabled", "disabled");
        }

        if (trial.response_ends_trial) {
          end_trial();
        }
      }

      // function to end trial when it is time
      const end_trial = () => {
        // kill any remaining setTimeout handlers
        this.jsPsych.pluginAPI.clearAllTimeouts();
        // gather the data to store for the trial
        var trial_data = {
            rt: response.rt,
            stimulus: trial.stimulus,
            accuracy: response.button,
        };
        // clear the display
        display_element.innerHTML = "";
        // move on to the next trial
        this.jsPsych.finishTrial(trial_data);
      };

      // hide image if timing is set
      if (trial.stimulus_duration !== null) {
        this.jsPsych.pluginAPI.setTimeout(function () {
          display_element.querySelector(
            "#jspsych-html-button-response-stimulus"
          ).style.visibility = "hidden";
        }, trial.stimulus_duration);
      }

      // end trial if time limit is set
      if (trial.trial_duration !== null) {
        this.jsPsych.pluginAPI.setTimeout(function () {
          end_trial();
        }, trial.trial_duration);
      }
    }
  }

  HtmlButtonOperationSpan.info = info;
  return HtmlButtonOperationSpan;
})(jsPsychModule);
