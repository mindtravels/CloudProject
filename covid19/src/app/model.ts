export interface SummaryData{
    Global: GlobalData;
    Countries: Array<CountryData>;
    Date: Date;
}
export interface GlobalData {
    NewConfirmed: number;
    NewDeaths: number;
    NewRecovered: number;
    TotalConfirmed: number;
    TotalDeaths: number;
    TotalRecovered: number
}
export interface CountryData extends GlobalData {
    Country: string;
    CountryCode: string;
    Date: Date;
    Slug: string
}

export interface DayoneCountryData{
    Confirmed: number;
    Deaths: number;
    Recovered: number;
    Date: Date;
}
