import {ChangeDetectionStrategy, Component, inject, signal} from '@angular/core';
import {LayoutService} from 'src/app/core/service/layout.service';
import {CommonModule} from "@angular/common";
import {ButtonModule} from "primeng/button";
import {CheckboxModule} from "primeng/checkbox";
import {InputTextModule} from "primeng/inputtext";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {PasswordModule} from "primeng/password";
import {RippleModule} from "primeng/ripple";
import {Router, RouterModule} from "@angular/router";
import {LoginService} from "../../../core/service/login.service";
import {ToastModule} from "primeng/toast";
import {MessageService} from "primeng/api";

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styles: [`
        :host ::ng-deep .pi-eye,
        :host ::ng-deep .pi-eye-slash {
            transform: scale(1.6);
            margin-right: 1rem;
            color: var(--primary-color) !important;
        }
    `],
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        CommonModule,
        ButtonModule,
        CheckboxModule,
        InputTextModule,
        FormsModule,
        PasswordModule,
        RippleModule,
        RouterModule,
        ReactiveFormsModule,
        ToastModule
    ],
    providers: [MessageService]
})
export class LoginComponent {

    valCheck: string[] = ['remember'];

    password!: string;

    constructor(public layoutService: LayoutService) {
    }

    loginForm = new FormGroup({
        username: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
        password: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
        rememberMe: new FormControl(false, { nonNullable: true, validators: [Validators.required] }),
    });

    private loginService = inject(LoginService);
    private router = inject(Router);
    private messageService = inject(MessageService);

    login() {
        this.loginService.login(this.loginForm.getRawValue()).subscribe({
            next: () => {
                if (!this.router.getCurrentNavigation()) {
                    this.router.navigate(['/']);
                }
            },
            error: () => this.messageService.add({
                severity: 'danger',
                summary: 'Failed to sign in!',
                detail: 'Please check your credentials and try again.',
                life: 3000
            }),
        });
    }
}
