import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {PrimeNGConfig} from 'primeng/api';
import {LocationStrategy, PathLocationStrategy} from "@angular/common";
import {RouterModule} from "@angular/router";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {provide: LocationStrategy, useClass: PathLocationStrategy}
    ],
    imports: [
        RouterModule,
    ],
})
export class AppComponent implements OnInit {

    constructor(private primengConfig: PrimeNGConfig) {
    }

    ngOnInit() {
        this.primengConfig.ripple = true;
    }
}
