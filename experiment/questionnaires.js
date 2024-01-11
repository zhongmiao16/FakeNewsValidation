var questionnaire_media_frequency = {
    type: jsPsychSurveyMultiChoice,
    preamble:
        "<br><p><b>We would like to understand more about how your news reading habits.</b></p>" +
        "<p><b>How often do you watch/read <i>news</i> using each of the following?</b></p>",
    // TODO: Media ? Or News only?
    questions: [
        {
            prompt: "<b>Internet (news websites)</b>",
            name: "newsfrequency_internet",
            options: [
                "Several times a day",
                "Once a day",
                "4-6 days a week",
                "2-3 days a week",
                "Once a week",
                "Less often than once a week",
            ],
            required: false,
        },
        {
            prompt: "<b>Phone apps</b>",
            name: "newsfrequency_phoneapps",
            options: [
                "Several times a day",
                "Once a day",
                "4-6 days a week",
                "2-3 days a week",
                "Once a week",
                "Less often than once a week",
            ],
            required: false,
        },
        {
            prompt: "<b>Social media (twitter, reddit, facebook, ...)</b>",
            name: "newsfrequency_socialmedia",
            options: [
                "Several times a day",
                "Once a day",
                "4-6 days a week",
                "2-3 days a week",
                "Once a week",
                "Less often than once a week",
            ],
            required: false,
        },
        {
            prompt: "<b>Television</b>",
            name: "newsfrequency_tv",
            options: [
                "Several times a day",
                "Once a day",
                "4-6 days a week",
                "2-3 days a week",
                "Once a week",
                "Less often than once a week",
            ],
            required: false,
        },
        {
            prompt: "<b>Newspapers</b>",
            name: "newsfrequency_newspapers",
            options: [
                "Several times a day",
                "Once a day",
                "4-6 days a week",
                "2-3 days a week",
                "Once a week",
                "Less often than once a week",
            ],
            required: false,
        },
        // {
        //     prompt: "<b>Books</b>",
        //     name: "newsfrequency_books",
        //     options: [
        //         "Several times a day",
        //         "Once a day",
        //         "4-6 days a week",
        //         "2-3 days a week",
        //         "Once a week",
        //         "Less often than once a week",
        //     ],
        //     required: false,
        // },
        {
            prompt: "<b>Radio</b>",
            name: "newsfrequency_radio",
            options: [
                "Several times a day",
                "Once a day",
                "4-6 days a week",
                "2-3 days a week",
                "Once a week",
                "Less often than once a week",
            ],
            required: false,
        },
        {
            prompt: "<b>In general, how interested are you in keeping up with news?</b>",
            name: "news_interest",
            options: [
                "Extremely interested",
                "Very interested",
                "Somewhat interested",
                "Not very interested",
                "Not at all interested",
            ],
            // required: true,
            required: false,
        },
        {
            prompt: "<b>In general, how often do you engage with the news (commenting them, discussing them on social media, bringing them up in conversations, etc.)</b>",
            name: "news_engagement",
            options: [
                "Everyday",
                "A few times a week",
                "Once a week",
                "A few times a month",
                "Rarely",
                "Never",
            ],
            // required: true,
            required: false,
        },
        {
            prompt: "<b>In general, how often do you share news and news links (i.e., do you often do you forward or send news articles to other people)</b>",
            name: "news_sharing",
            options: [
                "Everyday",
                "A few times a week",
                "Once a week",
                "A few times a month",
                "Rarely",
                "Never",
            ],
            // required: true,
            required: false,
        },
    ],
    require_movement: true,
    data: {
        screen: "questionnaire_media_frequency",
    },
}

var questionnaire_news_types = {
    type: jsPsychSurveyMultiSelect,
    questions: [
        {
            prompt: "<b>Which of the following types of news are you most interested in?</b>",
            options: [
                "Local news",
                "International news",
                "Business and financial news",
                "World politics",
                "Local politics",
                "News about the economy",
                "Fun/weird news",
                "Health and education news",
                "Lifestyle news",
                "Arts and culture news",
                "Sports news",
                "Science and technology news",
                "Crime/sensational news",
                "Celebrity-related news",
            ],
            name: "type",
            required: false,
        },
        // {
        //     prompt: "Which of the following have you used in the last month as a source of news information?",
        //     options: [
        //         "Newspapers (e.g., The Straits Times)",
        //         "Television",
        //         "News websites / News mobile apps (e.g., CNN, CNA, BBC)",
        //         "Social media (e.g., Facebook, Twitter, YouTube)",
        //         "Visiting links shared by friends or relatives (e.g., from WhatsApp etc.,)",
        //     ],
        //     name: "news_sources",
        //     required: false,
        // },
    ],
    require_movement: true,
    data: {
        screen: "questionnaire_news_types",
    },
}

// BAIT ========================================================================

var bait_dimensions = [
    "GAAIS_Negative_9",
    "GAAIS_Negative_10",
    "GAAIS_Negative_15",
    "GAAIS_Positive_7",
    "GAAIS_Positive_12",
    "GAAIS_Positive_17",
    "BAIT_1_ImagesRealistic",
    "BAIT_2_ImagesIssues",
    "BAIT_3_VideosRealistic",
    "BAIT_4_VideosIssues",
    "BAIT_5_ImitatingReality",
    "BAIT_6_EnvironmentReal",
    "BAIT_7_TextRealistic",
    "BAIT_8_TextIssues",
]

function format_questions_analog(
    items,
    dimensions,
    ticks = ["Inaccurate", "Accurate"]
) {
    var questions = []
    for (const [index, element] of items.entries()) {
        questions.push({
            prompt: "<b>" + element + "</b>",
            name: dimensions[index],
            ticks: ticks,
            required: false,
            min: 0,
            max: 1,
            step: 0.01,
            slider_start: 0.5,
        })
    }
    return questions
}

var bait_instructions =
    "<h2>About AI...</h2>" +
    "<p>We are interested in your thoughts about Artificial Intelligence (AI).<br>" +
    "Please read the statements below carefully and indicate the extent to which you agree with each statement.</p>"

// General Attitudes towards Artificial Intelligence Scale (GAAIS; Schepman et al., 2020, 2022)
// We used the most loaded items from Schepman et al. (2023) - loadings from the 2 CFAs are in parentheses
// We adedd items specifically about CGI and artificial media (BAIT)
var bait_items = [
    // Neg3 (0.406, 0.405) - Low loadings
    // "Organisations use Artificial Intelligence unethically",
    // Neg9 (0.726, 0.717) - Not used in FakeFace
    "Artificial Intelligence might take control of people",
    // Neg10 (0.850, 0.848) - Modified: removed "I think"
    "Artificial Intelligence is dangerous",
    // Neg15 (1.014, 0.884) - Not used in FakeFace. Modified: replaced "I shiver with discomfort when I think about" by "I am worried about"
    "I am worried about future uses of Artificial Intelligence",
    // Pos7 (0.820, 0.878)
    "I am interested in using artificially intelligent systems in my daily life",
    // Pos12 (0.734, 0.554)
    "Artificial Intelligence is exciting",
    // Pos14 (0.516, 0.346) - Low loadings
    // "There are many beneficial applications of Artificial Intelligence",
    // Pos17 (0.836, 0.656) - Not used in FakeFace
    "Much of society will benefit from a future full of Artificial Intelligence",

    // New items (Beliefs about Artificial Images Technology - BAIT) ---------------------------
    // Revised from Makowski et al. (Fake Face study)
    // Changes from FakeFace: remove "I think"
    "Current Artificial Intelligence algorithms can generate very realistic images",
    "Images of faces or people generated by Artificial Intelligence always contain errors and artifacts",
    "Videos generated by Artificial Intelligence have obvious problems that make them easy to spot as fake",
    "Current Artificial Intelligence algorithms can generate very realistic videos",
    "Computer-Generated Images (CGI) are capable of perfectly imitating reality",
    "Technology allows the creation of environments that seem just as real as reality", // New
    "Artificial Intelligence assistants can write texts that are indistinguishable from those written by humans", // New
    "Documents and paragraphs written by Artificial Intelligence usually read differently compared to Human productions", // New
]

var bait_ticks = ["Disagree", "Agree"] // In Schepman et al. (2022) they removed 'Strongly'

// BAIT 2.0
var questionnaire_bait = {
    type: jsPsychMultipleSlider,
    questions: format_questions_analog(
        bait_items,
        bait_dimensions,
        // In Schepman et al. (2022) they removed 'Strongly'
        (ticks = bait_ticks)
    ),
    randomize_question_order: true,
    preamble: bait_instructions,
    require_movement: false,
    slider_width: 600,
    data: {
        screen: "questionnaire_bait",
    },
}

// Other
// Most of the variables are loaded from online by the script
var questionnaire_ipip6 = {
    type: jsPsychMultipleSlider,
    questions: ipip6((required = false)),
    randomize_question_order: false,
    preamble: ipip6_instructions,
    require_movement: false,
    slider_width: 600,
    data: {
        screen: "questionnaire_ipip6",
    },
}

// Create questionnaire variable
var questionnaire_pid5 = {
    type: jsPsychSurveyLikert,
    questions: pid5((required = false)),
    randomize_question_order: true,
    preamble: pid5_instructions,
    require_movement: false,
    slider_width: 700,
    data: {
        screen: "questionnaire_pid5",
    },
}
