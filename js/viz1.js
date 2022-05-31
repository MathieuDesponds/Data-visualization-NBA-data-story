import Team from './Team.js';
import {selector} from './viz1_selectors.js'
import {drawMap} from './viz1_map.js'

drawMap()
selector.showYearSelection()
d3.csv(Team.TEAM_FILE,(data) => {
  const teams = data.map(team => new Team(team))
  //selector.showTeamsCheckbox(teams)

  for (let i = 0; i < Team.MAX_NUMBER_OF_TEAMS; i++) {
    selector.showSelectorForTeams(teams,i)
  }
})
