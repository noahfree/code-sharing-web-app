import { Component, ElementRef, HostListener, Renderer2, ViewChild } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'hackweek';
  height = window.pageYOffset;


  @ViewChild('navbar', {static: true}) navbar!: ElementRef<HTMLElement>;
  
  @HostListener('window:scroll', ['$event']) 
    scrollHandler() {
      let currentHeight = window.pageYOffset;
      if (currentHeight > this.height){
      }
      else {

      }
    }
}
