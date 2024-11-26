import {ChangeDetectionStrategy, Component} from '@angular/core';
import {RouterModule} from "@angular/router";

@Component({
    selector: 'app-notfound',
    templateUrl: './notfound.component.html',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [RouterModule]
})
export class NotfoundComponent {
}
