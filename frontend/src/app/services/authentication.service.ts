import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../models';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;

    readonly DEFAULT_HEADERS : HttpHeaders = new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded'
    });
    
    private defaultBody : HttpParams = new HttpParams({ fromObject: {
        grant_type: "password",
        client_id: "finance-manager",
        client_secret: "685aa0fa-c830-465d-95ff-895c1830760a"
    }});

    constructor(private http: HttpClient) {
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

    login(username : string, password : string) {
        var body = this.defaultBody;
        body = body.set('username', username)
                   .set('password', password);
        
        console.log( body.toString() );

        return this.http.post<any>(`http://identity.finance.com.br/auth/realms/finance/protocol/openid-connect/token`, body.toString(), { headers: this.DEFAULT_HEADERS} )
            .pipe(map(user => {
                console.log( user );
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                localStorage.setItem('currentUser', JSON.stringify(user));
                this.currentUserSubject.next(user);
                return user;
            }));
    }

    logout() {
        // remove user from local storage and set current user to null
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
    }
}