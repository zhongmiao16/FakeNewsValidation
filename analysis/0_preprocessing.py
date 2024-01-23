import json

import osfclient
import pandas as pd


# Get files from OSF ======================================================
def osf_listfiles(data_subproject="", token="", after_date=None):
    osf = osfclient.OSF(token=token).project(data_subproject)  # Connect to project
    storage = [s for s in osf.storages][0]  # Access storage component
    files = [
        {
            "name": file.name.replace(".csv", ""),
            "date": pd.to_datetime(file.date_created),
            "url": file._download_url,
            "size": file.size,
            "file": file,
        }
        for file in storage.files
    ]

    if after_date is not None:
        date = pd.to_datetime(after_date, format="%d/%m/%Y", utc=True)
        files = [f for f, d in zip(files, [f["date"] > date for f in files]) if d]
    return files


token = ""  # Paste OSF token here to access private repositories
files = osf_listfiles(
    token=token,
    data_subproject="8nmsa",  # Data subproject ID
    after_date="20/01/2024",
)


# Loop through files ======================================================
alldata_sub = pd.DataFrame()  # Initialize empty dataframe
alldata_fakenews = pd.DataFrame()  # Initialize empty dataframe

for i, file in enumerate(files):
    print(f"File N°{i+1}/{len(files)}")

    data = pd.read_csv(file["file"]._get(file["url"], stream=True).raw)

    # Participant ========================================================
    # data["screen"].unique()

    # Browser info -------------------------------------------------------
    browser = data[data["screen"] == "browser_info"].iloc[0]

    df = pd.DataFrame(
        {
            "Participant": file["name"],
            # "Experimenter": brower["experimenter"],
            "Experiment_Duration": data["time_elapsed"].max() / 1000 / 60,
            "Date": browser["date"],
            "Time": browser["time"],
            "Browser": browser["browser"],
            "Mobile": browser["mobile"],
            "Platform": browser["os"],
            "Screen_Width": browser["screen_width"],
            "Screen_Height": browser["screen_height"],
        },
        index=[0],
    )

    # Demographics -------------------------------------------------------
    demo1 = data[data["screen"] == "demographics_1"].iloc[0]
    demo1 = json.loads(demo1["response"])
    demo2 = data[data["screen"] == "demographics_2"].iloc[0]
    demo2 = json.loads(demo2["response"])
    debrief = data[data["screen"] == "demographics_debrief"].iloc[0]
    debrief = json.loads(debrief["response"])
    paynow = data[data["screen"] == "demographics_paynow"].iloc[0]

    df["Nationality"] = demo2["nationality"]
    df["Generation_Pptn"] = debrief["generation_participation"]
    df["PayNow_Code"] = paynow["stimulus"][-24:-16]
    df["Gender"] = demo1["gender"]
    df["Ethnicity"] = demo2["ethnicity"]
    df["Education"] = demo1["education"]
    df["Discipline"] = demo2["discipline"] 
    df["Age"] = demo2["age"]
    df["Student"] = demo1["student"]
    df["English_Level"] = demo1["english"]
    df["Years_Singapore"] = demo2["years_singapore"]
    df["AI_Expertise"] = demo1["ai_expertise"]
    df["Discrimination_Ability"] = debrief["discrimination_ability"]

    # Questionnaires -------------------------------------------------------
    media_freq = data[data["screen"] == "questionnaire_media_frequency"].iloc[0]
    media_freq = json.loads(media_freq["response"])

    df["MediaFreq_Internet"] = media_freq["newsfrequency_internet"]
    df["MediaFreq_PhoneApps"] = media_freq["newsfrequency_phoneapps"]
    df["MediaFreq_SocialMedia"] = media_freq["newsfrequency_socialmedia"]
    df["MediaFreq_TV"] = media_freq["newsfrequency_tv"]
    df["MediaFreq_Newspapers"] = media_freq["newsfrequency_newspapers"]
    df["MediaFreq_Radio"] = media_freq["newsfrequency_radio"]
    df["News_Interest"] = media_freq["news_interest"]
    df["News_Engagement"] = media_freq["news_engagement"]
    df["News_Sharing"] = media_freq["news_sharing"]

    ipip6 = data[data["screen"] == "questionnaire_ipip6"].iloc[0]
    ipip6 = json.loads(ipip6["response"])

    df["IPIP_Extraversion"] = ((ipip6["Extraversion_1"] + 
                               (1 - ipip6["Extraversion_7_R"]) +
                               (1 - ipip6["Extraversion_19_R"]) +
                               ipip6["Extraversion_23"]) / 4)
    df["IPIP_Agreeableness"] = ((ipip6["Agreeableness_2"] + 
                               (1 - ipip6["Agreeableness_8_R"]) +
                               (1 - ipip6["Agreeableness_20_R"]) +
                               ipip6["Agreeableness_14"]) / 4)
    df["IPIP_Conscientiousness"] = ((ipip6["Conscientiousness_3"] + 
                               (1 - ipip6["Conscientiousness_11_R"]) +
                               (1 - ipip6["Conscientiousness_22_R"]) +
                               ipip6["Conscientiousness_10"]) / 4)
    df["IPIP_Neuroticism"] = ((ipip6["Neuroticism_4"] + 
                               (1 - ipip6["Neuroticism_15_R"]) +
                               (1 - ipip6["Neuroticism_17_R"]) +
                               ipip6["Neuroticism_16"]) / 4)
    df["IPIP_Openness"] = ((ipip6["Openness_5"] + 
                               (1 - ipip6["Openness_9_R"]) +
                               (1 - ipip6["Openness_13_R"]) +
                               (1 - ipip6["Openness_21_R"])) / 4)
    df["IPIP_HonestyHumility"] = (((1 - ipip6["HonestyHumility_6_R"]) + 
                               (1 - ipip6["HonestyHumility_12_R"]) +
                               (1 - ipip6["HonestyHumility_18_R"]) +
                               (1 - ipip6["HonestyHumility_24_R"])) / 4)

    # df["IPIP6_Extraversion_Q1"] = ipip6["Extraversion_1"]
    # df["IPIP6_Extraversion_Q7_R"] = ipip6["Extraversion_7_R"]
    # df["IPIP6_Extraversion_Q19_R"] = ipip6["Extraversion_19_R"]
    # df["IPIP6_Extraversion_Q23"] = ipip6["Extraversion_23"]
    # df["IPIP6_Agreeableness_Q2"] = ipip6["Agreeableness_2"]
    # df["IPIP6_Agreeableness_Q8_R"] = ipip6["Agreeableness_8_R"]
    # df["IPIP6_Agreeableness_Q14"] = ipip6["Agreeableness_14"]
    # df["IPIP6_Agreeableness_Q20_R"] = ipip6["Agreeableness_20_R"]
    # df["IPIP6_Conscientiousness_Q3"] = ipip6["Conscientiousness_3"]
    # df["IPIP6_Conscientiousness_Q10"] = ipip6["Conscientiousness_10"]
    # df["IPIP6_Conscientiousness_Q11_R"] = ipip6["Conscientiousness_11_R"]
    # df["IPIP6_Conscientiousness_Q22_R"] = ipip6["Conscientiousness_22_R"]
    # df["IPIP6_Neuroticism_Q4"] = ipip6["Neuroticism_4"]
    # df["IPIP6_Neuroticism_Q15_R"] = ipip6["Neuroticism_15_R"]
    # df["IPIP6_Neuroticism_Q16"] = ipip6["Neuroticism_16"]
    # df["IPIP6_Neuroticism_Q17_R"] = ipip6["Neuroticism_17_R"]
    # df["IPIP6_Openness_Q5"] = ipip6["Openness_5"]
    # df["IPIP6_Openness_Q9_R"] = ipip6["Openness_9_R"]
    # df["IPIP6_Openness_Q13_R"] = ipip6["Openness_13_R"]
    # df["IPIP6_Openness_Q21_R"] = ipip6["Openness_21_R"]
    # df["IPIP6_HonestyHumility_Q6_R"] = ipip6["HonestyHumility_6_R"]
    # df["IPIP6_HonestyHumility_Q12_R"] = ipip6["HonestyHumility_12_R"]
    # df["IPIP6_HonestyHumility_Q18_R"] = ipip6["HonestyHumility_18_R"]
    # df["IPIP6_HonestyHumility_Q24_R"] = ipip6["HonestyHumility_24_R"]

    pid5 = data[data["screen"] == "questionnaire_pid5"].iloc[0]
    pid5 = json.loads(pid5["response"])

    df["PID5_Total"] = (pid5["Disinhibition_1"] +
                    pid5["Disinhibition_2"] +
                    pid5["Disinhibition_3"] +
                    pid5["Detachment_4"] +
                    pid5["Disinhibition_5"] +
                    pid5["Disinhibition_6"] +
                    pid5["Psychoticism_7"] +
                    pid5["NegativeAffect_8"] +
                    pid5["NegativeAffect_9"] +
                    pid5["NegativeAffect_10"] +
                    pid5["NegativeAffect_11"] +
                    pid5["Psychoticism_12"] +
                    pid5["Detachment_13"] +
                    pid5["Detachment_14"] +
                    pid5["NegativeAffect_15"] +
                    pid5["Detachment_16"] +
                    pid5["Antagonism_17"] +
                    pid5["Detachment_18"] +
                    pid5["Antagonism_19"] +
                    pid5["Antagonism_20"] +
                    pid5["Psychoticism_21"] +
                    pid5["Antagonism_22"] +
                    pid5["Psychoticism_23"] +
                    pid5["Psychoticism_24"] +
                    pid5["Antagonism_25"])
    df["PID5_Avg"] = (pid5["Disinhibition_1"] +
                    pid5["Disinhibition_2"] +
                    pid5["Disinhibition_3"] +
                    pid5["Detachment_4"] +
                    pid5["Disinhibition_5"] +
                    pid5["Disinhibition_6"] +
                    pid5["Psychoticism_7"] +
                    pid5["NegativeAffect_8"] +
                    pid5["NegativeAffect_9"] +
                    pid5["NegativeAffect_10"] +
                    pid5["NegativeAffect_11"] +
                    pid5["Psychoticism_12"] +
                    pid5["Detachment_13"] +
                    pid5["Detachment_14"] +
                    pid5["NegativeAffect_15"] +
                    pid5["Detachment_16"] +
                    pid5["Antagonism_17"] +
                    pid5["Detachment_18"] +
                    pid5["Antagonism_19"] +
                    pid5["Antagonism_20"] +
                    pid5["Psychoticism_21"] +
                    pid5["Antagonism_22"] +
                    pid5["Psychoticism_23"] +
                    pid5["Psychoticism_24"] +
                    pid5["Antagonism_25"]) / 25
    df["PID5_Disinhibition_Total"] = (pid5["Disinhibition_1"] +
                    pid5["Disinhibition_2"] +
                    pid5["Disinhibition_3"] +
                    pid5["Disinhibition_5"] +
                    pid5["Disinhibition_6"])
    df["PID5_Disinhibition_Avg"] = (pid5["Disinhibition_1"] +
                    pid5["Disinhibition_2"] +
                    pid5["Disinhibition_3"] +
                    pid5["Disinhibition_5"] +
                    pid5["Disinhibition_6"]) / 5
    df["PID5_Detachment_Total"] = (pid5["Detachment_4"] +
                    pid5["Detachment_13"] +
                    pid5["Detachment_14"] +
                    pid5["Detachment_16"] +
                    pid5["Detachment_18"])
    df["PID5_Detachment_Avg"] = (pid5["Detachment_4"] +
                    pid5["Detachment_13"] +
                    pid5["Detachment_14"] +
                    pid5["Detachment_16"] +
                    pid5["Detachment_18"]) / 5
    df["PID5_Psychotism_Total"] = (pid5["Psychoticism_7"] +
                    pid5["Psychoticism_12"] +
                    pid5["Psychoticism_21"] +
                    pid5["Psychoticism_23"] +
                    pid5["Psychoticism_24"])
    df["PID5_Psychotism_Avg"] = (pid5["Psychoticism_7"] +
                    pid5["Psychoticism_12"] +
                    pid5["Psychoticism_21"] +
                    pid5["Psychoticism_23"] +
                    pid5["Psychoticism_24"]) / 5
    df["PID5_NegAffect_Total"] = (pid5["NegativeAffect_8"] +
                    pid5["NegativeAffect_9"] +
                    pid5["NegativeAffect_10"] +
                    pid5["NegativeAffect_11"] +
                    pid5["NegativeAffect_15"])
    df["PID5_NegAffect_Avg"] = (pid5["NegativeAffect_8"] +
                    pid5["NegativeAffect_9"] +
                    pid5["NegativeAffect_10"] +
                    pid5["NegativeAffect_11"] +
                    pid5["NegativeAffect_15"]) / 5
    df["PID5_Antagonism_Total"] = (pid5["Antagonism_17"] +
                    pid5["Antagonism_19"] +
                    pid5["Antagonism_20"] +
                    pid5["Antagonism_22"] +
                    pid5["Antagonism_25"])
    df["PID5_Antagonism_Avg"] = (pid5["Antagonism_17"] +
                    pid5["Antagonism_19"] +
                    pid5["Antagonism_20"] +
                    pid5["Antagonism_22"] +
                    pid5["Antagonism_25"]) / 5  
    
    bait = data[data["screen"] == "questionnaire_bait"].iloc[0]
    bait = json.loads(bait["response"]) 

    # TO-DO calculations for BAIT questions
   
    # Fake/Real News -------------------------------------------------------

    fakenews_text = data[data["screen"] == "fakenews_text"]
    fakenews_attn = data[data["screen"] == "fakenews_questions"].iloc[0:32]
    fakenews_ratings_reality = data[data["screen"] == "fakenews_ratings_reality"].iloc[0:32]
    fakenews_ratings_appraisal = data[data["screen"] == "fakenews_ratings_appraisal"].iloc[0:32]

    excerpt_num_list = []
    excerpt_viewingtime_list = []
    excerpt_qn_topic_list = []
    excerpt_qn_sgrelated_list = []
    excerpt_reality_realfake_list = []
    excerpt_reality_humanai_list = []
    excerpt_appraisal_importance_list = []
    excerpt_appraisal_emotionality_list = []
    excerpt_appraisal_engaging_list = []
    excerpt_appraisal_relevance_list = []
    # To extract excerpt numbers for all excerpts per participant
    for excerpt in fakenews_text["stimulus"]:
        excerpt_num = excerpt.rsplit(">",2)
        excerpt_num = excerpt_num[1].rsplit("<")
        excerpt_num_list.append(excerpt_num[0])
    # To extract total time taken to read each excerpt    
    for excerpt in fakenews_text["rt"]:
        excerpt_viewingtime_list.append(excerpt)
    # To extract answers for attention check questions
    for i in range(len(fakenews_attn["response"])):
        response = json.loads(fakenews_attn["response"].iloc[i])
        excerpt_qn_topic_list.append(response["Topic"])
        excerpt_qn_sgrelated_list.append(response["SingaporeRelated"])
    # To extract answers for reality belief questions (Fake - Real: -1 to 1, AI - Human: 0 - 1)
    for i in range(len(fakenews_ratings_reality["response"])):
        reality = json.loads(fakenews_ratings_reality["response"].iloc[i])
        if fakenews_ratings_reality["ticks_real"].iloc[0] == "Positive_Fake":
            excerpt_reality_realfake_list.append(reality["Reality"]*-1)
        else:
            excerpt_reality_realfake_list.append(reality["Reality"])
        if fakenews_ratings_reality["ticks_ai"].iloc[0] == "Positive_AI":
            excerpt_reality_humanai_list.append(round(1 - reality["Artificiality"],2))
        else:
            excerpt_reality_humanai_list.append(reality["Artificiality"])
    # To extract answers for appraisal questions
    for i in range(len(fakenews_ratings_appraisal["response"])):
        appraisal = json.loads(fakenews_ratings_appraisal["response"].iloc[i])
        excerpt_appraisal_importance_list.append(appraisal["Importance"])
        excerpt_appraisal_emotionality_list.append(appraisal["Emotionality"])
        excerpt_appraisal_engaging_list.append(appraisal["Engaging"])
        excerpt_appraisal_relevance_list.append(appraisal["Relevance"]) 

    # Dataframe for data_fakenews.csv
    fn = pd.DataFrame(columns=["Participant",
                               "Experiment_Duration",
                               "Date",
                               "Time",
                               "Browser",
                               "Mobile",
                               "Platform",
                               "Screen_Width",
                               "Screen_Height",
                               "PayNow_Code",
                               "Excerpt_Num",
                               "Excerpt_RT",
                               "Excerpt_AttenTopic",
                               "Excerpt_AttenSGRelated",
                               "Excerpt_Reality_FakeReal",
                               "Excerpt_Reality_HumanAI",
                               "Excerpt_Importance",
                               "Excerpt_Emotionality",
                               "Excerpt_Engaging",
                               "Excerpt_Relevance"])

    for i in range(len(excerpt_num_list)):
        new_row = {
            "Participant": file["name"],
            "Experiment_Duration": data["time_elapsed"].max() / 1000 / 60,
            "Date": browser["date"],
            "Time": browser["time"],
            "Browser": browser["browser"],
            "Mobile": browser["mobile"],
            "Platform": browser["os"],
            "Screen_Width": browser["screen_width"],
            "Screen_Height": browser["screen_height"],
            "PayNow_Code": paynow["stimulus"][-24:-16],
            "Excerpt_Num": excerpt_num_list[i],
            "Excerpt_RT": excerpt_viewingtime_list[i],
            "Excerpt_AttenTopic": excerpt_qn_topic_list[i],
            "Excerpt_AttenSGRelated": excerpt_qn_sgrelated_list[i],
            "Excerpt_Reality_FakeReal": excerpt_reality_realfake_list[i],
            "Excerpt_Reality_HumanAI": excerpt_reality_humanai_list[i],
            "Excerpt_Importance": excerpt_appraisal_importance_list[i],
            "Excerpt_Emotionality": excerpt_appraisal_emotionality_list[i],
            "Excerpt_Engaging": excerpt_appraisal_engaging_list[i],
            "Excerpt_Relevance": excerpt_appraisal_relevance_list[i]
        }
        # print(new_row)
        fn = fn.append(new_row, ignore_index=True)    

    # Merge ----------------------------------------------------------------
    alldata_sub = pd.concat([alldata_sub, df], axis=0, ignore_index=True)
    alldata_fakenews = pd.concat([alldata_fakenews, fn], axis=0, ignore_index=True)


# Save data ==============================================================
# Inspect
# alldata_sub["Ethnicity"].unique()

# Remove columns
# alldata_sub = alldata_sub.drop(
#     columns=[
#         "Time",
#         "Browser",
#         "Platform",
#         "Screen_Width",
#         "Screen_Height",
#     ]
# )

# # Reanonimize
# alldata_sub = alldata_sub.sort_values(by=["Date"]).reset_index(drop=True)
# correspondance = {j: f"S{i+1:03}" for i, j in enumerate(alldata_sub["Participant"])}
# alldata_sub["Participant"] = [correspondance[i] for i in alldata_sub["Participant"]]
# alldata_ig["Participant"] = [correspondance[i] for i in alldata_ig["Participant"]]

# # Save
alldata_sub.to_csv("./data/data_participants.csv", index=False)
alldata_fakenews.to_csv("./data/data_fakenews.csv", index=False)
print("Done!")
