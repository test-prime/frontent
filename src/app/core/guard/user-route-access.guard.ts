import {inject, isDevMode} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot} from '@angular/router';
import {map} from 'rxjs/operators';

import {AccountService} from '../service/account.service';
import {StateStorageService} from '../service/state-storage.service';

export const userRouteAccessGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    const router = inject(Router);
    const accountService = inject(AccountService);
    const stateStorageService = inject(StateStorageService);

    return accountService.identity().pipe(
        map(account => {
            if (account) {
                const roles = route.data['roles'];

                if (isDevMode()) {
                    return true;
                }

                if (!roles || roles.length === 0 || accountService.hasAnyRoles(roles)) {
                    return true;
                }
                router.navigate(['/exception/access']);
                return false;
            }

            stateStorageService.storeUrl(state.url);
            router.navigate(['/identity/login']);
            return false;
        })
    );
};
