import {ChangeDetectionStrategy, Component} from "@angular/core";
import {MessageService} from "primeng/api";
import {Column, DataListComponentComponent} from "../../ui/data-list/data-list.component";
import {FormGroup} from "@angular/forms";
import * as dayjs from "dayjs";
import {FormlyFieldConfig} from "@ngx-formly/core";

@Component({
    templateUrl: './project.component.html',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        DataListComponentComponent
    ],
    providers: [MessageService]
})
export class ProjectComponent {
    queryParams = {
        page: 0,
        size: 10000,
    }
    columns: Column[] = [
        {property: 'name', label: 'Name'},
        {property: 'description', label: 'Description'},
        {property: 'owner.username', label: 'Owner'},
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
            key: 'name',
            type: 'input',
            props: {
                label: 'Name',
                required: true
            }
        },
        {
            key: 'owner_id',
            type: 'select-extra',
            props: {
                label: 'Owner',
                required: true,
                apiEndpoint: 'api/v1/users',
                params: {
                    page: 0,
                    size: 10000,
                    sort: 'id,desc'
                },
                optionLabel: 'username',
                optionValue: 'id'
            }
        },
        {
            key: 'description',
            type: 'textarea-extra',
            props: {
                label: 'Description',
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
                    key: 'name',
                    type: 'input',
                    className: 'field col-6',
                    props: {
                        label: 'Name',
                    }
                },
                {
                    key: 'owner_id',
                    type: 'select-extra',
                    className: 'field col-6',
                    props: {
                        label: 'Owner',
                        apiEndpoint: 'api/v1/users',
                        params: {
                            page: 0,
                            size: 10000,
                            sort: 'id,desc'
                        },
                        optionLabel: 'username',
                        optionValue: 'id'
                    }
                }
            ]
        }
    ]
}
