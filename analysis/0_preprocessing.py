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
    after_date="15/01/2024",
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
    brower = data[data["screen"] == "browser_info"].iloc[0]

    df = pd.DataFrame(
        {
            "Participant": file["name"],
            # "Experimenter": brower["experimenter"],
            "Experiment_Duration": data["time_elapsed"].max() / 1000 / 60,
            "Date": brower["date"],
            "Time": brower["time"],
            "Browser": brower["browser"],
            "Mobile": brower["mobile"],
            "Platform": brower["os"],
            "Screen_Width": brower["screen_width"],
            "Screen_Height": brower["screen_height"],
        },
        index=[0],
    )

    # Demographics -------------------------------------------------------
    demo1 = data[data["screen"] == "demographics_1"].iloc[0]
    demo1 = json.loads(demo1["response"])

    df["Gender"] = demo1["gender"]
    df["Education"] = demo1["education"]

    demo2 = data[data["screen"] == "demographics_2"].iloc[0]
    demo2 = json.loads(demo2["response"])

    df["Age"] = demo2["age"]

    # Merge ----------------------------------------------------------------
    alldata_sub = pd.concat([alldata_sub, df], axis=0, ignore_index=True)


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
# alldata_sub.to_csv("../data/data_participants.csv", index=False)
# alldata_ig.to_csv("../data/data_IllusionGame_raw.csv", index=False)
# print("Done!")
