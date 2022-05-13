export default class Team{
    static TEAM_FILE = 'https://raw.githubusercontent.com/com-480-data-visualization/datavis-project-2022-lebron-jenkins/master/data_web/teams_summary.csv';

    constructor(name, id, abbreviation, lat, long){
        this.name = name;
        this.id = id;
        this.abbr = abbreviation;
        this.lat = lat;
        this.long = long;
    }

    coordinates(){
      return [this.long, this.lat]
    }
}
