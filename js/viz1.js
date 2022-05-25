import Team from './Team.js';
import {showYearSelection, showPeriodForStatisticsSelection, showTeamsCheckbox} from './viz1_selectors.js'
import {drawMap, drawCities, drawPaths} from './viz1_map.js'

drawMap()
  .then(drawCities())
showYearSelection()

showPeriodForStatisticsSelection()

d3.csv(Team.TEAM_FILE,(data) => showTeamsCheckbox(data.map(team => new Team(team))))
