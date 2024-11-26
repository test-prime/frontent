import {ChangeDetectionStrategy, Component} from "@angular/core";
import {MessageService} from "primeng/api";
import {FormGroup} from "@angular/forms";
import * as dayjs from "dayjs";
import {FormlyFieldConfig} from "@ngx-formly/core";
import {Column, DataListComponentComponent} from "../../../ui/data-list/data-list.component";

@Component({
    templateUrl: './user.component.html',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        DataListComponentComponent,
    ],
    providers: [MessageService]
})
export class UserComponent {

    columns: Column[] = [
        {property: 'username', label: 'Username'},
        {property: 'email', label: 'Email'},
        {property: 'roles', label: 'Roles'},
    ]
    model = {};
    form = new FormGroup({});
    options = {
        formState: {
            awesomeIsForced: false,
            mainModel: this.model,
            dayjs: dayjs
        }
    };
    fields: FormlyFieldConfig[] = [
        {
            key: 'username',
            type: 'input',
            props: {
                label: 'Username',
                required: true
            }
        },
        {
            key: 'email',
            type: 'input',
            props: {
                label: 'Email',
                required: true,
                type: 'email'
            }
        },
        {
            key: 'password',
            type: 'input',
            props: {
                label: 'Password',
            },
            expressions: {
                'props.required': 'model.id ? false : true'
            }
        },
        {
            key: 'roles',
            type: 'select-extra',
            props: {
                label: 'Roles',
                multiple: true,
                options: [
                    {label: 'Admin', value: 'ADMIN'},
                    {label: 'User', value: 'USER'},
                ]
            }
        },
    ]

    filterModel = {};
    filterForm = new FormGroup({});
    filterOptions = {
        formState: {
            awesomeIsForced: false,
            mainModel: this.model,
            dayjs: dayjs
        }
    };
    filterFields: FormlyFieldConfig[] = [
        {
            fieldGroupClassName: 'formgrid grid',
            fieldGroup: [
                {
                    key: 'username',
                    type: 'input',
                    className: 'field col-4',
                    props: {
                        label: 'Username',
                    }
                },
                {
                    key: 'email',
                    type: 'input',
                    className: 'field col-4',
                    props: {
                        label: 'Email',
                    }
                },
                {
                    key: 'roles',
                    type: 'select-extra',
                    className: 'field col-4',
                    props: {
                        label: 'Role',
                        multiple: true,
                        options: [
                            {label: 'Admin', value: 'ADMIN'},
                            {label: 'User', value: 'USER'},
                        ]
                    }
                }
            ]
        }
    ]
}
