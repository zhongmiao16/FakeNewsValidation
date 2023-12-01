import docx
import pandas as pd

df = pd.read_excel("raw_stimuli.xlsx")

document = docx.Document()
for index, row in df.iterrows():
    print(index)
    txt = df.loc[index, "Grammar-Corrected Response"]
    if pd.isnull(txt):
        continue
    document.add_heading(str(index), 0)
    document.add_paragraph(txt)
    document.add_page_break()

document.save("raw_stimuli.docx")
