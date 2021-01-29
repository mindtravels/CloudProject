import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import firebase from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth'
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { DatePipe } from '@angular/common'


@Injectable({
  providedIn: 'root'
})
export class Covid19Service {
  datepipe: any;
  constructor(private http: HttpClient, private afAuth: AngularFireAuth, private router: Router, private firestore: AngularFirestore) { }
  private url: string = "https://api.covid19api.com/summary";
  private url_daily: string = "https://corona.lmao.ninja/v2/historical/all?lastdays=8"
  private url_daily_base: string = "https://corona.lmao.ninja/v2/historical/all?lastdays="
  private url_dayone_country : string = "https://api.covid19api.com/total/dayone/country/"
  private date : Date
  getData(): Observable<any> {
    return this.http.get(this.url).pipe((response) => response);
  }
  getData_daily(): Observable<any> {
    return this.http.get(this.url_daily).pipe((response) => response);
  }
 
  getData_daily_1(count: String): Observable<any> {
    return this.http.get(this.url_daily_base + count).pipe((response) => response);
  }
  
  getData_dayone_country(country:String): Observable<any>{
    return this.http.get(this.url_dayone_country + country).pipe((response) => response);
  }
}

// constructor(public datepipe: DatePipe){}
// myFunction(){
//  this.date=new Date();
//  let latest_date =this.datepipe.transform(this.date, 'yyyy-MM-dd');
// }

