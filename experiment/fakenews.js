var trial_number = 1

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[array[i], array[j]] = [array[j], array[i]]
    }
    return array
}

// Randomize within categories
stimuli_list = [] // Initialize
// Loop through unique categories
for (let cat of [...new Set(stimuli.map((a) => a.code))]) {
    // Get all stimuli of this category
    var cat_stimuli = stimuli.filter((a) => a.code == cat)

    // AI vs. Human
    for (let nat of [...new Set(stimuli.map((a) => a.type))]) {
        var nat_stimuli = stimuli.filter((a) => a.type == nat)
        nat_stimuli = shuffleArray(nat_stimuli) // Shuffle
        // Add 2 first stimuli to stimuli_list
        nat_stimuli.slice(0, 2).forEach((a) => stimuli_list.push(a))
    }
}
stimuli_list = shuffleArray(stimuli_list) // Shuffle
// console.log(stimuli_list)

// Randomize ticks order
var ticks_real = shuffleArray(["Real", "Fake"])
if (ticks_real[1] == "Real") {
    var ticks_real_type = "Positive_Real"
} else {
    var ticks_real_type = "Positive_Fake"
}
var ticks_ai = shuffleArray(["Human", "AI"])
if (ticks_ai[1] == "Human") {
    var ticks_ai_type = "Positive_Human"
} else {
    var ticks_ai_type = "Positive_AI"
}

// Instructions
var fakenews_instructions1 = {
    type: jsPsychHtmlButtonResponse,
    css_classes: ["narrow-text"],
    stimulus:
        "<h1>Instructions</h1>" +
        "<p style='text-align: left'>In this experiment, we are interested in how you judge and perceive different short <b>news excerpts</b>.</p>" +
        "<p style='text-align: left'>Importantly, some of these texts correspond to <b>real news</b> (true), but others are <b>fake</b> (not true). Some were written <b>by Humans</b> and some were created by an <b>Artificial Intelligence (AI) algorithm</b> (like ChatGPT).</p>" +
        "<p style='text-align: left'>You will have to read each news, and then answer a few questions about it and evaluate each news on the following scales:</p>" +
        "<ul style='text-align: left'>" +
        "<li><b>Real vs. Fake</b>: Do you think that the content of the news is <b>real</b> (true) or <b>fake</b> (false).</li>" +
        "<li><b>Human vs. AI-generated</b>: Do you think the text was written by a <b>Human or an AI</b> (regardless of whether the content is true or false).</li>" +
        "<li><b>Engaging</b>: To what extent did you find the news engaging (e.g., interesting or fun). Strongly engaging content would typically lead us to spend more time searching more information, or commenting on and sharing it.</li>" +
        '<li><b>Emotionality</b>: To what extent was the news "emotional". Did the news trigger any feelings in you while reading it?</li>' +
        "<li><b>Importance</b>: Assuming the news is true, to what extent is it important in general for the world (e.g., a matter of national concern)?</li>" +
        "<li><b>Relevance</b>: To what extend was the news about something relevant to you, either because it's something you care about, or something that might impact you directly.</li></ul>" +
        "<p style='text-align: left'>Please read each excerpt as you would do with a regular news article. Knowing the answer can sometimes be <b>very hard</b>, so go with your gut feelings! You can also give more or less extreme responses depending on how <b>confident</b> you are. You will be tasked to read 32 excerpts in total.</p>",
    choices: ["Ready"],
    data: { screen: "fakenews_instructions1" },
}

// Instructions
var fakenews_instructions2 = {
    type: jsPsychHtmlButtonResponse,
    css_classes: ["narrow-text"],
    stimulus:
        "<h1>News judgment</h1>" +
        "<p Now, we would like you to rate some new news again, just as you did in the previous phase.</p>",
    choices: ["Ready"],
    data: { screen: "fakenews_instructions2" },
}

// Trials ==========================================================

var fakenews_text = {
    type: jsPsychHtmlButtonResponse,
    css_classes: ["narrow-text"],
    stimulus: function () {
        var title = "<h2>News " + trial_number + " / " + stimuli_list.length + "</h2>"
        var stim =
            "<p style='background-color: #f2f2f2'>" + jsPsych.timelineVariable("stimulus") + "</p>" + "<p style='font-size:0%'>" + jsPsych.timelineVariable("excerpt_num") + "</p>"
        return title + stim
    },
    choices: ["I Read"],
    data: { screen: "fakenews_text" },
    on_finish: function () {
        trial_number++
    },
}

var fakenews_questions = {
    type: jsPsychSurveyMultiChoice,
    questions: [
        {
            prompt: "What is the topic of the news excerpt you just read?",
            options: ["Economy", "Politics", "Science and Technology", "Social Issues", "Others"],
            name: "Topic",
            // required: true,
            required: true,
        },
        {
            prompt: "Was the news excerpt related to Singapore?",
            options: ["Yes", "No"],
            name: "SingaporeRelated",
            // required: true,
            required: true,
        },
    ],
    data: {
        screen: "fakenews_questions",
    },
}

var fakenews_ratings_reality = {
    type: jsPsychMultipleSlider, // this is a custom plugin in utils
    questions: shuffleArray([
        // The order of the questions is randomized per participant
        {
            prompt:
                "<b>Do you think the news' content is <i>" +
                ticks_real[0] +
                "</i> or <i>" +
                ticks_real[1] +
                "</i>?</b><br>",
            name: "Reality",
            ticks: ticks_real,
            // required: true,
            required: true,
            min: -1,
            max: 1,
            step: 0.01,
            slider_start: 0,
        },
        {
            prompt: function () {
                if (ticks_ai_type == "Positive_AI") {
                    return "<b>Do you think the news was written by a <i>Human</i> or an <i>AI</i>?</b><br>"
                } else {
                    return "<b>Do you think the news was written by an <i>AI</i> or a <i>Human</i>?</b><br>"
                }
            },
            name: "Artificiality",
            ticks: ticks_ai,
            // required: true,
            required: true,
            min: 0,
            max: 1,
            step: 0.01,
            slider_start: 0.5,
        },
    ]),
    // require_movement: true,
    require_movement: true,
    data: {
        screen: "fakenews_ratings_reality",
        ticks_real: ticks_real_type,
        ticks_ai: ticks_ai_type,
    },
}

var fakenews_ratings_appraisal = {
    type: jsPsychMultipleSlider, // this is a custom plugin in utils
    questions: shuffleArray([
        {
            prompt: "<b>Was the news engaging (e.g., interesting or fun)?</b><br>",
            name: "Engaging",
            ticks: ["Not at all", "Very"],
            required: true,
            min: 0,
            max: 1,
            step: 0.01,
            slider_start: 0.5,
        },
        {
            prompt: "<b>Did you feel any emotions while reading the news?</b><br>",
            name: "Emotionality",
            ticks: ["Not at all", "Very"],
            required: true,
            min: 0,
            max: 1,
            step: 0.01,
            slider_start: 0.5,
        },
        {
            prompt: "<b>Assuming the news was true, to what extent would it be important for the world?</b><br>",
            name: "Importance",
            ticks: ["Not at all", "Very"],
            required: true,
            min: 0,
            max: 1,
            step: 0.01,
            slider_start: 0.5,
        },
        {
            prompt: "<b>To what extent was the news' content relevant to you?</b><br>",
            name: "Relevance",
            ticks: ["Not at all", "Very"],
            required: true,
            min: 0,
            max: 1,
            step: 0.01,
            slider_start: 0.5,
        },
    ]),
    require_movement: true,
    data: {
        screen: "fakenews_ratings_appraisal",
    },
}

// Randomize ratings order between the 2 blocks (scales first, nature after or vice versa)
// TODO: do 2 blocks with questionnaires in between
var fakenews_block1 = {
    timeline: [
        fakenews_text,
        fakenews_questions,
        fakenews_ratings_reality,
        fakenews_ratings_appraisal,
    ],
    timeline_variables: stimuli_list.slice(0, 16),
    randomize_order: true,
}

var fakenews_block2 = {
    timeline: [
        fakenews_text,
        fakenews_questions,
        fakenews_ratings_reality,
        fakenews_ratings_appraisal,
    ],
    timeline_variables: stimuli_list.slice(16, 32),
    randomize_order: true,
}
