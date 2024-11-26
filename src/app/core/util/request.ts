import {HttpParams} from '@angular/common/http';
import {forEach} from 'lodash';

export const createRequestOption = (req?: any): HttpParams => {
    let options: HttpParams = new HttpParams();

    if (req) {
        Object.keys(req).forEach(key => {
            if (Array.isArray(req[key])) {
                forEach(req[key], (val: string) => {
                    options = options.append(key, val);
                });
            } else {
                options = options.set(key, req[key]);
            }
        });
    }

    return options;
};
