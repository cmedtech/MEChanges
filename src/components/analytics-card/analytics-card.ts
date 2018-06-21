import { Component,Input,OnInit,ViewChild,ElementRef } from '@angular/core';
import { AnalyticsCard } from '../../models/AnalyticsCard';

/**
 * Generated class for the AnalyticsCardComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'analytics-card',
  templateUrl: 'analytics-card.html'
})
export class AnalyticsCardComponent implements OnInit{

  @Input() report:any;
  @ViewChild('cardheader') header:any;
  constructor(public el:ElementRef) {
    //console.log('Hello AnalyticsCardComponent Component');
    //this.text = 'Hello World';
  }

  ngOnInit(){
    //console.log(this.header.);
    //console.log("From init");
    //console.log(this.report);
  }

}
