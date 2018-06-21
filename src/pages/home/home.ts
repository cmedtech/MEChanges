import { Component,OnInit } from '@angular/core';
import { NavController,Events } from 'ionic-angular';
import { NgForm } from '@angular/forms';
import { AppServicesProvider } from '../../providers/app-services/app-services';
import { MenuController } from 'ionic-angular';

import { LoginInfo } from '../../models/LoginInfo';
import { Menu } from '../../models/Menu';
import { ServercallsProvider } from '../../providers/servercalls/servercalls';
import { ReportsPage } from '../../pages/reports/reports';

import {Localstorage} from '../../providers/storage/localstorage';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit{
  rootPage:any=this;
  public sMenu:Menu;
  constructor(private menu:MenuController,
    public loginInfo:LoginInfo,
    public event:Events,
    private rest:ServercallsProvider,
    private nav:NavController,
    private localstorage:Localstorage,public appservice:AppServicesProvider) {

  }

//@ViewChild('loginForm') loginForm: NgForm;

 public toggleMenu():void{
   this.menu.toggle();
 }

 ngOnInit(){
   let root:Menu[]=this.loginInfo.Menu;
   for(let m of root){
     if(m.label==="Reports"){
       this.sMenu=m;
       this.getSubmenu(this.sMenu);
     }
   }

   this.localstorage.getLoginInfo();
 }

 getSubmenu(menuItem){
   menuItem.selected=!menuItem.selected;
   if(menuItem.childMenuItems===null || menuItem.childMenuItems.length===0){
       this.rest.getSubMenuItems(menuItem.url).subscribe(
     (response)=>{
       let items=response.Reports,menuItems:Menu[]=[];
       for(let item of items){
         let sMenu:Menu=new  Menu(item.resId,item.name,false,item.url,null);
         menuItems.push(sMenu);
       }
       menuItem.childMenuItems=menuItems;

     },
     (error)=>{

     }
   );
   }
 }

 menuRouter(menuItem){
   this.appservice.setHitFromLocation('Dashboard');
   this.nav.push(ReportsPage,menuItem);
   //console.log(menuItem);
 }

  // login(loginForm:NgForm){
  //   this.rest.authenticate(loginForm.form.controls.Username.value,loginForm.form.controls.password.value);
  //   // console.log(loginForm.form.controls.Username.value);
  // }
  //
  // resetForm(loginForm:NgForm){
  //   loginForm.reset();
  // }

}
