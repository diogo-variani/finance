import { Component, Output, EventEmitter } from '@angular/core';
import { AuthenticationService } from 'src/app/services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent {

  @Output() toggleSidenav = new EventEmitter<void>();

  constructor(private authenticationService : AuthenticationService,
              private router: Router) { }

  public logout(){
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }
}