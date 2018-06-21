import { Component,ViewChild } from '@angular/core';
import { Platform,ToastController,MenuController} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Network } from '@ionic-native/network';

import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { Events, NavController } from 'ionic-angular';
import { Menu } from '../models/Menu';
import { ServercallsProvider } from '../providers/servercalls/servercalls';
import { LoginInfo } from '../models/LoginInfo';
import { ReportsPage } from '../pages/reports/reports';
import {AppVersion} from '@ionic-native/app-version';

@Component({
  templateUrl: 'app.html'
})

export class cmApp {
  rootPage:any = LoginPage;
  //rootPage:any = ReportsPage;
  menu:Menu[];
  @ViewChild('content') nav:NavController;
  appName:any="";
  appVersion:any="";

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen,
    public event:Events,private rest:ServercallsProvider,
    public loginInfo:LoginInfo,private network:Network,private toast:ToastController,private menuCtrl:MenuController,
    private appversion:AppVersion) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();

      this.appversion.getVersionNumber().then(version=>{
        this.appVersion = version;
      })
      this.appversion.getAppName().then(appname=>{
        this.appName=appname;
      })
    });
    //Network status
    let disconnectSubscription = this.network.onDisconnect().subscribe(() => {
       let toast = this.toast.create({
           message: 'Network disconnected :-(',
           duration: 3000,
           position: 'bottom'
       });
       toast.present();
        console.log('Network disconnected :-(');
    });

    let connectSubscription = this.network.onConnect().subscribe(()=>{
      let toast = this.toast.create({
          message: 'Network Connected :-)',
          duration: 3000,
          position: 'bottom'
      });
      toast.present();
    });

    //Menu Subscription
    event.subscribe('menu:updated',(menu)=>{
      this.menu=menu;
    });
  }

  getSubmenu(menuItem){
    menuItem.selected=!menuItem.selected;

    // if(menuItem.childMenuItems===null || menuItem.childMenuItems.length===0){
    if(menuItem.childMenuItems!==null){
        this.rest.getSubMenuItems(menuItem.url).subscribe(
      (response)=>{
        let items=response.Reports,menuItems:Menu[]=[];
        for(let item of items){
          let sMenu:Menu=new  Menu(item.resId,item.name,false,item.url,null);
          menuItems.push(sMenu);
        }
        menuItem.childMenuItems=menuItems;
        // console.log(menuItem);
      },
      (error)=>{

      }
    );
  }
  }

  menuRouter(menuItem){
    this.nav.push(ReportsPage,menuItem);
    //console.log(menuItem);
  }

  logoutApp(){
      console.log("logout the app...");
      this.loginInfo.setToken = "";
      this.loginInfo.setAuthenticated=false;
      this.loginInfo.setUserId="";
      this.loginInfo.setOrgId=null;
      this.loginInfo.setMenu=[];
      this.loginInfo.setUserName="";

      this.menuCtrl.close();
      this.nav.setRoot(LoginPage);
  }

}
