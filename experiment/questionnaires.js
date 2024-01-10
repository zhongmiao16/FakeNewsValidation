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
            prompt: "<b>How interested, if at all, would you say you are in keeping up with news?</b>",
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
                "Fun/Weird news",
                "Health and education news",
                "Arts and culture news",
                "Sports news",
                "Science and technology news",
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
