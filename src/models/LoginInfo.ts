import { Menu } from '../models/Menu';
export class LoginInfo{
  private userId:string;
  private userName:string;
  private orgId:number;
  private requestParameters:string[];
  private token:string;
  private menu:Menu[];
  private authenticated:boolean;

  constructor (){}


set setAuthenticated(flag:boolean){
  // this.authenticated=true;
  this.authenticated=flag;
}

set setUserId(userId:string){
  this.userId=userId;
}

set setUserName(userName:string){
  this.userName=userName;
}

set setOrgId(id:number){
  this.orgId=id;
}

set setReqParameters(params:string[]){
  this.requestParameters=params;
}

set setToken(token:string){
  this.token=token;
}

set setMenu(menu:Menu[]){
  this.menu=menu;
}

get isAuthenticated():boolean{
  return this.authenticated;
}

get UserId():string{
  return this.userId;
}

get UserName():string{
  return this.userName;
}

get OrgId():number{
  return this.orgId;
}

get Token():string{
  return this.token;
}

get Menu():Menu[]{
  return this.menu;
}

}
