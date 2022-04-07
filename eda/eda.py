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

# +
## quick look at the different columns
display(games.columns)

## we set them in lower case because caps lock is lame
games.columns = [name.lower() for name in games.columns]
# -

## let's use datetime
games["date"] = pd.to_datetime(games.game_date_est)

f = plt.figure(figsize=(15, 6))
games["SEASON"] = pd.to_datetime(games.season.astype(str))
g = sns.histplot(data=games, x="SEASON", palette="viridis", binwidth=365)
g.set_title("distribution of the number of game per seasons")
g.set_ylabel("number of games")
g.set_xlabel("season");

g = sns.countplot(data=games, x="home_team_wins")
g.set_title("distribution of games won by hosting team")
g.set_xlabel("host team won")
g.set_ylabel("number of games");

## for home team
f, a = plt.subplots(figsize=(15, 6))
sns.histplot(data=games, x="pts_away", color="blue", label="visitor team", kde=True)
sns.histplot(data=games, x="pts_home", color="red", label="home team", kde=True)
plt.legend()
a.set_title("distribution of the number of points scored in a game")
a.set_ylabel("number of game")
a.set_xlabel("number of points");

# We can hypothesize right away that there is a significant difference in the number of points scored when **hosting** or visiting a game. Let's assess this with a **t test**:

# +
from scipy import stats

stats.ttest_ind(games.pts_away.dropna(), games.pts_home.dropna())
# -

# The p-value is $< 0.01$ so we can reject the null-hypothesis saying that these means are the same with a confidence of $99\%$.
#
#
# Here we assess the precision in the 3 points shoots between visitors and host teams :

# +
## 3 pts percentage

f = plt.figure(figsize=(15, 6))
sns.histplot(data=games, x="fg3_pct_away", color="blue", label="visitor team", kde=True)
sns.histplot(data=games, x="fg3_pct_home", color="red", label="home team", kde=True)
plt.legend()
# -

# Here, the same for 2 points shots

# +
## 2 pts percentage

f = plt.figure(figsize=(15, 6))
sns.histplot(data=games, x="fg_pct_away", color="blue", label="visitor team", kde=True)
sns.histplot(data=games, x="fg_pct_home", color="red", label="home team", kde=True)
plt.legend()


# -

# The precision is more different for normal shoots than for 3 points shoots.
#
# The dataset's feature `HOME_TEAM_WINS` is not very praticle if we need to compute it multiple times so we precompute the `winner_id`.

# +
def finds_winner(entry):
    if(entry["home_team_wins"]):
        return entry["home_team_id"]
    else :
        return entry["visitor_team_id"]

games["winner_id"] = games.apply(finds_winner, axis=1)
# -

## little check that it worked as intended
games[["home_team_id", "visitor_team_id", "home_team_wins", "winner_id"]].head()

## unecessary features
games = games.drop(["team_id_home", "game_status_text", "game_date_est"], axis=1)

# While we are preprocessing we are going to invistigate the `NaN` entries :

## entries with at least one NaN value
games[games.isna().sum(axis=1) != 0]

# These are the match that may have been won on "default wins". We decide to get rid of them.

games = games.dropna(how="any")

# We will study the relation between different features :

uninteresting_cols = ["home_team_id", "visitor_team_id", "season", "winner_id", "game_id", "date"]
sns.pairplot(data=games.drop(uninteresting_cols, axis=1), corner=True)

# **TODO** : write a few insights we get

# We store the cleaned dataset in the `data/preprocessed` directory.

games.to_csv("../data/preprocessed/games.csv")

# ### 2 - Details

details.columns = [name.lower() for name in details.columns]
details

details.describe()

# +
## obvious stat : the players have a lower precision on 3 points shoots than in the others

f, a = plt.subplots(figsize=(10, 4))
sns.histplot(details.groupby("player_id").mean(), x="fg3_pct", color="red", label="3 pts shoots", kde=True)
sns.histplot(details.groupby("player_id").mean(), x="fg_pct", label="shoots", kde=True)
a.set_title("precision percentage of shoots per player")
a.set_ylabel("number of players")
a.set_xlabel("precisions ration")
plt.legend();
# -

g = sns.histplot(details.groupby("player_name").pts.mean().reset_index()\
            .sort_values("pts", ascending=False).dropna())
g.set_title("Distribution of the mean number of points per game per player")
g.set_ylabel("number of players")
g.set_xlabel("mean number of points per game");

# +
f = plt.figure(figsize=(15, 7))
team_points = details.groupby('team_id').pts.mean().reset_index()\
            .sort_values("pts").dropna()\
            .merge(teams[["team_id", "name"]], on="team_id")

g = sns.barplot(data=team_points, x='name', y="pts")
g.set_xticklabels(g.get_xticklabels(), rotation=45)
g.set_title("mean number of points for every player in a team")
g.set_xlabel("name of the team")
g.set_ylabel("average number of points for every player in a team");

# +
f = plt.figure(figsize=(15, 5))
shoot = details.groupby("player_name").pts.mean().reset_index()\
            .sort_values("pts", ascending=False).head(20)

g = sns.barplot(data=shoot, x="player_name", y="pts")
g.set_xticklabels(g.get_xticklabels(), rotation=45)
g.set_title("mean points per match for the 20 bests players")
g.set_xlabel("mean number of points per match")
g.set_ylabel("player");
# -

details["min"] = details["min"].astype(str).apply(lambda x : float(x.split(":")[0]))

details.groupby("player_name")[["pts", "min"]].mean().reset_index()

fig = px.scatter(details.groupby("player_name")[["pts", "min"]].mean().reset_index(),\
                 x="pts", y="min", hover_data=['player_name'],\
                 labels={
                        "pts" : "mean points per match",
                        "min" : "average number of minutes played"
                }, \
                title="Relation between the average of time played and the number of points scored")
fig.update_layout(width=800, height=800)
fig.show()

tea

# +
f = plt.figure(figsize=(15, 5))
shoot = details.groupby("player_name").fg3m.mean().reset_index()\
            .sort_values("fg3m", ascending=False).head(20)

g = sns.barplot(data=shoot, x="player_name", y="fg3m")
g.set_xticklabels(g.get_xticklabels(), rotation=45)
g.set_title("mean points per match for the 20 bests players")
g.set_xlabel("mean number of points 3 points marked per match")
g.set_ylabel("player");
# -

details.columns

fig = px.scatter(details.groupby("player_name")[["fg3m", "fgm"]].sum().reset_index(),\
                 x="fg3m", y="fgm", hover_data=['player_name'],\
                 labels={
                        "fg3m" : "3 points shoot marked",
                        "fgm" : "2 points shoot marked"
                }, \
                title="Relation between the number of 3 points and 2 points shots marked")
fig.update_layout(width=800, height=800)
fig.show()

# This graph shows us that Lebron James has absolutely 0 ounce of chill.

g = sns.histplot(data=details, x="min", binwidth=3)
g.set_title("distribution of the number of ")
g.set_xlabel("minutes played")
g.set_ylabel("number of players");

## TODO : explain the investigation
details = details.drop(details[details["min"] == 96.0].index[0])

details.to_csv("../data/preprocessed/details.csv")

# ### 3 - Rankings

# +
ranking.columns = [name.lower() for name in ranking.columns]
ranking["standingsdate"] = pd.to_datetime(ranking.standingsdate)

## useless cols
ranking = ranking.drop(["league_id", "returntoplay"], axis=1)
ranking
# -

g = sns.countplot(data=ranking[ranking.standingsdate == "2020-12-21"], x="conference")
g.set_title("number of teams of each conference of the 12/21/2020");

f, a = plt.subplots(figsize=(16, 4))
plt.plot(ranking.groupby("standingsdate").count().team_id)

lebron_at_cleveland_years = list(range(2003, 2011)) + list(range(2014, 2019))
wins_cleveland = ranking[ranking.team == "Cleveland"][["standingsdate", "w"]].drop_duplicates()
wins_cleveland["Lebron_was_here"] = wins_cleveland.standingsdate.apply(lambda date : date.year in lebron_at_cleveland_years)
wins_cleveland = wins_cleveland.drop_duplicates().sort_values("standingsdate", ascending=True)
px.line(wins_cleveland, x="standingsdate", y="w", color="Lebron_was_here", labels={"w" : "wins for Cleveland", "standingsdate" : "date in the season", "Lebron_was_here" : "was Lebron playing at Cleveland ?"}, title="Impact of Lebron on Cleveland wins during a season")


# We have one ranking per day. We need to order the team for each of them to extrac the real ranking for each of them.

# +
def find_ranking(daily_scores):
    sub_sorted = daily_scores.sort_values("w", ascending=False).reset_index()
    sub_sorted["rank"] = sub_sorted.index + 1
    sub_sorted = sub_sorted.set_index("index")
    return sub_sorted
    
from senpy import notify_me


ranking = ranking.groupby("standingsdate").apply(lambda subdf : find_ranking(subdf))
notify_me("ranking computation done")
# -

ranking.to_csv("../data/preprocessed/rankings.csv")

# ### 4 - Teams
#
#
# This can helps add some data about the team later but isn't so useful by itself.

teams

## do smthg
display(teams[teams.TEAM_ID == 1610612744])
display(teams[teams.TEAM_ID == 1610612757])
teams.columns = [col.lower() for col in teams.columns]
teams["name"] = teams["city"] + " " + teams["nickname"]

teams.name.drop_duplicates()

sns.histplot(data=teams, x="YEARFOUNDED", binwidth=2)

# ### 5 - Players
#
#
# This dataset doesn't contain any new info so we won't use it.

players

# # Lebron Jenkins, out
