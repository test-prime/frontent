import {HttpClient, HttpResponse} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {ApplicationConfigService} from "./application-config.service";
import {createRequestOption} from "../util/request";


export type EntityResponseType<T> = HttpResponse<T>;
export type EntityArrayResponseType<T> = HttpResponse<T[]>;

@Injectable({providedIn: 'root'})
export class DataService<T> {
    private httpClient = inject(HttpClient);
    private applicationConfigService = inject(ApplicationConfigService);

    create(entity: T, apiEndpoint: string, microservice?: string): Observable<EntityResponseType<T>> {
        const resourceUrl = this.applicationConfigService.getEndpointFor(apiEndpoint, microservice);
        return this.httpClient.post<T>(resourceUrl, entity, {observe: 'response'});
    }

    update(entity: T, apiEndpoint: string, microservice?: string): Observable<EntityResponseType<T>> {
        const resourceUrl = this.applicationConfigService.getEndpointFor(apiEndpoint, microservice);
        return this.httpClient.put<T>(resourceUrl, entity, {observe: 'response'});
    }

    findById(id: string | number, apiEndpoint: string, microservice?: string): Observable<EntityResponseType<T>> {
        const resourceUrl = `${this.applicationConfigService.getEndpointFor(apiEndpoint, microservice)}/${id}`;
        return this.httpClient.get<T>(resourceUrl, {observe: 'response'});
    }

    findAll(req: {
        [key: string]: unknown
    }, apiEndpoint: string, microservice?: string): Observable<EntityArrayResponseType<T>> {
        const resourceUrl = this.applicationConfigService.getEndpointFor(apiEndpoint, microservice);
        const options = createRequestOption(req);
        return this.httpClient.get<T[]>(resourceUrl, {params: options, observe: 'response'});
    }

    deleteById(id: string | number, apiEndpoint: string, microservice?: string): Observable<EntityResponseType<T>> {
        const resourceUrl = this.applicationConfigService.getEndpointFor(apiEndpoint, microservice);
        return this.httpClient.delete<T>(`${resourceUrl}/${id}`, {observe: 'response'});
    }
}
