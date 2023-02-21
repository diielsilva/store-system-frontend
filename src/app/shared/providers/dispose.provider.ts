import { Injectable } from "@angular/core";
import { Subscription } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class DisposeProvider {
    private subscriptions$: Subscription[] = [];

    public insert(subscription$: Subscription): void {
        this.subscriptions$.push(subscription$);
    }

    public dispose(): void {
        for (let subscription$ of this.subscriptions$) {
            subscription$.unsubscribe();
        }
        this.subscriptions$ = [];
    }
}