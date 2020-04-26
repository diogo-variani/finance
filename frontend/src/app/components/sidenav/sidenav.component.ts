import { Component, OnInit } from '@angular/core';
import { AuthComponent } from '../abstract/auth.component';
import { AuthenticationService } from 'src/app/services/authentication.service';

const SMALL_WIDTH_BREACKPOINT = 720;

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent extends AuthComponent implements OnInit {

  private mediaMatcher: MediaQueryList = matchMedia(`(max-width: ${SMALL_WIDTH_BREACKPOINT}px)`);

  constructor(protected authenticationService : AuthenticationService) {
    super(authenticationService);
  }

  ngOnInit() {
  }

  
  isScreenSmall(): boolean{
    return this.mediaMatcher.matches;
  }
}
