import Team from './Team.js';
import {showYearSelection, showPeriodForStatisticsSelection, showTeamsCheckbox} from './viz1_selectors.js'
import {drawCities, drawPaths} from './viz1_map.js'

drawCities()
drawPaths()
showYearSelection()

showPeriodForStatisticsSelection()

d3.csv(Team.TEAM_FILE,(data) => showTeamsCheckbox(data.map(team => new Team(team))))
