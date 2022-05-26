export default class Team{
    static TEAM_FILE = 'https://raw.githubusercontent.com/com-480-data-visualization/datavis-project-2022-lebron-jenkins/master/data_web/teams_summary.csv';
    static TEAM_ABR_ON_LEFT = new Set(["POR","GSW","LAC","PHX","UTA","DEN","MIN","MIL","CHI","IND","DET","NYK","SAS","DAL","OKC","MEM","CLE"]);
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
