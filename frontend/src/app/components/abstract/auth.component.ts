import { AuthenticationService } from 'src/app/services';

export abstract class AuthComponent{

  public isAuthenticated : boolean = false;

  constructor(protected authenticationService: AuthenticationService) {

    this.authenticationService.currentUserSubject.subscribe( user => {
      this.isAuthenticated = this.authenticationService.isAuthenticated();
    });

  }
  
}