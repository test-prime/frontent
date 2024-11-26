import {ChangeDetectionStrategy, Component, ElementRef, inject, ViewChild} from '@angular/core';
import {MenuItem} from 'primeng/api';
import {LayoutService} from "../../../core/service/layout.service";
import {CommonModule} from "@angular/common";
import {Router, RouterModule} from "@angular/router";
import {TieredMenuModule} from "primeng/tieredmenu";
import {LoginService} from "../../../core/service/login.service";

@Component({
    selector: 'app-topbar',
    templateUrl: './topbar.component.html',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule, RouterModule, TieredMenuModule]
})
export class TopbarComponent {

    items!: MenuItem[];
    profileItems!: MenuItem[];

    @ViewChild('menubutton') menuButton!: ElementRef;

    @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;

    @ViewChild('topbarmenu') menu!: ElementRef;

    private loginService = inject(LoginService);
    private router = inject(Router);
    constructor(public layoutService: LayoutService) {
        this.profileItems = [
            {
                label: 'Logout',
                icon: 'pi pi-sign-out',
                command: () => {
                    this.loginService.logout();
                    this.router.navigate(['/identity/login']);
                }
            }
        ]
    }
}
