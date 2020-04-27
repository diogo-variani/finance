import { AuthenticationService } from 'src/app/services/authentication.service';
import { OnInit } from '@angular/core';

export abstract class AuthComponent implements OnInit{

  private isAuthenticated : boolean = false;

  constructor(protected authenticationService: AuthenticationService) {
  }
  
  ngOnInit(): void {
    this.authenticationService.user.subscribe( user => {
      this.isAuthenticated = this.authenticationService.isAuthenticated();
    });
  }
}