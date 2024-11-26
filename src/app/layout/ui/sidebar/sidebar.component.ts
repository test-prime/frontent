import {ChangeDetectionStrategy, Component, ElementRef} from '@angular/core';
import {LayoutService} from "../../../core/service/layout.service";
import {MenuComponent} from "../menu/menu.component";

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MenuComponent]
})
export class SidebarComponent {
    constructor(public layoutService: LayoutService, public el: ElementRef) {
    }
}

