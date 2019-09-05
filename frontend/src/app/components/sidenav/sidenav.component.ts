import { Component, OnInit } from '@angular/core';

const SMALL_WIDTH_BREACKPOINT = 720;

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {

  private mediaMatcher: MediaQueryList = matchMedia(`(max-width: ${SMALL_WIDTH_BREACKPOINT}px)`);

  constructor() { }

  ngOnInit() {
  }

  
  isScreenSmall(): boolean{
    return this.mediaMatcher.matches;
  }
}
