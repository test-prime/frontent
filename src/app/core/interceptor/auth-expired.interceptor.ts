import {inject, Injectable} from '@angular/core';
import {
    HttpErrorResponse,
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpInterceptorFn,
    HttpRequest
} from '@angular/common/http';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';
import {Router} from '@angular/router';
import {LoginService} from "../service/login.service";
import {StateStorageService} from "../service/state-storage.service";

export const AuthExpiredInterceptor: HttpInterceptorFn = (request, next) => {
    const loginService = inject(LoginService);
    const stateStorageService = inject(StateStorageService);
    const router = inject(Router);

    return next(request).pipe(
        tap({
            error: (err: HttpErrorResponse) => {
                if (err.status === 401) {
                    stateStorageService.storeUrl(router.routerState.snapshot.url);
                    loginService.logout();
                    router.navigate(['/identity/login']);
                }
            },
        }),
    );
}
