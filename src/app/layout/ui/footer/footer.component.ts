import {ChangeDetectionStrategy, Component} from '@angular/core';
import {LayoutService} from "../../../core/service/layout.service";

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {
    constructor(public layoutService: LayoutService) {
    }
}
