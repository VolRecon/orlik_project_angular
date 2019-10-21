import { Component } from '@angular/core';

import * as $ from 'jquery';
import * as AOS from "aos";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  ngOnInit() {
    AOS.init({
      disable: 'mobile',
      duration: 600,
    });
  }

  ngAfterViewInit() {
    $(document).ready(function(){
      $(this).scrollTop(0,0);
    });
  }

}
