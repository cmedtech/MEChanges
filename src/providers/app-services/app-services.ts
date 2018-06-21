import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { ServercallsProvider } from  '../servercalls/servercalls'
import { LoginInfo } from '../../models/LoginInfo';


@Injectable()
export class AppServicesProvider {
  fromLocation:any;

  constructor(private httpReq:ServercallsProvider,private loginInfo:LoginInfo) {

  }

  public authenticate(userName:string,password:string):Observable<any>{
    let reqUrl:string = "/login?uId=" + userName + "&pwd=" + password + "&macId=1";
    let loginInfo:LoginInfo=null;
     return this.httpReq.makeRequest(reqUrl);
     //.subscribe(
    //   (response)=>(this.formatAuthenticationResponse(response)),
    //   (error)=>console.log(error)
    // )
  }

  public setHitFromLocation(location){
    this.fromLocation=location;
  }
  getHitLocation(){
    return this.fromLocation;
  }
}
