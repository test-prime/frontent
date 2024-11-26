import {NgModule} from "@angular/core";
import {FormlyModule} from "@ngx-formly/core";
import {FormlyWrapperFormField} from "./ui/form-field.wrapper";
import {ReactiveFormsModule} from "@angular/forms";
import {FormlyPrimeNGModule} from "@ngx-formly/primeng";
import {CommonModule} from "@angular/common";
import {FieldTypeSelectExtraComponent} from "./ui/select-extra.type";
import {DropdownModule} from "primeng/dropdown";
import {FieldTypeTextareaExtraComponent} from "./ui/textarea-extra.type";
import {InputTextareaModule} from "primeng/inputtextarea";
import {MultiSelectModule} from "primeng/multiselect";

@NgModule({
    declarations: [FormlyWrapperFormField, FieldTypeSelectExtraComponent, FieldTypeTextareaExtraComponent],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormlyPrimeNGModule,
        FormlyModule.forRoot({
            wrappers: [
                {
                    name: 'form-field',
                    component: FormlyWrapperFormField
                },
            ],
            types: [
                {
                    name: 'select-extra',
                    component: FieldTypeSelectExtraComponent,
                    wrappers: ['form-field']
                },
                {
                    name: 'textarea-extra',
                    component: FieldTypeTextareaExtraComponent,
                    wrappers: ['form-field']
                }
            ],
            validationMessages: [{name: 'required', message: 'This field is required'}]
        }),
        DropdownModule,
        InputTextareaModule,
        MultiSelectModule
    ],
})
export class _FormlyModule {
}
