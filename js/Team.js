export default class Team{
    static TEAM_FILE = 'https://raw.githubusercontent.com/com-480-data-visualization/datavis-project-2022-lebron-jenkins/master/data_web/teams_summary.csv';

    constructor(team){
        this.name = team["NICKNAME"];
        this.id = parseInt(team["TEAM_ID"]);
        this.abbr = team["ABBREVIATION"];
        this.lat = parseInt(team["LATITUDE"]);
        this.long = parseInt(team["LONGITUDE"]);
    }

    coordinates(){
      return [this.long, this.lat]
    }
}
