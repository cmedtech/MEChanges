import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { HttpModule } from '@angular/http';
import { RouterModule,Routes } from '@angular/router'
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Network } from '@ionic-native/network';

import { IonicStorageModule } from '@ionic/storage';
import {Storage} from '@ionic/storage';
import {AppVersion} from '@ionic-native/app-version';

import { cmApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ServercallsProvider } from '../providers/servercalls/servercalls';
import { AppServicesProvider } from '../providers/app-services/app-services';
import { LoginInfo } from '../models/LoginInfo';
import { LoginPage } from '../pages/login/login';
import { ReportsPage } from '../pages/reports/reports';
import { AnalyticsCardComponent } from '../components/analytics-card/analytics-card';

import {FiltersPage} from '../pages/filters/filters';
import {Localstorage} from '../providers/storage/localstorage';

const appRoutes:Routes =[
  { path:'',component: HomePage}
];

@NgModule({
  declarations: [
    cmApp,
    HomePage,
    LoginPage,
    ReportsPage,
    AnalyticsCardComponent,
    FiltersPage
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule,
    IonicModule.forRoot(cmApp),
    IonicStorageModule.forRoot()
    // IonicStorageModule.forRoot({
    //   name: '__hivedb',
    //      driverOrder: ['sqlite','indexeddb', 'websql']
    // })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    cmApp,
    LoginPage,
    HomePage,
    ReportsPage,
    FiltersPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ServercallsProvider,
    AppServicesProvider,
    LoginInfo,
    Network,
    // Storage,
    Localstorage,
    AppVersion
  ]
})
export class AppModule {}
