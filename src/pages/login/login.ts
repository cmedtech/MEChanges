import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { AppServicesProvider } from '../../providers/app-services/app-services';
import { LoginInfo } from '../../models/LoginInfo';
import { HomePage } from '../home/home';
import { Menu } from '../../models/Menu';
import { Events } from 'ionic-angular';
import {Localstorage} from '../../providers/storage/localstorage';

/**
 * Generated class for the LoginPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
//@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'loginPage.html'
})
export class LoginPage {

  private progress;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public rest:AppServicesProvider,public loginInfo:LoginInfo
    ,public event:Events,public loading:LoadingController,public toast:ToastController,
    private localstorage:Localstorage) {

  }

  login(loginForm:NgForm){

  // let tst = this.toast.create({
  //   message: 'User was added successfully',
  //   duration: 3000,
  //   position: 'top'
  // });
  //   tst.present();
    this.progress = this.loading.create({
      content: 'Please wait...'
    });
    if(this.loginInfo.isAuthenticated){
      console.log("User already authenticated");
      // this.localstorage.getLoginInfo();
      this.navCtrl.setRoot(HomePage);
    }else{
      this.progress.present();
      this.rest.authenticate(loginForm.form.controls.Username.value,loginForm.form.controls.password.value)
      .subscribe(
        (response)=>this.formatAuthenticationResponse(response),
        (error)=>{
            let toast = this.toast.create({
              message: 'Login Failed ! Please check network connectivity.',
              duration: 3000,
              position: 'bottom'
          });
          this.progress.dismiss();
          toast.present();
        }
      );
    }
  }

  private formatAuthenticationResponse(responseJson:any):void{
    //this.loginInfo=new LoginInfo();
    if(responseJson.status==="false"){
      this.progress.dismiss();
      let toast = this.toast.create({
        message: responseJson.message,
        duration: 3000,
        position: 'bottom'
    });
    toast.present();
    return;
    }
    this.loginInfo.setOrgId=responseJson.orgId;
    this.loginInfo.setUserName=responseJson.userName;
    this.loginInfo.setMenu=this.createMenu(responseJson);
    this.loginInfo.setUserId=responseJson.userId;
    this.loginInfo.setToken=responseJson.token;
    this.loginInfo.setAuthenticated=true;
    //console.log(this.loginInfo);

    this.localstorage.setLoginInfo(this.loginInfo);

    this.progress.dismiss();
    this.navCtrl.setRoot(HomePage);
  }

  private createMenu(responseJson):Menu[]{
    let menuResources = responseJson.listOfModuleResources;
    let menu:Menu[]=[];
    for(let item of menuResources){
      let m:Menu=new Menu('',item.name,false,item.url,null);
      menu.push(m);
    }
    this.event.publish("menu:updated",menu);
    return menu;
  }

  ionViewDidLoad() {
    if(this.loginInfo.isAuthenticated){
      console.log("User already authenticated");
    }else{
      console.log("User not authenticated");
    }
  }
  resetForm(loginForm:NgForm){
      loginForm.reset();
      // loginForm.onReset();
  }

}
