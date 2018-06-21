import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import {Storage} from '@ionic/storage';
import {LoginInfo} from '../../models/LoginInfo';

/*
  Generated class for the Localstorage provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class Localstorage {

  loginInfo:LoginInfo;

  constructor(public http: Http,private storage:Storage) {
    // console.log('LocalStorage constr......');

      // this.storage.ready().then(response=>{
      //   console.log("storage status ",response);
      // }).catch(error=>console.log("error: ",error));
    }

    setLoginInfo(loginInfo){
      // console.log("store loginuser >>>>",loginInfo);
      this.storage.set("loginuser",loginInfo);
    }
    getLoginInfo():any{
      this.storage.get("loginuser").then(loginuser =>{
        // console.log("get login user>>>>",loginuser);
        this.loginInfo = loginuser;
      })
    }

    //store the email address
    setEmail(email){
    this.storage.set('email',email);
    }

    //get the stored email
    getEmail(){
    	this.storage.get('email').then(email=>{
    		console.log('email: '+ email);
    	});
    }

    //delete the email address
    removeEmail(){
    this.storage.remove('email').then(()=>{
    		console.log('email is removed');
    	});
    }

    //clear the whole local storage
    clearStorage(){
    	this.storage.clear().then(()=>{
		      console.log('all keys are cleared');
    	});
    }

}
