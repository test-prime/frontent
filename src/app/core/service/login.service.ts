import {inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {mergeMap} from 'rxjs/operators';
import {AccountService} from "./account.service";
import {Login} from "../model/login.model";
import {Account} from "../model/account.model";
import {AuthJwtService} from "./auth-jwt.service";

@Injectable({providedIn: 'root'})
export class LoginService {
    private accountService = inject(AccountService);
    private authJwtService = inject(AuthJwtService);

    login(credentials: Login): Observable<Account | null> {
        return this.authJwtService.login(credentials).pipe(mergeMap(() => this.accountService.identity(true)));
    }

    logout(): void {
        this.authJwtService.logout().subscribe({complete: () => this.accountService.authenticate(null)});
    }
}
