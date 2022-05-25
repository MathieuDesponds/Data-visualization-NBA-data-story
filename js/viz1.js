import Team from './Team.js';
import Viz1Selector from './viz1_selectors.js'
import {drawMap, drawCities, drawPaths} from './viz1_map.js'

drawMap()
  .then(drawCities())
var selector = new Viz1Selector()
selector.showYearSelection()
selector.showPeriodForStatisticsSelection()
d3.csv(Team.TEAM_FILE,(data) => selector.showTeamsCheckbox(data.map(team => new Team(team))))
