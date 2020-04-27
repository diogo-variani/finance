import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../models';

import jwt_decode from 'jwt-decode';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {

    readonly CURRENT_TOKEN : string = "currentToken";
    readonly CURRENT_USER : string = "currentUser";

    private currentUserSubject: BehaviorSubject<User>;
    private currentTokenSubject: BehaviorSubject<any>;

    readonly DEFAULT_HEADERS : HttpHeaders = new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded'
    });
    
    private defaultBody : HttpParams = new HttpParams({ fromObject: {
        grant_type: "password",
        client_id: "finance-manager",
        client_secret: "685aa0fa-c830-465d-95ff-895c1830760a"
    }});

    constructor(private http: HttpClient) {
        this.currentUserSubject = new BehaviorSubject<User>( undefined );
        this.currentTokenSubject = new BehaviorSubject<any>( undefined );
    }

    public get user(): Observable<User> {
        return this.currentUserSubject.asObservable();
    }

    public get token(): Observable<any> {
        return this.currentTokenSubject.asObservable();
    }

    public get tokenFromStorage() : any {
        var tokenJson : string = localStorage.getItem( this.CURRENT_TOKEN );
        return JSON.parse( tokenJson );
    }

    public get userFromStorage() : User {
        var userJson : string = localStorage.getItem( this.CURRENT_USER );
        return JSON.parse( userJson );
    }

    public login(username : string, password : string) {
        var body = this.defaultBody;
        body = body.set('username', username)
                   .set('password', password);
        
        console.log( body.toString() );

        return this.http.post<any>(`/token`, body.toString(), { headers: this.DEFAULT_HEADERS} )
            .pipe(map(token => {
            
                this.storeToken( token );
                this.storeUser( token );
                
                return token;
            }));
    }

    public isAuthenticated() : boolean {
        return this.currentUserSubject.value != undefined;
    }

    private storeToken( token : any ){
        localStorage.setItem(this.CURRENT_TOKEN, JSON.stringify(token));
    }

    private storeUser( token : any ){
        var decodedToken = jwt_decode( token.access_token );
        
        var user : User = {
            name: decodedToken.name,
            login: decodedToken.preferred_username,
            email: decodedToken.email
        };

        localStorage.setItem( this.CURRENT_USER, JSON.stringify(user) );
        this.currentUserSubject.next(user);
    }

    logout() {
        // remove user from local storage and set current user to null
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
    }
}