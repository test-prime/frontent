import {inject, Injectable} from '@angular/core';
import {HttpHandler, HttpInterceptorFn, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';

import {ApplicationConfigService} from "../service/application-config.service";
import {StateStorageService} from "../service/state-storage.service";

export const AuthInterceptor: HttpInterceptorFn = (request, next) => {
    const stateStorageService = inject(StateStorageService);
    const applicationConfigService = inject(ApplicationConfigService);
    const serverApiUrl = applicationConfigService.getEndpointFor('');

    if (!request.url || (request.url.startsWith('http') && !(serverApiUrl && request.url.startsWith(serverApiUrl)))) {
        return next(request);
    }

    const token: string | null = stateStorageService.getAuthenticationToken();
    if (token) {
        request = request.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`,
            },
        });
    }
    return next(request);
}
