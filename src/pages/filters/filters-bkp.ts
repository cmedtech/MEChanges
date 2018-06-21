import { Component, OnInit, ViewChild, enableProdMode,Injectable } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController,ToastController,ViewController,AlertController } from 'ionic-angular';

import {ReportsPage} from '../reports/reports';

enableProdMode();

@Injectable()
@Component({
  selector: 'page-filters',
  templateUrl: 'filters.html',
})

export class FiltersPage implements OnInit{
  private  myStartDate:any;
  private  myEndDate:any;
  private minYear:any;
  private maxYear:any;
  private hitLocation:any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public loading:LoadingController, public toast:ToastController,public viewCtrl:ViewController,public alertCtrl:AlertController) {

  }
  ngOnInit(){
    console.log("ngOnInit() of FiltersPage....");
    console.log("this.navParams >>",this.navParams.data);
    this.maxYear = Math.max.apply(null, this.navParams.data.filterYears);
    this.minYear = Math.min.apply(null, this.navParams.data.filterYears);
    this.hitLocation = this.navParams.data.hitLocation;
    
    if(changedDuration.myStartDate && this.hitLocation!=="Dashboard"){//incase once date values choosen from picker then next time we can use//
      this.myStartDate=changedDuration.myStartDate;
    }
    if(changedDuration.myEndDate && this.hitLocation!=="Dashboard"){
      this.myEndDate = changedDuration.myEndDate;
    }
    //to dispaly default dates in picker//
    if(this.myStartDate=='undefined'|| this.myStartDate==undefined){
      this.myStartDate= new Date().toISOString();
    }
    // if(this.myEndDate=='undefined'||this.myEndDate==undefined){
    //    this.myEndDate= new Date(new Date().setFullYear(new Date().getFullYear()-1)).toISOString();
    // }
  }

  DateRangeSubmit(){
    console.log("DateRangeSubmit....");
    // console.log(this.myStartDate);
    // console.log(this.myEndDate);
    if(this.myStartDate==undefined || this.myEndDate==undefined){
      this.showAlert('',"Please select valid periods");
    }else{
    let firstdate:any[] = this.myStartDate.split('-');
    let seconddate:any[]=this.myEndDate.split('-');

    changedDuration.firstyear=firstdate[0];
    changedDuration.firstmonth = this.getMonthText(firstdate[1]);
    changedDuration.secondyear=seconddate[0];
    changedDuration.secondmonth=this.getMonthText(seconddate[1]);
    changedDuration.url=this.navParams.data.reportItem.menuUrl;
    changedDuration.id=this.navParams.data.reportItem.menuId;
    changedDuration.menuLabel=this.navParams.data.reportItem.menuLabel;
    changedDuration.isPeriodChanged=true;
    changedDuration.myStartDate=this.myStartDate;//used to show next time in date picker//
    changedDuration.myEndDate=this.myEndDate;

    this.viewCtrl.dismiss(changedDuration);
    // this.navCtrl.push(ReportsPage,changedDuration);
    }
  }
  getMonthText(monthval):string{
    let val = Number(monthval);
    return monthsArray[val-1];
  }
  dismiss() {
    this.viewCtrl.dismiss();
  }
  showAlert(title,message){
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: message,
      buttons: ['OK']
    });
    alert.present();
  }
}

//for geting month names from filter selected month number //
let monthsArray=["JANUARY ","FEBRUARY ","MARCH","APRIL ","MAY ","JUNE ","JULY ","AUGUST ","SEPTEMBER","OCTOBER ","NOVEMBER","DECEMBER"];
//for parameters labels for filter and isPeriodChanged is used for change the api url for report//
export var changedDuration={"firstyear":"","firstmonth":"","secondyear":"","secondmonth":"","url":"","id":"","isPeriodChanged":false,"menuLabel":"","myStartDate":"","myEndDate":""};
