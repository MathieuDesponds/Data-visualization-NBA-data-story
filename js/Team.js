export default class Team{
    static TEAM_FILE = '../data_web/teams_summary.csv';
    static TEAM_ABR_ON_LEFT = new Set(["POR","GSW","LAC","PHX","UTA","DEN","MIN","MIL","CHI","IND","DET","NYK","SAS","DAL","OKC","MEM","CLE"]);
    static MAX_NUMBER_OF_TEAMS = 2;
    constructor(team){
        this.name = team["NICKNAME"];
        this.id = parseInt(team["TEAM_ID"]);
        this.city = team["CITY"];
        this.abbr = team["ABBREVIATION"];
        this.lat = parseInt(team["LATITUDE"]);
        this.long = parseInt(team["LONGITUDE"]);
    }

    coordinates(){
      return [this.long, this.lat]
    }
}
