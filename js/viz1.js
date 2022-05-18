import Team from './Team.js';
import {showYearSelection, showPeriodForStatisticsSelection, showTeamsCheckbox} from './viz1_selectors.js'

showYearSelection()

showPeriodForStatisticsSelection()

d3.csv(Team.TEAM_FILE,(data) => showTeamsCheckbox(data.map(team => new Team(team))))
