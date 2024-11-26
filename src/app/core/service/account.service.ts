import {HttpClient} from '@angular/common/http';
import {inject, Injectable, Signal, signal} from '@angular/core';
import {Router} from '@angular/router';
import {catchError, Observable, of, ReplaySubject, shareReplay, tap} from 'rxjs';

import {Account} from '../model/account.model';
import {ApplicationConfigService} from "./application-config.service";
import {StateStorageService} from "./state-storage.service";

@Injectable({providedIn: 'root'})
export class AccountService {
    private userIdentity = signal<Account | null>(null);
    private authenticationState = new ReplaySubject<Account | null>(1);
    private accountCache$?: Observable<Account> | null;

    private http = inject(HttpClient);
    private stateStorageService = inject(StateStorageService);
    private router = inject(Router);
    private applicationConfigService = inject(ApplicationConfigService);

    save(account: Account): Observable<{}> {
        return this.http.post(this.applicationConfigService.getEndpointFor('api/account'), account);
    }

    authenticate(identity: Account | null): void {
        this.userIdentity.set(identity);
        this.authenticationState.next(this.userIdentity());
        if (!identity) {
            this.accountCache$ = null;
        }
    }

    trackCurrentAccount(): Signal<Account | null> {
        return this.userIdentity.asReadonly();
    }

    hasAnyRoles(roles: string[] | string): boolean {
        const userIdentity = this.userIdentity();
        if (!userIdentity) {
            return false;
        }
        if (!Array.isArray(roles)) {
            roles = [roles];
        }
        return userIdentity.roles.some((role: string) => roles.includes(role));
    }

    identity(force?: boolean): Observable<Account | null> {
        if (!this.accountCache$ || force) {
            this.accountCache$ = this.fetch().pipe(
                tap((account: Account) => {
                    this.authenticate(account);

                    this.navigateToStoredUrl();
                }),
                shareReplay(),
            );
        }
        return this.accountCache$.pipe(catchError(() => of(null)));
    }

    isAuthenticated(): boolean {
        return this.userIdentity() !== null;
    }

    getAuthenticationState(): Observable<Account | null> {
        return this.authenticationState.asObservable();
    }

    private fetch(): Observable<Account> {
        return this.http.get<Account>(this.applicationConfigService.getEndpointFor('api/account'));
    }

    private navigateToStoredUrl(): void {
        const previousUrl = this.stateStorageService.getUrl();
        if (previousUrl) {
            this.stateStorageService.clearUrl();
            this.router.navigateByUrl(previousUrl);
        }
    }
}
