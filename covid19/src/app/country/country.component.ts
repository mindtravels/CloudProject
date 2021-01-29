import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {CountryData, SummaryData, DayoneCountryData} from '../model'
import { Covid19Service } from '../covid19.service';
import { __param } from 'tslib';
import { ChartType, ChartOptions, ChartDataSets } from 'chart.js';

import { SingleDataSet, Label, monkeyPatchChartJsLegend, monkeyPatchChartJsTooltip } from 'ng2-charts';
import { Color} from 'ng2-charts';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.css']
})
export class CountryComponent implements OnInit {

  selectedCountry: String | undefined
  countryData: CountryData | undefined
  summaryData: SummaryData | undefined
  sub: any | undefined
  commulativeCountryData: Array<DayoneCountryData> | undefined

  pieChartOptions: ChartOptions | undefined;
  pieChartLabels: Label[] | undefined
  pieChartData: SingleDataSet | undefined;
  pieChartType: ChartType | undefined
  pieChartLegend : boolean | undefined
  pieChartPlugins: any | undefined ;
  pieChartReady: boolean | undefined

  barChartOptions: ChartOptions ;
  barChartLabels: Label[] ;
  barChartData: ChartDataSets[] ;
  barChartType: ChartType ;
  barChartLegend : boolean ;
  barChartPlugins: any ;
  barChartReady: boolean ;

  lineChartData: ChartDataSets[] | undefined
  lineChartLabels: Label[] | undefined
  lineChartOptions: ChartOptions | undefined
  lineChartColors: Color[] | undefined
  lineChartLegend: boolean | undefined
  lineChartPlugins: any | undefined
  lineChartType: ChartType | undefined
  lineChartReady: boolean | undefined;

  constructor(private route : ActivatedRoute, public service: Covid19Service, public datepipe: DatePipe) { }

  ngOnInit(): void {
    this.sub = this.route.params.subscribe(params => {this.selectedCountry = params["slug"];})
    // console.log(this.selectedCountry)
    this.getAllData()
    this.getDayoneCountryData()
  }

  getAllData(){
    this.service.getData().subscribe(
      response => {
        this.summaryData = response;
        this.countryData = this.summaryData.Countries.find(country => country.Slug == this.selectedCountry);
        console.log(this.countryData);
        console.log(this.selectedCountry)
        this.plotPieChart();
      }
    )  
  }
  plotPieChart(){
    this.pieChartOptions = {
      responsive:true
    };
    this.pieChartData = [ this.countryData?.TotalDeaths, this.countryData?.TotalRecovered, 
      this.countryData?.TotalConfirmed - this.countryData?.TotalDeaths - this.countryData?.TotalRecovered];
    console.log(this.pieChartData)
    this.pieChartLabels = ["Dead Cases", "Recovered Cases", "Active Cases" ];
    this.pieChartType = 'pie';
    this.pieChartLegend = true;
    this.pieChartPlugins = [];
    this.pieChartReady = true;
  }
  // plotBarChart(){
  //   var count = 0;
  //   var date = new Date();
  //   // console.log(date)
  //   var initDate = new Date(Date.now() - (7 * 24 * 60 * 60 * 1000));
  //   // console.log(initDate)
  //   for (let d = initDate; d<= date; d.setDate(d.getDate()+1)){
  //     this.barChartLabels.push(d)
  //   }

  // }

  getDayoneCountryData(){
    this.service.getData_dayone_country(this.selectedCountry).subscribe(
      response => {
        this.commulativeCountryData = response;
        // console.log(this.commulativeCountryData[0]);

        this.plotBarChart();
        this.plotLineChart();
      }
    ) 
  }
  plotBarChart(){
    var n = this.commulativeCountryData.length;
    var barChartLabelss = [];
    var Deaths = [];
    var Recovered = [];
    var Confirmed = [];
    for(let i = n-8; i<n; i++){
      barChartLabelss.push(this.datepipe.transform(this.commulativeCountryData[i].Date).split(',')[0]);
      Deaths.push(this.commulativeCountryData[i].Deaths - this.commulativeCountryData[i-1].Deaths);
      Recovered.push(this.commulativeCountryData[i].Recovered - this.commulativeCountryData[i-1].Recovered);
      Confirmed.push(this.commulativeCountryData[i].Confirmed - this.commulativeCountryData[i-1].Confirmed)
    }
    this.barChartLabels = barChartLabelss
    this.barChartData = [
      {data: Deaths, label: "Daily Deaths"},
      {data: Recovered, label: "Daily Recovered"},
      {data: Confirmed, label: "Daily New Cases"}
    ];
    this.barChartOptions = {
      responsive: true
    };
    this.barChartType = 'bar';
    this.barChartLegend = true;
    this.barChartPlugins = [];
    this.barChartReady = true;
  }
  plotLineChart(){
    var n = this.commulativeCountryData.length;
    var lineChartLabelss = []
    var TotalDeathss= []
    var TotalRecovereds = []
    var TotalCasess = []
    for (let i = 0; i<n; i++){
      lineChartLabelss.push(this.datepipe.transform(this.commulativeCountryData[i].Date).split(',')[0]);
      TotalDeathss.push(this.commulativeCountryData[i].Deaths);
      TotalRecovereds.push(this.commulativeCountryData[i].Recovered);
      TotalCasess.push(this.commulativeCountryData[i].Confirmed)
    }
    this.lineChartLabels = lineChartLabelss;
    this.lineChartData = [
      {data : TotalDeathss, label: "Total Deaths"},
      {data: TotalRecovereds, label: "Total Recovered"},
      {data: TotalCasess, label: "Total Cases"}
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
}
