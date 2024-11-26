import {ChangeDetectionStrategy, Component} from "@angular/core";
import {MessageService} from "primeng/api";
import {Project} from "../../model/project";
import {Column, DataListComponentComponent} from "../../ui/data-list/data-list.component";
import {FormGroup} from "@angular/forms";
import * as dayjs from "dayjs";
import {FormlyFieldConfig} from "@ngx-formly/core";

@Component({
    templateUrl: './task.component.html',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        DataListComponentComponent
    ],
    providers: [MessageService]
})
export class TaskComponent {

    columns: Column[] = [
        {property: 'title', label: 'Title'},
        {property: 'description', label: 'Description'},
        {property: 'project.name', label: 'Project'},
        {
            property: 'status',
            label: 'Status',
            options: [
                {label: 'To do', value: 'TO_DO'},
                {label: 'In Progress', value: 'IN_PROGRESS'},
                {label: 'Done', value: 'DONE'},
            ]
        },
        {property: 'user.username', label: 'Assigned To'},
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
            key: 'title',
            type: 'input',
            props: {
                label: 'Title',
                required: true
            }
        },
        {
            key: 'project_id',
            type: 'select-extra',
            props: {
                label: 'Project',
                required: true,
                apiEndpoint: 'api/v1/projects',
                params: {
                    page: 0,
                    size: 10000,
                    sort: 'id,desc'
                },
                optionLabel: 'name',
                optionValue: 'id'
            }
        },
        {
            key: 'assigned_to',
            type: 'select-extra',
            props: {
                label: 'Assigned To',
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
        {
            key: 'status',
            type: 'select',
            props: {
                label: 'Status',
                required: true,
                options: [
                    {label: 'To do', value: 'TO_DO'},
                    {label: 'In Progress', value: 'IN_PROGRESS'},
                    {label: 'Done', value: 'DONE'},
                ]
            }
        }
    ];

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
                    key: 'title',
                    type: 'input',
                    className: 'field col-4',
                    props: {
                        label: 'Title',
                    }
                },
                {
                    key: 'project_id',
                    type: 'select-extra',
                    className: 'field col-4',
                    props: {
                        label: 'Project',
                        apiEndpoint: 'api/v1/projects',
                        params: {
                            page: 0,
                            size: 10000,
                            sort: 'id,desc'
                        },
                        optionLabel: 'name',
                        optionValue: 'id'
                    }
                },
                {
                    key: 'assigned_to',
                    type: 'select-extra',
                    className: 'field col-4',
                    props: {
                        label: 'Assigned To',
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
                    key: 'status',
                    type: 'select',
                    className: 'field col-4',
                    props: {
                        label: 'Status',
                        required: true,
                        options: [
                            {label: 'To do', value: 'TO_DO'},
                            {label: 'In Progress', value: 'IN_PROGRESS'},
                            {label: 'Done', value: 'DONE'},
                        ]
                    }
                },
            ]
        }
    ]
}
