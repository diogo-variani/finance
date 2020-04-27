import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../services';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(private authenticationService: AuthenticationService) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add authorization header with jwt token if available

        var isAuthenticated : boolean = this.authenticationService.isAuthenticated();
        if( !isAuthenticated ){
            return next.handle(request);
        }

        let token : any = this.authenticationService.tokenFromStorage;
        
        if (token && token.access_token) {
            request = request.clone({
                setHeaders: { 
                    Authorization: `Bearer ${token.access_token}`
                }
            });
        }

        return next.handle(request); 
    }
}