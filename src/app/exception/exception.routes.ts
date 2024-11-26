import {Routes} from "@angular/router";
import {ErrorComponent} from "./error/error.component";
import {AccessComponent} from "./access/access.component";
import {NotfoundComponent} from "./notfound/notfound.component";

export const routes: Routes = [
    {
        path: 'error',
        component: ErrorComponent,
    },
    {
        path: 'access',
        component: AccessComponent,
    },
    {
        path: 'notfound',
        component: NotfoundComponent,
    },
]
