import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {MenuchangeeventModel} from '../model/menuchangeevent.model';

@Injectable({
    providedIn: 'root'
})
export class MenuService {

    private menuSource = new Subject<MenuchangeeventModel>();
    private resetSource = new Subject();

    menuSource$ = this.menuSource.asObservable();
    resetSource$ = this.resetSource.asObservable();

    onMenuStateChange(event: MenuchangeeventModel) {
        this.menuSource.next(event);
    }

    reset() {
        this.resetSource.next(true);
    }
}
