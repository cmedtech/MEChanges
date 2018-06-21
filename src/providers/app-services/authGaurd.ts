import { CanActivate,ActivatedRouteSnapshot,RouterStateSnapshot } from '@angular/router';
import { Injectable } from  '@angular/core';

import { LoginInfo } from '../../models/LoginInfo';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private loginInfo:LoginInfo){}
  canActivate(route:ActivatedRouteSnapshot,state:RouterStateSnapshot){
    return this.loginInfo.isAuthenticated;
  }

}
