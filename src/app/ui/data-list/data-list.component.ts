import {ChangeDetectionStrategy, Component, inject, Input, OnInit, signal} from "@angular/core";
import {MessageService} from "primeng/api";
import {Table, TableModule} from "primeng/table";
import {DataService} from "../../core/service/data.service";
import {combineLatest, forkJoin, Subject} from "rxjs";
import {FormGroup} from "@angular/forms";
import {FormlyFieldConfig, FormlyFormOptions, FormlyModule} from "@ngx-formly/core";
import {ActivatedRoute, Router} from "@angular/router";
import {ASC, DESC, ITEMS_PER_PAGE, SORT} from "../../core/constant/pagination.constant";
import {HttpHeaders} from "@angular/common/http";
import {takeUntil} from "rxjs/operators";
import {get, isObject} from "lodash";
import {DialogModule} from "primeng/dialog";
import {ButtonModule} from "primeng/button";
import {RippleModule} from "primeng/ripple";
import {ToastModule} from "primeng/toast";
import {ToolbarModule} from "primeng/toolbar";
import {FileUploadModule} from "primeng/fileupload";
import {InputTextModule} from "primeng/inputtext";
import {_FormlyModule} from "../formly/formly.module";
import {CardModule} from "primeng/card";
import {PaginatorModule} from "primeng/paginator";
import {HasAnyRolesDirective} from "../../core/directive/has-any-roles.directive";

interface Option {
    label: string;
    value: string;
}

export interface Column {
    property: string;
    label: string;
    options?: Option[];
}

@Component({
    selector: 'app-data-list',
    templateUrl: './data-list.component.html',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        DialogModule,
        ButtonModule,
        RippleModule,
        FormlyModule,
        ToastModule,
        ToolbarModule,
        FileUploadModule,
        TableModule,
        InputTextModule,
        _FormlyModule,
        CardModule,
        PaginatorModule,
        HasAnyRolesDirective,

    ],
    providers: [MessageService]
})
export class DataListComponentComponent implements OnInit {
    @Input() apiEndpoint: string;
    @Input() microservice?: string;
    @Input() title?: string;
    @Input() columns: Column[];
    @Input() itemsPerPage: number = ITEMS_PER_PAGE;
    @Input() form: FormGroup;
    @Input() model = {};
    @Input() fields: FormlyFieldConfig[] = [];
    @Input() options: FormlyFormOptions;
    @Input() filterForm: FormGroup;
    @Input() filterModel = {};
    @Input() filterFields: FormlyFieldConfig[] = [];
    @Input() filterOptions: FormlyFormOptions;
    @Input() queryParams = <{ [key: string]: unknown }>{};

    entities = signal<unknown[]>([]);
    totalItems = signal(0);
    isLoading = signal(false);
    predicate: string[] = [];
    ascending: boolean[] = [];
    page = 0;

    submitted: boolean = false;


    statuses: any[] = [];

    rowsPerPageOptions = [5, 10, 20];

    entityDialog: boolean = false;
    deleteEntityDialog: boolean = false;
    deleteEntitiesDialog: boolean = false;

    private messageService = inject(MessageService);
    private dataService = inject(DataService);
    private activatedRoute = inject(ActivatedRoute);
    private router = inject(Router);

    private destroyed$ = new Subject();

    ngOnInit() {
        this.handleNavigation();
    }

    openNew() {
        this.model = {};
        this.submitted = false;
        this.entityDialog = true;
    }

    edit(entity: unknown) {
        this.entityDialog = true;
        this.isLoading.set(true);
        this.dataService.findById(entity['id'], this.apiEndpoint, this.microservice).pipe(takeUntil(this.destroyed$)).subscribe({
            next: (res) => {
                this.model = res.body ?? {};
                this.isLoading.set(false);
            },
            error: err => {
                this.isLoading.set(false);
                this.messageService.add({severity: 'danger', summary: 'Failed', detail: 'Entity Loaded', life: 3000});
            }
        });
    }

    delete(entity: unknown) {
        this.model = entity;
        this.deleteEntityDialog = true;
    }

    confirmDelete() {
        this.deleteEntityDialog = false;
        this.dataService.deleteById(this.model['id'], this.apiEndpoint, this.microservice).subscribe({
            next: () => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Entity Deleted',
                    life: 3000
                });
                this.model = {};
                this.loadAll();
            },
            error: (err) => {
                console.log('failed', this.apiEndpoint, this.microservice, err);
                this.messageService.add({severity: 'danger', summary: 'Failed', detail: 'Entity Deleted', life: 3000});
            }
        });
    }

    hideDialog() {
        this.entityDialog = false;
        this.submitted = false;
    }

    save() {
        this.submitted = true;
        if (this.model['id']) {
            this.dataService.update(this.model, this.apiEndpoint, this.microservice).subscribe({
                next: () => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Successful',
                        detail: 'Entity Updated',
                        life: 3000
                    });
                    this.entityDialog = false;
                    this.model = {};
                    this.loadAll();
                },
                error: (err) => {
                    console.log('failed', this.apiEndpoint, this.microservice, err);
                    this.messageService.add({
                        severity: 'danger',
                        summary: 'Failed',
                        detail: 'Entity Updated',
                        life: 3000
                    });
                }
            });
        } else {
            this.dataService.create(this.model, this.apiEndpoint, this.microservice).subscribe({
                next: () => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Successful',
                        detail: 'Entity Created',
                        life: 3000
                    });
                    this.entityDialog = false;
                    this.model = {};
                    this.loadAll();
                },
                error: (err) => {
                    console.log('failed', this.apiEndpoint, this.microservice, err);
                    this.messageService.add({
                        severity: 'danger',
                        summary: 'Failed',
                        detail: 'Entity Created',
                        life: 3000
                    });
                }
            });
        }
    }

    render(row: any, property: string) {
        const column = this.columns.find(e => e.property === property);
        if (column.options) {
            return column.options.find(e => e.value === get(row, property))?.label;
        }
        return get(row, property);
    }

    handleNavigation(): void {
        combineLatest([this.activatedRoute.data, this.activatedRoute.queryParamMap]).subscribe(([data, params]) => {
            const page = params.get('page');
            this.page = +(page ?? 1);
            const sort = (params.getAll(SORT) ?? data['defaultSort']) ?? ['id,desc'];
            this.predicate = sort.map((e: string) => e.split(',')[0]);
            this.ascending = sort.map((e: string) => e.split(',')[1] === ASC);
            if (this.filterModel) {
                params.keys
                    .filter(key => key !== 'page' && key !== 'size' && key !== 'sort')
                    .forEach(key => {
                        this.filterModel[key] = params.get(key);
                    });
            }
            this.loadAll();
        });
    }

    loadAll(force?: boolean): void {
        this.isLoading.set(true);
        if (force) {
            this.page = 1;
        }
        const query = <{ [key: string]: any }>{
            page: this.page - 1,
            size: this.itemsPerPage,
            sort: this.sort()
        };
        if (this.filterModel && Object.keys(this.filterModel).length > 0) {
            const flattenSearchModel = this.flatKeysOfObject(this.filterModel);
            Object.keys(flattenSearchModel).forEach(key => {
                if (typeof flattenSearchModel[key] === 'string') {
                    const config = this.filterFields.flatMap(e => e.fieldGroup).find(e => e!.key === key);
                    if (config && config.type?.toString().includes('input')) {
                        query[key] = `contains(${flattenSearchModel[key]})`;
                    } else {
                        query[key] = flattenSearchModel[key];
                    }
                } else {
                    query[key] = flattenSearchModel[key];
                }
            });
        }
        if (this.queryParams && Object.keys(this.queryParams).length > 0) {
            Object.keys(this.queryParams).forEach(key => {
                query[key] = this.queryParams[key];
            });
        }
        this.dataService
            .findAll(query, this.apiEndpoint, this.microservice)
            .pipe(takeUntil(this.destroyed$))
            .subscribe({
                next: (res) => {
                    console.log('ok', this.apiEndpoint, this.microservice, res.body ?? []);
                    this.onSuccess(res.body ?? [], res.headers);
                },
                error: err => {
                    this.isLoading.set(false);
                    console.log('failed', this.apiEndpoint, this.microservice, err);
                }
            });
    }

    private onSuccess(items: unknown[], headers: HttpHeaders): void {
        this.totalItems.set(Number(headers.get('X-Total-Count')) ?? 0);
        this.entities.set(items);
        this.isLoading.set(false);
    }

    private sort(): string[] {
        if (this.predicate.length == 0 && this.ascending.length == 0) {
            return ['id,desc'];
        }
        return this.predicate.map((e, i) => `${e},${this.ascending[i] ? ASC : DESC}`);
    }

    private flatKeysOfObject(obj: any) {
        const flattenObj: any = {};
        const flatten = (obj: any, prefixKey?: string) =>
            Object.keys(obj).forEach(key => {
                if (
                    isObject(obj[`${prefixKey ? `${prefixKey}.` : ''}${key}`]) &&
                    !Array.isArray(obj[`${prefixKey ? `${prefixKey}.` : ''}${key}`])
                ) {
                    flatten(obj[`${prefixKey ? `${prefixKey}.` : ''}${key}`], `${prefixKey ? `${prefixKey}.` : ''}${key}`);
                } else {
                    flattenObj[`${prefixKey ? `${prefixKey}.` : ''}${key}`] = obj[`${key}`];
                }
            });
        flatten(obj);
        return flattenObj;
    }

    refresh() {
        const url = this.router.routerState.snapshot.url.split('?')[0];
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            this.router.navigate([url]);
        });
    }

    protected readonly get = get;
}
