import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class LoadingProvider {
    loading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    public displayLoading(): void {
        this.loading.next(true);
    }

    public hideLoading(): void {
        this.loading.next(false);
    }
}