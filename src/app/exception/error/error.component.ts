import {ChangeDetectionStrategy, Component} from '@angular/core';
import {ButtonModule} from "primeng/button";
import {RippleModule} from "primeng/ripple";
import {RouterModule} from "@angular/router";

@Component({
    selector: 'app-error',
    templateUrl: './error.component.html',
    standalone: true,
    imports: [
        ButtonModule,
        RippleModule,
        RouterModule
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ErrorComponent {
}
