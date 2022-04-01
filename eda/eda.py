import pandas as pd
import seaborn as sns
import plotly.express as px
import matplotlib.pyplot as plt


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
teams = pd.read_csv(PATH.format("teams"))

dfs = [[games, "games"], [details, "details"], [players, "players"], [ranking, "ranking"], [teams, "teams"]]

def show(df, name):
    print(f"> DataFrame {name} : ")
    display(df.head(5))

[show(df, name) for df, name in dfs];

# ### 1 - Games
#
#
# One line per game. Giving the 
# - date
# - home team
# - visitor team

games.columns

games["date"] = pd.to_datetime(games.GAME_DATE_EST)

games["year"] = games.date.apply(lambda x : x.year)

year_counts

f, a = plt.subplots(figsize=(15, 6))
year_counts = pd.DataFrame(games.groupby("year").describe().iloc[:,0])
year_counts.columns = ["count"]
sns.barplot(data=year_counts.reset_index(), x="year", y="count")

## GAME_STATUS_TEXT can be droped
f = plt.figure(figsize=(15, 6))
games["SEASON"] = games.SEASON.astype(str)
sns.histplot(data=games, x="SEASON")

sns.countplot(data=games, x="HOME_TEAM_WINS")

## for home team
f = plt.figure(figsize=(15, 6))
sns.histplot(data=games, x="pts_away", color="blue", label="visitor team", kde=True)
sns.histplot(data=games, x="pts_home", color="red", label="home team", kde=True)
plt.legend()

# +
## 3 pts percentage

f = plt.figure(figsize=(15, 6))
sns.histplot(data=games, x="fg3_pct_away", color="blue", label="visitor team", kde=True)
sns.histplot(data=games, x="fg3_pct_home", color="red", label="home team", kde=True)
plt.legend()

# +
## 2 pts percentage

f = plt.figure(figsize=(15, 6))
sns.histplot(data=games, x="fg_pct_away", color="blue", label="visitor team", kde=True)
sns.histplot(data=games, x="fg_pct_home", color="red", label="home team", kde=True)
plt.legend()


# +
def finds_winner(entry):
    if(entry["HOME_TEAM_WINS"]):
        return entry["HOME_TEAM_ID"]
    else :
        return entry["VISITOR_TEAM_ID"]

games["winner_id"] = games.apply(finds_winner, axis=1)
# -

games[["HOME_TEAM_ID", "VISITOR_TEAM_ID", "HOME_TEAM_WINS", "winner_id"]]

games = games.drop(["TEAM_ID_home", "GAME_STATUS_TEXT", "GAME_DATE_EST"], axis=1)

games.columns = [name.lower() for name in games.columns]
games = games.drop(["team_id_way"], axis=1)
games

games[games.isna().sum(axis=1) != 0]

games = games.dropna(how="any")

games

interesting_cols = ["home_team_id", "visitor_team_id", "season", "winner_id", "game_id", "date"]
sns.pairplot(data=games.drop(interesting_cols, axis=1), corner=True)

# ### 2 - Details

details.columns = [name.lower() for name in details.columns]
details

details.describe()

f = plt.figure(figsize=(10, 4))
sns.histplot(details.groupby("player_id").mean(), x="fg3_pct", color="red", label="3 pts shoots", kde=True)
sns.histplot(details.groupby("player_id").mean(), x="fg_pct", label="shoots", kde=True)
plt.legend()

details["min"] = details["min"].astype(str).apply(lambda x : float(x.split(":")[0]))
sns.histplot(data=details, x="min", binwidth=3)

details = details.drop(details[details["min"] == 96.0].index[0])

# ### 3 - Rankings

ranking = pd.read_csv(PATH.format("ranking"))
ranking.columns = [name.lower() for name in ranking.columns]
ranking = ranking.drop(["league_id", "returntoplay"], axis=1)
ranking

sns.countplot(data=ranking[ranking.standingsdate == "2020-12-21"], x="conference")

# +
## do smthg

ranking.groupby("season_id").count().team
# -

ranking.standingsdate = pd.to_datetime(ranking.standingsdate)

f, a = plt.subplots(figsize=(16, 4))
plt.plot(ranking.groupby("standingsdate").count().team_id)

ranking[["standingsdate", "returntoplay"]].dropna()

f = plt.figure(figsize=(15, 4))
sns.lineplot(data=ranking[ranking.team == "Cleveland"][["standingsdate", "w"]], x="standingsdate", y="w")

# ### 4 - Teams

teams

## do smthg
display(teams[teams.TEAM_ID == 1610612744])
display(teams[teams.TEAM_ID == 1610612757])

sns.histplot(data=teams, x="YEARFOUNDED", binwidth=2)

# ### 5 - Players

## do smthg
players

# # Lebron Jenkins, out
