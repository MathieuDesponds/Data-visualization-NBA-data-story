# Milestone 1

## Data
Our data will be the [NBA games data](https://www.kaggle.com/datasets/nathanlauga/nba-games?select=ranking.csv). The data is very clean and contains information on the games of 2004 season to dec 2020.

There are five csv files :
- The games with statistics for both teams
- The details for each player in each game with his personal statistics
- The players with their teams for each season
- The ranking of the teams at a certain data
- The different teams and information about their staff

Therefore, we will not need much preprocessing and data-cleaning.

## Problematic

What conditions make a team successful? What makes player superior? Is there different strategies, trends in strategies?

We have the following ideas for our data visualization :
- Show on the US map the travels of a chosen team and relate it with its results
- Try to show a relation between the best scorers, rebounders of the league and the ranking of the team.
- Show when good players change teams and the impact they have on them.
- Show the ranking with a slider to change the date of the ranking

The target audience will be the NBA fans that love stats. Moreover, the movement on the map will be attractive.


## Exploratory Data Analysis
We made some exploratory data analysis and we got some insight on the data. Firstly, the number of points scored in a game and the number of games won is higher for hosting teams. Moreover, this difference is mostly explained in the 2 points shots than in the 3 points shots.

Then we looked at the statistics of players and saw the distribution on the minutes played and the precision of shots.

We were also able to reconstruct the rankings of a date and did a interesting relation between the wins of Cleveland and the fact that LeBron James was playing for them.

Finally, we looked at the foundation of the different teams.

You can find all our results in the [eda.ipynb](eda/eda_nb.ipynb) file.

## Related work
The database has already been use for
- simulation and prediction
- analyzing the importance of 3 points shots
- accessing stats of great players like Stephen Curry or Lebron James

Our approach will be original because most of the visualization would be on the US map. It will show how much distance each team has to do and the impact it can have on the performance of each teams.

We will take inspiration on some work that has been done on the Game of Thrones dataset where you can see the travel of different characters. The NHL and NFL datasets will also be a source of inspiration.
