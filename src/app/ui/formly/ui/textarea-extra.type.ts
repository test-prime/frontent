import {ChangeDetectionStrategy, Component, OnInit, Type} from "@angular/core";
import {FieldType, FormlyFieldConfig, FormlyFieldProps} from "@ngx-formly/core";

interface TextareaExtraProps extends FormlyFieldProps {
    rows?: number;
    cols?: number;
    autoResize?: boolean;
}

export interface TextareaExtraConfig extends FormlyFieldConfig<TextareaExtraProps> {
    type: 'textarea-extra' | Type<FieldTypeTextareaExtraComponent>;
}

@Component({
    template: `
        <textarea pInputTextarea
                  [rows]="props.rows ?? 3"
                  [cols]="props.cols ?? 30"
                  [autoResize]="props.autoResize ?? true"
                  [formControl]="childControl"
                  [required]="props.required ?? false"
                  [disabled]="props.disabled ?? false"
                  [placeholder]="props.placeholder"
        ></textarea>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldTypeTextareaExtraComponent extends FieldType<TextareaExtraConfig> implements OnInit {
    childControl!: any;

    constructor() {
        super();
    }

    ngOnInit() {
        this.childControl = this.formControl;
    }
}
