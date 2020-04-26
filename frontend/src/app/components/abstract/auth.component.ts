import { AuthenticationService } from 'src/app/services/authentication.service';

export abstract class AuthComponent{

  constructor(protected authenticationService: AuthenticationService) {
  }

  isLoggedIn(): boolean {
    const currentUser = this.authenticationService.currentUserValue;
    debugger
    console.log( currentUser );
    return currentUser ? true : false
  }

}