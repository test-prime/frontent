import { enableProdMode } from '@angular/core';

import { environment } from './environments/environment';
import {bootstrapApplication} from "@angular/platform-browser";
import {AppComponent} from "./app/app.component";
import {provideAnimations} from "@angular/platform-browser/animations";
import {provideRouter, withInMemoryScrolling, withRouterConfig} from "@angular/router";
import {routerFeatures, routes} from "./app/app-routing.routes";
import {provideHttpClient, withInterceptors} from "@angular/common/http";
import {httpInterceptorProviders} from "./app/core/interceptor";
import {AuthExpiredInterceptor} from "./app/core/interceptor/auth-expired.interceptor";
import {AuthInterceptor} from "./app/core/interceptor/auth.interceptor";

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
    providers: [
        provideAnimations(),
        provideHttpClient(withInterceptors([AuthExpiredInterceptor, AuthInterceptor])),
        provideRouter(
            routes,
            withInMemoryScrolling({
                scrollPositionRestoration: 'enabled',
                anchorScrolling: 'enabled',
            }),
            withRouterConfig({
                onSameUrlNavigation: 'reload'
            }),
            ...routerFeatures
        )
    ]
}).catch((err) => console.error(err));
