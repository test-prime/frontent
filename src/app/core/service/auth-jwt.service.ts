import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

import {StateStorageService} from './state-storage.service';
import {ApplicationConfigService} from "./application-config.service";
import {Login} from "../model/login.model";

type JwtToken = {
    id_token: string;
};

@Injectable({providedIn: 'root'})
export class AuthJwtService {
    private http = inject(HttpClient);
    private stateStorageService = inject(StateStorageService);
    private applicationConfigService = inject(ApplicationConfigService);

    getToken(): string {
        return this.stateStorageService.getAuthenticationToken() ?? '';
    }

    login(credentials: Login): Observable<void> {
        return this.http
            .post<JwtToken>(this.applicationConfigService.getEndpointFor('api/authenticate'), credentials)
            .pipe(map(response => this.authenticateSuccess(response, credentials.rememberMe)));
    }

    logout(): Observable<void> {
        return new Observable(observer => {
            this.stateStorageService.clearAuthenticationToken();
            observer.complete();
        });
    }

    private authenticateSuccess(response: JwtToken, rememberMe: boolean): void {
        this.stateStorageService.storeAuthenticationToken(response.id_token, rememberMe);
    }
}
