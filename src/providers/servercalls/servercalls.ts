import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';

import { LoginInfo } from '../../models/LoginInfo';


@Injectable()
export class ServercallsProvider {

  // private BASE_URL="https://pa.medevolve.com/mobilePortal/xsecured";
  // private BASE_URL="http://patest.medevolve.com:8080/mobilePortal/xsecured";
  private BASE_URL="https://medapp.medevolve.com/mobilePortal/xsecured";

  constructor(public http: Http,public loginInfo:LoginInfo) {

  }

  public makeRequest(appendStr:string):Observable<any>{
    let url:string=this.BASE_URL+appendStr;
    return this.http.get(url).map(
      response=>response.json()
    );
  }

  public getSubMenuItems(url):Observable<any>{
    //"?token=" + urlDelegationService.token + "&macId=1&moduleName=PSO&userId="+user.id+"&orgId="+user.orgId;
    let callUrl:string=url+"?token="+this.loginInfo.Token+"&macId=1&moduleName=PSO&userId="+this.loginInfo.UserId+"&orgId="+this.loginInfo.OrgId;
    return this.http.get(callUrl).map(
      (response)=>response.json()
    );
  }

  public getReportData(url,resId):Observable<any>{
    let callUrl = url + "?token=" + this.loginInfo.Token + "&resId=" + resId + "&userId="+this.loginInfo.UserId+"&orgId="+this.loginInfo.OrgId+"&macId=1";
    console.log("getReportData() === callUrl >>>");
    console.log(callUrl);
    return this.http.get(callUrl).map(
      (response)=>response.json()
    );
  }
  public getFilterData(url,resId,fyear,fmonth,syear,smonth):Observable<any>{
    let callUrl = url + "?token=" + this.loginInfo.Token + "&resId=" + resId + "&userId="+this.loginInfo.UserId+"&orgId="+this.loginInfo.OrgId+"&FIRST_YEAR="+fyear+"&FIRST_MONTH="+fmonth+"&SECOND_YEAR="+syear+"&SECOND_MONTH="+smonth+"&macId=1";
    console.log("getFilterData() === callUrl >>>");
    console.log(callUrl);
    return this.http.get(callUrl).map(
      (response)=>response.json()
    );
  }

}
