import {ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit, signal, Type} from '@angular/core';
import {FieldType, FormlyFieldConfig, FormlyFieldProps} from '@ngx-formly/core';
import {get} from 'lodash';
import {Subject, takeUntil} from 'rxjs';

import {DataService} from '../../../core/service/data.service';

interface Option {
    label: string;
    value: string | number;
}

interface SelectExtraProps extends FormlyFieldProps {
    multiple?: boolean;
    appendTo?: any;
    filter?: boolean;
    apiEndpoint?: string;
    params?: { [key: string]: any };
    optionLabel?: string;
    optionValue?: string;
    virtualScroll?: boolean;
    virtualScrollItemSize?: number;
}

export interface SelectExtraConfig extends FormlyFieldConfig<SelectExtraProps> {
    type: 'select-extra' | Type<FieldTypeSelectExtraComponent>;
}

@Component({
    template: `
        @if (!isLoading() && props.multiple) {
            <p-multiSelect
                [formControl]="childControl"
                [formlyAttributes]="field"
                [placeholder]="props.placeholder"
                [required]="props.required"
                [disabled]="props.disabled"
                [options]="signalOptions()"
                [showClear]="!props.required"
                appendTo="body"
                [filter]="props.filter"
                [virtualScroll]="props.virtualScroll"
                [virtualScrollItemSize]="props.virtualScrollItemSize"
                (onChange)="props.change && props.change(field, $event)"
            />
        } @else if (!isLoading() && !props.multiple) {
            <p-dropdown
                [formControl]="childControl"
                [formlyAttributes]="field"
                [placeholder]="props.placeholder"
                [required]="props.required"
                [disabled]="props.disabled"
                [options]="signalOptions()"
                [showClear]="!props.required"
                appendTo="body"
                [filter]="props.filter"
                [virtualScroll]="props.virtualScroll"
                [virtualScrollItemSize]="props.virtualScrollItemSize"
                (onChange)="props.change && props.change(field, $event)"
            />
        }
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldTypeSelectExtraComponent extends FieldType<SelectExtraConfig> implements OnInit, OnDestroy {
    childControl!: any;
    isLoading = signal(false);
    signalOptions = signal<Option[]>(this.props.options as any[] as Option[] ?? []);

    private destroyed$ = new Subject();
    private dataService = inject(DataService);
    get = get;

    constructor() {
        super();
    }

    ngOnDestroy() {
        this.destroyed$.complete();
    }

    ngOnInit() {
        this.childControl = this.formControl;
        this.populateOptions();
    }

    populateOptions() {
        if (this.props.apiEndpoint) {
            this.isLoading.set(true);
            this.dataService
                .findAll(this.props.params && Object.keys(this.props.params).length > 0 ? this.props.params : {}, this.props.apiEndpoint)
                .pipe(takeUntil(this.destroyed$))
                .subscribe({
                    next: res => {
                        this.isLoading.set(false);
                        if (res.body) {
                            this.signalOptions.set(
                                res.body.map(item => (
                                    {label: get(item, this.props.optionLabel), value: get(item, this.props.optionValue)}
                                ))
                            );
                        }
                    },
                    error: err => {
                        this.isLoading.set(false);
                        this.signalOptions.set([]);
                    }
                });
        }
        if (this.props.options) {
            this.signalOptions.set(
                (this.props.options as any[]).map(item => ({
                    label: item.label,
                    value: item.value
                }))
            );
        }
    }
}
