import {
    NavigationError,
    Router,
    RouterFeatures,
    Routes,
    withComponentInputBinding,
    withNavigationErrorHandler
} from '@angular/router';
import {LayoutComponent} from "./layout/layout.component";
import {ProjectComponent} from "./prime-tech/project/project.component";
import {TaskComponent} from "./prime-tech/task/task.component";
import {inject} from "@angular/core";

export const routes: Routes = [
    {
        path: '', component: LayoutComponent,
        children: [
            {
                path: 'project',
                component: ProjectComponent
            },
            {
                path: 'task',
                component: TaskComponent
            },
            {
                path: 'admin',
                loadChildren: () => import('./prime-tech/admin/admin.routes').then(m => m.routes)
            }
        ]
    },
    {
        path: 'identity',
        loadChildren: () => import('./prime-tech/identity/identity.routes').then(m => m.routes)
    },
    {
        path: 'exception',
        loadChildren: () => import('./exception/exception.routes').then(m => m.routes)
    },
    {
        path: '**',
        redirectTo: '/exception/notfound'
    },
];

export const routerFeatures: RouterFeatures[] = [
    withComponentInputBinding(),
    withNavigationErrorHandler((e: NavigationError) => {
        const router = inject(Router);
        console.log('e', e)
        if (e.error.status === 403) {
            router.navigate(['/exception/access']);
        } else if (e.error.status === 404) {
            router.navigate(['/exception/notfound']);
        } else if (e.error.status === 401) {
            router.navigate(['/identity/login']);
        } else {
            router.navigate(['/exception/error']);
        }
    }),
];
