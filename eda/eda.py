import pandas as pd
import seaborn as sns
import plotly.express as px


# # The DataFrames


# +
import os

print(os.listdir("../data"))
PATH = "../data/{}.csv"
# -

games = pd.read_csv(PATH.format("games"))
details = pd.read_csv(PATH.format("games_details"))
players = pd.read_csv(PATH.format("players"))
ranking = pd.read_csv(PATH.format("ranking"))
teams = pd.read_csv(PATH.format("games"))

dfs = [[games, "games"], [details, "details"], [players, "players"], [ranking, "ranking"], [teams, "teams"]]

def show(df, name):
    print(f"> DataFrame {name} : ")
    display(df.head(5))

[show(df, name) for df, name in dfs];

# ### 1 - Games

# +
## do smthg
# -

# ### 2 - Details

# +
## do smthg
# -

# ### 3 - Rankings

# +
## do smthg
# -

# ### 4 - Teams

# +
## do smthg
# -

# ### 5 - Players

# +
## do smthg
# -

# # Lebron Jenkins, out
