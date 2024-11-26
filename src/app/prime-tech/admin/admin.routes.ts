import {Routes} from "@angular/router";
import {UserComponent} from "./user/user.component";
import {userRouteAccessGuard} from "../../core/guard/user-route-access.guard";

export const routes: Routes = [
    {
        path: 'user', component: UserComponent,
        data: {
            roles: ['ADMIN']
        },
        canActivate: [userRouteAccessGuard]
    }
]
