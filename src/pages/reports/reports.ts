import { Component, OnInit, ViewChild, enableProdMode } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides, LoadingController,ToastController,ModalController,ViewController,AlertController } from 'ionic-angular';
import { Searchbar } from 'ionic-angular';
import { ServercallsProvider } from '../../providers/servercalls/servercalls';
import {AppServicesProvider} from '../../providers/app-services/app-services';
import { AnalyticsCardComponent } from '../../components/analytics-card/analytics-card';
import {FiltersPage} from '../filters/filters';
import {LoginInfo} from '../../models/LoginInfo';
import {LoginPage} from '../login/login';
import 'rxjs/add/operator/debounceTime';


enableProdMode();
@Component({
  selector: 'page-reports',
  templateUrl: 'reports.html',
})
export class ReportsPage implements OnInit{

  public facilities=[];
  public cards=[];
  public searchBar=false;
  private progress;
  @ViewChild('slides') slide:Slides;

  //added //
  public myreports:any;
  private blockName:string;
  public lastindex:any=0;//to capture araging card last index stopped//
  public counter=0;
  public slidechng:any=false;
  public blockData:any;
  // public floatingIcon=false;//to display floating icon//
  public calendarIcon=false;//to display calendar icon in toolbar//
  public isPeriodChanged=false;//for month change //
  public fromFilterParams:any;

  // rawData1:any;
  rawData2:any;
  showNext:boolean = true;//slide move icons//
  showPrevious:boolean=false;
  len:any;
  totalRecords:any[] =[];
  filteryears:any=[];
  isFromDashboard:any;
  searchIcon:boolean=false;

  //for search cancel related//
  isSearchCleared:boolean=false;
  shouldShowCancel:boolean=false;
  isAtSearch:boolean=false;
  searchTerm:any;
  previousIdxObj:any;//to hold previousslide idx //
  goToIddx:any;
  @ViewChild('mySearchBar') mySearchBar:Searchbar;
  searchBarText:any;

  activeIdx:any;

  /**For Dynamic Loading of slides*/
  page:any=[];
  pageSize:number=5;
  pageCount:number=0;
  activePage:number=1;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public rest:ServercallsProvider,public loading:LoadingController,public appservice:AppServicesProvider,
    public toast:ToastController,public modalCtrl: ModalController,
    public alertCtrl:AlertController,public loginInfo:LoginInfo) {
      //  console.log(navParams);
    }

    ionViewDidLoad() {
      // console.log("View loaded...");
    }

    getTotalPracticeCards(reports) {
      let cards=[];
      if(!reports || reports.length===0){
        return cards;
      }
      for(let report in reports){
        let card = {"facilityName":"","reports":[]};
        let reportData=reports[report];
        if(reportData.facility){
          card.facilityName = reportData.facility;
          reportData.data && reportData.data.forEach(function(obj){
            let rpt = {"reportTitle":"","comparisionPeriod":"","currentTimePersion":"","trend":"","percentage":"","actValueFrst":"","actValueSecnd":""};
            rpt.reportTitle = obj.sub_title;
            rpt.comparisionPeriod = obj.time_period;
            rpt.currentTimePersion = obj.summary[0].percentage.label;
            rpt.trend = obj.summary[0].percentage.Sign;
            rpt.percentage = obj.summary[0].percentage.value;
            rpt.actValueFrst = obj.summary_details[0].value;
            rpt.actValueSecnd = obj.summary_details[1].value;
            card.reports.push(rpt);
          });
          cards.push(card);
        }
      }
      this.totalRecords = cards;
      console.log("total: ");
      console.log(this.totalRecords);
      return cards;
    }

    showAlert(title,message){
      let alert = this.alertCtrl.create({
        title: title,
        subTitle: message,
        buttons: ['OK']
      });
      alert.present();
    }
    presentAlert(title,message) {
      let alert = this.alertCtrl.create({
        title: title,
        message: message,
        buttons: [
          {
            text: 'OK',
            handler: () => {
              this.logoutService();
            }
          }
        ]
      });
      alert.present();
    }
    logoutService(){
        this.loginInfo.setToken = "";
        this.loginInfo.setAuthenticated=false;
        this.loginInfo.setUserId="";
        this.loginInfo.setOrgId=null;
        this.loginInfo.setMenu=[];
        this.loginInfo.setUserName="";

        this.navCtrl.setRoot(LoginPage);
    }
    ngOnInit(){
      this.setReportState();
    }

    setReportState(){
      this.progress = this.loading.create({
        content: 'Loading data. Please wait...'
      });
      this.progress.present();
      this.cards = [];
      this.isFromDashboard = this.appservice.getHitLocation();

      if(!(this.isPeriodChanged)){//added condition to check month filter changed or not//
        this.rest.getReportData(this.navParams.data.url,this.navParams.data.id).subscribe(
          (data)=>{
            this.prepareDashboard(data);
            this.progress.dismiss();
          },
          (error)=>console.log(error)
        );
      }else{//added new mothod to filter by month //
        //fromFilterParams is the navParams return from filter modal page //
        this.rest.getFilterData(this.fromFilterParams.url,this.fromFilterParams.id,this.fromFilterParams.firstyear,this.fromFilterParams.firstmonth,this.fromFilterParams.secondyear,this.fromFilterParams.secondmonth).subscribe(
          (data)=>{
            this.prepareDashboard(data);
            console.log("Prevoious object:");
            console.log(this.previousIdxObj);
            let idx:number=this.searchStringInArray(this.previousIdxObj.prevFacility,this.totalRecords);
            console.log("after date data idx: ",idx);
            this.setView(idx);
            this.progress.dismiss();
          },
          (error)=>{console.log(error);this.progress.dismiss();}

        );
      }
    }

    prepareDashboard(data) {
      // console.log("prepareDashboard>>>>");

      if(((data['Drill Details']))){
        // console.log("(data['Drill Details'])[0] >>>");
        // console.log((data['Drill Details'])[0]);
        this.blockName=((data['Drill Details'])[0]).name;//for use in slidechanged//

        // if(((data['Drill Details'])[0]).name=="AR Aging" || ((data['Drill Details'])[0]).name=="Payment Lag Report"){
        if(((data['Drill Details'])[0]).name != "Practice Vitals"){
          this.blockData=data['Drill Details'][0]['report_details'];//for use in slidechanged//
          this.getTotalARAgingCards(this.blockData);
          this.preparePages();
          this.initCards();
          this.calendarIcon=false;

        }
      }else{
        let reports=data['report_details'];
        this.myreports=reports;//added to use in slidechange//
        if(reports)
        this.getTotalPracticeCards(reports);

        if(data['report_details']){
          this.filteryears = this.getCalendarYears(data['report_details']);//used to get the year and months to show in date picker filter//
        }
        if(this.totalRecords.length>0 && this.totalRecords[0].facilityName){
          this.preparePages();
          this.initCards();
        }else{
          this.presentAlert("","No results available to display. Please re-login to load data.");
        }
        this.calendarIcon=true;

      }//else//
    }//method end//

    findObjectIndexByKey(array, key, value) {
      for (var i = 0; i < array.length; i++) {
        if (array[i][key] === value) {
          return i;
        }
      }
      return null;
    }

    private initializeFacilities(){
      this.facilities=[];
      for(let card of this.totalRecords){
        this.facilities.push(card.facilityName);
      }
      // console.log("facilities: ",this.facilities);
    };

    getItems(ev:any){
      this.progress = this.loading.create({
            content: 'Loading data. Please wait...'
          });

      let idx:number=-1;
      let searchVal:string;

      if(ev && ev.target)
       searchVal= ev.target.value;

      if(searchVal && searchVal!=undefined){
        idx=this.searchStringInArray(searchVal,this.totalRecords);
      }else{
        // console.log("........");
      }
      if(idx<0 && searchVal!=undefined){//show toast msg incase no match found on search//
            let toast = this.toast.create({
              message: 'No match found',
              duration: 2000,
              position: 'center'
            });
            toast.present();
      }else if(searchVal===undefined){

      }else{
        this.setView(idx);
      }
      // console.log("Dismissing progress");
      this.progress.dismiss();
    }


    setView(idx:number){

      this.progress.present();
    //  let idx:number=this.searchStringInArray(ev.target.value,this.totalRecords);
      let page:number=this.getPageForIdx(idx);
      let pageIdx:number=this.getPageIdxForIdx(idx);
      // console.log("Index from totalRecords:"+idx);
      // console.log("Page number:"+page);
      // console.log("Page idx in page:"+pageIdx);
      this.cards=[];
      this.activePage=page;
      // console.log("Active Page:"+this.activePage);
      this.page=this.getPageElements(this.activePage);
      console.log("page>>: ",this.page);
      for(var i=0;i<this.page.length;i++){
        this.cards.push(this.page[i]);
      }
      // console.log(this.cards);
      if(pageIdx==0){
        let nextPage = this.getPageElements(this.activePage+1);
        for(var i=0;i<nextPage.length;i++){
          this.cards.push(nextPage[i]);
        }
        pageIdx=pageIdx+(nextPage.length-1);
      }else if(pageIdx>=1 && pageIdx<this.pageSize-1 && this.activePage==this.pageCount){
        let prevPage = this.getPageElements(this.activePage-1);
        for(let i=prevPage.length;i>0;i--){
          this.cards.unshift(prevPage[i-1]);
        }
        pageIdx=prevPage.length+(pageIdx-1);
      }else if(pageIdx==(this.pageSize-1)){
        let prevPage = this.getPageElements(this.activePage-1);
        for(let i=prevPage.length;i>0;i--){
          this.cards.unshift(prevPage[i-1]);
        }
        pageIdx=prevPage.length+(pageIdx-1);
      }else{
        pageIdx=pageIdx-1;
      }

      this.slide._activeIndex=pageIdx;
      this.slide.update();
      setTimeout(()=>this.slide.slideTo((pageIdx),200,true),200);

    }

    searchStringInArray (str, strArray) {
      for (var j=0; j<strArray.length; j++) {
        if (strArray[j] && strArray[j].facilityName && str && strArray[j].facilityName.toLowerCase().startsWith(str.toLowerCase())) return j;
      }
      return -1;
    }


    onSearchClear(event){
      this.isSearchCleared= !this.isSearchCleared;
    }
    onCancel(event){
      this.toggleSearchBar();
      this.isSearchCleared= !this.isSearchCleared;
    }
    toggleSearchBar(){
      this.searchBar=!this.searchBar;
      // console.log(".......clear search input....");
      this.mySearchBar.clearInput(null);

    }
    presentFilterModal() {//For Month Filter Modal page //
      // console.log("presentfiltermodal....");
      let filterParams ={"reportItem":this.navParams.data,"filterYears":this.filteryears,"hitLocation":this.isFromDashboard};
      let filterOpts={"showBackdrop":true,"enableBackdropDismiss":true};
      let filterModal = this.modalCtrl.create(FiltersPage, filterParams,filterOpts);
      let currentIdx = this.slide.getActiveIndex();

      this.previousIdxObj = {"prevIdx":"","prevFacility":""};//used for previous facility//
      this.previousIdxObj.prevIdx = this.slide.getActiveIndex();
      // console.log("cards >>>>",this.cards);
      if(this.cards && this.cards.length>1 && this.cards[this.previousIdxObj.prevIdx]){
        this.previousIdxObj.prevFacility= this.cards[this.previousIdxObj.prevIdx].facilityName;
      }
      // console.log("previousIdxObj: ",this.previousIdxObj);

      filterModal.onDidDismiss(data => {//called while closing the filter modal page//
        if(data && data!=undefined && data!=null){//check if the retuned data params from modal is valid//
          this.fromFilterParams = data;
          if(data.isPeriodChanged){//added to filter by month //
            this.isPeriodChanged=data.isPeriodChanged;
          }
          this.appservice.setHitFromLocation("DateFilter");

          // this.cards=[];//to refresh the report page on close or submit modal page//
          this.setReportState();
        }
      });
      filterModal.present();
    }
    getCardsList(){
      // console.log("GetCardsList >> length: ",this.cards.length);
      return this.cards;
    }

    getTotalARAgingCards(data:any){
      let tmp:any={};
      let cards=[];
      this.totalRecords=[];//added//

      data.forEach(function(value,i){
        var rpt = {"reportTitle":"","comparisionPeriod":"","currentTimePersion":"","trend":"","percentage":"","actValueFrst":"","actValueSecnd":"","reportType":"aging"};
        if(i>0){
          //card.facilityName=value.name;
          if(tmp[value[0].name]){
            let card=tmp[value[0].name];
            rpt.reportTitle=value[1].name;
            rpt.actValueSecnd=value[2].name;
            rpt.percentage=value[3].name;
            card.reports.push(rpt);
          }else{
            let card = {"facilityName":"","reports":[]};
            card.facilityName=value[0].name;
            rpt.reportTitle=value[1].name;
            rpt.actValueSecnd=value[2].name;
            rpt.percentage=value[3].name;
            card.reports.push(rpt);
            cards.push(card);
            tmp[value[0].name]=card;

          }
        }
      });
      this.totalRecords=cards;
    }
    getCalendarYears(data){//to get the filter years //
      // console.log("getCalendar years: ",data);
      let yearValues:any=[];
      if(data){
        if(data[0].filters && data[0].filters.length>0){
          let dateValuesFromReport=data[0].filters[0].data;
          let showInCalendarObj:any={};
          dateValuesFromReport.forEach((item)=>{
            yearValues.push(item.name);
          });
        }else{
          yearValues=["2016","2017","2018","2019"];
        }
      }else{
        yearValues=[];
      }
      return yearValues;
    }

    initCards(){
      // console.log("initCards....");
      this.page=this.getPageElements(this.activePage);
      this.cards=[];
      for(var i=0;i<this.page.length;i++){
        this.cards.push(this.page[i]);
      }
      // console.log("Initial set of cards:")
      // console.log(this.cards);

    }

    next(){
      this.progress = this.loading.create({
        content: 'Loading data. Please wait...'
      });
      if(this.cards[this.slide.getActiveIndex()] && this.cards[this.slide.getActiveIndex()].facilityName ){
        let elementIdx=this.searchStringInArray(this.cards[this.slide.getActiveIndex()].facilityName,this.totalRecords);
        this.activePage=this.getPageForIdx(elementIdx);
      }
      // console.log("Evaluated active page:"+this.activePage);

      if(this.slide.isEnd() && this.activePage<this.pageCount){
        let prevPage = this.getPageElements(this.activePage);
        // console.log("Previous Page:");
        // console.log(prevPage);
        this.progress.present();
        this.activePage++;
        // console.log("Active Page:"+this.activePage);
        this.page=this.getPageElements(this.activePage);
        this.cards=[];
        for(var i=0;i<this.page.length;i++){
          this.cards.push(this.page[i]);
        }

        for(let i=prevPage.length;i>0;i--){
          this.cards.unshift(prevPage[i-1]);
        }
        this.slide._activeIndex=3;
        this.slide.update();
        setTimeout(()=>this.slide.slideTo(4,0,true),100);

      }
      this.progress.dismiss();
      // console.log(this.cards);
    }

    prev(){
      this.progress = this.loading.create({
        content: 'Loading data. Please wait...'
      });
      if(this.cards[this.slide.getActiveIndex()] && this.cards[this.slide.getActiveIndex()].facilityName ){
        let elementIdx=this.searchStringInArray(this.cards[this.slide.getActiveIndex()].facilityName,this.totalRecords);
        this.activePage=this.getPageForIdx(elementIdx);
      }

      console.log("Evaluated active page:"+this.activePage);

      if(this.slide.isBeginning() && this.activePage>1 && this.activePage<this.pageCount){
        console.log("Prev ...");
        let nextPage = this.getPageElements(this.activePage);
        this.progress.present();
        this.activePage--;
        this.page=this.getPageElements(this.activePage);
        this.cards=[];
        this.cards=this.page;
        for(var i=0;i<nextPage.length;i++){
          this.cards.push(nextPage[i]);
        }

        console.log(this.cards);
        this.slide._activeIndex=5;

        this.slide.update();
        // console.log("Slide to:");
        setTimeout(()=>this.slide.slideTo(5,0,true),100);

      }
      this.progress.dismiss();
    }

    reachedStart(){
      console.log("Reached Start");
      // if(this.activePage>1){
      //   this.prev();
      // }
    }

    reachedEnd(){
      console.log("Reached End");
      // if(this.activePage<this.pageCount)
      //   this.next();
    }


    preparePages(){
      this.pageCount=Math.ceil(this.totalRecords.length/this.pageSize);
    }


    getPageElements(pageNo:number){
      let strtIdx:number=(pageNo*this.pageSize-this.pageSize);
      let endIdx:number =(strtIdx+this.pageSize-1)<this.totalRecords.length?(strtIdx+this.pageSize):this.totalRecords.length;
      console.log("Start "+strtIdx+" and endIdx "+endIdx+" for page "+pageNo);
      return this.totalRecords.slice(strtIdx,endIdx);
    }

    getPageForIdx(idx:number){
      console.log("Evaluating Page Number for element "+idx);
      idx=idx+1;//index starts from 0 hence the correction
      return Math.ceil(idx/this.pageSize)==0?1:Math.ceil(idx/this.pageSize);
    }

    getPageIdxForIdx(idx:number){
      return (idx+1)%this.pageSize;
    }

    padCards(){
      if(this.activeIdx==(this.pageSize-1)){

      }

    }

  }
