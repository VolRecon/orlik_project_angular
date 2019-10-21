import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import simpleParallax from 'simple-parallax-js';
import * as $ from 'jquery';
import anime from 'src/assets/js/anime.js';

declare var $: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit, AfterViewInit {

  @ViewChild('home') home: ElementRef;

  constructor() {}

  ngOnInit() { }

  ngAfterViewInit() {
    var image = document.getElementById('home');
    new simpleParallax(image, {
      scale: 1.6
    });

    $.getScript("assets/js/main.js", function () { });

    //li w navbar
    anime({
      targets: '.animations',
      translateY: [-150, 0],
      opacity: [0, 1],
      easing: "easeOutExpo",
      duration: 1200,
      delay: (el, i) => 1800 + 170 * i
    });

    // logo
    anime({
      targets: '.logo',
      translateY: [-150, 0],
      opacity: [0, 1],
      easing: "easeOutBounce",
      duration: 1500,
      delay: (el, i) => 1800 + 170 * i
    });

    //Zapraszam
    anime({
      targets: '#zapraszam',
      translateX: [-50, 0],
      opacity: [0, 1],
      easing: "easeOutQuad",
      duration: 700,
      delay: (el, i) => 2300
    });

    //Zapraszam text drugi
    anime({
      targets: '#text1',
      translateX: [-50, 0],
      opacity: [0, 1],
      easing: "easeOutQuad",
      duration: 700,
      delay: (el, i) => 2300
    });

    //Zapraszam button 1
    anime({
      targets: '#button1',
      translateY: [30, 0],
      opacity: [0, 1],
      easing: "easeOutQuad",
      duration: 700,
      delay: (el, i) => 2000
    });

    //Zapraszam button 2
    anime({
      targets: '#button2',
      translateY: [30, 0],
      opacity: [0, 1],
      easing: "easeOutQuad",
      duration: 700,
      delay: (el, i) => 2200
    });

    //Reka
    anime({
      targets: '#hand',
      translateY: [200, 0],
      opacity: [0, 1],
      easing: "easeOutQuad",
      duration: 600,
      delay: (el, i) => 2200
    });
  }
}
