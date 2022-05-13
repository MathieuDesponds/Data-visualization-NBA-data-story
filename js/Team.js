class Team{
    constructor(name, id, abbreviation, lat, long){
        this.name = name;
        this.id = id;
        this.abbr = abbreviation;
        this.lat = lat;
        this.long = long;
    }

    static load_teams(){
      return d3.csv('https://raw.githubusercontent.com/com-480-data-visualization/datavis-project-2022-lebron-jenkins/master/data_web/teams_summary.csv',
       (data) => data.map(team => new Team(team["NICKNAME"], parseInt(team["TEAM_ID"]), team["ABBREVIATION"],parseInt(team["LATITUDE"]),parseInt(team["LONGITUDE"])))
    }
}

export default Team
