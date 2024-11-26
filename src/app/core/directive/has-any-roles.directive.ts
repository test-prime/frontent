import {ChangeDetectorRef, Directive, inject, Input, OnDestroy, TemplateRef, ViewContainerRef} from '@angular/core';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {AccountService} from "../service/account.service";


@Directive({
    selector: '[hasAnyRoles]',
    standalone: true
})
export class HasAnyRolesDirective implements OnDestroy {
    private roles!: string | string[];

    private destroyed$ = new Subject();
    private accountService = inject(AccountService);
    private templateRef = inject(TemplateRef);
    private viewContainerRef = inject(ViewContainerRef);
    private changeDetectRef = inject(ChangeDetectorRef);

    @Input()
    set hasAnyRoles(value: string | string[]) {
        this.roles = value;
        this.updateView();
        // Get notified each time authentication state changes.
        this.accountService
            .getAuthenticationState()
            .pipe(takeUntil(this.destroyed$))
            .subscribe(() => {
                this.updateView();
            });
    }

    ngOnDestroy(): void {
        this.destroyed$.complete();
    }

    private updateView(): void {
        const hasAnyRoles = this.accountService.hasAnyRoles(this.roles);
        this.viewContainerRef.clear();
        if (hasAnyRoles) {
            this.viewContainerRef.createEmbeddedView(this.templateRef);
            this.changeDetectRef.detectChanges();
        }
    }
}
