import { Component, OnInit } from '@angular/core';
import { SummaryData, CountryData } from '../model';
import { Covid19Service } from '../covid19.service';
import { ChartType, ChartOptions, ChartDataSets } from 'chart.js';
import { SingleDataSet, Label, monkeyPatchChartJsLegend, monkeyPatchChartJsTooltip } from 'ng2-charts';
import { dashCaseToCamelCase } from '@angular/compiler/src/util';

// import { Label } from 'ng2-charts';
import { Color} from 'ng2-charts';

import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-worldwide',
  templateUrl: './worldwide.component.html',
  styleUrls: ['./worldwide.component.css']
})
export class WorldwideComponent implements OnInit {
  title = "Covid19-tracker";
  summaryData: SummaryData | undefined;
  countryData: Array<CountryData>| undefined
  last8day : any | undefined
  last8date : Array<string> | undefined
  cases8day : Array<number> | undefined
  deaths8day: Array<number> | undefined
  recovered8day: Array<number>| undefined
  // selectedCountryData: CountryData | undefined;
  pieChartOptions: ChartOptions | undefined;
  pieChartLabels: Label[] | undefined
  pieChartData: SingleDataSet | undefined;
  pieChartType: ChartType | undefined
  pieChartLegend : boolean | undefined
  pieChartPlugins: any | undefined ;
  pieChartReady: boolean | undefined

  barChartOptions: ChartOptions | undefined;
  barChartLabels: Label[] | undefined;
  barChartType: ChartType | undefined;
  barChartLegend: boolean | undefined;
  barChartPlugins: any | undefined;
  barChartReady: boolean | undefined;
  barChartData: ChartDataSets[] | undefined;

  lineChartData: ChartDataSets[] | undefined
  lineChartLabels: Label[] | undefined
  lineChartOptions: ChartOptions | undefined
  lineChartColors: Color[] | undefined
  lineChartLegend: boolean | undefined
  lineChartPlugins: any | undefined
  lineChartType: ChartType | undefined
  lineChartReady: boolean | undefined;

  date: Date | undefined;
  initDate : Date | undefined;
  lastCountDay: any | undefined;
  lastCountdate: Array<string> | undefined;
  lastCountcases: Array<number> | undefined;
  lastCountDeaths: Array<number> | undefined;
  lastCountRecovered: Array<number> | undefined;
  length: number | undefined;  
  
  constructor(public service: Covid19Service, public datepipe: DatePipe) {
    monkeyPatchChartJsTooltip();
    monkeyPatchChartJsLegend();
  }
  

  ngOnInit(): void { 
    this.getAllData();

    
    
  }
  getAllData(){
    this.service.getData().subscribe(
      response => {
        this.summaryData = response;
        console.log(this.summaryData?.Global);

        this.plotPieChart();
        this.getCountryData();
        this.plotLineChart()
        
      }
    )
    this.service.getData_daily().subscribe(
      response => { 
        this.last8day = response;
        // console.log(this.last7day)
        this.last8date = Object.keys(this.last8day["cases"])
        // console.log(this.last7date)
        this.cases8day = Object.values(this.last8day["cases"])
        // console.log(this.cases7day)
        this.deaths8day = Object.values(this.last8day["deaths"])
        // console.log(this.deaths7day)
        this.recovered8day = Object.values(this.last8day["recovered"])
        // console.log(this.recovered7day)
        this.plotBarChart();
      }
    )
  }

  getCountryData(){
    this.countryData = JSON.parse(JSON.stringify(this.summaryData?.Countries));
  }

  plotPieChart(){
    this.pieChartOptions = {
      responsive:true
    };
    this.pieChartData = [ this.summaryData?.Global.TotalDeaths, this.summaryData?.Global.TotalRecovered, 
      this.summaryData?.Global.TotalConfirmed - this.summaryData?.Global.TotalDeaths - this.summaryData?.Global.TotalRecovered];
    console.log(this.pieChartData)
    this.pieChartLabels = ["Dead Cases", "Recovered Cases", "Active Cases" ];
    this.pieChartType = 'pie';
    this.pieChartLegend = true;
    this.pieChartPlugins = [];
    this.pieChartReady = true;
  }
  plotBarChart(){
    var last7date = []
    var daily_death = []
    var daily_recovered = []
    var daily_cases = []
    var n = this.last8date.length;
    for (let i =1; i<n; i++){
      last7date.push(this.last8date[i])
      daily_death.push(this.deaths8day[i] - this.deaths8day[i-1]);
      daily_recovered.push(this.recovered8day[i] - this.recovered8day[i-1]);
      daily_cases.push(this.cases8day[i] - this.cases8day[i-1])
    }
    this.barChartOptions = {
      responsive: true
    };

    this.barChartData = [
      {data : daily_death, label: 'Daily Deaths'} , 
      {data: daily_recovered, label: 'Daily Recovered'},
      {data: daily_cases, label: 'Daily New Cases'}
    ];
    this.barChartLabels = last7date;
    this.barChartType = 'bar';
    this.barChartLegend = true;
    this.barChartPlugins = [];
    this.barChartReady = true;
  }

  plotLineChart(){
    // let TotalDeaths = []
    // let TotalCases = []
    // let TotalRecovered = []
    let count = 0 
    let date = new Date()
    // let lastest_date = this.datepipe.transform(this.date, "yyyy-MM-dd")
    // console.log(this.date)
    // let endDate = new Date();
    // endDate.setDate(date.getDate()-1)
    let initDate = new Date("2020-04-15")
    
    for (let d = initDate; d<= date; d.setDate(d.getDate()+1)){
      count = count + 1
    }
    console.log(count);
    this.service.getData_daily_1(String(count)).subscribe(
      response => {
        this.lastCountDay = response;
        this.lastCountdate = Object.keys(this.lastCountDay["cases"])
        console.log(this.lastCountdate)
        this.lastCountcases = Object.values(this.lastCountDay["cases"])
        this.lastCountDeaths = Object.values(this.lastCountDay["deaths"])
        this.lastCountRecovered = Object.values(this.lastCountDay["recovered"])
        this.length = Object.keys(this.lastCountDay["cases"]).length
        this.lineChartLabels = this.lastCountdate
        // let n = this.length
        // TotalCases.push(this.lastCountcases[0])
        // for(let i = 1; i<n; i++){
        //   this.lastCountcases[i] = this.lastCountcases[i-1] + this.lastCountcases[i];
        //   TotalCases.push(this.lastCountcases[i])
        // }
        // console.log(TotalCases)
        // TotalDeaths.push(this.lastCountDeaths[0])
        // for (let i = 1; i<n; i++){
        //   this.lastCountDeaths[i] = this.lastCountDeaths[i-1] + this.lastCountDeaths[i];
        //   TotalDeaths.push(this.lastCountDeaths[i])
        // }
        // TotalRecovered.push(this.lastCountRecovered[0])
        // for (let i = 1; i <n; i++){
        //   this.lastCountRecovered[i] = this.lastCountRecovered[i-1] + this.lastCountRecovered[i];
        //   TotalRecovered.push(this.lastCountRecovered[i])
        // }
        this.lineChartData = [
          {data : this.lastCountDeaths, label: "Total Deaths"},
          {data: this.lastCountRecovered, label : "Total Recovered"},
          {data: this.lastCountcases, label: "Total Cases"}
        ];
        this.lineChartOptions = {
          responsive : true,
        };
        this.lineChartLegend = true;
        this.lineChartPlugins = [];
        this.lineChartType = 'line';
        this.lineChartColors = [
          {
            borderColor: 'black',
            backgroundColor: 'rgba(255,255,0,0.28)',
          },
        ];
        this.lineChartReady = true;
      }
    )
  }
}
